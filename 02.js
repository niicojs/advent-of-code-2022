import fs from 'fs/promises';

const rounds = (await fs.readFile('inputs/02', 'utf8'))
  .split(/\r?\n/)
  .map((round) => round.split(/\s+/));

const scores = {
  X: 1,
  Y: 2,
  Z: 3,
};
const winpoints = {
  A: {
    X: 3,
    Y: 6,
    Z: 0,
  },
  B: {
    X: 0,
    Y: 3,
    Z: 6,
  },
  C: {
    X: 6,
    Y: 0,
    Z: 3,
  },
};

// 1
{
  let score = 0;

  for (const round of rounds) {
    const [other, me] = round;
    score += scores[me] + winpoints[other][me];
  }

  console.log('(answer 1) score', score);
}

// 2
{
  const moves = {
    A: {
      X: 'Z',
      Y: 'X',
      Z: 'Y',
    },
    B: {
      X: 'X',
      Y: 'Y',
      Z: 'Z',
    },
    C: {
      X: 'Y',
      Y: 'Z',
      Z: 'X',
    },
  };

  let score = 0;

  for (const round of rounds) {
    const [other, res] = round;
    const me = moves[other][res];
    score += scores[me] + winpoints[other][me];
  }

  console.log('(answer 2) score', score);
}
