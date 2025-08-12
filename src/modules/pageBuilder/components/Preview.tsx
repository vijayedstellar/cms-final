import React from 'react';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import { Component } from '../../types/cms';
import { ComponentRenderer } from './ComponentRenderer';

interface PreviewProps {
  isOpen: boolean;
  onClose: () => void;
  components: Component[];
  customComponents?: any[];
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export const Preview: React.FC<PreviewProps> = ({
  isOpen,
  onClose,
  components,
  customComponents = []
}) => {
  const [viewportSize, setViewportSize] = React.useState<ViewportSize>('desktop');

  if (!isOpen) return null;

  const viewportSizes = {
    desktop: { width: '100%', maxWidth: 'none', icon: Monitor, label: 'Desktop' },
    tablet: { width: '768px', maxWidth: '768px', icon: Tablet, label: 'Tablet' },
    mobile: { width: '375px', maxWidth: '375px', icon: Smartphone, label: 'Mobile' }
  };

  const currentViewport = viewportSizes[viewportSize];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Preview Mode</h2>
          <div className="text-sm text-gray-300">
            Live preview of your page
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Responsive Controls */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            {Object.entries(viewportSizes).map(([size, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={size}
                  onClick={() => setViewportSize(size as ViewportSize)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewportSize === size
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  title={config.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{config.label}</span>
                </button>
              );
            })}
          </div>
          
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Close Preview
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        <div className="min-h-full flex justify-center p-6">
          <div 
            className="bg-white shadow-lg transition-all duration-300 ease-in-out min-h-full"
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
                  <h3 className="text-lg font-medium mb-2">No Content Yet</h3>
                  <p className="text-sm">Add components to see your page preview</p>
                </div>
              </div>
            ) : (
              <div>
                {components.map((component) => (
                  <div key={component.id} className="preview-component">
                    <ComponentRenderer
                      component={component}
                      customComponents={customComponents}
                      // Don't pass selection/editing props for clean preview
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Footer */}
      <div className="bg-gray-900 text-white px-6 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              Viewing: {currentViewport.label} ({currentViewport.width})
            </span>
            <span className="text-gray-300">
              Components: {components.length}
            </span>
          </div>
          <div className="text-gray-400">
            This is how your page will look to visitors
          </div>
        </div>
      </div>
    </div>
  );
};