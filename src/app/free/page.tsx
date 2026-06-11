import Link from 'next/link';
import type { Metadata } from 'next';
import { freeTools } from '@/lib/seo-content';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';
import { FoldingList } from '@/components/folding-list';
import React from 'react';

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
    dateModified: new Date().toISOString().slice(0, 10),
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

// --- FREE CAD SAFETY & COMPARATIVE WIDGET ---
function FreeCadSafetyWidget() {
  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white border border-teal-900/50 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-emerald-500/30">
            Software Safety Advisory
          </span>
          <span className="text-xs text-slate-400 font-medium">Free CAD Licensing Audits</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
          Free CAD Security & Licensing Safety Guide
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-6">
          Using &quot;free&quot; software for professional designs carries substantial legal and commercial risks. Major proprietary vendors use sophisticated automated telemetry to track corporate IP usage on non-commercial personal seats, leading to aggressive compliance audits. Understand the boundary rules below:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-6">
          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">1</span>
              <h4 className="font-extrabold text-white">Open Source Freedom</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Tools like <strong>FreeCAD</strong>, <strong>KiCad</strong>, and <strong>LibreCAD</strong> are distributed under GPL or LGPL. You own your data 100%, can use them commercially without cost, and run them completely offline.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">2</span>
              <h4 className="font-extrabold text-white">Freemium Limits</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              <strong>Fusion 360 Personal</strong> and <strong>Onshape Free</strong> restrict active documents, disable multi-sheet drawing exports, and legally forbid any direct or indirect commercial use.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">3</span>
              <h4 className="font-extrabold text-white">Public Data Mandate</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Onshape&apos;s free tier enforces that <strong>all saved designs are public</strong>. Anyone on the internet can search, view, copy, and download your proprietary document geometries.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900 text-xs text-emerald-300 leading-relaxed flex gap-2">
          <span className="font-bold flex-shrink-0 uppercase tracking-wide">Pro Tip:</span>
          <span>If you are working on commercial proprietary hardware designs, stick to 100% open-source tools or purchase basic entry licenses to protect your organization from telemetry audits.</span>
        </div>
      </div>
    </div>
  );
}

// --- COMPARATIVE TIER MATRIX ---
function FreeTierMatrix() {
  const tiers = [
    {
      name: 'Tinkercad',
      category: 'Browser CSG',
      suitability: 'Absolute Beginners',
      limitations: 'Mesh export only, simple geometries',
      privacy: 'Private (Autodesk cloud)',
    },
    {
      name: 'FreeCAD',
      category: 'Parametric MCAD',
      suitability: 'Advanced Engineers',
      limitations: 'Learning curve, complex UI',
      privacy: '100% Private (Local offline)',
    },
    {
      name: 'Onshape Free',
      category: 'Cloud CAD',
      suitability: 'Hobbyists & Students',
      limitations: 'Strictly non-commercial',
      privacy: 'Public-by-default (Public web)',
    },
    {
      name: 'Fusion 360 Personal',
      category: 'Solid Modeling',
      suitability: 'Makers & CNC Users',
      limitations: '10 active files, standard formats only',
      privacy: 'Private cloud, restricted exports',
    }
  ];

  return (
    <div className="my-10">
      <h3 className="text-xl font-bold text-slate-900 mb-4">
        Popular Free Tiers: Side-by-Side Limits Comparison
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-slate-900">Software Name</th>
              <th className="px-6 py-4 text-left font-bold text-slate-900">Best For</th>
              <th className="px-6 py-4 text-left font-bold text-slate-900">Key Constraints</th>
              <th className="px-6 py-4 text-left font-bold text-slate-900">IP Privacy Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tiers.map((t) => (
              <tr key={t.name} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{t.name}</td>
                <td className="px-6 py-4 text-slate-700">{t.suitability}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">{t.limitations}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    t.privacy.includes('100% Private')
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : t.privacy.includes('Public')
                      ? 'bg-rose-50 text-rose-700 border border-rose-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {t.privacy}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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

      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Sky-Teal to Emerald Accent Line */}
        <div className="w-full h-1.5 bg-gradient-to-r from-sky-400 via-teal-500 to-emerald-500" />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Free CAD Software</span>
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
              {TITLE}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              Free CAD does not have to mean crippled demo-ware or forced watermarks. Today, robust open-source engines are production-ready (FreeCAD, KiCad, LibreCAD) and industry giants offer structured student and hobbyist licenses (Tinkercad, SketchUp Free, Fusion 360 Personal, Onshape Free). Below are the top {list.length} fully functional CAD tools you can access today for zero cost, audited by our team of draftspeople and mechanical engineers.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Prefer strictly open-source programs? Jump directly to our{' '}
              <Link href="/open-source" className="text-blue-600 hover:underline font-bold">open-source CAD page</Link>.
            </p>
          </header>

          {/* Interactive comparative limits table */}
          <FreeTierMatrix />

          {/* Security & Licensing Safety Widget */}
          <FreeCadSafetyWidget />

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Ranked Free & Freemium CAD Solutions
            </h2>
            <FoldingList
              itemType="ol"
              className="space-y-5"
            >
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

          {/* Frequently Asked Section */}
          <section className="mt-12 rounded-2xl bg-white border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-sky-400 to-emerald-500" />
              Frequently Asked Questions
            </h2>
            <dl className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                  <dt className="font-semibold text-slate-900 text-sm sm:text-base">{f.q}</dt>
                  <dd className="mt-2 text-slate-600 text-sm leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Action CTA */}
          <section className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-8 text-center relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(52,211,153,0.1),transparent)] pointer-events-none" />
            <h2 className="text-2xl font-bold">Try the CAD Matchmaker</h2>
            <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
              Need a completely custom shortlist based on your exact budget constraints, design sector, and local machine hardware limits?
            </p>
            <Link href="/matchmaker" className="inline-block mt-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
              Launch Matchmaker →
            </Link>
          </section>

        </article>
      </main>
    </>
  );
}
