// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAnnouncements, fetchMarketPrices } from '../api';
import '../App.css';

function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState("Краснодарский край");

  const handleRegionChange = () => {
    const newRegion = region === "Краснодарский край" ? "Алтайский край" : "Краснодарский край";
    setRegion(newRegion);
  };

  useEffect(() => {
    // Сбрасываем данные перед новой загрузкой
    setAnnouncements([]);
    setMarketPrices([]);
    setLoading(true);
    
    Promise.all([
      fetchAnnouncements(region),
      fetchMarketPrices(region),
    ])
    .then(([announcementsRes, pricesRes]) => {
      // Проверяем, что данные действительно пришли
      if (announcementsRes.data) setAnnouncements(announcementsRes.data);
      if (pricesRes.data) setMarketPrices(pricesRes.data);
    })
    .catch(error => {
      console.error("Ошибка при загрузке данных:", error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [region]);

  return (
    // Этот корневой div
    <div>
      <header className="app-header">
        <h1>Добрый день, Иван!</h1>
        <p onClick={handleRegionChange} style={{ cursor: 'pointer' }}>
          📍 {region} (нажми, чтобы сменить)
        </p>
      </header>

      <div className="search-bar">
        <input type="text" placeholder="🔍 Найди ремкомплект..." />
      </div>

      {/* Этот div для виджетов */}
      <div className="widgets-container">
        
        <div className="widget">
          <h3>Цены на рынке</h3>
          {loading ? <p>Загрузка...</p> : (
            <ul className="prices-list">
              {/* ДОБАВЛЯЕМ ПРОВЕРКУ Array.isArray() */}
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
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            <ul>
              {/* ДОБАВЛЯЕМ ПРОВЕРКУ Array.isArray() */}
              {Array.isArray(announcements) && announcements.map(ann => (
                <li key={ann.id}>{ann.title}</li>
              ))}
              {Array.isArray(announcements) && announcements.length === 0 && <p>Объявлений нет.</p>}
            </ul>
          )}
        </div>
      
      </div> {/* <-- Теперь этот тег на месте */}
    </div>   // <-- И этот тег тоже
  );
}

export default HomePage;