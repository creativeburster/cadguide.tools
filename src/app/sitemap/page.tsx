import { tools, categories } from '@/lib/data';
import Link from 'next/link';

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Site Sitemap</h1>
        <p className="text-slate-600 mb-12 text-lg">A comprehensive overview of all pages on CADTools.io. This sitemap is updated automatically.</p>

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
              <li><Link href="/deals" className="text-blue-600 hover:underline font-medium">Software Deals & Discounts</Link></li>
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
  );
}
