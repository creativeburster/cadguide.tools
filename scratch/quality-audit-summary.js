const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const guidesDir = 'f:/cadguide.tools/src/content/guides';
const dirs = fs.readdirSync(guidesDir).filter(d => fs.statSync(path.join(guidesDir, d)).isDirectory());

const results = [];

for (const d of dirs) {
  const dirPath = path.join(guidesDir, d);
  const mdFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  for (const f of mdFiles) {
    const filePath = path.join(dirPath, f);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    
    const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
    const missing = req.filter(k => !data[k]);
    
    const sourceCount = Array.isArray(data.sources) ? data.sources.length : 0;
    const wordCount = content.split(/\s+/).length;
    const headingCount = (content.match(/^#{1,3} /gm) || []).length;
    const hasTable = content.includes('| ---') || content.includes('|---');
    
    results.push({
      tool: d,
      slug: data.slug,
      category: data.category,
      sources: sourceCount,
      missing: missing.length ? missing.join(',') : 'none',
      words: wordCount,
      headings: headingCount,
      hasTable,
    });
  }
}

let output = '';

// Category distribution
output += '=== CATEGORY DISTRIBUTION ===\n';
const catCount = {};
for (const r of results) {
  catCount[r.category] = (catCount[r.category] || 0) + 1;
}
for (const [cat, count] of Object.entries(catCount).sort((a, b) => b[1] - a[1])) {
  output += `  ${cat}: ${count}\n`;
}
output += `\nTotal guides: ${results.length}\n`;
output += `Total categories: ${Object.keys(catCount).length}\n\n`;

// Group by category
output += '=== GUIDES BY CATEGORY ===\n';
const byCat = {};
for (const r of results) {
  if (!byCat[r.category]) byCat[r.category] = [];
  byCat[r.category].push(r);
}
for (const [cat, items] of Object.entries(byCat).sort((a, b) => b[1].length - a[1].length)) {
  output += `\n--- ${cat} (${items.length}) ---\n`;
  for (const r of items) {
    output += `  ${r.tool}/${r.slug}\n`;
    output += `    words:${r.words} headings:${r.headings} sources:${r.sources} table:${r.hasTable} missing:${r.missing}\n`;
  }
}

// Issues
output += '\n=== POTENTIAL ISSUES ===\n';
let issueCount = 0;
for (const r of results) {
  const issues = [];
  if (r.sources < 3) issues.push(`only ${r.sources} sources`);
  if (r.words < 800) issues.push(`short (${r.words} words)`);
  if (r.headings < 4) issues.push(`only ${r.headings} headings`);
  if (r.missing !== 'none') issues.push(`missing: ${r.missing}`);
  if (issues.length > 0) {
    output += `  ${r.tool}/${r.slug}: ${issues.join(' | ')}\n`;
    issueCount++;
  }
}
output += `\nGuides with issues: ${issueCount} / ${results.length}\n`;

fs.writeFileSync('f:/cadguide.tools/scratch/audit-results.txt', output);
console.log('Written to scratch/audit-results.txt');
console.log(`Total: ${results.length} guides, ${Object.keys(catCount).length} categories, ${issueCount} with issues`);
