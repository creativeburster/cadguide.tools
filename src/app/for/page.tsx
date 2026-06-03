import Link from 'next/link';
import type { Metadata } from 'next';
import { PERSONA_PAGES, toolsForPersona } from '@/lib/seo-content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Software Recommendations by Role',
  description:
    'Hand-curated CAD tool shortlists for every role. Architects, mechanical engineers, civil engineers, students, jewelry designers, animators, and more.',
  path: '/for',
});

export default function PersonasIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:underline">Home</Link>{' / '}
          <span className="text-slate-700">By Role</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            CAD Software by Role
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-3xl">
            Different roles have radically different CAD needs. Mechanical engineers
            need parametric solid modelling and CAM; architects need BIM and
            visualisation; jewellery designers need organic surface modelling with
            ring-sizing libraries. Pick your role below for a curated shortlist.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(PERSONA_PAGES).map((p) => {
            const count = toolsForPersona(p).length;
            return (
              <li key={p.slug}>
                <Link
                  href={`/for/${p.slug}`}
                  className="block p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                    {count} tools
                  </div>
                  <div className="mt-2 text-lg font-bold text-slate-900">
                    CAD for {p.displayName}
                  </div>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">{p.intro}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </article>
    </main>
  );
}
