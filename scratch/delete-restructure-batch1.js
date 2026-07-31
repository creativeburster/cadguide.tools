const fs = require('fs');
const path = require('path');

const tools = ['staad-pro', 'abaqus', 'navisworks', 'gerber-accumark', 'lectra-modaris'];
const guidesDir = 'f:/cadguide.tools/src/content/guides';
let deleted = 0;

for (const tool of tools) {
  const dirPath = path.join(guidesDir, tool);
  if (!fs.existsSync(dirPath)) continue;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  for (const f of files) {
    fs.unlinkSync(path.join(dirPath, f));
    deleted++;
    console.log(`Deleted: ${tool}/${f}`);
  }
}
console.log(`\nTotal deleted: ${deleted}`);
