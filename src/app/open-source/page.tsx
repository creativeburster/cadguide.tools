import Link from 'next/link';
import type { Metadata } from 'next';
import { openSourceTools } from '@/lib/seo-content';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';

const YEAR = 2026;

const TITLE = `Best Open-Source CAD Software in ${YEAR}`;
const DESCRIPTION =
  'The complete list of open-source CAD, BIM, CAE, and EDA software. Forever free, source-available, community-supported — ranked by score.';

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/open-source',
  ogType: 'article',
});

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Open Source') return 'Open Source';
  return t.pricing_type;
}

const FAQ = [
  {
    q: 'What counts as open-source CAD?',
    a: 'The full source code is publicly available under an OSI-approved licence (GPL, MPL, MIT, BSD, etc.), with no commercial-use restriction. Source-available but not OSI-approved tools are excluded.',
  },
  {
    q: 'Best open-source CAD for mechanical design?',
    a: 'FreeCAD is the production-grade choice for parametric mechanical CAD. SolveSpace is a lighter alternative for small constraint-based assemblies.',
  },
  {
    q: 'Best open-source PCB / EDA?',
    a: 'KiCad is the gold standard — a serious production tool used by professional hardware companies. Far more capable than its older "hobbyist" reputation.',
  },
  {
    q: 'Best open-source BIM?',
    a: 'BlenderBIM (Blender + the BlenderBIM add-on) is the closest thing to open-source BIM in 2026. Native authoring is still dominated by commercial tools but BlenderBIM is rapidly closing the gap.',
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
    mainEntityOfPage: `${SITE_URL}/open-source`,
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

export default function OpenSourceCadPage() {
  const list = openSourceTools();
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Open-Source CAD', path: '/open-source' },
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
            <span className="text-slate-700">Open-Source CAD</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {TITLE}
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Open-source CAD has matured well beyond the &quot;research project&quot; stigma
              of the 2010s. FreeCAD, KiCad, Blender, LibreCAD, and SolveSpace are all
              production-grade tools running real commercial work in 2026. Below are
              every open-source CAD, BIM, and EDA tool in our catalog (all under
              OSI-approved licences), ranked by expert score.
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Looking at free-as-in-cost (incl. proprietary freemium)?{' '}
              <Link href="/free" className="text-blue-600 hover:underline">Free CAD software</Link>{' '}
              covers the wider list.
            </p>

            {/* Semantic Open-Source Dimension Hub Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/pricing/open-source" className="block p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all">
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200">
                  Financial Analysis
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900">Open-Source TCO & Economics →</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Evaluate the total cost of ownership (TCO) of open-source CAD. Compare zero-license seat savings with in-house developer customization and SLA support.
                </p>
              </Link>
              <Link href="/licensing/open-source" className="block p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all">
                <span className="bg-teal-100 text-teal-800 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-teal-200">
                  Legal Compliance
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900">GPL Copyleft & EULA Guide →</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Navigate legal frameworks for copyleft GPL vs permissive MIT licenses. Review commercial usage rights and drawing file privacy compliance rules.
                </p>
              </Link>
            </div>
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
