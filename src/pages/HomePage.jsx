// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAnnouncements, fetchMarketPrices } from '../api';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    if (user) {
      setRegion(user.region || "Краснодарский край"); // Устанавливаем регион из профиля или по умолчанию
    }
  }, [user]);

  useEffect(() => {
    if (!region) return; // Не делаем запросы, пока регион не определен

    setPageLoading(true);
    Promise.all([
      fetchAnnouncements(region),
      fetchMarketPrices(region),
    ])
    .then(([announcementsRes, pricesRes]) => {
      setAnnouncements(announcementsRes.data || []);
      setMarketPrices(pricesRes.data || []);
    })
    .catch(error => {
      console.error("HomePage: Ошибка при загрузке данных:", error);
      setAnnouncements([]); // В случае ошибки, устанавливаем пустые массивы
      setMarketPrices([]);
    })
    .finally(() => {
      setPageLoading(false);
    });
  }, [region]);

  const handleRegionChange = () => {
    const newRegion = region === "Краснодарский край" ? "Алтайский край" : "Краснодарский край";
    setRegion(newRegion);
  };

  if (authLoading) {
    return <div className="page-content">Загрузка профиля...</div>;
  }
  
  return (
    <div>
      <header className="app-header">
        <h1>Добрый день, {user ? user.first_name : 'Гость'}!</h1>
        <p onClick={handleRegionChange} style={{ cursor: 'pointer' }}>
          📍 {region} (нажми, чтобы сменить)
        </p>
      </header>

      <div className="search-bar">
        <input type="text" placeholder="🔍 Найди ремкомплект..." />
      </div>

      <div className="widgets-container">
        <div className="widget">
          <h3>Цены на рынке</h3>
          {pageLoading ? <p>Загрузка...</p> : (
            <ul className="prices-list">
              {Array.isArray(marketPrices) && marketPrices.map(price => (
                <li key={price.crop_name}>
                  <span>{price.crop_name}</span>
                  <span className={`price-trend trend-${price.trend}`}>
                    {price.price} ₽/т
                    {price.trend === 'up' && ' ▲'}
                    {price.trend === 'down' && ' ▼'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="widget quick-actions">
          <Link to="/announcements/new" className="action-button-link">
            <button className="action-button">Продать товар</button>
          </Link>
          <button className="action-button">Задать вопрос</button>
        </div>
        
        <div className="widget">
          <h3>Последние объявления в регионе</h3>
          {pageLoading ? <p>Загрузка...</p> : (
            <ul>
              {Array.isArray(announcements) && announcements.map(ann => (
                <li key={ann.id}>
                    <Link to={`/announcements/${ann.id}`}>{ann.title}</Link>
                </li>
              ))}
              {Array.isArray(announcements) && announcements.length === 0 && <p>Объявлений нет.</p>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;