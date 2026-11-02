/**
 * OSINT Social Media & Search Dork Connector.
 * Integrates open intelligence sources:
 * 1. Reddit public JSON search (r/developersIndia, r/hackathons).
 * 2. GitHub public repositories & issues search API (zero auth required).
 * 3. Google Search Dork queries for manual & crawler intelligence.
 * All discovered links undergo full 7-step authenticity verification.
 */
import { sanitizeUntrustedText } from "../extract/sanitize.js";
import { normalizeUrl } from "../normalize/url.js";
import type { DiscoveredItem, RateLimit, SourceConnector, SourceType } from "./types.js";
import type { AIExtraction } from "../types.js";

export interface OsintConnectorOptions {
  slug?: string;
  query?: string;
  trustScore?: number;
  fetchFn?: typeof fetch;
  rateLimit?: RateLimit;
}

export interface OsintDorkDefinition {
  platform: string;
  category: "Google Dork" | "GitHub OSINT" | "Reddit Feed" | "Luma Radar";
  query: string;
  dorkUrl: string;
  description: string;
}

/**
 * Curated high-precision Google OSINT dorks for tech events & social leads.
 */
export const POPULAR_OSINT_DORKS: OsintDorkDefinition[] = [
  {
    platform: "Google Search (Luma)",
    category: "Google Dork",
    query: 'site:lu.ma ("Bengaluru" OR "Delhi" OR "Mumbai" OR "Hyderabad" OR "Pune") ("meetup" OR "hackathon" OR "conference")',
    dorkUrl: 'https://www.google.com/search?q=site%3Alu.ma+(%22Bengaluru%22+OR+%22Delhi%22+OR+%22Mumbai%22+OR+%22Hyderabad%22+OR+%22Pune%22)+(%22meetup%22+OR+%22hackathon%22+OR+%22conference%22)',
    description: "Finds unlisted and community tech meetups hosted across Indian tech hubs on Lu.ma.",
  },
  {
    platform: "Google Search (LinkedIn)",
    category: "Google Dork",
    query: 'site:linkedin.com/events ("developer meetup" OR "hackathon" OR "tech summit") ("India" OR "Bengaluru")',
    dorkUrl: 'https://www.google.com/search?q=site%3Alinkedin.com%2Fevents+(%22developer+meetup%22+OR+%22hackathon%22+OR+%22tech+summit%22)+(%22India%22+OR+%22Bengaluru%22)',
    description: "Discovers corporate and startup developer conferences and hackathons announced on LinkedIn.",
  },
  {
    platform: "Google Search (Twitter / X)",
    category: "Google Dork",
    query: '(site:twitter.com OR site:x.com) ("hackathon" OR "tech meetup") ("register" OR "rsvp") ("India" OR "Bengaluru" OR "Delhi")',
    dorkUrl: 'https://www.google.com/search?q=(site%3Atwitter.com+OR+site%3Ax.com)+(%22hackathon%22+OR+%22tech+meetup%22)+(%22register%22+OR+%22rsvp%22)+(%22India%22+OR+%22Bengaluru%22+OR+%22Delhi%22)',
    description: "Finds fresh flash hackathon announcements and RSVP links posted on Twitter/X.",
  },
  {
    platform: "GitHub Events OSINT",
    category: "GitHub OSINT",
    query: 'site:github.com in:readme ("hackathon" OR "tech-events" OR "meetups") ("India" OR "2026")',
    dorkUrl: 'https://www.google.com/search?q=site%3Agithub.com+in%3Areadme+(%22hackathon%22+OR+%22tech-events%22+OR+%22meetups%22)+(%22India%22+OR+%222026%22)',
    description: "Discovers open-source student-run hackathons and community calendars maintained in GitHub readmes.",
  },
  {
    platform: "Reddit DevelopersIndia",
    category: "Reddit Feed",
    query: 'subreddit:developersIndia (flair:Event OR "hackathon" OR "meetup")',
    dorkUrl: 'https://www.reddit.com/r/developersIndia/search?q=flair%3AEvent+OR+hackathon+OR+meetup&restrict_sr=1&sort=new',
    description: "Live Indian developer discussions, local city meetups, and hackathon team formations.",
  },
];

export class OsintDorkConnector implements SourceConnector {
  private readonly slug: string;
  private readonly trustScore: number;
  private readonly fetchFn: typeof fetch;
  private readonly rateLimit: RateLimit;

  constructor(opts: OsintConnectorOptions = {}) {
    this.slug = opts.slug ?? "osint-dork-radar";
    this.trustScore = opts.trustScore ?? 50;
    this.fetchFn = opts.fetchFn ?? globalThis.fetch;
    this.rateLimit = opts.rateLimit ?? {
      requestDelayMs: 3000,
      maxRequestsPerRun: 10,
      concurrentRequests: 1,
      retryLimit: 2,
      backoffMs: 5000,
    };
  }

