import React from 'react';
import PortalRoutes from './routes/PortalRoutes';
import { DisasterProvider } from './context/DisasterContext';

function App() {
  return (
    <DisasterProvider>
      <div className="w-full min-h-screen bg-[var(--color-hud-bg)] text-white transition-colors duration-1000">
        <PortalRoutes />
      </div>
    </DisasterProvider>
  );
}

export default App;
