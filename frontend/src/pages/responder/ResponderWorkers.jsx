import { useState, useEffect } from 'react';
import { responderApi } from '../../services/api';
import {
  UserPlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  IdentificationIcon,
  BriefcaseIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Worker Card Component
const WorkerCard = ({ worker, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Lineman': return { icon: '⚡', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' };
      case 'Technician': return { icon: '🔧', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' };
      case 'Driver': return { icon: '🚗', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' };
      case 'Inspector': return { icon: '📋', color: '#c084fc', bg: 'rgba(192,132,252,0.15)' };
      default: return { icon: '👤', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' };
    }
  };

  const roleStyle = getRoleIcon(worker.role);
  const taskProgress = Math.min(((worker.tasksCompleted || 0) / 30) * 100, 100);

  return (
    <div
      className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="text-8xl">{roleStyle.icon}</div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300"
                style={{
                  background: roleStyle.bg,
                  border: `2px solid ${roleStyle.color}`,
                  boxShadow: isHovered ? `0 0 15px ${roleStyle.color}` : 'none'
                }}
              >
                {worker.name?.charAt(0).toUpperCase() || 'W'}
              </div>
              <div>
                <p className="font-data text-md text-glow-primary">{worker.name}</p>
                <p className="font-mono text-[10px] mt-0.5 flex items-center gap-1" style={{ color: roleStyle.color }}>
                  <span>{roleStyle.icon}</span> {worker.role || 'Volunteer'}
                </p>
                <p className="font-mono text-[9px] text-cyan-400/60 mt-1 flex items-center gap-1">
                  <PhoneIcon className="w-3 h-3" /> {worker.phone}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`px-2 py-1 rounded-full text-[9px] font-mono border transition-all duration-300 ${worker.isActive !== false ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                {worker.isActive !== false ? (
                  <span className="flex items-center gap-1"><CheckCircleIcon className="w-2.5 h-2.5" /> ACTIVE</span>
                ) : (
                  <span className="flex items-center gap-1"><XCircleIcon className="w-2.5 h-2.5" /> OFFLINE</span>
                )}
              </div>
              <button
                onClick={() => onRemove(worker.username)}
                className="mt-2 text-[9px] font-mono text-red-400/60 hover:text-red-400 transition-all hover:scale-105 flex items-center gap-1"
              >
                <TrashIcon className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="border-t border-[var(--border)] p-3 space-y-2">
        {worker.cnic && (
          <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-400/60">
            <IdentificationIcon className="w-3 h-3" />
            <span>{worker.cnic}</span>
          </div>
        )}
        {worker.username && (
          <div className="flex items-center gap-2 text-[8px] font-mono text-cyan-600/50">
            <span>@{worker.username}</span>
          </div>
        )}

        {/* Tasks Progress Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-[8px] font-mono text-cyan-400/60 mb-1">
            <span className="flex items-center gap-1"><BriefcaseIcon className="w-3 h-3" /> Tasks Completed</span>
            <span>{worker.tasksCompleted || 0} / 30</span>
          </div>
          <div className="w-full bg-cyan-900/30 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-700 ease-out"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Worker Modal Component
const AddWorkerModal = ({ isOpen, onClose, onAdd, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    phone: '',
    cnic: '',
    role: 'Lineman'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.phone && !/^[0-9+\-\s]{10,15}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const username = formData.username || formData.name.toLowerCase().replace(/\s/g, '_');
    onAdd({ ...formData, username });
  };

  const handleClose = () => {
    setFormData({ username: '', name: '', phone: '', cnic: '', role: 'Lineman' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn" onClick={handleClose}>
      <div className="w-full max-w-md bg-[var(--bg2)] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-5 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-transparent">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <UserPlusIcon className="w-5 h-5 text-glow-primary" />
              <h2 className="font-title text-glow-primary text-lg tracking-wider">ADD NEW WORKER</h2>
            </div>
            <button onClick={handleClose} className="text-cyan-400/60 hover:text-cyan-400 text-2xl transition-colors">&times;</button>
          </div>
          <p className="font-mono text-[9px] text-cyan-400/60 mt-1">Add a new field team member</p>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3">
          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">USERNAME (optional)</label>
            <input
              type="text"
              className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="worker_username"
            />
          </div>

          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">FULL NAME *</label>
            <input
              type="text"
              className={`w-full bg-cyan-900/20 border rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:outline-none transition-all ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-cyan-500/30 focus:border-cyan-400'}`}
              value={formData.name}
              onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: null }); }}
              placeholder="Ahmed Ali"
            />
            {errors.name && <p className="text-red-400 text-[9px] font-mono mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">PHONE NUMBER *</label>
            <input
              type="tel"
              className={`w-full bg-cyan-900/20 border rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:outline-none transition-all ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-cyan-500/30 focus:border-cyan-400'}`}
              value={formData.phone}
              onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setErrors({ ...errors, phone: null }); }}
              placeholder="0300-1234567"
            />
            {errors.phone && <p className="text-red-400 text-[9px] font-mono mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">ROLE</label>
            <select
              className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Lineman">⚡ Lineman</option>
              <option value="Technician">🔧 Technician</option>
              <option value="Driver">🚗 Driver</option>
              <option value="Inspector">📋 Inspector</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">CNIC (Optional)</label>
            <input
              type="text"
              className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all"
              value={formData.cnic}
              onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
              placeholder="42101-1234567-8"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-cyan-500/20 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                ADDING...
              </>
            ) : (
              <>
                <UserPlusIcon className="w-4 h-4" /> ADD WORKER
              </>
            )}
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 bg-gray-500/20 border border-gray-500 rounded-lg font-mono text-sm text-gray-400 hover:bg-gray-500/30 transition-all"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ResponderWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const data = await responderApi.workers();
      setWorkers(data || []);
    } catch (error) {
      console.error('Failed to load workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorker = async (workerData) => {
    setActionInProgress(true);
    try {
      await responderApi.addWorker(workerData);
      showMessage('Worker added successfully!', 'success');
      setAdding(false);
      await loadWorkers();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to add worker. Username may already exist.', 'error');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleRemoveWorker = async (username) => {
    if (!confirm(`⚠️ Are you sure you want to remove "${username}"? This action cannot be undone.`)) return;
    
    setActionInProgress(true);
    try {
      await responderApi.removeWorker(username);
      showMessage('Worker removed successfully!', 'success');
      await loadWorkers();
    } catch (error) {
      showMessage('Failed to remove worker', 'error');
    } finally {
      setActionInProgress(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const activeCount = workers.filter(w => w.isActive !== false).length;
  const totalTasksCompleted = workers.reduce((sum, w) => sum + (w.tasksCompleted || 0), 0);
  const uniqueRoles = new Set(workers.map(w => w.role)).size;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING WORKERS... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">WORKERS</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ FIELD TEAM MANAGEMENT ]</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          disabled={actionInProgress}
          className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
        >
          <UserPlusIcon className="w-4 h-4" /> ADD WORKER
        </button>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`p-3 rounded-lg animate-slideInRight ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
          <p className={`font-mono text-xs ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message.text}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'TOTAL WORKERS', value: workers.length, color: '#06b6d4', icon: '👥', change: '+0%' },
          { label: 'ACTIVE', value: activeCount, color: '#4ade80', icon: '🟢', change: 'On Duty' },
          { label: 'ROLES', value: uniqueRoles, color: '#c084fc', icon: '🎭', change: 'Departments' },
          { label: 'TASKS DONE', value: totalTasksCompleted, color: '#fbbf24', icon: '✅', change: 'Completed' },
        ].map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] animate-scaleIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-[8px] font-mono text-cyan-400/60 tracking-wider">{stat.label}</span>
            </div>
            <p className="font-data text-2xl" style={{ textShadow: `0 0 10px ${stat.color}`, color: stat.color }}>{stat.value}</p>
            <p className="text-[8px] font-mono text-cyan-400/40 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Workers Grid */}
      {workers.length === 0 ? (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-12 text-center">
          <div className="text-6xl mb-3 opacity-40">👥</div>
          <p className="font-mono text-sm text-gray-400">No workers added yet</p>
          <button
            onClick={() => setAdding(true)}
            className="inline-block mt-4 text-sm text-cyan-400 hover:underline transition-all"
          >
            Add your first worker →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workers.map((worker, idx) => (
            <div key={worker.id || worker.username} className="animate-slideInRight" style={{ animationDelay: `${idx * 0.05}s` }}>
              <WorkerCard worker={worker} onRemove={handleRemoveWorker} />
            </div>
          ))}
        </div>
      )}

      {/* Add Worker Modal */}
      <AddWorkerModal
        isOpen={adding}
        onClose={() => setAdding(false)}
        onAdd={handleAddWorker}
        isLoading={actionInProgress}
      />

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
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
}