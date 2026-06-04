import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

import LandingPage from './pages/LandingPage';
import NotificationsPage from './pages/NotificationsPage';
import PulseOrb from './components/civic-pulse/PulseOrb';
import AuthPage from './components/auth/AuthPage';
import { AuthWindow } from './components/auth/AuthWindow';
import { AdminDashboard } from './components/portals/AdminDashboard';
import { NGODashboard } from './components/portals/NGODashboard';
import { ResponderDashboard } from './components/portals/ResponderDashboard';

import { DisasterProvider } from './context/DisasterContext';
import { NotificationProvider } from './components/notifications/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const handleAuthSuccess = () => {
    setAuthOpen(false);
  };

  const renderContent = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <LandingPage onOpenAuth={() => setAuthOpen(true)} />
          <PulseOrb />
        </>
      );
    }

    switch (user.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'NGO':
        return <NGODashboard />;
      case 'RESPONDER':
        return <ResponderDashboard />;
      default:
        return (
          <>
            <LandingPage onOpenAuth={() => setAuthOpen(true)} />
            <PulseOrb />
          </>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-hud-bg)] text-white transition-colors duration-1000 relative">
      <Routes>
        <Route path="/" element={renderContent()} />
        <Route path="/notifications" element={<NotificationsPage role="CITIZEN" />} />
      </Routes>
      
      <AnimatePresence>
        {authOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-[680px]">
              <AuthWindow onClose={() => setAuthOpen(false)}>
                <AuthPage onSuccess={handleAuthSuccess} />
              </AuthWindow>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DisasterProvider>
          <BrowserRouter>
            <AppContent />
            <Toaster richColors position="top-center" />
          </BrowserRouter>
        </DisasterProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
