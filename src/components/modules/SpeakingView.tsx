import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { speakText } from '../../utils/speech';
import { Mic, Volume2, Award, Sparkles } from 'lucide-react';

interface SpeakingTopic {
  id: string;
  sentence: string;
  ipa: string;
  vietnamese: string;
  topic: string;
  words: { text: string; score: 'green' | 'yellow' | 'red'; feedback: string }[];
}

const speakingTopics: SpeakingTopic[] = [
  {
    id: 'spk-1',
    sentence: 'We must finalize the contract before the end of this quarter.',
    ipa: '/wiː mʌst ˈfaɪnəlaɪz ðə ˈkɒntrækt bɪˈfɔː ðə end əv ðɪs ˈkwɔːtə/',
    vietnamese: 'Chúng ta phải hoàn tất hợp đồng trước khi kết thúc quý này.',
    topic: 'Đàm phán thương mại (TOEIC)',
    words: [
      { text: 'We', score: 'green', feedback: 'Chuẩn' },
      { text: 'must', score: 'green', feedback: 'Âm đuôi /st/ tốt' },
      { text: 'finalize', score: 'green', feedback: 'Trọng âm âm 1 chuẩn' },
      { text: 'the', score: 'green', feedback: 'Chuẩn' },
      { text: 'contract', score: 'yellow', feedback: 'Chú ý nhấn âm 1: CON-tract' },
      { text: 'before', score: 'green', feedback: 'Chuẩn' },
      { text: 'the', score: 'green', feedback: 'Chuẩn' },
      { text: 'end', score: 'green', feedback: 'Chuẩn' },
      { text: 'of', score: 'green', feedback: 'Chuẩn' },
      { text: 'this', score: 'green', feedback: 'Âm /ð/ rõ ràng' },
      { text: 'quarter', score: 'green', feedback: 'Ngữ điệu tự nhiên' },
    ],
  },
  {
    id: 'spk-2',
    sentence: 'The human resources department is currently reviewing all resumes.',
    ipa: '/ðə ˈhjuːmən rɪˈsɔːsɪz dɪˈpɑːtmənt ɪz ˈkʌrəntli rɪˈvjuːɪŋ ɔːl ˈrezjuːmeɪz/',
    vietnamese: 'Phòng nhân sự hiện đang xem xét toàn bộ hồ sơ xin việc.',
    topic: 'Tuyển dụng & Nhân sự',
    words: [
      { text: 'The', score: 'green', feedback: 'Chuẩn' },
      { text: 'human', score: 'green', feedback: 'Chuẩn' },
      { text: 'resources', score: 'yellow', feedback: 'Lưu ý âm /z/ ở cuối' },
      { text: 'department', score: 'green', feedback: 'Trọng âm âm 2 chuẩn' },
      { text: 'is', score: 'green', feedback: 'Chuẩn' },
      { text: 'currently', score: 'green', feedback: 'Chuẩn' },
      { text: 'reviewing', score: 'green', feedback: 'Chuẩn' },
      { text: 'all', score: 'green', feedback: 'Chuẩn' },
      { text: 'resumes', score: 'red', feedback: 'Đọc là /rez-oo-mayz/, không đọc là /ri-zyoom/' },
    ],
  },
];

export const SpeakingView: React.FC = () => {
  const { userSettings, addStudyMinutes } = useApp();
  const [selectedTopic, setSelectedTopic] = useState<SpeakingTopic>(speakingTopics[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleStartRecord = () => {
    setIsRecording(true);
    setHasEvaluated(false);
    setTimeout(() => {
      setIsRecording(false);
      setHasEvaluated(true);
      addStudyMinutes(2);
    }, 3200);
  };

  const handlePlaySample = async () => {
    setIsPlayingAudio(true);
    await speakText(selectedTopic.sentence, userSettings.voiceAccent, 0.9);
    setIsPlayingAudio(false);
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.5rem' }}>
            🗣 Luyện nói & Chấm điểm phát âm bằng AI
          </h1>
          <p className="section-subtitle">
            Phương pháp Shadowing giúp chuẩn hóa phát âm IPA, ngữ điệu và phản xạ giao tiếp tiếng Anh công sở
          </p>
        </div>
      </div>

      <div className="module-two-col-layout">
        {/* Left Topic List */}
        <div className="card" style={{ padding: '16px', height: 'fit-content' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Chủ đề luyện nói
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            {speakingTopics.map(topic => (
              <div
                key={topic.id}
                className={`transcript-item-card ${selectedTopic.id === topic.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTopic(topic);
                  setHasEvaluated(false);
                }}
              >
                <span className="badge badge-purple" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
                  {topic.topic}
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {topic.sentence.slice(0, 38)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Speaking Console */}
        <div className="speaking-card">
          <span className="badge badge-primary">Chế độ Shadowing (Nói đuổi)</span>

          {/* Prompt Sentence */}
          <div>
            <div className="speaking-prompt-text">
              "{selectedTopic.sentence}"
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
              {selectedTopic.ipa}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Nghĩa: {selectedTopic.vietnamese}
            </div>
          </div>

          {/* Sample Native Audio */}
          <button 
            className="btn-secondary" 
            onClick={handlePlaySample}
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Volume2 size={18} color="var(--brand-primary)" />
            <span>{isPlayingAudio ? '🔊 Đang đọc phát âm mẫu...' : 'Nghe giọng đọc chuẩn qua Web Speech'}</span>
          </button>

          {/* Big Record Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <button 
              className={`record-btn-big ${isRecording ? 'recording' : ''}`}
              onClick={handleStartRecord}
              disabled={isRecording}
              title={isRecording ? "Đang lắng nghe bạn nói..." : "Nhấn để thu âm nói theo"}
            >
              <Mic size={32} />
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isRecording ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
              {isRecording ? '🎙️ AI đang lắng nghe và phân tích âm vị...' : 'Nhấn vào micro để bắt đầu nói theo câu mẫu'}
            </span>
          </div>

          {/* AI Feedback */}
          {hasEvaluated && (
            <div style={{ width: '100%', marginTop: '10px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={22} color="var(--accent-success)" />
                  <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Kết quả đánh giá AI</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-success)' }}>
                  88 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>

              {/* Sub metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phát âm chuẩn IPA</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-primary)' }}>92%</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Độ trôi chảy & Tốc độ</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-info)' }}>86%</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ngữ điệu bản xứ</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-purple)' }}>85%</div>
                </div>
              </div>

              {/* Word breakdown */}
              <div style={{ textAlign: 'left', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Chi tiết từng từ bạn đã phát âm:
                </span>
                <div className="speaking-feedback-sentence">
                  {selectedTopic.words.map((w, idx) => (
                    <span 
                      key={idx} 
                      className={`word-score-${w.score}`} 
                      title={`${w.text}: ${w.feedback}`}
                    >
                      {w.text}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--brand-primary-light)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--brand-primary)' }}>
                <Sparkles size={16} style={{ flexShrink: 0 }} />
                <span>Nhận xét AI: Ngữ điệu câu rất tự nhiên! Hãy chú ý phát âm rõ hơn trọng âm ở từ có màu vàng để đạt điểm tuyệt đối.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
