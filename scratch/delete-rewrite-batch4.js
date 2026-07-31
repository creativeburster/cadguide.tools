const fs = require('fs');
const path = require('path');
const tools = ['allegro-pcb', 'alphacam', 'esprit', 'moi3d', 'openfoam', 'proteus-design-suite'];
const baseDir = 'f:/cadguide.tools/src/content/guides';
let deleted = 0;
for (const tool of tools) {
  const dir = path.join(baseDir, tool);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    fs.unlinkSync(path.join(dir, f));
    deleted++;
    console.log('Deleted: ' + tool + '/' + f);
  }
}
console.log('\nTotal deleted: ' + deleted);
