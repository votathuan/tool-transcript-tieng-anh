import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { Headphones, Layers, Award, Sparkles, ChevronRight } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { setActiveTab } = useNavigation();

  const actions = [
    {
      id: 'dictation',
      title: 'Luyện nghe Chép chính tả (5 phút)',
      desc: '3 câu ngắn TOEIC Part 1 & 2 giúp nhạy âm',
      icon: <Headphones size={20} color="#0ea5e9" />,
      bg: 'var(--accent-info-bg)',
      tab: 'listening' as const,
    },
    {
      id: 'flashcard',
      title: 'Ôn tập 15 Flashcard (SRS)',
      desc: 'Các từ sắp quên theo thuật toán lặp lại',
      icon: <Layers size={20} color="#10b981" />,
      bg: 'var(--accent-success-bg)',
      tab: 'flashcard' as const,
    },
    {
      id: 'mini-toeic',
      title: 'Thử sức Mini-Test TOEIC (20 phút)',
      desc: '30 câu tổng hợp Part 1, 2, 5 có bấm giờ',
      icon: <Award size={20} color="#8b5cf6" />,
      bg: 'var(--accent-purple-bg)',
      tab: 'toeic' as const,
    },
  ];

  return (
    <div className="card">
      <div className="section-header" style={{ marginBottom: '14px' }}>
        <h2 className="section-title" style={{ fontSize: '1.05rem' }}>
          <Sparkles size={18} color="var(--accent-streak)" />
          Luyện tập nhanh hôm nay
        </h2>
      </div>

      <div className="quick-actions-list">
        {actions.map((act) => (
          <div
            key={act.id}
            className="quick-action-item"
            onClick={() => setActiveTab(act.tab)}
          >
            <div className="quick-action-icon" style={{ background: act.bg }}>
              {act.icon}
            </div>
            <div className="quick-action-info">
              <div className="quick-action-title">{act.title}</div>
              <div className="quick-action-desc">{act.desc}</div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
        ))}
      </div>
    </div>
  );
};
