import Link from 'next/link';
import type { Metadata } from 'next';
import { tools, categories } from '@/lib/data';
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

  // Helper to get sorted tools for a category
  const getToolsInCategory = (catId: string) => {
    return tools
      .filter((t) => t.category_id === catId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <article className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:underline">Home</Link>{' / '}
          <span className="text-slate-700">Alternatives</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            CAD Software Alternatives — {tools.length} Switchover Guides
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-3xl">
            Every tool in our catalog has a dedicated alternatives page that ranks
            5-8 editor-vetted competitors. Pick the tool you&apos;re considering moving
            away from below, or browse all {tools.length} in the{' '}
            <Link href="/tools" className="text-blue-600 hover:underline">main directory</Link>.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Most-searched alternatives
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popular.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/alternatives/${t.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <ToolLogo
                    slug={t.slug}
                    src={t.logo_url}
                    websiteUrl={t.official_url}
                    name={t.name}
                    className="w-10 h-10 rounded-lg flex-shrink-0 border border-slate-100 shadow-inner"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{t.name} alternatives</div>
                    <div className="text-xs text-slate-500">Similar to {t.name}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Brand new Category Accordion Directory of all 240+ tools */}
        <section className="border-t border-slate-200 pt-12 mb-12">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Browse Alternatives for All {tools.length} Tools
          </h2>
          <p className="mt-2 text-slate-500 text-sm font-medium mb-8">
            Select an industry sector below to discover verified alternatives and direct competitors for any design tool.
          </p>

          <div className="space-y-4">
            {categories.map((cat) => {
              const catTools = getToolsInCategory(cat.id);
              if (catTools.length === 0) return null;

              return (
                <details
                  key={cat.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 shadow-sm [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer select-none list-none font-bold text-slate-900 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-base sm:text-lg font-black tracking-tight">{cat.name} Sector</span>
                      <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                        {catTools.length} Guides
                      </span>
                    </div>
                    <span className="transition-transform duration-300 group-open:rotate-90 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-slate-100 bg-slate-50/30">
                    <p className="text-xs text-slate-400 font-bold mb-4 uppercase tracking-wider">
                      {cat.description}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {catTools.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/alternatives/${t.slug}`}
                            className="block py-2.5 px-4 rounded-xl border border-slate-200/50 bg-white hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all text-xs font-bold text-slate-700 truncate"
                          >
                            {t.name} Alternatives →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Looking for a tool not listed above?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We maintain alternatives pages for all {tools.length} tools. If you don&apos;t see your tool, you can search our{' '}
            <Link href="/tools" className="text-blue-600 hover:underline">main directory</Link> or type <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/alternatives/&lt;tool-name&gt;</code> directly into the address bar.
          </p>
        </div>
      </article>
    </main>
  );
}
