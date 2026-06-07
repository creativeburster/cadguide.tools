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
const dirMap = {};

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (chineseRegex.test(content)) {
    const relative = path.relative(TOOLBOX_DIR, file);
    const dir = relative.split(path.sep)[0];
    const lines = content.split('\n');
    const chLines = lines.filter(line => chineseRegex.test(line)).length;
    if (!dirMap[dir]) {
      dirMap[dir] = { fileCount: 0, lineCount: 0, files: [] };
    }
    dirMap[dir].fileCount++;
    dirMap[dir].lineCount += chLines;
    dirMap[dir].files.push(path.basename(file));
  }
}

console.log('--- CHINESE FILES BY DIRECTORY ---');
for (const [dir, info] of Object.entries(dirMap)) {
  console.log(`- ${dir}: ${info.fileCount} files, ${info.lineCount} lines containing Chinese (${info.files.join(', ')})`);
}
