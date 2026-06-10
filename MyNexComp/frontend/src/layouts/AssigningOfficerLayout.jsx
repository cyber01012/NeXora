import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PortalSidebar from '../components/layout/PortalSidebar';
import { useAuth, getApiErrorMessage } from '../context/AuthContext';
import { AuthModalCard } from '../components/auth/AuthModalCard';
import { ChangePasswordForm } from '../components/auth/ChangePasswordForm';
import { authApi } from '../api/authApi';
import { toast } from 'sonner';

const navItems = [
  { to: '/assigning-officer', label: 'DASHBOARD', icon: '▣', end: true },
  { to: '/assigning-officer/dispatch', label: 'DISPATCH', icon: '📥' },
  { to: '/assigning-officer/tracker', label: 'TRACKER', icon: '📡' },
  { to: '/assigning-officer/departments', label: 'DEPARTMENTS', icon: '🏢' },
  { to: '/assigning-officer/history', label: 'HISTORY', icon: '📜' },
  { to: '/assigning-officer/profile', label: 'PROFILE', icon: '👤' },
];

export default function AssigningOfficerLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [disasterMode, setDisasterMode] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/disaster-mode/status')
      .then(res => res.json())
      .catch(() => ({ active: false }))
      .then(data => setDisasterMode(data.active));
  }, []);

  const userData = {
    name: user?.displayName || 'Assigning Officer',
    role: 'ASSIGNING OFFICER',
    avatar: (user?.displayName || 'A').charAt(0).toUpperCase(),
  };

  const handleLogoutOthers = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await authApi.logoutOthers(refreshToken);
      toast.success(response.message);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Failed to logout other devices.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
    } catch (e) {
      console.error(e);
      toast.error('Failed to logout.');
    }
    navigate('/');
  };

  const handleDisasterToggle = (mode) => {
    setDisasterMode(mode);
    if (mode) document.body.classList.add('disaster-mode');
    else document.body.classList.remove('disaster-mode');
  };

  const sidebarNavItems = [
    {
      items: navItems
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'CHANGE PASSWORD', icon: '🔐', onClick: () => setActiveModal('change-password') },
        { label: 'LOGOUT OTHERS', icon: '📵', onClick: handleLogoutOthers },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <PortalSidebar
        title="ASSIGNING OFFICER"
        user={userData}
        navItems={sidebarNavItems}
        onLogout={handleLogout}
        disasterMode={disasterMode}
        onDisasterToggle={handleDisasterToggle}
        notificationRole="ASSIGNING_OFFICER"
      />
      <main className="flex-1 min-h-screen overflow-auto relative" style={{ marginLeft: '260px' }}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Change Password Modal */}
      {activeModal === 'change-password' && (
        <AuthModalCard
          title="Change Password"
          onClose={() => setActiveModal(null)}
        >
          <ChangePasswordForm
            onSuccess={() => setActiveModal(null)}
          />
        </AuthModalCard>
      )}
    </div>
  );
}
