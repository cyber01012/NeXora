import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function ClaudeSidebar({ 
  title, 
  user, 
  navItems, 
  footerActions = [],
  disasterMode = false,
  onDisasterToggle,
  onLogout
}) {
  const [isDisaster, setIsDisaster] = useState(disasterMode);

  const handleDisasterToggle = () => {
    const newState = !isDisaster;
    setIsDisaster(newState);
    onDisasterToggle?.(newState);
  };

  return (
    <aside className="claude-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-name">NeXora</div>
        <div className="sidebar-logo-sub">{title}</div>
      </div>

      {/* User Card */}
      {user && (
        <div className="sidebar-user-card">
          <div className="sidebar-avatar">{user.avatar || user.name?.charAt(0) || 'U'}</div>
          <div>
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.role}</div>
            {user.status && (
              <div className={`sidebar-user-status ${user.status === 'online' ? 'online' : 'offline'}`}>
                {user.status === 'online' ? '🟢 ONLINE' : '🔴 OFFLINE'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((section, idx) => (
          <div key={idx}>
            {section.title && <div className="sidebar-nav-section">{section.title}</div>}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                end={item.end}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {footerActions?.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`sidebar-footer-btn ${action.className || ''}`}
          >
            {action.icon && <span className="sidebar-footer-icon">{action.icon}</span>}
            <span>{action.label}</span>
          </button>
        ))}
        
        {/* Disaster Mode Toggle */}
        <button 
          className={`sidebar-disaster-toggle ${isDisaster ? 'active' : ''}`}
          onClick={handleDisasterToggle}
        >
          <div className="sidebar-toggle-dot" />
          {isDisaster ? '⚠ DISASTER MODE ON' : 'DISASTER MODE OFF'}
        </button>

        {/* Logout Button */}
        <button className="sidebar-logout-btn" onClick={onLogout}>
          ⏻ LOGOUT
        </button>
      </div>

      <style>{`
        .claude-sidebar {
          width: 260px;
          min-height: 100vh;
          background: var(--bg2, #050916);
          border-right: 1px solid rgba(0, 240, 255, 0.3);
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 10;
          flex-shrink: 0;
        }

        .sidebar-logo { padding: 24px 20px 16px; border-bottom: 1px solid rgba(0, 240, 255, 0.15); }
        .sidebar-logo-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 22px; font-weight: 900;
          color: var(--glow, #00f0ff);
          text-shadow: 0 0 12px var(--glow, #00f0ff);
          letter-spacing: 3px;
        }
        .sidebar-logo-sub { font-size: 9px; color: rgba(224, 248, 255, 0.55); letter-spacing: 2px; margin-top: 3px; }

        .sidebar-user-card {
          margin: 16px 14px;
          background: rgba(10, 22, 40, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sidebar-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--glow, #00f0ff) 0%, transparent 100%);
          border: 1px solid rgba(0, 240, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Orbitron', sans-serif;
          font-size: 14px; font-weight: 700;
          color: var(--glow, #00f0ff);
          text-shadow: 0 0 8px var(--glow, #00f0ff);
          flex-shrink: 0;
        }
        .sidebar-user-name { font-size: 13px; font-weight: 500; color: #e0f8ff; }
        .sidebar-user-role { font-size: 9px; color: rgba(224, 248, 255, 0.55); letter-spacing: 1px; margin-top: 2px; }
        .sidebar-user-status { font-size: 8px; margin-top: 3px; letter-spacing: 1px; }
        .sidebar-user-status.online { color: #4ade80; }
        .sidebar-user-status.offline { color: #6b7280; }

        .sidebar-nav { flex: 1; overflow-y: auto; padding: 12px 0; }
        .sidebar-nav-section {
          font-size: 9px;
          color: rgba(224, 248, 255, 0.45);
          letter-spacing: 2px;
          padding: 12px 16px 4px;
        }
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          font-size: 12px;
          letter-spacing: 0.5px;
          color: rgba(224, 248, 255, 0.55);
          text-decoration: none;
          width: 100%;
          text-align: left;
        }
        .sidebar-nav-item:hover { color: #e0f8ff; background: rgba(0, 240, 255, 0.07); }
        .sidebar-nav-item.active {
          color: var(--glow, #00f0ff);
          background: rgba(0, 240, 255, 0.12);
          text-shadow: 0 0 8px var(--glow, #00f0ff);
        }
        .sidebar-nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--glow, #00f0ff);
          box-shadow: 0 0 8px var(--glow, #00f0ff);
          border-radius: 0 2px 2px 0;
        }
        .sidebar-nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .sidebar-badge {
          margin-left: auto;
          background: var(--glow, #00f0ff);
          color: #050916;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .sidebar-footer { padding: 14px; border-top: 1px solid rgba(0, 240, 255, 0.15); }
        .sidebar-footer-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: rgba(10, 22, 40, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 7px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: rgba(224, 248, 255, 0.55);
          letter-spacing: 1px;
          transition: all 0.25s;
          margin-bottom: 8px;
        }
        .sidebar-footer-btn:hover { border-color: rgba(0, 240, 255, 0.5); color: #e0f8ff; }
        .sidebar-footer-icon { font-size: 14px; }

        .sidebar-disaster-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: rgba(10, 22, 40, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 7px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: rgba(224, 248, 255, 0.55);
          letter-spacing: 1px;
          transition: all 0.25s;
          margin-bottom: 8px;
        }
        .sidebar-disaster-toggle.active {
          border-color: #ff2a2a;
          color: #ff2a2a;
          background: rgba(255, 42, 42, 0.1);
          text-shadow: 0 0 6px #ff2a2a;
          box-shadow: 0 0 12px rgba(255, 42, 42, 0.2);
        }
        .sidebar-toggle-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(224, 248, 255, 0.55);
          flex-shrink: 0;
          transition: background 0.25s;
        }
        .sidebar-disaster-toggle.active .sidebar-toggle-dot { background: #ff2a2a; box-shadow: 0 0 6px #ff2a2a; }

        .sidebar-logout-btn {
          width: 100%;
          padding: 8px 12px;
          background: transparent;
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 7px;
          color: rgba(224, 248, 255, 0.55);
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 4px;
        }
        .sidebar-logout-btn:hover { border-color: #ff4444; color: #ff4444; }

        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(0, 240, 255, 0.3); border-radius: 2px; }
      `}</style>
    </aside>
  );
}