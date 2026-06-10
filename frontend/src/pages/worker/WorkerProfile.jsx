import { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';
import { workerApi } from '../../api/api';

const CATEGORIES = [
  'Fire Emergency', 'Medical Emergency', 'Road Accident',
  'Flood Relief', 'Earthquake Rescue', 'Animal Rescue',
  'Technical Support', 'Logistics', 'General Relief',
];

const LS_KEY = 'nexora_worker_categories';

function OnboardingCard() {
  const [selected, setSelected] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  });
  const [saved, setSaved] = useState(false);

  const toggle = (cat) => {
    setSelected(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : prev.length < 5 ? [...prev, cat] : prev
    );
    setSaved(false);
  };

  const save = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(selected));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40" />
      <h3 className="font-title text-glow-primary text-sm tracking-wider mb-1 flex items-center gap-2">
        <span>🎯</span> MY CATEGORIES
      </h3>
      <p className="font-mono text-[9px] text-cyan-400/50 mb-4">Select up to 5 areas of expertise</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(cat => {
          const on = selected.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              className={`px-3 py-1.5 rounded-full font-mono text-[10px] border transition-all duration-200 ${
                on
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.25)] scale-105'
                  : 'bg-cyan-950/20 border-cyan-900/40 text-cyan-500/50 hover:border-cyan-500/40 hover:text-cyan-300'
              }`}
            >
              {on && <span className="mr-1 text-cyan-400">✓</span>}{cat}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-cyan-400/50">{selected.length} / 5 selected</span>
        <button
          onClick={save}
          disabled={selected.length === 0}
          className={`px-4 py-1.5 rounded-lg font-mono text-xs transition-all ${
            saved
              ? 'bg-green-500/20 border border-green-500 text-green-400'
              : selected.length > 0
                ? 'bg-cyan-500/20 border border-cyan-400 text-glow-primary hover:bg-cyan-500/30'
                : 'bg-gray-700/20 border border-gray-700 text-gray-600 cursor-not-allowed'
          }`}
        >
          {saved ? '✓ SAVED' : 'SAVE CATEGORIES'}
        </button>
      </div>
    </div>
  );
}

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

export default function WorkerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await workerApi.getProfile();
      setProfile(data);
      setTempProfile({ name: data.name, email: data.email, phoneNumber: data.phoneNumber });
    } catch (err) {
      showMsg(err.message || 'Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await workerApi.updateProfile(tempProfile);
      setProfile(updated);
      setEditMode(false);
      showMsg('Profile updated successfully!', 'success');
    } catch (err) {
      showMsg(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = () => {
    if (!passwordData.current || !passwordData.new) {
      showMsg('Please fill in all password fields', 'error');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      showMsg('New passwords do not match!', 'error');
      return;
    }
    // Backend doesn't have a change-password endpoint for worker yet, show info
    showMsg('Password change not yet supported for worker portal.', 'error');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING PROFILE... ]</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="font-mono text-red-400 text-center">
          <p className="text-xl mb-2">⚠ PROFILE NOT FOUND</p>
          <p className="text-xs text-cyan-400/50 mt-2">Worker '{localStorage.getItem('nexora_worker_username') || 'worker01'}' does not exist in the database.</p>
          <button onClick={loadProfile} className="mt-4 px-4 py-2 border border-cyan-400 rounded-lg font-mono text-sm text-cyan-400 hover:bg-cyan-500/10">RETRY</button>
        </div>
      </div>
    );
  }

  const infoFields = [
    { key: 'name', label: 'FULL NAME', icon: <UserIcon className="w-6 h-6" />, placeholder: 'Enter your full name' },
    { key: 'email', label: 'EMAIL ADDRESS', icon: <EnvelopeIcon className="w-6 h-6" />, placeholder: 'your@email.com' },
    { key: 'phoneNumber', label: 'PHONE NUMBER', icon: <PhoneIcon className="w-6 h-6" />, placeholder: '+92 300 1234567' },
    { key: 'department', label: 'DEPARTMENT', icon: <BuildingOfficeIcon className="w-6 h-6" />, placeholder: 'Department' },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">PROFILE</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ WORKER ACCOUNT ]</p>
        </div>
        <div className="flex gap-3">
          {editMode ? (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg font-mono text-sm text-green-400 hover:bg-green-500/30 transition-all flex items-center gap-2">
                <CheckIcon className="w-4 h-4" /> {saving ? 'SAVING...' : 'SAVE'}
              </button>
              <button onClick={() => { setEditMode(false); setTempProfile({ name: profile.name, email: profile.email, phoneNumber: profile.phoneNumber }); }} className="px-4 py-2 bg-gray-500/20 border border-gray-500 rounded-lg font-mono text-sm text-gray-400 hover:bg-gray-500/30 transition-all flex items-center gap-2">
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
        <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
          <p className={`font-mono text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message.text}</p>
        </div>
      )}

      {/* Profile Hero */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-5 relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-3xl font-title shadow-[0_0_30px_cyan]">
          {profile.name?.charAt(0)?.toUpperCase() || 'W'}
        </div>
        <div>
          <h2 className="font-data text-xl text-glow-primary">{profile.name}</h2>
          <p className="font-mono text-xs text-cyan-400/60 mt-1 flex items-center gap-2">
            <span>@{profile.username}</span>
            <span className="text-cyan-500/40">•</span>
            <span>VOLUNTEER WORKER</span>
            <span className={`px-2 py-0.5 rounded text-[9px] border ${profile.active ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
              {profile.active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </p>
          <div className="flex items-center gap-4 mt-2 text-[9px] font-mono text-cyan-400/60">
            {profile.department && <span>🏢 {profile.department}</span>}
            {profile.memberSince && profile.memberSince !== 'N/A' && (
              <span>📅 Member since {new Date(profile.memberSince).getFullYear()}</span>
            )}
          </div>
          {profile.deptAddress && (
            <p className="font-mono text-[9px] text-cyan-400/40 mt-1">📍 {profile.deptAddress}</p>
          )}
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
            isEditing={editMode && field.key !== 'department'}
            onChange={(e) => setTempProfile({ ...tempProfile, [field.key]: e.target.value })}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      {/* Change Password + Onboarding Categories — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Change Password */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40" />
          <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
            <span>🔐</span> CHANGE PASSWORD
          </h3>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-cyan-500/30"
              value={passwordData.current}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-cyan-500/30"
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-cyan-500/30"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
            />
            <button
              onClick={handlePasswordChange}
              className="px-5 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all"
            >
              UPDATE PASSWORD
            </button>
          </div>
        </div>

        {/* Onboarding — Category Selection */}
        <OnboardingCard />

      </div>

      {/* Danger Zone */}
      <div className="bg-[var(--bg2)] border border-red-500/30 rounded-xl p-5 transition-all duration-300 hover:border-red-500/50">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="font-title text-red-400 text-sm tracking-wider flex items-center gap-2">
              <ShieldExclamationIcon className="w-5 h-5" /> DANGER ZONE
            </h3>
            <p className="font-mono text-xs text-red-400/60 mt-1">Contact support to deactivate your account</p>
          </div>
          <button
            onClick={() => showMsg('Please contact support to deactivate your account.', 'error')}
            className="px-5 py-2 bg-red-500/20 border border-red-500 rounded-lg font-mono text-sm text-red-400 hover:bg-red-500/30 transition-all hover:scale-105 flex items-center gap-2"
          >
            DEACTIVATE ACCOUNT
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
