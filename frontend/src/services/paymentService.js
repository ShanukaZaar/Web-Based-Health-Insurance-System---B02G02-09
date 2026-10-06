import api from './api';

/**
 * Premium Payment Management API Service
 * Interacts with backend /api/payments endpoints.
 * Belongs to Module: Premium Payment Management (Lakshani J.D.C.)
 */
export const paymentService = {
  // Fetch all payment transactions
  getAllPayments: () => api.get('/payments'),

  // Fetch payment by ID
  getPaymentById: (id) => api.get(`/payments/${id}`),

  // Fetch payment by unique transaction ID (e.g., TXN-XXXXXX)
  getPaymentByTransactionId: (transactionId) => api.get(`/payments/transaction/${transactionId}`),

  // Fetch payment records by policyholder user ID
  getPaymentsByUserId: (userId) => api.get(`/payments/user/${userId}`),

  // Fetch payment records by insurance policy ID
  getPaymentsByPolicyId: (policyId) => api.get(`/payments/policy/${policyId}`),

  // Process a new premium payment
  processPayment: (paymentData) => api.post('/payments', paymentData),

  // Process a refund on a completed payment with mandatory reason
  processRefund: (id, refundReason) => api.post(`/payments/${id}/refund`, { refundReason }),

  // Cancel an in-flight or pending payment
  cancelPayment: (id, reason) => api.post(`/payments/${id}/cancel`, { reason }),

  // Retrieve official payment receipt breakdown
  getReceipt: (id) => api.get(`/payments/${id}/receipt`),
};

export default paymentService;
