// src/components/WeatherWidget.jsx
import React from 'react';
import './WeatherWidget.css'; // Мы создадим этот файл для стилей виджета

function WeatherWidget() {
  // Пока здесь будут статичные данные
  return (
    <div className="widget weather-widget">
      <div className="weather-header">
        <h3>☀️ Погода</h3>
        <a href="#">Подробнее </a>
      </div>
      <div className="weather-body">
        <h2>+24°C</h2>
        <p>Сейчас: Ясно, без осадков</p>
      </div>
    </div>
  );
}

export default WeatherWidget;