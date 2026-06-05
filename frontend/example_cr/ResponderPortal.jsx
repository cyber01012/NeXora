import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rp-root {
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

  .rp-root.disaster {
    --glow: #ff2a2a; --glow-rgb: 255,42,42;
    --bg: #150000; --bg2: #200000; --bg3: #2a0808;
    --border: rgba(255,42,42,0.2); --border-bright: rgba(255,42,42,0.5);
    --text: #ffe0e0; --text-muted: rgba(255,224,224,0.55);
  }

  .rp-sidebar {
    width: 240px; min-height: 100vh;
    background: var(--bg2);
    border-right: 1px solid var(--border-bright);
    display: flex; flex-direction: column;
    position: relative; z-index: 10; flex-shrink: 0;
  }

  .rp-logo { padding: 20px 20px 16px; border-bottom: 1px solid var(--border); }

  .rp-logo-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 22px; font-weight: 900;
    color: var(--glow); text-shadow: 0 0 12px var(--glow);
    letter-spacing: 3px;
  }

  .rp-logo-sub { font-size: 10px; color: var(--text-muted); letter-spacing: 2px; margin-top: 2px; }

  .rp-dept-card {
    margin: 14px 12px;
    background: var(--bg3);
    border: 1px solid var(--glow);
    border-radius: 8px;
    padding: 10px 12px;
    box-shadow: 0 0 15px rgba(var(--glow-rgb),0.1);
  }

  .rp-dept-label { font-size: 9px; color: var(--text-muted); letter-spacing: 2px; margin-bottom: 2px; }
  .rp-dept-name { font-family: 'Orbitron', sans-serif; font-size: 12px; color: var(--glow); text-shadow: 0 0 8px var(--glow); letter-spacing: 1px; }
  .rp-dept-person { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  .rp-online-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 9px; color: #4ade80; letter-spacing: 1px; margin-top: 6px;
  }

  .rp-online-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 5px #4ade80; animation: blink 1.5s infinite; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

  .rp-nav { flex: 1; overflow-y: auto; padding: 8px 0; }
  .rp-nav::-webkit-scrollbar { width: 3px; }
  .rp-nav::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 2px; }

  .rp-nav-section { font-size: 9px; color: var(--text-muted); letter-spacing: 2px; padding: 12px 16px 4px; }

  .rp-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 16px; cursor: pointer;
    transition: all 0.2s; position: relative;
    font-size: 12px; letter-spacing: 0.5px;
    color: var(--text-muted);
    border: none; background: none; width: 100%; text-align: left;
  }

  .rp-nav-item:hover { color: var(--text); background: rgba(var(--glow-rgb),0.07); }
  .rp-nav-item.active { color: var(--glow); background: rgba(var(--glow-rgb),0.12); text-shadow: 0 0 8px var(--glow); }
  .rp-nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: var(--glow); box-shadow: 0 0 8px var(--glow);
    border-radius: 0 2px 2px 0;
  }

  .rp-nav-icon { font-size: 15px; width: 18px; text-align: center; }

  .rp-badge {
    margin-left: auto; background: var(--glow); color: var(--bg);
    font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 10px;
  }

  .rp-alert-badge { background: #ff4444 !important; color: #fff !important; box-shadow: 0 0 8px rgba(255,68,68,0.5); }

  .rp-sidebar-footer { padding: 12px; border-top: 1px solid var(--border); }

  .rp-avail-toggle {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; background: var(--bg3);
    border: 1px solid var(--border); border-radius: 6px; cursor: pointer;
    font-family: 'Share Tech Mono', monospace; font-size: 11px;
    color: var(--text-muted); letter-spacing: 1px; transition: all 0.25s; margin-bottom: 8px;
  }

  .rp-avail-toggle.online { border-color: #4ade80; color: #4ade80; background: rgba(74,222,128,0.1); text-shadow: 0 0 6px #4ade80; }
  .rp-avail-toggle .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-muted); flex-shrink: 0; transition: background 0.25s; }
  .rp-avail-toggle.online .dot { background: #4ade80; box-shadow: 0 0 6px #4ade80; }

  .rp-disaster-toggle {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 6px; cursor: pointer; font-family: 'Share Tech Mono', monospace;
    font-size: 11px; color: var(--text-muted); letter-spacing: 1px; transition: all 0.25s; margin-bottom: 8px;
  }

  .rp-disaster-toggle.active { border-color: #ff2a2a; color: #ff2a2a; background: rgba(255,42,42,0.1); text-shadow: 0 0 6px #ff2a2a; }
  .rp-disaster-toggle .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-muted); flex-shrink: 0; transition: background 0.25s; }
  .rp-disaster-toggle.active .dot { background: #ff2a2a; box-shadow: 0 0 6px #ff2a2a; }

  .rp-logout-btn {
    width: 100%; padding: 8px 12px; background: transparent;
    border: 1px solid var(--border); border-radius: 6px; color: var(--text-muted);
    font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: 1px;
    cursor: pointer; transition: all 0.2s;
  }

  .rp-logout-btn:hover { border-color: #ff4444; color: #ff4444; }

  .rp-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

  .rp-topbar {
    height: 56px; background: var(--bg2); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 24px; gap: 12px; flex-shrink: 0;
  }

  .rp-page-title {
    font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: 700;
    color: var(--glow); text-shadow: 0 0 10px var(--glow); letter-spacing: 2px; flex: 1;
  }

  .rp-topbar-actions { display: flex; align-items: center; gap: 10px; }

  .rp-icon-btn {
    width: 34px; height: 34px; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-muted); font-size: 16px; transition: all 0.2s; position: relative;
  }

  .rp-icon-btn:hover { border-color: var(--border-bright); color: var(--glow); }

  .rp-content { flex: 1; overflow-y: auto; padding: 24px; }
  .rp-content::-webkit-scrollbar { width: 4px; }
  .rp-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .rp-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 8px;
    padding: 16px 20px; position: relative; overflow: hidden; margin-bottom: 16px;
  }

  .rp-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--glow), transparent); opacity: 0.4;
  }

  .rp-card-title {
    font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 2px; color: var(--text-muted); margin-bottom: 12px; text-transform: uppercase;
  }

  .rp-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }

  .rp-stat-card {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 8px;
    padding: 14px 16px; position: relative; overflow: hidden; transition: border-color 0.2s;
  }

  .rp-stat-card:hover { border-color: var(--border-bright); }

  .rp-stat-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: var(--accent, var(--glow)); opacity: 0.5;
  }

  .rp-stat-label { font-size: 10px; color: var(--text-muted); letter-spacing: 1.5px; margin-bottom: 6px; text-transform: uppercase; }

  .rp-stat-value {
    font-family: 'Orbitron', sans-serif; font-size: 28px; font-weight: 700;
    color: var(--accent, var(--glow)); text-shadow: 0 0 15px var(--accent, var(--glow)); line-height: 1;
  }

  .rp-stat-sub { font-size: 10px; color: var(--text-muted); margin-top: 4px; }

  .rp-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }

  .rp-task-card {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 8px;
    padding: 14px 16px; margin-bottom: 10px; transition: all 0.2s; cursor: pointer;
  }

  .rp-task-card:hover { border-color: var(--border-bright); }

  .rp-task-card.high-priority { border-left: 3px solid #ff4444; }
  .rp-task-card.medium-priority { border-left: 3px solid #fbbf24; }
  .rp-task-card.low-priority { border-left: 3px solid #4ade80; }

  .rp-task-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .rp-task-id { font-size: 10px; color: var(--text-muted); margin-bottom: 3px; }
  .rp-task-title { font-size: 13px; color: var(--text); }
  .rp-task-meta { font-size: 11px; color: var(--text-muted); margin-top: 6px; display: flex; gap: 12px; flex-wrap: wrap; }
  .rp-task-actions { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }

  .rp-btn {
    padding: 8px 16px; border-radius: 6px; font-family: 'Orbitron', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; border: 1px solid;
  }

  .rp-btn-primary { background: rgba(var(--glow-rgb),0.15); border-color: var(--glow); color: var(--glow); text-shadow: 0 0 6px var(--glow); }
  .rp-btn-primary:hover { background: rgba(var(--glow-rgb),0.25); box-shadow: 0 0 12px rgba(var(--glow-rgb),0.3); }

  .rp-btn-success { background: rgba(74,222,128,0.15); border-color: #4ade80; color: #4ade80; }
  .rp-btn-success:hover { background: rgba(74,222,128,0.25); }

  .rp-btn-danger { background: rgba(255,42,42,0.15); border-color: #ff2a2a; color: #f87171; }
  .rp-btn-danger:hover { background: rgba(255,42,42,0.25); }

  .rp-btn-warning { background: rgba(251,191,36,0.15); border-color: #fbbf24; color: #fbbf24; }
  .rp-btn-warning:hover { background: rgba(251,191,36,0.25); }

  .rp-btn-ghost { background: transparent; border-color: var(--border); color: var(--text-muted); }
  .rp-btn-ghost:hover { border-color: var(--border-bright); color: var(--text); }

  .rp-btn-sm { padding: 5px 12px; font-size: 9px; letter-spacing: 1px; }

  .s-pending { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
  .s-approved { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
  .s-inprogress { background: rgba(var(--glow-rgb),0.1); color: var(--glow); border: 1px solid rgba(var(--glow-rgb),0.3); }
  .s-completed { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
  .s-rejected { background: rgba(255,42,42,0.15); color: #f87171; border: 1px solid rgba(255,42,42,0.3); }
  .s-awaiting { background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid rgba(168,85,247,0.3); }

  .rp-status-badge {
    font-size: 10px; padding: 3px 8px; border-radius: 4px; letter-spacing: 1px;
    font-weight: 500; white-space: nowrap;
  }

  .rp-tabs { display: flex; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 12px; flex-wrap: wrap; }

  .rp-tab {
    padding: 6px 14px; border-radius: 4px; font-size: 11px; letter-spacing: 1px;
    cursor: pointer; color: var(--text-muted); border: 1px solid transparent;
    background: transparent; font-family: 'Share Tech Mono', monospace; transition: all 0.15s;
  }

  .rp-tab.active { background: rgba(var(--glow-rgb),0.12); border-color: var(--border-bright); color: var(--glow); text-shadow: 0 0 6px var(--glow); }
  .rp-tab:hover:not(.active) { color: var(--text); border-color: var(--border); }

  .rp-form-label { display: block; font-size: 11px; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 6px; }
  .rp-form-group { margin-bottom: 14px; }

  .rp-input, .rp-select, .rp-textarea {
    width: 100%; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 6px; padding: 9px 12px; color: var(--text);
    font-family: 'Share Tech Mono', monospace; font-size: 13px; outline: none; transition: border-color 0.2s;
  }

  .rp-input:focus, .rp-select:focus, .rp-textarea:focus {
    border-color: var(--border-bright); box-shadow: 0 0 10px rgba(var(--glow-rgb),0.15);
  }

  .rp-select option { background: var(--bg2); }
  .rp-textarea { resize: vertical; min-height: 80px; }

  .rp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .rp-worker-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 8px; margin-bottom: 8px; transition: all 0.2s;
  }

  .rp-worker-item:hover { border-color: var(--border-bright); }

  .rp-worker-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: rgba(var(--glow-rgb),0.1); border: 1px solid var(--border-bright);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700;
    color: var(--glow); text-shadow: 0 0 8px var(--glow); flex-shrink: 0;
  }

  .rp-worker-name { font-size: 13px; color: var(--text); }
  .rp-worker-role { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  .rp-worker-status {
    margin-left: auto; font-size: 10px; padding: 3px 8px;
    border-radius: 4px; letter-spacing: 1px;
  }

  .ws-available { background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
  .ws-ontask { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
  .ws-offline { background: rgba(100,100,100,0.15); color: #999; border: 1px solid rgba(100,100,100,0.3); }

  .rp-upload-zone {
    border: 2px dashed var(--border); border-radius: 8px; padding: 24px;
    text-align: center; cursor: pointer; transition: all 0.2s;
  }

  .rp-upload-zone:hover { border-color: var(--border-bright); background: rgba(var(--glow-rgb),0.04); }

  .rp-notif-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
  .rp-notif-item:last-child { border-bottom: none; }

  .rp-notif-icon { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .rp-notif-title { font-size: 13px; margin-bottom: 2px; }
  .rp-notif-msg { font-size: 11px; color: var(--text-muted); }
  .rp-notif-time { font-size: 10px; color: var(--text-muted); margin-top: 4px; }

  .rp-chat-window { display: flex; flex-direction: column; height: 400px; }
  .rp-chat-messages { flex: 1; overflow-y: auto; padding: 12px 0; display: flex; flex-direction: column; gap: 10px; }
  .rp-chat-messages::-webkit-scrollbar { width: 3px; }
  .rp-chat-messages::-webkit-scrollbar-thumb { background: var(--border); }
  .rp-chat-msg { max-width: 70%; padding: 8px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; }
  .rp-chat-msg.sent { align-self: flex-end; background: rgba(var(--glow-rgb),0.15); border: 1px solid rgba(var(--glow-rgb),0.3); }
  .rp-chat-msg.received { align-self: flex-start; background: var(--bg3); border: 1px solid var(--border); }
  .rp-chat-msg-time { font-size: 9px; color: var(--text-muted); margin-top: 3px; }
  .rp-chat-input-row { display: flex; gap: 8px; padding-top: 10px; border-top: 1px solid var(--border); margin-top: 8px; }

  .rp-progress-bar { height: 4px; background: var(--bg3); border-radius: 2px; overflow: hidden; margin-top: 6px; }
  .rp-progress-fill { height: 100%; border-radius: 2px; background: var(--glow); box-shadow: 0 0 6px var(--glow); transition: width 0.5s ease; }

  .rp-mini-chart { display: flex; align-items: flex-end; gap: 4px; height: 60px; }
  .rp-mini-bar { flex: 1; background: rgba(var(--glow-rgb),0.25); border-top: 1px solid rgba(var(--glow-rgb),0.6); border-radius: 2px 2px 0 0; min-width: 0; }

  .rp-timeline { position: relative; padding-left: 24px; }
  .rp-timeline-item { position: relative; padding-left: 20px; padding-bottom: 18px; }
  .rp-timeline-item::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 0; width: 1px; background: var(--border); }
  .rp-timeline-item:last-child::before { display: none; }
  .rp-timeline-dot { position: absolute; left: -4px; top: 6px; width: 9px; height: 9px; border-radius: 50%; background: var(--glow); box-shadow: 0 0 6px var(--glow); }
  .rp-timeline-time { font-size: 10px; color: var(--text-muted); margin-bottom: 2px; }
  .rp-timeline-text { font-size: 12px; color: var(--text); }

  .rp-map-placeholder { background: var(--bg3); border-radius: 6px; height: 100%; min-height: 260px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); }
  .rp-map-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(var(--glow-rgb),0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--glow-rgb),0.06) 1px, transparent 1px); background-size: 30px 30px; }
  .rp-map-dot { position: absolute; border-radius: 50%; animation: rp-ping 2s infinite; }
  @keyframes rp-ping { 0% { box-shadow: 0 0 0 0 rgba(var(--glow-rgb), 0.4); } 70% { box-shadow: 0 0 0 10px rgba(var(--glow-rgb), 0); } 100% { box-shadow: 0 0 0 0 rgba(var(--glow-rgb), 0); } }

  .rp-profile-hero { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding: 20px; background: var(--bg3); border-radius: 8px; border: 1px solid var(--border); }
  .rp-profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: var(--bg2); border: 2px solid var(--border-bright); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 24px; font-weight: 700; color: var(--glow); text-shadow: 0 0 12px var(--glow); box-shadow: 0 0 20px rgba(var(--glow-rgb),0.2); flex-shrink: 0; }

  .rp-scanlines { position: fixed; inset: 0; pointer-events: none; z-index: 9999; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px); }

  .rp-disaster-banner { background: rgba(255,42,42,0.15); border-bottom: 1px solid rgba(255,42,42,0.4); padding: 5px 0; overflow: hidden; white-space: nowrap; }
  .rp-marquee-text { font-size: 11px; color: #ff2a2a; letter-spacing: 2px; animation: rp-marquee 20s linear infinite; padding-right: 60px; text-shadow: 0 0 6px #ff2a2a; display: inline-block; }
  @keyframes rp-marquee { from { transform: translateX(100vw); } to { transform: translateX(-100%); } }

  .rp-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; }
  .rp-modal { background: var(--bg2); border: 1px solid var(--border-bright); border-radius: 12px; padding: 24px; width: 480px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 0 40px rgba(var(--glow-rgb),0.15); }
  .rp-modal-title { font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: 700; color: var(--glow); text-shadow: 0 0 10px var(--glow); letter-spacing: 2px; margin-bottom: 16px; }
  .rp-close-btn { position: absolute; top: 16px; right: 16px; background: transparent; border: 1px solid var(--border); border-radius: 4px; color: var(--text-muted); cursor: pointer; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; }
  .rp-close-btn:hover { border-color: #ff4444; color: #ff4444; }

  .rp-divider { height: 1px; background: var(--border); margin: 14px 0; }

  .rp-page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .rp-section-title { font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700; color: var(--glow); text-shadow: 0 0 8px var(--glow); letter-spacing: 2px; }

  .rp-empty { text-align: center; padding: 40px 20px; color: var(--text-muted); }
  .rp-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.4; }
  .rp-empty-text { font-size: 12px; letter-spacing: 1px; }

  .rp-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 10px; letter-spacing: 1px; border: 1px solid var(--border); color: var(--text-muted); background: var(--bg3); }
  .rp-chip.green { border-color: rgba(74,222,128,0.4); color: #4ade80; background: rgba(74,222,128,0.1); }
  .rp-chip.red { border-color: rgba(255,68,68,0.4); color: #f87171; background: rgba(255,68,68,0.1); }
  .rp-chip.yellow { border-color: rgba(251,191,36,0.4); color: #fbbf24; background: rgba(251,191,36,0.1); }

  .rp-toggle-switch { width: 40px; height: 22px; border-radius: 11px; border: 1px solid var(--border); background: var(--bg3); position: relative; cursor: pointer; transition: all 0.25s; flex-shrink: 0; }
  .rp-toggle-switch.on { background: rgba(var(--glow-rgb),0.2); border-color: var(--glow); box-shadow: 0 0 8px rgba(var(--glow-rgb),0.3); }
  .rp-toggle-thumb { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: var(--text-muted); transition: all 0.25s; }
  .rp-toggle-switch.on .rp-toggle-thumb { left: 21px; background: var(--glow); box-shadow: 0 0 6px var(--glow); }

  .rp-setting-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .rp-setting-label { font-size: 13px; color: var(--text); }
  .rp-setting-sub { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  .rp-evidence-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
  .rp-evidence-thumb { aspect-ratio: 1; background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; transition: border-color 0.2s; }
  .rp-evidence-thumb:hover { border-color: var(--border-bright); }

  .rp-perf-rank {
    display: flex; align-items: center; gap: 16px; padding: 12px 16px;
    background: rgba(var(--glow-rgb),0.08); border: 1px solid rgba(var(--glow-rgb),0.3);
    border-radius: 8px; margin-bottom: 14px;
  }

  .rp-rank-number { font-family: 'Orbitron', sans-serif; font-size: 36px; font-weight: 900; color: var(--glow); text-shadow: 0 0 15px var(--glow); }
  .rp-rank-label { font-size: 10px; color: var(--text-muted); letter-spacing: 2px; }
  .rp-rank-sub { font-size: 12px; color: var(--text); margin-top: 2px; }

  .rp-escalation-timer {
    font-family: 'Orbitron', sans-serif; font-size: 11px; color: #fbbf24;
    padding: 3px 8px; background: rgba(251,191,36,0.1); border-radius: 4px;
    border: 1px solid rgba(251,191,36,0.3);
  }

  @keyframes urgent-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,68,68,0.3); }
    50% { box-shadow: 0 0 0 6px rgba(255,68,68,0); }
  }

  .urgent { animation: urgent-pulse 1.5s infinite; }

  .rp-section-divider { height: 1px; background: var(--border); margin: 16px 0; position: relative; }
  .rp-section-divider::before { content: attr(data-label); position: absolute; top: -9px; left: 16px; background: var(--bg2); padding: 0 8px; font-size: 9px; color: var(--text-muted); letter-spacing: 2px; }
`;

const DEPT_TYPES = {
  'K-Electric Korangi': { icon: '⚡', color: '#fbbf24' },
  'SUI Gas': { icon: '🔥', color: '#f97316' },
  'Municipal Corporation': { icon: '🛣️', color: '#60a5fa' },
  'Water Board': { icon: '💧', color: '#22d3ee' },
  'Edhi Foundation': { icon: '🏥', color: '#4ade80' },
};

const TASK_TYPE_MAP = {
  ELECTRICITY: { icon: '⚡', color: '#fbbf24' },
  GAS: { icon: '🔥', color: '#f97316' },
  ROAD: { icon: '🛣️', color: '#60a5fa' },
  WATER: { icon: '💧', color: '#22d3ee' },
  MEDICAL: { icon: '🏥', color: '#4ade80' },
};

const mockTasks = [
  { id: 'TASK-2026-0088', reportId: 'CIV-2026-1045', type: 'ELECTRICITY', title: 'No electricity in Korangi-2, Street 5', citizen: 'Ali Raza', phone: '0300-1234567', location: 'Korangi-2, Street 5', people: 50, priority: 'HIGH', status: 'PENDING_RESPONDER', created: '2026-05-30 09:00', worker: null },
  { id: 'TASK-2026-0085', reportId: 'CIV-2026-1040', type: 'ELECTRICITY', title: 'Electric pole down near bus stop', citizen: 'Sara Khan', phone: '0321-9876543', location: 'Block 2, Korangi', people: 20, priority: 'HIGH', status: 'WITH_WORKER', created: '2026-05-29 14:00', worker: 'worker_ali' },
  { id: 'TASK-2026-0080', reportId: 'CIV-2026-1035', type: 'ELECTRICITY', title: 'Frequent power outage — 6+ hours daily', citizen: 'Ahmed Hassan', phone: '0312-5555555', location: 'Korangi-4', people: 200, priority: 'MEDIUM', status: 'IN_PROGRESS', created: '2026-05-29 10:00', worker: 'worker_ahmed' },
  { id: 'TASK-2026-0075', reportId: 'CIV-2026-1028', type: 'ELECTRICITY', title: 'Meter tampering reported by resident', citizen: 'Fatima Noor', phone: '0301-2233445', location: 'Block 7, Korangi', people: 1, priority: 'LOW', status: 'COMPLETED', created: '2026-05-27 08:00', worker: 'worker_ali' },
  { id: 'TASK-2026-0070', reportId: 'CIV-2026-1020', type: 'ELECTRICITY', title: 'Transformer overload complaint', citizen: 'Bilal Ahmed', phone: '0333-1112223', location: 'Sector B, Korangi', people: 80, priority: 'MEDIUM', status: 'REJECTED', created: '2026-05-26 16:00', worker: null },
];

const mockWorkers = [
  { id: 'w1', username: 'worker_ali', name: 'Ali Raza', phone: '0310-1111111', role: 'Lineman', status: 'available', tasksCompleted: 23 },
  { id: 'w2', username: 'worker_ahmed', name: 'Ahmed Khan', phone: '0310-2222222', role: 'Technician', status: 'ontask', tasksCompleted: 18 },
  { id: 'w3', username: 'worker_usman', name: 'Usman Ali', phone: '0310-3333333', role: 'Driver', status: 'available', tasksCompleted: 12 },
  { id: 'w4', username: 'worker_zain', name: 'Zain Malik', phone: '0310-4444444', role: 'Lineman', status: 'offline', tasksCompleted: 8 },
];

const mockFieldReports = [
  { id: 1, taskId: 'TASK-2026-0085', worker: 'Ali Raza', time: '2026-05-29 16:00', progress: 'Pole re-erected. Working on cable connections.', evidenceCount: 3 },
  { id: 2, taskId: 'TASK-2026-0080', worker: 'Ahmed Khan', time: '2026-05-29 13:00', progress: 'Transformer load balancing in progress.', evidenceCount: 2 },
];

const mockNotifs = [
  { id: 1, icon: '🆕', color: 'rgba(var(--glow-rgb),0.1)', title: 'NEW TASK ASSIGNED', msg: 'TASK-2026-0088 assigned by Admin — HIGH priority electricity issue', time: '10 mins ago', unread: true },
  { id: 2, icon: '✅', color: 'rgba(74,222,128,0.1)', title: 'WORKER COMPLETED TASK', msg: 'Ali Raza completed TASK-2026-0075 and uploaded evidence', time: '2 hours ago', unread: true },
  { id: 3, icon: '⚠️', color: 'rgba(255,68,68,0.1)', title: 'ESCALATION ALERT', msg: 'TASK-2026-0083 not accepted for 20 minutes — auto escalating', time: '3 hours ago', unread: false },
  { id: 4, icon: '💬', color: 'rgba(96,165,250,0.1)', title: 'ADMIN MESSAGE', msg: 'Please prioritize electricity tasks in Korangi-2 area today', time: 'Yesterday', unread: false },
];

const TaskIcon = ({ type }) => {
  const t = TASK_TYPE_MAP[type] || TASK_TYPE_MAP.ELECTRICITY;
  return <div style={{ width: 34, height: 34, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: `${t.color}20`, border: `1px solid ${t.color}40`, flexShrink: 0 }}>{t.icon}</div>;
};

const StatusBadge = ({ status }) => {
  const map = {
    PENDING_RESPONDER: { cls: 's-pending', label: 'PENDING' },
    ACCEPTED: { cls: 's-approved', label: 'ACCEPTED' },
    WITH_WORKER: { cls: 's-inprogress', label: 'WITH WORKER' },
    IN_PROGRESS: { cls: 's-inprogress', label: 'IN PROGRESS' },
    AWAITING_REVIEW: { cls: 's-awaiting', label: 'AWAITING REVIEW' },
    COMPLETED: { cls: 's-completed', label: 'COMPLETED' },
    REJECTED: { cls: 's-rejected', label: 'REJECTED' },
  };
  const s = map[status] || { cls: 's-pending', label: status };
  return <span className={`rp-status-badge ${s.cls}`}>{s.label}</span>;
};

const MapView = ({ tasks, disaster }) => (
  <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '100%', minHeight: '240px', border: '1px solid var(--border)' }}>
    <div className="rp-map-grid" />
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
      <div style={{ fontSize: '10px', fontFamily: 'Orbitron', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '4px' }}>TASK MAP — KORANGI</div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Leaflet.js integration</div>
    </div>
    {[
      { top: '30%', left: '40%', c: '#ff4444', s: 10 },
      { top: '55%', left: '60%', c: '#fbbf24', s: 8 },
      { top: '40%', left: '25%', c: '#22d3ee', s: 8 },
      { top: '65%', left: '45%', c: '#4ade80', s: 8 },
    ].map((m, i) => (
      <div key={i} className="rp-map-dot" style={{ top: m.top, left: m.left, width: m.s, height: m.s, background: m.c, boxShadow: `0 0 8px ${m.c}` }} />
    ))}
    <div style={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', gap: 10, fontSize: 9, color: 'var(--text-muted)', zIndex: 2 }}>
      <span><span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#ff4444', marginRight: 3 }}></span>PENDING</span>
      <span><span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#fbbf24', marginRight: 3 }}></span>ACTIVE</span>
      <span><span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#4ade80', marginRight: 3 }}></span>DONE</span>
    </div>
  </div>
);

// ── Task Detail Modal ──
const TaskDetailModal = ({ task, onClose, workers, onStatusChange }) => {
  const [assignWorker, setAssignWorker] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [view, setView] = useState('details');
  return (
    <div className="rp-modal-overlay" onClick={onClose}>
      <div className="rp-modal" onClick={e => e.stopPropagation()}>
        <button className="rp-close-btn" onClick={onClose}>✕</button>
        <div className="rp-modal-title">TASK DETAILS</div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['details', 'timeline', 'map'].map(v => (
            <button key={v} className={`rp-tab ${view === v ? 'active' : ''}`} onClick={() => setView(v)} style={{ flex: 1 }}>{v.toUpperCase()}</button>
          ))}
        </div>

        {view === 'details' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '11px', color: 'var(--glow)', letterSpacing: '2px', marginBottom: '4px' }}>{task.id}</div>
                <div style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '6px' }}>{task.title}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <StatusBadge status={task.status} />
                  <span className={`rp-status-badge ${task.priority === 'HIGH' ? 's-rejected' : task.priority === 'MEDIUM' ? 's-pending' : 's-completed'}`}>{task.priority}</span>
                </div>
              </div>
              <TaskIcon type={task.type} />
            </div>
            <div className="rp-divider" />
            {[
              { label: 'CITIZEN', value: `${task.citizen} · ${task.phone}` },
              { label: 'LOCATION', value: task.location },
              { label: 'PEOPLE AFFECTED', value: task.people },
              { label: 'REPORT ID', value: task.reportId },
              { label: 'CREATED', value: task.created },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', gap: '12px', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ minWidth: '120px', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px', paddingTop: '1px' }}>{f.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text)' }}>{f.value}</div>
              </div>
            ))}

            {task.status === 'PENDING_RESPONDER' && (
              <>
                <div className="rp-divider" />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="rp-btn rp-btn-success" onClick={() => { onStatusChange(task.id, 'ACCEPTED'); onClose(); }}>✓ ACCEPT TASK</button>
                  <button className="rp-btn rp-btn-danger" onClick={() => { onStatusChange(task.id, 'REJECTED'); onClose(); }}>✕ REJECT</button>
                </div>
              </>
            )}

            {(task.status === 'ACCEPTED' || task.status === 'WITH_WORKER') && (
              <>
                <div className="rp-divider" />
                <div className="rp-form-group">
                  <label className="rp-form-label">ASSIGN TO WORKER</label>
                  <select className="rp-select" value={assignWorker} onChange={e => setAssignWorker(e.target.value)}>
                    <option value="">Select worker...</option>
                    {workers.filter(w => w.status === 'available').map(w => (
                      <option key={w.username} value={w.username}>{w.name} — {w.role}</option>
                    ))}
                  </select>
                </div>
                <button className="rp-btn rp-btn-primary" onClick={() => { if (assignWorker) { onStatusChange(task.id, 'WITH_WORKER'); onClose(); } }}>ASSIGN WORKER</button>
              </>
            )}
          </>
        )}

        {view === 'timeline' && (
          <div className="rp-timeline">
            {[
              { time: task.created, text: 'Task created from citizen report' },
              { time: task.created.replace('09', '10'), text: 'Admin approved and forwarded to K-Electric' },
              ...(task.status !== 'PENDING_RESPONDER' ? [{ time: task.created.replace('09', '11'), text: 'Focal person accepted task' }] : []),
              ...(task.worker ? [{ time: task.created.replace('09', '13'), text: `Task assigned to ${task.worker}` }] : []),
              ...(task.status === 'COMPLETED' ? [{ time: '2026-05-30 15:00', text: 'Worker completed and uploaded evidence' }, { time: '2026-05-30 15:30', text: 'Responder confirmed completion ✅' }] : []),
            ].map((t, i) => (
              <div key={i} className="rp-timeline-item">
                <div className="rp-timeline-dot" />
                <div className="rp-timeline-time">{t.time}</div>
                <div className="rp-timeline-text">{t.text}</div>
              </div>
            ))}
          </div>
        )}

        {view === 'map' && (
          <div style={{ height: '260px' }}>
            <MapView disaster={false} />
            <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>📍 {task.location}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Page: Dashboard ──
const DashboardPage = ({ tasks, workers, onNavigate }) => {
  const pending = tasks.filter(t => t.status === 'PENDING_RESPONDER').length;
  const active = tasks.filter(t => ['ACCEPTED', 'WITH_WORKER', 'IN_PROGRESS'].includes(t.status)).length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const stats = [
    { label: 'PENDING TASKS', value: pending, color: '#fbbf24' },
    { label: 'ACTIVE TASKS', value: active, color: 'var(--glow)' },
    { label: 'COMPLETED', value: completed, color: '#4ade80' },
    { label: 'MY WORKERS', value: workers.length, color: '#c084fc' },
  ];
  return (
    <div>
      <div className="rp-stats-grid">
        {stats.map(s => (
          <div key={s.label} className="rp-stat-card" style={{ '--accent': s.color }}>
            <div className="rp-stat-label">{s.label}</div>
            <div className="rp-stat-value">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="rp-two-col" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        <div className="rp-card" style={{ height: '290px' }}>
          <div className="rp-card-title">TASK LOCATIONS — LIVE</div>
          <MapView />
        </div>
        <div className="rp-card">
          <div className="rp-card-title">QUICK ACTIONS</div>
          {[
            { icon: '📋', label: 'VIEW PENDING TASKS', page: 'tasks', extra: pending > 0 ? `${pending} NEW` : null },
            { icon: '👥', label: 'MANAGE WORKERS', page: 'workers' },
            { icon: '📝', label: 'FIELD REPORTS', page: 'fieldreports' },
            { icon: '📈', label: 'PERFORMANCE', page: 'performance' },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.page)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px',
              padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: '6px', cursor: 'pointer', fontSize: '11px', letterSpacing: '1px',
              color: 'var(--text)', fontFamily: "'Share Tech Mono',monospace", width: '100%', transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--glow)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}>
              <span>{a.icon}</span>
              <span style={{ flex: 1 }}>{a.label}</span>
              {a.extra && <span style={{ fontSize: '9px', background: 'rgba(255,68,68,0.15)', color: '#f87171', border: '1px solid rgba(255,68,68,0.3)', padding: '1px 6px', borderRadius: '3px' }}>{a.extra}</span>}
            </button>
          ))}
          <div className="rp-card-title" style={{ marginTop: '10px' }}>WORKER STATUS</div>
          {workers.slice(0, 3).map(w => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text)', flex: 1 }}>{w.name}</div>
              <span className={`rp-worker-status ${w.status === 'available' ? 'ws-available' : w.status === 'ontask' ? 'ws-ontask' : 'ws-offline'}`}>
                {w.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="rp-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div className="rp-card-title" style={{ margin: 0 }}>URGENT — PENDING TASKS</div>
          <button className="rp-btn rp-btn-ghost rp-btn-sm" onClick={() => onNavigate('tasks')}>VIEW ALL</button>
        </div>
        {tasks.filter(t => t.status === 'PENDING_RESPONDER').length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12px' }}>✓ No pending tasks</div>
        ) : (
          tasks.filter(t => t.status === 'PENDING_RESPONDER').slice(0, 3).map(t => (
            <div key={t.id} className="rp-task-card high-priority" onClick={() => onNavigate('tasks')}>
              <div className="rp-task-header">
                <div>
                  <div className="rp-task-id">{t.id} · {t.reportId}</div>
                  <div className="rp-task-title">{t.title}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <StatusBadge status={t.status} />
                  <div className="rp-escalation-timer">⏱ ACCEPT NOW</div>
                </div>
              </div>
              <div className="rp-task-meta">
                <span>📍 {t.location}</span>
                <span>👤 {t.citizen}</span>
                <span>👥 {t.people} affected</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ── Page: Tasks ──
const TasksPage = ({ tasks, workers, onTaskUpdate }) => {
  const [tab, setTab] = useState('PENDING');
  const [selected, setSelected] = useState(null);
  const filtered = tasks.filter(t => {
    if (tab === 'PENDING') return t.status === 'PENDING_RESPONDER';
    if (tab === 'ACTIVE') return ['ACCEPTED', 'WITH_WORKER', 'IN_PROGRESS'].includes(t.status);
    if (tab === 'COMPLETED') return t.status === 'COMPLETED';
    if (tab === 'REJECTED') return t.status === 'REJECTED';
    return true;
  });

  return (
    <div>
      <div className="rp-page-header">
        <div className="rp-section-title">TASK MANAGEMENT</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tab === 'PENDING' && filtered.length > 0 && (
            <button className="rp-btn rp-btn-success rp-btn-sm" onClick={() => { onTaskUpdate(null, 'ACCEPT_ALL'); }}>✓ ACCEPT ALL</button>
          )}
        </div>
      </div>
      <div className="rp-tabs">
        {['ALL', 'PENDING', 'ACTIVE', 'COMPLETED', 'REJECTED'].map(t => (
          <button key={t} className={`rp-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t} {t === 'PENDING' ? `(${tasks.filter(x => x.status === 'PENDING_RESPONDER').length})` : ''}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="rp-empty"><div className="rp-empty-icon">📋</div><div className="rp-empty-text">NO TASKS IN THIS CATEGORY</div></div>
      ) : (
        filtered.map(t => (
          <div key={t.id} className={`rp-task-card ${t.priority === 'HIGH' ? 'high-priority' : t.priority === 'MEDIUM' ? 'medium-priority' : 'low-priority'} ${t.status === 'PENDING_RESPONDER' && t.priority === 'HIGH' ? 'urgent' : ''}`}>
            <div className="rp-task-header">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <TaskIcon type={t.type} />
                <div>
                  <div className="rp-task-id">{t.id} · FROM: {t.reportId}</div>
                  <div className="rp-task-title">{t.title}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                <StatusBadge status={t.status} />
                <span style={{ fontSize: '10px', color: t.priority === 'HIGH' ? '#f87171' : t.priority === 'MEDIUM' ? '#fbbf24' : '#4ade80' }}>{t.priority}</span>
              </div>
            </div>
            <div className="rp-task-meta">
              <span>📍 {t.location}</span>
              <span>👤 {t.citizen}</span>
              <span>📞 {t.phone}</span>
              <span>👥 {t.people} affected</span>
            </div>
            {t.status === 'WITH_WORKER' && t.worker && (
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--glow)' }}>
                🔧 Assigned to: {workers.find(w => w.username === t.worker)?.name || t.worker}
              </div>
            )}
            <div className="rp-task-actions">
              {t.status === 'PENDING_RESPONDER' && (
                <>
                  <button className="rp-btn rp-btn-success rp-btn-sm" onClick={() => onTaskUpdate(t.id, 'ACCEPTED')}>✓ ACCEPT</button>
                  <button className="rp-btn rp-btn-danger rp-btn-sm" onClick={() => onTaskUpdate(t.id, 'REJECTED')}>✕ REJECT</button>
                </>
              )}
              {t.status === 'ACCEPTED' && (
                <button className="rp-btn rp-btn-warning rp-btn-sm" onClick={() => onTaskUpdate(t.id, 'WITH_WORKER')}>ASSIGN TO WORKER →</button>
              )}
              {t.status === 'WITH_WORKER' && (
                <button className="rp-btn rp-btn-primary rp-btn-sm" onClick={() => onTaskUpdate(t.id, 'COMPLETED')}>✓ CONFIRM COMPLETE</button>
              )}
              <button className="rp-btn rp-btn-ghost rp-btn-sm" onClick={() => setSelected(t)}>DETAILS →</button>
              <button className="rp-btn rp-btn-ghost rp-btn-sm">🗺 MAP</button>
            </div>
          </div>
        ))
      )}
      {selected && <TaskDetailModal task={selected} workers={workers} onClose={() => setSelected(null)} onStatusChange={(id, s) => { onTaskUpdate(id, s); setSelected(null); }} />}
    </div>
  );
};

