import { tools } from '../src/lib/data';

console.log("=== Checking all tools in database with score > 5 ===");
const badTools = tools
  .filter(t => t.score > 5)
  .map(t => ({ name: t.name, slug: t.slug, score: t.score }));

console.log(`Found ${badTools.length} tools with score > 5:`);
console.log(JSON.stringify(badTools, null, 2));
