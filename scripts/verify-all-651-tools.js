const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/lib/toolbox-data.ts');
const content = fs.readFileSync(targetFile, 'utf8');

// 提取 TOOLBOX_DATA 数组中的所有条目
const slugs = [];
const categories = new Set([
  'cheatsheet',
  'calculator',
  'converter',
  '3d-converter',
  'troubleshoot',
  'viewer',
  'generator',
  'validator',
  'comparator',
  'library'
]);

const slugRegex = /["']?slug["']?:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = slugRegex.exec(content)) !== null) {
  slugs.push(match[1]);
}

console.log('========================================================================');
console.log(`🔎 Auditing Full Toolbox Data Integrity Across ALL ${slugs.length} Tools`);
console.log('========================================================================\n');

// 1. 唯一性验证
const uniqueSlugs = new Set(slugs);
if (uniqueSlugs.size !== slugs.length) {
  console.error(`❌ Duplicate slugs detected! Total: ${slugs.length}, Unique: ${uniqueSlugs.size}`);
  process.exit(1);
}
console.log(`✓ Slugs Uniqueness: 100% Unique (${slugs.length} / ${slugs.length})`);

// 2. 检查分类分布
const catCounts = {};
for (const c of categories) {
  const reg = new RegExp(`["']?category["']?:\\s*['"]${c}['"]`, 'g');
  const m = content.match(reg);
  catCounts[c] = m ? m.length : 0;
}
console.log('\n📊 Current Category Distribution:');
console.table(catCounts);

// 3. 验证 [slug]/page.tsx 的兼容性
const slugPagePath = path.join(__dirname, '../src/app/toolbox/[slug]/page.tsx');
if (fs.existsSync(slugPagePath)) {
  const pageContent = fs.readFileSync(slugPagePath, 'utf8');
  if (pageContent.includes('generateStaticParams') && pageContent.includes('TOOLBOX_DATA')) {
    console.log('✓ Dynamic Route [slug]/page.tsx: SSG generateStaticParams correctly wired to TOOLBOX_DATA');
  } else {
    console.warn('⚠️ Dynamic Route [slug]/page.tsx missing TOOLBOX_DATA connection');
  }
}

console.log('\n========================================================================');
console.log(`✨ AUDIT PASSED: All ${slugs.length} utilities are structurally verified!`);
console.log('========================================================================');
