import { useEffect, useState } from 'react';
import { assigningOfficerApi } from '../../services/assigningOfficerApi';

const STATUS_STEPS = [
  { key: 'dispatched', label: 'DISPATCHED', icon: '📤' },
  { key: 'acknowledged', label: 'ACKNOWLEDGED', icon: '👁️' },
  { key: 'assignedToWorker', label: 'ASSIGNED', icon: '👷' },
  { key: 'completed', label: 'COMPLETED', icon: '✅' },
];

const getStatusColor = (status) => {
  const colors = {
    PENDING: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    ACCEPTED: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    READ: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    WITH_VOLUNTEER: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    IN_PROGRESS: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    COMPLETED: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    REJECTED: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  };
  return colors[status] || colors.PENDING;
};

export default function AssigningOfficerTracker() {
  const [forwarded, setForwarded] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await assigningOfficerApi.forwarded();
      setForwarded(data);
    } catch (err) {
      console.error('Failed to load forwarded complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = forwarded.filter(item => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') return !['COMPLETED', 'REJECTED'].includes(item.status);
    return item.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING TRACKER... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">DISPATCH TRACKER</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">
            [ MONITORING {filteredData.length} FORWARDED COMPLAINT{filteredData.length !== 1 ? 'S' : ''} ]
          </p>
        </div>
        {/* Filter */}
        <div className="flex gap-2">
          {['ALL', 'ACTIVE', 'COMPLETED', 'REJECTED'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider border transition-all duration-300 ${
                statusFilter === f
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                  : 'bg-transparent border-cyan-500/20 text-cyan-500/60 hover:border-cyan-500/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filteredData.length > 0 ? filteredData.map((item, idx) => {
          const isExpanded = expandedId === item.forwardedComplainId;
          const sc = getStatusColor(item.status);

          return (
            <div
              key={item.forwardedComplainId}
              className="bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/40 animate-slideInRight"
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              {/* Main Row */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : item.forwardedComplainId)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                    {item.sosId ? '🚨' : '📄'}
                  </div>
                  <div>
                    <p className="font-mono text-sm text-cyan-200">
                      FC-{item.forwardedComplainId} · {item.sosId ? `SOS #${item.sosId}` : `CIVIC #${item.reportId}`}
                    </p>
                    <p className="font-mono text-[9px] text-cyan-400/60">
                      → {item.department?.deptName || 'N/A'} · {item.submitDate || ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.priority && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${
                      item.priority === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      item.priority === 'LOW' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>{item.priority}</span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-[10px] font-mono border ${sc.bg} ${sc.text} ${sc.border}`}>
                    {item.status}
                  </span>
                  <span className={`text-cyan-400/60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-cyan-500/10 p-4 bg-cyan-900/5 animate-fadeIn">
                  {/* Timeline Stepper */}
                  <div className="mb-4">
                    <h4 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">STATUS TIMELINE</h4>
                    <div className="flex items-center gap-2">
                      {STATUS_STEPS.map((step, sIdx) => {
                        const done = item.timeline?.[step.key] === true;
                        const timestamp = item.timeline?.[step.key + 'At'];
                        return (
                          <div key={step.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all duration-300 ${
                                done
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                                  : 'bg-gray-800/50 border-gray-600 text-gray-500'
                              }`}>
                                {step.icon}
                              </div>
                              <span className={`text-[8px] font-mono mt-1 ${done ? 'text-cyan-400' : 'text-gray-600'}`}>
                                {step.label}
                              </span>
                              {timestamp && (
                                <span className="text-[7px] font-mono text-cyan-400/40">{timestamp}</span>
                              )}
                            </div>
                            {sIdx < STATUS_STEPS.length - 1 && (
                              <div className={`h-0.5 flex-1 mx-1 ${done ? 'bg-cyan-500/40' : 'bg-gray-700'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {item.department && (
                      <div className="bg-cyan-900/10 border border-cyan-500/15 rounded-lg p-2">
                        <span className="text-[8px] font-mono text-cyan-400/50 tracking-wider">DEPARTMENT</span>
                        <p className="font-mono text-xs text-cyan-200 mt-0.5">{item.department.deptName}</p>
                        <p className="text-[8px] font-mono text-cyan-400/40">{item.department.category}</p>
                      </div>
                    )}
                    {item.responderName && (
                      <div className="bg-cyan-900/10 border border-cyan-500/15 rounded-lg p-2">
                        <span className="text-[8px] font-mono text-cyan-400/50 tracking-wider">RESPONDER</span>
                        <p className="font-mono text-xs text-cyan-200 mt-0.5">{item.responderName}</p>
                      </div>
                    )}
                    {item.workerName && (
                      <div className="bg-cyan-900/10 border border-cyan-500/15 rounded-lg p-2">
                        <span className="text-[8px] font-mono text-cyan-400/50 tracking-wider">VOLUNTEER</span>
                        <p className="font-mono text-xs text-cyan-200 mt-0.5">{item.workerName}</p>
                      </div>
                    )}
                    {item.citizen && (
                      <div className="bg-cyan-900/10 border border-cyan-500/15 rounded-lg p-2">
                        <span className="text-[8px] font-mono text-cyan-400/50 tracking-wider">CITIZEN</span>
                        <p className="font-mono text-xs text-cyan-200 mt-0.5">{item.citizen.fullName}</p>
                      </div>
                    )}
                  </div>

                  {/* Remarks */}
                  {item.remarks && (
                    <div className="mt-3 bg-cyan-900/10 border border-cyan-500/15 rounded-lg p-2">
                      <span className="text-[8px] font-mono text-cyan-400/50 tracking-wider">REMARKS</span>
                      <p className="font-mono text-xs text-cyan-200/80 mt-0.5">{item.remarks}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }) : (
          <div className="text-center py-16 bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl">
            <span className="text-4xl mb-4 block">📡</span>
            <p className="font-mono text-cyan-400/60 text-sm">No forwarded complaints to track</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
}
