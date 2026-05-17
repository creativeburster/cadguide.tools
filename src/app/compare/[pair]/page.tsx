import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  comparisonPairs,
  parseComparisonPair,
} from '@/lib/seo-content';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import type { Tool } from '@/lib/data';
import { categories } from '@/lib/data';
import { ToolLogo } from '@/components/tool-logo';

export const dynamicParams = false;

export function generateStaticParams() {
  return comparisonPairs().map(({ pairSlug }) => ({ pair: pairSlug }));
}

const YEAR = 2026;

function pairTitle(a: Tool, b: Tool): string {
  return `${a.name} vs ${b.name}: ${YEAR} Comparison`;
}

function pairDescription(a: Tool, b: Tool): string {
  const aPrice =
    a.starting_price > 0
      ? `from $${a.starting_price}`
      : a.pricing_type.toLowerCase();
  const bPrice =
    b.starting_price > 0
      ? `from $${b.starting_price}`
      : b.pricing_type.toLowerCase();
  return `${a.name} (${aPrice}) vs ${b.name} (${bPrice}). Side-by-side comparison of pricing, platforms, file formats, ratings, and use cases. Pick the right CAD tool for your team in ${YEAR}.`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ pair: string }> },
): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parseComparisonPair(pair);
  if (!parsed) return {};
  const { a, b } = parsed;
  return pageMetadata({
    title: pairTitle(a, b),
    description: pairDescription(a, b),
    path: `/compare/${pair}`,
    ogType: 'article',
  });
}

function pricingCell(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `$${t.starting_price} (${t.pricing_type})`;
  return t.pricing_type;
}

function externalReviewLine(t: Tool): string {
  if (!t.external_ratings || t.external_ratings.length === 0) return '—';
  const total = t.external_ratings.reduce(
    (acc, r) => acc + (r.count ?? 0),
    0,
  );
  const sources = t.external_ratings.map((r) => r.source).join(' / ');
  return `${total.toLocaleString()} reviews on ${sources}`;
}

function decisionText(a: Tool, b: Tool): { pickA: string; pickB: string } {
  const aFree =
    a.pricing_type === 'Free' || a.pricing_type === 'Open Source';
  const bFree =
    b.pricing_type === 'Free' || b.pricing_type === 'Open Source';
  const aIsCloud = a.deployment_options?.includes('Cloud') ?? false;
  const bIsCloud = b.deployment_options?.includes('Cloud') ?? false;
  const aPriceDelta = a.starting_price - b.starting_price;

  const pickAReasons: string[] = [];
  const pickBReasons: string[] = [];

  if (a.score > b.score)
    pickAReasons.push(`higher expert score (${a.score.toFixed(1)}/5 vs ${b.score.toFixed(1)}/5)`);
  else if (b.score > a.score)
    pickBReasons.push(`higher expert score (${b.score.toFixed(1)}/5 vs ${a.score.toFixed(1)}/5)`);

  if (aFree && !bFree) pickAReasons.push('free / open-source');
  if (bFree && !aFree) pickBReasons.push('free / open-source');

  if (!aFree && !bFree) {
    if (aPriceDelta < 0)
      pickAReasons.push(`cheaper starting price ($${a.starting_price} vs $${b.starting_price})`);
    else if (aPriceDelta > 0)
      pickBReasons.push(`cheaper starting price ($${b.starting_price} vs $${a.starting_price})`);
  }

  if (aIsCloud && !bIsCloud) pickAReasons.push('runs in the cloud');
  if (bIsCloud && !aIsCloud) pickBReasons.push('runs in the cloud');

  if (
    a.platforms.length > b.platforms.length &&
    a.platforms.includes('macOS') &&
    !b.platforms.includes('macOS')
  )
    pickAReasons.push('macOS support');
  if (
    b.platforms.length > a.platforms.length &&
    b.platforms.includes('macOS') &&
    !a.platforms.includes('macOS')
  )
    pickBReasons.push('macOS support');

  if (
    a.industries &&
    b.industries &&
    a.industries.length > b.industries.length
  )
    pickAReasons.push('broader industry coverage');
  else if (
    a.industries &&
    b.industries &&
    b.industries.length > a.industries.length
  )
    pickBReasons.push('broader industry coverage');

  if (a.api_sdk?.has_api && !b.api_sdk?.has_api)
    pickAReasons.push('public API for automation');
  if (b.api_sdk?.has_api && !a.api_sdk?.has_api)
    pickBReasons.push('public API for automation');

  if (pickAReasons.length === 0)
    pickAReasons.push('established workflow familiarity');
  if (pickBReasons.length === 0)
    pickBReasons.push('established workflow familiarity');

  return {
    pickA: pickAReasons.slice(0, 3).join('; '),
    pickB: pickBReasons.slice(0, 3).join('; '),
  };
}

