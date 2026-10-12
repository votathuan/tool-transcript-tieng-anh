import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Target, Volume2, Bell, Save, Check, Cloud, Key, ExternalLink } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { userSettings, updateUserSettings } = useApp();

  const [targetToeic, setTargetToeic] = useState<number>(userSettings.targetToeic);
  const [dailyTarget, setDailyTarget] = useState<number>(userSettings.dailyTargetMinutes);
  const [voiceAccent, setVoiceAccent] = useState<'en-US' | 'en-GB' | 'en-AU'>(userSettings.voiceAccent);
  const [autoPlayAudio, setAutoPlayAudio] = useState(userSettings.autoPlayAudio);
  const [reminderTime, setReminderTime] = useState(userSettings.reminderTime);
  const [groqApiKey, setGroqApiKey] = useState(userSettings.groqApiKey || '');
  const [customBackendUrl, setCustomBackendUrl] = useState(userSettings.customBackendUrl || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateUserSettings({
      targetToeic,
      dailyTargetMinutes: dailyTarget,
      voiceAccent,
      autoPlayAudio,
      reminderTime,
      groqApiKey: groqApiKey.trim(),
      customBackendUrl: customBackendUrl.trim(),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.5rem' }}>
            ⚙️ Cài đặt hệ thống & Lộ trình học tập
          </h1>
          <p className="section-subtitle">
            Tùy chỉnh giao diện Dark/Light mode, mục tiêu điểm thi TOEIC và giọng đọc AI thông minh
          </p>
        </div>

        <button className="btn-primary" onClick={handleSave}>
          {isSaved ? <Check size={16} /> : <Save size={16} />}
          <span>{isSaved ? 'Đã lưu vào bộ nhớ!' : 'Lưu thay đổi'}</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 1. Theme Configuration */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sun size={18} color="var(--brand-primary)" />
            Giao diện hiển thị (Theme Mode)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div
              onClick={() => setTheme('light')}
              style={{
                border: `2px solid ${theme === 'light' ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                background: '#ffffff',
                color: '#0f172a',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sun size={20} color="#4f46e5" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Chế độ Sáng (Light Mode)</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Sáng rõ, tối ưu cho học ban ngày</div>
              </div>
            </div>

            <div
              onClick={() => setTheme('dark')}
              style={{
                border: `2px solid ${theme === 'dark' ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                background: '#0e1422',
                color: '#ffffff',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Moon size={20} color="#818cf8" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Chế độ Tối (Dark Mode)</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Dịu mắt, tiết kiệm pin, thích hợp học đêm</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Target Goal Configuration */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="var(--brand-primary)" />
            Mục tiêu học tập & Cam kết
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Mục tiêu điểm thi TOEIC mong muốn:
              </label>
              <select
                value={targetToeic}
                onChange={(e) => setTargetToeic(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value={550}>TOEIC 550+ (Cơ bản cho tốt nghiệp đại học)</option>
                <option value={650}>TOEIC 650+ (Khá - Phổ biến doanh nghiệp)</option>
                <option value={750}>TOEIC 750+ (Mục tiêu phổ biến)</option>
                <option value={850}>TOEIC 850+ (Cao cấp - Làm việc tập đoàn đa quốc gia)</option>
                <option value={990}>TOEIC 990 (Tối đa tuyệt đối)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Thời gian học mục tiêu hàng ngày:
              </label>
              <select
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value={20}>20 phút / ngày (Nhẹ nhàng)</option>
                <option value={40}>40 phút / ngày (Vừa sức)</option>
                <option value={60}>60 phút / ngày (Đề xuất tiêu chuẩn)</option>
                <option value={90}>90 phút / ngày (Tăng tốc thi gấp)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. AI Voice & Sound Configuration */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={18} color="var(--brand-primary)" />
            Tùy chọn giọng đọc Web Speech & Âm thanh
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Chất giọng AI mặc định khi phát âm & luyện nghe:
              </label>
              <select
                value={voiceAccent}
                onChange={(e) => setVoiceAccent(e.target.value as 'en-US' | 'en-GB' | 'en-AU')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="en-US">Anh - Mỹ (US Accent - Chuẩn 70% đề thi TOEIC)</option>
                <option value="en-GB">Anh - Anh (British Accent - Oxford/Cambridge)</option>
                <option value="en-AU">Anh - Úc (Australian Accent - Part 3 & 4)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Tự động phát âm thanh khi lật thẻ Flashcard</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Giúp ghi nhớ phản xạ âm thanh tốt hơn</div>
              </div>
              <input 
                type="checkbox" 
                checked={autoPlayAudio} 
                onChange={(e) => setAutoPlayAudio(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* 4. Notification Settings */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--brand-primary)" />
            Nhắc nhở học tập hàng ngày
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Giờ nhắc nhở duy trì chuỗi Streak 🔥</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hệ thống sẽ gửi thông báo để bạn không bị đứt chuỗi học</div>
            </div>
            <input 
              type="time" 
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontWeight: 700,
              }}
            />
          </div>
        </div>

        {/* 5. Cloud AI Whisper Configuration (Online 24/7) */}
        <div className="card" style={{ border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Cloud size={18} color="var(--brand-primary)" />
              Cấu hình AI Bóc tách âm thanh (Online 24/7)
            </h2>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              background: groqApiKey.trim() ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
              color: groqApiKey.trim() ? '#16a34a' : '#ca8a04',
            }}>
              {groqApiKey.trim() ? '🟢 Cloud AI Sẵn sàng' : '🟡 Dùng Local Server / Chờ Key'}
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
            Khi đưa web lên Vercel/Internet, tích hợp <strong>Groq Cloud AI (Whisper Large V3)</strong> sẽ giúp bạn bóc tách file âm thanh bất kỳ chỉ trong <strong>1 - 2 giây</strong> hoàn toàn miễn phí mà không cần bật máy tính ở nhà.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={15} color="var(--brand-primary)" />
                  Groq API Key (Khuyên dùng - 100% Miễn phí)
                </label>
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Lấy key miễn phí tại đây <ExternalLink size={12} />
                </a>
              </div>
              <input 
                type="password"
                placeholder="gsk_..."
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                💡 Key được lưu an toàn trên trình duyệt của bạn (Local Storage) và không bị chia sẻ ra ngoài.
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                URL Server Tùy chọn (Tùy chọn nâng cao)
              </label>
              <input 
                type="text"
                placeholder="http://127.0.0.1:5001 hoặc https://your-server.com"
                value={customBackendUrl}
                onChange={(e) => setCustomBackendUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Mặc định khi chạy trên máy tính sẽ trỏ về: <code>http://127.0.0.1:5001</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
