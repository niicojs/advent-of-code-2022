import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getRawData, newGrid, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const winds = getRawData().trim().split('');
const grid = newGrid(4000, 7, '.');
let top = 0;
let [wind, piece] = [0, 0];

export const printGame = () => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = top; y >= 0; y--) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) line += grid[y][x];
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

const pieces = [
  function (start) {
    // 4 wide bar
    const shape = '-';
    let [x, y] = start;
    const moveDown = () => {
      if (y === 0) return false;
      if (grid[y - 1][x + 0] === '#') return false;
      if (grid[y - 1][x + 1] === '#') return false;
      if (grid[y - 1][x + 2] === '#') return false;
      if (grid[y - 1][x + 3] === '#') return false;
      y--;
      return true;
    };
    const moveLeftRight = (d) => {
      if (d === '<') {
        if (x <= 0) return false;
        if (grid[y][x - 1] === '#') return false;
        x--;
      } else if (d === '>') {
        if (x >= 3) return false;
        if (grid[y][x + 4] === '#') return false;
        x++;
      }
      return true;
    };
    const merge = () => {
      grid[y][x + 0] = '#';
      grid[y][x + 1] = '#';
      grid[y][x + 2] = '#';
      grid[y][x + 3] = '#';
      return y;
    };
    return { shape, moveDown, moveLeftRight, merge };
  },
  function (start) {
    const shape = '+';
    let [x, y] = start;
    const moveDown = () => {
      if (y === 0) return false;
      if (grid[y][x] === '#') return false;
      if (grid[y - 1][x + 1] === '#') return false;
      if (grid[y][x + 2] === '#') return false;
      y--;
      return true;
    };
    const moveLeftRight = (d) => {
      if (d === '<') {
        if (x <= 0) return false;
        if (grid[y][x] === '#') return false;
        if (grid[y + 1][x - 1] === '#') return false;
        if (grid[y + 2][x] === '#') return false;
        x--;
      } else if (d === '>') {
        if (x >= 4) return false;
        if (grid[y][x + 2] === '#') return false;
        if (grid[y + 1][x + 3] === '#') return false;
        if (grid[y + 2][x + 2] === '#') return false;
        x++;
      }
      return true;
    };
    const merge = () => {
      grid[y][x + 1] = '#';
      grid[y + 1][x] = '#';
      grid[y + 1][x + 1] = '#';
      grid[y + 1][x + 2] = '#';
      grid[y + 2][x + 1] = '#';
      return y + 2;
    };
    return { shape, moveDown, moveLeftRight, merge };
  },
  function (start) {
    const shape = 'L';
    let [x, y] = start;
    const moveDown = () => {
      if (y === 0) return false;
      if (grid[y - 1][x] === '#') return false;
      if (grid[y - 1][x + 1] === '#') return false;
      if (grid[y - 1][x + 2] === '#') return false;
      y--;
      return true;
    };
    const moveLeftRight = (d) => {
      if (d === '<') {
        if (x <= 0) return false;
        if (grid[y][x - 1] === '#') return false;
        if (grid[y + 1][x + 1] === '#') return false;
        if (grid[y + 2][x + 1] === '#') return false;
        x--;
      } else if (d === '>') {
        if (x >= 4) return false;
        if (grid[y + 0][x + 3] === '#') return false;
        if (grid[y + 1][x + 3] === '#') return false;
        if (grid[y + 2][x + 3] === '#') return false;
        x++;
      }
      return true;
    };
    const merge = () => {
      grid[y][x] = '#';
      grid[y][x + 1] = '#';
      grid[y][x + 2] = '#';
      grid[y + 1][x + 2] = '#';
      grid[y + 2][x + 2] = '#';
      return y + 2;
    };
    return { shape, moveDown, moveLeftRight, merge };
  },
  function (start) {
    const shape = 'I';
    let [x, y] = start;
    const moveDown = () => {
      if (y === 0) return false;
      if (grid[y - 1][x] === '#') return false;
      y--;
      return true;
    };
    const moveLeftRight = (d) => {
      if (d === '<') {
        if (x <= 0) return false;
        if (grid[y + 0][x - 1] === '#') return false;
        if (grid[y + 1][x - 1] === '#') return false;
        if (grid[y + 2][x - 1] === '#') return false;
        if (grid[y + 3][x - 1] === '#') return false;
        x--;
      } else if (d === '>') {
        if (x >= 6) return false;
        if (grid[y + 0][x + 1] === '#') return false;
        if (grid[y + 1][x + 1] === '#') return false;
        if (grid[y + 2][x + 1] === '#') return false;
        if (grid[y + 3][x + 1] === '#') return false;
        x++;
      }
      return true;
    };
    const merge = () => {
      grid[y + 0][x] = '#';
      grid[y + 1][x] = '#';
      grid[y + 2][x] = '#';
      grid[y + 3][x] = '#';
      return y + 3;
    };
    return { shape, moveDown, moveLeftRight, merge };
  },
  function (start) {
    const shape = 'x';
    let [x, y] = start;
    const moveDown = () => {
      if (y === 0) return false;
      if (grid[y - 1][x] === '#') return false;
      if (grid[y - 1][x + 1] === '#') return false;
      y--;
      return true;
    };
    const moveLeftRight = (d) => {
      if (d === '<') {
        if (x <= 0) return false;
        if (grid[y + 0][x - 1] === '#') return false;
        if (grid[y + 1][x - 1] === '#') return false;
        x--;
      } else if (d === '>') {
        if (x >= 5) return false;
        if (grid[y + 0][x + 2] === '#') return false;
        if (grid[y + 1][x + 2] === '#') return false;
        x++;
      }
      return true;
    };
    const merge = () => {
      grid[y][x] = '#';
      grid[y][x + 1] = '#';
      grid[y + 1][x] = '#';
      grid[y + 1][x + 1] = '#';
      return y + 1;
    };
    return { shape, moveDown, moveLeftRight, merge };
  },
];

let current = pieces[piece++]([2, 3]);
while (piece <= 2022) {
  // wind
  current.moveLeftRight(winds[wind]);
  wind = (wind + 1) % winds.length;

  // down
  if (!current.moveDown()) {
    top = Math.max(top, current.merge());
    current = pieces[piece % pieces.length]([2, top + 4]);
    piece++;
    // printGame();
  }
}

let answer = top + 1;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
