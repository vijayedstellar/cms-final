// Production constants and configuration
export const APP_CONFIG = {
  name: 'CMS Page Builder',
  version: '1.0.0',
  description: 'Professional drag-and-drop page builder for CMS systems',
  author: 'Your Company'
};

export const EDITOR_CONFIG = {
  autoSaveInterval: 30000, // 30 seconds
  maxUndoSteps: 50,
  maxComponentsPerPage: 100,
  supportedImageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  maxImageSize: 5 * 1024 * 1024, // 5MB
};

export const API_ENDPOINTS = {
  components: '/api/components',
  pages: '/api/pages',
  media: '/api/media',
  templates: '/api/templates'
};

export const RESPONSIVE_BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

export const THEME_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};