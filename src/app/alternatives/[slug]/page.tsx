import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ARTICLES_LIST, getLocalizedTitleAndExcerpt, isArticleCompatibleWithTool } from '@/lib/guides-data';
import { alternativesFor, alternativesPagePaths, comparisonPairs } from '@/lib/seo-content';
import { getToolBySlug, type Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';
import { FoldingList } from '@/components/folding-list';
import React from 'react';

export const dynamicParams = false;

export function generateStaticParams() {
  return alternativesPagePaths();
}

const YEAR = new Date().getFullYear();
const BUILD_DATE = new Date().toISOString().slice(0, 10);

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

function pageTitle(tool: Tool, count: number): string {
  const suffix = ` Alternatives & Equivalents (${YEAR})`;
  const full = `Best ${tool.name}${suffix}`;
  if (full.length <= 60) return full;
  return `${tool.name} Alternatives & Equivalents (${YEAR})`;
}

function pageDescription(tool: Tool, count: number): string {
  return `Looking for an alternative or equivalent to ${tool.name}? Compare ${count} similar CAD/BIM software options by pricing, platform, score, and features.`;
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
    dateModified: BUILD_DATE,
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
        name: `What is the closest alternative or equivalent to ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${top?.name ?? 'Our top pick'} is the closest equivalent and direct alternative to ${tool.name}, with comparable feature depth and a similar target user base.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is there a free equivalent to ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: cheapest && (cheapest.pricing_type === 'Free' || cheapest.pricing_type === 'Open Source' || cheapest.pricing_type === 'Freemium')
            ? `Yes — ${cheapest.name} is ${cheapest.pricing_type.toLowerCase()} and the most accessible equivalent option on this list.`
            : `No truly free equivalent, but several options on this list are dramatically cheaper than ${tool.name}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Why would I switch away from ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: (() => {
            const cons = tool.cons?.filter(c => c.length < 80).slice(0, 3);
            if (!cons || cons.length === 0) return `Common reasons: cost (perpetual vs subscription pricing), platform requirements, specific feature gaps, or vendor lock-in concerns.`;
            const formatted = cons.map(c => c.charAt(0).toLowerCase() + c.slice(1).replace(/\.$/, ''));
            return `The most frequently cited pain points with ${tool.name}: ${formatted.join('; ')}. Each equivalent below directly addresses one or more of these limitations.`;
          })(),
        },
      },
    ],
  };
}

// --- CURATED STYLE SELECTOR BY COMPONENT ARCHETYPE ---
interface AlternativeStyle {
  archetype: 'technical-migration' | 'creative-styling' | 'open-specialized';
  gradient: string;
  badgeAccent: string;
  accentText: string;
  badgeBg: string;
  themeBadgeText: string;
}

function getStyleForAlternatives(tool: Tool): AlternativeStyle {
  const cat = tool.category_id;
  const isFreeOrOS = tool.pricing_type === 'Open Source' || tool.pricing_type === 'Free' || tool.pricing_type === 'Freemium';

  if (isFreeOrOS || cat === 'c6' || cat === 'c7') {
    return {
      archetype: 'open-specialized',
      gradient: 'from-emerald-600 to-teal-850',
      badgeAccent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      accentText: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      themeBadgeText: 'Open & Specialized Standard',
    };
  }

  if (cat === 'c1' || cat === 'c3' || cat === 'c5') {
    return {
      archetype: 'technical-migration',
      gradient: 'from-slate-800 to-indigo-950',
      badgeAccent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      accentText: 'text-indigo-600',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
      themeBadgeText: 'Enterprise Migration Focus',
    };
  }

  return {
    archetype: 'creative-styling',
    gradient: 'from-rose-600 to-violet-950',
    badgeAccent: 'bg-rose-50 text-rose-700 border-rose-100',
    accentText: 'text-rose-600',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    themeBadgeText: 'Design & Curvature Focus',
  };
}

