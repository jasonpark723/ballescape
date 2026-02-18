# Phase 2: Multiple Concentric Rings with Gaps

## Objective
Extend the ring system to support multiple concentric rings, each with a gap that balls can pass through.

---

## Prerequisites
- Phase 1 completed (basic bouncing ball in single ring)

---

## Work Items

### 2.1 Extend Ring Class for Gaps
**File:** `js/ring.js`

**New Properties:**
- `gapStart` - Starting angle of gap (radians)
- `gapSize` - Size of gap (radians, converted from degrees)

**Modified Methods:**
- `create(world)` - Build arc segments, skipping gap region
- `draw()` - Render arc with visible gap

**Implementation:**
```js
// Convert gap from degrees to radians
const gapRadians = (CONFIG.rings.gapSize * Math.PI) / 180;

// Create segments only where there's no gap
for (let angle = 0; angle < TWO_PI; angle += segmentAngle) {
  if (!isInGap(angle, gapStart, gapRadians)) {
    // Create segment at this angle
  }
}
```

**Acceptance Criteria:**
- [ ] Ring renders with visible gap
- [ ] Physics bodies have gap (no collision in gap region)
- [ ] Ball can pass through gap

---

### 2.2 Multiple Rings Creation
**File:** `js/simulation.js`

**Changes:**
- `rings[]` - Array of Ring instances (was single ring)

**Ring Generation:**
```js
for (let i = 0; i < CONFIG.rings.count; i++) {
  const radius = CONFIG.rings.innerRadius + (i * CONFIG.rings.spacing);
  const ring = new Ring(centerX, centerY, radius, ...);
  ring.gapStart = randomAngle(); // Each ring has random gap position
  rings.push(ring);
}
```

**Acceptance Criteria:**
- [ ] Multiple rings render concentrically
- [ ] Each ring has its own gap at different position
- [ ] Spacing between rings matches config

---

### 2.3 Gap Rendering
**File:** `js/ring.js`

**Visual Implementation:**
```js
draw() {
  push();
  noFill();
  stroke(this.color);
  strokeWeight(this.thickness);

  // Draw arc from gapEnd to gapStart (the solid part)
  arc(this.x, this.y, this.radius * 2, this.radius * 2,
      this.gapStart + this.gapSize, this.gapStart + TWO_PI - 0.01);
  pop();
}
```

**Alternative: Draw segments individually** for more control

**Acceptance Criteria:**
- [ ] Gap is visually clear
- [ ] Ring color consistent
- [ ] No visual artifacts at gap edges

---

### 2.4 Gap Collision Testing
**Manual Testing:**

1. Spawn ball inside innermost ring
2. Ball should bounce off solid parts
3. Ball should pass through gap when trajectory aligns
4. Ball should enter space between rings
5. Ball should interact with next ring

**Edge Cases:**
- [ ] Ball hitting gap edge (should bounce off segment end)
- [ ] Ball passing through at angle
- [ ] Ball larger than gap (should not pass)

**Acceptance Criteria:**
- [ ] Ball reliably passes through aligned gaps
- [ ] Ball bounces off solid ring sections
- [ ] No physics glitches at gap boundaries

---

### 2.5 Configuration Updates
**File:** `js/config.js`

**New/Updated Parameters:**
```js
rings: {
  count: 5,              // Number of concentric rings
  innerRadius: 100,      // First ring radius
  spacing: 80,           // Distance between rings
  thickness: 8,
  gapSize: 60,           // Gap width in degrees
  color: '#4444ff',
}
```

**Acceptance Criteria:**
- [ ] Ring count configurable
- [ ] Spacing configurable
- [ ] Gap size configurable

---

## Testing Checklist

- [ ] 5 concentric rings render correctly
- [ ] Each ring has a gap at different angle
- [ ] Ball bounces inside innermost ring
- [ ] Ball can escape through gap to next ring zone
- [ ] Ball interacts correctly with each ring
- [ ] No visual overlap issues between rings
- [ ] Performance acceptable with 5 rings

---

## Visual Reference

```
        ╭─────────────────────╮
       ╱                       ╲
      │   ╭───────────────╮     │
      │  ╱                 ╲    │
      │ │   ╭─────────╮     │   │
      │ │  ╱           ╲    │   │
      │ │ │   ╭─────╮   │   │   │
      │ │ │  ╱   ●   ╲  │   │   │  ← Ball in center
      │ │ │ │  (ball) │ │   │   │
      │ │ │  ╲       ╱  │   │   │
      │ │ │   ╰──┄──╯   │   │   │  ← Gap in ring
      │ │  ╲           ╱    │   │
      │ │   ╰─────────╯     │   │
      │  ╲          ┄      ╱    │
      │   ╰───────────────╯     │
       ╲         ┄             ╱
        ╰─────────────────────╯
```

---

## Notes

- Gap positions should be randomized per ring for variety
- Consider adding config option for gap position pattern (random, aligned, spiral)
- Segment count may need to increase for larger rings
- Ball radius must be smaller than gap size for reliable passage
