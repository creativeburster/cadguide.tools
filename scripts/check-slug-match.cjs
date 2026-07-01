const fs = require('fs');
const path = require('path');

const guidesDir = path.join('src', 'content', 'guides');
const newDirs = ['rhino-3d', 'maya', 'kicad', 'ansys-mechanical', 'powermill'];
const searchIndex = JSON.parse(fs.readFileSync('src/lib/search-index.json', 'utf-8'));
const toolSlugs = searchIndex.tools ? searchIndex.tools.map(t => t.slug) : searchIndex.map(t => t.slug);

for (const d of newDirs) {
  const dp = path.join(guidesDir, d);
  const files = fs.readdirSync(dp).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const c = fs.readFileSync(path.join(dp, f), 'utf-8');
    const m = c.match(/softwareSlug:\s*"([^"]+)"/);
    const slug = m ? m[1] : 'NOT_FOUND';
    const exists = toolSlugs.includes(slug);
    console.log((exists ? 'OK  ' : 'MISS ') + d + '/' + f + ' -> softwareSlug: ' + slug);
  }
}
