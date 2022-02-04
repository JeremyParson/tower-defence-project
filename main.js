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
let bullets = [],
  towers = [];
let base = new Base(base_position, grid_cell_size)
let selected_tower;
// initialize enemy manager
let enemies = new EnemyManager();
spawn_positions.map((position) => enemies.add_spawn_position(position));
enemies.set_base_position(base_position);

// tracks the number of points earned
let points = 500;
const get_game_stats = (base) => {
  return { health: base.health, max_health: base.max_health };
};

// create wave information
let is_wave_started = false;
let wave_number = 1;
let wave_time = 10000;
let prev_time = wave_time

// game state
const game_state = {
  MAIN_MENU: 0,
  GAME: 0,
  GAME_OVER: 1,
};
let state_stack = [game_state.MAIN_MENU];

// initialize a new app object
let app = new App("app");
// initializing interface components
let main_menu_component = new MainMenuComponent();
let game_component_state = {
  ...get_game_stats(base),
  ...{points: points}
}
let game_component = new GameComponent(game_component_state);
let shop_component = new ShopComponent(tower_data);
let base_upgrade_component = new UpgradesComponent({wave: 1, started: is_wave_started});
let place_tower_component = new PlaceTowerComponent();
let game_over_component = new GameOver();

// render main menu first
app.registerComponent(main_menu_component);

// stores the p5 instance
let game_p5;
// creates a p5 scene instance
const p5GameInstance = (p) => {
  p.setup = () => {
    // setup app
    let canvas = createCanvas(canvas_size[0], canvas_size[1]);
    canvas.parent("game-canvas");
    app.connect_canvas(canvas);
  };

  p.draw = () => {
    wave_time -= deltaTime;
    if (prev_time - wave_time >= 1000) {
      prev_time = wave_time
    }
    background(16, 0, 31);
    gameGrid.render();
    shoot_enemies(enemies.get_enemies());
    enemies.move(gameGrid);
    update_bullets();
    base.render();
    enemies.cleanup_dead();

    enemies.render();
    render_group(towers);
    render_group(bullets);

    // remove frozen bullets
    bullets = bullets.filter((bullet) => !bullet.target_hit);

    // register point changes
    let earned_points = enemies.get_earned_points()
    if (earned_points) {
      points += earned_points;
      // update interface
      game_component.set_state({points: points});
      app.updateView();
    }

    // register hits
    let hits = enemies.get_hits();
    if (!hits) return;
    base.health -= hits;
    let new_game_stats = get_game_stats(base)
    game_component.set_state(new_game_stats)
    app.updateView()
    if (base.health <= 0) end_game();
  };

  p.mousePressed = () => {
    if (selected_tower) selected_tower.selected = false;
    // get selection location
    let position = [mouseX, mouseY]
    position = vect_div(position, grid_cell_size)
    position = vect_floor(position)
    // find tower that matches selection
    let tower = towers.filter(tw => vect_equal(tw.position, position))
    if (!tower.length) return;
    selected_tower = tower[0]
    selected_tower.selected = true;
    // determine if tower is upgradable
    let upgradable = selected_tower.is_upgradable()
    // create state for upgrade component
    let data = {name: selected_tower.stats.name, upgradable: upgradable, selected: true}
    if (upgradable) 
      data = {...data, ...{cost: selected_tower.get_upgrade_cost(), upgrade: selected_tower.get_upgrade_as_string()}}
    base_upgrade_component.set_state(data)
    app.updateView()
  }
}


// everything breaks when I remove this empty function for some reason ;(
function setup() {}

// starts the next rounds
async function start_wave () {
  if (is_wave_started) return;
  is_wave_started = true

  // update interface to indicate that the wave has started
  base_upgrade_component.set_state({started: true})
  app.removeComponent("shop_component")
  app.updateView()
  // start the wave
  enemies.generate_next_wave();
  enemies.spawn_wave();

  // wait for all enemies to disperse
  await enemies.all_gone();

  // increase wave difficulty and count
  enemies.increase_difficulty();
  wave_number += 1;

  // update interface to display next wave button
  base_upgrade_component.set_state({wave: wave_number, started: false})
  app.registerFirst(shop_component)
  app.updateView()
  is_wave_started = false
}

// visits each tower and attempts to shoot at a target
function shoot_enemies(enemies) {
  for (let tower of towers) {
    let bullet = tower.shoot_enemy(enemies);
    if (bullet) bullets.push(bullet);
  }
}

// updates the positions of all bullets
function update_bullets() {
  for (bullet of bullets) {
    bullet.update();
  }
}

// renders an array of game objects
function render_group(group) {
  for (member of group) {
    member.render();
  }
}

// invoked by a button on the main-menu interface component
// starts the game
function start_game() {
  // setup game interface
  app.clearAllComponents();
  app.registerComponent(shop_component);
  app.registerComponent(game_component);
  app.registerComponent(base_upgrade_component);

  game_p5 = new p5(p5GameInstance);

  // initialize grid
  gameGrid = new Grid();
  gameGrid.set_base_position(base_position);
  for (let spawn_position of spawn_positions) {
    gameGrid.create_new_path(spawn_position);
  }

  gameGrid.generate_flow_map();
}

// cleans up p5 and displays end stats game over screen
function end_game () {
  game_p5.noLoop()
  app.disconnect_canvas()
  app.clearAllComponents()
  app.registerComponent(game_over_component)
}

// handle tower creation
async function create_tower(tower_name) {
  // check if tower can be purchased
  if (tower_data[tower_name].cost > points) return;
  points -= tower_data[tower_name].cost;

  game_component.set_state({points: points});
  // setup place tower hint
  place_tower_component.state = { tower_name: tower_name };
  app.updateView();
  app.removeComponent("shop_component");
  app.registerFirst(place_tower_component);
  // wait for player to select location on grid
  await gameGrid.selection();
  // get cell position and create a new tower
  let build_position = vect_div([mouseX, mouseY], grid_cell_size);
  build_position = vect_floor(build_position);

  towers.push(
    new Tower(build_position, grid_cell_size, tower_data[tower_name])
  );

  // setup shop component
  app.removeComponent("shop_component");
  app.registerFirst(shop_component);
}

// handle tower upgrade
function upgrade_tower() {
  // check if player has enough points
  let cost = selected_tower.get_upgrade_cost()
  if (points < cost) return;
  points -= cost;
  // upgrade tower
  selected_tower.upgrade()
  //update interface
  // determine if tower is upgradable
  let upgradable = selected_tower.is_upgradable()
  let data = {upgradable: upgradable}
  // create state for upgrade component
  if (upgradable) 
    data = {...data, ...{cost: selected_tower.get_upgrade_cost(), upgrade: selected_tower.get_upgrade_as_string()}}
  base_upgrade_component.set_state(data)
  game_component.set_state({points: points})
  app.updateView()
}
