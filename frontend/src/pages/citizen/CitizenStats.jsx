import { useEffect, useState } from 'react';
import { citizenApi } from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Stat Card Component
const StatCard = ({ label, value, color, icon, suffix = '' }) => (
  <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] group">
    <div className="flex items-center justify-center mb-1">
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    </div>
    <p className="font-data text-2xl mt-1" style={{ textShadow: `0 0 10px ${color}`, color }}>{value}{suffix}</p>
    <p className="font-mono text-[8px] text-cyan-400/60 mt-1 tracking-wider">{label}</p>
  </div>
);

export default function CitizenStats() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [statsData, reportsData] = await Promise.all([
        citizenApi.stats().catch(() => ({})),
        citizenApi.myReports().catch(() => [])
      ]);
      setStats(statsData);
      setReports(reportsData || []);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from reports if API stats not available
  const totalReports = stats?.totalReports || reports.length;
  const pendingCount = reports.filter(r => r.status === 'PENDING').length;
  const inProgressCount = reports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ACCEPTED').length;
  const completedCount = reports.filter(r => r.status === 'COMPLETED').length;
  const rejectedCount = reports.filter(r => r.status === 'REJECTED').length;

  // By type stats
  const byType = stats?.byType || {};
  const typeLabels = Object.keys(byType);
  const typeValues = Object.values(byType);

  // Monthly data (mock if not available)
  const monthlyData = [2, 5, 3, 8, 6, 10, 7, 12, 9, 11, 14, 8];

  // Chart data
  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Reports Submitted',
        data: monthlyData,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const typeChartData = {
    labels: typeLabels.length > 0 ? typeLabels : ['ELECTRICITY', 'GAS', 'ROAD', 'WATER'],
    datasets: [
      {
        data: typeValues.length > 0 ? typeValues : [5, 3, 8, 4],
        backgroundColor: ['#fbbf24', '#f97316', '#60a5fa', '#22d3ee'],
        borderColor: ['rgba(251,191,36,0.5)', 'rgba(249,115,22,0.5)', 'rgba(96,165,250,0.5)', 'rgba(34,211,238,0.5)'],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const statusChartData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Rejected'],
    datasets: [
      {
        data: [pendingCount, inProgressCount, completedCount, rejectedCount],
        backgroundColor: ['#fbbf24', '#60a5fa', '#4ade80', '#ef4444'],
        borderColor: ['rgba(251,191,36,0.5)', 'rgba(96,165,250,0.5)', 'rgba(74,222,128,0.5)', 'rgba(239,68,68,0.5)'],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const lineOptions = {
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeOutBounce' },
    plugins: {
      legend: { position: 'bottom', labels: { color: '#e0f8ff', font: { size: 9, family: 'Share Tech Mono' } } },
      tooltip: { backgroundColor: '#0a1628', titleColor: '#00f0ff', bodyColor: '#e0f8ff' },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING STATISTICS... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">MY STATISTICS</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ REPORT ANALYTICS & INSIGHTS ]</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="TOTAL REPORTS" value={totalReports} color="#06b6d4" icon="📋" />
        <StatCard label="PENDING" value={pendingCount} color="#fbbf24" icon="⏳" />
        <StatCard label="COMPLETED" value={completedCount} color="#4ade80" icon="✅" />
        <StatCard label="REJECTED" value={rejectedCount} color="#ef4444" icon="❌" />
      </div>

      {/* Completion Rate */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <p className="font-mono text-[9px] text-cyan-400/60">COMPLETION RATE</p>
            <p className="font-data text-3xl text-glow-primary">
              {totalReports > 0 ? Math.round((completedCount / totalReports) * 100) : 0}%
            </p>
          </div>
          <div className="flex-1 min-w-[150px]">
            <div className="w-full bg-cyan-900/30 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-1000 ease-out"
                style={{ width: `${totalReports > 0 ? (completedCount / totalReports) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-cyan-400/60">{completedCount} / {totalReports} tasks</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Monthly Trend */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
            <span>📈</span> MONTHLY REPORT TREND
          </h3>
          <div className="h-56">
            <Line data={monthlyChartData} options={lineOptions} />
          </div>
        </div>

        {/* By Type */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
            <span>📊</span> REPORTS BY TYPE
          </h3>
          <div className="h-56">
            <Doughnut data={typeChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
        <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
          <span>📊</span> STATUS DISTRIBUTION
        </h3>
        <div className="h-48 max-w-md mx-auto">
          <Doughnut data={statusChartData} options={doughnutOptions} />
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
        <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
          <span>📋</span> RECENT ACTIVITY
        </h3>
        <div className="space-y-2">
          {reports.slice(0, 5).map((report, idx) => (
            <div key={report.id || idx} className="flex justify-between items-center p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/20 animate-slideInRight" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-sm">
                  {report.type?.charAt(0) || '📝'}
                </div>
                <div>
                  <p className="font-mono text-sm text-cyan-200">{report.trackingCode || `#${report.id}`}</p>
                  <p className="font-mono text-[9px] text-cyan-400/60">{report.type || 'Unknown'} • {report.locationAddress || report.city || 'N/A'}</p>
                </div>
              </div>
              <span className={`text-[10px] font-mono px-2 py-1 rounded-full border ${
                report.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                report.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                report.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }`}>
                {report.status || 'PENDING'}
              </span>
            </div>
          ))}
          {reports.length === 0 && (
            <p className="text-center text-cyan-400/40 font-mono text-sm py-4">No reports yet</p>
          )}
        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
}