import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import AltiumShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Altium Designer Keyboard Shortcuts Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of Altium Designer keyboard shortcuts for schematic, PCB layout, routing, and navigation. Print as PDF.',
  path: '/toolbox/altium-shortcuts-sheet',
});

export default function AltiumShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Altium Designer Shortcuts', path: '/toolbox/altium-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — red accent */}
        <section className="bg-slate-900 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-400 border border-red-500/20 mb-5 uppercase tracking-[0.15em]">
                PCB Design Suite
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                Altium Designer <span className="text-red-400">Shortcuts</span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                Altium uses <strong className="text-red-300">two-letter mnemonic shortcuts</strong> typed in sequence —
                not simultaneously. Master them and your schematic-to-PCB workflow becomes dramatically faster.
              </p>
            </div>
          </div>
        </section>

        {/* Two-letter mnemonics explainer — unique to Altium */}
        <section className="bg-white border-b border-slate-100 py-8 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">How Two-Letter Shortcuts Work</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { keys: 'P + W', cmd: 'Place Wire', desc: 'Press P, then W in sequence' },
                { keys: 'D + R', cmd: 'Design Rules', desc: 'Press D, then R in sequence' },
                { keys: 'J + C', cmd: 'Jump to Component', desc: 'Press J, then C in sequence' },
              ].map((item) => (
                <div key={item.keys} className="bg-red-50 rounded-2xl border border-red-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <kbd className="font-mono bg-slate-900 text-red-400 px-2.5 py-1 rounded-lg font-black text-xs select-all">{item.keys}</kbd>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">{item.cmd}</div>
                  <p className="text-xs text-slate-500 font-medium mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-3 text-center">
              Watch the status bar — it shows available next letters after the first key press.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <AltiumShortcutsClient />
        </section>
      </main>
    </>
  );
}
