const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'lib', 'data');

const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'].map(
  (f) => path.join(DATA_DIR, f)
);

const repeatedVerdicts = new Set([
  "A reliable, specialized 2D technical drafting utility optimized for standardized layouts and native DWG workflows.",
  "A specialized engineering solution, delivering robust finite element analysis (CAE) or high-efficiency CNC CAM programming.",
  "An industry-specific BIM platform designed for architectural layouts, BIM coordination, and AEC documentation.",
  "A dedicated electronic design automation tool tailored for schematic capture, PCB layout routing, and circuit validation.",
  "Professional choice for the industry."
]);

let templatedTools = [];

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
      
      if (repeatedVerdicts.has(verdict) || !verdict) {
        templatedTools.push({ slug, name, category: path.basename(f).replace('.ts', ''), verdict });
      }

      this.traverse(p);
    }
  });
}

console.log(`Found ${templatedTools.length} tools with templated or empty verdicts.`);
fs.writeFileSync('scratch/templated_tools.json', JSON.stringify(templatedTools, null, 2));
console.log('Saved to scratch/templated_tools.json');
