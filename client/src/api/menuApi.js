import api from './axios';
export const menuApi = {
  getCategories: () => api.get('/menu/categories'),
  getItems: (params) => api.get('/menu', { params }),
  getItem: (id) => api.get(`/menu/${id}`),
};