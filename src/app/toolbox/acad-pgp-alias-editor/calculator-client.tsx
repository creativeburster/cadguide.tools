'use client';

import { useState, useMemo } from 'react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';
import {
  Upload,
  Download,
  AlertTriangle,
  Check,
  Plus,
  Trash2,
  Terminal,
  HelpCircle,
  Sparkles,
  Search,
  Info,
  RefreshCw
} from 'lucide-react';

interface AliasItem {
  alias: string;
  command: string;
  isCustom?: boolean;
}

const DEFAULT_AUTOCAD_ALIASES: AliasItem[] = [
  { alias: 'A', command: 'ARC' },
  { alias: 'B', command: 'BLOCK' },
  { alias: 'C', command: 'CIRCLE' },
  { alias: 'CO', command: 'COPY' },
  { alias: 'CP', command: 'COPY' },
  { alias: 'D', command: 'DIMSTYLE' },
  { alias: 'E', command: 'ERASE' },
  { alias: 'EX', command: 'EXTEND' },
  { alias: 'F', command: 'FILLET' },
  { alias: 'G', command: 'GROUP' },
  { alias: 'H', command: 'HATCH' },
  { alias: 'I', command: 'INSERT' },
  { alias: 'L', command: 'LINE' },
  { alias: 'M', command: 'MOVE' },
  { alias: 'O', command: 'OFFSET' },
  { alias: 'P', command: 'PAN' },
  { alias: 'PE', command: 'PEDIT' },
  { alias: 'PL', command: 'PLINE' },
  { alias: 'PO', command: 'POINT' },
  { alias: 'RE', command: 'REGEN' },
  { alias: 'RO', command: 'ROTATE' },
  { alias: 'S', command: 'STRETCH' },
  { alias: 'SC', command: 'SCALE' },
  { alias: 'T', command: 'MTEXT' },
  { alias: 'TR', command: 'TRIM' },
  { alias: 'UN', command: 'UNITS' },
  { alias: 'X', command: 'EXPLODE' },
  { alias: 'Z', command: 'ZOOM' }
];

const DEFAULT_GSTARCAD_ALIASES: AliasItem[] = [
  { alias: 'A', command: 'ARC' },
  { alias: 'B', command: 'BLOCK' },
  { alias: 'C', command: 'CIRCLE' },
  { alias: 'CO', command: 'COPY' },
  { alias: 'D', command: 'DIMSTYLE' },
  { alias: 'E', command: 'ERASE' },
  { alias: 'EX', command: 'EXTEND' },
  { alias: 'F', command: 'FILLET' },
  { alias: 'H', command: 'HATCH' },
  { alias: 'I', command: 'INSERT' },
  { alias: 'L', command: 'LINE' },
  { alias: 'M', command: 'MOVE' },
  { alias: 'O', command: 'OFFSET' },
  { alias: 'P', command: 'PAN' },
  { alias: 'PL', command: 'PLINE' },
  { alias: 'RO', command: 'ROTATE' },
  { alias: 'S', command: 'STRETCH' },
  { alias: 'SC', command: 'SCALE' },
  { alias: 'T', command: 'MTEXT' },
  { alias: 'TR', command: 'TRIM' },
  { alias: 'X', command: 'EXPLODE' },
  { alias: 'Z', command: 'ZOOM' },
  { alias: 'GWS', command: 'GSTARWORKSPACES' },
  { alias: 'SPLAT', command: 'SPLINE' }
];

