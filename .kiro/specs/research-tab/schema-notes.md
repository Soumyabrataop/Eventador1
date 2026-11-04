# Research Tab — Schema Confirmation (Task 1)

Source of truth: `src/db/schema.sql` (schema v1), cross-checked against the enums in
`src/types.ts` and the pipeline writers in `src/verification/verifyDiscovered.ts`,
`src/quality/linkHealth.ts`, and `src/admin/ops.ts`.

This is a read-only confirmation task — **schema.sql was not changed**. Downstream
tasks 2, 3, and 7 MUST use the exact column names recorded below.

## Exact column names per table

### `events` (PK `event_id`)
```
event_id, title, normalized_title, organizer_id, organizer_name, description,
categories, format, event_type, is_free, price_detail, country, state, city,
city_original, venue, address, timezone, start_date, end_date,
registration_deadline, registration_status, event_url, registration_url,
registration_unverified_note, eligibility, team_size, prize, technologies,
status, verification_decision, verification_score, source_trust_score,
india_relevance_score, freshness_score, publishing_tier, dedupe_key,
first_seen, last_seen, last_verified, last_link_check
```
Design-relevant columns all present: `verification_decision`, `verification_score`,
`publishing_tier` (Req 2.1); freshness `first_seen`, `last_seen`, `last_verified`,
`last_link_check` (Req 4.2).

### `verification_evidence` (PK `evidence_id`)
```
evidence_id, event_id, source_url, evidence_type, evidence_text, observed_at,
source_trust, supports_claim
```
All columns the design lists exist (`evidence_type`, `evidence_text`, `source_url`,
`observed_at`, `supports_claim`). **Bonus column present:** `source_trust` (INTEGER)
— not mentioned in the design, available if wanted. Timestamp here IS `observed_at`
(unlike `event_changes`, see discrepancy #1).

### `event_links` (PK `link_id`)
```
link_id, event_id, url_type, original_url, canonical_url, final_url, domain,
is_https, redirect_count, redirect_chain, domain_relationship, provider_category,
security_status, verification_status, last_checked, first_seen
```
All design columns present: `url_type`, `domain_relationship`, `redirect_count`,
`is_https`, `security_status`. Note the raw URL column is `original_url` (plus
`canonical_url` / `final_url`); there is no plain `url` column.

### `event_sources` (PK `id`, AUTOINCREMENT)
```
id, event_id, source_id, source_url, source_level, observed_at
```
Has `source_level` (INTEGER, the L1–L7 level). **No per-source trust column** on this
table (see discrepancy #2).

### `event_changes` (PK `change_id`, AUTOINCREMENT)
```
change_id, event_id, field, old_value, new_value, detected_at
```
Timestamp column is `detected_at` — **not** `observed_at` (see discrepancy #1). There
is no `CHANGE_CONFLICT` / conflict-state column on this table (see discrepancy #3).

## Discrepancies vs. the design doc (apply these when writing queries)

1. **`event_changes` timestamp is `detected_at`, not `observed_at`.**
   - Design task 3 says `ORDER BY observed_at DESC` and requirements 4.1 mention
     `observed_at` for changes. The real column is **`detected_at`**.
   - Fix for tasks 3/6/7: the per-event query must be
     `SELECT change_id, field, old_value, new_value, detected_at FROM event_changes
     WHERE event_id = ? ORDER BY detected_at DESC LIMIT ?`.
   - (Note: `verification_evidence` and `event_sources` DO use `observed_at`; only
     `event_changes` differs.)

2. **No per-source trust score on `event_sources`.**
   - Req 3.1 / design "source trust score" per source: the table only has
     `source_level`. Per-source trust is NOT stored here — trust lives in
     `source_registry.trust_score` (and `source_reputation`), keyed by `source_id`.
   - Fix for tasks 3/6: select `source_level` from `event_sources`; if a trust score
     is desired, LEFT JOIN `source_registry` on `source_id` to read `trust_score`.
     Otherwise show only `source_level` and omit the trust number — do not invent one.
   - There is also no `is_discovery` flag column; the "discovery, not proof" label
     (Req 3.3) must be derived from `source_level` / source type, not a boolean column.

3. **Broken-link / conflict status literals in the design are wrong.**
   - Design stats query uses `WHERE security_status = 'LINK_REVIEW_REQUIRED'`. That
     string does **not** exist as a `security_status` value — it is only a prefix of
     `review_queue.reason` text written by `linkHealth.ts`.
   - Actual `LinkSecurityStatus` enum (`src/types.ts`): `PENDING`,
     `CLEAR_LOCAL_CHECKS`, `FLAGGED`, `MALICIOUS_REPUTATION`, `UNREACHABLE`.
   - "Broken link" for the stats count should be the problem states:
     `security_status IN ('FLAGGED','MALICIOUS_REPUTATION','UNREACHABLE')`
     (these are the values `linkHealth.ts` writes for host-change/unreachable links).
   - For Req 4.3 "CHANGE_CONFLICT": there is no such column on `event_changes`.
     Conflicts surface via `security_status='FLAGGED'` on links and
     `review_queue`/`security_flags` rows — the UI should flag from those signals,
     not from a non-existent change-conflict column.

## Enum values to use (authoritative, from `src/types.ts`)

- **Public status allowlist** (Req 6.5) — `VERIFIED`, `PUBLISHED`, `UPDATED` are all
  valid members of `EventStatus`; the allowlist `('VERIFIED','PUBLISHED','UPDATED')`
  is correct as written.
- **Stats status breakdown** — `events.status` values in use: `DISCOVERED`,
  `PROCESSING`, `VERIFIED`, `PUBLISHED`, `UPDATED`, `EXPIRED`, `CANCELLED`,
  `POSTPONED`, `SUSPICIOUS`, `REJECTED`, `NEEDS_REVIEW`. The design's stats keys map:
  `discovered`←`DISCOVERED`, `verified`←`VERIFIED`, `published`←`PUBLISHED`,
  `rejected`←`REJECTED`, `suspicious`←`SUSPICIOUS`, `needs_review`←`NEEDS_REVIEW`.
- **`verification_decision`** (Req 2.4 badges) — `VERIFIED_OFFICIAL`,
  `VERIFIED_BY_MULTIPLE_SOURCES`, `LIKELY_LEGITIMATE`, `UNVERIFIED`, `SUSPICIOUS`,
  `REJECTED`.

## Ready-to-use column lists for the endpoints (tasks 2 & 3)

- stats status breakdown: `SELECT status, COUNT(*) AS n FROM events GROUP BY status`
- broken links:
  `SELECT COUNT(*) AS broken FROM event_links
   WHERE security_status IN ('FLAGGED','MALICIOUS_REPUTATION','UNREACHABLE')`
- event existence/allowlist:
  `SELECT ... FROM events WHERE event_id = ? AND status IN ('VERIFIED','PUBLISHED','UPDATED')`
- evidence:
  `SELECT evidence_id, source_url, evidence_type, evidence_text, observed_at, source_trust, supports_claim
   FROM verification_evidence WHERE event_id = ? LIMIT ?`
- links:
  `SELECT link_id, url_type, original_url, final_url, domain, is_https, redirect_count, domain_relationship, security_status, verification_status
   FROM event_links WHERE event_id = ? LIMIT ?`
- sources:
  `SELECT id, source_id, source_url, source_level, observed_at
   FROM event_sources WHERE event_id = ? LIMIT ?`
- changes:
  `SELECT change_id, field, old_value, new_value, detected_at
   FROM event_changes WHERE event_id = ? ORDER BY detected_at DESC LIMIT ?`
