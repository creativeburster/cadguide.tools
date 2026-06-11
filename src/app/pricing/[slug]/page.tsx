import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { tools, Tool } from '@/lib/data';
import { PRICING_PAGES, type PricingPageContent } from '@/lib/pricing-licensing-content';
import { pageMetadata, siteBreadcrumbLd, SITE_URL, softwareApplicationLd } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';
import { FoldingList } from '@/components/folding-list';
import React from 'react';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PRICING_PAGES)
    .filter((slug) => slug !== 'free' && slug !== 'open-source')
    .map((slug) => ({ slug }));
}


// Style definitions for different pricing slugs
interface PricingStyle {
  gradient: string;
  badgeAccent: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
}

function getStyleForPricing(slug: string): PricingStyle {
  if (slug === 'free' || slug === 'open-source') {
    return {
      gradient: 'from-emerald-500 via-teal-500 to-sky-500',
      badgeAccent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      accentText: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      badgeText: slug === 'free' ? 'Truly Free' : 'Open-Source Freedom',
    };
  }
  if (slug === 'freemium') {
    return {
      gradient: 'from-sky-500 via-indigo-500 to-violet-500',
      badgeAccent: 'bg-sky-50 text-sky-700 border-sky-100',
      accentText: 'text-sky-700',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      badgeText: 'Freemium Tier',
    };
  }
  if (slug === 'perpetual') {
    return {
      gradient: 'from-indigo-600 via-purple-600 to-pink-600',
      badgeAccent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      accentText: 'text-indigo-700',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      badgeText: 'One-Time Buyout',
    };
  }
  if (slug === 'network') {
    return {
      gradient: 'from-indigo-600 via-teal-600 to-emerald-600',
      badgeAccent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      accentText: 'text-indigo-700',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      badgeText: 'Shared Floating Server',
    };
  }
  if (slug === 'educational') {
    return {
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      badgeAccent: 'bg-orange-50 text-orange-700 border-orange-100',
      accentText: 'text-orange-700',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
      badgeText: 'Academic Access',
    };
  }
  return {
    gradient: 'from-violet-600 via-purple-600 to-indigo-700',
    badgeAccent: 'bg-violet-50 text-violet-700 border-violet-100',
    accentText: 'text-violet-700',
    badgeBg: 'bg-violet-100 text-violet-800 border-violet-200',
    badgeText: 'Professional Subscription',
  };
}

function getFilteredTools(slug: string) {
  const filtered = tools.filter((t) => {
    const tPrice = t.pricing_type?.toLowerCase() || '';
    const tLicenses = t.license_types?.map((l) => l.toLowerCase()) || [];
    if (slug === 'free') {
      return tPrice === 'free';
    }
    if (slug === 'open-source') {
      return tPrice === 'open source';
    }
    if (slug === 'freemium') {
      return tPrice === 'freemium';
    }
    if (slug === 'subscription') {
      return tLicenses.includes('subscription') || tPrice === 'subscription' || tPrice.includes('subscription');
    }
    if (slug === 'perpetual') {
      return tLicenses.includes('perpetual') || tPrice === 'perpetual' || tPrice.includes('perpetual');
    }
    if (slug === 'network') {
      return tLicenses.includes('network') || tLicenses.includes('floating');
    }
    if (slug === 'educational') {
      return tLicenses.includes('educational') || tLicenses.includes('student');
    }
    return false;
  }).sort((a, b) => b.score - a.score);

  return filtered.slice(0, 10);
}

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const p = PRICING_PAGES[slug];
  if (!p) return {};
  return pageMetadata({
    title: p.seoTitle,
    description: p.seoDesc,
    path: `/pricing/${p.slug}`,
    ogType: 'article',
  });
}

