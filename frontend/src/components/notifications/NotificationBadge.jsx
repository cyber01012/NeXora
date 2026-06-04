
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NotificationBadge — animated unread count bubble.
 * Used on the bell icon in the Navbar.
 *
 * Props:
 *   count        {number}   — number to display (hidden if 0)
 *   isDisaster   {boolean}  — switches to red pulse in disaster mode
 */
const NotificationBadge = ({ count = 0, isDisaster = false }) => {
  const display = count > 99 ? '99+' : count;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={display}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className={[
            'absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1',
            'flex items-center justify-center rounded-full',
            'font-data text-[9px] font-bold text-white leading-none',
            isDisaster
              ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]'
              : 'bg-primary-500 shadow-[0_0_8px_rgba(var(--primary-glow-rgb),0.7)]',
          ].join(' ')}
        >
          {display}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default NotificationBadge;
