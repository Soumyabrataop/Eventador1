/**
 * Sync verified events from local SQLite database to Cloudflare Edge D1.
 * Usage: npm run sync
 */
import { openDatabase } from "../src/db/sqlite.js";
import { createSqliteStore } from "../src/db/sqliteStore.js";

const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
const secret = process.env.SYNC_SECRET;

if (!workerUrl || !secret) {
  console.error("Missing required environment variables:");
  console.error("  CLOUDFLARE_WORKER_URL (e.g. https://eventador.workers.dev)");
  console.error("  SYNC_SECRET");
  process.exit(1);
}

const db = openDatabase();
const store = createSqliteStore(db);

try {
  const events = await store.query(
    `SELECT event_id,title,organizer_name,categories,format,city,venue,timezone,
            start_date,end_date,registration_deadline,registration_status,
            event_url,registration_url,event_type,is_free,price_detail,
            verification_decision,verification_score,publishing_tier,prize,status
     FROM events
     WHERE status IN ('VERIFIED','PUBLISHED','UPDATED')
     ORDER BY start_date ASC LIMIT 500`
  );

  console.log(`Found ${events.length} verified events to sync.`);

  if (events.length === 0) {
    console.log("No verified events found in local database.");
    process.exit(0);
  }

  const endpoint = `${workerUrl.replace(/\/$/, "")}/api/events/ingest`;
  console.log(`Posting to ${endpoint}...`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-sync-secret": secret,
    },
    body: JSON.stringify({ events }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Sync failed (HTTP ${res.status}): ${errText}`);
    process.exit(1);
  }

  const result = (await res.json()) as { ok: boolean; inserted?: number };
  console.log(`Successfully synced ${result.inserted ?? events.length} events to Cloudflare!`);
} catch (err) {
  console.error("Sync error:", err);
  process.exit(1);
} finally {
  db.close();
}

