import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ComparePage from './compare-client';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

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
      <h1 className="sr-only">Compare CAD &amp; BIM Software Side-by-Side</h1>
      <ComparePage />
    </>
  );
}
