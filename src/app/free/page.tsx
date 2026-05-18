import Link from 'next/link';
import type { Metadata } from 'next';
import { freeTools } from '@/lib/seo-content';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';

const YEAR = 2026;

const TITLE = `Best Free CAD Software in ${YEAR}: Truly Free Tools`;
const DESCRIPTION =
  'The complete list of free and freemium CAD, BIM, CAE, and EDA software in our catalog — ranked by score. No trial-only tools, no demo-ware.';

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/free',
  ogType: 'article',
});

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  return t.pricing_type;
}

const FAQ = [
  {
    q: 'What counts as "truly free" CAD software?',
    a: 'Free tier with no expiry, no watermark on commercial output, and no compulsory upgrade after a trial period. We include Free, Freemium (gated paid tier), and Open Source.',
  },
  {
    q: "Is Fusion 360 free?",
    a: 'Fusion 360 has a free Personal Use tier for non-commercial / hobbyist work. For commercial use you need the paid Standard or Premium tier.',
  },
  {
    q: 'Best free CAD for beginners?',
    a: 'Tinkercad (browser, no install) for absolute beginners. SketchUp Free or Onshape Free for slightly more capability. FreeCAD if you want parametric and open-source.',
  },
  {
    q: 'Best free CAD for professional work?',
    a: 'FreeCAD (parametric MCAD), Blender (organic / VFX / rendering), LibreCAD (2D drafting), KiCad (PCB design) are all production-grade open-source options.',
  },
];

function itemListLd(list: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    description: DESCRIPTION,
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

function articleLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    mainEntityOfPage: `${SITE_URL}/free`,
    publisher: { '@type': 'Organization', name: 'CADGuide.tools', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: '2026-05-15',
  };
}

function faqLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export default function FreeCadPage() {
  const list = freeTools();
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Free CAD Software', path: '/free' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(list)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd()) }} />

      <main className="min-h-screen bg-slate-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:underline">Home</Link>{' / '}
            <span className="text-slate-700">Free CAD Software</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {TITLE}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Free CAD doesn&apos;t mean &quot;crippled trial&quot; anymore. Open-source
              projects like FreeCAD, KiCad, LibreCAD, and Blender are now production-grade,
              and major vendors offer real free tiers (Tinkercad, SketchUp Free, Fusion 360
              Personal, Onshape Free). Below are {list.length} CAD, BIM, and EDA tools you
              can use today at zero cost — no trial, no demo-ware, no watermark on commercial
              output (we&apos;ve filtered those out).
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Want strict open-source only? See{' '}
              <Link href="/open-source" className="text-blue-600 hover:underline">open-source CAD</Link>.
            </p>
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
              {FAQ.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold text-slate-900">{f.q}</dt>
                  <dd className="mt-1 text-slate-600 leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>
      </main>
    </>
  );
}
