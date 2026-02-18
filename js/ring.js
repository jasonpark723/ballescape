// Ring class - Issue #4

class Ring {
  constructor(x, y, radius, thickness, color, gapStart = 0, gapSize = 0) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.thickness = thickness;
    this.color = color;
    this.segments = CONFIG.rings.segments;
    this.bodies = [];
    this.gapStart = gapStart; // Starting angle of gap (radians)
    this.gapSize = gapSize;   // Size of gap (radians)
  }

  isInGap(angle) {
    if (this.gapSize === 0) return false;

    // Normalize angle to [0, TWO_PI)
    let normalizedAngle = angle % TWO_PI;
    if (normalizedAngle < 0) normalizedAngle += TWO_PI;

    // Normalize gap start to [0, TWO_PI)
    let normalizedGapStart = this.gapStart % TWO_PI;
    if (normalizedGapStart < 0) normalizedGapStart += TWO_PI;

    const gapEnd = normalizedGapStart + this.gapSize;

    // Check if angle is within gap (handle wrap-around)
    if (gapEnd <= TWO_PI) {
      return normalizedAngle >= normalizedGapStart && normalizedAngle < gapEnd;
    } else {
      // Gap wraps around TWO_PI
      return normalizedAngle >= normalizedGapStart || normalizedAngle < (gapEnd - TWO_PI);
    }
  }

  create(world) {
    for (let i = 0; i < this.segments; i++) {
      const angle = (TWO_PI / this.segments) * i;

      // Skip segments that fall within the gap
      if (this.isInGap(angle)) {
        continue;
      }

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

    if (this.gapSize === 0) {
      // No gap - draw full circle
      ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    } else {
      // Draw arc excluding the gap
      const arcStart = this.gapStart + this.gapSize;
      const arcEnd = this.gapStart + TWO_PI;
      arc(this.x, this.y, this.radius * 2, this.radius * 2, arcStart, arcEnd);
    }

    pop();
  }
}
