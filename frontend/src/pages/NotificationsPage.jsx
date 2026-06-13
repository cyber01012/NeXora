import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, BellOff, CheckCheck, Search,
  Filter, Loader2, TriangleAlert, X,
} from 'lucide-react';
import { useNotifications } from '../components/notifications/useNotifications';
import { useDisasterMode } from '../context/DisasterContext';
import NotificationItem from '../components/notifications/NotificationItem';
import { SEVERITY, getTypeConfig, groupByDate } from '../components/notifications/notificationConfig';

const SEVERITY_FILTERS = ['ALL', SEVERITY.CRITICAL, SEVERITY.HIGH, SEVERITY.MEDIUM, SEVERITY.SUCCESS, SEVERITY.INFO];
const SEVERITY_LABELS  = { ALL: 'All', CRITICAL: 'Critical', HIGH: 'High', MEDIUM: 'Medium', SUCCESS: 'Success', INFO: 'Info' };
const SEVERITY_COLORS  = {
  ALL:      'text-white/80 border-white/30 hover:border-white/50',
  CRITICAL: 'text-red-400 border-red-500/40 hover:border-red-400/70',
  HIGH:     'text-orange-400 border-orange-500/40 hover:border-orange-400/70',
  MEDIUM:   'text-yellow-400 border-yellow-500/40 hover:border-yellow-400/70',
  SUCCESS:  'text-emerald-400 border-emerald-500/40 hover:border-emerald-400/70',
  INFO:     'text-primary-400 border-primary-500/40 hover:border-primary-400/70',
};

const NotificationsPage = ({ role = 'CITIZEN' }) => {
  const { notifications, unreadCount, loading, error, fetchAll, markAllAsRead } = useNotifications();
  const { isDisasterMode } = useDisasterMode();

  const [search,          setSearch]         = useState('');
  const [severityFilter,  setSeverityFilter]  = useState('ALL');
  const [showUnreadOnly,  setShowUnreadOnly]  = useState(false);
  const [searchFocused,   setSearchFocused]   = useState(false);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (showUnreadOnly && n.isRead) return false;
      if (severityFilter !== 'ALL') {
        const cfg = getTypeConfig(n.type);
        if (cfg.severity !== severityFilter) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          n.message?.toLowerCase().includes(q) ||
          n.type?.toLowerCase().includes(q) ||
          n.referenceType?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notifications, search, severityFilter, showUnreadOnly]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const hasDisasterAlert = notifications.some(n => n.type === 'DISASTER_MODE_ACTIVATED');

  return (
    <div className="min-h-screen bg-[var(--color-hud-bg)] text-white">
      {/* Subtle background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,var(--primary-glow)08_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-glow)08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-20" />

      {/* FULL WIDTH CONTAINER */}
      <div className="relative w-full max-w-[1800px] mx-auto px-6 lg:px-16 xl:px-24 py-10">

        {/* ── Disaster Alert Banner ── */}
        <AnimatePresence>
          {isDisasterMode && hasDisasterAlert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 rounded-lg border border-red-500/50 bg-red-500/10 px-5 py-4 flex items-center gap-3 overflow-hidden"
              style={{ boxShadow: '0 0 20px rgba(239,68,68,0.15)' }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <TriangleAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
              </motion.div>
              <span className="font-data text-sm text-red-300 tracking-widest uppercase">
                ⚠ System Alert — Disaster Protocol Engaged. All critical notifications prioritised.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-primary-500/30 text-primary-400/80 hover:text-primary-300 hover:border-primary-400/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className={`font-data text-xl tracking-widest uppercase ${isDisasterMode ? 'text-red-300' : 'text-primary-300'}`}>
                Notifications
              </h1>
              <p className="font-mono text-sm text-white/50 mt-1">
                {notifications.length} total · {unreadCount} unread
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className={[
                'flex items-center gap-2 font-data text-xs tracking-widest uppercase',
                'px-4 py-2.5 rounded-lg border transition-all cursor-pointer',
                isDisasterMode
                  ? 'text-red-300/80 border-red-500/30 hover:bg-red-500/10'
                  : 'text-primary-300/80 border-primary-500/30 hover:bg-primary-500/10',
              ].join(' ')}
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          )}
        </motion.div>

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 flex flex-col gap-4"
        >
          {/* Search bar */}
          <div className={[
            'flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-200',
            'bg-[rgba(var(--bg-dark-rgb),0.6)] backdrop-blur-sm',
            searchFocused
              ? isDisasterMode ? 'border-red-500/50' : 'border-primary-500/50'
              : 'border-white/15',
          ].join(' ')}>
            <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search notifications..."
              className="flex-1 bg-transparent font-mono text-sm text-white/90 placeholder-white/40 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-white/50 hover:text-white/80">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Severity chips + Unread toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-4 h-4 text-white/40 flex-shrink-0" />
            {SEVERITY_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={[
                  'font-data text-xs tracking-widest uppercase px-3 py-1.5 rounded border transition-all cursor-pointer',
                  severityFilter === s
                    ? `${SEVERITY_COLORS[s]} bg-white/5`
                    : 'text-white/50 border-white/15 hover:border-white/30 hover:text-white/70',
                ].join(' ')}
              >
                {SEVERITY_LABELS[s]}
              </button>
            ))}
            <div className="ml-auto">
              <button
                onClick={() => setShowUnreadOnly(p => !p)}
                className={[
                  'font-data text-xs tracking-widest uppercase px-3 py-1.5 rounded border transition-all cursor-pointer',
                  showUnreadOnly
                    ? isDisasterMode
                      ? 'text-red-300 border-red-500/50 bg-red-500/10'
                      : 'text-primary-300 border-primary-500/50 bg-primary-500/10'
                    : 'text-white/50 border-white/15 hover:border-white/30 hover:text-white/70',
                ].join(' ')}
              >
                Unread Only
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-white/50">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="font-mono text-sm tracking-widest uppercase">Loading notifications...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-24 text-red-400/80">
            <TriangleAlert className="w-10 h-10" />
            <p className="font-mono text-sm">Failed to load: {error}</p>
            <button
              onClick={fetchAll}
              className="font-data text-xs tracking-widest uppercase px-5 py-2.5 rounded border border-red-500/40 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-24 text-white/40"
          >
            <BellOff className="w-12 h-12" />
            <p className="font-mono text-sm tracking-widest uppercase">
              {search || severityFilter !== 'ALL' || showUnreadOnly
                ? 'No notifications match your filters'
                : 'No notifications yet'}
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-10 w-full">
            {Object.entries(grouped).map(([dateLabel, items], groupIdx) => (
              <motion.section
                key={dateLabel}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: groupIdx * 0.07 }}
                className="w-full"
              >
                {/* Date label */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-data text-xs tracking-widest uppercase text-white/50">
                    {dateLabel}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                  <span className="font-mono text-xs text-white/40">{items.length}</span>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-3 w-full">
                  {items.map((n, i) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      role={role}
                      onRead={id => useNotifications().markAsRead?.(id)}
                      compact={false}
                      isDisaster={isDisasterMode}
                      index={i}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;