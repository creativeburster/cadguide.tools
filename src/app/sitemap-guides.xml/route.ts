export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getAllMarkdownGuides } from '@/lib/guides-markdown';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  const now = new Date().toISOString();

  // 1. Guides hub page
  const hubUrl = `  <url>
    <loc>${BASE_URL}/guides</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>`;

  // 2. Individual guide articles
  const guides = getAllMarkdownGuides();
  const guideUrls = guides.map(g => {
    // Validate date format (YYYY-MM-DD); fall back to fixed date if invalid
    const dateStr = /^\d{4}-\d{2}-\d{2}$/.test(g.date) ? g.date : '2025-06-15';
    return `  <url>
    <loc>${BASE_URL}/guides/${g.slug}</loc>
    <lastmod>${dateStr}T00:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hubUrl}
${guideUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
