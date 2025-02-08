import fs from 'fs/promises';

const raw = await fs.readFile('06/06', 'utf8');

const startOfPacket = () => {
  for (let i = 0; i < raw.length - 4; i++) {
    const s = raw.substring(i, i + 4);
    let found = true;
    for (let x = 0; x < s.length; x++) {
      if (s.lastIndexOf(s[x]) !== x) {
        found = false;
      }
    }
    if (found) return i + 4;
  }
};

const startOfMessage = () => {
  for (let i = 0; i < raw.length - 14; i++) {
    const s = raw.substring(i, i + 14);
    let found = true;
    for (let x = 0; x < s.length; x++) {
      if (s.lastIndexOf(s[x]) !== x) {
        found = false;
      }
    }
    if (found) return i + 14;
  }
};

console.log('(answer 1)', startOfPacket());
console.log('(answer 2)', startOfMessage());
