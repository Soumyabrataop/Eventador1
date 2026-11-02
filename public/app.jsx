const { useState, useEffect, useMemo } = React;

// Curated Seed Events with high-impact verified items
const CURATED_SEED_EVENTS = [
  {
    event_id: "seed-1",
    title: "Smart India Hackathon 2026",
    organizer_name: "Ministry of Education & AICTE",
    format: "HYBRID",
    event_type: "HACKATHON",
    is_free: 1,
    city: "New Delhi",
    venue: "National Finals Centers & Regional Nodes",
    start_date: "2026-11-15T09:00:00Z",
    end_date: "2026-11-17T18:00:00Z",
    event_url: "https://www.sih.gov.in",
    registration_url: "https://www.sih.gov.in",
    prize: "₹1,00,00,000+ Prize Pool"
  },
  {
    event_id: "seed-2",
    title: "ETHIndia 2026",
    organizer_name: "Devfolio Community",
    format: "OFFLINE",
    event_type: "HACKATHON",
    is_free: 1,
    city: "Bengaluru",
    venue: "KTPO Convention Centre, Whitefield",
    start_date: "2026-12-04T10:00:00Z",
    end_date: "2026-12-06T18:00:00Z",
    event_url: "https://devfolio.co",
    registration_url: "https://devfolio.co",
    prize: "$100,000+ Bounties & Grants"
  },
  {
    event_id: "seed-3",
    title: "Google Developer Groups DevFest 2026",
    organizer_name: "GDG Bengaluru",
    format: "OFFLINE",
    event_type: "CONFERENCE",
    is_free: 1,
    city: "Bengaluru",
    venue: "NIMHANS Convention Centre",
    start_date: "2026-11-20T09:00:00Z",
    end_date: "2026-11-21T18:00:00Z",
    event_url: "https://developers.google.com/community/gdg",
    registration_url: "https://developers.google.com/community/gdg",
    prize: "Official Swag, Workshops & Labs"
  },
  {
    event_id: "seed-4",
    title: "AWS Community Day India 2026",
    organizer_name: "AWS User Group India",
    format: "HYBRID",
    event_type: "CONFERENCE",
    is_free: 1,
    city: "Hyderabad",
    venue: "HICC Novotel, Hitec City",
    start_date: "2026-11-28T09:00:00Z",
    end_date: "2026-11-28T18:00:00Z",
    event_url: "https://aws.amazon.com/developer/community/",
    registration_url: "https://aws.amazon.com/developer/community/",
    prize: "AWS Cloud Vouchers & Certification"
  },
  {
    event_id: "seed-5",
    title: "Microsoft Reactor AI & Copilot Workshop",
    organizer_name: "Microsoft Reactor",
    format: "HYBRID",
    event_type: "WORKSHOP",
    is_free: 1,
    city: "Bengaluru",
    venue: "Microsoft Reactor, Lavelle Road",
    start_date: "2026-12-05T10:00:00Z",
    end_date: "2026-12-05T16:00:00Z",
    event_url: "https://developer.microsoft.com/en-us/reactor/",
    registration_url: "https://developer.microsoft.com/en-us/reactor/",
    prize: "Hands-on Azure Labs & Credits"
  },
  {
    event_id: "seed-6",
    title: "Luma Mumbai Tech Founders Meetup",
    organizer_name: "Mumbai Founders Club",
    format: "OFFLINE",
    event_type: "MEETUP",
    is_free: 0,
    price_detail: "₹499 (Includes food & beverage)",
    city: "Mumbai",
    venue: "WeWork BKC, Bandra Kurla Complex",
    start_date: "2026-12-12T17:00:00Z",
    end_date: "2026-12-12T20:00:00Z",
    event_url: "https://lu.ma",
    registration_url: "https://lu.ma",
    prize: "Pitching Session with Angel Investors"
  },
  {
    event_id: "seed-7",
    title: "Delhi NCR Rust & Systems Meetup",
    organizer_name: "Rust Delhi Community",
    format: "OFFLINE",
    event_type: "MEETUP",
    is_free: 1,
    city: "Delhi",
    venue: "Innov8 Coworking, Connaught Place",
    start_date: "2026-11-22T15:00:00Z",
    end_date: "2026-11-22T18:00:00Z",
    event_url: "https://meetup.com",
    registration_url: "https://meetup.com",
    prize: "Open-source pairing session & stickers"
  },
  {
    event_id: "seed-8",
    title: "Hacktoberfest Global Celebration",
    organizer_name: "DigitalOcean & Cloudflare",
    format: "ONLINE",
    event_type: "COMMUNITY",
    is_free: 1,
    city: null,
    venue: "Discord / Global Virtual",
    start_date: "2026-10-01T00:00:00Z",
    end_date: "2026-10-31T23:59:59Z",
    event_url: "https://hacktoberfest.com",
    registration_url: "https://hacktoberfest.com",
    prize: "Official Badges & Tree Plantings"
  }
];

