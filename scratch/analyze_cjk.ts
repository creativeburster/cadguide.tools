import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/cjk_report.json', 'utf8'));

let placeholders = 0;
let realJapanese = 0;

for (const item of data) {
  if (item.cjk.expert_verdict === '待补充专业评语。' && !item.cjk.pros && !item.cjk.cons && !item.cjk.pricing_features) {
    placeholders++;
  } else {
    realJapanese++;
    console.log(`Tool with CJK: ${item.name} (${item.slug})`);
  }
}

console.log(`Placeholders: ${placeholders}`);
console.log(`Real CJK/Japanese content: ${realJapanese}`);
