import { useEffect, useState } from 'react';
import { helpDeskApi } from '../../services/HelpDesk/helpDeskApi';

export default function HelpDeskReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await helpDeskApi.allSOS();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load SOS reports:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'RESOLVED':
        return 'text-green-400 border-green-500/20 bg-green-500/10';
      case 'DISPATCHED':
        return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10';
      case 'PENDING':
      default:
        return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.phoneAutoDetect?.includes(searchTerm) ||
      report.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.detail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || report.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-cyan-300 drop-shadow-[0_0_12px_#00f0ff]">
            SOS REPORTS LOG
          </h1>
          <p className="text-cyan-400/50 mt-1 text-sm font-mono">
            [ EMERGENCY CALLS REGISTRY & STATE MONITORING ]
          </p>
        </div>
        <button
          onClick={loadReports}
          className="px-4 py-2 bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono tracking-widest rounded-xl transition-all"
        >
          🔄 REFRESH FEED
        </button>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#071018] border border-cyan-500/20 p-4 rounded-2xl">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by caller, phone, city, or detail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-sm font-mono text-cyan-200 placeholder-cyan-500/40 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'DISPATCHED', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 border rounded-xl text-xs font-mono tracking-wider transition-all ${
                statusFilter === status
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                  : 'bg-transparent border-cyan-500/20 text-cyan-500/60 hover:text-cyan-400 hover:border-cyan-500/40'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* LOGS LIST */}
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-[#071018] border border-cyan-500/20 rounded-3xl p-12 text-center">
          <span className="text-4xl">📭</span>
          <h2 className="text-cyan-400/50 mt-4 text-sm font-mono">[ NO EMERGENCY REPORTS FOUND ]</h2>
        </div>
      ) : (
        <div className="bg-[#071018] border border-cyan-500/20 rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-cyan-200 font-mono">
              <thead>
                <tr className="border-b border-cyan-500/20 bg-cyan-950/20 text-cyan-400">
                  <th className="p-4 text-xs tracking-wider">ID</th>
                  <th className="p-4 text-xs tracking-wider">CALLER DETAILS</th>
                  <th className="p-4 text-xs tracking-wider">LOCATION</th>
                  <th className="p-4 text-xs tracking-wider">INCIDENT DETAILS</th>
                  <th className="p-4 text-xs tracking-wider">PRIORITY</th>
                  <th className="p-4 text-xs tracking-wider">STATUS</th>
                  <th className="p-4 text-xs tracking-wider">COMPLETED BY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {filteredReports.map((report) => (
                  <tr key={report.sosId} className="hover:bg-cyan-950/5 transition-colors">
                    <td className="p-4 font-bold text-cyan-400">#{report.sosId}</td>
                    <td className="p-4">
                      <div className="font-semibold text-cyan-100">{report.name}</div>
                      <div className="text-xs text-cyan-400/60 mt-0.5">{report.phoneAutoDetect || 'No Phone'}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div>{report.city}, {report.province}</div>
                      <div className="text-cyan-400/60 mt-0.5">{report.district} • {report.town}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-semibold text-cyan-300">
                        {report.complaintNature?.name || 'Emergency Call'}
                      </div>
                      <p className="text-xs text-cyan-200/70 mt-1 max-w-xs truncate" title={report.detail}>
                        {report.detail}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold ${getPriorityColor(report.priority)}`}>
                        {report.priority || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold ${getStatusColor(report.status)}`}>
                        {report.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-cyan-400/70">
                      {report.resolvedBy ? `👤 @${report.resolvedBy}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
