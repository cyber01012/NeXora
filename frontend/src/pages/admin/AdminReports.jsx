import { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  ShieldExclamationIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const REPORT_TYPES = ['ALL', 'CIVIC', 'SOS', 'ANONYMOUS'];
const STATUS_FILTERS = ['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED'];

const mockReports = [
  { id: 1, type: 'CIVIC', title: 'Road Damage — Sector 12', status: 'PENDING', urgency: 'HIGH', date: '2026-06-09', reporter: 'Citizen #4021' },
  { id: 2, type: 'SOS', title: 'Flood Alert — Canal Road', status: 'IN_PROGRESS', urgency: 'CRITICAL', date: '2026-06-09', reporter: 'Auto-Detect' },
  { id: 3, type: 'ANONYMOUS', title: 'Illegal Dumping — Phase III', status: 'PENDING', urgency: 'MEDIUM', date: '2026-06-08', reporter: 'Anonymous' },
  { id: 4, type: 'CIVIC', title: 'Streetlight Outage — Main Blvd', status: 'RESOLVED', urgency: 'LOW', date: '2026-06-07', reporter: 'Citizen #1188' },
  { id: 5, type: 'SOS', title: 'Gas Leak — Industrial Zone', status: 'IN_PROGRESS', urgency: 'CRITICAL', date: '2026-06-09', reporter: 'Responder Unit 7' },
  { id: 6, type: 'CIVIC', title: 'Water Supply Disruption', status: 'PENDING', urgency: 'HIGH', date: '2026-06-08', reporter: 'Citizen #3302' },
];

const urgencyColors = {
  CRITICAL: { text: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30', glow: '#ff2a2a' },
  HIGH: { text: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30', glow: '#fb923c' },
  MEDIUM: { text: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', glow: '#facc15' },
  LOW: { text: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/30', glow: '#4ade80' },
};

const statusColors = {
  PENDING: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  IN_PROGRESS: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  RESOLVED: 'text-green-400 bg-green-500/10 border-green-500/20',
  DISMISSED: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

const typeIcons = {
  CIVIC: <ClipboardDocumentListIcon className="w-5 h-5" />,
  SOS: <ExclamationTriangleIcon className="w-5 h-5" />,
  ANONYMOUS: <ShieldExclamationIcon className="w-5 h-5" />,
};

export default function AdminReports() {
  const [reports] = useState(mockReports);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = reports.filter(r => {
    if (typeFilter !== 'ALL' && r.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = [
    { label: 'TOTAL', value: reports.length, color: '#06b6d4', icon: '📋' },
    { label: 'CRITICAL', value: reports.filter(r => r.urgency === 'CRITICAL').length, color: '#ff2a2a', icon: '🚨' },
    { label: 'PENDING', value: reports.filter(r => r.status === 'PENDING').length, color: '#facc15', icon: '⏳' },
    { label: 'RESOLVED', value: reports.filter(r => r.status === 'RESOLVED').length, color: '#4ade80', icon: '✅' },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* HEADER */}
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">SYSTEM REPORTS</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ CIVIC • SOS • ANONYMOUS ]</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-4 transition-all hover:border-cyan-500/40 hover:scale-[1.02]"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-[9px] font-mono text-cyan-400/60 tracking-wider">{stat.label}</span>
            </div>
            <h2
              className="font-data text-3xl"
              style={{ color: stat.color, textShadow: `0 0 12px ${stat.color}` }}
            >
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-3 text-cyan-100 text-sm outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Type filter */}
          <div className="flex gap-2">
            {REPORT_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-lg border text-xs font-mono transition-all ${
                  typeFilter === type
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'border-[var(--border)] text-cyan-400/50 hover:text-cyan-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-cyan-100 text-sm outline-none appearance-none cursor-pointer hover:border-cyan-400/50 transition-colors"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2306b6d4' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              paddingRight: '36px',
            }}
          >
            {STATUS_FILTERS.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Status' : s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* REPORTS TABLE */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-500/10">
                {['TYPE', 'REPORT', 'URGENCY', 'STATUS', 'DATE', 'REPORTER'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-[10px] font-mono text-cyan-400/50 tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-cyan-400/40 font-mono text-sm">
                    No reports match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((report, idx) => {
                  const uColor = urgencyColors[report.urgency] || urgencyColors.LOW;
                  const sColor = statusColors[report.status] || statusColors.PENDING;
                  return (
                    <tr
                      key={report.id}
                      className="border-b border-cyan-500/5 hover:bg-cyan-900/10 transition-colors cursor-pointer"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className="px-5 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${uColor.bg} ${uColor.border} border`}>
                          <span className={uColor.text}>{typeIcons[report.type]}</span>
                          <span className={`text-[10px] font-mono ${uColor.text}`}>{report.type}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-cyan-100 text-sm font-mono">{report.title}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-mono border ${uColor.bg} ${uColor.border} ${uColor.text}`}
                          style={{ textShadow: `0 0 6px ${uColor.glow}` }}
                        >
                          {report.urgency}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-mono border ${sColor}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-cyan-400/50 text-xs font-mono">{report.date}</td>
                      <td className="px-5 py-4 text-cyan-300/60 text-xs font-mono">{report.reporter}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
