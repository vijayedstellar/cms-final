import React from 'react';
import { 
  Plus,
  Library,
  Layout,
  Type,
  Image,
  MousePointer,
  Columns,
  Minus,
  Play,
  Images,
  Quote,
  CreditCard,
  Mail,
  BarChart3,
  Megaphone,
  ChevronDown,
  Users,
  Box,
  Star,
  Heart,
  Zap,
  Palette,
  Sparkles
} from 'lucide-react';
import { componentDefinitions } from '../data/componentDefinitions';

import { ComponentLibrary } from './ComponentLibrary';
import { CustomComponentCreator } from './CustomComponentCreator';

interface SidebarProps {
  onAddComponent: (componentType: string) => void;
  customComponents: any[];
  onAddCustomComponent: (component: any) => void;
  onDeleteCustomComponent: (componentId: string) => void;
  onEditCustomComponent: (component: any) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Layout,
  Type,
  Image,
  MousePointer,
  Columns,
  Minus,
  Play,
  Images,
  Quote,
  CreditCard,
  Mail,
  BarChart3,
  Megaphone,
  ChevronDown,
  Users,
  Box,
  Star,
  Heart,
  Zap,
  Palette,
  Sparkles
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  onAddComponent,
  customComponents,
  onAddCustomComponent,
  onDeleteCustomComponent,
  onEditCustomComponent
}) => {
  const [showCustomCreator, setShowCustomCreator] = React.useState(false);
  const [editingComponent, setEditingComponent] = React.useState<any>(null);

  const handleEditComponent = (component: any) => {
    setEditingComponent(component);
    setShowCustomCreator(true);
  };

  const handleDuplicateComponent = (component: any) => {
    onAddCustomComponent(component);
  };

  const handleSaveComponent = (componentData: any) => {
    if (editingComponent) {
      // Update existing component
      onDeleteCustomComponent(editingComponent.type);
      onAddCustomComponent(componentData);
      setEditingComponent(null);
    } else {
      // Create new component
      onAddCustomComponent(componentData);
    }
    setShowCustomCreator(false);
  };

  const handleCloseCreator = () => {
    setShowCustomCreator(false);
    setEditingComponent(null);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Components Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Components</h3>
            <button
              onClick={() => setShowCustomCreator(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
              title="Create Component"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>
          </div>
          
          {/* Custom Components */}
          {customComponents.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Custom Components
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[...customComponents].reverse().map((component) => {
                  const Icon = iconMap[component.icon] || iconMap.Box;
                  return (
                    <button
                      key={component.type}
                      onClick={() => onAddComponent(component.type)}
                      className="p-3 border border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-center group"
                    >
                      <div className="w-8 h-8 mx-auto mb-2 p-1 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <Icon className="w-full h-full text-purple-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 block truncate">
                        {component.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Built-in Components */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Built-in Components
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {componentDefinitions.map((component) => {
                const Icon = iconMap[component.icon] || iconMap.Box;
                return (
                  <button
                    key={component.type}
                    onClick={() => onAddComponent(component.type)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-center group"
                  >
                    <div className="w-8 h-8 mx-auto mb-2 p-1 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Icon className="w-full h-full text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 block truncate">
                      {component.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <CustomComponentCreator
        isOpen={showCustomCreator}
        onClose={handleCloseCreator}
        onSave={handleSaveComponent}
        editingComponent={editingComponent}
      />
    </div>
  );
};