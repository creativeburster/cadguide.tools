import { MetadataRoute } from 'next';
import { tools } from '@/lib/data';
import { featureCategories } from '@/lib/data/featureCategories';
import {
  bestOfPaths,
  comparisonPairs,
  alternativesPagePaths,
  platformPagePaths,
  formatPagePaths,
  personaPagePaths,
  sectorPagePaths,
} from '@/lib/seo-content';

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
    { url: `${BASE_URL}/alternatives`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/platforms`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/file-formats`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/for`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/sectors`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/free`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/open-source`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // /deals intentionally omitted — page is noindex,follow until real partner deals are wired.
  ];

  // Per-tool detail pages.
  const toolUrls: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: tool.score >= 4.5 ? 0.9 : 0.8,
  }));

  // Per-category best-of pages (7 entries).
  const bestOfUrls: MetadataRoute.Sitemap = bestOfPaths().map(({ slug }) => ({
    url: `${BASE_URL}/best/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Feature spotlight pages (16 entries).
  const featureUrls: MetadataRoute.Sitemap = featureCategories.map((f) => ({
    url: `${BASE_URL}/best/feature/${f.slug}`,
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

  // Per-tool alternatives pages (one per tool, 235 entries) — long-tail
  // "<tool> alternatives" keyword targeting.
  const alternativesUrls: MetadataRoute.Sitemap = alternativesPagePaths().map(
    ({ slug }) => ({
      url: `${BASE_URL}/alternatives/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }),
  );

  // Platform / OS pages (mac, linux, web, ios).
  const platformUrls: MetadataRoute.Sitemap = platformPagePaths().map(
    ({ slug }) => ({
      url: `${BASE_URL}/platforms/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }),
  );

  // File-format pages (dwg, step, stl, …).
  const formatUrls: MetadataRoute.Sitemap = formatPagePaths().map(({ slug }) => ({
    url: `${BASE_URL}/file-formats/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Persona / use-case pages (architects, students, ...).
  const personaUrls: MetadataRoute.Sitemap = personaPagePaths().map(
    ({ slug }) => ({
      url: `${BASE_URL}/for/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }),
  );

  // Sector / Industry vertical pages (16 entries).
  const sectorUrls: MetadataRoute.Sitemap = sectorPagePaths().map(({ slug }) => ({
    url: `${BASE_URL}/sectors/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...toolUrls,
    ...bestOfUrls,
    ...featureUrls,
    ...compareUrls,
    ...alternativesUrls,
    ...platformUrls,
    ...formatUrls,
    ...personaUrls,
    ...sectorUrls,
  ];
}
