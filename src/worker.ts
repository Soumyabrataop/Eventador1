/**
 * Cloudflare Worker entrypoint (Phase 8). Serves:
 * - / : Interactive Eventador Web Portal & Discovery Frontend
 * - /api/events : Filterable JSON API for tech events, meetups & hackathons
 * - /health : Health check
 * - /telegram-webhook : Admin bot webhook
 * - Cron triggers run the runLoopStages automation pipeline backed by D1.
 */

import { createD1Store, type D1Like } from "./db/d1Store.js";
import { loadTargets as loadStoredTargets } from "./notify/dispatch.js";
import { runLoopStages } from "./scheduler/loop.js";
import { MVP_SOURCES, buildConnector } from "./sources/seeds.js";
import { providerFromEnv } from "./security/threatIntel.js";
import type { ChannelTarget } from "./notify/dispatch.js";

export interface Env {
  DB: D1Like;
  DRY_RUN?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHANNEL_ID?: string;
  TELEGRAM_ADMIN_CHAT_ID?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
  DISCORD_WEBHOOK_URL?: string;
  WHATSAPP_TOKEN?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_TEMPLATE_NAME?: string;
  WHATSAPP_TO_NUMBER?: string;
  VERIFY_LIMIT?: string;
  LINK_LIMIT?: string;
  SYNC_SECRET?: string;
}

const MAINTENANCE_CRON = "0 2 * * *";

