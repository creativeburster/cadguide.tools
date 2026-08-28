import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getConversionPair, 
  getAllConversionSlugs, 
  CONVERSION_PAIRS 
} from '@/lib/converter-data';
import { ConverterDetailClient } from './converter-detail-client';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const slugs = getAllConversionSlugs();
  return slugs.map((pair) => ({ pair }));
}

interface PageProps {
  params: Promise<{ pair: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const pair = getConversionPair(resolvedParams.pair);
  if (!pair) return {};

  return {
    title: pair.metaTitle,
    description: pair.metaDescription,
    keywords: [
      `${pair.fromFormat.ext.split(' ')[0]} to ${pair.toFormat.ext.split(' ')[0]}`,
      `convert ${pair.fromFormat.ext.split(' ')[0]} to ${pair.toFormat.ext.split(' ')[0]}`,
      `${pair.slug}`,
      pair.title,
      pair.fromFormat.name,
      pair.toFormat.name,
      'free cad converter',
      'offline 3d converter'
    ],
    alternates: {
      canonical: `https://cadguide.tools/convert/${pair.slug}`,
    },
    openGraph: {
      title: pair.metaTitle,
      description: pair.metaDescription,
      url: `https://cadguide.tools/convert/${pair.slug}`,
      type: 'website',
    },
  };
}

export default async function ConverterDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const pair = getConversionPair(resolvedParams.pair);

  if (!pair) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://cadguide.tools'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '3D Converters',
            item: 'https://cadguide.tools/convert'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: pair.title,
            item: `https://cadguide.tools/convert/${pair.slug}`
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: pair.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      },
      {
        '@type': 'SoftwareApplication',
        name: pair.title,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Windows, macOS, Linux, Web',
        description: pair.metaDescription,
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD'
        }
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
            <Link href="/convert" className="hover:text-blue-600 transition-colors">3D Converters</Link>
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
