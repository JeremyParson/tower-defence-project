const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

const vect_lerp = (x, y, a) => x.map((x, i) => lerp(x, y[i], a))
const vect_round = (v) => v.map(x => Math.round(x))

function vect_add(x, y) {
  return x.map((x, i) => x + y[i]);
}

function vect_sub(x, y) {
  return x.map((x, i) => x - y[i]);
}

function vect_mult(x, y) {
  return x.map((x, i) => x * y[i]);
}

function vect_div(x, y) {
  return x.map((x, i) => x / y[i]);
}

function vect_floor(v) {
  return v.map((x, i) => Math.floor(x))
}

