import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import MatlabShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'MATLAB Keyboard Shortcuts Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of MATLAB keyboard shortcuts for editor, command window, navigation, and debugging. Print as PDF.',
  path: '/toolbox/matlab-shortcuts-sheet',
});

export default function MatlabShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'MATLAB Shortcuts', path: '/toolbox/matlab-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — green accent */}
        <section className="bg-gradient-to-r from-slate-900 to-green-950 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-green-500/10 text-green-400 border border-green-500/20 mb-5 uppercase tracking-[0.15em]">
                Numerical Computing
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                MATLAB <span className="text-green-400">Keyboard Shortcuts</span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                Editor, Command Window, debugging, and navigation — 49+ shortcuts for the complete MATLAB workflow.
                Press <kbd className="bg-green-500/10 text-green-300 px-2 py-0.5 rounded font-mono text-sm">Up Arrow</kbd> in the
                Command Window to recall previous commands.
              </p>
            </div>
          </div>
        </section>

        {/* Editor vs Command Window guide — unique to MATLAB */}
        <section className="bg-white border-b border-slate-100 py-8 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Two Workspaces, Different Shortcuts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-2xl border border-green-100 p-5">
                <h3 className="font-black text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">📝</span> Editor
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    { k: 'Ctrl+R', d: 'Comment lines' },
                    { k: 'Ctrl+T', d: 'Uncomment lines' },
                    { k: 'Ctrl+I', d: 'Smart indent' },
                    { k: 'Ctrl+D', d: 'Open function file' },
                    { k: 'F5', d: 'Run script' },
                  ].map((item) => (
                    <div key={item.k} className="flex items-center gap-3">
                      <kbd className="font-mono bg-slate-900 text-green-300 px-2.5 py-1 rounded-lg font-black text-xs select-all min-w-[80px] text-center">{item.k}</kbd>
                      <span className="text-slate-600 font-medium">{item.d}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl border border-green-100 p-5">
                <h3 className="font-black text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">💻</span> Command Window
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    { k: '↑', d: 'Recall previous command' },
                    { k: '↓', d: 'Recall next command' },
                    { k: 'Esc', d: 'Clear current line' },
                    { k: 'Ctrl+C', d: 'Interrupt computation' },
                    { k: 'Tab', d: 'Auto-complete name' },
                  ].map((item) => (
                    <div key={item.k} className="flex items-center gap-3">
                      <kbd className="font-mono bg-slate-900 text-green-300 px-2.5 py-1 rounded-lg font-black text-xs select-all min-w-[80px] text-center">{item.k}</kbd>
                      <span className="text-slate-600 font-medium">{item.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <MatlabShortcutsClient />
        </section>
      </main>
    </>
  );
}
