import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assigningOfficerApi } from '../../services/assigningOfficerApi';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Filler
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Filler);

export default function AssigningOfficerDashboard() {
  const [stats, setStats] = useState(null);
  const [recentForwarded, setRecentForwarded] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashData, forwarded] = await Promise.all([
        assigningOfficerApi.dashboard().catch(() => ({})),
        assigningOfficerApi.forwarded().catch(() => []),
      ]);
      setStats(dashData);
      setRecentForwarded(forwarded.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#fbbf24',
      ACCEPTED: '#60a5fa',
      READ: '#818cf8',
      WITH_VOLUNTEER: '#c084fc',
      IN_PROGRESS: '#22d3ee',
      COMPLETED: '#4ade80',
      REJECTED: '#ef4444',
    };
    return colors[status] || '#8899aa';
  };

  // Chart data
  const distributionData = {
    labels: ['Pending SOS', 'Pending Civic', 'Active Dispatched', 'Completed'],
    datasets: [{
      data: [
        stats?.pendingSOS || 0,
        stats?.pendingCivic || 0,
        stats?.activeDispatched || 0,
        stats?.completed || 0,
      ],
      backgroundColor: ['#ef4444', '#fbbf24', '#60a5fa', '#4ade80'],
      borderColor: ['rgba(239,68,68,0.5)', 'rgba(251,191,36,0.5)', 'rgba(96,165,250,0.5)', 'rgba(74,222,128,0.5)'],
      borderWidth: 1,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#e0f8ff', font: { size: 10, family: 'Share Tech Mono' } } },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING COMMAND CENTER... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider animate-slideInRight">
            COMMAND CENTER
          </h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1 animate-slideInRight animation-delay-100">
            [ ASSIGNING OFFICER — DISPATCH MANAGEMENT ]
          </p>
        </div>
        <Link
          to="/assigning-officer/dispatch"
          className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-xs text-glow-primary hover:bg-cyan-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          📥 OPEN DISPATCH QUEUE
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'PENDING SOS', value: stats?.pendingSOS || 0, color: '#ef4444', icon: '🚨', sub: 'Urgent' },
          { label: 'PENDING CIVIC', value: stats?.pendingCivic || 0, color: '#fbbf24', icon: '📄', sub: 'Awaiting' },
          { label: 'DISPATCHED', value: stats?.totalDispatched || 0, color: '#60a5fa', icon: '📤', sub: 'Total' },
          { label: 'COMPLETED', value: stats?.completed || 0, color: '#4ade80', icon: '✅', sub: 'Resolved' },
          { label: 'DEPARTMENTS', value: stats?.activeDepartments || 0, color: '#c084fc', icon: '🏢', sub: 'Active' },
        ].map((card, idx) => (
          <div
            key={card.label}
            className="bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl p-3 transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] animate-scaleIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{card.icon}</span>
              <span className="text-[8px] font-mono text-cyan-400/60 tracking-wider">{card.label}</span>
            </div>
            <p className="font-data text-2xl" style={{ color: card.color, textShadow: `0 0 10px ${card.color}` }}>
              {card.value}
            </p>
            <p className="text-[8px] font-mono text-cyan-400/40 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Distribution Chart */}
        <div className="bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
            <span>📊</span> REPORT DISTRIBUTION
          </h3>
          <div className="h-52">
            <Doughnut data={distributionData} options={doughnutOptions} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
            <span>⚡</span> QUICK ACTIONS
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📥', label: 'DISPATCH QUEUE', link: '/assigning-officer/dispatch', color: '#06b6d4' },
              { icon: '📡', label: 'LIVE TRACKER', link: '/assigning-officer/tracker', color: '#c084fc' },
              { icon: '🏢', label: 'DEPARTMENTS', link: '/assigning-officer/departments', color: '#fbbf24' },
              { icon: '📜', label: 'HISTORY', link: '/assigning-officer/history', color: '#4ade80' },
            ].map((action, idx) => (
              <Link
                key={action.label}
                to={action.link}
                className="group flex items-center gap-3 p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-500/5 transition-all duration-300 hover:scale-105 animate-scaleIn"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                <span className="font-mono text-xs text-cyan-300 group-hover:text-glow-primary transition-colors">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Forwarded */}
      <div className="bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-title text-glow-primary text-sm tracking-wider flex items-center gap-2">
            <span>📋</span> RECENT DISPATCHES
          </h3>
          <Link to="/assigning-officer/tracker" className="text-[9px] font-mono text-cyan-400/70 hover:text-cyan-400 transition-colors">
            VIEW ALL →
          </Link>
        </div>
        <div className="space-y-2">
          {recentForwarded.length > 0 ? recentForwarded.map((item, idx) => (
            <div
              key={item.forwardedComplainId}
              className="flex justify-between items-center p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 animate-slideInRight"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  {item.sosId ? '🚨' : '📄'}
                </div>
                <div>
                  <p className="font-mono text-sm text-cyan-200">
                    {item.sosId ? `SOS #${item.sosId}` : `CIVIC #${item.reportId}`}
                  </p>
                  <p className="font-mono text-[9px] text-cyan-400/60">
                    → {item.department?.deptName || 'Unknown Dept'} · {item.submitDate || ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className="px-2 py-1 rounded-full text-[10px] font-mono border"
                  style={{
                    color: getStatusColor(item.status),
                    borderColor: `${getStatusColor(item.status)}50`,
                    background: `${getStatusColor(item.status)}15`,
                  }}
                >
                  {item.status}
                </span>
                {item.priority === 'HIGH' && (
                  <p className="font-mono text-[8px] text-red-400 mt-1 animate-pulse">HIGH PRIORITY</p>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-cyan-400/60 font-mono text-sm">No dispatches yet — start from the Dispatch Queue</div>
          )}
        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
        .animation-delay-100 { animation-delay: 0.1s; }
      `}</style>
    </div>
  );
}
