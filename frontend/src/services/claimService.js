import api from './api';

export const claimService = {
  getAllClaims: () => api.get('/claims'),
  getClaimById: (id) => api.get(`/claims/${id}`),
  submitClaim: (claimData) => api.post('/claims', claimData),
};

export default claimService;
