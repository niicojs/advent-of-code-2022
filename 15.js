import { config } from 'dotenv';
import { consola } from 'consola';
import {
  deepEqual,
  getCurrentDay,
  getDataLines,
  mergeRanges,
} from './src/utils.js';
import { submit } from './src/aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const dist = ([a, b], [c, d]) => Math.abs(d - b) + Math.abs(c - a);

const lines = getDataLines(day)
  .map((l) => l.match(/x=(-?\d+), y=(-?\d+).+x=(-?\d+), y=(-?\d+)/))
  .map(([, a, b, c, d]) => [+a, +b, +c, +d])
  .map(([a, b, c, d]) => [a, b, c, d, dist([a, b], [c, d])]);

let minx = Math.min(...lines.flatMap(([x1, , x2]) => [x1, x2]));
let maxx = Math.max(...lines.flatMap(([x1, , x2]) => [x1, x2]));
let miny = Math.min(...lines.flatMap(([, y1, , y2]) => [y1, y2]));
let maxy = Math.max(...lines.flatMap(([, y1, , y2]) => [y1, y2]));
let maxd = Math.max(
  ...lines.map(([x1, y1, x2, y2]) => dist([x1, y1], [x2, y2]))
);

// part 1
{
  let cnt = 0;
  for (let x = minx - maxd; x <= maxx + maxd; x++) {
    const current = [x, 2000000];
    let match = false;
    for (let [sx, sy, bx, by] of lines) {
      const max = dist([sx, sy], [bx, by]);
      if (current[0] === bx && current[1] === by) {
        match = false;
        break;
      } else if (dist(current, [sx, sy]) <= max) {
        match = true;
      }
    }
    if (match) cnt++;
  }

  consola.warn('part 1', cnt);
}

// part 2
{
  const maxgrid = 4000000;
  const frequency = ([x, y]) => x * 4000000 + y;

  let percent = 0;
  const find = () => {
    for (let y = 0; y <= maxgrid; y++) {
      let ranges = [];
      for (let [sx, sy, , , d] of lines) {
        const dec = d - Math.abs(sy - y);
        if (dec > 0) {
          const [a, b] = [sx - dec, sx + dec];
          if (a < b) {
            ranges.push([a, b]);
          } else {
            ranges.push([b, a]);
          }
        }
      }
      ranges = mergeRanges(ranges);
      if (!deepEqual(ranges, mergeRanges([...ranges, [0, maxgrid]]))) {
        consola.log(ranges);
        for (let [a, b] of ranges) {
          if (a > 0 && a < maxgrid) {
            return [a - 1, y];
          }
        }
      }
    }
  };

  const pos = find();
  consola.log(frequency(pos));
}

// await submit({ day, level: 2, answer: cnt });

consola.success('Done.');
