const { filterToolsByFeature } = require('../src/lib/seo-content');
const { featureCategories } = require('../src/lib/data/featureCategories');

console.log('Feature Categories:');
console.log(featureCategories);

console.log('\nDynamic Filtering Results:');
for (const cat of featureCategories) {
  const tools = filterToolsByFeature(cat.id);
  console.log(`- ${cat.name} (${cat.id}): ${tools.length} tools`);
  console.log(`  Tools: ${tools.map(t => t.name).join(', ')}`);
}