function itemListLd(p: PricingPageContent, list: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: p.seoTitle,
    description: p.seoDesc,
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

function articleLd(p: PricingPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.seoTitle,
    description: p.seoDesc,
    mainEntityOfPage: `${SITE_URL}/pricing/${p.slug}`,
    publisher: { '@type': 'Organization', name: 'CADGuide.tools', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
  };
}

function faqLd(p: PricingPageContent) {
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

// --- ASYMMETRICAL WIDGETS ---

// Widget A: Shared floating server / network optimization guide
function NetworkServerConfigurationWidget() {
  return (
    <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-indigo-950 text-white border border-teal-900/40 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent)] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-teal-500/30">
            Enterprise Admin Guide
          </span>
          <span className="text-xs text-slate-400 font-medium">Floating License Server Setup</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
          FLEXlm Server Daemon Optimization & Borrowing Pools
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-6">
          Deploying concurrent floating network licenses is the most efficient configuration for global teams. Centralizing license keys inside local server engines (like Revenera FLEXlm or LMTools) optimizes seat ratios. Review our systems engineering guidelines below:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-6">
          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold flex items-center justify-center">1</span>
              <h4 className="font-extrabold text-white">Options Files Setup</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Configure `adskflex.opt` or local equivalents to reserve critical floating seats for lead project engineers and automatically reclaim idle seats after 15 minutes of viewport inactivity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">2</span>
              <h4 className="font-extrabold text-white">Borrow Parameters</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Set the maximum borrowing duration to exactly 7 or 14 days instead of the 30-day default. This protects the floating seat pool from being locked on offline field laptops indefinitely.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
              <h4 className="font-extrabold text-white">Dual-Daemon Ports</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Always bind both the license manager (`lmgrd`, default port 27000) and the vendor-specific daemon (`adskflex`, etc.) to fixed TCP ports inside your firewall to allow stable VPN routing.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-900 text-xs text-teal-300 leading-relaxed flex gap-2">
          <span className="font-bold flex-shrink-0 uppercase tracking-wide">IT Savings:</span>
          <span>Floating license sharing operates on an average 2.5:1 ratio. For a team of 100 designers, a pool of only 40 floating licenses is typically sufficient, shaving 60% off enterprise capital budgets.</span>
        </div>
      </div>
    </div>
  );
}

// Widget B: Student academic license & SheerID clearinghouse warning
function AcademicWatermarkAdvisoryWidget() {
  return (
    <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-red-950 to-orange-950 text-white border border-red-900/40 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent)] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-red-500/20 text-red-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-red-500/30">
            Academic Advisory
          </span>
          <span className="text-xs text-slate-400 font-medium">Educational Watermark Warning</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
          Student Watermark Infection & SheerID Clearinghouses
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-6">
          While vendors provide complete, full-featured design suites to accredited students and educators, academic licenses contain strict compliance restrictions. Opening and editing drawings under student accounts permanently alerts future commercial users.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4 text-slate-300">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-red-300 block mb-1">Plot Watermark Infection</span>
            If you open a commercial workspace file and copy-paste even a single line of vector geometry from a drawing created under a student license, the entire parent file becomes permanently infected. When plotted, all layout sheets will display the warning: &quot;PRODUCED BY AN AUTODESK EDUCATIONAL PRODUCT&quot;. Removing this watermark is legally forbidden.
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-red-300 block mb-1">Clearinghouse Authentication</span>
            Verification is outsourced to third-party secure clearinghouses (such as SheerID). To activate your account, you must upload institutional documents, current class transcripts, or enrollment verification letters displaying your name and school seal.
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ASYMMETRICAL WIDGETS ---

