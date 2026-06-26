import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import GuidesClient from './guides-client';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'CAD Professional Guides & IT Deployment';
  const description = 'Deep-dive technical guides for enterprise CAD, BIM, CAE, and EDA software. Fix fatal errors, optimize hardware performance, enforce printing standards, and migrate concurrent licensing.';

  return {
    ...pageMetadata({
      title,
      description,
      path: '/guides',
    }),
    robots: { index: false, follow: true },
  };
}

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
