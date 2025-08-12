// Export utilities for production deployment
import { Component } from '../types/cms';

export const generateStaticHTML = (
  components: Component[], 
  customComponents: any[] = [],
  pageTitle: string = 'Generated Page'
): string => {
  const componentHTML = components.map(component => {
    const customComponent = customComponents.find(c => c.type === component.type);
    
    if (customComponent) {
      let html = customComponent.html;
      Object.entries(component.props).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      });
      return html;
    }
    
    // Generate HTML for built-in components
    return generateBuiltInComponentHTML(component);
  }).join('\n');

  const customCSS = customComponents
    .map(comp => comp.css)
    .filter(Boolean)
    .join('\n');

  const customJS = customComponents
    .map(comp => comp.js)
    .filter(Boolean)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${customCSS}
    /* Additional production styles */
    body { margin: 0; padding: 0; }
    .page-container { min-height: 100vh; }
  </style>
</head>
<body>
  <div class="page-container">
    ${componentHTML}
  </div>
  <script>
    ${customJS}
  </script>
</body>
</html>`;
};

const generateBuiltInComponentHTML = (component: Component): string => {
  // This would contain the HTML generation logic for built-in components
  // Implementation would match the ComponentRenderer logic
  switch (component.type) {
    case 'hero':
      return `<div class="hero-section" style="background-image: url(${component.props.backgroundImage})">
        <h1>${component.props.title}</h1>
        <p>${component.props.subtitle}</p>
        <a href="${component.props.buttonLink}" class="btn">${component.props.buttonText}</a>
      </div>`;
    
    case 'text':
      return `<div class="text-component">
        <p style="color: ${component.props.color}">${component.props.content}</p>
      </div>`;
    
    // Add other component types...
    default:
      return `<div class="unknown-component">Component: ${component.type}</div>`;
  }
};

export const exportPageAsJSON = (
  components: Component[],
  customComponents: any[],
  metadata: any = {}
) => {
  return JSON.stringify({
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    metadata,
    components,
    customComponents
  }, null, 2);
};

export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};