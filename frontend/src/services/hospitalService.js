import api from './api';

export const hospitalService = {
  getAllHospitals: () => api.get('/hospitals'),
  getHospitalById: (id) => api.get(`/hospitals/${id}`),
  registerHospital: (hospitalData) => api.post('/hospitals', hospitalData),
  updateHospital: (id, hospitalData) => api.put(`/hospitals/${id}`, hospitalData),
  suspendHospital: (id) => api.put(`/hospitals/${id}/suspend`),
  reactivateHospital: (id) => api.put(`/hospitals/${id}/reactivate`),
  deactivateHospital: (id) => api.put(`/hospitals/${id}/deactivate`),
  deleteHospital: (id) => api.delete(`/hospitals/${id}`),
};

export default hospitalService;
