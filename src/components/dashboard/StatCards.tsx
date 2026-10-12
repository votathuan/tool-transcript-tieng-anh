import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';
import { Flame, BookOpen, Clock, Target, ArrowUpRight } from 'lucide-react';

export const StatCards: React.FC = () => {
  const { setActiveTab } = useNavigation();
  const { vocabList, studyStats } = useApp();

  const streakDays = studyStats.streakDays;
  const wordsCount = vocabList.length;
  const wordsTarget = studyStats.wordsTarget || 600;
  const todayMins = studyStats.todayMinutes;
  const targetMins = studyStats.targetMinutes || 60;
  
  const timePercent = Math.min(100, Math.round((todayMins / targetMins) * 100));
  const dailyGoalPercent = Math.min(100, Math.round((timePercent * 0.7) + (Math.min(studyStats.totalReviews, 20) / 20 * 30)));

  return (
    <section className="stats-grid">
      {/* 1. Chuỗi ngày học liên tiếp */}
      <div 
        className="card card-interactive stat-card"
        onClick={() => setActiveTab('progress')}
      >
        <div className="stat-header">
          <div 
            className="stat-icon-wrapper" 
            style={{ background: 'var(--accent-streak-bg)', color: 'var(--accent-streak)' }}
          >
            <Flame size={24} fill="var(--accent-streak)" />
          </div>
          <span className="badge badge-streak">Kỷ lục: {Math.max(streakDays, 14)} ngày</span>
        </div>
        <div>
          <div className="stat-value">{streakDays} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>ngày</span></div>
          <div className="stat-title">Chuỗi ngày học liên tiếp</div>
          <div className="stat-progress-bar">
            <div 
              className="stat-progress-fill" 
              style={{ width: `${Math.min(100, (streakDays / 14) * 100)}%`, background: 'var(--accent-streak)' }} 
            />
          </div>
        </div>
        <div className="stat-footer">
          <span>🔥 Học liên tục hàng ngày</span>
          <ArrowUpRight size={14} />
        </div>
      </div>

      {/* 2. Số từ vựng đã học */}
      <div 
        className="card card-interactive stat-card"
        onClick={() => setActiveTab('vocabulary')}
      >
        <div className="stat-header">
          <div 
            className="stat-icon-wrapper" 
            style={{ background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)' }}
          >
            <BookOpen size={24} />
          </div>
          <span className="badge badge-purple">Đã lưu trong Sổ</span>
        </div>
        <div>
          <div className="stat-value">{wordsCount} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>/ {wordsTarget}</span></div>
          <div className="stat-title">Số từ vựng đã lưu & học</div>
          <div className="stat-progress-bar">
            <div 
              className="stat-progress-fill" 
              style={{ 
                width: `${Math.min(100, (wordsCount / wordsTarget) * 100)}%`, 
                background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' 
              }} 
            />
          </div>
        </div>
        <div className="stat-footer">
          <span>Mục tiêu {wordsTarget} từ TOEIC</span>
          <ArrowUpRight size={14} />
        </div>
      </div>

      {/* 3. Thời gian học hôm nay */}
      <div 
        className="card card-interactive stat-card"
        onClick={() => setActiveTab('progress')}
      >
        <div className="stat-header">
          <div 
            className="stat-icon-wrapper" 
            style={{ background: 'var(--accent-info-bg)', color: 'var(--accent-info)' }}
          >
            <Clock size={24} />
          </div>
          <span className="badge badge-info">{timePercent}% chỉ tiêu</span>
        </div>
        <div>
          <div className="stat-value">{todayMins} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>/ {targetMins} phút</span></div>
          <div className="stat-title">Thời gian học hôm nay</div>
          <div className="stat-progress-bar">
            <div 
              className="stat-progress-fill" 
              style={{ width: `${timePercent}%`, background: 'var(--accent-info)' }} 
            />
          </div>
        </div>
        <div className="stat-footer">
          <span>{todayMins >= targetMins ? 'Đã đạt chỉ tiêu ngày!' : `Còn ${targetMins - todayMins} phút nữa`}</span>
          <ArrowUpRight size={14} />
        </div>
      </div>

      {/* 4. Tiến độ mục tiêu hàng ngày */}
      <div 
        className="card card-interactive stat-card"
        onClick={() => setActiveTab('toeic')}
      >
        <div className="stat-header">
          <div 
            className="stat-icon-wrapper" 
            style={{ background: 'var(--accent-success-bg)', color: 'var(--accent-success)' }}
          >
            <Target size={24} />
          </div>
          <span className="badge badge-success">
            {dailyGoalPercent >= 80 ? 'Rất tốt 🎯' : 'Đang tiến hành'}
          </span>
        </div>
        <div>
          <div className="stat-value">{dailyGoalPercent}%</div>
          <div className="stat-title">Tiến độ mục tiêu hàng ngày</div>
          <div className="stat-progress-bar">
            <div 
              className="stat-progress-fill" 
              style={{ width: `${dailyGoalPercent}%`, background: 'var(--accent-success)' }} 
            />
          </div>
        </div>
        <div className="stat-footer">
          <span>{studyStats.totalReviews} lượt ôn Flashcard</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
    </section>
  );
};
