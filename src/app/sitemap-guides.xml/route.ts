import { NextResponse } from 'next/server';
import { tools } from '@/lib/data';
import { ARTICLES_LIST, isArticleCompatibleWithTool } from '@/lib/guides-data';
import { PROCUREMENT_LIST } from '@/lib/procurement-data';
import { STANDARDS_LIST, DRAFTING_TOOLS } from '@/lib/standards-data';
import { LICENSING_TOOLS } from '@/lib/licensing-data';
import { KERNEL_TOOLS } from '@/lib/kernel-data';

const BASE_URL = 'https://cadguide.tools';

export async function GET() {
  const now = new Date().toISOString();

  // 1. Core 8 Arteries Landing Pages
  const categoryKeys = ['troubleshooting', 'performance', 'printing', 'standards', 'deployment', 'migration', 'procurement', 'manufacturing'];
  const categoryUrls = categoryKeys.map((cat) => `  <url>
    <loc>${BASE_URL}/guides/${cat}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>`);

  // 2. Dynamic long-tail guides — filter per tool to match generateStaticParams
  const guideUrls: string[] = [];
  for (const tool of tools) {
    const selectedArticles = ARTICLES_LIST
      .filter(art => isArticleCompatibleWithTool(art.title, art.category, tool))
      .slice(0, 20);
    for (const art of selectedArticles) {
      const artIndex = art.id.split('-').pop();
      guideUrls.push(`  <url>
    <loc>${BASE_URL}/guides/${tool.slug}-${art.category}-${artIndex}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.70</priority>
  </url>`);
    }
  }

  // 3. Industry Procurement Pages (20 entries)
  const industryUrls = PROCUREMENT_LIST.map((pro) => `  <url>
    <loc>${BASE_URL}/guides/industry-${pro.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>`);

  // 4. Drafting Standards Pages (200 entries)
  const standardsUrls: string[] = [];
  for (const std of STANDARDS_LIST) {
    for (const tool of DRAFTING_TOOLS) {
      standardsUrls.push(`  <url>
    <loc>${BASE_URL}/guides/standards-${std.id}-${tool}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>`);
    }
  }

  // 5. Licensing Shield Pages (30 entries)
  const shieldUrls = LICENSING_TOOLS.map((tool) => `  <url>
    <loc>${BASE_URL}/guides/shield-${tool}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>`);

  // 6. Geometry Kernel Conversion Pages (100 entries)
  const kernelUrls: string[] = [];
  for (const src of KERNEL_TOOLS) {
    for (const tgt of KERNEL_TOOLS) {
      kernelUrls.push(`  <url>
    <loc>${BASE_URL}/guides/kernel-${src.slug}-${tgt.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryUrls.join('\n')}
${guideUrls.join('\n')}
${industryUrls.join('\n')}
${standardsUrls.join('\n')}
${shieldUrls.join('\n')}
${kernelUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
