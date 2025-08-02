// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getOrCreateUser, healthCheck } from '../api';
import WebApp from '@twa-dev/sdk';

const AuthContext = createContext(null);

// Функция-помощник для создания паузы
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
        console.log("AuthProvider: Отправляем health check, чтобы 'разбудить' сервер...");
        await healthCheck();
        console.log("AuthProvider: Сервер 'проснулся', health check OK.");
        
        // --- ВОТ ГЛАВНОЕ ИЗМЕНЕНИЕ ---
        // Добавляем небольшую паузу (500 миллисекунд) перед основным запросом
        console.log("AuthProvider: Ждем 500мс для полной инициализации сервера...");
        await sleep(500);

        const tgUser = WebApp.initDataUnsafe?.user;
        let userDataToProcess;

        if (tgUser) {
          console.log("AuthProvider: Пользователь Telegram найден, ID:", tgUser.id);
          userDataToProcess = {
            id: tgUser.id,
            username: tgUser.username,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name || null,
          };
        } else {
          console.warn("AuthProvider: Пользователь Telegram НЕ найден. Используется тестовый пользователь.");
          userDataToProcess = { id: 111222333, first_name: "Тестовый", username: "test_user", last_name: "Пользователь" };
        }
        
        console.log("AuthProvider: Отправляем на бэкенд данные для get/create:", userDataToProcess);
        const response = await getOrCreateUser(userDataToProcess);
        setCurrentUser(response.data);
        console.log("AuthProvider: Успешный ответ от бэкенда:", response.data);

      } catch (error) {
        console.error("AuthProvider: Произошла критическая ошибка при инициализации:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
        console.log("AuthProvider: Загрузка завершена.");
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