import { config } from 'dotenv';
import { consola } from 'consola';
import {
  directNeighbors,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
} from './src/utils.js';
import { submit } from './src/aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);
const grid = getGrid(lines);

let start = [0, 0];
let end = [0, 0];
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === 'S') {
      start = [x, y];
      grid[y][x] = 0;
    } else if (grid[y][x] === 'E') {
      end = [x, y];
      grid[y][x] = 25; // 'z'
    } else {
      grid[y][x] = grid[y][x].charCodeAt(0) - 'a'.charCodeAt(0);
    }
  }
}

const print = (path) => {
  console.log('====');
  for (let y = 0; y < grid.length; y++) {
    let line = '';
    for (let x = 0; x < grid[y].length; x++) {
      if (start[0] === x && start[1] === y) {
        line += 'S';
      } else if (end[0] === x && end[1] === y) {
        line += 'E';
      } else if (path.some(([a, b]) => a === x && b === y)) {
        line += '\x1b[33m' + '#' + '\x1b[0m';
      } else {
        line += '.';
      }
    }
    consola.log(line);
  }
};

consola.log('start', start);
consola.log('end', end);

const good = [];
const done = new Map();

const dig = (start) => {
  const todo = [[start]];
  while (todo.length > 0) {
    const path = todo.shift();
    const [x, y] = path.at(-1);
    const possible = directNeighbors
      .map(([i, j]) => [x + i, y + j])
      .filter(
        ([a, b]) => inGridRange(grid, a, b) && grid[b][a] - grid[y][x] < 2
      );
    for (const next of possible) {
      const dir = JSON.stringify([[x, y], next]);
      if (next[0] === end[0] && next[1] === end[1]) {
        // exit
        good.push([...path, next]);
        return;
      } else if (!path.some(([a, b]) => a === next[0] && b === next[1])) {
        const exists = good.findIndex((p) =>
          p.find(([a, b]) => a === next[0] && b === next[1])
        );
        if (exists >= 0) {
          // been there already
          const idx = good[exists].findIndex(
            ([a, b]) => a === next[0] && b === next[1]
          );
          if (idx > path.length) {
            // we found a better path
            good[exists] = [...path, ...good[exists].slice(idx)];
          }
        } else if (!done.has(dir)) {
          // dig deeper
          todo.push([...path, next]);
        }
      }
      done.set(dir, true);
    }
  }
};

dig(start);
good.sort((a, b) => a.length - b.length);

print(good[0]);

consola.warn('part 1', good[0].length - 1);

// await submit({ day, level: 1, answer: good[0].length - 1 });

consola.success('Done.');
