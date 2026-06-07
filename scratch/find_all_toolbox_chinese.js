const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  path.join(__dirname, '../src/app/toolbox'),
  path.join(__dirname, '../src/components')
];

const cjkRegex = /[\u4e00-\u9fa5]/;

function scanDir(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanDir(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

let foundFiles = [];

for (const dir of TARGET_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = scanDir(dir);
  for (const file of files) {
    // Exclude data.ts if it falls inside (though it is in src/lib, we scan src/app/toolbox and src/components, so it's naturally excluded)
    const content = fs.readFileSync(file, 'utf8');
    if (cjkRegex.test(content)) {
      const rel = path.relative(path.join(__dirname, '..'), file);
      foundFiles.push(rel);
    }
  }
}

console.log('--- FILES WITH CHINESE CHARACTERS ---');
foundFiles.forEach(f => console.log(f));
console.log(`Total: Found CJK in ${foundFiles.length} files.`);
