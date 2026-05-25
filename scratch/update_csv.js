const fs = require('fs');
const content = fs.readFileSync('src/lib/data.ts', 'utf-8');

// Use a custom parser to be safe, or multiple regex passes
const toolBlocks = content.split('id: "t').slice(1);
let csv = '\uFEFFCountry,Software Name,Website\n'; // BOM for Excel

toolBlocks.forEach(block => {
  const nameMatch = block.match(/name:\s*"([^"]+)"/);
  const urlMatch = block.match(/official_url:\s*"([^"]+)"/);
  const countryMatch = block.match(/country:\s*"([^"]+)"/);

  if (nameMatch && urlMatch && countryMatch) {
    csv += `"${countryMatch[1]}","${nameMatch[1]}","${urlMatch[1]}"\n`;
  }
});

fs.writeFileSync('Top_20_Countries_CAD_Software.csv', csv, 'utf-8');
console.log('CSV updated to match the site perfectly! Total tools written: ' + toolBlocks.length);
