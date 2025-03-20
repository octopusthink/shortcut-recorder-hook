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
declare const useShortcutRecorder: ({ onChange, keyFormatter, maxKeys }?: ShortcutRecorderOptions) => ShortcutRecorderResult;
export default useShortcutRecorder;
