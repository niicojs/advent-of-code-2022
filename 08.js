import fs from 'fs/promises';

const grid = (await fs.readFile('inputs/08', 'utf8'))
  .split(/\r?\n/g)
  .map((line) => line.split(''));

const width = grid[0].length;
const height = grid.length;

console.log('height', height);
console.log('width', width);

let visible = 2 * width + 2 * (height - 2);

const isVisible = (from, x, y) => {
  const h = grid[y][x];
  if (from === 'left') {
    for (let i = 0; i < x; i++) {
      if (grid[y][i] >= h) return false;
    }
  } else if (from === 'right') {
    for (let i = x + 1; i < width; i++) {
      if (grid[y][i] >= h) return false;
    }
  } else if (from === 'top') {
    for (let j = 0; j < y; j++) {
      if (grid[j][x] >= h) return false;
    }
  } else if (from === 'bottom') {
    for (let j = y + 1; j < height; j++) {
      if (grid[j][x] >= h) return false;
    }
  }
  return true;
};

for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    if (
      isVisible('left', x, y) ||
      isVisible('right', x, y) ||
      isVisible('top', x, y) ||
      isVisible('bottom', x, y)
    ) {
      visible++;
    }
  }
}

console.log('(answer 1)', visible);
