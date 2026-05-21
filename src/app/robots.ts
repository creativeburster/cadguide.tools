import { MetadataRoute } from 'next';

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/deals'],
    },
    sitemap: 'https://cadguide.tools/sitemap.xml',
    host: 'https://cadguide.tools',
  };
}
