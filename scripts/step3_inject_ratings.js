#!/usr/bin/env node
/**
 * Step 3 — Inject external_ratings into per-category data modules
 * (src/lib/data/c1..c7.ts). Idempotent — if a tool already has an
 * `external_ratings` property, the patch is skipped.
 *
 * Source: scripts/step3_ratings_manifest.json — hand-researched
 * ratings extracted from G2 / Capterra / TrustRadius / Software Advice /
 * GetApp search snippets where the score AND review count were both
 * surfaced in the snippet (we don't fabricate review counts).
 *
 * Run:  node scripts/step3_inject_ratings.js
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'lib', 'data');
const MANIFEST = path.join(__dirname, 'step3_ratings_manifest.json');

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
// Strip _meta
delete manifest._meta;

const b = recast.types.builders;

/**
 * Build an AST ArrayExpression for the given external_ratings array.
 * Each entry is an ObjectExpression with source/score/max/count[/url].
 */
function ratingsArrayAst(entries) {
  return b.arrayExpression(
    entries.map((e) => {
      const props = [
        b.objectProperty(b.identifier('source'), b.stringLiteral(e.source)),
        b.objectProperty(b.identifier('score'), b.numericLiteral(e.score)),
        b.objectProperty(b.identifier('max'), b.numericLiteral(e.max)),
        b.objectProperty(b.identifier('count'), b.numericLiteral(e.count)),
      ];
      if (e.url) {
        props.push(b.objectProperty(b.identifier('url'), b.stringLiteral(e.url)));
      }
      return b.objectExpression(props);
    }),
  );
}

/**
 * Apply patches to a single .ts file by traversing top-level
 * `export const tools = [...]` (or similar) and matching tool objects by slug.
 */
function patchFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
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

  let patchCount = 0;
  let skippedCount = 0;

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
      const entries = manifest[slug];
      if (!entries) {
        this.traverse(p);
        return;
      }
      // Check if external_ratings already exists.
      const existing = obj.properties.find(
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' &&
            prop.key.name === 'external_ratings') ||
            (prop.key.type === 'StringLiteral' &&
              prop.key.value === 'external_ratings')),
      );
      if (existing) {
        skippedCount++;
        console.log(`  SKIP ${slug} — already has external_ratings`);
        this.traverse(p);
        return;
      }
      // Inject the new property at end of object.
      obj.properties.push(
        b.objectProperty(
          b.identifier('external_ratings'),
          ratingsArrayAst(entries),
        ),
      );
      patchCount++;
      console.log(`  ADD  ${slug} — ${entries.length} ratings`);
      this.traverse(p);
    },
  });

  if (patchCount > 0) {
    const out = recast.print(ast, { quote: 'double', tabWidth: 2 }).code;
    fs.writeFileSync(filePath, out);
  }
  return { patched: patchCount, skipped: skippedCount };
}

const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'].map(
  (f) => path.join(DATA_DIR, f),
);

let totalPatched = 0;
let totalSkipped = 0;
for (const f of files) {
  console.log(`\n${path.basename(f)}:`);
  const r = patchFile(f);
  totalPatched += r.patched;
  totalSkipped += r.skipped;
}

console.log(
  `\n---\nDone. Patched ${totalPatched} tool(s) across 7 files. Skipped ${totalSkipped} (already had ratings).`,
);

// Sanity check — number of slugs in manifest that got matched
const expected = Object.keys(manifest).length;
if (totalPatched + totalSkipped !== expected) {
  console.warn(
    `WARN: manifest has ${expected} slugs, but matched ${totalPatched + totalSkipped}. Some slugs may be missing from data modules.`,
  );
  const seen = new Set();
  recast.types.visit(
    recast.parse(files.map((f) => fs.readFileSync(f, 'utf8')).join('\n'), {
      parser: {
        parse: (s) =>
          parser.parse(s, {
            sourceType: 'module',
            plugins: ['typescript'],
            tokens: true,
          }),
      },
    }),
    {
      visitObjectExpression(p) {
        const sp = p.node.properties.find(
          (pr) =>
            pr.type === 'ObjectProperty' &&
            pr.key.type === 'Identifier' &&
            pr.key.name === 'slug',
        );
        if (sp && sp.value.type === 'StringLiteral') seen.add(sp.value.value);
        this.traverse(p);
      },
    },
  );
  for (const s of Object.keys(manifest)) {
    if (!seen.has(s)) console.warn(`  missing slug in data modules: ${s}`);
  }
}
