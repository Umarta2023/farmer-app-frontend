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

  useEffect(() => {
    if (!currentUser) {
      console.log("ProfilePage: currentUser еще не загружен, пропускаем загрузку объявлений.");
      return;
    }

    setAnnouncementsLoading(true);
    console.log(`ProfilePage: Запрашиваем объявления для пользователя ID: ${currentUser.id}`);

    fetchUserAnnouncements(currentUser.id)
      .then(response => {
        setMyAnnouncements(response.data);
        console.log("ProfilePage: Объявления успешно загружены.", response.data);
      })
      .catch(error => {
        console.error("ProfilePage: ОШИБКА при загрузке объявлений:", error);
      })
      .finally(() => {
        setAnnouncementsLoading(false);
        console.log("ProfilePage: Загрузка объявлений завершена.");
      });
  }, [currentUser]);

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

  if (authLoading) {
    return <p className="page-content">Загрузка профиля...</p>;
  }

  if (!currentUser) {
    return <p className="page-content">Не удалось загрузить профиль. Попробуйте перезапустить приложение.</p>;
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