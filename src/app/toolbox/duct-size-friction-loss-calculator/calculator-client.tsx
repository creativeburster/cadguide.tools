'use client';

import { useState, useMemo } from 'react';
import { HelpCircle, Info, Copy, Check, Shield, Activity, Sliders, Wind } from 'lucide-react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';

const ROUGHNESS_PRESETS = [
  { name: 'Galvanized Steel (镀锌钢板)', value: 0.15 },
  { name: 'Aluminum (铝板)', value: 0.12 },
  { name: 'PVC / Plastic (塑料/聚氯乙烯)', value: 0.005 },
  { name: 'Flexible Duct (软管/金属波纹管)', value: 1.0 },
];

export default function DuctSizeClient() {
  const [shape, setShape] = useState<'round' | 'rectangular'>('round');
  const [flowRate, setFlowRate] = useState(1500); // m³/h
  const [velocityLimit, setVelocityLimit] = useState(6.0); // m/s (Limit or Target)
  
  // Rectangular dimensions
  const [width, setWidth] = useState(400); // mm
  const [height, setHeight] = useState(300); // mm

  // Round dimension
  const [diameter, setDiameter] = useState(300); // mm

  const [roughnessIdx, setRoughnessIdx] = useState(0);
  const [customRoughness, setCustomRoughness] = useState(0.15); // mm
  const [copied, setCopied] = useState(false);

  const roughness = useMemo(() => {
    return roughnessIdx === ROUGHNESS_PRESETS.length ? customRoughness : ROUGHNESS_PRESETS[roughnessIdx].value;
  }, [roughnessIdx, customRoughness]);

  // Compute equivalent dimensions and velocity
  const physics = useMemo(() => {
    const Q = flowRate / 3600; // m³/s
    let D_e = 0; // equivalent diameter in m
    let D_h = 0; // hydraulic diameter in m
    let area = 0; // m²

    if (shape === 'round') {
      D_e = diameter / 1000;
      D_h = D_e;
      area = (Math.PI * Math.pow(D_e, 2)) / 4;
    } else {
      const a = width / 1000;
      const b = height / 1000;
      area = a * b;
      // Huebscher equivalent diameter for same friction loss and velocity
      D_e = 1.30 * Math.pow(a * b, 0.625) / Math.pow(a + b, 0.25);
      // Hydraulic diameter (4 * Area / Perimeter)
      D_h = (2 * a * b) / (a + b);
    }

    const V = Q / area; // m/s
    
    // Air properties at 20°C
    const rho = 1.204; // kg/m³
    const mu = 1.81e-5; // Pa·s
    const Re = (rho * V * D_h) / mu;

    // Darcy friction factor f via Haaland equation
    let f = 0.02;
    if (Re > 2300) {
      const eps = roughness / 1000; // mm to m
      const term1 = eps / (3.7 * D_h);
      const term2 = 6.9 / Re;
      const invSqrtF = -1.8 * Math.log10(Math.pow(term1, 1.11) + term2);
      f = Math.pow(1 / invSqrtF, 2);
    } else if (Re > 0) {
      f = 64 / Re; // Laminar flow
    }

    // Static Pressure Drop per meter (Pa/m) = f * (rho * V^2) / (2 * D_h)
    const pressureDrop = D_h > 0 ? (f * rho * Math.pow(V, 2)) / (2 * D_h) : 0;

    return {
      velocity: V,
      equivalentDiameter: D_e,
      hydraulicDiameter: D_h,
      reynoldsNumber: Re,
      frictionFactor: f,
      pressureDrop: pressureDrop, // Pa/m
      area: area
    };
  }, [shape, flowRate, diameter, width, height, roughness]);

  const copyToClipboard = () => {
    const text = `--- HVAC Air Duct Sizing Report ---
Duct Shape: ${shape === 'round' ? 'Round' : 'Rectangular'}
Flow Rate: ${flowRate} m³/h
Air Velocity: ${physics.velocity.toFixed(2)} m/s
${shape === 'round' ? `Diameter: ${diameter} mm` : `Dimensions: ${width}x${height} mm`}
Equivalent Diameter: ${(physics.equivalentDiameter * 1000).toFixed(1)} mm
Friction Loss: ${physics.pressureDrop.toFixed(3)} Pa/m
Reynolds Number: ${Math.round(physics.reynoldsNumber)}
Friction Factor (f): ${physics.frictionFactor.toFixed(4)}
Generated via CADGuide.tools`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Flow animation speed calculation (higher speed = faster line dashanimation)
  const animDuration = useMemo(() => {
    if (physics.velocity <= 0.1) return 0;
    const dur = 15 / physics.velocity; // base duration mapped
    return Math.max(0.2, Math.min(10, dur)); // cap between 0.2s and 10s
  }, [physics.velocity]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
      {/* Left panel: parameters */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-6 print:bg-white print:text-black print:border-none print:shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <span>输入参数 (Parameters)</span>
          </h2>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
            MEP Configurator
          </span>
        </div>

        {/* Duct Type */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block print:hidden">
            1. 风管截面形状 (Duct Shape)
          </label>
          <div className="grid grid-cols-2 gap-3 print:hidden">
            <button
              onClick={() => setShape('round')}
              className={`py-3 px-4 rounded-2xl text-xs font-black border transition-all duration-200 flex flex-col items-center gap-1.5 ${
                shape === 'round'
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
              }`}
            >
              <span className="text-sm">●</span>
              <span>圆形风管 (Round)</span>
            </button>
            <button
              onClick={() => setShape('rectangular')}
              className={`py-3 px-4 rounded-2xl text-xs font-black border transition-all duration-200 flex flex-col items-center gap-1.5 ${
                shape === 'rectangular'
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
              }`}
            >
              <span className="text-sm">■</span>
              <span>矩形风管 (Rectangular)</span>
            </button>
          </div>
          <div className="hidden print:block font-bold">
            风管类型: {shape === 'round' ? '圆形风管' : '矩形风管'}
          </div>
        </div>

        {/* Airflow */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">2. 设计风量 (Airflow Q)</span>
            <span className="text-blue-400 font-mono">{flowRate} m³/h</span>
          </div>
          <input
            type="range"
            min="100"
            max="15000"
            step="100"
            value={flowRate}
            onChange={(e) => setFlowRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
          <div className="grid grid-cols-2 gap-4 print:hidden">
            <div className="relative">
              <input
                type="number"
                value={flowRate}
                onChange={(e) => setFlowRate(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500">m³/h</span>
            </div>
            <div className="relative">
              <input
                type="text"
                disabled
                value={(flowRate * 0.5886).toFixed(1)}
                className="w-full bg-slate-850 border border-slate-800/40 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-500 focus:outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500">CFM</span>
            </div>
          </div>
        </div>

        {/* Dimensions Inputs */}
        <div className="border-t border-slate-800/80 pt-5 space-y-4">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
            3. 风管物理规格 (Duct Dimensions)
          </div>

          {shape === 'round' ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>直径 (Diameter D)</span>
                <span className="font-mono text-blue-400">{diameter} mm</span>
              </div>
              <input
                type="range"
                min="50"
                max="1200"
                step="10"
                value={diameter}
                onChange={(e) => setDiameter(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
              />
              <input
                type="number"
                value={diameter}
                onChange={(e) => setDiameter(Math.max(10, Number(e.target.value)))}
                className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500 print:hidden"
              />
            </div>
) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold flex justify-between">
                  <span>宽度 (Width a)</span>
                  <span className="font-mono text-blue-400">{width} mm</span>
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Math.max(10, Number(e.target.value)))}
                  className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold flex justify-between">
                  <span>高度 (Height b)</span>
                  <span className="font-mono text-blue-400">{height} mm</span>
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Math.max(10, Number(e.target.value)))}
                  className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
)}
        </div>

        {/* Roughness Presets */}
        <div className="border-t border-slate-800/80 pt-5 space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            4. 材质绝对粗糙度 (Roughness)
          </label>
          <select
            value={roughnessIdx}
            onChange={(e) => setRoughnessIdx(Number(e.target.value))}
            className="w-full bg-slate-850 border border-slate-850 rounded-xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500 print:hidden"
          >
            {ROUGHNESS_PRESETS.map((p, i) => (
              <option key={p.name} value={i}>
                {p.name} ({p.value} mm)
              </option>
))}
            <option value={ROUGHNESS_PRESETS.length}>Custom (自定义数值)</option>
          </select>

          {roughnessIdx === ROUGHNESS_PRESETS.length && (
            <div className="relative print:hidden">
              <input
                type="number"
                step="0.001"
                value={customRoughness}
                onChange={(e) => setCustomRoughness(Math.max(0.0001, Number(e.target.value)))}
                className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500">mm</span>
            </div>
)}
          <div className="hidden print:block font-bold">
            管壁粗糙度: {roughness} mm
          </div>
        </div>
      </div>

      {/* Right panel: physical preview + results */}
      <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
        {/* Results Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-md font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>计算结果 (Flow Physics Report)</span>
            </h3>
            <button
              onClick={copyToClipboard}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all text-xs font-black flex items-center gap-1.5 border border-slate-200/50 print:hidden"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>已复制</span>
                </>
) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制报告</span>
                </>
)}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <span>流速 (Velocity)</span>
                <Wind className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-2xl font-black font-mono text-slate-800">
                {physics.velocity.toFixed(2)} <span className="text-xs text-slate-500 font-sans">m/s</span>
              </div>
              <p className="text-[9px] text-slate-400">
                限制参考值: &lt; {velocityLimit} m/s
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                单位摩擦阻力 (Head Loss)
              </div>
              <div className={`text-2xl font-black font-mono ${physics.pressureDrop > 1.2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {physics.pressureDrop.toFixed(3)} <span className="text-xs font-sans text-slate-500">Pa/m</span>
              </div>
              <p className="text-[9px] text-slate-400">
                推荐上限: 1.0 Pa/m
              </p>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                等效水力直径 (Hydraulic Diam.)
              </div>
              <div className="text-2xl font-black font-mono text-slate-850">
                {Math.round(physics.hydraulicDiameter * 1000)} <span className="text-xs text-slate-500 font-sans">mm</span>
              </div>
              <p className="text-[9px] text-slate-400">
                截面积: {physics.area.toFixed(4)} m²
              </p>
            </div>
          </div>

          {/* Warning state if speed limit is violated */}
          {physics.velocity > velocityLimit && (
            <div className="flex gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-xs">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="font-black">警告: 实际风速超出推荐限制! </strong>
                <p className="mt-0.5 text-amber-700">当前风速 {physics.velocity.toFixed(2)} m/s 超过了设定的 {velocityLimit} m/s 阈值. 这会导致严重的管道风噪和高静压损失. 建议增大风管截面尺寸. </p>
              </div>
            </div>
)}
        </div>

        {/* Visual feedback - Live SVG flow physics */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex-grow flex flex-col justify-between print:bg-white print:border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-500">
              风管物理气流截面预览 (Dynamic Flow Visualizer)
            </span>
            <span className="text-[9px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase print:hidden">
              Re = {Math.round(physics.reynoldsNumber)}
            </span>
          </div>

          {/* SVG Frame */}
          <div className="relative w-full h-[220px] bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center print:bg-slate-50 print:border-slate-200">
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Friction gradient based on pressure drop */}
                <linearGradient id="frictionColor" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor={physics.pressureDrop > 1.2 ? '#ef4444' : (physics.pressureDrop > 0.8 ? '#f59e0b' : '#3b82f6')} />
                </linearGradient>
              </defs>

              {/* Dynamic Flow lines */}
              {animDuration > 0 && (
                <>
                  <path
                    d="M 20 60 L 380 60"
                    stroke="url(#frictionColor)"
                    strokeWidth="1.5"
                    strokeDasharray="6, 12"
                    style={{
                      animation: `flow ${animDuration}s linear infinite`,
                      strokeDashoffset: 100
                    }}
                  />
                  <path
                    d="M 20 100 L 380 100"
                    stroke="url(#frictionColor)"
                    strokeWidth="2.5"
                    strokeDasharray="8, 14"
                    style={{
                      animation: `flow ${animDuration * 0.8}s linear infinite`,
                      strokeDashoffset: 100
                    }}
                  />
                  <path
                    d="M 20 140 L 380 140"
                    stroke="url(#frictionColor)"
                    strokeWidth="1.5"
                    strokeDasharray="6, 12"
                    style={{
                      animation: `flow ${animDuration}s linear infinite`,
                      strokeDashoffset: 100
                    }}
                  />
                </>
)}

              {/* Duct shape boundary overlay */}
              {shape === 'round' ? (
                // Round duct projection
                <g>
                  {/* Outer line of pipe */}
                  <rect x="40" y="50" width="320" height="100" rx="4" stroke="#475569" strokeWidth="3" fill="none" opacity="0.4" />
                  {/* Left pipe opening */}
                  <ellipse cx="40" cy="100" rx="15" ry="50" stroke="#64748b" strokeWidth="3.5" fill="#0f172a" />
                  {/* Right pipe opening */}
                  <ellipse cx="360" cy="100" rx="15" ry="50" stroke="#64748b" strokeWidth="3.5" fill="none" />
                </g>
) : (
                // Rectangular duct projection
                <g>
                  {/* Left rectangular opening */}
                  <rect x="30" y="45" width="40" height="110" stroke="#64748b" strokeWidth="3" fill="#0f172a" rx="2" />
                  {/* Rect body */}
                  <rect x="70" y="45" width="260" height="110" stroke="#475569" strokeWidth="2.5" fill="none" opacity="0.3" rx="1" />
                  {/* Right rectangular opening */}
                  <rect x="330" y="45" width="40" height="110" stroke="#64748b" strokeWidth="3" fill="none" rx="2" />
                  {/* Dimension overlay labels */}
                  <text x="50" y="175" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                    {width}mm (a)
                  </text>
                  <text x="15" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle" transform="rotate(-90 15 105)" fontWeight="bold">
                    {height}mm (b)
                  </text>
                </g>
)}
            </svg>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed mt-4 print:text-slate-600">
            * 动画展示的是风管中心气流线的流速模拟. 流线由蓝转红暗示管道内的压力损失加大 (红为高损失区) . 使用 Haaland 方程和 Colebrook 管道阻力流体动力学进行精确解算. 
          </p>
        </div>
      </div>

      {/* Global CSS injection for flow animation keyframe */}
      <style jsx global>{`
        @keyframes flow {
          to {
            stroke-dashoffset: -100px;
          }
        }
      `}</style>
      
      {/* Newsletter signup section */}
      <div className="lg:col-span-12 mt-4 print:hidden">
        <NewsletterSubscribe />
      </div>
    </div>
);
}
