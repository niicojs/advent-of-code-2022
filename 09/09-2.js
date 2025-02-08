import fs from 'fs/promises';

const moves = (await fs.readFile('09/09-2', 'utf8'))
  .split(/\r?\n/g)
  .map((line) => line.split(' '))
  .map(([d, n]) => [d, +n]);

const visited = { '0-0': 1 };
const rope = Array(10);
for (let i = 0; i < 10; i++) rope[i] = [0, 0];

const print = () => {
  for (let y = 0; y < 6; y++) {
    let line = '';
    for (let x = 0; x < 6; x++) {
      let ok = false;
      for (let i = 0; i < rope.length; i++) {
        if (rope[i][0] === x && rope[i][1] === y) {
          line += i.toString();
          ok = true;
          break;
        }
      }
      if (!ok) {
        line += visited[`${x}-${y}`] ? '#' : '.';
      }
    }
    console.log(line);
  }
};

const move = (d) => {
  if (d === 'R') {
    rope[0][0]++;
  } else if (d === 'U') {
    rope[0][1]++;
  } else if (d === 'L') {
    rope[0][0]--;
  } else if (d === 'D') {
    rope[0][1]--;
  }

  for (let x = 1; x < rope.length; x++) {
    if (Math.abs(rope[x - 1][0] - rope[x][0]) > 1) {
      rope[x][0] +=
        (rope[x - 1][0] - rope[x][0]) / Math.abs(rope[x - 1][0] - rope[x][0]);
      if (Math.abs(rope[x - 1][1] - rope[x][1]) >= 1) {
        rope[x][1] +=
          (rope[x - 1][1] - rope[x][1]) / Math.abs(rope[x - 1][1] - rope[x][1]);
      }
    }
    if (Math.abs(rope[x - 1][1] - rope[x][1]) > 1) {
      rope[x][1] +=
        (rope[x - 1][1] - rope[x][1]) / Math.abs(rope[x - 1][1] - rope[x][1]);
      if (Math.abs(rope[x - 1][0] - rope[x][0]) >= 1) {
        rope[x][0] +=
          (rope[x - 1][0] - rope[x][0]) / Math.abs(rope[x - 1][0] - rope[x][0]);
      }
    }
  }
};

for (let [d, n] of moves) {
  // console.log(`${d} ${n}`);
  for (let x = 0; x < n; x++) {
    move(d);
    visited[`${rope[9][0]}-${rope[9][1]}`] = 1;
    // print();
  }
}

console.log(Object.keys(visited).length);
