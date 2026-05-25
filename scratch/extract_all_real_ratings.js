const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 1. Ratings from step3_ratings_manifest.json
let ratings1 = {};
try {
  const file1 = fs.readFileSync(path.join(ROOT, 'scripts', 'step3_ratings_manifest.json'), 'utf8');
  ratings1 = JSON.parse(file1);
  delete ratings1._meta;
} catch (e) {
  console.log('Error reading step3_ratings_manifest.json:', e.message);
}

// 2. Ratings from enrich_ratings.js (REAL_RATINGS)
let ratings2 = {};
try {
  const enrichSrc = fs.readFileSync(path.join(ROOT, 'scripts', 'enrich_ratings.js'), 'utf8');
  // Simple extraction of the REAL_RATINGS block using a regex or simple evaluation since it's JS
  const match = enrichSrc.match(/const REAL_RATINGS = ({[\s\S]*?});/);
  if (match) {
    // Safely evaluate or parse the object
    ratings2 = eval(`(${match[1]})`);
  }
} catch (e) {
  console.log('Error reading enrich_ratings.js REAL_RATINGS:', e.message);
}

// 3. Ratings from phase4_enrich_flagships.js (PATCHES)
let ratings3 = {};
try {
  const flagshipSrc = fs.readFileSync(path.join(ROOT, 'scripts', 'phase4_enrich_flagships.js'), 'utf8');
  const match = flagshipSrc.match(/const PATCHES = ({[\s\S]*?});/);
  if (match) {
    const patches = eval(`(function() { const LAST_UPDATED = '2025-11-15'; return ${match[1]}; })()`);
    for (const [slug, obj] of Object.entries(patches)) {
      if (obj.external_ratings) {
        ratings3[slug] = obj.external_ratings;
      }
    }
  }
} catch (e) {
  console.log('Error reading phase4_enrich_flagships.js PATCHES:', e.message);
}

// Merge all three
const merged = {};
const addRatings = (src) => {
  for (const [slug, list] of Object.entries(src)) {
    if (!merged[slug]) {
      merged[slug] = [];
    }
    // merge by source to avoid duplicates
    for (const r of list) {
      if (!merged[slug].some(existing => existing.source === r.source)) {
        merged[slug].push(r);
      }
    }
  }
};

addRatings(ratings1);
addRatings(ratings2);
addRatings(ratings3);

console.log(`Merged ratings for ${Object.keys(merged).length} tools:`);
console.log(Object.keys(merged).sort());

fs.writeFileSync(path.join(ROOT, 'scratch', 'merged_real_ratings.json'), JSON.stringify(merged, null, 2));
console.log('Saved merged ratings to scratch/merged_real_ratings.json');
