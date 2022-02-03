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
        <div class="game-stats">
          <p>Base Health: </p><progress value="${state.health}" max="${state.max_health}"></progress>
          <p>Points: ${state.points}<p>
        </div>
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

class UpgradesComponent extends Component {
  constructor(state) {
    super(state);
    this.state = {...{selected: false}, ...state}
  }

  render (state) {
    let template = "<div class='interface sidebar'>"
    // tower selected section
    template += `<div>${state.selected ?
    `<h2>${state.name}</h2>
      ${state.upgradable ? 
        `<p>${state.upgrade}</p>
        <button onclick="upgrade_tower()">
        upgrade tower for ${state.cost} points.</button>` 
      : `This tower cannot be upgraded`}
    `:
    `<p>Select a tower for info</p>`}
    <div>`

    // base upgrade section

    // wave started button
    template += `<div>${state.started ? 'wave started' : 
    `<button onclick="start_wave()">Start Wave ${state.wave}</button>`}
    </div>`
    
    template += '</div>'
    return template;
  }

  as_text() {
    return "upgrade_component";
  }
}

class GameOver extends Component {
  constructor(state) {
    super(state);
  }

  render(state) {
    return `<div id="game-over">Game Over!</div>`
  }

  as_text() {
    return "game_over_component";
  }
}