import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';
import { mockUserStats } from '../../data/mockData';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Flame, 
  Target, 
  Bell, 
  Layers,
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  PenTool,
  Award,
  BarChart3,
  Headphones,
  Home
} from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { activeTab, setActiveTab, toggleMobileDrawer } = useNavigation();
  const { studyStats, userSettings, setSearchFilter } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  const notifications = [
    { 
      id: 1, 
      title: 'Chuỗi học tập', 
      icon: <Flame size={15} color="var(--accent-streak)" />,
      text: `Bạn đang duy trì chuỗi ${studyStats.streakDays} ngày học liên tiếp! Tiếp tục phát huy nhé.`, 
      time: 'Vừa xong' 
    },
    { 
      id: 2, 
      title: 'Luyện tập Flashcard', 
      icon: <Layers size={15} color="var(--accent-success)" />,
      text: 'Các từ vựng trong Sổ đã sẵn sàng để ôn tập Spaced Repetition.', 
      time: '1 giờ trước' 
    },
    { 
      id: 3, 
      title: 'Mục tiêu cá nhân', 
      icon: <Target size={15} color="var(--brand-primary)" />,
      text: `Mục tiêu hiện tại: TOEIC ${userSettings.targetToeic}+. Hãy học 15 phút hôm nay!`, 
      time: 'Hôm nay' 
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFilter(searchQuery.trim());
      setActiveTab('vocabulary');
    }
  };

  const handleClearAllNotifications = () => {
    setHasUnreadNotification(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Menu drawer toggle */}
        <button 
          className="menu-toggle-btn" 
          onClick={toggleMobileDrawer} 
          aria-label="Mở menu tất cả tính năng"
          title="Menu đầy đủ"
        >
          <Menu size={18} />
        </button>

        {/* Global Logo Brand */}
        <div 
          className="header-brand-logo" 
          onClick={() => setActiveTab('dashboard')}
          title="Trang chủ English Master AI"
        >
          <div className="brand-icon-sm">
            <Sparkles size={18} />
          </div>
          <span className="brand-title-sm">
            ENGLISH MASTER
            <span className="brand-pill">AI</span>
          </span>
        </div>

        {/* Header Nav Links as requested */}
        <nav className="header-nav-links" aria-label="Điều hướng chính">
          <button 
            className={`header-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Home size={15} className="header-nav-icon" />
            <span>Trang chủ</span>
          </button>

          <button 
            className={`header-nav-link ${['transcript', 'listening', 'speaking'].includes(activeTab) ? 'active' : ''}`}
            onClick={() => setActiveTab('transcript')}
          >
            <Headphones size={15} className="header-nav-icon" />
            <span>Học tập</span>
          </button>
          
          <button 
            className={`header-nav-link ${['vocabulary', 'flashcard'].includes(activeTab) ? 'active' : ''}`}
            onClick={() => setActiveTab('vocabulary')}
          >
            <BookOpen size={15} className="header-nav-icon" />
            <span>Từ vựng</span>
          </button>
          
          <button 
            className={`header-nav-link ${activeTab === 'grammar' ? 'active' : ''}`}
            onClick={() => setActiveTab('grammar')}
          >
            <PenTool size={15} className="header-nav-icon" />
            <span>Ngữ pháp</span>
          </button>
          
          <button 
            className={`header-nav-link ${activeTab === 'toeic' ? 'active' : ''}`}
            onClick={() => setActiveTab('toeic')}
          >
            <Award size={15} className="header-nav-icon" />
            <span>Luyện tập</span>
          </button>
          
          <button 
            className={`header-nav-link ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            <BarChart3 size={15} className="header-nav-icon" />
            <span>Tiến độ</span>
          </button>
        </nav>
      </div>

      <div className="header-center">
        {/* Modern Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-box">
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Tìm từ vựng trong Sổ (Enter)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => {
                setSearchQuery('');
                setSearchFilter('');
              }} 
              style={{ color: 'var(--text-muted)' }}
              aria-label="Xóa tìm kiếm"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      <div className="header-right">
        {/* Streak Badge */}
        <div 
          className="header-badge badge-streak" 
          title="Chuỗi ngày học liên tục thực tế"
          onClick={() => setActiveTab('progress')}
          role="button"
          tabIndex={0}
        >
          <Flame size={16} fill="var(--accent-streak)" color="var(--accent-streak)" />
          <span>{studyStats.streakDays} Ngày</span>
        </div>

        {/* Target Badge */}
        <div 
          className="header-badge badge-primary header-badge-target" 
          title="Mục tiêu TOEIC hiện tại"
          onClick={() => setActiveTab('settings')}
          role="button"
          tabIndex={0}
        >
          <Target size={15} />
          <span>TOEIC {userSettings.targetToeic}+</span>
        </div>

        {/* Dark/Light Mode Toggle */}
        <button 
          className="icon-btn" 
          onClick={toggleTheme} 
          title={theme === 'dark' ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"}
          aria-label="Chuyển chế độ sáng tối"
        >
          {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Notifications Dropdown Toggle */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Thông báo"
            aria-label="Thông báo"
          >
            <Bell size={18} />
            {hasUnreadNotification && <span className="badge-dot" />}
          </button>

          {showNotifications && (
            <div 
              className="notification-dropdown"
              style={{
                position: 'absolute',
                top: '48px',
                right: '0',
                width: '320px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: '16px',
                zIndex: 60,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Thông báo mới</span>
                <button 
                  type="button"
                  style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={handleClearAllNotifications}
                >
                  Đã đọc tất cả
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '6px', background: 'var(--bg-surface-elevated)' }}>
                      {n.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Button */}
        <div 
          className="user-profile-btn" 
          onClick={() => setActiveTab('settings')} 
          title="Hồ sơ & Cài đặt"
          role="button"
          tabIndex={0}
        >
          <div className="user-avatar">
            {mockUserStats.avatar}
          </div>
          <div className="user-details">
            <span className="user-name">{mockUserStats.name}</span>
            <span className="user-role">Mục tiêu {userSettings.targetToeic}+</span>
          </div>
        </div>

        {/* Primary Header CTA */}
        <button 
          className="btn-primary header-cta-btn"
          onClick={() => setActiveTab('transcript')}
          title="Tiếp tục học bài gần nhất"
        >
          <span>Vào học</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </header>
  );
};
