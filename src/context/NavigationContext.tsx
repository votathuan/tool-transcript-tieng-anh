import React, { createContext, useContext, useState } from 'react';

export type NavTab = 
  | 'dashboard'
  | 'transcript'
  | 'listening'
  | 'speaking'
  | 'vocabulary'
  | 'flashcard'
  | 'grammar'
  | 'toeic'
  | 'progress'
  | 'settings';

interface NavigationContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileDrawerOpen: boolean;
  toggleMobileDrawer: () => void;
  closeMobileDrawer: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<NavTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const setActiveTab = (tab: NavTab) => {
    setActiveTabState(tab);
    setIsMobileDrawerOpen(false); // Close mobile drawer on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(prev => !prev);
  };

  const closeMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  return (
    <NavigationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileDrawerOpen,
        toggleMobileDrawer,
        closeMobileDrawer,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
