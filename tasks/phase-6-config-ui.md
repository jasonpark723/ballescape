# Phase 6: Config UI Panel

## Objective
Create an interactive UI panel to adjust simulation parameters in real-time without editing code.

---

## Prerequisites
- Phase 5 completed (audio system)

---

## Work Items

### 6.1 UI Panel Structure
**File:** `js/ui.js`

**Panel Layout:**
```
┌─────────────────────────────┐
│ Ball Escape Config    [Hide]│
├─────────────────────────────┤
│ ▼ Balls                     │
│   Count:    [====|===] 5    │
│   Size:     [==|=====] 15   │
│   Speed:    [===|====] 8    │
│   Trail:    [x]             │
├─────────────────────────────┤
│ ▼ Rings                     │
│   Count:    [===|====] 5    │
│   Gap Size: [====|===] 60°  │
│   Rotation: [===|====] 0.01 │
│   Direction: [▼ Alternate]  │
├─────────────────────────────┤
│ ▼ Events                    │
│   Multiply: [▼ x2]          │
│   Size +/-: [===|====] 0%   │
│   Speed:    [===|====] 1.1x │
│   Color:    [x]             │
├─────────────────────────────┤
│ ▼ Audio                     │
│   Volume:   [=====|==] 0.5  │
│   Bounce:   [x]             │
│   Escape:   [x]             │
├─────────────────────────────┤
│ [Reset Simulation]          │
└─────────────────────────────┘
```

**Acceptance Criteria:**
- [ ] Panel renders on screen
- [ ] Sections collapsible
- [ ] Clean, readable design

---

### 6.2 UI Manager Class
**File:** `js/ui.js`

**Implementation:**
```js
class UIManager {
  constructor() {
    this.panel = null;
    this.visible = true;
    this.controls = {};
  }

  create() {
    this.panel = createDiv('');
    this.panel.id('config-panel');
    this.panel.position(10, 10);

    this.createHeader();
    this.createBallSection();
    this.createRingSection();
    this.createEventSection();
    this.createAudioSection();
    this.createResetButton();
  }

  createHeader() {
    const header = createDiv('Ball Escape Config');
    header.parent(this.panel);
    header.class('panel-header');

    const hideBtn = createButton('Hide');
    hideBtn.parent(header);
    hideBtn.mousePressed(() => this.toggleVisibility());
  }

  toggleVisibility() {
    this.visible = !this.visible;
    if (this.visible) {
      this.panel.show();
    } else {
      this.panel.hide();
      // Show small "Show Config" button
    }
  }

  // ... section methods
}

const uiManager = new UIManager();
```

**Acceptance Criteria:**
- [ ] UIManager creates panel
- [ ] Panel visibility toggleable
- [ ] Structure organized

---

### 6.3 Slider Controls
**File:** `js/ui.js`

**Reusable Slider Creator:**
```js
createSlider(label, min, max, value, step, onChange) {
  const container = createDiv('');
  container.class('control-row');

  const labelEl = createSpan(label);
  labelEl.parent(container);

  const slider = createSlider(min, max, value, step);
  slider.parent(container);
  slider.input(() => onChange(slider.value()));

  const valueDisplay = createSpan(value);
  valueDisplay.parent(container);
  slider.input(() => {
    valueDisplay.html(slider.value());
    onChange(slider.value());
  });

  return { container, slider, valueDisplay };
}
```

**Ball Section Sliders:**
```js
createBallSection() {
  const section = this.createSection('Balls');

  this.controls.ballCount = this.createSlider(
    'Count:', 1, 100, CONFIG.ball.count, 1,
    (v) => { CONFIG.ball.count = v; }
  );
  this.controls.ballCount.container.parent(section);

  this.controls.ballRadius = this.createSlider(
    'Size:', 5, 50, CONFIG.ball.radius, 1,
    (v) => { CONFIG.ball.radius = v; }
  );
  this.controls.ballRadius.container.parent(section);

  // ... more sliders
}
```

**Acceptance Criteria:**
- [ ] Sliders work smoothly
- [ ] Values update in real-time
- [ ] Display shows current value

---

### 6.4 Checkbox Controls
**File:** `js/ui.js`

**Implementation:**
```js
createCheckbox(label, checked, onChange) {
  const container = createDiv('');
  container.class('control-row');

  const checkbox = createCheckbox(label, checked);
  checkbox.parent(container);
  checkbox.changed(() => onChange(checkbox.checked()));

  return { container, checkbox };
}
```

**Usage:**
```js
this.controls.trailEnabled = this.createCheckbox(
  'Ball Trails',
  CONFIG.ball.trailEnabled,
  (v) => { CONFIG.ball.trailEnabled = v; }
);
```

**Acceptance Criteria:**
- [ ] Checkboxes toggle correctly
- [ ] State syncs with CONFIG

---

### 6.5 Dropdown Controls
**File:** `js/ui.js`

