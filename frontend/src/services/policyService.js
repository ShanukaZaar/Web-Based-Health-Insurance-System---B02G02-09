import api from './api';

export const policyService = {
  getAllPolicies: () => api.get('/policies'),
  getPolicyById: (id) => api.get(`/policies/${id}`),
  createPolicy: (policyData) => api.post('/policies', policyData),
};

export default policyService;
