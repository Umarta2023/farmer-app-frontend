// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getOrCreateUser, healthCheck } from '../api'; // Убедитесь, что healthCheck импортируется
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

      try {
        // --- ШАГ 1: "ПРОГРЕВ" СЕРВЕРА ---
        console.log("AuthProvider: Отправляем health check, чтобы 'разбудить' сервер...");
        await healthCheck();
        console.log("AuthProvider: Сервер 'проснулся', health check OK.");
        // --- КОНЕЦ "ПРОГРЕВА" ---

        // --- ШАГ 2: ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ---
        const tgUser = WebApp.initDataUnsafe?.user;

        if (tgUser) {
          // Если мы в Telegram
          console.log("AuthProvider: Пользователь Telegram найден, ID:", tgUser.id);
          const userDataForApi = {
            id: tgUser.id,
            username: tgUser.username,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name || null,
          };
          
          console.log("AuthProvider: Отправляем на бэкенд данные для get/create:", userDataForApi);
          const response = await getOrCreateUser(userDataForApi);
          setCurrentUser(response.data);
          console.log("AuthProvider: Успешный ответ от бэкенда:", response.data);

        } else {
          // Если мы в обычном браузере
          console.warn("AuthProvider: Пользователь Telegram НЕ найден. Используется тестовый пользователь.");
          const testUserData = { id: 111222333, first_name: "Тестовый", username: "test_user", last_name: "Пользователь" };
          
          console.log("AuthProvider: Отправляем на бэкенд тестовые данные:", testUserData);
          const response = await getOrCreateUser(testUserData);
          setCurrentUser(response.data);
          console.log("AuthProvider: Успешный ответ от бэкенда (тестовый пользователь):", response.data);
        }

      } catch (error) {
        // Ловим любые ошибки, которые могли произойти на шагах 1 или 2
        console.error("AuthProvider: Произошла критическая ошибка при инициализации:", error);
        setCurrentUser(null);
      } finally {
        // Этот блок выполнится в любом случае - и при успехе, и при ошибке
        setLoading(false);
        console.log("AuthProvider: Загрузка завершена.");
      }
    };

    WebApp.ready();
    initTelegramData();
  }, []); // Пустой массив зависимостей = выполнить один раз

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