const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = 'f:/cadguide.tools/src/content/guides';
const newTools = ['staad-pro','abaqus','navisworks','gerber-accumark','lectra-modaris',
  'siemens-nx','allplan','autocad-plant-3d','comsol-multiphysics','cypecad',
  'idea-statica','midas-civil','3dexperience','actcad','alibre-design',
  'ansys-workbench','autodesk-inventor','ptc-creo','bricscad','etabs',
  'altair-hyperworks','ansys-fluent','ares-commander','autocad','autodesk-construction-cloud',
  'autodesk-robot','bimcollab','bluebeam-revu','cadworx','caesar-ii',
  'camworks','carlson-survey','chief-architect','cimatron','diptrace'];

const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
const tools = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());

let total = 0;
let passCount = 0;
let failCount = 0;
const issues = { src_lt3: 0, content_lt200: 0, missing_fm: 0, cat_workflow: 0, cat_comparison: 0, cat_troubleshooting: 0, cat_deployment: 0, cat_performance: 0, cat_other: 0 };
const catMap = {};
const details = [];

for (const t of tools) {
  if (newTools.includes(t)) continue; // skip new guides
  const tdir = path.join(dir, t);
  const files = fs.readdirSync(tdir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    total++;
    const fpath = path.join(tdir, f);
    const raw = fs.readFileSync(fpath, 'utf-8');
    const { data, content } = matter(raw);
    
    const srcCount = data.sources ? data.sources.length : 0;
    const contentLen = content.trim().length;
    const miss = req.filter(k => !data[k]);
    const cat = data.category || 'MISSING';
    
    catMap[cat] = (catMap[cat] || 0) + 1;
    
    let hasIssue = false;
    const probs = [];
    
    if (srcCount < 3) { issues.src_lt3++; probs.push('src<' + srcCount); hasIssue = true; }
    if (contentLen < 2000) { issues.content_lt200++; probs.push('len=' + contentLen); hasIssue = true; }
    if (miss.length > 0) { issues.missing_fm++; probs.push('miss:' + miss.join(',')); hasIssue = true; }
    
    if (cat === 'workflow') issues.cat_workflow++;
    else if (cat === 'comparison') issues.cat_comparison++;
    else if (cat === 'troubleshooting') issues.cat_troubleshooting++;
    else if (cat === 'deployment') issues.cat_deployment++;
    else if (cat === 'performance') issues.cat_performance++;
    else issues.cat_other++;
    
    if (hasIssue) {
      failCount++;
      details.push({ tool: t, file: f, src: srcCount, len: contentLen, cat, probs: probs.join('|') });
    } else {
      passCount++;
    }
  }
}

console.log('=== OLD GUIDES QUALITY AUDIT ===');
console.log('Total old guides: ' + total);
console.log('Pass (3+ src, 2000+ chars, full FM): ' + passCount);
console.log('Fail: ' + failCount);
console.log('');
console.log('=== ISSUE BREAKDOWN ===');
console.log('Sources < 3: ' + issues.src_lt3);
console.log('Content < 2000 chars: ' + issues.content_lt200);
console.log('Missing frontmatter: ' + issues.missing_fm);
console.log('');
console.log('=== CATEGORY DISTRIBUTION ===');
const sortedCats = Object.entries(catMap).sort((a,b) => b[1] - a[1]);
for (const [cat, count] of sortedCats) {
  console.log(cat + ': ' + count);
}
console.log('');
console.log('=== FAILED GUIDES (first 50) ===');
details.slice(0, 50).forEach(d => {
  console.log(d.tool + '/' + d.file.substring(0, 50) + ' | ' + d.probs + ' | cat:' + d.cat);
});
console.log('... total failed: ' + failCount);
