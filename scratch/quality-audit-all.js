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
    const contentLength = content.length;
    const wordCount = content.split(/\s+/).length;
    const headingCount = (content.match(/^#{1,3} /gm) || []).length;
    const hasTable = content.includes('| --- |') || content.includes('|---|');
    const hasCodeBlock = content.includes('```');
    
    // Check source URL format
    let urlIssues = [];
    if (Array.isArray(data.sources)) {
      data.sources.forEach((url, i) => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          urlIssues.push(`src[${i}] not http(s)`);
        }
      });
    }
    
    results.push({
      tool: d,
      file: f,
      slug: data.slug,
      category: data.category,
      sources: sourceCount,
      missing: missing.length ? missing.join(',') : 'none',
      words: wordCount,
      headings: headingCount,
      hasTable,
      hasCodeBlock,
      urlIssues: urlIssues.length ? urlIssues.join(';') : 'none',
    });
  }
}

// Sort by category to see distribution
results.sort((a, b) => a.category.localeCompare(b.category));

console.log('=== ALL GUIDES BY CATEGORY ===\n');
let currentCat = '';
for (const r of results) {
  if (r.category !== currentCat) {
    currentCat = r.category;
    console.log(`\n--- ${currentCat} ---`);
  }
  console.log(`  ${r.tool}/${r.file}`);
  console.log(`    words: ${r.words} | headings: ${r.headings} | table: ${r.hasTable} | code: ${r.hasCodeBlock} | sources: ${r.sources} | missing: ${r.missing} | urlIssues: ${r.urlIssues}`);
}

console.log('\n\n=== CATEGORY DISTRIBUTION ===');
const catCount = {};
for (const r of results) {
  catCount[r.category] = (catCount[r.category] || 0) + 1;
}
for (const [cat, count] of Object.entries(catCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat}: ${count}`);
}

console.log(`\nTotal guides: ${results.length}`);
console.log(`Total categories: ${Object.keys(catCount).length}`);

// Flag potential issues
console.log('\n=== POTENTIAL ISSUES ===');
for (const r of results) {
  const issues = [];
  if (r.sources < 3) issues.push(`only ${r.sources} sources`);
  if (r.words < 800) issues.push(`short content (${r.words} words)`);
  if (r.headings < 4) issues.push(`only ${r.headings} headings`);
  if (r.missing !== 'none') issues.push(`missing: ${r.missing}`);
  if (r.urlIssues !== 'none') issues.push(`url issues: ${r.urlIssues}`);
  if (issues.length > 0) {
    console.log(`  ${r.tool}/${r.slug}: ${issues.join(' | ')}`);
  }
}
