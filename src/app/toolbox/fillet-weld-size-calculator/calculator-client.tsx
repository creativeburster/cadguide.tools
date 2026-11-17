'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'default', label: 'Default (6 mm, Lw=200 mm, E70XX 485 MPa, 120 kN)', w: '6', lw: '200', fexx: '485', f: '120', phi: '0.75', omega: '2.00' },
  { id: 'heavy-shear', label: 'Heavy Joint (10 mm, Lw=300 mm, 350 kN)', w: '10', lw: '300', fexx: '485', f: '350', phi: '0.75', omega: '2.00' },
  { id: 'overloaded', label: 'Capacity Check Warning (5 mm, Lw=150 mm, 160 kN)', w: '5', lw: '150', fexx: '485', f: '160', phi: '0.75', omega: '2.00' },
];

export default function FilletWeldSizeCalculatorClient() {
  const [wStr, setWStr] = useState('6');
  const [lwStr, setLwStr] = useState('200');
  const [fexxStr, setFexxStr] = useState('485');
  const [fStr, setFStr] = useState('120');
  const [phiStr, setPhiStr] = useState('0.75');
  const [omegaStr, setOmegaStr] = useState('2.00');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setWStr(p.w);
    setLwStr(p.lw);
    setFexxStr(p.fexx);
    setFStr(p.f);
    setPhiStr(p.phi);
    setOmegaStr(p.omega);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const w = parseStrictPositive(wStr);
    const Lw = parseStrictPositive(lwStr);
    const Fexx = parseStrictPositive(fexxStr);
    const F_kN = parseStrictPositive(fStr);
    const phi = parseStrictPositive(phiStr);
    const omega = parseStrictPositive(omegaStr);

    if (
      !Number.isFinite(w) ||
      !Number.isFinite(Lw) ||
      !Number.isFinite(Fexx) ||
      !Number.isFinite(F_kN) ||
      !Number.isFinite(phi) ||
      !Number.isFinite(omega)
    ) {
      return { valid: false as const };
    }

    // Equal-leg 45-degree fillet weld: effective throat te = w / sqrt(2)
    const te = w / Math.SQRT2;
    const throatAreaMm2 = te * Lw;
    const tauMpa = (F_kN * 1000) / throatAreaMm2;
    const FnwMpa = 0.6 * Fexx;
    const Rn_kN = (FnwMpa * throatAreaMm2) / 1000;
    const phiRn_kN = phi * Rn_kN;
    const asdCap_kN = Rn_kN / omega;

    // Required leg size for applied force F_kN
    const wReqLrfd = ((F_kN * 1000) / (phi * FnwMpa * Lw)) * Math.SQRT2;
    const wReqAsd = ((F_kN * 1000 * omega) / (FnwMpa * Lw)) * Math.SQRT2;

    const passLrfd = F_kN <= phiRn_kN;
    const passAsd = F_kN <= asdCap_kN;

    return {
      valid: true as const,
      w,
      Lw,
      Fexx,
      F_kN,
      phi,
      omega,
      te,
      tauMpa,
      Rn_kN,
      phiRn_kN,
      asdCap_kN,
      wReqLrfd,
      wReqAsd,
      passLrfd,
      passAsd,
    };
  }, [wStr, lwStr, fexxStr, fStr, phiStr, omegaStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Fillet Weld Throat Stress & Strength Check`,
      `Leg w=${result.w} mm, Effective Length Lw=${result.Lw} mm -> Throat te=${result.te.toFixed(4)} mm`,
      `Applied Load F=${result.F_kN} kN -> Throat Shear tau=${result.tauMpa.toFixed(2)} MPa`,
      `Nominal Rn=${result.Rn_kN.toFixed(2)} kN | Design phi*Rn=${result.phiRn_kN.toFixed(2)} kN | Allowable Rn/Omega=${result.asdCap_kN.toFixed(2)} kN`,
      `Required Leg: LRFD=${result.wReqLrfd.toFixed(2)} mm, ASD=${result.wReqAsd.toFixed(2)} mm`,
    ].join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result.valid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit'],
      ['Weld Leg Size w', String(result.w), 'mm'],
      ['Effective Weld Length Lw', String(result.Lw), 'mm'],
      ['Filler Metal Strength FEXX', String(result.Fexx), 'MPa'],
      ['Applied Shear Load F', String(result.F_kN), 'kN'],
      ['Effective Throat te', result.te.toFixed(4), 'mm'],
      ['Throat Shear Stress tau', result.tauMpa.toFixed(2), 'MPa'],
      ['Nominal Weld Resistance Rn', result.Rn_kN.toFixed(2), 'kN'],
      ['Design Resistance (phi*Rn)', result.phiRn_kN.toFixed(2), 'kN'],
      ['Allowable Resistance (Rn/Omega)', result.asdCap_kN.toFixed(2), 'kN'],
      ['Required Leg Size (phi factor)', result.wReqLrfd.toFixed(2), 'mm'],
      ['Required Leg Size (Omega factor)', result.wReqAsd.toFixed(2), 'mm'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fillet-weld-size.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 hover:text-purple-700 text-xs font-bold text-slate-700 border border-slate-200"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          data-testid="btn-reset"
          onClick={resetDefaults}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {!result.valid && (
        <div
          data-testid="error-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Enter strictly positive values (&gt; 0) for leg size, weld length, electrode strength, load, and resistance factors.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          {[
            { id: 'w', label: 'Equal Weld Leg Size w (mm)', val: wStr, set: setWStr },
            { id: 'lw', label: 'Effective Weld Length Lw (mm)', val: lwStr, set: setLwStr },
            { id: 'fexx', label: 'Filler Strength FEXX (MPa)', val: fexxStr, set: setFexxStr },
            { id: 'force', label: 'Applied Shear Force F (kN)', val: fStr, set: setFStr },
            { id: 'phi', label: 'LRFD Resistance Factor phi', val: phiStr, set: setPhiStr },
            { id: 'omega', label: 'ASD Safety Factor Omega', val: omegaStr, set: setOmegaStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!result.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!result.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Effective Throat te</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-throat">{result.valid ? result.te.toFixed(4) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">mm</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Throat Shear Stress tau</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-stress">{result.valid ? result.tauMpa.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-orange-500">MPa</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Design Strength (phi * Rn)</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-phi-rn">{result.valid ? result.phiRn_kN.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">kN</span>
                </div>
                <div data-testid="status-lrfd" className="text-xs font-bold text-emerald-700 mt-1">
                  {result.valid ? (result.passLrfd ? 'PASS (F <= phi*Rn)' : 'EXCEEDS DESIGN CAPACITY') : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Allowable Strength (Rn / Omega)</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-asd-rn">{result.valid ? result.asdCap_kN.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-slate-500">kN</span>
                </div>
                <div data-testid="status-asd" className="text-xs font-bold text-slate-700 mt-1">
                  {result.valid ? (result.passAsd ? 'PASS (F <= Rn/Omega)' : 'EXCEEDS ALLOWABLE CAPACITY') : '—'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="text-slate-500 font-bold">Required Leg (phi=0.75)</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  <span data-testid="result-wreq-lrfd">{result.valid ? result.wReqLrfd.toFixed(2) : '—'}</span> mm
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="text-slate-500 font-bold">Required Leg (Omega=2.00)</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  <span data-testid="result-wreq-asd">{result.valid ? result.wReqAsd.toFixed(2) : '—'}</span> mm
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Equal-leg fillet weld throat geometry: te = w / sqrt(2), tau = 1000*F / (te*Lw), Fnw = 0.60*FEXX, Rn = Fnw*te*Lw/1000. Verify minimum/maximum leg sizes against connected base plate thicknesses and governing structural welding specifications.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
