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
const fileMap = {};

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (chineseRegex.test(content)) {
    const relative = path.relative(TOOLBOX_DIR, file);
    const lines = content.split('\n');
    const strings = [];
    for (const line of lines) {
      // Find all matches of Chinese characters (including adjacent non-chinese like punctuation/numbers)
      const matches = line.match(/[\u4e00-\u9fa5]+[^\u4e00-\u9fa5\r\n]*[\u4e00-\u9fa5]*/g);
      if (matches) {
        for (const m of matches) {
          const clean = m.trim();
          if (clean && !strings.includes(clean)) {
            strings.push(clean);
          }
        }
      }
    }
    if (strings.length > 0) {
      fileMap[relative] = strings;
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'chinese_by_file.json'), JSON.stringify(fileMap, null, 2));
console.log(`Extracted Chinese strings by file for ${Object.keys(fileMap).length} files.`);
