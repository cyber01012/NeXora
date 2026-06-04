import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const fullText = "Connecting Crisis. Coordinating Response.";

  // FIX 1: stable interval reference
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const jump = Math.floor(Math.random() * 15) + 1;

        // FIX: don’t clear interval inside updater (causes glitches)
        const next = prev + jump;

        if (next >= 100) {
          return 100;
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // FIX 2: ensure interval stops cleanly when progress hits 100
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  // Typewriter effect mamiii ;)
  useEffect(() => {
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTextIndex((prev) => prev + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [textIndex, fullText]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-[var(--bg-dark)] flex flex-col items-center justify-center scanlines overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--primary-glow)1a_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-glow)1a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col gap-6 font-mono">
        {/* System Diagnostics */}
        <div className="text-primary-500/70 text-sm tracking-widest uppercase mb-12">
          <div>[SYS_BOOT_SEQ_INIT]</div>
          <div>ESTABLISHING CONNECTIONS... OK</div>
          <div>INITIALIZING AI ASSISTANTS... OK</div>
        </div>

        {/* Counter */}
        <div className="text-7xl md:text-9xl font-data font-bold text-glow-primary text-center tracking-tighter">
          {progress.toString().padStart(3, '0')}
          <span className="text-4xl text-primary-500/50">%</span>
        </div>

        {/* Typewriter Text */}
        <div
          className="h-8 mt-12 text-center text-primary-400 text-lg md:text-2xl tracking-wide uppercase"
          style={{ textShadow: "0 0 8px rgba(var(--primary-glow-rgb), 0.6)" }}
        >
          {fullText.substring(0, textIndex)}
          <span className="animate-pulse inline-block w-3 h-5 bg-primary-400 ml-1 translate-y-1"></span>
        </div>

        {/* Loading Bar */}
        <div className="w-full h-[2px] bg-primary-900/50 mt-8 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-primary-400 shadow-[0_0_15px_var(--primary-glow)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;