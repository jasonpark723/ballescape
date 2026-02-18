// Ball class - Issue #3

class Ball {
  constructor(x, y, radius, color) {
    this.radius = radius;
    this.color = color;
    this.body = Matter.Bodies.circle(x, y, radius, {
      restitution: CONFIG.ball.restitution,
      friction: CONFIG.ball.friction,
      frictionAir: 0,
      label: 'ball'
    });
  }

  create(world) {
    Matter.Composite.add(world, this.body);
  }

  draw() {
    const pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.radius * 2, this.radius * 2);
    pop();
  }

  getPosition() {
    return {
      x: this.body.position.x,
      y: this.body.position.y
    };
  }
}
