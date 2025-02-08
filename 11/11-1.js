import fs from 'fs/promises';

const input = (await fs.readFile('inputs/11', 'utf8')).split(/\r?\n/g);

const monkeys = [];
for (let i = 0; i < input.length; i++) {
  const line = input[i];
  if (line.startsWith('Monkey')) {
    const idx = +line.substring('Monkey '.length, line.lastIndexOf(':'));
    const items = input[++i]
      .substring('  Starting items: '.length)
      .split(/\,\s+/g)
      .map((v) => +v);
    const op = input[++i]
      .substring('  Operation: new = '.length)
      .match(/(\w+) (.) (\w+)/)
      .slice(1);
    const divtest = +input[++i].substring('  Test: divisible by '.length);
    const iftrue = +input[++i].substring('    If true: throw to monkey'.length);
    const iffalse = +input[++i].substring(
      '    If false: throw to monkey'.length
    );
    monkeys.push({ idx, items, op, divtest, iftrue, iffalse, inspect: 0 });
    ++i;
  }
}

const calc = (old, op) => {
  const left = op[0] === 'old' ? old : +op[0];
  const right = op[2] === 'old' ? old : +op[2];
  if (op[1] === '*') return left * right;
  if (op[1] === '+') return left + right;
  if (op[1] === '-') return left - right;
  console.log('wut?', op[1]);
  return 0;
};

const round = () => {
  for (const monkey of monkeys) {
    for (const item of monkey.items) {
      const worry = Math.floor(calc(item, monkey.op) / 3);
      if (worry % monkey.divtest === 0) {
        monkeys[monkey.iftrue].items.push(worry);
      } else {
        monkeys[monkey.iffalse].items.push(worry);
      }
      monkey.inspect++;
    }
    monkey.items = [];
  }
};

for (let i = 0; i < 20; i++) round();

const [one, two, ...rest] = monkeys.map((m) => m.inspect).sort((a, b) => b - a);

console.log('(answer 1)', one * two);
