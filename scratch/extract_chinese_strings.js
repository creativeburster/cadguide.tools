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
const chineseRegex = /[\u4e00-\u9fa5]+/g;
const uniqueChinese = new Set();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Match contiguous Chinese text blocks (including spaces, brackets, punctuation commonly found inside Chinese sentences)
  // Let's use a simpler regex first to match any word that has Chinese characters, or just extract them line by line
  const lines = content.split('\n');
  for (const line of lines) {
    // Find all matches of Chinese characters
    const matches = line.match(/[\u4e00-\u9fa5]+[^\u4e00-\u9fa5\r\n]*[\u4e00-\u9fa5]*/g);
    if (matches) {
      for (const m of matches) {
        // Clean match: trim and make sure it has Chinese
        const clean = m.trim();
        if (clean && /[\u4e00-\u9fa5]/.test(clean)) {
          uniqueChinese.add(clean);
        }
      }
    }
  }
}

const sorted = Array.from(uniqueChinese).sort((a, b) => b.length - a.length);
fs.writeFileSync(path.join(__dirname, 'unique_chinese_strings.json'), JSON.stringify(sorted, null, 2));
console.log(`Extracted ${sorted.length} unique Chinese substrings.`);
