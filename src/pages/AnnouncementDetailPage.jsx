// src/pages/AnnouncementDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams для получения ID из URL
import { fetchAnnouncementById } from '../api'; // Создадим эту функцию
import '../App.css';
import './AnnouncementDetailPage.css'; // Создадим стили

function AnnouncementDetailPage() {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Получаем `id` из URL (например, /announcements/5)

  useEffect(() => {
    fetchAnnouncementById(id)
      .then(response => {
        setAnnouncement(response.data);
      })
      .catch(error => {
        console.error("Ошибка при загрузке объявления:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]); // Эффект зависит от ID в URL

  if (loading) return <p className="page-content">Загрузка...</p>;
  if (!announcement) return <p className="page-content">Объявление не найдено.</p>;

  // Форматируем цену для красивого отображения
  const formattedPrice = announcement.price 
    ? `${announcement.price.toLocaleString('ru-RU')} ₽` 
    : 'Цена не указана';

  return (
    <div>
      <header className="app-header">
        {/* Ссылка "Назад" */}
        <Link to="/market" className="back-link">← Назад к списку</Link>
        <h1>{announcement.title}</h1>
      </header>
      <div className="page-content">
        <div className="detail-card">
          <p className="detail-price">{formattedPrice}</p>
          <div className="detail-section">
            <h3>Описание</h3>
            <p>{announcement.description || "Без описания."}</p>
          </div>
          <div className="detail-section">
            <h3>Продавец</h3>
            <p>{announcement.owner.first_name} (@{announcement.owner.username})</p>
            <p><strong>Регион:</strong> {announcement.owner.region}</p>
          </div>
          <button className="action-button">Написать продавцу</button>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetailPage;