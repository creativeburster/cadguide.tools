import { NextResponse } from 'next/server';
import { getAllConversionSlugs } from '@/lib/converter-data';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = 'https://cadguide.tools';
  const slugs = getAllConversionSlugs();
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Hub URL
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/convert</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>0.9</priority>\n';
  xml += '  </url>\n';

  // 28 Pairs URLs
  slugs.forEach((slug) => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/convert/${slug}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
  });

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
