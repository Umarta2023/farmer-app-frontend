// src/App.jsx
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Импортируем наши страницы
import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import ProfilePage from './pages/ProfilePage';
import CreateAnnouncementPage from './pages/CreateAnnouncementPage';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage';

function App() {
  const location = useLocation();

  const getActiveClass = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  return (
    <div className="app-container">
      {/* Обертка для основного контента */}
      <main className="content">
        {/* Здесь роутер будет отображать нужную страницу */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Убедитесь, что этот маршрут здесь есть и он правильный */}
          <Route path="/announcements/new" element={<CreateAnnouncementPage />} />
          <Route path="/announcements/:id" element={<AnnouncementDetailPage />} />
        </Routes>
      </main>

      {/* Нижняя навигация */}
      <nav className="bottom-nav">
        <Link to="/" className={getActiveClass('/')}>🏠 Главная</Link>
        <Link to="/market" className={getActiveClass('/market')}>🛒 Рынок</Link>
        <div className="nav-item">💬 Сообщество</div>
        <div className="nav-item">📊 Цены</div>
        <Link to="/profile" className={getActiveClass('/profile')}>👤 Профиль</Link>
      </nav>
    </div>

    
  );
}

export default App;