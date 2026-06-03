import Link from 'next/link';
import type { Metadata } from 'next';
import { categories } from '@/lib/data/categories';
import { featureCategories } from '@/lib/data/featureCategories';
import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';

const YEAR = 2026;

const THEMATIC_GROUPS = [
  {
    title: 'Next-Gen Tech & Automation',
    description: 'Cutting-edge workflows leveraging machine intelligence, cloud native environments, and algorithmic generation.',
    slugs: ['ai-assisted', 'cloud-collaboration', 'generative-design'],
    gradient: 'from-violet-500/10 via-transparent to-blue-500/5',
    accentColor: 'border-violet-100 hover:border-violet-300 text-violet-700 focus:ring-violet-500',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-100',
  },
  {
    title: 'Core Mechanical & Fabrication',
    description: 'Precision drafting, dimension-driven history trees, direct face manipulation, and folding/nesting fabrication solvers.',
    slugs: ['parametric-modeling', 'direct-modeling', 'sheet-metal'],
    gradient: 'from-blue-500/10 via-transparent to-cyan-500/5',
    accentColor: 'border-blue-100 hover:border-blue-300 text-blue-700 focus:ring-blue-500',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  {
    title: 'Organic Styling & Scans',
    description: 'NURBS curvature continuity, subdivision freeform modeling, high-density point clouds, and polygon mesh repair.',
    slugs: ['surface-modeling', 'subdivision-modeling', 'mesh-modeling', 'reverse-engineering'],
    gradient: 'from-emerald-500/10 via-transparent to-teal-500/5',
    accentColor: 'border-emerald-100 hover:border-emerald-300 text-emerald-700 focus:ring-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    title: 'AEC & Specialized Systems',
    description: 'Building Information Modeling (BIM), native CAD/CAM suites, finite element simulation, and piping routing pipelines.',
    slugs: ['bim-integration', 'integrated-cam', 'simulation-fea', 'piping-routing', 'rendering', 'drafting-detailing'],
    gradient: 'from-amber-500/10 via-transparent to-orange-500/5',
    accentColor: 'border-amber-100 hover:border-amber-300 text-amber-700 focus:ring-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-100',
  }
];

export const metadata: Metadata = pageMetadata({
  title: `Best CAD Software Rankings & Reviews (${YEAR})`,
  description: `Expert-curated ${YEAR} rankings: top 2D CAD, 3D modeling, BIM, simulation, and viewer tools.`,
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
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {' / '}
            <span className="text-slate-700">Best Of</span>
          </nav>
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Best CAD Software in {YEAR}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-3xl">
              Curated rankings of the top tools in each CAD category. Each
              list is rebuilt from our extensive tool catalog using expert scores,
              real customer review volume from G2/Capterra/TrustRadius, and
              feature-coverage tiebreakers.
            </p>
          </header>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Browse by Industry & Discipline
            </h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          </section>

          <section id="by-feature" className="mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Best CAD Tools by Feature & Technology Spotlights
              </h2>
              <p className="text-slate-600 leading-relaxed max-w-2xl">
                Looking for software with specific capabilities? Explore our 16 highly targeted technology spotlight directories, grouping the top tools based on core functional capabilities.
              </p>
            </div>

            {THEMATIC_GROUPS.map((group) => {
              const matchedFeatures = featureCategories.filter((f) =>
                group.slugs.includes(f.slug)
              );

              return (
                <div
                  key={group.title}
                  className={`rounded-3xl border border-slate-200/80 bg-gradient-to-br ${group.gradient} p-6 sm:p-8 space-y-6 shadow-sm`}
                >
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {group.title}
                    </h3>
                    <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-xl">
                      {group.description}
                    </p>
                  </div>

                  <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {matchedFeatures.map((feat) => (
                      <li key={feat.id}>
                        <Link
                          href={`/best/feature/${feat.slug}`}
                          className={`group block h-full rounded-2xl bg-white/90 backdrop-blur-sm border p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${group.accentColor}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {feat.name}
                            </h4>
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border ${group.badgeBg}`}>
                              Spotlight
                            </span>
                          </div>
                          <p className="mt-2 text-slate-600 text-xs leading-relaxed">
                            {feat.description}
                          </p>
                          <span className="mt-4 inline-flex items-center text-xs font-bold text-blue-600 gap-1">
                            Explore dynamic guide 
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </>
  );
}
