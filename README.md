# useShortcutRecorder

A React hook for effortlessly capturing and validating keyboard shortcut keys.

- Record keyboard shortcuts with modifier keys (Ctrl, Alt, Shift, Meta/Command)
- Customizable validation rules:
  - Min/max number of modifier keys
  - Excluded keys and modifiers
  - Excluded shortcut combinations

## Demo

https://stackblitz.com/edit/react-brtovrsp?file=Shortcut.jsx

## Installation

```bash
npm install use-shortcut-recorder
```

## Usage

```jsx

import { useShortcutRecorder } from 'use-shortcut-recorder';


function ShortcutInput() {

  const {
    shortcut,
    savedShortcut,
    isRecording,
    error,
    startRecording,
    stopRecording,
    resetRecording,
    clearLastRecording,
  } = useShortcutRecorder({
    onChange: (newShortcut) => {
      console.log('Shortcut changed:', newShortcut);
    },
    excludedKeys: ['KeyA', 'KeyB'], 
    excludedShortcuts: [
        ['Alt', 'KeyM'],
        ['Meta', 'KeyZ']
    ],
    excludedModKeys: ['Control'],
    maxModKeys: 3,
    minModKeys: 1,
  } );

  return (
    <div>
      <label htmlFor="shortcut-input">Enter Shortcut:</label>

      <input
        id="shortcut-input"
        type="text"
        className='shortcut-input'
        placeholder={
          isRecording ? 'Key Recording Started..' : 'Click to Record Shortcut..'
        }
        onFocus={startRecording}
        onClick={startRecording}
        onBlur={() => stopRecording()}
        value={isRecording 
          ? shortcut.join(' + ') 
          : savedShortcut.join(' + ')}
        readOnly={true}
      />

      {error && <div>{error.message}</div>}

      {savedShortcut && (
        <div>
          Saved Shortcut: <strong>{savedShortcut.join(' + ')}</strong>
        </div>
      )}
       <button onClick={clearLastRecording}>Reset</button>
    </div>
  );
}


```

## API Reference

### Hook Options

The `useShortcutRecorder` hook accepts a configuration object with the following properties:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onChange` | `(keys: string[]) => void` | `() => {}` | Callback function called when a valid shortcut is recorded |
| `excludedShortcuts` | `string[][]` | `[[]]` | Array of shortcut combinations to exclude |
| `excludedModKeys` | `string[]` | `[]` | Array of modifier keys to exclude |
| `excludedKeys` | `string[]` | `[]` | Array of non-modifier keys to exclude |
| `minModKeys` | `number` | `0` | Minimum number of modifier keys required |
| `maxModKeys` | `number` | `4` | Maximum number of modifier keys allowed |

### Return Values

The hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `shortcut` | `string[]` | Current shortcut being recorded |
| `savedShortcut` | `string[]` | Last successfully recorded shortcut |
| `isRecording` | `boolean` | Whether the recorder is currently active |
| `error` | `ShortcutRecorderError` | Current error state |
| `startRecording` | `() => void` | Function to start recording |
| `stopRecording` | `() => void` | Function to stop recording |
| `resetRecording` | `() => void` | Function to reset current recording |
| `clearLastRecording` | `() => void` | Function to clear saved shortcut |

### Error Codes

The `error` object contains a code and message. Possible error codes:

| Error Code | Description |
|------------|-------------|
| `NONE` | No error |
| `MAX_MOD_KEYS_EXCEEDED` | Too many modifier keys used |
| `MIN_MOD_KEYS_REQUIRED` | Not enough modifier keys used |
| `MOD_KEY_NOT_ALLOWED` | Modifier key is in the excluded list |
| `KEY_NOT_ALLOWED` | Non-modifier key is in the excluded list |
| `SHORTCUT_NOT_ALLOWED` | Shortcut combination is in the excluded list |


## Keyboard Code Reference

This hook uses [keyboard event codes](https://www.toptal.com/developers/keycode/table) for key identification. For consistency and cross-browser compatibility, all left/right variations of modifier keys (e.g., `ShiftLeft`/`ShiftRight`, `ControlLeft`/`ControlRight`) are normalized to their base name (e.g., `Shift`, `Control`). Specifically, both `MetaLeft`/`MetaRight` and the now-deprecated `OSLeft`/`OSRight` are mapped to `Meta` for the Windows/Command key.


## License

MIT
