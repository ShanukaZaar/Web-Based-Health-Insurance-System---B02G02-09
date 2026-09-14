import api from './api';

export const paymentService = {
  getAllPayments: () => api.get('/payments'),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  processPayment: (paymentData) => api.post('/payments', paymentData),
};

export default paymentService;
