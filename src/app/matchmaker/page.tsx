import { pageMetadata, siteBreadcrumbLd, howToLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { comparisonPairs } from '@/lib/seo-content';
import { tools } from '@/lib/data';
import Link from 'next/link';
import MatchmakerClient from './matchmaker-client';
import { Sparkles, Scale, Layers, BookOpen, Settings, Tag, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
        
        {/* Metropolitan Interlink: Crawler Directory & Fast Shortcuts (Premium 6-Card Grid) */}
        <section className="max-w-[1200px] mx-auto px-4 pb-24 pt-16 border-t border-slate-100">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Popular CAD & BIM Hub Directories</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium leading-relaxed">
              Skip the questionnaire and browse our curated software specifications, side-by-side matrices, and expert troubleshooting library directly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {/* Card 1: Software Tools Review */}
            <Card className="rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xs p-6 bg-white hover:shadow-md transition-shadow">
              <h3 className="flex items-center gap-2 text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
                <Layers className="w-4 h-4 text-blue-500" /> Most Popular Reviews
              </h3>
              <div className="space-y-1">
                {[
                  { name: 'AutoCAD Review', slug: 'autocad' },
                  { name: 'SolidWorks Review', slug: 'solidworks' },
                  { name: 'SketchUp Review', slug: 'sketchup' },
                  { name: 'Revit Review', slug: 'revit' },
                  { name: 'Rhino 3D Review', slug: 'rhino-3d' }
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/tools/${item.slug}`}
                    className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors py-2 px-2.5 hover:bg-slate-50 rounded-xl group"
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-0.5 shrink-0" />
                  </Link>
                ))}
              </div>
            </Card>
            
            {/* Card 2: PK Battles */}
            <Card className="rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xs p-6 bg-white hover:shadow-md transition-shadow">
              <h3 className="flex items-center gap-2 text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
                <Scale className="w-4 h-4 text-amber-500" /> Hot Side-by-Side Battles
              </h3>
              <div className="space-y-1">
                {[
                  { name: 'AutoCAD vs ZWCAD', slug: 'autocad-vs-zwcad' },
                  { name: 'AutoCAD vs GstarCAD', slug: 'autocad-vs-gstarcad' },
                  { name: 'SolidWorks vs Fusion 360', slug: 'fusion-360-vs-solidworks' },
                  { name: 'Revit vs ArchiCAD', slug: 'archicad-vs-revit' },
                  { name: 'SketchUp vs Rhino', slug: 'rhino-3d-vs-sketchup' }
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/compare/${item.slug}`}
                    className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors py-2 px-2.5 hover:bg-slate-50 rounded-xl group"
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-0.5 shrink-0" />
                  </Link>
                ))}
              </div>
            </Card>
            
            {/* Card 3: Alternatives */}
            <Card className="rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xs p-6 bg-white hover:shadow-md transition-shadow">
              <h3 className="flex items-center gap-2 text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
                <Sparkles className="w-4 h-4 text-purple-500" /> Best Alternatives
              </h3>
              <div className="space-y-1">
                {[
                  { name: 'AutoCAD Competitors', slug: 'autocad' },
                  { name: 'SolidWorks Competitors', slug: 'solidworks' },
                  { name: 'Revit Competitors', slug: 'revit' },
                  { name: 'SketchUp Competitors', slug: 'sketchup' },
                  { name: 'Rhino 3D Competitors', slug: 'rhino-3d' }
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/alternatives/${item.slug}`}
                    className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors py-2 px-2.5 hover:bg-slate-50 rounded-xl group"
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-0.5 shrink-0" />
                  </Link>
                ))}
              </div>
            </Card>
            
            {/* Card 4: Technical Guides */}
            <Card className="rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xs p-6 bg-white hover:shadow-md transition-shadow">
              <h3 className="flex items-center gap-2 text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
                <BookOpen className="w-4 h-4 text-rose-500" /> Hot Technical Guides
              </h3>
              <div className="space-y-1">
                {process.env.NODE_ENV === 'development' ? (
                  <div className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 p-4 rounded-xl text-center select-none">
                    🔒 Guides hidden in Local Dev (30-Day Plan Sandbox)
                  </div>
                ) : [
                  { name: 'AutoCAD 0x0024 Fatal Error Fix', slug: 'autocad-troubleshooting-0' },
                  { name: 'FLEXlm Socket Port Binding Patch', slug: 'autocad-troubleshooting-1' },
                  { name: 'SolidWorks Performance Setup', slug: 'solidworks-performance-1' },
                  { name: 'Custom CTB Pen Tables Plotting', slug: 'autocad-printing-2' },
                  { name: 'Revit AIA Layer Guidelines V6', slug: 'revit-standards-1' }
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/guides/${item.slug}`}
                    className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors py-2 px-2.5 hover:bg-slate-50 rounded-xl group"
                  >
                    <span className="truncate">{item.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-0.5 shrink-0" />
                  </Link>
                ))}
              </div>
            </Card>
            
            {/* Card 5: Toolbox Utilities */}
            <Card className="rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xs p-6 bg-white hover:shadow-md transition-shadow">
              <h3 className="flex items-center gap-2 text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
                <Settings className="w-4 h-4 text-emerald-500" /> Dynamic Toolbox Utilities
              </h3>
              <div className="space-y-1">
                {[
                  { name: 'DWG Version Checker & Converter', slug: 'dwg-version-checker' },
                  { name: 'Drawing Lag Performance Cleaner', slug: 'drawing-lag-performance-cleaner' },
                  { name: 'CTB Plot Style Pen Visualizer', slug: 'ctb-plot-style-pen-visualizer' },
                  { name: 'Cloud BIM RVT to IFC Exporter', slug: 'cloud-bim-rvt-to-ifc-converter' },
                  { name: 'FLEXlm Server Socket Debugger', slug: 'flexlm-error-15-debugger' }
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/toolbox/${item.slug}`}
                    className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors py-2 px-2.5 hover:bg-slate-50 rounded-xl group"
                  >
                    <span className="truncate">{item.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-0.5 shrink-0" />
                  </Link>
                ))}
              </div>
            </Card>
            
            {/* Card 6: Software Deals */}
            <Card className="rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xs p-6 bg-white hover:shadow-md transition-shadow">
              <h3 className="flex items-center gap-2 text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
                <Tag className="w-4 h-4 text-indigo-500" /> Active Promo Codes
              </h3>
              <div className="space-y-1">
                {[
                  { name: 'AutoCAD Active Discount Code', slug: 'autocad' },
                  { name: 'SolidWorks Promo Seats Deal', slug: 'solidworks' },
                  { name: 'SketchUp Official Discount Code', slug: 'sketchup' },
                  { name: 'Autodesk Fusion 360 Special Offer', slug: 'fusion-360' },
                  { name: 'BricsCAD Silent Seat Coupon', slug: 'bricscad' }
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/deals?tool=${item.slug}`}
                    className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors py-2 px-2.5 hover:bg-slate-50 rounded-xl group"
                  >
                    <span className="truncate">{item.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-0.5 shrink-0" />
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
