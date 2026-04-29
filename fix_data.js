const fs = require('fs');
let content = fs.readFileSync('src/lib/data.ts', 'utf-8');

// The error looks like:
// description: "Part 1,
// country: "USA", Part 2",

const brokenRegex = /description:\s*"([^"]+),\s*country:\s*"([^"]+)",\s*([^"]+)",/g;
// Replace with:
// description: "$1, $3",
// country: "$2",

let fixedContent = content.replace(brokenRegex, 'description: "$1, $3",\n    country: "$2",');

fs.writeFileSync('src/lib/data.ts', fixedContent, 'utf-8');
console.log('Fixed data.ts broken strings.');
