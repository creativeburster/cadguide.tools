import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLBOX_DATA } from '@/lib/toolbox-data';
import { RelatedTools } from '@/components/related-tools';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

// Generate dynamic metadata for all individual toolbox assets
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLBOX_DATA.find((t) => t.slug === slug);

  if (!tool) {
    return {};
  }

  return pageMetadata({
    title: `${tool.title} ${tool.origin === 'third-party' ? 'Specs' : 'Utility'}`,
    description: tool.description,
    path: `/toolbox/${slug}`,
  });
}

// Next.js static prerendering for dynamic coming-soon slots
export function generateStaticParams() {
  return TOOLBOX_DATA.map((t) => ({
    slug: t.slug,
  }));
}

export default async function ToolboxDetailPlaceholderPage({ params }: { params: Params }) {
  const { slug } = await params;
  const tool = TOOLBOX_DATA.find((t) => t.slug === slug);

  // If the slug is unrecognized in our dataset, render the standard 404
  if (!tool) {
    notFound();
  }

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: tool.title, path: `/toolbox/${slug}` },
  ]);

  const renderCategoryLabel = (category: typeof tool.category) => {
    switch (category) {
      case 'cheatsheet':
        return 'Cheat Sheet & Reference';
      case 'calculator':
        return 'Engineering Calculator';
      case 'converter':
        return 'File Parser & Converter';
      case 'troubleshoot':
        return 'Troubleshooting Wizard';
    }
  };

  return (
    <>
      {/* Breadcrumb schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 px-6">
        <div className="max-w-[700px] w-full bg-white border border-slate-100 rounded-[48px] p-8 md:p-12 shadow-sm space-y-8 relative overflow-hidden">
          
          {/* Glassmorphism top border effect */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

          {/* Badge & Category */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/50">
              {renderCategoryLabel(tool.category)}
            </span>
            {tool.origin === 'native' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500/10 text-amber-600 border border-amber-500/20">
                🛠️ Native Development
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                🔍 Cloud Referral Hub
              </span>
            )}
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {tool.title}
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {tool.origin === 'native'
                ? 'We are actively developing this utility. It runs 100% locally in your browser with complete client-side data privacy (no server uploads).'
                : 'For tasks that require heavy cloud computing or proprietary engines, we evaluate and recommend the best-performing commercial providers. Learn how to process files without license audits or security risks.'}
            </p>
          </div>

          {/* Description of What it will do */}
          <div className="bg-slate-50 border border-slate-100/50 rounded-3xl p-6 space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {tool.origin === 'native' ? 'Features & Specs Preview' : 'Evaluation & Integration Benchmark'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {tool.detailDesc}
            </p>
          </div>

          {/* Dynamic Info */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <span>{tool.origin === 'native' ? 'Expected Release: Q3 2026' : 'Updates: Verified Links'}</span>
            <span className="text-slate-200">|</span>
            <span>Ecosystem: {tool.origin === 'native' ? 'CADGuide Native' : 'Curated Cloud Directory'}</span>
          </div>

          {/* Lead Capture form */}
          {tool.origin === 'native' ? (
            <RelatedTools />
          ) : (
            <RelatedTools />
          )}
        </div>

        {/* Metropolitan Interlink: Cross-type navigation */}
        <div className="max-w-[700px] w-full mt-8 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Continue Exploring</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href={`/guides/${(() => {
                const s = slug.toLowerCase();
                if (s.includes('dwg') || s.includes('dxf') || s.includes('font') || s.includes('version') || s.includes('regapp')) return 'troubleshooting';
                if (s.includes('pdf') || s.includes('print') || s.includes('viewport')) return 'printing';
                if (s.includes('step') || s.includes('stl') || s.includes('obj') || s.includes('gltf') || s.includes('k-factor') || s.includes('thread') || s.includes('weld') || s.includes('spring') || s.includes('screw') || s.includes('pipe')) return 'manufacturing';
                if (s.includes('ifc') || s.includes('revit') || s.includes('skp') || s.includes('fbx')) return 'standards';
                if (s.includes('license') || s.includes('audit')) return 'procurement';
                if (s.includes('compare') || s.includes('diff') || s.includes('layer')) return 'standards';
                if (s.includes('point-cloud') || s.includes('las') || s.includes('mesh')) return 'manufacturing';
                return 'troubleshooting';
              })()}`}
              className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group text-center"
            >
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">📖 Expert Guides</div>
              <div className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Related Tutorials</div>
            </Link>
            <Link
              href="/toolbox"
              className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group text-center"
            >
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">🧰 Back to Toolbox</div>
              <div className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">All Online Utilities</div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
