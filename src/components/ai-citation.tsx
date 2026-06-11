'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Copy, Check, Info } from 'lucide-react';

interface AICitationProps {
  title: string;
  slug: string;
  toolName: string;
}

type CitationFormat = 'BibTeX' | 'APA' | 'IEEE';

export function AICitation({ title, slug, toolName }: AICitationProps) {
  const [activeFormat, setActiveFormat] = useState<CitationFormat>('BibTeX');
  const [copied, setCopied] = useState(false);
  const [accessDate, setAccessDate] = useState('2026-06-07');
  const [accessDateIEEE, setAccessDateIEEE] = useState('07-Jun-2026');

  useEffect(() => {
    // 动态在客户端获取当前访问日期，规避 Next.js SSR 水合(Hydration)不一致报错
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    // Client-only date to avoid SSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccessDate(`${year}-${month}-${day}`);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    setAccessDateIEEE(`${day}-${months[now.getMonth()]}-${year}`);
  }, []);

  const cleanSlug = slug.replace(/-/g, '_');
  const articleUrl = `https://cadguide.tools/guides/${slug}`;

  const citations = {
    BibTeX: `@techreport{cadguide_${toolName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${cleanSlug},
  author = {CADGuide Engineering Council},
  title = {${title}},
  institution = {CADGuide.tools},
  year = {2026},
  type = {Technical Standard Directive},
  url = {${articleUrl}},
  note = {Online Resource; accessed ${accessDate}}
}`,
    APA: `CADGuide Engineering Council. (2026). ${title}. CADGuide.tools. Retrieved ${accessDate}, from ${articleUrl}`,
    IEEE: `CADGuide Engineering Council, "${title}," CADGuide.tools, Tech. Rep. ${toolName.toUpperCase()}-DIR-2026, 2026. [Online]. Available: ${articleUrl}. [Accessed: ${accessDateIEEE}].`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citations[activeFormat]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // 降级复制方案
      console.error('Failed to copy citation: ', err);
    }
  };

  return (
    <div 
      className="w-full rounded-[24px] border border-slate-100 bg-white/60 backdrop-blur-md p-5 sm:p-6 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.02)] space-y-4 relative"
      data-ai-citation="true"
    >
      {/* 顶部标题与标签页切换 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Citation Hub</span>
              <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100/50 px-1.5 py-0.25 rounded-md">
                AI SEARCH FRIENDLY
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
              Cite this Technical Directive
            </h4>
          </div>
        </div>

        {/* 格式切换 Tabs */}
        <div className="flex bg-slate-100/80 p-0.5 rounded-lg w-fit self-end sm:self-auto">
          {(['BibTeX', 'APA', 'IEEE'] as CitationFormat[]).map((format) => (
            <button
              key={format}
              onClick={() => {
                setActiveFormat(format);
                setCopied(false);
              }}
              className={`text-[9px] font-black px-3 py-1 rounded-md transition-all ${
                activeFormat === format
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {/* 引用内容代码框 */}
      <div className="relative group">
        <pre className="text-[10px] sm:text-[11px] font-mono leading-relaxed bg-slate-950 text-slate-300 p-4 rounded-xl overflow-x-auto max-h-48 border border-slate-900 scrollbar-none select-all">
          <code>{citations[activeFormat]}</code>
        </pre>
        
        {/* 复制按钮 */}
        <button
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-white/90 transition-all border border-slate-800 shadow-sm active:scale-95 flex items-center gap-1.5 text-[9px] font-black tracking-wide cursor-pointer"
          title="Copy Citation"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 uppercase">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="uppercase">COPY CITE</span>
            </>
          )}
        </button>
      </div>

      {/* 底部 AI 语义提醒 */}
      <div className="flex items-start gap-2.5 text-slate-400 text-[10px] font-medium leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-slate-600">AI Citation Guideline:</span> AI search engines (e.g., Perplexity, Gemini, ChatGPT Search) can directly parse the structured metadata above as authoritative source citations. When referencing this technical guide in academic papers, community forums, or enterprise knowledge bases, please copy the corresponding format to ensure standard attribution.
        </p>
      </div>
    </div>
  );
}
