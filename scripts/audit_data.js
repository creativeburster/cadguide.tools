const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const DATA_TS_PATH = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');

const src = fs.readFileSync(DATA_TS_PATH, 'utf8');
const ast = recast.parse(src, {
  parser: {
    parse(code) {
      return parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'classProperties', 'decorators-legacy']
      });
    }
  }
});

const audit = [];

recast.types.visit(ast, {
  visitObjectExpression(path) {
    const getProp = name => path.node.properties.find(p => p.key && p.key.name === name);
    const slugProp = getProp('slug');
    const nameProp = getProp('name');
    
    if (slugProp && slugProp.value.type === 'StringLiteral') {
      const slug = slugProp.value.value;
      const name = nameProp ? nameProp.value.value : slug;
      
      const pricing = getProp('pricing_tiers');
      const capabilities = getProp('core_features');
      const details = getProp('detailed_features');
      
      audit.push({
        name,
        slug,
        hasPricing: pricing && pricing.value.type === 'ArrayExpression' && pricing.value.elements.length > 0,
        hasCapabilities: capabilities && capabilities.value.type === 'ArrayExpression' && capabilities.value.elements.length > 0,
        hasDetails: details && details.value.type === 'ArrayExpression' && details.value.elements.length > 0
      });
    }
    this.traverse(path);
  }
});

const enriched = audit.filter(a => a.hasPricing && a.hasCapabilities && a.hasDetails);
const missing = audit.filter(a => !a.hasPricing || !a.hasCapabilities || !a.hasDetails);

console.log('=== ENRICHED TOOLS (' + enriched.length + ') ===');
enriched.forEach(a => console.log('✅ ' + a.name + ' (' + a.slug + ')'));

console.log('\n=== MISSING/INCOMPLETE DATA (' + missing.length + ') ===');
missing.forEach(a => {
  let status = [];
  if (!a.hasPricing) status.push('Pricing');
  if (!a.hasCapabilities) status.push('Capabilities');
  if (!a.hasDetails) status.push('Details');
  console.log('❌ ' + a.name + ' (' + a.slug + ') - Missing: ' + status.join(', '));
});
