import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import GuidesClient from './guides-client';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Professional Guides — Troubleshooting, Hardware & Deployment',
  description:
    'Deep-dive technical guides for enterprise CAD, BIM, CAE, and EDA software. Fix fatal errors, optimize hardware performance, enforce printing standards, and migrate concurrent licensing.',
  path: '/guides',
});

export default function Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Professional Guides', path: '/guides' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <GuidesClient />
    </>
  );
}
