# Phase 4: Escape Detection + Events

## Objective
Detect when a ball escapes through a ring gap and trigger configurable events (multiply, grow, speed boost, color shift).

---

## Prerequisites
- Phase 3 completed (ring rotation)

---

## Work Items

### 4.1 Track Ball Ring Containment
**File:** `js/ball.js`

**New Properties:**
- `currentRingIndex` - Index of innermost ring containing the ball (-1 if outside all)
- `previousRingIndex` - Ring index from previous frame (for escape detection)

**New Method:**
```js
updateRingContainment(rings) {
  this.previousRingIndex = this.currentRingIndex;

  const distFromCenter = this.getDistanceFromCenter();

  // Find which ring zone the ball is in
  this.currentRingIndex = -1; // Outside all rings
  for (let i = rings.length - 1; i >= 0; i--) {
    if (distFromCenter < rings[i].radius) {
      this.currentRingIndex = i;
      break;
    }
  }
}

getDistanceFromCenter() {
  const pos = this.body.position;
  const centerX = CONFIG.width / 2;
  const centerY = CONFIG.height / 2;
  return Math.sqrt((pos.x - centerX) ** 2 + (pos.y - centerY) ** 2);
}
```

**Acceptance Criteria:**
- [ ] Ball knows which ring zone it's in
- [ ] Ring index updates each frame

---

### 4.2 Detect Escape Events
**File:** `js/events.js`

**Implementation:**
```js
function checkEscape(ball, rings) {
  // Ball moved from ring i to ring i+1 (or outside)
  if (ball.currentRingIndex > ball.previousRingIndex) {
    const escapedRingIndex = ball.previousRingIndex;
    if (escapedRingIndex >= 0) {
      return {
        escaped: true,
        ringIndex: escapedRingIndex,
        ring: rings[escapedRingIndex]
      };
    }
  }
  return { escaped: false };
}
```

**Edge Cases:**
- Ball starts outside rings (no escape)
- Ball escapes multiple rings in one frame (handle each)
- Ball re-enters ring (not an escape)

**Acceptance Criteria:**
- [ ] Escape detected when ball passes through gap
- [ ] Escape not triggered on bounce
- [ ] Correct ring identified

---

### 4.3 Ball Multiplication
**File:** `js/events.js` + `js/simulation.js`

**Event Handler:**
```js
function handleEscape(ball, ringIndex, simulation) {
  const config = CONFIG.onEscape;

  // Multiply
  if (config.multiply > 1) {
    for (let i = 1; i < config.multiply; i++) {
      const newBall = simulation.spawnBall(
        ball.body.position.x,
        ball.body.position.y,
        ball.radius,
        ball.color
      );
      // Give slightly different velocity
      const angle = (TWO_PI / config.multiply) * i;
      const speed = Matter.Vector.magnitude(ball.body.velocity);
      Matter.Body.setVelocity(newBall.body, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      });
    }
  }
}
```

**Acceptance Criteria:**
- [ ] N-1 new balls spawn at escape position
- [ ] New balls have varied velocities
- [ ] Ball count increases correctly

---

### 4.4 Size Change Effect
**File:** `js/ball.js` + `js/events.js`

**Ball Method:**
```js
applySize Change(percentage) {
  const scale = 1 + (percentage / 100);
  this.radius *= scale;

  // Update Matter.js body
  Matter.Body.scale(this.body, scale, scale);
}
```

**Event Handler Addition:**
```js
if (config.sizeChange !== 0) {
  ball.applySizeChange(config.sizeChange);
}
```

**Acceptance Criteria:**
- [ ] Ball grows with positive percentage
- [ ] Ball shrinks with negative percentage
- [ ] Physics body scales correctly
- [ ] Min/max size limits respected

---

### 4.5 Speed Boost Effect
**File:** `js/events.js`

**Implementation:**
```js
if (config.speedBoost !== 1) {
  const velocity = ball.body.velocity;
  Matter.Body.setVelocity(ball.body, {
    x: velocity.x * config.speedBoost,
    y: velocity.y * config.speedBoost
  });
}
```

**Acceptance Criteria:**
- [ ] Ball speeds up with multiplier > 1
- [ ] Ball slows down with multiplier < 1
- [ ] Direction preserved

---

### 4.6 Color Shift Effect
**File:** `js/ball.js` + `js/events.js`

**Ball Method:**
```js
shiftColor() {
  // Rotate hue by fixed amount
  const hue = (this.hue + 30) % 360;
  this.hue = hue;
  this.color = `hsl(${hue}, 80%, 60%)`;
}
```

**Alternative: Assign color based on escape count**
```js
const colors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];
this.color = colors[this.escapeCount % colors.length];
```

**Acceptance Criteria:**
- [ ] Ball color changes on escape
- [ ] Color visually distinct
- [ ] Works with multiplication (new balls get shifted color)

---

### 4.7 End Condition Checking
**File:** `js/simulation.js`

**Implementation:**
```js
checkEndCondition() {
  switch (CONFIG.endCondition) {
    case 'escape':
      // All balls outside all rings
      const allEscaped = this.balls.every(b => b.currentRingIndex === -1);
      if (allEscaped) this.state = 'ended';
      break;

    case 'time':
      if (this.elapsedTime >= CONFIG.maxDuration) {
        this.state = 'ended';
      }
      break;

    case 'ballCount':
      if (this.balls.length >= CONFIG.maxBalls) {
        this.state = 'ended';
      }
      break;
  }
}
```

**Acceptance Criteria:**
- [ ] Simulation ends when condition met
- [ ] 'escape' - ends when all balls exit
- [ ] 'time' - ends after duration
- [ ] 'ballCount' - ends at max balls

---

### 4.8 Integration with Simulation Loop
**File:** `js/simulation.js`

**Updated update():**
```js
update() {
  if (this.state !== 'running') return;

  Matter.Engine.update(this.engine, 1000/60);

  this.rings.forEach(ring => ring.update());

  this.balls.forEach(ball => {
    ball.updateRingContainment(this.rings);
    const escape = checkEscape(ball, this.rings);
    if (escape.escaped) {
      handleEscape(ball, escape.ringIndex, this);
      this.stats.escapes++;
    }
  });

  this.checkEndCondition();
  this.stats.time += 1/60;
}
```

**Acceptance Criteria:**
- [ ] Escape detection runs each frame
- [ ] Events trigger correctly
- [ ] Stats tracked

---

## Testing Checklist

- [ ] Ball passing through gap triggers escape event
- [ ] Ball bouncing does NOT trigger escape
- [ ] Multiply creates correct number of new balls
- [ ] New balls spread in different directions
- [ ] Size change visually apparent
- [ ] Speed boost changes ball velocity
- [ ] Color shift changes ball color
- [ ] Each effect can be disabled via config
- [ ] End conditions work correctly
- [ ] Multiple balls work independently

---

## Configuration Reference

```js
onEscape: {
  multiply: 2,        // 0 = disabled, 2+ = multiply
  sizeChange: 0,      // Percentage: 10 = grow 10%, -10 = shrink
  speedBoost: 1.1,    // Multiplier: 1 = none, 1.1 = 10% faster
  colorShift: true,
},

endCondition: 'escape',  // 'escape' | 'time' | 'ballCount'
maxDuration: 60,
maxBalls: 500,
```

---

## Notes

- Consider adding escape particles/effects for visual feedback
- May need to cap ball speed to prevent physics issues
- Consider ball removal when it goes off-screen (beyond outer ring)
- Track escape count per ball for progressive effects
