const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const DATA_DIR = path.join(__dirname, '..', 'src', 'lib', 'data');
const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];

const toolsData = [];

for (const f of files) {
  const src = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
  const ast = recast.parse(src, {
    parser: {
      parse: (s) => parser.parse(s, {
        sourceType: 'module',
        plugins: ['typescript'],
        tokens: true
      })
    }
  });

  recast.types.visit(ast, {
    visitObjectExpression(p) {
      const obj = p.node;
      const props = obj.properties;

      const hasId = props.some(pr =>
        pr.type === 'ObjectProperty' &&
        ((pr.key.type === 'Identifier' && pr.key.name === 'id') ||
          (pr.key.type === 'StringLiteral' && pr.key.value === 'id'))
      );
      const hasSlug = props.some(pr =>
        pr.type === 'ObjectProperty' &&
        ((pr.key.type === 'Identifier' && pr.key.name === 'slug') ||
          (pr.key.type === 'StringLiteral' && pr.key.value === 'slug'))
      );
      const hasName = props.some(pr =>
        pr.type === 'ObjectProperty' &&
        ((pr.key.type === 'Identifier' && pr.key.name === 'name') ||
          (pr.key.type === 'StringLiteral' && pr.key.value === 'name'))
      );
      const hasCategoryId = props.some(pr =>
        pr.type === 'ObjectProperty' &&
        ((pr.key.type === 'Identifier' && pr.key.name === 'category_id') ||
          (pr.key.type === 'StringLiteral' && pr.key.value === 'category_id'))
      );

      if (!hasId || !hasSlug || !hasName || !hasCategoryId) {
        this.traverse(p);
        return;
      }

      const slugProp = props.find(pr =>
        pr.type === 'ObjectProperty' &&
        ((pr.key.type === 'Identifier' && pr.key.name === 'slug') ||
          (pr.key.type === 'StringLiteral' && pr.key.value === 'slug'))
      );
      const nameProp = props.find(pr =>
        pr.type === 'ObjectProperty' &&
        ((pr.key.type === 'Identifier' && pr.key.name === 'name') ||
          (pr.key.type === 'StringLiteral' && pr.key.value === 'name'))
      );
      const slug = slugProp.value.value;
      const name = nameProp.value.value;

      let sources = [];

      const erProp = props.find(pr =>
        pr.type === 'ObjectProperty' &&
        ((pr.key.type === 'Identifier' && pr.key.name === 'external_ratings') ||
          (pr.key.type === 'StringLiteral' && pr.key.value === 'external_ratings'))
      );

      if (erProp && erProp.value.type === 'ArrayExpression' && erProp.value.elements.length > 0) {
        for (const el of erProp.value.elements) {
          if (el.type === 'ObjectExpression') {
            const srcProp = el.properties.find(pr =>
              pr.type === 'ObjectProperty' &&
              ((pr.key.type === 'Identifier' && pr.key.name === 'source') ||
                (pr.key.type === 'StringLiteral' && pr.key.value === 'source'))
            );
            if (srcProp && srcProp.value.type === 'StringLiteral') {
              sources.push(srcProp.value.value);
            }
          }
        }
      }

      toolsData.push({
        name,
        slug,
        sources,
        sourceCount: sources.length
      });

      this.traverse(p);
    },
  });
}

console.log('=== CAD/BIM 工具外部评分来源完整统计 ===\n');
console.log(`总工具数：${toolsData.length}\n`);

// 按来源数分组
const groups = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] };

for (const t of toolsData) {
  if (groups[t.sourceCount]) {
    groups[t.sourceCount].push(t);
  }
}

console.log('=== 8个来源 ===');
for (const t of groups[8]) {
  console.log(`  ${t.name} (${t.slug}): ${t.sources.join(', ')}`);
}
console.log();

console.log('=== 7个来源 ===');
for (const t of groups[7]) {
  console.log(`  ${t.name} (${t.slug}): ${t.sources.join(', ')}`);
}
console.log();

console.log('=== 6个来源 ===');
for (const t of groups[6]) {
  console.log(`  ${t.name} (${t.slug}): ${t.sources.join(', ')}`);
}
console.log();

console.log('=== 5个来源 ===');
for (const t of groups[5]) {
  console.log(`  ${t.name} (${t.slug}): ${t.sources.join(', ')}`);
}
console.log();

console.log('=== 4个来源 ===');
for (const t of groups[4]) {
  console.log(`  ${t.name} (${t.slug}): ${t.sources.join(', ')}`);
}
console.log();

console.log('=== 3个来源 ===');
for (const t of groups[3]) {
  console.log(`  ${t.name} (${t.slug}): ${t.sources.join(', ')}`);
}
console.log();

console.log('=== 2个来源 ===');
for (const t of groups[2]) {
  console.log(`  ${t.name} (${t.slug}): ${t.sources.join(', ')}`);
}
console.log();

console.log('=== 1个来源 ===');
for (const t of groups[1]) {
  console.log(`  ${t.name} (${t.slug}): ${t.sources.join(', ')}`);
}
console.log();

console.log('=== 0个来源（没有评分） ===');
for (const t of groups[0]) {
  console.log(`  ${t.name} (${t.slug})`);
}
console.log();

console.log('=== 统计汇总 ===');
for (let i = 8; i >= 0; i--) {
  if (groups[i].length > 0) {
    console.log(`${i}个来源：${groups[i].length}个工具`);
  }
}
console.log();

const withRatings = toolsData.filter(t => t.sourceCount > 0);
console.log(`有评分的工具：${withRatings.length}个 (${((withRatings.length / toolsData.length) * 100).toFixed(1)}%)`);
console.log(`没有评分的工具：${groups[0].length}个 (${((groups[0].length / toolsData.length) * 100).toFixed(1)}%)`);
