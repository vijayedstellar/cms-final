import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Plus, Save, X, Eye, Palette } from 'lucide-react';

interface CustomComponentCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  editingComponent?: any;
  onSave: (component: {
    name: string;
    icon: string;
    html: string;
    css: string;
    js: string;
    editableProps: Array<{
      key: string;
      label: string;
      type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'boolean';
      options?: string[];
    }>;
  }) => void;
}

export const CustomComponentCreator: React.FC<CustomComponentCreatorProps> = ({
  isOpen,
  onClose,
  editingComponent,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'props'>('html');
  const [showPreview, setShowPreview] = useState(false);
  
  const getInitialData = () => {
    if (editingComponent) {
      return {
        name: editingComponent.name,
        icon: editingComponent.icon,
        html: editingComponent.html,
        css: editingComponent.css,
        js: editingComponent.js,
        editableProps: editingComponent.editableProps || []
      };
    }
    
    return {
      name: 'My Component',
      icon: 'Box',
      html: `<div class="custom-component">
  <h3>{{title}}</h3>
  <p>{{description}}</p>
  <button class="btn" style="background-color: {{buttonColor}}">
    {{buttonText}}
  </button>
</div>`,
    css: `.custom-component {
  padding: 2rem;
  border-radius: 0.5rem;
  background: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.custom-component h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.custom-component p {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
  line-height: 1.5;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}`,
    js: `// Component JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.custom-component .btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Custom component button clicked!');
      
      // Add your custom functionality here
      // Example: show alert, send data, animate, etc.
    });
  });
});`,
    editableProps: [
      { key: 'title', label: 'Title', type: 'text' as const },
      { key: 'description', label: 'Description', type: 'textarea' as const },
      { key: 'buttonText', label: 'Button Text', type: 'text' as const },
      { key: 'buttonColor', label: 'Button Color', type: 'color' as const }
    ]
    };
  };

  const [componentData, setComponentData] = useState(getInitialData);

  // Reset form when editing component changes
  React.useEffect(() => {
    if (isOpen) {
      setComponentData(getInitialData());
    }
  }, [isOpen, editingComponent]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!componentData.name.trim()) {
      alert('Please enter a component name');
      return;
    }
    onSave(componentData);
    onClose();
  };

  const addEditableProp = () => {
    setComponentData(prev => ({
      ...prev,
      editableProps: [
        ...prev.editableProps,
        { key: `prop${prev.editableProps.length + 1}`, label: 'New Property', type: 'text' }
      ]
    }));
  };

  const updateEditableProp = (index: number, field: string, value: any) => {
    setComponentData(prev => ({
      ...prev,
      editableProps: prev.editableProps.map((prop, i) => 
        i === index ? { ...prop, [field]: value } : prop
      )
    }));
  };

  const removeEditableProp = (index: number) => {
    setComponentData(prev => ({
      ...prev,
      editableProps: prev.editableProps.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'html' as const, label: 'HTML', icon: '< >' },
    { id: 'css' as const, label: 'CSS', icon: '{ }' },
    { id: 'js' as const, label: 'JavaScript', icon: 'JS' },
    { id: 'props' as const, label: 'Properties', icon: '⚙️' }
  ];

  const renderPreview = () => {
    let html = componentData.html;
    
    // Replace template variables with sample data
    const sampleData = {
      title: 'Sample Title',
      description: 'This is a sample description for the custom component.',
      buttonText: 'Click Me',
      buttonColor: '#3b82f6'
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return `
      <style>${componentData.css}</style>
      <div>${html}</div>
      <script>${componentData.js}</script>
    `;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {editingComponent ? 'Edit Component' : 'Create Component'}
              </h2>
              <p className="text-sm text-gray-600">
                {editingComponent ? 'Modify your component' : 'Build your own reusable component'} with HTML, CSS & JavaScript
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showPreview 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <Save className="w-4 h-4" />
              {editingComponent ? 'Update Component' : 'Save Component'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Component Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Component Name</label>
              <input
                type="text"
                value={componentData.name}
                onChange={(e) => setComponentData(prev => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter component name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <select
                value={componentData.icon}
                onChange={(e) => setComponentData(prev => ({ ...prev, icon: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Box">Box</option>
                <option value="Star">Star</option>
                <option value="Heart">Heart</option>
                <option value="Zap">Zap</option>
                <option value="Palette">Palette</option>
                <option value="Sparkles">Sparkles</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r border-gray-200`}>
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-mono text-xs">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Editor Content */}
            <div className="flex-1">
              {activeTab === 'props' ? (
                <div className="p-6 overflow-y-auto h-full bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Editable Properties</h3>
                    <button
                      onClick={addEditableProp}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Property
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {componentData.editableProps.map((prop, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Property {index + 1}</h4>
                          <button
                            onClick={() => removeEditableProp(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
                            <input
                              type="text"
                              value={prop.key}
                              onChange={(e) => updateEditableProp(index, 'key', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="propertyKey"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                            <input
                              type="text"
                              value={prop.label}
                              onChange={(e) => updateEditableProp(index, 'label', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Property Label"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={prop.type}
                              onChange={(e) => updateEditableProp(index, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="text">Text</option>
                              <option value="textarea">Textarea</option>
                              <option value="number">Number</option>
                              <option value="color">Color</option>
                              <option value="boolean">Boolean</option>
                              <option value="select">Select</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Template Variables</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Use <code className="bg-blue-100 px-1 rounded">{'{{propertyKey}}'}</code> in your HTML to create dynamic content.
                    </p>
                    <p className="text-xs text-blue-600">
                      Example: <code className="bg-blue-100 px-1 rounded">{'<h1>{{title}}</h1>'}</code> will be replaced with the title property value.
                    </p>
                  </div>
                </div>
              ) : (
                <Editor
                  height="100%"
                  language={activeTab === 'html' ? 'html' : activeTab === 'css' ? 'css' : 'javascript'}
                  value={componentData[activeTab]}
                  onChange={(value) => setComponentData(prev => ({ ...prev, [activeTab]: value || '' }))}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 }
                  }}
                />
              )}
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="w-1/2 flex flex-col">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
                <p className="text-xs text-gray-500 mt-1">Preview with sample data</p>
              </div>
              <div className="flex-1 p-6 bg-white overflow-auto">
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderPreview()
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>💡 Use template variables like <code className="bg-gray-200 px-1 rounded">{'{{propertyName}}'}</code> for dynamic content</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Ready to create your component?</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};