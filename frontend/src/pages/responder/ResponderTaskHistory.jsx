import { useEffect, useState } from 'react';
import { responderApi } from '../../services/api';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const s = styles[status] || styles.COMPLETED;
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border ${s} flex items-center gap-1`}>
      {status === 'COMPLETED' ? <CheckCircleIcon className="w-3 h-3" /> : <XCircleIcon className="w-3 h-3" />}
      {status}
    </span>
  );
};

// Task Card Component
const TaskHistoryCard = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'border-l-4 border-red-500';
      case 'CRITICAL': return 'border-l-4 border-red-600';
      case 'MEDIUM': return 'border-l-4 border-yellow-500';
      default: return 'border-l-4 border-green-500';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const responseTime = task.acceptedAt && task.createdAt 
    ? Math.round((new Date(task.acceptedAt) - new Date(task.createdAt)) / (1000 * 60))
    : null;

  const completionTime = task.completedAt && task.acceptedAt
    ? Math.round((new Date(task.completedAt) - new Date(task.acceptedAt)) / (1000 * 60 * 60))
    : null;

  return (
    <div 
      className={`bg-[var(--bg2)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30 ${getPriorityColor(task.priority)}`}
    >
      {/* Card Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-data text-md text-glow-primary">{task.title}</p>
              {task.priority === 'HIGH' && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                  HIGH
                </span>
              )}
              {task.priority === 'CRITICAL' && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-600/30 text-red-500 border border-red-600/40 animate-pulse-glow">
                  CRITICAL
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1">
                <MapPinIcon className="w-3 h-3" /> {task.locationAddress || 'Location not specified'}
              </span>
              <span className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" /> {formatDate(task.createdAt)}
              </span>
              {task.completedAt && (
                <span className="font-mono text-[9px] text-green-400/60 flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3" /> Completed: {formatDate(task.completedAt)}
                </span>
              )}
              {task.rejectionReason && (
                <span className="font-mono text-[9px] text-red-400/60 flex items-center gap-1">
                  <XCircleIcon className="w-3 h-3" /> Rejected
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <StatusBadge status={task.status} />
            <div className="mt-1 text-right">
              {isExpanded ? (
                <ChevronUpIcon className="w-4 h-4 text-cyan-400/60 inline" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-cyan-400/60 inline" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-[var(--border)] p-4 bg-gradient-to-b from-[var(--bg3)]/20 to-transparent space-y-3 animate-fadeIn">
          {/* Description */}
          {task.description && (
            <div className="p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/20">
              <p className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1 mb-1">
                <DocumentTextIcon className="w-3 h-3" /> DESCRIPTION
              </p>
              <p className="font-mono text-xs text-cyan-200 leading-relaxed">{task.description}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/20">
            <p className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1 mb-2">
              <ClockIcon className="w-3 h-3" /> TIMELINE
            </p>
            <div className="space-y-2">
              {[
                { label: 'Task Created', time: task.createdAt, icon: '📋' },
                { label: 'Task Accepted', time: task.acceptedAt, icon: '✓' },
                { label: 'Task Completed', time: task.completedAt, icon: '✅' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${step.time ? 'bg-green-400 shadow-[0_0_6px_#4ade80]' : 'bg-gray-600'}`} />
                  <span className="font-mono text-[10px] text-cyan-300 w-24">{step.label}</span>
                  {step.time ? (
                    <span className="font-mono text-[9px] text-cyan-400/60">
                      {formatDate(step.time)} at {formatTime(step.time)}
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] text-gray-500">—</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {responseTime && (
              <div className="p-2 bg-cyan-900/10 rounded-lg border border-cyan-500/20 text-center">
                <p className="font-mono text-[8px] text-cyan-400/60">RESPONSE TIME</p>
                <p className="font-data text-sm text-glow-primary">{responseTime} minutes</p>
              </div>
            )}
            {completionTime && (
              <div className="p-2 bg-cyan-900/10 rounded-lg border border-cyan-500/20 text-center">
                <p className="font-mono text-[8px] text-cyan-400/60">COMPLETION TIME</p>
                <p className="font-data text-sm text-glow-primary">{completionTime} hours</p>
              </div>
            )}
          </div>

          {/* Worker Info */}
          {task.worker && (
            <div className="p-2 bg-cyan-900/10 rounded-lg border border-cyan-500/20">
              <p className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> ASSIGNED TO
              </p>
              <p className="font-mono text-sm text-glow-primary mt-1">{task.worker}</p>
            </div>
          )}

          {/* Rejection Reason */}
          {task.rejectionReason && (
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
              <p className="font-mono text-[9px] text-red-400/60 flex items-center gap-1">
                <XCircleIcon className="w-3 h-3" /> REJECTION REASON
              </p>
              <p className="font-mono text-sm text-red-400 mt-1">{task.rejectionReason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ResponderTaskHistory() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const tasksData = await responderApi.tasks().catch(() => []);
      const completedRejected = tasksData.filter(t => t.status === 'COMPLETED' || t.status === 'REJECTED');
      setTasks(completedRejected);
      setFilteredTasks(completedRejected);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...tasks];
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title?.toLowerCase().includes(query) ||
        t.id?.toString().includes(query) ||
        t.locationAddress?.toLowerCase().includes(query) ||
        t.worker?.toLowerCase().includes(query)
      );
    }
    
    setFilteredTasks(filtered);
  }, [searchQuery, statusFilter, tasks]);

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const rejectedCount = tasks.filter(t => t.status === 'REJECTED').length;
  const avgResponseTime = tasks
    .filter(t => t.acceptedAt && t.createdAt)
    .reduce((sum, t) => sum + ((new Date(t.acceptedAt) - new Date(t.createdAt)) / (1000 * 60)), 0) / (tasks.filter(t => t.acceptedAt).length || 1);
  
  const avgCompletionTime = tasks
    .filter(t => t.completedAt && t.acceptedAt)
    .reduce((sum, t) => sum + ((new Date(t.completedAt) - new Date(t.acceptedAt)) / (1000 * 60 * 60)), 0) / (tasks.filter(t => t.completedAt).length || 1);

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
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">TASK HISTORY</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ COMPLETED & REJECTED TASKS ARCHIVE ]</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'TOTAL ARCHIVED', value: tasks.length, color: '#06b6d4', icon: '📜', change: 'All time' },
          { label: 'COMPLETED', value: completedCount, color: '#4ade80', icon: '✅', change: 'Successful' },
          { label: 'REJECTED', value: rejectedCount, color: '#ef4444', icon: '❌', change: 'Declined' },
          { label: 'AVG RESPONSE', value: Math.round(avgResponseTime), color: '#fbbf24', icon: '⏱️', suffix: ' min', change: 'Response time' },
        ].map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] animate-scaleIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-center justify-center mb-1">
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="font-data text-2xl" style={{ textShadow: `0 0 10px ${stat.color}`, color: stat.color }}>
              {stat.value}{stat.suffix || ''}
            </p>
            <p className="font-mono text-[8px] text-cyan-400/60 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
          <input
            type="text"
            className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg pl-9 pr-3 py-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all"
            placeholder="Search by task ID, title, location, or worker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'COMPLETED', 'REJECTED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg font-mono text-xs transition-all duration-300 ${
                statusFilter === filter
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                  : 'bg-cyan-900/10 text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              {filter}
              {filter !== 'ALL' && (
                <span className="ml-1 text-[9px]">
                  ({filter === 'COMPLETED' ? completedCount : rejectedCount})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="font-mono text-[9px] text-cyan-400/60">
          Showing {filteredTasks.length} of {tasks.length} archived tasks
        </p>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[9px] font-mono text-cyan-400/60 hover:text-cyan-400 transition-colors"
          >
            Clear search
          </button>
        )}
      </div>

      {/* History List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-12 text-center">
          <div className="text-6xl mb-3 opacity-40">📜</div>
          <p className="font-mono text-sm text-gray-400">No history records found</p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-block mt-3 text-xs text-cyan-400 hover:underline"
            >
              Clear search and try again →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task, idx) => (
            <div key={task.id} className="animate-slideInRight" style={{ animationDelay: `${idx * 0.03}s` }}>
              <TaskHistoryCard task={task} />
            </div>
          ))}
        </div>
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(255,42,42,0.3); }
          50% { box-shadow: 0 0 15px rgba(255,42,42,0.6); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
        .animate-pulse-glow { animation: pulse-glow 1.5s infinite; }
      `}</style>
    </div>
  );
}