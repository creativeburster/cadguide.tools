import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import CadLicenseTcoCalculatorClient from './calculator-client';
import { EmbedSnippet } from '@/components/embed-snippet';

export const metadata: Metadata = pageMetadata({
  title: 'CAD License TCO Calculator — Subscription vs Perpetual Over N Years',
  description:
    'Model 1-10 year CAD total cost of ownership (subscription with annual escalation vs perpetual buyout plus maintenance, training, and hardware) using editable sample inputs and official vendor pricing links.',
  path: '/toolbox/cad-license-tco-calculator',
});

export default function CadLicenseTcoCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'CAD License TCO Calculator', path: '/toolbox/cad-license-tco-calculator' },
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Procurement
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              CAD License <span className="text-blue-400">TCO Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Compare 1–10 year total cost of ownership between subscription and perpetual licensing models — including escalation, annual maintenance, training, and workstation hardware — with direct links to official vendor pricing pages.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <CadLicenseTcoCalculatorClient />
          <div className="mt-8">
            <EmbedSnippet slug="cad-license-tco-calculator" title="CAD License TCO Calculator" />
          </div>
          <ToolboxEngineeringGuide slug="cad-license-tco-calculator" />
        </section>
      </main>
    </>
  );
}
