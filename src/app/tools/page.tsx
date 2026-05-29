import Head from 'next/head';
import type { Metadata } from 'next';
import { tools, categories } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, collectionPageLd } from '@/lib/seo';
import ToolsClient from './tools-client';
const ITEMS_PER_PAGE = 24;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Per-page metadata for /tools. Self-referential canonical includes
 * `?page=N` so each paginated view is independently indexable — the
 * 2026 SEO best practice now that Google has stopped honoring
 * rel=prev/next for indexing.
 */
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
    title: `All CAD & BIM Software — Filter by Category, Price, Platform${titleSuffix}`,
    description:
      'Browse 235+ CAD, BIM, CAE/CAM, EDA tools. Filter by category, price, OS, industry, and expert ratings.',
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
  const path = pageNum > 1 ? `/tools?page=${pageNum}` : '/tools';

  const collection = collectionPageLd({
    name: 'CAD & BIM Software Directory',
    description:
      'Compare 235+ professional CAD, BIM, CAE/CAM, EDA, and viewer tools side by side.',
    path: '/tools',
    numItems: tools.length,
  });
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
  ]);
  // The category list is useful as a sub-ItemList for crawler context —
  // but we already emit `numberOfItems` on the CollectionPage above, so
  // listing 235 LiteralItems would blow up the JSON-LD payload size for
  // little SEO gain. Keep it compact.
  void categories;
  return (
    <>
      <Head>
        <link rel="canonical" href="https://cadguide.tools/tools" />
      </Head>
      {pageNum > 1 && (
        <link rel="prev" href={`https://cadguide.tools/tools?page=${pageNum - 1}`} />
      )}
      {pageNum < totalPages && (
        <link rel="next" href={`https://cadguide.tools/tools?page=${pageNum + 1}`} />
      )}
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
