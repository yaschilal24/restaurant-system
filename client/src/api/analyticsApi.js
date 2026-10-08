import api from './axios';
export const analyticsApi = {
  getDashboard: (period = 'today') =>
    api.get('/analytics/dashboard', { params: { period } }),
  exportCSV: (period) =>
    api.get('/analytics/export', { params: { period }, responseType: 'blob' }),
};