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
    /* Tab navigation (Events / Research) reuses the nav-btn + active pill treatment */
    .nav-tabs {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-right: 0.5rem;
      padding-right: 0.75rem;
      border-right: 1px solid var(--border);
    }
    .nav-btn.active {
      background: #1e293b;
      border-color: #3b82f6;
      color: #60a5fa;
    }
    .nav-btn.active:hover {
      background: #1e293b;
      border-color: #3b82f6;
      color: #60a5fa;
    }
    .nav-btn[aria-current="page"] {
      font-weight: 600;
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

    /* Research view container (metrics + inspector filled in by later tasks) */
    .research-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem 4rem;
    }

    /* Aggregate quality metrics grid (Research tab). Reuses the shared card
       surface + border + text variables; no new palette introduced. */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      transition: border-color 0.15s ease;
    }
    .stat-card:hover {
      border-color: #374151;
    }
    .stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.9rem;
      font-weight: 600;
      line-height: 1.1;
      color: var(--text);
    }
    .stat-label {
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-sub);
    }
    .stat-hint {
      font-size: 0.78rem;
      color: var(--text-muted);
      line-height: 1.35;
    }

    /* ── Event inspector (Research tab, task 6) ───────────────────────────
       Renders below the metrics panel. All surfaces reuse the shared card
       variables; no new palette. Every dynamic value is an escaped React
       child (never dangerouslySetInnerHTML) — scraped content is data. */
    .inspector {
      display: grid;
      grid-template-columns: minmax(240px, 320px) 1fr;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 860px) {
      .inspector { grid-template-columns: 1fr; }
    }
    .inspector-list {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 70vh;
      overflow-y: auto;
    }
    .inspector-search {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.55rem 0.75rem;
      color: var(--text);
      font-size: 0.88rem;
      font-family: inherit;
      outline: none;
    }
    .inspector-search:focus { border-color: var(--border-focus); }
    .inspector-item {
      text-align: left;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.6rem 0.7rem;
      color: var(--text-sub);
      cursor: pointer;
      font-family: inherit;
      font-size: 0.85rem;
      line-height: 1.35;
      transition: all 0.15s ease;
    }
    .inspector-item:hover { border-color: #4b5563; color: var(--text); }
    .inspector-item.active {
      background: #1e293b;
      border-color: #3b82f6;
      color: #60a5fa;
    }
    .inspector-item-sub {
      display: block;
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
    }
    .inspector-detail {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      min-width: 0;
    }
    .inspector-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem;
    }
    .inspector-panel h3 {
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin-bottom: 0.85rem;
    }
    .verify-head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .decision-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      border: 1px solid #374151;
      background: #1e293b;
      color: var(--text-sub);
      letter-spacing: 0.02em;
    }
    .decision-badge.good { background: #064e3b; color: #6ee7b7; border-color: #065f46; }
    .decision-badge.warn { background: #78350f; color: #fcd34d; border-color: #92400e; }
    .decision-badge.bad  { background: #7f1d1d; color: #fca5a5; border-color: #991b1b; }
    .verify-metric {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: var(--text-sub);
    }
    .verify-metric strong { color: var(--text); }
    .legend {
      font-size: 0.78rem;
      color: var(--text-muted);
      line-height: 1.4;
      background: var(--bg);
      border: 1px solid #1e293b;
      border-left: 3px solid #3b82f6;
      border-radius: 6px;
      padding: 0.6rem 0.75rem;
    }
    .reg-note {
      font-size: 0.82rem;
      color: #fcd34d;
      background: #78350f33;
      border: 1px solid #92400e;
      border-radius: 6px;
      padding: 0.55rem 0.7rem;
      margin-top: 0.75rem;
    }
    .evidence-row {
      background: var(--bg);
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 0.7rem 0.8rem;
      margin-bottom: 0.6rem;
      font-size: 0.84rem;
      color: var(--text-sub);
    }
    .evidence-row:last-child { margin-bottom: 0; }
    .evidence-head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.35rem;
    }
    .evidence-type {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .evidence-text { line-height: 1.45; word-break: break-word; }
    .evidence-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.4rem;
      font-size: 0.74rem;
      color: var(--text-muted);
    }
    .supports-yes { color: #6ee7b7; }
    .supports-no  { color: #fca5a5; }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
    }
    .data-table th, .data-table td {
      text-align: left;
      padding: 0.5rem 0.6rem;
      border-bottom: 1px solid var(--border);
      color: var(--text-sub);
      word-break: break-word;
    }
    .data-table th {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--text-muted);
      font-weight: 600;
    }
    .data-table tr:last-child td { border-bottom: none; }
    .table-scroll { overflow-x: auto; }
    .source-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.6rem;
      padding: 0.55rem 0;
      border-bottom: 1px solid var(--border);
      font-size: 0.84rem;
      color: var(--text-sub);
    }
    .source-row:last-child { border-bottom: none; }
    .level-chip {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.2rem 0.45rem;
      border-radius: 4px;
      background: #312e81;
      color: #c7d2fe;
    }
    .discovery-tag {
      font-size: 0.72rem;
      color: #fcd34d;
      background: #78350f33;
      border: 1px solid #92400e;
      border-radius: 4px;
      padding: 0.15rem 0.4rem;
    }
    .timeline-item {
      border-left: 2px solid var(--border);
      padding: 0 0 0.9rem 0.9rem;
      margin-left: 0.3rem;
      position: relative;
    }
    .timeline-item:last-child { padding-bottom: 0; }
    .timeline-item::before {
      content: "";
      position: absolute;
      left: -5px;
      top: 0.3rem;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3b82f6;
    }
    .timeline-item.conflict { border-left-color: #92400e; }
    .timeline-item.conflict::before { background: #fcd34d; }
    .timeline-field {
      font-weight: 600;
      color: var(--text);
      font-size: 0.85rem;
    }
    .timeline-change {
      font-size: 0.82rem;
      color: var(--text-sub);
      margin: 0.2rem 0;
      word-break: break-word;
    }
    .timeline-old { color: #fca5a5; }
    .timeline-new { color: #6ee7b7; }
    .timeline-time { font-size: 0.74rem; color: var(--text-muted); }
    .conflict-flag {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #fcd34d;
      background: #78350f33;
      border: 1px solid #92400e;
      border-radius: 4px;
      padding: 0.1rem 0.4rem;
      margin-left: 0.5rem;
    }
    .ext-link {
      color: #60a5fa;
      text-decoration: none;
      word-break: break-all;
    }
    .ext-link:hover { text-decoration: underline; }
    .inspector-hint {
      color: var(--text-muted);
      font-size: 0.9rem;
      padding: 2rem 1rem;
      text-align: center;
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

    // Research view. Task 5 fills in the aggregate metrics panel
    // (GET /api/research/stats); task 6 extends this component with the
    // per-event inspector (GET /api/research/event?id=…). The header block is
    // shared scaffolding — leave it intact so later tasks can slot additional
    // sections below the metrics panel.
    //
    // Metric cards, in display order. Labels map 1:1 to the endpoint's metrics
    // object keys; no number is ever computed or invented on the client — each
    // value comes straight from /api/research/stats (Req 5.2, 7.1).
    const RESEARCH_STAT_CARDS = [
      { key: "discovered", label: "Discovered", hint: "Leads found by discovery (not proof)" },
      { key: "verified", label: "Verified", hint: "Passed verification scoring" },
      { key: "published", label: "Published", hint: "Live on the public portal" },
      { key: "rejected", label: "Rejected", hint: "Failed verification or safety checks" },
      { key: "suspicious", label: "Suspicious", hint: "Flagged for closer review" },
      { key: "needs_review", label: "Needs review", hint: "Awaiting a human decision" },
      { key: "broken_links", label: "Broken links", hint: "Links in a problem security state" },
    ];

    // Decision enums (Req 2.4). The badge renders ONLY these literals; a
    // decision outside this set is shown verbatim but styled neutrally. No
    // "100% safe"/"guaranteed" language ever appears.
    const DECISION_TONE = {
      VERIFIED_OFFICIAL: "good",
      VERIFIED_BY_MULTIPLE_SOURCES: "good",
      LIKELY_LEGITIMATE: "warn",
      UNVERIFIED: "warn",
      SUSPICIOUS: "bad",
      REJECTED: "bad",
    };

    // Exact fallback sentence, copied verbatim from the notification templates
    // (UNVERIFIED_NOTE in src/notify/templates.ts) so the portal and the alerts
    // say the same thing (Req 2.5).
    const REGISTRATION_UNVERIFIED_SENTENCE =
      "Registration link could not be independently verified.";

    // Source levels L1–L4 are authoritative/confirming tiers; L5–L7 are
    // discovery-only leads. Discovery sources are labeled "discovery, not proof"
    // (Req 3.3). Derived from source_level since event_sources has no is_discovery
    // flag (see schema notes, discrepancy #2).
    function isDiscoveryLevel(level) {
      const n = Number(level);
      return !Number.isFinite(n) || n >= 5;
    }

    // A plain external link. href is a scraped value, so rel disables referrer
    // leakage and the opener relationship; the visible text is an escaped child.
    function ExtLink({ href }) {
      if (!href) return <span style={{ color: "var(--text-muted)" }}>—</span>;
      return (
        <a className="ext-link" href={href} target="_blank" rel="noopener noreferrer nofollow">
          {href}
        </a>
      );
    }

    function ResearchView({ events, eventsLoading }) {
      // Metrics are fetched once on mount from the dedicated read-only endpoint
      // (Req 5.2). We never derive counts from the event list on the client.
      const [metrics, setMetrics] = useState(null);
      const [statsLoading, setStatsLoading] = useState(true);
      const [statsError, setStatsError] = useState(false);

      // Event inspector state. The selectable list reuses the already-loaded
      // /api/events data (passed down from App) — no second list fetch. Only the
      // per-event detail is fetched on demand from /api/research/event?id=….
      const [query, setQuery] = useState("");
      const [selectedId, setSelectedId] = useState(null);
      const [detail, setDetail] = useState(null);
      const [detailLoading, setDetailLoading] = useState(false);
      const [detailError, setDetailError] = useState(false);

      useEffect(() => {
        let active = true;
        fetch("/api/research/stats")
          .then((res) => res.json())
          .then((data) => {
            if (!active) return;
            // Only trust an explicit ok:true with a metrics object; anything
            // else degrades to the empty state rather than fabricating numbers
            // (Req 5.3).
            if (data && data.ok === true && data.metrics) {
              setMetrics(data.metrics);
            } else {
              setStatsError(true);
            }
            setStatsLoading(false);
          })
          .catch(() => {
            if (!active) return;
            setStatsError(true);
            setStatsLoading(false);
          });
        return () => {
          active = false;
        };
      }, []);

      // On selecting an event, fetch its research detail. Guards against stale
      // responses when the selection changes mid-flight.
      useEffect(() => {
        if (!selectedId) {
          setDetail(null);
          setDetailError(false);
          setDetailLoading(false);
          return;
        }
        let active = true;
        setDetailLoading(true);
        setDetailError(false);
        setDetail(null);
        fetch("/api/research/event?id=" + encodeURIComponent(selectedId))
          .then((res) => res.json())
          .then((data) => {
            if (!active) return;
            if (data && data.ok === true && data.event) {
              setDetail(data);
            } else {
              setDetailError(true);
            }
            setDetailLoading(false);
          })
          .catch(() => {
            if (!active) return;
            setDetailError(true);
            setDetailLoading(false);
          });
        return () => {
          active = false;
        };
      }, [selectedId]);

      // Filter the shared events list for the selectable inspector list. Matching
      // is purely client-side over data already loaded for the Events tab.
      const inspectorEvents = useMemo(() => {
        const list = events || [];
        const q = query.trim().toLowerCase();
        const matched = q
          ? list.filter((ev) => {
              const t = (ev.title || "").toLowerCase();
              const o = (ev.organizer_name || "").toLowerCase();
              const c = (ev.city || "").toLowerCase();
              return t.includes(q) || o.includes(q) || c.includes(q);
            })
          : list;
        return matched.slice(0, 100);
      }, [events, query]);

      const renderMetrics = () => {
        if (statsLoading) {
          return <div className="empty-state">Loading quality metrics…</div>;
        }
        // No fabricated fallbacks: when the endpoint is unavailable or reports
        // ok:false we show a clear, honest empty state (Req 5.3).
        if (statsError || !metrics) {
          return (
            <div className="empty-state">
              <p style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>
                Quality metrics are unavailable right now.
              </p>
              <p style={{ fontSize: "0.88rem" }}>
                No numbers are shown rather than guessing. Try again shortly.
              </p>
            </div>
          );
        }
        return (
          <div className="stat-grid">
            {RESEARCH_STAT_CARDS.map((card) => (
              <div key={card.key} className="stat-card">
                <div className="stat-value">{Number(metrics[card.key]) || 0}</div>
                <div className="stat-label">{card.label}</div>
                <div className="stat-hint">{card.hint}</div>
              </div>
            ))}
          </div>
        );
      };

      // ── Verification block (Req 2.1, 2.4) ────────────────────────────────
      // Decision badge uses only the defined enum literals; the legend states
      // plainly that no claim is absolute. Score and tier come straight from
      // the events row.
      const renderVerification = (ev) => {
        const decision = ev.verification_decision || "UNVERIFIED";
        const tone = DECISION_TONE[decision] || "";
        const score =
          ev.verification_score === null || ev.verification_score === undefined
            ? "—"
            : ev.verification_score;
        const tier = ev.publishing_tier || "—";
        // Show the exact fallback sentence whenever no verified registration URL
        // exists (the pipeline stores a registration_unverified_note in that case).
        const regUnverified = !ev.registration_url;
        return (
          <div className="inspector-panel">
            <h3>Verification</h3>
            <div className="verify-head">
              <span className={"decision-badge " + tone}>{decision}</span>
              <span className="verify-metric">
                Score: <strong>{score}</strong>
              </span>
              <span className="verify-metric">
                Tier: <strong>{tier}</strong>
              </span>
            </div>
            <div className="legend">
              These are evidence-based signals, not an absolute guarantee. No event is ever
              marked “100% safe” or “guaranteed” — always review the evidence and the official
              page before registering.
            </div>
            {regUnverified && (
              <div className="reg-note">{REGISTRATION_UNVERIFIED_SENTENCE}</div>
            )}
          </div>
        );
      };

      // ── Evidence list (Req 2.2) ──────────────────────────────────────────
      const renderEvidence = (evidence) => (
        <div className="inspector-panel">
          <h3>Evidence</h3>
          {(!evidence || evidence.length === 0) ? (
            <p className="inspector-hint">No evidence rows recorded for this event.</p>
          ) : (
            evidence.map((row) => (
              <div key={row.evidence_id} className="evidence-row">
                <div className="evidence-head">
                  <span className="evidence-type">{row.evidence_type || "EVIDENCE"}</span>
                  {row.supports_claim === 1 || row.supports_claim === true ? (
                    <span className="supports-yes">supports claim</span>
                  ) : row.supports_claim === 0 || row.supports_claim === false ? (
                    <span className="supports-no">contradicts claim</span>
                  ) : null}
                </div>
                <div className="evidence-text">{row.evidence_text}</div>
                <div className="evidence-meta">
                  {row.source_url && <ExtLink href={row.source_url} />}
                  {row.observed_at && <span>observed {row.observed_at}</span>}
                  {(row.source_trust !== null && row.source_trust !== undefined) && (
                    <span>trust {row.source_trust}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      );

      // ── Links table (Req 2.3) ────────────────────────────────────────────
      const renderLinks = (links) => (
        <div className="inspector-panel">
          <h3>Links</h3>
          {(!links || links.length === 0) ? (
            <p className="inspector-hint">No links recorded for this event.</p>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>URL</th>
                    <th>Domain</th>
                    <th>Relationship</th>
                    <th>HTTPS</th>
                    <th>Redirects</th>
                    <th>Security</th>
                    <th>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((row) => (
                    <tr key={row.link_id}>
                      <td>{row.url_type || "—"}</td>
                      <td><ExtLink href={row.final_url || row.original_url} /></td>
                      <td>{row.domain || "—"}</td>
                      <td>{row.domain_relationship || "—"}</td>
                      <td>{row.is_https === 1 || row.is_https === true ? "yes" : "no"}</td>
                      <td>{row.redirect_count === null || row.redirect_count === undefined ? "—" : row.redirect_count}</td>
                      <td>{row.security_status || "—"}</td>
                      <td>{row.verification_status || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Exact unverified-registration fallback sentence (Req 2.5), shown
              when this event has no independently verified registration link. */}
          {detail && detail.event && !detail.event.registration_url && (
            <p className="reg-note">{REGISTRATION_UNVERIFIED_SENTENCE}</p>
          )}
        </div>
      );

      // ── Sources list (Req 3.1, 3.3) ──────────────────────────────────────
      // event_sources has only source_level (no per-source trust column — schema
      // notes #2), so we show the L-level and never fabricate a trust number.
      const renderSources = (sources) => (
        <div className="inspector-panel">
          <h3>Sources</h3>
          {(!sources || sources.length === 0) ? (
            <p className="inspector-hint">No source provenance recorded for this event.</p>
          ) : (
            sources.map((row) => {
              const lvl = row.source_level;
              const discovery = isDiscoveryLevel(lvl);
              return (
                <div key={row.id} className="source-row">
                  <span className="level-chip">
                    {lvl === null || lvl === undefined ? "L?" : "L" + lvl}
                  </span>
                  <ExtLink href={row.source_url} />
                  {discovery && (
                    <span className="discovery-tag">discovery, not proof</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      );

      // ── Change timeline (Req 4.1, 4.3) ───────────────────────────────────
      // Rendered newest-first (the endpoint already orders by detected_at DESC).
      // Conflicting changes to the same field are FLAGGED, never resolved.
      const renderTimeline = (changes) => {
        const list = changes || [];
        // Count changes per field to flag fields that changed more than once —
        // a conflict signal we surface rather than silently reconcile.
        const perField = {};
        list.forEach((c) => {
          perField[c.field] = (perField[c.field] || 0) + 1;
        });
        return (
          <div className="inspector-panel">
            <h3>Change timeline</h3>
            {list.length === 0 ? (
              <p className="inspector-hint">No recorded changes for this event.</p>
            ) : (
              list.map((row) => {
                const conflict = perField[row.field] > 1;
                return (
                  <div
                    key={row.change_id}
                    className={"timeline-item" + (conflict ? " conflict" : "")}
                  >
                    <div className="timeline-field">
                      {row.field}
                      {conflict && <span className="conflict-flag">conflict</span>}
                    </div>
                    <div className="timeline-change">
                      <span className="timeline-old">{row.old_value === null || row.old_value === undefined ? "∅" : String(row.old_value)}</span>
                      {" → "}
                      <span className="timeline-new">{row.new_value === null || row.new_value === undefined ? "∅" : String(row.new_value)}</span>
                    </div>
                    <div className="timeline-time">{row.detected_at}</div>
                  </div>
                );
              })
            )}
          </div>
        );
      };

      // ── Freshness signals (Req 4.2) ──────────────────────────────────────
      const renderFreshness = (ev) => {
        const rows = [
          ["First seen", ev.first_seen],
          ["Last seen", ev.last_seen],
          ["Last verified", ev.last_verified],
          ["Last link check", ev.last_link_check],
        ].filter(([, v]) => v);
        if (rows.length === 0) return null;
        return (
          <div className="inspector-panel">
            <h3>Freshness</h3>
            <div className="table-scroll">
              <table className="data-table">
                <tbody>
                  {rows.map(([label, value]) => (
                    <tr key={label}>
                      <th style={{ width: "40%" }}>{label}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      };

      const renderDetail = () => {
        if (!selectedId) {
          return (
            <div className="inspector-panel">
              <p className="inspector-hint">
                Select an event from the list to inspect its verification evidence,
                links, sources, and change history.
              </p>
            </div>
          );
        }
        if (detailLoading) {
          return (
            <div className="inspector-panel">
              <p className="inspector-hint">Loading event research detail…</p>
            </div>
          );
        }
        if (detailError || !detail || !detail.event) {
          return (
            <div className="inspector-panel">
              <p className="inspector-hint">
                This event's research detail is unavailable. It may not be public, or the
                lookup failed — no data is shown rather than guessing.
              </p>
            </div>
          );
        }
        const ev = detail.event;
        return (
          <React.Fragment>
            <div className="inspector-panel" style={{ paddingBottom: "0.75rem" }}>
              <h3>Event</h3>
              <div className="timeline-field" style={{ fontSize: "1.1rem" }}>{ev.title}</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                {ev.organizer_name || "Unknown organizer"}
                {ev.city ? " · " + ev.city : ""}
                {ev.status ? " · " + ev.status : ""}
              </p>
            </div>
            {renderVerification(ev)}
            {renderEvidence(detail.evidence)}
            {renderLinks(detail.links)}
            {renderSources(detail.sources)}
            {renderTimeline(detail.changes)}
            {renderFreshness(ev)}
          </React.Fragment>
        );
      };

      const renderInspector = () => (
        <div className="inspector">
          <div className="inspector-list">
            <input
              type="text"
              className="inspector-search"
              placeholder="Search events to inspect…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {eventsLoading ? (
              <p className="inspector-hint">Loading events…</p>
            ) : inspectorEvents.length === 0 ? (
              <p className="inspector-hint">No events match.</p>
            ) : (
              inspectorEvents.map((ev) => (
                <button
                  key={ev.event_id}
                  type="button"
                  className={"inspector-item" + (selectedId === ev.event_id ? " active" : "")}
                  aria-current={selectedId === ev.event_id ? "true" : undefined}
                  onClick={() => setSelectedId(ev.event_id)}
                >
                  {ev.title}
                  <span className="inspector-item-sub">
                    {(ev.organizer_name || "Unknown organizer")}
                    {ev.city ? " · " + ev.city : ""}
                  </span>
                </button>
              ))
            )}
          </div>
          <div className="inspector-detail">{renderDetail()}</div>
        </div>
      );

      return (
        <section className="research-wrapper">
          <div className="header-section" style={{ padding: "2.5rem 0 1rem" }}>
            <h1 className="header-title">Research & Verification</h1>
            <p className="header-desc">
              Inspect the evidence, provenance, change history, and quality metrics behind
              each verified event. Discovery sources are shown as leads, not proof — every
              decision carries its own audit trail.
            </p>
          </div>

          {/* Aggregate quality metrics (Req 5.1). */}
          {renderMetrics()}

          {/* Event inspector (Req 2–4): select an event to see its full audit
              trail. Reuses the already-loaded /api/events list for selection. */}
          <h2 className="header-title" style={{ fontSize: "1.4rem", margin: "0.5rem 0 1.25rem" }}>
            Event inspector
          </h2>
          {renderInspector()}
        </section>
      );
    }

    // EventsView now receives the shared events list from App (fetched once in
    // App). This lets the Research inspector reuse the exact same data without a
    // second /api/events round-trip.
    function EventsView({ events, loading, error }) {
      // Filter states
      const [search, setSearch] = useState("");
      const [type, setType] = useState("ALL");
      const [format, setFormat] = useState("ALL");
      const [isFree, setIsFree] = useState("ALL");
      const [city, setCity] = useState("ALL");
      const [selectedEvent, setSelectedEvent] = useState(null);

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
        <React.Fragment>
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

        </React.Fragment>
      );
    }

    function App() {
      // Tab state initialised from the URL hash so #research is linkable and
      // refresh-safe (Req 1.4). Anything other than #research falls back to
      // the default Events tab (Req 1.1).
      const [tab, setTab] = useState(() => (location.hash === "#research" ? "research" : "events"));

      // Events are fetched once here and shared with both tabs. The Research
      // inspector reuses this exact list for selection, so there is no second
      // /api/events round-trip when switching tabs.
      const [events, setEvents] = useState([]);
      const [eventsLoading, setEventsLoading] = useState(true);
      const [eventsError, setEventsError] = useState(null);

      useEffect(() => {
        let active = true;
        fetch("/api/events")
          .then((res) => res.json())
          .then((data) => {
            if (!active) return;
            if (data && data.events) {
              setEvents(data.events);
            }
            setEventsLoading(false);
          })
          .catch((err) => {
            if (!active) return;
            setEventsError(err.message);
            setEventsLoading(false);
          });
        return () => {
          active = false;
        };
      }, []);

      // Keep component state in sync when the hash changes (back/forward,
      // manual edits, shared links) — Req 1.4.
      useEffect(() => {
        const onHashChange = () => {
          setTab(location.hash === "#research" ? "research" : "events");
        };
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
      }, []);

      // Switch tab without a full page reload (Req 1.2) and reflect it in the
      // hash (Req 1.4). Events uses an empty hash so the default URL stays clean.
      const switchTab = (next) => {
        setTab(next);
        if (next === "research") {
          location.hash = "#research";
        } else if (location.hash === "#research") {
          // Clear the hash without adding an extra history entry.
          history.replaceState(null, "", location.pathname + location.search);
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
                {/* Events / Research tabs (Req 1.1) */}
                <nav className="nav-tabs" aria-label="Primary">
                  <button
                    type="button"
                    className={"nav-btn " + (tab === "events" ? "active" : "")}
                    aria-current={tab === "events" ? "page" : undefined}
                    onClick={() => switchTab("events")}
                  >
                    Events
                  </button>
                  <button
                    type="button"
                    className={"nav-btn " + (tab === "research" ? "active" : "")}
                    aria-current={tab === "research" ? "page" : undefined}
                    onClick={() => switchTab("research")}
                  >
                    Research
                  </button>
                </nav>
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

          {/* Conditional content: Events (default) or Research. The Events
              filter panel lives inside EventsView, so rendering ResearchView
              instead hides it entirely (Req 1.3). */}
          {tab === "research" ? (
            <ResearchView events={events} eventsLoading={eventsLoading} />
          ) : (
            <EventsView events={events} loading={eventsLoading} error={eventsError} />
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
