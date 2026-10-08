import api from './axios';
export const tableApi = {
  list: () => api.get('/tables'),
  getByToken: (token) => api.get(`/tables/token/${token}`),
  create: (data) => api.post('/tables', data),
  remove: (id) => api.delete(`/tables/${id}`),
};