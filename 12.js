import { config } from 'dotenv';
import { consola } from 'consola';
import {
  deepEqual,
  directNeighbors,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
  memoize,
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
        line += '\x1b[33m' + grid[y][x] + '\x1b[0m';
      } else {
        line += '.';
      }
    }
    consola.log(line);
  }
};

// print([]);

consola.log('start', start);
consola.log('end', end);

const good = [];

let idx = 0;
const dig = memoize((path) => {
  idx++;
  if (idx >= 500) {
    print(path);
    idx = 0;
  }
  let [x, y] = path.at(-1);
  for (const [i, j] of directNeighbors) {
    const next = [x + i, y + j];
    if (inGridRange(grid, x + i, y + j)) {
      const val = grid[next[1]][next[0]];
      const canMove = val - grid[y][x] < 2;
      if (canMove) {
        if (next[0] === end[0] && next[1] === end[1]) {
          // exit
          good.push([...path, next]);
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
          } else {
            // dig deeper
            dig([...path, next]);
          }
        }
      }
    }
  }
});

dig([start]);
good.sort((a, b) => a.length - b.length);

consola.log(good[0]);
print(good[0]);

consola.warn('part 1', good[0].length - 1);

// await submit({ day, level: 1, answer: good[0].length - 1 });

consola.success('Done.');
