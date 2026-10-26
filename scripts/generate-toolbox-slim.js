/**
 * Generates src/lib/toolbox-slim.json — a minimal index of TOOLBOX_DATA
 * (slug, title, description, category) for client components such
 * as RelatedTools, so they don't have to bundle the full toolbox dataset.
 * Runs as part of `npm run build` (see package.json).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '../src/lib/toolbox-data.ts'), 'utf8');
const start = src.indexOf('export const TOOLBOX_DATA: ToolboxItem[] = [');
if (start < 0) throw new Error('TOOLBOX_DATA declaration not found');
const arrayStart = src.indexOf('[', start + 'export const TOOLBOX_DATA: ToolboxItem[] ='.length);
// Find the matching closing bracket of the top-level array.
let depth = 0, end = -1, inStr = null;
for (let i = arrayStart; i < src.length; i++) {
  const ch = src[i];
  if (inStr) {
    if (ch === '\\') { i++; continue; }
    if (ch === inStr) inStr = null;
    continue;
  }
  if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
  if (ch === '[') depth++;
  else if (ch === ']') { depth--; if (depth === 0) { end = i; break; } }
}
if (end < 0) throw new Error('Could not find end of TOOLBOX_DATA array');

const data = vm.runInNewContext('(' + src.slice(arrayStart, end + 1) + ')');
// RelatedTools matches path tokens against slug + title + description, so the
// (description-derived) keyword arrays are not needed on the client.
const slim = data.map((t) => ({
  slug: t.slug,
  title: t.title,
  description: t.description,
  category: t.category,
}));

const out = path.join(__dirname, '../src/lib/toolbox-slim.json');
fs.writeFileSync(out, JSON.stringify(slim), 'utf8');
console.log(`Generated toolbox-slim.json with ${slim.length} items (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
