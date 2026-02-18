const CONFIG = {
  width: 1080,
  height: 1920,
  background: '#0a0a0a',
  ball: {
    radius: 15,
    color: '#ffffff',
    restitution: 0.9,
    friction: 0,
    initialSpeed: { min: 5, max: 10 },
  },
  rings: {
    innerRadius: 100,
    thickness: 8,
    color: '#4444ff',
    segments: 48,
    gapSize: 45, // Gap size in degrees
  },
};
