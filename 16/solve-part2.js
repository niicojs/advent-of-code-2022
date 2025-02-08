import { consola } from 'consola';
import clipboard from 'clipboardy';
import TinyQueue from 'tinyqueue';
import { getCurrentDay, getDataLines, timer } from '../utils.js';

consola.wrapAll();

const day = getCurrentDay();

consola.start('Starting day ' + day);
const t = timer();

const rates = new Map();
const valves = new Map();
for (const line of getDataLines()) {
  const [_, v, rate, to] = line.match(
    /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/
  );
  rates.set(v, +rate);
  if (!valves.has(v)) valves.set(v, []);
  for (const dest of to.split(', ')) {
    valves.get(v).push([dest, 1]);
  }
}

function search(start, end) {
  const todo = new TinyQueue(
    [{ pos: start, score: 0 }],
    (a, b) => a.score - b.score
  );
  const visited = new Set();
  while (todo.length > 0) {
    const { pos, score } = todo.pop();

    if (pos === end) return score;

    if (visited.has(pos)) continue;
    visited.add(pos);

    const possible = valves.get(pos);
    for (const [to, dist] of possible) {
      todo.push({ pos: to, score: score + dist });
    }
  }
}

for (const v1 of valves.keys()) {
  for (const v2 of valves.keys()) {
    if (v1 === v2) continue;
    if (valves.get(v1).some(([v]) => v === v2)) continue;
    const dist = search(v1, v2);
    valves.get(v1).push([v2, dist]);
  }
}

let max = 0;

function findbestpressure() {
  const todo = new TinyQueue(
    [{ pos: 'AA', score: 0, time: 30, opened: new Set() }],
    (a, b) => b.score - a.score
  );
  while (todo.length > 0) {
    const { pos, score, time, opened } = todo.pop();

    if (score > max) max = score;
    if (time <= 1 || opened.size === valves.size) continue;

    const rate = rates.get(pos);

    for (const [to, dist] of valves.get(pos)) {
      if (time - dist <= 0) continue;
      if (rates.get(to) === 0) continue;
      if (opened.has(to)) continue;
      todo.push({
        pos: to,
        score: score + rate * (time - 1),
        time: time - (rate > 0 ? dist + 1 : dist),
        opened: new Set(opened).add(pos),
      });
    }
  }
}

findbestpressure();
let answer = max;

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
