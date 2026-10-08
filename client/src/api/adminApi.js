import api from './axios';
export const adminApi = {
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  createMenuItem: (data) => api.post('/menu', data),
  updateMenuItem: (id, data) => api.put(`/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
  toggleAvailability: (id, available) =>
    api.patch(`/menu/${id}/availability`, { is_available: available }),

  listUsers: (params) => api.get('/users', { params }),
  createStaff: (data) => api.post('/users/staff', data),
  updateUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),

  listTables: () => api.get('/tables'),
  createTable: (data) => api.post('/tables', data),
  deleteTable: (id) => api.delete(`/tables/${id}`),
};