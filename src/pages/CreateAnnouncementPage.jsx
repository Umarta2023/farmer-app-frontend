// src/pages/CreateAnnouncementPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnnouncement } from '../api';
import { useAuth } from '../context/AuthContext'; // 1. Импортируем useAuth
import '../App.css';
import './CreateAnnouncementPage.css';

function CreateAnnouncementPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Получаем пользователя и статус его загрузки из контекста
  const { currentUser, loading: authLoading } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();

    // 3. Улучшенная проверка
    if (!currentUser) {
      alert("Ошибка: пользователь не авторизован! Пожалуйста, перезапустите приложение.");
      return;
    }
    if (!title.trim()) {
      alert('Пожалуйста, введите заголовок объявления.');
      return;
    }

    setLoading(true);

    const announcementData = {
      title: title,
      description: description,
      price: price ? parseFloat(price) : null,
    };
    
    // 4. Используем ID из currentUser
    createAnnouncement(announcementData, currentUser.id)
      .then(response => {
        alert('Объявление успешно создано!');
        navigate('/market');
      })
      .catch(error => {
        console.error('Ошибка при создании объявления:', error.response?.data || error.message);
        alert('Произошла ошибка! Подробности в консоли.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 5. Показываем заглушку, пока пользователь из контекста грузится
  if (authLoading) {
    return <p className="page-content">Загрузка...</p>;
  }

  return (
    <div>
      <header className="app-header">
        <h1>Новое объявление</h1>
      </header>
      <div className="page-content">
        <form onSubmit={handleSubmit} className="announcement-form">
          <div className="form-group">
            <label htmlFor="title">Заголовок</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {/* ... остальные поля формы ... */}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAnnouncementPage;