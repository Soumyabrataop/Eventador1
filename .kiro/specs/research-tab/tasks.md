# Research Tab — Implementation Plan

- [x] 1. Confirm the data model against the real schema
  - Read `src/db/schema.sql` and record the exact column names for `events`,
    `verification_evidence`, `event_links`, `event_sources`, and `event_changes`.
  - Note any columns referenced in the design that do not exist, and adjust the
    queries to use only columns that are present.
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 4.1, 4.2, 6.5_

- [x] 2. Add the research stats endpoint to the Worker
  - In `src/worker.ts`, add `GET /api/research/stats` before the 404 fallback.
  - Build a store with `createD1Store(env.DB)`, run bounded GROUP BY aggregates over
    `events.status` plus a broken-link count over `event_links`.
  - Return `{ ok:true, metrics:{…} }`; wrap in try/catch returning `{ ok:false, error }`
    with status 500; reuse `corsHeaders`.
  - _Requirements: 5.1, 5.2, 6.1, 6.3, 6.4, 7.3_

- [x] 3. Add the per-event research endpoint to the Worker
  - Add `GET /api/research/event?id=<event_id>` in `src/worker.ts`.
  - Validate `id` (400 if missing); verify the event exists with status in
    `('VERIFIED','PUBLISHED','UPDATED')` (404 otherwise) so unpublished/rejected rows
    never leak.
  - Fetch evidence, links, sources, and changes for the id, each with a `LIMIT`.
  - Return `{ ok:true, event, evidence, links, sources, changes }` with the same
    error/CORS contract as `/api/events`.
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 4.1, 4.2, 6.2, 6.3, 6.4, 6.5, 7.3_

- [x] 4. Add tab navigation to the SPA
  - In `src/web/app.ts`, add `tab` state initialized from `location.hash`, a
    `hashchange` listener, and two nav items ("Events", "Research") styled with the
    existing `.nav-btn` / active treatment.
  - Conditionally render the existing events content (`EventsView`) or the new
    `ResearchView`; hide the events filter panel when Research is active.
  - Keep `location.hash` in sync so `#research` is linkable and refresh-safe.
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 5. Build the ResearchView metrics panel
  - Create a `ResearchView` component that fetches `/api/research/stats` on mount and
    renders a `.stat-grid` of stat cards for discovered/verified/published/rejected/
    suspicious/needs-review/broken-links.
  - Render a clear empty state when `ok:false`; never fabricate numbers.
  - Add `.stat-grid` / `.stat-card` CSS reusing existing variables.
  - _Requirements: 5.1, 5.3, 7.1_

- [x] 6. Build the event inspector in ResearchView
  - Reuse the already-loaded `/api/events` list for selection (no double fetch); on
    selecting an event, fetch `/api/research/event?id=…`.
  - Render: verification block (decision badge + score + tier with a "no absolute
    claim" legend), evidence list, links table (with the exact unverified-registration
    fallback sentence), sources list (L1–L7 + trust, discovery labeled "discovery, not
    proof"), and a newest-first change timeline that flags conflicts instead of
    resolving them.
  - Render all dynamic values as escaped React children (scraped content is data).
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 7.1_

- [x] 7. Add tests
  - Add `tests/research.test.ts` (built to `dist/tests/research.test.js`) using the
    in-memory SQLite helper; seed one published event with evidence/links/sources/
    changes.
  - Assert the stats aggregation shape and the per-event response shape.
  - Add a negative test: a REJECTED or NEEDS_REVIEW event id returns 404.
  - _Requirements: 6.5, 7.4_

- [x] 8. Verify build and run the suite
  - Run `npm run build` (frontend build + tsc + asset copy) and fix any errors.
  - Run `npm test` and confirm the new research tests pass alongside the existing suites.
  - Confirm `npm run build:frontend` still emits the portal with the new tab.
  - _Requirements: 7.2, 7.4_
