import fs from 'fs/promises';

const moves = (await fs.readFile('inputs/09-2', 'utf8'))
  .split(/\r?\n/g)
  .map((line) => line.split(' '))
  .map(([d, n]) => [d, +n]);

const visited = { '0-0': 1 };
