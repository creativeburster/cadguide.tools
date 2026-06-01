import { NextResponse } from 'next/server';
import { featureCategories } from '@/lib/data/featureCategories';
import { PRICING_PAGES } from '@/lib/pricing-licensing-content';
import {
  bestOfPaths,
  comparisonPairs,
  platformPagePaths,
  formatPagePaths,
  personaPagePaths,
  sectorPagePaths,
} from '@/lib/seo-content';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  const now = new Date().toISOString();

  // 1. Comparison Pairs (48 entries)
  const compareUrls = comparisonPairs().map((pair) => `  <url>
    <loc>${BASE_URL}/compare/${pair.pairSlug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>`);

  // 2. Best-of Categories (7 entries)
  const bestOfUrls = bestOfPaths().map((p) => `  <url>
    <loc>${BASE_URL}/best/${p.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`);

  // 3. Feature Spotlight Pages (16 entries)
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
${compareUrls.join('\n')}
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