/** Constant-time string comparison for webhook secrets. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function loadTargets(env: Env): Promise<ChannelTarget[]> {
  const store = createD1Store(env.DB);
  // Targets are configured via vars (no local CLI in Workers).
  if (env.TELEGRAM_CHANNEL_ID) {
    await store.exec(
      "INSERT OR IGNORE INTO notification_targets(target_id,channel,destination,enabled) VALUES (?,?,?,1)",
      "telegram:channel",
      "TELEGRAM",
      env.TELEGRAM_CHANNEL_ID,
    );
  }
  if (env.DISCORD_WEBHOOK_URL) {
    await store.exec(
      "INSERT OR IGNORE INTO notification_targets(target_id,channel,destination,enabled) VALUES (?,?,?,1)",
      "discord:webhook",
      "DISCORD",
      env.DISCORD_WEBHOOK_URL,
    );
  }
  if (env.WHATSAPP_TO_NUMBER && env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID) {
    await store.exec(
      "INSERT OR IGNORE INTO notification_targets(target_id,channel,destination,enabled) VALUES (?,?,?,1)",
      "whatsapp:owner",
      "WHATSAPP",
      env.WHATSAPP_TO_NUMBER,
    );
  }
  return loadStoredTargets(store);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-sync-secret",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Health check
    if (url.pathname === "/health") {
      return Response.json({ ok: true, name: "Eventador API", phase: 8, dryRun: env.DRY_RUN ?? "true" }, { headers: corsHeaders });
    }

    // 2. Web Portal Redirect (Static UI hosted on Cloudflare Pages to preserve Worker limits)
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return Response.redirect("https://eventadorapp.pages.dev/", 302);
    }

    // 3. Filterable Events API
    if (url.pathname === "/api/events") {
      try {
        const store = createD1Store(env.DB);
        const format = url.searchParams.get("format");
        const type = url.searchParams.get("type");
        const isFree = url.searchParams.get("is_free");
        const city = url.searchParams.get("city");
        const country = url.searchParams.get("country");
        const search = url.searchParams.get("search");

        let sql = `SELECT event_id,title,organizer_name,categories,format,city,country,venue,timezone,
                          start_date,end_date,registration_deadline,registration_status,
                          event_url,registration_url,event_type,is_free,price_detail,
                          verification_decision,verification_score,publishing_tier,prize
                   FROM events
                   WHERE status IN ('VERIFIED','PUBLISHED','UPDATED')`;
        const params: unknown[] = [];

        if (format && format !== "ALL") {
          sql += " AND format = ?";
          params.push(format);
        }
        if (type && type !== "ALL") {
          sql += " AND event_type = ?";
          params.push(type);
        }
        if (isFree !== null && isFree !== "ALL") {
          sql += " AND is_free = ?";
          params.push(Number(isFree));
        }
        if (country && country !== "ALL") {
          sql += " AND country = ?";
          params.push(country);
        }
        if (city && city !== "ALL") {
          sql += " AND (city LIKE ? OR city_original LIKE ?)";
          params.push(`%${city}%`, `%${city}%`);
        }
        if (search) {
          sql += " AND (title LIKE ? OR description LIKE ? OR organizer_name LIKE ?)";
          params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        sql += " ORDER BY start_date ASC LIMIT 100";
        const events = await store.query(sql, ...params);
        return Response.json({ ok: true, count: events.length, events }, { headers: corsHeaders });
      } catch (e) {
        return Response.json({ ok: false, error: e instanceof Error ? e.message : "QUERY_FAILED" }, { status: 500, headers: corsHeaders });
      }
    }

    // 3b. Event Ingestion API (for Oracle VPS -> Cloudflare D1 synchronization)
    if (url.pathname === "/api/events/ingest" && request.method === "POST") {
      const auth = request.headers.get("x-sync-secret") ?? "";
      const expected = env.SYNC_SECRET ?? "";
      if (!expected || !timingSafeEqual(auth, expected)) {
        return Response.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
      }
      try {
        const body = (await request.json().catch(() => null)) as { events?: any[] };
        if (!body || !Array.isArray(body.events)) {
          return Response.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
        }
        const store = createD1Store(env.DB);
        let inserted = 0;
        for (const ev of body.events) {
          if (!ev.event_id || !ev.title) continue;
          await store.exec(
            `INSERT OR REPLACE INTO events(
              event_id, title, normalized_title, organizer_name, categories, format, city, venue, timezone,
              start_date, end_date, registration_deadline, registration_status,
              event_url, registration_url, event_type, is_free, price_detail,
              verification_decision, verification_score, publishing_tier, prize, status, first_seen, last_seen
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ev.event_id,
            ev.title,
            ev.normalized_title ?? ev.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(),
            ev.organizer_name ?? null,
            typeof ev.categories === "string" ? ev.categories : JSON.stringify(ev.categories ?? []),
            ev.format ?? "ONLINE",
            ev.city ?? null,
            ev.venue ?? null,
            ev.timezone ?? "UTC",
            ev.start_date,
            ev.end_date ?? null,
            ev.registration_deadline ?? null,
            ev.registration_status ?? "OPEN",
            ev.event_url,
            ev.registration_url ?? null,
            ev.event_type ?? "HACKATHON",
            ev.is_free ?? 1,
            ev.price_detail ?? null,
            ev.verification_decision ?? "VERIFIED",
            ev.verification_score ?? 80,
            ev.publishing_tier ?? "STANDARD",
            ev.prize ?? null,
            ev.status ?? "VERIFIED",
            ev.first_seen ?? new Date().toISOString(),
            ev.last_seen ?? new Date().toISOString()
          );
          inserted++;
        }
        return Response.json({ ok: true, inserted });
      } catch (e) {
        return Response.json({ ok: false, error: e instanceof Error ? e.message : "INGEST_FAILED" }, { status: 500 });
      }
    }

    // 4. Telegram Admin Webhook
    if (url.pathname === "/telegram-webhook" && request.method === "POST") {
      if (env.TELEGRAM_WEBHOOK_SECRET) {
        const got = request.headers.get("x-telegram-bot-api-secret-token") ?? "";
        if (!timingSafeEqual(got, env.TELEGRAM_WEBHOOK_SECRET)) {
          return Response.json({ ok: false }, { status: 403 });
        }
      }
      if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_ADMIN_CHAT_ID) {
        return Response.json({ ok: false, error: "admin not configured" }, { status: 503 });
      }
      const update = (await request.json().catch(() => null)) as never;
      if (!update) return Response.json({ ok: false }, { status: 400 });
      const { handleAdminUpdate } = await import("./notify/adminBot.js");
      const { sendTelegramMessage } = await import("./notify/telegram.js");
      const reply = await handleAdminUpdate(createD1Store(env.DB), update, {
        adminChatIds: env.TELEGRAM_ADMIN_CHAT_ID.split(",").map((s) => s.trim()).filter(Boolean),
      });
      if (reply) {
        const chatId = String((update as { message?: { chat?: { id?: number } } }).message?.chat?.id ?? "");
        if (chatId) {
          await sendTelegramMessage({ botToken: env.TELEGRAM_BOT_TOKEN }, chatId, reply);
        }
      }
      return Response.json({ ok: true });
    }

    // 5. Research Stats API (read-only aggregate metrics over existing tables)
    if (url.pathname === "/api/research/stats") {
      try {
        const store = createD1Store(env.DB);

        // Bounded GROUP BY aggregate over events.status (at most one row per status).
        const statusRows = await store.query<{ status: string; n: number }>(
          "SELECT status, COUNT(*) AS n FROM events GROUP BY status",
        );
        const counts = new Map<string, number>();
        for (const row of statusRows) counts.set(row.status, Number(row.n) || 0);

        // Broken-link count: problem security states only (see schema-notes.md).
        const brokenRow = await store.queryOne<{ broken: number }>(
          "SELECT COUNT(*) AS broken FROM event_links WHERE security_status IN ('FLAGGED','MALICIOUS_REPUTATION','UNREACHABLE')",
        );

        const metrics = {
          discovered: counts.get("DISCOVERED") ?? 0,
          verified: counts.get("VERIFIED") ?? 0,
          published: counts.get("PUBLISHED") ?? 0,
          rejected: counts.get("REJECTED") ?? 0,
          suspicious: counts.get("SUSPICIOUS") ?? 0,
          needs_review: counts.get("NEEDS_REVIEW") ?? 0,
          broken_links: Number(brokenRow?.broken) || 0,
        };

        return Response.json({ ok: true, metrics }, { headers: corsHeaders });
      } catch (e) {
        return Response.json({ ok: false, error: e instanceof Error ? e.message : "QUERY_FAILED" }, { status: 500, headers: corsHeaders });
      }
    }

    // 6. Per-event Research API (read-only evidence/links/sources/changes for one public event)
    if (url.pathname === "/api/research/event") {
      try {
        const id = url.searchParams.get("id");
        if (!id) {
          return Response.json({ ok: false, error: "MISSING_ID" }, { status: 400, headers: corsHeaders });
        }

        const store = createD1Store(env.DB);

        // Only expose events already in the public set; unpublished/rejected rows never leak.
        const event = await store.queryOne(
          `SELECT event_id,title,organizer_name,categories,format,city,country,venue,timezone,
                  start_date,end_date,registration_deadline,registration_status,
                  event_url,registration_url,registration_unverified_note,event_type,is_free,price_detail,
                  status,verification_decision,verification_score,source_trust_score,
                  india_relevance_score,freshness_score,publishing_tier,
                  first_seen,last_seen,last_verified,last_link_check
           FROM events
           WHERE event_id = ? AND status IN ('VERIFIED','PUBLISHED','UPDATED')`,
          id,
        );
        if (!event) {
          return Response.json({ ok: false, error: "NOT_FOUND" }, { status: 404, headers: corsHeaders });
        }

        // Each related read is bounded with a LIMIT to respect D1 free-tier read limits.
        const evidence = await store.query(
          `SELECT evidence_id, source_url, evidence_type, evidence_text, observed_at, source_trust, supports_claim
           FROM verification_evidence WHERE event_id = ? LIMIT ?`,
          id,
          100,
        );
        const links = await store.query(
          `SELECT link_id, url_type, original_url, final_url, domain, is_https, redirect_count,
                  domain_relationship, security_status, verification_status
           FROM event_links WHERE event_id = ? LIMIT ?`,
          id,
          100,
        );
        const sources = await store.query(
          `SELECT id, source_id, source_url, source_level, observed_at
           FROM event_sources WHERE event_id = ? LIMIT ?`,
          id,
          100,
        );
        const changes = await store.query(
          `SELECT change_id, field, old_value, new_value, detected_at
           FROM event_changes WHERE event_id = ? ORDER BY detected_at DESC LIMIT ?`,
          id,
          100,
        );

        return Response.json({ ok: true, event, evidence, links, sources, changes }, { headers: corsHeaders });
      } catch (e) {
        return Response.json({ ok: false, error: e instanceof Error ? e.message : "QUERY_FAILED" }, { status: 500, headers: corsHeaders });
      }
    }

    return Response.json({ ok: false, error: "Not found. Visit / for Eventador Web Portal or /health." }, { status: 404 });
  },

  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    const dryRun = (env.DRY_RUN ?? "true").toLowerCase() !== "false";
    const maintenanceOnly = event.cron === MAINTENANCE_CRON;
    const store = createD1Store(env.DB);
    try {
      const report = await runLoopStages(store, {
        connectors: MVP_SOURCES.filter((s) => s.enabled).map((s) => buildConnector(s)),
        targets: await loadTargets(env),
        verifyLimit: Number(env.VERIFY_LIMIT ?? 10),
        linkLimit: Number(env.LINK_LIMIT ?? 50),
        dryRun,
        threatIntel: providerFromEnv(),
        telegramBotToken: env.TELEGRAM_BOT_TOKEN ?? null,
        whatsapp: env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID
          ? {
              token: env.WHATSAPP_TOKEN,
              phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
              templateName: env.WHATSAPP_TEMPLATE_NAME || undefined,
            }
          : null,
        stages: maintenanceOnly
          ? { discovery: false, verification: false, linkHealth: true, reminders: true, maintenance: true, notify: true }
          : undefined,
      });
      console.log(JSON.stringify({ cron: event.cron, ...report }));
    } catch (e) {
      console.log(JSON.stringify({ cron: event.cron, ok: false, error: e instanceof Error ? e.message : "SCHEDULED_FAILED" }));
    }
  },
};
