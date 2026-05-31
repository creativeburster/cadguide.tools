import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { tools } from '@/lib/data';
import GuidesClient from './guides-client';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

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
      title = `${matchedTool.name} Guides & IT Deployment`;
      description = `Deep-dive technical guides for ${matchedTool.name} software. Fix fatal errors, optimize performance, enforce printing standards, and manage enterprise licensing.`;
      path = `/guides?tool=${matchedTool.slug}`;
    }
  }

  return pageMetadata({
    title,
    description,
    path,
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
