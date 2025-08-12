import React, { useState } from 'react';
import { 
  Trash2, 
  Edit, 
  Copy, 
  Search, 
  Filter,
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

interface ComponentLibraryProps {
  customComponents: any[];
  onDeleteComponent: (componentId: string) => void;
  onEditComponent: (component: any) => void;
  onDuplicateComponent: (component: any) => void;
  onAddComponent: (componentType: string) => void;
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

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  customComponents,
  onDeleteComponent,
  onEditComponent,
  onDuplicateComponent,
  onAddComponent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'built-in' | 'custom'>('all');

  // Combine all components
  const allComponents = [
    ...componentDefinitions.map(comp => ({ ...comp, isBuiltIn: true })),
    ...customComponents.map(comp => ({ ...comp, isBuiltIn: false }))
  ];

  // Filter components
  const filteredComponents = allComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'built-in' && component.isBuiltIn) ||
                         (filter === 'custom' && !component.isBuiltIn);
    return matchesSearch && matchesFilter;
  });

  const handleDeleteComponent = (component: any) => {
    if (component.isBuiltIn) {
      alert('Built-in components cannot be deleted');
      return;
    }
    
    if (confirm(`Are you sure you want to delete "${component.name}"?`)) {
      onDeleteComponent(component.type);
    }
  };

  const handleEditComponent = (component: any) => {
    if (component.isBuiltIn) {
      alert('Built-in components cannot be edited. You can duplicate them to create a custom version.');
      return;
    }
    onEditComponent(component);
  };

  const handleDuplicateComponent = (component: any) => {
    const duplicatedComponent = {
      ...component,
      name: `${component.name} Copy`,
      type: `${component.type}-copy-${Date.now()}`,
      isBuiltIn: false
    };
    onDuplicateComponent(duplicatedComponent);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Component Library</h3>
        <p className="text-sm text-gray-600">Manage and organize all your components</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Components</option>
            <option value="built-in">Built-in</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Components Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-3">
          {filteredComponents.map((component) => {
            const Icon = iconMap[component.icon] || iconMap.Box;
            return (
              <div
                key={component.type}
                className="group p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${component.isBuiltIn ? 'bg-blue-100' : 'bg-purple-100'}`}>
                      <Icon className={`w-5 h-5 ${component.isBuiltIn ? 'text-blue-600' : 'text-purple-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{component.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          component.isBuiltIn 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {component.isBuiltIn ? 'Built-in' : 'Custom'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {component.editableProps?.length || 0} properties
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onAddComponent(component.type)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Add to page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleDuplicateComponent(component)}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleEditComponent(component)}
                      className={`p-2 rounded-lg transition-colors ${
                        component.isBuiltIn 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                      title={component.isBuiltIn ? 'Built-in components cannot be edited' : 'Edit component'}
                      disabled={component.isBuiltIn}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteComponent(component)}
                      className={`p-2 rounded-lg transition-colors ${
                        component.isBuiltIn 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title={component.isBuiltIn ? 'Built-in components cannot be deleted' : 'Delete component'}
                      disabled={component.isBuiltIn}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No components found</h4>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};