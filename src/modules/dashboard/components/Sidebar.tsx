import React from 'react';
import { FileText, Package, Settings, ChevronLeft } from 'lucide-react';
import { navigationItems, isActiveNavigation } from '../utils/navigation';
import { useAuth } from '../../../hooks/useAuth';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const iconMap = {
  FileText,
  Package,
  Settings
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const { user } = useAuth();

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <aside className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold">CMS Admin</h2>
              <p className="text-xs text-gray-400">Content Management</p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = isActiveNavigation(activeSection, item.id);
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  {getIcon(item.icon)}
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};