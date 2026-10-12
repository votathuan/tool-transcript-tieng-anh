/**
 * Service xử lý bóc tách âm thanh (Audio Transcription) & Dịch nghĩa song ngữ.
 * Hỗ trợ 3 chế độ:
 * 1. Cloud AI (Groq Whisper Large V3 Turbo) - Tốc độ cao, miễn phí, chạy 24/7 trực tiếp trên trình duyệt.
 * 2. Cloud AI (Google Gemini Audio) - Hỗ trợ Gemini API key.
 * 3. Local Whisper Server (Python Flask - http://127.0.0.1:5001) khi chạy offline trên máy tính.
 */

export interface TranscribeLine {
  id: number;
  timeStart: string;
  timeEnd: string;
  timeSeconds: number;
  textEn: string;
  textVi: string;
  words: string[];
}

export interface TranscribeResult {
  success: boolean;
  fileName: string;
  duration: string;
  durationSeconds: number;
  paragraphEn: string;
  paragraphVi: string;
  lines: TranscribeLine[];
  source: 'groq' | 'gemini' | 'local' | 'mock';
  error?: string;
}

export interface TranscribeOptions {
  groqApiKey?: string;
  geminiApiKey?: string;
  customBackendUrl?: string;
  onProgress?: (message: string) => void;
}

// Chuyển đổi giây thành mm:ss
export const formatTimestamp = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// Dịch tiếng Anh sang tiếng Việt sử dụng Google Translate Web API miễn phí
export const translateEnToVi = async (text: string): Promise<string> => {
  if (!text || !text.trim()) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text.trim())}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((item: any) => item[0] || '').join('');
    }
    return text;
  } catch (err) {
    console.warn('Translate error:', err);
    return text;
  }
};

// Dịch theo nhóm dòng để tối ưu tốc độ
export const batchTranslateLines = async (
  texts: string[],
  onProgress?: (msg: string) => void
): Promise<string[]> => {
  const results: string[] = [];
  const chunkSize = 5;

  for (let i = 0; i < texts.length; i += chunkSize) {
    const chunk = texts.slice(i, i + chunkSize);
    if (onProgress) {
      onProgress(`🌐 Đang dịch nghĩa song ngữ (${Math.min(i + chunkSize, texts.length)}/${texts.length} câu)...`);
    }

    const chunkPromises = chunk.map(t => translateEnToVi(t));
    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
  }

  return results;
};

/**
 * Bóc tách âm thanh qua Groq Whisper API (whisper-large-v3-turbo)
 * Nhanh nhất thế giới, hỗ trợ timestamps từng câu, hoàn toàn miễn phí
 */
export const transcribeWithGroq = async (
  file: File,
  apiKey: string,
  onProgress?: (msg: string) => void
): Promise<TranscribeResult> => {
  onProgress?.('🚀 Đang gửi âm thanh tới Groq Cloud AI Engine...');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('response_format', 'verbose_json');
  formData.append('temperature', '0');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson?.error?.message || `Groq API lỗi HTTP ${res.status}`);
  }

  onProgress?.('⚡ Groq Whisper đã bóc tách xong! Đang phân tích timestamp...');
  const data = await res.json();

  const rawSegments: any[] = data.segments || [];
  const paragraphEn = (data.text || '').trim();
  const maxDuration = Math.round(data.duration || (rawSegments.length > 0 ? rawSegments[rawSegments.length - 1].end : 60));

  // Chuẩn bị danh sách câu tiếng Anh
  const englishTexts = rawSegments.map(s => (s.text || '').trim());
  const vietnameseTexts = await batchTranslateLines(englishTexts, onProgress);

  onProgress?.('✨ Đang hoàn thiện bản dịch song ngữ...');
  const paragraphVi = await translateEnToVi(paragraphEn);

  const lines: TranscribeLine[] = rawSegments.map((seg, idx) => {
    const textEn = (seg.text || '').trim();
    const textVi = vietnameseTexts[idx] || textEn;
    const startSec = Math.round(seg.start || 0);
    const endSec = Math.round(seg.end || startSec + 3);

    return {
      id: idx + 1,
      timeStart: formatTimestamp(startSec),
      timeEnd: formatTimestamp(endSec),
      timeSeconds: startSec,
      textEn,
      textVi,
      words: textEn.split(/\s+/).filter(Boolean),
    };
  });

  return {
    success: true,
    fileName: file.name,
    duration: formatTimestamp(maxDuration),
    durationSeconds: maxDuration,
    paragraphEn,
    paragraphVi,
    lines,
    source: 'groq',
  };
};

/**
 * Bóc tách qua Local Server Python (127.0.0.1:5001) nếu người dùng đang chạy máy cục bộ
 */
export const transcribeWithLocalServer = async (
  file: File,
  backendUrl = 'http://127.0.0.1:5001',
  onProgress?: (msg: string) => void
): Promise<TranscribeResult> => {
  onProgress?.('🖥️ Đang gửi file tới Local Whisper Server...');
  const formData = new FormData();
  formData.append('audio', file);

  const res = await fetch(`${backendUrl}/api/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Local server phản hồi lỗi HTTP ${res.status}`);
  }

  const data = await res.json();
  if (!data.success || !data.lines) {
    throw new Error(data.error || 'Dữ liệu trả về không hợp lệ');
  }

  return {
    ...data,
    source: 'local',
  };
};

/**
 * Hàm điều phối chính (Orchestrator)
 * Tự động chọn kênh bóc tách tối ưu nhất:
 * 1. Nếu có Groq API Key -> Dùng Groq Cloud AI (Online 24/7, cực nhanh)
 * 2. Nếu đang chạy cục bộ (có Local Server) -> Dùng Local Server
 * 3. Nếu không có cả hai -> Ném lỗi kèm yêu cầu cấu hình API Key
 */
export const transcribeAudio = async (
  file: File,
  options: TranscribeOptions
): Promise<TranscribeResult> => {
  const { groqApiKey, customBackendUrl, onProgress } = options;

  // 1. Ưu tiên Cloud Groq API nếu có key
  if (groqApiKey && groqApiKey.trim()) {
    try {
      return await transcribeWithGroq(file, groqApiKey, onProgress);
    } catch (err: any) {
      console.warn('Groq transcription failed, trying local fallback:', err);
      // Nếu Groq lỗi và có local server thì thử tiếp local
    }
  }

  // 2. Thử Local Server (nếu đang dev trên máy hoặc có customBackendUrl)
  try {
    const targetUrl = customBackendUrl || 'http://127.0.0.1:5001';
    return await transcribeWithLocalServer(file, targetUrl, onProgress);
  } catch (localErr) {
    console.warn('Local server not reachable:', localErr);
  }

  // 3. Nếu vẫn không được nhưng chưa nhập Groq API key:
  if (!groqApiKey || !groqApiKey.trim()) {
    throw new Error('MISSING_API_KEY');
  }

  throw new Error('Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại kết nối mạng hoặc API Key.');
};
