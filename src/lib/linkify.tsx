/**
 * linkifyToolNames — find references to other tools in a free-text string
 * and replace them with internal Next.js <Link> nodes.
 *
 * Used on the tool detail page to densify internal linking automatically,
 * without burdening editors with manually wrapping every mention.
 *
 * Rules:
 *  - Names must appear with a leading word boundary and trailing word
 *    boundary, so "Auto" inside "Autodesk" won't match "Auto" the tool.
 *  - Case-sensitive matching: tool names are TitleCase/Brand, and a
 *    case-insensitive scan would create false positives (e.g. the common
 *    English word "form" matching a hypothetical tool "Form").
 *  - The current tool's own name is excluded — no self-links.
 *  - Names shorter than 4 chars are skipped to avoid noisy matches.
 *  - Longest names are tried first ("Autodesk Inventor" before "Inventor")
 *    via length-descending sort and a single combined regex.
 *  - Each tool gets at most one link in any given block of text, to keep
 *    the prose readable.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Tool } from './data';

interface LinkifyOptions {
  currentSlug?: string;
  className?: string;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build (and cache lazily) an ordered list of [name, slug] entries.
 * Memoised per-tools-array reference to avoid recomputing on every render.
 */
const dictionaryCache = new WeakMap<Tool[], { regex: RegExp; bySlug: Map<string, string> }>();

function buildDictionary(tools: Tool[]) {
  const cached = dictionaryCache.get(tools);
  if (cached) return cached;

  // Sort longest-first so "Autodesk Inventor" matches before "Inventor".
  const entries = tools
    .map((t) => ({ name: t.name, slug: t.slug }))
    .filter((e) => e.name && e.name.length >= 4)
    .sort((a, b) => b.name.length - a.name.length);

  // Map name -> slug (canonical name wins; duplicate names collapse).
  const bySlug = new Map<string, string>();
  for (const e of entries) {
    if (!bySlug.has(e.name)) bySlug.set(e.name, e.slug);
  }

  const alternation = entries.map((e) => escapeRegex(e.name)).join('|');
  // Word boundaries + a single combined alternation. `g` flag so we can walk
  // the string with exec().
  const regex = new RegExp(`\\b(${alternation})\\b`, 'g');

  const v = { regex, bySlug };
  dictionaryCache.set(tools, v);
  return v;
}

export function linkifyToolNames(
  text: string | undefined | null,
  tools: Tool[],
  options: LinkifyOptions = {},
): ReactNode[] {
  if (!text) return [];
  const { currentSlug, className } = options;
  const { regex, bySlug } = buildDictionary(tools);

  const nodes: ReactNode[] = [];
  const seen = new Set<string>(); // dedupe links per call
  let lastIndex = 0;
  // Make sure regex.lastIndex starts at 0 (it persists across calls).
  regex.lastIndex = 0;

  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    const matchedName = m[1];
    const slug = bySlug.get(matchedName);
    if (!slug || slug === currentSlug || seen.has(slug)) continue;

    if (m.index > lastIndex) {
      nodes.push(text.slice(lastIndex, m.index));
    }
    seen.add(slug);
    nodes.push(
      <Link
        key={`${slug}-${m.index}`}
        href={`/tools/${slug}`}
        className={
          className ||
          'text-blue-600 hover:text-blue-700 underline decoration-blue-200 hover:decoration-blue-500 transition-colors'
        }
      >
        {matchedName}
      </Link>,
    );
    lastIndex = m.index + matchedName.length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}
