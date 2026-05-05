import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing-page/Hero';
import Features from '../components/landing-page/Features';
import Dashboards from '../components/landing-page/Dashboards';
import Workflow from '../components/landing-page/Workflow';
import Testimonials from '../components/landing-page/Testimonials';
import FAQ from '../components/landing-page/FAQ';
import SplashScreen from '../components/landing-page/SplashScreen';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Footer from '../components/common/Footer';
const LandingPage = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowScrollTop(latest > 300);
  });

  return (
    <div className="bg-[#050916] min-h-screen text-white font-mono selection:bg-cyan-500/30">
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {!showSplash && (
        <>
          <Navbar />
          <main>
            <Hero />
            <Features />
            <Workflow />
            <Dashboards />
            <Testimonials />
            <FAQ />
          </main>
          
          {/* HUD Footer */}
          {/* <footer className="border-t border-cyan-500/30 pt-12 pb-6 relative z-10 bg-[#030a10]">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <span className="font-title text-2xl text-glow-cyan uppercase tracking-widest block mb-4">NEXORA</span>
                  <p className="text-cyan-500/60 font-mono text-xs max-w-sm leading-relaxed">
                    Intelligent Disaster and Civic Management System. Detecting anomalies, deploying resources, defeating crises.
                  </p>
                </div>
                <div className="md:col-span-2 flex flex-col md:items-end">
                  <h4 className="font-data text-cyan-400 text-xs tracking-widest uppercase mb-4">Core Engineering Team</h4>
                  <div className="flex flex-wrap gap-4 md:justify-end font-mono text-xs text-cyan-500/60">
                    <span className="hover:text-cyan-300 transition-colors cursor-default">Suhaima Khan</span>
                    <span className="text-cyan-500/30">/</span>
                    <span className="hover:text-cyan-300 transition-colors cursor-default">Hafsa Yousuf</span>
                    <span className="text-cyan-500/30">/</span>
                    <span className="hover:text-cyan-300 transition-colors cursor-default">Hafsa Ather Khan</span>
                    <span className="text-cyan-500/30">/</span>
                    <span className="hover:text-cyan-300 transition-colors cursor-default">Mariam Yasir</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-cyan-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-cyan-500/40 text-[10px] tracking-widest uppercase font-mono">
                  [SYS_LOG] © {new Date().getFullYear()} NEXORA COMMAND. SECURE CONNECTION.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-cyan-500/40 hover:text-cyan-400 text-[10px] uppercase tracking-widest transition-colors">[PROTOCOL_ALPHA]</a>
                  <a href="#" className="text-cyan-500/40 hover:text-cyan-400 text-[10px] uppercase tracking-widest transition-colors">[TERMS]</a>
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
                className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-[#050a18]/80 backdrop-blur-md border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
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
