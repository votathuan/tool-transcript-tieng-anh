import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';

// Module Views
import { DashboardView } from './components/dashboard/DashboardView';
import { TranscriptView } from './components/modules/TranscriptView';
import { ListeningView } from './components/modules/ListeningView';
import { SpeakingView } from './components/modules/SpeakingView';
import { VocabularyView } from './components/modules/VocabularyView';
import { FlashcardView } from './components/modules/FlashcardView';
import { GrammarView } from './components/modules/GrammarView';
import { ToeicView } from './components/modules/ToeicView';
import { ProgressView } from './components/modules/ProgressView';
import { SettingsView } from './components/modules/SettingsView';

// CSS Design System & Components
import './styles/index.css';
import './styles/components.css';

const AppContent: React.FC = () => {
  const { activeTab } = useNavigation();

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'transcript':
        return <TranscriptView />;
      case 'listening':
        return <ListeningView />;
      case 'speaking':
        return <SpeakingView />;
      case 'vocabulary':
        return <VocabularyView />;
      case 'flashcard':
        return <FlashcardView />;
      case 'grammar':
        return <GrammarView />;
      case 'toeic':
        return <ToeicView />;
      case 'progress':
        return <ProgressView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <MainLayout>
      {renderActiveModule()}
    </MainLayout>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
};

export default App;
