import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import GCodeClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'CNC G-Code & M-Code Quick Reference Sheet (LinuxCNC)',
  description: 'Searchable quick reference for standard CNC G-codes (G0-G99) and M-codes (M0-M99) aligned with official LinuxCNC documentation.',
  path: '/toolbox/gcode-quick-reference-sheet',
});

export default function GCodePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'G-Code Quick Reference', path: '/toolbox/gcode-quick-reference-sheet' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              CNC Programming Reference
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              G-Code <span className="text-blue-400">Quick Reference</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Searchable index of 41 G-codes and 14 M-codes verified against LinuxCNC G-Code and M-Code documentation with pure-ASCII CSV export.
            </p>
          </div>
        </section>
        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <GCodeClient />
          <ToolboxEngineeringGuide slug="gcode-quick-reference-sheet" />
        </section>
      </main>
    </>
  );
}
