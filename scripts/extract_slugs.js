const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '../src/lib/data.ts'), 'utf8');
const matches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
const slugs = matches.map(m => m[1]);
fs.writeFileSync(path.join(__dirname, '../all_slugs.json'), JSON.stringify(slugs, null, 2));
console.log(`Extracted ${slugs.length} slugs.`);
