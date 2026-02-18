# Phase 1: Basic Bouncing Ball in Single Ring

## Objective
Create a minimal working prototype: a single ball bouncing inside a single ring with no gaps.

---

## Work Items

### 1.1 Project Setup
**Files to create:**
- `index.html` - HTML entry point with canvas container
- `css/style.css` - Basic styling (dark background, centered canvas)
- `js/main.js` - p5.js setup() and draw() functions
- `js/config.js` - Configuration object with default values

**Dependencies to include:**
- p5.js (CDN or local)
- Matter.js (CDN or local)

**Acceptance Criteria:**
- [ ] Page loads without errors
- [ ] Canvas displays at 1080x1920 (or scaled for development)
- [ ] Dark background renders

---

### 1.2 Configuration System
**File:** `js/config.js`

**Initial config needed:**
```js
const CONFIG = {
  width: 1080,
  height: 1920,
  background: '#0a0a0a',
  ball: {
    radius: 15,
    color: '#ffffff',
    restitution: 0.9,
    friction: 0,
  },
  rings: {
    innerRadius: 100,
    thickness: 8,
    color: '#4444ff',
  },
};
```

**Acceptance Criteria:**
- [ ] CONFIG object accessible globally
- [ ] Values used by simulation components

---

### 1.3 Ball Class
**File:** `js/ball.js`

**Properties:**
- `body` - Matter.js circular body
- `radius` - Ball size
- `color` - Fill color

**Methods:**
- `constructor(x, y, radius, color)` - Initialize ball
- `create(world)` - Add Matter.js body to world
- `draw()` - Render ball using p5.js
- `getPosition()` - Return current {x, y}

**Matter.js body options:**
```js
{
  restitution: CONFIG.ball.restitution,
  friction: CONFIG.ball.friction,
  frictionAir: 0,
  label: 'ball'
}
```

**Acceptance Criteria:**
- [ ] Ball renders at correct position
- [ ] Ball has correct physics properties
- [ ] Ball position updates each frame

---

### 1.4 Ring Class (No Gap)
**File:** `js/ring.js`

**Properties:**
- `bodies[]` - Array of Matter.js static bodies
- `radius` - Ring radius (center line)
- `thickness` - Ring wall thickness
- `color` - Fill color
- `segments` - Number of segments forming the ring

**Methods:**
- `constructor(x, y, radius, thickness, color)` - Initialize ring
- `create(world)` - Build ring from rectangular segments, add to world
- `draw()` - Render ring using p5.js arc or segments

**Implementation Notes:**
- Ring is made of multiple small rectangular bodies arranged in a circle
- Each segment is a static Matter.js body
- Segments overlap slightly to prevent gaps

**Acceptance Criteria:**
- [ ] Ring renders as a circle
- [ ] Ring is made of static physics bodies
- [ ] Ball collides with ring and bounces

---

### 1.5 Simulation Setup
**File:** `js/simulation.js`

**Properties:**
- `engine` - Matter.js engine
- `world` - Matter.js world
- `ball` - Ball instance
- `ring` - Ring instance

**Methods:**
- `init()` - Create engine, world, ring, ball
- `update()` - Step physics engine
- `draw()` - Render all objects

**Physics Configuration:**
```js
engine.gravity.x = 0;
engine.gravity.y = 0; // Zero gravity
```

**Ball Initial State:**
- Position: Center of canvas
- Velocity: Random direction, magnitude 5-10

**Acceptance Criteria:**
- [ ] Physics engine runs at consistent rate
- [ ] Ball starts with random velocity
- [ ] Ball bounces off ring continuously

---

### 1.6 Main Entry Point
**File:** `js/main.js`

**p5.js Functions:**
```js
function setup() {
  createCanvas(CONFIG.width, CONFIG.height);
  simulation.init();
}

function draw() {
  background(CONFIG.background);
  simulation.update();
  simulation.draw();
}
```

**Acceptance Criteria:**
- [ ] Simulation initializes on page load
- [ ] Render loop runs at 60 FPS
- [ ] Ball visually bounces inside ring

---

## Testing Checklist

- [ ] Ball spawns at center
- [ ] Ball moves in random direction
- [ ] Ball bounces off ring (changes direction)
- [ ] Ball maintains speed (no energy loss beyond restitution)
- [ ] No physics glitches (tunneling, stuck balls)
- [ ] Console shows no errors

---

## Files Created This Phase

```
ballescape/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js
    ├── config.js
    ├── simulation.js
    ├── ball.js
    └── ring.js
```

---

## Notes

- Use `Matter.Engine.update(engine, 1000/60)` for consistent physics
- Consider using `Matter.Render` for debugging (optional)
- Ring segments: ~36-72 segments for smooth circle
- Ball should never escape (no gap yet)
