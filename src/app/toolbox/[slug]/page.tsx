import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLBOX_DATA } from '@/lib/toolbox-data';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';

type Params = Promise<{ slug: string }>;

// Generate dynamic metadata for all individual toolbox assets
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLBOX_DATA.find((t) => t.slug === slug);

  if (!tool) {
    return {};
  }

  return pageMetadata({
    title: `${tool.title} — Free Online CAD Utility & Guide`,
    description: tool.description,
    path: `/toolbox/${slug}`,
  });
}

// Next.js static prerendering for dynamic coming-soon slots
export async function generateStaticParams() {
  // Only pre-render 'coming-soon' tools. Already released tools have their own static directories.
  const comingSoonTools = TOOLBOX_DATA.filter((t) => t.status === 'coming-soon');
  return comingSoonTools.map((t) => ({
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
        return 'Troubleshooting Guide';
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500/10 text-amber-600 border border-amber-500/20">
              🛠️ In Development
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {tool.title}
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              We are actively developing this utility. It runs 100% locally in your browser with complete client-side data privacy (no server uploads).
            </p>
          </div>

          {/* Description of What it will do */}
          <div className="bg-slate-50 border border-slate-100/50 rounded-3xl p-6 space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Features & Specs Preview</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {tool.detailDesc}
            </p>
          </div>

          {/* Dynamic Launch Info */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <span>Expected Release: Q3 2026</span>
            <span className="text-slate-200">|</span>
            <span>Developer: Antigravity AI</span>
          </div>

          {/* Lead Capture form */}
          <NewsletterSubscribe
            variant="banner"
            title="Get notified when this utility launches"
            description="Enter your email below. We will send you a one-time notification the second this tool goes live, along with early access."
            buttonText="Notify Me"
            placeholder="Enter your work email"
            className="pt-6 border-t border-slate-100 rounded-none bg-transparent text-slate-900 p-0"
          />
        </div>
      </main>
    </>
  );
}
