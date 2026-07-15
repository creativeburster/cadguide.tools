import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import FlexlmLogAnalyzerClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'FLEXlm License Log Offline Analyzer & Audit Tool',
  description:
    'Parse and audit your lmgrd network license debug logs locally in your browser. Generate reports on denied checkouts, concurrent usage peaks, and seat utilization charts without uploading server logs.',
  path: '/toolbox/flexlm-debug-log-analyzer',
});

export default function FlexlmLogAnalyzerPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'FLEXlm Log Analyzer', path: '/toolbox/flexlm-debug-log-analyzer' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Enterprise License Auditor
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              FLEXlm License Log <span className="text-blue-400">Offline Analyzer</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              100% Browser parses lmgrd debug log locally. Graphical statistics of authorization denial rate, license concurrency peak and idle users, Ensure corporate log privacy compliance. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12">
          <FlexlmLogAnalyzerClient />
        </section>
      </main>
    </>
);
}
