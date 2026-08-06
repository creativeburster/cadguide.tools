import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import KFactorCalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'DIN 6935 Sheet Metal K-Factor & Bend Allowance Calculator',
  description:
    'Calculate sheet metal bend allowance, bend deduction, outside setback, and flat pattern length using DIN 6935 standards with a dynamic interactive SVG diagram.',
  path: '/toolbox/k-factor-calculator',
});

export default function KFactorCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'K-Factor Calculator', path: '/toolbox/k-factor-calculator' },
  ]);

  return (
    <>
      {/* Schema.org BreadcrumbList payload */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Free Engineering Utility
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Sheet Metal <span className="text-blue-400">K-Factor</span> & Bend Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate bend allowance, deduction, setback, and flat blank length based on DIN 6935 standards. Visualize the shifting neutral axis dynamically in real-time.
            </p>
          </div>
        </section>

        {/* Main Content Component */}
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <KFactorCalculatorClient />
        </section>

        {/* Related Expert Guides Section — dev-only; guides are noindex+302→404 in production */}
              </main>
    </>
  );
}
