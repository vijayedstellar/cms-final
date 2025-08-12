# Page Builder Integration Guide for CMS Dashboard

This guide explains how to integrate your existing Page Builder module into the CMS Dashboard's Components section.

## Overview

Based on your Page Builder structure, you have a complete drag-and-drop page builder with:
- Drag-and-drop component library (Hero Section, Text Block, Image, Button, etc.)
- Visual page editor with desktop/tablet/mobile preview
- Component properties panel
- Save/Preview/Publish functionality
- Custom component creator with Monaco editor
- Auto-save and keyboard shortcuts

## Current Page Builder Structure Analysis

Your Page Builder has this structure:
```
src/
├── components/cms/          # Main Page Builder components
│   ├── App.tsx             # Main application container
│   ├── Canvas.tsx          # Page building canvas
│   ├── Sidebar.tsx         # Component library sidebar
│   ├── PropertyPanel.tsx   # Component property editor
│   ├── Preview.tsx         # Full-screen preview modal
│   ├── ComponentRenderer.tsx # Component rendering logic
│   ├── ComponentLibrary.tsx # Component management
│   ├── CustomComponentCreator.tsx # Custom component builder
│   └── CodeEditor.tsx      # Monaco code editor
├── data/
│   └── componentDefinitions.ts # Built-in component definitions
├── types/
│   └── cms.ts              # TypeScript type definitions
├── hooks/
│   ├── useAutoSave.ts      # Auto-save functionality
│   └── useKeyboardShortcuts.ts # Keyboard shortcuts
└── utils/
    ├── constants.ts        # Application constants
    ├── performance.ts      # Performance utilities
    ├── validation.ts       # Input validation
    └── export.ts          # Export utilities
```

## Integration Steps

### Step 1: Create Page Builder Module Directory

In your CMS Dashboard project, create the Page Builder module structure:

```
your-cms-project/src/modules/pageBuilder/
├── components/
├── data/
├── hooks/
├── types/
├── utils/
├── styles/
└── index.ts
```

### Step 2: Copy Page Builder Files

Copy your Page Builder files to the new structure:

#### 2.1 Copy Main Components
```bash
# Copy all CMS components
your-cms-project/src/modules/pageBuilder/components/
├── PageBuilder.tsx                    # From: components/cms/App.tsx (rename)
├── Canvas.tsx                         # From: components/cms/Canvas.tsx
├── Sidebar.tsx                        # From: components/cms/Sidebar.tsx
├── PropertyPanel.tsx                  # From: components/cms/PropertyPanel.tsx
├── Preview.tsx                        # From: components/cms/Preview.tsx
├── ComponentRenderer.tsx              # From: components/cms/ComponentRenderer.tsx
├── ComponentLibrary.tsx               # From: components/cms/ComponentLibrary.tsx
├── CustomComponentCreator.tsx         # From: components/cms/CustomComponentCreator.tsx
└── CodeEditor.tsx                     # From: components/cms/CodeEditor.tsx
```

#### 2.2 Copy Data Definitions
```bash
# Copy component definitions
your-cms-project/src/modules/pageBuilder/data/
└── componentDefinitions.ts           # From: data/componentDefinitions.ts
```

#### 2.3 Copy Hooks
```bash
# Copy custom hooks
your-cms-project/src/modules/pageBuilder/hooks/
├── useAutoSave.ts                     # From: hooks/useAutoSave.ts
└── useKeyboardShortcuts.ts            # From: hooks/useKeyboardShortcuts.ts
```

#### 2.4 Copy Types
```bash
# Copy TypeScript definitions
your-cms-project/src/modules/pageBuilder/types/
└── cms.ts                             # From: types/cms.ts
```

#### 2.5 Copy Utilities
```bash
# Copy utility functions
your-cms-project/src/modules/pageBuilder/utils/
├── constants.ts                       # From: utils/constants.ts
├── performance.ts                     # From: utils/performance.ts
├── validation.ts                      # From: utils/validation.ts
└── export.ts                         # From: utils/export.ts
```

