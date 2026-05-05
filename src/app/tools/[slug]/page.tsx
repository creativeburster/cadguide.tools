import { tools, categories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ToolDetailClient } from '@/components/tool-detail-client';

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const category = categories.find((c) => c.id === tool.category_id);
  
  // Find alternative tools
  const alternativeTools = tool.alternatives 
    ? tool.alternatives.map(s => tools.find(t => t.slug === s)).filter(Boolean)
    : tools.filter(t => t.category_id === tool.category_id && t.id !== tool.id).slice(0, 3);

  return (
    <ToolDetailClient 
      tool={tool} 
      category={category} 
      alternativeTools={alternativeTools} 
    />
  );
}
