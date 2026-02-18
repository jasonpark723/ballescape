# Phase 7: Visual Polish

## Objective
Add visual enhancements to make the simulation more appealing for video content: trails, glow effects, color schemes, and smooth animations.

---

## Prerequisites
- Phase 6 completed (config UI)

---

## Work Items

### 7.1 Ball Trails
**File:** `js/ball.js`

**Properties:**
```js
this.trail = [];           // Array of past positions
this.trailLength = CONFIG.ball.trailLength;
```

**Update Method:**
```js
updateTrail() {
  if (!CONFIG.ball.trailEnabled) return;

  const pos = this.body.position;
  this.trail.unshift({ x: pos.x, y: pos.y });

  // Limit trail length
  if (this.trail.length > this.trailLength) {
    this.trail.pop();
  }
}
```

**Draw Method:**
```js
drawTrail() {
  if (!CONFIG.ball.trailEnabled || this.trail.length < 2) return;

  noFill();
  beginShape();
  for (let i = 0; i < this.trail.length; i++) {
    const alpha = map(i, 0, this.trail.length, 255, 0);
    const weight = map(i, 0, this.trail.length, this.radius * 2, 0);

    stroke(red(this.color), green(this.color), blue(this.color), alpha);
    strokeWeight(weight);
    vertex(this.trail[i].x, this.trail[i].y);
  }
  endShape();
}
```

**Alternative: Circle-based Trail**
```js
drawTrail() {
  for (let i = 0; i < this.trail.length; i++) {
    const alpha = map(i, 0, this.trail.length, 200, 0);
    const size = map(i, 0, this.trail.length, this.radius * 2, this.radius * 0.2);

    fill(red(this.color), green(this.color), blue(this.color), alpha);
    noStroke();
    ellipse(this.trail[i].x, this.trail[i].y, size);
  }
}
```

**Acceptance Criteria:**
- [ ] Trail follows ball movement
- [ ] Trail fades out smoothly
- [ ] Trail length configurable
- [ ] Can be disabled

---

### 7.2 Glow Effects
**File:** `js/ball.js`

**Using Shadow Blur:**
```js
drawWithGlow() {
  if (CONFIG.glowEnabled) {
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = this.color;
  }

  fill(this.color);
  noStroke();
  ellipse(this.body.position.x, this.body.position.y, this.radius * 2);

  // Reset shadow
  drawingContext.shadowBlur = 0;
}
```

**Ring Glow:**
```js
// In ring.js draw()
if (CONFIG.glowEnabled) {
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = this.color;
}

// Draw ring arc
stroke(this.color);
arc(...);

drawingContext.shadowBlur = 0;
```

**Acceptance Criteria:**
- [ ] Balls have soft glow
- [ ] Rings have subtle glow
- [ ] Glow color matches object color
- [ ] Can be disabled for performance

---

### 7.3 Color Schemes / Palettes
**File:** `js/config.js`

**Predefined Palettes:**
```js
const PALETTES = {
  neon: {
    ball: '#00ff88',
    rings: ['#ff0088', '#00ffff', '#ff8800', '#88ff00', '#ff00ff'],
    background: '#0a0a0a'
  },
  pastel: {
    ball: '#ffb6c1',
    rings: ['#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9', '#f8b500'],
    background: '#1a1a2e'
  },
  monochrome: {
    ball: '#ffffff',
    rings: ['#888888', '#666666', '#444444', '#333333', '#222222'],
    background: '#000000'
  },
  fire: {
    ball: '#ffff00',
    rings: ['#ff0000', '#ff4400', '#ff8800', '#ffbb00', '#ffff00'],
    background: '#1a0a0a'
  },
  ocean: {
    ball: '#00ffff',
    rings: ['#0044ff', '#0088ff', '#00bbff', '#00eeff', '#88ffff'],
    background: '#0a0a1a'
  }
};
```

**Apply Palette:**
```js
function applyPalette(paletteName) {
  const palette = PALETTES[paletteName];
  CONFIG.ball.color = palette.ball;
  CONFIG.background = palette.background;
  // Apply ring colors...
}
```

**Acceptance Criteria:**
- [ ] Multiple palettes available
- [ ] Palette applies to all elements
- [ ] UI allows palette selection
- [ ] Colors visually appealing

---

### 7.4 Dynamic Color Shifting
**File:** `js/ball.js`

**HSL-Based Color:**
```js
constructor() {
  this.hue = random(360);
  this.saturation = 80;
  this.lightness = 60;
  this.updateColorFromHSL();
}

updateColorFromHSL() {
  colorMode(HSL);
  this.color = color(this.hue, this.saturation, this.lightness);
  colorMode(RGB);
}

shiftHue(amount = 30) {
  this.hue = (this.hue + amount) % 360;
  this.updateColorFromHSL();
}
```

