import { useAuth } from '../../context/AuthContext';

export default function AssigningOfficerProfile() {
  const { user } = useAuth();

  const profileFields = [
    { label: 'USERNAME', value: user?.identifier || '—', icon: '🆔' },
    { label: 'DISPLAY NAME', value: user?.displayName || '—', icon: '👤' },
    { label: 'ROLE', value: user?.role || '—', icon: '🛡️' },
    { label: 'EMAIL', value: user?.email || '—', icon: '✉️' },
    { label: 'PHONE', value: user?.maskedPhone || '—', icon: '📱' },
    { label: 'STATUS', value: user?.active ? 'ACTIVE' : 'INACTIVE', icon: '🟢' },
    { label: 'SOURCE', value: user?.source || '—', icon: '🔗' },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">OFFICER PROFILE</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ ASSIGNING OFFICER INFORMATION ]</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/30 to-transparent border-2 border-cyan-400/50 flex items-center justify-center text-3xl font-bold font-data text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          {(user?.displayName || 'A').charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-title text-glow-primary text-xl tracking-wider">{user?.displayName || 'Assigning Officer'}</h2>
          <p className="font-mono text-xs text-cyan-400/60 mt-1">ASSIGNING OFFICER · NEXORA SYSTEM</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] text-green-400">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="grid md:grid-cols-2 gap-3">
        {profileFields.map((field, idx) => (
          <div
            key={field.label}
            className="bg-[#0a1628]/80 border border-cyan-500/20 rounded-xl p-4 transition-all duration-300 hover:border-cyan-500/40 animate-scaleIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>{field.icon}</span>
              <span className="font-mono text-[9px] text-cyan-400/50 tracking-wider">{field.label}</span>
            </div>
            <p className="font-mono text-sm text-cyan-200">{field.value}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
}
