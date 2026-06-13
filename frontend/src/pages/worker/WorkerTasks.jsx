import { useState, useEffect, useCallback } from 'react';
import { CheckCircleIcon, MapPinIcon, ClockIcon, ExclamationTriangleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { workerApi } from '../../services/api.js';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH': return 'text-red-400 border-red-500/30 bg-red-500/10';
    case 'MEDIUM': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    case 'LOW': return 'text-green-400 border-green-500/30 bg-green-500/10';
    default: return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING_ACCEPTANCE': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    case 'IN_PROGRESS': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    case 'COMPLETED': return 'text-green-400 border-green-500/30 bg-green-500/10';
    case 'REJECTED': return 'text-red-400 border-red-500/30 bg-red-500/10';
    default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  }
};

const formatTaskId = (task) => {
  if (task.reportId) return `RPT-${task.reportId}`;
  if (task.sosId) return `SOS-${task.sosId}`;
  return `TASK-${task.id}`;
};

const formatDate = (date, time) => {
  if (!date) return null;
  try {
    return new Date(`${date}T${time || '00:00'}`).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return date;
  }
};

// Toast notification
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border font-mono text-sm shadow-2xl animate-slideInRight ${
    type === 'success' ? 'bg-green-900/80 border-green-500 text-green-300' :
    type === 'error' ? 'bg-red-900/80 border-red-500 text-red-300' :
    'bg-cyan-900/80 border-cyan-500 text-cyan-300'
  }`}>
    <span>{type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">✕</button>
  </div>
);

// Confirm dialog
const ConfirmDialog = ({ title, placeholder, required, onConfirm, onCancel, confirmLabel = 'CONFIRM', confirmColor = 'green' }) => {
  const [value, setValue] = useState('');
  const isDisabled = required && value.trim().length === 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-6 max-w-sm w-full mx-4 space-y-4">
        <h3 className="font-title text-sm tracking-wider text-cyan-300">{title}</h3>
        {placeholder && (
          <div>
            <textarea
              rows={3}
              className={`w-full bg-cyan-900/20 border rounded-lg p-3 font-mono text-sm text-cyan-200 focus:outline-none resize-none placeholder:text-cyan-500/30 transition-colors ${
                required && value.trim().length === 0
                  ? 'border-red-500/60 focus:border-red-400'
                  : 'border-cyan-500/30 focus:border-cyan-400'
              }`}
              placeholder={placeholder}
              value={value}
              onChange={e => setValue(e.target.value)}
            />
            {required && value.trim().length === 0 && (
              <p className="font-mono text-[10px] text-red-400/80 mt-1">⚠ This field is required</p>
            )}
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => !isDisabled && onConfirm(value)}
            disabled={isDisabled}
            className={`flex-1 py-2 rounded-lg font-mono text-sm transition-all ${
              isDisabled
                ? 'bg-gray-700/30 border border-gray-600 text-gray-500 cursor-not-allowed'
                : confirmColor === 'green' ? 'bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500/30' :
                  confirmColor === 'red' ? 'bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30' :
                  'bg-yellow-500/20 border border-yellow-500 text-yellow-400 hover:bg-yellow-500/30'
            }`}
          >
            {confirmLabel}
          </button>
          <button onClick={onCancel} className="flex-1 py-2 bg-gray-500/20 border border-gray-500 rounded-lg font-mono text-sm text-gray-400 hover:bg-gray-500/30 transition-all">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default function WorkerTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [dialog, setDialog] = useState(null);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workerApi.tasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Keep selected task in sync after refresh
  useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find(t => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [tasks]);

  const handleAccept = () => {
    setDialog({
      title: 'Accept this task?',
      confirmLabel: '✅ ACCEPT TASK',
      confirmColor: 'green',
      placeholder: null,
      onConfirm: async () => {
        setDialog(null);
        setActionLoading(true);
        try {
          await workerApi.acceptTask(selectedTask.id);
          showToast('Task accepted successfully!', 'success');
          await loadTasks();
        } catch (err) {
          showToast(err.message || 'Failed to accept task', 'error');
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleReject = () => {
    setDialog({
      title: 'Reject this task?',
      placeholder: 'Reason for rejection (required)...',
      required: true,
      confirmLabel: '❌ REJECT TASK',
      confirmColor: 'red',
      onConfirm: async (reason) => {
        setDialog(null);
        setActionLoading(true);
        try {
          await workerApi.rejectTask(selectedTask.id, reason);
          showToast('Task rejected.', 'success');
          setSelectedTask(null);
          await loadTasks();
        } catch (err) {
          showToast(err.message || 'Failed to reject task', 'error');
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleProgress = () => {
    setDialog({
      title: 'Add progress note',
      placeholder: 'Progress notes (optional)...',
      confirmLabel: '🔧 UPDATE PROGRESS',
      confirmColor: 'green',
      onConfirm: async (notes) => {
        setDialog(null);
        setActionLoading(true);
        try {
          await workerApi.updateProgress(selectedTask.id, { notes });
          showToast('Progress updated!', 'success');
          await loadTasks();
        } catch (err) {
          showToast(err.message || 'Failed to update progress', 'error');
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleComplete = () => {
    setDialog({
      title: 'Mark task as COMPLETE?',
      placeholder: 'Completion remarks...',
      confirmLabel: '✅ MARK COMPLETE',
      confirmColor: 'green',
      onConfirm: async (remarks) => {
        setDialog(null);
        setActionLoading(true);
        try {
          await workerApi.completeTask(selectedTask.id, remarks || 'Task completed');
          showToast('Task marked as COMPLETED!', 'success');
          setSelectedTask(null);
          await loadTasks();
        } catch (err) {
          showToast(err.message || 'Failed to complete task', 'error');
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleHelp = () => {
    setDialog({
      title: 'Request help for this task?',
      placeholder: 'Describe what help you need...',
      confirmLabel: '🆘 REQUEST HELP',
      confirmColor: 'yellow',
      onConfirm: async (reason) => {
        setDialog(null);
        setActionLoading(true);
        try {
          await workerApi.requestHelp(selectedTask.id, reason || 'Assistance needed');
          showToast('Help request submitted!', 'success');
          await loadTasks();
        } catch (err) {
          showToast(err.message || 'Failed to submit help request', 'error');
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const id = formatTaskId(task).toLowerCase();
      const dept = (task.departmentName || '').toLowerCase();
      const citizen = (task.citizenName || '').toLowerCase();
      const remarks = (task.remarks || '').toLowerCase();
      if (!id.includes(q) && !dept.includes(q) && !citizen.includes(q) && !remarks.includes(q)) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING TASKS... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {dialog && <ConfirmDialog {...dialog} onCancel={() => setDialog(null)} />}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">MY TASKS</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ ACTIVE AND PENDING ASSIGNMENTS ]</p>
        </div>
        <button
          onClick={loadTasks}
          className="flex items-center gap-2 px-3 py-2 border border-cyan-500/30 rounded-lg font-mono text-xs text-cyan-400 hover:bg-cyan-500/10 transition-all"
        >
          <ArrowPathIcon className="w-4 h-4" /> REFRESH
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl font-mono text-sm text-red-400">
          ⚠ {error} — <button onClick={loadTasks} className="underline">retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg px-4 py-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-cyan-500/30"
              placeholder="🔍 Search by ID, department, citizen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'PENDING_ACCEPTANCE', 'IN_PROGRESS'].map((filter) => (
            <button
              key={filter}
              onClick={() => { setStatusFilter(filter); setSelectedTask(null); }}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all duration-300 ${
                statusFilter === filter
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-cyan-900/10 text-cyan-400/50 border border-transparent hover:text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              {filter.replace(/_/g, ' ')}
              {filter === 'ALL' && ` (${tasks.length})`}
              {filter === 'PENDING_ACCEPTANCE' && ` (${tasks.filter(t => t.status === 'PENDING_ACCEPTANCE').length})`}
              {filter === 'IN_PROGRESS' && ` (${tasks.filter(t => t.status === 'IN_PROGRESS').length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-12 text-center">
              <p className="font-mono text-sm text-cyan-400/40">
                {tasks.length === 0 ? 'No tasks assigned yet. Ask your responder to assign tasks.' : 'No tasks match the selected filter.'}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedTask?.id === task.id
                    ? 'bg-cyan-900/30 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-[var(--bg2)] border-[var(--border)] hover:border-cyan-500/50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="font-data text-lg text-glow-primary">{formatTaskId(task)}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${getStatusColor(task.status)}`}>
                      {task.status?.replace(/_/g, ' ')}
                    </span>
                    {task.sosId && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono border border-red-500/50 text-red-400 bg-red-500/10 animate-pulse">
                        🚨 SOS
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-cyan-500/60 flex items-center gap-1 shrink-0">
                    <ClockIcon className="w-3 h-3" /> {task.submitDate || '—'}
                  </span>
                </div>

                {task.departmentName && (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400/80 mb-2">
                    <MapPinIcon className="w-3 h-3" />
                    {task.departmentName}
                    {task.departmentAddress && <span className="text-cyan-500/40"> · {task.departmentAddress}</span>}
                  </div>
                )}

                {task.citizenName && (
                  <p className="font-mono text-xs text-gray-400">
                    Reported by: <span className="text-cyan-300">{task.citizenName}</span>
                    {task.citizenPhone && <span className="text-cyan-500/50"> · {task.citizenPhone}</span>}
                    {task.anonymous && <span className="text-yellow-400"> (Anonymous)</span>}
                  </p>
                )}

                {task.remarks && (
                  <p className="font-mono text-xs text-gray-500 mt-1 line-clamp-2 italic">"{task.remarks}"</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Task Detail Panel */}
        <div className="lg:col-span-1">
          {selectedTask ? (
            <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-5 sticky top-6 space-y-4">
              <h2 className="font-title text-lg text-glow-primary border-b border-cyan-500/20 pb-2">TASK DETAILS</h2>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <p className="text-cyan-500/50 text-[9px] mb-0.5">TASK ID</p>
                  <p className="text-cyan-200">{formatTaskId(selectedTask)}</p>
                </div>
                <div>
                  <p className="text-cyan-500/50 text-[9px] mb-0.5">PRIORITY</p>
                  <span className={`px-2 py-0.5 rounded text-[9px] border ${getPriorityColor(selectedTask.priority)}`}>{selectedTask.priority}</span>
                </div>
                <div>
                  <p className="text-cyan-500/50 text-[9px] mb-0.5">STATUS</p>
                  <span className={`px-2 py-0.5 rounded text-[9px] border ${getStatusColor(selectedTask.status)}`}>{selectedTask.status?.replace(/_/g, ' ')}</span>
                </div>
                <div>
                  <p className="text-cyan-500/50 text-[9px] mb-0.5">SUBMITTED</p>
                  <p className="text-cyan-200">{formatDate(selectedTask.submitDate, selectedTask.submitTime) || '—'}</p>
                </div>
              </div>

              {selectedTask.departmentName && (
                <div>
                  <p className="text-cyan-500/50 text-[9px] font-mono mb-1">DEPARTMENT</p>
                  <p className="font-mono text-sm text-cyan-200">{selectedTask.departmentName}</p>
                  {selectedTask.departmentAddress && <p className="font-mono text-xs text-cyan-400/60">{selectedTask.departmentAddress}</p>}
                </div>
              )}

              {selectedTask.citizenName && (
                <div>
                  <p className="text-cyan-500/50 text-[9px] font-mono mb-1">REPORTED BY</p>
                  <p className="font-mono text-sm text-cyan-200">{selectedTask.citizenName} {selectedTask.anonymous && '(Anonymous)'}</p>
                  {selectedTask.citizenPhone && <p className="font-mono text-xs text-cyan-400/60">{selectedTask.citizenPhone}</p>}
                </div>
              )}

              {selectedTask.responderName && (
                <div>
                  <p className="text-cyan-500/50 text-[9px] font-mono mb-1">ASSIGNED BY</p>
                  <p className="font-mono text-sm text-cyan-200">{selectedTask.responderName}</p>
                </div>
              )}

              {selectedTask.assignedDate && (
                <div>
                  <p className="text-cyan-500/50 text-[9px] font-mono mb-1">ASSIGNED ON</p>
                  <p className="font-mono text-xs text-cyan-200">{formatDate(selectedTask.assignedDate, selectedTask.assignedTime)}</p>
                </div>
              )}

              {selectedTask.acceptedDate && (
                <div>
                  <p className="text-cyan-500/50 text-[9px] font-mono mb-1">ACCEPTED ON</p>
                  <p className="font-mono text-xs text-cyan-200">{formatDate(selectedTask.acceptedDate, selectedTask.acceptedTime)}</p>
                </div>
              )}

              {selectedTask.remarks && (
                <div>
                  <p className="text-cyan-500/50 text-[9px] font-mono mb-1">REMARKS</p>
                  <p className="font-mono text-xs text-gray-300 bg-cyan-900/10 p-2 rounded border border-cyan-500/10 leading-relaxed">{selectedTask.remarks}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[var(--border)] space-y-2">
                {actionLoading ? (
                  <div className="flex items-center justify-center gap-2 py-3 font-mono text-xs text-cyan-400">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    {selectedTask.status === 'PENDING_ACCEPTANCE' && (
                      <>
                        <button onClick={handleAccept} className="w-full py-2 bg-green-500/20 border border-green-500 rounded-lg font-mono text-sm text-green-400 hover:bg-green-500/30 transition-all flex items-center justify-center gap-2">
                          <CheckCircleIcon className="w-5 h-5" /> ACCEPT TASK
                        </button>
                        <button onClick={handleReject} className="w-full py-2 bg-red-500/20 border border-red-500 rounded-lg font-mono text-sm text-red-400 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2">
                          <XCircleIcon className="w-5 h-5" /> REJECT TASK
                        </button>
                      </>
                    )}
                    {selectedTask.status === 'IN_PROGRESS' && (
                      <>
                        <button onClick={handleProgress} className="w-full py-2 bg-blue-500/20 border border-blue-500 rounded-lg font-mono text-sm text-blue-400 hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2">
                          🔧 UPDATE PROGRESS
                        </button>
                        <button onClick={handleComplete} className="w-full py-2 bg-green-500/20 border border-green-500 rounded-lg font-mono text-sm text-green-400 hover:bg-green-500/30 transition-all flex items-center justify-center gap-2">
                          <CheckCircleIcon className="w-5 h-5" /> MARK COMPLETE
                        </button>
                        <button onClick={handleHelp} className="w-full py-2 bg-yellow-500/20 border border-yellow-500 rounded-lg font-mono text-sm text-yellow-400 hover:bg-yellow-500/30 transition-all flex items-center justify-center gap-2">
                          <ExclamationTriangleIcon className="w-5 h-5" /> REQUEST HELP
                        </button>
                      </>
                    )}
                    {(selectedTask.status === 'COMPLETED' || selectedTask.status === 'REJECTED') && (
                      <div className={`text-center py-3 font-mono text-sm ${selectedTask.status === 'COMPLETED' ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedTask.status === 'COMPLETED' ? '✅ Task Completed' : '❌ Task Rejected'} — view in History
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-8 text-center text-cyan-400/40 font-mono text-sm">
              Select a task to view details and take actions.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
}
