import { useState, useEffect } from 'react';
import { citizenApi } from '../../services/api';
import { useAuth } from "../../context/AuthContext";

export default function CitizenProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    cnic: '',
    address: '',
    city: ''
  });
  const [stats, setStats] = useState({ totalReports: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  

  useEffect(() => {
    loadProfile();
    loadStats();
  }, [user]);

  const loadProfile = async () => {
    try {

      // Option A: Use auth context user directly (RECOMMENDED)
    if (user) {
      setProfile({
        fullName: user.displayName || '',
        email: user.email || '',
        phone: user.maskedPhone || 'Not provided',
        cnic: user.maskedCnic || 'Not provided',
        address: user.address || '',  // if available
        city: user.city || ''         // if available
      });
      setTempProfile({
        fullName: user.displayName || '',
        email: user.email || '',
        phone: user.maskedPhone || '',
        cnic: user.maskedCnic || '',
        address: user.address || '',
        city: user.city || ''
      });
      setLoading(false);
      return;
    }
    
      const data = await citizenApi.getProfile();
      setProfile(data);
      setTempProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Mock data for demo
      setProfile({
        fullName: 'Ali Raza',
        email: 'ali.raza@nexora.com',
        phone: '+92 300 1234567',
        cnic: '42101-1234567-8',
        address: 'Korangi-2, Street 5, Karachi',
        city: 'Karachi'
      });
      setTempProfile({
        fullName: 'Ali Raza',
        email: 'ali.raza@nexora.com',
        phone: '+92 300 1234567',
        cnic: '42101-1234567-8',
        address: 'Korangi-2, Street 5, Karachi',
        city: 'Karachi'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await citizenApi.getStats();
      setStats({
        totalReports: data.totalReports || 0,
        pending: data.pending || 0,
        completed: data.completed || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await citizenApi.updateProfile(tempProfile);
      setProfile(tempProfile);
      setEditMode(false);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setMessage({ text: 'New passwords do not match!', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }
    if (passwordData.new.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    try {
      await citizenApi.changePassword({
        currentPassword: passwordData.current,
        newPassword: passwordData.new
      });
      setMessage({ text: 'Password changed successfully!', type: 'success' });
      setPasswordData({ current: '', new: '', confirm: '' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to change password', type: 'error' });
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('⚠️ Are you sure? This cannot be undone!')) {
      alert('Account deletion requested');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="font-mono text-cyan-400 animate-pulse">[ LOADING PROFILE... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">PROFILE</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ ACCOUNT SETTINGS ]</p>
        </div>
        {editMode ? (
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg text-sm text-green-400">
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
            <button onClick={() => { setEditMode(false); setTempProfile(profile); }} className="px-4 py-2 bg-gray-500/20 border border-gray-500 rounded-lg text-sm text-gray-400">
              CANCEL
            </button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg text-sm text-glow-primary">
            ✎ EDIT PROFILE
          </button>
        )}
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-red-500/20 border border-red-500 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="text-[9px] text-gray-500">TOTAL REPORTS</p>
          <p className="text-2xl text-glow-primary">{stats.totalReports}</p>
        </div>
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="text-[9px] text-gray-500">PENDING</p>
          <p className="text-2xl text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center">
          <p className="text-[9px] text-gray-500">COMPLETED</p>
          <p className="text-2xl text-green-400">{stats.completed}</p>
        </div>
      </div>

      {/* Profile Hero */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-2xl font-title shadow-[0_0_20px_cyan]">
          {profile.fullName?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="font-data text-lg text-glow-primary">{profile.fullName}</h2>
          <p className="font-mono text-xs text-cyan-400/60 mt-1">Citizen ID: CTZ-{Math.floor(Math.random() * 10000)}</p>
        </div>
      </div>

      {/* Profile Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'fullName', label: 'FULL NAME', icon: '👤' },
          { key: 'email', label: 'EMAIL', icon: '📧' },
          { key: 'phone', label: 'PHONE', icon: '📞' },
          { key: 'cnic', label: 'CNIC', icon: '🪪' },
          { key: 'address', label: 'ADDRESS', icon: '🏠' },
          { key: 'city', label: 'CITY', icon: '📍' },
        ].map((field) => (
          <div key={field.key} className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex gap-3">
              <div className="text-2xl">{field.icon}</div>
              <div className="flex-1">
                <p className="font-mono text-[9px] text-cyan-400/60 uppercase">{field.label}</p>
                {editMode ? (
                  <input
                    type="text"
                    className="w-full mt-1 bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2 text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none"
                    value={tempProfile[field.key] || ''}
                    onChange={(e) => setTempProfile({ ...tempProfile, [field.key]: e.target.value })}
                  />
                ) : (
                  <p className="font-mono text-sm text-cyan-200 mt-1">{profile[field.key] || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Change Password Section
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="font-title text-glow-primary text-sm mb-4">🔐 CHANGE PASSWORD</h3>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2 text-sm text-cyan-200"
            value={passwordData.current}
            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2 text-sm text-cyan-200"
            value={passwordData.new}
            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2 text-sm text-cyan-200"
            value={passwordData.confirm}
            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
          />
          <button
            onClick={handlePasswordChange}
            className="w-full py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg text-sm text-glow-primary"
          >
            UPDATE PASSWORD
          </button>
        </div>
      </div> */}

      {/* Danger Zone */}
      <div className="bg-[var(--bg2)] border border-red-500/30 rounded-xl p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-red-400">⚠️ Delete Account</p>
            <p className="text-[9px] text-red-400/60">Permanently delete your account and all data</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg text-xs text-red-400"
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}




// with notification
// import { useState, useEffect } from 'react';
// import { citizenApi } from '../../services/api';

// // Profile Icon Component
// const ProfileIcon = ({ initial, size = 'lg' }) => {
//   const sizeClasses = size === 'lg' ? 'w-24 h-24 text-4xl' : 'w-10 h-10 text-xl';
//   return (
//     <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center font-title shadow-[0_0_30px_cyan]`}>
//       {initial}
//     </div>
//   );
// };

// // Info Card Component
// const InfoCard = ({ icon, label, value, isEditing, onChange, placeholder }) => (
//   <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/30">
//     <div className="flex items-start gap-3">
//       <div className="text-2xl">{icon}</div>
//       <div className="flex-1">
//         <p className="font-mono text-[9px] text-cyan-400/60 uppercase tracking-wider">{label}</p>
//         {isEditing ? (
//           <input
//             type="text"
//             className="w-full mt-1 bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all"
//             value={value || ''}
//             onChange={onChange}
//             placeholder={placeholder}
//           />
//         ) : (
//           <p className="font-mono text-sm text-cyan-200 mt-1">{value || 'Not provided'}</p>
//         )}
//       </div>
//     </div>
//   </div>
// );

// // Stats Card Component
// const StatCard = ({ label, value, color, icon }) => (
//   <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center hover:border-cyan-500/30 transition-all duration-300">
//     <div className="flex items-center justify-center gap-2 mb-1">
//       <span className="text-lg">{icon}</span>
//       <span className="font-mono text-[9px] text-gray-500">{label}</span>
//     </div>
//     <p className="font-data text-2xl" style={{ color }}>{value}</p>
//   </div>
// );

// export default function CitizenProfile() {
//   const [profile, setProfile] = useState({
//     id: null,
//     fullName: '',
//     email: '',
//     phone: '',
//     cnic: '',
//     address: '',
//     city: '',
//     memberSince: ''
//   });
//   const [stats, setStats] = useState({
//     totalReports: 0,
//     pending: 0,
//     completed: 0,
//     responseRate: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [tempProfile, setTempProfile] = useState({});
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

//   useEffect(() => {
//     loadProfile();
//     loadStats();
//   }, []);

//   const loadProfile = async () => {
//     try {
//       const data = await citizenApi.getProfile();
//       setProfile(data);
//       setTempProfile(data);
//     } catch (error) {
//       console.error('Failed to load profile:', error);
//       // Mock data for demo if API fails
//       setProfile({
//         id: 1,
//         fullName: 'Ali Raza',
//         email: 'ali.raza@nexora.com',
//         phone: '+92 300 1234567',
//         cnic: '42101-1234567-8',
//         address: 'Korangi-2, Street 5, Karachi',
//         city: 'Karachi',
//         memberSince: '2024-01-15'
//       });
//       setTempProfile({
//         fullName: 'Ali Raza',
//         email: 'ali.raza@nexora.com',
//         phone: '+92 300 1234567',
//         cnic: '42101-1234567-8',
//         address: 'Korangi-2, Street 5, Karachi',
//         city: 'Karachi'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadStats = async () => {
//     try {
//       const data = await citizenApi.getStats();
//       setStats({
//         totalReports: data.totalReports || 0,
//         pending: data.pending || 0,
//         completed: data.completed || 0,
//         responseRate: data.totalReports > 0 ? Math.round((data.completed / data.totalReports) * 100) : 0
//       });
//     } catch (error) {
//       console.error('Failed to load stats:', error);
//       setStats({ totalReports: 0, pending: 0, completed: 0, responseRate: 0 });
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setMessage({ text: '', type: '' });
//     try {
//       await citizenApi.updateProfile(tempProfile);
//       setProfile({ ...profile, ...tempProfile });
//       setEditMode(false);
//       setMessage({ text: 'Profile updated successfully!', type: 'success' });
//       setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//     } catch (error) {
//       setMessage({ text: 'Failed to update profile', type: 'error' });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handlePasswordChange = async () => {
//     if (passwordData.new !== passwordData.confirm) {
//       setMessage({ text: 'New passwords do not match!', type: 'error' });
//       setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//       return;
//     }
//     if (passwordData.new.length < 6) {
//       setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
//       setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//       return;
//     }
//     try {
//       await citizenApi.changePassword({
//         currentPassword: passwordData.current,
//         newPassword: passwordData.new
//       });
//       setMessage({ text: 'Password changed successfully!', type: 'success' });
//       setPasswordData({ current: '', new: '', confirm: '' });
//       setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//     } catch (error) {
//       setMessage({ text: 'Failed to change password', type: 'error' });
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (confirm('⚠️ Are you sure? This action cannot be undone! All your data will be permanently deleted.')) {
//       try {
//         // await citizenApi.deleteAccount();
//         setMessage({ text: 'Account deletion requested. Admin will contact you.', type: 'success' });
//       } catch (error) {
//         setMessage({ text: 'Failed to delete account', type: 'error' });
//       }
//     }
//   };

//   const infoFields = [
//     { key: 'fullName', label: 'FULL NAME', icon: '👤', placeholder: 'Enter your full name' },
//     { key: 'email', label: 'EMAIL ADDRESS', icon: '📧', placeholder: 'your@email.com' },
//     { key: 'phone', label: 'PHONE NUMBER', icon: '📞', placeholder: '0300-1234567' },
//     { key: 'cnic', label: 'CNIC', icon: '🪪', placeholder: '42101-1234567-8' },
//     { key: 'address', label: 'ADDRESS', icon: '🏠', placeholder: 'Street, area, city' },
//     { key: 'city', label: 'CITY', icon: '📍', placeholder: 'Karachi' },
//   ];

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 gap-4">
//         <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
//         <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING PROFILE... ]</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="font-title text-glow-primary text-2xl tracking-wider">PROFILE</h1>
//           <p className="font-mono text-xs text-cyan-500/60 mt-1">[ ACCOUNT MANAGEMENT ]</p>
//         </div>
//         {editMode ? (
//           <div className="flex gap-3">
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="px-5 py-2 bg-green-500/20 border border-green-500 rounded-lg font-mono text-sm text-green-400 hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
//             >
//               {saving ? 'SAVING...' : '✓ SAVE CHANGES'}
//             </button>
//             <button
//               onClick={() => { setEditMode(false); setTempProfile(profile); }}
//               className="px-5 py-2 bg-gray-500/20 border border-gray-500 rounded-lg font-mono text-sm text-gray-400 hover:bg-gray-500/30 transition-all"
//             >
//               ✕ CANCEL
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={() => setEditMode(true)}
//             className="px-5 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all duration-300 hover:scale-[1.02]"
//           >
//             ✎ EDIT PROFILE
//           </button>
//         )}
//       </div>

//       {/* Message Toast */}
//       {message.text && (
//         <div className={`p-3 rounded-lg animate-fadeIn ${
//           message.type === 'success' 
//             ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
//             : 'bg-red-500/20 border border-red-500/50 text-red-400'
//         }`}>
//           <p className="font-mono text-sm">{message.text}</p>
//         </div>
//       )}

//       {/* Profile Hero - Claude Style */}
//       <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-6 relative overflow-hidden">
//         <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
//         <div className="flex items-center gap-6 flex-wrap">
//           <ProfileIcon initial={profile.fullName?.charAt(0) || 'U'} size="lg" />
//           <div className="flex-1">
//             <h2 className="font-data text-2xl text-glow-primary">{profile.fullName || 'Citizen User'}</h2>
//             <p className="font-mono text-sm text-cyan-400/70 mt-1">Citizen ID: CTZ-{profile.id || Math.floor(Math.random() * 10000)}</p>
//             <div className="flex items-center gap-3 mt-3 flex-wrap">
//               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
//                 <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
//                 <span className="font-mono text-[9px] text-green-400 tracking-wider">ACTIVE ACCOUNT</span>
//               </div>
//               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50">
//                 <span className="text-[9px]">📅</span>
//                 <span className="font-mono text-[9px] text-cyan-400">Member since {new Date(profile.memberSince).toLocaleDateString() || '2024'}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         <StatCard label="TOTAL REPORTS" value={stats.totalReports} color="#06b6d4" icon="📋" />
//         <StatCard label="PENDING" value={stats.pending} color="#fbbf24" icon="⏳" />
//         <StatCard label="COMPLETED" value={stats.completed} color="#4ade80" icon="✅" />
//         <StatCard label="RESPONSE RATE" value={`${stats.responseRate}%`} color="#c084fc" icon="📈" />
//       </div>

//       {/* Profile Info Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {infoFields.map((field) => (
//           <InfoCard
//             key={field.key}
//             icon={field.icon}
//             label={field.label}
//             value={editMode ? tempProfile[field.key] : profile[field.key]}
//             isEditing={editMode}
//             onChange={(e) => setTempProfile({ ...tempProfile, [field.key]: e.target.value })}
//             placeholder={field.placeholder}
//           />
//         ))}
//       </div>

//       {/* Security Section - Two Columns */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//         {/* Change Password */}
//         <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5 relative overflow-hidden">
//           <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40" />
//           <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
//             <span>🔐</span> CHANGE PASSWORD
//           </h3>
//           <div className="space-y-3">
//             <input
//               type="password"
//               placeholder="Current Password"
//               className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-cyan-500/30"
//               value={passwordData.current}
//               onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
//             />
//             <input
//               type="password"
//               placeholder="New Password"
//               className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-cyan-500/30"
//               value={passwordData.new}
//               onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
//             />
//             <input
//               type="password"
//               placeholder="Confirm New Password"
//               className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-2.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-cyan-500/30"
//               value={passwordData.confirm}
//               onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
//             />
//             <button
//               onClick={handlePasswordChange}
//               className="w-full py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all"
//             >
//               UPDATE PASSWORD
//             </button>
//           </div>
//         </div>

//         {/* Notification Preferences */}
//         <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5 relative overflow-hidden">
//           <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40" />
//           <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 flex items-center gap-2">
//             <span>🔔</span> NOTIFICATION PREFERENCES
//           </h3>
//           <div className="space-y-4">
//             {[
//               { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email', icon: '📧' },
//               { key: 'sms', label: 'SMS Alerts', desc: 'Get SMS for urgent updates', icon: '📱' },
//               { key: 'push', label: 'Push Notifications', desc: 'Browser push alerts', icon: '🔔' },
//             ].map((pref) => (
//               <div key={pref.key} className="flex justify-between items-center p-2 rounded-lg bg-cyan-900/10 border border-cyan-500/20">
//                 <div className="flex items-center gap-3">
//                   <span className="text-lg">{pref.icon}</span>
//                   <div>
//                     <p className="font-mono text-sm text-cyan-200">{pref.label}</p>
//                     <p className="font-mono text-[9px] text-cyan-400/60">{pref.desc}</p>
//                   </div>
//                 </div>
//                 <div className="w-10 h-5 rounded-full bg-cyan-500/50 relative cursor-pointer shadow-inner">
//                   <div className="w-4 h-4 rounded-full bg-white absolute top-[2px] right-[2px] shadow-md" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Danger Zone */}
//       <div className="bg-[var(--bg2)] border border-red-500/30 rounded-xl p-5 relative overflow-hidden">
//         <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <div>
//             <h3 className="font-title text-red-400 text-sm tracking-wider flex items-center gap-2">
//               <span>⚠️</span> DANGER ZONE
//             </h3>
//             <p className="font-mono text-xs text-red-400/60 mt-1">Permanently delete your account and all associated data</p>
//           </div>
//           <button
//             onClick={handleDeleteAccount}
//             className="px-5 py-2 bg-red-500/20 border border-red-500 rounded-lg font-mono text-sm text-red-400 hover:bg-red-500/30 transition-all duration-300 hover:scale-[1.02]"
//           >
//             DELETE ACCOUNT
//           </button>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

