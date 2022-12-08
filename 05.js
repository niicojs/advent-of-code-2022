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

for (const p of piles) {
  p.forEach((val, idx) => {
    if (val) {
      stacks[idx + 1].push(val);
    }
  });
}

console.log(drawing);

const stacks2 = JSON.parse(JSON.stringify(stacks));

const moves = movesLines.split(/\r?\n/).map((move) =>
  move
    .match(/move (\d+) from (\d+) to (\d+)/)
    .slice(1)
    .map((m) => +m)
);

// follow moves v1

for (const [nb, from, to] of moves) {
  for (let i = 0; i < nb; i++) {
    const crate = stacks[from].shift();
    stacks[to].unshift(crate);
  }
}

let result1 = '';
for (let i = 1; i <= nbPiles; i++) result1 += stacks[i][0] || '?';

console.log('(answer 1)', result1);

// follow move v2

for (const [nb, from, to] of moves) {
  const crates = stacks2[from].splice(0, nb);
  stacks2[to].splice(0, 0, ...crates);
}

let result2 = '';
for (let i = 1; i <= nbPiles; i++) result2 += stacks2[i][0] || '?';

console.log('(answer 2)', result2);
