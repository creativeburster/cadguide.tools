import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { DecisionWizardClient, type WizardData } from '@/components/decision-wizard-client';
import { revitWorksharingWizard } from '@/lib/wizard-data/revitWorksharingWizard';
import { EmbedSnippet } from '@/components/embed-snippet';

export const metadata: Metadata = pageMetadata({
  title: 'Revit Worksharing & Central Model Diagnostic Wizard',
  description: 'Interactive decision tree for Revit central-model problems: inaccessible central, slow sync, borrowed worksets, corrupt central recovery, and missing elements on sync — fixes sourced from Autodesk KB.',
  path: '/toolbox/revit-worksharing-wizard',
});

export default function RevitWorksharingWizardPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Revit Worksharing Wizard', path: '/toolbox/revit-worksharing-wizard' },
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-6 uppercase tracking-[0.15em]">
              Troubleshooting Wizard
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Revit Worksharing <span className="text-violet-400">Diagnostic Wizard</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Central model trouble? Pick your scenario — get verified recovery steps from the Autodesk Knowledge Base.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <DecisionWizardClient data={revitWorksharingWizard as unknown as WizardData} />
          <div className="mt-8">
            <EmbedSnippet slug="revit-worksharing-wizard" title="Revit Worksharing Diagnostic Wizard" />
          </div>
        </section>
      </main>
    </>
  );
}
