'use client';

import { useState, useMemo } from 'react';
import { Info, Check, AlertTriangle, Cpu, Wrench } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

const BOLT_SIZES = [
  { name: 'M4', d: 4, As: 8.78 },
  { name: 'M5', d: 5, As: 14.2 },
  { name: 'M6', d: 6, As: 20.1 },
  { name: 'M8', d: 8, As: 36.6 },
  { name: 'M10', d: 10, As: 58.0 },
  { name: 'M12', d: 12, As: 84.3 },
  { name: 'M16', d: 16, As: 157.0 },
  { name: 'M20', d: 20, As: 245.0 },
  { name: 'M24', d: 24, As: 353.0 },
  { name: 'M30', d: 30, As: 561.0 },
];

const BOLT_GRADES = [
  { name: 'Grade 4.8 (Ordinary carbon steel)', yield: 320, tensile: 400 },
  { name: 'Grade 5.8 (Low carbon alloy steel)', yield: 400, tensile: 500 },
  { name: 'Grade 8.8 (High strength medium carbon steel)', yield: 640, tensile: 800 },
  { name: 'Grade 10.9 (Alloy steel quenched and tempered)', yield: 900, tensile: 1000 },
  { name: 'Grade 12.9 (Ultra-high strength alloy steel)', yield: 1080, tensile: 1200 },
];

const FRICTION_COEFFICIENTS = [
  { name: 'Dry Steel (Dry non-lubricated steel surface)', K: 0.20 },
  { name: 'Lubricated Oil (Oil lubrication)', K: 0.15},
  { name: 'Zinc Plated (Galvanized anti-corrosion surface)', K: 0.18 },
  { name: 'PTFE / MoS2 (Teflon/molybdenum disulfide dry film lubrication)', K: 0.10 },
];

