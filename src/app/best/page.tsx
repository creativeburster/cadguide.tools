import Link from 'next/link';
import type { Metadata } from 'next';
import { categories } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';

const YEAR = 2026;

export const metadata: Metadata = pageMetadata({
  title: `Best CAD Software in ${YEAR} — Top Tools by Category`,
  description: `Expert-curated ${YEAR} rankings: top 2D CAD, 3D modeling, BIM, CAE/CAM, EDA tools. Validated against real customer reviews.`,
  path: '/best',
});

export default function BestIndexPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Best Of', path: '/best' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {' / '}
            <span className="text-slate-700">Best Of</span>
          </nav>
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Best CAD Software in {YEAR}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Curated rankings of the top tools in each CAD category. Each
              list is rebuilt from our 235-tool catalog using expert scores,
              real customer review volume from G2/Capterra/TrustRadius, and
              feature-coverage tiebreakers.
            </p>
          </header>

          <ul className="grid sm:grid-cols-2 gap-4">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/best/${c.slug}`}
                  className="block rounded-2xl bg-white border border-slate-200 hover:border-blue-300 p-6 transition-colors"
                >
                  <h2 className="text-xl font-bold text-slate-900">
                    Best {c.name} Software
                  </h2>
                  <p className="mt-2 text-slate-600 text-sm">{c.description}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                    See the ranking →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
