// determines the width and height of the canvas in pixels
let canvas_size = [700, 500];
// determines the number of cells on the grid
let grid_size = [25, 25];
// determines the size  of each cell in the grid
let grid_cell_size = [25, 25];

let spawn_positions = [
  [3, 3],
  [15, 4],
];
let base_position = [22, 13];

// stores the path
let gameGrid;
let enemies = []

function setup() {
  // setup canvas
  createCanvas(canvas_size[0], canvas_size[1]);
  background(0);

  // initialize game grid
  gameGrid = new Grid();
  gameGrid.set_base_position(base_position);
  // generate initial paths and set base position
  for (let spawn_position of spawn_positions) {
    gameGrid.create_new_path(spawn_position);
  }
  gameGrid.generate_flow_map();

  // create new enemy object
  enemies = [new Enemy(spawn_positions[0], grid_cell_size)];
}

function draw() {
  background(0);
  gameGrid.render();
  render_group(enemies)
  move_enemies()
}

function move_enemies() {
  for (enemy of enemies) {
    enemy.move(gameGrid)
  }
}

function render_group (group) {
  for (member of group) {
    member.render()
  }
}