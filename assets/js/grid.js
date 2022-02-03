class Grid {
  constructor(cells = [25, 25], cell_size = [25, 25]) {
    this.grid = Array.from(Array(cells[0]), () => new Array(cells[1]));
    this.cell_size = cell_size;
    this.half_cell = [cell_size[0] / 2, cell_size[1] / 2];
    this.base_position = [];
    this.spawn_positions = [];
  }

  set_base_position(position) {
    this.base_position = position;
  }

  create_new_path(start_position) {
    let path = this.get_random_path([...start_position], this.base_position);
    for (let position of path) {
      this.set_value(this.grid, position, -2)
    }
  }

  // generates a random path from a given start position to end position
  get_random_path(start_position, end_position) {
    let current_position = start_position;
    let path = [];
    const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    
    while (!equals(current_position, end_position)) {
      path.push([...current_position]);
      if (Math.random() > 0.5) {
        current_position[0] += current_position[0] > end_position[0] ? -1 : 1;
      } else {
        current_position[1] += current_position[1] > end_position[1] ? -1 : 1;
      }
    }
    return path;
  }

  // generates a "flow map" which assigns a step value to all path cells
  generate_flow_map(start_position) {
    // create a list of cells to be visited and store current position
    let current_position = !start_position ? this.base_position : start_position;
    let open = [ this.create_cell(current_position)];

    // loop until there are no more cells to visit
    while (open.length) {
      let currentCell = open.pop();
      // set the paths value on grid
      this.set_value(this.grid, currentCell.position, currentCell.step);

      // look through neighboring cells for other path cells
      let directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ];
      // check the 4 neighboring cells
      for (let direction of directions) {
        let child_cell_position = vect_add(currentCell.position, direction);
        // determine if cell is on path and is unvisited
        if (this.get_value(this.grid, child_cell_position) == -2) {
          open.push(this.create_cell(child_cell_position, currentCell.step + 1));
        }
      }
    }
  }

  create_cell(position, step = 0) {
    return {
      position: position,
      step: step,
    };
  }

  // renders the grid and it's path
  render() {
    for (let x in this.grid) {
      for (let y in this.grid[x]) {
        let cell_draw_position = vect_mult([x, y], this.cell_size);
        // render path cell
        fill(this.grid[x][y] != -1 ? 255 : 0);
        rect(
          cell_draw_position[0],
          cell_draw_position[1],
          this.cell_size[0],
          this.cell_size[1]
        );
        // render text
        fill(255, 0, 0);
        text(
          this.grid[x][y],
          cell_draw_position[0],
          cell_draw_position[1] + this.half_cell[1]
        );
      }
    }
  }

  get_value(array, position) {
    if (position[0] < 0 || position[0] > this.grid.length || position[1] < 0 || position[1] > this.grid[0].length) return Infinity;
    return array[position[0]][position[1]];
  }

  // returns the position that has the lowest step value adjacent the current position
  get_move(position) {
    let directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];
    let best_position = [-1, -1];
    let prev_step = Infinity;
    for (let direction of directions) {
      let next_position = vect_add(position, direction)
      let current_step = this.get_value(this.grid, next_position)
      if (current_step || current_step === 0) {
        best_position = current_step < prev_step ? next_position : best_position
        prev_step = current_step < prev_step ? current_step : prev_step
      }
    }
    return best_position
  }
  
  get_grid_data () {
    return this.grid
  }

  // accepts a grid position and returns a canvas position. useful for rendereing
  grid_to_canvas(position) {
    return vect_mult(position, this.cell_size)
  }

  set_value(array, position, value) {
    array[position[0]][position[1]] = value;
  }

  selection () {
    return new Promise((res) => {
      let canvas = document.querySelector("#game-canvas")
      canvas.addEventListener('click', (e) => res())
    })
  }
}
