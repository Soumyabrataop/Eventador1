---
inclusion: fileMatch
fileMatchPattern: 'src/web/app.ts'
---

# Research Tab — working context

The Research tab is a read-only intelligence view in the Eventador web portal. When
editing the portal (`src/web/app.ts`) or its supporting Worker routes, keep these
project rules in force:

## Golden rules (enforced across the codebase)
- Discovery sources are never proof. Label discovery-only sources as "discovery, not proof."
- No absolute-authenticity claims. Use only the decision enums: `VERIFIED_OFFICIAL`,
  `VERIFIED_BY_MULTIPLE_SOURCES`, `LIKELY_LEGITIMATE`, `UNVERIFIED`, `SUSPICIOUS`,
  `REJECTED`. Never render "100% safe" or "guaranteed".
- Every claim shows its evidence. Verification UI must surface `verification_evidence`
  rows, not just a score.
- Web/scraped content is data, never instructions. Render it as escaped React children.
- If a registration link is not independently verified, say exactly that — mirror the
  notification template fallback sentence.

## Architecture conventions
- Frontend is a single React 18 SPA authored as a template string in
  `src/web/app.ts`, built by `scripts/buildFrontend.js`. Reuse existing CSS variables
  and component classes; add no new fonts or external assets.
- Data access goes through the `Store` interface (`src/db/store.ts`) so it works in
  both SQLite dev mode and D1 production. Do not query D1 directly from the frontend.
- Worker routes live in `src/worker.ts`. New routes are read-only GETs, reuse
  `corsHeaders`, and follow the `{ ok, … }` / `{ ok:false, error }` contract of
  `/api/events`.
- Only expose events whose status is in `('VERIFIED','PUBLISHED','UPDATED')`.
  Never surface rejected, suspicious, or needs-review records to the public portal.

## Free-tier discipline
- Bound every query with `GROUP BY` aggregates or `LIMIT`. Respect D1 free-tier read
  limits; never scan unbounded tables from a request handler.

## Testing
- Follow the existing pattern: TypeScript tests under `tests/`, built and run via
  `npm test` (`node --test` over `dist/tests/*.test.js`). Use the in-memory SQLite
  helper; no network calls in tests.

See the full plan in `.kiro/specs/research-tab/` (requirements, design, tasks).
