import { pageMetadata, siteBreadcrumbLd, howToLd } from '@/lib/seo';
import type { Metadata } from 'next';
import MatchmakerClient from './matchmaker-client';

export const metadata: Metadata = pageMetadata({
  title: 'Find Your Perfect CAD Tool in 60 Seconds',
  description:
    'Answer 6 quick questions about your industry, platform, budget, team size, workflow, and CAD experience. Get a personalised shortlist of CAD tools.',
  path: '/matchmaker',
});

export default function Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Matchmaker', path: '/matchmaker' },
  ]);
  const howTo = howToLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <MatchmakerClient />
    </>
  );
}
