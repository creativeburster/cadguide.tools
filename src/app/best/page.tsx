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

          <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Best CAD Tools by Feature & Technology
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Looking for software with specific capabilities? Explore our technology spotlight pages, grouping the top tools in our directory based on core functional features.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4">
              <li>
                <Link
                  href="/best/feature/ai-assisted"
                  className="block rounded-2xl bg-white border border-slate-200 hover:border-blue-300 p-6 transition-colors"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    AI-Assisted CAD
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm">
                    Automate layouts, optimize topologies, and speed up drafting with AI-assisted software.
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                    See AI rankings →
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/best/feature/cloud-collaboration"
                  className="block rounded-2xl bg-white border border-slate-200 hover:border-blue-300 p-6 transition-colors"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    Cloud Collaboration CAD
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm">
                    Real-time multi-user co-authoring, SaaS databases, and zero-install browser modeling.
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                    See collaboration rankings →
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/best/feature/parametric-modeling"
                  className="block rounded-2xl bg-white border border-slate-200 hover:border-blue-300 p-6 transition-colors"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    Parametric Modeling CAD
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm">
                    History trees, dimension-driven constraints, and dynamic assembly math for mechanical design.
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                    See parametric rankings →
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/best/feature/rendering"
                  className="block rounded-2xl bg-white border border-slate-200 hover:border-blue-300 p-6 transition-colors"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    High-End Rendering CAD
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm">
                    Built-in GPU ray tracing, physically-based materials, and photorealistic spatial presentations.
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                    See rendering rankings →
                  </span>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