  name(): string {
    return this.slug;
  }

  type(): SourceType {
    return "SOCIAL";
  }

  level(): 1 | 2 | 3 | 4 | 5 | 6 | 7 {
    return 6;
  }

  getTrustScore(): number {
    return this.trustScore;
  }

  getRateLimit(): RateLimit {
    return this.rateLimit;
  }

  async discover(): Promise<DiscoveredItem[]> {
    const items: DiscoveredItem[] = [];
    const now = new Date().toISOString();

    // 1. Reddit public JSON search (developersIndia & hackathons)
    const redditUrls = [
      "https://www.reddit.com/r/developersIndia/search.json?q=hackathon+OR+meetup&sort=new&limit=10",
      "https://www.reddit.com/r/hackathons/search.json?q=india+OR+virtual&sort=new&limit=10",
    ];

    for (const url of redditUrls) {
      try {
        const res = await this.fetchFn(url, {
          headers: {
            "User-Agent": "EventadorBot/1.0 (+https://eventadorapp.pages.dev)",
            Accept: "application/json",
          },
        });
        if (!res.ok) continue;

        const data = (await res.json()) as {
          data?: {
            children?: Array<{
              data?: {
                title?: string;
                url?: string;
                selftext?: string;
                created_utc?: number;
              };
            }>;
          };
        };

        const posts = data?.data?.children ?? [];
        for (const post of posts) {
          const p = post.data;
          if (!p || !p.title) continue;

          const titleClean = sanitizeUntrustedText(p.title).text;
          const sourceUrl = p.url?.startsWith("http") ? p.url : `https://reddit.com${p.url}`;
          const norm = normalizeUrl(sourceUrl);
          if (!norm.valid || !norm.canonical) continue;

          const isHackathon = /hackathon|ideathon|datathon/i.test(titleClean);
          const isOnline = /online|virtual|discord|zoom/i.test(titleClean);

          items.push({
            sourceUrl: norm.canonical,
            rawContent: sanitizeUntrustedText(p.selftext ?? p.title).text,
            fetchedAt: now,
            extracted: {
              title: titleClean,
              organizer: "Community Lead (Reddit OSINT)",
              event_type: [isHackathon ? "HACKATHON" : "MEETUP"],
              event_type_tag: isHackathon ? "HACKATHON" : "MEETUP",
              format: isOnline ? "ONLINE" : "UNKNOWN",
              is_free: 1,
              event_url: norm.canonical,
              confidence: 0.65,
            },
          });
        }
      } catch {
        // Non-fatal fallback for OSINT feeds
      }
    }

    // 2. GitHub Search API OSINT (public search for active hackathon repos in India)
    try {
      const ghUrl = "https://api.github.com/search/repositories?q=hackathon+india+in:name,description&sort=updated&order=desc&per_page=5";
      const ghRes = await this.fetchFn(ghUrl, {
        headers: {
          "User-Agent": "EventadorBot/1.0 (+https://eventadorapp.pages.dev)",
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (ghRes.ok) {
        const ghData = (await ghRes.json()) as {
          items?: Array<{
            name?: string;
            html_url?: string;
            description?: string;
            homepage?: string;
          }>;
        };

        for (const repo of ghData.items ?? []) {
          if (!repo.name || !repo.html_url) continue;
          const targetUrl = repo.homepage && repo.homepage.startsWith("http") ? repo.homepage : repo.html_url;
          const norm = normalizeUrl(targetUrl);
          if (!norm.valid || !norm.canonical) continue;

          const repoTitle = sanitizeUntrustedText(repo.name.replace(/[-_]/g, " ")).text;
          const desc = sanitizeUntrustedText(repo.description ?? repo.name).text;

          items.push({
            sourceUrl: norm.canonical,
            rawContent: desc,
            fetchedAt: now,
            extracted: {
              title: repoTitle,
              organizer: "GitHub Community",
              event_type: ["HACKATHON"],
              event_type_tag: "HACKATHON",
              format: "UNKNOWN",
              is_free: 1,
              event_url: norm.canonical,
              confidence: 0.6,
            },
          });
        }
      }
    } catch {
      // Non-fatal fallback for GitHub OSINT
    }

    return items;
  }

  parse(raw: string, sourceUrl: string): Partial<AIExtraction> {
    const sanitized = sanitizeUntrustedText(raw.slice(0, 80)).text;
    const isHackathon = /hackathon|ideathon/i.test(sanitized);
    return {
      title: sanitized,
      organizer: "OSINT Lead",
      event_type: [isHackathon ? "HACKATHON" : "MEETUP"],
      event_type_tag: isHackathon ? "HACKATHON" : "MEETUP",
      event_url: sourceUrl,
      format: "UNKNOWN",
      is_free: 1,
      confidence: 0.5,
    };
  }

  normalize(extracted: Partial<AIExtraction>): Partial<AIExtraction> {
    return extracted;
  }
}
