import api from './api';

export const supportService = {
  getAllTickets: () => api.get('/support'),
  getTicketById: (id) => api.get(`/support/${id}`),
  createTicket: (ticketData) => api.post('/support', ticketData),
};

export default supportService;
