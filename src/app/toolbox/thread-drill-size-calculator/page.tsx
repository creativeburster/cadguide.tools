import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ThreadDrillCalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Thread Tap & Drill Size Calculator (Metric, UNC, UNF)',
  description:
    'Calculate the recommended tap drill size, clearance hole diameters, and thread engagement percentages for Metric, UNC, and UNF threads with a live SVG cross-section visualizer.',
  path: '/toolbox/thread-drill-size-calculator',
});

export default function ThreadDrillCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Thread Tap Drill Calculator', path: '/toolbox/thread-drill-size-calculator' },
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
              Free Machining & CAD Utility
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Thread Tap & <span className="text-blue-400">Drill Size</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate optimal pilot hole drill sizes based on material-specific thread engagement percentages. Includes standard Metric, UNC, and UNF lookup specifications.
            </p>
          </div>
        </section>

        {/* Main Content Component */}
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <ThreadDrillCalculatorClient />
        </section>
      </main>
    </>
  );
}
