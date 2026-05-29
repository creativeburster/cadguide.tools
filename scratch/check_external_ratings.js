const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/lib/data');
const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];

const allRatings = [];

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');

  const tools = content.split(/\{\s*id\s*:\s*["']/);
  
  tools.slice(1).forEach(toolBlock => {
    const nameMatch = toolBlock.match(/name\s*:\s*["']([^"']+)["']/);
    const toolName = nameMatch ? nameMatch[1] : 'Unknown';

    const ratingsBlockMatch = toolBlock.match(/external_ratings\s*:\s*\[([\s\S]*?)\]/);
    if (ratingsBlockMatch) {
      const ratingsArrayContent = ratingsBlockMatch[1];
      const ratingObjMatches = ratingsArrayContent.match(/\{\s*[\s\S]*?\}\s*,?/g) || [];
      
      ratingObjMatches.forEach(ratingObjStr => {
        const sourceMatch = ratingObjStr.match(/source\s*:\s*["']([^"']+)["']/);
        const scoreMatch = ratingObjStr.match(/score\s*:\s*([0-9.]+)/);
        const maxMatch = ratingObjStr.match(/max\s*:\s*([0-9.]+)/);
        const urlMatch = ratingObjStr.match(/url\s*:\s*["']([^"']+)["']/);
        
        if (scoreMatch) {
          const score = parseFloat(scoreMatch[1]);
          const source = sourceMatch ? sourceMatch[1] : 'Unknown';
          const max = maxMatch ? parseFloat(maxMatch[1]) : 5;
          const url = urlMatch ? urlMatch[1] : '';
          allRatings.push({
            toolName,
            file,
            source,
            score,
            max,
            url
          });
        }
      });
    }
  });
});

console.log(`Successfully scanned ${allRatings.length} external ratings from database.`);

// Group and check for scores around 4.6 but have high discrepancy issues
// Or check for all entries to see if we have obvious low scores in some areas or if there are any specific 3.2 vs 4.6 mismatch.
// We can filter where rating score is between 4.5 and 4.7
const filtered = allRatings.filter(r => r.score >= 4.5 && r.score <= 4.7);
console.log(`\nFound ${filtered.length} ratings with score in range [4.5, 4.7]:`);
filtered.slice(0, 50).forEach((r, i) => {
  console.log(`${i+1}. [${r.toolName}] [${r.source}] Score: ${r.score}/${r.max} | URL: ${r.url}`);
});

// Also search for any score close to 3.2 to see if there's any record recorded as 3.2
const lowRatings = allRatings.filter(r => r.score >= 3.0 && r.score <= 3.5);
console.log(`\nFound ${lowRatings.length} ratings with score in range [3.0, 3.5]:`);
lowRatings.forEach((r, i) => {
  console.log(`${i+1}. [${r.toolName}] [${r.source}] Score: ${r.score}/${r.max} | URL: ${r.url}`);
});
