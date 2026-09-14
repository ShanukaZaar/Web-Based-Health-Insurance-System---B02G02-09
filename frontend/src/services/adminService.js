import api from './api';

export const adminService = {
  getAllSystemReports: () => api.get('/admin/reports'),
  generateReport: (reportData) => api.post('/admin/reports', reportData),
};

export default adminService;
