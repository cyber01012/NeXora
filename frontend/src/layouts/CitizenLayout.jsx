import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PortalSidebar from '../components/layout/PortalSidebar';

const navItems = [
  { to: '/citizen', label: 'DASHBOARD', icon: '▣', end: true },
  { to: '/citizen/report', label: 'REPORT ISSUE', icon: '📝' },
  { to: '/citizen/reports', label: 'MY REPORTS', icon: '📋' },
  { to: '/citizen/map', label: 'LIVE MAP', icon: '🗺️' },
  { to: '/citizen/locations', label: 'SAVED LOCATIONS', icon: '📍' },
  { to: '/citizen/notifications', label: 'NOTIFICATIONS', icon: '🔔' },
  { to: '/citizen/helpdesk', label: 'HELP DESK', icon: '💬' },
  { to: '/citizen/profile', label: 'PROFILE', icon: '👤' },
  { to: '/citizen/stats', label: 'MY STATS', icon: '📊' },
  { to: '/citizen/faq', label: 'FAQ', icon: '❓' },
];

export default function CitizenLayout() {
  const navigate = useNavigate();
  const [disasterMode, setDisasterMode] = useState(false);

  useEffect(() => {
    fetch('/api/disaster-mode/status')
      .then(res => res.json())
      .catch(() => ({ active: false }))
      .then(data => setDisasterMode(data.active));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nexora_citizen_id');
    navigate('/');
  };

  const handleDisasterToggle = (mode) => {
    setDisasterMode(mode);
    if (mode) document.body.classList.add('disaster-mode');
    else document.body.classList.remove('disaster-mode');
  };

  return (
    <div className="flex min-h-screen">
      <PortalSidebar
        title="CITIZEN PORTAL"
        user={{ name: 'Ali Raza', role: 'CITIZEN', avatar: 'AR' }}
        navItems={[{ items: navItems }]}
        onLogout={handleLogout}
        disasterMode={disasterMode}
        onDisasterToggle={handleDisasterToggle}
      />
      {/* ✅ FIX: Add margin-left equal to sidebar width */}
      <main className="flex-1 min-h-screen overflow-auto bg-[var(--bg)]" style={{ marginLeft: '260px' }}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}