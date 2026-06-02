import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import DealsClient from './deals-client';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'CAD Software Deals, Discounts, and Coupons',
    description:
      'Current discounts, education plans, free trials, and student offers for CAD, BIM, CAE/CAM, and EDA software. Updated regularly.',
    path: '/deals',
  }),
  // Verified authentic CAD deals are now wired up; allow Google to index
  // the page and follow outgoing links.
  robots: { index: true, follow: true },
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
