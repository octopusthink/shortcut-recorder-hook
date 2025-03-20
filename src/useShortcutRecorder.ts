import { useState, useEffect } from 'react';

interface ShortcutRecorderOptions {
  onChange?: (keys: string[]) => void;
  keyFormatter?: (keys: string[]) => string;
  maxKeys?: number;
}

interface ShortcutRecorderResult {
  savedShortcut: string[];
  isRecording: boolean;
  error: string;
  startRecording: () => void;
  stopRecording: () => void;
  resetRecording: () => void;
  inputProps: {
    onFocus: () => void;
    onClick: () => void;
    onBlur: () => void;
    value: string;
    readOnly: boolean;
  };
}

/**
 * A React hook that transforms any input into a shortcut recorder
 * @param options Configuration options
 * @returns Methods and properties for the shortcut recorder
 */
const useShortcutRecorder = ({
  onChange = () => {},
  keyFormatter = (keys: string[]) => keys.join(' + '),
  maxKeys = 4
}: ShortcutRecorderOptions = {}): ShortcutRecorderResult => {

  if (maxKeys > 4 || maxKeys < 1) {
    maxKeys = 4;
  }

  const [shortcut, setShortcut] = useState<string[]>([]);
  const [savedShortcut, setSavedShortcut] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  // List of modifier keys in the specific order we want
  const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta'];
  
  // Check if the key is a modifier key
  const isModifierKey = (key: string): boolean => modifierKeys.includes(key);
  
  // Reset recording state
  const resetRecording = (): void => {
    setShortcut([]);
    setActiveKeys(new Set());
  };
 
  // Handle key down event
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (!isRecording) return;
    
    e.preventDefault();
    
    // Get the pressed key
    const key = e.key;
    
    // If Escape key is pressed, cancel recording
    if (key === 'Escape') {
      setIsRecording(false);
      resetRecording();
      return;
    }
    
    // Create a new set of active keys based on the current event state
    const newActiveKeys = new Set<string>();
    
    // Add the specific key that was pressed
    newActiveKeys.add(key);
    
    // Add modifier keys based on the event properties
    if (e.ctrlKey) newActiveKeys.add('Control');
    if (e.shiftKey) newActiveKeys.add('Shift');
    if (e.altKey) newActiveKeys.add('Alt');
    if (e.metaKey) newActiveKeys.add('Meta');
    
    // If we have too many keys, don't add more
    if (newActiveKeys.size > maxKeys) {
      const err = `Maximum ${maxKeys} keys allowed`;
      setError(err);
      resetRecording();
      return;
    }
    
    // Update active keys and format the shortcut
    setActiveKeys(newActiveKeys);
    updateShortcutFromActiveKeys(newActiveKeys);
  };
  
  // Handle key up event
  const handleKeyUp = (e: KeyboardEvent): void => {
    if (!isRecording) return;
    
    // Get the released key
    const key = e.key;
    
    // If Escape key is released, we don't need to do anything
    if (key === 'Escape') return;
    
    // Create a new set based on current active keys
    const currentActiveKeys = new Set(activeKeys);
    
    // Simply remove the released key
    currentActiveKeys.delete(key);
    
    // Check if the released key is a non-modifier
    const isNonModifier = !isModifierKey(key);
    
    // Update active keys
    setActiveKeys(currentActiveKeys);
    
    // If a non-modifier key was released and we have a shortcut
    if (isNonModifier && shortcut.length > 0) {
      const isValid = validateShortcut(shortcut);
      if (isValid) {
        // Save the shortcut and end recording
        onChange(shortcut);
        setSavedShortcut(shortcut);
        setIsRecording(false);
      } else {
        resetRecording();
      }
    } else {
      // Update the shortcut with remaining active keys
      updateShortcutFromActiveKeys(currentActiveKeys);
    }
  };
  
  // Update shortcut from the set of active keys
  const updateShortcutFromActiveKeys = (keys: Set<string>): void => {
    if (keys.size === 0) {
      resetRecording();
      return;
    }
    
    // Create an ordered array of keys based on the required order
    const orderedKeys: string[] = [];
    
    // First add modifier keys in the specific order
    modifierKeys.forEach(modifier => {
      if (keys.has(modifier)) {
        orderedKeys.push(modifier);
      }
    });
    
    // Then add non-modifier keys
    Array.from(keys).forEach(key => {
      if (!isModifierKey(key)) {
        orderedKeys.push(key);
      }
    });
    
    // Update the shortcut
    setShortcut(orderedKeys);
  };
  
  // Validate the shortcut
  const validateShortcut = (keys: string[]): boolean => {
    if (!keys || keys.length === 0) return false;
    
    // Check if there are too many keys
    if (keys.length > maxKeys) {
      setError(`Maximum ${maxKeys} keys allowed`);
      return false;
    }
    
    // Count non-modifier keys
    const nonModifierKeys = keys.filter(k => !isModifierKey(k));
    
    // Require exactly one non-modifier key
    if (nonModifierKeys.length !== 1) {
      setError('Shortcut must contain exactly one non-modifier key');
      return false;
    }
    
    // Check if the last key is a modifier
    const lastKey = keys[keys.length - 1];
    const isLastKeyModifier = isModifierKey(lastKey);
    
    // The last key must be non-modifier
    if (isLastKeyModifier) {
      setError('Last key must be a non-modifier key');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const startRecording = (): void => {
    setIsRecording(true);
    setError('');
    resetRecording();
  };
  
  const stopRecording = (): void => {
    setIsRecording(false);
    setError('');
  };

  // Event handlers to attach to an input element
  const inputProps = {
    onFocus: startRecording,
    onClick: startRecording,
    onBlur: () => {
      stopRecording();
      resetRecording();
    },
    value: isRecording ? keyFormatter(shortcut): keyFormatter(savedShortcut),
    readOnly: true,
  };

  // Set up and clean up global event listeners
  useEffect(() => {
    const handleKeyDownWrapper = (e: KeyboardEvent): void => {
      if (isRecording) {
        handleKeyDown(e);
      }
    };
    
    const handleKeyUpWrapper = (e: KeyboardEvent): void => {
      if (isRecording) {
        handleKeyUp(e);
      }
    };
    
    document.addEventListener('keydown', handleKeyDownWrapper);
    document.addEventListener('keyup', handleKeyUpWrapper);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDownWrapper);
      document.removeEventListener('keyup', handleKeyUpWrapper);
    };
  }, [isRecording, activeKeys, shortcut, error]);

  return {
    savedShortcut,
    isRecording,
    error,
    startRecording,
    stopRecording,
    resetRecording,
    inputProps
  };
};

export default useShortcutRecorder;