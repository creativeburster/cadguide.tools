'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Info, Check, Copy, AlertTriangle, Wrench, Download } from 'lucide-react';

// Metric thread tensile stress areas verified against Engineering ToolBox metric-threads-d_777.html
const METRIC_BOLTS_PRESETS = [
  { label: 'M4', d: '4', as: '8.78' },
  { label: 'M5', d: '5', as: '14.2' },
  { label: 'M6', d: '6', as: '20.1' },
  { label: 'M8', d: '8', as: '36.6' },
  { label: 'M10', d: '10', as: '58.0' },
  { label: 'M12', d: '12', as: '84.3' },
  { label: 'M16', d: '16', as: '157' },
  { label: 'M20', d: '20', as: '245' },
];

const YIELD_PRESETS = [
  { label: '320 MPa', rp: '320' },
  { label: '400 MPa', rp: '400' },
  { label: '640 MPa', rp: '640' },
  { label: '900 MPa', rp: '900' },
  { label: '1080 MPa', rp: '1080' },
];

const K_PRESETS = [
  { label: 'PTFE (0.10)', k: '0.10' },
  { label: 'Oiled (0.15)', k: '0.15' },
  { label: 'Plated (0.18)', k: '0.18' },
  { label: 'Dry (0.20)', k: '0.20' },
];

interface BoltTorqueResult {
  valid: boolean;
  error?: string;
  yieldLoadKn: number;
  preloadKn: number;
  torqueNm: number;
  tensileStressMpa: number;
  pctYield: number;
}

