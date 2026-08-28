import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLBOX_DATA } from '@/lib/toolbox-data';
import { getConversionPair, CONVERSION_PAIRS } from '@/lib/converter-data';
import { ConverterDetailClient } from '@/app/convert/[pair]/converter-detail-client';
import { RelatedTools } from '@/components/related-tools';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const pair = getConversionPair(slug);
  if (pair) {
    return {
      title: pair.metaTitle,
      description: pair.metaDescription,
      keywords: [
        `${pair.fromFormat.ext.split(' ')[0]} to ${pair.toFormat.ext.split(' ')[0]}`,
        `convert ${pair.fromFormat.ext.split(' ')[0]} to ${pair.toFormat.ext.split(' ')[0]}`,
        pair.slug,
        pair.title,
        'free cad converter',
        'offline 3d converter'
      ],
      alternates: {
        canonical: `https://cadguide.tools/toolbox/${pair.slug}`,
      },
      openGraph: {
        title: pair.metaTitle,
        description: pair.metaDescription,
        url: `https://cadguide.tools/toolbox/${pair.slug}`,
        type: 'website',
      },
    };
  }

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

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLBOX_DATA.map((t) => ({
    slug: t.slug,
  }));
}

export default async function ToolboxDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const pair = getConversionPair(slug);

  // If this is a 3D Conversion Pair, render the high-fidelity Converter Detail Experience
  if (pair) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cadguide.tools' },
            { '@type': 'ListItem', position: 2, name: 'Toolbox', item: 'https://cadguide.tools/toolbox' },
            { '@type': 'ListItem', position: 3, name: '3D Converters', item: 'https://cadguide.tools/toolbox/convert' },
            { '@type': 'ListItem', position: 4, name: pair.title, item: `https://cadguide.tools/toolbox/${pair.slug}` }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: pair.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer }
          }))
        },
        {
          '@type': 'SoftwareApplication',
          name: pair.title,
          applicationCategory: 'DesignApplication',
          operatingSystem: 'Windows, macOS, Linux, Web',
          description: pair.metaDescription,
          offers: { '@type': 'Offer', price: '0.00', priceCurrency: 'USD' }
        }
      ]
    };

    return (
      <div className="min-h-screen bg-slate-50/50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Header Breadcrumb & H1 Intro */}
        <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 pt-10 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-650" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/toolbox" className="hover:text-blue-600 transition-colors">Toolbox</Link>
              <span>/</span>
              <Link href="/toolbox/convert" className="hover:text-blue-600 transition-colors">3D Converters</Link>
              <span>/</span>
              <span className="text-slate-900 font-bold">{pair.title}</span>
            </nav>

            <div className="max-w-4xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[11px] font-extrabold rounded-full">
                  {pair.categoryLabel}
                </span>
                <span className="text-xs font-bold text-slate-650">
                  Difficulty: {pair.difficulty}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {pair.h1Title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {pair.painPointDesc}
              </p>
            </div>
          </div>
        </section>

        {/* Main Client Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ConverterDetailClient pair={pair} />
        </main>
      </div>
    );
  }

  // Otherwise, render standard placeholder or generic toolbox item
  const tool = TOOLBOX_DATA.find((t) => t.slug === slug);
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
      case 'cheatsheet': return 'Cheat Sheet & Reference';
      case 'calculator': return 'Engineering Calculator';
      case '3d-converter': return '3D CAD & Mesh Converter';
      case 'converter': return 'File Parser & Converter';
      case 'troubleshoot': return 'Troubleshooting Wizard';
      default: return 'Engineering Utility';
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 px-6">
        <div className="max-w-[700px] w-full bg-white border border-slate-100 rounded-[48px] p-8 md:p-12 shadow-sm space-y-8 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

          <div className="flex items-center justify-between">
            <span className="text-base font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/50">
              {renderCategoryLabel(tool.category)}
            </span>
            {tool.origin === 'native' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-base font-black bg-amber-500/10 text-amber-600 border border-amber-500/20">
                🛠️ Native Development
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-base font-black bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                🔍 Cloud Referral Hub
              </span>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {tool.title}
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {tool.origin === 'native'
                ? 'We are actively developing this utility. It runs 100% locally in your browser with complete client-side data privacy (no server uploads).'
                : 'For tasks that require heavy cloud computing or proprietary engines, we evaluate and recommend the best-performing commercial providers. Learn how to process files without license audits or security risks.'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100/50 rounded-3xl p-6 space-y-3">
            <h4 className="text-base font-black text-slate-400 uppercase tracking-wider">
              {tool.origin === 'native' ? 'Features & Specs Preview' : 'Evaluation & Integration Benchmark'}
            </h4>
            <p className="text-base text-slate-600 leading-relaxed font-semibold">
              {tool.detailDesc}
            </p>
          </div>

          <div className="flex items-center gap-4 text-base font-bold text-slate-400">
            <span>{tool.origin === 'native' ? 'Expected Release: Q3 2026' : 'Updates: Verified Links'}</span>
            <span className="text-slate-200">|</span>
            <span>Ecosystem: {tool.origin === 'native' ? 'CADGuide Native' : 'Curated Cloud Directory'}</span>
          </div>

          <RelatedTools />
        </div>

        <div className="max-w-[700px] w-full mt-8 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Continue Exploring</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/toolbox"
              className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group text-center"
            >
              <div className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">🧰 Back to Toolbox</div>
              <div className="text-base font-bold text-slate-600 group-hover:text-blue-600 transition-colors">All Online Utilities</div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
