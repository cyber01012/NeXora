import { useState, useEffect, useRef } from "react";

const CYAN = "#00f0ff";
const RED_GLOW = "#ff2a2a";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cp-root {
    --glow: #00f0ff;
    --glow-rgb: 0, 240, 255;
    --bg: #030a10;
    --bg2: #050916;
    --bg3: #0a1628;
    --border: rgba(0,240,255,0.2);
    --border-bright: rgba(0,240,255,0.5);
    --text: #e0f8ff;
    --text-muted: rgba(224,248,255,0.55);
    font-family: 'Share Tech Mono', monospace;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    overflow: hidden;
  }

  .cp-root.disaster {
    --glow: #ff2a2a;
    --glow-rgb: 255, 42, 42;
    --bg: #150000;
    --bg2: #200000;
    --bg3: #2a0808;
    --border: rgba(255,42,42,0.2);
    --border-bright: rgba(255,42,42,0.5);
    --text: #ffe0e0;
    --text-muted: rgba(255,224,224,0.55);
  }

  /* ── Sidebar ── */
  .cp-sidebar {
    width: 240px;
    min-height: 100vh;
    background: var(--bg2);
    border-right: 1px solid var(--border-bright);
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
  }

  .cp-logo {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
  }

  .cp-logo-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 22px;
    font-weight: 900;
    color: var(--glow);
    text-shadow: 0 0 12px var(--glow);
    letter-spacing: 3px;
  }

  .cp-logo-sub {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 2px;
    margin-top: 2px;
  }

  .cp-user-card {
    margin: 14px 12px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cp-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--glow) 0%, transparent 100%);
    border: 1px solid var(--border-bright);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--glow);
    text-shadow: 0 0 8px var(--glow);
    flex-shrink: 0;
  }

  .cp-user-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .cp-user-role { font-size: 10px; color: var(--text-muted); letter-spacing: 1px; }

  .cp-nav { flex: 1; overflow-y: auto; padding: 8px 0; }
  .cp-nav::-webkit-scrollbar { width: 3px; }
  .cp-nav::-webkit-scrollbar-track { background: transparent; }
  .cp-nav::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 2px; }

  .cp-nav-section {
    font-size: 9px;
    color: var(--text-muted);
    letter-spacing: 2px;
    padding: 12px 16px 4px;
  }

  .cp-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 16px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    font-size: 12px;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }

  .cp-nav-item:hover { color: var(--text); background: rgba(var(--glow-rgb),0.07); }

  .cp-nav-item.active {
    color: var(--glow);
    background: rgba(var(--glow-rgb),0.12);
    text-shadow: 0 0 8px var(--glow);
  }

  .cp-nav-item.active::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--glow);
    box-shadow: 0 0 8px var(--glow);
    border-radius: 0 2px 2px 0;
  }

  .cp-nav-icon { font-size: 15px; width: 18px; text-align: center; }

  .cp-badge {
    margin-left: auto;
    background: var(--glow);
    color: var(--bg);
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }

  .cp-sidebar-footer {
    padding: 12px;
    border-top: 1px solid var(--border);
  }

  .cp-disaster-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 1px;
    transition: all 0.25s;
    margin-bottom: 8px;
  }

  .cp-disaster-toggle.active {
    border-color: #ff2a2a;
    color: #ff2a2a;
    background: rgba(255,42,42,0.1);
    text-shadow: 0 0 6px #ff2a2a;
    box-shadow: 0 0 12px rgba(255,42,42,0.2);
  }

  .cp-toggle-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--text-muted);
    flex-shrink: 0;
    transition: background 0.25s;
  }

  .cp-disaster-toggle.active .cp-toggle-dot { background: #ff2a2a; box-shadow: 0 0 6px #ff2a2a; }

  .cp-logout-btn {
    width: 100%;
    padding: 8px 12px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-muted);
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cp-logout-btn:hover { border-color: #ff4444; color: #ff4444; }

  /* ── Main ── */
  .cp-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  .cp-topbar {
    height: 56px;
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 12px;
    flex-shrink: 0;
  }

  .cp-page-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--glow);
    text-shadow: 0 0 10px var(--glow);
    letter-spacing: 2px;
    flex: 1;
  }

  .cp-topbar-actions { display: flex; align-items: center; gap: 10px; }

  .cp-sos-btn {
    padding: 7px 18px;
    background: rgba(255,42,42,0.15);
    border: 1px solid #ff2a2a;
    border-radius: 4px;
    color: #ff2a2a;
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.2s;
    text-shadow: 0 0 6px #ff2a2a;
    box-shadow: 0 0 10px rgba(255,42,42,0.2);
    animation: sos-pulse 2s infinite;
  }

  @keyframes sos-pulse {
    0%,100% { box-shadow: 0 0 10px rgba(255,42,42,0.2); }
    50% { box-shadow: 0 0 20px rgba(255,42,42,0.5); }
  }

  .cp-icon-btn {
    width: 34px; height: 34px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 16px;
    transition: all 0.2s;
    position: relative;
  }

  .cp-icon-btn:hover { border-color: var(--border-bright); color: var(--glow); }

  .cp-notif-dot {
    position: absolute;
    top: 6px; right: 6px;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #ff4444;
    box-shadow: 0 0 5px #ff4444;
  }

  .cp-content { flex: 1; overflow-y: auto; padding: 24px; }
  .cp-content::-webkit-scrollbar { width: 4px; }
  .cp-content::-webkit-scrollbar-track { background: transparent; }
  .cp-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* ── Cards ── */
  .cp-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 20px;
    position: relative;
    overflow: hidden;
  }

  .cp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--glow), transparent);
    opacity: 0.4;
  }

  .cp-card-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--text-muted);
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  /* Stats Grid */
  .cp-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }

  .cp-stat-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 16px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
  }

  .cp-stat-card:hover { border-color: var(--border-bright); }

  .cp-stat-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent-color, var(--glow));
    opacity: 0.5;
  }

  .cp-stat-label {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 1.5px;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .cp-stat-value {
    font-family: 'Orbitron', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--accent-color, var(--glow));
    text-shadow: 0 0 15px var(--accent-color, var(--glow));
    line-height: 1;
  }

  .cp-stat-change {
    font-size: 10px;
    color: #22c55e;
    margin-top: 4px;
  }

  /* Two-col layout */
  .cp-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .cp-three-col {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  /* Map placeholder */
  .cp-map-placeholder {
    background: var(--bg3);
    border-radius: 6px;
    height: 200px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
  }

  .cp-map-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(var(--glow-rgb),0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(var(--glow-rgb),0.06) 1px, transparent 1px);
    background-size: 30px 30px;
  }

  .cp-map-label {
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 2px;
    z-index: 1;
    text-align: center;
  }

  .cp-map-dot {
    position: absolute;
    border-radius: 50%;
    animation: map-ping 2s infinite;
  }

  @keyframes map-ping {
    0% { box-shadow: 0 0 0 0 rgba(var(--glow-rgb), 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(var(--glow-rgb), 0); }
    100% { box-shadow: 0 0 0 0 rgba(var(--glow-rgb), 0); }
  }

  /* Report list */
  .cp-report-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    cursor: pointer;
  }

  .cp-report-item:last-child { border-bottom: none; }
  .cp-report-item:hover { background: rgba(var(--glow-rgb),0.04); margin: 0 -20px; padding: 10px 20px; }

  .cp-report-icon {
    width: 32px; height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .cp-report-info { flex: 1; min-width: 0; }
  .cp-report-id { font-size: 11px; color: var(--text-muted); }
  .cp-report-title { font-size: 13px; color: var(--text); }

  .cp-status-badge {
    font-size: 10px;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 1px;
    font-weight: 500;
    white-space: nowrap;
  }

  .s-pending { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
  .s-approved { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
  .s-inprogress { background: rgba(var(--glow-rgb),0.1); color: var(--glow); border: 1px solid rgba(var(--glow-rgb),0.3); }
  .s-completed { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
  .s-rejected { background: rgba(255,42,42,0.15); color: #f87171; border: 1px solid rgba(255,42,42,0.3); }

  /* Form Styles */
  .cp-form-label {
    display: block;
    font-size: 11px;
    letter-spacing: 1.5px;
    color: var(--text-muted);
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .cp-input, .cp-select, .cp-textarea {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 12px;
    color: var(--text);
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }

  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color: var(--border-bright);
    box-shadow: 0 0 10px rgba(var(--glow-rgb),0.15);
  }

  .cp-select option { background: var(--bg2); color: var(--text); }
  .cp-textarea { resize: vertical; min-height: 90px; }

  .cp-form-group { margin-bottom: 16px; }

  .cp-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .cp-btn {
    padding: 10px 20px;
    border-radius: 6px;
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid;
  }

  .cp-btn-primary {
    background: rgba(var(--glow-rgb),0.15);
    border-color: var(--glow);
    color: var(--glow);
    text-shadow: 0 0 8px var(--glow);
  }

  .cp-btn-primary:hover {
    background: rgba(var(--glow-rgb),0.25);
    box-shadow: 0 0 15px rgba(var(--glow-rgb),0.3);
  }

  .cp-btn-danger {
    background: rgba(255,42,42,0.15);
    border-color: #ff2a2a;
    color: #ff2a2a;
  }

  .cp-btn-ghost {
    background: transparent;
    border-color: var(--border);
    color: var(--text-muted);
  }

  .cp-btn-ghost:hover { border-color: var(--border-bright); color: var(--text); }

  .cp-btn-sm {
    padding: 5px 12px;
    font-size: 9px;
    letter-spacing: 1px;
  }

  /* Upload zone */
  .cp-upload-zone {
    border: 2px dashed var(--border);
    border-radius: 8px;
    padding: 28px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cp-upload-zone:hover {
    border-color: var(--border-bright);
    background: rgba(var(--glow-rgb),0.04);
  }

  .cp-upload-icon { font-size: 32px; margin-bottom: 8px; color: var(--text-muted); }
  .cp-upload-text { font-size: 12px; color: var(--text-muted); }
  .cp-upload-sub { font-size: 10px; color: var(--text-muted); opacity: 0.6; margin-top: 4px; }

  /* Filter tabs */
  .cp-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 12px;
  }

  .cp-tab {
    padding: 6px 14px;
    border-radius: 4px;
    font-size: 11px;
    letter-spacing: 1px;
    cursor: pointer;
    color: var(--text-muted);
    border: 1px solid transparent;
    background: transparent;
    font-family: 'Share Tech Mono', monospace;
    transition: all 0.15s;
  }

  .cp-tab.active {
    background: rgba(var(--glow-rgb),0.12);
    border-color: var(--border-bright);
    color: var(--glow);
    text-shadow: 0 0 6px var(--glow);
  }

  .cp-tab:hover:not(.active) { color: var(--text); border-color: var(--border); }

  /* Type selector cards */
  .cp-type-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .cp-type-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cp-type-card.selected {
    border-color: var(--glow);
    background: rgba(var(--glow-rgb),0.1);
    box-shadow: 0 0 12px rgba(var(--glow-rgb),0.2);
  }

  .cp-type-card:hover:not(.selected) { border-color: var(--border-bright); }

  .cp-type-icon { font-size: 22px; margin-bottom: 6px; }
  .cp-type-label { font-size: 10px; color: var(--text-muted); letter-spacing: 1px; }
  .cp-type-card.selected .cp-type-label { color: var(--glow); }

  /* Progress steps */
  .cp-steps {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    gap: 0;
  }

  .cp-step {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--text-muted);
  }

  .cp-step-num {
    width: 22px; height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    font-weight: 700;
    border: 1px solid var(--border);
    flex-shrink: 0;
  }

  .cp-step.done .cp-step-num {
    background: var(--glow);
    border-color: var(--glow);
    color: var(--bg);
    box-shadow: 0 0 8px var(--glow);
  }

  .cp-step.active .cp-step-num {
    border-color: var(--glow);
    color: var(--glow);
    box-shadow: 0 0 8px rgba(var(--glow-rgb),0.3);
  }

  .cp-step.active .cp-step-label { color: var(--glow); }

  .cp-step-line {
    flex: 1;
    height: 1px;
    background: var(--border);
    margin: 0 4px;
  }

  .cp-step-line.done { background: var(--glow); opacity: 0.5; }

  /* Notification item */
  .cp-notif-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s;
  }

  .cp-notif-item.unread::before {
    content: '';
    position: absolute;
    left: 20px;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--glow);
    box-shadow: 0 0 6px var(--glow);
    margin-top: 4px;
  }

  .cp-notif-dot-icon {
    width: 34px; height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .cp-notif-title { font-size: 13px; color: var(--text); margin-bottom: 2px; }
  .cp-notif-msg { font-size: 11px; color: var(--text-muted); }
  .cp-notif-time { font-size: 10px; color: var(--text-muted); margin-top: 4px; }

  /* Timeline */
  .cp-timeline { position: relative; padding-left: 20px; }

  .cp-timeline-item {
    position: relative;
    padding-left: 20px;
    padding-bottom: 20px;
  }

  .cp-timeline-item::before {
    content: '';
    position: absolute;
    left: 0; top: 8px; bottom: 0;
    width: 1px;
    background: var(--border);
  }

  .cp-timeline-item:last-child::before { display: none; }

  .cp-timeline-dot {
    position: absolute;
    left: -4px; top: 6px;
    width: 9px; height: 9px;
    border-radius: 50%;
    background: var(--glow);
    box-shadow: 0 0 6px var(--glow);
  }

  .cp-timeline-time { font-size: 10px; color: var(--text-muted); margin-bottom: 2px; }
  .cp-timeline-text { font-size: 12px; color: var(--text); }

  /* Help Desk Chat */
  .cp-chat-window {
    display: flex;
    flex-direction: column;
    height: 420px;
  }

  .cp-chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cp-chat-messages::-webkit-scrollbar { width: 3px; }
  .cp-chat-messages::-webkit-scrollbar-thumb { background: var(--border); }

  .cp-chat-msg {
    max-width: 70%;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.5;
  }

  .cp-chat-msg.sent {
    align-self: flex-end;
    background: rgba(var(--glow-rgb),0.15);
    border: 1px solid rgba(var(--glow-rgb),0.3);
    color: var(--text);
  }

  .cp-chat-msg.received {
    align-self: flex-start;
    background: var(--bg3);
    border: 1px solid var(--border);
    color: var(--text);
  }

  .cp-chat-msg-time { font-size: 9px; color: var(--text-muted); margin-top: 3px; }

  .cp-chat-input-row {
    display: flex;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px solid var(--border);
    margin-top: 8px;
  }

  /* Profile */
  .cp-profile-hero {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
    padding: 20px;
    background: var(--bg3);
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  .cp-profile-avatar {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: var(--bg2);
    border: 2px solid var(--border-bright);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--glow);
    text-shadow: 0 0 12px var(--glow);
    box-shadow: 0 0 20px rgba(var(--glow-rgb),0.2);
    flex-shrink: 0;
  }

  .cp-profile-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--glow);
    text-shadow: 0 0 10px var(--glow);
  }

  .cp-profile-meta { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

  /* Scrolling marquee disaster */
  .cp-disaster-banner {
    background: rgba(255,42,42,0.15);
    border-bottom: 1px solid rgba(255,42,42,0.4);
    padding: 5px 0;
    overflow: hidden;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }

  .cp-marquee-text {
    font-size: 11px;
    color: #ff2a2a;
    letter-spacing: 2px;
    animation: marquee 20s linear infinite;
    padding-right: 60px;
    text-shadow: 0 0 6px #ff2a2a;
    display: inline-block;
  }

  @keyframes marquee {
    from { transform: translateX(100vw); }
    to { transform: translateX(-100%); }
  }

  /* Scanlines */
  .cp-scanlines {
    position: fixed; inset: 0;
    pointer-events: none;
    z-index: 9999;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.05) 2px,
      rgba(0,0,0,0.05) 4px
    );
  }

  /* Heatmap */
  .cp-heatmap-legend {
    display: flex;
    gap: 12px;
    margin-top: 10px;
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 1px;
    align-items: center;
  }

  .cp-legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 4px; }

  /* Saved locations */
  .cp-location-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cp-location-item:hover { border-color: var(--border-bright); }

  .cp-location-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  /* Star Rating */
  .cp-stars { display: flex; gap: 4px; }
  .cp-star { cursor: pointer; font-size: 16px; color: var(--text-muted); transition: color 0.1s; }
  .cp-star.active { color: #fbbf24; text-shadow: 0 0 6px #fbbf24; }

  /* Priority indicator */
  .cp-priority-high { color: #ff4444; }
  .cp-priority-medium { color: #fbbf24; }
  .cp-priority-low { color: #4ade80; }

  /* Achievements */
  .cp-achievement {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .cp-achievement-icon {
    font-size: 24px;
    width: 40px;
    text-align: center;
  }

  .cp-achievement-title { font-size: 13px; color: var(--text); }
  .cp-achievement-desc { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  /* Modal overlay */
  .cp-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cp-modal {
    background: var(--bg2);
    border: 1px solid var(--border-bright);
    border-radius: 12px;
    padding: 24px;
    width: 420px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 0 40px rgba(var(--glow-rgb),0.15);
  }

  .cp-modal-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--glow);
    text-shadow: 0 0 10px var(--glow);
    letter-spacing: 2px;
    margin-bottom: 16px;
  }

  .cp-close-btn {
    position: absolute;
    top: 16px; right: 16px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-muted);
    cursor: pointer;
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    transition: all 0.2s;
  }

  .cp-close-btn:hover { border-color: #ff4444; color: #ff4444; }

  /* FAQ */
  .cp-faq-item {
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .cp-faq-q {
    padding: 12px 16px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg3);
    transition: background 0.2s;
  }

  .cp-faq-q:hover { background: rgba(var(--glow-rgb),0.07); }

  .cp-faq-a {
    padding: 12px 16px;
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.6;
    border-top: 1px solid var(--border);
    background: var(--bg2);
  }

  /* Settings toggle */
  .cp-setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }

  .cp-setting-label { font-size: 13px; color: var(--text); }
  .cp-setting-sub { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  .cp-toggle-switch {
    width: 40px; height: 22px;
    border-radius: 11px;
    border: 1px solid var(--border);
    background: var(--bg3);
    position: relative;
    cursor: pointer;
    transition: all 0.25s;
    flex-shrink: 0;
  }

  .cp-toggle-switch.on {
    background: rgba(var(--glow-rgb),0.2);
    border-color: var(--glow);
    box-shadow: 0 0 8px rgba(var(--glow-rgb),0.3);
  }

  .cp-toggle-thumb {
    position: absolute;
    top: 3px; left: 3px;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: var(--text-muted);
    transition: all 0.25s;
  }

  .cp-toggle-switch.on .cp-toggle-thumb {
    left: 21px;
    background: var(--glow);
    box-shadow: 0 0 6px var(--glow);
  }

  /* Progress bar */
  .cp-progress-bar {
    height: 4px;
    background: var(--bg3);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 6px;
  }

  .cp-progress-fill {
    height: 100%;
    border-radius: 2px;
    background: var(--glow);
    box-shadow: 0 0 6px var(--glow);
    transition: width 0.5s ease;
  }

  /* Mini charts */
  .cp-mini-chart {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 50px;
  }

  .cp-mini-bar {
    flex: 1;
    background: rgba(var(--glow-rgb),0.25);
    border-top: 1px solid rgba(var(--glow-rgb),0.6);
    border-radius: 2px 2px 0 0;
    transition: height 0.3s;
    min-width: 0;
  }

  /* Empty state */
  .cp-empty {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted);
  }

  .cp-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.4; }
  .cp-empty-text { font-size: 12px; letter-spacing: 1px; }

  /* SOS Modal */
  .cp-sos-modal .cp-modal {
    border-color: rgba(255,42,42,0.6);
    box-shadow: 0 0 40px rgba(255,42,42,0.2);
  }

  .cp-sos-ring {
    width: 100px; height: 100px;
    border-radius: 50%;
    border: 2px solid rgba(255,42,42,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    animation: sos-ring 1.5s infinite;
    position: relative;
  }

  .cp-sos-ring::before {
    content: '';
    position: absolute; inset: -8px;
    border-radius: 50%;
    border: 1px solid rgba(255,42,42,0.2);
    animation: sos-ring 1.5s 0.3s infinite;
  }

  @keyframes sos-ring {
    0% { box-shadow: 0 0 0 0 rgba(255,42,42,0.5); }
    70% { box-shadow: 0 0 0 15px rgba(255,42,42,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,42,42,0); }
  }

  .cp-sos-btn-large {
    width: 70px; height: 70px;
    border-radius: 50%;
    background: rgba(255,42,42,0.2);
    border: 2px solid #ff2a2a;
    color: #ff2a2a;
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 1px;
    cursor: pointer;
    text-shadow: 0 0 10px #ff2a2a;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cp-divider {
    height: 1px;
    background: var(--border);
    margin: 16px 0;
  }

  .cp-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 10px;
    letter-spacing: 1px;
    border: 1px solid var(--border);
    color: var(--text-muted);
    background: var(--bg3);
  }

  .cp-chip.active {
    border-color: rgba(var(--glow-rgb),0.4);
    color: var(--glow);
    background: rgba(var(--glow-rgb),0.1);
  }

  .cp-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .cp-section-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--glow);
    text-shadow: 0 0 8px var(--glow);
    letter-spacing: 2px;
  }
