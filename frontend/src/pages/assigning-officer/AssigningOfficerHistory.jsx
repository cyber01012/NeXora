import { useEffect, useState } from 'react';
import { assigningOfficerApi } from '../../services/assigningOfficerApi';

export default function AssigningOfficerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL | COMPLETED | REJECTED
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await assigningOfficerApi.history();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = history.filter(item => {
    if (filter === 'COMPLETED') return item.status === 'COMPLETED';
    if (filter === 'REJECTED') return item.status === 'REJECTED';
    return true;
  });

  const completedCount = history.filter(h => h.status === 'COMPLETED').length;
  const rejectedCount = history.filter(h => h.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING HISTORY... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">DISPATCH HISTORY</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">
            [ {history.length} RESOLVED RECORD{history.length !== 1 ? 'S' : ''} ]
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'ALL', label: `ALL (${history.length})` },
            { key: 'COMPLETED', label: `✅ COMPLETED (${completedCount})` },
            { key: 'REJECTED', label: `❌ REJECTED (${rejectedCount})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider border transition-all duration-300 ${
                filter === f.key
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                  : 'bg-transparent border-cyan-500/20 text-cyan-500/60 hover:border-cyan-500/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl p-3 text-center">
          <p className="font-data text-2xl text-cyan-400" style={{ textShadow: '0 0 10px #06b6d4' }}>{history.length}</p>
          <p className="text-[9px] font-mono text-cyan-400/50 mt-1">TOTAL RESOLVED</p>
        </div>
        <div className="bg-[#0a1628]/80 border border-green-500/20 rounded-xl p-3 text-center">
          <p className="font-data text-2xl text-green-400" style={{ textShadow: '0 0 10px #4ade80' }}>{completedCount}</p>
          <p className="text-[9px] font-mono text-green-400/50 mt-1">COMPLETED</p>
        </div>
        <div className="bg-[#0a1628]/80 border border-red-500/20 rounded-xl p-3 text-center">
          <p className="font-data text-2xl text-red-400" style={{ textShadow: '0 0 10px #ef4444' }}>{rejectedCount}</p>
          <p className="text-[9px] font-mono text-red-400/50 mt-1">REJECTED</p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-2">
        {filtered.length > 0 ? filtered.map((item, idx) => {
          const isCompleted = item.status === 'COMPLETED';
          const isExpanded = expandedId === item.forwardedComplainId;

          return (
            <div
              key={item.forwardedComplainId}
              className={`bg-[#0a1628]/80 border rounded-xl overflow-hidden transition-all duration-300 animate-slideInRight ${
                isCompleted ? 'border-green-500/20 hover:border-green-500/40' : 'border-red-500/20 hover:border-red-500/40'
              }`}
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : item.forwardedComplainId)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg border ${
                    isCompleted ? 'bg-green-500/15 border-green-500/30' : 'bg-red-500/15 border-red-500/30'
                  }`}>
                    {isCompleted ? '✅' : '❌'}
                  </div>
                  <div>
                    <p className="font-mono text-sm text-cyan-200">
                      FC-{item.forwardedComplainId} · {item.sosId ? `SOS #${item.sosId}` : `CIVIC #${item.reportId}`}
                    </p>
                    <p className="font-mono text-[9px] text-cyan-400/60">
                      → {item.department?.deptName || 'N/A'} · Dispatched {item.submitDate || ''}
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
                  <span className={`px-2 py-1 rounded-full text-[10px] font-mono border ${
                    isCompleted ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {item.status}
                  </span>
                  <span className={`text-cyan-400/60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-cyan-500/10 p-4 bg-cyan-900/5 animate-fadeIn">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {item.department && (
                      <div className="bg-cyan-900/10 border border-cyan-500/15 rounded-lg p-2">
                        <span className="text-[8px] font-mono text-cyan-400/50 tracking-wider">DEPARTMENT</span>
                        <p className="font-mono text-xs text-cyan-200 mt-0.5">{item.department.deptName}</p>
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
                  {item.remarks && (
                    <div className="mt-3 bg-cyan-900/10 border border-cyan-500/15 rounded-lg p-2">
                      <span className="text-[8px] font-mono text-cyan-400/50 tracking-wider">FINAL REMARKS</span>
                      <p className="font-mono text-xs text-cyan-200/80 mt-0.5">{item.remarks}</p>
                    </div>
                  )}

                  {/* Timeline summary */}
                  {item.timeline && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.timeline.dispatchedAt && (
                        <span className="px-2 py-1 rounded bg-cyan-900/20 border border-cyan-500/15 text-[8px] font-mono text-cyan-400/60">
                          📤 Dispatched: {item.timeline.dispatchedAt}
                        </span>
                      )}
                      {item.timeline.acknowledgedAt && (
                        <span className="px-2 py-1 rounded bg-cyan-900/20 border border-cyan-500/15 text-[8px] font-mono text-cyan-400/60">
                          👁️ Acknowledged: {item.timeline.acknowledgedAt}
                        </span>
                      )}
                      {item.timeline.assignedAt && (
                        <span className="px-2 py-1 rounded bg-cyan-900/20 border border-cyan-500/15 text-[8px] font-mono text-cyan-400/60">
                          👷 Assigned: {item.timeline.assignedAt}
                        </span>
                      )}
                      {item.timeline.completedAt && (
                        <span className="px-2 py-1 rounded bg-green-900/20 border border-green-500/15 text-[8px] font-mono text-green-400/60">
                          ✅ Completed: {item.timeline.completedAt}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }) : (
          <div className="text-center py-16 bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl">
            <span className="text-4xl mb-4 block">📜</span>
            <p className="font-mono text-cyan-400/60 text-sm">No history records yet</p>
            <p className="font-mono text-cyan-400/40 text-[10px] mt-1">Completed and rejected dispatches will appear here</p>
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
