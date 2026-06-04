import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import beepSound from '../../assets/audio/beep.wav';

const Toast = ({ id, message, type = 'info', onDismiss }) => {
  useEffect(() => {
    // Play sound on mount
    const audio = new Audio(beepSound);
    audio.play().catch(e => console.error("Audio playback failed:", e));

    const timer = setTimeout(() => onDismiss(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-[rgba(var(--bg-dark-rgb),0.96)] border border-primary-500/30 backdrop-blur-xl p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]"
    >
      <Bell className="text-primary-400 w-5 h-5" />
      <p className="text-white text-sm font-medium flex-1">{message}</p>
      <button onClick={() => onDismiss(id)} className="text-white/40 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Toast;
