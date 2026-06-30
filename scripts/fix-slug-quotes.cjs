const fs = require('fs');
const path = require('path');

const dirs = ['rhino-3d', 'maya', 'kicad', 'ansys-mechanical', 'powermill'];
const GUIDES_DIR = path.join(process.cwd(), 'src', 'content', 'guides');

let fixed = 0;
for (const d of dirs) {
  const dp = path.join(GUIDES_DIR, d);
  if (!fs.existsSync(dp)) continue;
  for (const f of fs.readdirSync(dp)) {
    if (!f.endsWith('.md')) continue;
    const fp = path.join(dp, f);
    let c = fs.readFileSync(fp, 'utf-8');
    const lines = c.split('\n');
    let changed = false;
    for (let i = 0; i < Math.min(15, lines.length); i++) {
      const l = lines[i];
      if (l.includes('slug:') && !l.trim().endsWith('"')) {
        // Add closing quote to the slug line
        lines[i] = l.trimEnd() + '"';
        changed = true;
        console.log('FIXED: ' + d + '/' + f + ' -> ' + lines[i].trim());
      }
    }
    if (changed) {
      fs.writeFileSync(fp, lines.join('\n'), 'utf-8');
      fixed++;
    }
  }
}
console.log('\nFixed ' + fixed + ' files.');
