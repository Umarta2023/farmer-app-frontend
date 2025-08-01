// src/pages/MarketPage.jsx
import { useState, useEffect } from 'react';
import { fetchAnnouncements } from '../api';
import AnnouncementCard from '../components/AnnouncementCard';
import { useAuth } from '../context/AuthContext'; // <-- Импортируем наш хук

// Список регионов для фильтра (в будущем можно грузить с бэкенда)
const availableRegions = [
  "Краснодарский край", 
  "Алтайский край", 
  "Рязанская область",
  "Московская область"
];

function MarketPage() {
  const { currentUser } = useAuth(); // <-- Получаем данные о пользователе
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Состояние для выбранного фильтра региона
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Этот эффект установит регион по умолчанию, как только загрузится пользователь
  useEffect(() => {
    if (currentUser) {
      setSelectedRegion(currentUser.region || "Все регионы");
    }
  }, [currentUser]); // Зависимость от currentUser

  // Этот эффект загружает объявления, когда меняется выбранный регион
  useEffect(() => {
    if (selectedRegion === null) return; // Не грузить, пока регион не установлен

    setLoading(true);
    setAnnouncements([]);

    // Если выбраны "Все регионы", передаем `null`
    const regionToFetch = selectedRegion === "Все регионы" ? null : selectedRegion;

    fetchAnnouncements(regionToFetch)
      .then(response => {
        setAnnouncements(response.data);
      })
      .catch(error => {
        console.error("Ошибка при загрузке объявлений для рынка:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedRegion]); // Зависимость от selectedRegion

  return (
    <div>
      <header className="app-header">
        <h1>Рынок</h1>
        {/* --- Наш новый фильтр --- */}
        <div className="filter-container">
          <label htmlFor="region-select">Регион:</label>
          <select 
            id="region-select" 
            value={selectedRegion || ""}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="Все регионы">Все регионы</option>
            {availableRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </header>
      
      <div className="page-content">
        {loading ? (
          <p>Загрузка объявлений...</p>
        ) : (
          <div className="announcements-list">
            {announcements.length > 0 ? (
              announcements.map(ann => (
                <AnnouncementCard key={ann.id} announcement={ann} />
              ))
            ) : (
              <p>В этом регионе объявлений нет.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketPage;