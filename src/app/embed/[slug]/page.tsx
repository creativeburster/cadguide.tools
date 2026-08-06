import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo';
import { EMBED_REGISTRY, getEmbeddable } from '@/lib/embed-registry';

export const metadata: Metadata = pageMetadata({
  title: 'Embeddable CAD Utilities',
  description: 'Chrome-free embeddable versions of CADGuide utilities for partner sites.',
  path: '/embed',
});

export function generateStaticParams() {
  return EMBED_REGISTRY.map((t) => ({ slug: t.slug }));
}

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getEmbeddable(slug);
  if (!tool) notFound();
  const { Component } = tool;

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-lg font-black text-slate-900 tracking-tight">{tool.title}</h1>
          <a href={`https://cadguide.tools/toolbox/${slug}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline shrink-0">
            via CADGuide.tools
          </a>
        </div>
        <Component />
      </div>
    </main>
  );
}
