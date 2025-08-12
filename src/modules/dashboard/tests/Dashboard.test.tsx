import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '../components/Dashboard';

// Mock the useDashboard hook
const mockSetActiveSection = jest.fn();
const mockToggleSidebar = jest.fn();

jest.mock('../hooks/useDashboard', () => ({
  useDashboard: () => ({
    activeSection: 'pages',
    isSidebarCollapsed: false,
    setActiveSection: mockSetActiveSection,
    toggleSidebar: mockToggleSidebar
  })
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with all main components', () => {
    render(<Dashboard />);
    
    // Check if main elements are present
    expect(screen.getByText('CMS Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('navigation items are clickable and call setActiveSection', () => {
    render(<Dashboard />);
    
    const componentsNavItem = screen.getByRole('button', { name: /components/i });
    fireEvent.click(componentsNavItem);
    
    expect(mockSetActiveSection).toHaveBeenCalledWith('components');
  });

  test('sidebar toggle button calls toggleSidebar', () => {
    render(<Dashboard />);
    
    const toggleButtons = screen.getAllByLabelText('Toggle sidebar');
    fireEvent.click(toggleButtons[0]);
    
    expect(mockToggleSidebar).toHaveBeenCalled();
  });

  test('displays correct content based on active section', () => {
    render(<Dashboard />);
    
    // Should show Pages content by default (mocked activeSection is 'pages')
    expect(screen.getByText('Manage your website pages and content')).toBeInTheDocument();
  });
});