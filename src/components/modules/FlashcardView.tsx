import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { speakText } from '../../utils/speech';
import { 
  Volume2, 
  RotateCcw, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Sparkles,
  Layers,
  XCircle,
  AlertCircle,
  ThumbsUp,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const FlashcardView: React.FC = () => {
  const { vocabList, rateFlashcard, userSettings, studyStats } = useApp();
  
  // Deck created directly from user's vocabulary list
  const [deck, setDeck] = useState(vocabList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionReviews, setSessionReviews] = useState(0);
  const [isCompletedRound, setIsCompletedRound] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sync deck when vocabList changes
  useEffect(() => {
    setDeck(vocabList);
    if (currentIndex >= vocabList.length) {
      setCurrentIndex(0);
    }
  }, [vocabList]);

  const currentWord = deck[currentIndex];

  const handleFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    // If auto-play audio is enabled in settings and turning back, pronounce
    if (nextFlipped && userSettings.autoPlayAudio && currentWord) {
      triggerSpeech(currentWord.word);
    }
  };

  const triggerSpeech = (text: string) => {
    setIsPlayingAudio(true);
    speakText(text, userSettings.voiceAccent, 0.95);
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  const handleRate = (rating: 'forget' | 'hard' | 'good' | 'easy') => {
    if (!currentWord) return;

    rateFlashcard(currentWord.id, rating);
    setSessionReviews(prev => prev + 1);
    setIsFlipped(false);

    setTimeout(() => {
      if (currentIndex < deck.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsCompletedRound(true);
      }
    }, 220);
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentWord) {
      triggerSpeech(currentWord.word);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : deck.length - 1));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev < deck.length - 1 ? prev + 1 : 0));
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompletedRound(false);
  };

  const handleShuffle = () => {
    setDeck([...deck].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompletedRound(false);
  };

  if (!currentWord || deck.length === 0) {
    return (
      <Card className="max-w-xl mx-auto my-10 p-10 text-center" style={{ maxWidth: '580px', margin: '40px auto', padding: '50px 30px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', marginBottom: '16px' }}>
          <Layers size={36} />
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>Chưa có thẻ Flashcard nào</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
          Hãy dán đoạn văn vào mục "Học qua Transcript" hoặc mở danh mục "Từ vựng" để lưu thêm từ mới vào bộ nhớ ngắt quãng SRS.
        </p>
        <Button variant="default" leftIcon={<BookOpen size={16} />} onClick={() => window.location.hash = '#transcript'}>
          Bắt đầu với bài học mẫu
        </Button>
      </Card>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Header with Taste-Design Clean Typography */}
      <div className="section-header" style={{ marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ display: 'inline-flex', padding: '6px', borderRadius: '8px', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
              <Layers size={20} />
            </span>
            <h1 className="section-title" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Flashcard Spaced Repetition (SRS)
            </h1>
          </div>
          <p className="section-subtitle" style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Hệ thống lặp lại ngắt quãng khoa học, tự động tính toán thời điểm vàng để não bộ ghi nhớ vĩnh viễn
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" size="sm" leftIcon={<Shuffle size={14} />} onClick={handleShuffle}>
            Xáo trộn thẻ
          </Button>
        </div>
      </div>

      {isCompletedRound ? (
        <Card style={{ maxWidth: '580px', margin: '30px auto', textAlign: 'center', padding: '44px 32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-success-bg)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Award size={34} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Hoàn thành phiên ôn tập
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '28px', lineHeight: 1.5 }}>
            Bạn đã hoàn tất <strong>{sessionReviews} lượt ôn tập</strong>. Trạng thái ghi nhớ và chu kỳ ngắt quãng đã được cập nhật chuẩn xác.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <Button variant="secondary" leftIcon={<RotateCcw size={16} />} onClick={handleRestart}>
              Ôn lại từ đầu
            </Button>
            <Button variant="default" leftIcon={<Shuffle size={16} />} onClick={handleShuffle}>
              Xáo trộn & Ôn tiếp
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flashcard-wrapper">
          {/* Top Progress bar and Stats */}
          <div style={{ width: '100%', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                Thẻ <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{currentIndex + 1}</strong> / {deck.length}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge variant="success" icon={<CheckCircle2 size={13} />}>
                  Phiên này: {sessionReviews}
                </Badge>
                <Badge variant="purple" icon={<Sparkles size={13} />}>
                  Tích lũy: {studyStats.totalReviews}
                </Badge>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${progressPercent}%`, 
                  height: '100%', 
                  background: 'var(--brand-primary)', 
                  transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
                }} 
              />
            </div>
          </div>

          {/* 3D Flip Card */}
          <div className="flashcard-perspective" onClick={handleFlip}>
            <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
              {/* FRONT FACE */}
              <div className="flashcard-face" style={{ border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Badge 
                    variant={currentWord.status === 'mastered' ? 'success' : currentWord.status === 'new' ? 'info' : 'warning'}
                  >
                    {currentWord.status === 'mastered' ? 'Đã thuộc' : currentWord.status === 'new' ? 'Từ mới' : 'Đang học'}
                  </Badge>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {currentWord.type}
                  </span>
                </div>

                <div className="flashcard-word" style={{ letterSpacing: '-0.025em' }}>
                  {currentWord.word}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <span className="flashcard-ipa" style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal', margin: 0 }}>
                    {currentWord.ipa}
                  </span>
                  <button 
                    className="ui-button ui-button--icon ui-button--subtle" 
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                    onClick={handlePlayAudio}
                    title="Nghe phát âm chuẩn"
                  >
                    <Volume2 size={16} className={isPlayingAudio ? 'animate-pulse' : ''} />
                  </button>
                </div>

                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RotateCcw size={14} />
                  <span>Chạm hoặc nhấp để lật mặt sau</span>
                </div>
              </div>

              {/* BACK FACE */}
              <div className="flashcard-face flashcard-back" style={{ border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                <Badge variant="default" style={{ marginBottom: '14px' }}>
                  ĐỊNH NGHĨA & NGỮ CẢNH
                </Badge>

                <div className="flashcard-meaning" style={{ letterSpacing: '-0.015em', lineHeight: 1.3 }}>
                  {currentWord.vietnamese}
                </div>

                {/* Example */}
                {currentWord.exampleEn && (
                  <div className="flashcard-example" style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', background: 'var(--bg-surface)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      "{currentWord.exampleEn}"
                    </div>
                    {currentWord.exampleVi && (
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        {currentWord.exampleVi}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'auto', fontWeight: 500 }}>
                  Đánh giá độ nhớ bên dưới để hệ thống lập lịch ôn tập
                </div>
              </div>
            </div>
          </div>

          {/* Rating or Navigation buttons */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {isFlipped ? (
              <div className="flashcard-ratings">
                <button className="btn-rating btn-rating-forget" onClick={() => handleRate('forget')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <XCircle size={15} />
                    <span>Quên</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 500 }}>Ôn lại trong 1 ngày</span>
                </button>

                <button className="btn-rating btn-rating-hard" onClick={() => handleRate('hard')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertCircle size={15} />
                    <span>Khó</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 500 }}>Ôn sau 3 ngày</span>
                </button>

                <button className="btn-rating btn-rating-good" onClick={() => handleRate('good')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ThumbsUp size={15} />
                    <span>Nhớ</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 500 }}>Ôn sau 7 ngày</span>
                </button>

                <button className="btn-rating btn-rating-easy" onClick={() => handleRate('easy')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={15} />
                    <span>Dễ</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 500 }}>14 ngày (Đã thuộc)</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="secondary" leftIcon={<ChevronLeft size={16} />} onClick={handlePrev}>
                  Thẻ trước
                </Button>

                <Button variant="default" leftIcon={<RotateCcw size={16} />} onClick={handleFlip}>
                  Lật mặt sau
                </Button>

                <Button variant="secondary" rightIcon={<ChevronRight size={16} />} onClick={handleNext}>
                  Thẻ kế tiếp
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
