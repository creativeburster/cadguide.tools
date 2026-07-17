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
import { pageMetadata, siteBreadcrumbLd, SITE_URL, softwareApplicationLd } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';
import { FoldingList } from '@/components/folding-list';
import React from 'react';

export const dynamicParams = false;

export function generateStaticParams() {
  return platformPagePaths();
}

const YEAR = 2026;

interface PlatformStyle {
  archetype: 'desktop-power' | 'mobile-flexible' | 'web-cloud';
  gradient: string;
  badgeAccent: string;
  accentText: string;
  badgeBg: string;
  platformBadgeText: string;
}

function getStyleForPlatform(slug: string): PlatformStyle {
  const desktop = ['windows', 'linux', 'mac'];
  const mobile = ['ios', 'android'];
  
  if (desktop.includes(slug)) {
    return {
      archetype: 'desktop-power',
      gradient: 'from-slate-700 via-slate-800 to-slate-900',
      badgeAccent: 'bg-slate-100 text-slate-800 border-slate-200',
      accentText: 'text-slate-700',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      platformBadgeText: 'Workstation Grade',
    };
  }
  if (mobile.includes(slug)) {
    return {
      archetype: 'mobile-flexible',
      gradient: 'from-violet-600 to-indigo-700',
      badgeAccent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      accentText: 'text-indigo-600',
      badgeBg: 'bg-violet-100 text-violet-800 border-violet-200',
      platformBadgeText: 'Mobile Ecosystem',
    };
  }
  return {
    archetype: 'web-cloud',
    gradient: 'from-teal-600 to-cyan-700',
    badgeAccent: 'bg-teal-50 text-teal-700 border-teal-100',
    accentText: 'text-teal-700',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    platformBadgeText: 'Browser SaaS',
  };
}

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

