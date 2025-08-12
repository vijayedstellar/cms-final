import type { NavigationItem } from '../types';

export const navigationItems: NavigationItem[] = [
  {
    id: 'pages',
    label: 'Pages',
    icon: 'FileText',
    path: '/dashboard/pages'
  },
  {
    id: 'components',
    label: 'Components',
    icon: 'Package',
    path: '/dashboard/components'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/dashboard/settings'
  }
];

export const getNavigationItemById = (id: string): NavigationItem | undefined => {
  return navigationItems.find(item => item.id === id);
};

export const isActiveNavigation = (currentSection: string, itemId: string): boolean => {
  return currentSection === itemId;
};