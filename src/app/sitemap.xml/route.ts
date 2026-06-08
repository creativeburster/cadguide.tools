import { NextResponse } from 'next/server';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  const sitemaps = [
    `${BASE_URL}/sitemap-main.xml`,
    `${BASE_URL}/sitemap-tools.xml`,
    `${BASE_URL}/sitemap-toolbox.xml`,
    `${BASE_URL}/sitemap-compare.xml`,
    `${BASE_URL}/sitemap-guides.xml`,
    `${BASE_URL}/sitemap-alternatives.xml`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps
    .map(
      (url) => `  <sitemap>
    <loc>${url}</loc>
  </sitemap>`
    )
    .join('\n')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
