import test from "node:test";
import assert from "node:assert/strict";
import { OsintDorkConnector, POPULAR_OSINT_DORKS } from "../src/sources/osintDorks.js";
import { buildConnector, MVP_SOURCES, validateSeeds } from "../src/sources/seeds.js";

test("OSINT connector discovers items from Reddit and GitHub responses", async () => {
  const mockFetch = async (input: RequestInfo | URL) => {
    const urlStr = String(input);
    if (urlStr.includes("reddit.com")) {
      return new Response(
        JSON.stringify({
          data: {
            children: [
              {
                data: {
                  title: "Bengaluru Tech Meetup & Hackathon 2026",
                  url: "https://reddit.com/r/developersIndia/comments/123/bengaluru_meetup",
                  selftext: "Join us this Saturday for a live in-person builder session in Koramangala.",
                  created_utc: 1710000000,
                },
              },
            ],
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    if (urlStr.includes("api.github.com")) {
      return new Response(
        JSON.stringify({
          items: [
            {
              name: "delhi-hacks-2026",
              html_url: "https://github.com/foss-india/delhi-hacks-2026",
              description: "Official repository for Delhi Student Hackathon 2026",
              homepage: "https://delhihacks.dev",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(JSON.stringify({ items: [] }), { status: 200 });
  };

  const connector = new OsintDorkConnector({ fetchFn: mockFetch as typeof fetch });
  assert.equal(connector.name(), "osint-dork-radar");
  assert.equal(connector.type(), "SOCIAL");
  assert.equal(connector.level(), 6);
  assert.equal(connector.getTrustScore(), 50);

  const discovered = await connector.discover();
  assert.ok(discovered.length >= 2, `Expected at least 2 discovered items, got ${discovered.length}`);

  const redditItem = discovered.find((d) => d.sourceUrl.includes("reddit.com"));
  assert.ok(redditItem);
  assert.equal(redditItem.extracted.title, "Bengaluru Tech Meetup & Hackathon 2026");
  assert.equal(redditItem.extracted.event_type_tag, "HACKATHON");

  const ghItem = discovered.find((d) => d.sourceUrl.includes("delhihacks.dev"));
  assert.ok(ghItem);
  assert.ok(ghItem.extracted.title?.includes("delhi hacks"));

  assert.ok(POPULAR_OSINT_DORKS.length >= 3);
});

test("Seed registry validates OSINT connector seed", () => {
  const seedErrors = validateSeeds(MVP_SOURCES);
  assert.deepEqual(seedErrors, []);

  const osintSeed = MVP_SOURCES.find((s) => s.slug === "osint-dork-radar");
  assert.ok(osintSeed);
  assert.equal(osintSeed.kind, "osint");

  const connector = buildConnector(osintSeed);
  assert.equal(connector.name(), "osint-dork-radar");
  assert.equal(connector.type(), "SOCIAL");
});

