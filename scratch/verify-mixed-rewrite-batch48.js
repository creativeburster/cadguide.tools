const fs = require('fs');
const matter = require('gray-matter');
const guidesDir = 'f:/cadguide.tools/src/content/guides';
const tools = ['varicad','vertex-bd','visi','zbrush','zw3d','zwcad'];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const t of tools) {
  const dir = `${guidesDir}/${t}`;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const { data } = matter(fs.readFileSync(`${dir}/${f}`, 'utf-8'));
    const miss = req.filter(k => !data[k]);
    console.log(f.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
  }
}
