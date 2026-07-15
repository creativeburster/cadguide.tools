import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import BoltTorqueClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Bolt Tightening Torque & Preload Tension Calculator | CADGuide.tools',
  description:
    'Calculate required bolt installation tightening torque (T=KFD) and tensile preload force for standard metric bolts (grade 4.8 to 12.9).',
  path: '/toolbox/screw-torque-preload-calculator',
});

export default function BoltTorquePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Bolt Torque & Preload Calculator', path: '/toolbox/screw-torque-preload-calculator' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Mechanical Design Tool
            </div>
            <h1 className="text-4xl font-black mb-6 tracking-tight leading-tight">
              Bolt Torque & <span className="text-blue-400">Preload Tension</span> Calculator
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Prevent thread stripping and bolt shear failure. Calculate tightening torque standards using standard VDI 2230 guidelines.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12">
          <BoltTorqueClient />
        </section>
      </main>
    </>
  );
}
