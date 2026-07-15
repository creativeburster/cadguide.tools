import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import AutoCADShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'AutoCAD Keyboard Shortcuts & Command Aliases Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of AutoCAD keyboard shortcuts, function keys, and command aliases. Print as PDF or copy commands for your drafting workflow.',
  path: '/toolbox/autocad-shortcuts-sheet',
});

export default function AutoCADShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'AutoCAD Shortcuts', path: '/toolbox/autocad-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — left-aligned, orange accent */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 uppercase tracking-[0.15em]">
                  AutoCAD Reference
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]">
                  AutoCAD Shortcut Keys<br />
                  <span className="text-orange-400">& Command Aliases</span> Cheat Sheet
                </h1>
                <p className="text-lg text-slate-300 leading-relaxed max-w-xl font-medium">
                  From <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded text-sm">L</code> for LINE to
                  <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded text-sm ml-1">Ctrl+Shift+S</code> for SAVEAS —
                  every essential AutoCAD hotkey, function key, and command alias in one searchable, printable reference.
                </p>
              </div>
              <div className="hidden md:flex flex-col gap-3">
                {[
                  { label: 'Shortcuts', value: '57+' },
                  { label: 'Categories', value: '5' },
                  { label: 'Alias Download', value: '.pgp' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 text-center min-w-[140px]">
                    <div className="text-2xl font-black text-orange-400">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Top 5 Most Used — unique to AutoCAD page */}
        <section className="bg-white border-b border-slate-100 py-8 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Most Used AutoCAD Shortcuts</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { key: 'L', cmd: 'LINE', desc: 'Draw lines' },
                { key: 'C', cmd: 'CIRCLE', desc: 'Create circles' },
                { key: 'TR', cmd: 'TRIM', desc: 'Trim objects' },
                { key: 'O', cmd: 'OFFSET', desc: 'Parallel copy' },
                { key: 'F8', cmd: 'ORTHO', desc: 'Toggle ortho' },
              ].map((item) => (
                <div key={item.key} className="bg-slate-50 rounded-2xl border border-slate-100 p-4 hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <kbd className="font-mono bg-slate-900 text-white px-2.5 py-1 rounded-lg font-black text-xs select-all">{item.key}</kbd>
                    <span className="font-bold text-slate-700 text-sm">{item.cmd}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <AutoCADShortcutsClient />
        </section>
      </main>
    </>
  );
}
