import { NextResponse } from 'next/server';
import { TOOLBOX_DATA } from '@/lib/toolbox-data';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  const now = new Date().toISOString();

  // 1. Toolbox Main Index Page
  const mainToolboxUrl = `  <url>
    <loc>${BASE_URL}/toolbox</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>`;

  // 2. All released toolbox utility pages (calculators, converters, troubleshooters, cheatsheets)
  const activeTools = TOOLBOX_DATA.filter((t) => t.status === 'released');
  const toolboxUrls = activeTools.map((tool) => {
    const priority = tool.category === 'cheatsheet' ? '0.85' : '0.80';
    return `  <url>
    <loc>${BASE_URL}/toolbox/${tool.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainToolboxUrl}
${toolboxUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
