import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import type { NavTab } from '../../context/NavigationContext';
import { 
  Home, 
  FileText, 
  Headphones, 
  Mic, 
  BookOpen, 
  Layers, 
  PenTool, 
  Award, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeType?: string;
}

const navItems: NavItemConfig[] = [
  { id: 'dashboard', label: 'Trang chủ', icon: <Home size={19} /> },
  { id: 'transcript', label: 'Học qua Transcript', icon: <FileText size={19} />, badge: 'AI', badgeType: 'badge-purple' },
  { id: 'listening', label: 'Luyện nghe', icon: <Headphones size={19} /> },
  { id: 'speaking', label: 'Luyện nói', icon: <Mic size={19} />, badge: 'AI Voice', badgeType: 'badge-info' },
  { id: 'vocabulary', label: 'Từ vựng', icon: <BookOpen size={19} /> },
  { id: 'flashcard', label: 'Flashcard', icon: <Layers size={19} />, badge: 'SRS', badgeType: 'badge-success' },
  { id: 'grammar', label: 'Ngữ pháp', icon: <PenTool size={19} /> },
  { id: 'toeic', label: 'TOEIC', icon: <Award size={19} />, badge: 'Hot', badgeType: 'badge-streak' },
  { id: 'progress', label: 'Tiến độ', icon: <BarChart3 size={19} /> },
  { id: 'settings', label: 'Cài đặt', icon: <Settings size={19} /> },
];

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarCollapsed, 
    toggleSidebar, 
    isMobileDrawerOpen, 
    closeMobileDrawer 
  } = useNavigation();

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileDrawerOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileDrawer} />
      )}

      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileDrawerOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand-wrapper" onClick={() => setActiveTab('dashboard')} title="ENGLISH MASTER AI">
            <div className="brand-icon">
              <Sparkles size={22} />
            </div>
            {!isSidebarCollapsed && (
              <div className="brand-info">
                <span className="brand-title">
                  ENGLISH MASTER
                  <span style={{ fontSize: '0.65rem', background: 'var(--brand-primary)', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>
                    AI
                  </span>
                </span>
                <span className="brand-tagline">Learn English smarter with AI</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button 
            className="sidebar-collapse-btn" 
            onClick={toggleSidebar} 
            title={isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {!isSidebarCollapsed && <div className="nav-section-title">Học tập & Rèn luyện</div>}
          
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <span className="nav-item-icon">{item.icon}</span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="nav-item-label">{item.label}</span>
                    {item.badge && (
                      <span className={`nav-badge ${item.badgeType || 'badge-primary'}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pro / Motivation Card at bottom (if not collapsed) */}
        {!isSidebarCollapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-pro-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                <Zap size={16} fill="#fbbf24" color="#fbbf24" />
                <span className="sidebar-pro-title">TOEIC Master 2026</span>
              </div>
              <p className="sidebar-pro-desc">
                Cá nhân hóa lộ trình học bằng AI giúp tăng 150+ điểm trong 30 ngày.
              </p>
              <button className="sidebar-pro-btn" onClick={() => setActiveTab('toeic')}>
                Kiểm tra trình độ
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
