import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockGrammarTopics } from '../../data/mockData';
import type { GrammarTopic } from '../../data/mockData';
import { CheckCircle, XCircle, Sparkles } from 'lucide-react';

export const GrammarView: React.FC = () => {
  const { addStudyMinutes } = useApp();
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic>(mockGrammarTopics[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    addStudyMinutes(1);
  };

  const handleNextTopic = (topic: GrammarTopic) => {
    setSelectedTopic(topic);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const isCorrect = selectedOption === selectedTopic.sampleQuiz.correctIndex;

  return (
    <div>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.5rem' }}>
            ✍️ Sổ tay ngữ pháp trọng tâm TOEIC Part 5 & 6
          </h1>
          <p className="section-subtitle">
            Hệ thống hóa quy tắc ngữ pháp thường gặp nhất trong đề thi kèm câu hỏi thực hành có lời giải chi tiết
          </p>
        </div>
      </div>

      <div className="module-two-col-layout">
        {/* Left Topic List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Chuyên đề ngữ pháp
          </span>

          {mockGrammarTopics.map(topic => (
            <div
              key={topic.id}
              className={`card card-interactive ${selectedTopic.id === topic.id ? 'active' : ''}`}
              style={{
                padding: '16px',
                borderColor: selectedTopic.id === topic.id ? 'var(--brand-primary)' : undefined,
                background: selectedTopic.id === topic.id ? 'var(--brand-primary-light)' : undefined,
              }}
              onClick={() => handleNextTopic(topic)}
            >
              <span className="badge badge-purple" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>
                {topic.tag}
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {topic.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {topic.summary.slice(0, 60)}...
              </div>
            </div>
          ))}
        </div>

        {/* Right Topic Details & Practice Quiz */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Rules Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="badge badge-primary">{selectedTopic.tag}</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {selectedTopic.title}
              </h2>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              {selectedTopic.summary}
            </p>

            <div style={{ background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} />
                Quy tắc vàng cần ghi nhớ:
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedTopic.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Quiz Card */}
          <div className="card" style={{ border: '2px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-primary)' }}>
                📝 Câu hỏi luyện tập nhanh (Format TOEIC Part 5)
              </span>
              <span className="badge badge-info">Độ khó: 650 - 800</span>
            </div>

            {/* Question sentence */}
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.5 }}>
              {selectedTopic.sampleQuiz.question}
            </div>

            {/* Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {selectedTopic.sampleQuiz.options.map((opt, idx) => {
                let btnStyle = 'var(--bg-surface-elevated)';
                let borderColor = 'var(--border-color)';
                let textColor = 'var(--text-primary)';

                if (isAnswered) {
                  if (idx === selectedTopic.sampleQuiz.correctIndex) {
                    btnStyle = 'var(--accent-success-bg)';
                    borderColor = 'var(--accent-success)';
                    textColor = 'var(--accent-success)';
                  } else if (idx === selectedOption) {
                    btnStyle = 'var(--accent-danger-bg)';
                    borderColor = 'var(--accent-danger)';
                    textColor = 'var(--accent-danger)';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${borderColor}`,
                      background: btnStyle,
                      color: textColor,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: isAnswered ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                    {isAnswered && idx === selectedTopic.sampleQuiz.correctIndex && (
                      <CheckCircle size={18} color="var(--accent-success)" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== selectedTopic.sampleQuiz.correctIndex && (
                      <XCircle size={18} color="var(--accent-danger)" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation reveal */}
            {isAnswered && (
              <div 
                style={{ 
                  padding: '16px 20px', 
                  borderRadius: 'var(--radius-md)', 
                  background: isCorrect ? 'var(--accent-success-bg)' : 'var(--accent-info-bg)',
                  border: `1px solid ${isCorrect ? 'var(--accent-success-border)' : 'var(--accent-info-border)'}`
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isCorrect ? 'var(--accent-success)' : 'var(--accent-info)', marginBottom: '6px' }}>
                  {isCorrect ? '🎉 Bạn đã chọn chính xác!' : '💡 Hướng dẫn phân tích:'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {selectedTopic.sampleQuiz.explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
