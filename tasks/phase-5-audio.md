# Phase 5: Audio System

## Objective
Add satisfying audio feedback for ball bounces and escapes using p5.sound.

---

## Prerequisites
- Phase 4 completed (escape detection + events)

---

## Work Items

### 5.1 Set Up p5.sound
**File:** `index.html`

**Add p5.sound library:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/addons/p5.sound.min.js"></script>
```

**File:** `js/main.js`

**Preload sounds:**
```js
let bounceSound, escapeSound, ambientSound;

function preload() {
  soundFormats('mp3', 'wav');
  bounceSound = loadSound('assets/sounds/bounce');
  escapeSound = loadSound('assets/sounds/escape');
  // ambientSound = loadSound('assets/sounds/ambient');
}
```

**Acceptance Criteria:**
- [ ] p5.sound library loads
- [ ] Sounds preload before setup

---

### 5.2 Create/Source Sound Assets
**Directory:** `assets/sounds/`

**Required Sounds:**

| Sound | Description | Duration | Notes |
|-------|-------------|----------|-------|
| bounce.mp3 | Short pop/click | ~50-100ms | Crisp, satisfying |
| escape.mp3 | Whoosh or chime | ~200-500ms | Rewarding, distinct |
| ambient.mp3 | Low drone/pad | Loop | Optional background |

**Sources:**
- Create with audio software (Audacity, etc.)
- Use royalty-free sound libraries
- Generate with Web Audio API (programmatic)

**Acceptance Criteria:**
- [ ] bounce.mp3 exists and plays
- [ ] escape.mp3 exists and plays
- [ ] Sounds are appropriate length/style

---

### 5.3 AudioManager Class
**File:** `js/audio.js`

**Implementation:**
```js
class AudioManager {
  constructor() {
    this.sounds = {
      bounce: null,
      escape: null,
      ambient: null
    };
    this.volume = CONFIG.audio.volume;
    this.enabled = true;
  }

  init(bounceSound, escapeSound, ambientSound) {
    this.sounds.bounce = bounceSound;
    this.sounds.escape = escapeSound;
    this.sounds.ambient = ambientSound;

    // Set initial volume
    this.setVolume(this.volume);
  }

  setVolume(v) {
    this.volume = v;
    Object.values(this.sounds).forEach(sound => {
      if (sound) sound.setVolume(v);
    });
  }

  playBounce(velocity) {
    if (!CONFIG.audio.bounceEnabled || !this.sounds.bounce) return;

    // Map velocity to playback rate (pitch)
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    const rate = map(speed, 0, 20, 0.8, 1.5);

    this.sounds.bounce.rate(rate);
    this.sounds.bounce.play();
  }

  playEscape() {
    if (!CONFIG.audio.escapeEnabled || !this.sounds.escape) return;
    this.sounds.escape.play();
  }

  startAmbient() {
    if (!CONFIG.audio.ambientEnabled || !this.sounds.ambient) return;
    this.sounds.ambient.loop();
  }

  stopAmbient() {
    if (this.sounds.ambient) {
      this.sounds.ambient.stop();
    }
  }

  mute() {
    this.enabled = false;
    this.setVolume(0);
  }

  unmute() {
    this.enabled = true;
    this.setVolume(CONFIG.audio.volume);
  }
}

const audioManager = new AudioManager();
```

**Acceptance Criteria:**
- [ ] AudioManager initializes with sounds
- [ ] Volume control works
- [ ] Mute/unmute works

---

### 5.4 Bounce Sound with Velocity-Based Pitch
**File:** `js/audio.js`

**Implementation Details:**
- Faster collisions = higher pitch
- Slower collisions = lower pitch
- Creates variety and feedback about ball speed

```js
playBounce(velocity) {
  if (!CONFIG.audio.bounceEnabled) return;

  const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

  // Clamp speed to reasonable range
  const clampedSpeed = constrain(speed, 2, 15);

  // Map to playback rate (0.5 = half speed/octave down, 2.0 = double/octave up)
  const rate = map(clampedSpeed, 2, 15, 0.7, 1.4);

  // Slight random variation for natural feel
  const finalRate = rate + random(-0.05, 0.05);

  this.sounds.bounce.rate(finalRate);
  this.sounds.bounce.play();
}
```

**Acceptance Criteria:**
- [ ] Pitch varies with ball speed
- [ ] Sound doesn't distort at extremes
- [ ] Sounds natural and satisfying

---

### 5.5 Trigger Sounds on Collision Events
**File:** `js/simulation.js`

**Matter.js Collision Events:**
```js
init() {
  // ... existing setup

  Matter.Events.on(this.engine, 'collisionStart', (event) => {
    event.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;

      // Check if ball hit ring
      if (this.isBallRingCollision(bodyA, bodyB)) {
        const ball = this.getBallFromBody(bodyA, bodyB);
        if (ball) {
          audioManager.playBounce(ball.body.velocity);
        }
      }
    });
  });
}

