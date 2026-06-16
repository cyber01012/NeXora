import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import ToastContainer from './ToastContainer';

/**
 * ==========================================
 * NOTIFICATION CONTEXT — UPDATED
 * ==========================================
 */

// const BASE_URL = '/api/notifications';
const BASE_URL = 'http://localhost:8080/api/notifications';
const POLL_INTERVAL = 30_000;

const NotificationContext = createContext(null);

// ---------------------------------------------------------------------------
// Auth helper — reads token (supports both 'token' and 'accessToken')
// ---------------------------------------------------------------------------
// function getToken() {
//   return localStorage.getItem('accessToken') || localStorage.getItem('token');
// }
function getToken() {
  return localStorage.getItem('nexora_access_token');
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
// const MOCK_NOTIFICATIONS = [
//   {
//     id: 'mock-1',
//     type: 'COMPLAINT_STATUS_UPDATE',
//     title: 'Report Submitted Successfully',
//     message: 'Your report has been successfully logged and is pending review.',
//     isRead: false,
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 'mock-2',
//     type: 'TASK_ASSIGNED',
//     title: 'New Task Assigned: Sector 7',
//     message: 'You have been deployed to Sector 7 for immediate action.',
//     isRead: false,
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 'mock-3',
//     type: 'DISASTER_MODE_ACTIVATED',
//     title: 'Disaster Mode Activated',
//     message: 'Emergency protocol engaged. All units on standby.',
//     isRead: false,
//     createdAt: new Date().toISOString(),
//   }
// ];

export const NotificationProvider = ({ children }) => {
  // CHANGE:
const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
  // const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  // const [unreadCount, setUnreadCount] = useState(3);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  // const lastKnownIds = useRef(new Set(MOCK_NOTIFICATIONS.map(n => n.id)));
  const lastKnownIds = useRef(new Set());

  // Check if user is authenticated
  // const isAuthenticated = !!getToken();
  const isAuthenticated = !!getToken() && !!localStorage.getItem('nexora_user');

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
      // let newNotifications = Array.isArray(data) ? data : [];
      const newNotifications = Array.isArray(data) ? data : [];

      setNotifications(newNotifications);
    } catch (e) {
      setError(e.message);
      setNotifications([]); // empty on error
    } finally {
      setLoading(false);
    }
}, [isAuthenticated]);
      
      // Inject mock data if real API returns empty (for demonstration purposes)
    //   if (newNotifications.length === 0) {
    //     newNotifications = MOCK_NOTIFICATIONS;
    //   }
      
    //   // Detect new notifications
    //   if (lastKnownIds.current.size > 0) {
    //     newNotifications.forEach(n => {
    //       if (!lastKnownIds.current.has(n.id) && !n.isRead) {
    //         window.addToast?.(`New Notification: ${n.title || 'You have a new update'}`);
    //       }
    //     });
    //   }
      
    //   // Update last known
    //   lastKnownIds.current = new Set(newNotifications.map(n => n.id));
    //   setNotifications(newNotifications);
    // } catch (e) {
    //   setError(e.message);
    // } finally {
    //   setLoading(false);
    // }
  // }, [isAuthenticated]);

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
      setUnreadCount(0);
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
      // setNotifications(MOCK_NOTIFICATIONS);
      // setUnreadCount(3);
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    
    fetchUnreadCount();
    fetchAll(); // ✅ Initial load

     pollRef.current = setInterval(() => {
      fetchUnreadCount();
    }, POLL_INTERVAL);
    
    return () => clearInterval(pollRef.current);
}, [fetchUnreadCount, fetchAll, isAuthenticated]);

  //   pollRef.current = setInterval(fetchUnreadCount, POLL_INTERVAL);
  //   return () => clearInterval(pollRef.current);
  // }, [fetchUnreadCount, isAuthenticated]);

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