import React from 'react';
import { PageView } from './PageView';
import { ComponentView } from './ComponentView';
import { SettingsView } from './SettingsView';

interface MainContentProps {
  activeSection: string;
}

export const MainContent: React.FC<MainContentProps> = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'pages':
        return <PageView />;
      case 'components':
        return <ComponentView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <PageView />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-6">
        {renderContent()}
      </div>
    </main>
  );
};