# Phase 8: Recording Feature

## Objective
Enable easy recording of the simulation for creating social media video content.

---

## Prerequisites
- Phase 7 completed (visual polish)

---

## Work Items

### 8.1 Screen Capture Guide (MVP)
**File:** `README.md` or in-app instructions

**OBS Setup Guide:**
```markdown
## Recording with OBS

1. Download OBS Studio: https://obsproject.com/
2. Add Source → Window Capture → Select browser window
3. Set output resolution: 1080x1920
4. Set framerate: 60 FPS
5. Format: MP4 (or MKV for safety)
6. Crop to canvas area if needed
7. Press H to hide config panel
8. Click Start Recording
9. Run simulation
10. Stop recording when satisfied
```

**Browser Extension Alternative:**
- Chrome: "Screen Recorder" extension
- Firefox: Built-in screenshot tool (limited)

**Acceptance Criteria:**
- [ ] Clear instructions available
- [ ] User can record successfully
- [ ] Output is correct resolution/format

---

### 8.2 Canvas MediaRecorder Integration
**File:** `js/recording.js`

**Implementation:**
```js
class RecordingManager {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
  }

  init(canvas) {
    this.canvas = canvas;
  }

  startRecording() {
    if (this.isRecording) return;

    const stream = this.canvas.captureStream(60); // 60 FPS
    const options = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 8000000 // 8 Mbps
    };

    this.mediaRecorder = new MediaRecorder(stream, options);
    this.recordedChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.downloadRecording();
    };

    this.mediaRecorder.start();
    this.isRecording = true;
    console.log('Recording started');
  }

  stopRecording() {
    if (!this.isRecording) return;

    this.mediaRecorder.stop();
    this.isRecording = false;
    console.log('Recording stopped');
  }

  downloadRecording() {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `ball-escape-${Date.now()}.webm`;
    a.click();

    URL.revokeObjectURL(url);
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }
}

const recordingManager = new RecordingManager();
```

**Acceptance Criteria:**
- [ ] Recording captures canvas at 60 FPS
- [ ] Recording starts/stops on command
- [ ] File downloads automatically

---

### 8.3 Recording UI Controls
**File:** `js/ui.js`

**Add Recording Section:**
```js
createRecordingSection() {
  const section = this.createSection('Recording');

  // Record button
  this.recordBtn = createButton('Start Recording');
  this.recordBtn.parent(section);
  this.recordBtn.class('record-btn');
  this.recordBtn.mousePressed(() => {
    recordingManager.toggleRecording();
    this.updateRecordButton();
  });

  // Recording indicator
  this.recordingIndicator = createDiv('');
  this.recordingIndicator.parent(section);
  this.recordingIndicator.class('recording-indicator');
  this.recordingIndicator.hide();
}

updateRecordButton() {
  if (recordingManager.isRecording) {
    this.recordBtn.html('Stop Recording');
    this.recordBtn.class('record-btn recording');
    this.recordingIndicator.show();
  } else {
    this.recordBtn.html('Start Recording');
    this.recordBtn.class('record-btn');
    this.recordingIndicator.hide();
  }
}
```

**CSS Styling:**
```css
.record-btn {
  width: 100%;
  padding: 12px;
  background: #44aa44;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.record-btn.recording {
  background: #ff4444;
  animation: pulse 1s infinite;
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  color: #ff4444;
}

.recording-indicator::before {
  content: '';
  width: 12px;
  height: 12px;
  background: #ff4444;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

**Acceptance Criteria:**
- [ ] Record button visible
- [ ] Button text changes when recording
- [ ] Visual indicator during recording
- [ ] Clear feedback on state

---

### 8.4 Keyboard Shortcuts
**File:** `js/main.js`

**Implementation:**
```js
function keyPressed() {
  switch (key.toLowerCase()) {
    case 'r':
      recordingManager.toggleRecording();
      uiManager.updateRecordButton();
      break;
    case 'h':
      uiManager.toggleVisibility();
      break;
    case ' ':
      simulation.togglePause();
      break;
    case 's':
      simulation.reset();
      break;
  }
}
```

**Display Shortcuts:**
```
Keyboard Shortcuts:
R - Start/Stop Recording
H - Hide/Show Config Panel
Space - Pause/Resume
S - Reset Simulation
```

**Acceptance Criteria:**
- [ ] R toggles recording
- [ ] H hides panel for clean recording
- [ ] Shortcuts documented

---

### 8.5 Recording Timer Display
**File:** `js/ui.js`

**Implementation:**
```js
updateRecordingTimer() {
  if (recordingManager.isRecording) {
    const elapsed = recordingManager.getElapsedTime();
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    this.recordingTimer.html(
      `Recording: ${minutes}:${seconds.toString().padStart(2, '0')}`
    );
  }
}
```

**In RecordingManager:**
```js
startRecording() {
  // ... existing code
  this.startTime = Date.now();
}

