// src/api.js
import axios from 'axios';

// Создаем единственный экземпляр axios с правильной конфигурацией.
// Этот apiClient будет использоваться во всем приложении.
const apiClient = axios.create({
  // Все запросы будут автоматически начинаться с /api
  // Это будет работать и локально (через прокси Vite)
  // и на сервере (через прокси Nginx)
  baseURL: '/api',
});

// --- Экспортируем функции, которые используют этот клиент ---

export const healthCheck = () => {
  return apiClient.get('/health');
};

export const getOrCreateUser = (userData) => {
  return apiClient.post('/users/get_or_create', userData);
};

export const updateUserRegion = (userId, region) => {
  return apiClient.put(`/users/${userId}/region`, { region });
};

export const fetchUserAnnouncements = (userId) => {
  return apiClient.get(`/users/${userId}/announcements`);
};

export const fetchAnnouncements = (region) => {
  let url = '/announcements/';
  if (region) {
    url += `?region=${encodeURIComponent(region)}`;
  }
  return apiClient.get(url);
};

export const fetchMarketPrices = (region) => {
  return apiClient.get(`/prices/${encodeURIComponent(region)}`);
};

export const fetchAnnouncementById = (id) => {
  return apiClient.get(`/announcements/${id}`);
};

export const createAnnouncementWithImage = (formData) => {
  return apiClient.post('/announcements/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};