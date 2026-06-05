import { NextResponse } from 'next/server';
import { tools } from '@/lib/data';
import { ARTICLES_LIST } from '@/lib/guides-data';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  const now = new Date().toISOString();

  // 1. Core 8 Arteries Landing Pages
  const categoryKeys = ['troubleshooting', 'performance', 'printing', 'standards', 'deployment', 'migration', 'procurement', 'manufacturing'];
  const categoryUrls = categoryKeys.map((cat) => `  <url>
    <loc>${BASE_URL}/guides/${cat}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>`);

  // 2. Dynamic long-tail guides (2,400 entries)
  const guideUrls: string[] = [];
  const selectedArticles = ARTICLES_LIST.slice(0, 10);
  for (const tool of tools) {
    for (const art of selectedArticles) {
      const artIndex = art.id.split('-').pop();
      guideUrls.push(`  <url>
    <loc>${BASE_URL}/guides/${tool.slug}-${art.category}-${artIndex}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.70</priority>
  </url>`);
    }
  }

  // 3. Migrated Cheatsheet & Reference Sheets (17 entries)
  const cheatsheetSlugs = [
    'shortcuts',
    'solidworks-shortcuts-sheet',
    'rhino-shortcuts-sheet',
    'revit-shortcuts-sheet',
    'sketchup-shortcuts-sheet',
    'inventor-shortcuts-sheet',
    'microstation-shortcuts-sheet',
    'archicad-shortcuts-sheet',
    'catia-shortcuts-sheet',
    'creo-shortcuts-sheet',
    'freecad-shortcuts-sheet',
    'fusion360-shortcuts-sheet',
    'draftsight-shortcuts-sheet',
    'bricscad-shortcuts-sheet',
    'vectorworks-shortcuts-sheet',
    'autocad-vs-gstarcad-shortcuts',
    'autocad-vs-zwcad-shortcuts'
  ];
  const cheatsheetUrls = cheatsheetSlugs.map((slug) => `  <url>
    <loc>${BASE_URL}/guides/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryUrls.join('\n')}
${guideUrls.join('\n')}
${cheatsheetUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