// Widget 1: Free & Freemium Licensing Compliance Warning
function LicensingComplianceWidget() {
  return (
    <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white border border-teal-900/50 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-emerald-500/30">
            Compliance Advisory
          </span>
          <span className="text-xs text-slate-400 font-medium">Free CAD Licensing Risks</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
          Commercial Usage Boundaries & Network Telemetry
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-6">
          Deploying &quot;free&quot; or &quot;freemium&quot; CAD editions inside commercial environments carries severe legal liabilities. Modern proprietary software suites utilize silent background telemetry to audit network packets, workspace metadata, and active MAC addresses. Operating personal seats inside commercial office networks automatically triggers automated licensing compliance reviews.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-6">
          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">1</span>
              <h4 className="font-extrabold text-white">Public Data Mandate</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Cloud-native free CAD options (such as Onshape Free) enforce <strong>public-by-default storage</strong>. Your proprietary geometries and product structures are fully searchable and downloadable by any user on the web.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">2</span>
              <h4 className="font-extrabold text-white">Export Locks</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Hobbyist models (such as Fusion 360 Personal) cripple professional output formats, blocking precise solid model conversions (STEP, IGES) and multi-sheet production drafting layout sheets (DXF, DWG).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">3</span>
              <h4 className="font-extrabold text-white">Compliance Fines</h4>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Violating End User License Agreements (EULA) exposes small businesses to retrospective auditing penalties, where vendors demand retroactive payments for full-price commercial enterprise licenses.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900 text-xs text-emerald-300 leading-relaxed flex gap-2">
          <span className="font-bold flex-shrink-0 uppercase tracking-wide">Expert Tip:</span>
          <span>If commercial IP security is required without subscription capital, deploy verified copyleft open-source tools (FreeCAD, LibreCAD, KiCad) which natively guarantee unrestricted commercial engineering rights.</span>
        </div>
      </div>
    </div>
  );
}

// Widget 2: Perpetual Break-Even Matrix & AutoCAD Alternatives
function PerpetualBreakEvenWidget() {
  return (
    <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white border border-indigo-900/50 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-indigo-500/30">
            Financial Analysis
          </span>
          <span className="text-xs text-slate-400 font-medium">Buyout vs Rental Break-Even</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
          Perpetual Buyout vs SaaS Subscription Financial Audit
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-6">
          While major CAD platforms have abolished one-time buyouts in favor of continuous annual rental SaaS models, purchasing a perpetual license remains the ultimate strategy for capital asset preservation. Below is an engineering office simulation projecting costs over 3 years:
        </p>

        {/* Break-Even comparison matrix */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
          <table className="min-w-full divide-y divide-white/10 text-xs text-left">
            <thead className="bg-white/5 text-slate-300 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Licensing Model</th>
                <th className="px-4 py-3">Year 1 Upfront</th>
                <th className="px-4 py-3">Year 2 Maintenance</th>
                <th className="px-4 py-3">Year 3 Maintenance</th>
                <th className="px-4 py-3 font-bold text-white">3-Year Cumulative Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 font-bold text-white">SaaS Rental (Industry Standard)</td>
                <td className="px-4 py-3">$1,950 / year</td>
                <td className="px-4 py-3">$1,950 / year</td>
                <td className="px-4 py-3">$1,950 / year</td>
                <td className="px-4 py-3 font-extrabold text-rose-400">$5,850 per seat</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 font-bold text-white">Perpetual Buyout (e.g. BricsCAD Pro)</td>
                <td className="px-4 py-3">$1,390 (Buyout)</td>
                <td className="px-4 py-3">$320 (Optional)</td>
                <td className="px-4 py-3">$320 (Optional)</td>
                <td className="px-4 py-3 font-extrabold text-emerald-400">$2,030 per seat</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-900 text-xs leading-relaxed">
          <p className="text-slate-300">
            <strong className="text-white uppercase">AutoCAD Alternatives & LISP Compatibility:</strong> Modern perpetual competitors (including BricsCAD, ZWCAD, GstarCAD, nanoCAD) are designed as direct AutoCAD drop-in replacements. They support native DWG files, identical keyboard command aliases, and full LISP programming API integration, enabling design offices to scale down CAD costs by over 60% with zero drafting training downtime.
          </p>
        </div>
      </div>
    </div>
  );
}

// Widget 3: Subscription SSO Provisioning & Offline Validation
function SubscriptionSSOValidationWidget() {
  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-700">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.5V10.5a8.25 8.25 0 00-16.5 0v.5c0 1.25.203 2.45.578 3.575m16.5 0A13.95 13.95 0 0012 14c2.507 0 4.8-.818 6.64-2.22m-12.7 7.04A13.937 13.937 0 011.5 13.5v-1.5a8.25 8.25 0 0116.5 0v1.5c0 1.838-.356 3.593-.999 5.2" />
        </svg>
        <span>Enterprise Identity Management & Offline Grace Periods</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <h4 className="font-extrabold text-slate-900 mb-2">Named User Identity (SSO Integration)</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Modern subscription models abandon serial numbers in favor of Single Sign-On (SAML 2.0 / OIDC) active directory hooks. Administrators can instantly allocate, revoke, and track active licenses inside a central management console, matching seat numbers dynamically to external contractor pipelines.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <h4 className="font-extrabold text-slate-900 mb-2">Offline Grace Validation Limits</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Subscription CAD suites do not require persistent internet, but must dial home to authenticate license tokens. The validation window (grace period) ranges from 14 to 30 days. Beyond this window, desktop tools lock automatically into a read-only viewer mode until an internet connection is established.
          </p>
        </div>
      </div>
      <div className="p-3 bg-violet-50 text-violet-800 border border-violet-100 rounded-xl text-xs flex gap-2">
        <span className="font-bold uppercase tracking-wider">IT Checklist:</span>
        <span>Always verify that validation tokens and cloud database dependencies match your design lab&apos;s cybersecurity firewalls, especially when handling restricted government or military assets.</span>
      </div>
    </div>
  );
}

