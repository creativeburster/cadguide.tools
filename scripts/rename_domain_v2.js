// Rename pass: cadtools.cc / CADTools[.cc] -> cadguide.tools / CADGuide[.tools]
//
// Walks src/, scripts/, public/, and SOUL.md (text files only) and
// rewrites every occurrence of the old domain + brand to the new one.
// Order matters: we replace longer / more specific patterns first so
// the bare "CADTools" replacement does not eat the "CADTools.cc"
// pattern. The script is idempotent — running it twice is a no-op
// because the new strings don't contain the old ones.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TARGET_DIRS = ['src', 'scripts', 'public'];
const EXTRA_FILES = ['SOUL.md'];
const VALID_EXT = new Set(['.ts', '.tsx', '.js', '.css', '.md', '.json']);
// Files we intentionally skip even if they are in TARGET_DIRS:
const SKIP = new Set([
  // Don't rename ourselves recursively.
  path.join('scripts', 'rename_domain.js'),
  path.join('scripts', 'rename_domain_v2.js'),
]);

function walk(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...walk(p));
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name);
      if (VALID_EXT.has(ext)) out.push(p);
    }
  }
  return out;
}

const replacements = [
  // URL host first — has the dot so it can't collide with brand text.
  [/cadtools\.cc/g, 'cadguide.tools'],
  // Brand display with TLD.
  [/CADTools\.cc/g, 'CADGuide.tools'],
  // Standalone brand. Word boundary keeps us from rewriting strings
  // like "CADToolsFoo" that don't exist today but might in the future.
  [/\bCADTools\b/g, 'CADGuide'],
  // Service-worker cache key — bumping invalidates old caches on
  // visitors' devices so the new domain doesn't serve stale assets.
  [/cadtools-cache-v2/g, 'cadguide-cache-v3'],
];

const files = [];
for (const d of TARGET_DIRS) {
  const abs = path.join(ROOT, d);
  if (fs.existsSync(abs)) files.push(...walk(abs));
}
for (const f of EXTRA_FILES) {
  const abs = path.join(ROOT, f);
  if (fs.existsSync(abs)) files.push(abs);
}

let touched = 0;
for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (SKIP.has(rel)) continue;
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [from, to] of replacements) after = after.replace(from, to);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    console.log('updated', rel);
    touched++;
  }
}

console.log(`done — touched ${touched} files`);
