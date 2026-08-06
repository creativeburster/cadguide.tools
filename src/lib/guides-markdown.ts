import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'guides');

export interface MarkdownGuide {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  softwareSlug: string;
  keyword: string;
  author: string;
  readTime: string;
  date: string;
  sources: string[];
  toolDir: string;
}

let _cache: MarkdownGuide[] | null = null;

export function getAllMarkdownGuides(): MarkdownGuide[] {
  if (_cache) return _cache;

  const guides: MarkdownGuide[] = [];

  if (!fs.existsSync(CONTENT_DIR)) return guides;

  const tools = fs.readdirSync(CONTENT_DIR);
  for (const tool of tools) {
    const toolDir = path.join(CONTENT_DIR, tool);
    if (!fs.statSync(toolDir).isDirectory()) continue;
    const files = fs.readdirSync(toolDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(toolDir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(raw);
      if (data.slug && data.title) {
        guides.push({
          slug: data.slug as string,
          title: data.title as string,
          excerpt: data.excerpt as string,
          category: data.category as string,
          softwareSlug: data.softwareSlug as string,
          keyword: data.keyword as string,
          author: data.author as string,
          readTime: data.readTime as string,
          date: data.date as string,
          sources: data.sources as string[],
          toolDir: tool,
        });
      }
    }
  }

  _cache = guides;
  return guides;
}

export function getGuidesByTool(toolSlug: string): MarkdownGuide[] {
  return getAllMarkdownGuides().filter(g => g.softwareSlug === toolSlug);
}

export function getGuidesByCategory(category: string): MarkdownGuide[] {
  return getAllMarkdownGuides().filter(g => g.category === category);
}

export function getGuidesByToolAndCategory(toolSlug: string, category: string): MarkdownGuide[] {
  return getAllMarkdownGuides().filter(g => g.softwareSlug === toolSlug && g.category === category);
}

export function getToolsWithGuides(): string[] {
  const all = getAllMarkdownGuides();
  return [...new Set(all.map(g => g.softwareSlug))];
}
