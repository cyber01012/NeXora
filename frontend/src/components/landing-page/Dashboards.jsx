import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, HandHeart, Settings } from 'lucide-react';

const roles = [
  {
    id: 'citizens',
    title: 'Citizens',
    icon: <User className="w-5 h-5" />,
    desc: 'Report issues instantly with exact geolocation. Track the status of your reports and receive updates as responders act.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'responders',
    title: 'Responders',
    icon: <Shield className="w-5 h-5" />,
    desc: 'Receive AI-optimized tasks based on proximity and severity. Navigate directly to incidents with integrated live routing.',
    color: 'from-cyan-400 to-blue-400'
  },
  {
    id: 'ngos',
    title: 'NGOs',
    icon: <HandHeart className="w-5 h-5" />,
    desc: 'Coordinate volunteer efforts, manage incoming relief resources, and dispatch help to the highest priority areas.',
    color: 'from-cyan-400 to-blue-400'
  },
  {
    id: 'admins',
    title: 'Admins',
    icon: <Settings className="w-5 h-5" />,
    desc: 'Full system oversight. Monitor heatmaps, manage users, and manually override AI triage decisions when necessary.',
    color: 'from-cyan-500 to-blue-500'
  }
];

const Dashboards = () => {
  const [activeRole, setActiveRole] = useState(roles[0]);

  return (
    <section id="dashboards" className="py-16 bg-[#0a0f1d] relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-12 mt-0">
          <h2 className="text-4xl md:text-5xl font-data text-white mb-6 uppercase tracking-wider">
            One Platform. <span className="text-glow-cyan">Four Views.</span>
          </h2>
          <p className="text-white/60 text-base max-w-2xl mx-auto font-mono">
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
                    ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                    : 'bg-transparent border-white/10 hover:border-cyan-500/30'
                }`}
              >
                <div className={`mt-1 p-2 rounded-sm bg-gradient-to-br ${role.color} bg-opacity-20`}>
                  {role.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-data mb-2 uppercase tracking-wide ${
                    activeRole.id === role.id ? 'text-cyan-400' : 'text-white/70'
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
                  <div className="flex-1 p-6 relative">
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${activeRole.color} opacity-10 rounded-full blur-[80px]`}></div>
                    
                    <div className="flex gap-4 h-full">
                      <div className="w-1/3 flex flex-col gap-4">
                        <div className="h-24 rounded-xl bg-white/5 border border-white/5"></div>
                        <div className="flex-1 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col gap-3">
                           <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                           <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                           <div className="h-4 w-2/3 bg-white/10 rounded"></div>
                        </div>
                      </div>
                      <div className="flex-1 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
                        {/* Map mockup */}
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-500 shadow-[0_0_20px_#00f0ff]"></div>
                        <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#00f0ff]"></div>
                      </div>
                    </div>
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
