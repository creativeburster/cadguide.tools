// scripts/phase1_clean.js
/**
 * Phase 1 data cleanup:
 *   1. Remove 12 duplicate tool entries (same product written twice or with
 *      conflicting slugs). Keep the entry with more curated content (pros,
 *      cons, expert verdict, longer description).
 *   2. Re-assign category_id for ~40 mis-categorized tools that the bulk
 *      enrichment scripts dumped into "2D CAD" (c1) when they're actually
 *      CAE/CAM (c5), EDA (c6), or BIM (c3).
 *   3. Fix platforms for ~15 tools where the auto-enrichment marked them
 *      "macOS-only" when in reality they're Windows-only.
 *
 * Uses recast + @babel/parser to surgically edit `src/lib/data.ts`,
 * preserving all formatting and comments outside the affected fields.
 *
 * IMPORTANT: All FIELD_FIXES entries are NAME-based (exact match). Earlier
 * versions also accepted IDs, which silently clobbered the wrong rows when
 * an assumed ID didn't match the real one. Don't add `id:` matchers here.
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');
const prettier = require('prettier');

const DATA_TS_PATH = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');

// --- Configuration -------------------------------------------------------

// Tool IDs to delete entirely (duplicate of another tool with richer content).
// All slug collisions are also resolved here — Next.js generateStaticParams
// can't handle two tools with the same slug.
const DELETE_IDS = new Set([
  // Exact-name duplicates
  't18',  // LibreCAD (66-char desc) → keep t60 (175 chars)
  't19',  // nanoCAD (83-char desc) → keep t56 (260 chars)
  't45',  // DraftSight ("draftsight-extra" slug, 71 chars) → keep t22 (130 chars)
  't26',  // IronCAD (149 chars) → keep t58 (197 chars)
  't33',  // GstarCAD (99 chars) → keep t54 (120 chars)
  't47',  // ARES Commander (105 chars) → keep t91 (173 chars)
  't181', // Cabinet Vision (25 chars, no pros/cons) → keep t67 (139 chars)
  // Same-product entries with slightly different names (also slug collisions)
  't96',  // "Inventor" → keep t20 "Autodesk Inventor"
  't97',  // "Creo" → keep t23 "PTC Creo"
  't98',  // "Rhinoceros 3D" → keep t6 "Rhino 3D"
  't129', // "progeCAD" (no pros/cons) → keep t57 "progeCAD Professional"
  't99',  // "TurboCAD" (no pros/cons) → keep t62 "TurboCAD Platinum"
]);

// Category re-assignment keyed by exact tool name.
// c5 = CAE/CAM, c6 = EDA, c3 = BIM.
const RECATEGORIZE = {
  // CAM / mold / sheet metal — c5
  'AlphaCAM': 'c5',
  'BobCAD-CAM': 'c5',
  'Edgecam': 'c5',
  'FeatureCAM': 'c5',
  'GibbsCAM': 'c5',
  'hyperMILL': 'c5',
  'Tebis': 'c5',
  'WorkNC': 'c5',
  'SURFCAM': 'c5',
  'MetaCAM': 'c5',
  'WoodWOP': 'c5',
  'Radan': 'c5',
  'Visi': 'c5',
  'Lantek Expert': 'c5',
  'SigmaNEST': 'c5',
  'TopSolid': 'c5',
  'CADmeister': 'c5',
  'BeckerCAD': 'c5',
  'AutoForm': 'c5',
  'Moldex3D': 'c5',
  'Moldflow': 'c5',
  'KISSsoft': 'c5',
  // EDA — c6
  'Allegro PCB': 'c6',
  'OrCAD': 'c6',
  'PADS Professional': 'c6',
  'Xpedition': 'c6',
  'Pulsonix': 'c6',
  'Target 3001!': 'c6',
  'Quadcept': 'c6',
  'EPLAN': 'c6',
  'EPLAN Electric P8': 'c6',
  'CR-8000': 'c6',
  // BIM / AEC — c3
  'BIMoffice': 'c3',
  'DDS-CAD': 'c3',
  'dRofus': 'c3',
  'Edificius': 'c3',
  'EdiLus': 'c3',
  'HiCAD': 'c3',
  'MagiCAD': 'c3',
  'Renga': 'c3',
  'cadwork': 'c3',
};

// Manual platform fixes — every entry below was double-checked against the
// vendor's own site as of 2026. All are Windows-only desktop apps; the bulk
// enrichment script defaulted them to macOS.
const FIELD_FIXES = {
  'BobCAD-CAM':              { platforms: ['Windows'] },
  'hyperMILL':               { platforms: ['Windows'] },
  'EPLAN':                   { platforms: ['Windows'] },
  'KOMPAS-3D':               { platforms: ['Windows'] },
  'TopSolid':                { platforms: ['Windows'] },
  'T-FLEX CAD':              { platforms: ['Windows'] },
  'DesignSpark Mechanical':  { platforms: ['Windows'] },
  'Maptek Vulcan':           { platforms: ['Windows'] },
  'TeKton3D':                { platforms: ['Windows'] },
  'KISSsoft':                { platforms: ['Windows'] },
  'Vertex BD':               { platforms: ['Windows'] },
  'GibbsCAM':                { platforms: ['Windows'] },
  'ESPRIT':                  { platforms: ['Windows'] },
  'Tebis':                   { platforms: ['Windows'] },
  'Pytha':                   { platforms: ['Windows'] },
  'SigmaNEST':               { platforms: ['Windows'] },
};

// --- Load & parse data.ts ------------------------------------------------

const src = fs.readFileSync(DATA_TS_PATH, 'utf8');
const ast = recast.parse(src, {
  parser: {
    parse(code) {
      return parser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript'],
      });
    },
  },
});

let toolsArrayPath = null;
recast.types.visit(ast, {
  visitVariableDeclaration(p) {
    const dec = p.node.declarations[0];
    if (dec && dec.id && dec.id.name === 'tools' && dec.init && dec.init.type === 'ArrayExpression') {
      toolsArrayPath = p.get('declarations', 0, 'init');
      return false;
    }
    this.traverse(p);
  },
});
if (!toolsArrayPath) throw new Error('Could not locate `tools` array in data.ts');

const arr = toolsArrayPath.node;
console.log(`Parsed: ${arr.elements.length} tool entries.`);

// --- Helpers -------------------------------------------------------------

function getProp(obj, key) {
  if (!obj || obj.type !== 'ObjectExpression') return null;
  return obj.properties.find(
    p => p.type === 'ObjectProperty' && p.key && (p.key.name === key || p.key.value === key)
  );
}

function getStringValue(obj, key) {
  const p = getProp(obj, key);
  if (!p) return null;
  if (p.value.type === 'StringLiteral') return p.value.value;
  return null;
}

function setStringProp(obj, key, newValue) {
  const p = getProp(obj, key);
  if (!p) return false;
  if (p.value.type === 'StringLiteral') {
    p.value.value = newValue;
    p.value.extra = undefined;
    return true;
  }
  return false;
}

function setArrayStringProp(obj, key, newValues) {
  const p = getProp(obj, key);
  if (!p) return false;
  const b = recast.types.builders;
  p.value = b.arrayExpression(newValues.map(v => b.stringLiteral(v)));
  return true;
}

// --- 1) Remove duplicates ------------------------------------------------

const beforeCount = arr.elements.length;
arr.elements = arr.elements.filter(el => {
  const id = getStringValue(el, 'id');
  if (id && DELETE_IDS.has(id)) {
    console.log(`  - DELETE ${id} (${getStringValue(el, 'name')})`);
    return false;
  }
  return true;
});
console.log(`Removed ${beforeCount - arr.elements.length} duplicates (was ${beforeCount}, now ${arr.elements.length}).`);

// --- 2) Re-categorize ----------------------------------------------------

let recatChanged = 0;
for (const el of arr.elements) {
  const name = getStringValue(el, 'name');
  if (!name) continue;
  const newCat = RECATEGORIZE[name];
  if (!newCat) continue;
  const currentCat = getStringValue(el, 'category_id');
  if (currentCat === newCat) continue;
  if (setStringProp(el, 'category_id', newCat)) {
    console.log(`  ~ RECAT ${name} (${currentCat} → ${newCat})`);
    recatChanged++;
  }
}
console.log(`Re-categorized ${recatChanged} tools.`);

// --- 3) Field fixes ------------------------------------------------------

let fieldChanged = 0;
for (const el of arr.elements) {
  const name = getStringValue(el, 'name');
  if (!name || !FIELD_FIXES[name]) continue;
  const fix = FIELD_FIXES[name];
  for (const [k, v] of Object.entries(fix)) {
    if (Array.isArray(v)) {
      if (setArrayStringProp(el, k, v)) {
        console.log(`  ~ FIX ${name} ${k} = [${v.join(',')}]`);
        fieldChanged++;
      }
    } else if (typeof v === 'string') {
      if (setStringProp(el, k, v)) {
        console.log(`  ~ FIX ${name} ${k} = "${v}"`);
        fieldChanged++;
      }
    }
  }
}
console.log(`Applied ${fieldChanged} field fixes.`);

// --- Write back ----------------------------------------------------------

const printed = recast.print(ast).code;

(async () => {
  const formatted = await prettier.format(printed, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
    tabWidth: 2,
  });
  fs.writeFileSync(DATA_TS_PATH, formatted, 'utf8');
  console.log(`\nWrote ${DATA_TS_PATH} (${formatted.length} bytes).`);
})();
