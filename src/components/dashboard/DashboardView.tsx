import React from 'react';
import { GreetingHero } from './GreetingHero';
import { StatCards } from './StatCards';
import { WeeklyChart } from './WeeklyChart';
import { QuickActions } from './QuickActions';
import { RecommendedLessons } from './RecommendedLessons';

export const DashboardView: React.FC = () => {
  return (
    <div className="dashboard-view">
      {/* 1. Lời chào & Thẻ tiếp tục học */}
      <GreetingHero />

      {/* 2. 4 Thẻ thống kê: Streak, Từ vựng, Thời gian hôm nay, Mục tiêu ngày */}
      <StatCards />

      {/* 3. Biểu đồ tiến độ tuần & Lối tắt nhanh */}
      <div className="dashboard-middle-grid">
        <WeeklyChart />
        <QuickActions />
      </div>

      {/* 4. Các bài học AI đề xuất */}
      <RecommendedLessons />
    </div>
  );
};
