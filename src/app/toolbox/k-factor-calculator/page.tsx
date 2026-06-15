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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
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

        {/* Related Expert Guides Section */}
        <section className="pb-24 pt-4 max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="border-t border-slate-200/80 pt-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 block mb-1">Expert Reading</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">3D Geometry & Manufacturing Guides</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Further reading on 3D MCAD kernels, STEP conversion rules, and CAM benders.</p>
              </div>
              <Link href="/guides" className="text-xs font-black text-violet-600 hover:underline">
                Explore Guides Library (6,160+) →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                href="/guides/kernel-solidworks-siemens-nx"
                className="group p-6 rounded-2xl bg-white border border-slate-150 hover:border-violet-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-full blur-xl -mr-6 -mt-6 group-hover:scale-125 transition-transform"></div>
                <span className="text-[9px] font-mono font-black text-violet-600 uppercase tracking-wider block mb-1">3D Kernels</span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-violet-600 transition-colors">B-Rep Lossless Geometry Translation →</h3>
                <p className="text-xs text-slate-500 mt-2 font-medium">Prevent coordinate drift and face deformation when exporting CAD boundaries to sheet metal CAM benders.</p>
              </Link>

              <Link 
                href="/guides/solidworks-manufacturing-0"
                className="group p-6 rounded-2xl bg-white border border-slate-150 hover:border-violet-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-full blur-xl -mr-6 -mt-6 group-hover:scale-125 transition-transform"></div>
                <span className="text-[9px] font-mono font-black text-violet-600 uppercase tracking-wider block mb-1">CAM Rules</span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-violet-600 transition-colors">DIN 6935 Bend Allowance Configurations →</h3>
                <p className="text-xs text-slate-500 mt-2 font-medium">Configure sheet metal thickness tables and flat patterns automatically for press brake bending tools.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
