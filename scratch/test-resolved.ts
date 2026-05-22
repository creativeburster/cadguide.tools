import { comparisonPairs } from '../src/lib/seo-content';
console.log("Total resolved pairs:", comparisonPairs().length);
console.log(comparisonPairs().map(p => p.pairSlug).sort());
