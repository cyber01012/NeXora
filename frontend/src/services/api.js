import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add auth headers for requests
api.interceptors.request.use((config) => {
  // 1. Always attach the JWT access token — backend uses this as primary identity
  const accessToken = localStorage.getItem('nexora_access_token');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // 2. Also attach legacy custom headers as a fallback (used for Postman testing)
  const citizenId = localStorage.getItem('nexora_citizen_id') || '1';
  const responderUsername = localStorage.getItem('nexora_responder_username') || '';
  const workerUsername = localStorage.getItem('nexora_worker_username') || '';

  if (config.url?.includes('/citizen')) {
    config.headers['X-Citizen-Id'] = citizenId;
  }
  if (config.url?.includes('/responder') && responderUsername) {
    config.headers['X-Responder-Username'] = responderUsername;
  }
  if (config.url?.includes('/worker') && workerUsername) {
    config.headers['X-Worker-Username'] = workerUsername;
  }
  return config;
});

// Unwrap response
export const unwrap = (response) => {
  const body = response.data;
  if (body && body.success === false) {
    throw new Error(body.message || 'Request failed');
  }
  return body?.data ?? body;
};

// ========== CITIZEN API ==========
export const citizenApi = {
  // Dashboard
  stats: () => api.get('/citizen/stats').then(unwrap),
  myReports: (status) => api.get('/citizen/my-reports', { params: { status } }).then(unwrap),
  
  // Reports
  createReport: (payload) => api.post('/citizen/reports', payload).then(unwrap),
  trackReport: (id) => api.get(`/citizen/reports/${id}/track`).then(unwrap),

  // CHANGE THIS — use auth endpoint
  // changePassword: (payload) => api.post('/auth/change-password', payload).then(unwrap),
  
  // Map
  disasterZones: () => api.get('/citizen/map/disasters').then(unwrap),
  mapConfig: () => api.get('/citizen/map/config').then(unwrap),
  
  // Notifications
  notifications: () => api.get('/citizen/notifications').then(unwrap),
  markRead: (id) => api.put(`/citizen/notifications/${id}/read`).then(unwrap),
  
  // Locations
  savedLocations: () => api.get('/citizen/saved-locations').then(unwrap),
  addLocation: (payload) => api.post('/citizen/saved-locations', payload).then(unwrap),
  updateLocation: (id, payload) => api.put(`/citizen/saved-locations/${id}`, payload).then(unwrap),
  deleteLocation: (id) => api.delete(`/citizen/saved-locations/${id}`).then(unwrap),
  setDefaultLocation: (id) => api.put(`/citizen/saved-locations/${id}/default`).then(unwrap),
  
  // Profile
  getProfile: () => api.get('/citizen/profile').then(unwrap),
  updateProfile: (payload) => api.put('/citizen/profile', payload).then(unwrap),
  changePassword: (payload) => api.post('/citizen/change-password', payload).then(unwrap),
  
  // Help Desk
  getHelpMessages: () => api.get('/citizen/helpdesk').then(unwrap),
  sendHelpMessage: (message) => api.post('/citizen/helpdesk', { message }).then(unwrap),
  
  // Stats
  getStats: () => api.get('/citizen/stats').then(unwrap),
};

// ========== RESPONDER API ==========
// export const responderApi = {
//   // Dashboard
//   tasks: (status) => api.get('/responder/tasks', { params: { status } }).then(unwrap),
//   task: (id) => api.get(`/responder/tasks/${id}`).then(unwrap),
//   getStats: () => api.get('/responder/stats').then(unwrap),
//   performance: () => api.get('/responder/performance').then(unwrap),
  
//   // Task Actions
//   accept: (id) => api.post(`/responder/tasks/${id}/accept`).then(unwrap),
//   reject: (id, reason) => api.post(`/responder/tasks/${id}/reject`, { reason }).then(unwrap),
//    updateStatus: (id, payload) => api.put(`/responder/tasks/${id}/status`, payload).then(unwrap),
  
//   // Workers
//     workers: () => api.get('/responder/workers').then(unwrap),
//   addWorker: (payload) => api.post('/responder/workers', payload).then(unwrap),
//   removeWorker: (username) => api.delete(`/responder/workers/${username}`).then(unwrap),
  
//   // History
// taskHistory: () => api.get('/responder/task-history').then(unwrap),
  
//   // Map
//   taskLocations: () => api.get('/responder/map/tasks').then(unwrap),
  
//   // Help Desk
//   getHelpMessages: () => api.get('/responder/helpdesk').then(unwrap),
//   sendHelpMessage: (message) => api.post('/responder/helpdesk', { message }).then(unwrap),

//   // Notifications
//   notifications: () => api.get('/responder/notifications').then(unwrap),
//   markNotifRead: (id) => api.put(`/responder/notifications/${id}/read`).then(unwrap),
//   deleteNotification: (id) => api.delete(`/responder/notifications/${id}`).then(unwrap),

  
//   // Profile
//   getProfile: () => api.get('/responder/profile').then(unwrap),
//   updateProfile: (payload) => api.put('/responder/profile', payload).then(unwrap),
//   changePassword: (payload) => api.post('/responder/change-password', payload).then(unwrap),
//   availability: (available) => api.put('/responder/availability', { available }).then(unwrap),
//   confirmCompletion: (id, remarks) => api.put(`/responder/tasks/${id}/confirm-complete`, { remarks }).then(unwrap),

//   // Add these methods inside responderApi object
// getVolunteers: () => api.get('/responder/volunteers').then(unwrap),
 
