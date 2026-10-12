import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockVocabList } from '../data/mockData';
import type { VocabWord } from '../data/mockData';

export interface UserStatsState {
  streakDays: number;
  wordsLearned: number;
  wordsTarget: number;
  todayMinutes: number;
  targetMinutes: number;
  targetToeic: number;
  currentToeic: number;
  totalReviews: number;
  testsCompleted: number;
  lastActiveDate: string; // YYYY-MM-DD
  weeklyActivity: { day: string; dayShort: string; minutes: number; accuracy: number; isToday?: boolean }[];
}

export interface UserSettingsState {
  targetToeic: number;
  dailyTargetMinutes: number;
  voiceAccent: 'en-US' | 'en-GB' | 'en-AU';
  autoPlayAudio: boolean;
  reminderTime: string;
  groqApiKey?: string;
  geminiApiKey?: string;
  customBackendUrl?: string;
}

export interface AppContextType {
  vocabList: VocabWord[];
  addWord: (wordData: { 
    word: string; 
    meaning: string; 
    ipa?: string; 
    type?: string; 
    topic?: string; 
    example?: string;
    category?: 'basic' | 'toeic' | 'ielts' | 'other';
  }) => boolean;
  addWordsBulk: (words: Array<{
    word: string;
    meaning: string;
    ipa?: string;
    type?: string;
    topic?: string;
    example?: string;
    category?: 'basic' | 'toeic' | 'ielts' | 'other';
  }>) => number;
  deleteWord: (id: string) => void;
  updateWordStatus: (id: string, status: 'new' | 'learning' | 'mastered') => void;
  rateFlashcard: (wordId: string, rating: 'forget' | 'hard' | 'good' | 'easy') => void;
  
  studyStats: UserStatsState;
  addStudyMinutes: (minutes: number) => void;
  recordTestCompletion: (score: number) => void;
  
  userSettings: UserSettingsState;
  updateUserSettings: (newSettings: Partial<UserSettingsState>) => void;

  searchFilter: string;
  setSearchFilter: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to get today's YYYY-MM-DD
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Vocabulary List with localStorage
  const [vocabList, setVocabList] = useState<VocabWord[]>(() => {
    try {
      const saved = localStorage.getItem('em_vocab');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load vocab from localStorage', e);
    }
    return mockVocabList;
  });

  // 2. User Settings with localStorage
  const [userSettings, setUserSettings] = useState<UserSettingsState>(() => {
    const envGroq = (import.meta as any).env?.VITE_GROQ_API_KEY || '';
    const envGemini = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    const envBackend = (import.meta as any).env?.VITE_BACKEND_URL || '';

    try {
      const saved = localStorage.getItem('em_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          groqApiKey: envGroq,
          geminiApiKey: envGemini,
          customBackendUrl: envBackend,
          ...parsed,
        };
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    return {
      targetToeic: 750,
      dailyTargetMinutes: 60,
      voiceAccent: 'en-US',
      autoPlayAudio: true,
      reminderTime: '20:30',
      groqApiKey: envGroq,
      geminiApiKey: envGemini,
      customBackendUrl: envBackend,
    };
  });

  // 3. User Statistics with localStorage
  const [studyStats, setStudyStats] = useState<UserStatsState>(() => {
    const today = getTodayDateString();
    try {
      const saved = localStorage.getItem('em_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if day changed
        if (parsed.lastActiveDate !== today) {
          // Check streak: if lastActiveDate was yesterday, increment or keep streak; otherwise keep streak
          return {
            ...parsed,
            todayMinutes: 0, // Reset today's study minutes on new day
            lastActiveDate: today,
          };
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load stats from localStorage', e);
    }

    return {
      streakDays: 7,
      wordsLearned: mockVocabList.length,
      wordsTarget: 600,
      todayMinutes: 45,
      targetMinutes: 60,
      targetToeic: 750,
      currentToeic: 685,
      totalReviews: 42,
      testsCompleted: 3,
      lastActiveDate: today,
      weeklyActivity: [
        { day: 'Thứ 2', dayShort: 'T2', minutes: 50, accuracy: 88 },
        { day: 'Thứ 3', dayShort: 'T3', minutes: 65, accuracy: 92 },
        { day: 'Thứ 4', dayShort: 'T4', minutes: 40, accuracy: 85 },
        { day: 'Thứ 5', dayShort: 'T5', minutes: 70, accuracy: 95 },
        { day: 'Thứ 6', dayShort: 'T6', minutes: 55, accuracy: 89 },
        { day: 'Thứ 7', dayShort: 'T7', minutes: 45, accuracy: 90 },
        { day: 'Chủ nhật', dayShort: 'CN', minutes: 45, accuracy: 92, isToday: true },
      ],
    };
  });

  // 4. Global Search Filter
  const [searchFilter, setSearchFilter] = useState('');

  // Persist Vocab to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('em_vocab', JSON.stringify(vocabList));
      // Automatically keep wordsLearned in sync with actual list
      setStudyStats(prev => ({
        ...prev,
        wordsLearned: vocabList.length,
      }));
    } catch (e) {
      console.error('Failed to save vocab to localStorage', e);
    }
  }, [vocabList]);

  // Persist Settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('em_settings', JSON.stringify(userSettings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [userSettings]);

