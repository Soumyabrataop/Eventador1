/**
 * Eventador 24/7 Background Daemon for Render / Koyeb / VPS / Linux VM.
 * Runs autonomous discovery, verification, and dispatch loop on a polite schedule.
 * Exposes a lightweight HTTP server on PORT so Render Web Services / Koyeb / UptimeRobot
 * can ping /health every 10 mins to keep the container alive 24/7.
 */
import http from "node:http";
import { migrate, openDatabase } from "../src/db/sqlite.js";
import { createSqliteStore } from "../src/db/sqliteStore.js";
import { runLoopStages } from "../src/scheduler/loop.js";
import { MVP_SOURCES, buildConnector } from "../src/sources/seeds.js";
import { providerFromEnv } from "../src/security/threatIntel.js";
import { loadTargets } from "../src/notify/dispatch.js";

const args = process.argv.slice(2);
const live = args.includes("--live");
const dryRun = !live;

const getArgNum = (flag: string, fallback: number): number => {
  const i = args.indexOf(flag);
  if (i < 0) return fallback;
  const n = Number(args[i + 1]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const intervalMins = getArgNum("--interval-mins", 60);
const verifyLimit = getArgNum("--verify-limit", 15);
const linkLimit = getArgNum("--link-limit", 50);

let lastCycleAt = new Date().toISOString();
let totalCycles = 0;
let lastSummary = { discovered: 0, verified: 0, dispatched: 0 };

// Built-in HTTP health server for Render / Koyeb keep-alive pings
const port = Number(process.env.PORT) || 3000;
const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "Eventador Crawler Daemon",
        status: "RUNNING",
        uptimeSeconds: Math.floor(process.uptime()),
        totalCycles,
        lastCycleAt,
        lastSummary,
        mode: live ? "LIVE" : "DRY-RUN",
      })
    );
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`[Eventador Daemon] Keep-alive HTTP server listening on port ${port}`);
  console.log(`[Eventador Daemon] Ready for keep-alive pings at http://localhost:${port}/health`);
});

let running = true;
const shutdown = () => {
  console.log("\n[Eventador Daemon] Received stop signal. Shutting down gracefully...");
  running = false;
  server.close();
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(`[Eventador Daemon] Starting 24/7 service...`);
console.log(`[Eventador Daemon] Mode: ${live ? "LIVE DISPATCH" : "DRY-RUN (Safe mode)"}`);
console.log(`[Eventador Daemon] Loop Interval: ~${intervalMins} minutes`);

const db = openDatabase();
migrate(db);
const store = createSqliteStore(db);

async function syncToCloudflare(): Promise<void> {
  const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
  const secret = process.env.SYNC_SECRET;
  if (!workerUrl || !secret) return;

  try {
    const verified = await store.query(
      `SELECT event_id,title,organizer_name,categories,format,city,venue,timezone,
              start_date,end_date,registration_deadline,registration_status,
              event_url,registration_url,event_type,is_free,price_detail,
              verification_decision,verification_score,publishing_tier,prize,status
       FROM events
       WHERE status IN ('VERIFIED','PUBLISHED','UPDATED')
       ORDER BY start_date ASC LIMIT 200`
    );

    if (verified.length === 0) return;

    const res = await fetch(`${workerUrl.replace(/\/$/, "")}/api/events/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sync-secret": secret,
      },
      body: JSON.stringify({ events: verified }),
    });

    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as { inserted?: number };
      console.log(`[Eventador Daemon] Synced ${data.inserted ?? verified.length} events to Cloudflare.`);
    } else {
      console.warn(`[Eventador Daemon] Cloudflare sync returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn(`[Eventador Daemon] Cloudflare sync non-fatal error:`, err instanceof Error ? err.message : err);
  }
}

async function runIteration(iteration: number): Promise<void> {
  const started = new Date().toISOString();
  console.log(`\n========================================================`);
  console.log(`[Eventador Daemon] Cycle #${iteration} started at ${started}`);
  console.log(`========================================================`);

  const targets = await loadTargets(store);
  const connectors = MVP_SOURCES.filter((s) => s.enabled).map((s) => buildConnector(s));

  const report = await runLoopStages(store, {
    connectors,
    targets,
    verifyLimit,
    linkLimit,
    dryRun,
    threatIntel: providerFromEnv(),
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? null,
    whatsapp: process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
      ? {
        token: process.env.WHATSAPP_TOKEN,
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
        templateName: process.env.WHATSAPP_TEMPLATE_NAME || undefined,
      }
      : null,
  });

  lastCycleAt = new Date().toISOString();
  totalCycles = iteration;
  lastSummary = {
    discovered: report.discovery?.totals.discovered ?? 0,
    verified: report.verification?.verified ?? 0,
    dispatched: report.notify?.sent ?? 0,
  };

  console.log(`[Eventador Daemon] Cycle #${iteration} complete:`);
  console.log(`  - Discovered: ${lastSummary.discovered}`);
  console.log(`  - Verified:   ${lastSummary.verified}`);
  console.log(`  - Dispatched: ${lastSummary.dispatched}`);

  // Auto-sync with Cloudflare Edge if configured
  await syncToCloudflare();
}

let cycle = 1;
while (running) {
  try {
    await runIteration(cycle++);
  } catch (err) {
    console.error(`[Eventador Daemon] Error in cycle #${cycle - 1}:`, err);
  }

  if (!running) break;

  // Polite delay with random jitter (± 5 minutes) to avoid repetitive timing fingerprints
  const jitterMs = (Math.random() * 10 - 5) * 60 * 1000;
  const sleepMs = Math.max(60000, intervalMins * 60 * 1000 + jitterMs);
  const nextRun = new Date(Date.now() + sleepMs).toLocaleTimeString();
  console.log(`[Eventador Daemon] Sleeping for ${(sleepMs / 60000).toFixed(1)} mins (next run around ${nextRun})...\n`);

  // Sleep in short chunks to respond quickly to SIGINT/SIGTERM
  const chunk = 2000;
  let elapsed = 0;
  while (running && elapsed < sleepMs) {
    await new Promise((r) => setTimeout(r, Math.min(chunk, sleepMs - elapsed)));
    elapsed += chunk;
  }
}

db.close();
console.log("[Eventador Daemon] Stopped cleanly.");
