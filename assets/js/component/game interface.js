class SidebarComponent extends Component {
  constructor(state) {
    super(state);
    this.name = "sidebar_component";
  }

  render(state) {
    return `<div class="interface sidebar"></div>`;
  }

  as_text() {
    return "side_bar";
  }
}

class GameComponent extends Component {
  constructor(state) {
    super(state);
  }

  render(state) {
    return `<div class="game-panel">
        <div id="game-canvas"></div>
        <div class="game-stats"></div>
    </div>`;
  }

  as_text() {
    return "game_component";
  }
}

class MainMenuComponent extends Component {
  constructor(state) {
    super(state);
  }

  render(state) {
    return `<div id="main-menu">
        <h1>Play Tower Defence</h1>
        <button onclick="start_game()">Start</button>
    </div>`;
  }

  as_text() {
    return "main_menu";
  }
}

class ShopComponent extends Component {
  constructor(state) {
    super(state);
  }

  render(state) {
    let template = `<div class="interface sidebar">
            <h1>Tower Shop</h1>`;
    for (let tower_name in state) {
      let tower = state[tower_name];
      template += `<div>
                <h2>${tower_name}</h2>
                <p>Cost: ${tower.cost}</p>
                <p>Health: ${tower.health}</p>
                <p>Damage: ${tower.damage}</p>
                <p>Range: ${tower.range}</p>
                <p>Cool Down: ${tower.cool_down / 1000} second${
        tower.cool_down / 1000 > 1 ? "s" : ""
      }</p>
                <button onclick="create_tower('${tower_name}')">Purchase</button>
            </div>`;
    }
    template += `</div>`;
    return template;
  }

  as_text() {
    return "shop_component";
  }
}

class PlaceTowerComponent extends Component {
  constructor(state) {
    super(state);
  }

  render(state) {
    return `<div class="interface sidebar">
      Select an empty tile to place your ${state.tower_name}
    </div>`;
  }

  as_text() {
    return "shop_component";
  }
}