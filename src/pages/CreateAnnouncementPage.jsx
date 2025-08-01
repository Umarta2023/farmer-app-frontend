// src/pages/CreateAnnouncementPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnnouncementWithImage } from '../api'; // Убедитесь, что эта функция есть в api.js
import { useAuth } from '../context/AuthContext';
import '../App.css';
import './CreateAnnouncementPage.css';

function CreateAnnouncementPage() {
  // Единое состояние для текстовых полей формы
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  // Отдельное состояние для выбранного файла
  const [imageFile, setImageFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Единый обработчик для изменения текстовых полей
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Обработчик для выбора файла
  const handleFileChange = (e) => {
    // Берем первый файл из списка (даже если можно выбрать несколько)
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Сбрасываем старые ошибки

    // Валидация на фронтенде
    if (!formData.title.trim()) {
      setError('Заголовок не может быть пустым.');
      return;
    }
    if (formData.price && parseFloat(formData.price) < 0) {
      setError('Цена не может быть отрицательной.');
      return;
    }

    if (!currentUser) {
      setError("Ошибка авторизации. Пожалуйста, перезапустите приложение.");
      return;
    }

    setLoading(true);

    // Создаем объект FormData для отправки данных и файла
    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('description', formData.description);
    // Отправляем цену, только если она введена
    if (formData.price) {
      dataToSend.append('price', formData.price);
    }
    // Отправляем файл, только если он выбран
    if (imageFile) {
      dataToSend.append('image', imageFile);
    }
    // ID пользователя теперь тоже часть FormData
    dataToSend.append('current_user_id', currentUser.id);

    // Вызываем API-функцию, которая умеет работать с FormData
    createAnnouncementWithImage(dataToSend)
      .then(response => {
        alert('Объявление успешно создано!');
        navigate('/market'); // Перенаправляем на рынок
      })
      .catch(err => {
        console.error('Ошибка при создании объявления:', err);
        const errorMessage = err.response?.data?.detail || 'Не удалось создать объявление. Попробуйте позже.';
        setError(errorMessage);
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
              required // Дополнительная браузерная валидация
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
              min="0" // Запрещаем ввод отрицательных чисел в браузере
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Фотография</label>
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg" // Принимаем только картинки
              onChange={handleFileChange}
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