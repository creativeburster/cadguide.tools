'use client';

import { useState, useMemo } from 'react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';
import {
  HelpCircle,
  Info,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  FileText,
  Terminal,
  Activity,
  ArrowRight,
  Settings,
  Layers,
  Sparkles
} from 'lucide-react';

const SYMPTOMS = [
  {
    id: 'question_mark',
    name: '中文字符全部显示为问号 (?)',
    desc: '最常见于打开外部图纸，中文字体（尤其是大字体 SHX）在本地电脑上缺失。',
    badge: 'SHX 缺失'
  },
  {
    id: 'scrambled_gibberish',
    name: '文字变成毫无逻辑的奇怪乱码',
    desc: '打印生成的 PDF 打开后，文字变为 scrambled 乱字符，且无法正常复制。',
    badge: '编码/PDFSHX 变量冲突'
  },
  {
    id: 'outline_geometry',
    name: '文字显示正常，但变成空心线且文件极大',
    desc: '中文字体显示没有问题，但放大后发现文字变成了折线，无法选中，导致打印极其卡顿。',
    badge: '字体未嵌入/转换为几何图形'
  }
];

export default function PdfFontGibberishClient() {
  const [symptomId, setSymptomId] = useState<'question_mark' | 'scrambled_gibberish' | 'outline_geometry'>('question_mark');
  const [fontAltVal, setFontAltVal] = useState('gbcbig.shx');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Compile LISP Fix command based on choices
  const lispFixCommand = useMemo(() => {
    let commands = '';
    if (symptomId === 'question_mark') {
      commands = `(setvar "FONTALT" "${fontAltVal}")
(princ "\\n✓ 成功设置缺省替换字体为 ${fontAltVal}，重新打开图纸即可消除中文 (?)。\\n")`;
    } else if (symptomId === 'scrambled_gibberish') {
      commands = `(setvar "PDFSHX" 0)
(princ "\\n✓ 成功设置 PDFSHX 为 0。现在打印 PDF 时，SHX 文字将不会作为文本注释输出，杜绝乱码。\\n")`;
    } else {
      commands = `(setvar "PDFSHX" 0)
(setvar "TEXTFILL" 1)
(princ "\\n✓ 成功设置 TEXTFILL 为 1 且 PDFSHX 为 0。请在打印机 .pc3 设置中将 [TrueType 字体] 选项修改为 [嵌入 TrueType] 即可解决空心字。\\n")`;
    }

    return `; CADGuide.tools PDF 乱码修复指令一键加载
(defun c:FIXPDFFONT ()
  (setvar "CMDECHO" 0)
  ${commands}
  (setvar "CMDECHO" 1)
  (princ)
)
(princ "\\n输入 FIXPDFFONT 并回车以执行修复...\\n") (princ)`;
  }, [symptomId, fontAltVal]);

  // Diagram States based on selection
  const diagramStates = useMemo(() => {
    const states = {
      dwg: 'success',
      search: 'success',
      pc3: 'warning',
      pdf: 'danger'
    };

    if (symptomId === 'question_mark') {
      states.search = 'danger';
      states.pc3 = 'inactive';
      states.pdf = 'danger';
    } else if (symptomId === 'scrambled_gibberish') {
      states.search = 'success';
      states.pc3 = 'danger';
      states.pdf = 'danger';
    } else if (symptomId === 'outline_geometry') {
      states.search = 'success';
      states.pc3 = 'warning';
      states.pdf = 'warning';
    }

    return states;
  }, [symptomId]);

  return (
    <div className="flex flex-col gap-8">
      {/* 顶部 SVG 模拟打印流程管道 */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">PDF 出图与字体嵌入链路检测</h2>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              PDF Plotting & Font Integration Pipeline
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-black">
            交互诊断状态
          </div>
        </div>

        {/* SVG Flow diagram */}
        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-8 px-4">
          <svg viewBox="0 0 640 120" className="w-full max-w-[600px] h-auto" aria-label="PDF Plot Flow">
            {/* Connection lines */}
            <path
              d="M 60 60 L 200 60"
              fill="none"
              stroke={diagramStates.search === 'danger' ? '#ef4444' : '#10b981'}
              strokeWidth="2"
              strokeDasharray={diagramStates.search === 'danger' ? 'none' : '5 3'}
              className={diagramStates.search === 'danger' ? '' : 'animate-[dash_10s_linear_infinite]'}
            />
            <path
              d="M 200 60 L 380 60"
              fill="none"
              stroke={diagramStates.pc3 === 'danger' ? '#ef4444' : diagramStates.pc3 === 'inactive' ? '#475569' : diagramStates.pc3 === 'warning' ? '#f59e0b' : '#10b981'}
              strokeWidth="2"
              strokeDasharray={diagramStates.pc3 === 'inactive' ? 'none' : '5 3'}
              className={diagramStates.pc3 === 'inactive' ? '' : 'animate-[dash_10s_linear_infinite]'}
            />
            <path
              d="M 380 60 L 560 60"
              fill="none"
              stroke={diagramStates.pdf === 'danger' ? '#ef4444' : diagramStates.pdf === 'warning' ? '#f59e0b' : '#10b981'}
              strokeWidth="2"
              strokeDasharray={diagramStates.pdf === 'danger' ? 'none' : '5 3'}
              className={diagramStates.pdf === 'danger' ? '' : 'animate-[dash_10s_linear_infinite]'}
            />

            {/* Nodes */}
            {/* Node 1: DWG CAD */}
            <g transform="translate(60, 60)">
              <circle r="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <Layers className="w-5 h-5 text-blue-400" />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">DWG 图纸模型</text>
            </g>

            {/* Node 2: Font Library */}
            <g transform="translate(200, 60)">
              <circle r="20" fill="#1e293b" stroke={diagramStates.search === 'danger' ? '#ef4444' : '#10b981'} strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <FileText className={`w-5 h-5 ${diagramStates.search === 'danger' ? 'text-red-400' : 'text-emerald-400'}`} />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                {diagramStates.search === 'danger' ? 'SHX 字体丢失!' : '字体库映射'}
              </text>
            </g>

            {/* Node 3: pc3 Plot Driver */}
            <g transform="translate(380, 60)">
              <circle r="20" fill="#1e293b" stroke={diagramStates.pc3 === 'danger' ? '#ef4444' : diagramStates.pc3 === 'warning' ? '#f59e0b' : diagramStates.pc3 === 'inactive' ? '#475569' : '#10b981'} strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <Settings className={`w-5 h-5 ${diagramStates.pc3 === 'danger' ? 'text-red-400' : diagramStates.pc3 === 'warning' ? 'text-amber-400' : 'text-slate-400'}`} />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                {diagramStates.pc3 === 'danger' ? 'PDFSHX 格式冲突' : diagramStates.pc3 === 'warning' ? '配置未嵌入' : 'PDF 驱动配置'}
              </text>
            </g>

            {/* Node 4: PDF file output */}
            <g transform="translate(560, 60)">
              <circle r="20" fill="#1e293b" stroke={diagramStates.pdf === 'danger' ? '#ef4444' : diagramStates.pdf === 'warning' ? '#f59e0b' : '#10b981'} strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <Sparkles className={`w-5 h-5 ${diagramStates.pdf === 'danger' ? 'text-red-400' : diagramStates.pdf === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`} />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                {diagramStates.pdf === 'danger' ? '输出乱码 PDF' : diagramStates.pdf === 'warning' ? '输出空心线' : '高保真矢量PDF'}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* 主面板布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧：选择您的乱码现象 */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-slate-800 font-black text-base tracking-tight mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              请选择您的乱码现象
            </h3>
            <div className="flex flex-col gap-2">
              {SYMPTOMS.map((sym) => {
                const isActive = sym.id === symptomId;
                return (
                  <button
                    key={sym.id}
                    onClick={() => setSymptomId(sym.id as any)}
                    className={`w-full flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 font-bold'
                        : 'bg-white hover:bg-slate-50/50 border-slate-100 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {sym.badge}
                      </span>
                    </div>
                    <span className="text-sm text-slate-800 font-black mt-2">{sym.name}</span>
                    <span className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{sym.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 可选附加参数配置 */}
          {symptomId === 'question_mark' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">缺省大字体配置</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fontAlt" className="text-xs font-black text-slate-500 uppercase">替换大字体名字 (SHX)</label>
                <input
                  id="fontAlt"
                  type="text"
                  value={fontAltVal}
                  onChange={(e) => setFontAltVal(e.target.value)}
                  placeholder="默认: gbcbig.shx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  AutoCAD 打开图纸时，若找不到对应的大字体（中文字体），会使用 `FONTALT` 变量指定的字体自动替换。常用推荐 `gbcbig.shx`（国标大字体）或 `hztxt.shx`。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 右侧二联：修复建议与代码生成 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between min-h-[400px]">
            
            {/* 诊断正文 */}
            <div className="flex flex-col gap-5">
              <h3 className="text-slate-900 font-black text-lg tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                修复指引及原理诊断
              </h3>
              
              {/* Question Mark Fix */}
              {symptomId === 'question_mark' && (
                <div className="text-xs text-slate-600 leading-relaxed flex flex-col gap-3">
                  <p className="font-bold text-slate-800">故障成因（为什么显示为问号）：</p>
                  <p>中文字符在 CAD 中由大字体（Big Font）形式渲染。当加载外部传入图纸时，如果对方使用的特殊中文字体在您本地的 `Fonts` 文件夹内不存在（或者未在全局注册替换），CAD 引擎会将这些缺失字符渲染为 `?`。</p>
                  
                  <p className="font-bold text-slate-800 mt-2">手动修复方案：</p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>在 CAD 命令栏输入并回车执行 <span className="font-mono bg-slate-100 text-slate-800 px-1 rounded font-bold">FONTALT</span> 系统变量。</li>
                    <li>将其输入修改为指定替换的大字体：<span className="font-mono bg-slate-100 text-slate-800 px-1 rounded font-bold">{fontAltVal}</span>。</li>
                    <li>保存当前图纸，关闭 CAD 软件重新打开。缺失的字体将自动映射为 {fontAltVal}，解决乱码。</li>
                  </ol>
                </div>
              )}

              {/* Scrambled Gibberish Fix */}
              {symptomId === 'scrambled_gibberish' && (
                <div className="text-xs text-slate-600 leading-relaxed flex flex-col gap-3">
                  <p className="font-bold text-slate-800">故障成因（为什么变成乱字符）：</p>
                  <p>在较新版本的 AutoCAD 中，系统引进了 `PDFSHX` 变量（默认值为 1）。开启该变量后，打印导出的 PDF 内部，每一个 SHX 中文字体会同时以 PDF 注释的形式导出，以便可以在 PDF 软件中搜索。然而由于编码解析冲突，这会导致很多 PDF 浏览器中呈现出杂乱的英文字符与大片乱码。</p>
                  
                  <p className="font-bold text-slate-800 mt-2">手动修复方案：</p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>在 CAD 命令栏中直接输入：<span className="font-mono bg-slate-100 text-slate-800 px-1 rounded font-bold">PDFSHX</span> 并回车。</li>
                    <li>将其属性修改置为：<span className="font-mono bg-blue-100 text-blue-800 px-1 rounded font-bold">0</span>（关闭生成 SHX 文字批注功能）。</li>
                    <li>再次使用 `PLOT` 打印出图，所有的多余注释字符乱码将全部消失。</li>
                  </ol>
                </div>
              )}

              {/* Outline Geometry Fix */}
              {symptomId === 'outline_geometry' && (
                <div className="text-xs text-slate-600 leading-relaxed flex flex-col gap-3">
                  <p className="font-bold text-slate-800">故障成因（为什么变成空心字且极卡）：</p>
                  <p>当打印机驱动（如 `DWG to PDF.pc3`）未能识别当前图纸里的 TrueType 字体，或者配置为将文字“转换为几何图形（Geometries）”时，CAD 会把所有字体文字炸碎成多根碎线。这不仅导致文件体积比正常文字大出数倍且放大后中空，也使得移动和阅览极慢。</p>
                  
                  <p className="font-bold text-slate-800 mt-2">手动修复方案：</p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>在 CAD 输入系统变量：<span className="font-mono bg-slate-100 text-slate-800 px-1 rounded font-bold">TEXTFILL</span> 并将其设为 <span className="font-mono bg-slate-100 text-slate-800 px-1 rounded font-bold">1</span>（启用文字填充）。</li>
                    <li>键入 `PLOT` 打开打印面板，在打印机名称选择 <span className="font-mono bg-slate-100 px-1 rounded font-bold">DWG to PDF.pc3</span>，点击右侧的 <b>[特性 (Properties)]</b>。</li>
                    <li>展开 <b>[设备和文档设置]</b> ➔ 选择 <b>[自定义特性]</b> ➔ 点击下方的 <b>[自定义特性]</b> 按钮。</li>
                    <li>在字体选项卡中，确保勾选了：<b>[捕获图形中使用的字体 (Capture fonts used in drawing)]</b>，并且在 TrueType 字体选项中选择 <b>[TrueType 文本]</b> 而非 [TrueType 几何图形]。</li>
                  </ol>
                </div>
              )}
            </div>

            {/* 一键 AutoLISP 脚本区域 */}
            <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4 mt-6">
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>AutoLISP 一键修复指令 (命令行粘贴即可)</span>
                <button
                  onClick={() => handleCopy(lispFixCommand, 'lispFix')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedText === 'lispFix' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'lispFix' ? '已复制' : '复制修复代码'}
                </button>
              </div>
              <pre className="overflow-x-auto text-emerald-400 select-all p-1 bg-slate-950/40 rounded-lg max-h-[120px] text-[10px]">
                {lispFixCommand}
              </pre>
              <p className="text-[10px] text-slate-400 italic">用法：点击复制，在 CAD 命令行中直接按 Ctrl+V 粘贴所有内容并回车。即可静默加载该修复宏，并在命令行直接调用命令进行一键批量修复。</p>
            </div>

          </div>
        </div>

      </div>

      <NewsletterSubscribe />
    </div>
  );
}
