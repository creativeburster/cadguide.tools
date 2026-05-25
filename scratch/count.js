const fs = require('fs');
const content = fs.readFileSync('src/lib/data.ts', 'utf-8');

const nameRegex = /name:\s*"([^"]+)",/g;
let match;
let count = 0;
const names = [];

while ((match = nameRegex.exec(content)) !== null) {
  count++;
  if(count <= 15) {
    names.push(match[1]);
  }
}

console.log('Total names found in data.ts:', count);
console.log('Sample names:', names);
