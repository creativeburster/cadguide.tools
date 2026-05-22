import { tools } from '../src/lib/data';

console.log('--- Checking for scores > 5.0 ---');
const badScoreTools = tools.filter(t => t.score > 5.0);
for (const t of badScoreTools) {
  console.log(`Tool: ${t.name} (${t.slug}) in Category: ${t.category_id} has score: ${t.score}`);
}

console.log('\n--- Checking for CJK characters in key fields ---');
const hasCJK = (str: string) => /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(str);

const cjkTools = tools.filter(t => {
  const fieldsToCheck = [
    t.expert_verdict ?? '',
    ...(t.pros ?? []),
    ...(t.cons ?? []),
    ...(t.pricing_tiers ?? []).flatMap(tier => tier.features)
  ];
  return fieldsToCheck.some(hasCJK);
});

console.log(`Found ${cjkTools.length} tools containing CJK characters:`);
for (const t of cjkTools) {
  console.log(`- ${t.name} (${t.slug})`);
}