function faqLd(p: PlatformPage) {
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

// --- CURATED WIDGETS ---

function WorkstationOptimizationWidget({ slug }: { slug: string }) {
  const optimizations = {
    'windows': {
      title: "Windows CAD Hardware Optimization Guide",
      steps: [
        "Graphics Driver Selection: Always download the dedicated ISV-certified drivers (NVIDIA RTX Enterprise / AMD Radeon Pro) instead of mainstream gaming drivers to prevent viewport crashes in SolidWorks and Revit.",
        "Processor Management: Select a CPU with a high single-core turbo clock speed (5.0GHz+), as standard parametric feature trees are calculated sequentially on a single CPU thread.",
        "DirectX/Vulkan Setup: Enable hardware acceleration inside your CAD settings to utilize GPU parallelization for real-time shadow and ambient occlusion calculations."
      ]
    },
    'linux': {
      title: "Linux Engineering Workspace Guide",
      steps: [
        "Native Kernels first: Run native Linux builds of BricsCAD, FreeCAD, and KiCad to maintain full viewport performance and prevent emulation CPU bottlenecking.",
        "Wine / Crossover Tuning: For Windows-only tools, utilize custom Wine prefixes with DXVK enabled to translate DirectX 11/12 calls directly into Vulkan graphics commands.",
        "Graphics Environment: Prefer X11 or a fully coordinated Wayland compositor (like Sway or GNOME) with correct OpenGL fallback layers to prevent mouse tracking latency."
      ]
    },
    'mac': {
      title: "Apple Silicon CAD Optimization Guide",
      steps: [
        "Unified Memory Benefit: Apple M-series chips share memory between CPU and GPU. Models with 32GB+ unified memory can render massive 3D models that would exceed typical GPU VRAM on Windows.",
        "Rosetta 2 Performance: Most legacy x86 CAD tools run seamlessly on Rosetta 2, but prioritize tools shipping native Apple Silicon arm64 builds (like Vectorworks and Shapr3D) for 2x battery life.",
        "Thermal Management: If buying a MacBook for heavy CAD or rendering, choose a 'MacBook Pro' with active fan cooling over the fanless MacBook Air to prevent thermal throttling during long simulation runs."
      ]
    }
  }[slug] as { title: string; steps: string[] } | undefined;

  if (!optimizations) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{optimizations.title}</span>
      </div>
      <div className="space-y-3">
        {optimizations.steps.map((step, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed flex items-start gap-3">
            <span className="font-bold text-indigo-600 flex-shrink-0">Step {idx + 1}:</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileCapabilityWidget({ slug }: { slug: string }) {
  const capabilities = {
    'ios': {
      title: "iPadOS Stylus & Touch CAD Capability Matrix",
      points: [
        "Apple Pencil Support: Core tools like Shapr3D use precise pressure and tilt tracking to sketch lines and parameters directly on 3D surfaces.",
        "Mobile Viewport Speed: M-series iPad Pros render high-poly models on par with desktop workstations, but standard iPads may experience lag on multi-gigabyte models.",
        "Offline Synchronization: Save models locally before entering job sites. The app will sync changes to your BIM cloud server as soon as connection is restored."
      ]
    },
    'android': {
      title: "Android Touch & Stylus CAD Capability Matrix",
      points: [
        "Precise Active Stylus: Leverage high-precision active stylus support (e.g., Samsung S-Pen) for precise vector drafting and dimension edits instead of finger touch.",
        "Field Collaboration: Use Android devices as active redlining spaces on site, modifying 2D DWGs and adding photo attachments directly to layers.",
        "Hardware Requirements: Prioritize devices with high color accuracy (100% sRGB/DCI-P3) and at least 8GB of RAM for fluid 3D model rotations."
      ]
    }
  }[slug] as { title: string; points: string[] } | undefined;

  if (!capabilities) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 18.75h12" />
        </svg>
        <span>{capabilities.title}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {capabilities.points.map((p, idx) => (
          <div key={idx} className="p-4 bg-violet-50/20 rounded-xl border border-violet-100 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-violet-700 block mb-1">Standard {idx + 1}</span>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function CloudNativeSecurityWidget() {
  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Web CAD Security & Performance Requirements</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Graphics Standard</span>
          <span className="text-slate-600 mt-1 inline-block">WebGPU (Chrome/Safari) & WebGL 2.0 (fallback layers)</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Network Requirements</span>
          <span className="text-slate-600 mt-1 inline-block">WebSocket persistent connection, &lt; 50ms latency recommended</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Enterprise Compliance</span>
          <span className="text-slate-600 mt-1 inline-block">SOC 2 Type II, ISO 27001, single sign-on (SAML/OIDC) integration</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Data Protection</span>
          <span className="text-slate-600 mt-1 inline-block">AES-256 at-rest, TLS 1.3 in-transit encryption standard</span>
        </div>
      </div>
      <div className="text-xs text-teal-700 bg-teal-50 border border-teal-100 rounded-xl p-3 flex gap-2">
        <span className="font-bold flex-shrink-0">Cloud Insight:</span>
        <span>Pure browser-based CAD environments require zero local software maintenance or license keys, allowing instant scaling of seats while completely securing intellectual property within your dedicated central server database.</span>
      </div>
    </div>
  );
}

// --- RENDERING FLOW PIPELINES ---

function renderPlatformFAQs(p: PlatformPage, style: PlatformStyle) {
  if (!p.faqs || p.faqs.length === 0) return null;
  return (
    <section className="mt-12 rounded-2xl bg-white border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient}`} />
        Frequently asked
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
  );
}

function renderPlatformList(list: Tool[], style: PlatformStyle, p: PlatformPage) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Ranked {p.displayName} Solutions
        </h2>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${style.badgeAccent}`}>
          {list.length} Verified
        </span>
      </div>

      <FoldingList
        itemType="ol"
        className="space-y-5"
      >
        {list.map((t, i) => (
          <li key={t.slug} className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex-shrink-0 text-2xl font-extrabold text-slate-400 w-8 sm:w-10 text-center">{i + 1}.</div>
              <ToolLogo slug={t.slug} src={t.logo_url} websiteUrl={t.official_url} name={t.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Link href={`/tools/${t.slug}`} className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600">{t.name}</Link>
                  <span className="text-sm text-slate-500">{pricingLabel(t)} · {t.platforms.join(' / ')}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-amber-500 font-bold">★ {t.score.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">/ 5 Rating</span>
                </div>
                <p className="mt-3 text-slate-700 leading-relaxed text-sm sm:text-base">{t.short_desc}</p>
                <div className="mt-4">
                  <Link href={`/tools/${t.slug}`} className="text-xs font-bold text-blue-600 hover:underline">
                    View full profile and platform benchmarks →
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </FoldingList>
    </section>
  );
}

function renderPlatformCTA(p: PlatformPage, listLength: number) {
  return (
    <section className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
      <h2 className="text-2xl font-bold">Find the right tool faster</h2>
      <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
        Run our Matchmaker to filter all {listLength} {p.displayName} tools against your real budget, team size, and feature needs.
      </p>
      <Link href="/matchmaker" className="inline-block mt-5 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 shadow-lg transition-all">
        Launch Matchmaker →
      </Link>
    </section>
  );
}

function renderPlatformLinks(p: PlatformPage) {
  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-bold text-slate-900 mb-3">Other platforms</h2>
      <ul className="flex flex-wrap gap-2 text-sm">
        {Object.values(PLATFORM_PAGES)
          .filter((x) => x.slug !== p.slug)
          .map((x) => (
            <li key={x.slug}>
              <Link href={`/platforms/${x.slug}`} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
                CAD for {x.displayName}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}

// --- MAIN CONTROLLER PAGE ROUTE ---

export default async function PlatformPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const p = getPlatformPage(slug);
  if (!p) notFound();

  const list = toolsForPlatform(p);
  const style = getStyleForPlatform(slug);
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Platforms', path: '/platforms' },
    { name: p.displayName, path: `/platforms/${p.slug}` },
  ]);
  const faqsSchema = faqLd(p);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(p, list)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(p, list.length)) }} />
      {faqsSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqsSchema) }} />}
      {list.slice(0, 5).map((t, i) => (
        <script key={`software-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationLd(t)) }} />
      ))}

      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Colorful Gradient Header Accent */}
        <div className={`w-full py-1.5 bg-gradient-to-r ${style.gradient}`} />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Breadcrumb nav */}
          <nav className="text-sm text-slate-500 mb-6 flex flex-wrap gap-x-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/platforms" className="hover:underline">Platforms</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">{p.displayName}</span>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${style.badgeBg}`}>
                {style.platformBadgeText}
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {list.length} compatible choices
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {pageTitle(p, list.length)}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">{p.intro}</p>
          </header>

          {/* --- ASYMMETRICAL ORDER FLOW ENGINE BY ARCHETYPE --- */}

          {/* Flow 1: Desktop Power (Optimization first, list, FAQs, CTA) */}
          {style.archetype === 'desktop-power' && (
            <>
              <WorkstationOptimizationWidget slug={slug} />
              {renderPlatformList(list, style, p)}
              {renderPlatformFAQs(p, style)}
              {renderPlatformCTA(p, list.length)}
              {renderPlatformLinks(p)}
            </>
          )}

          {/* Flow 2: Mobile Flexible (FAQ first, list, Mobile Matrix, CTA) */}
          {style.archetype === 'mobile-flexible' && (
            <>
              {renderPlatformFAQs(p, style)}
              {renderPlatformList(list, style, p)}
              <MobileCapabilityWidget slug={slug} />
              {renderPlatformCTA(p, list.length)}
              {renderPlatformLinks(p)}
            </>
          )}

          {/* Flow 3: Web Cloud (List first, Web Security, FAQs, CTA) */}
          {style.archetype === 'web-cloud' && (
            <>
              {renderPlatformList(list, style, p)}
              <CloudNativeSecurityWidget />
              {renderPlatformFAQs(p, style)}
              {renderPlatformCTA(p, list.length)}
              {renderPlatformLinks(p)}
            </>
          )}

        </article>
      </main>
    </>
  );
}

export const dynamic = 'force-static';
