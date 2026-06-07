const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '../src/app');
const SITE_NAME = 'CADGuide.tools';

function scanDir(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanDir(fullPath));
    } else if (file === 'page.tsx') {
      results.push(fullPath);
    }
  }
  return results;
}

const pageFiles = scanDir(APP_DIR);
const report = [];

for (const file of pageFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Look for metadata title
  const match = content.match(/title:\s*(?:`([^`]*)`|'([^']*)'|"([^"]*)")/);
  if (match) {
    let titleVal = match[1] || match[2] || match[3] || '';
    // Replace year template if present
    titleVal = titleVal.replace(/\${new Date\(\)\.getFullYear\(\)}/, new Date().getFullYear());
    
    // Calculate final title length
    const hasSiteName = titleVal.includes(SITE_NAME);
    const fullTitle = hasSiteName ? titleVal : `${titleVal} | ${SITE_NAME}`;
    report.push({
      file: path.relative(path.join(__dirname, '..'), file),
      rawTitle: titleVal,
      fullTitle,
      length: fullTitle.length,
      hasSiteName
    });
  }
}

// Sort by length descending
report.sort((a, b) => b.length - a.length);

let reportText = '--- ALL SITE PAGE TITLES SUMMARY ---\n';
for (const entry of report) {
  const status = entry.length > 60 ? '❌ TOO LONG' : '✅ OK';
  reportText += `[${status}] Length: ${entry.length} | File: ${entry.file}\n   Raw: "${entry.rawTitle}"\n   Full: "${entry.fullTitle}"\n\n`;
}

reportText += `Total checked: ${report.length}\n`;
reportText += `Too long (> 60 chars): ${report.filter(r => r.length > 60).length}\n`;

fs.writeFileSync(path.join(__dirname, 'all_meta_titles_report.txt'), reportText);
console.log('Report written to scratch/all_meta_titles_report.txt');
console.log(`Too long (> 60 chars): ${report.filter(r => r.length > 60).length} / ${report.length}`);
