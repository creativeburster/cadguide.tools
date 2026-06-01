import { NextResponse } from 'next/server';
import { tools } from '@/lib/data';
import { alternativesPagePaths } from '@/lib/seo-content';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  const now = new Date().toISOString();

  // 1. Tool Detail Pages
  const toolUrls = tools.map((tool) => {
    const priority = tool.score >= 4.5 ? 0.9 : 0.8;
    return `  <url>
    <loc>${BASE_URL}/tools/${tool.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>`;
  });

  // 2. Tool Alternatives Pages
  const alternativesUrls = alternativesPagePaths().map((alt) => {
    return `  <url>
    <loc>${BASE_URL}/alternatives/${alt.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${toolUrls.join('\n')}
${alternativesUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
