# Phase 3: Ring Rotation

## Objective
Add rotation to rings so gaps move over time, creating dynamic gameplay where timing matters.

---

## Prerequisites
- Phase 2 completed (multiple rings with gaps)

---

## Work Items

### 3.1 Add Rotation Properties to Ring
**File:** `js/ring.js`

**New Properties:**
- `rotation` - Current rotation angle (radians)
- `rotationSpeed` - Angular velocity (radians per frame)
- `rotationDirection` - 1 (CW) or -1 (CCW)

**Constructor Update:**
```js
constructor(x, y, radius, thickness, color, rotationSpeed, direction) {
  // ... existing code
  this.rotation = 0;
  this.rotationSpeed = rotationSpeed;
  this.rotationDirection = direction; // 1 or -1
}
```

**Acceptance Criteria:**
- [ ] Ring stores rotation state
- [ ] Rotation speed configurable per ring

---

### 3.2 Implement Rotation Update Logic
**File:** `js/ring.js`

**New Method:**
```js
update() {
  this.rotation += this.rotationSpeed * this.rotationDirection;

  // Keep rotation in 0 to TWO_PI range
  if (this.rotation > TWO_PI) this.rotation -= TWO_PI;
  if (this.rotation < 0) this.rotation += TWO_PI;

  this.updateBodyPositions();
}
```

**Acceptance Criteria:**
- [ ] Rotation increments each frame
- [ ] Rotation wraps correctly

---

### 3.3 Update Physics Body Positions
**File:** `js/ring.js`

**Implementation Challenge:**
Matter.js static bodies don't naturally rotate. Options:

**Option A: Recreate bodies each frame** (simple but expensive)
```js
updateBodyPositions() {
  // Remove old bodies
  this.bodies.forEach(body => Matter.World.remove(world, body));
  // Create new bodies at rotated positions
  this.createBodies(this.rotation);
}
```

**Option B: Use Matter.Body.setPosition and setAngle** (better performance)
```js
updateBodyPositions() {
  this.bodies.forEach((body, i) => {
    const segmentAngle = this.segmentAngles[i] + this.rotation;
    const x = this.x + Math.cos(segmentAngle) * this.radius;
    const y = this.y + Math.sin(segmentAngle) * this.radius;
    Matter.Body.setPosition(body, { x, y });
    Matter.Body.setAngle(body, segmentAngle);
  });
}
```

**Option C: Use Matter.Body.rotate around center** (most elegant)
```js
updateBodyPositions() {
  const center = { x: this.x, y: this.y };
  this.bodies.forEach(body => {
    Matter.Body.rotate(body, this.rotationSpeed * this.rotationDirection, center);
  });
}
```

**Recommendation:** Option C is cleanest for continuous rotation

**Acceptance Criteria:**
- [ ] Physics bodies rotate with visual ring
- [ ] Collision detection works during rotation
- [ ] No physics glitches when rotating

---

### 3.4 Sync Visual Rendering
**File:** `js/ring.js`

**Updated draw():**
```js
draw() {
  push();
  translate(this.x, this.y);
  rotate(this.rotation);

  noFill();
  stroke(this.color);
  strokeWeight(this.thickness);

  // Draw arc (gap position is relative to rotation)
  const gapStart = this.gapStartBase; // Original gap position
  arc(0, 0, this.radius * 2, this.radius * 2,
      gapStart + this.gapSize, gapStart + TWO_PI - 0.01);

  pop();
}
```

**Acceptance Criteria:**
- [ ] Visual rotation matches physics rotation
- [ ] Gap appears to rotate with ring
- [ ] Smooth visual animation

---

### 3.5 Rotation Direction Modes
**File:** `js/simulation.js`

**Direction Assignment:**
```js
function getRotationDirection(ringIndex, mode) {
  switch (mode) {
    case 'cw':
      return 1;
    case 'ccw':
      return -1;
    case 'alternate':
      return ringIndex % 2 === 0 ? 1 : -1;
    default:
      return 1;
  }
}
```

**Acceptance Criteria:**
- [ ] 'cw' - all rings rotate clockwise
- [ ] 'ccw' - all rings rotate counter-clockwise
- [ ] 'alternate' - rings alternate direction

---

### 3.6 Configuration Updates
**File:** `js/config.js`

**Updated Parameters:**
```js
rings: {
  // ... existing
  rotation: {
    enabled: true,
    baseSpeed: 0.01,           // Radians per frame
    direction: 'alternate',    // 'cw', 'ccw', 'alternate'
    speedVariation: 0.005,     // Random variation per ring (optional)
  },
}
```

**Acceptance Criteria:**
- [ ] Rotation can be disabled
- [ ] Base speed configurable
- [ ] Direction mode configurable

---

### 3.7 Update Simulation Loop
**File:** `js/simulation.js`

**Modified update():**
```js
update() {
  Matter.Engine.update(this.engine, 1000/60);

  if (CONFIG.rings.rotation.enabled) {
    this.rings.forEach(ring => ring.update());
  }
}
```

**Acceptance Criteria:**
- [ ] Rings rotate each frame when enabled
- [ ] Rotation disabled when config says so

---

## Testing Checklist

- [ ] Rings visually rotate
- [ ] Physics bodies rotate with visual
- [ ] Ball bounces correctly off rotating ring
- [ ] Ball can still pass through rotating gap
- [ ] Alternate direction works (adjacent rings spin opposite)
- [ ] Rotation speed affects difficulty
- [ ] No jitter or stutter in rotation
- [ ] Performance acceptable with rotation

---

## Performance Considerations

- Matter.Body.rotate() is efficient for continuous rotation
- Avoid recreating bodies each frame
- Consider reducing segment count if performance issues
- Profile with multiple rings rotating

---

## Notes

- Rotation speed of 0.01 radians/frame = ~0.57 degrees/frame = ~34 degrees/second
- At 60 FPS, full rotation takes ~10.5 seconds at base speed
- Faster rotation = harder to time escapes
- Consider adding speed ramping (rings speed up over time) as future enhancement
