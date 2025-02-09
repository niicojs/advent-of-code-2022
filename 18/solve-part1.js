import { consola } from 'consola';
import clipboard from 'clipboardy';
import { getCurrentDay, getDataLines, nums, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const key = (x, y, z) => `${x},${y},${z}`;

const cubesmap = new Set();
const cubes = getDataLines().map(nums);
for (const [x, y, z] of cubes) cubesmap.add(key(x, y, z));

function getNeighbors(x, y, z) {
  return [
    [x - 1, y, z],
    [x + 1, y, z],
    [x, y - 1, z],
    [x, y + 1, z],
    [x, y, z - 1],
    [x, y, z + 1],
  ].filter(([nx, ny, nz]) => cubesmap.has(key(nx, ny, nz)));
}

let answer = 0;
for (const [x, y, z] of cubes) {
  answer += 6 - getNeighbors(x, y, z).length;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