// --- ARCHETYPE WIDGETS ---

function MigrationRiskWidget({ tool }: { tool: Tool }) {
  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{tool.name} Technical Migration Advisory</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">File Translation Risk</span>
          <span className="text-xs text-amber-600 font-bold mt-1 inline-block">Moderate Risk</span>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Legacy drawing databases (.dwg, .rvt, native mechanical files) are highly complex. Vetted alternatives translate raw geometries accurately, but active parametric assembly links may need physical verification.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Shortcut Muscle Memory</span>
          <span className="text-xs text-indigo-600 font-bold mt-1 inline-block">High Affinity</span>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Industry standard alternatives fully support standard keyboard alias tables (.pgp command strings) allowing veteran draftspeople to maintain full drafting speed on day one.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">LISP & Automation Macros</span>
          <span className="text-xs text-rose-600 font-bold mt-1 inline-block">Verification Advised</span>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            If your workflow relies heavily on native custom scripts or proprietary LISP plugins, always verify whether the chosen alternative supports active LISP code execution before moving.
          </p>
        </div>
      </div>
      <div className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex gap-2">
        <span className="font-bold flex-shrink-0">Advisory:</span>
        <span>Establish a dual-license grace period of 30 days. Export intricate models into neutral standard STEP/DXF structures to verify actual dimension preservation limits.</span>
      </div>
    </div>
  );
}

function MeshNurbsFidelityWidget() {
  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M3 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M3 12l-3 3m3-3l3 3M9 5.25L12 3m0 0l3 2.25M12 3v18" />
        </svg>
        <span>NURBS & Organic Subdivision Modeling Verification</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Surface Continuity</span>
          <span className="text-xs text-rose-600 font-bold mt-1 inline-block">G0/G1/G2 Curvature</span>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Industrial designers must protect surface aesthetic curvature transitions. Ensure alternatives don&apos;t force immediate mesh decimation when importing highly accurate NURBS boundaries.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Mesh Vertex Densities</span>
          <span className="text-xs text-indigo-600 font-bold mt-1 inline-block">Subdivision Scales</span>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Poly sculpting thrives on seamless subdivision. Look for alternatives that offer real-time viewport optimization so hardware response stays crisp even at high polygon counts.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Watertight Shell Constraints</span>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">Manifold Export Prep</span>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Makers need watertight mesh shells for print slicing. Ensure exported files do not create self-intersecting boundaries, loose coordinate normals, or open shells during trans-coding.
          </p>
        </div>
      </div>
      <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3 flex gap-2">
        <span className="font-bold flex-shrink-0">Design Rule:</span>
        <span>Audit exported organic shapes using a dedicated inspection tool before sending files to down-stream manufacturing pipelines.</span>
      </div>
    </div>
  );
}

function OpenStandardsWidget() {
  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Open Source Standards & PCB Schematic Interoperability</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">PCB Fab Standards</span>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">Gerber X2 Compliance</span>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Electronics tools demand micro-precision on layer outputs. Make sure your design candidates produce standard, production-ready ODB++ and Gerber files to prevent manufacturing halts.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Zero Vendor Lock-In</span>
          <span className="text-xs text-indigo-600 font-bold mt-1 inline-block">Absolute IP Privacy</span>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Switching to open-source software keeps your blueprints securely stored locally in open, human-readable schemas (like XML/JSON) rather than proprietary cloud silos.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Extensible Architecture</span>
          <span className="text-xs text-amber-600 font-bold mt-1 inline-block">Python Plugin Support</span>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Engineering tasks benefit immensely from script automation. Opt for software that offers a robust, developer-accessible scripting interface to build custom design utilities.
          </p>
        </div>
      </div>
      <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-2">
        <span className="font-bold flex-shrink-0">Engineering Rule:</span>
        <span>Keep your primary schematic drafts cataloged in standard formats to ensure readable archival files regardless of vendor status changes.</span>
      </div>
    </div>
  );
}