function articleLd(a: Tool, b: Tool, pairSlug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pairTitle(a, b),
    description: pairDescription(a, b),
    mainEntityOfPage: `${SITE_URL}/compare/${pairSlug}`,
    publisher: {
      '@type': 'Organization',
      name: 'CADGuide.tools',
      url: SITE_URL,
    },
    about: [
      {
        '@type': 'SoftwareApplication',
        name: a.name,
        url: `${SITE_URL}/tools/${a.slug}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: b.name,
        url: `${SITE_URL}/tools/${b.slug}`,
      },
    ],
    datePublished: '2026-01-01',
    dateModified: '2026-05-15',
  };
}

interface RowSpec {
  label: string;
  render: (t: Tool) => string;
}

const ROWS: RowSpec[] = [
  { label: 'Expert score', render: (t) => `★ ${t.score.toFixed(1)}/5` },
  { label: 'Pricing', render: pricingCell },
  { label: 'Platforms', render: (t) => t.platforms.join(', ') || '—' },
  {
    label: 'External reviews',
    render: externalReviewLine,
  },
  {
    label: 'Free trial',
    render: (t) =>
      t.free_trial_days && t.free_trial_days > 0
        ? `${t.free_trial_days} days`
        : t.pricing_type === 'Free' || t.pricing_type === 'Open Source'
          ? 'Always free'
          : '—',
  },
  {
    label: 'File formats',
    render: (t) => {
      const ins = t.file_formats_in?.slice(0, 6).join(', ');
      if (!ins) return '—';
      return ins + (t.file_formats_in!.length > 6 ? ', …' : '');
    },
  },
  {
    label: 'Deployment',
    render: (t) =>
      t.deployment_options?.length ? t.deployment_options.join(', ') : '—',
  },
  {
    label: 'API / SDK',
    render: (t) =>
      t.api_sdk?.has_api
        ? `Yes${t.api_sdk.api_type ? ` (${t.api_sdk.api_type})` : ''}`
        : 'No',
  },
  {
    label: 'Industries',
    render: (t) => t.industries?.slice(0, 4).join(', ') || '—',
  },
  {
    label: 'Strengths',
    render: (t) => t.pros?.slice(0, 3).join(' · ') || '—',
  },
  {
    label: 'Limitations',
    render: (t) => t.cons?.slice(0, 3).join(' · ') || '—',
  },
];

export default async function ComparePairPage(
  { params }: { params: Promise<{ pair: string }> },
) {
  const { pair } = await params;
  const parsed = parseComparisonPair(pair);
  if (!parsed) notFound();
  const { a, b } = parsed;
  const decision = decisionText(a, b);
  const catA = categories.find((c) => c.id === a.category_id);
  const catB = categories.find((c) => c.id === b.category_id);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: `${a.name} vs ${b.name}`, path: `/compare/${pair}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleLd(a, b, pair)),
        }}
      />

      <main className="min-h-screen bg-slate-50">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {' / '}
            <Link href="/compare" className="hover:underline">
              Compare
            </Link>
            {' / '}
            <span className="text-slate-700">
              {a.name} vs {b.name}
            </span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {pairTitle(a, b)}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Side-by-side comparison of <strong>{a.name}</strong>{' '}
              {catA?.name ? `(${catA.name})` : ''} and{' '}
              <strong>{b.name}</strong>{' '}
              {catB?.name ? `(${catB.name})` : ''}: pricing, platforms,
              ratings, supported file formats, deployment options, and the
              specific strengths each tool brings to a CAD team in {YEAR}.
            </p>
          </header>

          <section
            aria-labelledby="hero-cards"
            id="hero-cards"
            className="grid sm:grid-cols-2 gap-4 mb-10"
          >
            {[a, b].map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="rounded-2xl bg-white border border-slate-200 hover:border-blue-300 p-6 transition-colors"
              >
                <div className="flex items-center gap-4 mb-3">
                  <ToolLogo
                    slug={t.slug}
                    src={t.logo_url}
                    websiteUrl={t.official_url}
                    name={t.name}
                    className="w-12 h-12 rounded-lg flex-shrink-0"
                  />
                  <div>
                    <div className="text-lg font-bold text-slate-900">
                      {t.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {pricingCell(t)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-amber-600 font-semibold">
                  ★ {t.score.toFixed(1)}/5 expert score
                </div>
                <p className="mt-3 text-sm text-slate-700">{t.short_desc}</p>
              </Link>
            ))}
          </section>

          <section className="mb-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <caption className="caption-top text-left text-sm font-semibold uppercase tracking-wide text-slate-500 pb-3">
                Feature-by-feature comparison
              </caption>
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th
                    scope="col"
                    className="py-3 pr-4 text-sm font-semibold text-slate-700 w-1/4"
                  >
                    &nbsp;
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-sm font-semibold text-slate-900"
                  >
                    {a.name}
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-sm font-semibold text-slate-900"
                  >
                    {b.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-slate-100 align-top"
                  >
                    <th
                      scope="row"
                      className="py-3 pr-4 text-sm font-medium text-slate-600 text-left"
                    >
                      {row.label}
                    </th>
                    <td className="py-3 px-4 text-sm text-slate-800 align-top">
                      {row.render(a)}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-800 align-top">
                      {row.render(b)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section
            aria-labelledby="decision-heading"
            className="mb-10 grid sm:grid-cols-2 gap-4"
          >
            <h2 id="decision-heading" className="sr-only">
              Which one to pick
            </h2>
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <div className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-2">
                Pick {a.name} if you need
              </div>
              <p className="text-slate-800 leading-relaxed">{decision.pickA}.</p>
              <Link
                href={`/tools/${a.slug}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Read the full {a.name} review →
              </Link>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <div className="text-sm font-semibold uppercase tracking-wide text-purple-600 mb-2">
                Pick {b.name} if you need
              </div>
              <p className="text-slate-800 leading-relaxed">{decision.pickB}.</p>
              <Link
                href={`/tools/${b.slug}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                Read the full {b.name} review →
              </Link>
            </div>
          </section>

          <section className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Want a personalised shortlist?
            </h2>
            <p className="text-slate-700 mb-4">
              Compare more than two tools side-by-side, or answer a short
              quiz and let our matchmaker filter the 235-tool catalog for
              your team.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/compare"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"
              >
                Custom side-by-side →
              </Link>
              <Link
                href="/matchmaker"
                className="inline-flex items-center px-4 py-2 bg-white border border-blue-200 hover:border-blue-400 text-blue-700 text-sm font-semibold rounded-lg"
              >
                Try the Matchmaker →
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
