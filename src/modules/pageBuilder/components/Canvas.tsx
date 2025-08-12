import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Component } from '../../types/cms';
import { ComponentRenderer } from './ComponentRenderer';

interface CanvasProps {
  components: Component[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onDeleteComponent: (id: string) => void;
  onUpdateComponent: (id: string, props: Record<string, any>) => void;
  onMoveComponent: (id: string, direction: 'up' | 'down') => void;
  customComponents?: any[];
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';
export const Canvas: React.FC<CanvasProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onDeleteComponent,
  onUpdateComponent,
  onMoveComponent,
  customComponents = []
}) => {
  const [viewportSize, setViewportSize] = React.useState<ViewportSize>('desktop');

  const handleCanvasClick = () => {
    onSelectComponent(null);
  };

  const viewportSizes = {
    desktop: { width: '100%', maxWidth: 'none', icon: Monitor, label: 'Desktop' },
    tablet: { width: '768px', maxWidth: '768px', icon: Tablet, label: 'Tablet' },
    mobile: { width: '375px', maxWidth: '375px', icon: Smartphone, label: 'Mobile' }
  };

  const currentViewport = viewportSizes[viewportSize];

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="min-h-full">
        {/* Canvas Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Drag components from the sidebar to build your page</p>
            <div className="flex items-center gap-3">
              {/* Responsive Controls */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {Object.entries(viewportSizes).map(([size, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={size}
                      onClick={() => setViewportSize(size as ViewportSize)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewportSize === size
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title={config.label}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{config.label}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Publish
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Content */}
        <div 
          className="p-6"
          onClick={handleCanvasClick}
        >
          <div className="flex justify-center">
            <div 
              className="bg-white rounded-lg shadow-sm min-h-[600px] transition-all duration-300 ease-in-out"
              style={{ 
                width: currentViewport.width,
                maxWidth: currentViewport.maxWidth
              }}
            >
            {components.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📄</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Start Building Your Page</h3>
                  <p className="text-sm">Add components from the sidebar to create your content</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 p-6">
                {components.map((component, index) => (
                  <ComponentRenderer
                    key={component.id}
                    component={component}
                    isSelected={selectedComponentId === component.id}
                    onSelect={onSelectComponent}
                    onDelete={onDeleteComponent}
                    customComponents={customComponents}
                    onMoveUp={(id) => onMoveComponent(id, 'up')}
                    onMoveDown={(id) => onMoveComponent(id, 'down')}
                    canMoveUp={index > 0}
                    canMoveDown={index < components.length - 1}
                  />
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};