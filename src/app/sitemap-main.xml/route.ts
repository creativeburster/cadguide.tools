import { NextResponse } from 'next/server';
import { featureCategories } from '@/lib/data/featureCategories';
import { PRICING_PAGES } from '@/lib/pricing-licensing-content';
import {
  bestOfPaths,
  platformPagePaths,
  formatPagePaths,
  personaPagePaths,
  sectorPagePaths,
} from '@/lib/seo-content';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  // Fixed content-version date — only update this when content is substantively changed.
  // Do NOT use new Date() here; a dynamic timestamp causes Googlebot to re-crawl unchanged
  // pages every time the sitemap is fetched, wasting crawl budget.
  const now = '2026-06-16T00:00:00.000Z';

  // 1. Core Hub Landing Pages
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
    { url: '/deals', priority: 0.90, changefreq: 'daily' },
    { url: '/guides', priority: 0.95, changefreq: 'daily' },
    { url: '/about', priority: 0.50, changefreq: 'monthly' },
    { url: '/contact', priority: 0.50, changefreq: 'monthly' },
    { url: '/privacy', priority: 0.30, changefreq: 'monthly' },
    { url: '/affiliate-disclosure', priority: 0.30, changefreq: 'monthly' },
  ];

  const mainHubUrls = pages.map(
    (p) => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(2)}</priority>
  </url>`
  );

  // 2. Best-of Categories
  const bestOfUrls = bestOfPaths().map((p) => `  <url>
    <loc>${BASE_URL}/best/${p.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`);

  // 3. Feature Spotlight Pages
  const featureUrls = featureCategories.map((f) => `  <url>
    <loc>${BASE_URL}/best/feature/${f.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`);

  // 4. Platform Pages
  const platformUrls = platformPagePaths().map((p) => `  <url>
    <loc>${BASE_URL}/platforms/${p.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>`);

  // 5. File Formats
  const formatUrls = formatPagePaths().map((f) => `  <url>
    <loc>${BASE_URL}/file-formats/${f.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>`);

  // 6. Persona Use cases
  const personaUrls = personaPagePaths().map((p) => `  <url>
    <loc>${BASE_URL}/for/${p.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>`);

  // 7. Sector verticals
  const sectorUrls = sectorPagePaths().map((s) => `  <url>
    <loc>${BASE_URL}/sectors/${s.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>`);

  // 8. Pricing pages (excl. free/open-source)
  const pricingUrls = Object.keys(PRICING_PAGES)
    .filter((slug) => slug !== 'free' && slug !== 'open-source')
    .map((slug) => `  <url>
    <loc>${BASE_URL}/pricing/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainHubUrls.join('\n')}
${bestOfUrls.join('\n')}
${featureUrls.join('\n')}
${platformUrls.join('\n')}
${formatUrls.join('\n')}
${personaUrls.join('\n')}
${sectorUrls.join('\n')}
${pricingUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
