import { useState, useCallback } from 'react';
import type { DashboardState, SectionType } from '../types';

export const useDashboard = (initialSection: SectionType = 'pages') => {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    activeSection: initialSection,
    isSidebarCollapsed: false
  });

  const setActiveSection = useCallback((section: string) => {
    setDashboardState(prev => ({
      ...prev,
      activeSection: section
    }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setDashboardState(prev => ({
      ...prev,
      isSidebarCollapsed: !prev.isSidebarCollapsed
    }));
  }, []);

  return {
    ...dashboardState,
    setActiveSection,
    toggleSidebar
  };
};