class Enemy {
    constructor (position, cell_size) {
        this.position = position
        this.cell_size = cell_size
        this.half_cell = vect_div(cell_size, [2, 2])
        this.move_speed = .02
    }
    
    move (grid) {
        // find nearest cell with a smaller step value and move towards it
        let move_position = grid.get_move(vect_round([...this.position]))
        this.position = vect_lerp([...this.position], move_position, this.move_speed)
    }

    render () {
        let render_position = vect_mult(this.position, this.cell_size)
        render_position = vect_add(render_position, this.half_cell)
        circle(...render_position, 20)
    }
}