/**
 * Eventador Web Portal & Discovery Frontend (MLH-Inspired Minimalist React SPA).
 * Clean, developer-grade, fast, and accessible. No excessive emojis or loud gradients.
 * Served globally at Cloudflare's edge in <30ms with 0 cold start.
 */

export function renderWebPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eventador — Verified Tech Events, Hackathons & Meetups</title>
  <meta name="description" content="Discover Verified online and in-person hackathons, meetups, conferences, and tech workshops with authentic first-party registration links.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- React 18 & Babel Standalone for clean, robust component architecture -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <style>
    :root {
      --bg: #0b0f19;
      --surface: #111827;
      --surface-hover: #1f2937;
      --border: #1f2937;
      --border-focus: #3b82f6;
      --text: #f9fafb;
      --text-muted: #9ca3af;
      --text-sub: #d1d5db;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --badge-free-bg: #064e3b;
      --badge-free-text: #6ee7b7;
      --badge-paid-bg: #78350f;
      --badge-paid-text: #fcd34d;
      --badge-online-bg: #0c4a6e;
      --badge-online-text: #7dd3fc;
      --badge-type-bg: #312e81;
      --badge-type-text: #c7d2fe;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    /* Minimalist Navigation (MLH Style) */
    .navbar {
      border-bottom: 1px solid var(--border);
      background-color: rgba(11, 15, 25, 0.95);
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(8px);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text);
    }
    .brand-icon {
      width: 28px;
      height: 28px;
      fill: #3b82f6;
    }
    .brand-title {
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .brand-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      background: #1e293b;
      color: #94a3b8;
      border: 1px solid #334155;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 500;
      text-decoration: none;
      color: var(--text-sub);
      background: var(--surface);
      border: 1px solid var(--border);
      transition: all 0.15s ease;
    }
    .nav-btn:hover {
      background: var(--surface-hover);
      color: var(--text);
      border-color: #374151;
    }

    /* Page Header */
    .header-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 1.5rem;
    }
    .header-title {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 0.5rem;
    }
    .header-desc {
      color: var(--text-muted);
      font-size: 1rem;
      max-width: 720px;
    }

    /* Filter Panel (Clean, Structured) */
    .filter-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem 2rem;
    }
    .filter-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .search-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 1rem;
      width: 18px;
      height: 18px;
      fill: var(--text-muted);
    }
    .search-input {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.7rem 1rem 0.7rem 2.75rem;
      color: var(--text);
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s ease;
    }
    .search-input:focus {
      border-color: var(--border-focus);
    }
    .search-input::placeholder {
      color: #6b7280;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 0.75rem;
    }
    .filter-col {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .filter-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .filter-select {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0.55rem 0.75rem;
      color: var(--text);
      font-size: 0.88rem;
      font-family: inherit;
      outline: none;
      cursor: pointer;
    }
    .filter-select:focus {
      border-color: var(--border-focus);
    }

    /* Quick Pills */
    .pill-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border);
    }
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .pill-btn {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-sub);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .pill-btn:hover {
      border-color: #4b5563;
      color: var(--text);
    }
    .pill-btn.active {
      background: #1e293b;
      border-color: #3b82f6;
      color: #60a5fa;
    }
    .reset-btn {
      background: transparent;
      border: none;
      color: #9ca3af;
      font-size: 0.8rem;
      cursor: pointer;
      text-decoration: underline;
    }
    .reset-btn:hover {
      color: var(--text);
    }

    /* Results Header */
    .results-bar {
      max-width: 1200px;
      margin: 0 auto 1rem;
      padding: 0 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    /* Event Cards Grid */
    .cards-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem 4rem;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.25rem;
    }
    .event-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: border-color 0.15s ease, transform 0.15s ease;
    }
    .event-card:hover {
      border-color: #374151;
      transform: translateY(-2px);
    }

    /* Badges */
    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .badge-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }
    .badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }
    .badge-type { background: var(--badge-type-bg); color: var(--badge-type-text); }
    .badge-online { background: var(--badge-online-bg); color: var(--badge-online-text); }
    .badge-free { background: var(--badge-free-bg); color: var(--badge-free-text); }
    .badge-paid { background: var(--badge-paid-bg); color: var(--badge-paid-text); }

    .card-title {
      font-size: 1.15rem;
      font-weight: 600;
      line-height: 1.35;
      margin-bottom: 0.35rem;
      color: var(--text);
    }
    .card-organizer {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .meta-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.84rem;
      color: var(--text-sub);
      background: var(--bg);
      padding: 0.75rem;
      border-radius: 6px;
      border: 1px solid #1e293b;
      margin-bottom: 1rem;
    }
    .meta-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .meta-icon {
      width: 14px;
      height: 14px;
      fill: #6b7280;
      flex-shrink: 0;
    }

    .card-footer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: auto;
    }
    .btn-register {
      flex: 1;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 0.4rem;
      background: var(--primary);
      color: #ffffff;
      padding: 0.6rem 1rem;
      border-radius: 6px;
      font-size: 0.88rem;
      font-weight: 600;
      text-decoration: none;
      transition: background-color 0.15s ease;
    }
    .btn-register:hover {
      background: var(--primary-hover);
    }
    .btn-secondary {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0.6rem 0.85rem;
      border-radius: 6px;
      font-size: 0.88rem;
      background: var(--bg);
      color: var(--text-sub);
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-secondary:hover {
      background: #1f2937;
      color: var(--text);
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .modal-box {
      background: var(--surface);
      border: 1px solid #374151;
      border-radius: 12px;
      max-width: 600px;
      width: 100%;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
    }
    .close-btn:hover {
      color: var(--text);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 1.5rem;
      color: var(--text-muted);
    }

    footer {
      border-top: 1px solid var(--border);
      padding: 2rem 1.5rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    @media (max-width: 640px) {
      .cards-grid { grid-template-columns: 1fr; }
      .header-title { font-size: 1.6rem; }
      .filter-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useMemo } = React;

    // SVG Icons
    const SvgRadar = () => (
      <svg className="brand-icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
      </svg>
    );

    const SvgCalendar = () => (
      <svg className="meta-icon" viewBox="0 0 20 20">
        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
      </svg>
    );

    const SvgMapPin = () => (
      <svg className="meta-icon" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
      </svg>
    );

    const SvgExternal = () => (
      <svg style={{ width: 14, height: 14, fill: "currentColor" }} viewBox="0 0 20 20">
        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
      </svg>
    );

    function App() {
      const [events, setEvents] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      
      // Filter states
      const [search, setSearch] = useState("");
      const [type, setType] = useState("ALL");
      const [format, setFormat] = useState("ALL");
      const [isFree, setIsFree] = useState("ALL");
      const [city, setCity] = useState("ALL");
      const [selectedEvent, setSelectedEvent] = useState(null);

      useEffect(() => {
        fetch("/api/events")
          .then((res) => res.json())
          .then((data) => {
            if (data && data.events) {
              setEvents(data.events);
            }
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      }, []);

      const filteredEvents = useMemo(() => {
        return events.filter((ev) => {
          if (type !== "ALL" && ev.event_type !== type) return false;
          if (format !== "ALL" && ev.format !== format) return false;
          if (isFree !== "ALL" && String(ev.is_free) !== String(isFree)) return false;
          if (city !== "ALL" && (!ev.city || !ev.city.toLowerCase().includes(city.toLowerCase()))) return false;
          
          if (search.trim()) {
            const q = search.toLowerCase();
            const titleMatch = ev.title && ev.title.toLowerCase().includes(q);
            const orgMatch = ev.organizer_name && ev.organizer_name.toLowerCase().includes(q);
            const cityMatch = ev.city && ev.city.toLowerCase().includes(q);
            if (!titleMatch && !orgMatch && !cityMatch) return false;
          }
          return true;
        });
      }, [events, search, type, format, isFree, city]);

      const resetFilters = () => {
        setSearch("");
        setType("ALL");
        setFormat("ALL");
        setIsFree("ALL");
        setCity("ALL");
      };

      const formatDate = (dateStr) => {
        if (!dateStr) return "TBD";
        try {
          const d = new Date(dateStr);
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        } catch {
          return dateStr;
        }
      };

      return (
        <div>
          {/* Top Navbar */}
          <header className="navbar">
            <div className="nav-container">
              <a href="/" className="brand">
                <SvgRadar />
                <span className="brand-title">Eventador</span>
                <span className="brand-tag">INTELLIGENCE</span>
              </a>
              <div className="nav-actions">
                <a href="https://t.me/EventadorBot" target="_blank" rel="noopener noreferrer" className="nav-btn">
                  Telegram Bot
                </a>
                <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="nav-btn">
                  Discord
                </a>
                <a href="https://github.com/SudiptaSanki/Eventador" target="_blank" rel="noopener noreferrer" className="nav-btn">
                  GitHub
                </a>
              </div>
            </div>
          </header>

          {/* Clean Headline (MLH Style) */}
          <section className="header-section">
            <h1 className="header-title">Developer & Tech Events</h1>
            <p className="header-desc">
              Verified tech hackathons, meetups, workshops, and summits across India and online. Authenticated first-party registration links only.
            </p>
          </section>

          {/* Filter Panel */}
          <section className="filter-wrapper">
            <div className="filter-box">
              {/* Search Bar */}
              <div className="search-input-wrap">
                <svg className="search-icon" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search events, organizers, technologies, cities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Dropdowns */}
              <div className="filter-grid">
                <div className="filter-col">
                  <label className="filter-label">Event Type</label>
                  <select className="filter-select" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="ALL">All Types</option>
                    <option value="HACKATHON">Hackathons</option>
                    <option value="MEETUP">Meetups</option>
                    <option value="CONFERENCE">Conferences</option>
                    <option value="WORKSHOP">Workshops</option>
                    <option value="COMPETITION">Competitions</option>
                  </select>
                </div>

                <div className="filter-col">
                  <label className="filter-label">Format / Mode</label>
                  <select className="filter-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option value="ALL">All Formats</option>
                    <option value="ONLINE">Online (Virtual)</option>
                    <option value="OFFLINE">In-Person (Offline)</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div className="filter-col">
                  <label className="filter-label">Pricing</label>
                  <select className="filter-select" value={isFree} onChange={(e) => setIsFree(e.target.value)}>
                    <option value="ALL">All Events</option>
                    <option value="1">Free to Attend</option>
                    <option value="0">Paid</option>
                  </select>
                </div>

                <div className="filter-col">
                  <label className="filter-label">Region / City</label>
                  <select className="filter-select" value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="ALL">All Locations</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
              </div>

              {/* Quick Pills & Clear */}
              <div className="pill-row">
                <div className="pills">
                  <button className={"pill-btn " + (format === "ONLINE" ? "active" : "")} onClick={() => setFormat(format === "ONLINE" ? "ALL" : "ONLINE")}>
                    Online Only
                  </button>
                  <button className={"pill-btn " + (isFree === "1" ? "active" : "")} onClick={() => setIsFree(isFree === "1" ? "ALL" : "1")}>
                    Free Events
                  </button>
                  <button className={"pill-btn " + (type === "HACKATHON" ? "active" : "")} onClick={() => setType(type === "HACKATHON" ? "ALL" : "HACKATHON")}>
                    Hackathons
                  </button>
                  <button className={"pill-btn " + (type === "MEETUP" ? "active" : "")} onClick={() => setType(type === "MEETUP" ? "ALL" : "MEETUP")}>
                    Meetups
                  </button>
                </div>
                {(search || type !== "ALL" || format !== "ALL" || isFree !== "ALL" || city !== "ALL") && (
                  <button className="reset-btn" onClick={resetFilters}>
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Results Bar */}
          <div className="results-bar">
            <span>Showing <strong>{filteredEvents.length}</strong> verified events</span>
            <span>Refreshed 24/7 by Eventador</span>
          </div>

          {/* Cards Grid */}
          <main className="cards-container">
            {loading ? (
              <div className="empty-state">Loading verified tech events...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="empty-state">
                <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No events found matching your filter criteria.</p>
                <button className="pill-btn" onClick={resetFilters}>Reset Filters</button>
              </div>
            ) : (
              <div className="cards-grid">
                {filteredEvents.map((ev) => (
                  <article key={ev.event_id} className="event-card">
                    <div>
                      <div className="card-top">
                        <div className="badge-group">
                          <span className="badge badge-type">{ev.event_type || "EVENT"}</span>
                          <span className="badge badge-online">{ev.format || "ONLINE"}</span>
                          <span className={"badge " + (ev.is_free === 0 ? "badge-paid" : "badge-free")}>
                            {ev.is_free === 0 ? "PAID" : "FREE"}
                          </span>
                        </div>
                      </div>

                      <h2 className="card-title">{ev.title}</h2>
                      <div className="card-organizer">{ev.organizer_name || "Community Partner"}</div>

                      <div className="meta-list">
                        <div className="meta-row">
                          <SvgCalendar />
                          <span>{formatDate(ev.start_date)} {ev.end_date ? "– " + formatDate(ev.end_date) : ""}</span>
                        </div>
                        <div className="meta-row">
                          <SvgMapPin />
                          <span>{ev.format === "ONLINE" ? "Online / Worldwide" : (ev.city ? ev.city + ", India" : "In-Person")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <a 
                        href={ev.registration_url || ev.event_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-register"
                      >
                        <span>Register</span>
                        <SvgExternal />
                      </a>
                      <button className="btn-secondary" onClick={() => setSelectedEvent(ev)}>
                        Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

          {/* Details Modal */}
          {selectedEvent && (
            <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <div className="badge-group" style={{ marginBottom: "0.5rem" }}>
                      <span className="badge badge-type">{selectedEvent.event_type}</span>
                      <span className="badge badge-online">{selectedEvent.format}</span>
                      <span className={"badge " + (selectedEvent.is_free === 0 ? "badge-paid" : "badge-free")}>
                        {selectedEvent.is_free === 0 ? "PAID" : "FREE"}
                      </span>
                    </div>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>{selectedEvent.title}</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Hosted by {selectedEvent.organizer_name || "Organizer"}</p>
                  </div>
                  <button className="close-btn" onClick={() => setSelectedEvent(null)}>&times;</button>
                </div>

                <div className="meta-list">
                  <div className="meta-row"><SvgCalendar /><span>Dates: {formatDate(selectedEvent.start_date)} to {formatDate(selectedEvent.end_date)}</span></div>
                  <div className="meta-row"><SvgMapPin /><span>Location: {selectedEvent.venue || selectedEvent.city || selectedEvent.format}</span></div>
                  {selectedEvent.registration_deadline && (
                    <div className="meta-row"><span>Deadline: {formatDate(selectedEvent.registration_deadline)}</span></div>
                  )}
                  {selectedEvent.price_detail && (
                    <div className="meta-row"><span>Price: {selectedEvent.price_detail}</span></div>
                  )}
                  {selectedEvent.prize && (
                    <div className="meta-row"><span>Prize / Benefits: {selectedEvent.prize}</span></div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <a 
                    href={selectedEvent.registration_url || selectedEvent.event_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-register"
                  >
                    <span>Visit Official Registration Page</span>
                    <SvgExternal />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Clean Footer */}
          <footer>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <span>&copy; {new Date().getFullYear()} Eventador. Open developer intelligence platform.</span>
              <span>All links verified first-party. No phishing, no redirects.</span>
            </div>
          </footer>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  </script>
</body>
</html>`;
}
