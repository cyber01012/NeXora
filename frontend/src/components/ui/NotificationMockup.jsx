import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, Briefcase } from 'lucide-react';

const NotificationMockup = () => {
  const [notifications, setNotifications] = useState([]);

  const triggerNotifications = () => {
    const newNotifications = [
      {
        id: Date.now() + 1,
        type: 'success',
        message: 'Report Submitted Successfully',
        icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        color: 'border-green-500/50 bg-green-900/20 text-green-400'
      },
      {
        id: Date.now() + 2,
        type: 'info',
        message: 'New Task Assigned: Sector 7',
        icon: <Briefcase className="w-5 h-5 text-blue-400" />,
        color: 'border-blue-500/50 bg-blue-900/20 text-blue-400'
      },
      {
        id: Date.now() + 3,
        type: 'danger',
        message: 'Disaster Mode Activated',
        icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        color: 'border-red-500/50 bg-red-900/20 text-red-400'
      }
    ];

    setNotifications(prev => [...prev, ...newNotifications]);

    // Auto-remove notifications after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => !newNotifications.find(nn => nn.id === n.id)));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={triggerNotifications}
        className="fixed top-20 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-sm border border-cyan-500/30 bg-cyan-900/20 text-cyan-400 hover:bg-cyan-900/40 hover:text-cyan-300 backdrop-blur-md transition-colors cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)]"
      >
        <Bell className="w-3.5 h-3.5" />
        <span className="font-data text-[10px] tracking-widest uppercase">
          Trigger Notifications
        </span>
      </motion.button>

      {/* Notification Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg min-w-[280px] cursor-pointer ${notif.color}`}
              onClick={() => removeNotification(notif.id)}
            >
              <div className="flex-shrink-0">
                {notif.icon}
              </div>
              <p className="font-mono text-xs tracking-wide">
                {notif.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationMockup;
