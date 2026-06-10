import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import NotificationBell from '../notifications/NotificationBell';
import NotificationPanel from '../notifications/NotificationPanel';

export default function PortalSidebar({ title, user, navItems, onLogout, disasterMode, onDisasterToggle, notificationRole }) {
  const [isDisaster, setIsDisaster] = useState(disasterMode || false);

  const handleDisasterToggle = () => {
    const newState = !isDisaster;
    setIsDisaster(newState);
    onDisasterToggle?.(newState);
  };

  return (
    <aside className="portal-sidebar">
      {/* Logo */}
      <div className="ps-logo">
        <div className="ps-logo-name">NeXora</div>
        <div className="ps-logo-sub">{title}</div>
      </div>

      {/* User Card */}
      {user && (
        <div className="ps-user-card relative">
          <div className="ps-avatar">{user.avatar || user.name?.charAt(0) || 'U'}</div>
          <div className="ps-user-info flex-1">
            <div className="ps-user-name">{user.name}</div>
            <div className="ps-user-role">
              {user.role === "NGO"
                ? "NGO RESPONDER"
                : user.role === "RESPONDER"
                ? "GOVERNMENT RESPONDER"
                : user.role}
            </div>
          </div>
          {notificationRole && (
            <div className="relative flex-shrink-0">
              <NotificationBell />
              <NotificationPanel role={notificationRole} placement="right" />
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="ps-nav">
        {navItems.map((section, idx) => (
          <div key={idx}>
            {section.title && <div className="ps-nav-section">{section.title}</div>}
            {section.items.map((item) => (
              item.onClick ? (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="ps-nav-item ps-nav-action"
                >
                  <span className="ps-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `ps-nav-item ${isActive ? 'active' : ''}`}
                  end={item.end}
                >
                  <span className="ps-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && <span className="ps-badge">{item.badge}</span>}
                </NavLink>
              )
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="ps-footer">
        <button className={`ps-disaster-toggle ${isDisaster ? 'active' : ''}`} onClick={handleDisasterToggle}>
          <div className="ps-toggle-dot" />
          {isDisaster ? '⚠ DISASTER MODE ON' : 'DISASTER MODE OFF'}
        </button>
        <button className="ps-logout-btn" onClick={onLogout}>⏻ LOGOUT</button>
      </div>

      <style>{`
        .portal-sidebar {
          width: 260px;
          min-height: 100vh;
          background: #050916;
          border-right: 1px solid rgba(0, 240, 255, 0.3);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 100;
          flex-shrink: 0;
        }

        .ps-logo { padding: 24px 20px 16px; border-bottom: 1px solid rgba(0, 240, 255, 0.15); }
        .ps-logo-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: #00f0ff;
          text-shadow: 0 0 12px #00f0ff;
          letter-spacing: 3px;
        }
        .ps-logo-sub { font-size: 9px; color: rgba(224, 248, 255, 0.55); letter-spacing: 2px; margin-top: 3px; }

        .ps-user-card {
          margin: 16px 14px;
          background: rgba(10, 22, 40, 0.8);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ps-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00f0ff 0%, transparent 100%);
          border: 1px solid rgba(0, 240, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #00f0ff;
          text-shadow: 0 0 8px #00f0ff;
          flex-shrink: 0;
        }
        .ps-user-name { font-size: 13px; font-weight: 500; color: #e0f8ff; }
        .ps-user-role { font-size: 9px; color: rgba(224, 248, 255, 0.55); letter-spacing: 1px; margin-top: 2px; }

        .ps-nav { flex: 1; overflow-y: auto; padding: 8px 0; }
        .ps-nav-section {
          font-size: 9px;
          color: rgba(224, 248, 255, 0.45);
          letter-spacing: 2px;
          padding: 12px 16px 4px;
        }
        .ps-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          transition: all 0.2s;
          position: relative;
          font-size: 12px;
          letter-spacing: 0.5px;
          color: rgba(224, 248, 255, 0.55);
          text-decoration: none;
          width: 100%;
          text-align: left;
        }
        .ps-nav-item:hover { color: #e0f8ff; background: rgba(0, 240, 255, 0.07); }
        .ps-nav-item.active {
          color: #00f0ff;
          background: rgba(0, 240, 255, 0.12);
          text-shadow: 0 0 8px #00f0ff;
        }
        .ps-nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: #00f0ff;
          box-shadow: 0 0 8px #00f0ff;
          border-radius: 0 2px 2px 0;
        }
        .ps-nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .ps-nav-action {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .ps-nav-action:hover { color: #e0f8ff; background: rgba(0, 240, 255, 0.07); }
        .ps-badge {
          margin-left: auto;
          background: #00f0ff;
          color: #050916;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .ps-footer { padding: 14px; border-top: 1px solid rgba(0, 240, 255, 0.15); }
        .ps-disaster-toggle {
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
        .ps-disaster-toggle.active {
          border-color: #ff2a2a;
          color: #ff2a2a;
          background: rgba(255, 42, 42, 0.1);
          text-shadow: 0 0 6px #ff2a2a;
          box-shadow: 0 0 12px rgba(255, 42, 42, 0.2);
        }
        .ps-toggle-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(224, 248, 255, 0.55);
          flex-shrink: 0;
          transition: background 0.25s;
        }
        .ps-disaster-toggle.active .ps-toggle-dot { background: #ff2a2a; box-shadow: 0 0 6px #ff2a2a; }

        .ps-logout-btn {
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
        }
        .ps-logout-btn:hover { border-color: #ff4444; color: #ff4444; }

        .ps-nav::-webkit-scrollbar { width: 3px; }
        .ps-nav::-webkit-scrollbar-track { background: transparent; }
        .ps-nav::-webkit-scrollbar-thumb { background: rgba(0, 240, 255, 0.3); border-radius: 2px; }
      `}</style>
    </aside>
  );
}