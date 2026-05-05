const fs = require('fs');
const content = fs.readFileSync('src/lib/data.ts', 'utf8');
const toolBlocks = content.split('{').slice(1);
const toolNames = [];
toolBlocks.forEach(block => {
    const idMatch = block.match(/^\s*id:\s*"t\d+"/m);
    if (idMatch) {
        const nameMatch = block.match(/^\s*name:\s*"([^"]+)"/m);
        if (nameMatch) {
            toolNames.push(nameMatch[1]);
        }
    }
});
console.log(toolNames.sort().join(', '));
console.log('\nActual tools:', toolNames.length);
