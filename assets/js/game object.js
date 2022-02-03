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
  constructor(stats, position, cell_size) {
    super(position, cell_size);
    this.stats = {...stats};
  }

  set_stats(stats) {
    this.stats = { ...this.stats, ...copy };
  }

  move(grid) {
    if (this.is_dead()) return;
    // find nearest cell with a smaller step value and move towards it
    let move_position = grid.get_move(vect_round([...this.position]));
    this.position = vect_lerp(
      [...this.position],
      move_position,
      this.stats.speed
    );
  }

  render() {
    // calculate render_position
    let render_position = vect_mult(this.position, this.cell_size);
    render_position = vect_add(render_position, this.half_cell);
    // select fill color
    fill(...this.stats.shape.color);
    // pick shape to render
    switch (this.stats.shape.type) {
      case "circle":
        circle(...render_position, this.stats.shape.radius);
      case "square":
        render_position = vect_add(render_position, [-10, -10])
        rect(...render_position, this.stats.shape.length, this.stats.shape.length);
    }
  }

  is_dead() {
    return this.stats.health < 1;
  }

  reached_goal(goal_position) {
    let distance = vect_sub(this.position, goal_position);
    distance = abs(vect_length(distance));
    return distance < 0.1;
  }

  hit(damage) {
    this.stats.health -= damage;
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
    this.stats = tower_stats;
    this.selected = false;
  }

  render() {
    let render_position = vect_mult(this.position, this.cell_size);
    render_position = vect_add(render_position, this.half_cell);
    if (this.selected) {
      fill(252, 186, 3);
      circle(...render_position, 30);
    }
    // select fill color
    fill(...this.stats.shape.color);
    // pick shape to render
    switch (this.stats.shape.type) {
      case "circle":
        circle(...render_position, this.stats.shape.radius);
      case "square":
        render_position = vect_add(render_position, [-10, -10])
        rect(...render_position, this.stats.shape.length, this.stats.shape.length);
    }
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

  get_upgrade_as_string () {
    let template = ""
    for (let mod in this.stats.upgrades[0].upgrade) {
      template += `${mod} ${this.stats[mod]}->${this.stats.upgrades[0].upgrade[mod]}\n`
    }
    return template
  }

  is_upgradable() {
    return this.stats.upgrades.length > 0;
  }

  get_upgrade_cost() {
    if (!this.stats.upgrades.length) return -1;
    return this.stats.upgrades[0].cost;
  }

  upgrade () {
    this.stats = {...this.stats, ...this.stats.upgrades.shift().upgrade}
  }

  set_stats(stats) {
    this.stats = {...this.stats, ...stats};
  }
}

class Base extends GameObject {
  constructor(position, cell_size) {
    super(position, cell_size);
    this.radius = 25;
    this.health = 3;
    this.max_health = 3;
  }

  render() {
    let render_position = vect_mult(this.position, this.cell_size);
    render_position = vect_add(render_position, this.half_cell);
    fill(100, 255, 100);
    circle(...render_position, this.radius);
  }
}
