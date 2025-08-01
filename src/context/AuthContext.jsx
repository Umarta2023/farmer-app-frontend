// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getOrCreateUser } from '../api';
import WebApp from '@twa-dev/sdk';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateCurrentUser = useCallback((updatedUserData) => {
    setCurrentUser(updatedUserData);
  }, []);

  useEffect(() => {
    const initTelegramData = async () => {
      console.log("AuthProvider: useEffect запущен.");
      setLoading(true);

      const tgUser = WebApp.initDataUnsafe?.user;

      if (tgUser) {
        console.log("AuthProvider: Пользователь Telegram найден, ID:", tgUser.id);
        const userDataForApi = {
          id: tgUser.id,
          username: tgUser.username,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name || null,
        };
        
        console.log("AuthProvider: Отправляем на бэкенд следующие данные:", userDataForApi);
        try {
          const response = await getOrCreateUser(userDataForApi);
          setCurrentUser(response.data);
          console.log("AuthProvider: Успешный ответ от бэкенда:", response.data);
        } catch (error) {
          console.error("AuthProvider: ОШИБКА при запросе к /get_or_create:", error);
          setCurrentUser(null);
        } finally {
          setLoading(false);
          console.log("AuthProvider: Загрузка завершена.");
        }
      } else {
        console.warn("AuthProvider: Пользователь Telegram НЕ найден. Используется тестовый пользователь.");
        const testUserData = { id: 111222333, first_name: "Тестовый", username: "test_user", last_name: "Пользователь" };
        console.log("AuthProvider: Отправляем на бэкенд тестовые данные:", testUserData);
        try {
          const response = await getOrCreateUser(testUserData);
          setCurrentUser(response.data);
          console.log("AuthProvider: Успешный ответ от бэкенда (тестовый пользователь):", response.data);
        } catch (e) { 
          console.error("AuthProvider: ОШИБКА при загрузке тестового пользователя", e);
        } finally {
          setLoading(false);
          console.log("AuthProvider: Загрузка завершена.");
        }
      }
    };

    WebApp.ready();
    initTelegramData();
  }, []);

  const value = { currentUser, loading, updateCurrentUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};