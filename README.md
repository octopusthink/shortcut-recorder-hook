# use-shortcut-recorder

A React hook for capturing and recording keyboard shortcuts in your applications. Designed specifically for seamless integration with Webview-based desktop frameworks like Electron, Tauri, and more, making shortcut registration effortless.

## Demo

https://stackblitz.com/edit/react-brtovrsp?file=Shortcut.jsx

## Installation

```bash
npm install use-shortcut-recorder
```

## Usage

```
import { useShortcutRecorder } from 'use-shortcut-recorder';

function ShortcutInput() {

  // Keys Formatter for display
  const formatKeys = (keys: string[]) => {
    const keyMap: Record<string, string> = {
        Control: 'CTRL',
        Meta: navigator.platform.includes('Mac') ? 'CMD' : 'WIN',
        Alt: navigator.platform.includes('Mac') ? 'OPTION' : 'ALT',
        ArrowUp: '↑',
        ArrowDown: '↓',
        ArrowLeft: '←',
        ArrowRight: '→',
        ' ': 'SPACE',
        Escape: 'ESC'
      };
    
    return keys.map(key => keyMap[key] || key.toUpperCase()).join(' + ');

  };
  
  // Initialize the hook with an onChange handler
  const {
    savedShortcut,
    isRecording,
    error,
    startRecording,
    stopRecording,
    resetRecording,
    inputProps
  } = useShortcutRecorder({
    keyFormatter: formatKeys,
    onChange: (newShortcut: string[]) => {
      console.log('Shortcut changed:', newShortcut);
    },
    maxKeys: 2
  });

  return (
    <div>
      <label htmlFor="shortcut-input">Keyboard Shortcut:</label>
      
      <input
        id="shortcut-input"
        type="text"
        className={`shortcut-input ${isRecording ? 'recording' : ''} ${error ? 'error' : ''}`}
        placeholder= {isRecording ? 'Key Recording Started..': 'Click to Record Shortcut..'}
        {...inputProps}
      />
      
      {error && <div>{error}</div>}
      
      
      {savedShortcut && (
        <div>
          Current shortcut: <strong>{formatKeys(savedShortcut)}</strong>
        </div>
      )}
    </div>
  );
}

export default ShortcutInput;
```
## Options

| Option      | Type     | Default                        | Description                          |
|------------|---------|--------------------------------|--------------------------------------|
| onChange   | Function | `() => {}`                     | Callback when shortcut changes      |
| keyFormatter | Function | `(keys) => keys.join(' + ')`  | Formats the shortcut keys for display |
| maxKeys    | Number   | `4`                            | Maximum number of keys allowed      |

## Return Values

| Property        | Type      | Description                                    |
|---------------|----------|------------------------------------------------|
| savedShortcut | Array    | The current saved shortcut keys                |
| isRecording   | Boolean  | Whether the hook is currently recording       |
| error         | String   | Any validation errors                          |
| startRecording | Function | Start recording a new shortcut                |
| stopRecording | Function | Stop recording without saving                  |
| resetRecording | Function | Reset the current recording                   |
| inputProps    | Object   | Props to spread on an input element            |

