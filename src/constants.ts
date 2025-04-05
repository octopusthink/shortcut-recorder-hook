import { ShortcutRecorderErrorCode } from "./types";


export const ERROR_MESSAGES: Record<ShortcutRecorderErrorCode, string> = {
    [ShortcutRecorderErrorCode.NONE]: '',
    [ShortcutRecorderErrorCode.MAX_MOD_KEYS_EXCEEDED]: 'Maximum {maxModKeys} modifier key(s) allowed',
    [ShortcutRecorderErrorCode.MOD_KEY_NOT_ALLOWED]: 'Modifier Key "{modKey}" is not allowed',
    [ShortcutRecorderErrorCode.KEY_NOT_ALLOWED]: 'Key "{keycode}" is not allowed',
    [ShortcutRecorderErrorCode.MIN_MOD_KEYS_REQUIRED]: 'Minimum {minModKeys} modifier key(s) required',
    [ShortcutRecorderErrorCode.SHORTCUT_NOT_ALLOWED]: 'Key combination "{shortcut}" not allowed',
};

// Used for treating both right and left modifier keys the same
export const MOD_KEYS_MAP: Record<string, string> = {
    ControlLeft: 'Control',
    ControlRight: 'Control',
    ShiftLeft: 'Shift',
    ShiftRight: 'Shift',
    AltLeft: 'Alt',
    AltRight: 'Alt',
    MetaLeft: 'Meta',
    MetaRight: 'Meta',
    Control: 'Control',
    Meta: 'Meta',
    Shift: 'Shift',
    Alt: 'Alt'
};

// defines in the order in which mod keys are displayed
export const MOD_KEYS_ORDER: string[] = ['Control', 'Shift', 'Alt', 'Meta'];