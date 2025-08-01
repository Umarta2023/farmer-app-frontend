// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
// Добавляем fetchUserAnnouncements
import { updateUserRegion, fetchUserAnnouncements } from '../api';
import { useAuth } from '../context/AuthContext';
// Импортируем нашу карточку, чтобы переиспользовать ее
import AnnouncementCard from '../components/AnnouncementCard';
import '../App.css';

function ProfilePage() {
  const { currentUser, loading: authLoading, updateCurrentUser } = useAuth();
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // --- НОВЫЕ СОСТОЯНИЯ ДЛЯ ОБЪЯВЛЕНИЙ ---
  const [myAnnouncements, setMyAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  // Эффект для загрузки объявлений, когда пользователь загружен
  useEffect(() => {
    if (currentUser) {
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
    }
  }, [currentUser]); // Зависит от currentUser

  const handleRegionUpdate = () => {
    // ... (эта функция остается без изменений)
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
        {/* Карточка профиля остается без изменений */}
        <div className="profile-card">
          {/* ... */}
        </div>

        {/* --- НОВЫЙ БЛОК: МОИ ОБЪЯВЛЕНИЯ --- */}
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