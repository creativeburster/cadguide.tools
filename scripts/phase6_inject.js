/**
 * Phase 6 — Inject 60+ new tool entries into src/lib/data.ts.
 *
 * Reads scripts/phase6_catalog.js (plain JS array of tool objects),
 * parses src/lib/data.ts via recast + @babel/parser, and inserts each
 * catalog entry at the end of the `tools` ArrayExpression.
 *
 * Adds two fields the catalog file deliberately omits:
 *   - id: auto-incremented "t<N>" starting after the current max
 *   - logo_url: CallExpression `getLogo("XY")` using initials from name
 *
 * Skips any catalog entry whose slug is already present in data.ts.
 *
 * Run:  node scripts/phase6_inject.js
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const DATA_TS = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');
const CATALOG = require('./phase6_catalog.js');

function parseExpression(jsonSrc) {
  const ast = parser.parse(`const _ = ${jsonSrc};`, {
    sourceType: 'module',
    plugins: ['typescript'],
  });
  return ast.program.body[0].declarations[0].init;
}

function initialsOf(name) {
  // Strip non-letter / non-space characters and take initials of the first two
  // meaningful words. Fallback to first two letters of the slug-ish form.
  const words = name
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return 'XX';
}

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

  // Locate the `tools` array.
  let toolsArray = null;
  recast.visit(ast, {
    visitVariableDeclarator(p) {
      if (
        p.node.id &&
        p.node.id.name === 'tools' &&
        p.node.init &&
        p.node.init.type === 'ArrayExpression'
      ) {
        toolsArray = p.node.init;
        return false;
      }
      this.traverse(p);
    },
  });
  if (!toolsArray) throw new Error('Could not locate `tools` array in data.ts');

  // Collect existing slugs + max id index.
  const existingSlugs = new Set();
  let maxIdNum = 0;
  for (const el of toolsArray.elements) {
    if (!el || el.type !== 'ObjectExpression') continue;
    const slugProp = el.properties.find(
      (p) =>
        p.type === 'ObjectProperty' &&
        !p.computed &&
        p.key &&
        (p.key.name === 'slug' || p.key.value === 'slug')
    );
    if (slugProp && slugProp.value && typeof slugProp.value.value === 'string') {
      existingSlugs.add(slugProp.value.value);
    }
    const idProp = el.properties.find(
      (p) =>
        p.type === 'ObjectProperty' &&
        !p.computed &&
        p.key &&
        (p.key.name === 'id' || p.key.value === 'id')
    );
    if (idProp && idProp.value && typeof idProp.value.value === 'string') {
      const m = /^t(\d+)$/.exec(idProp.value.value);
      if (m) maxIdNum = Math.max(maxIdNum, parseInt(m[1], 10));
    }
  }
  console.log(`Existing tools: ${existingSlugs.size}, max id: t${maxIdNum}`);

  const builders = recast.types.builders;
  let inserted = 0;
  let skipped = [];
  let nextId = maxIdNum + 1;

  for (const tool of CATALOG) {
    if (existingSlugs.has(tool.slug)) {
      skipped.push(tool.slug);
      continue;
    }
    // Build a fresh ObjectExpression in the canonical property order so the
    // diff stays readable: id, name, slug, logo_url, short_desc, description,
    // <category etc>, pricing_*, platforms, industries, core_features,
    // user_scales, official_url, affiliate_url, score, pros, cons,
    // tech_specs, pricing_tiers, expert_verdict.
    const id = `t${nextId++}`;
    const initials = initialsOf(tool.name);

    // Convert catalog object to an ObjectExpression via JSON round-trip,
    // then prepend `id` and replace `logo_url` with getLogo() CallExpression.
    const baseObj = parseExpression(JSON.stringify({ ...tool }));

    // Insert id at the front.
    baseObj.properties.unshift(
      builders.objectProperty(builders.identifier('id'), builders.stringLiteral(id))
    );

    // Build a logo_url property: getLogo("XY")
    const logoCall = builders.callExpression(
      builders.identifier('getLogo'),
      [builders.stringLiteral(initials)]
    );
    const logoProp = builders.objectProperty(
      builders.identifier('logo_url'),
      logoCall
    );

    // Insert logo_url right after slug (or at position 3 as a safe default).
    let slugIdx = baseObj.properties.findIndex(
      (p) =>
        p.type === 'ObjectProperty' &&
        !p.computed &&
        p.key &&
        (p.key.name === 'slug' || p.key.value === 'slug')
    );
    if (slugIdx < 0) slugIdx = 2;
    baseObj.properties.splice(slugIdx + 1, 0, logoProp);

    // Ensure faqs and alternatives fields are present as empty arrays so
    // Phase 5 generator can find and populate them.
    const hasProp = (name) =>
      baseObj.properties.some(
        (p) =>
          p.type === 'ObjectProperty' &&
          !p.computed &&
          p.key &&
          (p.key.name === name || p.key.value === name)
      );
    if (!hasProp('faqs')) {
      baseObj.properties.push(
        builders.objectProperty(
          builders.identifier('faqs'),
          builders.arrayExpression([])
        )
      );
    }
    if (!hasProp('alternatives')) {
      baseObj.properties.push(
        builders.objectProperty(
          builders.identifier('alternatives'),
          builders.arrayExpression([])
        )
      );
    }
    if (!hasProp('detailed_features')) {
      baseObj.properties.push(
        builders.objectProperty(
          builders.identifier('detailed_features'),
          builders.arrayExpression([])
        )
      );
    }

    toolsArray.elements.push(baseObj);
    inserted++;
  }

  const out = recast.print(ast, { quote: 'double', trailingComma: true }).code;
  fs.writeFileSync(DATA_TS, out, 'utf8');
  console.log(`Inserted ${inserted} new tools.`);
  if (skipped.length > 0) {
    console.log(`Skipped ${skipped.length} (already present): ${skipped.join(', ')}`);
  }
  console.log(`New total tools: ${existingSlugs.size + inserted}`);
}

main();
