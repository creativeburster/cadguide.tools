const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'lib', 'data');

const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'].map(
  (f) => path.join(DATA_DIR, f)
);

console.log('=== CURRENT RATINGS AUDIT ===');
let hasRatingsCount = 0;
let emptyRatingsCount = 0;
let allTools = [];

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
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' && prop.key.name === 'slug') ||
            (prop.key.type === 'StringLiteral' && prop.key.value === 'slug')),
      );
      if (!slugProp || slugProp.value.type !== 'StringLiteral') {
        this.traverse(p);
        return;
      }
      const slug = slugProp.value.value;

      const nameProp = obj.properties.find(
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' && prop.key.name === 'name') ||
            (prop.key.type === 'StringLiteral' && prop.key.value === 'name')),
      );
      const name = nameProp && nameProp.value.type === 'StringLiteral' ? nameProp.value.value : slug;

      const ratingsProp = obj.properties.find(
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' && prop.key.name === 'external_ratings') ||
            (prop.key.type === 'StringLiteral' && prop.key.value === 'external_ratings')),
      );

      let ratings = [];
      if (ratingsProp && ratingsProp.value.type === 'ArrayExpression') {
        ratings = ratingsProp.value.elements.map(el => {
          if (el.type === 'ObjectExpression') {
            const srcProp = el.properties.find(pr => pr.key.name === 'source');
            const scoreProp = el.properties.find(pr => pr.key.name === 'score');
            return {
              source: srcProp && srcProp.value.value,
              score: scoreProp && scoreProp.value.value
            };
          }
          return null;
        }).filter(Boolean);
      }

      if (ratings.length > 0) {
        hasRatingsCount++;
        allTools.push({ slug, name, file: path.basename(f), ratings });
      } else {
        emptyRatingsCount++;
      }

      this.traverse(p);
    }
  });
}

console.log(`Total tools with ratings: ${hasRatingsCount}`);
console.log(`Total tools with empty/no ratings: ${emptyRatingsCount}`);
console.log('Tools with ratings:');
console.log(JSON.stringify(allTools, null, 2));
