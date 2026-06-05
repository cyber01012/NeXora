import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PortalSidebar from '../components/layout/PortalSidebar';

const navItems = [
  { to: '/responder', label: 'DASHBOARD', icon: '▣', end: true },
  { to: '/responder/tasks', label: 'TASKS', icon: '📋' },
  { to: '/responder/workers', label: 'WORKERS', icon: '👥' },
  { to: '/responder/history', label: 'TASK HISTORY', icon: '📜' },
  { to: '/responder/map', label: 'LIVE MAP', icon: '🗺️' },
  { to: '/responder/fieldreports', label: 'FIELD REPORTS', icon: '📝' },
  { to: '/responder/notifications', label: 'NOTIFICATIONS', icon: '🔔' },
  { to: '/responder/helpdesk', label: 'HELP DESK', icon: '💬' },
  { to: '/responder/performance', label: 'PERFORMANCE', icon: '📈' },
  { to: '/responder/profile', label: 'PROFILE', icon: '👤' },
  { to: '/responder/faq', label: 'FAQ', icon: '❓' },
];

export default function ResponderLayout() {
  const navigate = useNavigate();
  const [disasterMode, setDisasterMode] = useState(false);

  useEffect(() => {
    fetch('/api/disaster-mode/status')
      .then(res => res.json())
      .catch(() => ({ active: false }))
      .then(data => setDisasterMode(data.active));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nexora_responder_username');
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
        title="RESPONDER PORTAL"
        user={{ name: 'Ahmed Raza', role: 'K-ELECTRIC · FOCAL PERSON', avatar: 'AR' }}
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