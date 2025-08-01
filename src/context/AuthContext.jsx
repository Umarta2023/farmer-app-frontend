// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'; // Добавляем useCallback
import { getOrCreateUser } from '../api';
import WebApp from '@twa-dev/sdk';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- НАЧИНАЕМ ИЗМЕНЕНИЯ ---

  // Оборачиваем функцию обновления в useCallback, чтобы она не пересоздавалась при каждом рендере
  const updateCurrentUser = useCallback((updatedUserData) => {
    setCurrentUser(updatedUserData);
  }, []);

  // --- КОНЕЦ ИЗМЕНЕНИЙ ---

  useEffect(() => {
    // ... (этот useEffect остается без изменений, он загружает пользователя при старте)
    const initTelegramData = async () => { /* ... */ };
    WebApp.ready();
    initTelegramData();
  }, []);

  // Добавляем нашу новую функцию в `value`, чтобы "раздать" ее дочерним компонентам
  const value = { currentUser, loading, updateCurrentUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};