// --- RENDER CONTROLLERS ---

function renderAlternativesFAQs(tool: Tool, alts: Tool[], style: AlternativeStyle) {
  const top = alts[0];
  const cheapest = [...alts].sort((a, b) => a.starting_price - b.starting_price)[0];
  const hasFree = cheapest && (cheapest.pricing_type === 'Free' || cheapest.pricing_type === 'Open Source' || cheapest.pricing_type === 'Freemium');

  return (
    <section className="mt-12 rounded-2xl bg-white border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient}`} />
        Frequently Asked Questions
      </h2>
      <dl className="space-y-4">
        <div className="border-b border-slate-100 pb-4">
          <dt className="font-semibold text-slate-900 text-sm sm:text-base">What is the closest alternative or equivalent to {tool.name}?</dt>
          <dd className="mt-2 text-slate-600 text-sm leading-relaxed">
            {top?.name ?? 'Our editors recommended tool'} is the closest equivalent and direct alternative to {tool.name}, offering a highly comparable functional scope and targeting the same engineering workflows.
          </dd>
        </div>
        <div className="border-b border-slate-100 pb-4">
          <dt className="font-semibold text-slate-900 text-sm sm:text-base">Is there a free equivalent to {tool.name}?</dt>
          <dd className="mt-2 text-slate-600 text-sm leading-relaxed">
            {hasFree ? (
              <span>Yes — <strong>{cheapest.name}</strong> is {cheapest.pricing_type.toLowerCase()} and is the most cost-effective equivalent on this list.</span>
            ) : (
              <span>While there are no fully free equivalents, several options on our curated list are significantly more budget-friendly than {tool.name}.</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900 text-sm sm:text-base">Why would I switch away from {tool.name}?</dt>
          <dd className="mt-2 text-slate-600 text-sm leading-relaxed">
            {(() => {
              const cons = tool.cons?.filter(c => c.length < 80);
              if (!cons || cons.length === 0) return <span>Most teams switch due to licensing costs, platform restrictions, or specific workflow gaps that a more specialized tool handles better.</span>;
              const c0 = cons[0].charAt(0).toUpperCase() + cons[0].slice(1).replace(/\.$/, '');
              const c1 = cons[1] ? (cons[1].charAt(0).toLowerCase() + cons[1].slice(1).replace(/\.$/, '')) : null;
              return <span>The most common pain points reported by {tool.name} users: <strong>{c0}</strong>{c1 ? `. Also: ${c1}` : ''}. Each equivalent on this list addresses at least one of these gaps.</span>;
            })()}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function renderAlternativesList(tool: Tool, alts: Tool[], style: AlternativeStyle) {
  const validCompareSlugs = new Set(comparisonPairs().map((p) => p.pairSlug));

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Ranked Alternatives & Equivalents to {tool.name}
        </h2>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${style.badgeAccent}`}>
          {alts.length} Options
        </span>
      </div>

      <FoldingList
        itemType="ol"
        className="space-y-5"
      >
        {alts.map((alt, i) => (
          <li
            key={alt.slug}
            className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex-shrink-0 text-2xl font-black text-slate-400 w-8 sm:w-10 text-center">
                {i + 1}.
              </div>
              <ToolLogo
                slug={alt.slug}
                src={alt.logo_url}
                websiteUrl={alt.official_url}
                name={alt.name}
                priority={i < 2}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0 border border-slate-100 shadow-inner"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Link
                    href={`/tools/${alt.slug}`}
                    className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    {alt.name}
                  </Link>
                  <span className="text-xs font-semibold text-slate-500">
                    {pricingLabel(alt)} · {alt.platforms.join(' / ')}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-amber-500 font-bold">★ {alt.score.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">/ 5 Editor Rating</span>
                </div>
                <p className="mt-3 text-slate-700 leading-relaxed text-sm sm:text-base">
                  {alt.short_desc}
                </p>
                <div className="mt-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{whyTryInstead(tool, alt)}</span>
                </div>
                {/* Editor's Pick highlight for top 3 — unique content per page */}
                {i < 3 && alt.pros && alt.pros.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-800 leading-relaxed">
                    <span className="font-bold uppercase tracking-wide text-blue-600 block mb-1">
                      #{i + 1} Editor Pick
                    </span>
                    {alt.pros[0]}{alt.pros[1] ? ` ${alt.pros[1]}` : ''}
                    {alt.pricing_type === 'Free' || alt.pricing_type === 'Open Source'
                      ? ` Available at no cost.`
                      : tool.starting_price > 0 && alt.starting_price > 0 && alt.starting_price < tool.starting_price * 0.7
                      ? ` Starting at $${alt.starting_price} — ${Math.round((1 - alt.starting_price / tool.starting_price) * 100)}% less than ${tool.name}.`
                      : ''}
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-4">
                  <Link
                    href={`/tools/${alt.slug}`}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Full {alt.name} Profile →
                  </Link>
                  {(() => {
                    const compareSlug = [tool.slug, alt.slug].sort().join('-vs-');
                    if (!validCompareSlugs.has(compareSlug)) return null;
                    return (
                      <Link
                        href={`/compare/${compareSlug}`}
                        className="text-xs font-bold text-slate-600 hover:underline"
                      >
                        Compare Side-by-Side
                      </Link>
                    );
                  })()}
                </div>
              </div>
            </div>
          </li>
        ))}
      </FoldingList>
    </section>
  );
}

function renderAlternativesCTA(tool: Tool) {
  return (
    <section className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 text-center relative overflow-hidden shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
      <h2 className="text-2xl font-bold">Build Your Custom Shortlist</h2>
      <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
        Still undecided? Answer six rapid questions in our Smart Matchmaker to compare {tool.name} and these vetted competitors directly against your specific budget and machine limits.
      </p>
      <Link
        href="/matchmaker"
        className="inline-block mt-5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        Launch Matchmaker →
      </Link>
    </section>
  );
}

function renderAlternativesGuides(tool: Tool, style: AlternativeStyle) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  const compatibleGuides = ARTICLES_LIST
    .filter(g => isArticleCompatibleWithTool(g.title, g.category, tool))
    .slice(0, 3);

  if (compatibleGuides.length === 0) return null;

  const guides = compatibleGuides.map(g => {
    const localized = getLocalizedTitleAndExcerpt(g.title, g.excerpt, g.keyword, g.category, tool);
    return {
      ...g,
      title: localized.title,
      excerpt: localized.excerpt,
      slug: `${tool.slug}-${g.category}-${g.id.split('-').pop()}`,
    };
  });

  return (
    <section className="mt-12 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient}`} />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Expert Technical Guides for {tool.name}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {guides.map(g => (
          <Link
            key={g.id}
            href={`/guides/${g.slug}`}
            className="block p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group"
          >
            <span className={`text-[9px] font-bold uppercase tracking-widest ${style.accentText}`}>
              {g.category}
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
              {g.title}
            </h3>
            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{g.excerpt}</p>
            <span className="text-[10px] font-bold text-slate-400 mt-3 block">{g.readTime}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function renderRelatedLinks(tool: Tool) {
  const licensingTools = [
    'autocad', 'solidworks', 'revit', 'autodesk-inventor', 'rhino-3d',
    'microstation', 'archicad', 'sketchup', 'ptc-creo', 'catia',
    'siemens-nx', 'vectorworks', 'freecad', 'fusion-360', 'civil-3d',
    'bricscad', 'draftsight', 'gstarcad', 'zwcad', 'nanocad'
  ];
  const draftingTools = [
    'autocad', 'solidworks', 'revit', 'autodesk-inventor', 'rhino-3d',
    'microstation', 'archicad', 'sketchup', 'ptc-creo', 'catia',
    'siemens-nx', 'vectorworks', 'freecad', 'fusion-360', 'civil-3d',
    'bricscad', 'draftsight', 'gstarcad', 'zwcad'
  ];

  const hasShield = process.env.NODE_ENV === 'development' && licensingTools.includes(tool.slug);
  const hasStandards = process.env.NODE_ENV === 'development' && draftingTools.includes(tool.slug);

  // Find a specific PK pair involving this tool to make this block highly relevant
  const matchedPair = comparisonPairs().find(
    pair => pair.a.slug === tool.slug || pair.b.slug === tool.slug
  );
  
  const comparisonHref = matchedPair ? `/compare/${matchedPair.pairSlug}` : '/compare';
  const comparisonLabel = matchedPair 
    ? `Compare vs ${matchedPair.a.slug === tool.slug ? matchedPair.b.name : matchedPair.a.name}` 
    : 'Custom Comparison Matrix';

  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Related Engineering Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href={`/tools/${tool.slug}`}
          className="block p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Full Analysis</div>
          <div className="mt-1 font-bold text-slate-900">{tool.name} Benchmark Profile</div>
        </Link>
        <Link
          href={comparisonHref}
          className="block p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Side-by-Side Comparison</div>
          <div className="mt-1 font-bold text-slate-900">{comparisonLabel}</div>
        </Link>
        {hasShield && (
          <Link
            href={`/guides/shield-${tool.slug}`}
            className="block p-4 rounded-2xl bg-white border border-rose-200 hover:border-rose-300 hover:shadow-sm transition-all"
          >
            <div className="text-xs uppercase tracking-wider text-rose-500 font-bold">License Security</div>
            <div className="mt-1 font-bold text-slate-900">{tool.name} EULA Audit Guard</div>
          </Link>
        )}
        {hasStandards && (
          <Link
            href={`/guides/standards-iso-${tool.slug}`}
            className="block p-4 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-300 hover:shadow-sm transition-all"
          >
            <div className="text-xs uppercase tracking-wider text-emerald-600 font-bold">Drafting Standard</div>
            <div className="mt-1 font-bold text-slate-900">{tool.name} ISO Layer Mapping</div>
          </Link>
        )}
      </div>
    </section>
  );
}

// --- MAIN CONTROLLER PAGE ---

function getDynamicAlternativesIntro(tool: Tool, alts: Tool[], archetype: string): string {
  const count = alts.length;

  // Pricing signal
  const pricingSignal = tool.pricing_type === 'Subscription'
    ? `${tool.name} is subscription-only — teams that need perpetual ownership or want to cap long-term spend`
    : tool.pricing_type === 'Perpetual'
    ? `${tool.name} uses perpetual licensing — teams needing cloud collaboration or flexible seat scaling`
    : tool.pricing_type === 'Free' || tool.pricing_type === 'Open Source'
    ? `Teams upgrading from ${tool.name}'s open-source model to a commercially supported platform`
    : `Teams evaluating ${tool.name}'s ${tool.pricing_type.toLowerCase()} licensing model`;

  // Platform signal
  const platformNote = tool.platforms?.length === 1 && tool.platforms[0] === 'Windows'
    ? ` or need macOS / Linux / web access`
    : tool.platforms?.length === 1 && tool.platforms[0] === 'macOS'
    ? ` or need Windows / cross-platform compatibility`
    : '';

  // Top con signal
  const topCon = tool.cons?.[0]
    ? ` The most cited pain point: ${tool.cons[0].toLowerCase().replace(/\.$/, '')}.`
    : '';

  // Cheapest alt signal
  const cheapestFree = alts.find(a => a.pricing_type === 'Free' || a.pricing_type === 'Open Source');
  const cheapestNote = cheapestFree ? ` ${cheapestFree.name} is our top free pick.` : '';

  if (archetype === 'technical-migration') {
    return `${pricingSignal}${platformNote} are the most common triggers for this search.${topCon} Below are ${count} hand-vetted equivalents our editors evaluated for DWG/RVT file integrity, AutoLISP/API compatibility, and network deployment feasibility.${cheapestNote}`;
  }
  if (archetype === 'creative-styling') {
    return `${pricingSignal}${platformNote} typically drive the search for a ${tool.name} equivalent.${topCon} We reviewed ${count} comparable tools focusing on G2 surface continuity, viewport GPU performance, and clean watertight export for visualization or manufacturing pipelines.${cheapestNote}`;
  }
  return `${pricingSignal}${platformNote} commonly look for equivalent software.${topCon} Below are ${count} options evaluated for file format openness, scripting extensibility, and EDA/CAM workflow fit.${cheapestNote}`;
}

export default async function AlternativesPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const alts = alternativesFor(tool);
  const style = getStyleForAlternatives(tool);

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

      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Dynamic Colorful Gradient Accent */}
        <div className={`w-full py-1 bg-gradient-to-r ${style.gradient}`} />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Breadcrumb nav */}
          <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:underline">Tools</Link>
            <span>/</span>
            <Link href={`/tools/${tool.slug}`} className="hover:underline">{tool.name}</Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Alternatives</span>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest ${style.badgeBg}`}>
                {style.themeBadgeText}
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {alts.length} Evaluated Competitors
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {pageTitle(tool, alts.length)}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              {getDynamicAlternativesIntro(tool, alts, style.archetype)}
            </p>
          </header>

          {/* Golden Standard Spotlight Card on Target Tool */}
          <section className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 mb-10 shadow-sm">
            <div className="flex items-start gap-4">
              <ToolLogo
                slug={tool.slug}
                src={tool.logo_url}
                websiteUrl={tool.official_url}
                name={tool.name}
                priority={true}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0 border border-slate-100 shadow-inner"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Evaluating alternatives to
                </div>
                <Link href={`/tools/${tool.slug}`} className="text-xl font-black text-slate-900 hover:text-blue-600 transition-colors">
                  {tool.name}
                </Link>
                <div className="mt-1 text-xs text-slate-500 font-semibold">
                  {pricingLabel(tool)} · {tool.platforms.join(' / ')} · Editor Score: ★ {tool.score.toFixed(1)}/5
                </div>
              </div>
            </div>
          </section>

          {/* --- ASYMMETRICAL ORDER FLOW ENGINE BY ARCHETYPE --- */}

          {/* Flow 1: Technical & Engineering (Migration risk first, list, FAQs, CTA) */}
          {style.archetype === 'technical-migration' && (
            <>
              <MigrationRiskWidget tool={tool} />
              {renderAlternativesList(tool, alts, style)}
              {renderAlternativesFAQs(tool, alts, style)}
              {renderAlternativesCTA(tool)}
              {renderAlternativesGuides(tool, style)}
              {renderRelatedLinks(tool)}
            </>
          )}

          {/* Flow 2: Creative & Design (Mesh modeler first, list, FAQs, CTA) */}
          {style.archetype === 'creative-styling' && (
            <>
              <MeshNurbsFidelityWidget />
              {renderAlternativesList(tool, alts, style)}
              {renderAlternativesFAQs(tool, alts, style)}
              {renderAlternativesCTA(tool)}
              {renderAlternativesGuides(tool, style)}
              {renderRelatedLinks(tool)}
            </>
          )}

          {/* Flow 3: Open & Specialized (List first, Open standards guide, FAQs, CTA) */}
          {style.archetype === 'open-specialized' && (
            <>
              {renderAlternativesList(tool, alts, style)}
              <OpenStandardsWidget />
              {renderAlternativesFAQs(tool, alts, style)}
              {renderAlternativesCTA(tool)}
              {renderAlternativesGuides(tool, style)}
              {renderRelatedLinks(tool)}
            </>
          )}

        </article>
      </main>
    </>
  );
}

export const dynamic = 'force-static';
