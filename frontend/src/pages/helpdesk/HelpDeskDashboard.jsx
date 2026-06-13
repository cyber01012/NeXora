import { useEffect, useState } from 'react';
import { helpDeskApi } from '../../services/HelpDesk/helpDeskApi';

export default function HelpDeskDashboard() {
  const [stats, setStats] = useState(null);
  const [recentSOS, setRecentSOS] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const dashboard = await helpDeskApi.dashboard();
      const recent = await helpDeskApi.recentSOS();
      setStats(dashboard);
      setRecentSOS(recent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return 'text-red-400 border-red-500/20 bg-red-500/10 drop-shadow-[0_0_6px_rgba(239,68,68,0.2)]';
      case 'MEDIUM':
        return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
      case 'LOW':
      default:
        return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-widest text-cyan-300 drop-shadow-[0_0_12px_#00f0ff] font-title">
          HELP DESK DASHBOARD
        </h1>
        <p className="text-cyan-400/50 mt-2 text-sm font-mono">
          [ EMERGENCY COMMAND MONITORING SYSTEM ]
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: 'TOTAL SOS',
            value: stats?.totalSOS || 0,
            color: '#06b6d4',
            icon: '🚨'
          },
          {
            title: 'PENDING',
            value: stats?.pendingSOS || 0,
            color: '#fbbf24',
            icon: '⏳'
          },
          {
            title: 'RESOLVED',
            value: stats?.resolvedSOS || 0,
            color: '#22c55e',
            icon: '✅'
          },
          {
            title: 'HIGH PRIORITY',
            value: stats?.highPrioritySOS || 0,
            color: '#ef4444',
            icon: '🔥'
          }
        ].map((card, idx) => (
          <div
            key={card.title}
            className="bg-[#071018] border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-400/40 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.05)] animate-scaleIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-mono text-cyan-400/60 tracking-widest">
                {card.title}
              </span>
              <div className="text-2xl">{card.icon}</div>
            </div>
            <h2
              className="text-4xl font-bold font-data"
              style={{
                color: card.color,
                textShadow: `0 0 12px ${card.color}`
              }}
            >
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* RECENT SOS */}
      <div className="bg-[#071018] border border-cyan-500/20 rounded-3xl p-6 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
        <div className="flex justify-between items-center mb-5 border-b border-cyan-500/10 pb-4">
          <h2 className="text-xl text-cyan-300 tracking-widest font-title">
            RECENT SOS REPORTS
          </h2>
          <span className="text-xs text-cyan-500/40 font-mono animate-pulse">
            ● LIVE FEED
          </span>
        </div>

        <div className="space-y-3">
          {recentSOS.length === 0 ? (
            <div className="text-center py-6 text-cyan-500/40 font-mono">[ NO RECENT REPORTS LOGGED ]</div>
          ) : (
            recentSOS.map((sos) => (
              <div
                key={sos.sosId}
                className="p-4 rounded-xl border border-cyan-500/10 bg-cyan-950/5 hover:bg-cyan-900/10 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-cyan-100 font-semibold font-mono">
                      {sos.name}
                    </h3>
                    <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold ${getPriorityColor(sos.priority)}`}>
                      {sos.priority || 'MEDIUM'}
                    </span>
                  </div>
                  <p className="text-cyan-400/50 text-xs mt-1 font-mono">
                    {sos.city} • {sos.area}
                  </p>
                  <p className="text-cyan-200/80 text-sm mt-2 leading-relaxed">
                    {sos.detail}
                  </p>
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-mono">
                    {sos.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.35s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}