import fs from 'fs/promises';

const instructions = (await fs.readFile('inputs/10', 'utf8')).split(/\r?\n/g);

let x = 1;
let cycle = 0;
let sum = 0;

const tick = () => {
  cycle++;
  if ((cycle - 20) % 40 === 0) {
    const strength = cycle * x;
    console.log('cycle ', cycle, x, strength);
    sum += strength;
  }
};

for (const inst of instructions) {
  if (inst.startsWith('addx ')) {
    tick();
    tick();
    const v = +inst.substring('addx '.length);
    x += v;
  } else if (inst === 'noop') {
    tick();
  } else {
    console.log('unknown: ' + inst);
  }
}

console.log('x', x);
console.log('cycle', cycle);
console.log('(answer 1)', sum);
