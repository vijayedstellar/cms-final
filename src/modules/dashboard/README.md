# Dashboard Module

A comprehensive dashboard module for CMS applications with modern UI components and responsive design.

## Overview

The Dashboard module provides a complete admin interface for content management systems, featuring:

- **Modern Design**: Clean, professional interface suitable for CMS admin panels
- **Responsive Layout**: Works seamlessly across desktop, tablet, and mobile devices
- **Modular Architecture**: Self-contained components that can be easily integrated
- **TypeScript Support**: Full type safety and intellisense support
- **Testable**: Comprehensive test coverage with Jest and React Testing Library

## Features

### Core Components
- **Dashboard**: Main container component that orchestrates the entire interface
- **Header**: Top navigation bar with search, notifications, and user profile
- **Sidebar**: Collapsible navigation menu with active state indication
- **MainContent**: Dynamic content area that renders different views
- **PageView**: Interface for managing website pages and content
- **ComponentView**: Interface for managing reusable components and templates
- **SettingsView**: Comprehensive settings panel with multiple tabs

### Navigation Sections
- **Pages**: Manage website pages with status tracking, search, and filters
- **Components**: Organize reusable UI components with version control
- **Settings**: Configure system preferences across multiple categories

### State Management
- React hooks for local state management
- Custom `useDashboard` hook for centralized dashboard state
- No external state management dependencies required

## Installation & Integration

### Basic Integration
```javascript
import { Dashboard } from './modules/dashboard';

function App() {
  return <Dashboard />;
}
```

### Individual Components
```javascript
import { 
  Header, 
  Sidebar, 
  PageView 
} from './modules/dashboard';

// Use components individually in your own layout
```

### Custom Hook Usage
```javascript
import { useDashboard } from './modules/dashboard';

function CustomDashboard() {
  const {
    activeSection,
    isSidebarCollapsed,
    setActiveSection,
    toggleSidebar
  } = useDashboard('pages');
  
  // Your custom dashboard implementation
}
```

## API Reference

### Components

#### Dashboard
Main dashboard component that provides the complete interface.
```typescript
<Dashboard />
```

#### Header
Top navigation bar component.
```typescript
<Header 
  onMenuClick={() => void}
  isSidebarCollapsed={boolean}
/>
```

#### Sidebar
Navigation sidebar component.
```typescript
<Sidebar
  activeSection={string}
  onSectionChange={(section: string) => void}
  isCollapsed={boolean}
  onToggleCollapse={() => void}
/>
```

### Hooks

#### useDashboard
Custom hook for dashboard state management.
```typescript
const {
  activeSection,
  isSidebarCollapsed,
  setActiveSection,
  toggleSidebar
} = useDashboard(initialSection?: SectionType);
```

### Services

#### DashboardService
Service class for API interactions.
```typescript
import { dashboardService } from './modules/dashboard';

const stats = await dashboardService.getDashboardStats();
const userInfo = await dashboardService.getUserInfo();
```

## Customization

### Styling
The module uses Tailwind CSS for styling. You can customize the appearance by:

1. **Color Scheme**: Modify the color classes in components
2. **Typography**: Update font classes and sizing
3. **Spacing**: Adjust padding and margin classes
4. **Breakpoints**: Customize responsive behavior

### Navigation
Add new navigation items by modifying `utils/navigation.ts`:

```typescript
export const navigationItems: NavigationItem[] = [
  // existing items...
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'BarChart',
    path: '/dashboard/analytics'
  }
];
```

### Content Views
Create new content views by:

1. Adding a new component in `components/`
2. Updating the `MainContent` component to include your view
3. Adding the navigation item to `utils/navigation.ts`

## Testing

The module includes comprehensive tests:

```bash
# Run all dashboard module tests
npm test -- --testPathPattern=dashboard

# Run specific test files
npm test Dashboard.test.tsx
npm test useDashboard.test.ts
```

### Test Coverage
- Component rendering and interaction
- Hook state management
- Navigation functionality
- Service layer methods

## File Structure

```
dashboard/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard container
│   ├── Header.tsx       # Top navigation bar
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── MainContent.tsx  # Content area router
│   ├── PageView.tsx     # Pages management interface
│   ├── ComponentView.tsx# Components management interface
│   └── SettingsView.tsx # Settings interface
├── services/           # API services and business logic
│   └── dashboardService.ts
├── hooks/              # Custom React hooks
│   └── useDashboard.ts
├── utils/              # Utility functions
│   └── navigation.ts
├── types/              # TypeScript definitions
│   └── index.ts
├── tests/              # Unit tests
│   ├── Dashboard.test.tsx
│   └── useDashboard.test.ts
├── index.ts            # Module exports
└── README.md           # Documentation
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

### Peer Dependencies
- React 18+
- React DOM 18+
- Lucide React (for icons)

### Development Dependencies
- TypeScript 4.5+
- Tailwind CSS 3+
- Jest (for testing)
- React Testing Library

## Contributing

When contributing to this module:

1. **Follow the established patterns** for component structure and naming
2. **Add tests** for new functionality
3. **Update TypeScript types** as needed
4. **Maintain responsive design** principles
5. **Document new features** in this README

## Performance Considerations

- Components are optimized with React.memo where appropriate
- State updates are batched using React's automatic batching
- Icons are loaded on-demand from Lucide React
- No heavy external dependencies included

## Accessibility

The module follows web accessibility standards:

- Proper ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility
- Focus management

## License

This module is part of the larger CMS application and follows the same licensing terms.