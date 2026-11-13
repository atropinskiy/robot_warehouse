// Generates 3 robots x 4 directions as SVG sprites (64x64 viewBox, 3/4 top-down view).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = process.argv[2];
const O = '#1B2230';        // outline
const WHEEL = '#2A313C';
const HUB = '#8A96A6';
const TEAL = '#2EC4B6';
const RED = '#FF5A5F';
const GREEN = '#3DDC84';
const LAMP = '#FFF6D6';
const STEEL = '#5B6675';
const STEEL_L = '#8A96A6';
const SCREEN = '#0E1A2B';

const s = `stroke="${O}" stroke-width="1.5" stroke-linejoin="round"`;
const shadow = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="0.22"/>`;
const rect = (x, y, w, h, rx, fill, stroke = true, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${stroke ? s : ''} ${extra}/>`;
const circle = (cx, cy, r, fill, stroke = true, extra = '') =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${stroke ? s : ''} ${extra}/>`;
const line = (x1, y1, x2, y2, color, w = 1.2) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
const wheelSide = (cx, cy, r) => circle(cx, cy, r, WHEEL) + circle(cx, cy, r * 0.4, HUB, false);

const hazardDef = (c) => `<defs><pattern id="hz" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="6" fill="${O}"/><rect x="3" width="3" height="6" fill="${c}"/></pattern></defs>`;

// ---------- Robot 1: MULE (low AGV carrier) ----------
const mule = { base: '#FF8A1F', light: '#FFB066', dark: '#C9650C' };
const muleFrontBack = (back) => [
  shadow(32, 53, 23, 5),
  rect(12, 43, 8, 8, 2, WHEEL),
  rect(44, 43, 8, 8, 2, WHEEL),
  rect(10, 32, 44, 14, 3, mule.dark),
  rect(10, 14, 44, 22, 4, mule.base),
  rect(13, 16.5, 38, 2.5, 1.25, mule.light, false, 'opacity="0.8"'),
  // lift platform
  rect(18, 19, 28, 13, 3, STEEL),
  line(22, 23, 42, 23, '#3E4754'), line(22, 25.5, 42, 25.5, '#3E4754'), line(22, 28, 42, 28, '#3E4754'),
  ...(back
    ? [
        rect(13, 38, 6, 3, 1, RED, false),
        rect(45, 38, 6, 3, 1, RED, false),
        rect(25, 37.5, 14, 6, 1.5, '#10161F'),
        rect(27, 39.2, 2.5, 2.6, 0.5, GREEN, false),
        rect(30.8, 39.2, 2.5, 2.6, 0.5, GREEN, false),
        rect(34.6, 39.2, 2.5, 2.6, 0.5, '#3E4754', false),
      ]
    : [
        rect(24, 37, 16, 3, 1.5, TEAL, false),
        circle(16.5, 40, 2.6, LAMP),
        circle(47.5, 40, 2.6, LAMP),
        circle(32, 43, 1.2, GREEN, false),
      ]),
];
const muleRight = () => [
  shadow(32, 53, 25, 4.5),
  rect(6, 30, 52, 14, 3, mule.dark),
  rect(6, 20, 52, 14, 4, mule.base),
  rect(9, 22, 46, 2.5, 1.25, mule.light, false, 'opacity="0.8"'),
  rect(16, 21.5, 30, 8, 2.5, STEEL),
  line(20, 25.5, 42, 25.5, '#3E4754'),
  rect(14, 37, 34, 2, 1, '#10161F', false, 'opacity="0.35"'),
  rect(52.5, 34.5, 4, 4, 1, LAMP, false),
  rect(50, 40, 7, 2, 1, TEAL, false),
  rect(7.5, 34.5, 3, 4, 1, RED, false),
  wheelSide(18, 46.5, 5),
  wheelSide(46, 46.5, 5),
];

// ---------- Robot 2: LIFTER (autonomous forklift) ----------
const lift = { base: '#FFC53D', light: '#FFD978', dark: '#C99716' };
const liftDown = () => [
  shadow(32, 54, 24, 5),
  rect(8, 35, 7, 8, 2, WHEEL),
  rect(49, 35, 7, 8, 2, WHEEL),
  rect(8, 26, 48, 13, 3, lift.dark),
  rect(8, 8, 48, 22, 4, lift.base),
  rect(11, 10.5, 42, 2.5, 1.25, lift.light, false, 'opacity="0.8"'),
  rect(20, 14, 24, 10, 2.5, '#3E4754'),            // control deck
  rect(23, 16.5, 9, 5, 1, SCREEN, false),
  circle(38, 19, 2, GREEN, false),
  circle(32, 9, 3, '#FF8A1F'),                      // beacon
  // mast in front
  rect(16, 22, 5, 24, 1.5, STEEL),
  rect(43, 22, 5, 24, 1.5, STEEL),
  rect(16, 24, 32, 3, 1, STEEL_L),
  rect(26, 31, 12, 3.5, 1.5, TEAL, false),
  circle(12, 33, 2.2, LAMP),
  circle(52, 33, 2.2, LAMP),
  // carriage + forks toward the viewer
  rect(14, 40, 36, 6, 1.5, STEEL_L),
  rect(19, 45, 5, 13, 1.5, HUB),
  rect(40, 45, 5, 13, 1.5, HUB),
];
const liftUp = () => [
  hazardDef(lift.base),
  shadow(32, 52, 24, 5),
  // mast behind the body
  rect(16, 3, 5, 20, 1.5, STEEL),
  rect(43, 3, 5, 20, 1.5, STEEL),
  rect(16, 5, 32, 3, 1, STEEL_L),
  rect(8, 40, 7, 8, 2, WHEEL),
  rect(49, 40, 7, 8, 2, WHEEL),
  rect(8, 30, 48, 14, 3, lift.dark),
  rect(8, 12, 48, 22, 4, lift.base),
  rect(11, 14.5, 42, 2.5, 1.25, lift.light, false, 'opacity="0.8"'),
  rect(20, 18, 24, 10, 2.5, '#3E4754'),
  line(24, 21, 40, 21, '#2A313C', 1.5), line(24, 24, 40, 24, '#2A313C', 1.5),
  circle(32, 13, 3, '#FF8A1F'),
  // counterweight with hazard stripes
  rect(18, 35, 28, 6, 1.5, 'url(#hz)'),
  rect(11, 36, 5, 3, 1, RED, false),
  rect(48, 36, 5, 3, 1, RED, false),
];
const liftRight = () => [
  hazardDef(lift.base),
  shadow(32, 53, 26, 4.5),
  rect(4, 28, 40, 14, 3, lift.dark),
  rect(4, 16, 40, 16, 4, lift.base),
  rect(7, 18.5, 34, 2.5, 1.25, lift.light, false, 'opacity="0.8"'),
  rect(14, 20, 18, 7, 2, '#3E4754'),
  circle(22, 16, 3, '#FF8A1F'),
  rect(4, 31, 7, 10, 1.5, 'url(#hz)'),
  rect(37, 33, 6, 3, 1, TEAL, false),
  // mast + carriage + forks to the right
  rect(44, 6, 5, 40, 1.5, STEEL),
  rect(48, 30, 4, 16, 1, STEEL_L),
  rect(50, 43, 13, 3.5, 1, HUB),
  circle(47, 10, 1.6, LAMP, false),
  wheelSide(14, 44, 5.5),
  wheelSide(36, 44, 5.5),
];

// ---------- Robot 3: PICKER (tall picker with arms) ----------
const pick = { base: '#4C9AFF', light: '#86BBFF', dark: '#2F6FD1' };
const pickerArm = (x, flip) => {
  const gx = flip ? x + 1 : x - 1;
  return [
    rect(x, 26, 6, 14, 3, pick.base),
    rect(gx, 39, 2.5, 5, 1, STEEL),
    rect(gx + 3.5, 39, 2.5, 5, 1, STEEL),
    circle(x + 3, 27, 3, pick.dark),
  ];
};
const pickerFrontBack = (back) => [
  shadow(32, 56, 19, 4),
  rect(16, 49, 7, 6, 2, WHEEL),
  rect(41, 49, 7, 6, 2, WHEEL),
  rect(13, 43, 38, 9, 3, pick.dark),
  rect(13, 37, 38, 10, 4, pick.base),
  rect(16, 39, 32, 2, 1, pick.light, false, 'opacity="0.8"'),
  ...(back
    ? [rect(17, 46.5, 5, 2.5, 1, RED, false), rect(42, 46.5, 5, 2.5, 1, RED, false)]
    : [rect(26, 46, 12, 3, 1.5, TEAL, false)]),
  rect(28, 27, 8, 12, 1.5, STEEL),
  line(30, 31, 34, 31, '#3E4754'), line(30, 34, 34, 34, '#3E4754'),
  line(32, 9, 32, 3.5, O, 1.5),
  circle(32, 3.5, 2, '#FF8A1F'),
  ...pickerArm(8, false),
  ...pickerArm(50, true),
  rect(15, 8, 34, 22, 6, pick.base),
  rect(18, 10, 28, 2.5, 1.25, pick.light, false, 'opacity="0.8"'),
  ...(back
    ? [
        line(23, 17, 41, 17, pick.dark, 2), line(23, 20.5, 41, 20.5, pick.dark, 2), line(23, 24, 41, 24, pick.dark, 2),
        circle(32, 13.5, 1.3, RED, false),
      ]
    : [
        rect(19, 12.5, 26, 14, 3.5, SCREEN),
        rect(24.5, 16, 4, 5.5, 2, TEAL, false),
        rect(35.5, 16, 4, 5.5, 2, TEAL, false),
        rect(29, 23, 6, 1.5, 0.75, TEAL, false, 'opacity="0.6"'),
      ]),
];
const pickerRight = () => [
  shadow(32, 56, 20, 4),
  rect(10, 43, 44, 9, 3, pick.dark),
  rect(10, 37, 44, 10, 4, pick.base),
  rect(13, 39, 38, 2, 1, pick.light, false, 'opacity="0.8"'),
  rect(48, 46, 5, 2.5, 1, TEAL, false),
  rect(11, 46, 3, 2.5, 1, RED, false),
  wheelSide(19, 52, 4),
  wheelSide(45, 52, 4),
  rect(28, 27, 8, 12, 1.5, STEEL),
  line(31, 9, 31, 3.5, O, 1.5),
  circle(31, 3.5, 2, '#FF8A1F'),
  rect(18, 8, 28, 22, 6, pick.base),
  rect(21, 10, 22, 2.5, 1.25, pick.light, false, 'opacity="0.8"'),
  rect(39, 12.5, 6, 14, 2.5, SCREEN),
  rect(40.5, 16, 3, 5.5, 1.5, TEAL, false),
  rect(24, 15, 8, 9, 2.5, pick.dark),
  circle(28, 19.5, 1.4, STEEL_L, false),
  // near arm reaching forward
  rect(30, 28, 18, 5.5, 2.75, pick.base),
  circle(31.5, 30.75, 3, pick.dark),
  rect(47, 25.5, 6, 2.5, 1, STEEL),
  rect(47, 33.5, 6, 2.5, 1, STEEL),
  rect(46, 27, 3, 8, 1, STEEL_L),
];

const robots = {
  mule: { down: () => muleFrontBack(false), up: () => muleFrontBack(true), right: muleRight },
  lifter: { down: liftDown, up: liftUp, right: liftRight },
  picker: { down: () => pickerFrontBack(false), up: () => pickerFrontBack(true), right: pickerRight },
};

const wrap = (body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128">\n<title>${title}</title>\n${body}\n</svg>\n`;

for (const [name, dirs] of Object.entries(robots)) {
  const dir = join(OUT_DIR, name);
  mkdirSync(dir, { recursive: true });
  const right = dirs.right().join('\n');
  const files = {
    down: dirs.down().join('\n'),
    up: dirs.up().join('\n'),
    right,
    left: `<g transform="translate(64 0) scale(-1 1)">\n${right}\n</g>`,
  };
  for (const [d, body] of Object.entries(files)) {
    writeFileSync(join(dir, `${name}_${d}.svg`), wrap(body, `${name} — ${d}`));
  }
}
console.log('done');
