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
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

// ========== WORKER CARD ==========
const WorkerCard = ({ worker, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Lineman': return { icon: '⚡', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' };
      case 'Technician': return { icon: '🔧', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' };
      case 'Driver': return { icon: '🚗', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' };
      case 'Inspector': return { icon: '📋', color: '#c084fc', bg: 'rgba(192,132,252,0.15)' };
      default: return { icon: '👤', color: '#06b6d4', bg: 'rgba(0, 0, 0, 1)' };
    }
  };

  const roleStyle = getRoleIcon(worker.role);
  const taskProgress = Math.min(((worker.tasksCompleted || 0) / 30) * 100, 100);

  const handleCopyPassword = () => {
    if (worker.password) {
      navigator.clipboard.writeText(worker.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Get correct username - handle both field names
  const workerUsername = worker.username || worker.usernameCreated || '';

  return (
    <div
      className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:-translate-y-1 relative z-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <div className="text-8xl">{roleStyle.icon}</div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              {/* Profile Picture or Initial */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 overflow-hidden flex-shrink-0"
                style={{
                  background: worker.profilePic ? 'transparent' : roleStyle.bg,
                  border: `2px solid ${roleStyle.color}`,
                  boxShadow: isHovered ? `0 0 15px ${roleStyle.color}` : 'none'
                }}
              >
                {worker.profilePic ? (
                  <img 
                    src={worker.profilePic.startsWith('http') ? worker.profilePic : `http://localhost:8080${worker.profilePic}`}
                    alt={worker.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerText = worker.name?.charAt(0).toUpperCase() || 'W';
                    }}
                  />
                ) : (
                  worker.name?.charAt(0).toUpperCase() || 'W'
                )}
              </div>
              <div className="min-w-0">
                <p className="font-data text-md text-glow-primary truncate">{worker.name}</p>
                <p className="font-mono text-[10px] mt-0.5 flex items-center gap-1" style={{ color: roleStyle.color }}>
                  <span>{roleStyle.icon}</span> {worker.role || 'Volunteer'}
                </p>
                <p className="font-mono text-[9px] text-cyan-400/60 mt-1 flex items-center gap-1">
                  <PhoneIcon className="w-3 h-3 flex-shrink-0" /> {worker.phone}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <div className={`px-2 py-1 rounded-full text-[9px] font-mono border transition-all duration-300 ${worker.isActive !== false ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                {worker.isActive !== false ? (
                  <span className="flex items-center gap-1"><CheckCircleIcon className="w-2.5 h-2.5 flex-shrink-0" /> ACTIVE</span>
                ) : (
                  <span className="flex items-center gap-1"><XCircleIcon className="w-2.5 h-2.5 flex-shrink-0" /> OFFLINE</span>
                )}
              </div>

              {/* ✅ FIXED REMOVE BUTTON - proper z-index and pointer-events */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔴 Remove clicked for:', workerUsername);
                  if (workerUsername) {
                    onRemove(workerUsername);
                  } else {
                    console.error('❌ No username found for worker:', worker);
                    alert('Error: Worker username not found');
                  }
                }}
                className="mt-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-[10px] font-mono text-red-400/80 hover:text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer relative z-10"
                style={{ pointerEvents: 'auto' }}
              >
                <TrashIcon className="w-3.5 h-3.5 flex-shrink-0" /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="border-t border-[var(--border)] p-3 space-y-2">
        {/* Username */}
        {workerUsername && (
          <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-400/60">
            <IdentificationIcon className="w-3 h-3 flex-shrink-0" />
            <span>@{workerUsername}</span>
          </div>
        )}

        {/* Password Display */}
        {worker.password && (
          <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-400/60 bg-cyan-900/10 rounded-lg p-2 border border-cyan-500/20">
            <span className="text-cyan-400/40 flex-shrink-0">Password:</span>
            <span className="text-cyan-300 font-mono tracking-wider truncate">
              {showPassword ? worker.password : '•'.repeat(worker.password.length)}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
              className="p-1 hover:bg-cyan-500/20 rounded transition-colors flex-shrink-0"
              title={showPassword ? 'Hide' : 'Show'}
            >
              {showPassword ? <EyeSlashIcon className="w-3 h-3 text-cyan-400" /> : <EyeIcon className="w-3 h-3 text-cyan-400" />}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleCopyPassword(); }}
              className="p-1 hover:bg-cyan-500/20 rounded transition-colors flex-shrink-0"
              title="Copy"
            >
              {copied ? <CheckIcon className="w-3 h-3 text-green-400" /> : <ClipboardDocumentIcon className="w-3 h-3 text-cyan-400" />}
            </button>
          </div>
        )}

        {/* Email */}
        {worker.email && (
          <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-400/60">
            <span className="text-cyan-400/40 flex-shrink-0">Email:</span>
            <span className="truncate">{worker.email}</span>
          </div>
        )}

        {/* Tasks Progress Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-[8px] font-mono text-cyan-400/60 mb-1">
            <span className="flex items-center gap-1"><BriefcaseIcon className="w-3 h-3 flex-shrink-0" /> Tasks Completed</span>
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

// ========== ADD WORKER MODAL ==========
const AddWorkerModal = ({ isOpen, onClose, onAdd, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    phone: '',
    password: '',
    email: '',
    role: 'Lineman'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};

    // Username - required
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

    // Name - required
    if (!formData.name.trim()) newErrors.name = 'Full name is required';

    // Phone - required
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number format';

    // Password - required, min 6 chars
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    // Role - required (always has value from select)

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ username: true, name: true, phone: true, password: true, role: true });
      return;
    }
    onAdd({ ...formData });
  };

  const handleClose = () => {
    setFormData({ username: '', name: '', phone: '', password: '', email: '', role: 'Lineman' });
    setErrors({});
    setTouched({});
    setShowPassword(false);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const newErrors = validate();
      setErrors(newErrors);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const newErrors = validate();
    setErrors(newErrors);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn" onClick={handleClose}>
      <div 
        className="w-full max-w-md max-h-[90vh] bg-[var(--bg2)] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="p-5 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-transparent flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <UserPlusIcon className="w-5 h-5 text-glow-primary" />
              <h2 className="font-title text-glow-primary text-lg tracking-wider">ADD NEW WORKER</h2>
            </div>
            <button onClick={handleClose} className="text-cyan-400/60 hover:text-cyan-400 text-2xl transition-colors">&times;</button>
          </div>
          <p className="font-mono text-[9px] text-cyan-400/60 mt-1">Fields marked with <span className="text-red-400">*</span> are required</p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
          {/* Username - Required */}
          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">
              USERNAME <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={`w-full bg-cyan-900/20 border rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:outline-none transition-all ${
                errors.username && touched.username ? 'border-red-500/50 focus:border-red-500' : 'border-cyan-500/30 focus:border-cyan-400'
              }`}
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              placeholder="worker_username"
            />
            {errors.username && touched.username && (
              <p className="text-red-400 text-[9px] font-mono mt-1">{errors.username}</p>
            )}
          </div>

          {/* Full Name - Required */}
          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">
              FULL NAME <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={`w-full bg-cyan-900/20 border rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:outline-none transition-all ${
                errors.name && touched.name ? 'border-red-500/50 focus:border-red-500' : 'border-cyan-500/30 focus:border-cyan-400'
              }`}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Full Name"
            />
            {errors.name && touched.name && (
              <p className="text-red-400 text-[9px] font-mono mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone - Required */}
          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">
              PHONE NUMBER <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              className={`w-full bg-cyan-900/20 border rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:outline-none transition-all ${
                errors.phone && touched.phone ? 'border-red-500/50 focus:border-red-500' : 'border-cyan-500/30 focus:border-cyan-400'
              }`}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="0300-1234567"
            />
            {errors.phone && touched.phone && (
              <p className="text-red-400 text-[9px] font-mono mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password - Required */}
          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">
              PASSWORD <span className="text-red-400">*</span> <span className="text-cyan-400/40">(min 6 characters)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`w-full bg-cyan-900/20 border rounded-lg p-2.5 pr-10 font-mono text-sm text-cyan-200 focus:outline-none transition-all ${
                  errors.password && touched.password ? 'border-red-500/50 focus:border-red-500' : 'border-cyan-500/30 focus:border-cyan-400'
                }`}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Min 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-cyan-500/20 rounded transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-4 h-4 text-cyan-400/60" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-cyan-400/60" />
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-red-400 text-[9px] font-mono mt-1">{errors.password}</p>
            )}
          </div>

          {/* Role - Required */}
          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">
              ROLE <span className="text-red-400">*</span>
            </label>
            <select
              className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
            >
              <option value="Lineman">⚡ Lineman</option>
              <option value="Technician">🔧 Technician</option>
              <option value="Driver">🚗 Driver</option>
              <option value="Inspector">📋 Inspector</option>
            </select>
          </div>

          {/* Email - Optional */}
          <div>
            <label className="block font-mono text-[9px] text-cyan-400/60 mb-1">
              EMAIL <span className="text-cyan-400/40">(optional)</span>
            </label>
            <input
              type="email"
              className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="volunteer@example.com"
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-5 border-t border-cyan-500/20 flex gap-3 flex-shrink-0 bg-[var(--bg2)]">
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

// ========== MAIN COMPONENT ==========
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
      console.log('🔵 Loaded workers:', data);
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
      showMessage('✅ Worker added successfully! Credentials saved.', 'success');
      setAdding(false);
      await loadWorkers();
    } catch (error) {
      console.error('Failed to add worker:', error);
      showMessage(error.response?.data?.message || '❌ Failed to add worker. Username may already exist.', 'error');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleRemoveWorker = async (username) => {
    console.log('🔴 handleRemoveWorker called with:', username);

    if (!username) {
      console.error('❌ No username provided');
      showMessage('❌ Error: Worker username not found', 'error');
      return;
    }

    if (!confirm(`⚠️ Permanently delete "${username}"?\n\nThis action cannot be undone. They will lose all access.`)) return;

    setActionInProgress(true);
    try {
      console.log('🔴 Calling API to remove:', username);
      await responderApi.removeWorker(username);
      showMessage('✅ Worker permanently deleted! Account removed from system.', 'success');
      await loadWorkers();
    } catch (error) {
      console.error('Failed to remove worker:', error);
      showMessage('❌ Failed to delete worker', 'error');
    } finally {
      setActionInProgress(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
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
            <div key={worker.id || worker.username || worker.usernameCreated || idx} className="animate-slideInRight" style={{ animationDelay: `${idx * 0.05}s` }}>
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

      {/* Animations + Scrollbar CSS */}
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

        /* Custom Cyan Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(6, 182, 212, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.7);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(6, 182, 212, 0.4) rgba(6, 182, 212, 0.1);
        }
      `}</style>
    </div>
  );
}