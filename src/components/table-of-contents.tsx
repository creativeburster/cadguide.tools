'use client';

import { useState } from 'react';
import { FileText, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TocHeading {
  level: number;
  id: string;
  text: string;
}

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [open, setOpen] = useState(false);

  if (headings.length < 3) return null;

  return (
    <nav className="mb-8 bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left transition-colors hover:bg-slate-50/50"
        aria-expanded={open}
      >
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4" /> Table of Contents
        </h2>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <ol className="space-y-1.5 px-5 sm:px-6 pb-5 sm:pb-6 pt-1">
          {headings.map((h, i) => (
            <li key={i} className={cn(h.level === 3 ? 'pl-4' : '')}>
              <a
                href={`#${h.id}`}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors block py-0.5"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
