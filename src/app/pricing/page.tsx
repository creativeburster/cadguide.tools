import Link from 'next/link';
import type { Metadata } from 'next';
import { PRICING_PAGES } from '@/lib/pricing-licensing-content';
import { tools } from '@/lib/data';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Software by Pricing Model — Free, Open Source, Perpetual Buyouts',
  description:
    'Find CAD, BIM, CAE, and EDA tools matching your budget constraints. Compare free platforms, open-source software, freemium options, subscription-only SaaS, and perpetual buyout licenses.',
  path: '/pricing',
});

function getToolsCount(slug: string): number {
  return tools.filter((t) => {
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
  }).length;
}

export default function PricingIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Visual Header Accent */}
      <div className="w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">Pricing</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            CAD Software by Pricing Category
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-3xl">
            Software licensing and ownership structures impact both engineering workflows and corporate margins. Select a pricing tier below to discover professional design platforms matching your exact budget and deployment parameters, ranked by editor score.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.values(PRICING_PAGES).map((p) => {
            const count = getToolsCount(p.slug);
            return (
              <li key={p.slug}>
                <Link
                  href={p.slug === 'free' ? '/free' : p.slug === 'open-source' ? '/open-source' : `/pricing/${p.slug}`}
                  className="block p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all h-full"
                >
                  <div className="text-xs font-black uppercase tracking-wider text-blue-600">
                    {count} compatible tools
                  </div>
                  <div className="mt-2 text-xl font-bold text-slate-900">
                    {p.displayName} Directories
                  </div>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {p.intro}
                  </p>
                  <div className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
                    Explore Top {Math.min(count, 10)} Tools →
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </article>
    </main>
  );
}