**Implementation:**
```js
createDropdown(label, options, selected, onChange) {
  const container = createDiv('');
  container.class('control-row');

  const labelEl = createSpan(label);
  labelEl.parent(container);

  const dropdown = createSelect();
  dropdown.parent(container);
  options.forEach(opt => dropdown.option(opt));
  dropdown.selected(selected);
  dropdown.changed(() => onChange(dropdown.value()));

  return { container, dropdown };
}
```

**Usage:**
```js
this.controls.rotationDir = this.createDropdown(
  'Direction:',
  ['cw', 'ccw', 'alternate'],
  CONFIG.rings.rotation.direction,
  (v) => { CONFIG.rings.rotation.direction = v; }
);
```

**Acceptance Criteria:**
- [ ] Dropdown shows options
- [ ] Selection updates CONFIG

---

### 6.6 Reset Button
**File:** `js/ui.js`

**Implementation:**
```js
createResetButton() {
  const btn = createButton('Reset Simulation');
  btn.parent(this.panel);
  btn.class('reset-btn');
  btn.mousePressed(() => {
    simulation.reset();
  });
}
```

**Acceptance Criteria:**
- [ ] Button visible
- [ ] Clicking resets simulation
- [ ] New settings applied on reset

---

### 6.7 Panel Styling
**File:** `css/style.css`

**Styles:**
```css
#config-panel {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 15px;
  color: #fff;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 14px;
  width: 280px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1000;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #444;
}

.section {
  margin-bottom: 15px;
}

.section-title {
  cursor: pointer;
  padding: 5px 0;
  font-weight: bold;
  color: #88f;
}

.section-title:hover {
  color: #aaf;
}

.control-row {
  display: flex;
  align-items: center;
  margin: 8px 0;
  gap: 10px;
}

.control-row span:first-child {
  min-width: 80px;
}

.control-row input[type="range"] {
  flex: 1;
}

.reset-btn {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background: #4444ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reset-btn:hover {
  background: #5555ff;
}
```

**Acceptance Criteria:**
- [ ] Panel looks polished
- [ ] Text readable
- [ ] Controls properly spaced

---

### 6.8 Collapsible Sections
**File:** `js/ui.js`

**Implementation:**
```js
createSection(title) {
  const section = createDiv('');
  section.class('section');
  section.parent(this.panel);

  const titleEl = createDiv('▼ ' + title);
  titleEl.class('section-title');
  titleEl.parent(section);

  const content = createDiv('');
  content.class('section-content');
  content.parent(section);

  let expanded = true;
  titleEl.mousePressed(() => {
    expanded = !expanded;
    titleEl.html((expanded ? '▼ ' : '▶ ') + title);
    if (expanded) {
      content.show();
    } else {
      content.hide();
    }
  });

  return content;
}
```

**Acceptance Criteria:**
- [ ] Sections collapse/expand on click
- [ ] Arrow indicator updates
- [ ] State remembered

---

### 6.9 Hide Panel for Recording
**File:** `js/ui.js`

**Keyboard Shortcut:**
```js
function keyPressed() {
  if (key === 'h' || key === 'H') {
    uiManager.toggleVisibility();
  }
}
```

**Or button that minimizes to corner:**
```js
toggleVisibility() {
  this.visible = !this.visible;
  if (this.visible) {
    this.panel.show();
    this.showBtn.hide();
  } else {
    this.panel.hide();
    this.showBtn.show();
  }
}
```

**Acceptance Criteria:**
- [ ] Panel can be hidden completely
- [ ] Easy to show again
- [ ] Clean canvas for recording

---

### 6.10 Real-Time Config Updates
**File:** `js/ui.js`

**Considerations:**
- Some settings apply immediately (colors, speeds)
- Some settings require reset (ball count, ring count)

**Implementation:**
```js
// Mark controls that need reset
this.controls.ringCount = this.createSlider(
  'Count:', 1, 20, CONFIG.rings.count, 1,
  (v) => {
    CONFIG.rings.count = v;
    this.showResetNeeded();
  }
);

showResetNeeded() {
  // Highlight reset button or show message
  this.resetBtn.style('background', '#ff4444');
}
```

**Acceptance Criteria:**
- [ ] Real-time changes work where possible
- [ ] Clear indication when reset needed
- [ ] No crashes on parameter changes

---

## Testing Checklist

- [ ] All sliders work and update values
- [ ] All checkboxes toggle correctly
- [ ] All dropdowns select properly
- [ ] Reset button resets simulation
- [ ] Panel can be hidden/shown
- [ ] Styles look correct
- [ ] Sections collapse/expand
- [ ] No layout issues
- [ ] Works with different screen sizes

---

## Notes

- Consider using dat.GUI as alternative (more polished)
- Panel should not overlap simulation too much
- Think about mobile/touch support
- Consider preset save/load in future
