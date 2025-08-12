import React from 'react';
import { Code } from 'lucide-react';
import { Component } from '../../types/cms';
import { componentDefinitions } from '../data/componentDefinitions';
import { CodeEditor } from './CodeEditor';

interface PropertyPanelProps {
  selectedComponent: Component | null;
  onUpdateComponent: (id: string, props: Record<string, any>) => void;
  customComponents?: any[];
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onUpdateComponent,
  customComponents = []
}) => {
  const [showCodeEditor, setShowCodeEditor] = React.useState(false);

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <p>Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const componentDef = [...componentDefinitions, ...customComponents].find(def => def.type === selectedComponent.type);
  
  if (!componentDef) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <p className="text-red-500">Unknown component type</p>
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      ...selectedComponent.props,
      [key]: value
    });
  };

  const handleSaveCustomCode = (code: { html: string; css: string; js: string }) => {
    onUpdateComponent(selectedComponent.id, {
      ...selectedComponent.props,
      customCode: code
    });
  };

  return (
    <>
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{componentDef.name}</h3>
            <p className="text-sm text-gray-600 mt-1">Customize component properties</p>
          </div>
          <button
            onClick={() => setShowCodeEditor(true)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
            title="Edit Code"
          >
            <Code className="w-4 h-4" />
            <span className="text-sm font-medium">Code</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {componentDef.editableProps.map((prop) => (
            <div key={prop.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {prop.label}
              </label>
              
              {prop.type === 'text' && (
                <input
                  type="text"
                  value={selectedComponent.props[prop.key] || ''}
                  onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              
              {prop.type === 'textarea' && (
                <textarea
                  rows={3}
                  value={selectedComponent.props[prop.key] || ''}
                  onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              
              {prop.type === 'number' && (
                <input
                  type="number"
                  value={selectedComponent.props[prop.key] || 0}
                  onChange={(e) => handlePropertyChange(prop.key, parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              
              {prop.type === 'color' && (
                <input
                  type="color"
                  value={selectedComponent.props[prop.key] || '#000000'}
                  onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              )}
              
              {prop.type === 'select' && prop.options && (
                <select
                  value={selectedComponent.props[prop.key] || prop.options[0]}
                  onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {prop.options.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              )}
              
              {prop.type === 'boolean' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedComponent.props[prop.key] || false}
                    onChange={(e) => handlePropertyChange(prop.key, e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Enable</span>
                </label>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>

      <CodeEditor
        isOpen={showCodeEditor}
        onClose={() => setShowCodeEditor(false)}
        component={selectedComponent}
        onSave={handleSaveCustomCode}
      />
    </>
  );
};