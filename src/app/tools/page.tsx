import type { Metadata } from 'next';
import { tools } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, collectionPageLd } from '@/lib/seo';
import ToolsClient from './tools-client';
const ITEMS_PER_PAGE = 24;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const pageNum = Math.max(1, Number(rawPage) || 1);
  const totalPages = Math.max(1, Math.ceil(tools.length / ITEMS_PER_PAGE));
  const titleSuffix = pageNum > 1 ? ` — Page ${pageNum} of ${totalPages}` : '';
  // Canonical URL should always point to the base tools page (no pagination)
  const canonicalPath = '/tools';
  return pageMetadata({
    title: `All CAD & BIM Software Directory${titleSuffix}`,
    description:
      'Browse professional CAD, BIM, CAE/CAM, and EDA tools. Filter by price, OS, industry vertical, and expert ratings to find the right design software.',
    path: canonicalPath,
  });
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const pageNum = Math.max(1, Number(rawPage) || 1);
  const totalPages = Math.max(1, Math.ceil(tools.length / ITEMS_PER_PAGE));

  const collection = collectionPageLd({
    name: 'CAD & BIM Software Directory',
    description:
      'Compare professional CAD, BIM, CAE/CAM, EDA, and viewer tools side by side.',
    path: '/tools',
    numItems: tools.length,
  });
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <ToolsClient />
    </>
  );
}
