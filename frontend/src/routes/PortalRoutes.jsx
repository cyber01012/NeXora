import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import CitizenLayout from '../layouts/CitizenLayout';
import ResponderLayout from '../layouts/ResponderLayout';

// Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import CitizenReportForm from '../pages/citizen/CitizenReportForm';
import CitizenReports from '../pages/citizen/CitizenReports';
import CitizenLiveMap from '../pages/citizen/CitizenLiveMap';
import CitizenSavedLocations from '../pages/citizen/CitizenSavedLocations';
import CitizenNotifications from '../pages/citizen/CitizenNotifications';
import CitizenHelpDesk from '../pages/citizen/CitizenHelpDesk';
import CitizenProfile from '../pages/citizen/CitizenProfile';  
import CitizenStats from '../pages/citizen/CitizenStats';
import CitizenFAQ from '../pages/citizen/CitizenFAQ';

// Responder Pages
import ResponderDashboard from '../pages/responder/ResponderDashboard';
import ResponderTasks from '../pages/responder/ResponderTasks';
import ResponderWorkers from '../pages/responder/ResponderWorkers';
import ResponderTaskHistory from '../pages/responder/ResponderTaskHistory';
import ResponderLiveMap from '../pages/responder/ResponderLiveMap';
import ResponderFieldReports from '../pages/responder/ResponderFieldReports';  // ✅ ADD THIS
import ResponderNotifications from '../pages/responder/ResponderNotifications';  // ✅ ADD THIS
import ResponderHelpDesk from '../pages/responder/ResponderHelpDesk';
import ResponderProfile from '../pages/responder/ResponderProfile';
import ResponderPerformance from '../pages/responder/ResponderPerformance';
import ResponderFAQ from '../pages/responder/ResponderFAQ';

export default function PortalRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Citizen Portal */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<CitizenDashboard />} />
          <Route path="report" element={<CitizenReportForm />} />
          <Route path="reports" element={<CitizenReports />} />
          <Route path="map" element={<CitizenLiveMap />} />
          <Route path="locations" element={<CitizenSavedLocations />} />
          <Route path="notifications" element={<CitizenNotifications />} />
          <Route path="helpdesk" element={<CitizenHelpDesk />} />
          <Route path="profile" element={<CitizenProfile />} />
          <Route path="stats" element={<CitizenStats />} /> 
          <Route path="faq" element={<CitizenFAQ />} />
        </Route>

        {/* Responder Portal */}
        <Route path="/responder" element={<ResponderLayout />}>
          <Route index element={<ResponderDashboard />} />
          <Route path="tasks" element={<ResponderTasks />} />
          <Route path="workers" element={<ResponderWorkers />} />
          <Route path="history" element={<ResponderTaskHistory />} />
          <Route path="map" element={<ResponderLiveMap />} />
          <Route path="fieldreports" element={<ResponderFieldReports />} />  {/* ✅ ADDED */}
          <Route path="notifications" element={<ResponderNotifications />} />  {/* ✅ ADDED */}
          <Route path="helpdesk" element={<ResponderHelpDesk />} />
          <Route path="profile" element={<ResponderProfile />} />
          <Route path="performance" element={<ResponderPerformance />} />
          <Route path="faq" element={<ResponderFAQ />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}