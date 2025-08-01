// src/components/PriceWidget.jsx
import React, { useState, useEffect } from 'react'; // 1. Импортируем useState и useEffect
import axios from 'axios'; // 2. Импортируем axios
import './PriceWidget.css';

function PriceWidget() {
  // 3. Создаем "состояние" для хранения данных о ценах.
  // Изначально это пустой массив.
  const [prices, setPrices] = useState([]);
  
  // 4. Создаем состояние для отслеживания загрузки.
  const [loading, setLoading] = useState(true);

  // 5. useEffect - это "крючок", который выполняет код ПОСЛЕ того,
  // как компонент будет отрисован на странице.
  // Пустой массив [] в конце означает, что этот код выполнится только один раз.
  useEffect(() => {
    // Функция для получения данных с нашего бэкенда
    const fetchPrices = async () => {
      try {
        // Отправляем GET-запрос на наш API.
        // Замените 'krasnodar' на нужный регион.
        const response = await axios.get('http://127.0.0.1:8000/api/prices/krasnodar');
        
        // 6. Обновляем наше состояние полученными данными.
        setPrices(response.data);

      } catch (error) {
        console.error("Ошибка при загрузке цен:", error);
        // Здесь можно было бы установить состояние ошибки и показать ее пользователю
      } finally {
        // Вне зависимости от успеха или ошибки, убираем индикатор загрузки.
        setLoading(false);
      }
    };

    fetchPrices(); // Вызываем функцию получения данных
  }, []); // <-- Пустой массив зависимостей = запустить один раз при монтировании

  // 7. Условный рендеринг: пока данные грузятся, показываем "Загрузка..."
  if (loading) {
    return (
      <div className="widget price-widget">
        <p>Загрузка цен...</p>
      </div>
    );
  }

  // 8. Когда загрузка завершена, отрисовываем данные из нашего состояния `prices`
  return (
    <div className="widget price-widget">
      <div className="price-header">
        <h3>Цены на рынке</h3>
        <a href="#">Подробнее </a>
      </div>
      <div className="price-body">
        {prices.map((item, index) => (
          <div className="price-item" key={index}>
            <span>{item.crop_name}</span>
            <span className={`price-value ${item.trend}`}>
              {item.price} ₽/т {item.trend === 'up' ? '▲' : '▼'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PriceWidget;