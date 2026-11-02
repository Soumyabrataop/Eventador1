/**
 * Robots-aware & stealth-optimized HTTP fetcher (spec 30). Single choke point
 * for all outbound discovery traffic:
 * - honors robots.txt (fail-closed on errors),
 * - realistic modern browser headers (anti-bot fingerprint protection),
 * - conditional HTTP caching (ETag & If-Modified-Since saves up to 95% bandwidth),
 * - domain-level circuit breaker (automatic cooldown on 429/403 to avoid IP bans),
 * - enforces timeout + response size caps (never streams infinite traps),
 * - never executes scripts, downloads binaries, or bypasses blocks (spec 31).
 */
import { getRobotsRules, isAllowed } from "./robots.js";

export const DISCOVERY_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export const REALISTIC_BROWSER_HEADERS: Record<string, string> = {
  "User-Agent": DISCOVERY_USER_AGENT,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,application/rss+xml,application/atom+xml;q=0.8,*/*;q=0.7",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-CH-UA": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  "Sec-CH-UA-Mobile": "?0",
  "Sec-CH-UA-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

export interface FetchResult {
  ok: boolean;
  status: number | null;
  finalUrl: string;
  contentType: string | null;
  text: string | null;
  bytes: number;
  blockedByRobots: boolean;
  notModified?: boolean;
  error: string | null;
}

export interface FetchOptions {
  fetchFn?: typeof fetch;
  timeoutMs?: number;
  maxBytes?: number;
  /** Set false only for fetching robots.txt-adjacent infrastructure in tests. */
  obeyRobots?: boolean;
  userAgent?: string;
  headers?: Record<string, string>;
  skipCooldown?: boolean;
  domainDelayMs?: number;
}

const DEFAULT_TIMEOUT_MS = 12000;
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024; // 2 MB

interface CacheEntry {
  etag?: string;
  lastModified?: string;
  text: string;
  contentType: string | null;
}

const httpCache = new Map<string, CacheEntry>();
const domainCooldowns = new Map<string, number>();

/** Clear internal cache and cooldown state (for unit tests). */
export function clearHttpCache(): void {
  httpCache.clear();
  domainCooldowns.clear();
}

export async function fetchText(url: string, opts: FetchOptions = {}): Promise<FetchResult> {
  const fetchFn = opts.fetchFn ?? fetch;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_BYTES;
  const userAgent = opts.userAgent ?? DISCOVERY_USER_AGENT;
  const fail = (error: string, status: number | null = null): FetchResult => ({
    ok: false, status, finalUrl: url, contentType: null, text: null,
    bytes: 0, blockedByRobots: false, error,
  });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return fail("INVALID_URL");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return fail("UNSUPPORTED_SCHEME");
  }

  const hostname = parsed.hostname.toLowerCase();

  // Circuit breaker: if domain recently returned 429 / 403, respect cooldown.
  if (!opts.skipCooldown) {
    const cooldownUntil = domainCooldowns.get(hostname);
    if (cooldownUntil && Date.now() < cooldownUntil) {
      const waitSec = Math.ceil((cooldownUntil - Date.now()) / 1000);
      return fail(`DOMAIN_COOLDOWN_ACTIVE:${waitSec}s`, 429);
    }
  }

  if (opts.obeyRobots !== false) {
    const rules = await getRobotsRules(url, fetchFn, userAgent);
    if (!isAllowed(rules, url)) {
      return {
        ok: false, status: null, finalUrl: url, contentType: null, text: null,
        bytes: 0, blockedByRobots: true, error: "BLOCKED_BY_ROBOTS_TXT",
      };
    }
  }

  // Bandwidth preservation: check conditional cache (ETag / If-Modified-Since).
  const cached = httpCache.get(url);
  const reqHeaders: Record<string, string> = {
    ...REALISTIC_BROWSER_HEADERS,
    ...(opts.userAgent ? { "User-Agent": opts.userAgent } : {}),
    ...(opts.headers ?? {}),
  };
  if (cached?.etag) reqHeaders["If-None-Match"] = cached.etag;
  if (cached?.lastModified) reqHeaders["If-Modified-Since"] = cached.lastModified;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchFn(url, {
      headers: reqHeaders,
      signal: ctrl.signal,
    });
    const status = res.status;

    // Handle 304 Not Modified: 0 bytes transferred over the network!
    if (status === 304 && cached) {
      return {
        ok: true,
        status: 304,
        finalUrl: res.url || url,
        contentType: cached.contentType,
        text: cached.text,
        bytes: 0,
        notModified: true,
        blockedByRobots: false,
        error: null,
      };
    }

    // Stop if blocked — trigger domain circuit breaker to prevent repeated strikes.
    if (status === 403 || status === 429 || status === 503) {
      const retryHeader = res.headers.get("retry-after");
      const cooldownMs = retryHeader && !Number.isNaN(Number(retryHeader))
        ? Number(retryHeader) * 1000
        : 15 * 60 * 1000; // 15 min default
      domainCooldowns.set(hostname, Date.now() + cooldownMs);
      return { ...fail(`BLOCKED_HTTP_${status}`, status), finalUrl: res.url || url };
    }
    if (!res.ok) return { ...fail(`HTTP_${status}`, status), finalUrl: res.url || url };

    const contentType = res.headers.get("content-type");
    const claimed = Number(res.headers.get("content-length") ?? "0");
    if (claimed > maxBytes) return { ...fail("RESPONSE_TOO_LARGE", status), finalUrl: res.url || url };

    // Stream with an enforced cap (Content-Length may lie or be absent).
    let text: string;
    const reader = res.body?.getReader();
    if (!reader) {
      text = await res.text();
      if (text.length > maxBytes) return fail("RESPONSE_TOO_LARGE", status);
    } else {
      const chunks: Uint8Array[] = [];
      let bytes = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          bytes += value.byteLength;
          if (bytes > maxBytes) {
            try { await reader.cancel(); } catch { /* ignore */ }
            return { ...fail("RESPONSE_TOO_LARGE", status), finalUrl: res.url || url };
          }
          chunks.push(value);
        }
      }
      const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
      text = buf.toString("utf8");
    }

    // Store ETag & Last-Modified for future conditional requests.
    const etag = res.headers.get("etag") ?? undefined;
    const lastModified = res.headers.get("last-modified") ?? undefined;
    if (etag || lastModified) {
      httpCache.set(url, { etag, lastModified, text, contentType });
      if (httpCache.size > 2000) {
        const firstKey = httpCache.keys().next().value;
        if (firstKey) httpCache.delete(firstKey);
      }
    }

    return {
      ok: true, status, finalUrl: res.url || url, contentType, text,
      bytes: text.length, blockedByRobots: false, error: null,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "FETCH_FAILED";
    return fail(/abort/i.test(msg) ? "TIMEOUT" : msg);
  } finally {
    clearTimeout(t);
  }
}

/** Polite delay helper — every source loop must await this between requests. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
