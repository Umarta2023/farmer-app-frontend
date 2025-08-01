// src/api.js
import axios from 'axios';

const API_URL = "https://farmer-app-backend-z72z.onrender.com/api";

// Оставляем лог, чтобы видеть, что используется правильный URL
console.log("Using API URL:", API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
});



// Функция для получения объявлений
export const fetchAnnouncements = (region) => {
  let url = '/announcements/';
  // Если регион указан, добавляем его как параметр
  if (region) {
    url += `?region=${encodeURIComponent(region)}`;
  }
  return apiClient.get(url);
};

export const fetchMarketPrices = (region) => {
  // Наш бэкенд ждет регион в URL
  return apiClient.get(`/prices/${encodeURIComponent(region)}`);
};

export const createAnnouncement = (announcementData, userId) => {
  // Добавляем ID пользователя в URL как query parameter
  const url = `/announcements/?current_user_id=${userId}`;
  // В тело запроса кладем данные самого объявления
  return apiClient.post(url, announcementData);
};

export const getOrCreateUser = (userData) => {
  // Эта функция будет отправлять POST-запрос на наш эндпоинт
  // Бэкенд сам решит, создать нового пользователя или вернуть существующего
  return apiClient.post('/users/get_or_create', userData);
};

export const updateUserRegion = (userId, region) => {
  // Отправляем данные в формате, который ожидает наша Pydantic-схема UserUpdate
  const data = { region: region }; 
  return apiClient.put(`/users/${userId}/region`, data);
};

export const fetchAnnouncementById = (id) => {
  return apiClient.get(`/announcements/${id}`);
};


// В будущем здесь будут и другие функции: createUser, createAnnouncement и т.д.