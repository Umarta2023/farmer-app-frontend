// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getOrCreateUser } from '../api';
import WebApp from '@twa-dev/sdk';

// 1. Создаем контекст
const AuthContext = createContext(null);

// 2. Создаем компонент-провайдер, который будет "владеть" данными
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция для обновления данных пользователя из любого места в приложении
  const updateCurrentUser = useCallback((updatedUserData) => {
    setCurrentUser(updatedUserData);
  }, []);

  // Этот эффект выполняется один раз при запуске приложения для загрузки данных пользователя
  useEffect(() => {
    const initTelegramData = async () => {
      // Пытаемся получить данные от Telegram
      const tgUser = WebApp.initDataUnsafe?.user;

      if (tgUser) {
        // Если мы в Telegram
        const userDataForApi = {
          id: tgUser.id,
          username: tgUser.username,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name || null,
        };

        try {
          const response = await getOrCreateUser(userDataForApi);
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Не удалось получить/создать пользователя на бэкенде:", error);
          setCurrentUser(null);
        }
      } else {
        // Если мы в обычном браузере (для отладки)
        console.warn("Не удалось получить данные от Telegram. Используется тестовый пользователь.");
        
        const testUserData = {
          id: 111222333,
          first_name: "Тестовый",
          username: "test_user",
          last_name: "Пользователь"
        };

        try {
          const response = await getOrCreateUser(testUserData);
          setCurrentUser(response.data);
        } catch (e) { 
          console.error("Не удалось загрузить тестового пользователя", e);
        }
      }
      setLoading(false);
    };

    // Сообщаем Telegram, что приложение готово и запускаем инициализацию
    WebApp.ready();
    initTelegramData();
  }, []); // Пустой массив зависимостей означает "выполнить один раз при монтировании"

  // 3. Формируем объект `value`, который будет доступен всем дочерним компонентам
  const value = { currentUser, loading, updateCurrentUser };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* <-- Здесь мы всегда рендерим дочерние компоненты (наше приложение) */}
    </AuthContext.Provider>
  );
};

// 4. Создаем удобный хук для использования контекста в других компонентах
export const useAuth = () => {
  return useContext(AuthContext);
};