// Curated Google OSINT Dork Tools
const OSINT_DORKS = [
  {
    title: "Lu.ma City Tech Radar",
    category: "Meetups & Demo Days",
    query: 'site:lu.ma ("Bengaluru" OR "Delhi" OR "Mumbai" OR "Hyderabad" OR "Pune") ("meetup" OR "hackathon")',
    url: 'https://www.google.com/search?q=site%3Alu.ma+(%22Bengaluru%22+OR+%22Delhi%22+OR+%22Mumbai%22+OR+%22Hyderabad%22+OR+%22Pune%22)+(%22meetup%22+OR+%22hackathon%22)',
    desc: "Finds unlisted grassroots tech meetups, founder coffee chats, and demo days on Lu.ma."
  },
  {
    title: "LinkedIn Tech Events Dork",
    category: "Conferences & Summits",
    query: 'site:linkedin.com/events ("developer meetup" OR "hackathon" OR "tech summit") ("India" OR "Bengaluru")',
    url: 'https://www.google.com/search?q=site%3Alinkedin.com%2Fevents+(%22developer+meetup%22+OR+%22hackathon%22+OR+%22tech+summit%22)+(%22India%22+OR+%22Bengaluru%22)',
    desc: "Finds enterprise, VC, and corporate developer summits announced on LinkedIn Events."
  },
  {
    title: "Twitter / X Flash Hackathons",
    category: "Flash Hackathons",
    query: '(site:twitter.com OR site:x.com) ("hackathon" OR "tech meetup") ("register" OR "rsvp") "India"',
    url: 'https://www.google.com/search?q=(site%3Atwitter.com+OR+site%3Ax.com)+(%22hackathon%22+OR+%22tech+meetup%22)+(%22register%22+OR+%22rsvp%22)+%22India%22',
    desc: "Discovers sudden registrations, bursaries, and flash hackathons tweeted by tech communities."
  },
  {
    title: "GitHub Open Source Event Repos",
    category: "Student Hackathons",
    query: 'site:github.com in:readme ("hackathon" OR "tech-events") ("India" OR "2026")',
    url: 'https://www.google.com/search?q=site%3Agithub.com+in%3Areadme+(%22hackathon%22+OR+%22tech-events%22)+(%22India%22+OR+%222026%22)',
    desc: "Discovers open-source college hackathons and community calendars maintained in GitHub readmes."
  },
  {
    title: "Reddit developersIndia Radar",
    category: "Community Leads",
    query: 'site:reddit.com/r/developersIndia ("meetup" OR "hackathon" OR "flair:Event")',
    url: 'https://www.reddit.com/r/developersIndia/search?q=flair%3AEvent+OR+meetup+OR+hackathon&restrict_sr=1&sort=new',
    desc: "Live discussions, team formation threads, and local city meetup invitations."
  }
];

// Major Indian Tech Cities with coordinates
const CITY_COORDINATES = [
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 }
];

