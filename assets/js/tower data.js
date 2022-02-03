let tower_data = {
  Tower: {
    name: "Tower",
    damage: 1,
    range: 3,
    cool_down: 2000,
    cost: 100,
    shape: {
      type: "circle",
      color: [0, 255, 0],
      radius: 25,
    },
    upgrades: [
      {
        upgrade: { damage: 2 },
        cost: 50,
      },
      {
        upgrade: { range: 3.5 },
        cost: 50,
      },
      {
        upgrade: { cool_down: 1000, range: 4 },
        cost: 100,
      },
    ],
  },
  "Power Tower": {
    name: "Power Tower",
    damage: 2,
    range: 3,
    cool_down: 1000,
    cost: 200,
    shape: {
      type: "square",
      color: [0, 255, 0],
      length: 20,
    },
    upgrades: [
      {
        upgrade: { damage: 2 },
        cost: 50,
      },
      {
        upgrade: { range: 3.5 },
        cost: 50,
      },
      {
        upgrade: { cool_down: 1000, range: 4 },
        cost: 100,
      },
    ],
  },
};
