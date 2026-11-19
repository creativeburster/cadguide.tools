'use client';

import { useState, useMemo } from 'react';
import { Info, Check, AlertTriangle, Layers, Percent, RotateCcw, Download, Copy } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

const SPRING_MODULUS_PRESETS = [
  { id: 'steel', label: 'Spring Steel (G = 79,300 MPa)', G: '79300', desc: 'Common high-carbon spring steel wire shear modulus' },
  { id: 'stainless', label: 'Stainless Wire (G = 69,000 MPa)', G: '69000', desc: 'Corrosion-resistant chromium-nickel stainless spring wire' },
  { id: 'bronze', label: 'Phosphor Bronze (G = 41,000 MPa)', G: '41000', desc: 'Non-magnetic copper alloy spring wire' },
];

const GRAVITY_MPS2 = 9.80665;

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function buildSpringCoilPath(numVisualCoils: number, visualHeight: number, centerX: number, bottomY: number, halfWidth: number): string {
  const stepY = visualHeight / numVisualCoils;
  const parts: string[] = [`M ${centerX - halfWidth} ${bottomY}`];
  for (let i = 0; i < numVisualCoils; i++) {
    const yStart = bottomY - i * stepY;
    const yMid = yStart - stepY / 2;
    const yEnd = yStart - stepY;
    parts.push(`L ${centerX + halfWidth} ${yMid.toFixed(2)}`);
    parts.push(`L ${centerX - halfWidth} ${yEnd.toFixed(2)}`);
  }
  return parts.join(' ');
}

const DEFAULT_INPUTS = ['2.0', '20.0', '10', '80', '15', '79300', '650'];

