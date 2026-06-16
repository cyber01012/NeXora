import { useState, useEffect } from 'react';
import { responderApi } from '../../services/api';
import { useAuth } from "../../context/AuthContext";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CheckBadgeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

// Stat Card Component
const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] group">
    <div className="flex items-center justify-center mb-1">
      <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
    </div>
    <p className="font-data text-2xl mt-1" style={{ textShadow: `0 0 10px ${color}`, color }}>{value}</p>
    <p className="font-mono text-[8px] text-cyan-400/60 mt-1 tracking-wider">{label}</p>
  </div>
);

// Info Field Component
const InfoField = ({ label, value, icon, isEditing, onChange, placeholder }) => (
  <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
    <div className="flex gap-3">
      <div className="text-2xl text-cyan-400">{icon}</div>
      <div className="flex-1">
        <p className="font-mono text-[9px] text-cyan-400/60 uppercase tracking-wider">{label}</p>
        {isEditing ? (
          <input
            type="text"
            className="w-full mt-1 bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all"
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
          />
        ) : (
          <p className="font-mono text-sm text-cyan-200 mt-1">{value || 'Not provided'}</p>
        )}
      </div>
    </div>
  </div>
);

export default function ResponderProfile() {
  const { user } = useAuth(); // ✅ ADD THIS
  const [profile, setProfile] = useState({
    username: '',
    name: '',
    email: '',
    phoneNumber: '',
    department: '',
    designation: '',
    category: '',
    memberSince: ''
  });
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [online, setOnline] = useState(true);

  useEffect(() => {
    loadProfile();
    loadStats();
  }, [user]);

  const loadProfile = async () => {
  try {

    // 1. Get responder-specific data (department, designation, etc.)
    const data = await responderApi.getProfile();
    
    // 2. Get masked phone from auth context (properly decrypted)
    const authPhone = user?.maskedPhone || 'Not provided';

    // ✅ USE AUTH USER FIRST (already has decrypted masked values)
     setProfile({
      username: data.username || user?.identifier || '',
      name: data.name || user?.displayName || '',
      email: data.email || user?.email || '',
      phoneNumber: authPhone,  // ✅ From auth context (decrypted masked)
      department: data.department || 'Not Assigned',  // ✅ From responder API
      designation: data.designation || 'Focal Person',  // ✅ From responder API
      category: data.category || 'GOV',                   // ✅ From responder API
      memberSince: data.memberSince || '2024-01-01'
    });
    
    setTempProfile({
      name: data.name || user?.displayName || '',
      email: data.email || user?.email || '',
      phoneNumber: authPhone,
      department: data.department || '',
      designation: data.designation || ''
    });
    
  } catch (error) {
    console.error('Failed to load profile:', error);

    // const data = await responderApi.getProfile();
    // console.log('Profile data from API:', data);  // Debug log
    
  //   setProfile({
  //     username: data.username || '',
  //     name: data.name || '',
  //     email: data.email || '',
  //     phoneNumber: data.phoneNumber || data.contactNumber || '',
  //     department: data.department || 'Not Assigned',  // Should be "K-Electric"
  //     designation: data.designation || 'Focal Person',
  //     category: data.category || 'GOV',
  //     memberSince: data.memberSince || '2024-01-01'
  //   });
  //   setTempProfile({
  //     name: data.name || '',
  //     email: data.email || '',
  //     phoneNumber: data.phoneNumber || data.contactNumber || '',
  //     department: data.department || '',
  //     designation: data.designation || 'Focal Person'
  //   });
  // } catch (error) {
  //   console.error('Failed to load profile:', error);
    // Fallback to localStorage or mock
    const savedDept = localStorage.getItem('nexora_department_name') || 'K-Electric';
    setProfile({
      username: user?.identifier || 'kelectric_fp',
      name: user?.displayName || 'Ahmed Raza',
      email: user?.email || 'ahmed@kelectric.com',
      phoneNumber: user?.maskedPhone || '+92 300 1111111',
      department: savedDept,
      designation: 'Focal Person',
      category: 'GOV',
      memberSince: '2024-01-15'
    });
    
    setTempProfile({
      name: user?.displayName || '',
      email: user?.email || '',
      phoneNumber: user?.maskedPhone || '',
      department: savedDept,
      designation: 'Focal Person'
    });
  } finally {
    setLoading(false);
  }
};

  const loadStats = async () => {
    try {
      const data = await responderApi.performance();
      setStats({
        totalTasks: data.totalTasks || 0,
        completedTasks: data.completedTasks || 0,
        pendingTasks: data.pendingTasks || 0,
        rating: data.rating || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await responderApi.updateProfile(tempProfile);
      setProfile({ ...profile, ...tempProfile });
      setEditMode(false);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvailability = async () => {
    try {
      await responderApi.availability(!online);
      setOnline(!online);
      setMessage({ text: `You are now ${!online ? 'ONLINE' : 'OFFLINE'}`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const infoFields = [
    { key: 'name', label: 'FULL NAME', icon: <UserIcon className="w-6 h-6" />, placeholder: 'Enter your full name' },
    { key: 'email', label: 'EMAIL ADDRESS', icon: <EnvelopeIcon className="w-6 h-6" />, placeholder: 'your@email.com' },
    { key: 'phoneNumber', label: 'PHONE NUMBER', icon: <PhoneIcon className="w-6 h-6" />, placeholder: '+92 300 1234567' },
    { key: 'department', label: 'DEPARTMENT', icon: <BuildingOfficeIcon className="w-6 h-6" />, placeholder: 'Department name' },
    { key: 'designation', label: 'DESIGNATION', icon: <CheckBadgeIcon className="w-6 h-6" />, placeholder: 'Focal Person' },
  ];

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING PROFILE... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">PROFILE</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ DEPARTMENT ACCOUNT ]</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAvailability}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 hover:scale-105 ${
              online ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-gray-500/20 border border-gray-500 text-gray-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            {online ? '🟢 ONLINE' : '🔴 OFFLINE'}
          </button>
          {editMode ? (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg font-mono text-sm text-green-400 hover:bg-green-500/30 transition-all flex items-center gap-2">
                <CheckIcon className="w-4 h-4" /> {saving ? 'SAVING...' : 'SAVE'}
              </button>
              <button onClick={() => { setEditMode(false); setTempProfile(profile); }} className="px-4 py-2 bg-gray-500/20 border border-gray-500 rounded-lg font-mono text-sm text-gray-400 hover:bg-gray-500/30 transition-all flex items-center gap-2">
                <XMarkIcon className="w-4 h-4" /> CANCEL
              </button>
            </div>
          ) : (
            <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all flex items-center gap-2">
              <PencilIcon className="w-4 h-4" /> EDIT PROFILE
            </button>
          )}
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`p-3 rounded-lg animate-slideInRight ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
          <p className={`font-mono text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message.text}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="TOTAL TASKS" value={stats.totalTasks} color="#06b6d4" icon="📋" />
        <StatCard label="COMPLETED" value={stats.completedTasks} color="#4ade80" icon="✅" />
        <StatCard label="PENDING" value={stats.pendingTasks} color="#fbbf24" icon="⏳" />
        <StatCard label="RATING" value={stats.rating.toFixed(1)} color="#fbbf24" icon="⭐" suffix="★" />
      </div>

      {/* Completion Rate Card */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <p className="font-mono text-[9px] text-cyan-400/60">COMPLETION RATE</p>
            <p className="font-data text-3xl text-glow-primary">{completionRate}%</p>
          </div>
          <div className="flex-1 min-w-[150px]">
            <div className="w-full bg-cyan-900/30 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-1000 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-cyan-400/60">{stats.completedTasks} / {stats.totalTasks} tasks</p>
          </div>
        </div>
      </div>

      {/* Profile Hero - Claude Style */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="text-8xl">⚡</div>
        </div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-3xl font-title shadow-[0_0_30px_cyan]">
          {profile.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="font-data text-xl text-glow-primary">{profile.name}</h2>
          <p className="font-mono text-xs text-cyan-400/60 mt-1 flex items-center gap-2">
            <span>@{profile.username}</span>
            <span className="text-cyan-500/40">•</span>
            <span>{profile.designation || 'Focal Person'}</span>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${profile.category === 'GOV' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
              {profile.category || 'GOV'}
            </div>
            <div className="text-[9px] font-mono text-cyan-400/60">
              Member since {new Date(profile.memberSince).getFullYear() || '2024'}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoFields.map((field) => (
          <InfoField
            key={field.key}
            label={field.label}
            value={editMode ? tempProfile[field.key] : profile[field.key]}
            icon={field.icon}
            isEditing={editMode}
            onChange={(e) => setTempProfile({ ...tempProfile, [field.key]: e.target.value })}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-[var(--bg2)] border border-red-500/30 rounded-xl p-5 transition-all duration-300 hover:border-red-500/50">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="font-title text-red-400 text-sm tracking-wider flex items-center gap-2">
              <ShieldExclamationIcon className="w-5 h-5" /> DANGER ZONE
            </h3>
            <p className="font-mono text-xs text-red-400/60 mt-1">Permanently delete your account and all associated data</p>
          </div>
          <button
            onClick={() => {
              if (confirm('⚠️ Are you sure? This action cannot be undone! All your data will be permanently deleted.')) {
                alert('Account deletion requested. Admin will contact you.');
              }
            }}
            className="px-5 py-2 bg-red-500/20 border border-red-500 rounded-lg font-mono text-sm text-red-400 hover:bg-red-500/30 transition-all hover:scale-105 flex items-center gap-2"
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
}