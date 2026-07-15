import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import FatigueLifeClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Fatigue Life (S-N Curve) Calculator',
  description: 'Calculate fatigue life cycles from stress amplitude using Basquin equation and S-N curves. Supports steel and aluminum with endurance limit.',
  path: '/toolbox/fatigue-life-calculator',
});

export default function FatigueLifePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Fatigue Life Calculator', path: '/toolbox/fatigue-life-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-red-500/10 text-red-400 border border-red-500/20 mb-6 uppercase tracking-[0.15em]">
              Mechanical Fatigue Design
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Fatigue Life <span className="text-red-400">S-N Curve</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate fatigue life cycles from stress amplitude using the Basquin equation. Supports steel and aluminum with endurance limit and surface finish factors.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <FatigueLifeClient />
        </section>
      </main>
    </>
  );
}
