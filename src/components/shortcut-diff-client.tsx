'use client';

import { useState, useMemo } from 'react';
import { Search, Printer, AlertTriangle, Check, Info, Copy, Sparkles } from 'lucide-react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';

export interface DiffItem {
  shortcut: string;
  primaryCmd: string;
  secondaryCmd: string;
  isSame: boolean;
  diffNote: string;
  useCase: string;
}

interface ShortcutDiffClientProps {
  primaryApp: string;
  secondaryApp: string;
  diffData: DiffItem[];
}

export default function ShortcutDiffClient({
  primaryApp,
  secondaryApp,
  diffData
}: ShortcutDiffClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'diff' | 'same'>('all');
  const [copiedIndex, setCopiedIndex] = useState<{ row: number; app: 'primary' | 'secondary' } | null>(null);

  // Search and filter logic
  const filteredData = useMemo(() => {
    return diffData.filter((item) => {
      const matchFilter =
        filterType === 'all' ||
        (filterType === 'diff' && !item.isSame) ||
        (filterType === 'same' && item.isSame);

      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        item.shortcut.toLowerCase().includes(query) ||
        item.primaryCmd.toLowerCase().includes(query) ||
        item.secondaryCmd.toLowerCase().includes(query) ||
        item.diffNote.toLowerCase().includes(query) ||
        item.useCase.toLowerCase().includes(query);

      return matchFilter && matchSearch;
    });
  }, [diffData, searchQuery, filterType]);

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string, rowIndex: number, app: 'primary' | 'secondary') => {
    navigator.clipboard.writeText(text);
    setCopiedIndex({ row: rowIndex, app });
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 核心比对与搜索区 */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* 控制面板：搜索、过滤与打印 */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6 print:hidden">
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`搜索快捷键或命令 (如: L, Line, Copy)...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              打印对比表 (A4)
            </button>
          </div>
        </div>

        {/* 差异状态过滤开关 */}
        <div className="flex gap-2 mb-6 print:hidden">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 border-slate-950 text-white'
                : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            全部指令 ({diffData.length})
          </button>
          <button
            onClick={() => setFilterType('diff')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              filterType === 'diff'
                ? 'bg-rose-600 border-rose-700 text-white'
                : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            仅看差异项 ({diffData.filter((i) => !i.isSame).length})
          </button>
          <button
            onClick={() => setFilterType('same')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              filterType === 'same'
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            仅看完全一致 ({diffData.filter((i) => i.isSame).length})
          </button>
        </div>

        {/* 比对数据表格 */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-4 w-[110px]">快捷别名</th>
                <th className="py-3 px-4 w-[160px]">{primaryApp} 命令</th>
                <th className="py-3 px-4 w-[160px]">{secondaryApp} 命令</th>
                <th className="py-3 px-4 w-[100px] text-center">别名状态</th>
                <th className="py-3 px-4">核心用途 & 差异说明</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-50 hover:bg-slate-50/40 transition-colors ${
                    !item.isSame ? 'bg-rose-50/10' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="font-mono bg-slate-900 text-white px-2.5 py-1 rounded-lg font-black tracking-tight text-[10px] shadow-sm select-all">
                      {item.shortcut}
                    </span>
                  </td>
                  
                  {/* Primary App Cmd */}
                  <td className="py-3 px-4">
                    <span
                      onClick={() => copyToClipboard(item.primaryCmd, idx, 'primary')}
                      className="text-slate-900 hover:text-blue-600 transition-colors font-black text-sm cursor-pointer select-all inline-flex items-center gap-1"
                    >
                      {item.primaryCmd}
                      {copiedIndex?.row === idx && copiedIndex?.app === 'primary' && (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </span>
                  </td>

                  {/* Secondary App Cmd */}
                  <td className="py-3 px-4">
                    <span
                      onClick={() => copyToClipboard(item.secondaryCmd, idx, 'secondary')}
                      className={`font-black text-sm cursor-pointer select-all inline-flex items-center gap-1 transition-colors ${
                        item.isSame ? 'text-slate-900 hover:text-blue-600' : 'text-rose-600 hover:text-rose-700'
                      }`}
                    >
                      {item.secondaryCmd}
                      {copiedIndex?.row === idx && copiedIndex?.app === 'secondary' && (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </span>
                  </td>

                  {/* Status Indicator */}
                  <td className="py-3 px-4 text-center">
                    {item.isSame ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        <Check className="w-3 h-3" />
                        完全一致
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                        <AlertTriangle className="w-3 h-3" />
                        存在差异
                      </span>
                    )}
                  </td>

                  {/* Descriptions */}
                  <td className="py-3 px-4 leading-relaxed">
                    <div className="text-slate-900 font-bold text-[11px]">{item.useCase}</div>
                    {!item.isSame && (
                      <div className="text-rose-600/80 font-medium mt-1 text-[10px] bg-rose-50/50 p-2 rounded-lg border border-rose-100/30">
                        ⚠️ {item.diffNote}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    无匹配的比对指令。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* @media print 打印专用 CSS 规则 */}
        <style jsx global>{`
          @media print {
            body {
              background-color: white !important;
              color: black !important;
            }
            main {
              padding: 0 !important;
              margin: 0 !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:p-0 {
              padding: 0 !important;
            }
            .print\\:border-none {
              border: none !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            @page {
              size: A4 landscape;
              margin: 1.5cm 1cm 1.5cm 1cm;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        `}</style>

      </div>

      {/* 迁移与提效指南 */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6 print:hidden">
        <div>
          <h3 className="text-slate-900 font-black text-base tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            {primaryApp} ➔ {secondaryApp} 极速平替迁移指南
          </h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
            Seamless Migration & Compatibility Strategy Guide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed text-slate-500">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              1. 99% 的常用命令肌肉记忆完全通用
            </h4>
            <p>
              浩辰 CAD (GstarCAD) 与中望 CAD (ZWCAD) 在开发之初便深度对标 AutoCAD。几乎所有的高频绘图别名（如 L-直线、C-圆、CO-复制、M-移动、RO-旋转）均 100% 相同。设计师无需担心更换平台引起绘图速度下降。
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              2. 导入已有 pgp 别名实现 100% 同步
            </h4>
            <p>
              如果您有高度客制化的 `acad.pgp` 别名配置，完全不用在国产 CAD 里手动重新配置。直接在国产 CAD 的“工具 ➔ 自定义 ➔ 编辑程序别名 (PGP)”中，将您的 `acad.pgp` 文本复制粘贴覆盖进去，或者加载我们 Tool 1 生成的自定义 PGP，即可瞬间恢复您多年积攒的键盘别名习惯。
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              3. 独有命令别名与特殊替换
            </h4>
            <p>
              某些软件有其独特的平台特性，例如 GstarCAD 拥有独特的图纸工作空间切换指令 `GWS`，而 ZWCAD 则有独特的智能选择指令。针对比对中标记为 **“存在差异”** 的项目，请多加留心并在实际图纸绘制中稍作肌肉记忆微调。
            </p>
          </div>
        </div>
      </div>

      <NewsletterSubscribe />
    </div>
  );
}