// ── Page: Workers ──
const WorkersPage = ({ workers, onAddWorker, onRemoveWorker }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', role: 'Lineman', cnic: '' });
  return (
    <div>
      <div className="rp-page-header">
        <div className="rp-section-title">MANAGE WORKERS</div>
        <button className="rp-btn rp-btn-primary rp-btn-sm" onClick={() => setAdding(true)}>+ ADD WORKER</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {workers.map(w => (
          <div key={w.id} className="rp-worker-item">
            <div className="rp-worker-avatar">{w.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
            <div style={{ flex: 1 }}>
              <div className="rp-worker-name">{w.name}</div>
              <div className="rp-worker-role">{w.role} · 📞 {w.phone}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>✓ {w.tasksCompleted} completed</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
              <span className={`rp-worker-status ${w.status === 'available' ? 'ws-available' : w.status === 'ontask' ? 'ws-ontask' : 'ws-offline'}`}>
                {w.status === 'available' ? '🟢 AVAIL' : w.status === 'ontask' ? '🟡 ON TASK' : '⚫ OFFLINE'}
              </span>
              <button className="rp-btn rp-btn-ghost rp-btn-sm" onClick={() => onRemoveWorker(w.id)}>REMOVE</button>
            </div>
          </div>
        ))}
      </div>
      {adding && (
        <div className="rp-card">
          <div className="rp-card-title">ADD NEW WORKER</div>
          <div className="rp-form-row" style={{ marginBottom: '12px' }}>
            <div className="rp-form-group" style={{ margin: 0 }}>
              <label className="rp-form-label">FULL NAME</label>
              <input className="rp-input" placeholder="Worker's name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="rp-form-group" style={{ margin: 0 }}>
              <label className="rp-form-label">PHONE</label>
              <input className="rp-input" placeholder="0310-XXXXXXX" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div className="rp-form-row" style={{ marginBottom: '14px' }}>
            <div className="rp-form-group" style={{ margin: 0 }}>
              <label className="rp-form-label">ROLE</label>
              <select className="rp-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                <option>Lineman</option><option>Technician</option><option>Driver</option><option>Inspector</option>
              </select>
            </div>
            <div className="rp-form-group" style={{ margin: 0 }}>
              <label className="rp-form-label">CNIC</label>
              <input className="rp-input" placeholder="XXXXX-XXXXXXX-X" value={form.cnic} onChange={e => setForm(p => ({ ...p, cnic: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="rp-btn rp-btn-primary" onClick={() => { if (form.name) { onAddWorker(form); setAdding(false); setForm({ name: '', phone: '', role: 'Lineman', cnic: '' }); } }}>ADD WORKER</button>
            <button className="rp-btn rp-btn-ghost" onClick={() => setAdding(false)}>CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Page: Field Reports ──
const FieldReportsPage = ({ tasks }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [newReport, setNewReport] = useState({ task: '', notes: '', file: null });
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div className="rp-page-header">
        <div className="rp-section-title">FIELD REPORTS</div>
        <button className="rp-btn rp-btn-primary rp-btn-sm" onClick={() => setShowForm(true)}>+ ADD REPORT</button>
      </div>
      {mockFieldReports.map(r => (
        <div key={r.id} className="rp-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedReport(r === selectedReport ? null : r)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '11px', color: 'var(--glow)', letterSpacing: '1px', marginBottom: '4px' }}>TASK {r.taskId}</div>
              <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '6px' }}>{r.progress}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>👤 {r.worker} · 🕐 {r.time} · 📷 {r.evidenceCount} photos</div>
            </div>
            <button className="rp-btn rp-btn-success rp-btn-sm">CONFIRM ✓</button>
          </div>
          {selectedReport === r && (
            <>
              <div className="rp-divider" />
              <div className="rp-card-title">EVIDENCE PHOTOS</div>
              <div className="rp-evidence-grid">
                {Array.from({ length: r.evidenceCount }).map((_, i) => (
                  <div key={i} className="rp-evidence-thumb">
                    {['📷', '🖼️', '📹'][i % 3]}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
      {showForm && (
        <div className="rp-card">
          <div className="rp-card-title">ADD FIELD REPORT</div>
          <div className="rp-form-group">
            <label className="rp-form-label">SELECT TASK</label>
            <select className="rp-select" value={newReport.task} onChange={e => setNewReport(p => ({ ...p, task: e.target.value }))}>
              <option value="">Choose task...</option>
              {tasks.filter(t => ['WITH_WORKER', 'IN_PROGRESS'].includes(t.status)).map(t => (
                <option key={t.id} value={t.id}>{t.id} — {t.title}</option>
              ))}
            </select>
          </div>
          <div className="rp-form-group">
            <label className="rp-form-label">PROGRESS NOTES</label>
            <textarea className="rp-textarea" placeholder="Describe work completed..." value={newReport.notes} onChange={e => setNewReport(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div className="rp-form-group">
            <label className="rp-form-label">UPLOAD EVIDENCE</label>
            <label htmlFor="field-upload" style={{ cursor: 'pointer' }}>
              <div className="rp-upload-zone">
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>📷</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>UPLOAD BEFORE / AFTER PHOTOS</div>
              </div>
            </label>
            <input id="field-upload" type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={e => setNewReport(p => ({ ...p, file: e.target.files[0]?.name }))} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="rp-btn rp-btn-primary" onClick={() => setShowForm(false)}>SUBMIT REPORT</button>
            <button className="rp-btn rp-btn-ghost" onClick={() => setShowForm(false)}>CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Page: Task History ──
const HistoryPage = ({ tasks }) => {
  const [search, setSearch] = useState('');
  const hist = tasks.filter(t => ['COMPLETED', 'REJECTED'].includes(t.status)).filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search));
  return (
    <div>
      <div className="rp-page-header">
        <div className="rp-section-title">TASK HISTORY</div>
        <button className="rp-btn rp-btn-ghost rp-btn-sm">EXPORT CSV</button>
      </div>
      <div className="rp-card" style={{ marginBottom: '16px' }}>
        <input className="rp-input" placeholder="Search by task ID or description..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {hist.map(t => (
        <div key={t.id} className="rp-task-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <TaskIcon type={t.type} />
              <div>
                <div className="rp-task-id">{t.id}</div>
                <div className="rp-task-title">{t.title}</div>
                <div className="rp-task-meta"><span>📍 {t.location}</span><span>📅 {t.created}</span></div>
              </div>
            </div>
            <StatusBadge status={t.status} />
          </div>
        </div>
      ))}
      {hist.length === 0 && <div className="rp-empty"><div className="rp-empty-icon">📜</div><div className="rp-empty-text">NO HISTORY FOUND</div></div>}
    </div>
  );
};

// ── Page: Performance ──
const PerformancePage = () => (
  <div>
    <div className="rp-page-header"><div className="rp-section-title">PERFORMANCE METRICS</div></div>
    <div className="rp-perf-rank">
      <div className="rp-rank-number">#3</div>
      <div>
        <div className="rp-rank-label">DEPARTMENT RANKING</div>
        <div className="rp-rank-sub">Top 3 among all responders</div>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: '20px', color: '#fbbf24', textShadow: '0 0 10px #fbbf24' }}>4.8 ★</div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>87 ratings</div>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '16px' }}>
      {[
        { label: 'TOTAL TASKS', value: '87', color: 'var(--glow)' },
        { label: 'COMPLETED', value: '79', color: '#4ade80' },
        { label: 'AVG RESPONSE', value: '1.2h', color: '#fbbf24' },
        { label: 'SUCCESS RATE', value: '91%', color: '#c084fc' },
      ].map(s => (
        <div key={s.label} className="rp-stat-card" style={{ '--accent': s.color }}>
          <div className="rp-stat-label">{s.label}</div>
          <div className="rp-stat-value" style={{ fontSize: '22px' }}>{s.value}</div>
        </div>
      ))}
    </div>
    <div className="rp-two-col">
      <div className="rp-card">
        <div className="rp-card-title">TASKS COMPLETED / MONTH</div>
        <div className="rp-mini-chart" style={{ height: '100px' }}>
          {[6, 9, 7, 11, 8, 13, 10, 15, 9, 12, 14, 11].map((h, i) => (
            <div key={i} className="rp-mini-bar" style={{ height: `${(h / 15) * 100}%` }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => (
            <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: '8px', color: 'var(--text-muted)' }}>{m}</span>
          ))}
        </div>
      </div>
      <div className="rp-card">
        <div className="rp-card-title">WORKER PERFORMANCE</div>
        {mockWorkers.map(w => (
          <div key={w.id} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text)' }}>{w.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--glow)' }}>{w.tasksCompleted}</span>
            </div>
            <div className="rp-progress-bar">
              <div className="rp-progress-fill" style={{ width: `${(w.tasksCompleted / 25) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Page: Notifications ──
const NotifPage = ({ notifs, setNotifs }) => (
  <div>
    <div className="rp-page-header">
      <div className="rp-section-title">NOTIFICATIONS</div>
      <button className="rp-btn rp-btn-ghost rp-btn-sm" onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}>MARK ALL READ</button>
    </div>
    <div className="rp-card">
      {notifs.map(n => (
        <div key={n.id} className="rp-notif-item" onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, unread: false } : x))} style={{ opacity: n.unread ? 1 : 0.7 }}>
          <div className="rp-notif-icon" style={{ background: n.color }}><span>{n.icon}</span></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="rp-notif-title" style={{ color: n.unread ? 'var(--glow)' : 'var(--text)' }}>{n.title}</div>
              {n.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--glow)', boxShadow: '0 0 6px var(--glow)', marginTop: 4, flexShrink: 0 }} />}
            </div>
            <div className="rp-notif-msg">{n.msg}</div>
            <div className="rp-notif-time">{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Page: Help Desk ──
const HelpDeskPage = () => {
  const [chats, setChats] = useState([
    { id: 1, type: 'received', text: 'Hello! Admin support here. How can we help you?', time: '09:00 AM' },
    { id: 2, type: 'sent', text: 'TASK-2026-0088 just came in. Can you provide more details about the affected area?', time: '09:05 AM' },
    { id: 3, type: 'received', text: 'The outage covers sectors 2, 3, and 4 of Korangi. Multiple complaints received. Please prioritize.', time: '09:07 AM' },
  ]);
  const [msg, setMsg] = useState('');
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [chats]);
  const send = () => {
    if (!msg.trim()) return;
    setChats(c => [...c, { id: Date.now(), type: 'sent', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMsg('');
    setTimeout(() => setChats(c => [...c, { id: Date.now() + 1, type: 'received', text: 'Message received. We will respond shortly.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]), 1000);
  };
  return (
    <div>
      <div className="rp-page-header"><div className="rp-section-title">HELP DESK</div><div className="rp-chip green">🟢 ADMIN ONLINE</div></div>
      <div className="rp-card">
        <div className="rp-chat-window">
          <div className="rp-chat-messages">
            {chats.map(c => <div key={c.id} className={`rp-chat-msg ${c.type}`}>{c.text}<div className="rp-chat-msg-time">{c.time}</div></div>)}
            <div ref={endRef} />
          </div>
          <div className="rp-chat-input-row">
            <input className="rp-input" placeholder="Message admin..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} style={{ flex: 1 }} />
            <button className="rp-btn rp-btn-primary rp-btn-sm" onClick={send}>SEND</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Page: Profile ──
const ProfilePage = ({ online, setOnline }) => {
  const [toggles, setToggles] = useState({ emailNotif: true, smsNotif: true, soundAlert: true });
  const toggle = k => setToggles(t => ({ ...t, [k]: !t[k] }));
  const Toggle = ({ k }) => (
    <div className={`rp-toggle-switch ${toggles[k] ? 'on' : ''}`} onClick={() => toggle(k)}>
      <div className="rp-toggle-thumb" />
    </div>
  );
  return (
    <div>
      <div className="rp-profile-hero">
        <div className="rp-profile-avatar">AR</div>
        <div>
          <div style={{ fontFamily: 'Orbitron', fontSize: '18px', fontWeight: 700, color: 'var(--glow)', textShadow: '0 0 10px var(--glow)' }}>AHMED RAZA</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>FOCAL PERSON · K-ELECTRIC KORANGI</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>ID: RESP-2024-0006 · ahmed@kelectric.com</div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button className={`rp-btn rp-btn-sm ${online ? 'rp-btn-success' : 'rp-btn-danger'}`} onClick={() => setOnline(!online)}>
              {online ? '🟢 ONLINE' : '🔴 OFFLINE'}
            </button>
          </div>
        </div>
      </div>
      <div className="rp-two-col">
        <div className="rp-card">
          <div className="rp-card-title">PROFILE INFO</div>
          {[
            { label: 'FULL NAME', val: 'Ahmed Raza' },
            { label: 'PHONE', val: '0300-1111111' },
            { label: 'EMAIL', val: 'ahmed@kelectric.com' },
            { label: 'DEPARTMENT', val: 'K-Electric Korangi' },
            { label: 'DESIGNATION', val: 'Focal Person' },
          ].map(f => (
            <div key={f.label} className="rp-form-group" style={{ marginBottom: '10px' }}>
              <label className="rp-form-label">{f.label}</label>
              <input className="rp-input" defaultValue={f.val} />
            </div>
          ))}
          <button className="rp-btn rp-btn-primary">SAVE CHANGES</button>
        </div>
        <div>
          <div className="rp-card" style={{ marginBottom: '14px' }}>
            <div className="rp-card-title">CHANGE PASSWORD</div>
            <div className="rp-form-group"><label className="rp-form-label">CURRENT</label><input className="rp-input" type="password" placeholder="••••••••" /></div>
            <div className="rp-form-group"><label className="rp-form-label">NEW</label><input className="rp-input" type="password" placeholder="••••••••" /></div>
            <div className="rp-form-group"><label className="rp-form-label">CONFIRM</label><input className="rp-input" type="password" placeholder="••••••••" /></div>
            <button className="rp-btn rp-btn-primary">UPDATE</button>
          </div>
          <div className="rp-card">
            <div className="rp-card-title">NOTIFICATION SETTINGS</div>
            {[
              { key: 'emailNotif', label: 'Email Alerts', sub: 'New task notifications' },
              { key: 'smsNotif', label: 'SMS Alerts', sub: 'Urgent task SMS' },
              { key: 'soundAlert', label: 'Sound Alerts', sub: 'Browser audio on new task' },
            ].map(s => (
              <div key={s.key} className="rp-setting-row">
                <div><div className="rp-setting-label">{s.label}</div><div className="rp-setting-sub">{s.sub}</div></div>
                <Toggle k={s.key} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main App ──
export default function ResponderPortal() {
  const [page, setPage] = useState('dashboard');
  const [disaster, setDisaster] = useState(false);
  const [online, setOnline] = useState(true);
  const [tasks, setTasks] = useState(mockTasks);
  const [workers, setWorkers] = useState(mockWorkers);
  const [notifs, setNotifs] = useState(mockNotifs);

  const handleTaskUpdate = (id, newStatus) => {
    if (newStatus === 'ACCEPT_ALL') {
      setTasks(t => t.map(x => x.status === 'PENDING_RESPONDER' ? { ...x, status: 'ACCEPTED' } : x));
    } else {
      setTasks(t => t.map(x => x.id === id ? { ...x, status: newStatus } : x));
    }
  };

  const addWorker = (form) => {
    const id = 'w' + Date.now();
    setWorkers(w => [...w, { id, username: 'worker_' + form.name.split(' ')[0].toLowerCase(), ...form, status: 'available', tasksCompleted: 0 }]);
  };

  const removeWorker = (id) => setWorkers(w => w.filter(x => x.id !== id));

  const pendingCount = tasks.filter(t => t.status === 'PENDING_RESPONDER').length;
  const unreadNotifs = notifs.filter(n => n.unread).length;

  const navItems = [
    { id: 'dashboard', icon: '▣', label: 'DASHBOARD' },
    { id: 'map', icon: '🗺', label: 'LIVE MAP' },
    { id: 'tasks', icon: '📋', label: 'TASKS', badge: pendingCount || null, badgeType: pendingCount > 0 ? 'alert' : '' },
    { id: 'workers', icon: '👥', label: 'WORKERS' },
    { id: 'fieldreports', icon: '📝', label: 'FIELD REPORTS' },
    { id: 'notifications', icon: '🔔', label: 'NOTIFICATIONS', badge: unreadNotifs || null, badgeType: unreadNotifs > 0 ? 'alert' : '' },
    { id: 'history', icon: '📜', label: 'TASK HISTORY' },
    { id: 'performance', icon: '📈', label: 'PERFORMANCE' },
    { id: 'helpdesk', icon: '💬', label: 'HELP DESK' },
    { id: 'profile', icon: '👤', label: 'PROFILE & SETTINGS' },
  ];

  const pageTitles = {
    dashboard: 'RESPONDER DASHBOARD', map: 'LIVE MAP', tasks: 'TASK MANAGEMENT',
    workers: 'WORKERS', fieldreports: 'FIELD REPORTS', notifications: 'NOTIFICATIONS',
    history: 'TASK HISTORY', performance: 'PERFORMANCE', helpdesk: 'HELP DESK',
    profile: 'PROFILE & SETTINGS',
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage tasks={tasks} workers={workers} onNavigate={setPage} />;
      case 'map': return (
        <div>
          <div className="rp-page-header"><div className="rp-section-title">LIVE TASK MAP</div></div>
          <div className="rp-card" style={{ height: '500px' }}><MapView /></div>
        </div>
      );
      case 'tasks': return <TasksPage tasks={tasks} workers={workers} onTaskUpdate={handleTaskUpdate} />;
      case 'workers': return <WorkersPage workers={workers} onAddWorker={addWorker} onRemoveWorker={removeWorker} />;
      case 'fieldreports': return <FieldReportsPage tasks={tasks} />;
      case 'notifications': return <NotifPage notifs={notifs} setNotifs={setNotifs} />;
      case 'history': return <HistoryPage tasks={tasks} />;
      case 'performance': return <PerformancePage />;
      case 'helpdesk': return <HelpDeskPage />;
      case 'profile': return <ProfilePage online={online} setOnline={setOnline} />;
      default: return <DashboardPage tasks={tasks} workers={workers} onNavigate={setPage} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`rp-root ${disaster ? 'disaster' : ''}`}>
        <div className="rp-scanlines" />

        {/* Sidebar */}
        <aside className="rp-sidebar">
          <div className="rp-logo">
            <div className="rp-logo-name">NeXora</div>
            <div className="rp-logo-sub">RESPONDER PORTAL</div>
          </div>
          <div className="rp-dept-card">
            <div className="rp-dept-label">DEPARTMENT</div>
            <div className="rp-dept-name">K-ELECTRIC KORANGI</div>
            <div className="rp-dept-person">⚡ Ahmed Raza — Focal Person</div>
            <div className="rp-online-badge">
              <div className="rp-online-dot" />
              {online ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>
          <nav className="rp-nav">
            <div className="rp-nav-section">OPERATIONS</div>
            {navItems.slice(0, 5).map(item => (
              <button key={item.id} className={`rp-nav-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
                <span className="rp-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className={`rp-badge ${item.badgeType === 'alert' ? 'rp-alert-badge' : ''}`}>{item.badge}</span>}
              </button>
            ))}
            <div className="rp-nav-section">MANAGEMENT</div>
            {navItems.slice(5).map(item => (
              <button key={item.id} className={`rp-nav-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
                <span className="rp-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className={`rp-badge ${item.badgeType === 'alert' ? 'rp-alert-badge' : ''}`}>{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="rp-sidebar-footer">
            <button className={`rp-avail-toggle ${online ? 'online' : ''}`} onClick={() => setOnline(o => !o)}>
              <div className="dot" />
              {online ? '🟢 AVAILABLE' : '🔴 OFFLINE'}
            </button>
            <button className={`rp-disaster-toggle ${disaster ? 'active' : ''}`} onClick={() => setDisaster(d => !d)}>
              <div className="dot" />
              {disaster ? '⚠ DISASTER MODE ON' : 'DISASTER MODE OFF'}
            </button>
            <button className="rp-logout-btn">⏻ LOGOUT</button>
          </div>
        </aside>

        {/* Main */}
        <main className="rp-main">
          {disaster && (
            <div className="rp-disaster-banner">
              <div className="rp-marquee-text">
                ⚠ DISASTER MODE — FLOOD ALERT KORANGI &nbsp;•&nbsp; PRIORITIZE RESCUE TASKS &nbsp;•&nbsp; 3 CRITICAL TASKS AWAITING &nbsp;•&nbsp; COORDINATE WITH NGOs &nbsp;•&nbsp;
                ⚠ DISASTER MODE — FLOOD ALERT KORANGI &nbsp;•&nbsp; PRIORITIZE RESCUE TASKS &nbsp;•&nbsp; 3 CRITICAL TASKS AWAITING &nbsp;•&nbsp; COORDINATE WITH NGOs &nbsp;•&nbsp;
              </div>
            </div>
          )}
          <header className="rp-topbar">
            <div className="rp-page-title">{pageTitles[page] || 'DASHBOARD'}</div>
            <div className="rp-topbar-actions">
              {pendingCount > 0 && (
                <div style={{ fontSize: '11px', color: '#f87171', border: '1px solid rgba(255,68,68,0.3)', padding: '4px 10px', borderRadius: '4px', background: 'rgba(255,68,68,0.1)', letterSpacing: '1px', animation: 'urgent-pulse 2s infinite' }}>
                  🔴 {pendingCount} TASK{pendingCount > 1 ? 'S' : ''} PENDING
                </div>
              )}
              <button className="rp-icon-btn" onClick={() => setPage('notifications')} style={{ position: 'relative' }}>
                🔔
                {unreadNotifs > 0 && <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: '#ff4444', boxShadow: '0 0 5px #ff4444' }} />}
              </button>
            </div>
          </header>
          <div className="rp-content">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
