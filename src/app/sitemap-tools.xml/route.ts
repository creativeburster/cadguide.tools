export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { tools } from '@/lib/data';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  // Fixed content-version date — only update this when content is substantively changed.
  // Do NOT use new Date() here; a dynamic timestamp causes Googlebot to re-crawl unchanged
  // pages every time the sitemap is fetched, wasting crawl budget.
  const now = '2026-05-23T00:00:00.000Z'; // Tool detail pages launch date

  // Tool Detail Pages
  const toolUrls = tools.map((tool) => {
    const priority = tool.score >= 4.5 ? 0.9 : 0.8;
    return `  <url>
    <loc>${BASE_URL}/tools/${tool.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${toolUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
