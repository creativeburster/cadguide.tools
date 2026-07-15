import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import MaterialPropertiesClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Engineering Material Properties Reference Table | CADGuide.tools',
  description: 'Mechanical properties of steel, aluminum, copper, titanium, brass, and engineering plastics: density, yield strength, elastic modulus, Poisson ratio, and thermal expansion.',
  path: '/toolbox/material-properties-reference',
});

export default function MaterialPropertiesPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Material Properties Reference', path: '/toolbox/material-properties-reference' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — material science, teal accent */}
        <section className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-900 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-5 uppercase tracking-[0.15em]">
                Material Selection Data
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                Engineering Material <span className="text-teal-400">Properties</span> Reference
              </h1>
              <p className="text-xl md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                Density, yield strength, ultimate strength, elastic modulus, Poisson's ratio,
                and thermal expansion for 40+ engineering materials — steels, aluminum, copper,
                titanium, and plastics.
              </p>
            </div>
          </div>
        </section>

        {/* Property legend — unique to this page */}
        <section className="bg-white border-b border-slate-100 py-6 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-lg font-black text-slate-400 uppercase tracking-wider mb-3">Properties Explained</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-base">
              <div className="bg-teal-50 rounded-xl border border-teal-100 p-3">
                <div className="font-black text-teal-800">ρ Density (g/cm³)</div>
                <div className="text-slate-500 font-medium mt-1">Mass per unit volume — weight calculation</div>
              </div>
              <div className="bg-teal-50 rounded-xl border border-teal-100 p-3">
                <div className="font-black text-teal-800">σy Yield (MPa)</div>
                <div className="text-slate-500 font-medium mt-1">Stress at permanent deformation begins</div>
              </div>
              <div className="bg-teal-50 rounded-xl border border-teal-100 p-3">
                <div className="font-black text-teal-800">E Modulus (GPa)</div>
                <div className="text-slate-500 font-medium mt-1">Stiffness — resistance to elastic deformation</div>
              </div>
              <div className="bg-teal-50 rounded-xl border border-teal-100 p-3">
                <div className="font-black text-teal-800">ν Poisson</div>
                <div className="text-slate-500 font-medium mt-1">Lateral/axial strain ratio (~0.3 for metals)</div>
              </div>
              <div className="bg-teal-50 rounded-xl border border-teal-100 p-3">
                <div className="font-black text-teal-800">α Expansion (×10⁻⁶/K)</div>
                <div className="text-slate-500 font-medium mt-1">Linear thermal expansion coefficient</div>
              </div>
              <div className="bg-teal-50 rounded-xl border border-teal-100 p-3">
                <div className="font-black text-teal-800">σu UTS (MPa)</div>
                <div className="text-slate-500 font-medium mt-1">Ultimate tensile strength — max stress</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <MaterialPropertiesClient />
        </section>
      </main>
    </>
  );
}
