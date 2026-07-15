import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import MillingMRRClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Milling MRR & Feed Rate Calculator',
  description: 'Calculate material removal rate (MRR), feed rate, spindle RPM, and cutting time for CNC milling operations with speed and feed formulas.',
  path: '/toolbox/milling-mrr-calculator',
});

export default function MillingMRRPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Milling MRR Calculator', path: '/toolbox/milling-mrr-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-6 uppercase tracking-[0.15em]">
              CNC Milling Operations
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Milling MRR <span className="text-pink-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate material removal rate, feed rate, spindle RPM, and cutting time for CNC milling. Includes chip load, flute count, and width/depth of cut parameters.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <MillingMRRClient />
        </section>
      </main>
    </>
  );
}
