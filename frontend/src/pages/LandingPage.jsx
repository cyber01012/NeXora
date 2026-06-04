import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing-page/Hero';
import Features from '../components/landing-page/Features';
import Dashboards from '../components/landing-page/Dashboards';
import Workflow from '../components/landing-page/Workflow';
import Testimonials from '../components/landing-page/Testimonials';
import FAQ from '../components/landing-page/FAQ';
import SplashScreen from '../components/landing-page/SplashScreen';
import CTA from '../components/landing-page/CTA';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUp, AlertTriangle } from 'lucide-react';
import Footer from '../components/common/Footer';
import DisasterOverlay from '../components/common/DisasterOverlay';
import { useDisasterMode } from '../context/DisasterContext';

const LandingPage = ({ onOpenAuth }) => {
  const { isDisasterMode, toggleDisasterMode } = useDisasterMode();
  const [showSplash, setShowSplash] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowScrollTop(latest > 300);
  });

  return (
    <div className="bg-[var(--bg-dark)] min-h-screen text-white font-mono selection:bg-primary-500/30">
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <DisasterOverlay />

      {!showSplash && (
        <>
          <Navbar onOpenAuth={onOpenAuth} />
          
          {/* Disaster Mode Toggle Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={toggleDisasterMode}
            className={`fixed top-20 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-sm border backdrop-blur-md transition-colors cursor-pointer ${
              isDisasterMode 
                ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(255,0,0,0.3)]' 
                : 'bg-red-900/10 border-red-900/30 text-red-500/70 hover:bg-red-900/30 hover:text-red-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="font-data text-[10px] tracking-widest uppercase">
              {isDisasterMode ? 'Disable Simulation' : 'Disaster Mode'}
            </span>
          </motion.button>

          <main>
            <Hero onOpenAuth={onOpenAuth} />
            <Features />
            <Workflow />
            <Dashboards />
            <Testimonials />
            <FAQ />
            <CTA onOpenAuth={onOpenAuth} />
          </main>
          
          {/* HUD Footer */}
          {/* <footer className="border-t border-primary-500/30 pt-12 pb-6 relative z-10 bg-[var(--bg-dark)]">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <span className="font-title text-2xl text-glow-primary uppercase tracking-widest block mb-4">NEXORA</span>
                  <p className="text-primary-500/60 font-mono text-xs max-w-sm leading-relaxed">
                    Intelligent Disaster and Civic Management System. Detecting anomalies, deploying resources, defeating crises.
                  </p>
                </div>
                <div className="md:col-span-2 flex flex-col md:items-end">
                  <h4 className="font-data text-primary-400 text-xs tracking-widest uppercase mb-4">Core Engineering Team</h4>
                  <div className="flex flex-wrap gap-4 md:justify-end font-mono text-xs text-primary-500/60">
                    <span className="hover:text-primary-300 transition-colors cursor-default">Suhaima Khan</span>
                    <span className="text-primary-500/30">/</span>
                    <span className="hover:text-primary-300 transition-colors cursor-default">Hafsa Yousuf</span>
                    <span className="text-primary-500/30">/</span>
                    <span className="hover:text-primary-300 transition-colors cursor-default">Hafsa Ather Khan</span>
                    <span className="text-primary-500/30">/</span>
                    <span className="hover:text-primary-300 transition-colors cursor-default">Mariam Yasir</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-primary-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-primary-500/40 text-[10px] tracking-widest uppercase font-mono">
                  [SYS_LOG] © {new Date().getFullYear()} NEXORA COMMAND. SECURE CONNECTION.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-primary-500/40 hover:text-primary-400 text-[10px] uppercase tracking-widest transition-colors">[PROTOCOL_ALPHA]</a>
                  <a href="#" className="text-primary-500/40 hover:text-primary-400 text-[10px] uppercase tracking-widest transition-colors">[TERMS]</a>
                </div>
              </div>
            </div> */}
          <Footer/>

          {/* Scroll to Top Button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-[var(--bg-light)]/80 backdrop-blur-md border border-primary-500/30 rounded-full flex items-center justify-center text-primary-400 hover:bg-primary-500/20 transition-colors shadow-[0_0_15px_rgba(var(--primary-glow-rgb), 0.2)] cursor-pointer"
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default LandingPage;
