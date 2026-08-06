import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { DecisionWizardClient, type WizardData } from '@/components/decision-wizard-client';
import { autocadFatalErrorWizard } from '@/lib/wizard-data/autocadFatalErrorWizard';
import { EmbedSnippet } from '@/components/embed-snippet';

export const metadata: Metadata = pageMetadata({
  title: 'AutoCAD Fatal Error Diagnostic Wizard — Unhandled Access Violation Fixes',
  description: 'Interactive decision tree for AutoCAD "FATAL ERROR: Unhandled Access Violation": drawing corruption, startup crashes, plot crashes, plugin conflicts, and graphics-driver causes — each fix sourced from Autodesk KB.',
  path: '/toolbox/autocad-fatal-error-wizard',
});

export default function AutoCadFatalErrorWizardPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'AutoCAD Fatal Error Wizard', path: '/toolbox/autocad-fatal-error-wizard' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6 uppercase tracking-[0.15em]">
              Troubleshooting Wizard
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              AutoCAD Fatal Error <span className="text-rose-400">Diagnostic Wizard</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Unhandled Access Violation? Pick your scenario — get verified causes and fixes from the Autodesk Knowledge Base.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <DecisionWizardClient data={autocadFatalErrorWizard as unknown as WizardData} />
          <div className="mt-8">
            <EmbedSnippet slug="autocad-fatal-error-wizard" title="AutoCAD Fatal Error Diagnostic Wizard" />
          </div>
        </section>
      </main>
    </>
  );
}
