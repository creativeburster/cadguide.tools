const { tools } = require('../src/lib/data');
const { comparisonPairs } = require('../src/lib/seo-content');

// Helper to resolve pairs
const tsTools = require('../src/lib/data'); 
// Wait, TS modules aren't directly runnable in pure node without ts-node or transpiling.
// Let's write a pure JS runner or transpile via ts-node / npx ts-node if ts-node is available,
// or we can read the raw text of src/lib/seo-content.ts and parse it.
