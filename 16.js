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

const lines = getDataLines(day)
  .map((l) => l.match(/Valve ([A-Z]+).+rate=(-?\d+).+valves? (.+)+/))
  .map(([, a, b, c]) => [a, +b, c.split(', ')]);
  
consola.log(lines);

// await submit({ day, level: 1, answer: cnt });

consola.success('Done.');
