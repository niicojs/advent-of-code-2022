import fs from 'fs/promises';

const raw = await fs.readFile('01/01', 'utf8');
const elves = raw
  .split(/\r?\n\r?\n/)
  .map((line) => line.split(/\r?\n/).map((v) => +v));

console.log('elves', elves);

const calories = elves.map((elve) => elve.reduce((acc, cur) => acc + cur, 0));

console.log('calories', calories);

const sorted = calories.slice().sort((a, b) => b - a);

console.log('(Answer 1) Max', sorted.at(0));

console.log(
  '(Answer 2) Sum first 3',
  sorted.slice(0, 3).reduce((acc, cur) => acc + cur, 0)
);
