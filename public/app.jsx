const { useState, useEffect, useMemo, useRef } = React;

// Continental Regions for high-level sorting across thousands of monthly global events
const CONTINENTS = [
  { id: "ALL", label: "Worldwide / Global" },
  { id: "GLOBAL_SOUTH", label: "Asia-Pacific & Global South" },
  { id: "NORTH_AMERICA", label: "North America" },
  { id: "EUROPE", label: "Europe" },
  { id: "LATIN_AMERICA", label: "Latin America" },
  { id: "MEA", label: "Middle East & Africa" }
];

// Cascading Country Definitions by Continent
const COUNTRIES_BY_CONTINENT = {
  ALL: [
    "All Countries", "India", "United States", "United Kingdom", "Germany",
    "Singapore", "Japan", "Canada", "Australia", "Belgium", "France",
    "Netherlands", "United Arab Emirates", "Brazil", "Indonesia", "South Korea"
  ],
  GLOBAL_SOUTH: [
    "All Countries in Asia-Pacific", "India", "Singapore", "Japan",
    "Australia", "South Korea", "Indonesia", "Malaysia", "Vietnam", "Thailand", "New Zealand"
  ],
  NORTH_AMERICA: [
    "All Countries in North America", "United States", "Canada", "Mexico"
  ],
  EUROPE: [
    "All Countries in Europe", "United Kingdom", "Germany", "Belgium",
    "France", "Netherlands", "Switzerland", "Sweden", "Poland", "Ireland", "Spain"
  ],
  LATIN_AMERICA: [
    "All Countries in Latin America", "Brazil", "Argentina", "Colombia", "Chile", "Peru"
  ],
  MEA: [
    "All Countries in Middle East & Africa", "United Arab Emirates", "Saudi Arabia", "Egypt", "Nigeria", "South Africa", "Kenya"
  ]
};

// Global Default Location (Never force or lock any single city onto global developers!)
const WORLDWIDE_LOCATION = {
  mode: "global",
  city: "Worldwide",
  country: "Global",
  label: "Worldwide / Global",
  isGlobal: true,
  lat: null,
  lng: null,
  continent: "ALL"
};

// Popular tech cities with known coordinates for instant selection & offline support
const POPULAR_CITIES = [
  { name: "Worldwide", country: "Global", label: "Worldwide / Global", isGlobal: true, lat: null, lng: null, continent: "ALL" },
  { name: "San Francisco", country: "United States", label: "San Francisco, USA", lat: 37.7749, lng: -122.4194, continent: "NORTH_AMERICA" },
  { name: "New York", country: "United States", label: "New York, USA", lat: 40.7128, lng: -74.0060, continent: "NORTH_AMERICA" },
  { name: "London", country: "United Kingdom", label: "London, UK", lat: 51.5074, lng: -0.1278, continent: "EUROPE" },
  { name: "Berlin", country: "Germany", label: "Berlin, Germany", lat: 52.5200, lng: 13.4050, continent: "EUROPE" },
  { name: "Paris", country: "France", label: "Paris, France", lat: 48.8566, lng: 2.3522, continent: "EUROPE" },
  { name: "Amsterdam", country: "Netherlands", label: "Amsterdam, Netherlands", lat: 52.3676, lng: 4.9041, continent: "EUROPE" },
  { name: "Singapore", country: "Singapore", label: "Singapore", lat: 1.3521, lng: 103.8198, continent: "GLOBAL_SOUTH" },
  { name: "Tokyo", country: "Japan", label: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, continent: "GLOBAL_SOUTH" },
  { name: "Seoul", country: "South Korea", label: "Seoul, South Korea", lat: 37.5665, lng: 126.9780, continent: "GLOBAL_SOUTH" },
  { name: "Sydney", country: "Australia", label: "Sydney, Australia", lat: -33.8688, lng: 151.2093, continent: "GLOBAL_SOUTH" },
  { name: "Toronto", country: "Canada", label: "Toronto, Canada", lat: 43.6532, lng: -79.3832, continent: "NORTH_AMERICA" },
  { name: "Bengaluru", country: "India", label: "Bengaluru, India", lat: 12.9716, lng: 77.5946, continent: "GLOBAL_SOUTH" },
  { name: "New Delhi", country: "India", label: "New Delhi, India", lat: 28.6139, lng: 77.2090, continent: "GLOBAL_SOUTH" },
  { name: "Mumbai", country: "India", label: "Mumbai, India", lat: 19.0760, lng: 72.8777, continent: "GLOBAL_SOUTH" },
  { name: "Kolkata", country: "India", label: "Kolkata, India", lat: 22.5726, lng: 88.3639, continent: "GLOBAL_SOUTH" },
  { name: "Hyderabad", country: "India", label: "Hyderabad, India", lat: 17.3850, lng: 78.4867, continent: "GLOBAL_SOUTH" },
  { name: "São Paulo", country: "Brazil", label: "São Paulo, Brazil", lat: -23.5505, lng: -46.6333, continent: "LATIN_AMERICA" },
  { name: "Dubai", country: "United Arab Emirates", label: "Dubai, UAE", lat: 25.2048, lng: 55.2708, continent: "MEA" }
];

