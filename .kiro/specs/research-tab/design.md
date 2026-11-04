# Research Tab — Design

## Context

Eventador serves a React 18 SPA (via `renderWebPage()` in `src/web/app.ts`) and a
JSON API from the Cloudflare Worker (`src/worker.ts`). Data lives in D1 in production
and SQLite in dev, behind the `Store` interface (`src/db/store.ts`,
`src/db/d1Store.ts`, `src/db/sqliteStore.ts`). The verification pipeline already
writes to `events`, `event_sources`, `event_links`, `event_changes`, and
`verification_evidence` (see schema table list in `README.md` §39–§41). The Research
tab is a **read-only presentation layer** over this existing data.

## Architecture

```
Browser (React SPA)
  ├─ Tab state: "events" | "research"  (useState + URL hash)
  ├─ Events view   → GET /api/events            (existing)
  └─ Research view → GET /api/research/stats     (new)
                   → GET /api/research/event?id= (new, on demand)

Cloudflare Worker (src/worker.ts fetch handler)
  ├─ /api/research/stats       → aggregate queries (bounded)
  └─ /api/research/event?id=…   → joins evidence/links/sources/changes for one event
        │
        └─ Store interface (D1 in prod, SQLite in dev)
```

No new infrastructure, no new secrets. The Worker continues to redirect `/` to the
Pages deployment; the SPA source in `src/web/app.ts` is built by
`scripts/buildFrontend.js` (per `package.json`), so the tab lives in that same file.

## Frontend design (`src/web/app.ts`)

### Tab navigation
- Add `const [tab, setTab] = useState(() => location.hash === "#research" ? "research" : "events")`.
- Render two nav items in `.nav-actions` (or a dedicated `.nav-tabs` group) styled with the existing `.nav-btn` classes; the active tab gets an `active` modifier reusing the `.pill-btn.active` color treatment.
- On click, call `setTab(...)` and set `location.hash` so the view is linkable (Req 1.4). Add a `hashchange` listener to keep state in sync.
- Conditionally render `<EventsView />` (the current content) or `<ResearchView />`.

### ResearchView component
Composed of:
1. **Metrics panel** — fetches `/api/research/stats` once on mount; renders a grid of stat cards (reusing `.filter-box` / card styling) for discovered/verified/published/rejected/suspicious/needs-review/broken-link counts. Empty state when `ok:false` (Req 5.3).
2. **Event inspector** — a searchable list of public events (reuse the already-loaded `/api/events` data so we do not double-fetch). Selecting one calls `/api/research/event?id=…` and shows:
   - Verification block: decision badge, score, tier. Badge text maps 1:1 to the decision enum; a small legend clarifies that no claim is absolute (Req 2.4).
   - Evidence list: `verification_evidence` rows, each showing evidence_type, text, source_url (as a plain external link), observed_at, and a supports/contradicts indicator.
   - Links table: `event_links` with url_type, domain_relationship, HTTPS flag, redirect_count, security_status. Unverified registration shows the exact fallback sentence from the templates (Req 2.5).
   - Sources list: `event_sources` with level L1–L7 and trust score, with discovery-only sources labeled "discovery, not proof" (Req 3.3).
   - Change timeline: `event_changes` rendered newest-first; conflicts flagged, not resolved (Req 4.3).

All dynamic text is rendered as React children (auto-escaped) — scraped content is data (Req 7.1).

### Styling
Reuse the existing CSS variables and component classes (`.badge`, `.meta-list`,
`.event-card`, `.filter-box`). Add a `.stat-grid` / `.stat-card` and a
`.evidence-row` rule block; no new fonts or external assets.

## Backend design (`src/worker.ts`)

Add two routes inside the existing `fetch` handler, before the 404 fallback, each
constructing a store via `createD1Store(env.DB)` and returning `Response.json(...)`
with `corsHeaders`.

### `GET /api/research/stats`
Runs a small set of bounded aggregate queries, e.g.:
```sql
SELECT status, COUNT(*) AS n FROM events GROUP BY status;
SELECT COUNT(*) AS broken FROM event_links WHERE security_status = 'LINK_REVIEW_REQUIRED';
```
Returns:
```json
{ "ok": true, "metrics": { "discovered": 0, "verified": 0, "published": 0,
  "rejected": 0, "suspicious": 0, "needs_review": 0, "broken_links": 0 } }
```
Missing tables/columns are caught and reported as `ok:false` (Req 5.3). All counts
come from the DB — never fabricated.

### `GET /api/research/event?id=<event_id>`
1. Validate `id` is present; 400 otherwise.
2. Confirm the event exists AND its status is in `('VERIFIED','PUBLISHED','UPDATED')` — otherwise 404, so unpublished/rejected rows never leak (Req 6.5).
3. Fetch, each with a `LIMIT` (Req 7.3):
   - evidence from `verification_evidence WHERE event_id = ?`
   - links from `event_links WHERE event_id = ?`
   - sources from `event_sources WHERE event_id = ?`
   - changes from `event_changes WHERE event_id = ? ORDER BY observed_at DESC`
4. Return `{ ok: true, event, evidence, links, sources, changes }`.

Column names are taken from the schema described in `README.md` §40–§41 and
`src/db/schema.sql`; the implementer SHALL read `src/db/schema.sql` first and adjust
exact column names to match (see Tasks task 1).

### Error & CORS contract
Mirror `/api/events`: wrap in try/catch, return `{ ok:false, error }` with status 500
on failure and reuse `corsHeaders` plus the `OPTIONS` preflight already handled.

## Data model (read-only, existing tables)

| Table | Used for |
|---|---|
| `events` | decision, score, tier, freshness timestamps |
| `verification_evidence` | the audit trail (Req 2.2) |
| `event_links` | link safety + domain relationship (Req 2.3) |
| `event_sources` | provenance + source level/trust (Req 3) |
| `event_changes` | change timeline + conflicts (Req 4) |

No migrations required. If a needed column is absent in `schema.sql`, prefer
selecting only existing columns over adding schema changes in this feature.

## Testing strategy

- `tests/research.test.js` (built from TS per existing pattern): seed an in-memory
  SQLite store (`memoryStore` helper referenced in `src/db/sqliteStore.ts`) with one
  published event plus evidence/links/sources/changes, then assert the stats
  aggregation and the per-event shape.
- Negative test: requesting a REJECTED/NEEDS_REVIEW event id returns 404 (Req 6.5).
- Keep assertions deterministic; no network calls (consistent with the project's
  offline-test philosophy).

## Risks & mitigations

- **Schema drift** — column names guessed wrong. Mitigation: read `src/db/schema.sql`
  before writing queries (task 1).
- **Free-tier reads** — unbounded scans. Mitigation: GROUP BY aggregates + LIMITs.
- **Leaking unpublished data** — Mitigation: status allowlist on the event endpoint.
- **Frontend build** — tab lives in the single `app.ts` string template; verify
  `npm run build:frontend` still succeeds after edits.
