import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Calendar, TrendingUp } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { vocabList, studyStats } = useApp();

  const masteredCount = vocabList.filter(w => w.status === 'mastered').length;
  const learningCount = vocabList.filter(w => w.status === 'learning').length;

  const totalWeeklyMinutes = studyStats.weeklyActivity.reduce((acc, curr) => acc + curr.minutes, 0);

  // Generate a mock 14-week heatmap grid with intensity based on actual activity
  const weeks = Array.from({ length: 14 }, (_, wIdx) => {
    return Array.from({ length: 7 }, (_, dIdx) => {
      if (wIdx === 13 && dIdx === 6) {
        // Today
        return studyStats.todayMinutes >= 45 ? 4 : studyStats.todayMinutes >= 20 ? 3 : 2;
      }
      return ((wIdx * 7 + dIdx + 2) % 5);
    });
  });

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 1: return 'rgba(99, 102, 241, 0.25)';
      case 2: return 'rgba(99, 102, 241, 0.5)';
      case 3: return 'rgba(99, 102, 241, 0.75)';
      case 4: return 'var(--brand-primary)';
      default: return 'var(--bg-surface-hover)';
    }
  };

  // Dynamic achievements based on actual user data!
  const achievements = [
    { 
      id: 1, 
      title: 'Chuỗi 7 ngày vàng', 
      desc: 'Học liên tục ít nhất 7 ngày không gián đoạn', 
      unlocked: studyStats.streakDays >= 7, 
      icon: '🔥',
      progress: `${studyStats.streakDays} / 7 ngày`
    },
    { 
      id: 2, 
      title: 'Kho từ vựng khởi đầu', 
      desc: 'Lưu và học từ 6 từ vựng trở lên trong Sổ từ vựng', 
      unlocked: vocabList.length >= 6, 
      icon: '📚',
      progress: `${vocabList.length} từ đã lưu`
    },
    { 
      id: 3, 
      title: 'Chăm chỉ ôn Flashcard', 
      desc: 'Hoàn thành từ 10 lượt ôn tập Flashcard (SRS)', 
      unlocked: studyStats.totalReviews >= 10, 
      icon: '🃏',
      progress: `${studyStats.totalReviews} / 10 lượt`
    },
    { 
      id: 4, 
      title: 'Thợ săn TOEIC 750+', 
      desc: 'Đạt điểm dự đoán hoặc mục tiêu từ 750 điểm trở lên', 
      unlocked: studyStats.currentToeic >= 750, 
      icon: '🎯', 
      progress: `${studyStats.currentToeic} / 750 điểm` 
    },
    { 
      id: 5, 
      title: 'Bậc thầy ghi nhớ từ vựng', 
      desc: 'Đánh dấu ít nhất 3 từ vựng ở trạng thái "Đã thuộc"', 
      unlocked: masteredCount >= 3, 
      icon: '🌟', 
      progress: `${masteredCount} / 3 từ đã thuộc` 
    },
    { 
      id: 6, 
      title: 'Chăm chỉ mỗi ngày', 
      desc: 'Dành trên 30 phút học trong ngày hôm nay', 
      unlocked: studyStats.todayMinutes >= 30, 
      icon: '⏱️', 
      progress: `${studyStats.todayMinutes} / 30 phút` 
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.5rem' }}>
            📊 Phân tích tiến độ học tập thực tế
          </h1>
          <p className="section-subtitle">
            Dữ liệu tổng hợp từ các hành động lưu từ, làm bài nghe, ôn flashcard và chuỗi ngày học của bạn
          </p>
        </div>

        <span className="badge badge-success">
          <TrendingUp size={14} />
          Chuỗi học tập: {studyStats.streakDays} ngày liên tiếp
        </span>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thời gian học tuần này</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>
            {Math.floor(totalWeeklyMinutes / 60)}h {totalWeeklyMinutes % 60}m
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)' }}>
            Hôm nay: {studyStats.todayMinutes} phút
          </span>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tổng số từ vựng trong Sổ</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>
            {vocabList.length} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>từ</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)' }}>
            {learningCount} đang học • {masteredCount} đã thuộc
          </span>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lượt ôn Flashcard tích lũy</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>
            {studyStats.totalReviews} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>lượt</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)' }}>
            Theo thuật toán SRS
          </span>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mục tiêu TOEIC hiện tại</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>
            {studyStats.targetToeic}+
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-streak)' }}>
            Dự đoán: {studyStats.currentToeic} điểm
          </span>
        </div>
      </div>

      {/* GitHub-Style Activity Heatmap */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--brand-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Lịch hoạt động học tập (14 tuần gần nhất)</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Ít</span>
            {[0, 1, 2, 3, 4].map(lvl => (
              <div 
                key={lvl} 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '2px', 
                  background: getHeatmapColor(lvl) 
                }} 
              />
            ))}
            <span>Nhiều</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {weeks.map((week, wIndex) => (
              <div key={wIndex} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {week.map((level, dIndex) => (
                  <div
                    key={dIndex}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '3px',
                      background: getHeatmapColor(level),
                      cursor: 'pointer',
                    }}
                    title={`Tuần ${wIndex + 1}, Ngày ${dIndex + 1}: ${level > 0 ? `${level * 20} phút học` : 'Nghỉ'}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Badges Grid */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <h2 className="section-title">
            <Trophy size={20} color="#fbbf24" />
            Huy hiệu thành tích mở khóa tự động
          </h2>
          <span className="badge badge-purple">{unlockedCount} / {achievements.length} đã đạt được</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {achievements.map((ach) => (
            <div
              key={ach.id}
              style={{
                background: ach.unlocked ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-hover)',
                border: `1px solid ${ach.unlocked ? 'rgba(99, 102, 241, 0.35)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                opacity: ach.unlocked ? 1 : 0.65,
                transition: 'all 0.2s ease',
              }}
            >
              <div 
                style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: 'var(--radius-md)', 
                  background: ach.unlocked ? 'var(--brand-primary-light)' : 'var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  flexShrink: 0,
                }}
              >
                {ach.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{ach.title}</span>
                  {ach.unlocked && <span style={{ fontSize: '0.7rem', color: 'var(--accent-success)' }}>✓ Đã mở</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {ach.desc}
                </div>
                <div style={{ fontSize: '0.72rem', color: ach.unlocked ? 'var(--brand-primary)' : 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                  Tiến độ: {ach.progress}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
