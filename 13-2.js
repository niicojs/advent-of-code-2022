import { config } from 'dotenv';
import { consola } from 'consola';
import {
  enumerate,
  getCurrentDay,
  getDataLines,
} from './src/utils.js';
import { submit } from './src/aoc.js';

config();
const day = getCurrentDay();

consola.wrapAll();
consola.start('Starting day ' + day);

const lines = getDataLines(day).map((line) => JSON.parse(line));
lines.push([[2]]);
lines.push([[6]]);

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
const sorted = lines.sort(compare).reverse();
consola.log(sorted);
for (const [i, signal] of enumerate(sorted)) {
  if (compare(signal, [[2]]) === 0) {
    result = i + 1;
  } else if (compare(signal, [[6]]) === 0) {
    result *= i + 1;
  }
}

consola.warn('part 2', result);

// await submit({ day, level: 2, answer: result });

consola.success('Done.');
