import React, { useState, useEffect } from 'react';
import { mockToeicParts } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { Clock, CheckSquare, Play, Sparkles, X, CheckCircle, Award } from 'lucide-react';

interface MiniQuestion {
  id: number;
  part: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const MINI_QUESTIONS: MiniQuestion[] = [
  {
    id: 1,
    part: 'Part 5',
    question: 'The board of directors _______ voted to approve the international acquisition plan.',
    options: ['unanimously', 'unanimous', 'unanimity', 'unanimousness'],
    correctIndex: 0,
  },
  {
    id: 2,
    part: 'Part 5',
    question: 'All employees are required to submit their travel expense receipts _______ Friday afternoon.',
    options: ['until', 'by', 'since', 'during'],
    correctIndex: 1,
  },
  {
    id: 3,
    part: 'Part 5',
    question: 'The marketing manager requested _______ the presentation slides before the client arrived.',
    options: ['review', 'reviewing', 'to review', 'reviewed'],
    correctIndex: 2,
  },
  {
    id: 4,
    part: 'Part 5',
    question: 'Neither the department head _______ the assistants were aware of the schedule revision.',
    options: ['or', 'nor', 'either', 'and'],
    correctIndex: 1,
  },
  {
    id: 5,
    part: 'Part 5',
    question: 'The warranty covers free repair services _______ the product was purchased within one year.',
    options: ['provided that', 'in spite of', 'whereas', 'due to'],
    correctIndex: 0,
  },
];

export const ToeicView: React.FC = () => {
  const { studyStats, userSettings, recordTestCompletion } = useApp();
  const [activeTestModal, setActiveTestModal] = useState<string | null>(null);

  // Mini-test interactive state
  const [testStarted, setTestStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1200); // 20 mins
  const [testResult, setTestResult] = useState<{ score: number; correct: number; total: number } | null>(null);

  // Countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (testStarted && !testResult && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, testResult, timeLeftSeconds]);

  const handleStartTest = () => {
    setTestStarted(true);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeLeftSeconds(1200);
    setTestResult(null);
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    MINI_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = 550 + Math.round((correctCount / MINI_QUESTIONS.length) * 250);
    setTestResult({
      score: calculatedScore,
      correct: correctCount,
      total: MINI_QUESTIONS.length,
    });

    // Record to AppContext & localStorage
    recordTestCompletion(calculatedScore);
  };

  const handleCloseModal = () => {
    setActiveTestModal(null);
    setTestStarted(false);
    setTestResult(null);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const targetToeic = userSettings.targetToeic || 750;

  return (
    <div>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.5rem' }}>
            📝 Luyện thi & Thi thử TOEIC định dạng mới
          </h1>
          <p className="section-subtitle">
            Phân tích tỷ lệ chính xác từ Part 1 đến Part 7, dự đoán điểm số và thi thử có bấm giờ chuẩn ETS
          </p>
        </div>
      </div>

      {/* Score Prediction Banner */}
      <div className="toeic-score-banner" style={{ marginBottom: '28px' }}>
        <div>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '8px' }}>
            <Sparkles size={14} />
            Dự đoán điểm từ AI & Lịch sử làm bài
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
            Điểm TOEIC ước lượng: {studyStats.currentToeic} / 990
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', maxWidth: '520px' }}>
            Listening: <strong>365 điểm</strong> • Reading: <strong>{studyStats.currentToeic - 365} điểm</strong>.
            Bạn còn cách mục tiêu <strong>{targetToeic}+</strong> đúng {Math.max(0, targetToeic - studyStats.currentToeic)} điểm nữa!
          </p>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div className="toeic-score-number">{studyStats.currentToeic}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Mục tiêu: {targetToeic}+</div>
        </div>
      </div>

      {/* Practice Tests Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {/* Mini Test */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge badge-purple">Có bấm giờ & Chấm điểm thật</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>5 câu trắc nghiệm</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
              ⚡ Mini-Test TOEIC Cấp tốc (20 Phút)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
              Bài test rút gọn định dạng chuẩn Part 5. Thích hợp cho sinh viên kiểm tra phản xạ mỗi ngày và ghi nhận điểm thật vào tiến độ.
            </p>
          </div>
          <button 
            className="btn-primary" 
            style={{ width: '100%' }}
            onClick={() => {
              setActiveTestModal('Mini-Test TOEIC (20 Phút)');
              handleStartTest();
            }}
          >
            <Play size={16} fill="#fff" />
            <span>Bắt đầu Mini-Test ngay</span>
          </button>
        </div>

        {/* Full Test */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge badge-streak">Chuẩn format ETS</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>200 câu hỏi</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
              🎯 Full Test TOEIC Đầy đủ (120 Phút)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
              Mô phỏng 100% không gian phòng thi thực tế với 100 câu Nghe (45 phút) và 100 câu Đọc (75 phút) có đồng hồ bấm giờ đếm ngược.
            </p>
          </div>
          <button 
            className="btn-secondary" 
            style={{ width: '100%', borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
            onClick={() => {
              setActiveTestModal('Full Test Chuẩn ETS (120 Phút)');
              setTestStarted(false);
            }}
          >
            <Clock size={16} />
            <span>Vào phòng thi thử Full Test</span>
          </button>
        </div>
      </div>

      {/* Breakdown Part 1 - Part 7 */}
      <div className="card">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <CheckSquare size={20} color="var(--brand-primary)" />
              Đánh giá chi tiết năng lực từng Part
            </h2>
            <span className="section-subtitle">
              Tỷ lệ làm đúng trung bình qua các bài luyện tập
            </span>
          </div>
        </div>

        <div className="toeic-parts-grid">
          {mockToeicParts.map(part => (
            <div 
              key={part.part}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Part {part.part}: {part.title}
                </span>
                <span className={`badge ${part.accuracy >= 75 ? 'badge-success' : 'badge-warning'}`}>
                  {part.accuracy}% đúng
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Loại: {part.type}</span>
                <span>{part.totalQuestions} câu/đề</span>
              </div>

              <div className="stat-progress-bar">
                <div 
                  className="stat-progress-fill"
                  style={{ width: `${part.accuracy}%`, background: part.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Mini-Test Modal */}
      {activeTestModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div 
            className="card" 
            style={{ 
              maxWidth: '620px', 
              width: '100%', 
              background: 'var(--bg-surface)', 
              boxShadow: 'var(--shadow-xl)',
              animation: 'slideUp 0.25s ease'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="var(--brand-primary)" />
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{activeTestModal}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {testStarted && !testResult && (
                  <span className="badge badge-streak" style={{ fontSize: '0.85rem' }}>
                    ⏱️ {formatTimer(timeLeftSeconds)}
                  </span>
                )}
                <button onClick={handleCloseModal} style={{ color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Test Result View */}
            {testResult ? (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-success-bg)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Award size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
                  Hoàn thành bài thi thử!
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Bạn trả lời đúng <strong>{testResult.correct} / {testResult.total} câu</strong>.
                </p>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '20px' }}>
                  {testResult.score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>điểm ước lượng</span>
                </div>
                <button className="btn-primary" onClick={handleCloseModal}>
                  Xác nhận & Cập nhật vào Tiến độ
                </button>
              </div>
            ) : testStarted ? (
              <div>
                {/* Question progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    Câu hỏi {currentQIndex + 1} / {MINI_QUESTIONS.length} ({MINI_QUESTIONS[currentQIndex].part})
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Đã trả lời: {Object.keys(userAnswers).length}/{MINI_QUESTIONS.length}
                  </span>
                </div>

                {/* Question sentence */}
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.5, background: 'var(--bg-surface-hover)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  {MINI_QUESTIONS[currentQIndex].question}
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {MINI_QUESTIONS[currentQIndex].options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(currentQIndex, optIdx)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                          background: isSelected ? 'var(--brand-primary-light)' : 'var(--bg-surface)',
                          color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                          fontWeight: isSelected ? 700 : 500,
                          textAlign: 'left',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                        {isSelected && <CheckCircle size={16} color="var(--brand-primary)" />}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation inside modal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    className="btn-secondary"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex(prev => prev - 1)}
                    style={{ opacity: currentQIndex === 0 ? 0.5 : 1 }}
                  >
                    Câu trước
                  </button>

                  {currentQIndex < MINI_QUESTIONS.length - 1 ? (
                    <button
                      className="btn-primary"
                      onClick={() => setCurrentQIndex(prev => prev + 1)}
                    >
                      Câu tiếp theo
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={handleSubmitTest}
                      style={{ background: 'var(--accent-success)' }}
                    >
                      Nộp bài & Chấm điểm
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                  Bài thi Full-Test 120 phút sẽ mô phỏng không gian phòng thi đầy đủ với 200 câu hỏi và phiếu làm bài Answer Sheet.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button className="btn-secondary" onClick={handleCloseModal}>
                    Đóng
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setActiveTestModal('Mini-Test TOEIC (20 Phút)');
                      handleStartTest();
                    }}
                  >
                    Làm bài Mini-Test 20 phút trước
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
