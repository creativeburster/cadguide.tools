'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { MarkdownGuide } from '@/lib/guides-markdown';

interface AvailableTool {
  slug: string;
  name: string;
}

export default function GuideAccordionNav({
  guides,
  availableTools,
  currentSlug,
}: {
  guides: MarkdownGuide[];
  availableTools: AvailableTool[];
  currentSlug: string;
}) {
  const [openTool, setOpenTool] = useState<string | null>(null);

  const guidesByTool: Record<string, MarkdownGuide[]> = {};
  for (const guide of guides) {
    if (!guidesByTool[guide.softwareSlug]) guidesByTool[guide.softwareSlug] = [];
    guidesByTool[guide.softwareSlug].push(guide);
  }

  const toolMap = new Map(availableTools.map(t => [t.slug, t]));

  // Build A-Z index from all guide titles
  const allTitles = guides
    .map(g => ({ title: g.title, slug: g.slug, letter: g.title[0]?.toUpperCase() || '#' }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const lettersWithGuides = letters.filter(l => allTitles.some(t => t.letter === l));
  const nonAlphaGuides = allTitles.filter(t => !/[A-Z]/.test(t.letter));

  return (
    <div className="mt-12 pt-8 border-t border-slate-100 space-y-10">
      {/* Accordion: Guides by tool */}
      <div>
        <h2 className="text-lg font-black text-slate-900 mb-4">Browse All Guides by Software</h2>
        <div className="space-y-2">
          {availableTools.map(tool => {
            const toolGuides = guidesByTool[tool.slug] || [];
            if (toolGuides.length === 0) return null;
            const isOpen = openTool === tool.slug;

            return (
              <div key={tool.slug} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenTool(isOpen ? null : tool.slug)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{tool.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {toolGuides.length}
                    </span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100">
                    <ul className="divide-y divide-slate-50">
                      {toolGuides.map(g => (
                        <li key={g.slug}>
                          <Link
                            href={`/guides/${g.slug}`}
                            className={`block px-4 py-2.5 text-xs font-semibold transition-colors ${
                              g.slug === currentSlug
                                ? 'text-blue-600 bg-blue-50/50'
                                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                            }`}
                          >
                            {g.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* A-Z Index */}
      <div>
        <h2 className="text-lg font-black text-slate-900 mb-4">Alphabetical Index</h2>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {letters.map(l => {
            const hasGuides = lettersWithGuides.includes(l);
            return (
              <span
                key={l}
                className={`w-7 h-7 flex items-center justify-center text-[10px] font-black rounded-lg ${
                  hasGuides
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-300'
                }`}
              >
                {l}
              </span>
            );
          })}
          {nonAlphaGuides.length > 0 && (
            <span className="w-7 h-7 flex items-center justify-center text-[10px] font-black rounded-lg bg-slate-900 text-white">
              #
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {lettersWithGuides.map(letter => (
            <div key={letter} className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 uppercase block py-1 border-b border-slate-100">
                {letter}
              </span>
              {allTitles
                .filter(t => t.letter === letter)
                .map(t => (
                  <Link
                    key={t.slug}
                    href={`/guides/${t.slug}`}
                    className={`block py-1 text-xs font-semibold transition-colors ${
                      t.slug === currentSlug
                        ? 'text-blue-600'
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    {t.title}
                  </Link>
                ))}
            </div>
          ))}
          {nonAlphaGuides.length > 0 && (
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 uppercase block py-1 border-b border-slate-100">
                #
              </span>
              {nonAlphaGuides.map(t => (
                <Link
                  key={t.slug}
                  href={`/guides/${t.slug}`}
                  className={`block py-1 text-xs font-semibold transition-colors ${
                    t.slug === currentSlug ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {t.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
