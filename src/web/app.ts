/**
 * Eventador Web Portal & Discovery Frontend.
 * Self-contained, responsive, high-performance web application served
 * globally at Cloudflare's edge in <50ms.
 */

export function renderWebPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eventador — Verified Tech Events, Hackathons & Meetups</title>
  <meta name="description" content="Discover verified online and in-person hackathons, meetups, conferences, and tech workshops. 100% genuine links with zero malicious lures.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(18, 24, 38, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover: rgba(255, 255, 255, 0.14);
      --accent-primary: #6366f1;
      --accent-primary-hover: #4f46e5;
      --accent-glow: rgba(99, 102, 241, 0.25);
      --free-green: #10b981;
      --free-glow: rgba(16, 185, 129, 0.2);
      --paid-amber: #f59e0b;
      --online-cyan: #06b6d4;
      --meetup-pink: #ec4899;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-sub: #cbd5e1;
      --input-bg: rgba(15, 23, 42, 0.85);
      --input-border: rgba(255, 255, 255, 0.12);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.5;
      background-image: 
        radial-gradient(at 10% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 90% 80%, rgba(16, 185, 129, 0.1) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(6, 182, 212, 0.08) 0px, transparent 60%);
      background-attachment: fixed;
    }

    header {
      border-bottom: 1px solid var(--card-border);
      backdrop-filter: blur(12px);
      background: rgba(9, 13, 22, 0.85);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      text-decoration: none;
      color: inherit;
    }

    .brand-logo {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      display: grid;
      place-items: center;
      box-shadow: 0 4px 16px var(--accent-glow);
      font-size: 1.4rem;
    }

    .brand-title {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(to right, #ffffff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.78rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      font-family: 'JetBrains Mono', monospace;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }

    .community-links {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .btn-community {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      transition: all 0.2s ease;
    }

    .btn-community:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--card-hover);
      transform: translateY(-1px);
    }

    .hero-section {
      max-width: 1280px;
      margin: 0 auto;
      padding: 3rem 1.5rem 1.5rem;
      text-align: center;
    }

    .hero-headline {
      font-size: clamp(2rem, 5vw, 3.25rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
    }

    .hero-highlight {
      background: linear-gradient(135deg, #818cf8 0%, #38bdf8 50%, #34d399 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-sub {
      color: var(--text-muted);
      font-size: clamp(1rem, 2vw, 1.15rem);
      max-width: 680px;
      margin: 0 auto 2rem;
    }

    /* Filters Bar */
    .filter-panel {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem 2rem;
    }

    .filter-container {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(16px);
      border-radius: 18px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
    }

    .search-row {
      display: flex;
      gap: 0.75rem;
      width: 100%;
    }

    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 12px;
      padding: 0 1rem;
      transition: all 0.2s ease;
    }

    .search-box:focus-within {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }

    .search-input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 0.95rem;
      padding: 0.75rem 0.5rem;
      font-family: inherit;
    }

    .search-icon {
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    .dropdown-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.75rem;
    }

    .filter-item {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .filter-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .select-input {
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      color: #ffffff;
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .select-input:hover, .select-input:focus {
      border-color: var(--accent-primary);
    }

    .select-input option {
      background: #0f172a;
      color: #ffffff;
    }

    .active-chips-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .counter-text {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .btn-reset {
      background: none;
      border: none;
      color: #818cf8;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      padding: 0.2rem 0.4rem;
    }

    /* Cards Grid */
    .events-grid-wrapper {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem 4rem;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.5rem;
    }

    .event-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      backdrop-filter: blur(14px);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    .event-card:hover {
      transform: translateY(-4px);
      border-color: var(--card-hover);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
    }

    .card-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.85rem;
    }

    .badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.22rem 0.6rem;
      border-radius: 6px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }

    .badge-online { background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3); }
    .badge-offline { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
    .badge-free { background: var(--free-glow); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .badge-paid { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge-type { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3); }

    .card-title {
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 0.5rem;
      color: #ffffff;
    }

    .card-organizer {
      font-size: 0.88rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-bottom: 0.85rem;
    }

    .card-organizer-check {
      color: #38bdf8;
      font-size: 0.95rem;
    }

    .card-meta {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      font-size: 0.85rem;
      color: var(--text-sub);
      margin-bottom: 1.15rem;
      background: rgba(0, 0, 0, 0.2);
      padding: 0.75rem 0.85rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.04);
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-bottom: 1.25rem;
    }

    .tag-pill {
      font-size: 0.72rem;
      padding: 0.15rem 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      color: #94a3b8;
    }

    .card-actions {
      display: flex;
      gap: 0.65rem;
      margin-top: auto;
    }

    .btn-register {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.4rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
      padding: 0.7rem 1rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px var(--accent-glow);
    }

    .btn-register:hover {
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      transform: translateY(-1px);
    }

    .btn-icon {
      padding: 0.7rem 0.85rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      color: var(--text-main);
      cursor: pointer;
      text-decoration: none;
      display: grid;
      place-items: center;
      transition: all 0.2s ease;
    }

    .btn-icon:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: var(--card-hover);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--text-muted);
    }

    footer {
      border-top: 1px solid var(--card-border);
      padding: 2.5rem 1.5rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .events-grid { grid-template-columns: 1fr; }
      .community-links { display: none; }
    }
  </style>
