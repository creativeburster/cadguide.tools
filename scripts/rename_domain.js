const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../src');
const additionalFiles = [
  path.join(__dirname, '../SOUL.md')
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(directory).concat(additionalFiles);

let replacedCount = 0;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Replace case-sensitive to preserve capitalization
    content = content.replace(/CADTools\.io/g, 'CADTools.cc');
    content = content.replace(/cadtools\.io/g, 'cadtools.cc');
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated: ${file}`);
      replacedCount++;
    }
  }
});

console.log(`Replacement complete. Updated ${replacedCount} files.`);
