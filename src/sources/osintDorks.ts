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
    platform: "Google Search (Lu.ma Radar)",
    category: "Luma Radar",
    query: 'site:lu.ma ("meetup" OR "hackathon" OR "demo day" OR "founder coffee")',
    dorkUrl: 'https://www.google.com/search?q=site%3Alu.ma+(%22meetup%22+OR+%22hackathon%22+OR+%22demo+day%22+OR+%22founder+coffee%22)',
    description: "Finds unlisted and community tech meetups, founder demo days, and AI workshops on Lu.ma.",
  },
  {
    platform: "Google Search (LinkedIn Events)",
    category: "Google Dork",
    query: 'site:linkedin.com/events ("developer meetup" OR "hackathon" OR "tech summit" OR "AI conference")',
    dorkUrl: 'https://www.google.com/search?q=site%3Alinkedin.com%2Fevents+(%22developer+meetup%22+OR+%22hackathon%22+OR+%22tech+summit%22+OR+%22AI+conference%22)',
    description: "Discovers enterprise, corporate, and venture-backed developer conferences announced on LinkedIn.",
  },
  {
    platform: "Google Search (Twitter / X)",
    category: "Google Dork",
    query: '(site:twitter.com OR site:x.com) ("hackathon" OR "tech meetup" OR "bounty" OR "code sprint") ("register" OR "rsvp")',
    dorkUrl: 'https://www.google.com/search?q=(site%3Atwitter.com+OR+site%3Ax.com)+(%22hackathon%22+OR+%22tech+meetup%22+OR+%22bounty%22+OR+%22code+sprint%22)+(%22register%22+OR+%22rsvp%22)',
    description: "Finds fresh flash hackathon announcements, bursaries, and registration links posted on Twitter/X.",
  },
  {
    platform: "Dev.to Community Radar",
    category: "Google Dork",
    query: 'site:dev.to ("hackathon announcement" OR "call for proposals" OR "virtual meetup" OR "dev event")',
    dorkUrl: 'https://www.google.com/search?q=site%3Adev.to+(%22hackathon+announcement%22+OR+%22call+for+proposals%22+OR+%22virtual+meetup%22+OR+%22dev+event%22)',
    description: "Discovers international online hackathons, open source contests, and global dev challenges published on Dev.to.",
  },
  {
    platform: "Reddit Global Tech Radar",
    category: "Reddit Feed",
    query: 'site:reddit.com (r/hackathons OR r/developersIndia OR r/webdev OR r/cscareerquestions) ("hackathon" OR "meetup")',
    dorkUrl: 'https://www.google.com/search?q=site%3Areddit.com+(r%2Fhackathons+OR+r%2FdevelopersIndia+OR+r%2Fwebdev+OR+r%2Fcscareerquestions)+(%22hackathon%22+OR+%22meetup%22)',
    description: "Live discussions, team formation threads, and local city tech meetup announcements across developer subreddits.",
  },
  {
    platform: "GitHub Events OSINT",
    category: "GitHub OSINT",
    query: 'site:github.com in:readme ("upcoming hackathon" OR "tech-events" OR "meetups" OR "developer-calendar")',
    dorkUrl: 'https://www.google.com/search?q=site%3Agithub.com+in%3Areadme+(%22upcoming+hackathon%22+OR+%22tech-events%22+OR+%22meetups%22+OR+%22developer-calendar%22)',
    description: "Discovers open-source student hackathons and community calendars maintained in GitHub markdown repositories.",
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

    // 3. Dev.to API OSINT (public developer events, hackathons, and calls for proposals)
    try {
      const devtoRes = await this.fetchFn("https://dev.to/api/articles?tag=hackathon&per_page=8", {
        headers: {
          "User-Agent": "EventadorBot/1.0 (+https://eventadorapp.pages.dev)",
          Accept: "application/json",
        },
      });
      if (devtoRes.ok) {
        const articles = (await devtoRes.json()) as Array<{
          title?: string;
          url?: string;
          description?: string;
          tag_list?: string[];
        }>;
        for (const art of articles ?? []) {
          if (!art.title || !art.url) continue;
          const norm = normalizeUrl(art.url);
          if (!norm.valid || !norm.canonical) continue;

          const cleanTitle = sanitizeUntrustedText(art.title).text;
          const cleanDesc = sanitizeUntrustedText(art.description ?? art.title).text;

          items.push({
            sourceUrl: norm.canonical,
            rawContent: cleanDesc,
            fetchedAt: now,
            extracted: {
              title: cleanTitle,
              organizer: "Dev.to Community",
              event_type: ["HACKATHON"],
              event_type_tag: "HACKATHON",
              format: "ONLINE",
              is_free: 1,
              event_url: norm.canonical,
              confidence: 0.65,
            },
          });
        }
      }
    } catch {
      // Non-fatal fallback for Dev.to API
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
