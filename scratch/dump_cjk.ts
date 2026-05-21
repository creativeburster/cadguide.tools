import { tools } from '../src/lib/data';
import * as fs from 'fs';

const hasCJK = (str: string) => /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(str);

const report: any[] = [];

for (const t of tools) {
  const cjkItems: any = {};
  if (hasCJK(t.expert_verdict ?? '')) {
    cjkItems.expert_verdict = t.expert_verdict;
  }
  const badPros = (t.pros ?? []).filter(hasCJK);
  if (badPros.length > 0) {
    cjkItems.pros = badPros;
  }
  const badCons = (t.cons ?? []).filter(hasCJK);
  if (badCons.length > 0) {
    cjkItems.cons = badCons;
  }
  const badFeatures = (t.pricing_tiers ?? []).flatMap(tier => tier.features).filter(hasCJK);
  if (badFeatures.length > 0) {
    cjkItems.pricing_features = badFeatures;
  }

  if (Object.keys(cjkItems).length > 0) {
    report.push({
      id: t.id,
      name: t.name,
      slug: t.slug,
      cjk: cjkItems
    });
  }
}

fs.writeFileSync('scratch/cjk_report.json', JSON.stringify(report, null, 2), 'utf8');
console.log(`Wrote CJK report with ${report.length} tools containing CJK characters.`);
