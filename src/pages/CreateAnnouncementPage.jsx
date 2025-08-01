// src/pages/CreateAnnouncementPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnnouncement } from '../api';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import './CreateAnnouncementPage.css';

function CreateAnnouncementPage() {
  // Используем один объект для хранения всех данных формы
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Состояние для хранения текста ошибки
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Единый обработчик для всех полей
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Сбрасываем старые ошибки

    // Валидация на фронтенде
    if (!formData.title.trim()) {
      setError('Заголовок не может быть пустым.');
      return;
    }
    if (formData.price && parseFloat(formData.price) <= 0) {
      setError('Цена должна быть положительным числом.');
      return;
    }

    if (!currentUser) {
      setError("Ошибка авторизации. Попробуйте перезапустить приложение.");
      return;
    }

    setLoading(true);

    const announcementData = {
      title: formData.title,
      description: formData.description,
      price: formData.price ? parseFloat(formData.price) : null,
    };
    
    createAnnouncement(announcementData, currentUser.id)
      .then(response => {
        alert('Объявление успешно создано!');
        navigate('/market'); // Перенаправляем на рынок
      })
      .catch(err => {
        console.error('Ошибка при создании объявления:', err);
        setError('Не удалось создать объявление. Попробуйте позже.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <div>
      <header className="app-header">
        <h1>Новое объявление</h1>
      </header>
      <div className="page-content">
        <form onSubmit={handleSubmit} className="announcement-form">
          <div className="form-group">
            <label htmlFor="title">Заголовок *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              maxLength="500"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="price">Цена (₽)</label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Например: 15000"
              min="0"
            />
          </div>

          {/* Отображение ошибки, если она есть */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAnnouncementPage;