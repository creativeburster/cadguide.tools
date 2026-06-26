import type { Metadata } from 'next';
import { tools } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, collectionPageLd } from '@/lib/seo';
import ToolsClient from './tools-client';

export async function generateMetadata(): Promise<Metadata> {
  const canonicalPath = '/tools';
  return pageMetadata({
    title: `All CAD & BIM Software Directory`,
    description:
      'Browse professional CAD, BIM, CAE/CAM, and EDA tools. Filter by price, OS, industry vertical, and expert ratings to find the right design software.',
    path: canonicalPath,
  });
}

export default async function ToolsPage() {
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
