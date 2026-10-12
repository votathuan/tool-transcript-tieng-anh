export interface ProcessedSentence {
  id: number;
  textEn: string;
  textVi?: string;
  timeStart: string;
  timeSeconds: number;
  words: string[];
}

/**
 * Splits raw English text into individual sentences accurately.
 */
export const splitIntoSentences = (rawText: string): ProcessedSentence[] => {
  if (!rawText || !rawText.trim()) return [];

  // Normalize spaces and linebreaks
  const cleaned = rawText.replace(/\r\n/g, '\n').trim();

  // Split by sentence terminators (. ? !) followed by space or newline, or double newlines
  const rawSentences = cleaned
    .split(/(?<=[.?!])\s+|\n{2,}/g)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  let accumulatedSeconds = 0;

  return rawSentences.map((sentence, index) => {
    // Estimate reading duration (approx 2.5 words per second)
    const words = sentence.split(/\s+/).filter(w => w.length > 0);
    const duration = Math.max(3, Math.round(words.length / 2.2));

    const minutes = Math.floor(accumulatedSeconds / 60);
    const seconds = accumulatedSeconds % 60;
    const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const item: ProcessedSentence = {
      id: index + 1,
      textEn: sentence,
      timeStart: timeFormatted,
      timeSeconds: accumulatedSeconds,
      words: words,
    };

    accumulatedSeconds += duration;
    return item;
  });
};

/**
 * Built-in English-Vietnamese Dictionary for Instant Word Lookup
 */
