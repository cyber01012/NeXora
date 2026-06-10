import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HUDCard from '../../components/ui/HUDCard';
import { workerApi } from '../../services/api.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MonthlyChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Tasks Completed',
      data: data.length === 12 ? data : new Array(12).fill(0),
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#06b6d4',
      pointBorderColor: '#fff',
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBorderWidth: 2,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1500, easing: 'easeInOutQuart' },
    plugins: {
      legend: { position: 'top', labels: { color: '#e0f8ff', font: { size: 10, family: 'Orbitron' } } },
      tooltip: { backgroundColor: '#0a1628', titleColor: '#00f0ff', bodyColor: '#e0f8ff', borderColor: '#06b6d4', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#8899aa', font: { size: 9 } }, grid: { color: 'rgba(6, 182, 212, 0.1)' } },
      y: { ticks: { color: '#8899aa', font: { size: 9 } }, grid: { color: 'rgba(6, 182, 212, 0.1)' } },
    },
  };
  return <Line data={chartData} options={options} />;
};

const StatCard = ({ label, value, color, icon, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-4 text-center transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] group ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex items-center justify-center mb-2">
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    </div>
    <p className="font-data text-3xl mt-1" style={{ textShadow: `0 0 10px ${color}`, color }}>{value}</p>
    <p className="font-mono text-[9px] text-cyan-400/60 mt-1 tracking-wider uppercase">{label}</p>
  </div>
);

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    workerApi.dashboard()
      .then(data => setDashboard(data))
      .catch(err => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING DASHBOARD... ]</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="font-mono text-red-400 text-center">
          <p className="text-xl mb-2">⚠ CONNECTION ERROR</p>
          <p className="text-sm text-red-400/70">{error}</p>
          <p className="text-xs text-cyan-400/50 mt-2">Make sure the backend is running on port 8080</p>
          <button
            onClick={() => { setLoading(true); setError(null); workerApi.dashboard().then(setDashboard).catch(e => setError(e.message)).finally(() => setLoading(false)); }}
            className="mt-4 px-4 py-2 border border-cyan-400 rounded-lg font-mono text-sm text-cyan-400 hover:bg-cyan-500/10"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  const workerName = dashboard?.workerName || localStorage.getItem('nexora_worker_username') || 'Worker';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">WORKER DASHBOARD</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">
          Welcome, <span className="text-cyan-300">{workerName}</span>
          {dashboard?.department && <span className="text-cyan-500/40"> · {dashboard.department}</span>}
        </p>
      </div>

      {/* Stats Grid — real counts from backend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL ASSIGNED"
          value={dashboard?.totalAssigned ?? 0}
          color="#06b6d4"
          icon="📋"
          onClick={() => navigate('/worker/tasks')}
        />
        <StatCard
          label="PENDING ACCEPTANCE"
          value={dashboard?.pendingAcceptance ?? 0}
          color="#fbbf24"
          icon="⏳"
          onClick={() => navigate('/worker/tasks?status=PENDING_ACCEPTANCE')}
        />
        <StatCard
          label="IN PROGRESS"
          value={dashboard?.inProgress ?? 0}
          color="#60a5fa"
          icon="🔧"
          onClick={() => navigate('/worker/tasks?status=IN_PROGRESS')}
        />
        <StatCard
          label="COMPLETED"
          value={dashboard?.completed ?? 0}
          color="#4ade80"
          icon="✅"
          onClick={() => navigate('/worker/history')}
        />
      </div>

      {/* Performance Graph */}
      <HUDCard title="MONTHLY PERFORMANCE">
        <div className="h-64 w-full">
          <MonthlyChart data={dashboard?.monthlyCompleted || []} />
        </div>
      </HUDCard>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Task Status Breakdown */}
        <div className="lg:col-span-2">
          <HUDCard title="TASK STATUS BREAKDOWN">
            <div className="space-y-4">
              {[
                { label: 'Pending Acceptance', value: dashboard?.pendingAcceptance ?? 0, total: dashboard?.totalAssigned || 1, color: 'from-yellow-400 to-orange-400', textColor: 'text-yellow-400' },
                { label: 'In Progress', value: dashboard?.inProgress ?? 0, total: dashboard?.totalAssigned || 1, color: 'from-blue-400 to-cyan-400', textColor: 'text-blue-400' },
                { label: 'Completed', value: dashboard?.completed ?? 0, total: dashboard?.totalAssigned || 1, color: 'from-green-400 to-emerald-400', textColor: 'text-green-400' },
                { label: 'Rejected', value: dashboard?.rejected ?? 0, total: dashboard?.totalAssigned || 1, color: 'from-red-400 to-rose-400', textColor: 'text-red-400' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-cyan-300">{item.label}</span>
                    <span className={item.textColor}>{item.value} tasks</span>
                  </div>
                  <div className="w-full bg-cyan-900/30 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min((item.value / item.total) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </HUDCard>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <HUDCard title="QUICK ACTIONS">
            <div className="space-y-3">
              {[
                { icon: '📋', label: 'My Tasks', link: '/worker/tasks', color: 'border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500 text-blue-400' },
                { icon: '📜', label: 'Task History', link: '/worker/history', color: 'border-green-500/30 hover:bg-green-500/10 hover:border-green-500 text-green-400' },
                { icon: '📈', label: 'Performance', link: '/worker/performance', color: 'border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-500 text-yellow-400' },
                { icon: '💬', label: 'Support Desk', link: '/worker/helpdesk', color: 'border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500 text-cyan-400' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.link)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border bg-[var(--bg3)] transition-all duration-300 ${item.color}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-mono text-sm uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>
          </HUDCard>
        </div>
      </div>
    </div>
  );
}
