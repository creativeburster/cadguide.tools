import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ShaftTorsionClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Shaft Torsion Stress & Angle Calculator',
  description: 'Calculate torsional shear stress and twist angle for solid and hollow circular shafts under torque loading. Includes power-speed-torque conversion.',
  path: '/toolbox/shaft-torsion-stress-calculator',
});

export default function ShaftTorsionPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Shaft Torsion Calculator', path: '/toolbox/shaft-torsion-stress-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6 uppercase tracking-[0.15em]">
              Free Mechanical Design Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Shaft Torsion <span className="text-purple-400">Stress & Twist</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate torsional shear stress and angle of twist for solid and hollow shafts. Convert power and speed to torque. Includes polar moment of inertia and section modulus.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <ShaftTorsionClient />
        </section>
      </main>
    </>
  );
}
