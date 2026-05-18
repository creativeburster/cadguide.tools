import Link from 'next/link';
import type { Metadata } from 'next';
import { tools } from '@/lib/data';
import { pageMetadata } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Software Alternatives — 235 Hand-Vetted Switchover Guides',
  description:
    'Every tool in our catalog has a dedicated alternatives page. Find similar CAD, BIM, CAE, and EDA software ranked by price, platform, and target use case.',
  path: '/alternatives',
});

// Tools most likely to be the target of an "alternatives" search — top by
// expert score with an external review presence, capped at 24 for the
// landing-page grid. Full list of 235 is still in /sitemap.xml.
function popularSwitchAwayTargets() {
  return [...tools]
    .map((t) => ({
      tool: t,
      reviewCount: (t.external_ratings ?? []).reduce(
        (acc, r) => acc + (r.count ?? 0),
        0,
      ),
    }))
    .sort((a, b) => {
      if (b.tool.score !== a.tool.score) return b.tool.score - a.tool.score;
      return b.reviewCount - a.reviewCount;
    })
    .slice(0, 24)
    .map((x) => x.tool);
}

export default function AlternativesIndexPage() {
  const popular = popularSwitchAwayTargets();
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:underline">Home</Link>{' / '}
          <span className="text-slate-700">Alternatives</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            CAD Software Alternatives — 235 Switchover Guides
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-3xl">
            Every tool in our catalog has a dedicated alternatives page that ranks
            5-8 editor-vetted competitors. Pick the tool you&apos;re considering moving
            away from below, or browse all 235 in the{' '}
            <Link href="/tools" className="text-blue-600 hover:underline">main directory</Link>.
          </p>
        </header>

        <h2 className="text-xl font-bold text-slate-900 mb-5">
          Most-searched alternatives
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popular.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/alternatives/${t.slug}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-colors"
              >
                <ToolLogo
                  slug={t.slug}
                  src={t.logo_url}
                  websiteUrl={t.official_url}
                  name={t.name}
                  className="w-10 h-10 rounded-lg flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{t.name} alternatives</div>
                  <div className="text-xs text-slate-500">Similar to {t.name}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Looking for a tool not listed above?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We maintain alternatives pages for all 235 tools — just append the tool
            slug to the URL, e.g. <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/alternatives/blender</code>, or
            search the{' '}
            <Link href="/tools" className="text-blue-600 hover:underline">directory</Link>.
          </p>
        </div>
      </article>
    </main>
  );
}
