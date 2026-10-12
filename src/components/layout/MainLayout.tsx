import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useNavigation } from '../../context/NavigationContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isSidebarCollapsed } = useNavigation();

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`main-content-area ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
        <Header />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
};
