import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar, ExternalLink } from 'lucide-react';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'guides');

interface GuideFrontmatter {
  title: string;
  excerpt: string;
  category: string;
  softwareSlug: string;
  keyword: string;
  slug: string;
  author: string;
  readTime: string;
  date: string;
  sources: string[];
}

function getAllGuides(): { slug: string; frontmatter: GuideFrontmatter; tool: string }[] {
  const tools = fs.readdirSync(CONTENT_DIR);
  const guides: { slug: string; frontmatter: GuideFrontmatter; tool: string }[] = [];

  for (const tool of tools) {
    const toolDir = path.join(CONTENT_DIR, tool);
    if (!fs.statSync(toolDir).isDirectory()) continue;
    const files = fs.readdirSync(toolDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(toolDir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(raw);
      if (data.slug) {
        guides.push({ slug: data.slug as string, frontmatter: data as GuideFrontmatter, tool });
      }
    }
  }

  return guides;
}

function getGuideBySlug(slug: string): { frontmatter: GuideFrontmatter; contentHtml: string; tool: string } | null {
  const all = getAllGuides();
  const found = all.find(g => g.slug === slug);
  if (!found) return null;

  const filePath = path.join(CONTENT_DIR, found.tool, `${slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const processed = remark().use(html).processSync(content);
  const contentHtml = processed.toString();

  return { frontmatter: data as GuideFrontmatter, contentHtml, tool: found.tool };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides().map(g => ({ slug: g.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: 'Not Found — CADGuide' };

  const { frontmatter } = guide;
  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    keywords: [frontmatter.keyword, frontmatter.category, 'cad guide', 'technical guide', frontmatter.softwareSlug],
    alternates: {
      canonical: `https://cadguide.tools/guides/articles/${slug}`,
    },
    openGraph: {
      type: 'article',
      url: `https://cadguide.tools/guides/articles/${slug}`,
      title: frontmatter.title,
      description: frontmatter.excerpt,
      siteName: 'CADGuide.tools',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
    },
    robots: { index: false, follow: true },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  troubleshooting: 'Troubleshooting',
  performance: 'Performance',
  manufacturing: 'Manufacturing',
  deployment: 'Deployment',
  standards: 'Standards',
  procurement: 'Procurement',
  printing: 'Printing',
  migration: 'Migration',
};

const CATEGORY_COLORS: Record<string, string> = {
  troubleshooting: 'bg-red-50 text-red-700 border-red-200',
  performance: 'bg-amber-50 text-amber-700 border-amber-200',
  manufacturing: 'bg-blue-50 text-blue-700 border-blue-200',
  deployment: 'bg-purple-50 text-purple-700 border-purple-200',
  standards: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  procurement: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  printing: 'bg-teal-50 text-teal-700 border-teal-200',
  migration: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

export default async function GuideArticlePage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const { frontmatter, contentHtml, tool } = guide;
  const categoryLabel = CATEGORY_LABELS[frontmatter.category] || frontmatter.category;
  const categoryColor = CATEGORY_COLORS[frontmatter.category] || 'bg-slate-50 text-slate-700 border-slate-200';

  const toolDisplayName = tool.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <article className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/guides" className="hover:text-slate-700 transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-slate-700">{toolDisplayName}</span>
            <span>/</span>
            <span className="text-slate-700 truncate">{categoryLabel}</span>
          </nav>

          {/* Category badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${categoryColor}`}>
            {categoryLabel}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-4">
            {frontmatter.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
            {frontmatter.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {frontmatter.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {frontmatter.readTime}
            </span>
            <span className="text-slate-400">By {frontmatter.author}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div
          className="prose prose-slate prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-slate-700 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:text-blue-700
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:py-4 prose-pre:text-sm prose-pre:overflow-x-auto
            prose-blockquote:border-l-4 prose-blockquote:border-slate-200 prose-blockquote:bg-slate-50 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            prose-ul:my-4 prose-ol:my-4 prose-li:my-1
            prose-table:my-6 prose-table:w-full prose-table:border-collapse
            prose-th:bg-slate-50 prose-th:border prose-th:border-slate-200 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-bold prose-th:text-sm
            prose-td:border prose-td:border-slate-200 prose-td:px-3 prose-td:py-2 prose-td:text-sm
            [&_table]:text-sm"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Sources */}
        {frontmatter.sources && frontmatter.sources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 mb-4">Source Verification</h2>
            <ul className="space-y-2">
              {frontmatter.sources.map((src, i) => (
                <li key={i}>
                  <a
                    href={src}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium break-all"
                  >
                    <ExternalLink className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{src}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guides
          </Link>
        </div>
      </div>
    </article>
  );
}
