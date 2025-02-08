import fs from 'fs/promises';

const grid = (await fs.readFile('08/08', 'utf8'))
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

const canSee = (from, x, y) => {
  let see = 1;
  const h = grid[y][x];
  if (from === 'left') {
    for (let i = x - 1; i > 0; i--) {
      if (grid[y][i] < h) see++;
      else break;
    }
  } else if (from === 'right') {
    for (let i = x + 1; i < width - 1; i++) {
      if (grid[y][i] < h) see++;
      else break;
    }
  } else if (from === 'top') {
    for (let j = y - 1; j > 0; j--) {
      if (grid[j][x] < h) see++;
      else break;
    }
  } else if (from === 'bottom') {
    for (let j = y + 1; j < height - 1; j++) {
      if (grid[j][x] < h) see++;
      else break;
    }
  }
  return see;
};

const getScore = (x, y) => {
  return (
    canSee('top', x, y) *
    canSee('left', x, y) *
    canSee('right', x, y) *
    canSee('bottom', x, y)
  );
};

let highscore = 0;
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    highscore = Math.max(highscore, getScore(x, y));
  }
}

console.log('(answer 2)', highscore);
