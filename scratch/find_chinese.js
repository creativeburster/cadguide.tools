const fs = require('fs');
const path = require('path');

const TOOLBOX_DIR = path.join(__dirname, '../src/app/toolbox');

function scanDir(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanDir(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = scanDir(TOOLBOX_DIR);
const chineseRegex = /[\u4e00-\u9fa5]/;

let reportText = '--- SCANNING FOR CHINESE CHARACTERS ---\n';
let foundCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (chineseRegex.test(content)) {
    const relative = path.relative(path.join(__dirname, '..'), file);
    reportText += `Found Chinese in: ${relative}\n`;
    foundCount++;
    
    // Print lines containing Chinese
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (chineseRegex.test(line)) {
        reportText += `  L${index + 1}: ${line.trim()}\n`;
      }
    });
    reportText += '\n';
  }
}

reportText += `Scan complete. Found Chinese characters in ${foundCount} files.\n`;
fs.writeFileSync(path.join(__dirname, 'chinese_report.txt'), reportText);
console.log('Report written to scratch/chinese_report.txt');
console.log(`Found Chinese characters in ${foundCount} files.`);

