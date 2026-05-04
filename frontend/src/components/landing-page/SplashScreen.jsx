import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const fullText = "Connecting Crisis. Coordinating Response.";

  useEffect(() => {
    // Progress counter
    const interval = setInterval(() => {
      setProgress((prev) => {
        const jump = Math.floor(Math.random() * 15) + 1;
        if (prev + jump >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + jump;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Typewriter effect
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTextIndex((prev) => prev + 1);
      }, 50); // Typing speed
      return () => clearTimeout(timeout);
    }
  }, [textIndex, fullText]);

  useEffect(() => {
    // Finish splash
    if (progress === 100 && textIndex === fullText.length) {
      setTimeout(() => {
        onComplete();
      }, 800); // Wait a bit before removing splash
    }
  }, [progress, textIndex, onComplete, fullText.length]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-[#030a10] flex flex-col items-center justify-center scanlines overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff1a_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff1a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col gap-6 font-mono">
        {/* System Diagnostics */}
        <div className="text-cyan-500/70 text-sm tracking-widest uppercase mb-12">
          <div>[SYS_BOOT_SEQ_INIT]</div>
          <div>ESTABLISHING SATELLITE UPLINK... OK</div>
          <div>LOADING NEURAL TRIAGE PROTOCOLS... OK</div>
        </div>

        {/* Counter */}
        <div className="text-7xl md:text-9xl font-data font-bold text-glow-cyan text-center tracking-tighter">
          {progress.toString().padStart(3, '0')}<span className="text-4xl text-cyan-500/50">%</span>
        </div>

        {/* Typewriter Text */}
        <div className="h-8 mt-12 text-center text-cyan-400 text-lg md:text-2xl tracking-wide uppercase" style={{ textShadow: "0 0 8px rgba(0,240,255,0.6)" }}>
          {fullText.substring(0, textIndex)}
          <span className="animate-pulse inline-block w-3 h-5 bg-cyan-400 ml-1 translate-y-1"></span>
        </div>

        {/* Loading Bar */}
        <div className="w-full h-[2px] bg-cyan-900/50 mt-8 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_15px_#00f0ff]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
