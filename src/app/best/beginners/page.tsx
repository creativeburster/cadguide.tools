import Link from 'next/link';
import type { Metadata } from 'next';
import { tools } from '@/lib/data';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';
import { FoldingList } from '@/components/folding-list';
import React from 'react';

const YEAR = 2026;

const TITLE = `Best CAD Software for Beginners in ${YEAR}: Easy-to-Learn Tools`;
const DESCRIPTION = `Starting CAD in ${YEAR}? These beginner-friendly tools have gentle learning curves, free tiers, and excellent tutorials — ranked by ease of use and community support.`;

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/best/beginners',
  ogType: 'article',
});

const BEGINNER_SLUGS = [
  'tinkercad',
  'sketchup',
  'onshape',
  'freecad',
  'librecad',
  'fusion-360',
  'blender',
  'solvespace',
  'qcad',
  'openscad',
  'nanoCAD-free',
  'easyeda',
];

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

const BEGINNER_TIERS = [
  {
    name: 'Tinkercad',
    category: 'Browser CSG',
    learningCurve: 'Minutes',
    bestFor: 'Absolute beginners, kids, educators',
    why: 'Drag-and-drop block modeling in the browser. Zero install, zero cost, zero learning curve. The perfect first step into 3D design.',
  },
  {
    name: 'SketchUp Free',
    category: 'Browser 3D',
    learningCurve: 'Hours',
    bestFor: 'Interior designers, hobbyists, architects',
    why: 'Push-pull modeling is intuitive and visual. The free web version covers most beginner needs without any software installation.',
  },
  {
    name: 'Onshape Free',
    category: 'Cloud Parametric',
    learningCurve: 'Days',
    bestFor: 'Aspiring mechanical engineers, students',
    why: 'Professional-grade parametric CAD in the browser. Free tier is fully functional (public documents only). The best way to learn real MCAD without buying SolidWorks.',
  },
  {
    name: 'FreeCAD',
    category: 'Desktop Parametric',
    learningCurve: 'Weeks',
    bestFor: 'Engineers who want full control, open-source advocates',
    why: 'Completely free and open-source parametric modeler. Steeper learning curve but unlimited capability — no watermarks, no file limits, no expiry.',
  },
];

const FAQ = [
  {
    q: 'What is the easiest CAD software for beginners?',
    a: 'Tinkercad is the easiest — a browser-based drag-and-drop tool that requires zero installation and can be learned in minutes. For 2D drafting, LibreCAD or QCAD are the simplest entry points. For 3D parametric modeling, SketchUp Free or Onshape Free offer the gentlest introduction.',
  },
  {
    q: 'Can I learn CAD for free?',
    a: 'Absolutely. Tinkercad, SketchUp Free, Onshape Free, FreeCAD, LibreCAD, and Blender are all free (or have free tiers). YouTube has thousands of hours of tutorials for each. Autodesk Design Academy offers free structured courses for students and educators.',
  },
  {
    q: 'Should I start with 2D or 3D CAD?',
    a: 'If you want to do mechanical design or product design, start with 3D parametric CAD (Onshape Free or Fusion 360 Personal). If you are interested in architecture, drafting, or floor plans, start with 2D CAD (LibreCAD or QCAD). Tinkercad is a good neutral starting point for absolute beginners who are not sure which direction to take.',
  },
  {
    q: 'How long does it take to learn CAD?',
    a: 'Tinkercad: minutes. SketchUp: a few hours to feel comfortable. Onshape or Fusion 360: 1-2 weeks for basic modeling, 3-6 months for proficiency. FreeCAD: 2-4 weeks for basic use, longer for advanced assemblies. Professional-level SolidWorks or Creo: 6-12 months of regular use.',
  },
  {
    q: 'What hardware do I need for beginner CAD?',
    a: 'Tinkercad and SketchUp Free run on any laptop with a browser. Onshape Free runs in Chrome on most machines. FreeCAD and LibreCAD run on modest hardware (8GB RAM, integrated graphics). Fusion 360 benefits from a dedicated GPU. None of these tools require a workstation-grade computer.',
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
    mainEntityOfPage: `${SITE_URL}/best/beginners`,
    author: {
  '@type': 'Organization',
  name: 'CADGuide.tools',
  url: SITE_URL,
},
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

export default function BestForBeginnersPage() {
  const list = BEGINNER_SLUGS
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter((t): t is Tool => !!t)
    .sort((a, b) => b.score - a.score);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Best Of', path: '/best' },
    { name: 'For Beginners', path: '/best/beginners' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(list)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd()) }} />

      <main className="min-h-screen bg-slate-50 pb-20">
        <div className="w-full h-1.5 bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-500" />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/best" className="hover:underline">Best Of</Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">For Beginners</span>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-violet-50 text-violet-700 border border-violet-100 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded">
                Beginner Friendly
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {list.length} Tools Reviewed
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {TITLE}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              Starting CAD does not have to be overwhelming. The tools below were selected for their gentle learning curves, free or affordable pricing, quality of tutorials, and active community support. Whether you are a student, hobbyist, or career-changer, these are the CAD programs that will get you modeling fast — without breaking the bank.
            </p>
          </header>

          {/* Learning Path Tiers */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Beginner Learning Path: From Zero to Modeling
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-2xl">
              Not sure where to start? Follow this progression — each tool builds on skills from the previous one.
            </p>
            <div className="space-y-4">
              {BEGINNER_TIERS.map((tier, i) => (
                <div key={tier.name} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-200 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-black flex items-center justify-center text-lg">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                        <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">{tier.category}</span>
                        <span className="text-xs text-slate-500">Learning curve: {tier.learningCurve}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-700"><strong>Best for:</strong> {tier.bestFor}</p>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{tier.why}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ranked Tool List */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              All Beginner-Friendly CAD Tools, Ranked
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
                          View full profile and tutorials →
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </FoldingList>
          </section>

          {/* FAQ */}
          <section className="mt-12 rounded-2xl bg-white border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-sky-400 to-violet-500" />
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

          {/* CTA */}
          <section className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-violet-950 text-white p-8 text-center relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.15),transparent)] pointer-events-none" />
            <h2 className="text-2xl font-bold">Not sure which CAD tool fits you?</h2>
            <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
              Our Matchmaker asks about your goals, budget, and hardware — then recommends the perfect beginner CAD tool in 60 seconds.
            </p>
            <Link href="/matchmaker" className="inline-block mt-5 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
              Launch Matchmaker →
            </Link>
          </section>

          {/* Back to Best */}
          <section className="mt-12 border-t border-slate-200 pt-8">
            <Link href="/best" className="text-sm font-bold text-blue-600 hover:underline">← Back to all Best CAD Software rankings</Link>
          </section>
        </article>
      </main>
    </>
  );
}

export const dynamic = 'force-static';
