// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserAnnouncements } from '../api';
import '../App.css';
import './ProfilePage.css';

function ProfilePage() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [userAnnouncements, setUserAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    // Загружаем объявления только если пользователь успешно загружен
    if (user) {
      console.log(`ProfilePage: Запрашиваем объявления для пользователя ID: ${user.id}`);
      setLoadingAnnouncements(true);
      fetchUserAnnouncements(user.id)
        .then(response => {
          console.log(`ProfilePage: Объявления успешно загружены. (${response.data.length})`, response.data);
          setUserAnnouncements(response.data || []);
        })
        .catch(error => {
          console.error("ProfilePage: Ошибка при загрузке объявлений:", error);
          setUserAnnouncements([]);
        })
        .finally(() => {
          setLoadingAnnouncements(false);
          console.log("ProfilePage: Загрузка объявлений завершена.");
        });
    }
  }, [user]); // Эффект зависит от объекта user

  if (authLoading) {
    return <p className="page-content">Загрузка профиля...</p>;
  }
  
  if (authError || !user) {
    return <p className="page-content">Не удалось загрузить профиль. Попробуйте перезапустить приложение.</p>;
  }

  return (
    <div>
      <header className="app-header">
        <h1>Профиль</h1>
      </header>
      <div className="page-content">
        <div className="profile-card">
          <h2>{user.first_name} {user.last_name}</h2>
          <p className="username">@{user.username}</p>
          <p><strong>Регион:</strong> {user.region || 'Не указан'}</p>
          <button className="action-button-secondary">Редактировать</button>
        </div>

        <div className="announcements-section">
          <h3>Мои объявления</h3>
          {loadingAnnouncements ? (
            <p>Загрузка объявлений...</p>
          ) : (
            <ul className="announcements-list">
              {/* Вот защита */}
              {Array.isArray(userAnnouncements) && userAnnouncements.map(ann => (
                <li key={ann.id}>
                  <Link to={`/announcements/${ann.id}`}>{ann.title}</Link>
                  <span>{ann.price ? `${ann.price.toLocaleString('ru-RU')} ₽` : ''}</span>
                </li>
              ))}
              {Array.isArray(userAnnouncements) && userAnnouncements.length === 0 && (
                <p>У вас пока нет объявлений.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;