//    assignToVolunteer: (id, volunteerUsername) => 
//         api.put(`/responder/tasks/${id}/assign-volunteer`, { volunteerUsername }).then(unwrap),
//    volunteers: () => api.get('/responder/volunteers').then(unwrap),
// };

// ========== FORWARD DECISION API ==========
// export const forwardDecisionApi = {
//   // Get all evidence for responder's department (no parameter needed)
//   getByDepartment: () => api.get('/forward-decision/department').then(unwrap),
  
//   // Get evidence for specific complaint
//   getByComplaint: (complaintId) => api.get(`/forward-decision/complaint/${complaintId}`).then(unwrap),
  
//   // Confirm completion (Responder)
//   confirmCompletion: (complaintId) => api.put(`/forward-decision/confirm/${complaintId}`).then(unwrap),
  
//   // Submit evidence (Volunteer)
//   submit: (payload) => api.post('/forward-decision', payload).then(unwrap),
// };

export const responderApi = {
  // Dashboard
  tasks: (status) => api.get('/responder/tasks', { params: { status } }).then(unwrap),
  task: (id) => api.get(`/responder/tasks/${id}`).then(unwrap),
  getStats: () => api.get('/responder/stats').then(unwrap),
  performance: () => api.get('/responder/performance').then(unwrap),
  
  // Task Actions
  accept: (id) => api.post(`/responder/tasks/${id}/accept`).then(unwrap),
  reject: (id, reason) => api.post(`/responder/tasks/${id}/reject`, { reason }).then(unwrap),
  updateStatus: (id, payload) => api.put(`/responder/tasks/${id}/status`, payload).then(unwrap),
  confirmCompletion: (id, remarks) => api.put(`/responder/tasks/${id}/confirm-complete`, { remarks }).then(unwrap),
  assignToVolunteer: (id, volunteerUsername) => 
    api.put(`/responder/tasks/${id}/assign-volunteer`, { volunteerUsername }).then(unwrap),
  
  // Workers
  workers: () => api.get('/responder/workers').then(unwrap),
  addWorker: (payload) => api.post('/responder/workers', payload).then(unwrap),
  removeWorker: (username) => api.delete(`/responder/workers/${username}`).then(unwrap),
  
  // History
  taskHistory: () => api.get('/responder/task-history').then(unwrap),
  
  // Map
  taskLocations: () => api.get('/responder/map/tasks').then(unwrap),
  
  // Help Desk
  getHelpMessages: () => api.get('/responder/helpdesk').then(unwrap),
  sendHelpMessage: (message) => api.post('/responder/helpdesk', { message }).then(unwrap),

  // Notifications
  notifications: () => api.get('/responder/notifications').then(unwrap),
  markNotifRead: (id) => api.put(`/responder/notifications/${id}/read`).then(unwrap),
  deleteNotification: (id) => api.delete(`/responder/notifications/${id}`).then(unwrap),
  
  // Profile
  getProfile: () => api.get('/responder/profile').then(unwrap),
  updateProfile: (payload) => api.put('/responder/profile', payload).then(unwrap),
  changePassword: (payload) => api.post('/responder/change-password', payload).then(unwrap),
  availability: (available) => api.put('/responder/availability', { available }).then(unwrap),
};

// ========== FORWARD DECISION API ==========
export const forwardDecisionApi = {
  // Get all evidence for responder's department
  getByDepartment: () => api.get('/responder/field-reports').then(unwrap),
  
  // Get evidence for specific complaint
  getByComplaint: (complaintId) => api.get(`/responder/field-reports/complaint/${complaintId}`).then(unwrap),
  
  // Confirm completion (Responder)
  confirmCompletion: (complaintId) => api.put(`/responder/field-reports/confirm/${complaintId}`).then(unwrap),
  
  // Submit evidence (Volunteer)
  submit: (payload) => api.post('/responder/field-reports', payload).then(unwrap),
};

// ========== WORKER API ==========
export const workerApi = {
  // Dashboard
  dashboard: (workerUsername) =>
    api.get('/worker/dashboard', { params: workerUsername ? { workerUsername } : {} }).then(unwrap),

  // Tasks (assigned tasks — active only)
  tasks: (status) =>
    api.get('/worker/tasks', { params: status ? { status } : {} }).then(unwrap),

  // Nearby tasks alias (same endpoint, frontend compat)
  nearbyTasks: () => api.get('/worker/tasks').then(unwrap),

  // Single task
  task: (id) => api.get(`/worker/tasks/${id}`).then(unwrap),

  // Task actions
  acceptTask: (taskId) =>
    api.post(`/worker/tasks/${taskId}/accept`).then(unwrap),

  rejectTask: (taskId, reason) =>
    api.post(`/worker/tasks/${taskId}/reject`, { reason }).then(unwrap),

  completeTask: (taskId, remarks) =>
    api.post(`/worker/tasks/${taskId}/complete`, { remarks }).then(unwrap),

  updateProgress: (taskId, payload) =>
    api.post(`/worker/tasks/${taskId}/progress`, payload).then(unwrap),

  requestHelp: (taskId, reason) =>
    api.post(`/worker/tasks/${taskId}/help`, { reason }).then(unwrap),

  // Task History (completed + rejected)
  taskHistory: () => api.get('/worker/task-history').then(unwrap),

  // Profile
  getProfile: () => api.get('/worker/profile').then(unwrap),
  updateProfile: (payload) => api.put('/worker/profile', payload).then(unwrap),

  // Performance
  performance: () => api.get('/worker/performance').then(unwrap),

  // Help Desk
  getHelpMessages: () => api.get('/worker/helpdesk').then(unwrap),
  sendHelpMessage: (message) => api.post('/worker/helpdesk', { message }).then(unwrap),
};

export default api;