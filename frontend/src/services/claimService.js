import api from './api';


//API endpoin URLs
export const claimService = {
  getAllClaims: () => api.get('/claims'),
  getClaimById: (id) => api.get(`/claims/${id}`),
  submitClaim: (claimData) => api.post('/claims', claimData),
  approveClaim: (id, approvedAmount) => api.put(`/claims/${id}/approve`, { approvedAmount }),
  rejectClaim: (id, rejectionReason) => api.put(`/claims/${id}/reject`, { rejectionReason }),
  withdrawClaim: (id) => api.put(`/claims/${id}/withdraw`),
};

export default claimService;
