import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import BeamDeflectionClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Steel I-Beam Deflection & Section Modulus Calculator',
  description:
    'Calculate structural H-beam deflection, bending stress, moment of inertia, and section modulus under point and distributed loads for AISC standard structural design.',
  path: '/toolbox/beam-deflection-structural-calculator',
});

export default function BeamDeflectionPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'I-Beam Deflection Calculator', path: '/toolbox/beam-deflection-structural-calculator' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Free Structural Design Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Steel Beam <span className="text-blue-400">Deflection & Stress</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Instantly calculate section modulus, moment of inertia, maximum bending stress, and deflection for I-beams, box sections, pipe, and solid rectangular beams.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <BeamDeflectionClient />
        </section>
      </main>
    </>
  );
}
