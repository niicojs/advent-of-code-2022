import { config } from 'dotenv';
import { consola } from 'consola';
import {
  getCurrentDay,
  getDataLines,
} from './src/utils.js';
import { submit } from './src/aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day);

const compare = (left, right) => {
  if (typeof left === 'number') {
    if (typeof right === 'number') {
      return right - left;
    } else {
      return compare([left], right);
    }
  } else {
    if (typeof right === 'number') {
      return compare(left, [right]);
    } else {
      let i = 0;
      while (i < left.length && i < right.length) {
        const cmp = compare(left[i], right[i]);
        if (cmp !== 0) {
          return cmp;
        }
        i++;
      }
      if (left.length !== right.length) {
        return right.length - left.length;
      }
      return 0;
    }
  }
};

let result = 0;
for (let i = 0; i < lines.length; i += 2) {
  const first = JSON.parse(lines[i]);
  const second = JSON.parse(lines[i + 1]);
  if (compare(first, second) < 0) {
    console.log(i / 2 + 1, 'not good');
  } else {
    console.log(i / 2 + 1, 'good');
    result += i / 2 + 1;
  }
}

consola.warn('part 1', result);

await submit({ day, level: 1, answer: result });

consola.success('Done.');
