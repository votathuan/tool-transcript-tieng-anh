/**
 * Web Speech API Utility for ENGLISH MASTER AI
 * Native browser speech synthesis - Zero API key, zero latency, runs offline.
 */

export const isSpeechAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const speakText = (
  text: string, 
  lang: string = 'en-US', 
  rate: number = 0.95
): Promise<void> => {
  return new Promise((resolve) => {
    if (!isSpeechAvailable()) {
      console.warn('Web Speech API is not supported in this browser.');
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = lang;
    utterance.rate = rate; // Slightly slower for language learners
    utterance.pitch = 1.0;

    // Try to pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha')));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeech = (): void => {
  if (isSpeechAvailable()) {
    window.speechSynthesis.cancel();
  }
};
