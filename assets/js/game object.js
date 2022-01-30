class GameObject {
  constructor(position, cell_size) {
    this.position = position;
    this.cell_size = cell_size;
    this.half_cell = vect_div(cell_size, [2, 2]);
  }

  get_position() {
    return this.position;
  }

  render() {}

  connect(signal, callback, ...params) {}
}

class Enemy extends GameObject {
  constructor(position, cell_size, radius = 20) {
    super(position, cell_size);
    this.health = 15;
    this.radius = radius;
    this.move_speed = 0.02;
  }

  move(grid) {
    if (this.is_dead()) return;
    // find nearest cell with a smaller step value and move towards it
    let move_position = grid.get_move(vect_round([...this.position]));
    this.position = vect_lerp(
      [...this.position],
      move_position,
      this.move_speed
    );
  }

  render() {
    let render_position = vect_mult(this.position, this.cell_size);
    render_position = vect_add(render_position, this.half_cell);
    fill(255, 0, 0);
    circle(...render_position, this.radius);
  }

  is_dead() {
    return this.health < 1;
  }

  hit(damage) {
    this.health -= damage;
  }
}

class Bullet extends GameObject {
  constructor(position, cell_size, target, damage = 1, radius = 10) {
    super(position, cell_size);
    this.target = target;
    this.move_speed = 0.15;
    this.target_hit = false;
    this.radius = radius;
    this.damage = damage;
  }

  // moves the bullet towards it's target
  update() {
    if (this.target_hit) return;
    let distance = vect_sub(this.position, this.target.get_position());
    distance = abs(vect_length(distance));

    this.position = vect_lerp(
      [...this.position],
      this.target.get_position(),
      this.move_speed
    );

    if (distance < 0.1) {
      this.target_hit = true;
      this.target.hit(this.damage);
    }
  }

  render() {
    let render_position = vect_mult(this.position, this.cell_size);
    render_position = vect_add(render_position, this.half_cell);
    fill(252, 198, 3);
    circle(...render_position, this.radius);
  }
}

class Tower extends GameObject {
  constructor(position, cell_size, tower_stats) {
    super(position, cell_size);
    this.cool_down = 500;
    this.current_cool_down = 0;
    this.level = 1;
    this.firing_range = 5;
    this.stats = tower_stats;
  }

  render() {
    let render_position = vect_mult(this.position, this.cell_size);
    render_position = vect_add(render_position, [2, 2]);
    fill(75, 75, 255);
    rect(...render_position, 20, 20);
  }

  shoot_enemy(enemies) {
    if (this.current_cool_down > 0) {
      this.current_cool_down -= deltaTime;
      return;
    }

    // find closest target
    let closest_target;
    let closest_distance;
    for (let enemy of enemies) {
      // determine if target is in range
      let distance = vect_sub(enemy.position, this.position);
      distance = abs(vect_length(distance));
      if (distance > this.stats.range) continue;
      closest_target =
        !closest_target | (distance < closest_distance)
          ? enemy
          : closest_target;
      closest_distance = Math.min(closest_distance, distance) || distance;
    }

    if (!closest_target) return;

    // fire bullet
    this.current_cool_down = this.stats.cool_down;
    return new Bullet(
      [...this.position],
      this.cell_size,
      closest_target,
      this.stats.damage
    );
  }

  set_stats(stats) {
    this.stats = stats;
  }
}

class Base extends GameObject {
  constructor(position, cell_size) {
    super(position, cell_size);
    this.radius = 25;
    this.health = 3;
  }

  render() {
    let render_position = vect_mult(this.position, this.cell_size);
    render_position = vect_add(render_position, this.half_cell);
    fill(100, 255, 100);
    circle(...render_position, this.radius);
  }
}
