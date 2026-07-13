import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  findCategoryBySlug,
  bestOfPaths,
  rankToolsForCategory,
  BEST_OF_LIMIT,
} from '@/lib/seo-content';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import type { Tool, Category } from '@/lib/data';
import { ToolLogo } from '@/components/tool-logo';

export const dynamicParams = false;

export function generateStaticParams() {
  return bestOfPaths().map(({ slug }) => ({ slug }));
}

const YEAR = 2026;
const BUILD_DATE = new Date().toISOString().slice(0, 10);

function pageTitle(category: Category): string {
  return `Best ${category.name} Software in ${YEAR}: Top ${BEST_OF_LIMIT} Tools Compared`;
}

function pageDescription(category: Category): string {
  return `${BEST_OF_LIMIT} top ${category.name} tools for ${YEAR}. Ranked by expert score and real reviews. Pricing, platforms, and best-for guidance included.`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const cat = findCategoryBySlug(slug);
  if (!cat) return {};
  return pageMetadata({
    title: pageTitle(cat),
    description: pageDescription(cat),
    path: `/best/${cat.slug}`,
    ogType: 'article',
  });
}

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

function bestForLine(t: Tool): string {
  const industries = (t.industries ?? []).slice(0, 2);
  const scales = (t.user_scales ?? []).slice(0, 1);
  const parts: string[] = [];
  if (industries.length > 0) parts.push(industries.join(' & ') + ' teams');
  if (scales.length > 0) parts.push(scales[0] + ' organisations');
  if (parts.length === 0) return 'Generalist CAD users';
  return parts.join(', ');
}

function whyPickedLine(t: Tool): string {
  const bits: string[] = [];
  if (t.external_ratings && t.external_ratings.length > 0) {
    const totalReviews = t.external_ratings.reduce(
      (acc, r) => acc + (r.count ?? 0),
      0,
    );
    const sources = t.external_ratings.map((r) => r.source).join(' / ');
    bits.push(`${totalReviews.toLocaleString()} verified reviews on ${sources}`);
  }
  if (t.score >= 4.7) bits.push('top-tier expert score');
  else if (t.score >= 4.5) bits.push('strong expert score');
  if (t.api_sdk?.has_api) bits.push('robust API & SDK');
  if (t.integrations && t.integrations.length >= 4) bits.push('deep ecosystem');
  if (t.deployment_options && t.deployment_options.includes('Cloud'))
    bits.push('cloud-ready');
  if (bits.length === 0) {
    if (t.platforms.length >= 2) bits.push('multi-platform availability');
    if (t.pros && t.pros.length > 0) bits.push(t.pros[0].toLowerCase());
  }
  return bits.slice(0, 3).join(', ');
}

function itemListLd(category: Category, ranked: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle(category),
    description: pageDescription(category),
    numberOfItems: ranked.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: ranked.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/tools/${t.slug}`,
      name: t.name,
    })),
  };
}

function articleLd(category: Category) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle(category),
    description: pageDescription(category),
    mainEntityOfPage: `${SITE_URL}/best/${category.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'CADGuide.tools',
      url: SITE_URL,
    },
    datePublished: '2026-01-01',
    dateModified: BUILD_DATE,
  };
}

export default async function BestOfPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);
  if (!category) notFound();

  const ranked = rankToolsForCategory(category);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Best Of', path: '/best' },
    { name: category.name, path: `/best/${category.slug}` },
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
          __html: JSON.stringify(itemListLd(category, ranked)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleLd(category)),
        }}
      />

      <main className="min-h-screen bg-slate-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {' / '}
            <Link href="/tools" className="hover:underline">
              Tools
            </Link>
            {' / '}
            <span className="text-slate-700">Best {category.name}</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {pageTitle(category)}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              The {BEST_OF_LIMIT} highest-rated {category.name.toLowerCase()}{' '}
              tools in our catalog as of {YEAR}, ranked by our expert score
              (weighted with real customer review counts from G2, Capterra,
              and TrustRadius where available), feature depth, and metadata
              completeness. Every tool here is also fully profiled in the{' '}
              <Link
                href={`/tools?category=${category.id}`}
                className="text-blue-600 hover:underline"
              >
                {category.name} directory
              </Link>
              .
            </p>
          </header>

          <section
            aria-labelledby="methodology-heading"
            className="rounded-2xl bg-white border border-slate-200 p-6 mb-10"
          >
            <h2
              id="methodology-heading"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3"
            >
              Methodology
            </h2>
            <ul className="text-sm text-slate-700 space-y-2 leading-relaxed">
              <li>
                <span className="font-semibold">Expert score</span> — our
                editor rating after hands-on review, pricing audit, and
                spec-sheet validation.
              </li>
              <li>
                <span className="font-semibold">External reviews</span> —
                summed customer review counts from G2 / Capterra /
                TrustRadius / Software Advice / GetApp. Tools with verified
                public reviews rank ahead of equally-scored tools without.
              </li>
              <li>
                <span className="font-semibold">Completeness tiebreaker</span>{' '}
                — tools with documented file format support, integrations,
                deployment options, API/SDK, and compliance posture rank
                ahead of stubs.
              </li>
            </ul>
          </section>

          <ol className="space-y-6">
            {ranked.map((tool, i) => {
              const totalReviews = (tool.external_ratings ?? []).reduce(
                (acc, r) => acc + (r.count ?? 0),
                0,
              );
              return (
                <li
                  key={tool.slug}
                  className="rounded-2xl bg-white border border-slate-200 p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-extrabold text-blue-600 w-10 text-center">
                        {i + 1}.
                      </div>
                    </div>
                    <ToolLogo
                      slug={tool.slug}
                      src={tool.logo_url}
                      websiteUrl={tool.official_url}
                      name={tool.name}
                      priority={i < 2}
                      className="w-16 h-16 rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="text-xl font-bold text-slate-900 hover:text-blue-600"
                        >
                          {tool.name}
                        </Link>
                        <span className="text-sm text-slate-500">
                          {pricingLabel(tool)} · {tool.platforms.join(' / ')}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-amber-600 font-semibold">
                        <span>★ {tool.score.toFixed(1)}/5</span>
                        {totalReviews > 0 && (
                          <span className="text-slate-500 font-normal">
                            ({totalReviews.toLocaleString()} customer reviews)
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-slate-700 leading-relaxed">
                        {tool.short_desc}
                      </p>
                      <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div>
                          <dt className="text-slate-500 font-medium">
                            Why it&apos;s on this list
                          </dt>
                          <dd className="text-slate-800">{whyPickedLine(tool)}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500 font-medium">
                            Best for
                          </dt>
                          <dd className="text-slate-800">{bestForLine(tool)}</dd>
                        </div>
                      </dl>
                      <div className="mt-4">
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Read the full {tool.name} review →
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <section className="mt-12 rounded-2xl bg-blue-50 border border-blue-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Not sure which {category.name.toLowerCase()} tool fits?
            </h2>
            <p className="text-slate-700 mb-4">
              Answer a 60-second quiz and get a personalised shortlist based
              on your industry, team size, budget, and required file formats.
            </p>
            <Link
              href="/matchmaker"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"
            >
              Try the Matchmaker →
            </Link>
          </section>
        </article>
      </main>
    </>
  );
}
