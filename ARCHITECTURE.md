# Ball Escape - Architecture Design

A physics-based ball escape simulation for creating satisfying short-form video content (YouTube Shorts, TikTok, Instagram Reels).

---

## Overview

Balls bounce inside concentric rotating rings with gaps. When a ball escapes through a gap, events trigger (multiply, grow, color shift, etc.). The simulation runs until the ball escapes all rings or a condition is met.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Physics | Matter.js |
| Rendering | p5.js |
| Audio | p5.sound |
| Config UI | p5.js sliders / dat.gui |
| Recording | Browser screen capture / OBS |

---

## File Structure

```
ballescape/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js          # Entry point, p5.js setup/draw
│   ├── config.js        # All configurable parameters
│   ├── simulation.js    # Matter.js world setup, physics
│   ├── ball.js          # Ball class
│   ├── ring.js          # Ring class (with gap)
│   ├── events.js        # Collision/escape event handlers
│   ├── audio.js         # Sound management
│   └── ui.js            # Config panel (optional)
├── assets/
│   └── sounds/
│       ├── bounce.mp3
│       ├── escape.mp3
│       └── ambient.mp3
├── ARCHITECTURE.md
└── README.md
```

---

## Configuration System

All configurable parameters in `config.js`:

```js
const CONFIG = {
  // Canvas
  width: 1080,
  height: 1920,

  // Balls
  ball: {
    count: 1,
    radius: 15,
    color: '#ffffff',
    initialVelocity: { min: 5, max: 10 },
    restitution: 0.9,      // Bounciness (0-1)
    friction: 0,
    trailEnabled: true,
    trailLength: 20,
  },

  // Rings
  rings: {
    count: 5,
    innerRadius: 100,      // First ring radius
    spacing: 80,           // Distance between rings
    thickness: 8,
    gapSize: 60,           // Gap width in degrees
    color: '#4444ff',
    rotation: {
      enabled: true,
      baseSpeed: 0.01,
      direction: 'alternate', // 'cw', 'ccw', 'alternate'
    },
  },

  // Events (on escape)
  onEscape: {
    multiply: 2,           // 0 = disabled, 2+ = multiply
    sizeChange: 0,         // Percentage: 10 = grow 10%, -10 = shrink
    speedBoost: 1.1,       // Multiplier: 1 = none, 1.1 = 10% faster
    colorShift: true,
  },

  // Audio
  audio: {
    bounceEnabled: true,
    escapeEnabled: true,
    ambientEnabled: false,
    volume: 0.5,
  },

  // Simulation
  endCondition: 'escape',  // 'escape' | 'time' | 'ballCount'
  maxDuration: 60,         // Seconds (if endCondition = 'time')
  maxBalls: 500,           // Safety cap

  // Visual
  background: '#0a0a0a',
  glowEnabled: true,
};
```

---

## Core Classes

### Ball (`ball.js`)

```
Ball
├── Properties
│   ├── body (Matter.js body)
│   ├── radius
│   ├── color
│   ├── trail[] (position history)
│   └── escaped (bool)
│
├── Methods
│   ├── create() → add to Matter world
│   ├── update() → update trail
│   ├── draw() → render with p5.js
│   ├── applyEscapeEffects() → grow/shrink/color
│   └── remove() → remove from world
```

### Ring (`ring.js`)

```
Ring
├── Properties
│   ├── bodies[] (Matter.js static bodies for arc segments)
│   ├── radius
│   ├── gapStart (angle)
│   ├── gapSize (angle)
│   ├── rotation (current angle)
│   ├── rotationSpeed
│   └── color
│
├── Methods
│   ├── create() → build arc segments with gap
│   ├── update() → rotate (update body positions)
│   ├── draw() → render ring + gap
│   └── remove() → remove from world
```

### Simulation (`simulation.js`)

```
Simulation
├── Properties
│   ├── engine (Matter.js engine)
│   ├── world (Matter.js world)
│   ├── balls[]
│   ├── rings[]
│   ├── state ('running' | 'ended')
│   └── stats { escapes, time, ballCount }
│
├── Methods
│   ├── init() → create engine, rings, initial balls
│   ├── update() → step physics, rotate rings
│   ├── draw() → render all objects
│   ├── spawnBall() → add new ball
│   ├── handleEscape(ball, ring) → trigger events
│   ├── checkEndCondition()
│   └── reset()
```

---

## Physics Setup (Matter.js)

```
World
├── Gravity: { x: 0, y: 0 } (zero-g bouncing)
├── Bodies:
│   ├── Balls (dynamic circles)
│   └── Ring segments (static arcs)
│
├── Collision Detection:
│   ├── Ball ↔ Ring segment → bounce
│   └── Ball ↔ Ball → bounce (optional)
│
├── Events:
│   └── onCollisionStart → play sound, detect escape
```

### Escape Detection Logic

```
For each ball:
  - Track which ring it's inside (by radius)
  - If ball.distance_from_center > ring.radius + threshold
    AND ball was previously inside
    → Ball escaped this ring → trigger events
```

---

## Event Flow

```
Ball hits ring wall
    ↓
Matter.js collision event fires
    ↓
Play bounce sound (pitch based on velocity)
    ↓
Check: Did ball pass through gap?
    ↓ Yes
Ball escaped ring
    ↓
├── Play escape sound
├── If multiply: spawn N-1 new balls at same position
├── If sizeChange: adjust ball radius
├── If speedBoost: increase velocity
├── If colorShift: change ball hue
└── Check end condition
```

