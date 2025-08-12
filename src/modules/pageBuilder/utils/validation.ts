// Input validation utilities for production safety
export const validateComponent = (component: any): boolean => {
  if (!component || typeof component !== 'object') return false;
  if (!component.id || typeof component.id !== 'string') return false;
  if (!component.type || typeof component.type !== 'string') return false;
  if (!component.props || typeof component.props !== 'object') return false;
  return true;
};

export const validateCustomComponent = (component: any): boolean => {
  if (!validateComponent(component)) return false;
  if (!component.name || typeof component.name !== 'string') return false;
  if (!component.html || typeof component.html !== 'string') return false;
  if (!component.css || typeof component.css !== 'string') return false;
  if (!component.editableProps || !Array.isArray(component.editableProps)) return false;
  return true;
};

export const sanitizeHTML = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const validProtocols = ['http:', 'https:', 'data:'];
    return validProtocols.includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const validateColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
  const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
  
  return hexRegex.test(color) || rgbRegex.test(color) || rgbaRegex.test(color);
};

export const validatePageData = (pageData: any): boolean => {
  if (!pageData || typeof pageData !== 'object') return false;
  if (!pageData.title || typeof pageData.title !== 'string') return false;
  if (!pageData.components || !Array.isArray(pageData.components)) return false;
  
  return pageData.components.every(validateComponent);
};