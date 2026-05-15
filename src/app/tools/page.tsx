import { tools, categories } from '@/lib/data';
import {
  pageMetadata,
  collectionPageLd,
  siteBreadcrumbLd,
} from '@/lib/seo';
import type { Metadata } from 'next';
import ToolsClient from './tools-client';

export const metadata: Metadata = pageMetadata({
  title: 'All CAD & BIM Software — Filter by Category, Price, Platform',
  description:
    'Browse 175+ professional CAD, BIM, CAE/CAM, EDA, and viewer tools. Filter by category, pricing, operating system, industry, user scale, kernel, and expert rating.',
  path: '/tools',
});

export default function ToolsPage() {
  const collection = collectionPageLd({
    name: 'CAD & BIM Software Directory',
    description:
      'Compare 175+ professional CAD, BIM, CAE/CAM, EDA, and viewer tools side by side.',
    path: '/tools',
    numItems: tools.length,
  });
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
  ]);
  // The category list is useful as a sub-ItemList for crawler context —
  // but we already emit `numberOfItems` on the CollectionPage above, so
  // listing 175 LiteralItems would blow up the JSON-LD payload size for
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
