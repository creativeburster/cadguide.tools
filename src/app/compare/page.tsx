import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ComparePage from './compare-client';
import { getAllMarkdownGuides } from '@/lib/guides-markdown';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = pageMetadata({
  title: 'Compare CAD & BIM Software Side-by-Side',
  description:
    'Compare up to 4 CAD, BIM, CAE/CAM, or EDA tools side by side: pricing, platforms, geometry kernel, file formats, ratings, pros, and cons.',
  path: '/compare',
});

export default function Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
  ]);

  const compareGuides = getAllMarkdownGuides()
    .filter(g => g.category === 'standards' || g.category === 'migration')
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <ComparePage />

      {/* Guides cross-link section */}
      <section className="max-w-[1200px] mx-auto px-4 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Migration & Standards Guides</h2>
            <p className="text-xs text-slate-500 font-medium">Switching tools? These guides cover file format compatibility, data migration, and drafting standards.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {compareGuides.map(g => (
            <Link
              key={g.slug}
              href={`/guides/articles/${g.slug}`}
              className="block p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group"
            >
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{g.category}</p>
              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-3">{g.title}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                <span>{g.readTime}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
