/**
 * ==========================================
 * NOTIFICATION CONFIG — Source of Truth
 * ==========================================
 * Maps every NotificationType → severity, icon, label, colors.
 * Maps every recipientRole → which action buttons are visible.
 * Used by: NotificationItem, NotificationPanel, NotificationsPage.
 */

// ---------------------------------------------------------------------------
// SEVERITY LEVELS
// ---------------------------------------------------------------------------
export const SEVERITY = {
  CRITICAL: 'CRITICAL',
  HIGH:     'HIGH',
  MEDIUM:   'MEDIUM',
  SUCCESS:  'SUCCESS',
  INFO:     'INFO',
};

// ---------------------------------------------------------------------------
// TYPE CONFIG — keyed by NotificationType string from backend
// ---------------------------------------------------------------------------
export const TYPE_CONFIG = {
  SOS_SUBMITTED: {
    severity:    SEVERITY.CRITICAL,
    label:       'SOS Alert',
    icon:        'siren',
    colorClass:  'text-red-400',
    dotClass:    'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]',
    borderClass: 'border-red-500/60',
    bgClass:     'bg-red-500/8',
  },
  DISASTER_MODE_ACTIVATED: {
    severity:    SEVERITY.CRITICAL,
    label:       'Disaster Mode Activated',
    icon:        'triangle-alert',
    colorClass:  'text-red-400',
    dotClass:    'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]',
    borderClass: 'border-red-500/80',
    bgClass:     'bg-red-500/10',
  },
  REPORT_SUBMITTED: {
    severity:    SEVERITY.HIGH,
    label:       'Report Submitted',
    icon:        'file-plus',
    colorClass:  'text-orange-400',
    dotClass:    'bg-orange-400',
    borderClass: 'border-orange-500/40',
    bgClass:     'bg-orange-500/5',
  },
  REPORT_REJECTED_BY_DEPT: {
    severity:    SEVERITY.HIGH,
    label:       'Report Rejected',
    icon:        'file-x',
    colorClass:  'text-orange-400',
    dotClass:    'bg-orange-400',
    borderClass: 'border-orange-500/40',
    bgClass:     'bg-orange-500/5',
  },
  TASK_REJECTED: {
    severity:    SEVERITY.HIGH,
    label:       'Task Rejected',
    icon:        'x-circle',
    colorClass:  'text-orange-400',
    dotClass:    'bg-orange-400',
    borderClass: 'border-orange-500/40',
    bgClass:     'bg-orange-500/5',
  },
  REPORT_ASSIGNED: {
    severity:    SEVERITY.MEDIUM,
    label:       'Report Assigned',
    icon:        'clipboard-list',
    colorClass:  'text-yellow-400',
    dotClass:    'bg-yellow-400',
    borderClass: 'border-yellow-500/40',
    bgClass:     'bg-yellow-500/5',
  },
  TASK_ASSIGNED: {
    severity:    SEVERITY.MEDIUM,
    label:       'Task Assigned',
    icon:        'clipboard-check',
    colorClass:  'text-yellow-400',
    dotClass:    'bg-yellow-400',
    borderClass: 'border-yellow-500/40',
    bgClass:     'bg-yellow-500/5',
  },
  TASK_DISPOSED: {
    severity:    SEVERITY.MEDIUM,
    label:       'Task Disposed',
    icon:        'archive',
    colorClass:  'text-yellow-400',
    dotClass:    'bg-yellow-400',
    borderClass: 'border-yellow-500/40',
    bgClass:     'bg-yellow-500/5',
  },
  REPORT_STATUS_UPDATED: {
    severity:    SEVERITY.MEDIUM,
    label:       'Report Updated',
    icon:        'refresh-cw',
    colorClass:  'text-yellow-400',
    dotClass:    'bg-yellow-400',
    borderClass: 'border-yellow-500/40',
    bgClass:     'bg-yellow-500/5',
  },
  REPORT_COMPLETED: {
    severity:    SEVERITY.SUCCESS,
    label:       'Report Completed',
    icon:        'check-circle',
    colorClass:  'text-emerald-400',
    dotClass:    'bg-emerald-400',
    borderClass: 'border-emerald-500/40',
    bgClass:     'bg-emerald-500/5',
  },
  REPORT_VERIFIED: {
    severity:    SEVERITY.SUCCESS,
    label:       'Report Verified',
    icon:        'shield-check',
    colorClass:  'text-emerald-400',
    dotClass:    'bg-emerald-400',
    borderClass: 'border-emerald-500/40',
    bgClass:     'bg-emerald-500/5',
  },
  TASK_ACCEPTED: {
    severity:    SEVERITY.SUCCESS,
    label:       'Task Accepted',
    icon:        'check-square',
    colorClass:  'text-emerald-400',
    dotClass:    'bg-emerald-400',
    borderClass: 'border-emerald-500/40',
    bgClass:     'bg-emerald-500/5',
  },
  ACCOUNT_CREATED: {
    severity:    SEVERITY.INFO,
    label:       'Account Created',
    icon:        'user-plus',
    colorClass:  'text-primary-400',
    dotClass:    'bg-primary-400',
    borderClass: 'border-primary-500/40',
    bgClass:     'bg-primary-500/5',
  },
  PASSWORD_RESET: {
    severity:    SEVERITY.INFO,
    label:       'Password Reset',
    icon:        'key-round',
    colorClass:  'text-primary-400',
    dotClass:    'bg-primary-400',
    borderClass: 'border-primary-500/40',
    bgClass:     'bg-primary-500/5',
  },
};