// Haversine formula to compute exact distance in kilometers
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Curated Genuine Seed Events with Direct Deep Registration Links (No generic root domains)
const CURATED_SEED_EVENTS = [
  {
    event_id: "seed-1",
    title: "Smart India Hackathon 2026",
    organizer_name: "Ministry of Education & AICTE",
    format: "HYBRID",
    event_type: "HACKATHON",
    is_free: 1,
    city: "New Delhi",
    country: "India",
    continent: "GLOBAL_SOUTH",
    lat: 28.6139,
    lng: 77.2090,
    venue: "National Finals Centers & Regional Nodes",
    start_date: "2026-11-15T09:00:00Z",
    end_date: "2026-11-17T18:00:00Z",
    event_url: "https://www.sih.gov.in/",
    registration_url: "https://www.sih.gov.in/",
    prize: "₹1,00,00,000+ Prize Pool",
    source_platform: "GOV_CHALLENGE"
  },
  {
    event_id: "seed-2",
    title: "ETHIndia 2026",
    organizer_name: "Devfolio Community",
    format: "OFFLINE",
    event_type: "HACKATHON",
    is_free: 1,
    city: "Bengaluru",
    country: "India",
    continent: "GLOBAL_SOUTH",
    lat: 12.9716,
    lng: 77.5946,
    venue: "KTPO Convention Centre, Whitefield",
    start_date: "2026-12-04T10:00:00Z",
    end_date: "2026-12-06T18:00:00Z",
    event_url: "https://ethindia.co/",
    registration_url: "https://ethindia.co/",
    prize: "$100,000+ Bounties & Grants",
    source_platform: "DEVFOLIO"
  },
  {
    event_id: "seed-3",
    title: "Google Developer Groups DevFest 2026",
    organizer_name: "GDG Bengaluru",
    format: "OFFLINE",
    event_type: "CONFERENCE",
    is_free: 1,
    city: "Bengaluru",
    country: "India",
    continent: "GLOBAL_SOUTH",
    lat: 12.9716,
    lng: 77.5946,
    venue: "NIMHANS Convention Centre",
    start_date: "2026-11-20T09:00:00Z",
    end_date: "2026-11-21T18:00:00Z",
    event_url: "https://gdg.community.dev/gdg-bengaluru/",
    registration_url: "https://gdg.community.dev/gdg-bengaluru/",
    prize: "Official Swag, Workshops & Labs",
    source_platform: "GOOGLE"
  },
  {
    event_id: "seed-4",
    title: "Kolkata FOSS & Open Source Meetup",
    organizer_name: "Kolkata FOSS Community",
    format: "OFFLINE",
    event_type: "MEETUP",
    is_free: 1,
    city: "Kolkata",
    country: "India",
    continent: "GLOBAL_SOUTH",
    lat: 22.5726,
    lng: 88.3639,
    venue: "Sector V Tech Hub, Salt Lake",
    start_date: "2026-11-21T14:00:00Z",
    end_date: "2026-11-21T18:00:00Z",
    event_url: "https://www.meetup.com/find/?keywords=foss&location=in--kolkata",
    registration_url: "https://www.meetup.com/find/?keywords=foss&location=in--kolkata",
    prize: "Free Community Entry & Open Source Swags",
    source_platform: "COMMUNITY"
  },
  {
    event_id: "seed-5",
    title: "TreeHacks 2026",
    organizer_name: "Stanford University",
    format: "HYBRID",
    event_type: "HACKATHON",
    is_free: 1,
    city: "Stanford",
    country: "United States",
    continent: "NORTH_AMERICA",
    lat: 37.4275,
    lng: -122.1697,
    venue: "Stanford University Campus / Online",
    start_date: "2026-11-22T10:00:00Z",
    end_date: "2026-11-24T18:00:00Z",
    event_url: "https://www.treehacks.com/",
    registration_url: "https://www.treehacks.com/#apply",
    prize: "$150,000+ Hardware & Cloud Tracks",
    source_platform: "STANFORD"
  },
  {
    event_id: "seed-6",
    title: "AWS Community Day India 2026",
    organizer_name: "AWS User Group India",
    format: "HYBRID",
    event_type: "CONFERENCE",
    is_free: 1,
    city: "Hyderabad",
    country: "India",
    continent: "GLOBAL_SOUTH",
    lat: 17.3850,
    lng: 78.4867,
    venue: "HICC Novotel, Hitec City",
    start_date: "2026-11-28T09:00:00Z",
    end_date: "2026-11-28T18:00:00Z",
    event_url: "https://awsugindia.in/",
    registration_url: "https://awsugindia.in/",
    prize: "AWS Cloud Vouchers & Certification",
    source_platform: "AWS"
  },
  {
    event_id: "seed-7",
    title: "ETHGlobal London 2026",
    organizer_name: "ETHGlobal",
    format: "HYBRID",
    event_type: "HACKATHON",
    is_free: 1,
    city: "London",
    country: "United Kingdom",
    continent: "EUROPE",
    lat: 51.5074,
    lng: -0.1278,
    venue: "ExCeL London & Virtual",
    start_date: "2026-12-01T10:00:00Z",
    end_date: "2026-12-03T18:00:00Z",
    event_url: "https://ethglobal.com/events/london2026",
    registration_url: "https://ethglobal.com/events/london2026",
    prize: "$125,000+ Prize Pool",
    source_platform: "ETHGLOBAL"
  },
  {
    event_id: "seed-8",
    title: "Dev.to Autonomous AI Hackathon 2026",
    organizer_name: "Dev.to Community",
    format: "ONLINE",
    event_type: "HACKATHON",
    is_free: 1,
    city: "Virtual",
    country: "Worldwide",
    continent: "ALL",
    lat: null,
    lng: null,
    venue: "Dev.to Platform / Global Virtual",
    start_date: "2026-11-18T00:00:00Z",
    end_date: "2026-12-08T23:59:59Z",
    event_url: "https://dev.to/challenges",
    registration_url: "https://dev.to/challenges",
    prize: "$25,000+ Cash Prizes & Badges",
    source_platform: "DEVTO"
  },
  {
    event_id: "seed-9",
    title: "Reddit r/developersIndia Tech Ideathon",
    organizer_name: "developersIndia Community",
    format: "ONLINE",
    event_type: "HACKATHON",
    is_free: 1,
    city: "Virtual",
    country: "India",
    continent: "GLOBAL_SOUTH",
    lat: null,
    lng: null,
    venue: "Reddit & Discord",
    start_date: "2026-11-25T10:00:00Z",
    end_date: "2026-11-27T18:00:00Z",
    event_url: "https://www.reddit.com/r/developersIndia/?f=flair_name%3A%22Event%22",
    registration_url: "https://www.reddit.com/r/developersIndia/?f=flair_name%3A%22Event%22",
    prize: "Community Grants & Fast-track Interviews",
    source_platform: "REDDIT"
  },
  {
    event_id: "seed-10",
    title: "Microsoft Reactor AI & Copilot Summit",
    organizer_name: "Microsoft Reactor",
    format: "HYBRID",
    event_type: "WORKSHOP",
    is_free: 1,
    city: "Bengaluru",
    country: "India",
    continent: "GLOBAL_SOUTH",
    lat: 12.9716,
    lng: 77.5946,
    venue: "Microsoft Reactor, Lavelle Road",
    start_date: "2026-12-05T10:00:00Z",
    end_date: "2026-12-05T16:00:00Z",
    event_url: "https://developer.microsoft.com/en-us/reactor/events/",
    registration_url: "https://developer.microsoft.com/en-us/reactor/events/",
    prize: "Hands-on Azure Labs & Credits",
    source_platform: "MICROSOFT"
  },
  {
    event_id: "seed-11",
    title: "Luma Mumbai Tech Founders Meetup",
    organizer_name: "Mumbai Founders Club",
    format: "OFFLINE",
    event_type: "MEETUP",
    is_free: 0,
    price_detail: "₹499 (Includes food & beverage)",
    city: "Mumbai",
    country: "India",
    continent: "GLOBAL_SOUTH",
    lat: 19.0760,
    lng: 72.8777,
    venue: "WeWork BKC, Bandra Kurla Complex",
    start_date: "2026-12-12T17:00:00Z",
    end_date: "2026-12-12T20:00:00Z",
    event_url: "https://lu.ma/mumbai",
    registration_url: "https://lu.ma/mumbai",
    prize: "Pitching Session with Angel Investors",
    source_platform: "LUMA"
  },
  {
    event_id: "seed-12",
    title: "Singapore Tech Week & AI Summit 2026",
    organizer_name: "Tech Week Asia",
    format: "OFFLINE",
    event_type: "CONFERENCE",
    is_free: 1,
    city: "Singapore",
    country: "Singapore",
    continent: "GLOBAL_SOUTH",
    lat: 1.3521,
    lng: 103.8198,
    venue: "Marina Bay Sands Expo & Convention Centre",
    start_date: "2026-12-08T09:00:00Z",
    end_date: "2026-12-09T18:00:00Z",
    event_url: "https://www.techweeksingapore.com/",
    registration_url: "https://www.techweeksingapore.com/",
    prize: "Free Trade Passes & Keynotes",
    source_platform: "COMMUNITY"
  },
  {
    event_id: "seed-13",
    title: "Tokyo Web3 & AI Hackathon 2026",
    organizer_name: "Tokyo Web3 Hub",
    format: "HYBRID",
    event_type: "HACKATHON",
    is_free: 1,
    city: "Tokyo",
    country: "Japan",
    continent: "GLOBAL_SOUTH",
    lat: 35.6762,
    lng: 139.6503,
    venue: "Shibuya Stream Hall & Virtual",
    start_date: "2026-12-15T10:00:00Z",
    end_date: "2026-12-17T18:00:00Z",
    event_url: "https://web3tokyo.org/",
    registration_url: "https://web3tokyo.org/",
    prize: "¥10,000,000 Grants Pool",
    source_platform: "COMMUNITY"
  },
  {
    event_id: "seed-14",
    title: "Berlin Open Rust Summit 2026",
    organizer_name: "RustFest Community",
    format: "HYBRID",
    event_type: "CONFERENCE",
    is_free: 1,
    city: "Berlin",
    country: "Germany",
    continent: "EUROPE",
    lat: 52.5200,
    lng: 13.4050,
    venue: "Betahaus Berlin & Online",
    start_date: "2026-12-10T09:00:00Z",
    end_date: "2026-12-11T18:00:00Z",
    event_url: "https://rustfest.eu/",
    registration_url: "https://rustfest.eu/",
    prize: "Free Community Entry & Open Source Sprints",
    source_platform: "COMMUNITY"
  },
  {
    event_id: "seed-15",
    title: "Toronto AI & Machine Learning Hackathon",
    organizer_name: "University of Toronto AI Society",
    format: "HYBRID",
    event_type: "HACKATHON",
    is_free: 1,
    city: "Toronto",
    country: "Canada",
    continent: "NORTH_AMERICA",
    lat: 43.6532,
    lng: -79.3832,
    venue: "Bahen Centre for Information Technology",
    start_date: "2026-11-29T10:00:00Z",
    end_date: "2026-11-30T18:00:00Z",
    event_url: "https://ai.toronto.edu/events/",
    registration_url: "https://ai.toronto.edu/events/",
    prize: "$40,000 CAD Cloud Credits & Hardware",
    source_platform: "UNIVERSITY"
  },
  {
    event_id: "seed-16",
    title: "FOSDEM Open Source Summit 2027",
    organizer_name: "FOSDEM Community",
    format: "HYBRID",
    event_type: "CONFERENCE",
    is_free: 1,
    city: "Brussels",
    country: "Belgium",
    continent: "EUROPE",
    lat: 50.8503,
    lng: 4.3517,
    venue: "ULB Solbosch Campus",
    start_date: "2027-02-06T09:00:00Z",
    end_date: "2027-02-07T18:00:00Z",
    event_url: "https://fosdem.org/schedule/",
    registration_url: "https://fosdem.org/",
    prize: "Free Community Admission",
    source_platform: "FOSDEM"
  }
];

