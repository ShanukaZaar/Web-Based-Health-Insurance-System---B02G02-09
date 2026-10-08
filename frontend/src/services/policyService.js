import api from './api';

export const policyService = {
  getAllPolicies: () => api.get('/policies'),
  getPolicyById: (id) => api.get(`/policies/${id}`),
  createPolicy: (policyData) => api.post('/policies', policyData),
  updatePolicy: (id, policyData) => api.put(`/policies/${id}`, policyData),
  deletePolicy: (id) => api.delete(`/policies/${id}`),
};

export default policyService;
