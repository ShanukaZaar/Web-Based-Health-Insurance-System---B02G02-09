import api from './api';

const BASE = '/policies';

const policyService = {
  // READ — List all policies
  getAll: () => api.get(BASE).then((res) => res.data.data ?? res.data),

  // READ — Single policy by ID
  getById: (id) => api.get(`${BASE}/${id}`).then((res) => res.data.data ?? res.data),

  // READ — Filter by status
  getByStatus: (status) => api.get(`${BASE}/status/${status}`).then((res) => res.data.data ?? res.data),

  // CREATE
  create: (policy) => api.post(BASE, policy).then((res) => res.data.data ?? res.data),

  // UPDATE
  update: (id, policy) => api.put(`${BASE}/${id}`, policy).then((res) => res.data.data ?? res.data),

  // DELETE (soft-cancel)
  cancel: (id) => api.delete(`${BASE}/${id}`).then((res) => res.data.data ?? res.data),
};

export default policyService;
