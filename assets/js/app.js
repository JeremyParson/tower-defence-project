class App {
    constructor(selector) {
      this.appElement = document.querySelector(`#${selector}`);
      this.components = {};
      this.canvas = null
      console.log('App initialized!');
    }
  
    registerComponent(component) {
      this.components[component.as_text()] = component;
      this.updateView();
    }

    registerFirst(component) {
      let c = {}
      c[component.as_text()] = component
      this.components = {...c, ...this.components}
      this.updateView();
    }

    removeComponent(component_name) {
      delete this.components[component_name];
      this.updateView();
    }

    clearAllComponents() {
      this.components = {}
      this.updateView()
    }
  
    updateView() {
      if (!this.components) return;
      let merged_views = '';
      for (let key in this.components) merged_views += this.components[key].view();
      this.appElement.innerHTML = merged_views;
      if (this.canvas) this.canvas.parent("game-canvas")
    }

    connect_canvas(canvas) {
      this.canvas = canvas
    }
  }