import { lookupWordInfo } from './sentenceSplitter';

export interface ParsedVocabItem {
  word: string;
  ipa: string;
  meaning: string;
}

/**
 * Parses raw text copied directly from web pages, blogs, or documents.
 * Supports formats like:
 * • Accountant /ə'kaʊnt.ənt/: Kế toán
 * - Artist /'ɑː.tɪst/: Nghệ sĩ
 * 1. Doctor /'dɒk.tər/ - Bác sĩ
 * Lawyer: Luật sư
 * Nurse - Y tá
 */
export const parseWebVocabList = (rawText: string): ParsedVocabItem[] => {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const results: ParsedVocabItem[] = [];

  for (const line of lines) {
    // 1. Strip leading bullet markers: '•', '-', '*', '1.', '2)', tabs, spaces
    const cleanedLine = line.replace(/^[•\-\*\d+\.\)\s\t]+/, '').trim();
    if (!cleanedLine) continue;

    // 2. Complex Regex matching:
    // Group 1: English word (letters, spaces, apostrophes, hyphens)
    // Group 2/3: Optional IPA between slashes /.../ or brackets (...)
    // Separator: ':', '-', '=', '–', '—'
    // Group 4: Meaning
    const matchWithSeparator = cleanedLine.match(
      /^([a-zA-Z\s'-]+?)\s*(?:\/([^\/]+)\/|\(([^)]+)\))?\s*[:\-\=–—]\s*(.+)$/
    );

    if (matchWithSeparator) {
      const word = matchWithSeparator[1].trim();
      const rawIpa = matchWithSeparator[2] || matchWithSeparator[3];
      const meaning = matchWithSeparator[4].trim();

      const ipa = rawIpa ? `/${rawIpa.trim()}/` : (lookupWordInfo(word)?.ipa || `/${word.toLowerCase()}/`);

      if (word && meaning) {
        results.push({ word, ipa, meaning });
        continue;
      }
    }

    // 3. Fallback: match word and IPA even if no colon/hyphen separator, e.g. "Accountant /ə'kaʊnt.ənt/ Kế toán"
    const matchSpaceIpa = cleanedLine.match(
      /^([a-zA-Z\s'-]+?)\s+\/([^\/]+)\/\s+(.+)$/
    );

    if (matchSpaceIpa) {
      const word = matchSpaceIpa[1].trim();
      const ipa = `/${matchSpaceIpa[2].trim()}/`;
      const meaning = matchSpaceIpa[3].trim();
      if (word && meaning) {
        results.push({ word, ipa, meaning });
        continue;
      }
    }

    // 4. Fallback: simple comma or tab separator
    if (cleanedLine.includes(',') || cleanedLine.includes('\t')) {
      const parts = cleanedLine.includes('\t') ? cleanedLine.split('\t') : cleanedLine.split(',');
      const word = parts[0].trim();
      const meaning = parts.slice(1).join(',').trim();
      if (word && meaning) {
        const local = lookupWordInfo(word);
        results.push({
          word,
          ipa: local?.ipa || `/${word.toLowerCase()}/`,
          meaning,
        });
        continue;
      }
    }

    // 5. If it's a standalone single word, derive from local DB
    if (/^[a-zA-Z\s'-]+$/.test(cleanedLine)) {
      const word = cleanedLine.trim();
      const local = lookupWordInfo(word);
      results.push({
        word,
        ipa: local?.ipa || `/${word.toLowerCase()}/`,
        meaning: local?.meaning || word,
      });
    }
  }

  return results;
};
