# StoryPortal Desktop - Recent Changes & Usage Guide

## Summary of Changes Made

### 1. Password Discovery System (Enhanced)
**Changed:** Moved the employee portal password from a simple terminal note to a more realistic discovery path.

**New Discovery Flow:**
1. **Email (Lookout app)** - Added "RE: Portal Login Issue - RESOLVED" email from `support@megacorp.com`
   - Email accidentally includes internal IT discussion
   - Shows employee password: `s4ngu1s`
   - Dated: Jan 2, 2024

2. **Notes App** - Added "Strange Email from MegaCorp" note
   - Protagonist documents finding the leaked password
   - Shows internal debate about using it
   - Explains that `portal_connect.sh` supports "multiple authentication levels"
   - References the email discovery

3. **Terminal notes** - Updated `~/documents/personal/notes.txt` to cross-reference the Notes app

4. **Portal script** - Updated `portal_connect.sh` header comment to show:
   ```bash
   # Supports multiple authentication levels (subject, employee, admin)
   ```

### 2. Testing Agreement Contract (Added)
**New File:** Added `testing_agreement.pdf` to subject portal at `/subject/docs/`

**Contents:** Sanitized version of the testing contract showing:
- Basic program details (12 weeks, $2,400)
- Standard terms and conditions
- Subject can withdraw at any time
- MegaCorp maintains insurance

**Purpose:** Contrasts with the employee portal's darker `contract_subject47.pdf` which reveals:
- No-disclosure clause
- Liability waiver
- Medical records become MegaCorp property
- Early termination forfeits ALL compensation

### 3. Welcome Email (Added)
**New Email:** "Welcome to the Product X Partnership Program!" in Lookout inbox
- From: `testing@megacorp.com`
- Dated: Dec 15, 2023 (early in program)
- Provides terminal access instructions
- Shows subject portal credentials
- Guides user to terminal for portal access

### 4. Terminal Landing Paths (Improved)
**Subject Portal:**
- Changed landing from `~/subject/home` to `~/subject/`
- Updated login message: "Type 'ls' to view available resources"
- Users can immediately see both `home/` and `docs/` directories

**Employee Portal:**
- Changed landing from `~/megacorp/internal` to `~/megacorp/`
- Updated login message: "Type 'ls' to view available directories"
- Users can see both `internal/` and `research/` directories at once

### 5. Neural Recording Player (NEW FEATURE)
**Location:** `~/megacorp/research/brainRecordings.exe` (employee portal only)

**Capabilities:**
- Plays actual WAV audio files (sonified neural data)
- Live ASCII waveform visualization (animated)
- Real-time progress bar with timestamps
- Dynamic neural pattern analysis
- Full playback controls

**Features Implemented:**
- Live animated waveform: `▂▃▅▇█▇▅▃▂▃▅▇█▇▅▃▂` (updates every 150ms)
- Progress bar: `[████████░░░░░░░░] 2:15 / 3:47` (updates every 100ms)
- Dynamic neural analysis that escalates as recording plays:
  - Theta waves: ELEVATED → CRITICAL → DANGEROUS → EXTREME
  - Delta patterns: NORMAL → ABNORMAL → CRITICAL
  - Heart rate: 138 BPM → 151 BPM
- Playback controls: `pause`, `resume`, `stop`, `status`

### 6. Terminal Startup Message (Added)
Added case-sensitivity warning:
```
MegaCorp Secure Terminal v3.9.2
© 2024 MegaCorp Advanced Technologies

Type "help" for available commands.
Note: Terminal is case-sensitive
```

---

## Brain Recordings Player - Usage Guide

### Setup Instructions

#### 1. Create Audio Folder
Create this directory structure:
```
desktopTest/
├── neural_recordings/
│   ├── session_042.wav
│   ├── session_038.wav
│   └── session_031.wav
```

#### 2. Add Your Audio Files
Place your sonified mouse neural data WAV files in the `neural_recordings/` folder.

**Current Configuration:**
- **session_042.wav** - "High stress markers, elevated theta waves" (~3:47)
- **session_038.wav** - "Subvocalization detected during session" (~4:12)
- **session_031.wav** - "Baseline neural patterns, pre-symptom onset" (~2:58)

#### 3. Rename Files (if needed)
Either rename your files to match the names above, OR edit the `recordings` array in `TerminalWindow.js` (line ~490-515) to match your filenames.

### Player Commands

#### List Available Recordings
```bash
~/megacorp/research $ ./brainRecordings.exe

Available neural recordings for Subject #47:
[1] 2024-01-08_session_042.wav (3:47) - High stress markers...
[2] 2024-01-05_session_038.wav (4:12) - Subvocalization detected...
[3] 2023-12-28_session_031.wav (2:58) - Baseline neural patterns...

Usage: ./brainRecordings.exe [recording_id]
```

