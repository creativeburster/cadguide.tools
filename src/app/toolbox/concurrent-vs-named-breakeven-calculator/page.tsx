import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import FlexlmConcurrentBreakevenClient from './calculator-client';
import { EmbedSnippet } from '@/components/embed-snippet';

export const metadata: Metadata = pageMetadata({
  title: 'Concurrent vs Named-User License Break-Even Calculator',
  description: 'Size concurrent (floating) seats from peak concurrency and compare annual cost against named-user licensing. Shows the break-even concurrent-seat premium for FLEXlm-style pools.',
  path: '/toolbox/concurrent-vs-named-breakeven-calculator',
});

export default function FlexlmConcurrentBreakevenPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Concurrent vs Named-User Break-Even', path: '/toolbox/concurrent-vs-named-breakeven-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6 uppercase tracking-[0.15em]">
              Procurement
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Concurrent vs Named-User <span className="text-indigo-400">Break-Even</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Size your floating-seat pool from peak concurrency and find the premium at which named-user licensing wins.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <FlexlmConcurrentBreakevenClient />
          <div className="mt-8">
            <EmbedSnippet slug="concurrent-vs-named-breakeven-calculator" title="Concurrent vs Named-User Break-Even Calculator" />
          </div>
        </section>
      </main>
    </>
  );
}
