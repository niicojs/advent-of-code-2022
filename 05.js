import fs from 'fs/promises';

const raw = await fs.readFile('inputs/05', 'utf8');
const [drawing, movesLines] = raw.split(/\r?\n\r?\n/);

// load and parse data

const piles = drawing
  .split(/\r?\n/)
  .map((line) =>
    line.match(/(.{4})|(.{3}$)/g).map((v) => v.trim().replace(/\[|\]/g, ''))
  );

const indexes = piles
  .pop()
  .filter((s) => s != '')
  .map((s) => +s);

const nbPiles = indexes.at(-1);

const stacks = {};
for (let i = 1; i <= nbPiles; i++) stacks[i] = [];

console.log(piles);

for (const p of piles) {
  p.forEach((val, idx) => {
    if (val) {
      stacks[idx + 1].push(val);
    }
  });
}

console.log(drawing);
console.log(stacks);

const moves = movesLines.split(/\r?\n/).map((move) =>
  move
    .match(/move (\d+) from (\d+) to (\d+)/)
    .slice(1)
    .map((m) => +m)
);

// follow moves

for (const [nb, from, to] of moves) {
  // console.log(`move ${nb} from ${from} to ${to}`);
  for (let i = 0; i < nb; i++) {
    const crate = stacks[from].shift();
    stacks[to].unshift(crate);
  }
  // console.log(stacks);
}

let result = '';
for (let i = 1; i <= nbPiles; i++) result += stacks[i][0] || '';

// console.log(stacks);

console.log(result);