### Step 3: Create Page Builder Module Index

Create the module index file:

**File: `src/modules/pageBuilder/index.ts`**
```typescript
// Page Builder module exports
export { default as PageBuilder } from './components/PageBuilder';
export { Canvas } from './components/Canvas';
export { Sidebar } from './components/Sidebar';
export { PropertyPanel } from './components/PropertyPanel';
export { Preview } from './components/Preview';
export { ComponentRenderer } from './components/ComponentRenderer';
export { ComponentLibrary } from './components/ComponentLibrary';
export { CustomComponentCreator } from './components/CustomComponentCreator';
export { CodeEditor } from './components/CodeEditor';

// Hooks
export { useAutoSave } from './hooks/useAutoSave';
export { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Data
export { componentDefinitions } from './data/componentDefinitions';

// Types
export type * from './types/cms';

// Utils
export * from './utils/constants';
export * from './utils/performance';
export * from './utils/validation';
export * from './utils/export';
```

### Step 4: Update Page Builder Main Component

Rename and update your main App.tsx to PageBuilder.tsx:

**File: `src/modules/pageBuilder/components/PageBuilder.tsx`**
```typescript
import React from 'react';
// Update all imports to use relative paths within the module
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import { PropertyPanel } from './PropertyPanel';
import { Preview } from './Preview';
// ... other imports

// Your existing App component code, but renamed to PageBuilder
const PageBuilder: React.FC = () => {
  // Your existing App.tsx logic here
  return (
    <div className="h-full flex flex-col">
      {/* Your existing JSX structure */}
    </div>
  );
};

export default PageBuilder;
```

### Step 5: Update Dashboard ComponentView

Replace the current ComponentView with your Page Builder:

**File: `src/modules/dashboard/components/ComponentView.tsx`**
```typescript
import React from 'react';
import { PageBuilder } from '../../pageBuilder';

export const ComponentView: React.FC = () => {
  return (
    <div className="h-full">
      <PageBuilder />
    </div>
  );
};
```

### Step 6: Update Import Paths

Update all import paths in your Page Builder files to match the new structure:

#### 6.1 Update Component Imports
In all files under `src/modules/pageBuilder/components/`, update imports:

```typescript
// OLD imports (update these)
import { someHook } from '../hooks/useAutoSave';
import { ComponentDefinition } from '../types/cms';
import { CONSTANTS } from '../utils/constants';

// NEW imports (change to these)
import { someHook } from '../hooks/useAutoSave';
import { ComponentDefinition } from '../types/cms';
import { CONSTANTS } from '../utils/constants';
```

#### 6.2 Update Hook Imports
In hook files, update any cross-references:

```typescript
// In useAutoSave.ts and useKeyboardShortcuts.ts
import { SomeType } from '../types/cms';
import { CONSTANTS } from '../utils/constants';
```

### Step 7: Update Dashboard Module Exports

Update the dashboard module to include Page Builder:

**File: `src/modules/dashboard/index.ts`**
```typescript
// Dashboard module entry point and exports

// Main component
export { Dashboard } from './components/Dashboard';

// Individual components
export { Header } from './components/Header';
export { Sidebar } from './components/Sidebar';
export { MainContent } from './components/MainContent';
export { PageView } from './components/PageView';
export { ComponentView } from './components/ComponentView'; // Now includes Page Builder
export { SettingsView } from './components/SettingsView';

// Hooks
export { useDashboard } from './hooks/useDashboard';

// Services
export { dashboardService, DashboardService } from './services/dashboardService';

// Types
export type {
  NavigationItem,
  DashboardState,
  User,
  DashboardContextType,
  SectionType
} from './types';

// Utils
export { navigationItems, getNavigationItemById, isActiveNavigation } from './utils/navigation';

// Re-export Page Builder module
export * from '../pageBuilder';
```

### Step 8: Update Package Dependencies

