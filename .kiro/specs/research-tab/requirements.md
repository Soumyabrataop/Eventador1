# Research Tab — Requirements

## Overview

Add a **Research** tab to the Eventador web portal (`src/web/app.ts`) that exposes
the intelligence Eventador already produces — verification evidence, source
provenance, change history, and quality metrics — in an auditable, read-only view.

The existing portal answers "what events are happening?" The Research tab answers
**"why should I trust this, and where did it come from?"** It surfaces the data the
verification pipeline (`src/verification/`) and quality engine (`src/quality/`)
already compute, honoring the project's golden rules: discovery sources are never
proof, no absolute-authenticity claims, and every decision carries evidence.

## Scope

- In scope: a new frontend tab, supporting read-only API endpoints, aggregation
  queries over existing tables.
- Out of scope: new discovery sources, changes to the verification scoring logic,
  write/admin operations (those live in the Telegram admin bot and `src/admin/ops.ts`).

## Requirements

### Requirement 1 — Navigation tab

**User story:** As a visitor, I want a Research tab in the top navigation so I can
switch between browsing events and inspecting the intelligence behind them.

#### Acceptance criteria
1. WHEN the portal loads THEN the navbar SHALL show tabs for "Events" (default) and "Research".
2. WHEN a user selects the Research tab THEN the view SHALL switch without a full page reload (client-side state, matching the existing React SPA).
3. WHEN the Research tab is active THEN the Events filter panel SHALL be hidden and Research content SHALL be shown.
4. The tab state SHALL be reflected in the URL hash (e.g. `#research`) so the view is linkable and survives refresh.

### Requirement 2 — Event verification detail

**User story:** As a visitor, I want to see why a specific event was verified so I
can judge its trustworthiness myself.

#### Acceptance criteria
1. WHEN a user opens an event's research detail THEN the system SHALL display its `verification_decision`, `verification_score`, and `publishing_tier` from the `events` table.
2. WHEN verification evidence exists THEN the system SHALL list rows from `verification_evidence` (evidence_type, evidence_text, source_url, observed_at, supports_claim).
3. WHEN the event has links THEN the system SHALL show `event_links` rows with url_type, domain_relationship, redirect_count, is_https, and security_status.
4. The system SHALL NOT render any "100% safe" or "guaranteed" language; it SHALL use only the defined decision enums (VERIFIED_OFFICIAL, VERIFIED_BY_MULTIPLE_SOURCES, LIKELY_LEGITIMATE, UNVERIFIED, SUSPICIOUS, REJECTED).
5. IF a registration link could not be independently verified THEN the UI SHALL state exactly that, consistent with the notification templates.

### Requirement 3 — Source transparency

**User story:** As a visitor, I want to see which sources an event came from and how
they rank in the source hierarchy, so the claim is auditable.

#### Acceptance criteria
1. WHEN an event detail is shown THEN the system SHALL list its `event_sources` with the source level (L1–L7) and source trust score.
2. WHEN multiple independent sources corroborate an event THEN the UI SHALL indicate cross-source corroboration count.
3. The system SHALL clearly label discovery-only sources as "discovery, not proof."

### Requirement 4 — Change & freshness history

**User story:** As a visitor, I want to see what changed about an event over time so I
can trust the data is current.

#### Acceptance criteria
1. WHEN an event has `event_changes` rows THEN the system SHALL display a timeline of field changes (field, old → new, observed_at).
2. The system SHALL display freshness signals (first_seen, last_seen, last_verified, last_link_check) when present.
3. WHEN a change is in CHANGE_CONFLICT state THEN the UI SHALL surface the conflict rather than picking a value.

### Requirement 5 — Aggregate quality metrics

**User story:** As a visitor or operator, I want portal-level quality stats so I can
gauge the health of the whole pipeline.

#### Acceptance criteria
1. The Research tab SHALL show aggregate counts: total discovered, verified, published, rejected, suspicious, needs-review, and broken-link counts (sourced from existing quality metrics in `src/quality/`).
2. The metrics SHALL be fetched from a dedicated read-only endpoint, not computed on the client from the full event list.
3. WHEN metrics are unavailable THEN the UI SHALL degrade gracefully with a clear empty state, never fabricated numbers.

### Requirement 6 — Read-only API

**User story:** As a developer, I want research data served by stable endpoints so the
frontend stays thin and the Worker stays within free-tier limits.

#### Acceptance criteria
1. The Worker (`src/worker.ts`) SHALL expose `GET /api/research/stats` returning aggregate metrics.
2. The Worker SHALL expose `GET /api/research/event/:id` (or `?id=`) returning an event's evidence, links, sources, and changes.
3. All research endpoints SHALL be read-only (GET), reuse the existing CORS headers, and require no authentication.
4. Endpoints SHALL return `{ ok: false, error }` with an appropriate status on failure, matching the existing `/api/events` contract.
5. Endpoints SHALL only return events with status in the already-public set (VERIFIED, PUBLISHED, UPDATED) to avoid leaking unpublished/rejected records.

### Requirement 7 — Non-functional & safety

#### Acceptance criteria
1. All displayed webpage/event content SHALL be treated as data and rendered as text (React escapes by default); no scraped content SHALL be interpreted as instructions (§31–§32).
2. The feature SHALL add no new secrets and SHALL work in the existing SQLite dev mode and D1 production mode via the `Store` interface (`src/db/store.ts`).
3. New queries SHALL be bounded (LIMIT) to respect D1 free-tier read limits.
4. The feature SHALL ship with tests following the existing `tests/*.test.js` pattern (build + `node --test`).
