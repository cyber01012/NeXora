import React, { useState } from 'react'; // v2-nav-update-fix
import { ShieldAlert, Map, Activity, User, Shield, Users, Building, Ambulance, Cpu, LayoutDashboard, Code, Network, HeartHandshake } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import logo from '../../assets/images/nexlogo.png';
import NotificationBell from '../notifications/NotificationBell';
import NotificationPanel from '../notifications/NotificationPanel';
// const [showSignupModal, setShowSignupModal] = useState(false);
// const portals = [
//   { icon: Users,    label: 'Citizen',   color: 'group-hover:text-primary-400',   bg: 'hover:bg-primary-500/15' },
//   { icon: Ambulance,label: 'Responder', color: 'group-hover:text-primary-400',    bg: 'hover:bg-primary-500/15' },
//   { icon: Building, label: 'NGO',       color: 'group-hover:text-primary-400',  bg: 'hover:bg-primary-500/15' },
//   { icon: HeartHandshake, label: 'Volunteer', color: 'group-hover:text-primary-400', bg: 'hover:bg-primary-500/15' },
//   { icon: Shield,   label: 'Admin',     color: 'group-hover:text-primary-400', bg: 'hover:bg-primary-500/15' },
// ];

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
          backgroundColor: 'rgba(var(--bg-dark-rgb), 0.85)',
          backdropFilter: 'blur(20px)',
          borderWidth: '1px',
          borderColor: 'rgba(var(--primary-glow-rgb), 0.25)',
          boxShadow: '0 4px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(var(--primary-glow-rgb), 0.12)',
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
          <div className="w-9 h-9 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/30 shadow-[0_0_15px_rgba(var(--primary-glow-rgb), 0.2)] flex-shrink-0">
          <img src={logo} alt="logo" />
          </div>
          <span className="font-hud-title text-lg text-primary-300 tracking-widest whitespace-nowrap">
            NEXORA
          </span>
        </div>

        {/* CENTER — Nav links */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('features')}
            className="flex items-center gap-2 text-primary-400/70 hover:text-primary-300 transition-colors duration-200 cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span className="font-data text-xs tracking-widest uppercase">Features</span>
          </button>
          <button 
            onClick={() => scrollToSection('workflow')}
            className="flex items-center gap-2 text-primary-400/70 hover:text-primary-300 transition-colors duration-200 cursor-pointer"
          >
            <Network className="w-4 h-4" />
            <span className="font-data text-xs tracking-widest uppercase">Workflow</span>
          </button>
          <button 
            onClick={() => scrollToSection('dashboards')}
            className="flex items-center gap-2 text-primary-400/70 hover:text-primary-300 transition-colors duration-200 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-data text-xs tracking-widest uppercase">Dashboards</span>
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')}
            className="flex items-center gap-2 text-primary-400/70 hover:text-primary-300 transition-colors duration-200 cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span className="font-data text-xs tracking-widest uppercase">Reports</span>
          </button>
          <button 
            onClick={() => scrollToSection('faq')}
            className="flex items-center gap-2 text-primary-400/70 hover:text-primary-300 transition-colors duration-200 cursor-pointer"
          >
            <Code className="w-4 h-4" />
            <span className="font-data text-xs tracking-widest uppercase">FAQ</span>
          </button>
        </div>

        {/* RIGHT — Bell + Dropdown Sign Up */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {/* Notification Bell */}
          <div className="relative">
            <NotificationBell />
            <NotificationPanel role="CITIZEN" />
          </div>

          {/* Sign Up Dropdown */}
        <button
  onClick={() => {
    // TODO: Open Sign Up Form Modal
    setShowSignupForm(true);
  }}
  className="bg-[var(--bg-light)]/80 rounded-full flex items-center justify-center cursor-pointer h-10 w-[130px] border border-primary-500/25 backdrop-blur-sm hover:border-primary-400/50 transition-colors"
 > <span className="text-primary-300 font-data" >Sign up</span> </button>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
