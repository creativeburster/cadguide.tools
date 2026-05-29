import { tools } from '../src/lib/data';
import { comparisonPairs } from '../src/lib/seo-content';

const resolvedPairs = comparisonPairs();
console.log(`Resolved pairs in seo-content: ${resolvedPairs.length}`);

// Count appearances of each tool slug in resolved pairs
const counts: Record<string, number> = {};
for (const pair of resolvedPairs) {
  const s1 = pair.a.slug;
  const s2 = pair.b.slug;
  counts[s1] = (counts[s1] || 0) + 1;
  counts[s2] = (counts[s2] || 0) + 1;
}

// Find tools that are in the database but have 0 comparisons
console.log("\n=== Tools in Database with 0 resolved comparisons ===");
const zeroCompTools = tools
  .filter(t => !counts[t.slug])
  .map(t => ({ name: t.name, slug: t.slug, score: t.score }))
  .sort((a, b) => b.score - a.score);

console.log(`Total tools with 0 comparisons: ${zeroCompTools.length}`);
console.log(JSON.stringify(zeroCompTools.slice(0, 30), null, 2));

console.log("\n=== Active comparison count per tool (top 20) ===");
const sortedCounts = Object.entries(counts)
  .sort((a, b) => b[1] - a[1]);
console.log(sortedCounts.slice(0, 20));
