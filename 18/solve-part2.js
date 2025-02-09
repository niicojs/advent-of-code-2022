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
const minx = Math.min(...cubes.map(([x]) => x));
const maxx = Math.max(...cubes.map(([x]) => x));
const miny = Math.min(...cubes.map(([, y]) => y));
const maxy = Math.max(...cubes.map(([, y]) => y));
const minz = Math.min(...cubes.map(([, , z]) => z));
const maxz = Math.max(...cubes.map(([, , z]) => z));

function getNeighbors(x, y, z) {
  return [
    [x - 1, y, z],
    [x + 1, y, z],
    [x, y - 1, z],
    [x, y + 1, z],
    [x, y, z - 1],
    [x, y, z + 1],
  ];
}

let alloutside = new Set();

function flood(x, y, z) {
  if (x === 2 && y === 2 && z === 5) {
    ''.toString();
  }
  if (cubesmap.has(key(x, y, z))) return;
  let set = new Set();
  let last = [[x, y, z]];
  while (last.length > 0) {
    set = set.union(new Set(last.map((v) => key(v[0], v[1], v[2]))));
    const next = [];
    for (const [a, b, c] of last) {
      for (const [nx, ny, nz] of getNeighbors(a, b, c)) {
        if (outside(nx, ny, nz)) {
          alloutside = alloutside.union(set);
          return;
        }
        if (!set.has(key(nx, ny, nz)) && !cubesmap.has(key(nx, ny, nz))) {
          if (!next.some(([a1, b1, c1]) => a1 === nx && b1 === ny && c1 === nz))
            next.push([nx, ny, nz]);
        }
      }
    }
    last = next;
  }
}

const outside = (x, y, z) => {
  if (cubesmap.has(key(x, y, z))) return false;
  if (alloutside.has(key(x, y, z))) return true;
  if (
    x <= minx ||
    x >= maxx ||
    y <= miny ||
    y >= maxy ||
    z <= minz ||
    z >= maxz
  ) {
    return true;
  }
  return false;
};

let answer = 0;

// precompute outside to prevent max call stack
for (let x = minx; x <= maxx; x++) {
  for (let y = miny; y <= maxy; y++) {
    for (let z = minz; z <= maxz; z++) {
      flood(x, y, z);
    }
  }
}

for (const [x, y, z] of cubes) {
  answer += getNeighbors(x, y, z).filter(([nx, ny, nz]) =>
    outside(nx, ny, nz)
  ).length;
}

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
