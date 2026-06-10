import { useEffect, useState } from 'react';
import HUDCard from '../../components/ui/HUDCard';
import { citizenApi } from '../../services/api';

export default function CitizenNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await citizenApi.notifications();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await citizenApi.markRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    for (const id of unreadIds) {
      await citizenApi.markRead(id);
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'TASK_UPDATE': return '✅';
      case 'COMPLETION': return '🎉';
      case 'DISASTER_ALERT': return '⚠️';
      case 'SYSTEM': return '🔔';
      default: return '📢';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'TASK_UPDATE': return '#60a5fa';
      case 'COMPLETION': return '#4ade80';
      case 'DISASTER_ALERT': return '#ef4444';
      default: return '#22d3ee';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="font-mono text-primary-400 animate-pulse">LOADING NOTIFICATIONS...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-title text-glow-primary text-3xl tracking-wider">NOTIFICATIONS</h1>
          <p className="font-mono text-[10px] text-primary-500/60 mt-1 tracking-wider">
            [ REAL-TIME UPDATES & ALERTS ]
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 hud-glass rounded-md border-hud font-data text-xs text-primary-300 hover:text-glow-primary transition-all"
            >
              MARK ALL READ ({unreadCount})
            </button>
          )}
          <div className="px-3 py-2 hud-glass rounded-md border-hud">
            <span className="font-mono text-xs text-glow-primary">{notifications.length} TOTAL</span>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <HUDCard className="text-center py-12">
          <div className="text-5xl mb-3 opacity-40">🔔</div>
          <p className="font-mono text-sm text-primary-400/60">No notifications yet</p>
          <p className="font-mono text-[10px] text-primary-500/40 mt-1">
            Notifications will appear here when your reports are updated
          </p>
        </HUDCard>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <HUDCard
              key={notif.id}
              className={`transition-all cursor-pointer ${!notif.isRead ? 'border-primary-glow/50 shadow-[0_0_10px_rgba(var(--primary-glow-rgb),0.1)]' : 'opacity-80'}`}
              onClick={() => !notif.isRead && markAsRead(notif.id)}
            >
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: `${getIconColor(notif.type)}20` }}
                >
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-data text-sm text-glow-primary">{notif.title}</p>
                      <p className="font-mono text-xs text-primary-300 mt-1">{notif.message}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary-glow animate-pulse" />
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-mono text-[9px] text-primary-500/50">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                    {!notif.isRead && (
                      <span className="font-mono text-[9px] text-glow-primary">NEW</span>
                    )}
                  </div>
                </div>
              </div>
            </HUDCard>
          ))}
        </div>
      )}
    </div>
  );
}