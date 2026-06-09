import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { tools, Tool } from '@/lib/data';
import GuidesClient from './guides-client';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export function getDynamicTitle(tool: Tool): string {
  const name = tool.name;
  const industries = tool.industries || [];
  const isBIM = industries.some((i: string) => /bim|architect|civil|building/i.test(i)) || tool.category_id === 'bim';
  const isMechanical = industries.some((i: string) => /mechanical|mfg|automotive|aerospace/i.test(i)) || tool.category_id === 'mfg';
  const isOpenSource = tool.pricing_type === 'Open Source' || tool.pricing_type === 'Free';

  if (isOpenSource) {
    return `${name} Free Guides & Custom Configs`;
  }
  if (isBIM) {
    return `${name} BIM Guides & Enterprise Setup`;
  }
  if (isMechanical) {
    return `${name} 3D Specs & Workstation Tuning`;
  }
  return `${name} CAD Guides & IT Deployment`;
}

export function getDynamicDescription(tool: Tool): string {
  const name = tool.name;
  const platformStr = tool.platforms?.slice(0, 2).join('/') || 'Windows/macOS';
  const indList = tool.industries?.slice(0, 2).join('/') || 'CAD/BIM';

  return `Professional B-End guides for ${name}. Fix fatal errors, tune graphics drivers for ${platformStr}, and optimize licensing for ${indList} teams.`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const tool = Array.isArray(params.tool) ? params.tool[0] : params.tool;

  let title = 'CAD Professional Guides & IT Deployment';
  let description = 'Deep-dive technical guides for enterprise CAD, BIM, CAE, and EDA software. Fix fatal errors, optimize hardware performance, enforce printing standards, and migrate concurrent licensing.';
  let path = '/guides';

  if (tool) {
    const matchedTool = tools.find(t => t.slug === tool);
    if (matchedTool) {
      title = getDynamicTitle(matchedTool);
      description = getDynamicDescription(matchedTool);
      path = `/guides?tool=${matchedTool.slug}`;
    }
  }

  return pageMetadata({
    title,
    description,
    path: '/guides',
  });
}

export default function Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Professional Guides', path: '/guides' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <GuidesClient />
    </>
  );
}
