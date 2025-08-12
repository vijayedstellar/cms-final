import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { useDashboard } from '../hooks/useDashboard';

export const Dashboard: React.FC = () => {
  const {
    activeSection,
    isSidebarCollapsed,
    setActiveSection,
    toggleSidebar
  } = useDashboard();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
};