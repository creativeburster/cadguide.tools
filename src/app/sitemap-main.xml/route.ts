import { NextResponse } from 'next/server';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  const now = new Date().toISOString();

  const pages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/tools', priority: 0.95, changefreq: 'daily' },
    { url: '/all-tools', priority: 0.7, changefreq: 'weekly' },
    { url: '/matchmaker', priority: 0.85, changefreq: 'monthly' },
    { url: '/compare', priority: 0.85, changefreq: 'monthly' },
    { url: '/best', priority: 0.85, changefreq: 'monthly' },
    { url: '/alternatives', priority: 0.8, changefreq: 'monthly' },
    { url: '/platforms', priority: 0.8, changefreq: 'monthly' },
    { url: '/file-formats', priority: 0.8, changefreq: 'monthly' },
    { url: '/for', priority: 0.8, changefreq: 'monthly' },
    { url: '/sectors', priority: 0.8, changefreq: 'monthly' },
    { url: '/free', priority: 0.9, changefreq: 'monthly' },
    { url: '/open-source', priority: 0.9, changefreq: 'monthly' },
    { url: '/pricing', priority: 0.9, changefreq: 'monthly' },
    { url: '/guides', priority: 0.95, changefreq: 'daily' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (p) => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(2)}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
