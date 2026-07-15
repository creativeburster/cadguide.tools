import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import OhmsLawClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: "Ohm's Law Calculator (V, I, R, P)",
  description: "Calculate voltage, current, resistance, and power using Ohm's law. Enter any two known values to solve for the remaining two.",
  path: '/toolbox/ohms-law-calculator',
});

export default function OhmsLawPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: "Ohm's Law Calculator", path: '/toolbox/ohms-law-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mb-6 uppercase tracking-[0.15em]">
              Electrical Engineering
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Ohm's Law <span className="text-yellow-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate voltage (V), current (I), resistance (R), and power (P) using Ohm's law. Enter any two known values to solve for all four.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <OhmsLawClient />
        </section>
      </main>
    </>
  );
}
