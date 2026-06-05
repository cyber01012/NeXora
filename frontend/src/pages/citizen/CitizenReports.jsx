import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { citizenApi } from '../../services/api';

// Status Badge Component
// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING_ADMIN: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    APPROVED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    ASSIGNED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    IN_PROGRESS: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  
  // Normalize status
  const normalizedStatus = status || 'PENDING_ADMIN';
  const s = styles[normalizedStatus] || styles.PENDING_ADMIN;
  
  const displayStatus = {
    PENDING_ADMIN: 'PENDING',
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN PROGRESS',
    ASSIGNED: 'ASSIGNED',
    COMPLETED: 'COMPLETED',
    REJECTED: 'REJECTED',
  }[normalizedStatus] || normalizedStatus;
  
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-mono border ${s}`}>
      {displayStatus}
    </span>
  );
};
// Report Icon Component
const ReportIcon = ({ type }) => {
  const icons = {
    ELECTRICITY: { icon: '⚡', color: '#fbbf24', name: 'Electricity' },
    GAS: { icon: '🔥', color: '#f97316', name: 'Gas' },
    ROAD: { icon: '🛣️', color: '#60a5fa', name: 'Road' },
    WATER: { icon: '💧', color: '#22d3ee', name: 'Water' },
    MEDICAL: { icon: '🏥', color: '#4ade80', name: 'Medical' },
  };
  const t = icons[type] || icons.ELECTRICITY;
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}>
      {t.icon}
    </div>
  );
};

// Timeline Step Component
const TimelineStep = ({ label, completed, date }) => (
  <div className="flex items-center gap-3 group">
    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${completed ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4] scale-110' : 'bg-gray-600'}`} />
    <span className={`font-mono text-[11px] transition-all duration-300 ${completed ? 'text-cyan-300' : 'text-gray-500'}`}>{label}</span>
    {date && (
      <span className="font-mono text-[9px] text-gray-500 ml-auto">
        {new Date(date).toLocaleDateString()}
      </span>
    )}
  </div>
);

// Progress Bar Component
const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
      <div 
        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const TABS = [
  { key: 'ALL', label: 'ALL', icon: '📋' },
  { key: 'PENDING_ADMIN', label: 'PENDING', icon: '⏳' },
  { key: 'IN_PROGRESS', label: 'IN PROGRESS', icon: '🔄' },
  { key: 'COMPLETED', label: 'COMPLETED', icon: '✅' },
  { key: 'REJECTED', label: 'REJECTED', icon: '❌' },
];

