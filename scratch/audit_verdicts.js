const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'lib', 'data');

const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'].map(
  (f) => path.join(DATA_DIR, f)
);

let allVerdicts = [];
let templateCounts = {};

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const ast = recast.parse(src, {
    parser: {
      parse: (s) =>
        parser.parse(s, {
          sourceType: 'module',
          plugins: ['typescript'],
          tokens: true,
        }),
    },
  });

  recast.types.visit(ast, {
    visitObjectExpression(p) {
      const obj = p.node;
      const slugProp = obj.properties.find(
        (prop) => prop.key && (prop.key.name === 'slug' || prop.key.value === 'slug')
      );
      if (!slugProp || slugProp.value.type !== 'StringLiteral') {
        this.traverse(p);
        return;
      }
      const slug = slugProp.value.value;

      const nameProp = obj.properties.find(
        (prop) => prop.key && (prop.key.name === 'name' || prop.key.value === 'name')
      );
      const name = nameProp && nameProp.value.type === 'StringLiteral' ? nameProp.value.value : slug;

      const verdictProp = obj.properties.find(
        (prop) => prop.key && (prop.key.name === 'expert_verdict' || prop.key.value === 'expert_verdict')
      );

      const verdict = verdictProp && verdictProp.value.type === 'StringLiteral' ? verdictProp.value.value : "";
      
      if (verdict) {
        templateCounts[verdict] = (templateCounts[verdict] || 0) + 1;
        allVerdicts.push({ slug, name, file: path.basename(f), verdict });
      }

      this.traverse(p);
    }
  });
}

console.log(`Total verdicts scanned: ${allVerdicts.length}`);
console.log('Top repeated verdicts:');
const sortedRepeated = Object.entries(templateCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
console.log(JSON.stringify(sortedRepeated, null, 2));

console.log('\nSample verdicts (first 10):');
console.log(JSON.stringify(allVerdicts.slice(0, 10), null, 2));
