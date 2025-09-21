export enum ShortcutRecorderErrorCode {
  NONE = 'NONE',
  MAX_MOD_KEYS_EXCEEDED = 'MAX_MOD_KEYS_EXCEEDED',
  MOD_KEY_NOT_ALLOWED = 'MOD_KEY_NOT_ALLOWED',
  KEY_NOT_ALLOWED = 'KEY_NOT_ALLOWED',
  MIN_MOD_KEYS_REQUIRED = 'MIN_MOD_KEYS_REQUIRED',
  SHORTCUT_NOT_ALLOWED = 'SHORTCUT_NOT_ALLOWED',
}

export interface ShortcutRecorderError {
  code: ShortcutRecorderErrorCode;
  message: string;
}

export interface ShortcutRecorderOptions {
  onChange?: (keys: string[]) => void;
  excludedShortcuts?: string[][];
  excludedModKeys?: string[];
  excludedKeys?: string[];
  minModKeys?: number;
  maxModKeys?: number;
  allowEscapeKey?: boolean;
}

export interface ShortcutRecorderReturn {
  shortcut: string[];
  savedShortcut: string[];
  isRecording: boolean;
  error: ShortcutRecorderError;
  startRecording: () => void;
  stopRecording: () => void;
  resetRecording: () => void;
  clearLastRecording: () => void;
}
