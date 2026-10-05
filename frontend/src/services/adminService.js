import api from './api';

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  updateUserStatus: (id, active) => api.put(`/admin/users/${id}/status`, null, { params: { active } }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllSystemReports: () => api.get('/admin/reports'),
  generateReport: (reportData) => api.post('/admin/reports', reportData),
  getReportById: (id) => api.get(`/admin/reports/${id}`),
  deleteReport: (id) => api.delete(`/admin/reports/${id}`),
  exportReportCsv: (id) => api.get(`/admin/reports/${id}/export`, { responseType: 'blob' }),
  getClaimsReport: () => api.get('/admin/reports/claims'),
  getPaymentsReport: () => api.get('/admin/reports/payments'),
  getPoliciesReport: () => api.get('/admin/reports/policies'),
  getHospitalsReport: () => api.get('/admin/reports/hospitals'),
  getSupportReport: () => api.get('/admin/reports/support'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

export default adminService;