#### Play a Recording
```bash
~/megacorp/research $ ./brainRecordings.exe 1

♪ Now Playing: 2024-01-08_session_042.wav
Date: 2024-01-08
Duration: 3:47

[PLAYING] ▂▃▅▇█▇▅▃▂▃▅▇█▇▅▃▂▃▅▇█▇▅▃▂▃▅▇█▇▅▃▂

Initializing neural pattern analysis...

Commands: 'status' (live visualization) | 'pause' | 'resume' | 'stop'
```

#### View Live Status/Visualization
```bash
~/megacorp/research $ status

♪ Now Playing: 2024-01-08_session_042.wav

▅▇█▇▅▃▂▃▅▇█▇▅▃▂▃▅▇█▇▅▃▂▃▅▇█▇▅▃▂▃▅▇█▇▅▃

[████████████░░░░░░░░░░░░░░░░░░] 2:15 / 3:47

Neural Pattern Analysis:
- Theta waves: CRITICAL
- Delta patterns: ABNORMAL
- Cardiac sync: 145 BPM

[PLAYING]
```

#### Pause/Resume Playback
```bash
~/megacorp/research $ pause
Playback paused.
Type 'resume' to continue.

~/megacorp/research $ resume
Playback resumed.
```

#### Stop Playback
```bash
~/megacorp/research $ stop

Playback stopped.
Closed: 2024-01-08_session_042.wav
```

### How It Works

1. **Audio Loading:** Uses HTML5 Audio API to load WAV files from the `neural_recordings/` folder
2. **Waveform Animation:** Cycles through 8 ASCII patterns every 150ms
3. **Progress Tracking:** Updates playback position every 100ms
4. **Neural Analysis:** Changes based on playback progress:
   - 0-20%: ELEVATED theta, NORMAL delta, 138 BPM
   - 20-40%: CRITICAL theta, ABNORMAL delta, 142 BPM
   - 40-60%: CRITICAL theta, ABNORMAL delta, 145 BPM
   - 60-80%: DANGEROUS theta, CRITICAL delta, 148 BPM
   - 80-100%: EXTREME theta, CRITICAL delta, 151 BPM

### Adding More Recordings

To add additional recordings, edit `TerminalWindow.js` around line 490:

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
  {
    id: 4,
    filename: "2024-01-12_session_050.wav",
    duration: "4:30",
    date: "2024-01-12",
    notes: "Your description here",
    audioPath: "./neural_recordings/your_file.wav"
  }
];
```

### Supported Audio Formats
- **WAV** (recommended for neural data)
- MP3
- OGG
- Any format supported by HTML5 Audio in modern browsers

---

## Story Flow

### For Players

**Discovery Path:**
1. Start → Open Terminal
2. Navigate to `~/documents/ProductXInfo/`
3. Read `welcome_email.txt` (mentions portal access)
4. Run `./portal_connect.sh`
5. Login as subject: `subject47` / `productx2024`
6. Explore subject portal, find testing agreement
7. Return to `~` and check Notes app or Lookout email
8. Discover leaked employee password `s4ngu1s`
9. Disconnect from subject portal: `./portal_disconnect.sh`
10. Reconnect with employee credentials
11. Discover `~/megacorp/research/brainRecordings.exe`
12. Play neural recordings and uncover the truth

**Key Realizations:**
- The testing agreement in subject portal seems benign
- The employee contract reveals darker terms
- Blood work shows abnormal markers they didn't disclose
- Neural recordings prove the device was monitoring brain activity
- MegaCorp knew about the health effects and lied

---

## Technical Notes

### File Paths
All audio files use relative paths: `./neural_recordings/filename.wav`

### State Management
- Audio playback managed with React hooks
- Visualization updates via intervals (cleared on stop/unmount)
- Progress tracking via `currentTime` property

### Browser Compatibility
- Requires modern browser with HTML5 Audio support
- Tested with Chrome, Firefox, Safari, Edge
- WAV files should work universally

### Performance
- Waveform updates: 150ms interval
- Progress updates: 100ms interval
- No performance issues with multiple recordings

---

## Future Enhancements (Not Implemented)

Potential additions if desired:
- Volume control
- Seek/scrub through recording
- Next/previous track navigation
- Playlist mode
- Speed control (slowed/sped up for effect)
- Spectrum analyzer visualization
- Export/download functionality (fake, for immersion)

---

Last Updated: 2025-11-02