`;

const ISSUE_TYPES = [
  { key: 'ELECTRICITY', icon: '⚡', label: 'ELECTRICITY', color: '#fbbf24' },
  { key: 'GAS', icon: '🔥', label: 'GAS', color: '#f97316' },
  { key: 'ROAD', icon: '🛣️', label: 'ROAD', color: '#60a5fa' },
  { key: 'WATER', icon: '💧', label: 'WATER', color: '#22d3ee' },
  { key: 'MEDICAL', icon: '🏥', label: 'MEDICAL', color: '#4ade80' },
];

const mockReports = [
  { id: 'CIV-2026-1045', type: 'ELECTRICITY', title: 'No electricity in Korangi-2', status: 'INPROGRESS', dept: 'K-Electric', date: '2026-05-29', priority: 'HIGH' },
  { id: 'CIV-2026-1032', type: 'ROAD', title: 'Broken road near street 7', status: 'COMPLETED', dept: 'Municipal', date: '2026-05-25', priority: 'MEDIUM' },
  { id: 'CIV-2026-1018', type: 'WATER', title: 'Water supply disruption', status: 'APPROVED', dept: 'Water Board', date: '2026-05-22', priority: 'HIGH' },
  { id: 'CIV-2026-1005', type: 'GAS', title: 'Gas leak smell in block B', status: 'COMPLETED', dept: 'SUI Gas', date: '2026-05-15', priority: 'HIGH' },
  { id: 'CIV-2026-0991', type: 'MEDICAL', title: 'Need ambulance in sector 4', status: 'REJECTED', dept: 'Edhi Foundation', date: '2026-05-10', priority: 'LOW' },
];

const mockNotifs = [
  { id: 1, icon: '✅', color: 'rgba(34,197,94,0.15)', iconColor: '#4ade80', title: 'Report #1032 Completed', msg: 'Municipal Corporation has resolved your road issue.', time: '2 hours ago', unread: true },
  { id: 2, icon: '🔄', color: 'rgba(0,240,255,0.1)', iconColor: '#22d3ee', title: 'Report #1018 Approved', msg: 'Admin has approved your water supply report.', time: '5 hours ago', unread: true },
  { id: 3, icon: '⚠️', color: 'rgba(251,191,36,0.15)', iconColor: '#fbbf24', title: 'Disaster Alert — Korangi', msg: 'Heavy flooding reported near your saved location.', time: 'Yesterday', unread: false },
  { id: 4, icon: '📋', color: 'rgba(96,165,250,0.15)', iconColor: '#60a5fa', title: 'Report #1005 Completed', msg: 'SUI Gas team has fixed the gas leak.', time: '3 days ago', unread: false },
];

const mockChats = [
  { id: 1, type: 'received', text: 'Hello! How can we assist you today?', time: '10:02 AM' },
  { id: 2, type: 'sent', text: 'Hi, I submitted report #1045 but havent received any update.', time: '10:04 AM' },
  { id: 3, type: 'received', text: 'Thank you for reaching out. Your report has been approved and forwarded to K-Electric. Expected response time is 24 hours.', time: '10:06 AM' },
  { id: 4, type: 'sent', text: 'Thank you for the update!', time: '10:07 AM' },
];

const savedLocs = [
  { id: 1, label: 'HOME', icon: '🏠', address: 'Block 5, Gulshan-e-Iqbal, Karachi', default: true },
  { id: 2, label: 'WORK', icon: '🏢', address: 'Plot 14, Korangi Industrial Area, Karachi', default: false },
  { id: 3, label: 'OTHER', icon: '📍', address: 'North Nazimabad, Block H, Karachi', default: false },
];

const faqItems = [
  { q: 'How to submit a report?', a: 'Go to Report Issue in the sidebar, select your issue type, fill in the description, enter your address (the map will update), upload evidence, and hit Submit.' },
  { q: 'How to track my report?', a: 'Open My Reports from the sidebar. You will see all your reports with live status badges. Click any report to see the full timeline.' },
  { q: 'What is Disaster Mode?', a: 'Disaster Mode switches the entire portal theme to RED and displays critical disaster zone markers on the live map. Toggle it from the sidebar.' },
  { q: 'How long does it take for a report to be resolved?', a: 'Admin reviews within 2-4 hours. After approval, the responsible department resolves it within 24-72 hours depending on priority.' },
];

const MapView = ({ disaster }) => (
  <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '100%', minHeight: '300px', border: '1px solid var(--border)' }}>
    <div className="cp-map-grid" />
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
      <div style={{ fontSize: '11px', fontFamily: 'Orbitron, sans-serif', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '8px' }}>KARACHI — LIVE MAP</div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>Leaflet.js integration point</div>
    </div>
    {/* Fake markers */}
    {[
      { top: '25%', left: '35%', c: disaster ? '#ff2a2a' : '#ff4444', s: 10 },
      { top: '45%', left: '55%', c: disaster ? '#ff4444' : '#fbbf24', s: 8 },
      { top: '60%', left: '30%', c: '#4ade80', s: 8 },
      { top: '35%', left: '65%', c: disaster ? '#ff2a2a' : '#22d3ee', s: 10 },
      { top: '70%', left: '55%', c: '#4ade80', s: 7 },
    ].map((m, i) => (
      <div key={i} className="cp-map-dot" style={{
        top: m.top, left: m.left,
        width: m.s, height: m.s,
        background: m.c,
        boxShadow: `0 0 8px ${m.c}`,
      }} />
    ))}
    <div className="cp-heatmap-legend" style={{ position: 'absolute', bottom: '10px', left: '12px', zIndex: 2 }}>
      <span><span className="cp-legend-dot" style={{ background: '#ff2a2a', boxShadow: '0 0 4px #ff2a2a' }}></span>CRITICAL</span>
      <span><span className="cp-legend-dot" style={{ background: '#fbbf24', boxShadow: '0 0 4px #fbbf24' }}></span>RISK</span>
      <span><span className="cp-legend-dot" style={{ background: '#4ade80', boxShadow: '0 0 4px #4ade80' }}></span>SAFE</span>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    PENDING: { cls: 's-pending', label: 'PENDING' },
    APPROVED: { cls: 's-approved', label: 'APPROVED' },
    INPROGRESS: { cls: 's-inprogress', label: 'IN PROGRESS' },
    COMPLETED: { cls: 's-completed', label: 'COMPLETED' },
    REJECTED: { cls: 's-rejected', label: 'REJECTED' },
  };
  const s = map[status] || { cls: 's-pending', label: status };
  return <span className={`cp-status-badge ${s.cls}`}>{s.label}</span>;
};

const ReportIcon = ({ type }) => {
  const t = ISSUE_TYPES.find(x => x.key === type) || ISSUE_TYPES[0];
  return (
    <div className="cp-report-icon" style={{ background: `${t.color}22`, border: `1px solid ${t.color}44` }}>
      {t.icon}
    </div>
  );
};

// ── Page: Dashboard ──
const DashboardPage = ({ disaster, onNavigate }) => {
  const stats = [
    { label: 'TOTAL REPORTS', value: 12, change: '+2 this week', color: 'var(--glow)' },
    { label: 'PENDING', value: 3, change: 'Awaiting review', color: '#fbbf24' },
    { label: 'IN PROGRESS', value: 2, change: 'Active tasks', color: '#60a5fa' },
    { label: 'COMPLETED', value: 7, change: '92% success rate', color: '#4ade80' },
  ];

  return (
    <div>
      <div className="cp-stats-grid">
        {stats.map(s => (
          <div key={s.label} className="cp-stat-card" style={{ '--accent-color': s.color }}>
            <div className="cp-stat-label">{s.label}</div>
            <div className="cp-stat-value">{s.value}</div>
            <div className="cp-stat-change">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="cp-two-col" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        <div className="cp-card" style={{ height: '280px' }}>
          <div className="cp-card-title">LIVE MAP — KARACHI</div>
          <MapView disaster={disaster} />
        </div>

        <div className="cp-card">
          <div className="cp-card-title">QUICK ACTIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {[
              { icon: '📋', label: 'REPORT ISSUE', page: 'report' },
              { icon: '🗺️', label: 'VIEW LIVE MAP', page: 'map' },
              { icon: '🔔', label: 'NOTIFICATIONS', page: 'notifications' },
              { icon: '💬', label: 'HELP DESK', page: 'helpdesk' },
            ].map(a => (
              <button key={a.label} onClick={() => onNavigate(a.page)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                letterSpacing: '1px',
                color: 'var(--text)',
                fontFamily: "'Share Tech Mono', monospace",
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--glow)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}>
                <span style={{ fontSize: '16px' }}>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
          <div className="cp-card-title" style={{ marginTop: '8px' }}>ACTIVITY THIS WEEK</div>
          <div className="cp-mini-chart">
            {[30, 70, 45, 90, 60, 80, 55].map((h, i) => (
              <div key={i} className="cp-mini-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: 'var(--text-muted)' }}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="cp-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div className="cp-card-title" style={{ margin: 0 }}>RECENT REPORTS</div>
          <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={() => onNavigate('myreports')}>VIEW ALL</button>
        </div>
        {mockReports.slice(0, 4).map(r => (
          <div key={r.id} className="cp-report-item" onClick={() => onNavigate('myreports')}>
            <ReportIcon type={r.type} />
            <div className="cp-report-info">
              <div className="cp-report-id">{r.id} · {r.dept}</div>
              <div className="cp-report-title">{r.title}</div>
            </div>
            <StatusBadge status={r.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Page: Report Issue ──
const ReportPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ type: '', desc: '', province: '', district: '', town: '', area: '', city: '', priority: 'MEDIUM' });
  const [submitted, setSubmitted] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const handleSubmit = () => {
    if (!form.type || !form.desc) return;
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
      <div style={{ fontSize: '48px' }}>✅</div>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', color: 'var(--glow)', textShadow: '0 0 10px var(--glow)', letterSpacing: '2px' }}>REPORT SUBMITTED</div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Report ID: <span style={{ color: 'var(--glow)' }}>CIV-2026-1046</span></div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '340px' }}>Your report is pending admin review. You will be notified once it is approved and forwarded.</div>
      <button className="cp-btn cp-btn-primary" onClick={() => { setSubmitted(false); setStep(1); setForm({ type: '', desc: '', province: '', district: '', town: '', area: '', city: '', priority: 'MEDIUM' }); setFilePreview(null); }}>SUBMIT ANOTHER</button>
    </div>
  );

  return (
    <div>
      <div className="cp-page-header">
        <div className="cp-section-title">SUBMIT CIVIC REPORT</div>
      </div>

      <div className="cp-steps">
        {[
          { n: 1, label: 'TYPE' },
          { n: 2, label: 'DETAILS' },
          { n: 3, label: 'LOCATION' },
          { n: 4, label: 'EVIDENCE' },
          { n: 5, label: 'REVIEW' },
        ].map((s, i) => (
          <>
            <div key={s.n} className={`cp-step ${step > s.n ? 'done' : step === s.n ? 'active' : ''}`}>
              <div className="cp-step-num">{step > s.n ? '✓' : s.n}</div>
              <span className="cp-step-label" style={{ fontSize: '10px', letterSpacing: '1px' }}>{s.label}</span>
            </div>
            {i < 4 && <div className={`cp-step-line ${step > s.n ? 'done' : ''}`} />}
          </>
        ))}
      </div>

      <div className="cp-card">
        {step === 1 && (
          <>
            <div className="cp-card-title">SELECT ISSUE TYPE</div>
            <div className="cp-type-grid">
              {ISSUE_TYPES.map(t => (
                <div key={t.key} className={`cp-type-card ${form.type === t.key ? 'selected' : ''}`}
                  style={{ '--glow': t.color, borderColor: form.type === t.key ? t.color : undefined, background: form.type === t.key ? `${t.color}15` : undefined }}
                  onClick={() => setForm(p => ({ ...p, type: t.key }))}>
                  <div className="cp-type-icon">{t.icon}</div>
                  <div className="cp-type-label" style={{ color: form.type === t.key ? t.color : undefined }}>{t.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="cp-btn cp-btn-primary" onClick={() => form.type && setStep(2)} style={{ opacity: form.type ? 1 : 0.5 }}>NEXT →</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="cp-card-title">ISSUE DETAILS</div>
            <div className="cp-form-group">
              <label className="cp-form-label">DESCRIPTION *</label>
              <textarea className="cp-textarea" placeholder="Describe the issue in detail... (minimum 10 characters)" value={form.desc}
                onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} />
              <div style={{ fontSize: '10px', color: form.desc.length < 10 ? '#f87171' : '#4ade80', marginTop: '4px' }}>{form.desc.length} / 500 chars</div>
            </div>
            <div className="cp-form-group">
              <label className="cp-form-label">PRIORITY</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                  <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))}
                    className="cp-btn cp-btn-sm"
                    style={{
                      borderColor: form.priority === p ? (p === 'HIGH' ? '#ff4444' : p === 'MEDIUM' ? '#fbbf24' : '#4ade80') : 'var(--border)',
                      color: form.priority === p ? (p === 'HIGH' ? '#ff4444' : p === 'MEDIUM' ? '#fbbf24' : '#4ade80') : 'var(--text-muted)',
                      background: form.priority === p ? (p === 'HIGH' ? 'rgba(255,68,68,0.1)' : p === 'MEDIUM' ? 'rgba(251,191,36,0.1)' : 'rgba(74,222,128,0.1)') : 'transparent',
                    }}>{p}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="cp-btn cp-btn-ghost" onClick={() => setStep(1)}>← BACK</button>
              <button className="cp-btn cp-btn-primary" onClick={() => form.desc.length >= 10 && setStep(3)} style={{ opacity: form.desc.length >= 10 ? 1 : 0.5 }}>NEXT →</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="cp-card-title">LOCATION</div>
            <div className="cp-form-row" style={{ marginBottom: '14px' }}>
              <div className="cp-form-group" style={{ margin: 0 }}>
                <label className="cp-form-label">PROVINCE</label>
                <select className="cp-select" value={form.province} onChange={e => setForm(p => ({ ...p, province: e.target.value }))}>
                  <option value="">Select Province</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="KPK">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                </select>
              </div>
              <div className="cp-form-group" style={{ margin: 0 }}>
                <label className="cp-form-label">DISTRICT</label>
                <input className="cp-input" placeholder="Enter district" value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} />
              </div>
            </div>
            <div className="cp-form-row" style={{ marginBottom: '14px' }}>
              <div className="cp-form-group" style={{ margin: 0 }}>
                <label className="cp-form-label">TOWN</label>
                <input className="cp-input" placeholder="Enter town" value={form.town} onChange={e => setForm(p => ({ ...p, town: e.target.value }))} />
              </div>
              <div className="cp-form-group" style={{ margin: 0 }}>
                <label className="cp-form-label">AREA / STREET</label>
                <input className="cp-input" placeholder="Block, street, area" value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} />
              </div>
            </div>
            <div className="cp-form-group">
              <label className="cp-form-label">CITY</label>
              <input className="cp-input" placeholder="City name" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
            </div>
            <div style={{ height: '160px', marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
              <div className="cp-map-grid" />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>📍</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                    {form.city || form.area ? `${form.area ? form.area + ', ' : ''}${form.city || ''}` : 'ENTER ADDRESS TO LOCATE'}
                  </div>
                </div>
              </div>
              <div className="cp-map-dot" style={{ top: '50%', left: '50%', width: 10, height: 10, background: 'var(--glow)', boxShadow: '0 0 10px var(--glow)', transform: 'translate(-50%,-50%)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="cp-btn cp-btn-ghost" onClick={() => setStep(2)}>← BACK</button>
              <button className="cp-btn cp-btn-primary" onClick={() => setStep(4)}>NEXT →</button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="cp-card-title">UPLOAD EVIDENCE</div>
            <label htmlFor="evidence-upload" style={{ cursor: 'pointer' }}>
              <div className="cp-upload-zone">
                {filePreview ? (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '6px' }}>📎</div>
                    <div style={{ fontSize: '12px', color: 'var(--glow)' }}>{filePreview}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Click to change file</div>
                  </div>
                ) : (
                  <div>
                    <div className="cp-upload-icon">📷</div>
                    <div className="cp-upload-text">CLICK TO UPLOAD PHOTO / VIDEO</div>
                    <div className="cp-upload-sub">JPG, PNG, MP4 — Max 50MB</div>
                  </div>
                )}
              </div>
            </label>
            <input id="evidence-upload" type="file" accept="image/*,video/*" style={{ display: 'none' }}
              onChange={e => e.target.files[0] && setFilePreview(e.target.files[0].name)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button className="cp-btn cp-btn-ghost" onClick={() => setStep(3)}>← BACK</button>
              <button className="cp-btn cp-btn-primary" onClick={() => setStep(5)}>NEXT →</button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="cp-card-title">REVIEW & SUBMIT</div>
            {[
              { label: 'ISSUE TYPE', value: ISSUE_TYPES.find(t => t.key === form.type)?.label + ' ' + (ISSUE_TYPES.find(t => t.key === form.type)?.icon || '') },
              { label: 'PRIORITY', value: form.priority },
              { label: 'DESCRIPTION', value: form.desc || '—' },
              { label: 'LOCATION', value: [form.area, form.town, form.district, form.province, form.city].filter(Boolean).join(', ') || '—' },
              { label: 'EVIDENCE', value: filePreview || 'No file uploaded' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', gap: '16px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ minWidth: '100px', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', paddingTop: '1px' }}>{r.label}</div>
                <div style={{ fontSize: '13px', color: 'var(--text)', flex: 1 }}>{r.value}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button className="cp-btn cp-btn-ghost" onClick={() => setStep(4)}>← BACK</button>
              <button className="cp-btn cp-btn-primary" onClick={handleSubmit}>🚀 SUBMIT REPORT</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Page: My Reports ──
const MyReportsPage = () => {
  const [tab, setTab] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const tabs = ['ALL', 'PENDING', 'APPROVED', 'INPROGRESS', 'COMPLETED', 'REJECTED'];
  const filtered = tab === 'ALL' ? mockReports : mockReports.filter(r => r.status === tab);

  if (selected) return (
    <div>
      <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={() => setSelected(null)} style={{ marginBottom: '16px' }}>← BACK TO LIST</button>
      <div className="cp-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: 'var(--glow)', letterSpacing: '2px', marginBottom: '4px' }}>{selected.id}</div>
            <div style={{ fontSize: '16px', color: 'var(--text)', marginBottom: '6px' }}>{selected.title}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <StatusBadge status={selected.status} />
              <span className={`cp-status-badge ${selected.priority === 'HIGH' ? 's-rejected' : selected.priority === 'MEDIUM' ? 's-pending' : 's-completed'}`}>{selected.priority}</span>
            </div>
          </div>
          <ReportIcon type={selected.type} />
        </div>
        <div className="cp-divider" />
        <div className="cp-three-col" style={{ marginBottom: '8px' }}>
          {[
            { label: 'DEPARTMENT', value: selected.dept },
            { label: 'SUBMITTED', value: selected.date },
            { label: 'TYPE', value: selected.type },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '3px' }}>{f.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cp-card">
        <div className="cp-card-title">STATUS TIMELINE</div>
        <div className="cp-timeline">
          {[
            { time: selected.date + ' 09:00', text: 'Report submitted by you' },
            { time: selected.date + ' 11:30', text: 'Admin reviewed and approved the report' },
            { time: selected.date + ' 12:00', text: `Forwarded to ${selected.dept}` },
            ...(selected.status === 'INPROGRESS' || selected.status === 'COMPLETED' ? [{ time: selected.date + ' 14:00', text: 'Responder accepted the task' }] : []),
            ...(selected.status === 'COMPLETED' ? [{ time: '2026-05-27 16:30', text: 'Task marked as COMPLETED ✅' }] : []),
          ].map((t, i) => (
            <div key={i} className="cp-timeline-item">
              <div className="cp-timeline-dot" />
              <div className="cp-timeline-time">{t.time}</div>
              <div className="cp-timeline-text">{t.text}</div>
            </div>
          ))}
        </div>
      </div>

      {selected.status === 'COMPLETED' && (
        <div className="cp-card" style={{ marginTop: '16px' }}>
          <div className="cp-card-title">RATE THIS SERVICE</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <RatingStar />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Your feedback helps improve services</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="cp-page-header">
        <div className="cp-section-title">MY REPORTS</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{filtered.length} REPORTS</div>
      </div>
      <div className="cp-tabs" style={{ flexWrap: 'wrap' }}>
        {tabs.map(t => <button key={t} className={`cp-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      {filtered.length === 0 ? (
        <div className="cp-empty"><div className="cp-empty-icon">📋</div><div className="cp-empty-text">NO REPORTS IN THIS CATEGORY</div></div>
      ) : (
        <div className="cp-card">
          {filtered.map(r => (
            <div key={r.id} className="cp-report-item" onClick={() => setSelected(r)}>
              <ReportIcon type={r.type} />
              <div className="cp-report-info">
                <div className="cp-report-id">{r.id} · {r.date}</div>
                <div className="cp-report-title">{r.title}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{r.dept}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                <StatusBadge status={r.status} />
                <span style={{ fontSize: '10px', color: r.priority === 'HIGH' ? '#f87171' : r.priority === 'MEDIUM' ? '#fbbf24' : '#4ade80' }}>{r.priority}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RatingStar = () => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <div style={{ fontSize: '12px', color: '#4ade80' }}>✓ Thank you for your feedback!</div>;
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <div className="cp-stars">
        {[1,2,3,4,5].map(n => (
          <span key={n} className={`cp-star ${n <= rating ? 'active' : ''}`} onClick={() => { setRating(n); setTimeout(() => setSubmitted(true), 500); }}>★</span>
        ))}
      </div>
    </div>
  );
};

// ── Page: Live Map ──
const MapPage = ({ disaster }) => (
  <div>
    <div className="cp-page-header">
      <div className="cp-section-title">LIVE DISASTER MAP</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div className="cp-chip active">🔴 3 CRITICAL</div>
        <div className="cp-chip">🟡 5 RISK</div>
        <div className="cp-chip">🟢 12 SAFE</div>
      </div>
    </div>
    <div className="cp-card" style={{ height: '460px' }}>
      <MapView disaster={disaster} />
    </div>
    <div className="cp-card" style={{ marginTop: '16px' }}>
      <div className="cp-card-title">ACTIVE DISASTERS NEARBY</div>
      {[
        { type: 'FLOOD', area: 'Korangi Industrial Area', severity: 'CRITICAL', time: '2 hrs ago', color: '#ff4444' },
        { type: 'ELECTRICITY OUTAGE', area: 'Gulshan-e-Iqbal Block 5', severity: 'HIGH', time: '5 hrs ago', color: '#fbbf24' },
        { type: 'ROAD DAMAGE', area: 'Malir Expressway', severity: 'MEDIUM', time: '1 day ago', color: '#fbbf24' },
      ].map((d, i) => (
        <div key={i} className="cp-report-item">
          <div className="cp-report-icon" style={{ background: `${d.color}20`, border: `1px solid ${d.color}40` }}>
            {d.type === 'FLOOD' ? '🌊' : d.type === 'ELECTRICITY OUTAGE' ? '⚡' : '🛣️'}
          </div>
          <div className="cp-report-info">
            <div className="cp-report-id">{d.time}</div>
            <div className="cp-report-title">{d.type}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.area}</div>
          </div>
          <span className="cp-status-badge" style={{ background: `${d.color}20`, color: d.color, borderColor: `${d.color}40` }}>{d.severity}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Page: Notifications ──
const NotificationsPage = () => {
  const [notifs, setNotifs] = useState(mockNotifs);
  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, unread: false } : x));
  return (
    <div>
      <div className="cp-page-header">
        <div className="cp-section-title">NOTIFICATIONS</div>
        <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}>MARK ALL READ</button>
      </div>
      <div className="cp-card">
        {notifs.map(n => (
          <div key={n.id} className="cp-notif-item" style={{ position: 'relative', opacity: n.unread ? 1 : 0.7 }} onClick={() => markRead(n.id)}>
            <div className="cp-notif-dot-icon" style={{ background: n.color }}>
              <span style={{ fontSize: '14px' }}>{n.icon}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="cp-notif-title" style={{ color: n.unread ? 'var(--glow)' : 'var(--text)' }}>{n.title}</div>
                {n.unread && <div className="cp-notif-dot" style={{ position: 'relative', width: 7, height: 7, borderRadius: '50%', background: 'var(--glow)', boxShadow: '0 0 6px var(--glow)', flexShrink: 0, marginTop: '4px' }} />}
              </div>
              <div className="cp-notif-msg">{n.msg}</div>
              <div className="cp-notif-time">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Page: Saved Locations ──
const SavedLocationsPage = () => {
  const [locs, setLocs] = useState(savedLocs);
  const [adding, setAdding] = useState(false);
  const [newLoc, setNewLoc] = useState({ label: 'HOME', address: '' });
  return (
    <div>
      <div className="cp-page-header">
        <div className="cp-section-title">SAVED LOCATIONS</div>
        <button className="cp-btn cp-btn-primary cp-btn-sm" onClick={() => setAdding(true)}>+ ADD LOCATION</button>
      </div>
      {locs.map(l => (
        <div key={l.id} className="cp-location-item">
          <div className="cp-location-icon" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '16px' }}>{l.icon}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: 'var(--glow)', letterSpacing: '2px' }}>{l.label}</span>
              {l.default && <span style={{ fontSize: '9px', background: 'rgba(var(--glow-rgb),0.1)', color: 'var(--glow)', border: '1px solid rgba(var(--glow-rgb),0.3)', padding: '1px 6px', borderRadius: '3px' }}>DEFAULT</span>}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l.address}</div>
          </div>
          <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={() => setLocs(ls => ls.filter(x => x.id !== l.id))}>DELETE</button>
        </div>
      ))}
      {adding && (
        <div className="cp-card" style={{ marginTop: '12px' }}>
          <div className="cp-card-title">ADD NEW LOCATION</div>
          <div className="cp-form-group">
            <label className="cp-form-label">LABEL</label>
            <select className="cp-select" value={newLoc.label} onChange={e => setNewLoc(p => ({ ...p, label: e.target.value }))}>
              <option>HOME</option><option>WORK</option><option>OTHER</option>
            </select>
          </div>
          <div className="cp-form-group">
            <label className="cp-form-label">ADDRESS</label>
            <input className="cp-input" placeholder="Enter full address" value={newLoc.address} onChange={e => setNewLoc(p => ({ ...p, address: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="cp-btn cp-btn-primary" onClick={() => { setLocs(ls => [...ls, { id: Date.now(), label: newLoc.label, icon: newLoc.label === 'HOME' ? '🏠' : newLoc.label === 'WORK' ? '🏢' : '📍', address: newLoc.address || 'New location', default: false }]); setAdding(false); setNewLoc({ label: 'HOME', address: '' }); }}>SAVE</button>
            <button className="cp-btn cp-btn-ghost" onClick={() => setAdding(false)}>CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Page: Help Desk ──
const HelpDeskPage = () => {
  const [chats, setChats] = useState(mockChats);
  const [msg, setMsg] = useState('');
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chats]);
  const sendMsg = () => {
    if (!msg.trim()) return;
    setChats(c => [...c, { id: Date.now(), type: 'sent', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMsg('');
    setTimeout(() => {
      setChats(c => [...c, { id: Date.now() + 1, type: 'received', text: 'Thank you for your message. Our support team will respond shortly.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1200);
  };
  return (
    <div>
      <div className="cp-page-header"><div className="cp-section-title">HELP DESK</div><div className="cp-chip active">🟢 SUPPORT ONLINE</div></div>
      <div className="cp-card">
        <div className="cp-chat-window">
          <div className="cp-chat-messages">
            {chats.map(c => (
              <div key={c.id} className={`cp-chat-msg ${c.type}`}>
                {c.text}
                <div className="cp-chat-msg-time">{c.time}</div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="cp-chat-input-row">
            <input className="cp-input" placeholder="Type your message..." value={msg} onChange={e => setMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()} style={{ flex: 1 }} />
            <button className="cp-btn cp-btn-primary cp-btn-sm" onClick={sendMsg}>SEND</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Page: Report Stats ──
const StatsPage = () => (
  <div>
    <div className="cp-page-header"><div className="cp-section-title">MY STATISTICS</div></div>
    <div className="cp-two-col">
      <div className="cp-card">
        <div className="cp-card-title">REPORTS BY TYPE</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ISSUE_TYPES.map((t, i) => {
            const val = [40, 15, 25, 12, 8][i];
            return (
              <div key={t.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.icon} {t.label}</span>
                  <span style={{ fontSize: '11px', color: t.color }}>{val}%</span>
                </div>
                <div className="cp-progress-bar">
                  <div className="cp-progress-fill" style={{ width: `${val}%`, background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="cp-card">
        <div className="cp-card-title">MONTHLY ACTIVITY</div>
        <div className="cp-mini-chart" style={{ height: '120px' }}>
          {[2,4,3,7,5,8,6,9,4,6,8,7].map((h, i) => (
            <div key={i} className="cp-mini-bar" style={{ height: `${h * 10}%` }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => (
            <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: '8px', color: 'var(--text-muted)' }}>{m}</span>
          ))}
        </div>
        <div className="cp-divider" />
        <div className="cp-card-title">ACHIEVEMENTS</div>
        {[
          { icon: '🏅', title: 'First Report', desc: 'Submitted your first civic report' },
          { icon: '⭐', title: 'Active Citizen', desc: '10+ reports submitted' },
          { icon: '🔥', title: 'Quick Reporter', desc: 'Reported 3 issues in one week' },
        ].map((a, i) => (
          <div key={i} className="cp-achievement">
            <div className="cp-achievement-icon">{a.icon}</div>
            <div>
              <div className="cp-achievement-title">{a.title}</div>
              <div className="cp-achievement-desc">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Page: FAQ / Help ──
const FAQPage = () => {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <div className="cp-page-header"><div className="cp-section-title">HELP & FAQ</div></div>
      {faqItems.map((f, i) => (
        <div key={i} className="cp-faq-item">
          <div className="cp-faq-q" onClick={() => setOpen(open === i ? null : i)}>
            <span>{f.q}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{open === i ? '▲' : '▼'}</span>
          </div>
          {open === i && <div className="cp-faq-a">{f.a}</div>}
        </div>
      ))}
      <div className="cp-card" style={{ marginTop: '16px' }}>
        <div className="cp-card-title">CONTACT SUPPORT</div>
        <div className="cp-form-group">
          <label className="cp-form-label">MESSAGE</label>
          <textarea className="cp-textarea" placeholder="Describe your issue..." />
        </div>
        <button className="cp-btn cp-btn-primary">SEND MESSAGE</button>
      </div>
    </div>
  );
};

// ── Page: Profile / Settings ──
const ProfilePage = () => {
  const [toggles, setToggles] = useState({ emailNotif: true, smsNotif: false, pushNotif: true });
  const toggle = k => setToggles(t => ({ ...t, [k]: !t[k] }));
  const Toggle = ({ k }) => (
    <div className={`cp-toggle-switch ${toggles[k] ? 'on' : ''}`} onClick={() => toggle(k)}>
      <div className="cp-toggle-thumb" />
    </div>
  );
  return (
    <div>
      <div className="cp-profile-hero">
        <div className="cp-profile-avatar">AR</div>
        <div>
          <div className="cp-profile-name">ALI RAZA</div>
          <div className="cp-profile-meta">CITIZEN · ID: CTZ-2024-0042</div>
          <div className="cp-profile-meta" style={{ marginTop: '2px' }}>📍 Korangi, Karachi</div>
        </div>
      </div>
      <div className="cp-two-col">
        <div className="cp-card">
          <div className="cp-card-title">PROFILE INFO</div>
          {[
            { label: 'FULL NAME', val: 'Ali Raza' },
            { label: 'PHONE', val: '0300-1234567' },
            { label: 'EMAIL', val: 'ali.raza@email.com' },
            { label: 'CNIC', val: '42201-XXXXXXX-X' },
            { label: 'CITY', val: 'Karachi' },
          ].map(f => (
            <div key={f.label} className="cp-form-group" style={{ marginBottom: '12px' }}>
              <label className="cp-form-label">{f.label}</label>
              <input className="cp-input" defaultValue={f.val} />
            </div>
          ))}
          <button className="cp-btn cp-btn-primary">SAVE CHANGES</button>
        </div>
        <div>
          <div className="cp-card" style={{ marginBottom: '14px' }}>
            <div className="cp-card-title">CHANGE PASSWORD</div>
            <div className="cp-form-group"><label className="cp-form-label">CURRENT PASSWORD</label><input className="cp-input" type="password" placeholder="••••••••" /></div>
            <div className="cp-form-group"><label className="cp-form-label">NEW PASSWORD</label><input className="cp-input" type="password" placeholder="••••••••" /></div>
            <div className="cp-form-group"><label className="cp-form-label">CONFIRM PASSWORD</label><input className="cp-input" type="password" placeholder="••••••••" /></div>
            <button className="cp-btn cp-btn-primary">UPDATE PASSWORD</button>
          </div>
          <div className="cp-card">
            <div className="cp-card-title">NOTIFICATIONS</div>
            {[
              { key: 'emailNotif', label: 'Email Notifications', sub: 'Receive updates via email' },
              { key: 'smsNotif', label: 'SMS Notifications', sub: 'Receive SMS alerts' },
              { key: 'pushNotif', label: 'Push Notifications', sub: 'Browser push alerts' },
            ].map(s => (
              <div key={s.key} className="cp-setting-row">
                <div><div className="cp-setting-label">{s.label}</div><div className="cp-setting-sub">{s.sub}</div></div>
                <Toggle k={s.key} />
              </div>
            ))}
            <div style={{ marginTop: '16px' }}>
              <button className="cp-btn cp-btn-danger cp-btn-sm">DELETE ACCOUNT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SOS Modal ──
const SOSModal = ({ onClose }) => {
  const [sent, setSent] = useState(false);
  return (
    <div className="cp-modal-overlay cp-sos-modal" onClick={onClose}>
      <div className="cp-modal" onClick={e => e.stopPropagation()} style={{ borderColor: 'rgba(255,42,42,0.6)', boxShadow: '0 0 40px rgba(255,42,42,0.2)', textAlign: 'center' }}>
        <button className="cp-close-btn" onClick={onClose}>✕</button>
        {sent ? (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚨</div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', color: '#ff2a2a', textShadow: '0 0 10px #ff2a2a', letterSpacing: '2px', marginBottom: '8px' }}>SOS SENT!</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Emergency request #SOS-2026-0041 created.<br />Nearest rescue team notified. Help is on the way.</div>
            <button className="cp-btn cp-btn-ghost" onClick={onClose}>CLOSE</button>
          </div>
        ) : (
          <div>
            <div className="cp-sos-ring">
              <button className="cp-sos-btn-large" onClick={() => setSent(true)}>SOS</button>
            </div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', color: '#ff2a2a', textShadow: '0 0 8px #ff2a2a', letterSpacing: '2px', marginBottom: '8px' }}>EMERGENCY SOS</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>Press SOS to instantly send an emergency request.<br />No form needed — your location will be auto-detected.</div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="cp-btn cp-btn-danger" onClick={() => setSent(true)}>🆘 SEND SOS NOW</button>
              <button className="cp-btn cp-btn-ghost" onClick={onClose}>CANCEL</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main App ──
export default function CitizenPortal() {
  const [page, setPage] = useState('dashboard');
  const [disaster, setDisaster] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const unread = mockNotifs.filter(n => n.unread).length;

  const navItems = [
    { id: 'dashboard', icon: '▣', label: 'DASHBOARD' },
    { id: 'report', icon: '📝', label: 'REPORT ISSUE' },
    { id: 'myreports', icon: '📋', label: 'MY REPORTS', badge: 5 },
    { id: 'map', icon: '🗺', label: 'LIVE MAP' },
    { id: 'notifications', icon: '🔔', label: 'NOTIFICATIONS', badge: unread || null },
    { id: 'locations', icon: '📍', label: 'SAVED LOCATIONS' },
    { id: 'helpdesk', icon: '💬', label: 'HELP DESK' },
    { id: 'stats', icon: '📊', label: 'MY STATS' },
    { id: 'faq', icon: '❓', label: 'HELP & FAQ' },
    { id: 'profile', icon: '👤', label: 'PROFILE / SETTINGS' },
  ];

  const pageTitles = {
    dashboard: 'CITIZEN DASHBOARD',
    report: 'REPORT ISSUE',
    myreports: 'MY REPORTS',
    map: 'LIVE MAP',
    notifications: 'NOTIFICATIONS',
    locations: 'SAVED LOCATIONS',
    helpdesk: 'HELP DESK',
    stats: 'MY STATISTICS',
    faq: 'HELP & FAQ',
    profile: 'PROFILE & SETTINGS',
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage disaster={disaster} onNavigate={setPage} />;
      case 'report': return <ReportPage />;
      case 'myreports': return <MyReportsPage />;
      case 'map': return <MapPage disaster={disaster} />;
      case 'notifications': return <NotificationsPage />;
      case 'locations': return <SavedLocationsPage />;
      case 'helpdesk': return <HelpDeskPage />;
      case 'stats': return <StatsPage />;
      case 'faq': return <FAQPage />;
      case 'profile': return <ProfilePage />;
      default: return <DashboardPage disaster={disaster} onNavigate={setPage} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`cp-root ${disaster ? 'disaster' : ''}`}>
        <div className="cp-scanlines" />
        {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}

        {/* Sidebar */}
        <aside className="cp-sidebar">
          <div className="cp-logo">
            <div className="cp-logo-name">NeXora</div>
            <div className="cp-logo-sub">CITIZEN PORTAL</div>
          </div>
          <div className="cp-user-card">
            <div className="cp-avatar">AR</div>
            <div>
              <div className="cp-user-name">Ali Raza</div>
              <div className="cp-user-role">CITIZEN</div>
            </div>
          </div>
          <nav className="cp-nav">
            <div className="cp-nav-section">MAIN</div>
            {navItems.slice(0, 4).map(item => (
              <button key={item.id} className={`cp-nav-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
                <span className="cp-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="cp-badge">{item.badge}</span>}
              </button>
            ))}
            <div className="cp-nav-section">MANAGEMENT</div>
            {navItems.slice(4, 8).map(item => (
              <button key={item.id} className={`cp-nav-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
                <span className="cp-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="cp-badge">{item.badge}</span>}
              </button>
            ))}
            <div className="cp-nav-section">ACCOUNT</div>
            {navItems.slice(8).map(item => (
              <button key={item.id} className={`cp-nav-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
                <span className="cp-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="cp-sidebar-footer">
            <button className={`cp-disaster-toggle ${disaster ? 'active' : ''}`} onClick={() => setDisaster(d => !d)}>
              <div className="cp-toggle-dot" />
              {disaster ? '⚠ DISASTER MODE ON' : 'DISASTER MODE OFF'}
            </button>
            <button className="cp-logout-btn">⏻ LOGOUT</button>
          </div>
        </aside>

        {/* Main */}
        <main className="cp-main">
          {disaster && (
            <div className="cp-disaster-banner">
              <div className="cp-marquee-text">
                ⚠ DISASTER ALERT — HEAVY FLOODING REPORTED IN KORANGI &nbsp;&nbsp;•&nbsp;&nbsp; STAY ALERT — ELECTRICAL OUTAGE IN GULSHAN-E-IQBAL &nbsp;&nbsp;•&nbsp;&nbsp; EMERGENCY SERVICES DEPLOYED &nbsp;&nbsp;•&nbsp;&nbsp; PRESS SOS FOR IMMEDIATE HELP &nbsp;&nbsp;•&nbsp;&nbsp;
                ⚠ DISASTER ALERT — HEAVY FLOODING REPORTED IN KORANGI &nbsp;&nbsp;•&nbsp;&nbsp; STAY ALERT — ELECTRICAL OUTAGE IN GULSHAN-E-IQBAL &nbsp;&nbsp;•&nbsp;&nbsp; EMERGENCY SERVICES DEPLOYED &nbsp;&nbsp;•&nbsp;&nbsp; PRESS SOS FOR IMMEDIATE HELP &nbsp;&nbsp;•&nbsp;&nbsp;
              </div>
            </div>
          )}
          <header className="cp-topbar">
            <div className="cp-page-title">{pageTitles[page] || 'DASHBOARD'}</div>
            <div className="cp-topbar-actions">
              <button className="cp-sos-btn" onClick={() => setShowSOS(true)}>🆘 SOS</button>
              <button className="cp-icon-btn" onClick={() => setPage('notifications')}>
                🔔
                {unread > 0 && <span className="cp-notif-dot" />}
              </button>
            </div>
          </header>
          <div className="cp-content">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
