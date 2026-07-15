import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import HardnessConverterClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Hardness Converter (HRC, HV, HB, HRB, N/mm²)',
  description: 'Convert between Rockwell (HRC, HRB), Vickers (HV), Brinell (HB), and tensile strength (N/mm²) hardness scales for steels and metals.',
  path: '/toolbox/hardness-converter',
});

export default function HardnessConverterPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Hardness Converter', path: '/toolbox/hardness-converter' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6 uppercase tracking-[0.15em]">
              ASTM E140 · ISO 18265
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Hardness <span className="text-cyan-400">Converter</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Convert between Rockwell C (HRC), Rockwell B (HRB), Vickers (HV), Brinell (HB), and estimated tensile strength. Based on ASTM E140 and ISO 18265 conversion tables.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <HardnessConverterClient />
        </section>
      </main>
    </>
  );
}