function solveBoltTorque(
  diaMmStr: string,
  stressAreaStr: string,
  yieldMpaStr: string,
  preloadPctStr: string,
  kFactorStr: string
): BoltTorqueResult {
  if ([diaMmStr, stressAreaStr, yieldMpaStr, preloadPctStr, kFactorStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All bolt diameter, stress area, yield strength, preload ratio, and nut factor inputs are required.', yieldLoadKn: 0, preloadKn: 0, torqueNm: 0, tensileStressMpa: 0, pctYield: 0 };
  }
  const d = Number(diaMmStr);
  const As = Number(stressAreaStr);
  const rp = Number(yieldMpaStr);
  const pct = Number(preloadPctStr);
  const K = Number(kFactorStr);

  if (![d, As, rp, pct, K].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', yieldLoadKn: 0, preloadKn: 0, torqueNm: 0, tensileStressMpa: 0, pctYield: 0 };
  }
  if (d <= 0 || As <= 0 || rp <= 0 || pct <= 0 || pct > 100 || K <= 0) {
    return { valid: false, error: 'Require positive d, As, yield stress, nut factor K, and 0 < preload ratio <= 100%.', yieldLoadKn: 0, preloadKn: 0, torqueNm: 0, tensileStressMpa: 0, pctYield: 0 };
  }

  const yieldLoadN = As * rp;
  const preloadN = yieldLoadN * (pct / 100);
  // T = K * F_pre * d (N*mm -> /1000 for N*m)
  const torqueNm = (K * preloadN * d) / 1000;
  const tensileStressMpa = preloadN / As;

  return {
    valid: true,
    yieldLoadKn: yieldLoadN / 1000,
    preloadKn: preloadN / 1000,
    torqueNm,
    tensileStressMpa,
    pctYield: pct,
  };
}

export default function BoltTorqueClient() {
  const [dStr, setDStr] = useState('12');
  const [asStr, setAsStr] = useState('84.3');
  const [rpStr, setRpStr] = useState('640');
  const [pctStr, setPctStr] = useState('75');
  const [kStr, setKStr] = useState('0.15');
  const [copied, setCopied] = useState(false);

  const res = solveBoltTorque(dStr, asStr, rpStr, pctStr, kStr);

  const handleCopy = () => {
    if (!res.valid) return;
    const text = [
      'Bolted Joint Torque & Preload Summary',
      `Nominal Diameter d: ${dStr} mm | Tensile Stress Area As: ${asStr} mm2`,
      `Yield Stress: ${rpStr} MPa | Preload Target: ${pctStr}% | Nut Factor K: ${kStr}`,
      `Yield Load Limit: ${res.yieldLoadKn.toFixed(3)} kN`,
      `Target Preload Force: ${res.preloadKn.toFixed(3)} kN`,
      `Required Tightening Torque: ${res.torqueNm.toFixed(3)} N*m`,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Bolt Tightening Torque & Preload Report', ''],
      ['Nominal Diameter d (mm)', dStr],
      ['Tensile Stress Area As (mm^2)', asStr],
      ['Material Yield Limit (MPa)', rpStr],
      ['Target Preload Utilization (%)', pctStr],
      ['Nut Factor K', kStr],
      ['Axial Yield Capacity (kN)', res.yieldLoadKn.toFixed(4)],
      ['Target Preload Force (kN)', res.preloadKn.toFixed(4)],
      ['Required Tightening Torque T (N*m)', res.torqueNm.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bolt-torque-preload.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-5">
          <h2 className="text-lg font-black flex items-center gap-2 border-b border-slate-800 pb-3">
            <Wrench className="w-5 h-5 text-blue-400" />
            <span>Bolted Joint Inputs</span>
          </h2>

          <div>
            <div className="text-xs font-black text-slate-400 uppercase mb-2">Metric Presets (M4 - M20)</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {METRIC_BOLTS_PRESETS.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => { setDStr(b.d); setAsStr(b.as); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black border ${dStr === b.d && asStr === b.as ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase block mb-1">Diameter d (mm)</label>
                <input type="text" inputMode="decimal" data-testid="input-dia" value={dStr} onChange={(e) => setDStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase block mb-1">Stress Area As (mm2)</label>
                <input type="text" inputMode="decimal" data-testid="input-as" value={asStr} onChange={(e) => setAsStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-black text-slate-400 uppercase mb-1.5">Yield Strength Presets</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {YIELD_PRESETS.map((g) => (
                <button key={g.label} type="button" onClick={() => setRpStr(g.rp)} className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300">{g.label}</button>
              ))}
            </div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1">Yield Stress (MPa)</label>
            <input type="text" inputMode="decimal" data-testid="input-yield" value={rpStr} onChange={(e) => setRpStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
          </div>

          <div>
            <div className="text-xs font-black text-slate-400 uppercase mb-1.5">Nut Factor K Presets</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {K_PRESETS.map((k) => (
                <button key={k.label} type="button" onClick={() => setKStr(k.k)} className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300">{k.label}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase block mb-1">Nut Factor K</label>
                <input type="text" inputMode="decimal" data-testid="input-k" value={kStr} onChange={(e) => setKStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase block mb-1">Preload Ratio (%)</label>
                <input type="text" inputMode="decimal" data-testid="input-pct" value={pctStr} onChange={(e) => setPctStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
              </div>
            </div>
          </div>

          <button type="button" onClick={() => { setDStr('12'); setAsStr('84.3'); setRpStr('640'); setPctStr('75'); setKStr('0.15'); }} className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-200">Reset</button>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900">Torque &amp; Preload Results</h3>
            <div className="flex gap-2">
              <button type="button" onClick={handleCopy} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-black disabled:opacity-50">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-black disabled:opacity-50">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {!res.valid ? (
            <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
          ) : (
            <>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Required Tightening Torque T = K * F_pre * d</div>
                <div className="text-4xl sm:text-5xl font-black text-blue-900" data-testid="res-torque">{res.torqueNm.toFixed(3)} N*m</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">Target Preload Force</div>
                  <div className="text-2xl font-black text-slate-900" data-testid="res-preload">{res.preloadKn.toFixed(3)} kN</div>
                  <div className="text-xs text-slate-500 mt-1">Axial Stress: {res.tensileStressMpa.toFixed(1)} MPa</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">Yield Load Limit</div>
                  <div className="text-2xl font-black text-slate-900" data-testid="res-yield">{res.yieldLoadKn.toFixed(3)} kN</div>
                </div>
              </div>

              {res.pctYield >= 85 && (
                <div className="flex gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Preload ratio is {res.pctYield.toFixed(1)}% of nominal tensile yield capacity; verify torque wrench scatter margin.</span>
                </div>
              )}
            </>
          )}

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Uses torque-preload relation T = K * F_pre * d (<a href="https://en.wikipedia.org/wiki/Bolted_joint" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Wikipedia: Bolted joint</a>) and metric thread tensile stress areas M4-M20 from <a href="https://www.engineeringtoolbox.com/metric-threads-d_777.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Engineering ToolBox</a>.
            </span>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
