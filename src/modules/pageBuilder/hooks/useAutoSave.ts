// Auto-save hook for production reliability
import { useEffect, useRef } from 'react';
import { Component } from '../types/cms';
import { EDITOR_CONFIG } from '../utils/constants';

interface UseAutoSaveProps {
  components: Component[];
  customComponents: any[];
  onSave: (data: { components: Component[]; customComponents: any[] }) => void;
  enabled?: boolean;
}

export const useAutoSave = ({ 
  components, 
  customComponents, 
  onSave, 
  enabled = true 
}: UseAutoSaveProps) => {
  const lastSaveRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify({ components, customComponents });
    
    if (currentData !== lastSaveRef.current) {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for auto-save
      timeoutRef.current = setTimeout(() => {
        onSave({ components, customComponents });
        lastSaveRef.current = currentData;
        console.log('Auto-saved at:', new Date().toLocaleTimeString());
      }, EDITOR_CONFIG.autoSaveInterval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [components, customComponents, onSave, enabled]);

  // Manual save function
  const saveNow = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onSave({ components, customComponents });
    lastSaveRef.current = JSON.stringify({ components, customComponents });
  };

  return { saveNow };
};