import { filterToolsByFeature } from '../src/lib/seo-content';

const tools = filterToolsByFeature('ai-assisted');
console.log('Tools matched by filterToolsByFeature("ai-assisted"):');
tools.forEach((t, i) => {
  console.log(`${i + 1}. Name: ${t.name}, Slug: ${t.slug}, Score: ${t.score}, Core Features: ${JSON.stringify(t.core_features)}`);
});
