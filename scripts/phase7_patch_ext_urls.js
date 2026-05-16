/**
 * Phase 7 helper — patch the 7 "ext-*" tools that have empty official_url.
 *
 * These were imported as visualization/rendering extensions and ended up with
 * empty official_url strings, which blocks the logo downloader from finding
 * favicons. Backfill with the canonical Autodesk / Maxon / Pixologic / etc.
 * product page URLs.
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const DATA_TS = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');

const URLS = {
  'ext-infraworks': 'https://www.autodesk.com/products/infraworks/overview',
  'ext-3ds-max': 'https://www.autodesk.com/products/3ds-max/overview',
  'ext-zbrush': 'https://www.maxon.net/en/zbrush',
  'ext-keyshot': 'https://www.keyshot.com',
  'ext-lumion': 'https://lumion.com',
  'ext-enscape': 'https://enscape3d.com',
  'ext-twinmotion': 'https://www.twinmotion.com',
};

function main() {
  const src = fs.readFileSync(DATA_TS, 'utf8');
  const ast = recast.parse(src, {
    parser: {
      parse(s) {
        return parser.parse(s, {
          sourceType: 'module',
          plugins: ['typescript'],
          tokens: true,
        });
      },
    },
  });

  let toolsArray = null;
  recast.visit(ast, {
    visitVariableDeclarator(p) {
      if (p.node.id && p.node.id.name === 'tools' && p.node.init && p.node.init.type === 'ArrayExpression') {
        toolsArray = p.node.init;
        return false;
      }
      this.traverse(p);
    },
  });
  if (!toolsArray) throw new Error('tools array not found');

  const builders = recast.types.builders;
  let patched = 0;

  for (const el of toolsArray.elements) {
    if (!el || el.type !== 'ObjectExpression') continue;
    const idProp = el.properties.find(
      (p) =>
        p.type === 'ObjectProperty' &&
        !p.computed &&
        p.key &&
        (p.key.name === 'id' || p.key.value === 'id')
    );
    if (!idProp || !idProp.value || typeof idProp.value.value !== 'string') continue;
    const id = idProp.value.value;
    if (!(id in URLS)) continue;

    const urlProp = el.properties.find(
      (p) =>
        p.type === 'ObjectProperty' &&
        !p.computed &&
        p.key &&
        (p.key.name === 'official_url' || p.key.value === 'official_url')
    );
    if (urlProp) {
      // Only overwrite if currently empty.
      if (urlProp.value.type === 'StringLiteral' && urlProp.value.value === '') {
        urlProp.value = builders.stringLiteral(URLS[id]);
        patched++;
      }
    } else {
      el.properties.push(
        builders.objectProperty(
          builders.identifier('official_url'),
          builders.stringLiteral(URLS[id])
        )
      );
      patched++;
    }
  }

  const out = recast.print(ast, { quote: 'double', trailingComma: true }).code;
  fs.writeFileSync(DATA_TS, out, 'utf8');
  console.log(`Patched official_url on ${patched} ext-* tools.`);
}

main();
