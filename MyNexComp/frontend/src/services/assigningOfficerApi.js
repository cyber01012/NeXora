import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexora_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap { success, data, message } responses
const unwrap = (response) => {
  const body = response.data;
  if (body && body.success === false) {
    throw new Error(body.message || 'Request failed');
  }
  return body?.data ?? body;
};

// ========== ASSIGNING OFFICER API ==========
export const assigningOfficerApi = {
  // Dashboard
  dashboard: () => api.get('/assigning-officer/dashboard').then(unwrap),

  // Pending reports (SOS + Civic)
  pendingReports: () => api.get('/assigning-officer/pending-reports').then(unwrap),

  // Dispatch a report to a department
  dispatch: (payload) => api.post('/assigning-officer/dispatch', payload).then(unwrap),

  // Forwarded complaints tracker
  forwarded: () => api.get('/assigning-officer/forwarded').then(unwrap),

  // History (completed + rejected)
  history: () => api.get('/assigning-officer/history').then(unwrap),

  // Departments
  departments: () => api.get('/assigning-officer/departments').then(unwrap),
  activeDepartments: () => api.get('/assigning-officer/departments/active').then(unwrap),
  createDepartment: (payload) => api.post('/assigning-officer/departments', payload).then(unwrap),
  updateDepartment: (id, payload) => api.put(`/assigning-officer/departments/${id}`, payload).then(unwrap),
  deactivateDepartment: (id) => api.delete(`/assigning-officer/departments/${id}`).then(unwrap),

  // Responder types (for dropdown)
  responderTypes: () => api.get('/assigning-officer/departments/responder-types').then(unwrap),
};

export default assigningOfficerApi;
