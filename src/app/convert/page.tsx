import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Printer, 
  Cog, 
  Globe, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  FileCode2
} from 'lucide-react';
import { getAllConversionPairs, CONVERTER_CATEGORIES } from '@/lib/converter-data';
import { ConvertHubClient } from './convert-hub-client';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'CAD & 3D Model Format Converters Matrix (2026) — Fast, Free & Secure',
  description: 'Convert between STEP, STL, 3MF, SLDPRT, Parasolid X_T, CATPart, GLB, OBJ, and IFC. Compare offline open-source and cloud converter tools with zero IP leakage.',
  keywords: [
    '3d format converter',
    'cad converter',
    'step to stl',
    'step to 3mf',
    'sldprt to step',
    'catpart to step',
    'cad to glb',
    'revit to ifc',
    '3d model converter free',
    'parasolid converter'
  ],
  alternates: {
    canonical: 'https://cadguide.tools/convert',
  },
  openGraph: {
    title: 'CAD & 3D Format Converters Matrix (2026) — CADGuide.tools',
    description: 'Free, high-fidelity CAD & 3D model conversion pipelines. Find the best offline and cloud tools for 3D printing, CNC machining, Web3D, and BIM.',
    url: 'https://cadguide.tools/convert',
    type: 'website',
  },
};

export default function ConvertHubPage() {
  const allPairs = getAllConversionPairs();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'CAD & 3D Model Format Converters Matrix (2026)',
    description: 'Universal directory and benchmark of CAD, 3D printing, and Web3D format conversion pipelines.',
    url: 'https://cadguide.tools/convert',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: allPairs.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: p.title,
        url: `https://cadguide.tools/convert/${p.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-slate-50 border-b border-slate-200/80 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-650" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">3D Converters</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal 3D CAD Translation Hub • 28 Active Matrix Pairs</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              CAD & 3D Format Converters Matrix
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              High-precision geometric translation pipelines for mechanical engineering, multi-material 3D printing, Web3D eCommerce, and openBIM federation. Compare curated offline tools & cloud services with zero CAD license lock-in.
            </p>
          </div>

          {/* Value Props Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">3D Printing</div>
                <div className="text-[11px] font-semibold text-slate-650">Watertight STL & 3MF</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                <Cog className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">MCAD Interop</div>
                <div className="text-[11px] font-semibold text-slate-650">B-Rep STEP & Parasolid</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Web3D & AR</div>
                <div className="text-[11px] font-semibold text-slate-650">Draco GLB & glTF 2.0</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">BIM & 2D Blueprints</div>
                <div className="text-[11px] font-semibold text-slate-650">openBIM IFC & 1:1 DWG</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Hub Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ConvertHubClient initialPairs={allPairs} />
      </main>
    </div>
  );
}
