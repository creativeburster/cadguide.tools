const fs = require('fs');

let code = fs.readFileSync('src/lib/data.ts', 'utf-8');

const regex = /detailed_features:\s*\[\s*([^\]]+?)\s*\],/g;

code = code.replace(regex, (match, innerText) => {
  // Check if the inner text consists only of strings
  const lines = innerText.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('//'));
  
  // A heuristic: if it has '{', it's already an object
  if (innerText.includes('{')) {
    return match;
  }

  // Parse strings (roughly)
  const strings = lines.map(line => {
    // Remove trailing comma, and quotes
    return line.replace(/^['"]/, '').replace(/['"],?$/, '').trim();
  }).filter(s => s.length > 0);

  if (strings.length === 0) return match;

  const itemsArray = strings.map(s => `          { name: '${s.replace(/'/g, "\\'")}', status: true }`).join(',\n');

  return `detailed_features: [
      {
        category: 'Features',
        items: [
${itemsArray}
        ],
      },
    ],`;
});

fs.writeFileSync('src/lib/data.ts', code, 'utf-8');
console.log('Regex replace done.');
