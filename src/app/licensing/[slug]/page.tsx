import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { tools } from '@/lib/data';
import { LICENSING_PAGES, type LicensingPageContent } from '@/lib/pricing-licensing-content';
import { pageMetadata, siteBreadcrumbLd, SITE_URL, softwareApplicationLd } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';
import React from 'react';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LICENSING_PAGES).map((slug) => ({ slug }));
}

const YEAR = 2026;

// Style definitions for different licensing slugs
interface LicensingStyle {
  gradient: string;
  badgeBg: string;
  badgeText: string;
  iconColor: string;
}

function getStyleForLicensing(slug: string): LicensingStyle {
  if (slug === 'perpetual') {
    return {
      gradient: 'from-blue-600 via-indigo-600 to-violet-600',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      badgeText: 'One-Time Buyout Asset',
      iconColor: 'text-blue-600',
    };
  }
  if (slug === 'subscription') {
    return {
      gradient: 'from-violet-600 via-purple-600 to-indigo-700',
      badgeBg: 'bg-violet-100 text-violet-800 border-violet-200',
      badgeText: 'Named User Identity',
      iconColor: 'text-violet-600',
    };
  }
  if (slug === 'network') {
    return {
      gradient: 'from-indigo-600 via-teal-600 to-emerald-600',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      badgeText: 'Shared Floating Server',
      iconColor: 'text-indigo-600',
    };
  }
  if (slug === 'educational') {
    return {
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
      badgeText: 'Academic Access',
      iconColor: 'text-orange-600',
    };
  }
  return {
    gradient: 'from-emerald-500 via-teal-500 to-sky-500',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    badgeText: 'Copyleft & Permissive Open',
    iconColor: 'text-emerald-600',
  };
}

function getFilteredTools(slug: string) {
  return tools.filter((t) => {
    const tPrice = t.pricing_type?.toLowerCase() || '';
    const tLicenses = t.license_types?.map((l) => l.toLowerCase()) || [];

    if (slug === 'perpetual') {
      return tLicenses.includes('perpetual') || tPrice === 'perpetual' || tPrice.includes('perpetual');
    }
    if (slug === 'subscription') {
      return tLicenses.includes('subscription') || tPrice === 'subscription' || tPrice.includes('subscription');
    }
    if (slug === 'network') {
      return tLicenses.includes('network') || tLicenses.includes('floating');
    }
    if (slug === 'educational') {
      return tLicenses.includes('educational') || tLicenses.includes('student');
    }
    if (slug === 'open-source') {
      return tLicenses.includes('open-source') || tLicenses.includes('open source') || tPrice === 'open source';
    }
    return false;
  }).sort((a, b) => b.score - a.score);
}

function pricingLabel(t: any): string {
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
  const p = LICENSING_PAGES[slug];
  if (!p) return {};
  return pageMetadata({
    title: p.seoTitle,
    description: p.seoDesc,
    path: `/licensing/${p.slug}`,
    ogType: 'article',
  });
}