export const dictionaryDB: Record<string, { ipa: string; meaning: string; type: string; topic?: string }> = {
  // Business & TOEIC Core
  procurement: { ipa: '/prəˈkjʊəmənt/', meaning: 'sự thu mua, mua sắm vật tư', type: 'noun', topic: 'Contracts & Office' },
  specifications: { ipa: '/ˌspesɪfɪˈkeɪʃnz/', meaning: 'thông số kỹ thuật chi tiết', type: 'noun', topic: 'Technical & Production' },
  implementation: { ipa: '/ˌɪmplɪmenˈteɪʃn/', meaning: 'sự triển khai, thi hành dự án', type: 'noun', topic: 'Management & Strategy' },
  maintenance: { ipa: '/ˈmeɪntənəns/', meaning: 'sự bảo trì, bảo dưỡng định kỳ', type: 'noun', topic: 'Technical & Production' },
  discount: { ipa: '/ˈdɪskaʊnt/', meaning: 'mức chiết khấu, giảm giá', type: 'noun / verb', topic: 'Finance & Accounting' },
  licensing: { ipa: '/ˈlaɪsnsɪŋ/', meaning: 'cấp giấy phép bản quyền', type: 'noun', topic: 'Contracts & Office' },
  contract: { ipa: '/ˈkɒntrækt/', meaning: 'hợp đồng, thỏa ước giao kết', type: 'noun', topic: 'Contracts & Office' },
  proposal: { ipa: '/prəˈpəʊzl/', meaning: 'đề xuất, bản kế hoạch dự thảo', type: 'noun', topic: 'Management & Strategy' },
  reasonable: { ipa: '/ˈriːznəbl/', meaning: 'hợp lý, phải chăng', type: 'adj', topic: 'Contracts & Office' },
  comply: { ipa: '/kəmˈplaɪ/', meaning: 'tuân thủ luật lệ, quy chuẩn', type: 'verb', topic: 'Human Resources & Law' },
  reimburse: { ipa: '/ˌriːɪmˈbɜːs/', meaning: 'hoàn trả, bồi hoàn chi phí', type: 'verb', topic: 'Finance & Accounting' },
  feasible: { ipa: '/ˈfiːzəbl/', meaning: 'khả thi, có thể thực hiện được', type: 'adj', topic: 'Management & Strategy' },
  invoice: { ipa: '/ˈɪnvɔɪs/', meaning: 'hóa đơn thanh toán thương mại', type: 'noun', topic: 'Finance & Accounting' },
  unprecedented: { ipa: '/ʌnˈpresɪdentɪd/', meaning: 'chưa từng có tiền lệ, chưa từng thấy', type: 'adj', topic: 'Management & Strategy' },
  subsidize: { ipa: '/ˈsʌbsɪdaɪz/', meaning: 'trợ cấp kinh phí, bao cấp', type: 'verb', topic: 'Finance & Accounting' },
  delegate: { ipa: '/ˈdelɪɡeɪt/', meaning: 'ủy quyền, giao phó trách nhiệm', type: 'verb', topic: 'Management & Strategy' },
  incentive: { ipa: '/ɪnˈsentɪv/', meaning: 'sự khích lệ, chế độ đãi ngộ', type: 'noun', topic: 'Human Resources & Law' },
  negotiate: { ipa: '/nɪˈɡəʊʃieɪt/', meaning: 'đàm phán, thương lượng hợp đồng', type: 'verb', topic: 'Contracts & Office' },
  revenue: { ipa: '/ˈrevənjuː/', meaning: 'tổng doanh thu kinh doanh', type: 'noun', topic: 'Finance & Accounting' },
  quarter: { ipa: '/ˈkwɔːtə(r)//', meaning: 'quý trong năm tài chính (3 tháng)', type: 'noun', topic: 'Finance & Accounting' },
  strategy: { ipa: '/ˈstrætədʒi/', meaning: 'chiến lược kinh doanh dài hạn', type: 'noun', topic: 'Management & Strategy' },
  transforming: { ipa: '/trænsˈfɔːmɪŋ/', meaning: 'chuyển đổi, thay đổi toàn diện', type: 'verb', topic: 'Technology' },
  intelligence: { ipa: '/ɪnˈtelɪdʒəns/', meaning: 'trí thông minh, trí tuệ', type: 'noun', topic: 'Technology' },
  education: { ipa: '/ˌedʒuˈkeɪʃn/', meaning: 'giáo dục, đào tạo', type: 'noun', topic: 'General' },
  students: { ipa: '/ˈstjuːdnts/', meaning: 'học sinh, sinh viên', type: 'noun', topic: 'General' },
  target: { ipa: '/ˈtɑːɡɪt/', meaning: 'mục tiêu, đích đến cần đạt', type: 'noun / verb', topic: 'Management & Strategy' },
  achieve: { ipa: '/əˈtʃiːv/', meaning: 'đạt được, hoàn thành mục tiêu', type: 'verb', topic: 'General' },
  efficient: { ipa: '/ɪˈfɪʃnt/', meaning: 'hiệu quả, có năng suất cao', type: 'adj', topic: 'Management & Strategy' },
};

/**
 * Look up word info with fallback derivation
 */
export const lookupWordInfo = (rawWord: string) => {
  const clean = rawWord.toLowerCase().replace(/[^a-zA-Z]/g, '').trim();
  if (!clean) return null;

  // Check direct DB
  if (dictionaryDB[clean]) {
    return {
      word: clean,
      ...dictionaryDB[clean],
    };
  }

  // Check singular/stem variants (e.g. removing 's', 'ed', 'ing')
  const stemS = clean.endsWith('s') ? clean.slice(0, -1) : null;
  if (stemS && dictionaryDB[stemS]) {
    return {
      word: clean,
      ...dictionaryDB[stemS],
    };
  }

  const stemEd = clean.endsWith('ed') ? clean.slice(0, -2) : null;
  if (stemEd && dictionaryDB[stemEd]) {
    return {
      word: clean,
      ...dictionaryDB[stemEd],
    };
  }

  const stemIng = clean.endsWith('ing') ? clean.slice(0, -3) : null;
  if (stemIng && dictionaryDB[stemIng]) {
    return {
      word: clean,
      ...dictionaryDB[stemIng],
    };
  }

  // If not found, return null to let the caller handle it (e.g. fetch from API)
  return null;
};
