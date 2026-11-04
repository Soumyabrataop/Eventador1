/**
 * Research tab endpoints (Task 7): exercises the Worker's
 * GET /api/research/stats and GET /api/research/event?id= handlers against a
 * seeded in-memory SQLite database (via a fake D1 binding).
 *
 * Validates: Requirements 6.5, 7.4
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { DatabaseSync } from "node:sqlite";
import { migrate, openDatabase } from "../src/db/sqlite.js";
import type { D1Like } from "../src/db/d1Store.js";
import worker, { type Env } from "../src/worker.js";

const NOW = "2026-10-01T12:00:00.000Z";

/** Minimal in-memory D1 binding backed by node:sqlite (test-only, matches store.test.ts). */
function createFakeD1(db: DatabaseSync): D1Like {
  return {
    prepare: (query: string) => ({
      bind: (...params: unknown[]) => {
        const args = params as never[];
        return {
          first: async <T,>(): Promise<T | null> =>
            (db.prepare(query).get(...args) as T | undefined) ?? null,
          all: async <T,>(): Promise<{ results: T[] }> => ({
            results: db.prepare(query).all(...args) as T[],
          }),
          run: async () => {
            const info = db.prepare(query).run(...args);
            return {
              success: true,
              meta: {
                changes: Number(info.changes ?? 0),
                last_row_id: (info.lastInsertRowid as number | null) ?? null,
              },
            };
          },
        };
      },
    }),
  };
}

/**
 * Seed a published event with one row in each related table, plus a few other
 * events across statuses so the stats aggregate has something to count.
 * Returns the fake D1 binding (db kept alive via closure for the caller to close).
 */
function seed(db: DatabaseSync): void {
  // Published event (in the public allowlist via status PUBLISHED).
  db.prepare(
    `INSERT INTO events(event_id,title,normalized_title,format,event_type,is_free,city,country,
        status,verification_decision,verification_score,source_trust_score,publishing_tier,
        first_seen,last_seen,last_verified,last_link_check)
     VALUES ('pub-1','AI Hackathon','ai hackathon','ONLINE','HACKATHON',1,'Pune','IN',
        'PUBLISHED','VERIFIED_OFFICIAL',92,88,'TIER_1',?,?,?,?)`,
  ).run(NOW, NOW, NOW, NOW);

  // Other events to populate the status breakdown counts.
  db.prepare(
    `INSERT INTO events(event_id,title,normalized_title,format,status,verification_score,first_seen,last_seen)
     VALUES ('dis-1','Discovered','discovered','ONLINE','DISCOVERED',0,?,?)`,
  ).run(NOW, NOW);
  db.prepare(
    `INSERT INTO events(event_id,title,normalized_title,format,status,verification_score,first_seen,last_seen)
     VALUES ('ver-1','Verified Only','verified only','ONLINE','VERIFIED',80,?,?)`,
  ).run(NOW, NOW);
  db.prepare(
    `INSERT INTO events(event_id,title,normalized_title,format,status,verification_score,first_seen,last_seen)
     VALUES ('rej-1','Rejected','rejected','ONLINE','REJECTED',10,?,?)`,
  ).run(NOW, NOW);
  db.prepare(
    `INSERT INTO events(event_id,title,normalized_title,format,status,verification_score,first_seen,last_seen)
     VALUES ('sus-1','Suspicious','suspicious','ONLINE','SUSPICIOUS',20,?,?)`,
  ).run(NOW, NOW);
  db.prepare(
    `INSERT INTO events(event_id,title,normalized_title,format,status,verification_score,first_seen,last_seen)
     VALUES ('nr-1','Needs Review','needs review','ONLINE','NEEDS_REVIEW',40,?,?)`,
  ).run(NOW, NOW);

  // Evidence for the published event.
  db.prepare(
    `INSERT INTO verification_evidence(event_id,source_url,evidence_type,evidence_text,observed_at,source_trust,supports_claim)
     VALUES ('pub-1','https://org.example/ai','OFFICIAL_PAGE','Listed on official site',?,90,1)`,
  ).run(NOW);

  // Links: one healthy, one broken (UNREACHABLE) so broken_links counts it.
  db.prepare(
    `INSERT INTO event_links(event_id,url_type,original_url,final_url,domain,is_https,redirect_count,
        domain_relationship,security_status,verification_status)
     VALUES ('pub-1','EVENT_PAGE','https://org.example/ai','https://org.example/ai','org.example',1,0,
        'SAME_DOMAIN','CLEAR_LOCAL_CHECKS','VERIFIED')`,
  ).run();
  db.prepare(
    `INSERT INTO event_links(event_id,url_type,original_url,final_url,domain,is_https,redirect_count,
        domain_relationship,security_status,verification_status)
     VALUES ('pub-1','REGISTRATION','https://reg.example/ai','https://reg.example/ai','reg.example',1,0,
        'THIRD_PARTY','UNREACHABLE','UNVERIFIED')`,
  ).run();

  // Source (L1) for the published event.
  db.prepare(
    `INSERT INTO event_sources(event_id,source_id,source_url,source_level,observed_at)
     VALUES ('pub-1','s1','https://org.example/ai',1,?)`,
  ).run(NOW);

  // Change timeline entry.
  db.prepare(
    `INSERT INTO event_changes(event_id,field,old_value,new_value,detected_at)
     VALUES ('pub-1','start_date','2026-12-01','2026-12-02',?)`,
  ).run(NOW);

  // A link on a non-public event to make sure the broken count is table-wide
  // and the per-event query still isolates by event_id.
  db.prepare(
    `INSERT INTO event_links(event_id,url_type,original_url,final_url,domain,is_https,redirect_count,
        domain_relationship,security_status,verification_status)
     VALUES ('rej-1','EVENT_PAGE','https://bad.example/x','https://bad.example/x','bad.example',0,0,
        'UNKNOWN','FLAGGED','UNVERIFIED')`,
  ).run();
}