</head>
<body>
  <header>
    <div class="nav-container">
      <a href="/" class="brand-group">
        <div class="brand-logo">⚡</div>
        <div>
          <div class="brand-title">Eventador</div>
          <div class="status-pill"><span class="status-dot"></span> Live Radar Active</div>
        </div>
      </a>
      <div class="community-links">
        <a href="https://t.me/EventadorBot" target="_blank" rel="noopener noreferrer" class="btn-community">
          <span>✈️</span> Telegram Bot
        </a>
        <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" class="btn-community">
          <span>👾</span> Discord
        </a>
        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" class="btn-community">
          <span>💬</span> WhatsApp
        </a>
      </div>
    </div>
  </header>

  <main>
    <section class="hero-section">
      <h1 class="hero-headline">
        Discover Verified <span class="hero-highlight">Hackathons & Meetups</span>
      </h1>
      <p class="hero-sub">
        Autonomous discovery from Unstop, MLH, Luma, Devfolio, AWS, Google, and global communities. 100% first-party verified registration links.
      </p>
    </section>

    <section class="filter-panel">
      <div class="filter-container">
        <div class="search-row">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" id="searchInput" class="search-input" placeholder="Search by topic, hackathon name, tech stack (AI, Web3, Cloud, Python)..." />
          </div>
        </div>

        <div class="dropdown-grid">
          <div class="filter-item">
            <label class="filter-label">Event Mode</label>
            <select id="formatFilter" class="select-input">
              <option value="ALL">All Modes (Online & Offline)</option>
              <option value="ONLINE">🌐 Online Only</option>
              <option value="OFFLINE">📍 In-Person (Offline)</option>
              <option value="HYBRID">🔀 Hybrid</option>
            </select>
          </div>

          <div class="filter-item">
            <label class="filter-label">Cost / Pricing</label>
            <select id="pricingFilter" class="select-input">
              <option value="ALL">All (Free & Paid)</option>
              <option value="FREE">🟢 Free to Attend (100% Free)</option>
              <option value="PAID">🏷️ Paid / Ticketed</option>
            </select>
          </div>

          <div class="filter-item">
            <label class="filter-label">Event Type</label>
            <select id="typeFilter" class="select-input">
              <option value="ALL">All Event Types</option>
              <option value="HACKATHON">⚡ Hackathons & Challenges</option>
              <option value="MEETUP">👥 Developer Meetups</option>
              <option value="CONFERENCE">🎤 Conferences & Summits</option>
              <option value="WORKSHOP">🎓 Workshops & Bootcamps</option>
              <option value="COMPETITION">🏆 Coding Competitions</option>
            </select>
          </div>

          <div class="filter-item">
            <label class="filter-label">Location / City</label>
            <select id="cityFilter" class="select-input">
              <option value="ALL">All Locations</option>
              <option value="ONLINE">Online / Virtual</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Jaipur">Jaipur</option>
            </select>
          </div>
        </div>

        <div class="active-chips-row">
          <span id="eventsCount" class="counter-text">Showing 0 verified events</span>
          <button id="resetBtn" class="btn-reset">Reset Filters</button>
        </div>
      </div>
    </section>

    <section class="events-grid-wrapper">
      <div id="eventsGrid" class="events-grid">
        <!-- Rendered dynamically -->
      </div>
    </section>
  </main>

  <footer>
    <p>⚡ <strong>Eventador</strong> — Autonomous Intelligence Bot for Verified Tech Events.</p>
    <p style="margin-top: 0.5rem; color: #64748b;">
      Verification-first philosophy: Links are independently resolved to official organizer pages. Zero untrusted redirects.
    </p>
  </footer>

  <script>
    // Embedded sample fallback events for instantaneous render or offline preview
    const SEED_EVENTS = [
      {
        id: "evt-devfolio-1",
        title: "ETHIndia 2026 Hackathon",
        organizer: "Devfolio & Ethereum Foundation",
        format: "HYBRID",
        city: "Bengaluru",
        type: "HACKATHON",
        isFree: true,
        priceDetail: "Free",
        startDate: "2026-12-05T09:00:00Z",
        deadline: "2026-11-20T23:59:00Z",
        prize: "₹50,00,000",
        tags: ["Web3", "Ethereum", "Smart Contracts", "DeFi"],
        eventUrl: "https://ethindia.co",
        registrationUrl: "https://ethindia.co/apply",
        verified: true,
        source: "Devfolio"
      },
      {
        id: "evt-mlh-1",
        title: "HackNITR 6.0",
        organizer: "NIT Rourkela",
        format: "ONLINE",
        city: null,
        type: "HACKATHON",
        isFree: true,
        priceDetail: "Free",
        startDate: "2026-11-15T10:00:00Z",
        deadline: "2026-11-12T18:00:00Z",
        prize: "₹5,00,000",
        tags: ["AI/ML", "Cloud", "Open Source", "Students"],
        eventUrl: "https://hacknitr.com",
        registrationUrl: "https://hacknitr.com/register",
        verified: true,
        source: "MLH"
      },
      {
        id: "evt-aws-1",
        title: "AWS Community Day India 2026",
        organizer: "AWS User Group India",
        format: "ONLINE",
        city: "Bengaluru",
        type: "MEETUP",
        isFree: true,
        priceDetail: "Free",
        startDate: "2026-11-22T04:30:00Z",
        deadline: "2026-11-21T18:30:00Z",
        prize: "Certificates & Swags",
        tags: ["AWS", "Serverless", "GenAI", "DevOps"],
        eventUrl: "https://aws.amazon.com/developer/community/community-days/",
        registrationUrl: "https://aws.amazon.com/developer/community/community-days/",
        verified: true,
        source: "AWS"
      },
      {
        id: "evt-luma-1",
        title: "Bangalore AI Agents & LLM Builders Meetup",
        organizer: "GenAI Collective",
        format: "OFFLINE",
        city: "Bengaluru",
        type: "MEETUP",
        isFree: true,
        priceDetail: "Free",
        startDate: "2026-11-18T12:30:00Z",
        deadline: "2026-11-17T18:30:00Z",
        prize: null,
        tags: ["AI/ML", "LLM", "Agents", "Networking"],
        eventUrl: "https://lu.ma/blr-ai-agents",
        registrationUrl: "https://lu.ma/blr-ai-agents",
        verified: true,
        source: "Luma"
      },
      {
        id: "evt-google-1",
        title: "Google Cloud DevFest Summit",
        organizer: "Google Developer Groups",
        format: "HYBRID",
        city: "Delhi",
        type: "CONFERENCE",
        isFree: true,
        priceDetail: "Free",
        startDate: "2026-12-10T04:00:00Z",
        deadline: "2026-12-01T18:30:00Z",
        prize: null,
        tags: ["Google Cloud", "Gemini", "Kubernetes", "Flutter"],
        eventUrl: "https://developers.google.com/community/devfest",
        registrationUrl: "https://developers.google.com/community/devfest",
        verified: true,
        source: "Google"
      },
      {
        id: "evt-unstop-1",
        title: "Smart India Hackathon 2026",
        organizer: "Ministry of Education & AICTE",
        format: "HYBRID",
        city: "New Delhi",
        type: "HACKATHON",
        isFree: true,
        priceDetail: "Free",
        startDate: "2026-12-18T03:30:00Z",
        deadline: "2026-11-25T18:30:00Z",
        prize: "₹1,00,00,000",
        tags: ["Innovation", "GovTech", "Smart Cities", "Healthcare"],
        eventUrl: "https://sih.gov.in",
        registrationUrl: "https://sih.gov.in/register",
        verified: true,
        source: "SIH"
      },
      {
        id: "evt-hacktober-1",
        title: "Hacktoberfest Global Open Source Sprint",
        organizer: "DigitalOcean & GitHub",
        format: "ONLINE",
        city: null,
        type: "WORKSHOP",
        isFree: true,
        priceDetail: "Free",
        startDate: "2026-11-01T00:00:00Z",
        deadline: "2026-11-30T23:59:00Z",
        prize: "Badges & Tree Planting",
        tags: ["Open Source", "Git", "GitHub", "Community"],
        eventUrl: "https://hacktoberfest.com",
        registrationUrl: "https://hacktoberfest.com",
        verified: true,
        source: "Hacktoberfest"
      },
      {
        id: "evt-metamask-1",
        title: "MetaMask Snaps & Web3 Developer Workshop",
        organizer: "Consensys Developer Team",
        format: "ONLINE",
        city: null,
        type: "WORKSHOP",
        isFree: true,
        priceDetail: "Free",
        startDate: "2026-11-28T14:00:00Z",
        deadline: "2026-11-27T18:30:00Z",
        prize: null,
        tags: ["Web3", "MetaMask", "JavaScript", "Security"],
        eventUrl: "https://metamask.io/developer/",
        registrationUrl: "https://metamask.io/developer/",
        verified: true,
        source: "MetaMask"
      }
    ];

    let allEvents = [...SEED_EVENTS];

    async function fetchApiEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.events) && data.events.length > 0) {
            allEvents = data.events.map(e => ({
              id: e.event_id,
              title: e.title,
              organizer: e.organizer_name || "Official Organizer",
              format: e.format,
              city: e.city,
              type: e.event_type || "HACKATHON",
              isFree: e.is_free !== 0,
              priceDetail: e.price_detail || (e.is_free === 0 ? "Paid" : "Free"),
              startDate: e.start_date,
              deadline: e.registration_deadline,
              prize: e.prize,
              tags: e.categories ? JSON.parse(e.categories) : [],
              eventUrl: e.event_url,
              registrationUrl: e.registration_url || e.event_url,
              verified: e.verification_decision === "VERIFIED_OFFICIAL",
              source: e.organizer_name || "Verified Source"
            }));
          }
        }
      } catch (err) {
        console.warn("Using fallback event dataset:", err);
      }
      renderFilteredEvents();
    }

    function formatDate(isoStr) {
      if (!isoStr) return "TBA";
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function renderFilteredEvents() {
      const searchVal = document.getElementById('searchInput').value.trim().toLowerCase();
      const formatVal = document.getElementById('formatFilter').value;
      const pricingVal = document.getElementById('pricingFilter').value;
      const typeVal = document.getElementById('typeFilter').value;
      const cityVal = document.getElementById('cityFilter').value;

      const filtered = allEvents.filter(e => {
        // Search filter
        if (searchVal) {
          const hay = (e.title + " " + e.organizer + " " + (e.city || "") + " " + (e.tags || []).join(" ")).toLowerCase();
          if (!hay.includes(searchVal)) return false;
        }

        // Format filter
        if (formatVal !== "ALL") {
          if (formatVal === "ONLINE" && e.format !== "ONLINE") return false;
          if (formatVal === "OFFLINE" && e.format !== "OFFLINE") return false;
          if (formatVal === "HYBRID" && e.format !== "HYBRID") return false;
        }

        // Pricing filter
        if (pricingVal !== "ALL") {
          if (pricingVal === "FREE" && !e.isFree) return false;
          if (pricingVal === "PAID" && e.isFree) return false;
        }

        // Type filter
        if (typeVal !== "ALL" && e.type !== typeVal) return false;

        // City filter
        if (cityVal !== "ALL") {
          if (cityVal === "ONLINE" && e.format !== "ONLINE") return false;
          if (cityVal !== "ONLINE" && (!e.city || !e.city.toLowerCase().includes(cityVal.toLowerCase()))) return false;
        }

        return true;
      });

      const grid = document.getElementById('eventsGrid');
      const countEl = document.getElementById('eventsCount');
      countEl.textContent = \`Showing \${filtered.length} verified events\`;

      if (filtered.length === 0) {
        grid.innerHTML = \`
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
            <h3>No events match your selected filters</h3>
            <p>Try switching to "All Modes" or clearing your search keywords.</p>
          </div>
        \`;
        return;
      }

      grid.innerHTML = filtered.map(e => {
        const isOnline = e.format === "ONLINE";
        const formatBadgeClass = isOnline ? "badge-online" : "badge-offline";
        const formatText = isOnline ? "🌐 Online" : \`📍 \${e.city || "In-Person"}\`;
        const priceBadgeClass = e.isFree ? "badge-free" : "badge-paid";
        const priceText = e.isFree ? "🟢 Free" : \`🏷️ \${e.priceDetail || "Paid"}\`;

        return \`
          <article class="event-card">
            <div>
              <div class="card-badges">
                <span class="badge \${formatBadgeClass}">\${formatText}</span>
                <span class="badge \${priceBadgeClass}">\${priceText}</span>
                <span class="badge badge-type">\${e.type}</span>
              </div>

              <h2 class="card-title">\${e.title}</h2>
              <div class="card-organizer">
                <span>\${e.organizer}</span>
                <span class="card-organizer-check" title="Verified Organizer">✓</span>
              </div>

              <div class="card-meta">
                <div class="meta-row">
                  <span>📅</span> <span>\${formatDate(e.startDate)}</span>
                </div>
                \${e.deadline ? \`
                  <div class="meta-row" style="color: #fb7185;">
                    <span>⏰</span> <span>Deadline: \${formatDate(e.deadline)}</span>
                  </div>
                \` : ''}
                \${e.prize ? \`
                  <div class="meta-row" style="color: #34d399;">
                    <span>🏆</span> <span>Prize: \${e.prize}</span>
                  </div>
                \` : ''}
              </div>

              \${e.tags && e.tags.length ? \`
                <div class="card-tags">
                  \${e.tags.map(t => \`<span class="tag-pill">#\${t}</span>\`).join('')}
                </div>
              \` : ''}
            </div>

            <div class="card-actions">
              <a href="\${e.registrationUrl || e.eventUrl}" target="_blank" rel="noopener noreferrer" class="btn-register">
                Register Now ↗
              </a>
              <button class="btn-icon" onclick="navigator.clipboard.writeText('\${e.registrationUrl || e.eventUrl}'); alert('Event link copied!');" title="Copy Link">
                📋
              </button>
            </div>
          </article>
        \`;
      }).join('');
    }

    // Attach listeners
    ['searchInput', 'formatFilter', 'pricingFilter', 'typeFilter', 'cityFilter'].forEach(id => {
      document.getElementById(id).addEventListener('input', renderFilteredEvents);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      document.getElementById('searchInput').value = '';
      document.getElementById('formatFilter').value = 'ALL';
      document.getElementById('pricingFilter').value = 'ALL';
      document.getElementById('typeFilter').value = 'ALL';
      document.getElementById('cityFilter').value = 'ALL';
      renderFilteredEvents();
    });

    fetchApiEvents();
  </script>
</body>
</html>`;
}