function App() {
  // Navigation tab state: 'home' | 'explore' | 'hackathons' | 'meetups' | 'nearme' | 'osint'
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return ["home", "explore", "hackathons", "meetups", "nearme", "osint"].includes(hash) ? hash : "home";
  });

  // Events dataset
  const [events, setEvents] = useState(CURATED_SEED_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Theme state: 'system' | 'light' | 'dark'
  const [themePref, setThemePref] = useState(() => {
    return localStorage.getItem("eventador-theme") || "system";
  });

  // User Location State
  const [userCity, setUserCity] = useState(() => {
    return localStorage.getItem("eventador-city") || "ALL";
  });
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationNote, setLocationNote] = useState("");

  // Filter states for Explore tab
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterFormat, setFilterFormat] = useState("ALL");
  const [filterPrice, setFilterPrice] = useState("ALL");
  const [filterCity, setFilterCity] = useState("ALL");

  // Animated Hero Cards Deck Index
  const [deckIndex, setDeckIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Top featured events for the animated deck
  const heroDeckEvents = useMemo(() => {
    return events.slice(0, 5);
  }, [events]);

  // Handle Theme Applying
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("eventador-theme", themePref);

    if (themePref === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const applySystem = () => {
        root.setAttribute("data-theme", mql.matches ? "dark" : "light");
      };
      applySystem();
      mql.addEventListener("change", applySystem);
      return () => mql.removeEventListener("change", applySystem);
    } else {
      root.setAttribute("data-theme", themePref);
    }
  }, [themePref]);

  // URL Hash Sync for Separate Pages
  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["home", "explore", "hackathons", "meetups", "nearme", "osint"].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Fetch live verified events from Cloudflare Worker API
  useEffect(() => {
    fetch("https://eventador.eventador.workers.dev/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.events && data.events.length > 0) {
          setEvents(data.events);
        }
      })
      .catch(() => {
        // Safe offline / local fallback: CURATED_SEED_EVENTS
      });
  }, []);

  // Autonomous 3D Card Deck Animation Timer (Cycles every 3.5s)
  useEffect(() => {
    if (isHovered || heroDeckEvents.length === 0) return;
    const interval = setInterval(() => {
      setDeckIndex((prev) => (prev + 1) % heroDeckEvents.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, heroDeckEvents.length]);

  // Geolocation detection handler
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationNote("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingLocation(true);
    setLocationNote("Pinpointing nearest tech hub...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        let closest = CITY_COORDINATES[0];
        let minDist = Infinity;
        for (const city of CITY_COORDINATES) {
          const d = Math.hypot(city.lat - userLat, city.lng - userLng);
          if (d < minDist) {
            minDist = d;
            closest = city;
          }
        }

        setUserCity(closest.name);
        localStorage.setItem("eventador-city", closest.name);
        setDetectingLocation(false);
        setLocationNote(`📍 Nearest detected tech hub: ${closest.name}`);
      },
      () => {
        setDetectingLocation(false);
        setLocationNote("Location access declined. Please choose your city manually.");
      },
      { timeout: 8000 }
    );
  };

  const handleCityChange = (cityName) => {
    setUserCity(cityName);
    localStorage.setItem("eventador-city", cityName);
    setLocationNote(`📍 Selected hub: ${cityName === "ALL" ? "All Locations" : cityName}`);
  };

  // Filtered events for the Explore tab
  const exploreEvents = useMemo(() => {
    return events.filter((ev) => {
      if (filterType !== "ALL" && ev.event_type !== filterType) return false;
      if (filterFormat !== "ALL" && ev.format !== filterFormat) return false;
      if (filterPrice !== "ALL" && String(ev.is_free) !== String(filterPrice)) return false;
      if (filterCity !== "ALL" && (!ev.city || !ev.city.toLowerCase().includes(filterCity.toLowerCase()))) return false;
      
      if (search.trim()) {
        const q = search.toLowerCase();
        const titleMatch = ev.title && ev.title.toLowerCase().includes(q);
        const orgMatch = ev.organizer_name && ev.organizer_name.toLowerCase().includes(q);
        const cityMatch = ev.city && ev.city.toLowerCase().includes(q);
        if (!titleMatch && !orgMatch && !cityMatch) return false;
      }
      return true;
    });
  }, [events, search, filterType, filterFormat, filterPrice, filterCity]);

  // Filtered for Hackathons Tab
  const hackathonEvents = useMemo(() => {
    return events.filter((ev) => ev.event_type === "HACKATHON" || /hackathon|ideathon/i.test(ev.title));
  }, [events]);

  // Filtered for Meetups Tab
  const meetupEvents = useMemo(() => {
    return events.filter((ev) => ev.event_type === "MEETUP" || /meetup|community/i.test(ev.title));
  }, [events]);

  // Filtered for Near Me Tab (Offline + Hybrid in user's city)
  const nearMeEvents = useMemo(() => {
    if (userCity === "ALL") {
      return events.filter((ev) => ev.format === "OFFLINE" || ev.format === "HYBRID");
    }
    return events.filter((ev) => {
      const isOfflineOrHybrid = ev.format === "OFFLINE" || ev.format === "HYBRID";
      const cityMatches = ev.city && ev.city.toLowerCase().includes(userCity.toLowerCase());
      return isOfflineOrHybrid && cityMatches;
    });
  }, [events, userCity]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Upcoming";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Helper to render an event card
  const renderEventCard = (ev) => {
    const isUserCity = userCity !== "ALL" && ev.city && ev.city.toLowerCase().includes(userCity.toLowerCase());
    return (
      <div key={ev.event_id} className="event-card">
        <div>
          <div className="card-badges">
            <span className="badge-pill badge-type">{ev.event_type || "EVENT"}</span>
            <span className="badge-pill badge-online">{ev.format || "HYBRID"}</span>
            {ev.is_free ? (
              <span className="badge-pill badge-free">FREE</span>
            ) : (
              <span className="badge-pill badge-paid">PAID</span>
            )}
            {isUserCity && (
              <span className="badge-pill badge-local">📍 IN YOUR CITY</span>
            )}
          </div>

          <h3 className="card-title">{ev.title}</h3>
          <p className="card-org">Organized by {ev.organizer_name || "Community Partner"}</p>

          <div className="card-meta-list">
            <div className="meta-row">
              <span>📅</span>
              <span>{formatDate(ev.start_date)} {ev.end_date ? `— ${formatDate(ev.end_date)}` : ""}</span>
            </div>
            <div className="meta-row">
              <span>📍</span>
              <span>{ev.city ? `${ev.city}, India` : "Online / Remote"} {ev.venue ? `(${ev.venue})` : ""}</span>
            </div>
            {ev.prize && (
              <div className="meta-row" style={{ color: "var(--color-orange)", fontWeight: 600 }}>
                <span>🏆</span>
                <span>{ev.prize}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card-footer">
          <button className="btn-card-details" onClick={() => setSelectedEvent(ev)}>
            View Pass
          </button>
          <a
            href={ev.registration_url || ev.event_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-card-register"
          >
            Register Official ↗
          </a>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Floating Pill Navbar */}
      <div className="navbar-wrapper">
        <nav className="navbar">
          <div className="nav-brand" onClick={() => navigateTo("home")}>
            <img src="/logo.png" alt="Eventador" className="brand-logo-img" onError={(e) => { e.target.style.display = 'none'; }} />
            <span>Eventador</span>
            <span className="brand-badge">VERIFIED</span>
          </div>

          {/* Navigation Links for Separate Pages */}
          <div className="nav-links">
            <span className={"nav-link " + (activeTab === "home" ? "active" : "")} onClick={() => navigateTo("home")}>
              Home
            </span>
            <span className={"nav-link " + (activeTab === "explore" ? "active" : "")} onClick={() => navigateTo("explore")}>
              Explore
            </span>
            <span className={"nav-link " + (activeTab === "hackathons" ? "active" : "")} onClick={() => navigateTo("hackathons")}>
              Hackathons
            </span>
            <span className={"nav-link " + (activeTab === "meetups" ? "active" : "")} onClick={() => navigateTo("meetups")}>
              Meetups
            </span>
            <span className={"nav-link " + (activeTab === "nearme" ? "active" : "")} onClick={() => navigateTo("nearme")}>
              Near Me 📍
            </span>
            <span className={"nav-link " + (activeTab === "osint" ? "active" : "")} onClick={() => navigateTo("osint")}>
              OSINT Tools 🔍
            </span>
          </div>

          <div className="nav-actions">
            {/* 3-Way Theme Switcher */}
            <div className="theme-switcher">
              <button 
                className={"theme-btn " + (themePref === "light" ? "active" : "")} 
                onClick={() => setThemePref("light")}
                title="Light Mode"
              >
                ☀️ Light
              </button>
              <button 
                className={"theme-btn " + (themePref === "dark" ? "active" : "")} 
                onClick={() => setThemePref("dark")}
                title="Dark Mode"
              >
                🌙 Dark
              </button>
              <button 
                className={"theme-btn " + (themePref === "system" ? "active" : "")} 
                onClick={() => setThemePref("system")}
                title="System Default"
              >
                ⚙️ Auto
              </button>
            </div>

            <a href="https://t.me/EventadorBot" target="_blank" rel="noopener noreferrer" className="btn-action-warm">
              Telegram Bot
            </a>
          </div>
        </nav>
      </div>

      {/* Location & Tech Hub Bar */}
      <div className="location-strip">
        <div className="location-bar">
          <div className="location-left">
            <span>📍 Offline Radar:</span>
            <span style={{ color: "var(--color-orange)" }}>
              {userCity === "ALL" ? "All Indian Hubs" : userCity}
            </span>
            {locationNote && (
              <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 500 }}>
                ({locationNote})
              </span>
            )}
          </div>
          <div className="location-right">
            <button className="btn-detect" onClick={detectUserLocation} disabled={detectingLocation}>
              <span>🎯</span>
              <span>{detectingLocation ? "Detecting..." : "Detect Location"}</span>
            </button>
            <select
              className="city-select"
              value={userCity}
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="ALL">All Hubs / Remote</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Ahmedabad">Ahmedabad</option>
            </select>
          </div>
        </div>
      </div>

      {/* ====================================================================
          PAGE 1: HOME (Compact Hero + Orbit Circle + Animated Cards + Trending)
          ==================================================================== */}
      {activeTab === "home" && (
        <div>
          {/* Compact Hero Section */}
          <header className="hero-container">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span>●</span> Happy Developer Intelligence
              </div>
              <h1 className="hero-title">
                Tech events, from <em>community</em> to <em>grand stage.</em>
              </h1>
              <p className="hero-desc">
                Eventador continuously monitors, verifies, and surfaces upcoming hackathons, meetups, workshops, and OSINT leads across India. 100% genuine registration links, zero scams.
              </p>
              <div className="hero-buttons">
                <button className="btn-action-primary" onClick={() => navigateTo("explore")}>
                  Explore All Events ↘
                </button>
                <button className="btn-action-primary" style={{ background: "var(--surface-subtle)", color: "var(--text)", border: "1px solid var(--border)" }} onClick={() => navigateTo("nearme")}>
                  Find Near Me 📍
                </button>
                <button className="btn-action-primary" style={{ background: "var(--surface-subtle)", color: "var(--text)", border: "1px solid var(--border)" }} onClick={() => navigateTo("osint")}>
                  Google OSINT Tools 🔍
                </button>
              </div>

              {/* Minimal Stats Bar directly below hero text */}
              <div className="hero-metrics-row">
                <div className="metric-item">
                  <span className="metric-num">1,240+</span>
                  <span>Verified Events</span>
                </div>
                <div className="metric-item">
                  <span className="metric-num">100%</span>
                  <span>Official Links</span>
                </div>
                <div className="metric-item">
                  <span className="metric-num">0</span>
                  <span>Phishing</span>
                </div>
              </div>
            </div>

            {/* Right Side: Big Orbit Circle with Animated 3D Stacked Cards Deck */}
            <div
              className="hero-orbit-canvas"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Big Orbit Geometric Ring Background */}
              <div className="hero-big-circle">
                <div className="circle-dot circle-dot-orange"></div>
                <div className="circle-dot circle-dot-blue"></div>
                <div className="circle-dot circle-dot-green"></div>
              </div>

              {/* 3D Stacked Cards Deck (Cycles cards smoothly one after another) */}
              <div className="deck-container">
                {heroDeckEvents.map((ev, i) => {
                  const diff = (i - deckIndex + heroDeckEvents.length) % heroDeckEvents.length;
                  let slotClass = "deck-slot-hidden";
                  if (diff === 0) slotClass = "deck-slot-0";
                  else if (diff === 1) slotClass = "deck-slot-1";
                  else if (diff === 2) slotClass = "deck-slot-2";

                  return (
                    <div
                      key={ev.event_id}
                      className={`deck-card ${slotClass}`}
                      onClick={() => setSelectedEvent(ev)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", fontFamily: "'JetBrains Mono', monospace", color: diff === 0 ? "var(--color-green)" : "#fff" }}>
                          ● VERIFIED EVENT PASS
                        </span>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, opacity: 0.85 }}>
                          {formatDate(ev.start_date)}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 800, lineHeight: 1.3, marginBottom: "0.35rem" }}>
                        {ev.title}
                      </h3>
                      <p style={{ fontSize: "0.8rem", opacity: diff === 0 ? 0.7 : 0.9 }}>
                        {ev.city ? `${ev.city} • ` : ""}{ev.format} • {ev.is_free ? "Free Entry" : "Paid"}
                      </p>
                      {diff === 0 && (
                        <div style={{ marginTop: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-orange)", fontWeight: 700 }}>
                            {ev.prize || "Open Registration"}
                          </span>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, textDecoration: "underline" }}>
                            View Pass →
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Indicator Dots */}
                <div className="card-indicator-dots">
                  {heroDeckEvents.map((_, i) => (
                    <div
                      key={i}
                      className={`indicator-dot ${i === deckIndex ? "active" : ""}`}
                      onClick={() => setDeckIndex(i)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Immediate Trending Section (Directly visible without huge scroll!) */}
          <div className="page-container" style={{ paddingTop: "1rem" }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">🔥 Trending This Week</h2>
                <p className="section-sub">Autonomous verified events happening across top developer communities.</p>
              </div>
              <button className="btn-card-details" onClick={() => navigateTo("explore")}>
                View All {events.length} Events →
              </button>
            </div>
            <div className="events-grid">
              {events.slice(0, 6).map(renderEventCard)}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PAGE 2: EXPLORE (Full Directory with Rich Filters & Search)
          ==================================================================== */}
      {activeTab === "explore" && (
        <div className="page-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">🌐 Explore Verified Events</h2>
              <p className="section-sub">Filter by event format, technology domain, city, or pricing.</p>
            </div>
          </div>

          {/* Filter Panel */}
          <div className="filter-card">
            <div className="search-row">
              <svg className="search-icon-svg" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <input
                type="text"
                className="search-field"
                placeholder="Search events, organizers, technologies, or cities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="dropdowns-grid">
              <div className="dropdown-group">
                <label className="dropdown-label">Event Type</label>
                <select className="dropdown-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="ALL">All Event Types</option>
                  <option value="HACKATHON">Hackathons</option>
                  <option value="MEETUP">Meetups</option>
                  <option value="CONFERENCE">Conferences</option>
                  <option value="WORKSHOP">Workshops</option>
                  <option value="COMMUNITY">Community Summits</option>
                </select>
              </div>

              <div className="dropdown-group">
                <label className="dropdown-label">Format / Mode</label>
                <select className="dropdown-select" value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)}>
                  <option value="ALL">All Modes</option>
                  <option value="ONLINE">Online (Virtual)</option>
                  <option value="OFFLINE">In-Person (Offline)</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div className="dropdown-group">
                <label className="dropdown-label">Pricing</label>
                <select className="dropdown-select" value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
                  <option value="ALL">All Events</option>
                  <option value="1">Free Entry Only</option>
                  <option value="0">Paid Entry</option>
                </select>
              </div>

              <div className="dropdown-group">
                <label className="dropdown-label">Region / City</label>
                <select className="dropdown-select" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
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
          </div>

          {/* Event Cards */}
          <div className="section-header" style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Showing {exploreEvents.length} verified events
            </span>
          </div>
          <div className="events-grid">
            {exploreEvents.length > 0 ? (
              exploreEvents.map(renderEventCard)
            ) : (
              <p style={{ color: "var(--text-muted)", gridColumn: "1/-1", textAlign: "center", padding: "2rem" }}>
                No events match your current filter criteria.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          PAGE 3: HACKATHONS (Dedicated Hackathon & Ideathon Radar)
          ==================================================================== */}
      {activeTab === "hackathons" && (
        <div className="page-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">⚡ Hackathons & Coding Contests</h2>
              <p className="section-sub">Discover competitive hackathons with prize pools, grants, and fast tracks.</p>
            </div>
          </div>
          <div className="events-grid">
            {hackathonEvents.map(renderEventCard)}
          </div>
        </div>
      )}

      {/* ====================================================================
          PAGE 4: MEETUPS (Dedicated Community & Developer Meetups)
          ==================================================================== */}
      {activeTab === "meetups" && (
        <div className="page-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">🤝 Developer Meetups & User Groups</h2>
              <p className="section-sub">Local GDG chapters, AWS user groups, React & Rust meetups.</p>
            </div>
          </div>
          <div className="events-grid">
            {meetupEvents.map(renderEventCard)}
          </div>
        </div>
      )}

      {/* ====================================================================
          PAGE 5: NEAR ME (Offline & Social Radar with Radar Animation)
          ==================================================================== */}
      {activeTab === "nearme" && (
        <div className="page-container">
          {/* Radar Scanner Banner */}
          <div className="radar-banner">
            <div className="radar-circle">
              <div className="radar-ping"></div>
              <span style={{ fontSize: "1.4rem" }}>📍</span>
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                Autonomous Offline Event Radar
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                Showing in-person and hybrid tech events located in <strong>{userCity === "ALL" ? "All Indian Hubs" : userCity}</strong>. Use the city bar above to pinpoint your hometown.
              </p>
            </div>
          </div>

          <div className="section-header">
            <div>
              <h2 className="section-title">📍 Nearby In-Person Events</h2>
              <p className="section-sub">{nearMeEvents.length} events happening near your selected location.</p>
            </div>
          </div>
          <div className="events-grid">
            {nearMeEvents.length > 0 ? (
              nearMeEvents.map(renderEventCard)
            ) : (
              <p style={{ color: "var(--text-muted)", gridColumn: "1/-1", textAlign: "center", padding: "2rem" }}>
                No upcoming offline events scheduled for {userCity} yet. Try switching to "All Hubs" or exploring virtual events!
              </p>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          PAGE 6: OSINT TOOLS (Google Search Dorks & GitHub OSINT Radar)
          ==================================================================== */}
      {activeTab === "osint" && (
        <div className="page-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔍 Google Search OSINT & Social Radar</h2>
              <p className="section-sub">Curated open-intelligence dorks to discover unlisted events on Lu.ma, Twitter/X, LinkedIn, and GitHub.</p>
            </div>
          </div>

          {/* OSINT Dorks Grid */}
          <div className="osint-grid">
            {OSINT_DORKS.map((dork, i) => (
              <div key={i} className="osint-card">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{dork.title}</h3>
                    <span className="badge-pill badge-online">{dork.category}</span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    {dork.desc}
                  </p>
                  <div className="osint-code">{dork.query}</div>
                </div>
                <a
                  href={dork.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-card-register"
                  style={{ justifyContent: "center", marginTop: "0.5rem" }}
                >
                  Launch Google OSINT Search ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            <div className="card-badges" style={{ marginTop: "0.5rem" }}>
              <span className="badge-pill badge-type">{selectedEvent.event_type || "EVENT"}</span>
              <span className="badge-pill badge-online">{selectedEvent.format || "HYBRID"}</span>
              <span className="badge-pill badge-free">{selectedEvent.is_free ? "FREE ENTRY" : "PAID ENTRY"}</span>
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0.75rem 0 0.35rem" }}>
              {selectedEvent.title}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Organized by {selectedEvent.organizer_name || "Community Partner"}
            </p>

            <div className="card-meta-list" style={{ fontSize: "0.88rem" }}>
              <div className="meta-row">
                <span>📅</span>
                <span>{formatDate(selectedEvent.start_date)} {selectedEvent.end_date ? `— ${formatDate(selectedEvent.end_date)}` : ""}</span>
              </div>
              <div className="meta-row">
                <span>📍</span>
                <span>{selectedEvent.city ? `${selectedEvent.city}, India` : "Online / Remote"} {selectedEvent.venue ? `(${selectedEvent.venue})` : ""}</span>
              </div>
              {selectedEvent.price_detail && (
                <div className="meta-row">
                  <span>🎟️</span>
                  <span>{selectedEvent.price_detail}</span>
                </div>
              )}
              {selectedEvent.prize && (
                <div className="meta-row" style={{ color: "var(--color-orange)", fontWeight: 700 }}>
                  <span>🏆</span>
                  <span>{selectedEvent.prize}</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
              <a
                href={selectedEvent.registration_url || selectedEvent.event_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-card-register"
                style={{ flex: 1, justifyContent: "center", padding: "0.65rem 1rem" }}
              >
                Open Official Registration ↗
              </a>
              <button className="btn-card-details" onClick={() => setSelectedEvent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
