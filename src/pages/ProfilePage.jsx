// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { updateUserRegion } from '../api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function ProfilePage() {
  // 1. Получаем новую функцию `updateCurrentUser` из контекста
  const { currentUser, loading: authLoading, updateCurrentUser } = useAuth();
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleRegionUpdate = () => {
    if (!currentUser) return;

    const newRegion = prompt("Введите ваш новый регион:", currentUser.region || "");
    
    if (newRegion && newRegion.trim() !== "") {
      setUpdateLoading(true);
      updateUserRegion(currentUser.id, newRegion)
        .then(response => {
          // 2. После успешного ответа от сервера, вызываем `updateCurrentUser`
          //    с новыми данными, которые вернул бэкенд.
          updateCurrentUser(response.data); 
          // alert("Регион успешно обновлен!"); // <-- alert больше не нужен
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

  if (authLoading) {
    return <p className="page-content">Загрузка профиля...</p>;
  }
  if (!currentUser) {
    return <p className="page-content">Не удалось загрузить профиль.</p>;
  }

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