import { useEffect, useState } from 'react';
import { responderApi } from '../../services/api';
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftEllipsisIcon,
  UserPlusIcon,
  DocumentCheckIcon,
  TrashIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

// Notification Icon Component
const NotificationIcon = ({ type }) => {
  const icons = {
    NEW_TASK: { icon: '📋', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
    TASK_ACCEPTED: { icon: '✅', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
    TASK_REJECTED: { icon: '❌', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
    WORKER_ASSIGNED: { icon: '👥', color: '#c084fc', bg: 'rgba(192,132,252,0.15)' },
    WORKER_COMPLETED: { icon: '🎉', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
    ESCALATION: { icon: '⚠️', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
    ADMIN_MESSAGE: { icon: '💬', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
    SYSTEM: { icon: '🔔', color: '#8899aa', bg: 'rgba(136,153,170,0.15)' },
  };
  const t = icons[type] || icons.SYSTEM;
  
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: t.bg, border: `1px solid ${t.color}30` }}>
      {t.icon}
    </div>
  );
};

// Notification Card Component
const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'Just now';
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return notifDate.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'HIGH': return 'border-l-4 border-red-500';
      case 'URGENT': return 'border-l-4 border-red-600 animate-pulse-glow';
      default: return '';
    }
  };

  return (
    <div 
      className={`bg-[var(--bg2)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/50 ${getPriorityClass(notification.priority)} ${!notification.isRead ? 'bg-gradient-to-r from-cyan-900/10 to-transparent' : 'opacity-80'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex gap-3">
          <NotificationIcon type={notification.type} />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-data text-sm text-glow-primary">{notification.title}</p>
                <p className="font-mono text-xs text-cyan-300 mt-1">{notification.message}</p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" /> {formatDate(notification.createdAt)}
                </span>
                {notification.relatedTaskId && (
                  <span className="font-mono text-[9px] text-cyan-400/60">
                    Task: {notification.relatedTaskId}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!notification.isRead && (
                  <button
                    onClick={() => onMarkRead(notification.id)}
                    className="text-[9px] font-mono text-cyan-400/70 hover:text-cyan-400 transition-colors flex items-center gap-1"
                  >
                    <CheckBadgeIcon className="w-3 h-3" /> Mark Read
                  </button>
                )}
                <button
                  onClick={() => onDelete(notification.id)}
                  className="text-[9px] font-mono text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <TrashIcon className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ResponderNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    loadNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [filter, notifications]);

  const loadNotifications = async () => {
    try {
      const data = await responderApi.notifications().catch(() => []);
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };



  const filterNotifications = () => {
    let filtered = [...notifications];
    
    if (filter === 'UNREAD') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter === 'URGENT') {
      filtered = filtered.filter(n => n.priority === 'HIGH' || n.priority === 'URGENT');
    } else if (filter === 'TASKS') {
      filtered = filtered.filter(n => ['NEW_TASK', 'TASK_ACCEPTED', 'WORKER_COMPLETED', 'ESCALATION'].includes(n.type));
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredNotifications(filtered);
  };

  const handleMarkRead = async (id) => {
    setActionInProgress(true);
    try {
      await responderApi.markNotifRead(id);
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Optimistic update
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } finally {
      setActionInProgress(false);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;
    
    setActionInProgress(true);
    try {
      for (const id of unreadIds) {
        await responderApi.markNotifRead(id);
      }
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDelete = async (id) => {
    setActionInProgress(true);
    try {
      await responderApi.deleteNotification?.(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
      // Optimistic update
      setNotifications(prev => prev.filter(n => n.id !== id));
    } finally {
      setActionInProgress(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.priority === 'HIGH' || n.priority === 'URGENT').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING NOTIFICATIONS... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">NOTIFICATIONS</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ REAL-TIME UPDATES & ALERTS ]</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={actionInProgress}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-xs text-glow-primary hover:bg-cyan-500/30 transition-all flex items-center gap-2"
            >
              <CheckBadgeIcon className="w-4 h-4" /> MARK ALL READ ({unreadCount})
            </button>
          )}
          <div className="px-3 py-2 bg-[var(--bg3)] rounded-lg border border-[var(--border)]">
            <span className="font-mono text-xs text-glow-primary">{notifications.length} TOTAL</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'TOTAL', value: notifications.length, color: '#06b6d4', icon: '🔔' },
          { label: 'UNREAD', value: unreadCount, color: '#fbbf24', icon: '🆕' },
          { label: 'URGENT', value: urgentCount, color: '#ef4444', icon: '⚠️' },
          { label: 'TASKS', value: notifications.filter(n => ['NEW_TASK', 'TASK_ACCEPTED', 'WORKER_COMPLETED'].includes(n.type)).length, color: '#4ade80', icon: '📋' },
        ].map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02] animate-scaleIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <span className="text-xl">{stat.icon}</span>
            <p className="font-data text-2xl mt-1" style={{ textShadow: `0 0 10px ${stat.color}`, color: stat.color }}>
              {stat.value}
            </p>
            <p className="font-mono text-[8px] text-cyan-400/60 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-[var(--bg3)]/50 p-1 rounded-xl border border-[var(--border)]">
        {[
          { key: 'ALL', label: 'ALL', icon: '🔔' },
          { key: 'UNREAD', label: 'UNREAD', icon: '🆕', count: unreadCount },
          { key: 'URGENT', label: 'URGENT', icon: '⚠️', count: urgentCount },
          { key: 'TASKS', label: 'TASKS', icon: '📋' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
              filter === tab.key
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                : 'text-gray-500 hover:text-cyan-300 hover:bg-cyan-500/5'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${filter === tab.key ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-400'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-12 text-center">
          <div className="text-6xl mb-3 opacity-40">🔔</div>
          <p className="font-mono text-sm text-gray-400">No notifications</p>
          <p className="font-mono text-[10px] text-cyan-500/40 mt-1">New notifications will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification, idx) => (
            <div key={notification.id} className="animate-slideInRight" style={{ animationDelay: `${idx * 0.02}s` }}>
              <NotificationCard 
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 15px rgba(239,68,68,0.6); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
        .animate-pulse-glow { animation: pulse-glow 1.5s infinite; }
      `}</style>
    </div>
  );
}