/**
 * Safe HTML extraction (spec 31/32/42). The fetched page is UNTRUSTED DATA:
 * - scripts/styles/iframes are removed before any processing (never executed),
 * - embedded instructions are sanitized + flagged, never obeyed,
 * - missing fields return null (never hallucinated),
 * - machine-readable schema.org JSON-LD Event blocks are preferred over
 *   fragile scraping, because they are the publisher's own structured claim.
 */
import { sanitizeUntrustedText } from "./sanitize.js";
import { registrableDomainOf } from "../normalize/url.js";
import type { AIExtraction, EventFormat, EventType } from "../types.js";

export interface ExtractedPage extends AIExtraction {
  links: string[]; // absolute http(s) hrefs found on the page (unverified)
  jsonLdFound: boolean;
  flagged: boolean; // injection patterns were neutralized somewhere
  flagDetails: string[];
}

const MAX_LINKS = 100;

function removeDangerous(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style[\s\S]*?<\/style\s*>/gi, " ")
    .replace(/<iframe[\s\S]*?<\/iframe\s*>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
}

function metaContent(html: string, attrName: string, attrValue: string): string | null {
  // Matches <meta property|name="X" content="Y"> in either attribute order.
  const patterns = [
    new RegExp(`<meta\\s[^>]*${attrName}\\s*=\\s*["']${attrValue}["'][^>]*?content\\s*=\\s*["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s[^>]*content\\s*=\\s*["']([^"']+)["'][^>]*?${attrName}\\s*=\\s*["']${attrValue}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

function titleOf(html: string): string | null {
  const m = /<title[^>]*>([\s\S]*?)<\/title\s*>/i.exec(html);
  const t = m?.[1]?.replace(/\s+/g, " ").trim();
  return t || null;
}

function firstHeading(html: string): string | null {
  const m = /<h1[^>]*>([\s\S]*?)<\/h1\s*>/i.exec(html);
  if (!m?.[1]) return null;
  const t = m[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return t || null;
}

function absolutize(href: string, base: string): string | null {
  const h = href.trim();
  if (!h || h.startsWith("#") || h.startsWith("javascript:") || h.startsWith("mailto:") || h.startsWith("data:")) return null;
  try {
    const u = new URL(h, base);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

function pageLinks(html: string, base: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const re = /<a\s[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a\s*>/gi;
  let m: RegExpExecArray | null;
  let guard = 0;
  while ((m = re.exec(html)) !== null && guard++ < 2000 && out.length < MAX_LINKS) {
    const abs = absolutize(m[1] ?? "", base);
    if (abs && !seen.has(abs)) {
      seen.add(abs);
      out.push(abs);
    }
  }
  return out;
}

interface JsonLdEvent {
  name?: unknown;
  description?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  eventStatus?: unknown;
  organizer?: unknown;
  location?: unknown;
  url?: unknown;
  isAccessibleForFree?: unknown;
  offers?: unknown;
  "@type"?: unknown;
}

function jsonLdEvents(html: string): JsonLdEvent[] {
  const found: JsonLdEvent[] = [];
  const re = /<script\s[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi;
  let m: RegExpExecArray | null;
  let guard = 0;
  while ((m = re.exec(html)) !== null && guard++ < 10) {
    try {
      const parsed: unknown = JSON.parse(m[1] ?? "");
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of nodes) {
        if (typeof node !== "object" || node === null) continue;
        const graph = (node as { "@graph"?: unknown })["@graph"];
        const candidates = Array.isArray(graph) ? graph : [node];
        for (const c of candidates) {
          if (typeof c !== "object" || c === null) continue;
          const type = (c as { "@type"?: unknown })["@type"];
          const types = Array.isArray(type) ? type : [type];
          if (types.some((t) => typeof t === "string" && /event|hackathon/i.test(t))) {
            found.push(c as JsonLdEvent);
          }
        }
      }
    } catch {
      // Malformed JSON-LD is data, not a fatal error — ignore this block.
    }
  }
  return found;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function dateOrNull(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : new Date(t).toISOString(); // never invent (spec 42)
}

function organizerNameOf(v: unknown): string | null {
  if (typeof v === "string") return str(v);
  if (typeof v === "object" && v !== null) {
    const o = v as { name?: unknown };
    return str(o.name);
  }
  return null;
}

function locationOf(v: unknown): string | null {
  if (typeof v === "string") return str(v);
  if (typeof v === "object" && v !== null) {
    const o = v as { name?: unknown; address?: unknown };
    const name = str(o.name);
    const addr = typeof o.address === "string" ? str(o.address)
      : typeof o.address === "object" && o.address !== null
        ? str((o.address as { streetAddress?: unknown }).streetAddress) ?? str((o.address as { addressLocality?: unknown }).addressLocality)
        : null;
    return [name, addr].filter(Boolean).join(", ") || null;
  }
  return null;
}

function guessFormat(location: string | null, text: string): EventFormat | null {
  const hay = `${location ?? ""} ${text}`.toLowerCase();
  if (/online|virtual|remote/.test(hay)) return "ONLINE";
  if (/hybrid/.test(hay)) return "HYBRID";
  if (location) return "OFFLINE";
  return null;
}

function guessEventType(title: string | null, text: string, jsonLdType?: unknown): EventType {
  const hay = `${title ?? ""} ${text}`.toLowerCase();
  if (/meetup|user group|community gathering|chapter meeting|tech meetup/i.test(hay)) return "MEETUP";
  if (/workshop|bootcamp|hands-on|masterclass|tutorial|training/i.test(hay)) return "WORKSHOP";
  if (/conference|summit|symposium|con 202|conf 202/i.test(hay)) return "CONFERENCE";
  if (/hackathon|hackfest|codefest|ideathon|datathon|buildathon/i.test(hay)) return "HACKATHON";
  if (/competition|challenge|contest/i.test(hay)) return "COMPETITION";
  return "HACKATHON";
}

function guessPricing(e: JsonLdEvent | undefined, text: string): { isFree: number; priceDetail: string | null } {
  if (e) {
    if (e.isAccessibleForFree === true) return { isFree: 1, priceDetail: "Free" };
    if (e.isAccessibleForFree === false) return { isFree: 0, priceDetail: "Paid" };
    if (typeof e.offers === "object" && e.offers !== null) {
      const offer = e.offers as { price?: unknown; priceCurrency?: unknown };
      const p = offer.price;
      if (p === 0 || p === "0" || p === "0.00" || p === "Free" || p === "free") {
        return { isFree: 1, priceDetail: "Free" };
      }
      if (typeof p === "number" && p > 0) {
        return { isFree: 0, priceDetail: `${offer.priceCurrency ?? "₹"} ${p}` };
      }
      if (typeof p === "string" && Number(p) > 0) {
        return { isFree: 0, priceDetail: `${offer.priceCurrency ?? "₹"} ${p}` };
      }
    }
  }
  const hay = text.toLowerCase();
  if (/free of cost|free registration|free entry|entry free|100% free|no registration fee|free to attend/i.test(hay)) {
    return { isFree: 1, priceDetail: "Free" };
  }
  const ticketMatch = /(?:tickets?|registration fee|entry fee):\s*(?:₹|\$|rs\.?)\s*(\d+)/i.exec(hay);
  if (ticketMatch && Number(ticketMatch[1]) > 0) {
    return { isFree: 0, priceDetail: `₹${ticketMatch[1]}` };
  }
  if (/paid event|ticket required|buy tickets|paid registration/i.test(hay)) {
    return { isFree: 0, priceDetail: "Paid" };
  }
  return { isFree: 1, priceDetail: "Free" };
}

/** Extract event fields from raw HTML. `pageUrl` is used for link resolution. */
export function extractEventFromHtml(html: string, pageUrl: string): ExtractedPage {
  const flagDetails: string[] = [];
  const noteFlag = (texts: Array<string | null>): void => {
    for (const t of texts) {
      if (!t) continue;
      const s = sanitizeUntrustedText(t);
      if (s.flagged) flagDetails.push(...s.matchedPatterns);
    }
  };

  const safe = removeDangerous(html);
  const links = pageLinks(safe, pageUrl);
  const ld = jsonLdEvents(html); // parse from ORIGINAL html (script blocks intact)
  const e = ld[0];

  // Title preference: publisher-structured (JSON-LD) > social (og:title) >
  // on-page heading (h1) > document title. JS-SPA shells carry only a generic
  // site <title> (e.g. "Hack2skill"); such titles name no event, so a
  // site-name guard below demotes them to null (spec 42: never invent).
  const ogTitle = metaContent(safe, "property", "og:title");
  const rawTitle = (e && str(e.name)) ?? ogTitle ?? firstHeading(safe) ?? titleOf(safe);
  const rawDesc =
    (e && str(e.description)) ??
    metaContent(safe, "property", "og:description") ??
    metaContent(safe, "name", "description");
  noteFlag([rawTitle, rawDesc, html.slice(0, 20000)]);

  const clean = (t: string | null): string | null => {
    if (!t) return null;
    const normalized = t.replace(/\s+/g, " ").trim();
    // Site-name guard: a title that is just the site/brand name (derived from
    // the page host) identifies no event — return null so the runner skips it
    // instead of storing junk (spec 42).
    try {
      const hostRoot = (registrableDomainOf(new URL(pageUrl).hostname) ?? "").split(".")[0] ?? "";
      const squashed = normalized.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (hostRoot && squashed.length > 0 && (squashed === hostRoot || squashed === `${hostRoot}s`)) {
        return null;
      }
    } catch {
      // Unparsable page URL — keep the title, verification will judge it.
    }
    return sanitizeUntrustedText(normalized).text || null;
  };

  const location = e ? locationOf(e.location) : null;
  const bodyText = safe.replace(/<[^>]*>/g, " ").slice(0, 5000);
  const pricing = guessPricing(e, bodyText);
  const eventTypeTag = guessEventType(rawTitle, bodyText, e?.["@type"]);

  return {
    title: clean(rawTitle),
    organizer: e ? clean(organizerNameOf(e.organizer)) : null,
    event_type: [],
    event_type_tag: eventTypeTag,
    is_free: pricing.isFree,
    price_detail: pricing.priceDetail,
    format: guessFormat(location, bodyText),
    start_date: e ? dateOrNull(e.startDate) : null,
    end_date: e ? dateOrNull(e.endDate) : null,
    registration_deadline: null, // rarely in markup; resolved later, never guessed
    location: clean(location),
    eligibility: null,
    team_size: null,
    prize: null,
    registration_url: null, // chosen by the verification pipeline, not scraping
    event_url: pageUrl,
    confidence: e ? 0.7 : 0.3,
    links,
    jsonLdFound: ld.length > 0,
    flagged: flagDetails.length > 0,
    flagDetails: [...new Set(flagDetails)],
  };
}
