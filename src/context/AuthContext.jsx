// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getOrCreateUser } from '../api';
import WebApp from '@twa-dev/sdk';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initTelegramData = async () => {
      // --- ОТЛАДКА ---
      console.log("AuthProvider: useEffect запущен.");
      console.log("AuthProvider: Проверяем WebApp.initDataUnsafe...");
      
      const tgUser = WebApp.initDataUnsafe?.user;
      console.log("AuthProvider: Результат WebApp.initDataUnsafe.user:", tgUser);

      if (tgUser && tgUser.id) {
        console.log("AuthProvider: Пользователь Telegram найден, ID:", tgUser.id);
        
        const userDataForApi = {
          id: tgUser.id,
          username: tgUser.username || `user${tgUser.id}`, // Добавим запасной username
          first_name: tgUser.first_name || "Пользователь", // И запасное имя
          last_name: tgUser.last_name || null,
        };

        console.log("AuthProvider: Отправляем на бэкенд следующие данные:", userDataForApi);
        
        try {
          const response = await getOrCreateUser(userDataForApi);
          console.log("AuthProvider: Успешный ответ от бэкенда:", response.data);
          setCurrentUser(response.data);
        } catch (error) {
          console.error("AuthProvider: ОШИБКА при запросе к /get_or_create:", error.response?.data || error.message);
          setCurrentUser(null);
        }
      } else {
        console.warn("AuthProvider: Пользователь Telegram НЕ найден. Используется тестовый пользователь.");
        
        const testUserData = {
          id: 111222333,
          first_name: "Тестовый",
          username: "test_user",
          last_name: "Пользователь"
        };
        
        console.log("AuthProvider: Отправляем на бэкенд тестовые данные:", testUserData);
        try {
          const response = await getOrCreateUser(testUserData);
          console.log("AuthProvider: Успешный ответ от бэкенда (тестовый):", response.data);
          setCurrentUser(response.data);
        } catch (e) { 
          console.error("AuthProvider: ОШИБКА при загрузке тестового пользователя", e.response?.data || e.message);
          setCurrentUser(null);
        }
      }
      
      console.log("AuthProvider: Загрузка завершена.");
      setLoading(false);
    };

    WebApp.ready();
    initTelegramData();
  }, []);

  const value = { currentUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};