import fs from 'fs/promises';

const lines = (await fs.readFile('inputs/03', 'utf8')).split(/\r?\n/);

const priorities = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

let sum = 0;
const sacks = lines.map((sack) => [
  sack.substring(0, sack.length / 2),
  sack.substring(sack.length / 2),
]);
for (const elve of sacks) {
  const [one, two] = elve;
  const done = {};
  for (const c of one) {
    if (!done[c] && two.indexOf(c) >= 0) {
      sum += priorities.indexOf(c);
      done[c] = true;
    }
  }
}

console.log('(answer 1) sum', sum);

const groups = [[]];
for (const elve of lines) {
  const current = groups.at(-1);
  current.push(elve);
  if (current.length === 3) {
    groups.push([]);
  }
}
groups.pop();

console.log('(answer 2) ', groups);

function intersect([a, b, c]) {
  var setB = new Set(b.split(''));
  var setC = new Set(c.split(''));
  return [...new Set(a.split(''))]
    .filter((x) => setB.has(x))
    .filter((x) => setC.has(x));
}

let sum2 = 0;
for (const group of groups) {
  const x = intersect(group);
  sum2 += priorities.indexOf(x);
}

console.log('(answer 2) ', sum2);