**Rainbow Effect Over Time:**
```js
update() {
  // Slow continuous color shift
  if (CONFIG.ball.rainbowMode) {
    this.hue = (this.hue + 0.5) % 360;
    this.updateColorFromHSL();
  }
}
```

**Acceptance Criteria:**
- [ ] Colors shift smoothly
- [ ] HSL allows easy manipulation
- [ ] Rainbow mode option

---

### 7.5 Ring Visual Enhancements
**File:** `js/ring.js`

**Gradient Ring:**
```js
drawGradientRing() {
  const steps = 36;
  const arcLength = (TWO_PI - this.gapSize) / steps;

  for (let i = 0; i < steps; i++) {
    const angle = this.rotation + this.gapStart + this.gapSize + (i * arcLength);
    const nextAngle = angle + arcLength;

    // Color gradient around ring
    const hue = map(i, 0, steps, 0, 360);
    stroke(hue, 80, 60);
    strokeWeight(this.thickness);
    arc(this.x, this.y, this.radius * 2, this.radius * 2, angle, nextAngle);
  }
}
```

**Ring Pulse Effect:**
```js
update() {
  // Subtle pulse
  this.pulsePhase += 0.05;
  this.displayThickness = this.thickness + sin(this.pulsePhase) * 2;
}
```

**Acceptance Criteria:**
- [ ] Rings look more dynamic
- [ ] Optional gradient coloring
- [ ] Subtle animation

---

### 7.6 Escape Particles/Effects
**File:** `js/effects.js` (new file)

**Particle Burst on Escape:**
```js
class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: random(-3, 3),
        vy: random(-3, 3),
        color,
        life: 1.0,
        decay: random(0.02, 0.05)
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    this.particles.forEach(p => {
      fill(red(p.color), green(p.color), blue(p.color), p.life * 255);
      noStroke();
      ellipse(p.x, p.y, p.life * 10);
    });
  }
}

const particles = new ParticleSystem();
```

**Trigger on Escape:**
```js
// In handleEscape()
particles.emit(ball.body.position.x, ball.body.position.y, ball.color, 15);
```

**Acceptance Criteria:**
- [ ] Particles burst on escape
- [ ] Particles fade and disappear
- [ ] Performance acceptable

---

### 7.7 Smooth Animations
**File:** `js/ball.js`

**Eased Size Changes:**
```js
this.targetRadius = this.radius;
this.radiusEasing = 0.1;

update() {
  // Smooth radius transition
  this.radius = lerp(this.radius, this.targetRadius, this.radiusEasing);
}

applySizeChange(percentage) {
  this.targetRadius = this.radius * (1 + percentage / 100);
  // Actual radius will ease toward target
}
```

**Color Transitions:**
```js
this.targetHue = this.hue;
this.hueEasing = 0.1;

update() {
  this.hue = lerp(this.hue, this.targetHue, this.hueEasing);
  this.updateColorFromHSL();
}
```

**Acceptance Criteria:**
- [ ] Size changes smoothly animated
- [ ] Color changes smoothly animated
- [ ] No jarring visual jumps

---

### 7.8 Performance Optimization
**File:** Various

**Strategies:**
1. **Reduce trail length** for many balls
2. **Disable glow** when ball count > threshold
3. **Limit particles** active at once
4. **Use offscreen buffer** for static elements

**Auto-Quality Adjustment:**
```js
function adjustQuality() {
  const ballCount = simulation.balls.length;

  if (ballCount > 200) {
    CONFIG.glowEnabled = false;
    CONFIG.ball.trailLength = 5;
  } else if (ballCount > 100) {
    CONFIG.ball.trailLength = 10;
  }
}
```

**Acceptance Criteria:**
- [ ] 60 FPS with 100 balls
- [ ] Graceful degradation at high counts
- [ ] Quality options in config

---

## Testing Checklist

- [ ] Trails render correctly
- [ ] Trails fade smoothly
- [ ] Glow effects work
- [ ] Color palettes apply correctly
- [ ] Color shifting works on escape
- [ ] Particles emit on escape
- [ ] Particles clean up properly
- [ ] Size animations smooth
- [ ] Performance acceptable
- [ ] All effects can be toggled

---

## Visual Quality Checklist

- [ ] Colors are vibrant but not harsh
- [ ] Contrast is good against background
- [ ] Effects enhance, don't distract
- [ ] Looks good in video format (9:16)
- [ ] No visual artifacts or glitches

---

## Notes

- Test on different monitors/devices
- Record sample videos to verify quality
- Consider adding background effects (subtle grid, stars)
- Glow can be expensive; offer quality levels
