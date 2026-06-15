import { pageMetadata, siteBreadcrumbLd, howToLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { comparisonPairs } from '@/lib/seo-content';
import { tools } from '@/lib/data';
import Link from 'next/link';
import MatchmakerClient from './matchmaker-client';

export const metadata: Metadata = pageMetadata({
  title: 'Find Your Perfect CAD Tool in 60 Seconds',
  description:
    'Answer 6 quick questions about your industry, platform, budget, team size, workflow, and CAD experience. Get a personalised shortlist of CAD tools.',
  path: '/matchmaker',
});

export default function Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Matchmaker', path: '/matchmaker' },
  ]);
  const howTo = howToLd();
  const validCompareSlugs = comparisonPairs().map((p) => p.pairSlug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <main className="bg-[#fcfdfe] min-h-screen">
        <MatchmakerClient validCompareSlugs={validCompareSlugs} />
        
        {/* Metropolitan Interlink: Crawler Directory & Fast Shortcuts */}
        <section className="max-w-[1000px] mx-auto px-4 pb-24 pt-10 border-t border-slate-100">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Popular CAD & BIM Hub Directories</h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">Skip the questionnaire and browse our curated software specifications, side-by-side matrices, and expert troubleshooting library directly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-xs font-medium">
            {/* Column 1: Software Specs */}
            <div className="space-y-4">
              <h3 className="font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                ★ Platform Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2 font-bold text-slate-600">
                {tools.slice(0, 10).map((t) => (
                  <Link key={t.id} href={`/tools/${t.slug}`} className="hover:text-blue-600 transition-colors">
                    {t.name} Review
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Column 2: Hot PK Comparison Matrices */}
            <div className="space-y-4">
              <h3 className="font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                ⚔ Side-by-Side Battles
              </h3>
              <div className="space-y-2 font-bold text-slate-600 flex flex-col">
                {comparisonPairs().slice(0, 6).map((pair) => (
                  <Link key={pair.pairSlug} href={`/compare/${pair.pairSlug}`} className="hover:text-blue-600 transition-colors">
                    {pair.a.name} vs {pair.b.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Column 3: Curated Industry Portals */}
            <div className="space-y-4">
              <h3 className="font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                📂 Curated Hub Shortlists
              </h3>
              <div className="space-y-2 font-bold text-slate-600 flex flex-col">
                <Link href="/best/2d-cad" className="hover:text-blue-600 transition-colors">Best 2D Drafting Tools</Link>
                <Link href="/best/3d-modeling" className="hover:text-blue-600 transition-colors">Best 3D Modeling Programs</Link>
                <Link href="/best/bim" className="hover:text-blue-600 transition-colors">Best BIM & AEC Software</Link>
                <Link href="/best/feature/parametric-modeling" className="hover:text-blue-600 transition-colors">Parametric Modelers Catalog</Link>
                <Link href="/best/feature/cloud-collaboration" className="hover:text-blue-600 transition-colors">Cloud Collaborative CAD</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
