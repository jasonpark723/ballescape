# Ball Escape - Development Checklist

## Phase 1: Basic Bouncing Ball in Single Ring
- [ ] Create project structure (index.html, css/, js/)
- [ ] Set up p5.js and Matter.js dependencies
- [ ] Create config.js with initial parameters
- [ ] Implement Ball class with Matter.js body
- [ ] Implement Ring class (single ring, no gap yet)
- [ ] Set up zero-gravity physics world
- [ ] Render ball and ring with p5.js
- [ ] Verify ball bounces off ring walls

## Phase 2: Multiple Concentric Rings with Gaps
- [ ] Extend Ring class to support gaps (arc segments)
- [ ] Create multiple rings with configurable spacing
- [ ] Implement gap rendering (visual break in ring)
- [ ] Verify ball can pass through gaps
- [ ] Test collision detection with arc segments

## Phase 3: Ring Rotation
- [ ] Add rotation property to Ring class
- [ ] Implement rotation update logic (cw/ccw/alternate)
- [ ] Update Matter.js body positions on rotation
- [ ] Sync visual rendering with physics bodies
- [ ] Test ball interaction with rotating rings

## Phase 4: Escape Detection + Events
- [ ] Track which ring each ball is inside
- [ ] Detect when ball escapes through gap
- [ ] Implement ball multiplication on escape
- [ ] Implement size change on escape
- [ ] Implement speed boost on escape
- [ ] Implement color shift on escape
- [ ] Add end condition checks (escape/time/ballCount)

## Phase 5: Audio System
- [ ] Set up p5.sound
- [ ] Create/source bounce sound effect
- [ ] Create/source escape sound effect
- [ ] Create/source ambient sound (optional)
- [ ] Implement AudioManager class
- [ ] Map bounce pitch to ball velocity
- [ ] Trigger sounds on collision events

## Phase 6: Config UI Panel
- [ ] Create collapsible UI panel
- [ ] Add ball parameter sliders (count, size, velocity)
- [ ] Add ring parameter sliders (count, gap, speed)
- [ ] Add event toggles (multiply, size, color)
- [ ] Add reset button
- [ ] Add UI visibility toggle for clean recording

## Phase 7: Visual Polish
- [ ] Implement ball trails (position history)
- [ ] Add glow effects (shadow blur)
- [ ] Add color schemes/palettes
- [ ] Smooth animations and transitions
- [ ] Performance optimization for many balls

## Phase 8: Recording Feature
- [ ] Implement screen capture instructions
- [ ] (Future) Add MediaRecorder integration
- [ ] (Future) Add start/stop recording buttons
- [ ] (Future) Export as WebM/MP4

---

## Requirements Summary

### Functional Requirements
- [ ] Balls bounce inside concentric rings with zero gravity
- [ ] Rings have configurable gaps that balls can escape through
- [ ] Rings rotate at configurable speeds and directions
- [ ] Escape events trigger: multiply, grow/shrink, speed boost, color shift
- [ ] Simulation ends based on configurable condition
- [ ] Audio feedback for bounces and escapes
- [ ] All parameters configurable via UI

### Technical Requirements
- [ ] 1080x1920 resolution (9:16 vertical)
- [ ] 60 FPS rendering
- [ ] Matter.js for physics
- [ ] p5.js for rendering
- [ ] p5.sound for audio
- [ ] Browser-based (no server required)

### Performance Requirements
- [ ] Handle up to 500 balls smoothly
- [ ] Maintain 60 FPS during normal operation
- [ ] Efficient collision detection with ring segments
