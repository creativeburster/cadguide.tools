import { filterToolsByFeature } from '../src/lib/seo-content';
import { featureCategories } from '../src/lib/data/featureCategories';

console.log('Feature Categories:');
console.log(featureCategories);

console.log('\nDynamic Filtering Results:');
for (const cat of featureCategories) {
  const matchedTools = filterToolsByFeature(cat.id);
  console.log(`- ${cat.name} (${cat.id}): ${matchedTools.length} tools`);
  console.log(`  Tools: ${matchedTools.map(t => t.name).join(', ')}`);
}
