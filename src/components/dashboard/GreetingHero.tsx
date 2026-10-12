import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';
import { mockUserStats } from '../../data/mockData';
import { Play, Sparkles, Trophy, ArrowRight, Target, Clock } from 'lucide-react';

export const GreetingHero: React.FC = () => {
  const { setActiveTab } = useNavigation();
  const { studyStats, userSettings } = useApp();

  const getGreetingText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const targetToeic = userSettings.targetToeic || studyStats.targetToeic || 750;
  const streakDays = studyStats.streakDays;
  const targetMinutes = userSettings.dailyTargetMinutes || 60;
  const todayMinutes = studyStats.todayMinutes || 0;
  const progressPercent = Math.min(100, Math.round((todayMinutes / targetMinutes) * 100));

  return (
    <section className="greeting-hero">
      <div className="greeting-text-content">
        <div className="greeting-badge-row">
          <span className="badge badge-purple">
            <Sparkles size={13} />
            ENGLISH MASTER AI 2.0
          </span>
          <span className="badge badge-streak">
            🔥 Chuỗi học {streakDays} ngày liên tiếp
          </span>
          <span className="badge badge-info">
            <Target size={12} />
            Mục tiêu hôm nay: {todayMinutes}/{targetMinutes} phút ({progressPercent}%)
          </span>
        </div>

        <h1 className="greeting-title">
          {getGreetingText()}, {mockUserStats.name.split(' ').slice(-2).join(' ')}! 🚀
        </h1>

        <p className="greeting-subtitle">
          Bạn đang trên lộ trình chinh phục mục tiêu <strong>{targetToeic}+ TOEIC</strong>. Hãy hoàn thành <strong>{Math.max(0, targetMinutes - todayMinutes)} phút</strong> còn lại hôm nay với các bài luyện nghe & từ vựng!
        </p>

        {/* Continue Learning Widget */}
        <div className="continue-card-mini">
          <div className="continue-icon-box">
            <Play size={20} fill="var(--brand-primary)" />
          </div>
          <div className="continue-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span className="continue-label">ĐANG HỌC DỞ</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• Bài nghe số 1</span>
            </div>
            <span className="continue-topic">Review 1: In class - Track 1 (Bóc tách Whisper AI)</span>
            <span className="continue-meta">
              <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Đã học {todayMinutes} phút hôm nay • {studyStats.totalReviews} lượt ôn Flashcard
            </span>
          </div>
          <button 
            className="btn-primary" 
            style={{ padding: '9px 18px', fontSize: '0.875rem', marginLeft: '12px' }}
            onClick={() => setActiveTab('transcript')}
          >
            <span>Tiếp tục học</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <div className="greeting-illustration">
        <div className="hero-art-badge">
          <div className="hero-art-icon">
            <Trophy size={36} color="#ffffff" />
          </div>
          <div className="hero-art-target">Mục tiêu TOEIC</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0' }}>{targetToeic}+</div>
          <div className="hero-art-sub">Dự đoán năng lực: {studyStats.currentToeic}</div>
        </div>
      </div>
    </section>
  );
};
