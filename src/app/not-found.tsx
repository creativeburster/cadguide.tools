import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Search, ArrowRight, Wrench, BookOpen, Sparkles, Trophy, GitCompare } from 'lucide-react';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Page Not Found (404) | CADGuide.tools',
    description:
      'The page you requested could not be found. Browse our directory of professional CAD & BIM software, or try the Matchmaker to find your tool.',
    path: '/404',
  }),
  robots: { index: false, follow: true },
};

const POPULAR_TOOLS = [
  { slug: 'autocad', name: 'AutoCAD' },
  { slug: 'solidworks', name: 'SolidWorks' },
  { slug: 'revit', name: 'Revit' },
  { slug: 'fusion-360', name: 'Fusion 360' },
  { slug: 'rhino', name: 'Rhino' },
  { slug: 'blender', name: 'Blender' },
  { slug: 'catia', name: 'CATIA' },
  { slug: 'siemens-nx', name: 'Siemens NX' },
  { slug: 'sketchup', name: 'SketchUp' },
  { slug: 'civil-3d', name: 'Civil 3D' },
  { slug: 'archicad', name: 'ArchiCAD' },
  { slug: 'inventor', name: 'Inventor' },
];

const POPULAR_GUIDES = [
  { slug: 'autocad-performance-speed-up-slow-drawing-fix', title: 'AutoCAD Running Slow? 12 Ways to Speed Up Your Drawings' },
  { slug: 'solidworks-crash-recovery-corrupt-file-fix', title: 'SolidWorks Crash Recovery: Fix Corrupt Files & Prevent Data Loss' },
  { slug: 'revit-central-model-corruption-sync-conflict-fix', title: 'Revit Central Model Corruption: Sync Conflicts & Recovery' },
  { slug: 'fusion-360-performance-optimization-large-assembly', title: 'Fusion 360 Performance Optimization for Large Assemblies' },
  { slug: 'blender-render-noise-fireflies-denoiser-settings', title: 'Blender Render Noise & Fireflies: Denoiser Settings Guide' },
  { slug: 'rhino-file-corruption-recovery-autosave-restore', title: 'Rhino File Corruption Recovery: Autosave & Restore Methods' },
];

const QUICK_LINKS = [
  { href: '/tools', icon: Wrench, label: 'Browse Tools', desc: '50+ CAD, BIM & CAE tools' },
  { href: '/matchmaker', icon: Sparkles, label: 'Smart Matchmaker', desc: 'Find your tool in 60s' },
  { href: '/best', icon: Trophy, label: 'Best Lists', desc: 'Top tools by category' },
  { href: '/compare', icon: GitCompare, label: 'Compare Tools', desc: 'Side-by-side matchups' },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Top gradient bar */}
      <div className="w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-4xl mx-auto">
          {/* Hero section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 mb-6">
              <span className="text-3xl font-black text-blue-600">404</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">
              This page took a coffee break
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or may have moved.
              Let&apos;s get you back on track.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-xl mx-auto mb-12">
            <form action="/tools" method="GET" className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="q"
                placeholder="Search for a CAD tool, guide, or topic..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 text-sm font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-slate-700 shadow-sm"
              />
            </form>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {QUICK_LINKS.map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl bg-white border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <Icon className="w-5 h-5 text-blue-600 mb-2" />
                <div className="text-sm font-bold text-slate-900">{label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
              </Link>
            ))}
          </div>

          {/* Two columns: Popular tools + Popular guides */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular tools */}
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Popular Tools</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_TOOLS.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 transition-all group"
                  >
                    <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">{tool.name}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular guides */}
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Popular Guides</h2>
              </div>
              <ul className="space-y-2">
                {POPULAR_GUIDES.map(guide => (
                  <li key={guide.slug}>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="flex items-start gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 mt-0.5 shrink-0" />
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600 leading-relaxed">{guide.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Home button */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