getElapsedTime() {
  if (!this.isRecording) return 0;
  return (Date.now() - this.startTime) / 1000;
}
```

**Acceptance Criteria:**
- [ ] Timer shows during recording
- [ ] Time format is clear
- [ ] Timer resets on new recording

---

### 8.6 Auto-Hide Panel During Recording
**File:** `js/recording.js`

**Option to auto-hide:**
```js
startRecording() {
  // ... existing code

  if (CONFIG.recording.autoHidePanel) {
    this.panelWasVisible = uiManager.visible;
    uiManager.hide();
  }
}

stopRecording() {
  // ... existing code

  if (CONFIG.recording.autoHidePanel && this.panelWasVisible) {
    uiManager.show();
  }
}
```

**Acceptance Criteria:**
- [ ] Panel auto-hides on record start (if enabled)
- [ ] Panel restores on record stop
- [ ] Option in config

---

### 8.7 Recording Quality Options
**File:** `js/config.js`

**Configuration:**
```js
recording: {
  autoHidePanel: true,
  quality: 'high',        // 'low', 'medium', 'high'
  frameRate: 60,
  format: 'webm'          // 'webm' (future: 'gif')
}
```

**Quality Presets:**
```js
const QUALITY_PRESETS = {
  low: { bitrate: 2500000, frameRate: 30 },
  medium: { bitrate: 5000000, frameRate: 60 },
  high: { bitrate: 8000000, frameRate: 60 }
};
```

**Acceptance Criteria:**
- [ ] Quality options available
- [ ] Lower quality = smaller files
- [ ] Frame rate configurable

---

### 8.8 WebM to MP4 Conversion Guide
**File:** `README.md`

**Instructions:**
```markdown
## Converting WebM to MP4

WebM files may not work directly on all platforms. Convert to MP4:

### Option 1: Online Converter
- cloudconvert.com
- convertio.co

### Option 2: FFmpeg (Command Line)
ffmpeg -i ball-escape.webm -c:v libx264 -crf 20 -preset slow ball-escape.mp4

### Option 3: HandBrake
1. Open HandBrake
2. Drag WebM file
3. Select MP4 preset
4. Start encode
```

**Acceptance Criteria:**
- [ ] Clear conversion instructions
- [ ] Multiple options provided
- [ ] Final output works for social media

---

### 8.9 Frame Export (Future Enhancement)
**File:** `js/recording.js`

**Frame-by-Frame Export:**
```js
async exportFrames() {
  const frameCount = CONFIG.recording.frameCount || 300; // 5 seconds at 60fps

  for (let i = 0; i < frameCount; i++) {
    // Step simulation
    simulation.update();
    simulation.draw();

    // Save frame
    const filename = `frame-${i.toString().padStart(5, '0')}.png`;
    saveCanvas(filename);

    // Allow UI to update
    await new Promise(r => setTimeout(r, 0));
  }
}
```

**Note:** This creates many files; use FFmpeg to stitch:
```bash
ffmpeg -framerate 60 -i frame-%05d.png -c:v libx264 -pix_fmt yuv420p output.mp4
```

**Acceptance Criteria:**
- [ ] Frames export sequentially
- [ ] Naming allows easy stitching
- [ ] Instructions for FFmpeg provided

---

## Testing Checklist

- [ ] MediaRecorder works in Chrome
- [ ] MediaRecorder works in Firefox
- [ ] Recording captures full canvas
- [ ] Audio included (if available)
- [ ] File downloads successfully
- [ ] Video plays back correctly
- [ ] Quality is acceptable
- [ ] No frame drops during recording
- [ ] UI controls work correctly
- [ ] Keyboard shortcuts work

---

## Browser Compatibility

| Browser | MediaRecorder | Notes |
|---------|---------------|-------|
| Chrome | Yes | Best support, VP9 codec |
| Firefox | Yes | VP8 codec |
| Safari | Limited | May need workaround |
| Edge | Yes | Same as Chrome |

**Fallback for Safari:**
Consider using a library like RecordRTC for broader support.

---

## Output Specifications

| Property | Value |
|----------|-------|
| Resolution | 1080 x 1920 (9:16) |
| Frame Rate | 60 FPS |
| Format | WebM (VP9) |
| Bitrate | 8 Mbps (high quality) |
| Duration | Variable |

---

## Notes

- WebM is well-supported but some platforms prefer MP4
- Consider adding watermark option
- Future: Direct upload to platforms via API
- Future: GIF export for short clips
- Test recording performance with many balls
