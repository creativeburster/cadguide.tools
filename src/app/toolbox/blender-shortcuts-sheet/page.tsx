import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import BlenderShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Blender Keyboard Shortcuts Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of Blender keyboard shortcuts for 3D viewport, edit mode, object mode, and rendering. Print as PDF.',
  path: '/toolbox/blender-shortcuts-sheet',
});

export default function BlenderShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Blender Shortcuts', path: '/toolbox/blender-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — orange tint, mode-aware theme */}
        <section className="bg-gradient-to-br from-orange-900 via-slate-900 to-slate-900 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-5 uppercase tracking-[0.15em]">
                3D Creation Suite
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                Blender <span className="text-orange-400">Hotkeys</span> & Shortcuts
              </h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                Blender's hotkeys are <strong className="text-orange-300">mode-aware</strong> — the same key does different things
                in Object vs Edit mode. This reference covers both, plus viewport, rendering, and animation shortcuts.
              </p>
            </div>
          </div>
        </section>

        {/* Mode-aware explainer — unique to Blender */}
        <section className="bg-white border-b border-slate-100 py-8 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Same Key, Different Mode</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl border border-orange-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <kbd className="font-mono bg-slate-900 text-orange-400 px-3 py-1.5 rounded-lg font-black text-sm select-all">M</kbd>
                  <span className="font-bold text-slate-700">Key M</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded">OBJECT</span>
                    <span className="text-slate-600 font-medium">Move to Collection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded">EDIT</span>
                    <span className="text-slate-600 font-medium">Merge Vertices</span>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl border border-orange-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <kbd className="font-mono bg-slate-900 text-orange-400 px-3 py-1.5 rounded-lg font-black text-sm select-all">I</kbd>
                  <span className="font-bold text-slate-700">Key I</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded">OBJECT</span>
                    <span className="text-slate-600 font-medium">Insert Keyframe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded">EDIT</span>
                    <span className="text-slate-600 font-medium">Inset Faces</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <BlenderShortcutsClient />
        </section>
      </main>
    </>
  );
}
