class Component {
    constructor(state) {
      this.state = state;
    }

    get_state () {
      return {...this.state}
    }

    set_state (value) {
      this.state = value
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