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
const all = new Set(
  Array.from(rates.entries())
    .filter(([, v]) => v > 0)
    .map(([k]) => k)
);

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

const cache = new Map();

function findbestpressure(only = null) {
  let k = null;
  if (only) {
    k = Array.from(only).sort().join(',');
    if (cache.has(k)) return cache.get(k);
  }
  const todo = new TinyQueue(
    [{ pos: 'AA', score: 0, time: 26, opened: new Set() }],
    (a, b) => b.score - a.score
  );
  let max = 0;
  while (todo.length > 0) {
    const { pos, score, time, opened } = todo.pop();

    if (time <= 1 || opened.size === all.size) continue;

    const rate = rates.get(pos);

    const newscore = score + rate * (time - 1);
    if (newscore > max) max = newscore;
    const updated = new Set(opened).add(pos);

    if (only === null) {
      if (updated.size > (2 / 3) * all.size) continue;
      if (updated.size > (1 / 3) * all.size) {
        const others = all.difference(updated);
        const elephantscore = findbestpressure(others);
        if (newscore + elephantscore > max) max = newscore + elephantscore;
      }
    }

    for (const [to, dist] of valves.get(pos)) {
      if (time - dist <= 0) continue;
      if (!all.has(to)) continue;
      if (opened.has(to)) continue;
      if (only && !only.has(to)) continue;
      todo.push({
        pos: to,
        score: newscore,
        time: time - (rate > 0 ? dist + 1 : dist),
        opened: updated,
      });
    }
  }
  if (k) cache.set(k, max);
  return max;
}

let answer = findbestpressure();

consola.success('result', answer);
consola.success('Done in', t.format());
clipboard.writeSync(answer?.toString());
