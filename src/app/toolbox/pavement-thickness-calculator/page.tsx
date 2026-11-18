import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import PavementThicknessCalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Flexible Pavement Structural Number & Layer Thickness Calculator | CADGuide.tools',
  description:
    'Calculate layered flexible pavement structural contributions SN = a1*D1 + a2*m2*D2 + a3*m3*D3 and solve required subbase thickness from target SN and layer coefficients.',
  path: '/toolbox/pavement-thickness-calculator',
});

export default function PavementThicknessCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Pavement Layer Thickness Calculator', path: '/toolbox/pavement-thickness-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 uppercase tracking-[0.15em]">
              Flexible Pavement Layer Allocation
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Pavement Thickness <span className="text-orange-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Compute layered structural contributions SN1 + SN2 + SN3 and determine required subbase thickness from target structural number and layer coefficients.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <PavementThicknessCalculatorClient />
          <ToolboxEngineeringGuide slug="pavement-thickness-calculator" />
        </section>
      </main>
    </>
  );
}
