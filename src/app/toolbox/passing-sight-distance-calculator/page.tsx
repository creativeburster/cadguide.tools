import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import CalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Passing Sight Distance Kinematics Calculator | CADGuide.tools',
  description:
    'Calculate four-phase two-lane highway passing sight distance (d1 initial maneuver, d2 lane occupation, d3 clearance, d4 opposing vehicle distance) from explicit speeds and durations.',
  path: '/toolbox/passing-sight-distance-calculator',
});

export default function CalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Passing Sight Distance Kinematics Calculator', path: '/toolbox/passing-sight-distance-calculator' },
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
              Roadway Geometry Kinematics
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Passing Sight Distance <span className="text-orange-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Compute the four kinematic phases (d1 + d2 + d3 + d4) of a two-lane overtaking maneuver with editable speeds, durations, and clearance.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <CalculatorClient />
          <ToolboxEngineeringGuide slug="passing-sight-distance-calculator" />
        </section>
      </main>
    </>
  );
}
