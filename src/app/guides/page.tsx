import { getAllMarkdownGuides, getToolsWithGuides, type MarkdownGuide } from '@/lib/guides-markdown';
import { tools } from '@/lib/data';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import GuidesListClient from './guides-list-client';

export const dynamic = 'force-static';

const _guideCount = getAllMarkdownGuides().length;

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'CAD Troubleshooting & Performance Guides',
    description: `${_guideCount} expert guides for AutoCAD, SolidWorks, Revit, Blender, Civil 3D, Tekla and 15+ CAD/BIM tools. Fix crashes, slow performance, file corruption and licensing errors.`,
    path: '/guides',
  }),
  robots: { index: true, follow: true },
};

export default function GuidesPage() {
  const allGuides = getAllMarkdownGuides();
  const toolsWithGuides = getToolsWithGuides();

  const toolMap = new Map(tools.map(t => [t.slug, t]));
  const availableTools = toolsWithGuides
    .map(slug => {
      const t = toolMap.get(slug);
      return {
        slug,
        name: t?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        logo_url: t?.logo_url || null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return <GuidesListClient guides={allGuides} availableTools={availableTools} />;
}
