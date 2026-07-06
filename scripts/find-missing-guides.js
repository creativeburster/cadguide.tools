const fs = require('fs');
const path = require('path');

const dataDir = 'src/lib/data';
const guidesDir = 'src/content/guides';

const files = fs.readdirSync(dataDir).filter(f => f.startsWith('c') && f.endsWith('.ts'));
let tools = [];
for (const f of files) {
  const c = fs.readFileSync(path.join(dataDir, f), 'utf8');
  const re = /slug:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(c)) !== null) {
    tools.push(m[1]);
  }
}

const guides = fs.readdirSync(guidesDir).filter(d =>
  fs.statSync(path.join(guidesDir, d)).isDirectory()
);

const missing = tools.filter(t => !guides.includes(t));
console.log('Total tools:', tools.length);
console.log('Tools with guides:', guides.length);
console.log('Missing:', missing.length);
console.log(missing.join('\n'));
