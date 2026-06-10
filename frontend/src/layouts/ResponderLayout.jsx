import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PortalSidebar from '../components/layout/PortalSidebar';
import { responderApi } from '../services/api';


const navItems = [
  { to: '/responder', label: 'DASHBOARD', icon: '▣', end: true },
  { to: '/responder/tasks', label: 'TASKS', icon: '📋' },
  { to: '/responder/workers', label: 'WORKERS', icon: '👥' },
  // { to: '/responder/history', label: 'TASK HISTORY', icon: '📜' },
  // { to: '/responder/map', label: 'LIVE MAP', icon: '🗺️' },
  { to: '/responder/fieldreports', label: 'FIELD REPORTS', icon: '📝' },
  // { to: '/responder/notifications', label: 'NOTIFICATIONS', icon: '🔔' },
  { to: '/responder/helpdesk', label: 'HELP DESK', icon: '💬' },
  { to: '/responder/performance', label: 'PERFORMANCE', icon: '📈' },
  { to: '/responder/profile', label: 'PROFILE', icon: '👤' },
  { to: '/responder/faq', label: 'FAQ', icon: '❓' },
];

export default function ResponderLayout() {
  const navigate = useNavigate();
  const [disasterMode, setDisasterMode] = useState(false);
  const [userData, setUserData] = useState({ name: 'Loading...', role: 'FOCAL PERSON', avatar: '?' });

  useEffect(() => {
    fetch('/api/disaster-mode/status')
      .then(res => res.json())
      .catch(() => ({ active: false }))
      .then(data => setDisasterMode(data.active));

    responderApi.getProfile()
      .then(profile => {
        const name = profile.name || profile.fullName || profile.username || 'Responder';
        const roleStr = profile.department?.deptName ? `${profile.department.deptName} · FOCAL PERSON` : 'FOCAL PERSON';
        setUserData({
          name: name,
          role: roleStr,
          avatar: name.charAt(0).toUpperCase()
        });
      })
      .catch(err => console.error('Failed to load responder profile:', err));
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
        user={userData}
        navItems={[{ items: navItems }]}
        onLogout={handleLogout}
        disasterMode={disasterMode}
        onDisasterToggle={handleDisasterToggle}
        notificationRole="RESPONDER"
      />
      <main className="flex-1 min-h-screen overflow-auto bg-[var(--bg)] relative" style={{ marginLeft: '260px' }}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}