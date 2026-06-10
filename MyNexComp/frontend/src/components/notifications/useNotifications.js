import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

/**
 * useNotifications — single import hook for all notification state & actions.
 *
 * Usage:
 *   const { notifications, unreadCount, markAsRead, togglePanel } = useNotifications();
 *
 * Throws if used outside <NotificationProvider>.
 */
export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within <NotificationProvider>');
  }
  return ctx;
}

export default useNotifications;
