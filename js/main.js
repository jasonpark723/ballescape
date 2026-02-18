function setup() {
  createCanvas(CONFIG.width, CONFIG.height);
  frameRate(60);
  Simulation.init();
}

function draw() {
  background(CONFIG.background);
  Simulation.update();
  Simulation.draw();
}
