import fs from 'fs/promises';

const moves = (await fs.readFile('inputs/09-1', 'utf8'))
  .split(/\r?\n/g)
  .map((line) => line.split(' '))
  .map(([d, n]) => [d, +n]);

let head = [0, 0];
let tail = [0, 0];
const visited = { '0-0': 1 };

const print = () => {
  for (let y = 0; y < 5; y++) {
    let line = '';
    for (let x = 0; x < 5; x++) {
      if (head[0] === x && head[1] === y) {
        line += 'H';
      } else if (tail[0] === x && tail[1] === y) {
        line += 'T';
      } else {
        line += visited[`${x}-${y}`] ? '#' : '.';
      }
    }
    console.log(line);
  }
};

const move = (d) => {
  if (d === 'R') {
    head[0]++;
  } else if (d === 'U') {
    head[1]++;
  } else if (d === 'L') {
    head[0]--;
  } else if (d === 'D') {
    head[1]--;
  }
  if (Math.abs(head[0] - tail[0]) > 1) {
    tail[0] += (head[0] - tail[0]) / Math.abs(head[0] - tail[0]);
    if (Math.abs(head[1] - tail[1]) == 1) {
      tail[1] += (head[1] - tail[1]) / Math.abs(head[1] - tail[1]);
    }
  }
  if (Math.abs(head[1] - tail[1]) > 1) {
    tail[1] += (head[1] - tail[1]) / Math.abs(head[1] - tail[1]);
    if (Math.abs(head[0] - tail[0]) == 1) {
      tail[0] += (head[0] - tail[0]) / Math.abs(head[0] - tail[0]);
    }
  }
};

for (let [d, n] of moves) {
  // console.log(`${d} ${n}`);
  for (let x = 0; x < n; x++) {
    move(d);
    visited[`${tail[0]}-${tail[1]}`] = 1;
    // print();
  }
}

console.log(Object.keys(visited).length);
