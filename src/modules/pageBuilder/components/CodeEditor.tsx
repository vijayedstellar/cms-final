import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Code, Eye, Save, X } from 'lucide-react';

interface CodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  component: any;
  onSave: (code: { html: string; css: string; js: string }) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  isOpen,
  onClose,
  component,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [code, setCode] = useState({
    html: component?.customCode?.html || generateDefaultHTML(component),
    css: component?.customCode?.css || generateDefaultCSS(component),
    js: component?.customCode?.js || generateDefaultJS(component)
  });
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(code);
    onClose();
  };

  const tabs = [
    { id: 'html' as const, label: 'HTML', icon: '< >' },
    { id: 'css' as const, label: 'CSS', icon: '{ }' },
    { id: 'js' as const, label: 'JavaScript', icon: 'JS' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Code Editor - {component?.type} Component
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
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
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
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

            {/* Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={activeTab === 'html' ? 'html' : activeTab === 'css' ? 'css' : 'javascript'}
                value={code[activeTab]}
                onChange={(value) => setCode(prev => ({ ...prev, [activeTab]: value || '' }))}
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
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="w-1/2 flex flex-col">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
              </div>
              <div className="flex-1 p-4 bg-white overflow-auto">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
                      <style>${code.css}</style>
                      <div>${code.html}</div>
                      <script>${code.js}</script>
                    `
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
              <span>💡 Tip: Use modern CSS and vanilla JavaScript for best compatibility</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Auto-save enabled</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions to generate default code
function generateDefaultHTML(component: any): string {
  if (!component) return '<div>Component content here...</div>';
  
  switch (component.type) {
    case 'text':
      return `<div class="text-component">
  <p>${component.props?.content || 'Your text content here...'}</p>
</div>`;
    
    case 'button':
      return `<div class="button-component">
  <a href="${component.props?.link || '#'}" class="btn">
    ${component.props?.text || 'Click Me'}
  </a>
</div>`;
    
    case 'image':
      return `<div class="image-component">
  <img src="${component.props?.src || ''}" alt="${component.props?.alt || ''}" />
</div>`;
    
    default:
      return `<div class="${component.type}-component">
  <!-- ${component.type} component content -->
  <h3>Custom ${component.type} Component</h3>
  <p>Edit this HTML to customize your component</p>
</div>`;
  }
}

function generateDefaultCSS(component: any): string {
  if (!component) return '.component { /* Your styles here */ }';
  
  return `.${component.type}-component {
  /* Component styles */
  padding: 1rem;
  border-radius: 0.5rem;
  background: #ffffff;
}

.${component.type}-component h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.${component.type}-component p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

/* Add your custom styles here */`;
}

function generateDefaultJS(component: any): string {
  return `// Component JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize your component
  const component = document.querySelector('.${component?.type || 'custom'}-component');
  
  if (component) {
    console.log('${component?.type || 'Custom'} component loaded');
    
    // Add your custom JavaScript here
    // Example: component.addEventListener('click', function() { ... });
  }
});`;
}