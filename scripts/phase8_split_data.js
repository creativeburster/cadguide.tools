#!/usr/bin/env node
/**
 * Phase 8: split src/lib/data.ts into per-category files.
 *
 * Output:
 *   src/lib/types.ts                  — Tool, Category, PricingType interfaces
 *   src/lib/data/helpers.ts           — getLogo helper
 *   src/lib/data/categories.ts        — Category[] array
 *   src/lib/data/c1.ts ... c7.ts      — Tool[] per category, in original order
 *   src/lib/data.ts                   — slim barrel: re-exports + assembled tools[]
 *
 * Behavior preservation:
 *   - The per-category arrays preserve each tool's *within-category* position
 *     from the original file.
 *   - The barrel's exported `tools` is sorted by a numeric key derived from
 *     `id` (t1, t2, ..., t244, then ext-*), reproducing the original global
 *     order exactly.  This keeps homepage's "score >= 4.8" featured-six
 *     selection, sitemap.xml order, and any other order-dependent UI
 *     identical to pre-Phase-8.
 */
const fs = require('fs');
const path = require('path');
const recast = require('recast');
const parser = require('@babel/parser');

const ROOT = path.resolve(__dirname, '..');
const DATA_TS = path.join(ROOT, 'src/lib/data.ts');
const TYPES_TS = path.join(ROOT, 'src/lib/types.ts');
const DATA_DIR = path.join(ROOT, 'src/lib/data');

const src = fs.readFileSync(DATA_TS, 'utf8');
const ast = recast.parse(src, {
  parser: {
    parse(code) {
      return parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript'],
        tokens: true,
      });
    },
  },
});

const program = ast.program;

// Find the relevant top-level declarations.
let categoriesDecl = null;          // export const categories
let toolsDecl = null;               // export const tools
let getLogoDecl = null;             // const getLogo = ...
let interfaceNodes = [];            // Category, Tool, PricingType
let helperFnNodes = [];             // getToolBySlug, getToolsByCategory

for (const node of program.body) {
  if (node.type === 'ExportNamedDeclaration' && node.declaration) {
    const d = node.declaration;
    if (d.type === 'VariableDeclaration') {
      const id = d.declarations[0].id.name;
      if (id === 'categories') categoriesDecl = node;
      if (id === 'tools') toolsDecl = node;
    } else if (d.type === 'TSInterfaceDeclaration' || d.type === 'TSTypeAliasDeclaration') {
      interfaceNodes.push(node);
    } else if (d.type === 'FunctionDeclaration') {
      helperFnNodes.push(node);
    }
  } else if (node.type === 'VariableDeclaration') {
    const id = node.declarations[0].id.name;
    if (id === 'getLogo') getLogoDecl = node;
  }
}

if (!toolsDecl) throw new Error('Could not find `export const tools` in data.ts');
if (!categoriesDecl) throw new Error('Could not find `export const categories` in data.ts');

const toolsArrayNode = toolsDecl.declaration.declarations[0].init;
if (!toolsArrayNode || toolsArrayNode.type !== 'ArrayExpression') {
  throw new Error('tools is not an ArrayExpression');
}

// For each tool, extract category_id and serialize the object literal back to
// source text via recast.  We retain a per-tool source string so we don't
// risk losing formatting that AST -> code can occasionally munge.
const toolsByCategory = new Map();
let invalidCount = 0;
for (const el of toolsArrayNode.elements) {
  if (!el || el.type !== 'ObjectExpression') continue;
  const catProp = el.properties.find(
    (p) =>
      p.type === 'ObjectProperty' &&
      ((p.key.type === 'Identifier' && p.key.name === 'category_id') ||
        (p.key.type === 'StringLiteral' && p.key.value === 'category_id'))
  );
  if (!catProp || catProp.value.type !== 'StringLiteral') {
    invalidCount++;
    continue;
  }
  const catId = catProp.value.value;
  if (!toolsByCategory.has(catId)) toolsByCategory.set(catId, []);
  toolsByCategory.get(catId).push(recast.print(el).code);
}

console.log(`Parsed ${toolsArrayNode.elements.length} tools (${invalidCount} skipped)`);
for (const [cat, items] of toolsByCategory) {
  console.log(`  ${cat}: ${items.length}`);
}

