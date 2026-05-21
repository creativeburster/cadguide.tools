import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  FILE_FORMAT_PAGES,
  formatPagePaths,
  getFormatPage,
  toolsForFormat,
  type FormatPage,
} from '@/lib/seo-content';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL, softwareApplicationLd } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';

export const dynamicParams = false;

export function generateStaticParams() {
  return formatPagePaths();
}

const YEAR = 2026;

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

function pageTitle(p: FormatPage, count: number): string {
  return `Software That Opens & Edits ${p.formatName} Files (${count} Tools, ${YEAR})`;
}

function pageDescription(p: FormatPage, count: number): string {
  return `${count} CAD, BIM, and visualisation tools that read or write ${p.formatName} (${p.fullName}) files — ranked by score with read/write capability flagged.`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const p = getFormatPage(slug);
  if (!p) return {};
  const { reads, writes, both } = toolsForFormat(p);
  const total = reads.length + writes.length + both.length;
  return pageMetadata({
    title: pageTitle(p, total),
    description: pageDescription(p, total),
    path: `/file-formats/${p.slug}`,
    ogType: 'article',
  });
}

function itemListLd(p: FormatPage, list: Tool[]) {
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

function articleLd(p: FormatPage, count: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle(p, count),
    description: pageDescription(p, count),
    mainEntityOfPage: `${SITE_URL}/file-formats/${p.slug}`,
    publisher: { '@type': 'Organization', name: 'CADGuide.tools', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: '2026-05-15',
  };
}

function faqLd(p: FormatPage) {
  if (!p.faqs || p.faqs.length === 0) return null;
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

function ToolCard({ t, capability }: { t: Tool; capability: 'read' | 'write' | 'both' }) {
  const capLabel = capability === 'both' ? 'Read & Write' : capability === 'read' ? 'Read Only' : 'Write Only';
  const capColor = capability === 'both' ? 'bg-emerald-100 text-emerald-800' : capability === 'read' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800';
  return (
    <li className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-blue-300 transition-colors">
      <div className="flex items-start gap-4">
        <ToolLogo slug={t.slug} src={t.logo_url} websiteUrl={t.official_url} name={t.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Link href={`/tools/${t.slug}`} className="text-lg font-bold text-slate-900 hover:text-blue-600">{t.name}</Link>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${capColor}`}>{capLabel}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">{pricingLabel(t)} · {t.platforms.join(' / ')} · ★ {t.score.toFixed(1)}</div>
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">{t.short_desc}</p>
        </div>
      </div>
    </li>
  );
}

export default async function FileFormatPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const p = getFormatPage(slug);
  if (!p) notFound();

  const { reads, writes, both } = toolsForFormat(p);
  const all = [...both, ...reads, ...writes];
  const total = all.length;
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'File Formats', path: '/file-formats' },
    { name: p.formatName, path: `/file-formats/${p.slug}` },
  ]);
  const faqsSchema = faqLd(p);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(p, all)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(p, total)) }} />
      {faqsSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqsSchema) }} />}
      {all.slice(0, 5).map((t, i) => (
        <script key={`software-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationLd(t)) }} />
      ))}

      <main className="min-h-screen bg-slate-50">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:underline">Home</Link>{' / '}
            <Link href="/file-formats" className="hover:underline">File Formats</Link>{' / '}
            <span className="text-slate-700">{p.formatName}</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {pageTitle(p, total)}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">{p.intro}</p>
          </header>

          {both.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Full read & write support ({both.length})
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {both.map((t) => <ToolCard key={t.slug} t={t} capability="both" />)}
              </ul>
            </section>
          )}

          {reads.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Read-only / viewers ({reads.length})
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reads.map((t) => <ToolCard key={t.slug} t={t} capability="read" />)}
              </ul>
            </section>
          )}

          {writes.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Write / export ({writes.length})
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {writes.map((t) => <ToolCard key={t.slug} t={t} capability="write" />)}
              </ul>
            </section>
          )}

          {total === 0 && (
            <p className="text-slate-600">
              No tools currently tagged with {p.formatName} support in our catalog. Browse the{' '}
              <Link href="/tools" className="text-blue-600 hover:underline">full directory</Link>{' '}
              to find compatible tools by category.
            </p>
          )}

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

          <section className="mt-10">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Other file formats</h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {Object.values(FILE_FORMAT_PAGES)
                .filter((x) => x.slug !== p.slug)
                .map((x) => (
                  <li key={x.slug}>
                    <Link href={`/file-formats/${x.slug}`} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700">
                      {x.formatName} support
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
