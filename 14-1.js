import { config } from 'dotenv';
import { consola } from 'consola';
import { getCurrentDay, getDataLines, inGridRange } from './src/utils.js';
import { submit } from './src/aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day).map((l) => l.split(' -> '));
const traces = [];

// parse data
for (const line of lines) {
  for (let i = 0; i < line.length - 1; i++) {
    const from = line[i].split(',').map((n) => +n);
    const to = line[i + 1].split(',').map((n) => +n);
    if (from[0] < to[0] || from[1] < to[1]) {
      traces.push({ from, to });
    } else {
      traces.push({ from: to, to: from });
    }
  }
}

// normalize on 0 based grid
let minx = Math.min(...traces.flatMap((t) => [t.from[0], t.to[0]])) - 1;
let maxx = 0;
let maxy = 0;

for (const trace of traces) {
  trace.from[0] -= minx;
  trace.to[0] -= minx;
  maxx = Math.max(maxx, trace.from[0], trace.to[0]);
  maxy = Math.max(maxy, trace.from[1], trace.to[1]);
}
maxx += 2;
maxy += 2;

const grid = Array(maxy)
  .fill(0)
  .map(() => Array(maxx).fill('.'));

// put stone on grid
for (const trace of traces) {
  for (let x = trace.from[0]; x <= trace.to[0]; x++) {
    for (let y = trace.from[1]; y <= trace.to[1]; y++) {
      grid[y][x] = '#';
    }
  }
}

const print = () => {
  const pad = (grid.length - 1).toString().length;
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' ';
    for (let x = 0; x < grid[y].length; x++) {
      if (y === 0 && x === 500 - minx) {
        line += '+';
      } else {
        line += grid[y][x];
      }
    }
    consola.log(line);
  }
};

print();

const step = () => {
  const pos = { x: 500 - minx, y: 0 };
  while (true) {
    while (
      inGridRange(grid, pos.x, pos.y + 1) &&
      grid[pos.y + 1][pos.x] === '.'
    ) {
      pos.y++;
    }
    if (
      inGridRange(grid, pos.x - 1, pos.y + 1) &&
      grid[pos.y + 1][pos.x - 1] === '.'
    ) {
      pos.x--;
      pos.y++;
    } else if (
      inGridRange(grid, pos.x + 1, pos.y + 1) &&
      grid[pos.y + 1][pos.x + 1] === '.'
    ) {
      pos.x++;
      pos.y++;
    } else {
      break;
    }
  }
  grid[pos.y][pos.x] = 'o';
  return pos.y !== maxy - 1;
};

let cnt = 0;
while (step()) {
  cnt++;
}

print();

consola.warn('part 1', cnt);

await submit({ day, level: 1, answer: cnt });

consola.success('Done.');
