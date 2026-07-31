const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Load all tool slugs
const ts = require('typescript');
function loadTs(file) {
  const src = fs.readFileSync(file, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} };
  const h = { getLogo: s => '/logos/' + s + '.png' };
  const fn = new Function('exports', 'require', 'module', out);
  fn(m.exports, p => p.includes('helpers') ? h : {}, m);
  return m.exports;
}
let tools = [];
for (let i = 1; i <= 7; i++) {
  const mod = loadTs(`f:/cadguide.tools/src/lib/data/c${i}.ts`);
  const k = Object.keys(mod).find(k => Array.isArray(mod[k]));
  tools.push(...mod[k]);
}
const toolSlugs = tools.map(t => t.slug);

// Check each tool for guides
const dir = 'f:/cadguide.tools/src/content/guides';
const noGuides = [];
const oneGuide = [];
const multiGuide = [];

for (const slug of toolSlugs) {
  const toolDir = path.join(dir, slug);
  if (!fs.existsSync(toolDir)) {
    noGuides.push(slug);
    continue;
  }
  const files = fs.readdirSync(toolDir).filter(f => f.endsWith('.md'));
  let validCount = 0;
  for (const f of files) {
    try {
      const raw = fs.readFileSync(path.join(toolDir, f), 'utf-8');
      const { data } = matter(raw);
      if (data.slug && data.title) validCount++;
    } catch (e) { /* invalid */ }
  }
  if (validCount === 0) noGuides.push(slug);
  else if (validCount === 1) oneGuide.push(slug);
  else multiGuide.push(slug);
}

console.log('=== RESULTS ===');
console.log('total tools:', toolSlugs.length);
console.log('tools with 0 valid guides:', noGuides.length);
if (noGuides.length) console.log('  →', noGuides.join(', '));
console.log('tools with 1 guide:', oneGuide.length);
console.log('tools with 2+ guides:', multiGuide.length);
