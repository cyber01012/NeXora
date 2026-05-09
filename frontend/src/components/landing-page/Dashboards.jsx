import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, HandHeart, Settings, Users } from 'lucide-react';

const roles = [
  {
    id: 'citizens',
    title: 'Citizens',
    icon: <User className="w-5 h-5" />,
    desc: 'Report issues instantly with exact geolocation. Track the status of your reports and receive updates as responders act.',
    color: 'from-primary-500 to-blue-500'
  },
  {
    id: 'responders',
    title: 'Responders',
    icon: <Shield className="w-5 h-5" />,
    desc: 'Receive AI-optimized tasks based on proximity and severity. Navigate directly to incidents with integrated live routing.',
    color: 'from-primary-400 to-blue-400'
  },
  {
    id: 'ngos',
    title: 'NGOs',
    icon: <HandHeart className="w-5 h-5" />,
    desc: 'Coordinate volunteer efforts, manage incoming relief resources, and dispatch help to the highest priority areas.',
    color: 'from-primary-400 to-blue-400'
  },
  {
    id: 'admins',
    title: 'Admins',
    icon: <Settings className="w-5 h-5" />,
    desc: 'Full system oversight. Monitor heatmaps, manage users, and manually override AI triage decisions when necessary.',
    color: 'from-primary-500 to-blue-500'
  },
  {
    id: 'volunteers',
    title: 'Volunteers',
    icon: <Users className="w-5 h-5" />,
    desc: 'Browse nearby missions, join active response teams, and collaborate with NGOs through a lightweight mobile interface.',
    color: 'from-primary-400 to-blue-400'
  }
];