// Fallback for unknown types
export const DEFAULT_TYPE_CONFIG = {
  severity:    SEVERITY.INFO,
  label:       'Notification',
  icon:        'bell',
  colorClass:  'text-primary-400',
  dotClass:    'bg-primary-400',
  borderClass: 'border-primary-500/40',
  bgClass:     'bg-primary-500/5',
};

// ---------------------------------------------------------------------------
// ROLE PERMISSIONS — controls which action buttons render
// ---------------------------------------------------------------------------
export const ROLE_PERMISSIONS = {
  CITIZEN: {
    canViewReport:    true,
    canViewTask:      false,
    canViewSOS:       true,
    canBroadcast:     false,
    canViewAllRoles:  false,
  },
  HELP_DESK: {
    canViewReport:    true,
    canViewTask:      false,
    canViewSOS:       true,
    canBroadcast:     false,
    canViewAllRoles:  false,
  },
  ASSIGNING_OFFICER: {
    canViewReport:    true,
    canViewTask:      true,
    canViewSOS:       true,
    canBroadcast:     false,
    canViewAllRoles:  false,
  },
  RESPONDER: {
    canViewReport:    true,
    canViewTask:      true,
    canViewSOS:       true,
    canBroadcast:     false,
    canViewAllRoles:  false,
  },
  NGO: {
    canViewReport:    true,
    canViewTask:      true,
    canViewSOS:       false,
    canBroadcast:     false,
    canViewAllRoles:  false,
  },
  WORKER: {
    canViewReport:    false,
    canViewTask:      true,
    canViewSOS:       false,
    canBroadcast:     false,
    canViewAllRoles:  false,
  },
  VOLUNTEER: {
    canViewReport:    false,
    canViewTask:      true,
    canViewSOS:       false,
    canBroadcast:     false,
    canViewAllRoles:  false,
  },
  ADMIN: {
    canViewReport:    true,
    canViewTask:      true,
    canViewSOS:       true,
    canBroadcast:     true,
    canViewAllRoles:  true,
  },
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
export function getTypeConfig(type) {
  return TYPE_CONFIG[type] || DEFAULT_TYPE_CONFIG;
}

export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.CITIZEN;
}

export function getSeverityOrder(type) {
  const cfg = getTypeConfig(type);
  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, SUCCESS: 3, INFO: 4 };
  return order[cfg.severity] ?? 4;
}

/** Relative time: "just now", "5 min ago", "2 hrs ago", "3 days ago" */
export function timeAgo(dateString) {
  if (!dateString) return '';
  const date  = new Date(dateString);
  const now   = new Date();
  const secs  = Math.floor((now - date) / 1000);
  if (secs < 60)  return 'just now';
  const mins  = Math.floor(secs / 60);
  if (mins < 60)  return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days  = Math.floor(hours / 24);
  if (days < 7)   return `${days}d ago`;
  return date.toLocaleDateString();
}

/** Group notifications by date label */
export function groupByDate(notifications) {
  const groups = {};
  const today     = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  notifications.forEach(n => {
    const d = new Date(n.createdAt);
    let label;
    if (d.toDateString() === today.toDateString())     label = 'Today';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  });
  return groups;
}
