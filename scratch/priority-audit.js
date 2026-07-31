const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const guidesDir = 'f:/cadguide.tools/src/content/guides';
const dirs = fs.readdirSync(guidesDir).filter(d => fs.statSync(path.join(guidesDir, d)).isDirectory());

const allGuides = [];
const toolStats = {};

for (const d of dirs) {
  const dirPath = path.join(guidesDir, d);
  const mdFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  
  if (!toolStats[d]) toolStats[d] = { total: 0, issues: 0, guides: [], categories: new Set() };
  
  for (const f of mdFiles) {
    const raw = fs.readFileSync(path.join(dirPath, f), 'utf-8');
    const { data, content } = matter(raw);
    
    const sourceCount = Array.isArray(data.sources) ? data.sources.length : 0;
    const wordCount = content.split(/\s+/).length;
    const cat = data.category || 'unknown';
    
    const issues = [];
    if (sourceCount < 3) issues.push('low-sources');
    if (wordCount < 800) issues.push('short');
    if (wordCount < 500) issues.push('very-short');
    
    const guide = {
      tool: d,
      slug: data.slug || f.replace('.md',''),
      category: cat,
      sources: sourceCount,
      words: wordCount,
      issues,
      severity: issues.length + (wordCount < 500 ? 2 : 0) + (sourceCount < 2 ? 2 : 0),
    };
    
    allGuides.push(guide);
    toolStats[d].total++;
    toolStats[d].categories.add(cat);
    if (issues.length > 0) toolStats[d].issues++;
    toolStats[d].guides.push(guide);
  }
}

// Sort by severity (worst first)
allGuides.sort((a, b) => b.severity - a.severity);

let output = '';

// Worst guides (severity >= 3)
output += '=== WORST GUIDES (severity >= 3) ===\n';
const worst = allGuides.filter(g => g.severity >= 3);
output += `Count: ${worst.length}\n\n`;
for (const g of worst) {
  output += `  ${g.tool}/${g.slug} | cat:${g.category} | src:${g.sources} | words:${g.words} | issues:${g.issues.join(',')}\n`;
}

// Tools with most guides (potential template duplication)
output += '\n=== TOOLS BY GUIDE COUNT (top 30) ===\n';
const sortedTools = Object.entries(toolStats).sort((a, b) => b[1].total - a[1].total);
for (const [tool, stats] of sortedTools.slice(0, 30)) {
  const cats = [...stats.categories].join(', ');
  output += `  ${tool}: ${stats.total} guides, ${stats.issues} with issues, cats: ${cats}\n`;
}

// Tools where ALL guides have issues
output += '\n=== TOOLS WHERE ALL GUIDES HAVE ISSUES ===\n';
const allBad = sortedTools.filter(([t, s]) => s.issues === s.total && s.total > 0);
output += `Count: ${allBad.length}\n`;
for (const [tool, stats] of allBad) {
  output += `  ${tool}: ${stats.total} guides, cats: ${[...stats.categories].join(', ')}\n`;
}

// Category breakdown for worst guides
output += '\n=== CATEGORY BREAKDOWN OF WORST GUIDES ===\n';
const worstCats = {};
for (const g of worst) {
  worstCats[g.category] = (worstCats[g.category] || 0) + 1;
}
for (const [cat, count] of Object.entries(worstCats).sort((a, b) => b[1] - a[1])) {
  output += `  ${cat}: ${count}\n`;
}

// Summary stats
output += '\n=== SUMMARY ===\n';
output += `Total guides: ${allGuides.length}\n`;
output += `Guides with < 3 sources: ${allGuides.filter(g => g.sources < 3).length}\n`;
output += `Guides with < 800 words: ${allGuides.filter(g => g.words < 800).length}\n`;
output += `Guides with < 500 words: ${allGuides.filter(g => g.words < 500).length}\n`;
output += `Worst guides (sev >= 3): ${worst.length}\n`;
output += `Tools with all guides having issues: ${allBad.length}\n`;
output += `Total tools: ${sortedTools.length}\n`;

// Priority list: tools to redo first (all guides bad + most guides)
output += '\n=== PRIORITY REDO LIST (top 50 tools) ===\n';
const priority = allBad
  .map(([tool, stats]) => ({ tool, total: stats.total, cats: [...stats.categories] }))
  .sort((a, b) => b.total - a.total);
for (const p of priority.slice(0, 50)) {
  output += `  ${p.tool}: ${p.total} guides | cats: ${p.cats.join(', ')}\n`;
}

fs.writeFileSync('f:/cadguide.tools/scratch/priority-redo.txt', output);
console.log(`Worst: ${worst.length} | All-bad tools: ${allBad.length} | Total tools: ${sortedTools.length}`);
