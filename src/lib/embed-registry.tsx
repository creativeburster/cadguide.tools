import type { ComponentType } from 'react';
import CadLicenseTcoCalculatorClient from '@/app/toolbox/cad-license-tco-calculator/calculator-client';
import CadFormatCompatibilityClient from '@/app/toolbox/cad-format-compatibility-matrix/calculator-client';
import FlexlmConcurrentBreakevenClient from '@/app/toolbox/concurrent-vs-named-breakeven-calculator/calculator-client';
import { DecisionWizardClient } from '@/components/decision-wizard-client';
import { autocadFatalErrorWizard } from '@/lib/wizard-data/autocadFatalErrorWizard';
import { revitWorksharingWizard } from '@/lib/wizard-data/revitWorksharingWizard';

export interface EmbeddableTool {
  slug: string;
  title: string;
  Component: ComponentType;
}

/** Registry of tools available on the chrome-free /embed/[slug] route. Grows over time. */
export const EMBED_REGISTRY: EmbeddableTool[] = [
  { slug: 'cad-license-tco-calculator', title: 'CAD License TCO Calculator', Component: CadLicenseTcoCalculatorClient },
  { slug: 'cad-format-compatibility-matrix', title: 'CAD Format Compatibility Matrix', Component: CadFormatCompatibilityClient },
  { slug: 'concurrent-vs-named-breakeven-calculator', title: 'Concurrent vs Named-User Break-Even Calculator', Component: FlexlmConcurrentBreakevenClient },
  { slug: 'autocad-fatal-error-wizard', title: 'AutoCAD Fatal Error Diagnostic Wizard', Component: () => <DecisionWizardClient data={autocadFatalErrorWizard as any} /> },
  { slug: 'revit-worksharing-wizard', title: 'Revit Worksharing Diagnostic Wizard', Component: () => <DecisionWizardClient data={revitWorksharingWizard as any} /> },
];

export function getEmbeddable(slug: string): EmbeddableTool | undefined {
  return EMBED_REGISTRY.find((t) => t.slug === slug);
}
