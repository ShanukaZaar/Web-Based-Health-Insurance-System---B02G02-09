import api from "./api";

const BASE = "/claims";

const claimService = {
  getAll: () => api.get(BASE).then((res) => res.data.data ?? res.data),
  getById: (id) => api.get(`${BASE}/${id}`).then((res) => res.data.data ?? res.data),
  create: (claim) => api.post(BASE, claim).then((res) => res.data.data ?? res.data),
  update: (id, claim) => api.put(`${BASE}/${id}`, claim).then((res) => res.data.data ?? res.data),
  withdraw: (id) => api.patch(`${BASE}/${id}/withdraw`).then((res) => res.data.data ?? res.data),
  approve: (id) => api.patch(`${BASE}/${id}/approve`).then((res) => res.data.data ?? res.data),
  reject: (id) => api.patch(`${BASE}/${id}/reject`).then((res) => res.data.data ?? res.data),
};

export default claimService;