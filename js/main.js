function setup() {
  createCanvas(CONFIG.width, CONFIG.height);
  Simulation.init();
}

function draw() {
  background(CONFIG.background);
  Simulation.update();
  Simulation.draw();
}
