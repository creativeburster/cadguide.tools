import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import AnsysShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'ANSYS Mechanical Keyboard Shortcuts Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of ANSYS Mechanical keyboard shortcuts and hotkeys for model setup, viewing, and post-processing. Print as PDF.',
  path: '/toolbox/ansys-shortcuts-sheet',
});

export default function AnsysShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'ANSYS Mechanical Shortcuts', path: '/toolbox/ansys-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — yellow accent */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-yellow-950/40 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mb-5 uppercase tracking-[0.15em]">
                Finite Element Analysis
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                ANSYS Mechanical <span className="text-yellow-400">Hotkeys</span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                From geometry import to post-processing results — every ANSYS Mechanical shortcut
                organized by FEA workflow stage. Press
                <kbd className="bg-yellow-500/10 text-yellow-300 px-2 py-0.5 rounded font-mono text-sm mx-1">F5</kbd>
                to update cells in Workbench.
              </p>
            </div>
          </div>
        </section>

        {/* FEA workflow stages — unique to ANSYS */}
        <section className="bg-white border-b border-slate-100 py-8 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">FEA Workflow Stages</h2>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'Geometry', icon: '📦' },
                { label: 'Mesh', icon: '🔲' },
                { label: 'Setup', icon: '⚙️' },
                { label: 'Solve', icon: '▶️' },
                { label: 'Results', icon: '📊' },
              ].map((stage, i) => (
                <div key={stage.label} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-yellow-50 rounded-xl px-4 py-2 border border-yellow-100">
                    <span className="text-base">{stage.icon}</span>
                    <span className="text-sm font-bold text-yellow-900">{stage.label}</span>
                  </div>
                  {i < 4 && <span className="text-yellow-400 font-black">→</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <AnsysShortcutsClient />
        </section>
      </main>
    </>
  );
}
