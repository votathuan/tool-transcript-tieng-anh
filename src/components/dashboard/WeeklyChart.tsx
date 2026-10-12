import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { DayActivity } from '../../data/mockData';
import { BarChart2, CheckCircle, TrendingUp } from 'lucide-react';

export const WeeklyChart: React.FC = () => {
  const { studyStats } = useApp();
  const weeklyData = studyStats.weeklyActivity;

  const [selectedDay, setSelectedDay] = useState<DayActivity>(
    weeklyData.find(d => d.isToday) || weeklyData[weeklyData.length - 1]
  );

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 80);
  const totalMinutes = weeklyData.reduce((acc, curr) => acc + curr.minutes, 0);
  const avgAccuracy = Math.round(
    weeklyData.reduce((acc, curr) => acc + curr.accuracy, 0) / weeklyData.length
  );

  return (
    <div className="card weekly-chart-wrapper">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <BarChart2 size={20} color="var(--brand-primary)" />
            Biểu đồ tiến độ tuần này
          </h2>
          <span className="section-subtitle">
            Tổng cộng: <strong>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</strong> • Độ chính xác trung bình: <strong>{avgAccuracy}%</strong>
          </span>
        </div>
        <span className="badge badge-success">
          <TrendingUp size={14} />
          +12% so với tuần trước
        </span>
      </div>

      {/* Bar visual chart */}
      <div className="weekly-bars-container">
        {weeklyData.map((dayItem) => {
          const heightPercent = Math.round((dayItem.minutes / maxMinutes) * 100);
          const isSelected = selectedDay.day === dayItem.day;

          return (
            <div 
              key={dayItem.day} 
              className="weekly-bar-column"
              onClick={() => setSelectedDay(dayItem)}
            >
              <div 
                className="weekly-bar-track"
                style={{ 
                  outline: isSelected ? '2px solid var(--brand-primary)' : 'none',
                  outlineOffset: '2px'
                }}
              >
                <div 
                  className={`weekly-bar-fill ${dayItem.isToday ? 'today' : ''}`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className={`weekly-bar-label ${dayItem.isToday || isSelected ? 'active' : ''}`}>
                {dayItem.dayShort}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Day Details */}
      <div className="weekly-chart-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedDay.day}:</span>
          <span>{selectedDay.minutes} phút học</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-success)' }}>
          <CheckCircle size={15} />
          <span>Độ chính xác bài tập: <strong>{selectedDay.accuracy}%</strong></span>
        </div>
      </div>
    </div>
  );
};
