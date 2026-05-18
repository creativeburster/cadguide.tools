import { tools, categories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ToolDetailClient } from '@/components/tool-detail-client';
import {
  toolTitle,
  toolDescription,
  toolCanonical,
  toolKeywords,
  softwareApplicationLd,
  breadcrumbLd,
  faqLd,
  reviewLd,
  SITE_NAME,
} from '@/lib/seo';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};

  const category = categories.find((c) => c.id === tool.category_id);
  const title = toolTitle(tool, category);
  const description = toolDescription(tool, category);
  const canonical = toolCanonical(tool);

  return {
    title,
    description,
    keywords: toolKeywords(tool, category),
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
      // The colocated opengraph-image.tsx route handler provides the per-tool
      // OG image automatically; we don't need to list it here.
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const category = categories.find((c) => c.id === tool.category_id);

  const alternativeTools = tool.alternatives
    ? tool.alternatives.map((s) => tools.find((t) => t.slug === s)).filter(Boolean)
    : tools.filter((t) => t.category_id === tool.category_id && t.id !== tool.id).slice(0, 3);

  // Build all the JSON-LD payloads on the server so they SSR into the
  // initial HTML — crawlers don't run JS, so this must not be deferred to
  // a client component.
  const softwareLd = softwareApplicationLd(tool, category);
  const breadcrumbsLd = breadcrumbLd(tool, category);
  const faq = faqLd(tool);
  const reviews = reviewLd(tool);

  return (
    <>
      <script
        type="application/ld+json"
        // Schema.org payloads are static JSON; React's escaping is fine
        // here, but Next requires `dangerouslySetInnerHTML` for <script>
        // children to avoid React's auto-escaping wrapping JSON in quotes.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      {faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
        />
      )}
      {reviews && reviews.map((review, index) => (
        <script
          key={`review-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(review) }}
        />
      ))}
      <ToolDetailClient tool={tool} category={category} alternativeTools={alternativeTools} />
    </>
  );
}
