'use client';

import Link from 'next/link';
import { LayoutGrid, FileSearch, Zap, AlertTriangle, Type, Ruler } from 'lucide-react';

interface ToolItem {
  name: string;
  desc: string;
  link: string;
  icon: any;
  tag?: string;
}

export function RelatedTools() {
  const tools: ToolItem[] = [
    {
      name: 'Cross-Platform CAD Shortcuts Matrix',
      desc: 'Compare and print keyboard command shortcuts across AutoCAD, GstarCAD, ZWCAD, and DWG FastView.',
      link: '/guides/shortcuts',
      icon: LayoutGrid,
      tag: 'Core'
    },
    {
      name: 'AutoCAD vs. ZWCAD Command Diff',
      desc: 'Identify the exact command and alias variations between AutoCAD and ZWCAD platforms to transition smoothly.',
      link: '/guides/autocad-vs-zwcad-shortcuts',
      icon: FileSearch,
      tag: 'Migration'
    },
    {
      name: 'AutoCAD vs. GstarCAD Command Diff',
      desc: 'Detailed comparison highlighting the command differences and alias mappings between AutoCAD and GstarCAD.',
      link: '/guides/autocad-vs-gstarcad-shortcuts',
      icon: Ruler,
      tag: 'Migration'
    },
    {
      name: 'SolidWorks Keyboard Shortcuts',
      desc: 'Printable list of SolidWorks sketch, assembly, and drawing hotkeys and mouse gestures.',
      link: '/guides/solidworks-shortcuts-sheet',
      icon: Zap,
      tag: '3D MCAD'
    },
    {
      name: 'Revit Keyboard Shortcuts Table',
      desc: 'Quick reference sheet for Revit BIM modeling commands, modification tools, and view controls.',
      link: '/guides/revit-shortcuts-sheet',
      icon: Type,
      tag: 'BIM'
    },
    {
      name: 'Rhino 3D Command Aliases Guide',
      desc: 'Searchable database of Rhino 3D hotkeys, mouse modifiers, and custom command aliases.',
      link: '/guides/rhino-shortcuts-sheet',
      icon: AlertTriangle,
      tag: 'Design'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col gap-8">
      <div>
        <h3 className="text-slate-900 font-black text-xl tracking-tight flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-blue-600" />
          Related Shortcuts & Reference Sheets
        </h3>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
          Handpicked reference sheets to streamline CAD & BIM drafting workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                View Sheet
                <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