const Dashboards = () => {
  const [activeRole, setActiveRole] = useState(roles[0]);

  return (
    <section id="dashboards" className="py-16 bg-[var(--bg-light)] transition-colors duration-1000 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-12 mt-0">
          <h2 className="text-4xl md:text-5xl font-data text-white mb-6 uppercase tracking-wider">
            One Platform. <span className="text-glow-primary">Five Views.</span>
          </h2>
          <p className="text-primary-500 font-mono text-sm max-w-2xl mx-auto">
            // TAILORED INTERFACES ENSURE EVERYONE HAS EXACTLY THE TOOLS THEY NEED.
          </p>
         
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Role Selector */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role)}
                className={`text-left p-6 rounded-sm border transition-all duration-300 flex items-start gap-4 ${
                  activeRole.id === role.id 
                    ? 'bg-primary-500/10 border-primary-400 shadow-[0_0_15px_rgba(var(--primary-glow-rgb), 0.2)]' 
                    : 'bg-transparent border-white/10 hover:border-primary-500/30'
                }`}
              >
                <div className={`mt-1 p-2 rounded-sm bg-gradient-to-br ${role.color} bg-opacity-20`}>
                  {role.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-data mb-2 uppercase tracking-wide ${
                    activeRole.id === role.id ? 'text-primary-400' : 'text-white/70'
                  }`}>
                    {role.title}
                  </h3>
                  <p className={`text-xs font-mono ${
                    activeRole.id === role.id ? 'text-white/90' : 'text-white/50'
                  }`}>
                    {role.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Dashboard Preview Visuals */}
          <div className="w-full lg:w-2/3">
          <div className="text-[11px] text-white/70 font-mono tracking-wider mb-3 text-center">
  [WARNING] This visualization is based on simulation data.
</div>
            <div className="hud-glass rounded-sm p-4 border-hud aspect-[4/3] md:aspect-[16/9] relative overflow-hidden flex items-center justify-center">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full rounded-2xl bg-[#030712] border border-white/5 relative overflow-hidden flex flex-col"
                >
                  {/* Mock UI Header */}
                  <div className="h-12 border-b border-white/10 flex items-center px-6 justify-between bg-white/5">
                     <div className="font-display font-bold text-sm tracking-widest uppercase text-white/50">
                       {activeRole.title} Dashboard
                     </div>
                     <div className="flex gap-2">
                       <div className="w-8 h-4 rounded-full bg-white/10"></div>
                       <div className="w-8 h-4 rounded-full bg-white/10"></div>
                     </div>
                  </div>
                  
                  {/* Mock UI Content - Dynamic based on role */}
                 <div className="flex-1 p-6 relative text-white font-mono text-xs">
  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${activeRole.color} opacity-10 rounded-full blur-[80px]`} />

  {/* CITIZEN VIEW */}
  {activeRole.id === 'citizens' && (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Report Card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
        <span className="text-primary-400">// NEW REPORT</span>
        <div className="h-3 w-3/4 bg-white/20 rounded"></div>
        <div className="h-3 w-1/2 bg-white/20 rounded"></div>
        <div className="text-green-400 text-[10px]">STATUS: ASSIGNED</div>
      </div>

      {/* SOS */}
      <div className="bg-red-500/10 border border-red-400 rounded-xl flex items-center justify-center text-red-400 font-bold text-lg">
        SOS
      </div>

      {/* Reports List */}
      <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
        <div className="text-primary-400">// MY REPORTS</div>
        <div className="flex justify-between">
          <span>Flood Area</span>
          <span className="text-yellow-400">PENDING</span>
        </div>
        <div className="flex justify-between">
          <span>Broken Road</span>
          <span className="text-green-400">DONE</span>
        </div>
      </div>
    </div>
  )}

  {/* RESPONDER VIEW */}
  {activeRole.id === 'responders' && (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-primary-400">// TASK</div>
        <div className="mt-2">Flood Rescue</div>
        <div className="text-red-400 text-[10px]">HIGH PRIORITY</div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <span>Distance: 1.2km</span>
        <span className="text-green-400">NAVIGATING</span>
      </div>

      {/* Map */}
      <div className="col-span-2 relative rounded-xl bg-black border border-white/10 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary-400 rounded-full animate-ping" />
      </div>
    </div>
  )}

  {/* NGO VIEW */}
  {activeRole.id === 'ngos' && (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-primary-400">// INVENTORY</div>
        <div>Food: 120</div>
        <div>Med Kits: 45</div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-primary-400">// DISPATCH</div>
        <div>Karachi Flood Zone</div>
        <div className="text-green-400 text-[10px]">SENT</div>
      </div>

      <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-primary-400">// VOLUNTEERS</div>
        <div>12 Active</div>
      </div>
    </div>
  )}

  {/* ADMIN VIEW */}
  {activeRole.id === 'admins' && (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-primary-400">// REPORTS</div>
        <div>+24 Incoming</div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-primary-400">// AI SUGGESTION</div>
        <div>Deploy 2 teams</div>
      </div>

      {/* Heatmap */}
      <div className="col-span-2 relative rounded-xl bg-black border border-white/10 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-orange-400/5" />
        {/* Heat blobs */}
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-orange-400/25 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-2/3 w-32 h-32 bg-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-28 h-28 bg-yellow-300/15 rounded-full blur-3xl"></div>
        {/* Core hotspots */}
        <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-yellow-300 rounded-full shadow-[0_0_12px_#facc15]"></div>
        <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-yellow-300 rounded-full shadow-[0_0_12px_#facc15]"></div>
        {/* Pulse */}
        <div className="absolute top-1/3 left-1/3 w-6 h-6 bg-yellow-300/40 rounded-full animate-ping"></div>
        {/* Scan line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-300/10 to-transparent animate-[scan_4s_linear_infinite]" />
        {/* Label */}
        <div className="absolute top-2 left-3 text-[10px] text-white/50 font-mono">// VISUALS</div>
      </div>
    </div>
  )}

  {/* VOLUNTEER VIEW */}
  {activeRole.id === 'volunteers' && (
    <div className="grid grid-cols-2 gap-4 h-full opacity-80">
      
      {/* Active Task */}
      <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-primary-400 mb-1 text-[10px] font-bold tracking-widest uppercase">// CURRENT_MISSION</div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Sector 7 — Relief Setup</span>
          <span className="text-primary-400 text-[9px] px-2 py-0.5 border border-primary-500/30 rounded uppercase tracking-tighter">On-Site</span>
        </div>
      </div>

      {/* Simplified stats */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center gap-1">
        <div className="text-primary-400 text-[10px] uppercase font-bold tracking-widest opacity-60">TEAM_SYNC</div>
        <div className="flex -space-x-1 mt-1">
           <div className="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-500/30" />
           <div className="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-500/30" />
           <div className="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-500/30" />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
        <div className="text-primary-400 text-[10px] uppercase font-bold tracking-widest opacity-60">PROGRESS</div>
        <div className="w-full bg-white/5 h-1 rounded mt-1.5 overflow-hidden">
          <div className="h-full bg-green-400/60 shadow-[0_0_8px_rgba(74,222,128,0.3)]" style={{ width: '65%' }} />
        </div>
      </div>

      {/* Available Mission */}
      <div className="col-span-2 bg-white/5 border border-white/5 rounded-xl px-4 py-2 flex items-center justify-between opacity-50 italic">
        <span className="text-[10px]">Nearby: Medical Aid - Block C</span>
        <span className="text-[9px] uppercase tracking-widest">Available</span>
      </div>

    </div>
  )}
</div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Dashboards;
