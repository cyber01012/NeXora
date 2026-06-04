import React from 'react';
import LandingPage from './pages/LandingPage';
import { DisasterProvider } from './context/DisasterContext';
import PulseOrb from './components/civic-pulse/PulseOrb';


function App() {
  return (
    <DisasterProvider>
      <div className="w-full min-h-screen bg-[var(--color-hud-bg)] text-white transition-colors duration-1000">
        <LandingPage />
        <PulseOrb />
      </div>
    </DisasterProvider>
  );
}

export default App;
