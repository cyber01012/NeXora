import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { Navigate } from "react-router-dom";

import LandingPage from './pages/LandingPage';
import NotificationsPage from './pages/NotificationsPage';
import PulseOrb from './components/civic-pulse/PulseOrb';
import AuthPage from './components/auth/AuthPage';
import { AuthWindow } from './components/auth/AuthWindow';

import { DisasterProvider } from './context/DisasterContext';
import { NotificationProvider } from './components/notifications/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NGODashboard } from './components/portals/NGODashboard';

import AdminLayout from './layouts/AdminLayout';
import CitizenLayout from '../src/layouts/CitizenLayout';
import ResponderLayout from '../src/layouts/ResponderLayout';
import HelpDeskLayout from './layouts/HelpDeskLayout';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminHeatmap from './pages/admin/AdminHeatmap';
import AdminProfile from './pages/admin/AdminProfile';
import AdminFAQ from './pages/admin/AdminFAQ';

// Citizen Pages
import CitizenDashboard from '../src/pages/citizen/CitizenDashboard';
import CitizenReportForm from '../src/pages/citizen/CitizenReportForm';
import CitizenReports from '../src/pages/citizen/CitizenReports';
import CitizenSavedLocations from '../src/pages/citizen/CitizenSavedLocations';
import CitizenHelpDesk from '../src/pages/citizen/CitizenHelpDesk';
import CitizenProfile from '../src/pages/citizen/CitizenProfile';  
import CitizenStats from '../src/pages/citizen/CitizenStats';
import CitizenFAQ from '../src/pages/citizen/CitizenFAQ';

// Responder Pages
import ResponderDashboard from '../src/pages/responder/ResponderDashboard';
import ResponderTasks from '../src/pages/responder/ResponderTasks';
import ResponderWorkers from '../src/pages/responder/ResponderWorkers';
import ResponderTaskHistory from '../src/pages/responder/ResponderTaskHistory';
import ResponderFieldReports from '../src/pages/responder/ResponderFieldReports';
import ResponderHelpDesk from '../src/pages/responder/ResponderHelpDesk';
import ResponderProfile from '../src/pages/responder/ResponderProfile';
import ResponderPerformance from '../src/pages/responder/ResponderPerformance';
import ResponderFAQ from '../src/pages/responder/ResponderFAQ';

// Help Desk Pages
import HelpDeskDashboard from '../src/pages/helpdesk/HelpDeskDashboard';
import CreateSOS from '../src/pages/helpdesk/HelpDeskSOS';

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
    return <Navigate to="/admin" replace />;

  case 'NGO':
  return <Navigate to="/responder" replace />;

  case 'RESPONDER':
    return <Navigate to="/responder" replace />;
    
  case 'HELP_DESK':
    return <Navigate to="/helpdesk" replace />;


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

  <Route
    path="/notifications"
    element={<NotificationsPage role="CITIZEN" />}
  />

          {/* ADMIN PORTAL */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="heatmap" element={<AdminHeatmap />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="faq" element={<AdminFAQ />} />
          </Route>

  {/* NGO */}
  <Route
    path="/ngo"
    element={<NGODashboard />}
  />

          {/* Responder Portal */}
          <Route path="/responder" element={<ResponderLayout />}>
            <Route index element={<ResponderDashboard />} />
            <Route path="tasks" element={<ResponderTasks />} />
            <Route path="workers" element={<ResponderWorkers />} />
            <Route path="history" element={<ResponderTaskHistory />} />
            <Route path="fieldreports" element={<ResponderFieldReports />} />
            <Route path="helpdesk" element={<ResponderHelpDesk />} />
            <Route path="profile" element={<ResponderProfile />} />
            <Route path="performance" element={<ResponderPerformance />} />
            <Route path="faq" element={<ResponderFAQ />} />
          </Route>

          {/* Help Desk Portal */}
          <Route path="/helpdesk" element={<HelpDeskLayout />}>
            <Route index element={<HelpDeskDashboard />}/>
            <Route path="createsos" element={<CreateSOS />} />
          </Route>

                {/* Citizen Portal */}
                  <Route path="/citizen" element={<CitizenLayout />}>
                    <Route index element={<CitizenDashboard />} />
                    <Route path="report" element={<CitizenReportForm />} />
                    <Route path="reports" element={<CitizenReports />} />
                    <Route path="locations" element={<CitizenSavedLocations />} />
                    <Route path="helpdesk" element={<CitizenHelpDesk />} />
                    <Route path="profile" element={<CitizenProfile />} />
                    <Route path="stats" element={<CitizenStats />} /> 
                    <Route path="faq" element={<CitizenFAQ />} />
                  </Route>
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
