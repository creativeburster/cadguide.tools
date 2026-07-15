import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ProgeCADShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'progeCAD Keyboard Shortcuts & Command Aliases Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of progeCAD keyboard shortcuts, function keys, and command aliases. Print as PDF or copy commands for your drafting workflow.',
  path: '/toolbox/progecad-shortcuts-sheet',
});

export default function ProgeCADShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'progeCAD Shortcuts', path: '/toolbox/progecad-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — split, purple accent */}
        <section className="bg-gradient-to-r from-slate-900 to-purple-950 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-[1fr_320px] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-5 uppercase tracking-[0.15em]">
                  progeCAD Professional
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                  progeCAD <span className="text-purple-400">Shortcuts</span><br />and Command Aliases
                </h1>
                <p className="text-base text-slate-300 leading-relaxed font-medium">
                  progeCAD supports the same aliases and keyboard shortcuts as AutoCAD — plus
                  enhanced tools like rotated rectangles. Import
                  <code className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded text-sm mx-1">.pgp</code> and
                  <code className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded text-sm mx-1">.ick</code> files directly.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
                <h2 className="text-xs font-black text-purple-400 uppercase tracking-wider mb-3">progeCAD Extras</h2>
                <ul className="space-y-2 text-sm text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">▸</span> Rotated rectangle option
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">▸</span> Square from rectangle command
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">▸</span> .ica alias export format
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">▸</span> .ick keystroke import
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <ProgeCADShortcutsClient />
        </section>
      </main>
    </>
  );
}
