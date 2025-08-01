// src/api.js
import axios from 'axios';

// 1. Объявляем переменную для базового URL (БЕЗ /api)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// 2. Объявляем переменную для URL эндпоинтов (С /api)
const API_URL_WITH_API = `${API_BASE_URL}/api`;

console.log("Using API URL for endpoints:", API_URL_WITH_API);

// 3. Создаем клиент, который будет работать с эндпоинтами
const apiClient = axios.create({
  baseURL: API_URL_WITH_API,
});

// Экспортируем только apiClient, так как он уже настроен.
// API_BASE_URL экспортируется напрямую через `export const` выше.
export { apiClient };


// --- ВСЕ ФУНКЦИИ НИЖЕ ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ ---

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

export const getOrCreateUser = (userData) => {
  return apiClient.post('/users/get__create', userData);
};

export const updateUserRegion = (userId, region) => {
  const data = { region: region }; 
  return apiClient.put(`/users/${userId}/region`, data);
};

export const fetchAnnouncementById = (id) => {
  return apiClient.get(`/announcements/${id}`);
};

export const createAnnouncementWithImage = (formData) => {
  return apiClient.post('/announcements/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};