// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOrCreateUser } from '../api';
import { useTelegram } from '../hooks/useTelegram'; // Предполагается, что у вас есть такой хук

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tg } = useTelegram(); // Используем хук для доступа к объекту Telegram

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const tgUser = tg.initDataUnsafe?.user;
        let userDataForBackend;

        if (tgUser) {
          console.log("AuthProvider: Пользователь Telegram найден:", tgUser);
          userDataForBackend = {
            id: tgUser.id,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name || '',
            username: tgUser.username,
          };
        } else {
          console.log("AuthProvider: Пользователь Telegram НЕ найден. Используется тестовый.");
          userDataForBackend = { id: 111222333, first_name: 'Тестовый', username: 'test_user' };
        }

        const response = await getOrCreateUser(userDataForBackend);
        setUser(response.data);
        console.log("AuthProvider: Пользователь успешно авторизован:", response.data);

      } catch (err) {
        console.error("AuthProvider: Ошибка инициализации:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [tg]);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};