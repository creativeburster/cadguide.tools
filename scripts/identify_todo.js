const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const DATA_TS_PATH = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');
const content = fs.readFileSync(DATA_TS_PATH, 'utf8');

const ast = recast.parse(content, {
  parser: {
    parse(code) {
      return parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'classProperties', 'decorators-legacy']
      });
    }
  }
});

const todo = [];
recast.types.visit(ast, {
  visitObjectExpression(path) {
    const getProp = name => path.node.properties.find(p => p.key && p.key.name === name);
    const slugProp = getProp('slug');
    if (slugProp && slugProp.value.type === 'StringLiteral') {
      const pricing = getProp('pricing_tiers');
      
      let isNpc = true; // Assume it's a placeholder (NPC) unless proven otherwise
      
      if (pricing && pricing.value.type === 'ArrayExpression' && pricing.value.elements.length > 0) {
        // Check first tier
        const firstTier = pricing.value.elements[0];
        if (firstTier.type === 'ObjectExpression') {
          const priceProp = firstTier.properties.find(p => p.key && p.key.name === 'price');
          if (priceProp && priceProp.value.type === 'StringLiteral' && priceProp.value.value !== 'N/A' && priceProp.value.value !== '0') {
            isNpc = false;
          }
          // Special case for free software like Blender/LibreCAD
          if (priceProp && priceProp.value.type === 'StringLiteral' && priceProp.value.value === '0') {
             isNpc = false;
          }
        }
      }
      
      if (isNpc) {
        todo.push(slugProp.value.value);
      }
    }
    this.traverse(path);
  }
});

fs.writeFileSync(path.join(__dirname, '../todo_slugs.json'), JSON.stringify(todo, null, 2));
console.log(`Found ${todo.length} tools still in placeholder state.`);
