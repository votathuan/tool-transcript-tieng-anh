import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { mockRecommendedLessons } from '../../data/mockData';
import { Sparkles, Clock, ArrowRight } from 'lucide-react';

export const RecommendedLessons: React.FC = () => {
  const { setActiveTab } = useNavigation();

  return (
    <section>
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Sparkles size={20} color="var(--brand-primary)" />
            Bài học AI đề xuất riêng cho bạn
          </h2>
          <span className="section-subtitle">
            Dựa trên phân tích điểm yếu và lịch sử làm bài gần nhất của bạn
          </span>
        </div>
        <button 
          className="btn-secondary" 
          style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          onClick={() => setActiveTab('transcript')}
        >
          Xem tất cả bài học
        </button>
      </div>

      <div className="recommended-grid">
        {mockRecommendedLessons.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <div className="lesson-card-header">
              <span className={`badge ${lesson.badgeColor}`}>
                {lesson.aiTag}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {lesson.level}
              </span>
            </div>

            <div className="lesson-card-body">
              <h3 className="lesson-title">{lesson.title}</h3>
              <p className="lesson-desc">{lesson.description}</p>

              <div className="lesson-meta-row">
                <div className="lesson-meta-item">
                  <Clock size={14} />
                  <span>{lesson.duration}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                  {lesson.category}
                </span>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '9px 14px', fontSize: '0.85rem' }}
                onClick={() => setActiveTab(lesson.tabTarget)}
              >
                <span>Bắt đầu học ngay</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
