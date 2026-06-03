import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ComparePage from './compare-client';

export const metadata: Metadata = pageMetadata({
  title: 'Compare CAD & BIM Software Side-by-Side',
  description:
    'Compare up to 4 CAD, BIM, CAE/CAM, or EDA tools side by side: pricing, platforms, geometry kernel, file formats, ratings, pros, and cons.',
  path: '/compare',
});

export default function Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <ComparePage />
    </>
  );
}
