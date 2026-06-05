import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { citizenApi } from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    PENDING_ADMIN: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    APPROVED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    ASSIGNED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    IN_PROGRESS: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const s = styles[status] || styles.PENDING;
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-mono border ${s}`}>
      {status === 'IN_PROGRESS' ? 'IN PROGRESS' : status}
    </span>
  );
};

// Report Icon Component
const ReportIcon = ({ type }) => {
  const icons = {
    ELECTRICITY: { icon: '⚡', color: '#fbbf24', label: 'Electricity' },
    GAS: { icon: '🔥', color: '#f97316', label: 'Gas' },
    ROAD: { icon: '🛣️', color: '#60a5fa', label: 'Road' },
    WATER: { icon: '💧', color: '#22d3ee', label: 'Water' },
    MEDICAL: { icon: '🏥', color: '#4ade80', label: 'Medical' },
  };
  const t = icons[type] || icons.ELECTRICITY;
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}>
      {t.icon}
    </div>
  );
};

export default function CitizenDashboard() {
  const [stats, setStats] = useState({
    totalReports: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disasterMode, setDisasterMode] = useState(false);

  useEffect(() => {
    Promise.all([
      citizenApi.stats().catch(() => ({ totalReports: 0, pending: 0, inProgress: 0, completed: 0 })),
      citizenApi.myReports().catch(() => [])
    ]).then(([statsData, reportsData]) => {
      setStats(statsData);
      setReports(reportsData || []);
      setLoading(false);
    }).catch(() => setLoading(false));

    fetch('/api/disaster-mode/status')
      .then(res => res.json())
      .catch(() => ({ active: false }))
      .then(data => setDisasterMode(data.active));
  }, []);

  // ========== CHART DATA ==========

  // Status Doughnut Chart
  const statusChartData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [{
      data: [stats.pending, stats.inProgress, stats.completed],
      backgroundColor: ['#fbbf24', '#60a5fa', '#4ade80'],
      borderColor: ['rgba(251,191,36,0.5)', 'rgba(96,165,250,0.5)', 'rgba(74,222,128,0.5)'],
      borderWidth: 2,
      hoverOffset: 15,
    }],
  };

  // Monthly Trend Line Chart
  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Reports',
      data: [2, 5, 3, 8, 6, stats.totalReports || 4],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.15)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#06b6d4',
      pointBorderColor: '#22d3ee',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 8,
    }],
  };

  // Reports by Type Bar Chart
  const typeChartData = {
    labels: ['Electricity', 'Gas', 'Road', 'Water', 'Medical'],
    datasets: [{
      label: 'Reports',
      data: [
        reports.filter(r => r.type === 'ELECTRICITY').length || 3,
        reports.filter(r => r.type === 'GAS').length || 2,
        reports.filter(r => r.type === 'ROAD').length || 5,
        reports.filter(r => r.type === 'WATER').length || 4,
        reports.filter(r => r.type === 'MEDICAL').length || 1,
      ],
      backgroundColor: [
        'rgba(251, 191, 36, 0.7)',
        'rgba(249, 115, 22, 0.7)',
        'rgba(96, 165, 250, 0.7)',
        'rgba(34, 211, 238, 0.7)',
        'rgba(74, 222, 128, 0.7)',
      ],
      borderColor: [
        '#fbbf24', '#f97316', '#60a5fa', '#22d3ee', '#4ade80'
      ],
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  // Chart Options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          color: '#22d3ee', 
          font: { size: 11, family: 'Share Tech Mono' },
          padding: 15,
          usePointStyle: true,
        } 
      },
      tooltip: { 
        backgroundColor: '#0a1628', 
        titleColor: '#22d3ee', 
        bodyColor: '#e0f8ff',
        borderColor: '#06b6d4',
        borderWidth: 1,
        padding: 12,
      },
    },
    animation: {
      animateRotate: true,
      duration: 2000,
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0a1628',
        titleColor: '#22d3ee',
        bodyColor: '#e0f8ff',
        borderColor: '#06b6d4',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: { 
        ticks: { color: '#22d3ee', font: { size: 10 } }, 
        grid: { color: 'rgba(6, 182, 212, 0.15)' } 
      },
      y: { 
        ticks: { color: '#8899aa', font: { size: 10 } }, 
        grid: { color: 'rgba(6, 182, 212, 0.15)' } 
      },
    },
    animation: { duration: 2000, easing: 'easeInOutQuart' },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0a1628',
        titleColor: '#22d3ee',
        bodyColor: '#e0f8ff',
        borderColor: '#06b6d4',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: { 
        ticks: { color: '#22d3ee', font: { size: 10 } }, 
        grid: { color: 'rgba(6, 182, 212, 0.1)' } 
      },
      y: { 
        ticks: { color: '#8899aa', font: { size: 10 } }, 
        grid: { color: 'rgba(6, 182, 212, 0.15)' } 
      },
    },
    animation: { duration: 1500, easing: 'easeOutBounce' },
  };

  const statCards = [
    { label: 'TOTAL REPORTS', value: stats.totalReports, color: '#06b6d4', icon: '📋', desc: 'All time' },
    { label: 'PENDING', value: stats.pending, color: '#fbbf24', icon: '⏳', desc: 'Awaiting review' },
    { label: 'IN PROGRESS', value: stats.inProgress, color: '#60a5fa', icon: '🔄', desc: 'Being processed' },
    { label: 'COMPLETED', value: stats.completed, color: '#4ade80', icon: '✅', desc: 'Resolved' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING DASHBOARD... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Disaster Mode Alert */}
      {disasterMode && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r-lg animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-mono text-xs text-red-400 tracking-wider">DISASTER MODE ACTIVE</p>
              <p className="font-mono text-[10px] text-red-400/60">Emergency services deployed</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">DASHBOARD</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ REAL-TIME INCIDENT TRACKING ]</p>
        </div>
        <Link 
          to="/citizen/report" 
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all"
        >
          <span className="text-lg">+</span> REPORT ISSUE
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div 
            key={card.label} 
            className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-[var(--glow)] hover:shadow-[0_0_15px_rgba(var(--glow-rgb),0.1)]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-[9px] font-mono text-[var(--text-muted)]/60 tracking-wider">{card.label}</span>
            </div>
            <p className="font-data text-3xl text-glow-primary" style={{ textShadow: `0 0 10px ${card.color}` }}>
              {card.value}
            </p>
            <p className="text-[9px] font-mono text-[var(--text-muted)]/50 mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* ========== CHARTS SECTION ========== */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Status Doughnut Chart */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
            <span>📊</span> STATUS OVERVIEW
          </h3>
          <div className="h-48 relative">
            <Doughnut data={statusChartData} options={doughnutOptions} />
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="font-data text-2xl text-glow-primary">{stats.totalReports}</p>
                <p className="font-mono text-[8px] text-cyan-300">TOTAL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend Line Chart */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
            <span>📈</span> MONTHLY TREND
          </h3>
          <div className="h-48">
            <Line data={monthlyChartData} options={lineOptions} />
          </div>
        </div>

        {/* Reports by Type Bar Chart */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
            <span>📊</span> BY TYPE
          </h3>
          <div className="h-48">
            <Bar data={typeChartData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
        <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4">QUICK ACTIONS</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: '📝', label: 'REPORT ISSUE', link: '/citizen/report', desc: 'Submit new complaint', color: '#22d3ee' },
            { icon: '📋', label: 'MY REPORTS', link: '/citizen/reports', desc: 'Track status', color: '#60a5fa' },
            { icon: '📍', label: 'SAVED LOCATIONS', link: '/citizen/locations', desc: 'Quick address', color: '#fbbf24' },
            { icon: '💬', label: 'HELP DESK', link: '/citizen/helpdesk', desc: 'Contact support', color: '#4ade80' },
            { icon: '👤', label: 'PROFILE', link: '/citizen/profile', desc: 'Account settings', color: '#06b6d4' },
            { icon: '📊', label: 'MY STATS', link: '/citizen/stats', desc: 'View analytics', color: '#c084fc' },
          ].map((action) => (
            <Link 
              key={action.label} 
              to={action.link} 
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg3)] border border-[var(--border)] hover:border-[var(--glow)] hover:bg-[var(--glow)]/5 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{action.icon}</span>
              <div>
                <p className="font-mono text-xs text-[var(--text)]">{action.label}</p>
                <p className="font-mono text-[9px] text-[var(--text-muted)]/60">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-title text-glow-primary text-sm tracking-wider">RECENT REPORTS</h3>
            <p className="font-mono text-[9px] text-[var(--text-muted)]/60 mt-0.5">Your latest complaints</p>
          </div>
          <Link to="/citizen/reports" className="text-[9px] font-mono text-glow-primary hover:underline flex items-center gap-1">
            VIEW ALL <span>→</span>
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3 opacity-40">📋</div>
            <p className="font-mono text-sm text-[var(--text-muted)]">No reports yet</p>
            <Link to="/citizen/report" className="inline-block mt-3 text-xs text-glow-primary hover:underline">Submit your first report →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.slice(0, 5).map((report, idx) => (
              <div 
                key={report.id || idx} 
                className="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg3)] border border-[var(--border)] hover:border-[var(--glow)] transition-all cursor-pointer"
              >
                <ReportIcon type={report.type} />
                <div className="flex-1 min-w-0">
                  <p className="font-data text-sm text-glow-primary truncate">
                    {report.trackingCode || `#${report.id || idx + 1}`}
                  </p>
                  <p className="font-mono text-xs text-[var(--text-muted)] mt-1 truncate">
                    {report.type || 'Unknown'} • {report.locationAddress || report.city || 'Location pending'}
                  </p>
                  <p className="font-mono text-[9px] text-[var(--text-muted)]/50 mt-0.5">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={report.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      {stats.totalReports > 0 && (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3">REPORT STATISTICS</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg3)] rounded-lg p-3">
              <p className="font-mono text-[10px] text-[var(--text-muted)]/60">Resolution Rate</p>
              <p className="font-data text-xl text-glow-primary mt-1">
                {stats.totalReports > 0 ? Math.round((stats.completed / stats.totalReports) * 100) : 0}%
              </p>
              <div className="w-full bg-[var(--bg2)] rounded-full h-1.5 mt-2">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${stats.totalReports > 0 ? (stats.completed / stats.totalReports) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="bg-[var(--bg3)] rounded-lg p-3">
              <p className="font-mono text-[10px] text-[var(--text-muted)]/60">Active Reports</p>
              <p className="font-data text-xl text-yellow-400 mt-1">{stats.pending + stats.inProgress}</p>
              <p className="font-mono text-[9px] text-[var(--text-muted)]/50 mt-1">Pending review & in progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}