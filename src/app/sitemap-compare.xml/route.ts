import { NextResponse } from 'next/server';
import { comparisonPairs } from '@/lib/seo-content';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  // Fixed content-version date — only update this when content is substantively changed.
  // Do NOT use new Date() here; a dynamic timestamp causes Googlebot to re-crawl unchanged
  // pages every time the sitemap is fetched, wasting crawl budget.
  const now = '2026-05-27T00:00:00.000Z'; // Comparison pages launch date

  // 1. Comparison Pairs (48 entries)
  const compareUrls = comparisonPairs().map((pair) => `  <url>
    <loc>${BASE_URL}/compare/${pair.pairSlug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${compareUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