export default function CitizenReports() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadReports();
  }, [activeTab]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const status = activeTab === 'ALL' ? undefined : activeTab;
      const data = await citizenApi.myReports(status);
      setReports(data || []);
    } catch (error) {
      console.error('Failed to load reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const order = ['PENDING_ADMIN', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];
    const idx = order.indexOf(status);
    return idx >= 0 ? idx + 1 : 1;
  };

  const getTimelineSteps = (report) => {
    const status = report.status;
    const steps = [
      { label: 'Report Submitted', key: 'submitted', completed: true },
      { label: 'Admin Review', key: 'review', completed: status !== 'PENDING_ADMIN' },
      { label: 'Assigned to Dept', key: 'assigned', completed: ['ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].includes(status) },
      { label: 'Work in Progress', key: 'progress', completed: ['IN_PROGRESS', 'COMPLETED'].includes(status) },
      { label: 'Completed', key: 'completed', completed: status === 'COMPLETED' },
    ];
    return steps;
  };

  const filteredReports = reports.filter(r => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'IN_PROGRESS') return r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED';
    return r.status === activeTab;
  });

  // Stats calculation
  const totalReports = reports.length;
  const pendingCount = reports.filter(r => r.status === 'PENDING_ADMIN').length;
  const inProgressCount = reports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length;
  const completedCount = reports.filter(r => r.status === 'COMPLETED').length;
  const rejectedCount = reports.filter(r => r.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING REPORTS... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">MY REPORTS</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ TRACK YOUR INCIDENT REQUESTS ]</p>
        </div>
        <Link 
          to="/citizen/report" 
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all duration-300 hover:scale-[1.02]"
        >
          <span className="text-lg">+</span> NEW REPORT
        </Link>
      </div>

      {/* Stats Cards - Claude Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center hover:border-cyan-500/50 transition-all duration-300">
          <p className="font-mono text-[9px] text-gray-500">TOTAL</p>
          <p className="font-data text-2xl text-glow-primary">{totalReports}</p>
        </div>
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center hover:border-yellow-500/50 transition-all duration-300">
          <p className="font-mono text-[9px] text-gray-500">PENDING</p>
          <p className="font-data text-2xl text-yellow-400">{pendingCount}</p>
        </div>
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center hover:border-cyan-500/50 transition-all duration-300">
          <p className="font-mono text-[9px] text-gray-500">IN PROGRESS</p>
          <p className="font-data text-2xl text-cyan-400">{inProgressCount}</p>
        </div>
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center hover:border-green-500/50 transition-all duration-300">
          <p className="font-mono text-[9px] text-gray-500">COMPLETED</p>
          <p className="font-data text-2xl text-green-400">{completedCount}</p>
        </div>
      </div>

      {/* Tabs - Claude Style */}
      <div className="flex gap-1 bg-[var(--bg3)]/50 p-1 rounded-xl border border-[var(--border)]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                : 'text-gray-500 hover:text-cyan-300 hover:bg-cyan-500/5'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.key !== 'ALL' && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-400'
              }`}>
                {tab.key === 'PENDING_ADMIN' ? pendingCount : 
                 tab.key === 'IN_PROGRESS' ? inProgressCount :
                 tab.key === 'COMPLETED' ? completedCount : rejectedCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-12 text-center">
          <div className="text-6xl mb-3 opacity-40">📋</div>
          <p className="font-mono text-sm text-gray-400">No reports in this category</p>
          <Link to="/citizen/report" className="inline-block mt-4 text-sm text-cyan-400 hover:underline transition-all">
            Create your first report →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report, idx) => (
            <div 
              key={report.id || idx} 
              className={`bg-[var(--bg2)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 ${
                expandedId === report.id ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'hover:border-cyan-500/30'
              }`}
            >
              {/* Report Header - Clickable */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <ReportIcon type={report.type} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-data text-md text-glow-primary">
                          {report.trackingCode || `RPT-${report.id}`}
                        </p>
                        {report.priority === 'HIGH' && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                            HIGH
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-gray-400 mt-1">
                        {report.type} • {report.locationAddress || 'Location not specified'}
                      </p>
                      <p className="font-mono text-[10px] text-gray-500 mt-1">
                        {new Date(report.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={report.status} />
                    <div className="mt-2 flex items-center gap-1">
                      <ProgressBar current={getStatusStep(report.status)} total={5} />
                      <span className="text-[9px] font-mono text-gray-500 ml-2">{getStatusStep(report.status)}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details - Claude Style */}
              {expandedId === report.id && (
                <div className="border-t border-[var(--border)] p-4 bg-gradient-to-b from-[var(--bg3)]/20 to-transparent space-y-4 animate-fadeIn">
                  {/* Description */}
                  <div className="p-3 bg-[var(--bg3)]/50 rounded-lg border border-[var(--border)]">
                    <p className="font-mono text-[9px] text-cyan-400/70 mb-1 tracking-wider uppercase">DESCRIPTION</p>
                    <p className="font-mono text-sm text-gray-300 leading-relaxed">
                      {report.description || report.detail || 'No description provided'}
                    </p>
                  </div>

                  {/* Location Details */}
                  {(report.area || report.city) && (
                    <div className="p-3 bg-[var(--bg3)]/50 rounded-lg border border-[var(--border)]">
                      <p className="font-mono text-[9px] text-cyan-400/70 mb-1 tracking-wider uppercase">LOCATION</p>
                      <p className="font-mono text-sm text-gray-300">
                        {[report.area, report.city, report.district, report.province].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Evidence */}
                  {report.evidence && (
                    <div className="p-3 bg-[var(--bg3)]/50 rounded-lg border border-[var(--border)]">
                      <p className="font-mono text-[9px] text-cyan-400/70 mb-1 tracking-wider uppercase">EVIDENCE</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📎</span>
                        <span className="font-mono text-xs text-cyan-400">{report.evidence}</span>
                      </div>
                    </div>
                  )}

                  {/* Status Timeline - Claude Style */}
                  <div className="p-3 bg-[var(--bg3)]/50 rounded-lg border border-[var(--border)]">
                    <p className="font-mono text-[9px] text-cyan-400/70 mb-2 tracking-wider uppercase">STATUS TIMELINE</p>
                    <div className="space-y-2 pl-1">
                      {getTimelineSteps(report).map((step, idx) => (
                        <TimelineStep 
                          key={idx} 
                          label={step.label} 
                          completed={step.completed} 
                          date={step.completed && step.label === 'Report Submitted' ? report.createdAt : null}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button 
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1"
                      onClick={() => window.location.href = `/citizen/reports/${report.id}/track`}
                    >
                      <span>🔍</span> VIEW FULL DETAILS
                    </button>
                    {report.status === 'PENDING_ADMIN' && (
                      <button 
                        className="text-[11px] font-mono text-red-400 hover:text-red-300 transition-all flex items-center gap-1"
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this report? This action cannot be undone.')) {
                            alert('Report cancelled');
                          }
                        }}
                      >
                        <span>🗑️</span> CANCEL REPORT
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}