import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLBOX_DATA } from '@/lib/toolbox-data';
import { getConversionPair, CONVERSION_PAIRS } from '@/lib/converter-data';
import { ConverterDetailClient } from '@/app/convert/[pair]/converter-detail-client';
import GenericToolboxClient from '@/components/generic-toolbox-client';
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

  // Otherwise, render full high-fidelity toolbox item experience
  const tool = TOOLBOX_DATA.find((t) => t.slug === slug);
  if (!tool) {
    notFound();
  }

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: tool.title, path: `/toolbox/${slug}` },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Header Breadcrumb */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-650" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/toolbox" className="hover:text-blue-600 transition-colors">Toolbox</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{tool.title}</span>
          </nav>
        </div>
      </section>

      {/* Main Client Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <GenericToolboxClient tool={tool} />
      </main>
    </div>
  );
}
