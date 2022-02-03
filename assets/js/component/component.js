class Component {
    constructor(state) {
      this.state = state;
    }

    get_state () {
      return {...this.state}
    }

    set_state (new_state) {
      this.state = {...this.state, ...new_state}
    }

    render (state) {

    }
  
    view() {
      return this.render(this.state);
    }

    as_text() {
      return ""
    }
  }