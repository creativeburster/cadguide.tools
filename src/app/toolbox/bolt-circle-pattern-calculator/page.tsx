import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import BoltCircleClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Bolt Circle Pattern & Flange Hole Coordinate Calculator',
  description:
    'Generate X/Y coordinates for equally spaced bolt circles. Configurable bolt count, PCD, rotation offset. Export CSV for CNC drilling.',
  path: '/toolbox/bolt-circle-pattern-calculator',
});

export default function BoltCirclePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Bolt Circle Calculator', path: '/toolbox/bolt-circle-pattern-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Free Mechanical Design Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Bolt Circle <span className="text-blue-400">Pattern Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Generate precise X/Y coordinates for equally spaced bolt hole patterns on a pitch circle diameter. Export CSV for CNC drilling.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <BoltCircleClient />
        </section>
      </main>
    </>
  );
}
