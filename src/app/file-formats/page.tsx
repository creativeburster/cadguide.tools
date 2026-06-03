import Link from 'next/link';
import type { Metadata } from 'next';
import { FILE_FORMAT_PAGES, toolsForFormat } from '@/lib/seo-content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'CAD File Formats Compatibility Guide',
  description:
    'Find software that opens, edits, and exports CAD formats like DWG, STEP, DXF, STL, and IFC. Read/write support is flagged for each tool in our catalog.',
  path: '/file-formats',
});

export default function FileFormatsIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:underline">Home</Link>{' / '}
          <span className="text-slate-700">File Formats</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            CAD File Formats — Pick the Right Tool for Each
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-3xl">
            File format compatibility is the single most expensive thing to get wrong
            in CAD procurement. We&apos;ve indexed every tool in our catalog by which
            formats it reads, writes, or both. Pick a format below to see all
            compatible tools, sorted by score.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(FILE_FORMAT_PAGES).map((p) => {
            const { reads, writes, both } = toolsForFormat(p);
            const total = reads.length + writes.length + both.length;
            return (
              <li key={p.slug}>
                <Link
                  href={`/file-formats/${p.slug}`}
                  className="block p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-extrabold text-slate-900">{p.formatName}</div>
                    <div className="text-xs text-slate-500">{total} tools</div>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{p.fullName}</div>
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
