import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ComparePage from './compare-client';
import { editorPickPairs, comparisonPairs } from '@/lib/seo-content';

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

  const editorPicks = editorPickPairs();
  const allPairs = comparisonPairs();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <h1 className="sr-only">Compare CAD &amp; BIM Software Side-by-Side</h1>
      <ComparePage initialEditorPicks={editorPicks} initialAllPairs={allPairs} />
    </>
  );
}
