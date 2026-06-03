import Link from 'next/link';
import type { Metadata } from 'next';
import { SECTOR_PAGES, toolsForSector } from '@/lib/seo-content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Software by Sector & Industry Vertical',
  description:
    'Hand-curated CAD tool shortlists for 16 specialized sectors, from automotive and aerospace to 3D printing, sheet metal, and medical devices.',
  path: '/sectors',
});

const SECTOR_COLORS: Record<string, { badge: string; border: string }> = {
  cae: { badge: 'bg-indigo-50 text-indigo-700 border-indigo-100', border: 'hover:border-indigo-300' },
  cam: { badge: 'bg-amber-50 text-amber-800 border-amber-100', border: 'hover:border-amber-300' },
  '3d-printing': { badge: 'bg-orange-50 text-orange-800 border-orange-100', border: 'hover:border-orange-300' },
  automotive: { badge: 'bg-rose-50 text-rose-700 border-rose-100', border: 'hover:border-rose-300' },
  'hydraulic-geotechnical': { badge: 'bg-stone-100 text-stone-800 border-stone-200', border: 'hover:border-stone-400' },
  aerospace: { badge: 'bg-sky-50 text-sky-800 border-sky-100', border: 'hover:border-sky-300' },
  'rail-transit': { badge: 'bg-slate-100 text-slate-800 border-slate-200', border: 'hover:border-slate-400' },
  'medical-devices': { badge: 'bg-violet-50 text-violet-700 border-violet-100', border: 'hover:border-violet-300' },
  'sheet-metal': { badge: 'bg-cyan-50 text-cyan-800 border-cyan-100', border: 'hover:border-cyan-300' },
  'steel-structures': { badge: 'bg-zinc-100 text-zinc-800 border-zinc-200', border: 'hover:border-zinc-400' },
  'quantity-takeoff': { badge: 'bg-blue-50 text-blue-700 border-blue-100', border: 'hover:border-blue-300' },
  'piping-pipeline': { badge: 'bg-teal-50 text-teal-800 border-teal-100', border: 'hover:border-teal-300' },
  'reverse-engineering': { badge: 'bg-orange-50 text-orange-800 border-orange-100', border: 'hover:border-orange-300' },
  'agricultural-machinery': { badge: 'bg-lime-50 text-lime-800 border-lime-100', border: 'hover:border-lime-300' },
  'woodworking-customization': { badge: 'bg-yellow-50 text-amber-900 border-yellow-200', border: 'hover:border-yellow-400' },
  petrochemical: { badge: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-100', border: 'hover:border-fuchsia-300' },
};

export default function SectorsIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:underline">Home</Link>{' / '}
          <span className="text-slate-700 font-medium">By Sector</span>
        </nav>

        <header className="mb-12">
          <span className="text-xs text-blue-600 font-black uppercase tracking-wider block mb-2">
            Industry Classification
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            CAD Software by Industry Sector
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-3xl font-normal">
            CAD needs vary drastically across different industries. Aerospace and automotive 
            manufacturers require advanced surfacing and massive assembly management; custom woodworkers 
            need smart parametric cabinet models; quantity estimators require precise material measurements. 
            Select your sector below for a tailored shortlist.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(SECTOR_PAGES).map((s) => {
            const count = toolsForSector(s).length;
            const style = SECTOR_COLORS[s.slug] || { badge: 'bg-blue-50 text-blue-700 border-blue-100', border: 'hover:border-blue-300' };
            
            return (
              <li key={s.slug}>
                <Link
                  href={`/sectors/${s.slug}`}
                  className={`group block p-6 rounded-3xl bg-white border border-slate-200 ${style.border} hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${style.badge}`}>
                        {count} tools reviewed
                      </span>
                      <span className="text-slate-300 group-hover:text-slate-500 transition-colors text-sm font-bold">
                        →
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      CAD for {s.displayName}
                    </div>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {s.intro}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </article>
    </main>
  );
}
