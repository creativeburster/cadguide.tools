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
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  Gauge
} from 'lucide-react';

export default function DrawingLagCleanerClient() {
  const [cleanRegapp, setCleanRegapp] = useState(true);
  const [cleanScalelist, setCleanScalelist] = useState(true);
  const [cleanOrphanBlock, setCleanOrphanBlock] = useState(true);
  const [runAudit, setRunAudit] = useState(true);
  const [indexDgnLine, setIndexDgnLine] = useState(false); // DGN bloat check
  
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // AutoLISP compiler logic
  const compiledLispScript = useMemo(() => {
    let internalCommands = '';

    if (cleanRegapp) {
      internalCommands += `  (princ "\\n正在静默清除注册应用程序 (Regapps) 残留...")
  (command "-PURGE" "R" "*" "N")\n`;
    }

    if (cleanScalelist) {
      internalCommands += `  (princ "\\n正在重置多余的注释比例列表 (Scale List Edit)...")
  (if (dictremove (namedobjdict) "ACAD_SCALELIST")
    (princ "\\n✓ 比例列表字典重置成功. ")
    (princ "\\n- 未检测到冗余比例字典. ")
)\n`;
    }

    if (cleanOrphanBlock) {
      internalCommands += `  (princ "\\n正在执行三轮强力 PURGE 清理孤立块, 图层与线型...")
  (command "-PURGE" "A" "*" "N")
  (command "-PURGE" "A" "*" "N")
  (command "-PURGE" "A" "*" "N")\n`;
    }

    if (runAudit) {
      internalCommands += `  (princ "\\n正在核验并修复图纸数据库几何错误 (AUDIT)...")
  (command "_AUDIT" "Y")\n`;
    }

    if (indexDgnLine) {
      internalCommands += `  (princ "\\n正在扫描并剥离 DGN 线型膨胀特征 (DICT)...")
  (dictremove (namedobjdict) "ACAD_DGNLINESTYLECOMP")\n`;
    }

    return `; ==========================================================
; CADGuide.tools DWG 图纸卡顿一键静默清理宏 (AutoLISP)
; ==========================================================
(defun c:CLEANDWG ()
  (setvar "CMDECHO" 0)
  (setvar "EXPERT" 3)
  (princ "\\n--- 开始深度优化图纸数据库 ---")
  
${internalCommands}
  (setvar "EXPERT" 0)
  (setvar "CMDECHO" 1)
  (princ "\\n==================================================")
  (princ "\\n✓ 恭喜! 图纸优化清理完毕. 文件体积已显著瘦身. ")
  (princ "\\n==================================================")
  (princ)
)
(princ "\\n加载成功! 输入 [ CLEANDWG ] 并回车以执行深度清理. \\n") (princ)`;
  }, [cleanRegapp, cleanScalelist, cleanOrphanBlock, runAudit, indexDgnLine]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 顶部动态 SVG 展示图纸优化"吸尘器"扫描效果 */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">DWG 数据库物理结构净化</h2>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              DWG Database Structural Purification
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-black">
            LISP 编译器
          </div>
        </div>

        {/* SVG Drawing Area */}
        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-8 px-4 relative">
          <svg viewBox="0 0 500 140" className="w-full max-w-[450px] h-auto" aria-label="CAD Optimization Scanner">
            {/* Grid overlay */}
            <defs>
              <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="500" height="140" fill="url(#gridPattern)" rx="8" />

            {/* CAD Drawing Sheet Frame */}
            <rect x="50" y="20" width="400" height="100" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 3" />
            
            {/* Drawing lines / entities (representing clutter) */}
            {cleanOrphanBlock && (
              <>
                <path d="M 80 40 L 120 80 M 110 30 L 70 90" stroke="#f43f5e" strokeWidth="1" strokeDasharray="1 2" opacity="0.6" />
                <circle cx="280" cy="50" r="15" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              </>
)}
            
            {/* Cleaned entities */}
            <path d="M 180 80 Q 250 30 320 80 M 150 50 L 380 50" stroke="#10b981" strokeWidth="1.5" />
            <rect x="340" y="70" width="30" height="20" fill="none" stroke="#3b82f6" strokeWidth="1.5" />

            {/* Laser scanning beam */}
            <g>
              <line x1="250" y1="15" x2="250" y2="125" stroke="#3b82f6" strokeWidth="2.5" opacity="0.8" />
              <rect x="247" y="15" width="6" height="110" fill="url(#laserGlow)" opacity="0.3" />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="-120 0; 120 0; -120 0"
                dur="6s"
                repeatCount="indefinite"
              />
            </g>
            
            <linearGradient id="laserGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </svg>
        </div>
      </div>

      {/* 主面板布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧: 卡顿特征选择配置 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-slate-800 font-black text-base tracking-tight flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-500" />
              卡顿症状与清理范围
            </h3>

            {/* Checkbox Selector */}
            <div className="flex flex-col gap-4">
              
              {/* Option 1: Regapps */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanRegapp}
                  onChange={(e) => setCleanRegapp(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">注册应用程序清理 (Regapps)</span>
                  <span className="text-slate-400">针对容量虚大 (几十行线有几百MB) 的图纸进行深度清理. </span>
                </div>
              </label>

              {/* Option 2: Scale List */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanScalelist}
                  onChange={(e) => setCleanScalelist(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">重置比例列表 (Scale List)</span>
                  <span className="text-slate-400">解决视口缩放, 切换布局时图纸卡住无响应数秒的现象. </span>
                </div>
              </label>

              {/* Option 3: Orphan Blocks */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanOrphanBlock}
                  onChange={(e) => setCleanOrphanBlock(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">强力 PURGE 冗余垃圾</span>
                  <span className="text-slate-400">执行三轮深度 PURGE, 清空隐藏在底层无关联的块和空图层. </span>
                </div>
              </label>

              {/* Option 4: Audit */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={runAudit}
                  onChange={(e) => setRunAudit(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">数据库物理核验 (AUDIT)</span>
                  <span className="text-slate-400">核对三维图元节点坐标, 自动删除损坏, 错位的畸形数据. </span>
                </div>
              </label>

              {/* Option 5: DGN line check */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={indexDgnLine}
                  onChange={(e) => setIndexDgnLine(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-red-500 block">脱壳 DGN 臃肿线型 (DGN Style)</span>
                  <span className="text-slate-400">针对从 MicroStation 导入残留的超大型线型字典进行剥离. </span>
                </div>
              </label>

            </div>
          </div>
        </div>

        {/* 右侧二联: 生成的 AutoLISP 代码 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between min-h-[460px]">
            
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-slate-900 font-black text-xl tracking-tight">AutoLISP 宏代码实时编译</h3>
                <p className="text-xs text-slate-400 mt-1">
                  可在 CAD 内部以 `.lsp` 文件加载或直接在命令行中粘贴运行. 
                </p>
              </div>

              {/* LISP Code view */}
              <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5" /> cleandwg.lsp 源代码</span>
                  <button
                    onClick={() => handleCopy(compiledLispScript, 'lispCode')}
                    className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedText === 'lispCode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText === 'lispCode' ? '已复制' : '复制命令'}
                  </button>
                </div>
                <div className="max-h-[180px] overflow-y-auto bg-slate-950/40 p-2 rounded-lg text-slate-300 text-[10px]">
                  <pre className="whitespace-pre">{compiledLispScript}</pre>
                </div>
              </div>

              {/* 核心原理与操作手册 */}
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 flex gap-3 text-blue-900">
                <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-black text-slate-800 mb-1">使用和操作指引说明: </p>
                  <ol className="list-decimal list-inside space-y-1 mt-2 text-slate-700 font-medium">
                    <li>复制上方生成的代码, 在桌面创建纯文本文件, 重命名为 <span className="font-mono bg-blue-100 px-1.5 rounded font-black text-blue-800">cleandwg.lsp</span>. </li>
                    <li>在 AutoCAD 中打开需要瘦身清理的图纸, 拖动刚才保存的 `cleandwg.lsp` 文件到绘图视口中. </li>
                    <li>在 CAD 命令栏输入: <span className="font-mono bg-blue-100 px-1.5 rounded font-black text-blue-800">CLEANDWG</span> 并回车即可静默净化并重组图纸数据库. </li>
                    <li><b>懒人方案</b>: 也可以直接复制全部代码, 在 CAD 命令行中按 Ctrl+V 粘贴直接运行. </li>
                  </ol>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <NewsletterSubscribe />
    </div>
);
}