// ----- emit src/lib/types.ts -----
const typesParts = interfaceNodes.map((n) => recast.print(n).code).join('\n\n');
fs.writeFileSync(
  TYPES_TS,
  `// Auto-extracted from data.ts by scripts/phase8_split_data.js.
// Shared types used across data modules and UI.
${typesParts}\n`
);

// ----- emit src/lib/data/ directory -----
fs.mkdirSync(DATA_DIR, { recursive: true });

// helpers.ts
const getLogoBody = getLogoDecl ? recast.print(getLogoDecl).code : '';
fs.writeFileSync(
  path.join(DATA_DIR, 'helpers.ts'),
  `// Auto-extracted from data.ts by scripts/phase8_split_data.js.
${getLogoBody}

export { getLogo };
`
);

// categories.ts
const categoriesBody = recast.print(categoriesDecl).code;
fs.writeFileSync(
  path.join(DATA_DIR, 'categories.ts'),
  `// Auto-extracted from data.ts by scripts/phase8_split_data.js.
import type { Category } from '../types';

${categoriesBody}
`
);

// c1.ts .. c7.ts
const CATEGORY_INFO = {
  c1: '2D CAD',
  c2: '3D Modeling',
  c3: 'BIM / Plant',
  c4: 'Viewer',
  c5: 'CAE / CAM',
  c6: 'EDA',
  c7: 'Specialized',
};
for (const [catId, label] of Object.entries(CATEGORY_INFO)) {
  const items = toolsByCategory.get(catId) || [];
  const body = items.join(',\n');
  fs.writeFileSync(
    path.join(DATA_DIR, `${catId}.ts`),
    `// Auto-generated by scripts/phase8_split_data.js — do not hand-edit.
// Category ${catId} — ${label} (${items.length} tools).
import type { Tool } from '../types';
import { getLogo } from './helpers';

export const ${catId}Tools: Tool[] = [
${body}
];
`
  );
  console.log(`Wrote src/lib/data/${catId}.ts (${items.length} tools)`);
}

// ----- emit slim barrel: src/lib/data.ts -----
const barrel = `// Auto-generated by scripts/phase8_split_data.js — do not hand-edit.
//
// Public entry point for tool catalog data.  Re-exports types + helpers and
// assembles the global \`tools\` array by concatenating the per-category
// modules and sorting by id so the global order matches the pre-split file
// (homepage featured-six and sitemap order are unchanged).

export type {
  Category,
  Tool,
  PricingType,
} from './types';

export { categories } from './data/categories';
export { getLogo } from './data/helpers';

import type { Tool } from './types';
import { c1Tools } from './data/c1';
import { c2Tools } from './data/c2';
import { c3Tools } from './data/c3';
import { c4Tools } from './data/c4';
import { c5Tools } from './data/c5';
import { c6Tools } from './data/c6';
import { c7Tools } from './data/c7';

// ext-* ids come after all numeric t* ids; preserve their original sequence
// (matches the order they appeared in the pre-split data.ts).
const EXT_ORDER = [
  'ext-infraworks',
  'ext-3ds-max',
  'ext-zbrush',
  'ext-keyshot',
  'ext-lumion',
  'ext-enscape',
  'ext-twinmotion',
];

function orderKey(id: string): number {
  if (id.startsWith('t') && !id.startsWith('ext-')) {
    const n = parseInt(id.slice(1), 10);
    return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
  }
  if (id.startsWith('ext-')) {
    const idx = EXT_ORDER.indexOf(id);
    return 1_000_000 + (idx >= 0 ? idx : EXT_ORDER.length);
  }
  return Number.MAX_SAFE_INTEGER;
}

export const tools: Tool[] = [
  ...c1Tools,
  ...c2Tools,
  ...c3Tools,
  ...c4Tools,
  ...c5Tools,
  ...c6Tools,
  ...c7Tools,
].sort((a, b) => orderKey(a.id) - orderKey(b.id));

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter((tool) => tool.category_id === categoryId);
}
`;

fs.writeFileSync(DATA_TS, barrel);
console.log(`Wrote src/lib/data.ts (barrel, ${barrel.split('\n').length} lines)`);
console.log('Done. Run tsc + npm run build to verify.');