---

## Audio System (`audio.js`)

```
AudioManager
├── sounds: { bounce, escape, ambient }
├── loadSounds()
├── playBounce(velocity) → pitch varies with speed
├── playEscape()
├── startAmbient()
└── setVolume(v)
```

### Sound Design

| Event | Sound | Notes |
|-------|-------|-------|
| Bounce | Short pop/click | Pitch mapped to velocity |
| Escape | Whoosh or chime | Satisfying payoff |
| Ambient | Low drone | Optional background |

---

## Render Loop (p5.js)

```js
function setup() {
  createCanvas(CONFIG.width, CONFIG.height);
  simulation.init();
}

function draw() {
  background(CONFIG.background);

  simulation.update();  // Physics step + ring rotation
  simulation.draw();    // Render rings, balls, trails

  drawUI();             // Stats overlay (optional)
}
```

---

## Recording Strategy

### Option A: Screen Capture (Simplest) ✓ MVP
- Use OBS or browser extension
- Record browser window
- Manual start/stop

### Option B: Built-in MediaRecorder (Future)
- Capture canvas stream
- Export as WebM
- Add button: "Start Recording" / "Stop & Download"

### Option C: Frame Export (Future)
- Save each frame as PNG
- Stitch with FFmpeg
- Best quality, more complex

---

## UI Panel (Optional)

```
┌─────────────────────────┐
│ ▼ Balls                 │
│   Count: [===|====] 5   │
│   Size:  [==|=====] 15  │
│                         │
│ ▼ Rings                 │
│   Count: [===|====] 5   │
│   Gap:   [====|===] 60  │
│   Speed: [==|=====] 0.5 │
│                         │
│ ▼ Events                │
│   [x] Multiply (x2)     │
│   [ ] Size change       │
│   [x] Color shift       │
│                         │
│ [Reset] [Start Recording]│
└─────────────────────────┘
```

Toggle visibility for clean recording.

---

## Development Phases

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 | Basic bouncing ball in single ring | ⬜ |
| 2 | Multiple concentric rings with gaps | ⬜ |
| 3 | Ring rotation | ⬜ |
| 4 | Escape detection + events (multiply, color) | ⬜ |
| 5 | Audio (bounce + escape sounds) | ⬜ |
| 6 | Config UI panel | ⬜ |
| 7 | Visual polish (trails, glow) | ⬜ |
| 8 | Recording feature | ⬜ |

---

## Configurable Parameters Summary

### Ball Settings
| Parameter | Type | Range | Default |
|-----------|------|-------|---------|
| count | int | 1-100 | 1 |
| radius | int | 5-50 | 15 |
| color | hex | - | #ffffff |
| velocity | float | 1-20 | 5-10 |
| restitution | float | 0-1 | 0.9 |
| trailEnabled | bool | - | true |
| trailLength | int | 0-50 | 20 |

### Ring Settings
| Parameter | Type | Range | Default |
|-----------|------|-------|---------|
| count | int | 1-20 | 5 |
| innerRadius | int | 50-200 | 100 |
| spacing | int | 30-150 | 80 |
| thickness | int | 2-20 | 8 |
| gapSize | int | 20-120 (degrees) | 60 |
| color | hex | - | #4444ff |
| rotationEnabled | bool | - | true |
| rotationSpeed | float | 0-0.1 | 0.01 |
| rotationDirection | enum | cw/ccw/alternate | alternate |

### Event Settings (On Escape)
| Parameter | Type | Range | Default |
|-----------|------|-------|---------|
| multiply | int | 0-5 | 2 |
| sizeChange | int | -50 to 50 (%) | 0 |
| speedBoost | float | 0.5-2.0 | 1.1 |
| colorShift | bool | - | true |

### Simulation Settings
| Parameter | Type | Options | Default |
|-----------|------|---------|---------|
| endCondition | enum | escape/time/ballCount | escape |
| maxDuration | int | 10-120 (seconds) | 60 |
| maxBalls | int | 10-1000 | 500 |
| background | hex | - | #0a0a0a |
| glowEnabled | bool | - | true |

---

## Output Specifications

| Property | Value |
|----------|-------|
| Resolution | 1080 x 1920 (9:16 vertical) |
| Frame Rate | 60 FPS |
| Format | Screen capture → MP4 |
| Duration | Configurable (typically 30-60s) |

---

## Content Variation Ideas

To create varied content, adjust these per video:

1. **Ball count** - 1 ball vs 50 balls (different vibe)
2. **Ring count** - 3 easy escape vs 10 long journey
3. **Gap size** - Large (fast escape) vs small (tension)
4. **Rotation speed** - Static vs fast spinning
5. **Multiply factor** - x2 gradual vs x5 explosive
6. **Color schemes** - Neon, pastel, monochrome
7. **Starting velocity** - Slow build vs chaotic start

---

## Future Enhancements (Post-MVP)

- [ ] Preset system (save/load configurations)
- [ ] Batch rendering (queue multiple configs)
- [ ] Bounce-to-melody audio mode
- [ ] 3D version (Three.js)
- [ ] Mobile app export
- [ ] Social media direct upload
- [ ] Analytics (track which configs perform best)
