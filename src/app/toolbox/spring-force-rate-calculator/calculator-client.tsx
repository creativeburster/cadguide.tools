'use client';

import { useState, useMemo } from 'react';
import { HelpCircle, Info, Copy, Check, Shield, AlertTriangle, Layers, Percent } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

const SPRING_MATERIALS = [
  { name: 'Music Wire / ASTM A228 (High frequency spring piano wire)', G: 78500, desc: 'The best choice for manufacturing small diameter high precision springs, Extremely high tensile strength'},
  { name: 'Carbon Steel / ASTM A229 (Carbon spring steel wire)', G: 79300, desc: 'The most common industrial spring steel material' },
  { name: 'Stainless 302 / ASTM A313 (Stainless steel spring wire)', G: 69000, desc: 'Acid and alkali resistant, Anti-corrosion, stable performance in wet conditions' },
  { name: 'Phosphor Bronze / ASTM B159 (Phosphor bronze wire)', G: 41000, desc: 'Commonly used in electronic instrument springs with conductive performance requirements' },
];

export default function SpringForceClient() {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [wireDiameter, setWireDiameter] = useState(2.0); // d in mm
  const [outerDiameter, setOuterDiameter] = useState(20.0); // D_out in mm
  const [activeCoils, setActiveCoils] = useState(10); // n
  const [freeHeight, setFreeHeight] = useState(80); // Hf in mm
  const [deflection, setDeflection] = useState(15); // s in mm
  const [copied, setCopied] = useState(false);

  const material = useMemo(() => SPRING_MATERIALS[materialIdx], [materialIdx]);

  // Compute Spring Calculations
  const spring = useMemo(() => {
    const d = wireDiameter;
    const D_out = outerDiameter;
    const n = activeCoils;
    const Hf = freeHeight;
    const G = material.G;

    // Mean Diameter: D = D_out - d
    const D = D_out - d;

    // Spring Index: C = D / d
    const C = d > 0 ? D / d : 0;

    // Spring Rate (Stiffness): k = G * d^4 / (8 * D^3 * n) (N/mm)
    let rate = 0;
    if (D > 0 && n > 0 && d > 0) {
      rate = (G * Math.pow(d, 4)) / (8 * Math.pow(D, 3) * n);
    }

    // Total Coils: Nt = n + 2 (squared and ground ends)
    const totalCoils = n + 2;

    // Solid Height: Hs = d * Nt
    const solidHeight = d * totalCoils;

    // Max Deflection: s_max = Hf - Hs
    const maxDeflection = Math.max(0, Hf - solidHeight);

    // Dynamic clamped deflection s (clamped within [0, s_max])
    const s = Math.min(maxDeflection, deflection);

    // Spring Force: F = k * s (N)
    const force = rate * s;

    // Wahl stress correction factor: Kw = (4C - 1)/(4C - 4) + 0.615/C
    let Kw = 1.0;
    if (C > 1) {
      Kw = ((4 * C - 1) / (4 * C - 4)) + (0.615 / C);
    }

    // Shear Stress: tau = Kw * 8 * F * D / (pi * d^3) (MPa or N/mm²)
    let shearStress = 0;
    if (d > 0 && D > 0) {
      shearStress = Kw * (8 * force * D) / (Math.PI * Math.pow(d, 3));
    }

    // Allowable Shear Stress estimation (usually ~45% of tensile limit. For standard wire, let's estimate 650 MPa)
    const maxAllowableStress = 650; 
    const stressRatio = (shearStress / maxAllowableStress) * 100;

    return {
      meanDiameter: D,
      springIndex: C,
      rate, // N/mm
      solidHeight, // mm
      maxDeflection, // mm
      force, // N
      shearStress, // MPa
      stressRatio, // %
    };
  }, [wireDiameter, outerDiameter, activeCoils, freeHeight, deflection, material]);

  const copyToClipboard = () => {
    const text = `--- Helical Compression Spring Design ---
Wire Material: ${material.name} (G = ${material.G} MPa)
Wire Diameter (d): ${wireDiameter} mm
Outer Diameter (D_out): ${outerDiameter} mm
Mean Coil Diameter (D): ${spring.meanDiameter.toFixed(2)} mm
Spring Index (C): ${spring.springIndex.toFixed(2)}
Active Coils (n): ${activeCoils}
Total Coils: ${activeCoils + 2}
Spring Free Height (Hf): ${freeHeight} mm
Solid Height (Hs): ${spring.solidHeight.toFixed(1)} mm
Max Safe Travel (s_max): ${spring.maxDeflection.toFixed(2)} mm
Spring Stiffness (k): ${spring.rate.toFixed(3)} N/mm
Deflection Travel (s): ${deflection} mm
Reactive Spring Force (F): ${spring.force.toFixed(2)} N
Torsional Shear Stress (tau): ${spring.shearStress.toFixed(1)} MPa
Material Stress Limit Ratio: ${spring.stressRatio.toFixed(1)}%
Generated via CADGuide.tools`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSolidExceeded = deflection >= spring.maxDeflection;
  const isStressDanger = spring.stressRatio >= 100;
  const isIndexWarn = spring.springIndex < 4 || spring.springIndex > 12;

  // Spring height visual ratio
  const springVisualHeight = useMemo(() => {
    const clampedDeflection = Math.min(deflection, spring.maxDeflection);
    const h = freeHeight - clampedDeflection;
    // Map spring height (solidHeight to freeHeight) to SVG px height (50 to 150)
    const range = freeHeight - spring.solidHeight || 1;
    const ratio = (h - spring.solidHeight) / range;
    return 50 + ratio * 100;
  }, [deflection, freeHeight, spring]);

  // Spring coil path builder
  const springCoilPath = useMemo(() => {
    const h = springVisualHeight;
    const w = outerDiameter * 1.5; // Visual scale width
    const coils = activeCoils;

    let path = `M 200 ${180 - h} L ${200 + w / 2} ${180 - h + 8}`;
    const step = (h - 16) / (coils * 2);
    for (let i = 0; i < coils * 2; i++) {
      const isRight = i % 2 === 0;
      const x = isRight ? 200 - w / 2 : 200 + w / 2;
      const y = 180 - h + 8 + (i + 1) * step;
      path += ` L ${x} ${y}`;
    }
    path += ` L 200 180`;
    return path;
  }, [springVisualHeight, outerDiameter, activeCoils]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
      {/* Parameters Panel */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-5 print:bg-white print:text-black print:border-none print:shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Spring design size setting</span>
          </h2>
        </div>

        {/* G Modulus Preset */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            1. Spring wire material modulus (Wire Material)
          </label>
          <select
            value={materialIdx}
            onChange={(e) => setMaterialIdx(Number(e.target.value))}
            className="w-full bg-slate-850 border border-slate-850 rounded-xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none print:hidden"
          >
            {SPRING_MATERIALS.map((sm, i) => (
              <option key={sm.name} value={i}>
                {sm.name} (G={sm.G} MPa)
              </option>
))}
          </select>
          <div className="hidden print:block font-bold">
            Wire material: {material.name} (G = {material.G} MPa)
          </div>
        </div>

        {/* Wire Diameter */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">2. Wire Diam. d</span>
            <span className="text-blue-400 font-mono">{wireDiameter} mm</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="12.0"
            step="0.1"
            value={wireDiameter}
            onChange={(e) => setWireDiameter(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
        </div>

        {/* Outer Diameter */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">3. Spring outer diameter (Outer Diam. D_out)</span>
            <span className="text-blue-400 font-mono">{outerDiameter} mm</span>
          </div>
          <input
            type="range"
            min={Math.max(5, wireDiameter * 1.5)}
            max="120"
            step="1"
            value={outerDiameter}
            onChange={(e) => setOuterDiameter(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
        </div>

        {/* Active Coils */}
        <div className="space-y-2.5 border-t border-slate-800/80 pt-4">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">4. Effective number of spring coils (Coils n)</span>
            <span className="text-blue-400 font-mono">{activeCoils} circle</span>
          </div>
          <input
            type="range"
            min="3"
            max="30"
            step="1"
            value={activeCoils}
            onChange={(e) => setActiveCoils(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
        </div>

        {/* Free Height */}
        <div className="space-y-2.5 border-t border-slate-800/80 pt-4">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">5. Spring Free Height (Free Height Hf)</span>
            <span className="text-blue-400 font-mono">{freeHeight} mm</span>
          </div>
          <input
            type="range"
            min="10"
            max="300"
            step="2"
            value={freeHeight}
            onChange={(e) => setFreeHeight(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
        </div>

        {/* Deflection displacement */}
        <div className="space-y-2.5 border-t border-slate-800/80 pt-4">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">6. Assembly compression displacement (Deflection s)</span>
            <span className="text-amber-400 font-mono">{deflection} mm</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.ceil(spring.maxDeflection) || 10}
            step="1"
            value={deflection}
            onChange={(e) => setDeflection(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
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
              <span>Compression Spring Mechanical Verdict</span>
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
                Compression elastic recovery (Load Force)
              </span>
              <div className="text-2xl font-black font-mono text-blue-600">
                {spring.force.toFixed(2)} <span className="text-xs text-slate-500 font-sans">N</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Equivalent to: {(spring.force / 9.81).toFixed(2)} kg gravity
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Spring stiffness coefficient (Stiffness)
              </span>
              <div className="text-2xl font-black font-mono text-slate-800">
                {spring.rate.toFixed(3)} <span className="text-xs text-slate-500 font-sans">N/mm</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Required force for each 1mm press
              </p>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Solid Height
              </span>
              <div className="text-2xl font-black font-mono text-slate-700">
                {spring.solidHeight.toFixed(1)} <span className="text-xs text-slate-500 font-sans">mm</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Limit displacement: {spring.maxDeflection.toFixed(1)} mm
              </p>
            </div>
          </div>

          {/* Indices warnings */}
          {isSolidExceeded && (
            <div className="flex gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl text-red-800 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <strong className="font-black">Spring completely compacted failure (Solid Height Reached)! </strong>
                <p className="mt-0.5 text-red-700">
                  The current compression stroke has reached the limit displacement ({spring.maxDeflection.toFixed(1)} mm). The spring coils are in close contact with each other., All elastic travel buffering capabilities have been lost, and continued pressure will act as a rigid force on the steel column.. 
                </p>
              </div>
            </div>
)}

          {isIndexWarn && (
            <div className="flex gap-3 bg-amber-50 border border-amber-250 p-4 rounded-2xl text-amber-800 text-xs">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="font-black">Spring Index Warning</strong>
                <p className="mt-0.5 text-amber-700">
                  The current spin ratio (D/d) is {spring.springIndex.toFixed(1)}. Mechanical engineering standards specify that the convolution ratio should be between 4 and 12 between. 
                  {spring.springIndex < 4 && ' If the winding ratio is too small, it means that the spring coil is too tight and the bending stress of the steel wire is too large., Extremely difficult to roll and manufacture. '}
                  {spring.springIndex > 12 && ' If the winding ratio is too large, it means that the ring diameter is too loose, and the spring will tend to tilt during operation., It is easy to cause instability and distortion when compressed. '}
                </p>
              </div>
            </div>
)}
        </div>

        {/* Dynamic Spring SVG */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex-grow flex flex-col justify-between print:bg-white print:border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-500">
              Physical spring compression geometry section preview (Deflection Simulator)
            </span>
          </div>

          {/* SVG Frame */}
          <div className="relative w-full h-[220px] bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Top Support Platform */}
              <rect x="100" y="20" width="200" height="10" fill="#334155" stroke="#475569" strokeWidth="1.5" />
              
              {/* Moving bottom base platform (representing deflection displacement) */}
              {/* Top platform is actually moving in a real press. We make the top base move down. */}
              {/* Spring height from bottom line (180) upwards. Top of spring is at 180 - visualHeight. */}
              <g transform={`translate(0, ${180 - springVisualHeight - 30})`}>
                <rect x="100" y="20" width="200" height="10" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
                
                {/* Arrow representing downward displacement */}
                <path d="M 200 0 L 200 15 M 195 10 L 200 15 L 205 10" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                <text x="220" y="10" fill="#f59e0b" fontSize="8.5" fontWeight="bold">Compression stroke: {deflection} mm</text>
              </g>

              {/* Spring coils path */}
              <path
                d={springCoilPath}
                fill="none"
                stroke={isSolidExceeded ? '#ef4444' : (isStressDanger ? '#f97316' : '#60a5fa')}
                strokeWidth={Math.max(2, wireDiameter * 1.8)}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Bottom Support Platform (ground) */}
              <rect x="100" y="180" width="200" height="10" fill="#334155" stroke="#475569" strokeWidth="1.5" />

              {/* Stress color scale indicator */}
              <text x="380" y="180" fill="#94a3b8" fontSize="8.5" textAnchor="end">
                Shear stress: {spring.shearStress.toFixed(1)} MPa
              </text>
            </svg>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed mt-4 print:text-slate-655">
            * Physical simulation: The spring spiral is recalculated in real time based on the relationship between free height and actual displacement.. The physical gathering of the circle distance vividly demonstrates the enrichment of stiffness reaction and stress. When the stress exceeds the limit, The wire spiral is red (safety hazard area) . 
          </p>
        </div>
      </div>

      <div className="lg:col-span-12 mt-4 print:hidden">
        <RelatedTools />
      </div>
    </div>
);
}
