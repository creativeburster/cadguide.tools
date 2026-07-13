import { load } from 'cheerio';
import { tools } from './data';
import type { Tool } from './types';

interface Dictionary {
  /** Regex alternation string of escaped tool names, longest-first. */
  alternation: string;
  /** Map: tool name -> slug. */
  byName: Map<string, string>;
}

let dictCache: Dictionary | null = null;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildDictionary(toolList: Tool[]): Dictionary {
  if (dictCache) return dictCache;

  // Longest names first so "Autodesk Inventor" wins over "Inventor".
  const entries = toolList
    .map((t) => ({ name: t.name, slug: t.slug }))
    .filter((e) => e.name && e.name.length >= 4)
    .sort((a, b) => b.name.length - a.name.length);

  const byName = new Map<string, string>();
  const seenNames = new Set<string>();

  for (const e of entries) {
    if (!seenNames.has(e.name)) {
      seenNames.add(e.name);
      byName.set(e.name, e.slug);
    }
  }

  const alternation = [...byName.keys()].map(escapeRegex).join('|');
  dictCache = { alternation, byName };
  return dictCache;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Tags whose text we won't linkify (anchors, code, scripts, headings, etc.). */
const SKIP_TAGS = new Set([
  'a',
  'code',
  'pre',
  'script',
  'style',
  'noscript',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);

function collectTextNodes(node: any, out: any[]): void {
  if (!node) return;
  if (node.type === 'text') {
    out.push(node);
    return;
  }
  if (node.type === 'tag' || node.type === 'root') {
    if (node.type === 'tag' && SKIP_TAGS.has(node.name)) return;
    if (node.children) {
      for (const child of node.children) {
        collectTextNodes(child, out);
      }
    }
  }
}

/**
 * Find references to other CAD tools in an HTML string and wrap them in
 * internal <a> links to `/tools/{slug}`.  Each tool is linked at most once
 * per article to keep the link density reasonable.
 *
 * Use in the guide article server page after `remark` has rendered the
 * markdown to HTML.
 */
export function linkifyToolNamesInHtml(
  html: string,
  currentSlug?: string,
): string {
  if (!html) return html;

  const { alternation, byName } = buildDictionary(tools);
  if (!alternation) return html;

  const regex = new RegExp(`\\b(${alternation})\\b`, 'g');
  const $ = load(html, null, false);

  const textNodes: any[] = [];
  const root = ($.root()[0] as any) || {};
  if (root.children) {
    for (const child of root.children) {
      collectTextNodes(child, textNodes);
    }
  }

  const seen = new Set<string>();

  for (const node of textNodes) {
    const text = node.data;
    if (!text || typeof text !== 'string') continue;

    let result = '';
    let lastIndex = 0;
    let changed = false;
    let match: RegExpExecArray | null;
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      const name = match[1];
      const slug = byName.get(name);
      if (!slug || slug === currentSlug || seen.has(slug)) continue;

      seen.add(slug);
      result += escapeHtml(text.slice(lastIndex, match.index));
      result += `<a href="/tools/${slug}">${escapeHtml(name)}</a>`;
      lastIndex = match.index + name.length;
      changed = true;
    }

    if (changed) {
      result += escapeHtml(text.slice(lastIndex));
      $(node).replaceWith(result);
    }
  }

  return $.html();
}
