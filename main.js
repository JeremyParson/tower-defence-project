// determines the width and height of the canvas in pixels
let canvas_size = [700, 500];
// determines the number of cells on the grid
let grid_size = [25, 25];
// determines the size  of each cell in the grid
let grid_cell_size = [25, 25];
// contains a Grid object with map information
let gameGrid;

// determines where the enemies will spawn
let spawn_positions = [
  [3, 3],
  [15, 4],
];
// determines where the base will spawn
let base_position = [22, 13];
// tracks enemies, towers, and the base
let bullets = [], enemies = [],
  towers = [];
let base

let points = 800

// game state
const game_state = {
  MAIN_MENU: 0,
  GAME: 0,
  BUILD_TOWER: 1,
};
let state_stack = [game_state.MAIN_MENU]

// will contain the App object that renders the interface
let app = new App("app");
// initializing interface
let main_menu_component = new MainMenuComponent();
let game_component = new GameComponent();
let shop_component = new ShopComponent(tower_data);
let sidebar_component = new SidebarComponent();
let place_tower_component = new PlaceTowerComponent();
app.registerComponent(main_menu_component);

// create p5 scene instance
const p5GameInstance = (p) => {
  p.setup = () => {
    // setup app
    let canvas = createCanvas(canvas_size[0], canvas_size[1]);
    canvas.parent("game-canvas")
    app.connect_canvas(canvas)
  };

  p.draw = () => {
    background(0);
    gameGrid.render();
    shoot_enemies();
    move_enemies();
    update_bullets();
    base.render()
    render_group(enemies);
    render_group(towers);
    render_group(bullets);

    // removes dead enemies
    enemies = enemies.filter((enemy => !enemy.is_dead()))
    // remove frozen bullets
    bullets = bullets.filter((bullet => !bullet.target_hit))
  }
};

function setup() {}

// changes the current game state
function change_game_state(next_state) {

if (next_state === game_state.BUILD_TOWER) {
  app.removeComponent("shop_component");
  app.registerFirst(place_tower_component);
}
}

function shoot_enemies () {
  for(let tower of towers) {
    let bullet = tower.shoot_enemy(enemies)
    if (bullet) bullets.push(bullet)
  }
}

function update_bullets () {
  for (bullet of bullets) {
    bullet.update()
  }
}

function move_enemies() {
  for (enemy of enemies) {
    enemy.move(gameGrid);
  }
}

function remove_dead_enemies () {
  enemies = enemies.filter((enemy => !enemy.is_dead()))
}

function render_group(group) {
  for (member of group) {
    member.render();
  }
}

function start_game() {
  // setup game interface
  app.clearAllComponents();
  app.registerComponent(shop_component);
  app.registerComponent(game_component);
  app.registerComponent(sidebar_component);

  let myp5 = new p5(p5GameInstance);

  // initialize grid
  gameGrid = new Grid();
  gameGrid.set_base_position(base_position);
  for (let spawn_position of spawn_positions) {
    gameGrid.create_new_path(spawn_position);
  }

  gameGrid.generate_flow_map();
  enemies.push(new Enemy(spawn_positions[0], grid_cell_size));
  base = new Base(base_position, grid_cell_size)
  change_game_state(game_state.GAME);
}

// handle tower creation
async function create_tower (tower_name) {
  // check if tower can be purchased
  if (tower_data[tower_name].cost > points) return
  points -= tower_data[tower_name].cost

  // setup place tower hint
  place_tower_component.state = {"tower_name": tower_name}
  app.updateView()
  app.removeComponent("shop_component");
  app.registerFirst(place_tower_component);
  
  await gameGrid.selection()
  let build_position = vect_div([mouseX, mouseY], grid_cell_size)
  build_position = vect_floor(build_position)

  towers.push(new Tower(build_position, grid_cell_size, tower_data[tower_name]))

  // setup shop component
  app.removeComponent("shop_component");
  app.registerFirst(shop_component)
}