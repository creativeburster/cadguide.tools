import { NextResponse } from 'next/server';
import { alternativesPagePaths } from '@/lib/seo-content';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  const now = new Date().toISOString();

  // Tool Alternatives Pages
  const alternativesUrls = alternativesPagePaths().map((alt) => {
    return `  <url>
    <loc>${BASE_URL}/alternatives/${alt.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${alternativesUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
