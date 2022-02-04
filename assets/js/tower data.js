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
        cost: 150,
      },
      {
        upgrade: { range: 4 },
        cost: 150,
      },
      {
        upgrade: { cool_down: 1000, range: 4.5, damage: 3 },
        cost: 250,
      },
    ],
  },
  "Power Tower": {
    name: "Power Tower",
    damage: 8,
    range: 1,
    cool_down: 5000,
    cost: 200,
    shape: {
      type: "square",
      color: [0, 255, 0],
      length: 20,
    },
    upgrades: [
      {
        upgrade: { range: 2 },
        cost: 150,
      },
      {
        upgrade: { damage: 10},
        cost: 200,
      },
      {
        upgrade: { cool_down: 3000, range: 2, damage: 15 },
        cost: 350,
      },
    ],
  },
  "Sniper Tower": {
    name: "Sniper Tower",
    damage: 2,
    range: 8,
    cool_down: 3000,
    cost: 200,
    shape: {
      type: "square",
      color: [255, 255, 0],
      length: 15,
    },
    upgrades: [
      {
        upgrade: { damage: 4 },
        cost: 150,
      },
      {
        upgrade: { range: 6 },
        cost: 150,
      },
      {
        upgrade: { cool_down: 2000, range: 1, damage: 10 },
        cost: 350,
      },
    ],
  },
};
