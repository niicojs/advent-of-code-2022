import fs from 'fs/promises';

const lines = (await fs.readFile('07/07', 'utf8')).split(/\r?\n/g);

const sizes = { '/': 0 };
const addSize = (path, size) => {
  if (path === '/') {
    sizes['/'] += size;
  } else {
    const subs = path.split('/');
    for (let i = 0; i < subs.length; i++) {
      const dir = subs.slice(0, i + 1).join('/') || '/';
      sizes[dir] = (sizes[dir] || 0) + size;
    }
  }
};

let current = '/';
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (line.startsWith('$ cd')) {
    const dir = line.substring('$ cd '.length);
    if (dir.startsWith('/')) {
      current = dir;
    } else if (dir === '..') {
      current = current.substring(0, current.lastIndexOf('/')) || '/';
    } else {
      current = (current.endsWith('/') ? current : current + '/') + dir;
    }
  } else if (line === '$ ls') {
    line = lines[++i];
    while (line && !line.startsWith('$')) {
      if (line.startsWith('dir ')) {
        // ?
      } else {
        addSize(current, +line.substring(0, line.indexOf(' ')));
      }
      line = lines[++i];
    }
    i--;
  } else {
    console.log('Unknown command: ' + line);
  }
}

console.log(sizes);

let sum = 0;
for (const path in sizes) {
  if (path !== '/' && sizes[path] <= 100000) {
    sum += sizes[path];
  }
}

console.log('(answer 1)', sum);

const missing = 30_000_000 - (70_000_000 - sizes['/']);

console.log('missing', missing);

const candidates = Object.keys(sizes)
  .filter((dir) => sizes[dir] >= missing)
  .sort((a, b) => sizes[a] - sizes[b]);

console.log('candidates', candidates);

console.log('(answer 2)', sizes[candidates[0]]);
