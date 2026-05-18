import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { alternativesFor, alternativesPagePaths } from '@/lib/seo-content';
import { getToolBySlug, type Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';

export const dynamicParams = false;

export function generateStaticParams() {
  return alternativesPagePaths();
}

const YEAR = 2026;

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

function pageTitle(tool: Tool, count: number): string {
  return `Best ${tool.name} Alternatives in ${YEAR}: ${count} Tools Compared`;
}

function pageDescription(tool: Tool, count: number): string {
  return `Looking for an alternative to ${tool.name}? Compare ${count} similar CAD tools by pricing, platform, score, and target use case — all hand-vetted by our editors.`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const alts = alternativesFor(tool);
  return pageMetadata({
    title: pageTitle(tool, alts.length),
    description: pageDescription(tool, alts.length),
    path: `/alternatives/${tool.slug}`,
    ogType: 'article',
  });
}

/** Cheap, deterministic "why try X instead" — uses two real diffs. */
function whyTryInstead(target: Tool, alt: Tool): string {
  const bits: string[] = [];
  // Pricing diff
  if (alt.pricing_type === 'Free' || alt.pricing_type === 'Open Source') {
    bits.push(`it's ${alt.pricing_type.toLowerCase()}`);
  } else if (target.starting_price > 0 && alt.starting_price > 0) {
    if (alt.starting_price < target.starting_price * 0.6) {
      bits.push(
        `it's roughly ${Math.round(
          ((target.starting_price - alt.starting_price) /
            target.starting_price) *
            100,
        )}% cheaper at $${alt.starting_price} starting`,
      );
    } else if (alt.starting_price > target.starting_price * 1.4) {
      bits.push('it sits one tier above on capability vs price');
    }
  } else if (alt.pricing_type === 'Perpetual' && target.pricing_type === 'Subscription') {
    bits.push('it offers a perpetual licence (no ongoing subscription)');
  }
  // Platform diff
  const targetPlats = new Set(target.platforms ?? []);
  const altPlats = alt.platforms ?? [];
  const newPlats = altPlats.filter((p) => !targetPlats.has(p));
  if (newPlats.length > 0) {
    bits.push(`it also runs on ${newPlats.join(' / ')}`);
  }
  // Score callout
  if (alt.score >= target.score + 0.2) {
    bits.push(`its expert score (${alt.score}/5) edges ahead`);
  }
  // Strong differentiator from pros
  if (bits.length < 2 && alt.pros && alt.pros.length > 0) {
    bits.push(alt.pros[0].toLowerCase());
  }
  if (bits.length === 0) {
    return `It's the closest ${target.category_id === alt.category_id ? 'same-category' : 'adjacent'} alternative our editors recommend.`;
  }
  return `Try it because ${bits.slice(0, 3).join(', ')}.`;
}

function itemListLd(tool: Tool, alts: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle(tool, alts.length),
    description: pageDescription(tool, alts.length),
    numberOfItems: alts.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: alts.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/tools/${t.slug}`,
      name: t.name,
    })),
  };
}

function articleLd(tool: Tool, count: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle(tool, count),
    description: pageDescription(tool, count),
    mainEntityOfPage: `${SITE_URL}/alternatives/${tool.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'CADGuide.tools',
      url: SITE_URL,
    },
    datePublished: '2026-01-01',
    dateModified: '2026-05-15',
  };
}

function faqLd(tool: Tool, alts: Tool[]) {
  const top = alts[0];
  const cheapest = [...alts].sort((a, b) => a.starting_price - b.starting_price)[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the closest alternative to ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${top?.name ?? 'Our top pick'} is the closest direct alternative to ${tool.name}, with comparable feature depth and a similar target user base.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is there a free alternative to ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: cheapest && (cheapest.pricing_type === 'Free' || cheapest.pricing_type === 'Open Source' || cheapest.pricing_type === 'Freemium')
            ? `Yes — ${cheapest.name} is ${cheapest.pricing_type.toLowerCase()} and the most accessible option on this list.`
            : `No truly free direct alternative, but several options on this list are dramatically cheaper than ${tool.name}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Why would I switch away from ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Common reasons: cost (perpetual vs subscription pricing), platform requirements (Mac / Linux / web), specific feature gaps, or vendor lock-in concerns. Each alternative below addresses one or more of these.`,
        },
      },
    ],
  };
}