  // Persist Stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('em_stats', JSON.stringify(studyStats));
    } catch (e) {
      console.error('Failed to save stats to localStorage', e);
    }
  }, [studyStats]);

  // ACTION: Add Word
  const addWord = (wordData: { 
    word: string; 
    meaning: string; 
    ipa?: string; 
    type?: string; 
    topic?: string; 
    example?: string;
    category?: 'basic' | 'toeic' | 'ielts' | 'other';
  }): boolean => {
    const cleanWord = wordData.word.trim().toLowerCase();
    const existing = vocabList.find(w => w.word.toLowerCase() === cleanWord);

    if (existing) {
      return false;
    }

    const newWord: VocabWord = {
      id: `user_vocab_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      word: wordData.word.trim(),
      vietnamese: wordData.meaning,
      ipa: wordData.ipa || `/${cleanWord}/`,
      type: wordData.type || 'word',
      definitionEn: wordData.meaning,
      exampleEn: wordData.example || `Example using "${cleanWord}" in context.`,
      exampleVi: `Ví dụ sử dụng "${cleanWord}".`,
      topic: wordData.topic || (wordData.category === 'basic' ? 'Cơ bản' : wordData.category === 'ielts' ? 'IELTS' : 'TOEIC'),
      status: 'new',
      toeicLevel: '750+',
      category: wordData.category || 'other',
    };

    setVocabList(prev => [newWord, ...prev]);
    addStudyMinutes(2);
    return true;
  };

  // ACTION: Add Words in Bulk (from external list / paste / word pack)
  const addWordsBulk = (words: Array<{
    word: string;
    meaning: string;
    ipa?: string;
    type?: string;
    topic?: string;
    example?: string;
    category?: 'basic' | 'toeic' | 'ielts' | 'other';
  }>): number => {
    const existingSet = new Set(vocabList.map(w => w.word.toLowerCase()));
    const newWordsToAdd: VocabWord[] = [];

    words.forEach((item, idx) => {
      const clean = item.word.trim().toLowerCase();
      if (clean && !existingSet.has(clean)) {
        existingSet.add(clean);
        newWordsToAdd.push({
          id: `bulk_vocab_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
          word: item.word.trim(),
          vietnamese: item.meaning || item.word.trim(),
          ipa: item.ipa || `/${clean}/`,
          type: item.type || 'word',
          definitionEn: item.meaning,
          exampleEn: item.example || `Example using "${clean}".`,
          exampleVi: `Ví dụ sử dụng "${clean}".`,
          topic: item.topic || (item.category === 'basic' ? 'Từ vựng Cơ bản' : item.category === 'ielts' ? 'Từ vựng IELTS' : 'Từ vựng TOEIC'),
          status: 'new',
          toeicLevel: '750+',
          category: item.category || 'other',
        });
      }
    });

    if (newWordsToAdd.length > 0) {
      setVocabList(prev => [...newWordsToAdd, ...prev]);
      addStudyMinutes(Math.max(3, Math.round(newWordsToAdd.length * 0.8)));
    }

    return newWordsToAdd.length;
  };

  // ACTION: Delete Word
  const deleteWord = (id: string) => {
    setVocabList(prev => prev.filter(w => w.id !== id));
  };

  // ACTION: Update Word Status
  const updateWordStatus = (id: string, status: 'new' | 'learning' | 'mastered') => {
    setVocabList(prev => prev.map(w => (w.id === id ? { ...w, status } : w)));
  };

  // ACTION: Rate Flashcard (Spaced Repetition System)
  const rateFlashcard = (wordId: string, rating: 'forget' | 'hard' | 'good' | 'easy') => {
    let nextStatus: 'new' | 'learning' | 'mastered' = 'learning';
    if (rating === 'forget') nextStatus = 'new';
    else if (rating === 'easy') nextStatus = 'mastered';

    updateWordStatus(wordId, nextStatus);

    // Update study stats: increase total reviews and add 1 minute of active study time
    setStudyStats(prev => {
      const updatedMinutes = prev.todayMinutes + 1;
      const updatedReviews = prev.totalReviews + 1;

      // Update today's column in weeklyActivity
      const updatedWeekly = prev.weeklyActivity.map(day => 
        day.isToday ? { ...day, minutes: updatedMinutes } : day
      );

      return {
        ...prev,
        todayMinutes: updatedMinutes,
        totalReviews: updatedReviews,
        weeklyActivity: updatedWeekly,
      };
    });
  };

  // ACTION: Add Study Minutes
  const addStudyMinutes = (minutes: number) => {
    setStudyStats(prev => {
      const updatedMinutes = prev.todayMinutes + minutes;
      const updatedWeekly = prev.weeklyActivity.map(day => 
        day.isToday ? { ...day, minutes: updatedMinutes } : day
      );
      return {
        ...prev,
        todayMinutes: updatedMinutes,
        weeklyActivity: updatedWeekly,
      };
    });
  };

  // ACTION: Record Test Completion
  const recordTestCompletion = (score: number) => {
    setStudyStats(prev => ({
      ...prev,
      testsCompleted: prev.testsCompleted + 1,
      todayMinutes: prev.todayMinutes + 15,
      currentToeic: Math.max(prev.currentToeic, Math.round(score)),
    }));
  };

  // ACTION: Update User Settings
  const updateUserSettings = (newSettings: Partial<UserSettingsState>) => {
    setUserSettings(prev => ({ ...prev, ...newSettings }));
    if (newSettings.targetToeic) {
      setStudyStats(prev => ({ ...prev, targetToeic: newSettings.targetToeic! }));
    }
    if (newSettings.dailyTargetMinutes) {
      setStudyStats(prev => ({ ...prev, targetMinutes: newSettings.dailyTargetMinutes! }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        vocabList,
        addWord,
        addWordsBulk,
        deleteWord,
        updateWordStatus,
        rateFlashcard,
        studyStats,
        addStudyMinutes,
        recordTestCompletion,
        userSettings,
        updateUserSettings,
        searchFilter,
        setSearchFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
