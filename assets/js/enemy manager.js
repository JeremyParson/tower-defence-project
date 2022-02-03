class EnemyManager {
  constructor() {
    this.difficulty = 0;
    this.points = 0;
    // contains the enemies in 3 separate states, queued, spawning, and active
    this.queue = [];
    this.spawning = [];
    this.active = [];
    this.dead = []
    this.cell_size = [25, 25];
    this.base_position = [-1, -1];
    this.is_spawning = false;
    this.spawn_positions = [];
  }

  // returns all active enemies
  get_enemies() {
    return this.active;
  }

  // checks every second to see if all active and spawning enemies are gone
  async all_gone() {
    return new Promise((res) => {
      let interval = setInterval(() => {
        if (!this.active.length && !this.spawning.length) {
          clearInterval(interval);
          res();
        }
      }, 1000);
    })
  }

  set_base_position(base_position) {
    this.base_position = base_position;
  }

  // makes all enemies in queue active over time
  async spawn_wave() {
    // prevent function from executing if one instance is already running
    if (this.is_spawning) return;
    // move all enemies in queue to spawning
    this.spawning = [...this.queue];
    this.queue = [];
    this.is_spawning = true;
    // cycle through each enemy and set their start positions
    const spawn_delay = () => new Promise((res) => setTimeout(res, 1000));
    let spawn_position = this.get_next(spawn_positions);
    while (this.spawning.length) {
      let enemy = this.spawning.pop();
      enemy.position = spawn_position.next().value;
      this.active.push(enemy);
      await spawn_delay();
    }
    // cleanup
    this.is_spawning = false;
    if (!this.queue.length) return;
    this.spawning = [...this.queue];
    this.queue = [];
  }

  // returns the the next shifted index in an array
  *get_next(array) {
    let index = 0;
    while (true) {
      yield array[index];
      index = index + 1 == array.length ? (index = 0) : index + 1;
    }
  }

  // moves all active enemies
  move(gameGrid) {
    for (let enemy of this.active) {
      enemy.move(gameGrid);
    }
  }

  // return the number of points earned this frame
  get_earned_points() {
    if (!this.dead.length) return 0;
    let points = 0;
    for (let enemy of this.dead) {
      points += enemy.stats.points;
    }
    this.dead = [];
    return points;
  }

  // removes all dead from memory
  flush_dead() {
    this.dead = []
  }

  // removes all dead enemies from active array
  cleanup_dead() {
    let fresh = this.active.filter((en => en.is_dead()))
    if (fresh.length) {
      console.log("test")
    }
    this.dead = this.dead.concat(fresh)
    this.active = this.active.filter((en => !en.is_dead()))
  }

  // get number of base hits
  get_hits() {
    let hits = 0

    for (let index in this.active) {
      let enemy = this.active[index]
      let distance = vect_sub(enemy.position, this.base_position)
      distance = Math.abs(vect_length(distance))
      if (distance < 1) {
        hits += 1
        this.active.splice(index, 1)
      }
    }

    return hits;
  }

  generate_next_wave() {
    // get points for this wave
    this.points = this.get_points(this.difficulty);
    // define sorting/filtering functions to select from roster
    // returns all enemies available for purchase this wave
    const available = (roster) => roster.filter((enemy) => enemy.difficulty <= this.difficulty && enemy.cost <= this.points)
    const effective = (roster) => roster.filter((enemy) => enemy.cost < this.points / 10);
    // buy random enemies
    let purchase_made = true;
    const original_points = this.points;
    let available_enemies = available(enemy_roster_data);
    let cost_effective_enemies = effective(available_enemies);

    // repeatedly loop until no more enemies can be purchased
    while (available_enemies.length || cost_effective_enemies.length) {
      let enemy_data;

      // determine whether to buy cost effectively or to randomly pick from all options 
      if (this.points <= original_points / 2 && cost_effective_enemies.length) {
        enemy_data = cost_effective_enemies[Math.floor(Math.random() * cost_effective_enemies.length)]
      } else {
        enemy_data = available_enemies[Math.floor(Math.random() * available_enemies.length)]
      }

      // add enemy to the wave queue
      let enemy = new Enemy(enemy_data, [-1, -1], this.cell_size);
      this.queue.push(enemy);
      this.points -= enemy_data.cost;

      available_enemies = available(enemy_roster_data);
      cost_effective_enemies = effective(available_enemies);
    }
  }

  increase_difficulty() {
    this.difficulty += 1;
  }

  get_points(difficulty) {
    return Math.pow(5 * difficulty, 2) + 2 * difficulty + 100;
  }

  add_spawn_position(spawn_position) {
    this.spawn_positions.push(spawn_position);
  }

  render() {
    for (let enemy of this.active) {
      enemy.render();
    }
  }
}
