import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import CitizenLayout from '../layouts/CitizenLayout';
import ResponderLayout from '../layouts/ResponderLayout';

// Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import CitizenReportForm from '../pages/citizen/CitizenReportForm';
import CitizenReports from '../pages/citizen/CitizenReports';
import CitizenSavedLocations from '../pages/citizen/CitizenSavedLocations';
import CitizenHelpDesk from '../pages/citizen/CitizenHelpDesk';
import CitizenProfile from '../pages/citizen/CitizenProfile';  
import CitizenStats from '../pages/citizen/CitizenStats';
import CitizenFAQ from '../pages/citizen/CitizenFAQ';

// Responder Pages
import ResponderDashboard from '../pages/responder/ResponderDashboard';
import ResponderTasks from '../pages/responder/ResponderTasks';
import ResponderWorkers from '../pages/responder/ResponderWorkers';
import ResponderTaskHistory from '../pages/responder/ResponderTaskHistory';
import ResponderFieldReports from '../pages/responder/ResponderFieldReports';
import ResponderHelpDesk from '../pages/responder/ResponderHelpDesk';
import ResponderProfile from '../pages/responder/ResponderProfile';
import ResponderPerformance from '../pages/responder/ResponderPerformance';
import ResponderFAQ from '../pages/responder/ResponderFAQ';

// Admin pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';

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
          <Route path="locations" element={<CitizenSavedLocations />} />
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
          <Route path="fieldreports" element={<ResponderFieldReports />} />
          <Route path="helpdesk" element={<ResponderHelpDesk />} />
          <Route path="profile" element={<ResponderProfile />} />
          <Route path="performance" element={<ResponderPerformance />} />
          <Route path="faq" element={<ResponderFAQ />} />
        </Route>

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}