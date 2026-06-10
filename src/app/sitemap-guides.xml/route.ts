import { NextResponse } from 'next/server';
import { tools } from '@/lib/data';
import { ARTICLES_LIST, isArticleCompatibleWithTool } from '@/lib/guides-data';

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

  // 2. Dynamic long-tail guides — filter per tool to match generateStaticParams
  const guideUrls: string[] = [];
  for (const tool of tools) {
    const selectedArticles = ARTICLES_LIST
      .filter(art => isArticleCompatibleWithTool(art.title, art.category, tool))
      .slice(0, 10);
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryUrls.join('\n')}
${guideUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
