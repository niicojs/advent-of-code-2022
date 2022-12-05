import fs from 'fs/promises';

const includedIn = ([a, b], [x, y]) => (a >= x && b <= y) || (x >= a && y <= b);
const overlap = ([a, b], [x, y]) => b >= x && a <= y;
const decode = (str) => str.split('-').map((s) => +s);

const pairs = (await fs.readFile('inputs/04', 'utf8'))
  .split(/\r?\n/)
  .map((line) => line.split(',').map(decode));

let nbIncluded = 0;
let nbOverlap = 0;
for (const [one, two] of pairs) {
  if (includedIn(one, two)) nbIncluded++;
  if (overlap(one, two)) nbOverlap++;
}

console.log('(answer 1)', nbIncluded);
console.log('(answer 2)', nbOverlap);
