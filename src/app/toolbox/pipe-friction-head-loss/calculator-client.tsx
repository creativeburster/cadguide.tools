'use client';

import { useState, useMemo } from 'react';
import { HelpCircle, Info, Copy, Check, Shield, Activity, Sliders, Droplets } from 'lucide-react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';

const PIPE_MATERIALS = [
  { name: 'PVC / Plastic (塑料/聚氯乙烯)', C: 150, desc: '内壁极光滑，抗腐蚀性好' },
  { name: 'Copper / Stainless Steel (铜管/不锈钢管)', C: 140, desc: '流体阻力极低，常用于冷热水管' },
  { name: 'Welded Steel (普通焊接钢管)', C: 120, desc: '工业循环水、采暖常备' },
  { name: 'New Cast Iron (新铸铁管)', C: 100, desc: '市政供水主管道常见' },
  { name: 'Old Corroded Cast Iron (旧锈蚀铸铁管)', C: 80, desc: '管道结垢、内壁阻力大' },
];

export default function PipeFrictionClient() {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [flowRate, setFlowRate] = useState(15.0); // m³/h
  const [diameter, setDiameter] = useState(80); // mm (internal diameter)
  const [length, setLength] = useState(100); // meters
  const [copied, setCopied] = useState(false);

  const material = useMemo(() => PIPE_MATERIALS[materialIdx], [materialIdx]);

  // Compute hydraulics properties
  const hydraulics = useMemo(() => {
    const Q = flowRate / 3600; // m³/s
    const d = diameter / 1000; // m
    const L = length;
    const C = material.C;

    // Velocity: V = Q / Area = 4Q / (pi * d^2)
    const area = (Math.PI * Math.pow(d, 2)) / 4;
    const velocity = d > 0 ? Q / area : 0;

    // Hazen-Williams Head Loss: h_f = 10.67 * L * Q^1.852 / (C^1.852 * d^4.87)
    let headLoss = 0;
    if (d > 0 && C > 0) {
      headLoss = (10.67 * L * Math.pow(Q, 1.852)) / (Math.pow(C, 1.852) * Math.pow(d, 4.87));
    }

    // Pressure drop: Delta P = h_f * rho * g (in Pa)
    // For water, rho = 1000 kg/m³, g = 9.81 m/s²
    // Convert to kPa
    const pressureDrop = (headLoss * 1000 * 9.81) / 1000; // kPa
    const unitPressureDrop = L > 0 ? pressureDrop / L : 0; // kPa/m

    return {
      area,
      velocity,
      headLoss, // m of water
      pressureDrop, // kPa
      unitPressureDrop, // kPa/m
    };
  }, [flowRate, diameter, length, material]);

  const copyToClipboard = () => {
    const text = `--- Piping Hydraulic Report ---
Pipe Material: ${material.name} (C = ${material.C})
Pipe Length: ${length} m
Internal Diameter: ${diameter} mm
Flow Rate: ${flowRate} m³/h (${(flowRate * 16.6667).toFixed(1)} L/min)
Flow Velocity: ${hydraulics.velocity.toFixed(2)} m/s
Friction Head Loss: ${hydraulics.headLoss.toFixed(2)} m
Total Pressure Drop: ${hydraulics.pressureDrop.toFixed(2)} kPa
Unit Pressure Drop: ${hydraulics.unitPressureDrop.toFixed(4)} kPa/m
Generated via CADGuide.tools`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Water flow wave visual speed
  const flowDuration = useMemo(() => {
    if (hydraulics.velocity <= 0.05) return 0;
    const dur = 10 / hydraulics.velocity;
    return Math.max(0.15, Math.min(8, dur));
  }, [hydraulics.velocity]);

  // Color warning index: pressure drop per meter limit check (recommend < 0.4 kPa/m or similar)
  const isLossSevere = hydraulics.unitPressureDrop > 0.35;
  const isVelocityHigh = hydraulics.velocity > 2.0; // water speed recom &lt; 2m/s in building piping

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
      {/* Parameters panel */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-6 print:bg-white print:text-black print:border-none print:shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <span>输入参数 (Parameters)</span>
          </h2>
        </div>

        {/* Material C Coefficient */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            1. 管道材质参数 (Pipe Material & C-Value)
          </label>
          <select
            value={materialIdx}
            onChange={(e) => setMaterialIdx(Number(e.target.value))}
            className="w-full bg-slate-850 border border-slate-850 rounded-xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none print:hidden"
          >
            {PIPE_MATERIALS.map((m, i) => (
              <option key={m.name} value={i}>
                {m.name} (C={m.C})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-500 print:hidden">
            * C 因子（Hazen-Williams 常数）越大代表管壁越光滑。
          </p>
          <div className="hidden print:block font-bold">
            材质: {material.name} (C = {material.C})
          </div>
        </div>

        {/* Flow Rate */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">2. 设计流量 (Flow Rate Q)</span>
            <span className="text-blue-400 font-mono">{flowRate} m³/h</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="120"
            step="0.5"
            value={flowRate}
            onChange={(e) => setFlowRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
          <div className="grid grid-cols-2 gap-4 print:hidden">
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={flowRate}
                onChange={(e) => setFlowRate(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500 font-mono">m³/h</span>
            </div>
            <div className="relative">
              <input
                type="text"
                disabled
                value={(flowRate * 16.6667).toFixed(1)}
                className="w-full bg-slate-850 border border-slate-800/40 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-500 focus:outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500 font-mono">L/min</span>
            </div>
          </div>
        </div>

        {/* Internal Diameter */}
        <div className="space-y-3 border-t border-slate-800/80 pt-5">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">3. 管道实际内径 (Inner Diameter d)</span>
            <span className="text-blue-400 font-mono">{diameter} mm</span>
          </div>
          <input
            type="range"
            min="10"
            max="400"
            step="5"
            value={diameter}
            onChange={(e) => setDiameter(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
          <input
            type="number"
            value={diameter}
            onChange={(e) => setDiameter(Math.max(2, Number(e.target.value)))}
            className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500 print:hidden"
          />
        </div>

        {/* Pipe Length */}
        <div className="space-y-3 border-t border-slate-800/80 pt-5">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">4. 管道总物理长度 (Length L)</span>
            <span className="text-blue-400 font-mono">{length} m</span>
          </div>
          <input
            type="range"
            min="5"
            max="1000"
            step="5"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Math.max(1, Number(e.target.value)))}
            className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500 print:hidden"
          />
        </div>
      </div>

      {/* Right Outputs Panel */}
      <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
        {/* Results */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-md font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>水力学阻力计算报告 (Hydraulics Report)</span>
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
                流体流速 (Flow Velocity)
              </span>
              <div className={`text-2xl font-black font-mono ${isVelocityHigh ? 'text-amber-600' : 'text-slate-800'}`}>
                {hydraulics.velocity.toFixed(2)} <span className="text-xs text-slate-500 font-sans">m/s</span>
              </div>
              <p className="text-[9px] text-slate-400">
                重力供水推荐: 0.8 - 1.5 m/s
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                摩擦水头损失 (Static Head Loss)
              </span>
              <div className="text-2xl font-black font-mono text-blue-600">
                {hydraulics.headLoss.toFixed(2)} <span className="text-xs text-slate-500 font-sans">mH₂O</span>
              </div>
              <p className="text-[9px] text-slate-400">
                对应总压力损失: {hydraulics.pressureDrop.toFixed(1)} kPa
              </p>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                单位水阻梯度 (Unit Loss)
              </span>
              <div className={`text-2xl font-black font-mono ${isLossSevere ? 'text-red-500' : 'text-emerald-600'}`}>
                {hydraulics.unitPressureDrop.toFixed(4)} <span className="text-xs text-slate-500 font-sans">kPa/m</span>
              </div>
              <p className="text-[9px] text-slate-400">
                舒适界限: &lt; 0.35 kPa/m
              </p>
            </div>
          </div>

          {/* Excessive head loss warning */}
          {(isLossSevere || isVelocityHigh) && (
            <div className="flex gap-3 bg-red-50 border border-red-100 p-4 rounded-2xl text-red-800 text-xs">
              <Info className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <strong className="font-black">警告：管线压力损失过大或风噪异常！</strong>
                <p className="mt-0.5 text-red-700">
                  {isLossSevere && `单位摩擦梯度为 ${hydraulics.unitPressureDrop.toFixed(3)} kPa/m，大幅超越推荐规范界限（0.35 kPa/m），泵站选型需要较大扬程扬程冗余。`}
                  {isVelocityHigh && ` 另外流体流速 ${hydraulics.velocity.toFixed(2)} m/s 偏高，这极易引发管道水击及磨损噪音。建议增加管道内径。`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Pipe SVG */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex-grow flex flex-col justify-between print:bg-white print:border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-500">
              流体阻力与剪切梯度模拟器
            </span>
            <span className="text-[9px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase print:hidden">
              H-W MODEL ACTIVE
            </span>
          </div>

          {/* SVG representation of pipe */}
          <div className="relative w-full h-[180px] bg-slate-950/80 rounded-2xl border border-slate-850 flex items-center justify-center print:bg-slate-100 print:border-slate-200">
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Pressure gradient: High pressure (blue) -> Low pressure (frictional loss red) */}
                <linearGradient id="pipePressureGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor={isLossSevere ? '#ef4444' : (hydraulics.unitPressureDrop > 0.15 ? '#f97316' : '#22c55e')} />
                </linearGradient>
              </defs>

              {/* Water fluid inside pipe */}
              <rect x="30" y="70" width="340" height="60" fill="url(#pipePressureGradient)" opacity="0.85" rx="3" />

              {/* Fluid particles lines (flowing) */}
              {flowDuration > 0 && (
                <>
                  <path
                    d="M 35 85 L 365 85"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeDasharray="10, 20"
                    style={{
                      animation: `flow ${flowDuration}s linear infinite`,
                      strokeDashoffset: 100
                    }}
                    opacity="0.6"
                  />
                  <path
                    d="M 35 100 L 365 100"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeDasharray="15, 25"
                    style={{
                      animation: `flow ${flowDuration * 0.7}s linear infinite`,
                      strokeDashoffset: 100
                    }}
                    opacity="0.85"
                  />
                  <path
                    d="M 35 115 L 365 115"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeDasharray="10, 20"
                    style={{
                      animation: `flow ${flowDuration}s linear infinite`,
                      strokeDashoffset: 100
                    }}
                    opacity="0.6"
                  />
                </>
              )}

              {/* Solid Pipe Outline */}
              <rect x="30" y="65" width="340" height="70" stroke="#64748b" strokeWidth="4.5" fill="none" rx="5" />

              {/* Dimensions overlays */}
              <text x="200" y="152" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                管道直径 (d): {diameter} mm
              </text>
              
              {/* Pressure labels */}
              <text x="45" y="55" fill="#38bdf8" fontSize="9.5" fontWeight="bold">
                高静压端
              </text>
              <text x="355" y="55" fill={isLossSevere ? '#ef4444' : '#22c55e'} fontSize="9.5" fontWeight="bold" textAnchor="end">
                {isLossSevere ? '高摩擦阻力损失端' : '流阻正常端'}
              </text>
            </svg>
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed mt-4 flex items-start gap-2">
            <Droplets className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>流动物理提示：</strong>流速动画通过管道内流线的移动展示流体的动能变化。管道材质的 C 因子决定管道阻力系数；当管内表面生锈或结垢（如 C 从 150 下滑到 80），管壁边界阻力大幅提升，同流量下的单位摩擦水头损失会以指数倍上涨。
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
