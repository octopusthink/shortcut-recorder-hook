import { ERROR_MESSAGES, MOD_KEYS_MAP, MOD_KEYS_ORDER } from "./constants";
import { ShortcutRecorderError, ShortcutRecorderErrorCode } from "./types";

export const isModKey = (key: string): boolean => MOD_KEYS_MAP.hasOwnProperty(key);

// Helper function to set formatted error
export const getFormattedError = (code: ShortcutRecorderErrorCode, params: Record<string, any> = {}): ShortcutRecorderError => {
    let message = ERROR_MESSAGES[code];

    // Replace placeholders with actual values
    Object.keys(params).forEach(key => {
        message = message.replace(`{${key}}`, params[key]);
    });

    return { code, message };
};

export const getOrderedKeys = (nonModKey: string | undefined, modKeys: Set<string> | undefined): string[] => {
    const orderedKeys: string[] = [];

    if (modKeys) {
        MOD_KEYS_ORDER.forEach(modifier => {
            if (modKeys && modKeys?.has(modifier)) {
                orderedKeys.push(modifier);
            }
        });
    }

    if (nonModKey) orderedKeys.push(nonModKey);

    return orderedKeys;

}

export const isMacOS = (): boolean => {
    const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;

    if (uaData?.platform) {
      return uaData.platform === 'macOS';
    }

    if (navigator.platform && navigator.platform.toLowerCase().includes('mac')) {
      return true;
    }

    return /mac/i.test(navigator.userAgent);

  };
