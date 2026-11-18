import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import PressureVesselClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Pressure Vessel Wall Thickness & Cylinder Stress Calculator',
  description:
    'Calculate thin-walled and Lame thick-walled cylindrical and spherical shell thicknesses plus hoop and axial membrane stresses from internal design pressure.',
  path: '/toolbox/pressure-vessel-thickness-calculator',
});

export default function PressureVesselPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Pressure Vessel Wall Thickness Calculator', path: '/toolbox/pressure-vessel-thickness-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-red-500/10 text-red-400 border border-red-500/20 mb-6 uppercase tracking-[0.15em]">
              Shell Membrane &amp; Lame Stress
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Pressure Vessel <span className="text-red-400">Wall Thickness</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate cylindrical and spherical minimum wall thickness (thin-wall membrane and Lame exact thick-wall limits) plus circumferential hoop stress for a selected nominal wall.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <PressureVesselClient />
          <ToolboxEngineeringGuide slug="pressure-vessel-thickness-calculator" />
        </section>
      </main>
    </>
  );
}
