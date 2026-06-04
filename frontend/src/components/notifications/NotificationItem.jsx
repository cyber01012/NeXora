import React from 'react';
import { motion } from 'framer-motion';
import {
  Siren, TriangleAlert, FilePlus, FileX, XCircle,
  ClipboardList, ClipboardCheck, Archive, RefreshCw,
  CheckCircle, ShieldCheck, CheckSquare, UserPlus,
  KeyRound, Bell,
} from 'lucide-react';
import { getTypeConfig, getRolePermissions, timeAgo, SEVERITY } from './notificationConfig';

/**
 * Icon resolver — maps config.icon string → Lucide component
 */
const ICON_MAP = {
  'siren':            Siren,
  'triangle-alert':   TriangleAlert,
  'file-plus':        FilePlus,
  'file-x':           FileX,
  'x-circle':         XCircle,
  'clipboard-list':   ClipboardList,
  'clipboard-check':  ClipboardCheck,
  'archive':          Archive,
  'refresh-cw':       RefreshCw,
  'check-circle':     CheckCircle,
  'shield-check':     ShieldCheck,
  'check-square':     CheckSquare,
  'user-plus':        UserPlus,
  'key-round':        KeyRound,
  'bell':             Bell,
};

/**
 * NotificationItem — single reusable row.
 * Used in both NotificationPanel (compact) and NotificationsPage (full).
 *
 * Props:
 *   notification  {object}   — backend Notification entity
 *   role          {string}   — current user's role (from auth context)
 *   onRead        {fn}       — called with notification.id
 *   compact       {boolean}  — panel mode (less padding, smaller text)
 *   isDisaster    {boolean}  — disaster mode active
 *   index         {number}   — for staggered animation
 */
const NotificationItem = ({
  notification,
  role = 'CITIZEN',
  onRead,
  compact = false,
  isDisaster = false,
  index = 0,
}) => {
  const cfg         = getTypeConfig(notification.type);
  const perms       = getRolePermissions(role);
  const isCritical  = cfg.severity === SEVERITY.CRITICAL;
  const TypeIcon    = ICON_MAP[cfg.icon] || Bell;
  const isUnread    = !notification.isRead;

  const handleClick = () => {
    if (isUnread && onRead) onRead(notification.id);
  };

  // Action button logic — role-aware
  const showReportAction = perms.canViewReport &&
    ['REPORT', 'SOS'].includes(notification.referenceType);
  const showTaskAction = perms.canViewTask &&
    notification.referenceType === 'TASK';

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={handleClick}
      className={[
        'relative flex gap-3 rounded-lg border transition-all duration-200 cursor-pointer group',
        compact ? 'p-3' : 'p-4',
        cfg.bgClass,
        cfg.borderClass,
        isUnread ? 'opacity-100' : 'opacity-60',
        isCritical && isDisaster
          ? 'animate-pulse border-red-500/70'
          : isCritical
          ? 'border-red-500/50'
          : '',
        'hover:opacity-100 hover:border-opacity-70',
      ].join(' ')}
      style={isCritical ? {
        boxShadow: `0 0 12px ${isDisaster ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.15)'}`,
      } : undefined}
    >
      {/* Severity dot + icon */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dotClass}`} />
        <div className={`${cfg.colorClass} opacity-80`}>
          <TypeIcon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Type label + timestamp */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`font-data tracking-widest uppercase ${cfg.colorClass} ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
            {cfg.label}
          </span>
          <span className="font-mono text-[10px] text-white/30 flex-shrink-0">
            {timeAgo(notification.createdAt)}
          </span>
        </div>

        {/* Message */}
        <p className={`font-mono text-white/75 leading-relaxed ${compact ? 'text-[11px] line-clamp-2' : 'text-xs'}`}>
          {notification.message}
        </p>

        {/* Role-based action buttons */}
        {!compact && (showReportAction || showTaskAction) && (
          <div className="mt-2 flex gap-2">
            {showReportAction && (
              <button
                onClick={e => e.stopPropagation()}
                className={`font-data text-[9px] tracking-widest uppercase px-3 py-1 rounded border ${cfg.borderClass} ${cfg.colorClass} hover:bg-white/5 transition-colors`}
              >
                {notification.referenceType === 'SOS' ? 'View SOS' : 'View Report'} #{notification.referenceId}
              </button>
            )}
            {showTaskAction && (
              <button
                onClick={e => e.stopPropagation()}
                className={`font-data text-[9px] tracking-widest uppercase px-3 py-1 rounded border ${cfg.borderClass} ${cfg.colorClass} hover:bg-white/5 transition-colors`}
              >
                View Task #{notification.referenceId}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Unread indicator */}
      {isUnread && (
        <div className="flex-shrink-0 pt-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
        </div>
      )}
    </motion.div>
  );
};

export default NotificationItem;
