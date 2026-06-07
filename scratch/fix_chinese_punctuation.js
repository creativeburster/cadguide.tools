const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  path.join(__dirname, '../src/app/toolbox'),
  path.join(__dirname, '../src/components')
];

function scanDir(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanDir(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const basicReplacements = [
  { regex: /，/g, rep: ', ' },
  { regex: /。/g, rep: '. ' },
  { regex: /；/g, rep: '; ' },
  { regex: /：/g, rep: ': ' },
  { regex: /？/g, rep: '? ' },
  { regex: /！/g, rep: '! ' },
  { regex: /（/g, rep: ' (' },
  { regex: /）/g, rep: ') ' },
  { regex: /【/g, rep: '[' },
  { regex: /】/g, rep: ']' },
  { regex: /、/g, rep: ', ' },
  { regex: /《/g, rep: '<' },
  { regex: /》/g, rep: '>' }
];

let modifiedFiles = 0;

for (const dir of TARGET_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = scanDir(dir);
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    let isModified = false;
    
    // Check if the file has any CJK punctuation before processing to save time
    const hasCJKPunc = /[，。；：？！（）【】、《》“”‘’]/.test(content);
    if (hasCJKPunc) {
      // 1. Process double quoted string literals
      content = content.replace(/"([^"\\]|\\.)*"/g, (match) => {
        return match.replace(/[“”]/g, "'").replace(/[‘’]/g, "'");
      });
      
      // 2. Process single quoted string literals
      content = content.replace(/'([^'\\]|\\.)*'/g, (match) => {
        return match.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
      });
      
      // 3. Process template literals
      content = content.replace(/`([^`\\]|\\.)*`/g, (match) => {
        return match.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
      });
      
      // 4. Process any leftover CJK quotes (e.g. in JSX children or comments)
      content = content.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
      
      // 5. Process basic punctuation
      for (const r of basicReplacements) {
        content = content.replace(r.regex, r.rep);
      }
      
      // 6. Clean up multiple spaces, making sure NEVER to match newlines (\r or \n)
      content = content.replace(/, +/g, ', ');
      content = content.replace(/\. +/g, '. ');
      content = content.replace(/; +/g, '; ');
      content = content.replace(/: +/g, ': ');
      content = content.replace(/\? +/g, '? ');
      content = content.replace(/! +/g, '! ');
      content = content.replace(/\( +/g, '(');
      content = content.replace(/ +\)/g, ')');
      
      if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        const rel = path.relative(path.join(__dirname, '..'), file);
        console.log(`Fixed Chinese punctuation in: ${rel}`);
        modifiedFiles++;
      }
    }
  }
}

console.log(`Punctuation fix complete. Modified ${modifiedFiles} files.`);