export default function BoltTorqueClient() {
  const [boltIdx, setBoltIdx] = useState(5); // M12
  const [gradeIdx, setGradeIdx] = useState(2); // 8.8
  const [frictionIdx, setFrictionIdx] = useState(1); // Oil lubricated
  const [preloadRatio, setPreloadRatio] = useState(75); // % of yield
  const [copied, setCopied] = useState(false);

  const bolt = useMemo(() => BOLT_SIZES[boltIdx], [boltIdx]);
  const grade = useMemo(() => BOLT_GRADES[gradeIdx], [gradeIdx]);
  const friction = useMemo(() => FRICTION_COEFFICIENTS[frictionIdx], [frictionIdx]);

  // Calculations (F in kN, T in N·m)
  const results = useMemo(() => {
    const As = bolt.As; // mm²
    const yieldStrength = grade.yield; // MPa (N/mm²)
    const K = friction.K;
    const d = bolt.d; // mm

    // Max capacity load at yield (N)
    const yieldLoad = As * yieldStrength;
    
    // Target tension preload (N)
    const preloadForce = yieldLoad * (preloadRatio / 100);

    // Tightening torque (N·mm) -> convert to N·m: T = K * F * d / 1000
    // F in N, d in mm, T in N·mm. Divided by 1000 gives N·m.
    const torque = (K * preloadForce * d) / 1000;

    return {
      As,
      yieldLoad: yieldLoad / 1000, // kN
      preloadForce: preloadForce / 1000, // kN
      torque, // N·m
    };
  }, [bolt, grade, friction, preloadRatio]);

  const copyToClipboard = () => {
    const text = `--- Bolt Tightening Design Report ---
Bolt Size: ${bolt.name} (d = ${bolt.d} mm)
Strength Grade: ${grade.name}
Friction Surface: ${friction.name} (K = ${friction.K})
Preload Target: ${preloadRatio}% of yield limit
Thread Stress Area (As): ${results.As} mm²
Material Yield Limit: ${grade.yield} MPa
Yield Load Limit: ${results.yieldLoad.toFixed(2)} kN
Required Preload Tension (F): ${results.preloadForce.toFixed(2)} kN
Required Tightening Torque (T): ${results.torque.toFixed(2)} N·m
Generated via CADGuide.tools`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isYieldDanger = preloadRatio >= 90;
  const isYieldWarning = preloadRatio >= 80 && preloadRatio < 90;

  // Bolt physical elongation animation offset based on preload tension ratio
  const animStretching = useMemo(() => {
    const ratio = preloadRatio / 100;
    // Stretch scale between 1 and 1.05
    return 1 + (ratio * 0.05);
  }, [preloadRatio]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
      {/* Parameters Panel */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-6 print:bg-white print:text-black print:border-none print:shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-400" />
            <span>Fastening parameter design (Inputs)</span>
          </h2>
        </div>

        {/* Bolt size selection */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            1. Bolt Size
          </label>
          <select
            value={boltIdx}
            onChange={(e) => setBoltIdx(Number(e.target.value))}
            className="w-full bg-slate-850 border border-slate-850 rounded-xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none print:hidden"
          >
            {BOLT_SIZES.map((b, i) => (
              <option key={b.name} value={i}>
                {b.name} (Nominal diameter: {b.d} mm / stress area: {b.As} mm²)
              </option>
))}
          </select>
          <div className="hidden print:block font-bold">
            Bolt specification: {bolt.name}
          </div>
        </div>

        {/* Strength Class */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            2. Bolt Grade
          </label>
          <select
            value={gradeIdx}
            onChange={(e) => setGradeIdx(Number(e.target.value))}
            className="w-full bg-slate-850 border border-slate-850 rounded-xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none print:hidden"
          >
            {BOLT_GRADES.map((g, i) => (
              <option key={g.name} value={i}>
                {g.name} (Yield strength: {g.yield} MPa)
              </option>
))}
          </select>
          <div className="hidden print:block font-bold">
            Property Class: {grade.name}
          </div>
        </div>

        {/* Friction / Surface condition */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            3. Assembly surface friction condition (Friction Condition)
          </label>
          <select
            value={frictionIdx}
            onChange={(e) => setFrictionIdx(Number(e.target.value))}
            className="w-full bg-slate-850 border border-slate-850 rounded-xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none print:hidden"
          >
            {FRICTION_COEFFICIENTS.map((f, i) => (
              <option key={f.name} value={i}>
                {f.name} (K = {f.K})
              </option>
))}
          </select>
          <div className="hidden print:block font-bold">
            Friction coefficient (K): {friction.K}
          </div>
        </div>

        {/* Preload ratio */}
        <div className="space-y-3 border-t border-slate-800/80 pt-5">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">4. Set tension ratio (Preload Rate)</span>
            <span className={`${isYieldDanger ? 'text-red-400' : (isYieldWarning ? 'text-amber-400' : 'text-blue-400')} font-mono`}>
              {preloadRatio}% (Yield limit)
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="1"
            value={preloadRatio}
            onChange={(e) => setPreloadRatio(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
          <p className="text-[10px] text-slate-500">
            * Mechanical engineering industry standard installation recommendations are 70% to 85% yield limit. 
          </p>
        </div>
      </div>

      {/* Right Outputs Panel */}
      <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
        {/* Results */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-md font-black text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              <span>Bolt anti-loosening fastening mechanics report</span>
            </h3>
            <button
              onClick={copyToClipboard}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all text-xs font-black flex items-center gap-1.5 border border-slate-200/50 print:hidden"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{copied ? 'Copied' : 'Copy data'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Target tightening torque (Torque T)
              </span>
              <div className="text-2xl font-black font-mono text-blue-600">
                {results.torque.toFixed(2)} <span className="text-xs text-slate-500 font-sans">N·m</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Torque wrench setting target value
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Required preload force (Preload Force F)
              </span>
              <div className="text-2xl font-black font-mono text-slate-800">
                {results.preloadForce.toFixed(2)} <span className="text-xs text-slate-500 font-sans">kN</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Bolt tension tensile force
              </p>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                ultimate yield bearing capacity
              </span>
              <div className="text-2xl font-black font-mono text-slate-700">
                {results.yieldLoad.toFixed(1)} <span className="text-xs text-slate-500 font-sans">kN</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Material tensile yield threshold
              </p>
            </div>
          </div>

          {/* Yield warnings */}
          {isYieldDanger && (
            <div className="flex gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl text-red-800 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <strong className="font-black">Bolt Yield Danger! </strong>
                <p className="mt-0.5 text-red-700 font-medium">
                  The tension preload force has reached {preloadRatio}%. When bearing the external dynamic load at work, (vibration or tension), Bolts are prone to permanent plastic elongation (necking) Causes preload force to collapse, or direct shearing/Tensile breaking. 
                </p>
              </div>
            </div>
)}

          {isYieldWarning && !isYieldDanger && (
            <div className="flex gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-xs">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="font-black">Critical Overload Warning (Overload Risk)</strong>
                <p className="mt-0.5 text-amber-700">
                  The preload is too high (already at the yield limit) {preloadRatio}% ). If the torque control accuracy is poor during assembly, Easy to yield locally, it is recommended to lower the assembly preload percentage.. 
                </p>
              </div>
            </div>
)}
        </div>

        {/* Bolt stress visualizer */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex-grow flex flex-col justify-between print:bg-white print:border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-500">
              Fastening pair force tensile simulator
            </span>
          </div>

          {/* SVG Frame */}
          <div className="relative w-full h-[180px] bg-slate-950/80 rounded-2xl border border-slate-850 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Clamping plates */}
              <rect x="140" y="70" width="120" height="25" fill="#334155" stroke="#475569" strokeWidth="1.5" />
              <rect x="140" y="95" width="120" height="25" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />

              {/* Bolt parts: Nut at top (fixed) */}
              <rect x="175" y="45" width="50" height="25" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
              
              {/* Bolt thread shank (stretching animation) */}
              {/* If yielding, we shrink width slightly to show necking and color shifts to red */}
              <g transform={`translate(200, 70) scale(${isYieldDanger ? 0.92 : 1}, ${animStretching}) translate(-200, -70)`}>
                <rect
                  x="188"
                  y="70"
                  width="24"
                  height="50"
                  fill={isYieldDanger ? '#ef4444' : (isYieldWarning ? '#f97316' : '#38bdf8')}
                  stroke={isYieldDanger ? '#b91c1c' : '#475569'}
                  strokeWidth="1.5"
                />
                
                {/* Thread spirals */}
                <line x1="188" y1="80" x2="212" y2="84" stroke="#475569" strokeWidth="1.5" />
                <line x1="188" y1="90" x2="212" y2="94" stroke="#475569" strokeWidth="1.5" />
                <line x1="188" y1="100" x2="212" y2="104" stroke="#475569" strokeWidth="1.5" />
                <line x1="188" y1="110" x2="212" y2="114" stroke="#475569" strokeWidth="1.5" />
              </g>

              {/* Bottom Bolt Head */}
              <g transform={`translate(0, ${(animStretching - 1) * 50})`}>
                <rect x="175" y="120" width="50" height="22" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
              </g>

              {/* Tensile Preload Force Arrows */}
              <g stroke={isYieldDanger ? '#f87171' : '#60a5fa'} strokeWidth="2.5" fill="none">
                {/* Upper Arrow pulling down on nut */}
                <path d="M 200 20 L 200 40 M 195 35 L 200 40 L 205 35" />
                {/* Lower Arrow pulling up on bolt head */}
                <path d="M 200 175 L 200 150 M 195 155 L 200 150 L 205 155" />
              </g>
              
              <text x="235" y="32" fill="#60a5fa" fontSize="9" fontWeight="bold">F (Tension)</text>
              <text x="235" y="172" fill="#60a5fa" fontSize="9" fontWeight="bold">F (Preload)</text>

              {/* Elongation Label if stretching */}
              {preloadRatio > 20 && (
                <text x="285" y="105" fill={isYieldDanger ? '#ef4444' : '#64748b'} fontSize="9.5" fontWeight="bold">
                  {isYieldDanger ? 'Bolt necking deformation': 'Small elastic tension'}
                </text>
)}
            </svg>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed mt-4 print:text-slate-650">
            * Simulation description: The tension arrow represents the tension pre-tightening inside the bolt.. The blue/orange rod in the middle of the bolt changes with the slider to simulate real metal tensile elongation.. When entering the limit area of more than 90%, The member is drawn with a pronounced tapering (necking simulation) To warn of the risk of plastic damage. 
          </p>
        </div>
      </div>

      <div className="lg:col-span-12 mt-4 print:hidden">
        <RelatedTools />
      </div>
    </div>
);
}
