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