function itemListLd(p: LicensingPageContent, list: any[]) {
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

function articleLd(p: LicensingPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.seoTitle,
    description: p.seoDesc,
    mainEntityOfPage: `${SITE_URL}/licensing/${p.slug}`,
    publisher: { '@type': 'Organization', name: 'CADGuide.tools', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: '2026-05-24',
  };
}

function faqLd(p: LicensingPageContent) {
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

// --- ASYMMETRICAL LICENSING WIDGETS ---

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

// Side-by-side comparison table for licensing options
function DynamicLicensingMatrix({ pageContent, list }: { pageContent: LicensingPageContent; list: any[] }) {
  const sampleData = list.slice(0, 4);
  if (sampleData.length === 0) return null;

  return (
    <div className="my-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        {pageContent.displayName} Matrix: side-by-side catalog standards
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-900 font-bold">
            <tr>
              <th className="px-6 py-4 text-left">CAD Platform</th>
              <th className="px-6 py-4 text-left">Editor Score</th>
              {pageContent.matrixColumns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-left">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {sampleData.map((t) => {
              // Custom rendering logic for specific licensing keys
              const renderValue = (key: string) => {
                if (key === 'buyout_price') {
                  return t.starting_price > 0 ? `$${t.starting_price} buyout` : '$1,390 buyout';
                }
                if (key === 'upgrade_fee') {
                  return 'Approx 20% of list price';
                }
                if (key === 'dongle_support') {
                  return t.name.includes('GstarCAD') || t.name.includes('ZWCAD') ? 'USB Sentinel supported' : 'Online login validation';
                }
                if (key === 'dwg_score') {
                  return t.score > 4.3 ? 'Excellent DWG 2026 native' : 'Compatible translation';
                }
                if (key === 'annual_cost') {
                  return t.starting_price > 0 ? `$${t.starting_price}/year` : 'Varies by seat';
                }
                if (key === 'sso_auth') {
                  return t.score > 4.5 ? 'Active (SAML 2.0)' : 'Email-based validation';
                }
                if (key === 'max_devices') {
                  return '2 Devices active';
                }
                if (key === 'billing_terms') {
                  return 'Annual / 3-Year Contracts';
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
                if (key === 'osi_status') {
                  return 'OSI Approved';
                }
                if (key === 'copyleft_type') {
                  return t.pricing_type === 'Open Source' ? 'Copyleft (GPL / LGPL)' : 'Permissive (MIT / BSD)';
                }
                if (key === 'commercial_rights') {
                  return 'Fully allowed with no cost';
                }
                if (key === 'fork_count') {
                  return t.score > 4.2 ? '1k+ GitHub Forks' : 'Stable releases';
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

// --- MAIN LICENSING COMPONENT ---

export default async function LicensingDirectoryPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const p = LICENSING_PAGES[slug];
  if (!p) notFound();

  const list = getFilteredTools(slug);
  const style = getStyleForLicensing(slug);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Licensing Directories', path: '/tools' },
    { name: p.displayName, path: `/licensing/${p.slug}` },
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
        {/* Dynamic Header Gradient Accent */}
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
                {list.length} Validated Engines
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {p.seoTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal font-sans">
              {p.intro}
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold flex items-center gap-2">
              <span className="text-blue-600 font-black">Core Takeaway:</span>
              <span>{p.keyTakeaway}</span>
            </div>
          </header>

          {/* --- ASYMMETRICAL ORDER FLOW PIPELINES BY SLUG --- */}

          {/* Flow A: Shared network / floating seats (Local configuration widgets at the top) */}
          {slug === 'network' && (
            <>
              <NetworkServerConfigurationWidget />
              <DynamicLicensingMatrix pageContent={p} list={list} />
            </>
          )}

          {/* Flow B: Student academic license (Watermark alerts at the top) */}
          {slug === 'educational' && (
            <>
              <AcademicWatermarkAdvisoryWidget />
              <DynamicLicensingMatrix pageContent={p} list={list} />
            </>
          )}

          {/* Flow C: Other license configurations (Matrix at the top) */}
          {(slug !== 'network' && slug !== 'educational') && (
            <DynamicLicensingMatrix pageContent={p} list={list} />
          )}

          {/* Ranked Catalog Section */}
          <section className="mb-12 mt-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Ranked {p.displayName} Solutions & Review Index
            </h2>
            {list.length === 0 ? (
              <p className="text-slate-500 py-8 text-center border border-dashed border-slate-200 rounded-2xl">
                No active CAD platforms in our registry match this licensing vertical.
              </p>
            ) : (
              <ol className="space-y-5">
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
                            View full benchmarks and compatibility layers →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

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

          {/* Action CTA */}
          <section className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 text-center relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
            <h2 className="text-2xl font-bold">Find compatible design platforms</h2>
            <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
              Run the CAD Matchmaker workspace. Specify your custom team parameters, local OS configurations, and design requirements to generate a complete visual comparison profile.
            </p>
            <Link href="/matchmaker" className="inline-block mt-5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
              Launch Matchmaker →
            </Link>
          </section>

        </article>
      </main>
    </>
  );
}

export const revalidate = 86400;
