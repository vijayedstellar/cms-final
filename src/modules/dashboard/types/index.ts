// Dashboard module TypeScript definitions

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export interface DashboardState {
  activeSection: string;
  isSidebarCollapsed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending';
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardContextType extends DashboardState {
  setActiveSection: (section: string) => void;
  toggleSidebar: () => void;
  user?: User;
}

export type SectionType = 'pages' | 'components' | 'settings';