// src/pages/AnnouncementDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// 1. УБИРАЕМ API_BASE_URL ИЗ ИМПОРТА
import { fetchAnnouncementById } from '../api'; 
import '../App.css';
import './AnnouncementDetailPage.css';

function AnnouncementDetailPage() {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    // Эта часть остается без изменений, она идеальна
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
  }, [id]);

  if (loading) return <p className="page-content">Загрузка...</p>;
  if (!announcement) return <p className="page-content">Объявление не найдено.</p>;

  // Эта часть тоже хороша
  const formattedPrice = announcement.price 
    ? `${announcement.price.toLocaleString('ru-RU')} ₽` 
    : 'Цена не указана';

  // 2. УДАЛЯЕМ ЛОГИКУ С API_BASE_URL
  // Переменная fullImageUrl больше не нужна.
  // Мы будем использовать announcement.image_url напрямую.
  // const fullImageUrl = announcement.image_url 
  //   ? `${API_BASE_URL}${announcement.image_url}` 
  //   : null;

  return (
    <div>
      <header className="app-header">
        <Link to="/market" className="back-link">← Назад к списку</Link>
        <h1>{announcement.title}</h1>
      </header>
      <div className="page-content">
        <div className="detail-card">
          {/* 3. ИСПОЛЬЗУЕМ announcement.image_url НАПРЯМУЮ */}
          {announcement.image_url && (
            <img src={announcement.image_url} alt={announcement.title} className="detail-image" />
          )}
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