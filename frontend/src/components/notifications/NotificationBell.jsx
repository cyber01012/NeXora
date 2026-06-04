import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useNotifications } from './useNotifications';
import { useDisasterMode } from '../../context/DisasterContext';
import NotificationBadge from './NotificationBadge';

/**
 * NotificationBell — navbar bell icon with animated badge.
 * Renders the bell + badge, and toggles the slide-out panel.
 * In disaster mode: bell glows red and shakes when DISASTER_MODE_ACTIVATED
 * notification is present.
 */
const NotificationBell = () => {
  const { unreadCount, togglePanel, panelOpen, notifications } = useNotifications();
  const { isDisasterMode } = useDisasterMode();

  const hasDisasterAlert = notifications.some(
    n => n.type === 'DISASTER_MODE_ACTIVATED' && !n.isRead
  );

  return (
    <motion.button
      id="notification-bell"
      onClick={togglePanel}
      aria-label={`Notifications — ${unreadCount} unread`}
      className={[
        'relative flex items-center justify-center w-9 h-9 rounded-full',
        'border transition-all duration-300 cursor-pointer',
        panelOpen
          ? 'bg-primary-500/20 border-primary-400/50'
          : 'bg-[var(--bg-light)]/60 border-primary-500/20 hover:border-primary-400/50 hover:bg-primary-500/10',
        isDisasterMode
          ? 'border-red-500/40 hover:border-red-400/60'
          : '',
      ].join(' ')}
      animate={hasDisasterAlert ? {
        rotate: [0, -8, 8, -6, 6, -4, 4, 0],
        transition: { duration: 0.6, repeat: Infinity, repeatDelay: 3 },
      } : {}}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        boxShadow: isDisasterMode
          ? '0 0 12px rgba(239,68,68,0.3)'
          : panelOpen
          ? `0 0 14px rgba(var(--primary-glow-rgb), 0.25)`
          : 'none',
      }}
    >
      <Bell
        className={[
          'w-4 h-4 transition-colors duration-300',
          isDisasterMode
            ? 'text-red-400'
            : panelOpen
            ? 'text-primary-300'
            : 'text-primary-400/70',
        ].join(' ')}
      />

      <NotificationBadge count={unreadCount} isDisaster={isDisasterMode} />
    </motion.button>
  );
};

export default NotificationBell;
