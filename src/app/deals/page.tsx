import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import DealsClient from './deals-client';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'CAD Software Deals, Discounts, and Coupons',
    description:
      'Current discounts, education plans, free trials, and student offers for CAD, BIM, CAE/CAM, and EDA software. Updated regularly.',
    path: '/deals',
  }),
  // Section hidden per owner decision (2026-08): keep the page live for
  // direct URLs but remove it from the search index.
  robots: { index: false, follow: false },
};

export default function Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Deals', path: '/deals' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <DealsClient />
    </>
  );
}