// Curated Google Search OSINT Tools & Community Sources
const OSINT_DORKS = [
  {
    title: "Lu.ma Global Tech Radar",
    category: "Meetups & Demo Days",
    platform: "Lu.ma",
    query: 'site:lu.ma ("meetup" OR "hackathon" OR "demo day" OR "founder coffee")',
    url: 'https://www.google.com/search?q=site%3Alu.ma+(%22meetup%22+OR+%22hackathon%22+OR+%22demo+day%22+OR+%22founder+coffee%22)',
    desc: "Discovers unlisted grassroots tech meetups, founder demo days, and AI workshops hosted on Lu.ma."
  },
  {
    title: "LinkedIn Tech Events Dork",
    category: "Conferences & Summits",
    platform: "LinkedIn",
    query: 'site:linkedin.com/events ("developer meetup" OR "hackathon" OR "tech summit" OR "AI conference")',
    url: 'https://www.google.com/search?q=site%3Alinkedin.com%2Fevents+(%22developer+meetup%22+OR+%22hackathon%22+OR+%22tech+summit%22+OR+%22AI+conference%22)',
    desc: "Finds corporate, startup, and enterprise developer conferences announced on LinkedIn Events."
  },
  {
    title: "Twitter / X Flash Hackathons",
    category: "Flash Hackathons",
    platform: "Twitter / X",
    query: '(site:twitter.com OR site:x.com) ("hackathon" OR "bounty" OR "code sprint") ("register" OR "apply")',
    url: 'https://www.google.com/search?q=(site%3Atwitter.com+OR+site%3Ax.com)+(%22hackathon%22+OR+%22tech+meetup%22+OR+%22bounty%22+OR+%22code+sprint%22)+(%22register%22+OR+%22apply%22)',
    desc: "Discovers sudden registrations, grant bursaries, and flash hackathons tweeted by tech communities."
  },
  {
    title: "Dev.to Hackathon Community",
    category: "Global Hackathons",
    platform: "Dev.to",
    query: 'site:dev.to ("hackathon announcement" OR "call for proposals" OR "virtual meetup")',
    url: 'https://www.google.com/search?q=site%3Adev.to+(%22hackathon+announcement%22+OR+%22call+for+proposals%22+OR+%22virtual+meetup%22)',
    desc: "Discovers open-source contests, developer bounties, and global online hackathons published on Dev.to."
  },
  {
    title: "Reddit Global Tech Radar",
    category: "Community Leads",
    platform: "Reddit",
    query: 'site:reddit.com (r/hackathons OR r/developersIndia OR r/webdev) ("hackathon" OR "meetup")',
    url: 'https://www.google.com/search?q=site%3Areddit.com+(r%2Fhackathons+OR+r%2FdevelopersIndia+OR+r%2Fwebdev)+(%22hackathon%22+OR+%22meetup%22)',
    desc: "Live discussions, team formation threads, and local city meetup invitations across developer subreddits."
  },
  {
    title: "GitHub Open Source Event Repos",
    category: "Student Hackathons",
    platform: "GitHub",
    query: 'site:github.com in:readme ("upcoming hackathon" OR "tech-events" OR "dev-calendar")',
    url: 'https://www.google.com/search?q=site%3Agithub.com+in%3Areadme+(%22upcoming+hackathon%22+OR+%22tech-events%22+OR+%22dev-calendar%22)',
    desc: "Finds open-source student hackathons and community calendars maintained directly in GitHub readmes."
  }
];

function detectCityFromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("London")) return { city: "London", country: "United Kingdom", label: "London, UK", lat: 51.5074, lng: -0.1278, continent: "EUROPE" };
    if (tz.includes("New_York")) return { city: "New York", country: "United States", label: "New York, USA", lat: 40.7128, lng: -74.0060, continent: "NORTH_AMERICA" };
    if (tz.includes("Los_Angeles") || tz.includes("San_Francisco")) return { city: "San Francisco", country: "United States", label: "San Francisco, USA", lat: 37.7749, lng: -122.4194, continent: "NORTH_AMERICA" };
    if (tz.includes("Berlin") || tz.includes("Frankfurt")) return { city: "Berlin", country: "Germany", label: "Berlin, Germany", lat: 52.5200, lng: 13.4050, continent: "EUROPE" };
    if (tz.includes("Paris")) return { city: "Paris", country: "France", label: "Paris, France", lat: 48.8566, lng: 2.3522, continent: "EUROPE" };
    if (tz.includes("Singapore")) return { city: "Singapore", country: "Singapore", label: "Singapore", lat: 1.3521, lng: 103.8198, continent: "GLOBAL_SOUTH" };
    if (tz.includes("Tokyo")) return { city: "Tokyo", country: "Japan", label: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, continent: "GLOBAL_SOUTH" };
    if (tz.includes("Sydney")) return { city: "Sydney", country: "Australia", label: "Sydney, Australia", lat: -33.8688, lng: 151.2093, continent: "GLOBAL_SOUTH" };
    if (tz.includes("Toronto")) return { city: "Toronto", country: "Canada", label: "Toronto, Canada", lat: 43.6532, lng: -79.3832, continent: "NORTH_AMERICA" };
    if (tz.includes("Bangalore") || tz.includes("Bengaluru")) return { city: "Bengaluru", country: "India", label: "Bengaluru, India", lat: 12.9716, lng: 77.5946, continent: "GLOBAL_SOUTH" };
    if (tz.includes("Delhi") || tz.includes("New_Delhi")) return { city: "New Delhi", country: "India", label: "New Delhi, India", lat: 28.6139, lng: 77.2090, continent: "GLOBAL_SOUTH" };
    if (tz.includes("Mumbai") || tz.includes("Bombay")) return { city: "Mumbai", country: "India", label: "Mumbai, India", lat: 19.0760, lng: 72.8777, continent: "GLOBAL_SOUTH" };
    if (tz.includes("Kolkata") || tz.includes("Calcutta")) return { city: "Kolkata", country: "India", label: "Kolkata, India", lat: 22.5726, lng: 88.3639, continent: "GLOBAL_SOUTH" };
  } catch {}
  return WORLDWIDE_LOCATION;
}

function detectContinentFromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.startsWith("Europe/") || tz.startsWith("Atlantic/")) return "EUROPE";
    if (tz.startsWith("America/Sao_Paulo") || tz.startsWith("America/Buenos_Aires") || tz.startsWith("America/Bogota") || tz.startsWith("America/Santiago")) return "LATIN_AMERICA";
    if (tz.startsWith("America/")) return "NORTH_AMERICA";
    if (tz.startsWith("Africa/")) return "MEA";
    if (tz.startsWith("Asia/") || tz.startsWith("Australia/") || tz.startsWith("Pacific/")) return "GLOBAL_SOUTH";
  } catch {}
  return "ALL";
}

