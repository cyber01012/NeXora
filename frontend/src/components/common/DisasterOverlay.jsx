import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDisasterMode } from '../../context/DisasterContext';

const DisasterOverlay = () => {
  const { isDisasterMode } = useDisasterMode();

  return (
    <AnimatePresence>
      {isDisasterMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-40 pointer-events-none mix-blend-screen overflow-hidden"
        >
          {/* Deep red vignette & glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,20,20,0.15)_60%,rgba(255,0,0,0.3)_100%)]" />

          {/* Glitch noise texture overlay - using CSS data URI or standard gradient */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiAvPgo8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAwIiAvPgo8L3N2Zz4=')] bg-repeat" />

          {/* Heavy scanlines */}
          <div className="absolute inset-0 scanlines opacity-50" />
          
          {/* Pulsing alarm glow at top & bottom */}
          <motion.div 
            className="absolute top-0 w-full h-32 bg-gradient-to-b from-red-600/20 to-transparent"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-red-600/20 to-transparent"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DisasterOverlay;
