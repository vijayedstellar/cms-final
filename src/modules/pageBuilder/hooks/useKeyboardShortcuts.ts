// Keyboard shortcuts for professional UX
import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
  onDelete?: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onUndo,
  onRedo,
  onSave,
  onPreview,
  onDelete,
  enabled = true
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, key } = event;
      const isModifierPressed = ctrlKey || metaKey;

      if (!isModifierPressed) return;

      switch (key.toLowerCase()) {
        case 'z':
          if (shiftKey && onRedo) {
            event.preventDefault();
            onRedo();
          } else if (!shiftKey && onUndo) {
            event.preventDefault();
            onUndo();
          }
          break;
        
        case 'y':
          if (onRedo) {
            event.preventDefault();
            onRedo();
          }
          break;
        
        case 's':
          if (onSave) {
            event.preventDefault();
            onSave();
          }
          break;
        
        case 'p':
          if (onPreview) {
            event.preventDefault();
            onPreview();
          }
          break;
        
        case 'delete':
        case 'backspace':
          if (onDelete) {
            event.preventDefault();
            onDelete();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onSave, onPreview, onDelete, enabled]);
};