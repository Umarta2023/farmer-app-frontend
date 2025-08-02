import axios from 'axios';
const rawApiUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
export const API_BASE_URL = rawApiUrl.replace(/\/api$/, '');

const API_URL_WITH_API = `${API_BASE_URL}/api`;

console.log("Using BASE URL for files:", API_BASE_URL);
console.log("Using API URL for endpoints:", API_URL_WITH_API);

const apiClient = axios.create({
  baseURL: API_URL_WITH_API,
});

export { apiClient };

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
  return apiClient.post('/users/get_or_create', userData);
};

export const updateUserRegion = (userId, region) => {
  const data = { region: region }; 
  return apiClient.put(`/users/${userId}/region`, data);
};

export const fetchAnnouncementById = (id) => {
  return apiClient.get(`/announcements/${id}`);
};

// ВОТ ОНА, НЕДОСТАЮЩАЯ ФУНКЦИЯ
export const fetchUserAnnouncements = (userId) => {
  return apiClient.get(`/users/${userId}/announcements`);
};

export const createAnnouncementWithImage = (formData) => {
  return apiClient.post('/announcements/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const healthCheck = () => {
  return apiClient.get('/health');
};