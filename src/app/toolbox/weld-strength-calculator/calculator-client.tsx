'use client';

import { useState, useMemo } from 'react';
import { HelpCircle, Info, Copy, Check, Shield, AlertTriangle, Layers, Percent } from 'lucide-react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';

const WELD_ELECTRODES = [
  { name: 'GB E43 / Q235 (中国国标级)', strength: 160, desc: '常用于普通 Q235 碳素结构钢搭接' },
  { name: 'GB E50 / Q345 (低合金高强钢)', strength: 200, desc: '适用于 Q345 (Q355) 等低合金高强度钢结构' },
  { name: 'AISC E60XX (美标级)', strength: 124, desc: 'AISC 标准下 E60 焊丝设计容许剪切应力' },
  { name: 'AISC E70XX (美标高强级)', strength: 145, desc: '美标最广泛使用的重载钢结构角焊条' },
];

export default function WeldStrengthClient() {
  const [electrodeIdx, setElectrodeIdx] = useState(0);
  const [legSize, setLegSize] = useState(8); // hf in mm
  const [length, setLength] = useState(150); // L in mm
  const [excludeCraters, setExcludeCraters] = useState(true); // exclude 2*hf
  const [appliedLoad, setAppliedLoad] = useState(50.0); // P in kN
  const [copied, setCopied] = useState(false);

  const electrode = useMemo(() => WELD_ELECTRODES[electrodeIdx], [electrodeIdx]);

  // Compute strength (P in kN)
  const physics = useMemo(() => {
    const hf = legSize;
    const L = length;
    const fw = electrode.strength; // N/mm²

    // Throat thickness: a = 0.707 * hf
    const throat = 0.707 * hf;

    // Effective length: Le = L - 2*hf (if checked)
    const effectiveLen = Math.max(1, excludeCraters ? L - 2 * hf : L);

    // Allowable Load: P_allow = throat * Le * fw (N) -> convert to kN
    const maxCapacity = (throat * effectiveLen * fw) / 1000;

    // Stress calculation
    const currentStress = effectiveLen > 0 && throat > 0 ? (appliedLoad * 1000) / (throat * effectiveLen) : 0;
    const stressRatio = maxCapacity > 0 ? (appliedLoad / maxCapacity) * 100 : 0;

    return {
      throat,
      effectiveLen,
      maxCapacity,
      currentStress,
      stressRatio,
    };
  }, [legSize, length, excludeCraters, appliedLoad, electrode]);

  const copyToClipboard = () => {
    const text = `--- Fillet Weld Load Report ---
Electrode Standard: ${electrode.name} (Design limit fw = ${electrode.strength} N/mm²)
Leg Size (hf): ${legSize} mm
Effective Throat (a = 0.707*hf): ${physics.throat.toFixed(2)} mm
Weld Length: ${length} mm (Craters excluded: ${excludeCraters ? 'Yes' : 'No'})
Effective Length (Le): ${physics.effectiveLen} mm
Maximum Joint Capacity (P_allow): ${physics.maxCapacity.toFixed(2)} kN
Applied Load (P): ${appliedLoad} kN
Stress Utilization: ${physics.stressRatio.toFixed(1)}% (${physics.currentStress.toFixed(1)} N/mm² / ${electrode.strength} N/mm²)
Generated via CADGuide.tools`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSafetyDanger = physics.stressRatio >= 100;
  const isSafetyWarning = physics.stressRatio >= 85 && physics.stressRatio < 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
      {/* Parameters Panel */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-6 print:bg-white print:text-black print:border-none print:shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>角焊缝尺寸与荷载设定</span>
          </h2>
        </div>

        {/* Electrode Strength */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            1. 焊条与结构钢规范强度 (Weld Electrode)
          </label>
          <select
            value={electrodeIdx}
            onChange={(e) => setElectrodeIdx(Number(e.target.value))}
            className="w-full bg-slate-850 border border-slate-850 rounded-xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none print:hidden"
          >
            {WELD_ELECTRODES.map((el, i) => (
              <option key={el.name} value={i}>
                {el.name} (强度: {el.strength} N/mm²)
              </option>
            ))}
          </select>
          <div className="hidden print:block font-bold">
            焊缝设计强度: {electrode.name} ({electrode.strength} N/mm²)
          </div>
        </div>

        {/* Weld Leg Size */}
        <div className="space-y-3 border-t border-slate-800/80 pt-5">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">2. 焊脚尺寸 (Leg Size hf)</span>
            <span className="text-blue-400 font-mono">{legSize} mm</span>
          </div>
          <input
            type="range"
            min="3"
            max="20"
            step="1"
            value={legSize}
            onChange={(e) => setLegSize(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
          <input
            type="number"
            value={legSize}
            onChange={(e) => setLegSize(Math.max(1, Number(e.target.value)))}
            className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500 print:hidden"
          />
        </div>

        {/* Weld Length */}
        <div className="space-y-3 border-t border-slate-800/80 pt-5">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">3. 焊缝设计长度 (Weld Length L)</span>
            <span className="text-blue-400 font-mono">{length} mm</span>
          </div>
          <input
            type="range"
            min="10"
            max="600"
            step="5"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="craters"
              checked={excludeCraters}
              onChange={(e) => setExcludeCraters(e.target.checked)}
              className="rounded border-slate-850 text-blue-600 focus:ring-blue-500 w-4 h-4 bg-slate-850 accent-blue-500 cursor-pointer"
            />
            <label htmlFor="craters" className="text-xs font-bold text-slate-300 cursor-pointer select-none">
              扣除起落弧弧坑边界缺陷 (扣除 2×hf)
            </label>
          </div>
        </div>

        {/* External Applied Load */}
        <div className="space-y-3 border-t border-slate-800/80 pt-5">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">4. 剪切/拉伸外载荷 (Load P)</span>
            <span className="text-blue-400 font-mono">{appliedLoad} kN</span>
          </div>
          <input
            type="range"
            min="5"
            max="300"
            step="5"
            value={appliedLoad}
            onChange={(e) => setAppliedLoad(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
          <input
            type="number"
            value={appliedLoad}
            onChange={(e) => setAppliedLoad(Math.max(1, Number(e.target.value)))}
            className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500 print:hidden"
          />
        </div>
      </div>

      {/* Right Outputs Panel */}
      <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
        {/* Results Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-md font-black text-slate-900 flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-500" />
              <span>结构接头承载力评估</span>
            </h3>
            <button
              onClick={copyToClipboard}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all text-xs font-black flex items-center gap-1.5 border border-slate-200/50 print:hidden"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{copied ? '已复制' : '复制报告'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                设计抗拉极限 (Allowable Load)
              </span>
              <div className="text-2xl font-black font-mono text-blue-600">
                {physics.maxCapacity.toFixed(2)} <span className="text-xs text-slate-500 font-sans">kN</span>
              </div>
              <p className="text-[9px] text-slate-400">
                焊缝最大安全承载力
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                有效喉厚 (Throat Size a)
              </span>
              <div className="text-2xl font-black font-mono text-slate-800">
                {physics.throat.toFixed(2)} <span className="text-xs text-slate-500 font-sans">mm</span>
              </div>
              <p className="text-[9px] text-slate-400">
                最小承载面计算厚度
              </p>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                焊缝应力强度利用率
              </span>
              <div className={`text-2xl font-black font-mono ${isSafetyDanger ? 'text-red-500' : (isSafetyWarning ? 'text-amber-500' : 'text-emerald-600')}`}>
                {physics.stressRatio.toFixed(1)} <span className="text-xs text-slate-500 font-sans">%</span>
              </div>
              <p className="text-[9px] text-slate-400">
                实际设计负荷比
              </p>
            </div>
          </div>

          {/* Safety warnings */}
          {isSafetyDanger && (
            <div className="flex gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl text-red-800 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <strong className="font-black">焊缝超载剪切破坏警告！</strong>
                <p className="mt-0.5 text-red-700">
                  当前外力荷载为 {appliedLoad} kN，已超越焊缝设计承载限值 {physics.maxCapacity.toFixed(2)} kN (负荷比 {physics.stressRatio.toFixed(1)}%)。焊缝容易发生剪切断裂。建议增大焊脚尺寸或加长焊缝。
                </p>
              </div>
            </div>
          )}

          {isSafetyWarning && !isSafetyDanger && (
            <div className="flex gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-xs">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="font-black">高负荷预警 (Weld Highly Stressed)</strong>
                <p className="mt-0.5 text-amber-700">
                  负荷应力比已处于 {physics.stressRatio.toFixed(1)}% 的高负荷运转带，建议增大安全冗余。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Weld 2D Section SVG */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex-grow flex flex-col justify-between print:bg-white print:border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-500">
              焊缝受力喉厚与破坏带受剪截面模拟
            </span>
          </div>

          {/* SVG Frame */}
          <div className="relative w-full h-[180px] bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Main vertical plate */}
              <rect x="50" y="20" width="30" height="160" fill="#334155" stroke="#475569" strokeWidth="1.5" />

              {/* Main horizontal base plate */}
              <rect x="80" y="120" width="270" height="30" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />

              {/* Fillet Weld shape */}
              <path
                d={`M 80 ${120 - legSize * 4} L 80 120 L ${80 + legSize * 4} 120 Z`}
                fill="url(#weldGradient)"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              
              <defs>
                <linearGradient id="weldGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>

              {/* Frictional shear failure belt / Throat Line */}
              <line
                x1="80"
                y1="120"
                x2={80 + (legSize * 4) / 2}
                y2={120 - (legSize * 4) / 2}
                stroke={isSafetyDanger ? '#ef4444' : '#10b981'}
                strokeWidth="2.5"
                strokeDasharray="2.5 1.5"
              />

              {/* Dimension indicators for Leg */}
              <path d={`M 80 132 L ${80 + legSize * 4} 132`} stroke="#94a3b8" strokeWidth="1" />
              <text x={80 + (legSize * 4) / 2} y="143" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontWeight="bold">
                hf={legSize}mm
              </text>

              <path d={`M 40 ${120 - legSize * 4} L 40 120`} stroke="#94a3b8" strokeWidth="1" />
              <text x="35" y={120 - (legSize * 4) / 2} fill="#94a3b8" fontSize="8.5" textAnchor="end" transform={`rotate(-90 35 ${120 - (legSize * 4) / 2})`} fontWeight="bold">
                hf={legSize}mm
              </text>

              {/* Throat Label */}
              <text
                x={85 + (legSize * 4) / 2}
                y={118 - (legSize * 4) / 2}
                fill={isSafetyDanger ? '#f87171' : '#10b981'}
                fontSize="9"
                fontWeight="bold"
              >
                a={physics.throat.toFixed(1)}mm (有效喉厚)
              </text>

              {/* Tensile pulling force */}
              <g stroke="#60a5fa" strokeWidth="2.5" fill="none">
                <path d="M 40 70 L 10 70 M 15 65 L 10 70 L 15 75" />
                <path d="M 90 70 L 120 70 M 115 65 L 120 70 L 115 75" />
              </g>
              <text x="5" y="60" fill="#60a5fa" fontSize="8.5" fontWeight="bold">拉伸载荷 P</text>
            </svg>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed mt-4 print:text-slate-650">
            * 物理图示：角焊缝的承载剪切断面是其 45 度角平分线处的“有效喉厚面”（即图中绿/红色虚线）。当外载荷过高，这层截面会因应力剪切而开裂。使用 GB 50017 和 AISC 极限承载规范精确估算安全冗余。
          </p>
        </div>
      </div>

      <div className="lg:col-span-12 mt-4 print:hidden">
        <NewsletterSubscribe />
      </div>
    </div>
  );
}
