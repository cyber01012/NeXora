import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProfile() {
  const { user } = useAuth();

  const adminInfo = {
    name: user?.name || 'System Administrator',
    username: user?.username || 'admin',
    email: user?.email || 'admin@nexora.com',
    role: 'SYSTEM ADMIN',
    joinDate: '2026-01-15',
    lastLogin: new Date().toLocaleDateString(),
  };

  const sessions = [
    { device: 'Chrome — Windows 11', ip: '192.168.1.105', time: 'Current session', active: true },
    { device: 'Firefox — Ubuntu', ip: '192.168.1.112', time: '2 hours ago', active: false },
    { device: 'Safari — macOS', ip: '10.0.0.44', time: '1 day ago', active: false },
  ];

  const permissions = [
    { label: 'User Management', level: 'FULL', desc: 'Create, edit, deactivate portal users' },
    { label: 'Report Access', level: 'FULL', desc: 'View all civic, SOS, and anonymous reports' },
    { label: 'Analytics', level: 'FULL', desc: 'Access system analytics and metrics' },
    { label: 'Disaster Mode', level: 'FULL', desc: 'Toggle national emergency mode' },
    { label: 'System Config', level: 'FULL', desc: 'Modify system-level configurations' },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* HEADER */}
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">ADMIN PROFILE</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ SYSTEM ADMINISTRATOR CONFIGURATION ]</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* PROFILE CARD */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex flex-col items-center text-center">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400/50 flex items-center justify-center mb-4"
              style={{ boxShadow: '0 0 30px rgba(6,182,212,0.2)' }}
            >
              <span className="text-4xl font-title text-cyan-300" style={{ textShadow: '0 0 12px #06b6d4' }}>
                {adminInfo.name.charAt(0)}
              </span>
            </div>

            <h2 className="text-glow-primary font-title text-xl">{adminInfo.name}</h2>

            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-cyan-300 text-[10px] font-mono">@{adminInfo.username}</span>
            </div>

            <span className="mt-3 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono tracking-wider">
              {adminInfo.role}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { label: 'EMAIL', value: adminInfo.email },
              { label: 'MEMBER SINCE', value: adminInfo.joinDate },
              { label: 'LAST LOGIN', value: adminInfo.lastLogin },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between bg-black/10 border border-cyan-500/10 rounded-lg px-3 py-2">
                <span className="text-cyan-400/40 text-[9px] font-mono tracking-wider">{item.label}</span>
                <span className="text-cyan-200 text-[10px] font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-5">

          {/* PERMISSIONS */}
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
            <h2 className="text-cyan-300 font-title text-sm tracking-wider mb-4">ACCESS PERMISSIONS</h2>

            <div className="space-y-2">
              {permissions.map(perm => (
                <div key={perm.label} className="flex items-center justify-between p-3 rounded-xl border border-cyan-500/10 bg-cyan-950/5 hover:bg-cyan-900/10 transition-all">
                  <div>
                    <p className="text-cyan-100 font-mono text-sm">{perm.label}</p>
                    <p className="text-cyan-400/40 text-[10px] mt-1">{perm.desc}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono">
                    {perm.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE SESSIONS */}
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
            <h2 className="text-cyan-300 font-title text-sm tracking-wider mb-4">ACTIVE SESSIONS</h2>

            <div className="space-y-2">
              {sessions.map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-cyan-500/10 bg-cyan-950/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${session.active ? 'bg-green-400' : 'bg-gray-500'}`}
                      style={session.active ? { boxShadow: '0 0 8px #4ade80' } : {}}
                    />
                    <div>
                      <p className="text-cyan-100 font-mono text-sm">{session.device}</p>
                      <p className="text-cyan-400/40 text-[10px] mt-1">IP: {session.ip}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono ${session.active ? 'text-green-400' : 'text-cyan-400/40'}`}>
                    {session.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