describe("research tab endpoints (Task 7)", () => {
  it("GET /api/research/stats returns the aggregated metrics shape", async () => {
    const db = openDatabase(":memory:");
    migrate(db);
    seed(db);
    const env = { DB: createFakeD1(db) } as Env;

    const res = await worker.fetch(new Request("https://x.example/api/research/stats"), env);
    assert.equal(res.status, 200);
    const body = (await res.json()) as {
      ok: boolean;
      metrics: {
        discovered: number; verified: number; published: number; rejected: number;
        suspicious: number; needs_review: number; broken_links: number;
      };
    };

    assert.equal(body.ok, true);
    // Exact metric keys present (shape assertion).
    assert.deepEqual(Object.keys(body.metrics).sort(), [
      "broken_links", "discovered", "needs_review", "published", "rejected", "suspicious", "verified",
    ]);
    // Values reflect the seeded rows.
    assert.equal(body.metrics.discovered, 1);
    assert.equal(body.metrics.verified, 1);
    assert.equal(body.metrics.published, 1);
    assert.equal(body.metrics.rejected, 1);
    assert.equal(body.metrics.suspicious, 1);
    assert.equal(body.metrics.needs_review, 1);
    // One UNREACHABLE (pub-1) + one FLAGGED (rej-1) = 2 broken links table-wide.
    assert.equal(body.metrics.broken_links, 2);

    db.close();
  });

  it("GET /api/research/event returns the per-event response shape for a public event", async () => {
    const db = openDatabase(":memory:");
    migrate(db);
    seed(db);
    const env = { DB: createFakeD1(db) } as Env;

    const res = await worker.fetch(new Request("https://x.example/api/research/event?id=pub-1"), env);
    assert.equal(res.status, 200);
    const body = (await res.json()) as {
      ok: boolean;
      event: { event_id: string; status: string; verification_decision: string } | null;
      evidence: unknown[];
      links: unknown[];
      sources: unknown[];
      changes: unknown[];
    };

    assert.equal(body.ok, true);
    // Top-level response shape.
    assert.deepEqual(Object.keys(body).sort(), [
      "changes", "event", "evidence", "links", "ok", "sources",
    ]);
    // Event is the one we seeded and is public.
    assert.equal(body.event?.event_id, "pub-1");
    assert.equal(body.event?.status, "PUBLISHED");
    assert.equal(body.event?.verification_decision, "VERIFIED_OFFICIAL");
    // Related collections are arrays scoped to this event.
    assert.ok(Array.isArray(body.evidence) && body.evidence.length === 1);
    assert.ok(Array.isArray(body.links) && body.links.length === 2);
    assert.ok(Array.isArray(body.sources) && body.sources.length === 1);
    assert.ok(Array.isArray(body.changes) && body.changes.length === 1);

    db.close();
  });

  it("GET /api/research/event returns 400 when id is missing", async () => {
    const db = openDatabase(":memory:");
    migrate(db);
    seed(db);
    const env = { DB: createFakeD1(db) } as Env;

    const res = await worker.fetch(new Request("https://x.example/api/research/event"), env);
    assert.equal(res.status, 400);
    const body = (await res.json()) as { ok: boolean; error: string };
    assert.equal(body.ok, false);
    assert.equal(body.error, "MISSING_ID");

    db.close();
  });

  it("GET /api/research/event returns 404 for a REJECTED event id", async () => {
    const db = openDatabase(":memory:");
    migrate(db);
    seed(db);
    const env = { DB: createFakeD1(db) } as Env;

    const res = await worker.fetch(new Request("https://x.example/api/research/event?id=rej-1"), env);
    assert.equal(res.status, 404);
    const body = (await res.json()) as { ok: boolean; error: string };
    assert.equal(body.ok, false);
    assert.equal(body.error, "NOT_FOUND");

    db.close();
  });

  it("GET /api/research/event returns 404 for a NEEDS_REVIEW event id", async () => {
    const db = openDatabase(":memory:");
    migrate(db);
    seed(db);
    const env = { DB: createFakeD1(db) } as Env;

    const res = await worker.fetch(new Request("https://x.example/api/research/event?id=nr-1"), env);
    assert.equal(res.status, 404);
    const body = (await res.json()) as { ok: boolean; error: string };
    assert.equal(body.ok, false);
    assert.equal(body.error, "NOT_FOUND");

    db.close();
  });
});