export default function SpringForceClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);
  const [copied, setCopied] = useState(false);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const d = parseFinite(inputs[0]);
    const od = parseFinite(inputs[1]);
    const na = parseFinite(inputs[2]);
    const l0 = parseFinite(inputs[3]);
    const delta = parseFinite(inputs[4]);
    const gMpa = parseFinite(inputs[5]);
    const tauAllow = parseFinite(inputs[6]);

    if (d === null || od === null || na === null || l0 === null || delta === null || gMpa === null || tauAllow === null) {
      return { valid: false as const, error: 'Enter numeric values in all compression spring geometry, modulus, and allowable stress fields.' };
    }
    if (d <= 0 || od <= 2 * d || na <= 0 || l0 <= 0 || delta < 0 || gMpa <= 0 || tauAllow <= 0) {
      return { valid: false as const, error: 'Require d > 0, OD > 2*d (C = D/d > 1), active coils Na > 0, L0 > 0, delta >= 0, G > 0, tau_allow > 0.' };
    }

    const D = od - d;
    const C = D / d;
    const rate = (gMpa * Math.pow(d, 4)) / (8 * Math.pow(D, 3) * na);
    const totalCoils = na + 2;
    const solidHeight = d * totalCoils;
    const maxDeflection = Math.max(0, l0 - solidHeight);
    const s = Math.min(maxDeflection, delta);
    const force = rate * s;
    const forceKgf = force / GRAVITY_MPS2;
    const Kw = (4 * C - 1) / (4 * C - 4) + 0.615 / C;
    const shearStress = Kw * (8 * force * D) / (Math.PI * Math.pow(d, 3));
    const stressRatio = (shearStress / tauAllow) * 100;

    const currentHeight = Math.max(solidHeight, l0 - s);
    const ratio = l0 > 0 ? currentHeight / l0 : 1;
    const visualHeight = Math.max(40, Math.min(130, 130 * ratio));
    const displayCoils = Math.min(Math.max(4, Math.round(na)), 16);
    const coilPath = buildSpringCoilPath(displayCoils, visualHeight, 200, 180, 48);

    return {
      valid: true as const,
      d,
      od,
      na,
      l0,
      delta,
      gMpa,
      tauAllow,
      D,
      C,
      rate,
      totalCoils,
      solidHeight,
      maxDeflection,
      s,
      force,
      forceKgf,
      Kw,
      shearStress,
      stressRatio,
      visualHeight,
      coilPath,
      isSolidExceeded: delta > maxDeflection,
      isIndexWarn: C < 4 || C > 12,
      isStressDanger: stressRatio > 100,
    };
  }, [inputs]);

  const copyToClipboard = () => {
    if (!result.valid) return;
    const text = [
      'Helical Compression Spring Design Report',
      `Wire Diameter d: ${result.d} mm`,
      `Outer Diameter OD: ${result.od} mm`,
      `Mean Coil Diameter D: ${result.D.toFixed(3)} mm`,
      `Spring Index C: ${result.C.toFixed(3)}`,
      `Active Coils Na: ${result.na} (Total ${result.totalCoils})`,
      `Shear Modulus G: ${result.gMpa} MPa`,
      `Spring Rate k: ${result.rate.toFixed(6)} N/mm`,
      `Solid Height Hs: ${result.solidHeight.toFixed(3)} mm (Max Travel s_max: ${result.maxDeflection.toFixed(3)} mm)`,
      `Force at s=${result.s.toFixed(2)} mm: ${result.force.toFixed(6)} N (${result.forceKgf.toFixed(6)} kgf)`,
      `Wahl Factor Kw: ${result.Kw.toFixed(6)}, Shear Stress tau: ${result.shearStress.toFixed(6)} MPa (${result.stressRatio.toFixed(2)}% of ${result.tauAllow} MPa)`,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Helical Compression Spring Force, Stiffness & Wahl Stress Report',
      '# Formulas: k = G*d^4/(8*D^3*Na), F = k*s, Kw = (4C-1)/(4C-4)+0.615/C, tau = Kw*8*F*D/(pi*d^3), g = 9.80665 m/s2',
      'Parameter,Value,Unit',
      `Wire Diameter d,${result.d},mm`,
      `Outer Diameter OD,${result.od},mm`,
      `Mean Coil Diameter D,${result.D.toFixed(6)},mm`,
      `Spring Index C,${result.C.toFixed(6)},-`,
      `Active Coils Na,${result.na},coils`,
      `Free Height L0,${result.l0},mm`,
      `Requested Deflection delta,${result.delta},mm`,
      `Effective Deflection s,${result.s.toFixed(6)},mm`,
      `Shear Modulus G,${result.gMpa},MPa`,
      `Allowable Shear Stress tau_allow,${result.tauAllow},MPa`,
      `Spring Stiffness k,${result.rate.toFixed(6)},N/mm`,
      `Solid Height Hs,${result.solidHeight.toFixed(6)},mm`,
      `Max Travel s_max,${result.maxDeflection.toFixed(6)},mm`,
      `Axial Force F,${result.force.toFixed(6)},N`,
      `Gravity Equivalent Force,${result.forceKgf.toFixed(6)},kgf`,
      `Wahl Factor Kw,${result.Kw.toFixed(6)},-`,
      `Corrected Shear Stress tau,${result.shearStress.toFixed(6)},MPa`,
      `Stress Utilization Ratio,${result.stressRatio.toFixed(6)},%`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spring-force-rate-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5 print:border-slate-300">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest">
            <Layers className="w-4 h-4" />
            <span>Spring Geometry &amp; Modulus</span>
          </div>
          <button
            type="button"
            data-testid="btn-reset"
            onClick={() => setInputs(DEFAULT_INPUTS)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Shear Modulus G Presets</label>
          <div className="flex flex-wrap gap-1.5">
            {SPRING_MODULUS_PRESETS.map(p => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => updateInput(5, p.G)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                  inputs[5] === p.G
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Wire Diameter d (mm)</label>
            <input type="text" data-testid="input-d" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Outer Diameter OD (mm)</label>
            <input type="text" data-testid="input-od" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Active Coils Na (-)</label>
            <input type="text" data-testid="input-na" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Free Height L0 (mm)</label>
            <input type="text" data-testid="input-l0" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Compression &delta; (mm)</label>
            <input type="text" data-testid="input-delta" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Shear Modulus G (MPa)</label>
            <input type="text" data-testid="input-g" value={inputs[5]} onChange={e => updateInput(5, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">User Allowable Shear Stress &tau;_allow (MPa)</label>
            <input type="text" data-testid="input-tau-allow" value={inputs[6]} onChange={e => updateInput(6, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <h3 className="text-md font-black text-slate-900 flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-500" />
              <span>Compression Spring Mechanical Verdict</span>
            </h3>
            <div className="flex items-center gap-2 print:hidden">
              <button
                type="button"
                data-testid="copy-btn"
                onClick={copyToClipboard}
                disabled={!result.valid}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white disabled:opacity-40 transition-all text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={downloadCsv}
                disabled={!result.valid}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {!result.valid && (
            <div data-testid="validation-msg" className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
              {result.error}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <span className="text-xs text-blue-600 font-black uppercase tracking-wider block">Load Force F</span>
              <div data-testid="output-force" className="text-xl font-black font-mono text-blue-900 mt-1">
                {result.valid ? result.force.toFixed(3) : '—'} <span className="text-xs font-sans">N</span>
              </div>
              <div data-testid="output-kgf" className="text-xs text-blue-600 font-bold mt-1">
                {result.valid ? `${result.forceKgf.toFixed(3)} kgf` : '—'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <span className="text-xs text-slate-500 font-black uppercase tracking-wider block">Spring Rate k</span>
              <div data-testid="output-rate" className="text-xl font-black font-mono text-slate-900 mt-1">
                {result.valid ? result.rate.toFixed(3) : '—'} <span className="text-xs font-sans">N/mm</span>
              </div>
              <div data-testid="output-index" className="text-xs text-slate-500 font-bold mt-1">
                C = {result.valid ? result.C.toFixed(3) : '—'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <span className="text-xs text-slate-500 font-black uppercase tracking-wider block">Solid Height Hs</span>
              <div data-testid="output-hs" className="text-xl font-black font-mono text-slate-900 mt-1">
                {result.valid ? result.solidHeight.toFixed(2) : '—'} <span className="text-xs font-sans">mm</span>
              </div>
              <div data-testid="output-smax" className="text-xs text-slate-500 font-bold mt-1">
                s_max = {result.valid ? `${result.maxDeflection.toFixed(2)} mm` : '—'}
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
              <span className="text-xs text-orange-600 font-black uppercase tracking-wider block">Shear Stress &tau;</span>
              <div data-testid="output-tau" className="text-xl font-black font-mono text-orange-900 mt-1">
                {result.valid ? result.shearStress.toFixed(2) : '—'} <span className="text-xs font-sans">MPa</span>
              </div>
              <div data-testid="output-ratio" className="text-xs text-orange-700 font-bold mt-1">
                {result.valid ? `${result.stressRatio.toFixed(2)}%` : '—'}
              </div>
            </div>
          </div>

          {result.valid && (
            <div className="text-xs font-bold text-slate-500">
              Mean Coil Diameter D = <span data-testid="output-dmean" className="text-slate-800">{result.D.toFixed(2)} mm</span> &middot; Wahl Factor Kw = {result.Kw.toFixed(4)}
            </div>
          )}

          {result.valid && result.isSolidExceeded && (
            <div className="flex gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl text-red-800 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <strong className="font-black">Solid Height Reached: </strong>
                Requested travel ({result.delta} mm) exceeds maximum free travel ({result.maxDeflection.toFixed(2)} mm). Force and stress are evaluated at solid deflection s = {result.s.toFixed(2)} mm.
              </div>
            </div>
          )}

          {result.valid && result.isIndexWarn && (
            <div className="flex gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-sm">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="font-black">Spring Index Note: </strong>
                Spring index C = D/d is {result.C.toFixed(2)}. Typical helical springs operate cleanly in the C = 4 to 12 geometric range.
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Physical Spring Compression Geometry Preview
            </span>
          </div>

          <div className="relative w-full h-[220px] bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="100" y="20" width="200" height="10" fill="#334155" stroke="#475569" strokeWidth="1.5" />
              {result.valid && (
                <>
                  <g transform={`translate(0, ${180 - result.visualHeight - 30})`}>
                    <rect x="100" y="20" width="200" height="10" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
                    <path d="M 200 0 L 200 15 M 195 10 L 200 15 L 205 10" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                    <text x="215" y="12" fill="#f59e0b" fontSize="9" fontWeight="bold">
                      Stroke: {result.s.toFixed(1)} mm
                    </text>
                  </g>
                  <path
                    d={result.coilPath}
                    fill="none"
                    stroke={result.isSolidExceeded ? '#ef4444' : (result.isStressDanger ? '#f97316' : '#60a5fa')}
                    strokeWidth={Math.max(2, Math.min(8, result.d * 1.8))}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <text x="380" y="172" fill="#94a3b8" fontSize="9" textAnchor="end">
                    Shear stress: {result.shearStress.toFixed(1)} MPa
                  </text>
                </>
              )}
              <rect x="100" y="180" width="200" height="10" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            </svg>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mt-3">
            Torsion coil spring mechanics (Wikipedia:{' '}
            <a href="https://en.wikipedia.org/wiki/Coil_spring" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
              Coil spring
            </a>
            ). Adjust G and allowable shear stress &tau;_allow to match your selected spring wire grade datasheet.
          </p>
        </div>

        <div className="print:hidden">
          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