export default function AcadPgpEditorClient() {
  const [aliases, setAliases] = useState<AliasItem[]>(DEFAULT_AUTOCAD_ALIASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newCommand, setNewCommand] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'AutoCAD Command Terminal Simulator v1.0',
    '输入快捷键别名, 按回车模拟 CAD 命令行命令执行机制. ',
    '键入 REINIT 可以模拟重载 PGP 文件过程. '
  ]);
  const [activeTab, setActiveTab] = useState<'presets' | 'editor'>('editor');
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);

  // File parse routine
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/);
      const parsed: AliasItem[] = [];

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(';')) return;

        const commaIndex = trimmed.indexOf(',');
        if (commaIndex !== -1) {
          const alias = trimmed.substring(0, commaIndex).trim().toUpperCase();
          let commandPart = trimmed.substring(commaIndex + 1).trim();
          if (commandPart.startsWith('*')) {
            commandPart = commandPart.substring(1).trim();
          }
          // Remove secondary flags if any
          const secondaryComma = commandPart.indexOf(',');
          if (secondaryComma !== -1) {
            commandPart = commandPart.substring(0, secondaryComma).trim();
          }

          if (alias && commandPart) {
            parsed.push({
              alias,
              command: commandPart.toUpperCase(),
              isCustom: true
            });
          }
        }
      });

      if (parsed.length > 0) {
        setAliases(parsed);
        setTerminalHistory((prev) => [
          ...prev,
          `>>> 成功导入本地 PGP 文件: 解析出 ${parsed.length} 个别名. `
        ]);
        setActiveTab('editor');
      } else {
        alert('未解析到有效的 CAD 别名定义. 请确保文件符合 "别名, *命令" 的格式. ');
      }
    };
    reader.readAsText(file);
  };

  // Compile to PGP format and trigger file download
  const handleDownload = () => {
    let pgpContent = `; =========================================================================\n`;
    pgpContent += `; AutoCAD Command Alias (PGP) File\n`;
    pgpContent += `; Generated by CADGuide.tools Online Compiler\n`;
    pgpContent += `; Date: ${new Date().toLocaleDateString()}\n`;
    pgpContent += `; -------------------------------------------------------------------------\n`;
    pgpContent += `; Rules: [Alias], *[Command]\n`;
    pgpContent += `; =========================================================================\n\n`;

    aliases.forEach((item) => {
      // Space align formatting for premium aesthetics
      const aliasPadded = item.alias.padEnd(10, ' ');
      pgpContent += `${aliasPadded}, *${item.command}\n`;
    });

    pgpContent += `\n; End of AutoCAD Command Alias file`;

    const blob = new Blob([pgpContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'acad.pgp';
    link.click();
    URL.revokeObjectURL(url);

    setTerminalHistory((prev) => [...prev, '>>> acad.pgp 编译并下载成功! ']);
  };

  // Pre-scan duplicate keys
  const aliasCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    aliases.forEach((item) => {
      counts[item.alias] = (counts[item.alias] || 0) + 1;
    });
    return counts;
  }, [aliases]);

  // Handle addition
  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAlias = newAlias.trim().toUpperCase();
    const cleanCmd = newCommand.trim().toUpperCase();

    if (!cleanAlias || !cleanCmd) return;

    if (cleanAlias.includes(',') || cleanCmd.includes(',')) {
      alert('别名或命令中不能包含逗号! ');
      return;
    }

    setAliases((prev) => [
      { alias: cleanAlias, command: cleanCmd, isCustom: true },
      ...prev
    ]);
    setNewAlias('');
    setNewCommand('');

    setTerminalHistory((prev) => [
      ...prev,
      `>>> 已添加别名: ${cleanAlias} ➔ *${cleanCmd}`
    ]);
  };

  // Delete handler
  const handleDelete = (indexToDelete: number) => {
    const item = aliases[indexToDelete];
    setAliases((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    if (item) {
      setTerminalHistory((prev) => [
        ...prev,
        `>>> 已删除别名: ${item.alias}`
      ]);
    }
  };

  // Inline value updates
  const handleCellEdit = (index: number, field: 'alias' | 'command', val: string) => {
    const updatedVal = val.toUpperCase().replace(/[\s,]/g, ''); // strip commas and whitespace
    setAliases((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: updatedVal };
      return copy;
    });
  };

  // Terminal submission action
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toUpperCase();
    if (!cmd) return;

    let response = '';
    if (cmd === 'REINIT') {
      response = '正在重新加载 PGP 别名数据库... 重载成功! 当前已加载 ' + aliases.length + ' 个别名指令. ';
      setTerminalInput('');
      setTerminalHistory((prev) => [...prev, `COMMAND: ${cmd}`, response]);
      return;
    }

    // Match alias
    const matched = aliases.find((item) => item.alias === cmd);
    if (matched) {
      response = `找到别名映射: [${matched.alias}] ➔ 执行核心命令 [${matched.command}]`;
      setLastExecutedCommand(matched.command);
    } else {
      // Fallback check if it's already a full command
      const isKnownCommand = aliases.some((item) => item.command === cmd);
      if (isKnownCommand) {
        response = `直接执行核心命令 [${cmd}]`;
        setLastExecutedCommand(cmd);
      } else {
        response = `未知命令或未注册的别名: "${cmd}"`;
        setLastExecutedCommand(null);
      }
    }

    setTerminalHistory((prev) => [...prev, `COMMAND: ${cmd}`, response]);
    setTerminalInput('');
  };

  // Load presets helper
  const loadPreset = (presetName: 'autocad' | 'gstarcad') => {
    if (presetName === 'autocad') {
      setAliases(DEFAULT_AUTOCAD_ALIASES);
      setTerminalHistory((prev) => [...prev, '>>> 已恢复默认 AutoCAD PGP 配置. ']);
    } else if (presetName === 'gstarcad') {
      setAliases(DEFAULT_GSTARCAD_ALIASES);
      setTerminalHistory((prev) => [...prev, '>>> 已加载浩辰 GstarCAD 别名配置预设. ']);
    }
  };

  // Filter aliases based on search query
  const filteredAliases = useMemo(() => {
    return aliases.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      return (
        item.alias.toLowerCase().includes(query) ||
        item.command.toLowerCase().includes(query)
);
    });
  }, [aliases, searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      {/* 顶部控制面板 - 文件导入和编译 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 卡片 1: PGP 文件加载/导出 */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-slate-900 font-black text-lg tracking-tight">文件配置面板</h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              PGP Loader & Compiler
            </p>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              支持上传您本机的 <b>`acad.pgp`</b> / <b>`gcad.pgp`</b> 进行离线编辑. 编辑完毕后, 一键生成全新 PGP 文件. 
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="file"
                accept=".pgp"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="pgp-file-input"
              />
              <label
                htmlFor="pgp-file-input"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 text-slate-600 hover:text-blue-600 font-bold text-sm transition-all cursor-pointer text-center w-full"
              >
                <Upload className="w-4 h-4" />
                上传本地 .pgp 别名文件
              </label>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer w-full"
            >
              <Download className="w-4 h-4" />
              编译并下载 acad.pgp
            </button>
          </div>
        </div>

        {/* 卡片 2: SVG 动态 CAD 命令行终端模拟器 */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col justify-between min-h-[250px] lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Terminal className="w-40 h-40 text-blue-500" />
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono font-black text-slate-400">CAD COMMAND LINE TERMINAL</span>
            </div>
            <button
              onClick={() => setTerminalHistory(['Terminal Reset Completed. PGP Simulator active.'])}
              className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              清屏
            </button>
          </div>

          {/* 终端日志输出区域 */}
          <div className="flex-1 overflow-y-auto max-h-[140px] font-mono text-[10px] text-emerald-400/90 py-3 flex flex-col gap-1.5 scrollbar-thin">
            {terminalHistory.map((log, index) => (
              <div key={index} className="leading-relaxed whitespace-pre-wrap">
                {log}
              </div>
))}
          </div>

          {/* 图纸渲染微交互 */}
          <div className="absolute right-4 bottom-16 w-16 h-16 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              {lastExecutedCommand === 'CIRCLE' && (
                <circle cx="50" cy="50" r="30" fill="none" stroke="#60a5fa" strokeWidth="4" className="animate-[dash_1.5s_ease-in-out_infinite]" strokeDasharray="200" strokeDashoffset="0" />
)}
              {lastExecutedCommand === 'LINE' && (
                <line x1="15" y1="85" x2="85" y2="15" stroke="#60a5fa" strokeWidth="4" className="animate-[dash_1.5s_ease-in-out_infinite]" strokeDasharray="200" />
)}
              {lastExecutedCommand === 'ARC' && (
                <path d="M 20 80 A 40 40 0 0 1 80 80" fill="none" stroke="#60a5fa" strokeWidth="4" className="animate-[dash_1.5s_ease-in-out_infinite]" strokeDasharray="200" />
)}
              {lastExecutedCommand === 'RECTANGLE' && (
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="#60a5fa" strokeWidth="4" className="animate-[dash_1.5s_ease-in-out_infinite]" strokeDasharray="200" />
)}
              {lastExecutedCommand && !['CIRCLE', 'LINE', 'ARC', 'RECTANGLE'].includes(lastExecutedCommand) && (
                <text x="50" y="55" fontSize="10" textAnchor="middle" fill="#60a5fa" className="animate-bounce font-mono">
                  {lastExecutedCommand}
                </text>
)}
              {!lastExecutedCommand && (
                <text x="50" y="55" fontSize="8" textAnchor="middle" fill="#475569" className="font-mono">
                  WAITING
                </text>
)}
            </svg>
          </div>

          {/* 终端输入表单 */}
          <form onSubmit={handleTerminalSubmit} className="flex gap-2 pt-2 border-t border-slate-800">
            <span className="text-emerald-500 font-mono font-bold text-xs flex items-center">CAD&gt;</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="例如: C, L, REINIT, PL..."
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none border-none p-0"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-[10px] cursor-pointer"
            >
              发送
            </button>
          </form>

        </div>
      </div>

      {/* 预设管理与编辑器表格 */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              📋 快捷键列表编辑器
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              ⚡ 快速加载官方预设
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索快捷键或指令..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold text-slate-700"
            />
          </div>
        </div>

        {/* 官方预设 Tab 视图 */}
        {activeTab === 'presets' && (
          <div className="py-6 flex flex-col gap-6">
            <div>
              <h3 className="text-slate-800 font-bold text-sm">选择基础开发预设</h3>
              <p className="text-xs text-slate-400 mt-1">您可在此一键加载各大主流 CAD 平台的出厂默认别名库, 以此为蓝本进行二次客制化. </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-xs font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">AutoCAD Official</span>
                  <h4 className="font-bold text-slate-800 text-sm mt-2">AutoCAD 官方默认快捷键预设</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">包含 C (Circle), L (Line), PL (Pline) 等在内的近 30 个官方高频别名. </p>
                </div>
                <button
                  onClick={() => { loadPreset('autocad'); setActiveTab('editor'); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center cursor-pointer"
                >
                  加载 AutoCAD 预设
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">GstarCAD Official</span>
                  <h4 className="font-bold text-slate-800 text-sm mt-2">浩辰 CAD 官方默认快捷键预设</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">融合了浩辰特有指令 (如工作空间切换, 扩展命令等) 的快捷别名. </p>
                </div>
                <button
                  onClick={() => { loadPreset('gstarcad'); setActiveTab('editor'); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center cursor-pointer"
                >
                  加载浩辰 CAD 预设
                </button>
              </div>
            </div>
          </div>
)}

        {/* 表格编辑器 Tab 视图 */}
        {activeTab === 'editor' && (
          <div className="flex flex-col gap-6">
            
            {/* 新增别名输入栏 */}
            <form onSubmit={handleAddAlias} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-end gap-3">
              <div className="flex-1 w-full flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">快捷别名 (如: C)</label>
                <input
                  type="text"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  placeholder="C"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-mono font-bold text-slate-800 uppercase"
                />
              </div>

              <div className="flex-1 w-full flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">指向 CAD 命令 (如: CIRCLE)</label>
                <input
                  type="text"
                  value={newCommand}
                  onChange={(e) => setNewCommand(e.target.value)}
                  placeholder="CIRCLE"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-mono font-bold text-slate-800 uppercase"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer w-full md:w-auto h-[38px] flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                添加别名项
              </button>
            </form>

            {/* 列表渲染 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-3 px-4 w-[160px]">快捷别名 (Alias)</th>
                    <th className="py-3 px-4">映射 CAD 命令 (Command)</th>
                    <th className="py-3 px-4 w-[100px] text-center">状态校验</th>
                    <th className="py-3 px-4 w-[80px] text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-600">
                  {filteredAliases.map((item, idx) => {
                    const count = aliasCounts[item.alias] || 0;
                    const isConflict = count > 1;

                    return (
                      <tr
                        key={idx}
                        className={`border-b border-slate-50 hover:bg-slate-50/40 transition-colors ${
                          isConflict ? 'bg-rose-50/20' : ''
                        }`}
                      >
                        <td className="py-2.5 px-4 font-mono">
                          <input
                            type="text"
                            value={item.alias}
                            onChange={(e) => handleCellEdit(idx, 'alias', e.target.value)}
                            className="bg-transparent font-bold text-slate-900 border-b border-transparent focus:border-slate-300 focus:outline-none w-full uppercase py-1"
                          />
                        </td>
                        <td className="py-2.5 px-4 font-mono">
                          <input
                            type="text"
                            value={item.command}
                            onChange={(e) => handleCellEdit(idx, 'command', e.target.value)}
                            className="bg-transparent text-slate-700 border-b border-transparent focus:border-slate-300 focus:outline-none w-full uppercase py-1"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {isConflict ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                              <AlertTriangle className="w-3 h-3" />
                              别名冲突
                            </span>
) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                              正常
                            </span>
)}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() => handleDelete(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
);
                  })}
                  {filteredAliases.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                        无匹配的别名记录, 请尝试更改搜索词或添加新项. 
                      </td>
                    </tr>
)}
                </tbody>
              </table>
            </div>

          </div>
)}

      </div>

      {/* 极客指南 - REINIT 生效与别名优先级 */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="text-slate-900 font-black text-base tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            AutoCAD 快捷键别名进阶指南
          </h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
            AutoCAD PGP Deployment & Priority Optimization Guide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed text-slate-500">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              1. 命令行直接重载 REINIT 机制
            </h4>
            <p>
              修改好并替换 `acad.pgp` 后, 你<b>完全不需要</b>关闭并重新启动 CAD 软件. 只需在 AutoCAD / 浩辰 CAD 命令行输入 <b>`REINIT`</b>, 在弹出的"重新初始化"小对话框中勾选 <b>"PGP 文件"</b> 选项并确定, 软件就会在毫秒内重新编译内存中的快捷键索引, 使修改立即生效. 
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              2. 别名冲突与优先覆盖规则
            </h4>
            <p>
              如果 PGP 文件中同一个别名定义了多次 (例如上一行定义 `C, *CIRCLE`, 下一行定义 `C, *COPY`) , CAD 并不会崩溃. 它的内部读取逻辑遵循 <b>"后置覆盖前置"</b> 规则. 为了保证您的图纸清理和命令行体验足够清爽且体积没有垃圾, 建议使用冲突校验剔除重复冗余项. 
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              3. 外部命令扩展字段
            </h4>
            <p>
              PGP 文件除定义键盘快捷键别名外, 还能定义外部系统 Shell 命令 (如调用 Windows 记事本, 运行计算器等) , 语法格式为 `[指令], [系统Shell执行路径], [标志/Flag]`. 本编辑器专门针对核心 Command 进行了纯净化剔除过滤, 只编译下载最关键的图形绘制类命令. 
            </p>
          </div>
        </div>
      </div>

      <NewsletterSubscribe />
    </div>
);
}
