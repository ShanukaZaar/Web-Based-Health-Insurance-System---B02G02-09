import api from './api';

export const supportService = {
  getAllTickets: () => api.get('/support'),
  getTicketById: (id) => api.get(`/support/${id}`),
  getTicketByNumber: (ticketNumber) => api.get(`/support/number/${ticketNumber}`),
  getTicketsByUser: (userId) => api.get(`/support/user/${userId}`),
  getTicketsByStatus: (status) => api.get(`/support/status/${status}`),
  createTicket: (ticketData) => api.post('/support', ticketData),
  updateTicket: (id, ticketData) => api.put(`/support/${id}`, ticketData),
  deleteTicket: (id) => api.delete(`/support/${id}`),
};

export default supportService;

