const fs = require('fs');
const path = require('path');

// Get all tool slugs from data files
const dataDir = 'f:/cadguide.tools/src/lib/data';
const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));
const toolSlugs = new Set();
for (const f of dataFiles) {
  const content = fs.readFileSync(path.join(dataDir, f), 'utf-8');
  const matches = content.matchAll(/slug:\s*["']([^"']+)["']/g);
  for (const m of matches) toolSlugs.add(m[1]);
}

// Get tools that have guides
const guidesDir = 'f:/cadguide.tools/src/content/guides';
const toolsWithGuides = new Set();
if (fs.existsSync(guidesDir)) {
  for (const d of fs.readdirSync(guidesDir)) {
    const dirPath = path.join(guidesDir, d);
    if (fs.statSync(dirPath).isDirectory()) {
      const mdFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
      if (mdFiles.length > 0) toolsWithGuides.add(d);
    }
  }
}

// Tools without guides (the 73 we need to create)
const toolsWithoutGuides = [...toolSlugs].filter(s => !toolsWithGuides.has(s)).sort();
console.log('Total tools:', toolSlugs.size);
console.log('Tools with guides:', toolsWithGuides.size);
console.log('Tools without guides:', toolsWithoutGuides.length);
console.log('\n--- Tools without guides ---');
toolsWithoutGuides.forEach((s, i) => console.log(`${i+1}. ${s}`));
