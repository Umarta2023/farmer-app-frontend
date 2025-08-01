// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { updateUserRegion, fetchUserAnnouncements } from '../api';
import { useAuth } from '../context/AuthContext';
import AnnouncementCard from '../components/AnnouncementCard';
import '../App.css';

function ProfilePage() {
  const { currentUser, loading: authLoading, updateCurrentUser } = useAuth();
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const [myAnnouncements, setMyAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  // Эффект для загрузки объявлений, когда пользователь загружен
  useEffect(() => {
    // Не запускаем, если нет данных о пользователе
    if (!currentUser) return;

    setAnnouncementsLoading(true);
    fetchUserAnnouncements(currentUser.id)
      .then(response => {
        setMyAnnouncements(response.data);
      })
      .catch(error => {
        console.error("Ошибка при загрузке объявлений пользователя:", error);
      })
      .finally(() => {
        setAnnouncementsLoading(false);
      });
  }, [currentUser]); // Зависит от currentUser

  // Функция для обновления региона
  const handleRegionUpdate = () => {
    if (!currentUser) return;

    const newRegion = prompt("Введите ваш новый регион:", currentUser.region || "");
    
    if (newRegion && newRegion.trim() !== "") {
      setUpdateLoading(true);
      updateUserRegion(currentUser.id, newRegion)
        .then(response => {
          updateCurrentUser(response.data);
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

  // Пока грузится основная информация о пользователе - показываем общую загрузку
  if (authLoading) {
    return <p className="page-content">Загрузка профиля...</p>;
  }

  // Если пользователя нет - показываем ошибку
  if (!currentUser) {
    return <p className="page-content">Не удалось загрузить профиль.</p>;
  }

  // Если основная информация загружена, рендерим всю страницу
  return (
    <div>
      <header className="app-header">
        <h1>Профиль</h1>
      </header>
      <div className="page-content">
        {/* --- ВОЗВРАЩАЕМ КАРТОЧКУ ПРОФИЛЯ --- */}
        <div className="profile-card">
          <h2>{currentUser.first_name} {currentUser.last_name}</h2>
          <p>@{currentUser.username}</p>
          <p><strong>Регион:</strong> {currentUser.region || "Не указан"}</p>
          <button onClick={handleRegionUpdate} className="action-button" disabled={updateLoading}>
            {updateLoading ? 'Сохранение...' : 'Сменить регион'}
          </button>
        </div>
        {/* --- КОНЕЦ БЛОКА ПРОФИЛЯ --- */}

        <div className="my-announcements-section">
          <h2>Мои объявления</h2>
          {announcementsLoading ? (
            <p>Загрузка объявлений...</p>
          ) : (
            myAnnouncements.length > 0 ? (
              myAnnouncements.map(ann => (
                <AnnouncementCard key={ann.id} announcement={ann} />
              ))
            ) : (
              <p>У вас пока нет объявлений.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;