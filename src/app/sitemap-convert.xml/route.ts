export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { getAllConversionSlugs } from '@/lib/converter-data';

export async function GET() {
  const baseUrl = 'https://cadguide.tools';
  const slugs = getAllConversionSlugs();
  // Fixed publication date to prevent invalid crawl budget churn
  const fixedDate = '2026-10-26T00:00:00.000Z';

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. 3D Conversion Hub URL
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/convert</loc>\n`;
  xml += `    <lastmod>${fixedDate}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>0.90</priority>\n';
  xml += '  </url>\n';

  // 2. Canonical /convert/[pair] Pages (47 pairs)
  slugs.forEach((slug) => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/convert/${slug}</loc>\n`;
    xml += `    <lastmod>${fixedDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.80</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
