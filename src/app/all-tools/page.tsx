import { tools, categories } from '@/lib/data';
import Link from 'next/link';
import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata({
  title: 'All CAD Tools — Complete Software Index',
  description:
    'A-Z index of all professional CAD, BIM, CAE/CAM, EDA, and viewer tools listed on CADGuide.tools. Browse by category or jump directly to any product page.',
  path: '/all-tools',
});

export default function AllToolsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'All Tools', path: '/all-tools' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    <main className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">All CAD Tools</h1>
        <p className="text-slate-600 mb-12 text-lg">A complete A-Z index of every tool on CADGuide.tools — {tools.length} products, organised by category. For the XML sitemap (machine-readable), see <Link href="/sitemap.xml" className="text-blue-600 hover:underline">/sitemap.xml</Link>.</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Main Pages */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Main Sections
            </h2>
            <ul className="space-y-4">
              <li><Link href="/" className="text-blue-600 hover:underline font-medium">Homepage</Link></li>
              <li><Link href="/tools" className="text-blue-600 hover:underline font-medium">Full Software Directory</Link></li>
              <li><Link href="/matchmaker" className="text-blue-600 hover:underline font-medium">Smart Matchmaker Tool</Link></li>
              <li><Link href="/sponsor" className="text-blue-600 hover:underline font-medium">Sponsor & Submission</Link></li>
            </ul>
          </section>

          {/* Categories */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-green-600 rounded-full"></span>
              Browse by Category
            </h2>
            <ul className="space-y-4">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/tools?category=${cat.id}`} className="text-blue-600 hover:underline font-medium">
                    {cat.name} Software
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* All Tools Index */}
        <section className="mt-12 bg-white p-8 rounded-3xl shadow-sm border">
          <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
            Full Software Index ({tools.length} Tools)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-4">
            {tools.sort((a, b) => a.name.localeCompare(b.name)).map(tool => (
              <Link 
                key={tool.id} 
                href={`/tools/${tool.slug}`}
                className="text-slate-600 hover:text-blue-600 text-sm py-1 transition-colors border-b border-transparent hover:border-blue-100 block truncate"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
