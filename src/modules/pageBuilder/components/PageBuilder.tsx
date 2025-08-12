import React, { useState, useCallback } from 'react';
import { Component } from '../types/cms';
import { componentDefinitions } from '../data/componentDefinitions';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { PropertyPanel } from './PropertyPanel';
import { Preview } from './Preview';
import { useAutoSave } from '../hooks/useAutoSave';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { performanceMonitor } from '../utils/performance';
import { validateComponent } from '../utils/validation';
import { APP_CONFIG } from '../utils/constants';

function PageBuilder() {
  const [components, setComponents] = useState<Component[]>([]);
  const [customComponents, setCustomComponents] = useState<any[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [history, setHistory] = useState<Component[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const selectedComponent = components.find(c => c.id === selectedComponentId) || null;

  // Auto-save functionality
  const { saveNow } = useAutoSave({
    components,
    customComponents,
    onSave: (data) => {
      // In production, this would save to your backend
      console.log('Auto-saving...', data);
      setLastSaved(new Date());
    },
    enabled: true
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: () => handleUndo(),
    onRedo: () => handleRedo(),
    onSave: () => handleSave(),
    onPreview: () => handlePreview(),
    onDelete: () => selectedComponentId && handleDeleteComponent(selectedComponentId),
    enabled: true
  });

  const saveToHistory = useCallback((newComponents: Component[]) => {
    performanceMonitor.startTiming('saveToHistory');
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newComponents]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    performanceMonitor.endTiming('saveToHistory');
  }, [history, historyIndex]);

  const handleAddComponent = useCallback((componentType: string) => {
    performanceMonitor.startTiming('addComponent');
    const componentDef = [...componentDefinitions, ...customComponents].find(def => def.type === componentType);
    if (!componentDef) return;

    const newComponent: Component = {
      id: `${componentType}-${Date.now()}`,
      type: componentType as any,
      props: { ...componentDef.defaultProps },
      children: []
    };

    // Validate component before adding
    if (!validateComponent(newComponent)) {
      console.error('Invalid component data:', newComponent);
      return;
    }

    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    saveToHistory(newComponents);
    setSelectedComponentId(newComponent.id);
    performanceMonitor.endTiming('addComponent');
  }, [components, saveToHistory]);

  const handleSelectComponent = useCallback((id: string | null) => {
    setSelectedComponentId(id);
  }, []);

  const handleDeleteComponent = useCallback((id: string) => {
    const newComponents = components.filter(c => c.id !== id);
    setComponents(newComponents);
    saveToHistory(newComponents);
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [components, selectedComponentId, saveToHistory]);

  const handleUpdateComponent = useCallback((id: string, props: Record<string, any>) => {
    const newComponents = components.map(c => 
      c.id === id ? { ...c, props } : c
    );
    setComponents(newComponents);
    saveToHistory(newComponents);
  }, [components, saveToHistory]);

  const handleAddCustomComponent = useCallback((customComponent: any) => {
    const newCustomComponent = {
      ...customComponent,
      type: customComponent.type || `component-${Date.now()}`, // Unique type identifier
      createdAt: Date.now(), // Add timestamp for ordering
      defaultProps: customComponent.editableProps.reduce((acc: any, prop: any) => {
        acc[prop.key] = prop.type === 'boolean' ? false : 
                      prop.type === 'number' ? 0 : 
                      prop.type === 'color' ? '#000000' : '';
        return acc;
      }, {})
    };
    
    setCustomComponents(prev => [newCustomComponent, ...prev]);
  }, []);

  const handleDeleteCustomComponent = useCallback((componentType: string) => {
    setCustomComponents(prev => prev.filter(comp => comp.type !== componentType));
    
    // Also remove any instances of this component from the page
    const newComponents = components.filter(c => c.type !== componentType);
    if (newComponents.length !== components.length) {
      setComponents(newComponents);
      saveToHistory(newComponents);
      if (selectedComponentId && components.find(c => c.id === selectedComponentId)?.type === componentType) {
        setSelectedComponentId(null);
      }
    }
  }, [components, selectedComponentId, saveToHistory]);

  const handleEditCustomComponent = useCallback((component: any) => {
    // This will be handled by the sidebar component
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      setSelectedComponentId(null);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      setSelectedComponentId(null);
    }
  }, [history, historyIndex]);

  const handleSave = useCallback(() => {
    setIsLoading(true);
    performanceMonitor.startTiming('savePage');
    
    try {
      // In production, this would save to your backend API
      const pageData = {
        components,
        customComponents,
        metadata: {
          title: 'Untitled Page',
          lastModified: new Date().toISOString(),
          version: APP_CONFIG.version
        }
      };
      
      console.log('Saving page...', pageData);
      setLastSaved(new Date());
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        performanceMonitor.endTiming('savePage');
      }, 1000);
    } catch (error) {
      console.error('Save failed:', error);
      setIsLoading(false);
    }
  }, [components]);

  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, [components]);

  const handleMoveComponent = useCallback((id: string, direction: 'up' | 'down') => {
    const currentIndex = components.findIndex(c => c.id === id);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < components.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return; // Can't move in that direction
    }

    const newComponents = [...components];
    const [movedComponent] = newComponents.splice(currentIndex, 1);
    newComponents.splice(newIndex, 0, movedComponent);

    setComponents(newComponents);
    saveToHistory(newComponents);
  }, [components, saveToHistory]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onPreview={handlePreview}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        isLoading={isLoading}
        lastSaved={lastSaved}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          onAddComponent={handleAddComponent}
          customComponents={customComponents}
          onAddCustomComponent={handleAddCustomComponent}
          onDeleteCustomComponent={handleDeleteCustomComponent}
          onEditCustomComponent={handleEditCustomComponent}
        />
        
        <Canvas
          components={components}
          selectedComponentId={selectedComponentId}
          onSelectComponent={handleSelectComponent}
          onDeleteComponent={handleDeleteComponent}
          onUpdateComponent={handleUpdateComponent}
          customComponents={customComponents}
          onMoveComponent={handleMoveComponent}
        />
        
        <PropertyPanel
          selectedComponent={selectedComponent}
          onUpdateComponent={handleUpdateComponent}
          customComponents={customComponents}
        />
      </div>
      
      <Preview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        components={components}
        customComponents={customComponents}
      />
    </div>
  );
}

export default PageBuilder;