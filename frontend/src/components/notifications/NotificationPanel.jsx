import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, CheckCheck, TriangleAlert, BellOff, Loader2, GripVertical } from 'lucide-react';
import { useNotifications } from './useNotifications';
import { useDisasterMode } from '../../context/DisasterContext';
import NotificationItem from './NotificationItem';

const NotificationPanel = ({ role = 'CITIZEN' }) => {
  const {
    notifications, unreadCount, panelOpen,
    closePanel, markAllAsRead, markAsRead, loading,
  } = useNotifications();
  const { isDisasterMode } = useDisasterMode();
  const panelRef = useRef(null);
  
  // Track drag position so it persists
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  // Calculate drag bounds based on viewport
  useEffect(() => {
    const updateConstraints = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setDragConstraints({
        left: -vw + 400,   // Allow dragging left
        right: vw - 100,   // Allow dragging right
        top: 0,            // Can't drag above top
        bottom: vh - 200,  // Can't drag below bottom
      });
    };
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e) => {
      const bell = document.getElementById('notification-bell');
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        bell && !bell.contains(e.target)
      ) closePanel();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [panelOpen, closePanel]);

  // Close on Escape
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e) => { if (e.key === 'Escape') closePanel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [panelOpen, closePanel]);

  const recent = notifications.slice(0, 8);
  const hasDisasterAlert = notifications.some(n => n.type === 'DISASTER_MODE_ACTIVATED');

  return (
    <AnimatePresence>
      {panelOpen && (
        <motion.div
          ref={panelRef}
          id="notification-panel"
          
          // ✅ DRAG PROPS
          drag
          dragConstraints={dragConstraints}
          dragElastic={0.1}
          dragMomentum={false}
          whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
          
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          
          className={[
            'absolute top-14 right-0 w-[380px] max-h-[70vh] flex flex-col',
            'rounded-xl border shadow-[0_20px_60px_rgba(0,0,0,0.8)]',
            'bg-[rgba(var(--bg-dark-rgb),0.96)] backdrop-blur-xl overflow-hidden z-50',
            'cursor-grab active:cursor-grabbing', // ✅ Cursor feedback
            isDisasterMode
              ? 'border-red-500/30'
              : 'border-primary-500/20',
          ].join(' ')}
          style={{
            boxShadow: isDisasterMode
              ? '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(239,68,68,0.15), inset 0 1px 0 rgba(239,68,68,0.08)'
              : '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(var(--primary-glow-rgb),0.08), inset 0 1px 0 rgba(var(--primary-glow-rgb),0.06)',
          }}
        >
          {/* ✅ DRAG HANDLE */}
          <div className="flex justify-center pt-1 pb-0.5 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-white/20 rotate-90" />
          </div>

          {/* ── Disaster Alert Banner ── */}
          <AnimatePresence>
            {isDisasterMode && hasDisasterAlert && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-500/15 border-b border-red-500/30 px-4 py-2 flex items-center gap-2 overflow-hidden"
              >
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <TriangleAlert className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                </motion.div>
                <span className="font-data text-[9px] text-red-300 tracking-widest uppercase">
                  ⚠ Alert Mode Active — Disaster Protocol Engaged
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Panel Header ── */}
          <div className={[
            'flex items-center justify-between px-4 py-3 border-b flex-shrink-0',
            isDisasterMode ? 'border-red-500/20' : 'border-primary-500/10',
          ].join(' ')}>
            <div className="flex items-center gap-2">
              <div className={[
                'w-1.5 h-1.5 rounded-full',
                isDisasterMode
                  ? 'bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                  : 'bg-primary-400 shadow-[0_0_6px_rgba(var(--primary-glow-rgb),0.8)]',
              ].join(' ')} />
              <span className="font-data text-xs tracking-widest text-white/80 uppercase">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className={`font-data text-[10px] px-1.5 py-0.5 rounded ${isDisasterMode ? 'bg-red-500/20 text-red-300' : 'bg-primary-500/20 text-primary-300'}`}>
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="flex items-center gap-1.5 font-data text-[9px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors px-2 py-1 rounded hover:bg-white/5 cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" />
                  All Read
                </button>
              )}
              <button
                onClick={closePanel}
                className="p-1.5 rounded hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(var(--primary-glow-rgb),0.2) transparent' }}>
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-white/30">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-mono text-xs">Loading...</span>
              </div>
            ) : recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-white/20">
                <BellOff className="w-8 h-8" />
                <span className="font-mono text-xs tracking-widest uppercase">No notifications</span>
              </div>
            ) : (
              <div className="p-3 flex flex-col gap-2">
                {recent.map((n, i) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    role={role}
                    onRead={id => useNotifications().markAsRead?.(id)}
                    compact={true}
                    isDisaster={isDisasterMode}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className={`flex-shrink-0 border-t px-4 py-3 ${isDisasterMode ? 'border-red-500/20' : 'border-primary-500/10'}`}>
            <Link
              to="/notifications"
              onClick={closePanel}
              className={[
                'w-full flex items-center justify-center gap-2',
                'font-data text-[10px] tracking-widest uppercase',
                'py-2 rounded border transition-all duration-200',
                isDisasterMode
                  ? 'text-red-300/70 border-red-500/20 hover:bg-red-500/5 hover:text-red-200'
                  : 'text-primary-300/70 border-primary-500/20 hover:bg-primary-500/5 hover:text-primary-200',
              ].join(' ')}
            >
              View Full History →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;