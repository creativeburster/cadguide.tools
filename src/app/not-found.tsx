import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Page Not Found (404)',
    description:
      'The page you are looking for could not be found. Browse our directory of 235+ CAD, BIM, CAE/CAM and EDA tools, or use the smart Matchmaker to find your next CAD tool.',
    path: '/404',
  }),
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-slate-50 flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            404
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Page not found
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            The page you tried to reach doesn&apos;t exist on{' '}
            <span className="font-semibold text-slate-800">CADGuide.tools</span>.
            It may have moved, or the URL might have a typo.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <Link
              href="/tools"
              className="block rounded-2xl bg-white border border-slate-200 p-6 text-left hover:border-blue-300 transition-colors"
            >
              <div className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Browse the Directory
              </div>
              <div className="mt-2 text-slate-900 font-semibold">
                235+ CAD, BIM, CAE/CAM, and EDA tools
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Filter by category, platform, price, and industry.
              </div>
            </Link>
            <Link
              href="/matchmaker"
              className="block rounded-2xl bg-white border border-slate-200 p-6 text-left hover:border-blue-300 transition-colors"
            >
              <div className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Smart Matchmaker
              </div>
              <div className="mt-2 text-slate-900 font-semibold">
                Find the right CAD tool in 60 seconds
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Answer six questions, get a personalised shortlist.
              </div>
            </Link>
            <Link
              href="/best"
              className="block rounded-2xl bg-white border border-slate-200 p-6 text-left hover:border-blue-300 transition-colors"
            >
              <div className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Best Lists
              </div>
              <div className="mt-2 text-slate-900 font-semibold">
                Top-ranked tools by category
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Curated best-of rankings for 2D, 3D, BIM, EDA, and more.
              </div>
            </Link>
            <Link
              href="/compare"
              className="block rounded-2xl bg-white border border-slate-200 p-6 text-left hover:border-blue-300 transition-colors"
            >
              <div className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Tool Comparisons
              </div>
              <div className="mt-2 text-slate-900 font-semibold">
                Side-by-side head-to-head matchups
              </div>
              <div className="mt-1 text-sm text-slate-500">
                AutoCAD vs BricsCAD, Revit vs ArchiCAD, and 46 more.
              </div>
            </Link>
          </div>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg"
            >
              ← Back to the homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
