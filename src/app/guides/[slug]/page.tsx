import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, ExternalLink, ArrowRight, FileText, Scale, Settings, Sparkles, BookOpen, Tag } from 'lucide-react';
import { tools } from '@/lib/data';
import { getAllMarkdownGuides } from '@/lib/guides-markdown';
import { getBestDealForTool } from '@/lib/deals-data';
import { comparisonPairs } from '@/lib/seo-content';
import { ToolLogo } from '@/components/tool-logo';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { clampTitle, guideArticleLd, guideBreadcrumbLd } from '@/lib/seo';
import { linkifyToolNamesInHtml } from '@/lib/linkify-html';
import { TableOfContents } from '@/components/table-of-contents';

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

function getGuideBySlug(slug: string): { frontmatter: GuideFrontmatter; contentHtml: string; tool: string; headings: { level: number; id: string; text: string }[]; wordCount: number } | null {
  const all = getAllGuides();
  const found = all.find(g => g.slug === slug);
  if (!found) return null;

  const filePath = path.join(CONTENT_DIR, found.tool, `${slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const processed = remark().use(html).processSync(content);
  let contentHtml = processed.toString()
    .replace(/<h1>/g, '<h2>')
    .replace(/<\/h1>/g, '</h2>');

  // Inject id anchors into headings for ToC deep linking
  let headingIndex = 0;
  contentHtml = contentHtml.replace(/<h([23])>(.*?)<\/h\1>/gi, (_match, level, text) => {
    const id = `section-${headingIndex++}`;
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  // Extract headings for ToC
  const tocRegex = /<h([23]) id="(section-\d+)">(.*?)<\/h\1>/gi;
  const headings: { level: number; id: string; text: string }[] = [];
  let m;
  while ((m = tocRegex.exec(contentHtml)) !== null) {
    headings.push({ level: parseInt(m[1]), id: m[2], text: m[3].replace(/<[^>]+>/g, '') });
  }

  // Auto-link tool names in the guide body (one link per tool per article)
  contentHtml = linkifyToolNamesInHtml(contentHtml, (data as GuideFrontmatter).softwareSlug);

  // Word count for schema
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return { frontmatter: data as GuideFrontmatter, contentHtml, tool: found.tool, headings, wordCount };
}

export function generateStaticParams() {
  return getAllGuides().map(g => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: 'Not Found — CADGuide' };

  const { frontmatter } = guide;
  return {
    title: clampTitle(frontmatter.title),
    description: frontmatter.excerpt,
    keywords: [frontmatter.keyword, frontmatter.category, 'cad guide', 'technical guide', frontmatter.softwareSlug],
    alternates: {
      canonical: `https://cadguide.tools/guides/${slug}`,
    },
    openGraph: {
      type: 'article',
      url: `https://cadguide.tools/guides/${slug}`,
      title: frontmatter.title,
      description: frontmatter.excerpt,
      siteName: 'CADGuide.tools',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
    },
    robots: { index: true, follow: true },
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

  const { frontmatter, contentHtml, tool, headings, wordCount } = guide;
  const categoryLabel = CATEGORY_LABELS[frontmatter.category] || frontmatter.category;
  const categoryColor = CATEGORY_COLORS[frontmatter.category] || 'bg-slate-50 text-slate-700 border-slate-200';

  const toolDisplayName = tool.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const matchedTool = tools.find(t => t.slug === frontmatter.softwareSlug);
  const bestDeal = matchedTool ? getBestDealForTool(matchedTool.id) : null;
  const allGuides = getAllMarkdownGuides();
  const sameToolGuides = allGuides
    .filter(g => g.softwareSlug === frontmatter.softwareSlug && g.slug !== slug);
  const relatedGuides = sameToolGuides.slice(0, 6);
  const crossToolGuides = allGuides
    .filter(g => g.softwareSlug !== frontmatter.softwareSlug && g.category === frontmatter.category && g.slug !== slug)
    .slice(0, 4);

  // Sidebar: comparison pairs for this tool
  const toolComparisons = matchedTool
    ? comparisonPairs().filter(p => p.a.slug === matchedTool.slug || p.b.slug === matchedTool.slug).slice(0, 4)
    : [];

  // Sidebar: category-based toolbox utility mapping
  const toolboxMap: Record<string, { slug: string; label: string }[]> = {
    troubleshooting: [
      { slug: 'dwg-version-checker', label: 'DWG Version Checker' },
      { slug: 'missing-font-shx-resolver', label: 'Missing Font Resolver' },
    ],
    printing: [
      { slug: 'online-dwg-to-pdf-cloud-printer', label: 'DWG to PDF Printer' },
      { slug: 'viewport-scale-factor-converter', label: 'Viewport Scale Converter' },
    ],
    standards: [
      { slug: 'online-dwg-compare-diff-viewer', label: 'DWG Compare Viewer' },
      { slug: 'online-dwg-layer-splitter-cloud', label: 'Layer Splitter' },
    ],
    migration: [
      { slug: 'online-dwg-to-dxf-batch-converter', label: 'DWG to DXF Converter' },
      { slug: 'online-step-to-stl-slicer-helper', label: 'STEP to STL Helper' },
    ],
    manufacturing: [
      { slug: 'k-factor-calculator', label: 'K-Factor Calculator' },
      { slug: 'thread-drill-size-calculator', label: 'Thread Drill Size Calculator' },
    ],
    performance: [
      { slug: 'online-dwg-compare-diff-viewer', label: 'DWG Compare Viewer' },
      { slug: 'missing-regapp-cleaner-batch', label: 'RegApp Cleaner Batch' },
    ],
    procurement: [
      { slug: 'online-cad-license-audit-shield', label: 'License Audit Shield' },
    ],
    deployment: [
      { slug: 'online-cad-license-audit-shield', label: 'License Audit Shield' },
      { slug: 'dwg-version-checker', label: 'DWG Version Checker' },
    ],
  };
  const toolboxItems = toolboxMap[frontmatter.category] || toolboxMap['troubleshooting'];

  // Build JSON-LD payloads
  const articleSchema = guideArticleLd({
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    slug: slug,
    author: frontmatter.author,
    date: frontmatter.date,
    category: frontmatter.category,
    softwareSlug: frontmatter.softwareSlug,
    wordCount,
  });
  const breadcrumbSchema = guideBreadcrumbLd({
    toolDisplayName,
    category: categoryLabel,
    title: frontmatter.title,
    slug: slug,
  });

  return (
    <article className="min-h-screen bg-[#fcfdfe]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Header */}
      <header className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-slate-700 transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-slate-700">{toolDisplayName}</span>
            <span>/</span>
            <span className="text-slate-700 truncate">{categoryLabel}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-4xl">
              <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider", categoryColor)}>
                {categoryLabel}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                {frontmatter.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {frontmatter.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {frontmatter.readTime}
                </span>
              </div>
            </div>

            {/* Tool badge in header */}
            {matchedTool && (
              <div className="shrink-0 flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <ToolLogo slug={matchedTool.slug} name={matchedTool.name} src={matchedTool.logo_url} priority={true} className="w-14 h-14 rounded-2xl shadow bg-white border border-slate-100" />
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Target Software</span>
                  <Link href={`/tools/${matchedTool.slug}`} className="font-black text-slate-900 hover:text-blue-600 hover:underline block text-lg transition-colors">
                    {matchedTool.name}
                  </Link>
                  {matchedTool.score > 0 && (
                    <span className="text-xs text-slate-500 font-bold">Expert Score: ★ {matchedTool.score}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dual-column layout */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 md:py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start w-full">
          {/* Main content column */}
          <main className="flex-1 min-w-0 w-full">
            {/* Article info bar */}
            <div className="bg-white p-4 sm:p-5 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-6 text-xs text-slate-500 font-bold">
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Read Time: <span className="text-slate-900 font-black ml-1">{frontmatter.readTime}</span></div>
                <div>Status: <span className="text-emerald-600 font-black flex items-center gap-1">● Verified</span></div>
              </div>
            </div>

            {/* Table of Contents */}
            <TableOfContents headings={headings} />

            {/* Article content */}
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

            {/* Related Tool cross-link card */}
            {matchedTool && (
              <Card className="mt-12 border-2 border-dashed border-slate-200 bg-white p-6 sm:p-8 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-500 hover:border-blue-600">
                <div className="space-y-2">
                  <Badge className="bg-amber-600/10 text-amber-700 font-bold px-3 py-0.5 text-[9px] uppercase tracking-wider rounded-lg">
                    Full Analysis
                  </Badge>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Read the Full {matchedTool.name} Pricing, Score, and Competitor Review
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium">
                    Want to know if {matchedTool.name} is the best investment for your enterprise CAD workflows? Check out ratings, pros & cons, and licensing plans.
                  </p>
                </div>
                <Link
                  href={`/tools/${matchedTool.slug}`}
                  className="rounded-2xl bg-blue-600 text-white font-black h-12 sm:h-14 px-8 shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap"
                >
                  Open Review <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            )}

            {/* More guides from same tool */}
            {relatedGuides.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h2 className="text-lg font-black text-slate-900 mb-4">More {toolDisplayName} Guides</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedGuides.map(g => (
                    <Link
                      key={g.slug}
                      href={`/guides/${g.slug}`}
                      className="block p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group"
                    >
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{g.category}</p>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">{g.title}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-2">{g.readTime}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Cross-tool guides (same category) */}
            {crossToolGuides.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h2 className="text-lg font-black text-slate-900 mb-1">Related {categoryLabel} Guides</h2>
                <p className="text-xs text-slate-500 font-medium mb-4">Similar {categoryLabel.toLowerCase()} content for other CAD tools</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {crossToolGuides.map(g => {
                    const gToolName = g.softwareSlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    return (
                      <Link
                        key={g.slug}
                        href={`/guides/${g.slug}`}
                        className="block p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{gToolName}</p>
                          <span className="text-[9px] text-slate-300">•</span>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{g.category}</p>
                        </div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">{g.title}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-2">{g.readTime}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Back to guides */}
            <div className="mt-12 pt-8 border-t border-slate-100">
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Guides
              </Link>
            </div>
          </main>

          {/* Right sidebar */}
          <aside className="w-full lg:w-96 lg:shrink-0 space-y-6">
            {/* Tool Profile Card */}
            {matchedTool && (
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
                  <ToolLogo slug={matchedTool.slug} name={matchedTool.name} src={matchedTool.logo_url} className="w-14 h-14 rounded-2xl border bg-white" />
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{matchedTool.name}</h4>
                    {matchedTool.score > 0 && (
                      <span className="text-yellow-500 font-black text-xs">★ {matchedTool.score} / 5.0 Rating</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>License Type:</span>
                    <span className="text-slate-900 font-black">{matchedTool.pricing_type}</span>
                  </div>
                  {matchedTool.country && (
                    <div className="flex justify-between">
                      <span>Origin Country:</span>
                      <span className="text-slate-900 font-black">{matchedTool.country}</span>
                    </div>
                  )}
                  {matchedTool.platforms && matchedTool.platforms.length > 0 && (
                    <div className="flex justify-between">
                      <span>Platforms:</span>
                      <span className="text-slate-900 font-black truncate max-w-[180px]">{matchedTool.platforms.join(', ')}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/tools/${matchedTool.slug}`}
                  className="block w-full h-12 rounded-2xl font-black transition-colors border border-blue-100 text-blue-600 hover:bg-blue-50 flex items-center justify-center text-xs"
                >
                  Check Full Specifications
                </Link>
              </Card>
            )}

            {/* Alternatives */}
            {matchedTool && (
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                <h3 className="font-black text-slate-900 text-base border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400">
                  Sectors & Alternative Switch
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  Looking to crossover from legacy platforms or evaluate cheaper alternatives? Match similar software in the same industry.
                </p>
                <Link
                  href={`/alternatives/${matchedTool.slug}`}
                  className="block w-full h-12 rounded-2xl bg-slate-900 text-white font-black text-xs gap-2 flex items-center justify-center transition-colors hover:bg-slate-800"
                >
                  Check {matchedTool.name} Alternatives <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            )}

            {/* Related Guides sidebar */}
            {relatedGuides.length > 0 && (
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> More {toolDisplayName} Guides
                </h3>
                <div className="space-y-3">
                  {relatedGuides.map(g => (
                    <Link
                      key={g.slug}
                      href={`/guides/${g.slug}`}
                      className="block p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 hover:text-blue-600 transition-all border border-slate-50 hover:border-blue-100 group"
                    >
                      <span className="text-[8px] font-mono font-black text-blue-600 uppercase tracking-widest block mb-1">
                        {g.category}
                      </span>
                      <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {g.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Comparison PK Battles */}
            {toolComparisons.length > 0 && (
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-5">
                <h3 className="font-black text-slate-900 text-base border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Direct PK Battles
                </h3>
                <div className="space-y-3">
                  {toolComparisons.map((pair, pIdx) => {
                    const vsTool = matchedTool && pair.a.slug === matchedTool.slug ? pair.b : pair.a;
                    return (
                      <Link
                        key={pIdx}
                        href={`/compare/${pair.pairSlug}`}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 hover:text-blue-600 transition-all group border border-slate-50 hover:border-blue-100"
                      >
                        <span className="font-bold text-slate-800 text-xs truncate group-hover:text-blue-600 transition-colors">
                          {matchedTool?.name} <span className="text-slate-400 font-bold">vs</span> {vsTool.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Deals link — only when an actual deal exists */}
            {matchedTool && bestDeal && (
              <Card className="rounded-[24px] md:rounded-[32px] p-6 border-2 border-emerald-500 bg-emerald-500/5 shadow-sm space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 space-y-3">
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Active Deal
                  </div>
                  <h3 className="font-black text-slate-900 text-base leading-snug">{bestDeal.title}</h3>
                  <div className="text-2xl font-black text-emerald-600 tracking-tight">{bestDeal.discount}</div>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                    {bestDeal.description}
                  </p>
                  {bestDeal.code && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center">
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Code: </span>
                      <span className="font-black text-sm tracking-wider text-emerald-700">{bestDeal.code}</span>
                    </div>
                  )}
                  <a
                    href={bestDeal.link}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl h-11 text-xs shadow-md flex items-center justify-center transition-all"
                  >
                    Claim This Deal →
                  </a>
                  <Link
                    href="/deals"
                    className="block text-center text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
                  >
                    See All Active Deals →
                  </Link>
                </div>
              </Card>
            )}

            {/* Toolbox utilities */}
            <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> Free Online Tools
              </h3>
              <div className="space-y-2">
                {toolboxItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/toolbox/${item.slug}`}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 hover:text-blue-600 transition-all group border border-slate-50 hover:border-blue-100"
                  >
                    <span className="font-bold text-slate-800 text-xs truncate group-hover:text-blue-600 transition-colors">
                      {item.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </Link>
                ))}
              </div>
              <Link href="/toolbox" className="block text-center text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors pt-2">
                Browse All Tools →
              </Link>
            </Card>

            {/* Matchmaker CTA */}
            <Link href="/matchmaker" className="block rounded-[24px] md:rounded-[32px] p-5 sm:p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-200 group-hover:rotate-12 transition-transform" />
                <div>
                  <div className="font-black text-sm">Not sure which tool?</div>
                  <div className="text-blue-200 text-xs font-medium">Try AI Matchmaker →</div>
                </div>
              </div>
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
