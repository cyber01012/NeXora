import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import './CivicPulse.css';
import PulseModal from './PulseModal';

const PulseOrb = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div 
        className="pulse-orb"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      >
        <motion.div
          className="pulse-orb-ring"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <Activity className="pulse-orb-icon" />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PulseModal onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PulseOrb;