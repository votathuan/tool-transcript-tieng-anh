import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { speakText } from '../../utils/speech';
import { Play, RotateCcw, Check, Sparkles, HelpCircle, Volume2 } from 'lucide-react';

interface DictationExercise {
  id: string;
  part: string;
  title: string;
  targetSentence: string;
  viHint: string;
  audioTime: string;
}

const exercises: DictationExercise[] = [
  {
    id: 'd-1',
    part: 'TOEIC Part 1',
    title: 'Mô tả hình ảnh: Phòng họp hội thảo',
    targetSentence: 'Some attendees are taking notes during the annual financial presentation.',
    viHint: 'Một số người tham dự đang ghi chép trong suốt buổi thuyết trình tài chính thường niên.',
    audioTime: '00:06',
  },
  {
    id: 'd-2',
    part: 'TOEIC Part 2',
    title: 'Hỏi đáp phản xạ: Lịch trình công tác',
    targetSentence: 'When will the marketing team arrive at the conference center?',
    viHint: 'Khi nào đội ngũ tiếp thị sẽ đến trung tâm hội nghị?',
    audioTime: '00:04',
  },
  {
    id: 'd-3',
    part: 'TOEIC Part 3',
    title: 'Hội thoại ngắn: Ký duyệt ngân sách',
    targetSentence: 'The procurement director has already approved the software contract.',
    viHint: 'Giám đốc thu mua đã phê duyệt hợp đồng phần mềm rồi.',
    audioTime: '00:05',
  },
];

export const ListeningView: React.FC = () => {
  const { userSettings, addStudyMinutes } = useApp();
  
  const [selectedEx, setSelectedEx] = useState<DictationExercise>(exercises[0]);
  const [userInput, setUserInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Real Web Speech API playback
  const handlePlayAudio = async () => {
    setIsPlayingAudio(true);
    await speakText(selectedEx.targetSentence, userSettings.voiceAccent, speed);
    setIsPlayingAudio(false);
  };

  const handleCheck = () => {
    setIsChecked(true);
    addStudyMinutes(2); // Awards 2 mins study time
  };

  const handleReset = () => {
    setUserInput('');
    setIsChecked(false);
    setShowHint(false);
  };

  // Word-by-word diffing
  const targetWords = selectedEx.targetSentence.toLowerCase().replace(/[^a-zA-Z\s]/g, '').split(' ');
  const userWords = userInput.toLowerCase().replace(/[^a-zA-Z\s]/g, '').split(' ');
  
  const correctCount = userWords.filter(w => targetWords.includes(w) && w.length > 0).length;
  const matchPercent = Math.min(100, Math.round((correctCount / targetWords.length) * 100));

  return (
    <div>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.5rem' }}>
            🎧 Luyện nghe & Chép chính tả (Dictation)
          </h1>
          <p className="section-subtitle">
            Phương pháp luyện nghe đỉnh cao giúp não bộ nhận diện âm thanh bản xứ và triệt tiêu bẫy nghe TOEIC
          </p>
        </div>
      </div>

      <div className="module-two-col-layout">
        {/* Left Exercise List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card" style={{ padding: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Chọn bài luyện tập
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {exercises.map(ex => (
                <div
                  key={ex.id}
                  className={`transcript-item-card ${selectedEx.id === ex.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedEx(ex);
                    handleReset();
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{ex.part}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ex.audioTime}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{ex.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '18px', background: 'var(--bg-surface-elevated)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
              <Sparkles size={16} />
              Quy tắc chép chính tả 3 bước
            </div>
            <ol style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.5 }}>
              <li>Nghe lần 1 bắt ý tổng quan.</li>
              <li>Nghe lần 2-3 gõ lại từng từ.</li>
              <li>Nhấn kiểm tra để AI so khớp lỗi phát âm và nối âm.</li>
            </ol>
          </div>
        </div>

        {/* Right Main Dictation Console */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Audio player card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-hover)', padding: '16px 20px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button 
                className="player-btn-main"
                style={{ width: '46px', height: '46px' }}
                onClick={handlePlayAudio}
                title="Nghe câu mẫu"
              >
                {isPlayingAudio ? <Volume2 size={22} fill="#fff" /> : <Play size={20} fill="#fff" style={{ marginLeft: '2px' }} />}
              </button>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {isPlayingAudio ? '🔊 Đang đọc câu mẫu...' : 'Nhấn nút phát để nghe phát âm thật'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Gợi ý nghĩa: {selectedEx.viHint}
                </div>
              </div>
            </div>

            {/* Speed selection */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0.8, 1.0, 1.2].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="btn-secondary"
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    background: speed === s ? 'var(--brand-primary-light)' : undefined,
                    color: speed === s ? 'var(--brand-primary)' : undefined,
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Typing Area */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Gõ chính xác những gì bạn nghe được:
            </label>
            <textarea
              className="dictation-input-box"
              placeholder="Nhập câu tiếng Anh tại đây..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isChecked}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-primary" 
                onClick={handleCheck}
                disabled={userInput.trim().length === 0}
                style={{ opacity: userInput.trim().length === 0 ? 0.6 : 1 }}
              >
                <Check size={16} />
                <span>Kiểm tra đáp án</span>
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                <RotateCcw size={16} />
                <span>Làm lại</span>
              </button>
            </div>

            <button 
              className="btn-secondary"
              onClick={() => setShowHint(!showHint)}
              style={{ fontSize: '0.82rem' }}
            >
              <HelpCircle size={15} />
              <span>{showHint ? 'Ẩn đáp án gốc' : 'Xem đáp án mẫu'}</span>
            </button>
          </div>

          {/* Feedback & Result Comparison */}
          {isChecked && (
            <div 
              style={{ 
                padding: '18px', 
                borderRadius: 'var(--radius-md)', 
                background: matchPercent >= 80 ? 'var(--accent-success-bg)' : 'var(--accent-warning-bg)',
                border: `1px solid ${matchPercent >= 80 ? 'var(--accent-success-border)' : 'var(--accent-warning-border)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: matchPercent >= 80 ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                  {matchPercent >= 80 ? '🎉 Xuất sắc! Bạn nghe rất chuẩn.' : '⚠️ Cần cải thiện một vài từ.'}
                </span>
                <span className="badge badge-primary">Chính xác: {matchPercent}%</span>
              </div>

              <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                <strong>Câu gốc:</strong> {selectedEx.targetSentence}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong>Câu của bạn:</strong> {userInput}
              </div>
            </div>
          )}

          {showHint && !isChecked && (
            <div style={{ padding: '14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Đáp án gợi ý:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--brand-primary)' }}>
                {selectedEx.targetSentence}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
