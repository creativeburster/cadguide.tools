'use client';

import type { ComponentType, SVGProps } from 'react';
import Link from 'next/link';
import { LayoutGrid, FileSearch, Zap, AlertTriangle, Type, Ruler } from 'lucide-react';

interface ToolItem {
  name: string;
  desc: string;
  link: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tag?: string;
}

export function RelatedTools({ gridCols, limit, compact = false }: { gridCols?: string; limit?: number; compact?: boolean } = {}) {
  const allTools: ToolItem[] = [
    {
      name: 'DWG Version Checker',
      desc: 'Identify the exact release version (AC1032, AC1027, etc.) and software compatibility matrix of any DWG file instantly.',
      link: '/toolbox/dwg-version-checker',
      icon: FileSearch,
      tag: 'Popular'
    },
    {
      name: 'Drawing Lag Cleaner',
      desc: 'Clean redundant regapps, DGN linestyles, and database bloat to restore slow CAD drawing performance.',
      link: '/toolbox/drawing-lag-performance-cleaner',
      icon: Zap,
      tag: 'Speed'
    },
    {
      name: 'Fatal Error Crash Diagnoser',
      desc: 'Debug memory violations, graphics card hardware acceleration crashes, and unhandled access exceptions.',
      link: '/toolbox/fatal-error-diagnostic-wizard',
      icon: AlertTriangle,
      tag: 'Critical'
    },
    {
      name: 'AutoCAD pgp Alias Editor',
      desc: 'Customize, clean, and download your keyboard shortcut settings file (PGP) in a visual client-side dashboard.',
      link: '/toolbox/acad-pgp-alias-editor',
      icon: LayoutGrid,
    },
    {
      name: 'SHX Font & Gibberish Resolver',
      desc: 'Resolve missing text blocks, big fonts, compile SHX files, and map codepages to fix Chinese text errors.',
      link: '/toolbox/missing-font-shx-resolver',
      icon: Type,
    },
    {
      name: 'Hatch Scale Factor Calculator',
      desc: 'Compute precise scale factors and line spacings for custom PAT hatch files based on metric plot sizes.',
      link: '/toolbox/cad-hatch-scale-optimizer',
      icon: Ruler,
    }
  ];

  const tools = limit ? allTools.slice(0, limit) : allTools;

  if (compact) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="text-slate-900 font-black text-lg tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-600" />
            Related CAD & BIM Utilities
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Handpicked browser tools to streamline engineering drafting workflows
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.name}
                href={tool.link}
                className="group relative bg-slate-50 hover:bg-blue-50/30 border border-slate-100 hover:border-blue-200/60 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-white group-hover:bg-blue-100/50 text-slate-700 group-hover:text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100/50 group-hover:border-blue-200/30 transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-slate-900 font-bold text-sm group-hover:text-blue-600 transition-colors truncate">
                      {tool.name}
                    </h4>
                    {tool.tag && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-blue-500 text-white rounded-md shrink-0">
                        {tool.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                    {tool.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col gap-8">
      <div>
        <h3 className="text-slate-900 font-black text-xl tracking-tight flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-blue-600" />
          Related CAD & BIM Utilities
        </h3>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
          Handpicked browser tools to streamline engineering drafting workflows
        </p>
      </div>

      <div className={gridCols || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.name}
              href={tool.link}
              className="group relative bg-slate-50 hover:bg-blue-50/30 border border-slate-100 hover:border-blue-200/60 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-white group-hover:bg-blue-100/50 text-slate-700 group-hover:text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100/50 group-hover:border-blue-200/30 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  {tool.tag && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-500 text-white rounded-full">
                      {tool.tag}
                    </span>
                  )}
                </div>
                <h4 className="text-slate-900 font-bold text-sm mb-1 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {tool.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                Launch Tool
                <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
