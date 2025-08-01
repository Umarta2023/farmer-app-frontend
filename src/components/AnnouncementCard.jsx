// src/components/AnnouncementCard.jsx

import React from 'react';
// 1. Убедитесь, что Link импортирован из react-router-dom
import { Link } from 'react-router-dom';
import './AnnouncementCard.css';

const AnnouncementCard = ({ announcement }) => {
  const formattedPrice = announcement.price 
    ? `${announcement.price.toLocaleString('ru-RU')} ₽` 
    : 'Цена не указана';

  const formattedDate = new Date(announcement.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  });

  // 2. Вся карточка обернута в компонент <Link>
  //    `to` указывает, куда вести при клике
  return (
    <Link to={`/announcements/${announcement.id}`} className="card-link">
      <div className="card">
        <div className="card-content">
          <h3 className="card-title">{announcement.title}</h3>
          <p className="card-description">{announcement.description}</p>
          <div className="card-footer">
            <span className="card-price">{formattedPrice}</span>
            <span className="card-date">{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnnouncementCard;