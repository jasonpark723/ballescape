// Ring class - Issue #4

class Ring {
  constructor(x, y, radius, thickness, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.thickness = thickness;
    this.color = color;
    this.segments = CONFIG.rings.segments;
    this.bodies = [];
  }

  create(world) {
    for (let i = 0; i < this.segments; i++) {
      const angle = (TWO_PI / this.segments) * i;

      // Segment position (on the ring radius)
      const segX = this.x + cos(angle) * this.radius;
      const segY = this.y + sin(angle) * this.radius;

      // Segment dimensions
      // Width = tangential (arc length), Height = radial (thickness)
      const arcLength = (TWO_PI * this.radius) / this.segments;
      const segmentWidth = arcLength * 2; // 100% overlap - edges fully buried in neighbors
      // Make physics body much thicker than visual so edges are unreachable
      const segmentHeight = this.radius;

      // Segment rotation (perpendicular to radius)
      const segmentAngle = angle + HALF_PI;

      // Create segment - position adjusted outward so inner surface aligns with visual ring
      const bodyRadius = this.radius + (segmentHeight / 2) - (this.thickness / 2);
      const bodyX = this.x + cos(angle) * bodyRadius;
      const bodyY = this.y + sin(angle) * bodyRadius;

      const segment = Matter.Bodies.rectangle(bodyX, bodyY, segmentWidth, segmentHeight, {
        isStatic: true,
        angle: segmentAngle,
        label: 'ring',
        restitution: 1.0,
        friction: 0,
        frictionStatic: 0
      });

      this.bodies.push(segment);
    }

    Matter.Composite.add(world, this.bodies);
  }

  draw() {
    push();
    noFill();
    stroke(this.color);
    strokeWeight(this.thickness);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    pop();
  }
}
