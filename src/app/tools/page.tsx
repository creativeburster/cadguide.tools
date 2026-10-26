import type { Metadata } from 'next';
import Link from 'next/link';
import { tools, categories } from '@/lib/data';
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

/**
 * Server-rendered static directory used as the Suspense fallback of the
 * interactive ToolsClient. ToolsClient reads URL search params and therefore
 * renders client-side only; without this fallback the static HTML would only
 * contain a "Loading tools..." placeholder and zero tool links.
 */
function StaticToolIndex() {
  return (
    <div className="space-y-10">
      {categories.map((cat) => {
        const catTools = tools
          .filter((t) => t.category_id === cat.id)
          .sort((a, b) => b.score - a.score);
        if (catTools.length === 0) return null;
        return (
          <section key={cat.id}>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {cat.name} <span className="text-slate-400 font-medium">({catTools.length})</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {catTools.map((t) => (
                <li key={t.slug} className="rounded-xl border border-slate-200 bg-white p-4">
                  <Link href={`/tools/${t.slug}`} className="font-semibold text-blue-700 hover:underline">
                    {t.name}
                  </Link>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{t.short_desc}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
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
      <ToolsClient fallback={<StaticToolIndex />} />
    </>
  );
}
