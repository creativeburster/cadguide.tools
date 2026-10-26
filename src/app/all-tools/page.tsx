import { tools, categories } from '@/lib/data';
import { TOOLBOX_DATA, TOOLBOX_CATEGORIES } from '@/lib/toolbox-data';
import {
  FILE_FORMAT_PAGES,
  PLATFORM_PAGES,
  SECTOR_PAGES,
  PERSONA_PAGES,
} from '@/lib/seo-content';
import { getAllConversionPairs } from '@/lib/converter-data';
import Link from 'next/link';
import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata({
  title: 'All CAD Tools & Engineering Index — Complete Directory',
  description:
    'Complete A-Z index of all 185 professional CAD, BIM, CAE/CAM, and EDA software reviews, 660+ engineering calculators & utilities, file format hubs, and industry guides on CADGuide.tools.',
  path: '/all-tools',
});

export default function AllToolsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'All Tools', path: '/all-tools' },
  ]);

  const formatList = Object.values(FILE_FORMAT_PAGES);
  const platformList = Object.values(PLATFORM_PAGES);
  const sectorList = Object.values(SECTOR_PAGES);
  const personaList = Object.values(PERSONA_PAGES);
  const conversionPairs = getAllConversionPairs();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <main className="min-h-screen bg-slate-50 py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Complete CADGuide.tools Site Index
          </h1>
          <p className="text-slate-600 mb-12 text-lg">
            A complete A–Z index of every software review ({tools.length} products), engineering utility ({TOOLBOX_DATA.length} tools), file format specification ({formatList.length} formats), and industry hub on CADGuide.tools. For the machine-readable XML sitemap, see{' '}
            <Link href="/sitemap.xml" className="text-blue-600 hover:underline">
              /sitemap.xml
            </Link>
            .
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Main Pages */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                Core Hubs & Directories
              </h2>
              <ul className="grid grid-cols-2 gap-3 text-sm">
                <li><Link href="/" className="text-blue-600 hover:underline font-medium">Homepage</Link></li>
                <li><Link href="/tools" className="text-blue-600 hover:underline font-medium">Software Directory</Link></li>
                <li><Link href="/toolbox" className="text-blue-600 hover:underline font-medium">Engineering Toolbox</Link></li>
                <li><Link href="/convert" className="text-blue-600 hover:underline font-medium">3D Format Converters</Link></li>
                <li><Link href="/compare" className="text-blue-600 hover:underline font-medium">Side-by-Side Compare</Link></li>
                <li><Link href="/alternatives" className="text-blue-600 hover:underline font-medium">Alternatives Hub</Link></li>
                <li><Link href="/best" className="text-blue-600 hover:underline font-medium">Best-Of Rankings</Link></li>
                <li><Link href="/file-formats" className="text-blue-600 hover:underline font-medium">CAD File Formats</Link></li>
                <li><Link href="/platforms" className="text-blue-600 hover:underline font-medium">OS Platforms</Link></li>
                <li><Link href="/sectors" className="text-blue-600 hover:underline font-medium">Industry Sectors</Link></li>
                <li><Link href="/for" className="text-blue-600 hover:underline font-medium">Guides by Role</Link></li>
                <li><Link href="/pricing" className="text-blue-600 hover:underline font-medium">Pricing & Licensing</Link></li>
                <li><Link href="/free" className="text-blue-600 hover:underline font-medium">Free CAD Software</Link></li>
                <li><Link href="/open-source" className="text-blue-600 hover:underline font-medium">Open Source CAD</Link></li>
                <li><Link href="/matchmaker" className="text-blue-600 hover:underline font-medium">AI Matchmaker</Link></li>
                <li><Link href="/deals" className="text-blue-600 hover:underline font-medium">Verified Deals</Link></li>
              </ul>
            </section>

            {/* Categories */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-600 rounded-full"></span>
                Best Software by Category
              </h2>
              <ul className="space-y-3 text-sm">
                {categories.map((cat) => (
                  <li key={cat.id} className="flex items-center justify-between">
                    <Link href={`/best/${cat.slug}`} className="text-blue-600 hover:underline font-medium">
                      Best {cat.name} Software
                    </Link>
                    <Link href={`/tools?category=${cat.id}`} className="text-xs text-slate-400 hover:text-blue-600">
                      Directory →
                    </Link>
                  </li>
                ))}
                <li className="pt-2 border-t border-slate-100">
                  <Link href="/best/beginners" className="text-blue-600 hover:underline font-medium">
                    Best CAD Software for Beginners
                  </Link>
                </li>
              </ul>
            </section>
          </div>

          {/* All Software Index */}
          <section className="mt-10 bg-white p-8 rounded-3xl shadow-sm border">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
              Full Software Reviews Index ({tools.length} Tools)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2.5">
              {[...tools]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="text-slate-600 hover:text-blue-600 text-sm py-0.5 transition-colors block truncate"
                  >
                    {tool.name}
                  </Link>
                ))}
            </div>
          </section>

          {/* File Formats, Platforms, Sectors & Roles */}
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <section className="bg-white p-8 rounded-3xl shadow-sm border">
              <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                CAD & BIM File Formats ({formatList.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-sm">
                {formatList.map((f) => (
                  <Link
                    key={f.slug}
                    href={`/file-formats/${f.slug}`}
                    className="text-slate-600 hover:text-blue-600 truncate"
                  >
                    {f.formatName} (.{f.slug})
                  </Link>
                ))}
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-8 mb-4">
                Operating Systems & Licensing
              </h3>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {platformList.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/platforms/${p.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600"
                  >
                    {p.displayName}
                  </Link>
                ))}
                {['perpetual', 'subscription', 'freemium', 'network', 'educational'].map((m) => (
                  <Link
                    key={m}
                    href={`/pricing/${m}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 capitalize"
                  >
                    {m} License
                  </Link>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border">
              <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
                Industry Sectors & Engineering Roles
              </h2>
              <div className="grid grid-cols-2 gap-2.5 text-sm mb-6">
                {sectorList.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/sectors/${s.slug}`}
                    className="text-slate-600 hover:text-blue-600 truncate"
                  >
                    {s.displayName}
                  </Link>
                ))}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">
                By Engineering Persona ({personaList.length})
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-sm">
                {personaList.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/for/${r.slug}`}
                    className="text-slate-600 hover:text-blue-600 truncate"
                  >
                    For {r.displayName}
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* 3D Format Converters */}
          <section className="mt-10 bg-white p-8 rounded-3xl shadow-sm border">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-teal-600 rounded-full"></span>
              CAD & 3D Format Conversion Guides ({conversionPairs.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2 text-xs">
              {conversionPairs.map((pair) => (
                <Link
                  key={pair.slug}
                  href={`/convert/${pair.slug}`}
                  className="text-slate-600 hover:text-blue-600 truncate py-0.5"
                >
                  {pair.fromFormat.ext} to {pair.toFormat.ext} ({pair.slug})
                </Link>
              ))}
            </div>
          </section>

          {/* All 667 Toolbox Utilities */}
          <section className="mt-10 bg-white p-8 rounded-3xl shadow-sm border">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-rose-600 rounded-full"></span>
              Interactive Engineering Toolbox ({TOOLBOX_DATA.length} Utilities)
            </h2>
            <div className="space-y-8">
              {TOOLBOX_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const items = TOOLBOX_DATA.filter((t) => t.category === cat.id);
                if (items.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                      {cat.name} ({items.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs">
                      {items.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/toolbox/${item.slug}`}
                          className="text-slate-600 hover:text-blue-600 truncate py-0.5"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
