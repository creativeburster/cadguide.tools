import { tools, categories } from '@/lib/data';
import {
  pageMetadata,
  collectionPageLd,
  siteBreadcrumbLd,
} from '@/lib/seo';
import type { Metadata } from 'next';
import ToolsClient from './tools-client';

// Items per page on the directory grid. Kept in sync with
// `ITEMS_PER_PAGE` in tools-client.tsx — both reference the same constant
// via the canonical URL math below.
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
  const path = pageNum > 1 ? `/tools?page=${pageNum}` : '/tools';
  const totalPages = Math.max(1, Math.ceil(tools.length / ITEMS_PER_PAGE));
  const titleSuffix =
    pageNum > 1 ? ` — Page ${pageNum} of ${totalPages}` : '';
  return pageMetadata({
    title: `All CAD & BIM Software — Filter by Category, Price, Platform${titleSuffix}`,
    description:
      'Browse 235+ professional CAD, BIM, CAE/CAM, EDA, and viewer tools. Filter by category, pricing, operating system, industry, user scale, kernel, and expert rating.',
    path,
  });
}

export default function ToolsPage() {
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
