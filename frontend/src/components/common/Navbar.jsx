import React, { useState } from 'react'; // v2-nav-update-fix
import { ShieldAlert, Map, Activity, User, Shield, Users, Building, Ambulance, Cpu, LayoutDashboard, Code, Network } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import logo from '../../assets/images/nexlogo.png';

const portals = [
  { icon: Users,    label: 'Citizen',   color: 'group-hover:text-cyan-400',   bg: 'hover:bg-cyan-500/15' },
  { icon: Ambulance,label: 'Responder', color: 'group-hover:text-cyan-400',    bg: 'hover:bg-cyan-500/15' },
  { icon: Building, label: 'NGO',       color: 'group-hover:text-cyan-400',  bg: 'hover:bg-cyan-500/15' },
  { icon: Shield,   label: 'Admin',     color: 'group-hover:text-cyan-400', bg: 'hover:bg-cyan-500/15' },
];

const Navbar = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed left-0 w-full z-50 flex justify-center pointer-events-none">
      <motion.div
        className="pointer-events-auto flex items-center justify-between"
        animate={scrolled ? {
          width: 'calc(100% - 48px)',
          borderRadius: '999px',
          marginTop: '14px',
          height: '52px',
          paddingLeft: '16px',
          paddingRight: '16px',
          backgroundColor: 'rgba(2, 6, 16, 0.85)',
          backdropFilter: 'blur(20px)',
          borderWidth: '1px',
          borderColor: 'rgba(0, 240, 255, 0.25)',
          boxShadow: '0 4px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,240,255,0.12)',
        } : {
          width: '100%',
          borderRadius: '0px',
          marginTop: '0px',
          height: '64px',
          paddingLeft: '24px',
          paddingRight: '24px',
          backgroundColor: 'rgba(0,0,0,0)',
          backdropFilter: 'blur(0px)',
          borderWidth: '0px',
          borderColor: 'transparent',
          boxShadow: 'none',
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{ border: '1px solid transparent' }}
      >
        {/* LEFT — Logo */}
        <div 
          className="flex items-center gap-3 flex-shrink-0 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.2)] flex-shrink-0">
          <img src={logo} alt="logo" />
          </div>
          <span className="font-data text-lg text-cyan-300 tracking-widest whitespace-nowrap">
            NEXORA
          </span>
        </div>

        {/* CENTER — Nav links */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('features')}
            className="flex items-center gap-2 text-cyan-400/70 hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span className="font-data text-xs tracking-widest uppercase">Features</span>
          </button>
          <button 
            onClick={() => scrollToSection('workflow')}
            className="flex items-center gap-2 text-cyan-400/70 hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
          >
            <Network className="w-4 h-4" />
            <span className="font-data text-xs tracking-widest uppercase">Workflow</span>
          </button>
          <button 
            onClick={() => scrollToSection('dashboards')}
            className="flex items-center gap-2 text-cyan-400/70 hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-data text-xs tracking-widest uppercase">Dashboards</span>
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')}
            className="flex items-center gap-2 text-cyan-400/70 hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span className="font-data text-xs tracking-widest uppercase">Reports</span>
          </button>
          <button 
            onClick={() => scrollToSection('faq')}
            className="flex items-center gap-2 text-cyan-400/70 hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
          >
            <Code className="w-4 h-4" />
            <span className="font-data text-xs tracking-widest uppercase">FAQ</span>
          </button>
        </div>

        {/* RIGHT — Dropdown Sign Up */}
        <div 
          className="relative flex-shrink-0"
          onMouseEnter={() => setLoginOpen(true)}
          onMouseLeave={() => setLoginOpen(false)}
        >
          <div className="bg-[#050a18]/80 rounded-full flex items-center justify-center cursor-pointer h-10 w-[130px] border border-cyan-500/25 backdrop-blur-sm hover:border-cyan-400/50 transition-colors">
            <User className="w-4 h-4 text-cyan-400 mr-2" />
            <span className="font-data text-xs font-bold tracking-widest text-cyan-300 uppercase">
              Sign Up
            </span>
          </div>

          {/* Vertical Dropdown Island */}
          <AnimatePresence>
            {loginOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 right-0 w-48 bg-[#020610]/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col p-2 gap-1 z-50"
              >
                {portals.map(({ icon: Icon, label, color, bg }) => (
                  <button
                    key={label}
                    className={`group w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${bg}`}
                  >
                    <Icon className={`w-4 h-4 text-cyan-500/50 transition-colors ${color}`} />
                    <span className="text-xs font-data text-cyan-100/70 group-hover:text-white uppercase tracking-widest transition-colors">
                      {label}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