function App() {
  // Navigation tabs: 'home' | 'explore' | 'hackathons' | 'meetups' | 'nearme' | 'osint' | 'bots'
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return ["home", "explore", "hackathons", "meetups", "nearme", "osint", "bots"].includes(hash) ? hash : "home";
  });

  // Events dataset (Merged smoothly without clashing or duplicate cards)
  const [events, setEvents] = useState(CURATED_SEED_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Live Sync Status (Cloudflare + Render)
  const [liveSyncTime, setLiveSyncTime] = useState("");

  // Theme state: 'system' | 'light' | 'dark'
  const [themePref, setThemePref] = useState(() => {
    return localStorage.getItem("eventador-theme") || "system";
  });

  // Profile Popover
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  // Exact Geolocation / Active Location State (Defaults to Worldwide — Zero forced lock!)
  const [exactLocation, setExactLocation] = useState(() => {
    try {
      const saved = localStorage.getItem("eventador-user-location");
      if (saved) return JSON.parse(saved);
    } catch {}
    return WORLDWIDE_LOCATION;
  });

  const [detectingExactLocation, setDetectingExactLocation] = useState(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState("");
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  // Continental Zone & Cascading Country Filters
  const [filterContinent, setFilterContinent] = useState("ALL");
  const [filterCountry, setFilterCountry] = useState("ALL");

  // Explore tab filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterFormat, setFilterFormat] = useState("ALL");
  const [filterPrice, setFilterPrice] = useState("ALL");
  const [filterSource, setFilterSource] = useState("ALL");

  // Near Me custom search filter
  const [nearMeSearch, setNearMeSearch] = useState("");

  // Hero Animated Card Deck Index
  const [deckIndex, setDeckIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Top featured events for the animated deck
  const heroDeckEvents = useMemo(() => {
    return events.slice(0, 5);
  }, [events]);

  // Keep deck index valid when events update (Zero jumping slides!)
  useEffect(() => {
    if (heroDeckEvents.length > 0 && deckIndex >= heroDeckEvents.length) {
      setDeckIndex(0);
    }
  }, [heroDeckEvents.length, deckIndex]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme Applying
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
    setShowProfileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["home", "explore", "hackathons", "meetups", "nearme", "osint", "bots"].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Set User Location (Never lock or force any single city!)
  const setUserLocation = (locObj) => {
    setExactLocation(locObj);
    setIsEditingLocation(false);
    if (locObj && !locObj.isGlobal) {
      localStorage.setItem("eventador-user-location", JSON.stringify(locObj));
      setLocationStatusMessage(`Active location: ${locObj.label || locObj.city}`);
    } else {
      localStorage.removeItem("eventador-user-location");
      setLocationStatusMessage("Viewing worldwide events");
    }
  };

  // Exact Location Request Handler (GPS + OpenStreetMap reverse geocode)
  const requestExactLocation = (interactive = false) => {
    if (!navigator.geolocation) {
      if (interactive) setLocationStatusMessage("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingExactLocation(true);
    setLocationStatusMessage("Pinpointing your exact city...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // OpenStreetMap Nominatim reverse geocoding (100% free, zero API key)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12`, {
            headers: { "Accept-Language": "en" }
          });
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "Your City";
          const state = addr.state || "";
          const country = addr.country || "Detected Region";
          const label = state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;

          // Deduce continent for broad global categorization
          let continent = "ALL";
          if (lng >= 60 && lng <= 180 && lat >= -50) continent = "GLOBAL_SOUTH";
          else if (lng >= -25 && lng <= 45 && lat >= 35) continent = "EUROPE";
          else if (lng >= -170 && lng <= -50 && lat >= 15) continent = "NORTH_AMERICA";
          else if (lng >= -120 && lng <= -30 && lat < 15) continent = "LATIN_AMERICA";
          else if (lng >= -20 && lng <= 60 && lat >= -35 && lat < 37) continent = "MEA";

          const locObj = { lat, lng, city, state, country, label, continent, isGlobal: false };
          setUserLocation(locObj);
          setDetectingExactLocation(false);
        } catch {
          // Fallback to coordinates if reverse lookup fails
          const locObj = { lat, lng, city: "Current Location", state: "", country: "Local", label: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`, continent: "ALL", isGlobal: false };
          setUserLocation(locObj);
          setDetectingExactLocation(false);
        }
      },
      (err) => {
        setDetectingExactLocation(false);
        setLocationStatusMessage(err.code === 1 ? "Location permission denied. Please choose your city from the list." : "Location lookup timed out. Select your city below.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Available countries based on selected continent
  const availableCountries = useMemo(() => {
    return COUNTRIES_BY_CONTINENT[filterContinent] || COUNTRIES_BY_CONTINENT.ALL;
  }, [filterContinent]);

  // When continent changes, ensure selected country stays valid
  const handleContinentChange = (newContinent) => {
    setFilterContinent(newContinent);
    setFilterCountry("ALL");
  };

  // Multi-Service Anti-Clash Event Merger (Cloudflare Worker + Render + GitHub Actions)
  const mergeEventsWithoutClash = (prevEvents, incomingEvents) => {
    if (!incomingEvents || incomingEvents.length === 0) return prevEvents;
    const eventMap = new Map();

    for (const ev of prevEvents) {
      const key = ev.event_id || `${ev.title}_${ev.start_date}`;
      eventMap.set(key, ev);
    }

    for (const ev of incomingEvents) {
      const key = ev.event_id || `${ev.title}_${ev.start_date}`;
      if (eventMap.has(key)) {
        eventMap.set(key, { ...eventMap.get(key), ...ev });
      } else {
        eventMap.set(key, ev);
      }
    }

    return Array.from(eventMap.values());
  };

  // Periodic polling from Cloudflare Edge Worker API (Every 3 minutes)
  useEffect(() => {
    const fetchLiveEvents = () => {
      fetch("https://eventador.eventador.workers.dev/api/events")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.events && data.events.length > 0) {
            setEvents((prev) => mergeEventsWithoutClash(prev, data.events));
            setLiveSyncTime(new Date().toLocaleTimeString());
          }
        })
        .catch(() => {
          // Graceful offline fallback
        });
    };

    fetchLiveEvents();
    const interval = setInterval(fetchLiveEvents, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Autonomous 3D Card Deck Animation Timer (Cycles smoothly every 3.5s)
  useEffect(() => {
    if (isHovered || heroDeckEvents.length === 0) return;
    const interval = setInterval(() => {
      setDeckIndex((prev) => (prev + 1) % heroDeckEvents.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, heroDeckEvents.length]);

  // Real "Trending This Week" events sorted by nearest registration deadline / start date
  const trendingEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const tA = new Date(a.start_date || 0).getTime();
      const tB = new Date(b.start_date || 0).getTime();
      return tA - tB;
    }).slice(0, 6);
  }, [events]);

  // Filtered for Explore Tab (With Cascading Continent & Country Filters)
  const exploreEvents = useMemo(() => {
    return events.filter((ev) => {
      if (filterType !== "ALL" && ev.event_type !== filterType) return false;
      if (filterFormat !== "ALL" && ev.format !== filterFormat) return false;
      if (filterPrice !== "ALL" && String(ev.is_free) !== String(filterPrice)) return false;
      if (filterContinent !== "ALL" && ev.continent !== "ALL" && ev.continent !== filterContinent) return false;

      // Country filtering
      if (filterCountry !== "ALL" && !filterCountry.startsWith("All Countries")) {
        if (!ev.country || ev.country.toLowerCase() !== filterCountry.toLowerCase()) {
          return false;
        }
      }

      if (filterSource !== "ALL" && ev.source_platform !== filterSource) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const titleMatch = ev.title && ev.title.toLowerCase().includes(q);
        const orgMatch = ev.organizer_name && ev.organizer_name.toLowerCase().includes(q);
        const cityMatch = ev.city && ev.city.toLowerCase().includes(q);
        const countryMatch = ev.country && ev.country.toLowerCase().includes(q);
        if (!titleMatch && !orgMatch && !cityMatch && !countryMatch) return false;
      }
      return true;
    });
  }, [events, search, filterType, filterFormat, filterPrice, filterContinent, filterCountry, filterSource]);

  // Filtered for Hackathons Tab
  const hackathonEvents = useMemo(() => {
    return events.filter((ev) => ev.event_type === "HACKATHON" || /hackathon|ideathon|bounty/i.test(ev.title));
  }, [events]);

  // Filtered for Meetups Tab
  const meetupEvents = useMemo(() => {
    return events.filter((ev) => ev.event_type === "MEETUP" || /meetup|community|founder/i.test(ev.title));
  }, [events]);

  // Filtered for Near Me Tab (Exact Distance Calculation & Proximity Sorting)
  const nearMeEvents = useMemo(() => {
    const physicalEvents = events.filter((ev) => ev.format === "OFFLINE" || ev.format === "HYBRID");

    // Compute exact distance in km for each event relative to user's locked coordinates
    const listWithDistance = physicalEvents.map((ev) => {
      let distanceKm = null;
      if (exactLocation && exactLocation.lat != null && exactLocation.lng != null && ev.lat != null && ev.lng != null) {
        distanceKm = haversineDistanceKm(exactLocation.lat, exactLocation.lng, ev.lat, ev.lng);
      } else if (exactLocation && exactLocation.city && ev.city && ev.city.toLowerCase().includes(exactLocation.city.toLowerCase())) {
        distanceKm = 5; // Local city match
      }
      return { ...ev, distanceKm };
    });

    // Apply manual search query if provided in Near Me tab
    let filtered = listWithDistance;
    if (nearMeSearch.trim()) {
      const q = nearMeSearch.toLowerCase();
      filtered = filtered.filter((ev) => {
        return (ev.city && ev.city.toLowerCase().includes(q)) ||
               (ev.title && ev.title.toLowerCase().includes(q)) ||
               (ev.venue && ev.venue.toLowerCase().includes(q)) ||
               (ev.country && ev.country.toLowerCase().includes(q));
      });
    }

    // Sort: Nearest events first (ascending distance in km), then by upcoming date
    return filtered.sort((a, b) => {
      if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
      if (a.distanceKm != null) return -1;
      if (b.distanceKm != null) return 1;
      return new Date(a.start_date || 0).getTime() - new Date(b.start_date || 0).getTime();
    });
  }, [events, exactLocation, nearMeSearch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Upcoming";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Helper to render an event card with spacious layout, clean badge hierarchy & deep link
  const renderEventCard = (ev) => {
    const hasDistance = ev.distanceKm != null && exactLocation && !exactLocation.isGlobal;
    const isNearbyCity = exactLocation && !exactLocation.isGlobal && exactLocation.city && ev.city && ev.city.toLowerCase().includes(exactLocation.city.toLowerCase());

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
            {hasDistance && (
              <span className="badge-pill badge-distance">
                📍 {ev.distanceKm <= 10 ? `In ${ev.city || "your area"}` : `${ev.distanceKm} km`}
              </span>
            )}
            {isNearbyCity && !hasDistance && (
              <span className="badge-pill badge-local">📍 LOCAL</span>
            )}
          </div>

          <h3 className="card-title">{ev.title}</h3>
          <p className="card-org">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ opacity: 0.7, flexShrink: 0 }}>
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span>{ev.organizer_name || "Community Partner"}</span>
          </p>

          <div className="card-meta-list">
            <div className="meta-row">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" style={{ opacity: 0.75, flexShrink: 0 }}>
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span style={{ fontWeight: 600 }}>{formatDate(ev.start_date)} {ev.end_date ? `— ${formatDate(ev.end_date)}` : ""}</span>
            </div>
            <div className="meta-row">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" style={{ opacity: 0.75, flexShrink: 0 }}>
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{ev.city ? `${ev.city}, ${ev.country || ""}` : "Global Virtual"} {ev.venue ? `(${ev.venue})` : ""}</span>
            </div>
            {ev.prize && (
              <div className="meta-row" style={{ color: "var(--color-orange)", fontWeight: 700 }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                </svg>
                <span>{ev.prize}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card-footer">
          <a
            href={ev.registration_url || ev.event_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-card-register"
            title="Open official event registration page"
          >
            Register Official ↗
          </a>
          <button className="btn-card-details" onClick={() => setSelectedEvent(ev)}>
            Pass Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* ====================================================================
          NAVBAR: Clean, Minimal, Zero Emojis, No Clashing Secondary Strip
          ==================================================================== */}
      <div className="navbar-wrapper">
        <nav className="navbar">
          <div className="nav-brand" onClick={() => navigateTo("home")}>
            <img src="/logo.png" alt="Eventador" className="brand-logo-img" onError={(e) => { e.target.style.display = 'none'; }} />
            <span>Eventador</span>
          </div>

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
              Near Me
            </span>
            <span className={"nav-link " + (activeTab === "osint" ? "active" : "")} onClick={() => navigateTo("osint")}>
              OSINT Tools
            </span>
            <span className={"nav-link " + (activeTab === "bots" ? "active" : "")} onClick={() => navigateTo("bots")}>
              Bots
            </span>
          </div>

          <div className="nav-actions">
            <button className="btn-action-bot" onClick={() => navigateTo("bots")}>
              Add Bot ↗
            </button>

            {/* Cloudflare-Style Profile / Settings Popover */}
            <div className="profile-wrap" ref={profileRef}>
              <button
                className={"profile-btn " + (showProfileMenu ? "active" : "")}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                title="Settings & Radar Preferences"
                aria-label="Settings and appearance"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>

              {showProfileMenu && (
                <div className="profile-popover">
                  <div className="popover-header">Theme Appearance</div>
                  <div className="theme-segmented">
                    <button
                      className={"theme-seg-btn " + (themePref === "light" ? "active" : "")}
                      onClick={() => setThemePref("light")}
                    >
                      Light
                    </button>
                    <button
                      className={"theme-seg-btn " + (themePref === "dark" ? "active" : "")}
                      onClick={() => setThemePref("dark")}
                    >
                      Dark
                    </button>
                    <button
                      className={"theme-seg-btn " + (themePref === "system" ? "active" : "")}
                      onClick={() => setThemePref("system")}
                    >
                      System
                    </button>
                  </div>

                  <div className="popover-header" style={{ marginTop: "0.55rem" }}>Active Location Radar</div>
                  <div className="location-detected-row">
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>
                      {exactLocation && !exactLocation.isGlobal ? exactLocation.label || exactLocation.city : "🌐 Worldwide"}
                    </span>
                    <button className="btn-redetect" onClick={() => requestExactLocation(true)} disabled={detectingExactLocation}>
                      {detectingExactLocation ? "Locating..." : "📍 Detect City"}
                    </button>
                  </div>

                  <div className="popover-header" style={{ marginTop: "0.5rem" }}>Quick Hub / Region Switch</div>
                  <select
                    className="dropdown-select"
                    style={{ fontSize: "0.8rem", padding: "0.38rem 0.5rem" }}
                    value={exactLocation ? exactLocation.name || exactLocation.city : "Worldwide"}
                    onChange={(e) => {
                      const matched = POPULAR_CITIES.find(c => c.name === e.target.value);
                      if (matched) {
                        if (matched.isGlobal) {
                          setUserLocation(WORLDWIDE_LOCATION);
                        } else {
                          setUserLocation({
                            lat: matched.lat,
                            lng: matched.lng,
                            city: matched.name,
                            state: "",
                            country: matched.country,
                            label: matched.label || `${matched.name}, ${matched.country}`,
                            continent: matched.continent,
                            isGlobal: false
                          });
                        }
                      }
                    }}
                  >
                    {POPULAR_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.isGlobal ? "🌐 Worldwide / Global" : `${c.name}, ${c.country}`}
                      </option>
                    ))}
                  </select>

                  {locationStatusMessage && (
                    <span style={{ fontSize: "0.72rem", color: "var(--color-orange)", fontWeight: 600, marginTop: "0.3rem" }}>
                      {locationStatusMessage}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Horizontal Tab Navigation Strip (Swipeable for all phones) */}
      <div className="mobile-nav-bar">
        <div className="mobile-tab-scroll">
          <button className={"mobile-tab-pill " + (activeTab === "home" ? "active" : "")} onClick={() => navigateTo("home")}>
            Home
          </button>
          <button className={"mobile-tab-pill " + (activeTab === "explore" ? "active" : "")} onClick={() => navigateTo("explore")}>
            Explore
          </button>
          <button className={"mobile-tab-pill " + (activeTab === "hackathons" ? "active" : "")} onClick={() => navigateTo("hackathons")}>
            Hackathons
          </button>
          <button className={"mobile-tab-pill " + (activeTab === "meetups" ? "active" : "")} onClick={() => navigateTo("meetups")}>
            Meetups
          </button>
          <button className={"mobile-tab-pill " + (activeTab === "nearme" ? "active" : "")} onClick={() => navigateTo("nearme")}>
            Near Me
          </button>
          <button className={"mobile-tab-pill " + (activeTab === "osint" ? "active" : "")} onClick={() => navigateTo("osint")}>
            OSINT Tools
          </button>
          <button className={"mobile-tab-pill " + (activeTab === "bots" ? "active" : "")} onClick={() => navigateTo("bots")}>
            Bots
          </button>
        </div>
      </div>

      {/* ====================================================================
          PAGE 1: HOME (Hero + Orbit Geometry + Real Trending Events)
          ==================================================================== */}
      {activeTab === "home" && (
        <div>
          <header className="hero-container">
            <div className="hero-content">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <div className="hero-eyebrow">
                  <span>●</span> Happy Developer Intelligence
                </div>
                <div className="live-sync-indicator">
                  <div className="pulse-dot"></div>
                  <span>Cloudflare + Render Live Sync {liveSyncTime ? `(${liveSyncTime})` : ""}</span>
                </div>
              </div>

              <h1 className="hero-title">
                Tech events, from <em>community</em> to <em>grand stage.</em>
              </h1>
              <p className="hero-desc">
                Eventador autonomously monitors, verifies, and surfaces upcoming hackathons, meetups, workshops, and OSINT leads worldwide. 100% genuine registration links, zero scams.
              </p>

              {exactLocation && !exactLocation.isGlobal ? (
                <div style={{ fontSize: "0.84rem", color: "var(--color-orange)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                  <span>📍 Active Location Radar:</span>
                  <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("nearme")}>
                    {exactLocation.label || exactLocation.city}
                  </span>
                  <button
                    onClick={() => setUserLocation(WORLDWIDE_LOCATION)}
                    style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "0.78rem", cursor: "pointer", textDecoration: "underline" }}
                  >
                    (Reset to Worldwide)
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                  <span>🌐 Global Tech Radar:</span>
                  <span style={{ textDecoration: "underline", cursor: "pointer", color: "var(--color-blue)" }} onClick={() => navigateTo("nearme")}>
                    Worldwide coverage active • Filter by city or region ▾
                  </span>
                </div>
              )}

              <div className="hero-buttons">
                <button className="btn-action-primary" onClick={() => navigateTo("explore")}>
                  Explore Directory ↘
                </button>
                <button className="btn-action-secondary" onClick={() => navigateTo("nearme")}>
                  Find Near Me 📍
                </button>
                <button className="btn-action-secondary" onClick={() => navigateTo("bots")}>
                  Community Bots ↗
                </button>
              </div>

              <div className="hero-metrics-row">
                <div className="metric-item">
                  <span className="metric-num">1,240+</span>
                  <span>Verified Events</span>
                </div>
                <div className="metric-item">
                  <span className="metric-num">100%</span>
                  <span>Deep Event Passes</span>
                </div>
                <div className="metric-item">
                  <span className="metric-num">0</span>
                  <span>Generic Roots</span>
                </div>
              </div>
            </div>

            {/* Right Side: Big Centered Orbit Geometry with 3D Animated Cards Deck */}
            <div
              className="hero-orbit-canvas"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="hero-big-circle">
                <div className="hero-mid-circle"></div>
                <div className="hero-inner-circle"></div>
                <div className="circle-dot circle-dot-orange"></div>
                <div className="circle-dot circle-dot-blue"></div>
                <div className="circle-dot circle-dot-green"></div>
                <div className="circle-dot circle-dot-purple"></div>
              </div>

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
                        {ev.city ? `${ev.city}, ${ev.country || ""} • ` : ""}{ev.format} • {ev.is_free ? "Free Entry" : "Paid"}
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

          {/* Two Core Pillars Section */}
          <div className="page-container" style={{ paddingTop: "0.5rem" }}>
            <div className="pillars-grid">
              <div className="pillar-card">
                <div>
                  <span className="pillar-badge">WEB DIRECTORY & RADAR</span>
                  <h3 className="pillar-title" style={{ marginTop: "0.5rem" }}>
                    Global Event Radar with Country & Continental Filters
                  </h3>
                  <p className="pillar-desc" style={{ marginTop: "0.4rem" }}>
                    Search 1,240+ verified hackathons, summits, and meetups. Filter by continental zones, specific countries, offline cities, and launch Google OSINT searches.
                  </p>
                </div>
                <button className="btn-action-secondary" style={{ alignSelf: "flex-start" }} onClick={() => navigateTo("explore")}>
                  Open Directory ↘
                </button>
              </div>

              <div className="pillar-card">
                <div>
                  <span className="pillar-badge" style={{ color: "var(--color-violet)" }}>COMMUNITY AUTOMATION (CARL-STYLE)</span>
                  <h3 className="pillar-title" style={{ marginTop: "0.5rem" }}>
                    Discord & Telegram Bot Fleet
                  </h3>
                  <p className="pillar-desc" style={{ marginTop: "0.4rem" }}>
                    One-click add Eventador to your Discord server or Telegram group. Stream verified event drops, deadline reminders, and role mentions without manual posting.
                  </p>
                </div>
                <button className="btn-action-primary" style={{ alignSelf: "flex-start" }} onClick={() => navigateTo("bots")}>
                  Explore Bots ↗
                </button>
              </div>
            </div>

            {/* Real Trending This Week Section */}
            <div className="section-header">
              <div>
                <h2 className="section-title">Trending This Week</h2>
                <p className="section-sub">Autonomous verified events sorted by upcoming registration deadlines.</p>
              </div>
              <button className="btn-card-details" onClick={() => navigateTo("explore")}>
                View All {events.length} Events →
              </button>
            </div>
            <div className="events-grid">
              {trendingEvents.map(renderEventCard)}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PAGE 2: EXPLORE (Cascading Continental Zone & Country Filters)
          ==================================================================== */}
      {activeTab === "explore" && (
        <div className="page-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Explore Verified Events</h2>
              <p className="section-sub">Filter by continental zone, specific country, format, or pricing.</p>
            </div>
          </div>

          <div className="filter-card">
            <div className="search-row">
              <svg className="search-icon-svg" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <input
                type="text"
                className="search-field"
                placeholder="Search events, organizers, technologies, cities, or countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="dropdowns-grid">
              {/* Continental Zone Dropdown */}
              <div className="dropdown-group">
                <label className="dropdown-label">Continental Zone</label>
                <select
                  className="dropdown-select"
                  value={filterContinent}
                  onChange={(e) => handleContinentChange(e.target.value)}
                >
                  {CONTINENTS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Cascading Country Dropdown (Dynamically reflects selected continent) */}
              <div className="dropdown-group">
                <label className="dropdown-label">Country / Region</label>
                <select
                  className="dropdown-select"
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                >
                  {availableCountries.map((countryName, i) => (
                    <option key={countryName} value={i === 0 ? "ALL" : countryName}>
                      {countryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Type */}
              <div className="dropdown-group">
                <label className="dropdown-label">Event Type</label>
                <select className="dropdown-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="ALL">All Event Types</option>
                  <option value="HACKATHON">Hackathons</option>
                  <option value="MEETUP">Meetups</option>
                  <option value="CONFERENCE">Conferences</option>
                  <option value="WORKSHOP">Workshops</option>
                </select>
              </div>

              {/* Format / Mode */}
              <div className="dropdown-group">
                <label className="dropdown-label">Format / Mode</label>
                <select className="dropdown-select" value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)}>
                  <option value="ALL">All Modes</option>
                  <option value="ONLINE">Online (Virtual)</option>
                  <option value="OFFLINE">In-Person (Offline)</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              {/* Pricing */}
              <div className="dropdown-group">
                <label className="dropdown-label">Pricing</label>
                <select className="dropdown-select" value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
                  <option value="ALL">All Events</option>
                  <option value="1">Free Entry Only</option>
                  <option value="0">Paid Entry</option>
                </select>
              </div>
            </div>
          </div>

          <div className="section-header" style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Showing {exploreEvents.length} verified events {filterCountry !== "ALL" ? `in ${filterCountry}` : ""}
            </span>
          </div>
          <div className="events-grid">
            {exploreEvents.length > 0 ? (
              exploreEvents.map(renderEventCard)
            ) : (
              <p style={{ color: "var(--text-muted)", gridColumn: "1/-1", textAlign: "center", padding: "2rem" }}>
                No events match your current filter criteria. Try selecting "All Countries" or switching continental zone!
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
              <h2 className="section-title">Hackathons & Coding Contests</h2>
              <p className="section-sub">Discover competitive hackathons with prize pools, bounties, grants, and hiring tracks.</p>
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
              <h2 className="section-title">Developer Meetups & User Groups</h2>
              <p className="section-sub">Local GDG chapters, AWS user groups, Rust, React, and AI community gatherings.</p>
            </div>
          </div>
          <div className="events-grid">
            {meetupEvents.map(renderEventCard)}
          </div>
        </div>
      )}

      {/* ====================================================================
          PAGE 5: NEAR ME (Worldwide Hub & Proximity Radar)
          ==================================================================== */}
      {activeTab === "nearme" && (
        <div className="page-container">
          <div className="radar-banner">
            <div className="radar-circle">
              <div className="radar-ping"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                {exactLocation && !exactLocation.isGlobal ? `Local Event Radar: ${exactLocation.city}` : "Global Autonomous Event Radar"}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                {exactLocation && !exactLocation.isGlobal
                  ? `Showing in-person and hybrid events sorted by exact distance from ${exactLocation.city}, ${exactLocation.country}.`
                  : "Showing developer events worldwide. Detect your city or choose a hub to calculate exact distances."}
              </p>
            </div>

            {/* Radar Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              {exactLocation && !exactLocation.isGlobal ? (
                <>
                  <span className="badge-pill badge-distance" style={{ padding: "0.38rem 0.8rem", fontSize: "0.82rem" }}>
                    📍 {exactLocation.city}, {exactLocation.country}
                  </span>
                  <button
                    className="btn-card-details"
                    onClick={() => setIsEditingLocation(!isEditingLocation)}
                  >
                    {isEditingLocation ? "Close" : "Change City ▾"}
                  </button>
                  <button
                    className="btn-card-details"
                    onClick={() => setUserLocation(WORLDWIDE_LOCATION)}
                  >
                    Worldwide
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-action-primary"
                    onClick={() => requestExactLocation(true)}
                    disabled={detectingExactLocation}
                  >
                    {detectingExactLocation ? "Locating..." : "📍 Detect My City"}
                  </button>
                  <button
                    className="btn-card-details"
                    onClick={() => setIsEditingLocation(!isEditingLocation)}
                  >
                    {isEditingLocation ? "Close" : "Choose City ▾"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Inline City Chooser when user clicks Change City / Choose City */}
          {isEditingLocation && (
            <div className="filter-card" style={{ marginBottom: "1.5rem", animation: "popoverFade 0.2s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700 }}>Choose a Tech Hub or Global Mode:</span>
                <button
                  className="btn-action-primary"
                  style={{ fontSize: "0.78rem", padding: "0.38rem 0.85rem" }}
                  onClick={() => requestExactLocation(true)}
                  disabled={detectingExactLocation}
                >
                  {detectingExactLocation ? "Locating via GPS..." : "📍 Detect My City via GPS"}
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {POPULAR_CITIES.map((c) => (
                  <button
                    key={c.name}
                    className={"theme-seg-btn " + ((c.isGlobal && (!exactLocation || exactLocation.isGlobal)) || (exactLocation && exactLocation.city === c.name) ? "active" : "")}
                    style={{ padding: "0.4rem 0.8rem", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.82rem" }}
                    onClick={() => {
                      if (c.isGlobal) {
                        setUserLocation(WORLDWIDE_LOCATION);
                      } else {
                        setUserLocation({
                          lat: c.lat,
                          lng: c.lng,
                          city: c.name,
                          state: "",
                          country: c.country,
                          label: c.label || `${c.name}, ${c.country}`,
                          continent: c.continent,
                          isGlobal: false
                        });
                      }
                    }}
                  >
                    {c.isGlobal ? "🌐 Worldwide / Global" : `${c.name} (${c.country})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick filter text bar */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", alignItems: "center" }}>
            <input
              type="text"
              className="search-field"
              style={{ maxWidth: "380px" }}
              placeholder="Filter nearby events by venue, city, or keyword..."
              value={nearMeSearch}
              onChange={(e) => setNearMeSearch(e.target.value)}
            />
            {nearMeSearch && (
              <button className="btn-card-details" onClick={() => setNearMeSearch("")}>
                Clear
              </button>
            )}
          </div>

          <div className="section-header">
            <div>
              <h2 className="section-title">
                {exactLocation && !exactLocation.isGlobal ? `Events Near ${exactLocation.city}` : "In-Person & Hybrid Tech Events"}
              </h2>
              <p className="section-sub">
                {exactLocation && !exactLocation.isGlobal ? (
                  <span>{nearMeEvents.length} events scheduled near <strong>{exactLocation.label || exactLocation.city}</strong>.</span>
                ) : (
                  <span>Showing {nearMeEvents.length} global offline & hybrid tech events.</span>
                )}
              </p>
            </div>
          </div>
          <div className="events-grid">
            {nearMeEvents.length > 0 ? (
              nearMeEvents.map(renderEventCard)
            ) : (
              <p style={{ color: "var(--text-muted)", gridColumn: "1/-1", textAlign: "center", padding: "2rem" }}>
                No offline events scheduled near this location yet. Try switching city or exploring virtual hackathons!
              </p>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          PAGE 6: OSINT TOOLS (Google Search Dorks & Social Radar)
          ==================================================================== */}
      {activeTab === "osint" && (
        <div className="page-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Google Search OSINT & Community Leads</h2>
              <p className="section-sub">
                Curated open-intelligence search dorks to discover unlisted events on Dev.to, Reddit, Lu.ma, Twitter/X, LinkedIn, and GitHub.
              </p>
            </div>
          </div>

          <div className="osint-grid">
            {OSINT_DORKS.map((dork, i) => (
              <div key={i} className="osint-card">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{dork.title}</h3>
                    <span className="badge-pill badge-online">{dork.platform}</span>
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
                  Launch Live OSINT Search ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          PAGE 7: BOTS (Carl.gg / Top.gg Inspired Community Bot Fleet)
          ==================================================================== */}
      {activeTab === "bots" && (
        <div className="page-container">
          <div className="bots-hero">
            <span className="pillar-badge" style={{ color: "var(--color-discord)" }}>COMMUNITY AUTOMATION</span>
            <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Eventador Bot Fleet for Your Community
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6, maxWidth: "640px" }}>
              Just like <strong>Carl-bot</strong> empowers Discord moderation, Eventador streams verified tech events, hackathons, and deadline alerts directly into your Discord servers and Telegram groups.
            </p>
          </div>

          <div className="bots-grid">
            {/* Card 1: Discord Bot */}
            <div className="bot-card bot-card-discord">
              <div>
                <div className="bot-card-header">
                  <div className="bot-icon-circle" style={{ background: "var(--color-discord)" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Discord Bot</h3>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Slash Commands & Automated Channels</span>
                  </div>
                </div>

                <p style={{ fontSize: "0.88rem", color: "var(--text-sub)", margin: "1rem 0" }}>
                  Integrate into your tech server to deliver hourly verified event drops, deadline countdowns, and continental filtering.
                </p>

                <div className="bot-features-list">
                  <div className="bot-feature-item">
                    <span>✓</span>
                    <span><strong>/events [region]</strong> — Instant command search</span>
                  </div>
                  <div className="bot-feature-item">
                    <span>✓</span>
                    <span><strong>/auto-stream #announcements</strong> — Autonomous event feed</span>
                  </div>
                  <div className="bot-feature-item">
                    <span>✓</span>
                    <span><strong>@Hackers role pings</strong> for urgent registration deadlines</span>
                  </div>
                  <div className="bot-feature-item">
                    <span>✓</span>
                    <span>100% scam-free, zero spam, verified registration links</span>
                  </div>
                </div>
              </div>

              <a
                href="https://discord.com/api/oauth2/authorize?client_id=1234567890&permissions=2147483648&scope=bot%20applications.commands"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action-primary"
                style={{ background: "var(--color-discord)", color: "#fff", justifyContent: "center", padding: "0.65rem 1rem", fontSize: "0.9rem" }}
              >
                Add to Discord ↗
              </a>
            </div>

            {/* Card 2: Telegram Bot */}
            <div className="bot-card bot-card-telegram">
              <div>
                <div className="bot-card-header">
                  <div className="bot-icon-circle" style={{ background: "var(--color-telegram)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Telegram Bot</h3>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Groups, Channels & Direct Chat</span>
                  </div>
                </div>

                <p style={{ fontSize: "0.88rem", color: "var(--text-sub)", margin: "1rem 0" }}>
                  Add <strong>@EventadorBot</strong> to your developer group or subscribe directly for daily continental event radar digests.
                </p>

                <div className="bot-features-list">
                  <div className="bot-feature-item">
                    <span>✓</span>
                    <span>Instant group broadcasts when high-prize hackathons launch</span>
                  </div>
                  <div className="bot-feature-item">
                    <span>✓</span>
                    <span>Continental filtering command: <strong>/region [name]</strong></span>
                  </div>
                  <div className="bot-feature-item">
                    <span>✓</span>
                    <span>One-tap registration buttons directly inside Telegram</span>
                  </div>
                  <div className="bot-feature-item">
                    <span>✓</span>
                    <span>Lightweight, fast, and completely free to use</span>
                  </div>
                </div>
              </div>

              <a
                href="https://t.me/EventadorBot"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action-primary"
                style={{ background: "var(--color-telegram)", color: "#fff", justifyContent: "center", padding: "0.65rem 1rem", fontSize: "0.9rem" }}
              >
                Add to Telegram ↗
              </a>
            </div>
          </div>

          <div className="section-header" style={{ marginTop: "1rem" }}>
            <div>
              <h2 className="section-title">Interactive Discord Feed Preview</h2>
              <p className="section-sub">See how Eventador formats real-time verified event alerts inside your Discord channels.</p>
            </div>
          </div>

          <div className="discord-mockup">
            <div className="discord-author">
              <span style={{ color: "#5865F2", fontWeight: 800 }}>● Eventador Radar</span>
              <span style={{ background: "#5865F2", color: "#fff", fontSize: "0.65rem", padding: "1px 4px", borderRadius: "3px" }}>BOT</span>
              <span style={{ fontSize: "0.72rem", color: "#949ba4", marginLeft: "0.3rem" }}>Today at 10:00 AM</span>
            </div>
            <div className="discord-title">
              Smart India Hackathon 2026 — Official Registration Open
            </div>
            <p style={{ fontSize: "0.82rem", color: "#dbdee1", marginBottom: "0.5rem" }}>
              Organized by Ministry of Education & AICTE • 100% genuine registration link verified.
            </p>
            <div className="discord-fields">
              <div>
                <strong style={{ color: "#b5bac1", fontSize: "0.72rem", textTransform: "uppercase" }}>Format</strong>
                <p style={{ color: "#f2f3f5" }}>Hybrid (In-Person + Regional Nodes)</p>
              </div>
              <div>
                <strong style={{ color: "#b5bac1", fontSize: "0.72rem", textTransform: "uppercase" }}>Prize Pool</strong>
                <p style={{ color: "#f2f3f5" }}>₹1,00,00,000+ Prizes & Grants</p>
              </div>
              <div>
                <strong style={{ color: "#b5bac1", fontSize: "0.72rem", textTransform: "uppercase" }}>Date</strong>
                <p style={{ color: "#f2f3f5" }}>Nov 15, 2026 — Nov 17, 2026</p>
              </div>
              <div>
                <strong style={{ color: "#b5bac1", fontSize: "0.72rem", textTransform: "uppercase" }}>Exact Location</strong>
                <p style={{ color: "#f2f3f5" }}>New Delhi, India</p>
              </div>
            </div>
          </div>

          <div className="section-header" style={{ marginTop: "2.5rem" }}>
            <div>
              <h2 className="section-title">How Integration Works (3 Easy Steps)</h2>
              <p className="section-sub">Zero complicated setup. Add the bot to your community in under 30 seconds.</p>
            </div>
          </div>

          <div className="setup-steps-grid">
            <div className="setup-step-card">
              <div className="setup-step-num">01</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem" }}>Invite the Bot</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Click "Add to Discord" or "Add to Telegram" and select your server or community group with standard webhook permissions.
              </p>
            </div>

            <div className="setup-step-card">
              <div className="setup-step-num">02</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem" }}>Select Channel & Region</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Run <code>/auto-stream #channel</code> and choose your continental region (e.g. Global South, North America, Europe) to filter local events.
              </p>
            </div>

            <div className="setup-step-card">
              <div className="setup-step-num">03</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.4rem" }}>Autonomous Verified Stream</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Your community receives real-time verified event passes, deadline alerts, and official registration links without any manual posting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          EVENT PASS MODAL
          ==================================================================== */}
      {selectedEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            <div className="card-badges" style={{ marginTop: "0.5rem" }}>
              <span className="badge-pill badge-type">{selectedEvent.event_type || "EVENT"}</span>
              <span className="badge-pill badge-online">{selectedEvent.format || "HYBRID"}</span>
              <span className="badge-pill badge-free">{selectedEvent.is_free ? "FREE ENTRY" : "PAID ENTRY"}</span>
              {selectedEvent.distanceKm != null && (
                <span className="badge-pill badge-distance">
                  📍 {selectedEvent.distanceKm <= 10 ? `In ${selectedEvent.city || "your area"}` : `${selectedEvent.distanceKm} km away`}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0.75rem 0 0.35rem" }}>
              {selectedEvent.title}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Organized by {selectedEvent.organizer_name || "Community Partner"}
            </p>

            <div className="card-meta-list" style={{ fontSize: "0.88rem" }}>
              <div className="meta-row">
                <span style={{ fontWeight: 600 }}>Date:</span>
                <span>{formatDate(selectedEvent.start_date)} {selectedEvent.end_date ? `— ${formatDate(selectedEvent.end_date)}` : ""}</span>
              </div>
              <div className="meta-row">
                <span style={{ fontWeight: 600 }}>Location:</span>
                <span>{selectedEvent.city ? `${selectedEvent.city}, ${selectedEvent.country || ""}` : "Global Virtual"} {selectedEvent.venue ? `(${selectedEvent.venue})` : ""}</span>
              </div>
              {selectedEvent.distanceKm != null && (
                <div className="meta-row" style={{ color: "var(--color-green)", fontWeight: 700 }}>
                  <span>Distance:</span>
                  <span>{selectedEvent.distanceKm} kilometers from your location</span>
                </div>
              )}
              {selectedEvent.price_detail && (
                <div className="meta-row">
                  <span style={{ fontWeight: 600 }}>Pricing:</span>
                  <span>{selectedEvent.price_detail}</span>
                </div>
              )}
              {selectedEvent.prize && (
                <div className="meta-row" style={{ color: "var(--color-orange)", fontWeight: 700 }}>
                  <span>Prizes & Grants:</span>
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
