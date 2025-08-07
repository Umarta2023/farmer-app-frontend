// src/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

export const healthCheck = () => apiClient.get('/health');
export const getOrCreateUser = (userData) => apiClient.post('/users/get_or_create', userData);
export const updateUserRegion = (userId, region) => apiClient.put(`/users/${userId}/region`, { region });
export const fetchUserAnnouncements = (userId) => apiClient.get(`/users/${userId}/announcements`);
export const fetchAnnouncements = (region) => {
  const params = region ? { region } : {};
  return apiClient.get('/announcements/', { params });
};
export const fetchMarketPrices = (region) => apiClient.get(`/prices/${region}`);
export const fetchAnnouncementById = (id) => apiClient.get(`/announcements/${id}`);
export const createAnnouncementWithImage = (formData) => {
  return apiClient.post('/announcements/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};