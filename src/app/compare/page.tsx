import Link from 'next/link';
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

  // Server-rendered static index used as the Suspense fallback. CompareContent
  // reads URL search params and renders client-side only, so without this the
  // static HTML would contain a bare "Loading comparison..." placeholder.
  const staticIndex = (
    <main className="max-w-[1200px] mx-auto px-4 py-12 min-h-screen">
      <p className="text-slate-600 text-lg max-w-3xl mb-8">
        Head-to-head comparisons of CAD, BIM, CAE/CAM, and EDA tools covering pricing, platforms,
        geometry kernels, file formats, pros, and cons.
      </p>
      <h2 className="text-xl font-bold text-slate-900 mb-4">All comparisons ({allPairs.length})</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {allPairs.map((p) => (
          <li key={p.pairSlug}>
            <Link href={`/compare/${p.pairSlug}`} className="text-blue-700 hover:underline">
              {p.a.name} vs {p.b.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <h1 className="sr-only">Compare CAD &amp; BIM Software Side-by-Side</h1>
      <ComparePage initialEditorPicks={editorPicks} initialAllPairs={allPairs} fallback={staticIndex} />
    </>
  );
}
