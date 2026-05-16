import { MetadataRoute } from 'next';
import { tools, categories } from '@/lib/data';

export const dynamic = 'force-static';

const BASE_URL = 'https://cadtools.cc';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Top-level pages — the audit flagged that /compare, /deals, /sponsor,
  // /about, /contact, /privacy, /all-tools were missing from the XML
  // sitemap. They're all indexable now, so they belong here.
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/all-tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/matchmaker`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/deals`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/sponsor`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // One URL per category-filtered tools listing. These aren't separate
  // routes — they're just `/tools?category=cX` — but linking them from
  // the sitemap lets Google understand the facet hierarchy without us
  // having to invent a `/category/<slug>` page tree.
  const categoryFacetUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/tools?category=${cat.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // One URL per tool detail page. Priority slightly higher for higher-
  // scoring tools so Google understands which products we consider the
  // most authoritative entries in the catalog.
  const toolUrls: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: tool.score >= 4.5 ? 0.9 : 0.8,
  }));

  return [...staticPages, ...categoryFacetUrls, ...toolUrls];
}
