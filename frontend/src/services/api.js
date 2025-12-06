import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API
export const publicApi = {
  getContent: () => api.get('/public/content')
};

// Auth API
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentAdmin: () => api.get('/auth/me'),
  updatePassword: (currentPassword, newPassword) =>
    api.put('/auth/password', { currentPassword, newPassword })
};

// Content API
export const contentApi = {
  getAll: () => api.get('/content'),
  getSection: (section) => api.get(`/content/sections/${section}`),
  updateSection: (section, content) => api.put(`/content/sections/${section}`, { content }),

  // Services
  getServices: () => api.get('/content/services'),
  createService: (data) => api.post('/content/services', data),
  updateService: (id, data) => api.put(`/content/services/${id}`, data),
  deleteService: (id) => api.delete(`/content/services/${id}`),

  // Pricing
  getPricing: () => api.get('/content/pricing'),
  createPricing: (data) => api.post('/content/pricing', data),
  updatePricing: (id, data) => api.put(`/content/pricing/${id}`, data),
  deletePricing: (id) => api.delete(`/content/pricing/${id}`),

  // Testimonials
  getTestimonials: () => api.get('/content/testimonials'),
  createTestimonial: (data) => api.post('/content/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/content/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/content/testimonials/${id}`),

  // Features
  getFeatures: () => api.get('/content/features'),
  createFeature: (data) => api.post('/content/features', data),
  updateFeature: (id, data) => api.put(`/content/features/${id}`, data),
  deleteFeature: (id) => api.delete(`/content/features/${id}`),

  // Stats
  getStats: () => api.get('/content/stats'),
  createStat: (data) => api.post('/content/stats', data),
  updateStat: (id, data) => api.put(`/content/stats/${id}`, data),
  deleteStat: (id) => api.delete(`/content/stats/${id}`)
};

export default api;
