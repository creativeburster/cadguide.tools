import Link from 'next/link';
import type { Metadata } from 'next';
import { PLATFORM_PAGES, toolsForPlatform } from '@/lib/seo-content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Software by Operating System & Platform',
  description:
    'Find CAD, BIM, CAE, and EDA tools for your operating system. Windows, macOS, Linux, Web, iPad/iOS, and Android CAD options — ranked by score and reviews.',
  path: '/platforms',
});

export default function PlatformsIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:underline">Home</Link>{' / '}
          <span className="text-slate-700">Platforms</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            CAD Software by Platform
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Most CAD comparison sites assume Windows. We don&apos;t. Pick your
            platform below to see every tool in our catalog that runs natively
            on it, ranked by expert score and customer reviews.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.values(PLATFORM_PAGES).map((p) => {
            const count = toolsForPlatform(p).length;
            return (
              <li key={p.slug}>
                <Link
                  href={`/platforms/${p.slug}`}
                  className="block p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                    {count} tools
                  </div>
                  <div className="mt-2 text-xl font-bold text-slate-900">
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