Add any Page Builder specific dependencies to your CMS project:

**File: `package.json`**
```json
{
  "dependencies": {
    // Existing CMS dependencies...
    "firebase": "^12.1.0",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    
    // Add Page Builder specific dependencies
    "@monaco-editor/react": "^4.6.0",
    "react-beautiful-dnd": "^13.1.1",
    "react-resizable": "^3.0.4",
    "uuid": "^9.0.0"
  }
}
```

### Step 9: Create Page Builder Styles

If your Page Builder has specific CSS, create a styles file:

**File: `src/modules/pageBuilder/styles/pageBuilder.css`**
```css
/* Page Builder specific styles */
.page-builder-container {
  height: calc(100vh - 80px); /* Account for dashboard header */
  display: flex;
  flex-direction: column;
}

.page-builder-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.component-library {
  width: 280px;
  border-right: 1px solid #e5e7eb;
  background: white;
}

.canvas-area {
  flex: 1;
  background: #f9fafb;
  position: relative;
}

.properties-panel {
  width: 320px;
  border-left: 1px solid #e5e7eb;
  background: white;
}

/* Monaco Editor styles */
.monaco-editor-container {
  height: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* Component drag and drop styles */
.dragging {
  opacity: 0.5;
}

.drop-zone {
  border: 2px dashed #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}
```

### Step 10: Update Main App to Include Page Builder Styles

**File: `src/App.tsx`**
```typescript
import React from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './modules/dashboard';

// Import Page Builder styles
import './modules/pageBuilder/styles/pageBuilder.css';

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

export default App;
```

### Step 11: Integration Checklist

#### 11.1 File Structure Verification
```
your-cms-project/
├── src/
│   ├── modules/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── ComponentView.tsx     # ✅ Updated to use PageBuilder
│   │   │   │   └── ...
│   │   │   └── ...
│   │   └── pageBuilder/                  # ✅ New module
│   │       ├── components/
│   │       │   ├── PageBuilder.tsx       # ✅ Main component (renamed from App.tsx)
│   │       │   ├── Canvas.tsx            # ✅ Page building canvas
│   │       │   ├── Sidebar.tsx           # ✅ Component library
│   │       │   ├── PropertyPanel.tsx     # ✅ Properties editor
│   │       │   ├── Preview.tsx           # ✅ Preview modal
│   │       │   ├── ComponentRenderer.tsx # ✅ Component rendering
│   │       │   ├── ComponentLibrary.tsx  # ✅ Component management
│   │       │   ├── CustomComponentCreator.tsx # ✅ Custom components
│   │       │   └── CodeEditor.tsx        # ✅ Monaco editor
│   │       ├── data/
│   │       │   └── componentDefinitions.ts # ✅ Component definitions
│   │       ├── hooks/
│   │       │   ├── useAutoSave.ts        # ✅ Auto-save functionality
│   │       │   └── useKeyboardShortcuts.ts # ✅ Keyboard shortcuts
│   │       ├── types/
│   │       │   └── cms.ts                # ✅ Type definitions
│   │       ├── utils/
│   │       │   ├── constants.ts          # ✅ Constants
│   │       │   ├── performance.ts        # ✅ Performance utilities
│   │       │   ├── validation.ts         # ✅ Validation
│   │       │   └── export.ts             # ✅ Export utilities
│   │       ├── styles/
│   │       │   └── pageBuilder.css       # ✅ Page Builder styles
│   │       └── index.ts                  # ✅ Module exports
│   ├── App.tsx                           # ✅ Updated with styles
│   └── ...
```

#### 11.2 Import Updates Required

Update any imports in your Page Builder files:

1. **Update relative imports** to match new file structure
2. **Update service imports** to use dashboard authentication if needed
3. **Update type imports** to be consistent with dashboard types

#### 11.3 Authentication Integration (Optional)

If you want your Page Builder to use the dashboard authentication:

**Example: Update Page Builder to use dashboard auth**
```typescript
// In PageBuilder.tsx
import { useAuth } from '../../../hooks/useAuth';

const PageBuilder: React.FC = () => {
  const { user } = useAuth();
  
  // Use user info for save/publish operations
  const handleSave = (pageData: any) => {
    // Include user info in save operation
    console.log('Saving page for user:', user?.email);
    // Your save logic here
  };
  
  // Rest of your component
};
```

### Step 12: Testing Integration

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Navigation**
   - Login to CMS Dashboard
   - Click on "Components" in sidebar
   - Page Builder should load with full functionality

3. **Test Functionality**
   - Drag and drop components
   - Edit component properties
   - Save/Preview pages
   - Custom component creation
   - Keyboard shortcuts (Ctrl+Z, Ctrl+S, etc.)

### Step 13: Styling Adjustments

You may need to adjust styles to fit within the dashboard layout:

**File: `src/modules/pageBuilder/styles/pageBuilder.css`**
```css
/* Ensure Page Builder fits within dashboard layout */
.page-builder-container {
  height: calc(100vh - 80px); /* Account for dashboard header */
  display: flex;
  flex-direction: column;
}

/* Adjust component library width if needed */
.component-library {
  width: 280px;
  min-width: 280px;
}

/* Ensure canvas takes remaining space */
.canvas-area {
  flex: 1;
  min-width: 0; /* Allow flex shrinking */
}

/* Adjust properties panel width if needed */
.properties-panel {
  width: 320px;
  min-width: 320px;
}
```

## Final Project Structure

After integration, your project structure will be:

```
your-cms-project/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   └── firebase.ts
│   ├── modules/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── MainContent.tsx
│   │   │   │   ├── PageView.tsx
│   │   │   │   ├── ComponentView.tsx      # Now loads PageBuilder
│   │   │   │   └── SettingsView.tsx
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── pageBuilder/                   # Your Page Builder module
│   │       ├── components/
│   │       │   ├── PageBuilder.tsx        # Main Page Builder component
│   │       │   ├── Canvas.tsx
│   │       │   ├── Sidebar.tsx
│   │       │   ├── PropertyPanel.tsx
│   │       │   ├── Preview.tsx
│   │       │   ├── ComponentRenderer.tsx
│   │       │   ├── ComponentLibrary.tsx
│   │       │   ├── CustomComponentCreator.tsx
│   │       │   └── CodeEditor.tsx
│   │       ├── data/
│   │       │   └── componentDefinitions.ts
│   │       ├── hooks/
│   │       │   ├── useAutoSave.ts
│   │       │   └── useKeyboardShortcuts.ts
│   │       ├── types/
│   │       │   └── cms.ts
│   │       ├── utils/
│   │       │   ├── constants.ts
│   │       │   ├── performance.ts
│   │       │   ├── validation.ts
│   │       │   └── export.ts
│   │       ├── styles/
│   │       │   └── pageBuilder.css
│   │       └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── ...
```

## Expected Result

After completing this integration:

1. **Dashboard Navigation**: Clicking "Components" in the sidebar will load your Page Builder
2. **Full Functionality**: All Page Builder features will work within the dashboard
3. **Consistent UI**: Page Builder will be styled to fit within the dashboard layout
4. **Authentication**: Page Builder can optionally use the same authentication system
5. **Data Integration**: Pages created in the Page Builder can be managed through the dashboard

## Troubleshooting

### Common Issues:

1. **Import Errors**: Update all relative imports to match new file structure
2. **Style Conflicts**: Ensure Page Builder styles don't conflict with dashboard styles
3. **Monaco Editor Issues**: Make sure @monaco-editor/react is installed
4. **Missing Dependencies**: Install any additional packages your Page Builder needs

### Debug Steps:

1. Check browser console for import errors
2. Verify all files are copied to correct locations
3. Test each Page Builder feature individually
4. Check network tab for API call issues

This integration will give you a complete CMS with both content management and visual page building capabilities!