export default async function AlternativesPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const alts = alternativesFor(tool);
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: tool.name, path: `/tools/${tool.slug}` },
    { name: 'Alternatives', path: `/alternatives/${tool.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(tool, alts)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(tool, alts.length)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(tool, alts)) }} />

      <main className="min-h-screen bg-slate-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:underline">Home</Link>{' / '}
            <Link href="/tools" className="hover:underline">Tools</Link>{' / '}
            <Link href={`/tools/${tool.slug}`} className="hover:underline">{tool.name}</Link>{' / '}
            <span className="text-slate-700">Alternatives</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {pageTitle(tool, alts.length)}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              {tool.name} is a strong choice, but it&apos;s not the only one. Below are{' '}
              {alts.length} editor-vetted alternatives to {tool.name} — every tool here
              shares the same problem-space but differs on price, platform, target user,
              or feature depth. We&apos;ve added a one-line &quot;why try this instead&quot;
              callout for each so you can short-list the right next step in seconds.
            </p>
          </header>

          <section className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 mb-10">
            <div className="flex items-start gap-4">
              <ToolLogo
                slug={tool.slug}
                src={tool.logo_url}
                websiteUrl={tool.official_url}
                name={tool.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Looking for an alternative to
                </div>
                <Link href={`/tools/${tool.slug}`} className="text-xl font-bold text-slate-900 hover:text-blue-600">
                  {tool.name}
                </Link>
                <div className="mt-1 text-sm text-slate-500">
                  {pricingLabel(tool)} · {tool.platforms.join(' / ')} · ★ {tool.score.toFixed(1)}/5
                </div>
              </div>
            </div>
          </section>

          <ol className="space-y-5">
            {alts.map((alt, i) => (
              <li
                key={alt.slug}
                className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex-shrink-0 text-2xl font-extrabold text-blue-600 w-8 sm:w-10 text-center">
                    {i + 1}.
                  </div>
                  <ToolLogo
                    slug={alt.slug}
                    src={alt.logo_url}
                    websiteUrl={alt.official_url}
                    name={alt.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <Link
                        href={`/tools/${alt.slug}`}
                        className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600"
                      >
                        {alt.name}
                      </Link>
                      <span className="text-sm text-slate-500">
                        {pricingLabel(alt)} · {alt.platforms.join(' / ')}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-amber-600 font-semibold">
                      ★ {alt.score.toFixed(1)}/5
                    </div>
                    <p className="mt-3 text-slate-700 leading-relaxed">
                      {alt.short_desc}
                    </p>
                    <p className="mt-3 text-sm text-slate-600 italic">
                      {whyTryInstead(tool, alt)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/tools/${alt.slug}`}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        Full {alt.name} profile →
                      </Link>
                      <Link
                        href={`/compare/${[tool.slug, alt.slug].sort().join('-vs-')}`}
                        className="text-sm font-semibold text-slate-600 hover:underline"
                      >
                        Compare side-by-side
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <section className="mt-12 rounded-2xl bg-blue-600 text-white p-8 text-center">
            <h2 className="text-2xl font-bold">Not sure which to pick?</h2>
            <p className="mt-3 text-blue-100 max-w-xl mx-auto">
              Answer six quick questions and our Smart Matchmaker will rank these
              alternatives — plus 220+ other tools — against your real workflow.
            </p>
            <Link
              href="/matchmaker"
              className="inline-block mt-5 bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              Launch Matchmaker →
            </Link>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Related</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/tools/${tool.slug}`}
                className="block p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300"
              >
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Full review</div>
                <div className="mt-1 font-semibold text-slate-900">{tool.name} profile</div>
              </Link>
              <Link
                href="/compare"
                className="block p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300"
              >
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Side-by-side</div>
                <div className="mt-1 font-semibold text-slate-900">Build a custom comparison</div>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}

export const revalidate = 86400;
