// src/api.js

import axios from 'axios';

// Для продакшена на VPS, где фронт и бэк на одном домене,
// базовый URL может быть пустым. Запросы будут идти на тот же хост.
// Для локальной разработки можно временно подставить: "http://127.0.0.1:8000"
export const API_BASE_URL = "";

// Формируем URL для API-запросов (например, "/api")
const API_URL_WITH_API = `${API_BASE_URL}/api`;

console.log("Using BASE URL for files:", API_BASE_URL);
console.log("Using API URL for endpoints:", API_URL_WITH_API);

const apiClient = axios.create({
  baseURL: API_URL_WITH_API,
});

// --- Функции для работы с API ---

export const healthCheck = () => {
  return apiClient.get('/health');
};

export const getOrCreateUser = (userData) => {
  return apiClient.post('/users/get_or_create', userData);
};

export const updateUserRegion = (userId, region) => {
  const data = { region: region }; 
  return apiClient.put(`/users/${userId}/region`, data);
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
  // Для FormData мы не передаем current_user_id в URL, он уже внутри formData
  return apiClient.post('/announcements/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};