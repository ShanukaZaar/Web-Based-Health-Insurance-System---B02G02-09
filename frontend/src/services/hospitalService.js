import api from './api';

export const hospitalService = {
  getAllHospitals: () => api.get('/hospitals'),
  getHospitalById: (id) => api.get(`/hospitals/${id}`),
  registerHospital: (hospitalData) => api.post('/hospitals', hospitalData),
};

export default hospitalService;
