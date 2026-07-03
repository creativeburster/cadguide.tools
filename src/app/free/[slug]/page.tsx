import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  FREE_SUBPAGES,
  freeSubPagePaths,
  getFreeSubPage,
  freeToolsByCategory,
} from '@/lib/seo-content';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';
import { FoldingList } from '@/components/folding-list';
import React from 'react';

export const dynamicParams = false;

export function generateStaticParams() {
  return freeSubPagePaths();
}

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  return t.pricing_type;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const p = getFreeSubPage(slug);
  if (!p) return {};
  return pageMetadata({
    title: p.title,
    description: p.description,
    path: `/free/${p.slug}`,
    ogType: 'article',
  });
}

function itemListLd(title: string, description: string, list: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description,
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

function articleLd(title: string, description: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: `${SITE_URL}/free/${slug}`,
    publisher: { '@type': 'Organization', name: 'CADGuide.tools', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
  };
}

function faqLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export default async function FreeSubPageRoute(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const p = getFreeSubPage(slug);
  if (!p) notFound();

  const list = freeToolsByCategory(p.categoryIds);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Free CAD Software', path: '/free' },
    { name: p.displayName, path: `/free/${p.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(p.title, p.description, list)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(p.title, p.description, p.slug)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(p.faqs)) }} />

      <main className="min-h-screen bg-slate-50 pb-20">
        <div className="w-full h-1.5 bg-gradient-to-r from-sky-400 via-teal-500 to-emerald-500" />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/free" className="hover:underline">Free CAD Software</Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{p.displayName}</span>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded">
                Truly Free
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {list.length} Evaluated Tools
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {p.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              {p.intro}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Looking for other free categories?{' '}
              <Link href="/free" className="text-blue-600 hover:underline font-bold">Browse all free CAD software</Link>
              {' or '}
              <Link href="/open-source" className="text-blue-600 hover:underline font-bold">strictly open-source tools</Link>.
            </p>
          </header>

          {list.length > 0 ? (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Ranked Free {p.displayName} Solutions
              </h2>
              <FoldingList itemType="ol" className="space-y-5">
                {list.map((t, i) => (
                  <li key={t.slug} className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div className="flex-shrink-0 text-2xl font-black text-slate-400 w-8 sm:w-10 text-center">
                        {i + 1}.
                      </div>
                      <ToolLogo slug={t.slug} src={t.logo_url} websiteUrl={t.official_url} name={t.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0 border border-slate-100 shadow-inner" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <Link href={`/tools/${t.slug}`} className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            {t.name}
                          </Link>
                          <span className="text-xs font-semibold text-slate-500">
                            {pricingLabel(t)} · {t.platforms.join(' / ')}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm text-amber-500 font-bold">★ {t.score.toFixed(1)}</span>
                          <span className="text-xs text-slate-400">/ 5 Editor Rating</span>
                        </div>
                        <p className="mt-3 text-slate-700 leading-relaxed text-sm sm:text-base">{t.short_desc}</p>
                        <div className="mt-4">
                          <Link href={`/tools/${t.slug}`} className="text-xs font-bold text-blue-600 hover:underline">
                            View full benchmarks and download guides →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </FoldingList>
            </section>
          ) : (
            <section className="mb-12">
              <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
                <p className="text-slate-500">No free tools found in this category yet. Check back soon — we are expanding our catalog regularly.</p>
                <Link href="/free" className="mt-4 inline-block text-blue-600 font-bold hover:underline">← Back to all free CAD software</Link>
              </div>
            </section>
          )}

          {/* FAQ Section */}
          <section className="mt-12 rounded-2xl bg-white border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-sky-400 to-emerald-500" />
              Frequently Asked Questions
            </h2>
            <dl className="space-y-4">
              {p.faqs.map((f) => (
                <div key={f.q} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                  <dt className="font-semibold text-slate-900 text-sm sm:text-base">{f.q}</dt>
                  <dd className="mt-2 text-slate-600 text-sm leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Other free categories */}
          <section className="mt-12 border-t border-slate-200 pt-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Other free CAD categories</h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {Object.values(FREE_SUBPAGES)
                .filter((x) => x.slug !== p.slug)
                .map((x) => (
                  <li key={x.slug}>
                    <Link href={`/free/${x.slug}`} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
                      Free {x.displayName}
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

export const dynamic = 'force-static';