isBallRingCollision(bodyA, bodyB) {
  const labels = [bodyA.label, bodyB.label];
  return labels.includes('ball') && labels.includes('ring-segment');
}

getBallFromBody(bodyA, bodyB) {
  const ballBody = bodyA.label === 'ball' ? bodyA : bodyB;
  return this.balls.find(b => b.body.id === ballBody.id);
}
```

**Acceptance Criteria:**
- [ ] Bounce sound plays on ball-ring collision
- [ ] Sound uses correct ball's velocity
- [ ] No duplicate sounds per collision

---

### 5.6 Escape Sound Trigger
**File:** `js/events.js`

**Add to handleEscape():**
```js
function handleEscape(ball, ringIndex, simulation) {
  // Play escape sound
  audioManager.playEscape();

  // ... existing escape effects
}
```

**Acceptance Criteria:**
- [ ] Escape sound plays when ball escapes
- [ ] Sound distinct from bounce
- [ ] Works with multiple escapes

---

### 5.7 Configuration Integration
**File:** `js/config.js`

**Audio Config:**
```js
audio: {
  bounceEnabled: true,
  escapeEnabled: true,
  ambientEnabled: false,
  volume: 0.5,           // 0.0 to 1.0
  bouncePitchRange: {
    min: 0.7,
    max: 1.4
  }
}
```

**Acceptance Criteria:**
- [ ] Each sound type can be disabled
- [ ] Volume configurable
- [ ] Settings respected

---

### 5.8 User Interaction Requirement
**Note:** Browsers require user interaction before playing audio.

**File:** `js/main.js`

**Implementation:**
```js
function setup() {
  createCanvas(CONFIG.width, CONFIG.height);

  // Create start button overlay
  const startButton = createButton('Click to Start');
  startButton.position(width/2 - 50, height/2);
  startButton.mousePressed(() => {
    userStartAudio(); // p5.sound function to enable audio
    audioManager.init(bounceSound, escapeSound, ambientSound);
    simulation.init();
    startButton.remove();
  });
}
```

**Alternative: Start on any click**
```js
function mousePressed() {
  if (!audioStarted) {
    userStartAudio();
    audioStarted = true;
  }
}
```

**Acceptance Criteria:**
- [ ] Audio works after user interaction
- [ ] No console errors about audio context
- [ ] Graceful handling if audio fails

---

## Testing Checklist

- [ ] Bounce sound plays on collision
- [ ] Bounce pitch varies with speed
- [ ] Escape sound plays on escape
- [ ] Volume control works
- [ ] Individual sounds can be disabled
- [ ] No audio overlap issues with rapid bounces
- [ ] Audio starts after user interaction
- [ ] Performance acceptable with many sounds

---

## Sound Design Tips

### Bounce Sound
- Short attack, quick decay
- Clean "pop" or "tick"
- Avoid harsh frequencies
- Test at various speeds

### Escape Sound
- Slightly longer (satisfying payoff)
- Could be ascending tone
- Distinct from bounce
- Consider layered sounds

### Performance
- Limit concurrent sounds if needed
- Consider sound pooling for many balls
- Test with 100+ balls

---

## Notes

- p5.sound uses Web Audio API under the hood
- Consider adding reverb/effects for polish
- May need to debounce rapid collisions
- Future: Procedural audio generation for variety
