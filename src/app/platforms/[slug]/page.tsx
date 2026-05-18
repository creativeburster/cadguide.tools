import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  PLATFORM_PAGES,
  platformPagePaths,
  getPlatformPage,
  toolsForPlatform,
  type PlatformPage,
} from '@/lib/seo-content';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';

export const dynamicParams = false;

export function generateStaticParams() {
  return platformPagePaths();
}

const YEAR = 2026;

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

function pageTitle(p: PlatformPage, count: number): string {
  return `Best CAD Software for ${p.displayName} in ${YEAR} (${count} Tools)`;
}

function pageDescription(p: PlatformPage, count: number): string {
  return `${count} CAD, BIM, CAE, and EDA tools that run on ${p.displayName} — ranked by expert score and customer reviews. Pricing, platforms, and best-for guidance included.`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlatformPage(slug);
  if (!p) return {};
  const list = toolsForPlatform(p);
  return pageMetadata({
    title: pageTitle(p, list.length),
    description: pageDescription(p, list.length),
    path: `/platforms/${p.slug}`,
    ogType: 'article',
  });
}

function itemListLd(p: PlatformPage, list: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle(p, list.length),
    description: pageDescription(p, list.length),
    numberOfItems: list.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: list.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/tools/${t.slug}`,
      name: t.name,
    })),
  };
}

function articleLd(p: PlatformPage, count: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle(p, count),
    description: pageDescription(p, count),
    mainEntityOfPage: `${SITE_URL}/platforms/${p.slug}`,
    publisher: { '@type': 'Organization', name: 'CADGuide.tools', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: '2026-05-15',
  };
}

function faqLd(p: PlatformPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export default async function PlatformPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const p = getPlatformPage(slug);
  if (!p) notFound();

  const list = toolsForPlatform(p);
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Platforms', path: '/platforms' },
    { name: p.displayName, path: `/platforms/${p.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(p, list)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(p, list.length)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(p)) }} />

      <main className="min-h-screen bg-slate-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:underline">Home</Link>{' / '}
            <Link href="/platforms" className="hover:underline">Platforms</Link>{' / '}
            <span className="text-slate-700">{p.displayName}</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {pageTitle(p, list.length)}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">{p.intro}</p>
          </header>

          <ol className="space-y-5">
            {list.map((t, i) => (
              <li key={t.slug} className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex-shrink-0 text-2xl font-extrabold text-blue-600 w-8 sm:w-10 text-center">{i + 1}.</div>
                  <ToolLogo slug={t.slug} src={t.logo_url} websiteUrl={t.official_url} name={t.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <Link href={`/tools/${t.slug}`} className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600">{t.name}</Link>
                      <span className="text-sm text-slate-500">{pricingLabel(t)} · {t.platforms.join(' / ')}</span>
                    </div>
                    <div className="mt-1 text-sm text-amber-600 font-semibold">★ {t.score.toFixed(1)}/5</div>
                    <p className="mt-3 text-slate-700 leading-relaxed">{t.short_desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <section className="mt-12 rounded-2xl bg-white border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently asked</h2>
            <dl className="space-y-4">
              {p.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold text-slate-900">{f.q}</dt>
                  <dd className="mt-1 text-slate-600 leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12 rounded-2xl bg-blue-600 text-white p-8 text-center">
            <h2 className="text-2xl font-bold">Find the right tool faster</h2>
            <p className="mt-3 text-blue-100 max-w-xl mx-auto">Run our Matchmaker to filter all {list.length} {p.displayName} tools against your real budget, team size, and feature needs.</p>
            <Link href="/matchmaker" className="inline-block mt-5 bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50">Launch Matchmaker →</Link>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Other platforms</h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {Object.values(PLATFORM_PAGES)
                .filter((x) => x.slug !== p.slug)
                .map((x) => (
                  <li key={x.slug}>
                    <Link href={`/platforms/${x.slug}`} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700">
                      CAD for {x.displayName}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </article>
      </main>
    </>
  );
}

export const revalidate = 86400;
