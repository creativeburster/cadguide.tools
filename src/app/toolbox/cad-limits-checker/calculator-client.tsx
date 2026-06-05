'use client';

import { useState, useMemo } from 'react';
import { HelpCircle, Info, Copy, Check, Shield, FileText, ChevronRight, Settings } from 'lucide-react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';

const PAPER_SIZES = [
  { name: 'ISO A0', width: 1189, height: 841 },
  { name: 'ISO A1', width: 841, height: 594 },
  { name: 'ISO A2', width: 594, height: 420 },
  { name: 'ISO A3', width: 420, height: 297 },
  { name: 'ISO A4', width: 297, height: 210 },
  { name: 'Arch E', width: 1219.2, height: 914.4 },
  { name: 'Arch D', width: 914.4, height: 609.6 },
];

const SCALES = [
  { label: '1 : 1', value: 1 },
  { label: '1 : 5', value: 5 },
  { label: '1 : 10', value: 10 },
  { label: '1 : 20', value: 20 },
  { label: '1 : 50', value: 50 },
  { label: '1 : 100', value: 100 },
  { label: '1 : 200', value: 200 },
  { label: '1 : 500', value: 500 },
  { label: '1 : 1000', value: 1000 },
];

export default function LimitsCheckerClient() {
  const [paperIdx, setPaperIdx] = useState(3); // A3 default
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [scaleIdx, setScaleIdx] = useState(5); // 1:100 default
  const [unit, setUnit] = useState<'mm' | 'm'>('mm');
  const [copied, setCopied] = useState(false);

  const paper = useMemo(() => PAPER_SIZES[paperIdx], [paperIdx]);
  const scale = useMemo(() => SCALES[scaleIdx], [scaleIdx]);

  // Dimensions mapped to orientation and unit
  const dims = useMemo(() => {
    const w = orientation === 'landscape' ? paper.width : paper.height;
    const h = orientation === 'landscape' ? paper.height : paper.width;
    
    // Model space size in mm
    const modelW_mm = w * scale.value;
    const modelH_mm = h * scale.value;

    // Convert to target units
    const div = unit === 'm' ? 1000 : 1;
    const modelW = modelW_mm / div;
    const modelH = modelH_mm / div;

    // Optimal grid calculation (grid every ~10% or standard snap increments)
    // For 1:100 scale, grid is typically 1000 mm (1m) or 500 mm.
    let recommendedGrid = scale.value * 10; // basic heuristic in mm
    if (unit === 'm') {
      recommendedGrid = recommendedGrid / 1000;
    }
    
    // Round to nice engineering values (e.g. 1, 2, 5, 10, 50, 100, 500, 1000)
    let grid = 1;
    const rawGrid = recommendedGrid;
    if (rawGrid >= 500) grid = 500;
    else if (rawGrid >= 200) grid = 200;
    else if (rawGrid >= 100) grid = 100;
    else if (rawGrid >= 50) grid = 50;
    else if (rawGrid >= 10) grid = 10;
    else if (rawGrid >= 5) grid = 5;
    else if (rawGrid >= 2) grid = 2;
    else if (rawGrid >= 1) grid = 1;
    else if (rawGrid >= 0.5) grid = 0.5;
    else if (rawGrid >= 0.1) grid = 0.1;
    else grid = 0.05;

    const snap = grid / 5; // standard sub-snap

    return {
      paperW: w,
      paperH: h,
      modelW,
      modelH,
      grid,
      snap,
    };
  }, [paper, orientation, scale, unit]);

  // AutoCAD macro output text
  const macroText = useMemo(() => {
    return `LIMITS
0,0
${dims.modelW.toFixed(1)},${dims.modelH.toFixed(1)}
GRID
${dims.grid.toFixed(2)}
SNAP
${dims.snap.toFixed(2)}
ZOOM
All`;
  }, [dims]);

  const copyMacro = () => {
    navigator.clipboard.writeText(macroText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
      {/* Parameters Panel */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-6 print:bg-white print:text-black print:border-none print:shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>页面与比例设置</span>
          </h2>
        </div>

        {/* Paper Size */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            1. 标准图纸规格 (Paper Size)
          </label>
          <select
            value={paperIdx}
            onChange={(e) => setPaperIdx(Number(e.target.value))}
            className="w-full bg-slate-850 border border-slate-850 rounded-xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none print:hidden"
          >
            {PAPER_SIZES.map((p, i) => (
              <option key={p.name} value={i}>
                {p.name} ({Math.round(p.width)} x {Math.round(p.height)} mm)
              </option>
))}
          </select>
          <div className="hidden print:block font-bold">
            图纸规格: {paper.name}
          </div>
        </div>

        {/* Orientation & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              2. 纸张摆放 (Orientation)
            </label>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => setOrientation('landscape')}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                  orientation === 'landscape'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                }`}
              >
                横向
              </button>
              <button
                onClick={() => setOrientation('portrait')}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                  orientation === 'portrait'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                }`}
              >
                纵向
              </button>
            </div>
            <div className="hidden print:block font-bold">
              纸张摆放: {orientation === 'landscape' ? '横向' : '纵向'}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              3. 绘图单位 (CAD Unit)
            </label>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => setUnit('mm')}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                  unit === 'mm'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                }`}
              >
                毫米 (mm)
              </button>
              <button
                onClick={() => setUnit('m')}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                  unit === 'm'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                }`}
              >
                米 (m)
              </button>
            </div>
            <div className="hidden print:block font-bold">
              绘图单位: {unit === 'mm' ? '毫米 (mm)' : '米 (m)'}
            </div>
          </div>
        </div>

        {/* Output Scale */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">4. 打印输出比例 (Output Scale)</span>
            <span className="text-blue-400 font-mono">{scale.label}</span>
          </div>
          <select
            value={scaleIdx}
            onChange={(e) => setScaleIdx(Number(e.target.value))}
            className="w-full bg-slate-850 border border-slate-850 rounded-xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none print:hidden"
          >
            {SCALES.map((s, i) => (
              <option key={s.label} value={i}>
                {s.label}
              </option>
))}
          </select>
          <div className="hidden print:block font-bold">
            打印比例: {scale.label}
          </div>
        </div>
      </div>

      {/* Right Results Panel */}
      <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
        {/* Results Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-md font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>LIMITS 与网格参数报告</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                界限范围 (LIMITS Coordinate)
              </span>
              <div className="text-xl font-black font-mono text-slate-800">
                0,0 至 {dims.modelW.toFixed(1)},{dims.modelH.toFixed(1)}
              </div>
              <p className="text-[9.5px] text-slate-400">
                模型空间总尺寸: {dims.modelW.toFixed(0)} x {dims.modelH.toFixed(0)} {unit}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                推荐网格步长 (GRID / SNAP)
              </span>
              <div className="text-xl font-black font-mono text-blue-600">
                GRID: {dims.grid} / SNAP: {dims.snap.toFixed(2)}
              </div>
              <p className="text-[9.5px] text-slate-400">
                建议按 5:1 的子步长设置捕捉对齐
              </p>
            </div>
          </div>

          {/* CLI Script Output */}
          <div className="space-y-2 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wide">
                AutoCAD 命令行一键生成配置
              </span>
              <button
                onClick={copyMacro}
                className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black flex items-center gap-1 border border-slate-200/50 print:hidden"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制' : '复制命令'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-300 font-mono text-[11px] p-4 rounded-2xl overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
              {macroText}
            </pre>
          </div>
        </div>

        {/* Dynamic Model Space Visualizer */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex-grow flex flex-col justify-between print:bg-white print:border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              模型空间图纸纸张边界与 Grid 预览
            </span>
          </div>

          {/* SVG representation */}
          <div className="relative w-full h-[180px] bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Draw Grids inside SVG background */}
              <defs>
                <pattern id="limitsGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#limitsGrid)" />

              {/* Draw Model Space sheet paper border */}
              <g transform="translate(40, 20)">
                {/* Simulated Sheet Area */}
                <rect
                  x="0"
                  y="0"
                  width="320"
                  height="160"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  opacity="0.8"
                />
                
                {/* 0,0 Corner Mark */}
                <circle cx="0" cy="160" r="4.5" fill="#10b981" />
                <text x="8" y="155" fill="#10b981" fontSize="9" fontWeight="bold">0,0</text>

                {/* Xmax, Ymax Corner Mark */}
                <circle cx="320" cy="0" r="4.5" fill="#ef4444" />
                <text x="312" y="-5" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="end">
                  {dims.modelW.toFixed(0)},{dims.modelH.toFixed(0)}
                </text>

                {/* Dimensions labels */}
                <text x="160" y="178" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                  {dims.modelW.toFixed(0)} {unit} (Width)
                </text>
                <text x="-15" y="80" fill="#94a3b8" fontSize="10" textAnchor="middle" transform="rotate(-90 -15 80)" fontWeight="bold">
                  {dims.modelH.toFixed(0)} {unit} (Height)
                </text>
              </g>
            </svg>
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed mt-4 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>LIMITS 核心提示: </strong>配置图纸界限的目的是限制超出图纸范围的误绘, 并使得 AutoCAD 的 `GRID` (网格) 只在图纸打印区内呈现. 当在布局视口 (Viewport) 内对齐模型空间时, 确保 `LIMITS` 比例与视口 XP 比例倒数一致, 可避免"网格超出屏幕"或"网格过密不显示"的现象. 
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-12 mt-4 print:hidden">
        <NewsletterSubscribe />
      </div>
    </div>
);
}