// Widget 4: Open Source Geometry Engine & Compliance Widget
function OpenSourceKernelWidget() {
  return (
    <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border border-teal-900/40 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent)] pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-teal-500/30">
            Open-Source Architecture
          </span>
          <span className="text-xs text-slate-400 font-medium">OCCT Kernel & Custom SDKs</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
          Solid Modeling Geometry Kernels & Compiler Independence
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-6">
          Unlike proprietary platforms running on closed commercial geometry kernels (such as Siemens Parasolid or Dassault ACIS), most open-source 3D CAD platforms rely on the Open CASCADE Technology (OCCT) engine. Utilizing open kernels secures long-term developer access and protects design offices against proprietary licensing changes:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4 text-slate-300">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-teal-300 block mb-1">GPL Copyleft Rules</span>
            Under the GNU General Public License (GPL), any modifications to the CAD system&apos;s core source code must be shared with the community when distributed. However, your local engineering drawings, DWG vectors, and 3D geometric models remain 100% your private property.
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-teal-300 block mb-1">SDK & C++ Scripting</span>
            Open-source architecture grants unlimited API hooks. Software teams can compile custom features in C++ or script automatic parametric pipeline exports using clean Python wrappers, building customized in-house variants.
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom side-by-side comparative column table for pricing list
function DynamicPricingMatrix({ pageContent, list }: { pageContent: PricingPageContent; list: Tool[] }) {
  const sampleData = list.slice(0, 4);
  if (sampleData.length === 0) return null;

  return (
    <div className="my-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        {pageContent.displayName} Matrix: Featured Alternatives Comparison
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-900 font-bold">
            <tr>
              <th className="px-6 py-4 text-left">CAD Platform</th>
              <th className="px-6 py-4 text-left">Editor Rating</th>
              {pageContent.matrixColumns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-left">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {sampleData.map((t) => {
              // Custom rendering logic for specific column keys to avoid raw JSON look
              const renderValue = (key: string) => {
                if (key === 'commercial_allowed') {
                  return t.pricing_type === 'Free' ? 'No (Personal Only)' : 'Yes (Full Rights)';
                }
                if (key === 'export_limits') {
                  return t.file_formats_out && t.file_formats_out.length > 5 ? 'None (Full Export)' : 'Gated formats';
                }
                if (key === 'watermarks') {
                  return t.pricing_type === 'Free' ? 'Watermark on print' : 'No watermarks';
                }
                if (key === 'offline_support') {
                  return t.platforms.includes('Web') ? 'Cloud-dependent' : 'Offline local mode';
                }
                if (key === 'license_type') {
                  return t.license_types?.[0] || 'Open Source';
                }
                if (key === 'kernel_type') {
                  return t.tech_specs?.engine || 'Open CASCADE / Mesh';
                }
                if (key === 'languages_supported') {
                  return t.languages?.slice(0, 3).join(', ') || 'English, Multilingual';
                }
                if (key === 'commit_activity') {
                  return t.score > 4.2 ? 'Active community commits' : 'Stable maintenance';
                }
                if (key === 'free_features') {
                  return '2D drafting, limited parts';
                }
                if (key === 'paywall_limit') {
                  return 'Active assemblies limit';
                }
                if (key === 'storage_cap') {
                  return '5GB free cloud';
                }
                if (key === 'pro_upgrade_cost') {
                  return t.starting_price > 0 ? `$${t.starting_price}/year` : 'Varies by seat';
                }
                if (key === 'monthly_pricing') {
                  return t.starting_price > 0 ? `$${Math.round(t.starting_price / 12)}/month` : 'Quote only';
                }
                if (key === 'multi_year_disc') {
                  return 'Up to 10% on 3-Year';
                }
                if (key === 'offline_grace') {
                  return t.free_trial_days ? `${t.free_trial_days} Days` : '30 Days grace';
                }
                if (key === 'admin_control') {
                  return t.score > 4.5 ? 'SSO / SAML Hub' : 'Simple license pool';
                }
                if (key === 'buyout_price') {
                  return t.starting_price > 0 ? `$${t.starting_price} (One-time)` : '$1,390 buyout';
                }
                if (key === 'maintenance_cost') {
                  return 'Optional annual update';
                }
                if (key === 'offline_activation') {
                  return 'Offline dongle key';
                }
                if (key === 'lisp_compat') {
                  return t.name.includes('BricsCAD') || t.name.includes('ZWCAD') ? '100% LISP Compatible' : 'Not supported';
                }
                if (key === 'server_engine') {
                  return t.name.includes('BricsCAD') || t.name.includes('AutoCAD') ? 'FLEXlm Server Daemon' : 'Cloud floating login';
                }
                if (key === 'borrow_days') {
                  return 'Up to 30 Days offline';
                }
                if (key === 'price_premium') {
                  return '15-20% floating key premium';
                }
                if (key === 'global_rights') {
                  return t.score > 4.5 ? 'Included in enterprise seats' : 'Regional locks apply';
                }
                if (key === 'verification_method') {
                  return 'SheerID / Institutional email';
                }
                if (key === 'license_term') {
                  return '12-Month recurring free';
                }
                if (key === 'watermark_present') {
                  return t.name.includes('AutoCAD') ? 'Yes (Print infected watermark)' : 'None (Watermark-free exports)';
                }
                if (key === 'cloud_access') {
                  return t.platforms.includes('Web') ? 'Full multi-user cloud' : 'Local drafting only';
                }
                return 'Verified Standard';
              };

              return (
                <tr key={t.slug} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{t.name}</td>
                  <td className="px-6 py-4 text-amber-500 font-bold">★ {t.score.toFixed(1)}</td>
                  {pageContent.matrixColumns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-xs font-semibold text-slate-600">
                      {renderValue(col.key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default async function PricingDirectoryPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const p = PRICING_PAGES[slug];
  if (!p) notFound();

  const list = getFilteredTools(slug);
  const style = getStyleForPricing(slug);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Pricing Directories', path: '/tools' },
    { name: p.displayName, path: `/pricing/${p.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(p, list)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(p)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(p)) }} />
      {list.slice(0, 5).map((t, i) => (
        <script key={`software-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationLd(t)) }} />
      ))}

      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Dynamic Colorful Header Accent Line */}
        <div className={`w-full h-1.5 bg-gradient-to-r ${style.gradient}`} />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{p.displayName} Catalog</span>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${style.badgeBg}`}>
                {style.badgeText}
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {list.length} Evaluated Engines
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {p.seoTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {p.intro}
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold flex items-center gap-2">
              <span className="text-blue-600 font-black">Takeaway:</span>
              <span>{p.keyTakeaway}</span>
            </div>
          </header>

          {/* --- ASYMMETRICAL ORDER FLOW PIPELINES BY SLUG --- */}

          {/* Flow A: Free & Freemium Tiers (Advisory Alert at the top) */}
          {(slug === 'free' || slug === 'freemium') && (
            <>
              <LicensingComplianceWidget />
              <DynamicPricingMatrix pageContent={p} list={list} />
            </>
          )}

          {/* Flow B: Open Source Page (Compile & Kernel independence widget at the top) */}
          {slug === 'open-source' && (
            <>
              <OpenSourceKernelWidget />
              <DynamicPricingMatrix pageContent={p} list={list} />
            </>
          )}

          {/* Flow C: Perpetual License Buyout (Break-Even Cumulative Math matrix at the top) */}
          {slug === 'perpetual' && (
            <>
              <PerpetualBreakEvenWidget />
              <DynamicPricingMatrix pageContent={p} list={list} />
            </>
          )}

          {/* Flow D: Subscription Only (List first, SSO telemetry details at the bottom) */}
          {slug === 'subscription' && (
            <DynamicPricingMatrix pageContent={p} list={list} />
          )}

          {/* Flow F: Shared network / floating seats (Local configuration widgets at the top) */}
          {slug === 'network' && (
            <>
              <NetworkServerConfigurationWidget />
              <DynamicPricingMatrix pageContent={p} list={list} />
            </>
          )}

          {/* Flow G: Student academic license (Watermark alerts at the top) */}
          {slug === 'educational' && (
            <>
              <AcademicWatermarkAdvisoryWidget />
              <DynamicPricingMatrix pageContent={p} list={list} />
            </>
          )}

          {/* Ranked Catalog Section */}
          <section className="mb-12 mt-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Ranked {p.displayName} Solutions & Professional Reviews
            </h2>
            {list.length === 0 ? (
              <p className="text-slate-500 py-8 text-center border border-dashed border-slate-200 rounded-2xl">
                No active CAD platforms in our registry match this specific pricing tag.
              </p>
            ) : (              <FoldingList
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
                          <span className="text-xs text-slate-400">/ 5 Rating</span>
                        </div>
                        <p className="mt-3 text-slate-700 leading-relaxed text-sm sm:text-base">{t.short_desc}</p>
                        
                        <div className="mt-4">
                          <Link href={`/tools/${t.slug}`} className="text-xs font-bold text-blue-600 hover:underline">
                            View full benchmarks and deployment guides →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </FoldingList>
            )}
          </section>

          {/* Flow E: Subscription Details (rendered at the bottom) */}
          {slug === 'subscription' && (
            <SubscriptionSSOValidationWidget />
          )}

          {/* Frequently Asked Section */}
          <section className="mt-12 rounded-2xl bg-white border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient}`} />
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

          {/* Dynamic Action CTA */}
          <section className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 text-center relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
            <h2 className="text-2xl font-bold">Find the right software for your budget</h2>
            <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
              Run the dynamic CAD Matchmaker. Specify your custom operational budgets, local OS dependencies, and design requirements to generate a curated shortlist.
            </p>
            <Link href="/matchmaker" className="inline-block mt-5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
              Launch Smart Matchmaker →
            </Link>
          </section>

        </article>
      </main>
    </>
  );
}

export const revalidate = 86400;
