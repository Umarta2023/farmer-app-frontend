// src/pages/ProfilePage.jsx

import React, { useState } from 'react';
// 1. Убираем импорт fetchUser, добавляем updateUserRegion
import { updateUserRegion } from '../api'; 
// 2. Импортируем хук для доступа к нашему контексту
import { useAuth } from '../context/AuthContext'; 
import '../App.css';

function ProfilePage() {
  // 3. Получаем пользователя и статус загрузки ПРЯМО ИЗ КОНТЕКСТА
  const { currentUser, loading: authLoading } = useAuth();
  
  // Локальное состояние только для процесса обновления
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // 4. Удаляем весь блок useEffect, он больше не нужен здесь!

  const handleRegionUpdate = () => {
    if (!currentUser) return; // Защита на случай, если пользователь не загружен

    const newRegion = prompt("Введите ваш новый регион:", currentUser.region || "");
    
    if (newRegion && newRegion.trim() !== "") {
      setUpdateLoading(true);
      updateUserRegion(currentUser.id, newRegion)
        .then(response => {
          alert("Регион успешно обновлен! (Обновите страницу, чтобы увидеть изменения)");
          // В более сложном приложении мы бы обновили и currentUser в контексте,
          // но для MVP это необязательно.
        })
        .catch(error => {
          console.error("Ошибка при обновлении региона:", error);
          alert("Произошла ошибка!");
        })
        .finally(() => {
          setUpdateLoading(false);
        });
    }
  };

  // Используем authLoading из контекста для отображения загрузки
  if (authLoading) {
    return <p className="page-content">Загрузка профиля...</p>;
  }

  // Если после загрузки пользователя нет - показываем ошибку
  if (!currentUser) {
    return <p className="page-content">Не удалось загрузить профиль.</p>;
  }

  // 5. Везде используем `currentUser` вместо `user`
  return (
    <div>
      <header className="app-header">
        <h1>Профиль</h1>
      </header>
      <div className="page-content">
        <div className="profile-card">
          <h2>{currentUser.first_name} {currentUser.last_name}</h2>
          <p>@{currentUser.username}</p>
          <p><strong>Регион:</strong> {currentUser.region || "Не указан"}</p>
          <button onClick={handleRegionUpdate} className="action-button" disabled={updateLoading}>
            {updateLoading ? 'Сохранение...' : 'Сменить регион'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;