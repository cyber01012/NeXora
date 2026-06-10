import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PortalSidebar from '../components/layout/PortalSidebar';
import { workerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';


const navItems = [
  { to: '/worker', label: 'DASHBOARD', icon: '▣', end: true },
  { to: '/worker/tasks', label: 'TASKS', icon: '📋' },
  { to: '/worker/history', label: 'TASK HISTORY', icon: '📜' },
  { to: '/worker/helpdesk', label: 'SUPPORT', icon: '💬' },
  { to: '/worker/performance', label: 'PERFORMANCE', icon: '📈' },
  { to: '/worker/onboarding', label: 'ONBOARDING', icon: '🚀' },
  { to: '/worker/profile', label: 'PROFILE', icon: '👤' },
  { to: '/worker/faq', label: 'FAQ', icon: '❓' },
];

export default function WorkerLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [disasterMode, setDisasterMode] = useState(false);
  const [userData, setUserData] = useState({ name: 'Worker User', role: 'WORKER', avatar: 'W' });

  useEffect(() => {
    fetch('/api/disaster-mode/status')
      .then(res => res.json())
      .catch(() => ({ active: false }))
      .then(data => setDisasterMode(data.active));

    // Load real profile from backend
    workerApi.getProfile()
      .then(data => {
        setUserData({
          name: data.name || data.username || 'Worker',
          role: data.department ? `${data.department}` : 'WORKER',
          avatar: (data.name || 'W').charAt(0).toUpperCase()
        });
      })
      .catch(() => {
        const name = localStorage.getItem('nexora_worker_username') || 'Worker';
        setUserData({ name, role: 'WORKER', avatar: name.charAt(0).toUpperCase() });
      });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
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
        title="WORKER PORTAL"
        user={userData}
        navItems={[{ items: navItems }]}
        onLogout={handleLogout}
        disasterMode={disasterMode}
        onDisasterToggle={handleDisasterToggle}
      />
      <main className="flex-1 min-h-screen overflow-auto bg-[var(--bg)]" style={{ marginLeft: '260px' }}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
