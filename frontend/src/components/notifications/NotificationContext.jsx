import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import ToastContainer from './ToastContainer';

/**
 * ==========================================
 * NOTIFICATION CONTEXT — UPDATED
 * ==========================================
 */

const BASE_URL = '/api/notifications';
const POLL_INTERVAL = 30_000;

const NotificationContext = createContext(null);

// ---------------------------------------------------------------------------
// Auth helper — reads token (supports both 'token' and 'accessToken')
// ---------------------------------------------------------------------------
function getToken() {
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
}

function getAuthHeaders() {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const lastKnownIds = useRef(new Set());

  // Check if user is authenticated
  const isAuthenticated = !!getToken();

  // ------------------------------------------------------------------
  // Fetch all notifications
  // ------------------------------------------------------------------
  const fetchAll = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(BASE_URL, { 
        headers: getAuthHeaders(),
        credentials: 'include' // Send cookies if using cookie-based auth
      });
      if (res.status === 401) {
        // Token expired or invalid
        setError('Session expired. Please login again.');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const newNotifications = Array.isArray(data) ? data : [];
      
      // Detect new notifications
      if (lastKnownIds.current.size > 0) {
        newNotifications.forEach(n => {
          if (!lastKnownIds.current.has(n.id) && !n.isRead) {
            window.addToast?.(`New Notification: ${n.title || 'You have a new update'}`);
          }
        });
      }
      
      // Update last known
      lastKnownIds.current = new Set(newNotifications.map(n => n.id));
      setNotifications(newNotifications);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ------------------------------------------------------------------
  // Fetch unread count
  // ------------------------------------------------------------------
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const res = await fetch(`${BASE_URL}/count`, { 
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.count ?? 0);
    } catch {
      // silent fail for polling
    }
  }, [isAuthenticated]);

  // ------------------------------------------------------------------
  // Mark single as read
  // ------------------------------------------------------------------
  const markAsRead = useCallback(async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const now = new Date().toISOString();
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true, readAt: now } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error('markAsRead failed:', e);
    }
  }, []);

  // ------------------------------------------------------------------
  // Mark ALL as read
  // ------------------------------------------------------------------
  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/read-all`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const now = new Date().toISOString();
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true, readAt: now }))
      );
      setUnreadCount(0);
    } catch (e) {
      console.error('markAllAsRead failed:', e);
    }
  }, []);

  // ------------------------------------------------------------------
  // Panel controls
  // ------------------------------------------------------------------
  const openPanel = useCallback(() => {
    setPanelOpen(true);
    fetchAll();
  }, [fetchAll]);

  const closePanel = useCallback(() => setPanelOpen(false), []);

  const togglePanel = useCallback(() => {
    setPanelOpen(prev => {
      if (!prev) fetchAll();
      return !prev;
    });
  }, [fetchAll]);

  // ------------------------------------------------------------------
  // Polling with auth check
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    
    fetchUnreadCount();
    pollRef.current = setInterval(fetchUnreadCount, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [fetchUnreadCount, isAuthenticated]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      panelOpen,
      loading,
      error,
      fetchAll,
      fetchUnreadCount,
      markAsRead,
      markAllAsRead,
      openPanel,
      closePanel,
      togglePanel,
    }}>
      <ToastContainer />
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext };
export default NotificationContext;