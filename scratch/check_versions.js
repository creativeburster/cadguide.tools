const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const DATA_DIR = path.join(__dirname, '..', 'src', 'lib', 'data');
const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];

const toolsData = [];

console.log('检查现有工具数据的 last_updated 和 version 字段...\n');

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

      if (!hasId || !hasSlug || !hasName) {
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
      const lastUpdatedProp = props.find(pr =>
        pr.type === 'ObjectProperty' &&
        ((pr.key.type === 'Identifier' && pr.key.name === 'last_updated') ||
          (pr.key.type === 'StringLiteral' && pr.key.value === 'last_updated'))
      );
      const versionProp = props.find(pr =>
        pr.type === 'ObjectProperty' &&
        ((pr.key.type === 'Identifier' && pr.key.name === 'version') ||
          (pr.key.type === 'StringLiteral' && pr.key.value === 'version'))
      );

      toolsData.push({
        name: nameProp?.value?.value,
        slug: slugProp?.value?.value,
        last_updated: lastUpdatedProp?.value?.value,
        version: versionProp?.value?.value
      });

      this.traverse(p);
    },
  });
}

// 统计分析
const lastUpdatedValues = new Map();
const versionValues = new Map();

for (const t of toolsData) {
  const lu = t.last_updated || '(missing)';
  const v = t.version || '(missing)';
  
  lastUpdatedValues.set(lu, (lastUpdatedValues.get(lu) || 0) + 1);
  versionValues.set(v, (versionValues.get(v) || 0) + 1);
}

console.log('=== last_updated 字段分布 ===');
for (const [value, count] of lastUpdatedValues) {
  console.log(`  ${value.padEnd(20)}: ${count} 个工具`);
}

console.log('\n=== version 字段分布 ===');
for (const [value, count] of versionValues) {
  console.log(`  ${value.padEnd(20)}: ${count} 个工具`);
}

console.log('\n=== 示例数据 ===');
console.log(toolsData.slice(0, 10));
