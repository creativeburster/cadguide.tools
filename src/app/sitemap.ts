import { MetadataRoute } from 'next';
import { tools } from '@/lib/data';
import { bestOfPaths, comparisonPairs } from '@/lib/seo-content';

const BASE_URL = 'https://cadguide.tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Top-level pages — keep priority high; these are the front doors.
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/all-tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/matchmaker`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/best`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/deals`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/sponsor`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Per-tool detail pages.
  const toolUrls: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: tool.score >= 4.5 ? 0.9 : 0.8,
  }));

  // Per-category best-of pages (7 entries) — important long-tail SEO.
  const bestOfUrls: MetadataRoute.Sitemap = bestOfPaths().map(({ slug }) => ({
    url: `${BASE_URL}/best/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Tool-vs-tool comparison pages (48 entries) — buyer-intent traffic.
  const compareUrls: MetadataRoute.Sitemap = comparisonPairs().map(({ pairSlug }) => ({
    url: `${BASE_URL}/compare/${pairSlug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...toolUrls,
    ...bestOfUrls,
    ...compareUrls,
  ];
}
