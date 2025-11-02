# Neural Recordings Audio Setup

## Overview
The terminal now includes a neural recording player (`brainRecordings.exe`) that plays actual audio files when accessed through the employee portal.

## File Structure Needed

Create a `neural_recordings` folder in your desktopTest directory:

```
desktopTest/
├── neural_recordings/
│   ├── session_042.wav
│   ├── session_038.wav
│   └── session_031.wav
├── js/
├── Pictures/
└── desktop_dev.html
```

## Audio Files Required

The system expects 3 audio files (but you can adjust in the code):

1. **session_042.wav**
   - "High stress markers, elevated theta waves"
   - Duration: ~3:47

2. **session_038.wav**
   - "Subvocalization detected during session"
   - Duration: ~4:12

3. **session_031.wav**
   - "Baseline neural patterns, pre-symptom onset"
   - Duration: ~2:58

## How to Use

1. Place your sonified mouse neural data WAV files in `desktopTest/neural_recordings/`
2. Rename them to match the filenames above (or update the code)
3. The player will automatically load and play them when the user runs:
   ```
   cd ~/megacorp/research
   ./brainRecordings.exe        # Lists available recordings
   ./brainRecordings.exe 1      # Plays recording 1
   stop                         # Stops playback
   ```

## How It Works

1. User logs into employee portal with `s4ngu1s` password
2. Navigates to `~/megacorp/research/`
3. Discovers `brainRecordings.exe*` in the file listing
4. Runs the executable to see available recordings
5. Runs with recording ID to play actual audio
6. Terminal shows "analysis" of the neural patterns while audio plays
7. User can type `stop` to end playback

## Customization

To add more recordings or change details, edit the `recordings` array in `TerminalWindow.js` around line 390:

```javascript
const recordings = [
  {
    id: 1,
    filename: "2024-01-08_session_042.wav",
    duration: "3:47",
    date: "2024-01-08",
    notes: "High stress markers, elevated theta waves",
    audioPath: "./neural_recordings/session_042.wav"
  },
  // Add more recordings here...
];
```

## Story Impact

This creates a deeply unsettling moment where:
- The player discovers MegaCorp has been recording their neural activity
- They hear eerie, alien sounds (actual neural data sonification)
- The terminal shows analysis revealing "subvocalization" and stress markers
- Confirms the device is monitoring thoughts/internal speech
- Makes the surveillance feel visceral and invasive
