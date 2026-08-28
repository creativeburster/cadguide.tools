import { Metadata } from 'next';
import Link from 'next/link';
import { 
  getAllConversionPairs, 
  CONVERTER_CATEGORIES 
} from '@/lib/converter-data';
import { ConvertHubClient } from '@/app/convert/convert-hub-client';

export const metadata: Metadata = {
  title: 'CAD & 3D Format Converters Directory — Free Local & Cloud Utilities | CADGuide Toolbox',
  description: 'Convert between STEP, STL, 3MF, SLDPRT, GLB, DWG, and IFC. Compare 100% offline open-source meshers with industrial cloud converters with zero data leakage.',
  alternates: {
    canonical: 'https://cadguide.tools/toolbox/convert',
  },
  openGraph: {
    title: 'Free CAD & 3D Format Converter Directory — STEP, STL, SLDPRT, GLB, IFC',
    description: 'Watertight mesh discretizations, boundary representation preservation, and CAD data privacy protection.',
    url: 'https://cadguide.tools/toolbox/convert',
    type: 'website',
  },
};

export default function ToolboxConvertHubPage() {
  const allPairs = getAllConversionPairs();
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cadguide.tools' },
          { '@type': 'ListItem', position: 2, name: 'Toolbox', item: 'https://cadguide.tools/toolbox' },
          { '@type': 'ListItem', position: 3, name: '3D Converters', item: 'https://cadguide.tools/toolbox/convert' }
        ]
      },
      {
        '@type': 'ItemList',
        name: 'CAD & 3D Format Converters',
        description: 'Comprehensive directory of 3D printing, MCAD, Web3D, and BIM format converters.',
        numberOfItems: allPairs.length,
        itemListElement: allPairs.map((pair, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: pair.title,
          url: `https://cadguide.tools/toolbox/${pair.slug}`
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-650" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/toolbox" className="hover:text-blue-600 transition-colors">Toolbox</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">3D Converters</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
              <span>⚡ 0 Server Load • Privacy-First Discretization</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Interactive <span className="text-blue-600">3D CAD Format Converters</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Direct and vetted conversion pipelines between solid CAD (STEP, SLDPRT, IPT), 3D printing meshes (STL, 3MF), Web3D containers (GLB, glTF), and openBIM (IFC).
            </p>
          </div>
        </div>
      </section>

      {/* Main Client Hub Component */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ConvertHubClient 
          initialPairs={allPairs} 
        />
      </main>
    </div>
  );
}
