'use client';

import { useState, useMemo } from 'react';
import { HelpCircle, Info, Copy, Check, Shield, Activity, Sliders, Droplets } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

const PIPE_MATERIALS = [
  { name: 'PVC / Plastic (Plastic/PVC)', C: 150, desc: 'The inner wall is extremely smooth and has good corrosion resistance' },
  { name: 'Copper / Stainless Steel (Copper tube/stainless steel tube)', C: 140, desc: 'Very low fluid resistance, often used in hot and cold water pipes' },
  { name: 'Welded Steel (Ordinary welded steel pipe)', C: 120, desc: 'Industrial circulating water, Heating ready' },
  { name: 'New Cast Iron (New cast iron pipe)', C: 100, desc: 'Common in municipal water supply main pipes' },
  { name: 'Old Corroded Cast Iron (Old rusted cast iron pipe)', C: 80, desc: 'Pipe scaling, The inner wall resistance is large'},
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
            <span>Input parameters (Parameters)</span>
          </h2>
        </div>

        {/* Material C Coefficient */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            1. Pipe Material & C-Value
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
            * C factor (Hazen-Williams constant) The larger the value, the smoother the pipe wall. 
          </p>
          <div className="hidden print:block font-bold">
            Material: {material.name} (C = {material.C})
          </div>
        </div>

        {/* Flow Rate */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">2. Design flow (Flow Rate Q)</span>
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
            <span className="text-slate-400 uppercase tracking-wider">3. Actual inner diameter of pipe (Inner Diameter d)</span>
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
            <span className="text-slate-400 uppercase tracking-wider">4. Total physical length of pipe (Length L)</span>
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
              <span>Hydraulics Report</span>
            </h3>
            <button
              onClick={copyToClipboard}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all text-xs font-black flex items-center gap-1.5 border border-slate-200/50 print:hidden"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{copied ? 'Copied' : 'Copy report'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Flow Velocity
              </span>
              <div className={`text-2xl font-black font-mono ${isVelocityHigh ? 'text-amber-600' : 'text-slate-800'}`}>
                {hydraulics.velocity.toFixed(2)} <span className="text-xs text-slate-500 font-sans">m/s</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Gravity water supply recommendation: 0.8 - 1.5 m/s
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Frictional head loss (Static Head Loss)
              </span>
              <div className="text-2xl font-black font-mono text-blue-600">
                {hydraulics.headLoss.toFixed(2)} <span className="text-xs text-slate-500 font-sans">mH₂O</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Corresponding total pressure loss: {hydraulics.pressureDrop.toFixed(1)} kPa
              </p>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Unit Friction Gradient (Unit Loss)
              </span>
              <div className={`text-2xl font-black font-mono ${isLossSevere ? 'text-red-500' : 'text-emerald-600'}`}>
                {hydraulics.unitPressureDrop.toFixed(4)} <span className="text-xs text-slate-500 font-sans">kPa/m</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Comfort limit: &lt; 0.35 kPa/m
              </p>
            </div>
          </div>

          {/* Excessive head loss warning */}
          {(isLossSevere || isVelocityHigh) && (
            <div className="flex gap-3 bg-red-50 border border-red-100 p-4 rounded-2xl text-red-800 text-xs">
              <Info className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <strong className="font-black">Warning: Excessive pipeline pressure loss or abnormal wind noise! </strong>
                <p className="mt-0.5 text-red-700">
                  {isLossSevere && `The unit friction gradient is ${hydraulics.unitPressureDrop.toFixed(3)} kPa/m, which greatly exceeds the recommended specification limit (0.35 kPa/m), and the pump station selection will require a larger head redundancy. `}
                  {isVelocityHigh && ` In addition, the fluid flow rate ${hydraulics.velocity.toFixed(2)} m/s is too high, which can easily cause pipe water hammer and wear noise. It is recommended to increase the inner diameter of the pipe. `}
                </p>
              </div>
            </div>
)}
        </div>

        {/* Dynamic Pipe SVG */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex-grow flex flex-col justify-between print:bg-white print:border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-500">
              Fluid resistance and shear gradient simulator
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
                Pipe diameter (d): {diameter} mm
              </text>
              
              {/* Pressure labels */}
              <text x="45" y="55" fill="#38bdf8" fontSize="9.5" fontWeight="bold">
                High static pressure end
              </text>
              <text x="355" y="55" fill={isLossSevere ? '#ef4444' : '#22c55e'} fontSize="9.5" fontWeight="bold" textAnchor="end">
                {isLossSevere ? 'High Friction Loss' : 'Normal Flow Resistance'}
              </text>
            </svg>
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed mt-4 flex items-start gap-2">
            <Droplets className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Flow Physics Tip: </strong>Flow velocity animation shows the change in kinetic energy of the fluid through the movement of streamlines in the pipe.. The C factor of the pipe material determines the pipe resistance coefficient; When the inner surface of the pipe is rusted or scaled (e.g. C sliding from 150 to 80) , The boundary resistance of the pipe wall increases significantly, and the unit friction head loss under the same flow rate will increase exponentially.. 
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-12 mt-4 print:hidden">
        <RelatedTools />
      </div>
    </div>
);
}
