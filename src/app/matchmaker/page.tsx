import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import MatchmakerClient from './matchmaker-client';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Software Matchmaker — Find Your Perfect Tool in 60 Seconds',
  description:
    'Answer 6 quick questions about your industry, platform, budget, team size, workflow, and CAD experience. Get a personalised shortlist of CAD tools.',
  path: '/matchmaker',
});

export default function Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Matchmaker', path: '/matchmaker' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <MatchmakerClient />
    </>
  );
}
