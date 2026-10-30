#!/usr/bin/env node
/**
 * Stale-price audit.
 *
 * `starting_price` is an INTERNAL benchmark used for sorting, budget
 * filtering, comparison verdicts, SEO collections and the TCO calculator.
 * It is never rendered as a price, but it does drift out of date. This
 * script lists every tool whose `last_updated` is older than the threshold
 * so the numbers can be re-checked against the vendor before they skew
 * rankings too far.
 *
 * Usage: node scripts/audit-stale-prices.js [thresholdMonths]
 */
const fs = require('fs');
const path = require('path');

const thresholdMonths = Number(process.argv[2] || 12);
const DATA_DIR = path.join(__dirname, '..', 'src', 'lib', 'data');
const FILES = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

function load(file) {
  const src = fs.readFileSync(path.join(DATA_DIR, file + '.ts'), 'utf8');
  const marker = src.indexOf('= [');
  const body = src
    .slice(src.indexOf('[', marker))
    .trim()
    .replace(/^\[/, '')
    .replace(/\];?\s*$/, '');
  return eval('[' + body + ']');
}

function monthsSince(iso) {
  if (!iso) return null;
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return null;
  const now = new Date();
  return (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
}

const tools = FILES.flatMap(load);
const rows = tools.map((t) => ({
  slug: t.slug,
  name: t.name,
  category: t.category_id,
  lastUpdated: t.last_updated || null,
  months: monthsSince(t.last_updated),
  startingPrice: t.starting_price,
  period: t.price_period || '—',
}));

const stale = rows.filter((r) => r.months === null || r.months >= thresholdMonths);
const missing = rows.filter((r) => r.months === null);
const fresh = rows.filter((r) => r.months !== null && r.months < thresholdMonths);

stale.sort((a, b) => (b.months ?? 999) - (a.months ?? 999));

const lines = [];
lines.push(`# Stale price benchmark report`);
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push(`Threshold: last_updated older than ${thresholdMonths} months`);
lines.push('');
lines.push(`- Total tools: ${rows.length}`);
lines.push(`- Fresh (< ${thresholdMonths} months): ${fresh.length}`);
lines.push(`- Needs re-check: ${stale.length}`);
lines.push(`- Missing last_updated: ${missing.length}`);
lines.push('');
lines.push('`starting_price` below is an internal benchmark only — it must never be rendered as a price.');
lines.push('');
lines.push('| Tool | Category | Last updated | Age (months) | Benchmark | Period |');
lines.push('| --- | --- | --- | --- | --- | --- |');
for (const r of stale) {
  lines.push(
    `| ${r.name} | ${r.category} | ${r.lastUpdated || 'MISSING'} | ${r.months ?? '—'} | ${r.startingPrice} | ${r.period} |`
  );
}

const outDir = path.join(__dirname, '..', 'scratch', 'audit');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'stale-prices.md');
fs.writeFileSync(outFile, lines.join('\n') + '\n');

console.log(`Total: ${rows.length} | Fresh: ${fresh.length} | Needs re-check: ${stale.length} | Missing date: ${missing.length}`);
if (stale.length) {
  console.log('\nTop 20 needing re-check:');
  for (const r of stale.slice(0, 20)) {
    console.log(`  ${String(r.months ?? '—').padStart(4)} mo  ${r.slug.padEnd(26)} ${r.lastUpdated || 'MISSING'}`);
  }
}
console.log(`\nFull report: ${path.relative(process.cwd(), outFile)}`);
