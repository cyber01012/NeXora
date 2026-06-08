import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WorkerLayout from '../layouts/WorkerLayout';

// Worker Pages
import WorkerDashboard from '../pages/worker/WorkerDashboard';
import WorkerTasks from '../pages/worker/WorkerTasks';
import WorkerHistory from '../pages/worker/WorkerHistory';
import WorkerOnboarding from '../pages/worker/WorkerOnboarding';
import WorkerProfile from '../pages/worker/WorkerProfile';
import WorkerFAQ from '../pages/worker/WorkerFAQ';

import WorkerHelpDesk from '../pages/worker/WorkerHelpDesk';

import WorkerPerformance from '../pages/worker/WorkerPerformance';

export default function PortalRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Worker Portal */}
        <Route path="/worker" element={<WorkerLayout />}>
          <Route index element={<WorkerDashboard />} />
          <Route path="tasks" element={<WorkerTasks />} />
          <Route path="history" element={<WorkerHistory />} />
          <Route path="helpdesk" element={<WorkerHelpDesk />} />
          <Route path="onboarding" element={<WorkerOnboarding />} />
          <Route path="profile" element={<WorkerProfile />} />
          <Route path="faq" element={<WorkerFAQ />} />
          <Route path="performance" element={<WorkerPerformance />} />
        </Route>

        <Route path="*" element={<Navigate to="/worker" replace />} />
      </Routes>
    </BrowserRouter>
  );
}