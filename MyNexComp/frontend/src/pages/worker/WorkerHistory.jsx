import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, MapPinIcon, CalendarDaysIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { workerApi } from '../../services/api.js';

const formatDate = (date) => {
  if (!date) return '—';
  try { return new Date(date).toLocaleDateString('en-PK', { dateStyle: 'medium' }); }
  catch { return date; }
};

const formatTaskId = (task) => {
  if (task.reportId) return `RPT-${task.reportId}`;
  if (task.sosId) return `SOS-${task.sosId}`;
  return `TASK-${task.id}`;
};

export default function WorkerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL | COMPLETED | REJECTED

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workerApi.taskHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load task history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const completed = history.filter(t => t.finalDecision === 'COMPLETED');
  const rejected = history.filter(t => t.finalDecision === 'REJECTED');

  const displayed = filter === 'COMPLETED' ? completed
    : filter === 'REJECTED' ? rejected
    : history;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING HISTORY... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">TASK HISTORY</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ PAST ASSIGNMENTS ]</p>
        </div>
        <button
          onClick={loadHistory}
          className="flex items-center gap-2 px-3 py-2 border border-cyan-500/30 rounded-lg font-mono text-xs text-cyan-400 hover:bg-cyan-500/10 transition-all"
        >
          <ArrowPathIcon className="w-4 h-4" /> REFRESH
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl font-mono text-sm text-red-400">
          ⚠ {error} — <button onClick={loadHistory} className="underline">retry</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-4 text-center">
          <p className="font-mono text-[9px] text-gray-500 mb-1">TOTAL HISTORY</p>
          <p className="font-data text-3xl text-cyan-400">{history.length}</p>
        </div>
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-4 text-center">
          <p className="font-mono text-[9px] text-gray-500 mb-1">COMPLETED</p>
          <p className="font-data text-3xl text-green-400">{completed.length}</p>
        </div>
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-4 text-center">
          <p className="font-mono text-[9px] text-gray-500 mb-1">REJECTED</p>
          <p className="font-data text-3xl text-red-400">{rejected.length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['ALL', 'COMPLETED', 'REJECTED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg font-mono text-xs transition-all ${
              filter === f
                ? f === 'COMPLETED' ? 'bg-green-500/20 border border-green-500 text-green-400'
                  : f === 'REJECTED' ? 'bg-red-500/20 border border-red-500 text-red-400'
                  : 'bg-cyan-500/20 border border-cyan-500 text-cyan-400'
                : 'bg-transparent border border-transparent text-cyan-400/50 hover:text-cyan-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="space-y-4">
        {displayed.length === 0 ? (
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-12 text-center">
            <p className="font-mono text-sm text-cyan-400/40">
              {history.length === 0
                ? 'No task history yet. Complete or reject tasks to see them here.'
                : `No ${filter.toLowerCase()} tasks found.`}
            </p>
          </div>
        ) : (
          displayed.map(task => (
            <div key={task.id} className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5 hover:border-cyan-500/30 transition-all">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-data text-lg text-glow-primary">{formatTaskId(task)}</span>
                    {task.finalDecision === 'COMPLETED' ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono border text-green-400 border-green-500/30 bg-green-500/10 flex items-center gap-1">
                        <CheckCircleIcon className="w-3 h-3" /> COMPLETED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono border text-red-400 border-red-500/30 bg-red-500/10 flex items-center gap-1">
                        <XCircleIcon className="w-3 h-3" /> REJECTED
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                      task.priority === 'HIGH' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                      task.priority === 'MEDIUM' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                      'text-green-400 border-green-500/30 bg-green-500/10'
                    }`}>{task.priority}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-cyan-400/80">
                    {task.departmentName && (
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" /> {task.departmentName}
                      </span>
                    )}
                    {task.submitDate && (
                      <span className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-3 h-3" /> Submitted: {formatDate(task.submitDate)}
                      </span>
                    )}
                    {task.completedDate && (
                      <span className="flex items-center gap-1 text-green-400/70">
                        <CalendarDaysIcon className="w-3 h-3" /> Resolved: {formatDate(task.completedDate)}
                      </span>
                    )}
                  </div>

                  {task.citizenName && (
                    <p className="font-mono text-xs text-gray-500 mt-1">
                      Citizen: <span className="text-cyan-300">{task.citizenName}</span>
                      {task.anonymous && <span className="text-yellow-400"> (Anonymous)</span>}
                    </p>
                  )}

                  {task.remarks && (
                    <p className="font-mono text-xs text-gray-500 mt-2 italic bg-cyan-900/10 p-2 rounded border border-cyan-500/10">
                      "{task.remarks}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
