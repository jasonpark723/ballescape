// Simulation - Issue #5

const Simulation = {
  engine: null,
  world: null,
  ball: null,
  ring: null,
  ballSpeed: null,

  init() {
    // Create Matter.js engine with zero gravity
    this.engine = Matter.Engine.create();
    this.engine.gravity.x = 0;
    this.engine.gravity.y = 0;
    this.world = this.engine.world;

    // Create ring at center of canvas
    const centerX = CONFIG.width / 2;
    const centerY = CONFIG.height / 2;
    const gapStart = random(0, TWO_PI);
    const gapSize = (CONFIG.rings.gapSize * PI) / 180; // Convert degrees to radians
    this.ring = new Ring(
      centerX,
      centerY,
      CONFIG.rings.innerRadius,
      CONFIG.rings.thickness,
      CONFIG.rings.color,
      gapStart,
      gapSize
    );
    this.ring.create(this.world);

    // Create ball at center of canvas
    this.ball = new Ball(
      centerX,
      centerY,
      CONFIG.ball.radius,
      CONFIG.ball.color
    );
    this.ball.create(this.world);

    // Set random initial velocity
    const angle = random(0, TWO_PI);
    this.ballSpeed = random(CONFIG.ball.initialSpeed.min, CONFIG.ball.initialSpeed.max);
    Matter.Body.setVelocity(this.ball.body, {
      x: cos(angle) * this.ballSpeed,
      y: sin(angle) * this.ballSpeed
    });
  },

  update() {
    Matter.Engine.update(this.engine, 1000 / 60);

    // Enforce constant speed (normalize velocity, apply target speed)
    const vel = this.ball.body.velocity;
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
    if (speed > 0) {
      Matter.Body.setVelocity(this.ball.body, {
        x: (vel.x / speed) * this.ballSpeed,
        y: (vel.y / speed) * this.ballSpeed
      });
    }
  },

  draw() {
    this.ring.draw();
    this.ball.draw();
  }
};
