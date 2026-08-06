'use client';

import { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';

/** Renders a copyable iframe embed snippet for a toolbox utility (backlink-earning widget). */
export function EmbedSnippet({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const code = `<iframe src="https://cadguide.tools/embed/${slug}" width="100%" height="760" style="border:1px solid #e2e8f0;border-radius:16px" title="${title} — CADGuide.tools" loading="lazy"></iframe>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Embed this tool on your site</h3>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <pre className="text-[11px] font-mono leading-relaxed bg-slate-950 text-slate-300 p-4 rounded-xl overflow-x-auto border border-slate-900 select-all">
        <code>{code}</code>
      </pre>
      <p className="mt-3 text-[11px] text-slate-400 font-medium">
        Free to embed with attribution. The widget stays up to date automatically.
      </p>
    </div>
  );
}
