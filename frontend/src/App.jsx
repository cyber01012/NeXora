import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NotificationsPage from './pages/NotificationsPage';
import { DisasterProvider } from './context/DisasterContext';
import { NotificationProvider } from './components/notifications/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <DisasterProvider>
        <BrowserRouter>
          <div className="w-full min-h-screen bg-[var(--color-hud-bg)] text-white transition-colors duration-1000">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/notifications" element={<NotificationsPage role="CITIZEN" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DisasterProvider>
    </NotificationProvider>
  );
}

export default App;
