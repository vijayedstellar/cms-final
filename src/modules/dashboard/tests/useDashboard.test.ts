import { renderHook, act } from '@testing-library/react';
import { useDashboard } from '../hooks/useDashboard';

describe('useDashboard Hook', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useDashboard());
    
    expect(result.current.activeSection).toBe('pages');
    expect(result.current.isSidebarCollapsed).toBe(false);
    expect(typeof result.current.setActiveSection).toBe('function');
    expect(typeof result.current.toggleSidebar).toBe('function');
  });

  test('should initialize with custom initial section', () => {
    const { result } = renderHook(() => useDashboard('components'));
    
    expect(result.current.activeSection).toBe('components');
  });

  test('should update active section', () => {
    const { result } = renderHook(() => useDashboard());
    
    act(() => {
      result.current.setActiveSection('settings');
    });
    
    expect(result.current.activeSection).toBe('settings');
  });

  test('should toggle sidebar collapse state', () => {
    const { result } = renderHook(() => useDashboard());
    
    expect(result.current.isSidebarCollapsed).toBe(false);
    
    act(() => {
      result.current.toggleSidebar();
    });
    
    expect(result.current.isSidebarCollapsed).toBe(true);
    
    act(() => {
      result.current.toggleSidebar();
    });
    
    expect(result.current.isSidebarCollapsed).toBe(false);
  });
});