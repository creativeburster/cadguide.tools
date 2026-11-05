'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, ShieldAlert, Download } from 'lucide-react';

interface BoltPreset {
  name: string;
  dMm: string;
  hefMm: string;
  fyMpa: string;
  fuMpa: string;
}

const BOLT_PRESETS: BoltPreset[] = [
  { name: 'M12 Grade 4.8 / A307', dMm: '12', hefMm: '80', fyMpa: '320', fuMpa: '400' },
  { name: 'M16 Grade 8.8 / A325', dMm: '16', hefMm: '100', fyMpa: '640', fuMpa: '800' },
  { name: 'M20 Grade 8.8 / A325', dMm: '20', hefMm: '125', fyMpa: '640', fuMpa: '800' },
  { name: 'M24 Grade 8.8 / A325', dMm: '24', hefMm: '160', fyMpa: '640', fuMpa: '800' },
  { name: 'M16 Stainless A4-70', dMm: '16', hefMm: '100', fyMpa: '450', fuMpa: '700' },
];

export default function AnchorBoltCalculatorClient() {
  const [fcMpa, setFcMpa] = useState('25'); // Concrete cylinder strength fc (MPa)
  const [hefMm, setHefMm] = useState('100'); // Effective embedment depth (mm)
  const [diameterMm, setDiameterMm] = useState('16'); // Bolt diameter (mm)
  const [fuMpa, setFuMpa] = useState('800'); // Ultimate tensile strength fu (MPa)
  const [activePreset, setActivePreset] = useState<number | null>(1);

  const applyPreset = (idx: number) => {
    const p = BOLT_PRESETS[idx];
    setDiameterMm(p.dMm);
    setHefMm(p.hefMm);
    setFuMpa(p.fuMpa);
    setActivePreset(idx);
  };

  const results = useMemo(() => {
    const fc = Math.max(10, Math.min(100, parseFloat(fcMpa) || 25)); // MPa
    const hef = Math.max(20, parseFloat(hefMm) || 100); // mm
    const d = Math.max(6, parseFloat(diameterMm) || 16); // mm
    const fu = Math.max(200, parseFloat(fuMpa) || 800); // MPa

    // Concrete Breakout Capacity in Tension (Concrete Capacity Design CCD Method):
    // Basic single anchor breakout without edge influence (unconfined wide slab)
    // N_b = k_c * sqrt(fc) * hef^1.5 (N)
    // For post-installed anchors in uncracked concrete, kc ≈ 10.0 (SI units: N, mm, MPa)
    const kc = 10.0;
    const nBreakoutN = kc * Math.sqrt(fc) * Math.pow(hef, 1.5);
    const nBreakoutKn = nBreakoutN / 1000;

    // Steel Tensile Capacity:
    // Effective threaded stress area A_se ≈ 0.7854 * (d - 0.9382 * pitch)² ≈ 0.75 * (pi / 4 * d²)
    const grossAreaMm2 = (Math.PI / 4) * d * d;
    const effectiveTensileAreaMm2 = grossAreaMm2 * 0.78; // Standard coarse thread tensile stress area
    const nSteelN = effectiveTensileAreaMm2 * fu;
    const nSteelKn = nSteelN / 1000;

    // Steel Shear Capacity (without threads in shear plane):
    // V_sa ≈ 0.6 * A_se * fu
    const vSteelN = 0.6 * effectiveTensileAreaMm2 * fu;
    const vSteelKn = vSteelN / 1000;

    // Governing Nominal Tension (weakest link between concrete breakout and steel rupture)
    const governingTensionKn = Math.min(nBreakoutKn, nSteelKn);
    const governingMode = nBreakoutKn < nSteelKn ? 'Concrete Breakout' : 'Steel Rupture';

    return {
      fc,
      hef,
      d,
      fu,
      grossAreaMm2,
      effectiveTensileAreaMm2,
      nBreakoutKn,
      nSteelKn,
      vSteelKn,
      governingTensionKn,
      governingMode,
    };
  }, [fcMpa, hefMm, diameterMm, fuMpa]);

  const downloadCsv = () => {
    const rows = [
      ['Anchor Bolt Conceptual Sizing Report', ''],
      ['Notice', 'Preliminary single-anchor estimate only. Not certified for construction drawings.'],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Input Parameters', ''],
      ['Concrete Compressive Strength fc (MPa)', fcMpa],
      ['Effective Embedment Depth hef (mm)', hefMm],
      ['Bolt Nominal Diameter (mm)', diameterMm],
      ['Steel Ultimate Strength fu (MPa)', fuMpa],
      ['', ''],
      ['Preliminary Capacity Outputs', ''],
      ['Nominal Tensile Breakout Nb (kN)', results.nBreakoutKn.toFixed(2)],
      ['Steel Tensile Capacity Nsa (kN)', results.nSteelKn.toFixed(2)],
      ['Steel Shear Capacity Vsa (kN)', results.vSteelKn.toFixed(2)],
      ['Governing Nominal Tension (kN)', results.governingTensionKn.toFixed(2)],
      ['Governing Tension Failure Mode', results.governingMode],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anchor-bolt-capacity-estimate.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Safety Critical Disclaimer Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed font-medium">
          <strong className="font-black text-amber-950 block text-sm mb-1 uppercase tracking-wide">
            Engineering Sizing Disclaimer — Concept &amp; Educational Use Only
          </strong>
          This calculator provides preliminary order-of-magnitude estimates for an isolated single anchor bolt far from edges in uncracked concrete. It does <strong>not</strong> account for concrete edge distance reduction factors, anchor group interactions, prying action, cracked concrete regimes, or seismic loading requirements. <strong>Do not use this calculation for permitted construction documents or safety-critical liftoff anchors.</strong> Formal anchor qualifications must be verified using certified manufacturer software (such as Hilti PROFIS or Simpson Anchor Designer) and sealed by a licensed structural engineer (PE/SE).
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Anchor Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">Basic single-anchor parameters</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Standard Bolt Sizes</label>
            <div className="space-y-1.5">
              {BOLT_PRESETS.map((p, idx) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    activePreset === idx
                      ? 'bg-orange-50 border-orange-300 text-orange-800 shadow-xs'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="font-black text-slate-500">{p.hefMm}mm hef</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Concrete f&apos;c (MPa)
                </label>
                <input
                  type="number"
                  step="5"
                  value={fcMpa}
                  onChange={e => setFcMpa(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Embedment hₑf (mm)
                </label>
                <input
                  type="number"
                  step="10"
                  value={hefMm}
                  onChange={e => { setHefMm(e.target.value); setActivePreset(null); }}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Bolt Dia d (mm)
                </label>
                <input
                  type="number"
                  step="2"
                  value={diameterMm}
                  onChange={e => { setDiameterMm(e.target.value); setActivePreset(null); }}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Steel fᵤ (MPa)
                </label>
                <input
                  type="number"
                  step="50"
                  value={fuMpa}
                  onChange={e => { setFuMpa(e.target.value); setActivePreset(null); }}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setFcMpa('25');
              setHefMm('100');
              setDiameterMm('16');
              setFuMpa('800');
              setActivePreset(1);
            }}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>

        {/* Right Column: Results & Engineering Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Nominal Capacity Estimates</h2>
                  <p className="text-xs text-slate-500 font-medium">Unfactored nominal ultimate capacities</p>
                </div>
              </div>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-100 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* Primary Result Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-2xl p-6 text-white shadow-xs">
                <div className="text-xs font-black text-orange-200 uppercase tracking-wider mb-1">
                  Governing Nominal Tension
                </div>
                <div className="text-4xl font-black">{results.governingTensionKn.toFixed(1)} <span className="text-xl font-bold">kN</span></div>
                <div className="text-xs text-orange-100/90 mt-2 font-medium">
                  Governed by: <strong>{results.governingMode}</strong> (Unfactored)
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xs">
                <div className="text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                  Steel Shear Capacity (Vsa)
                </div>
                <div className="text-4xl font-black">{results.vSteelKn.toFixed(1)} <span className="text-xl font-bold">kN</span></div>
                <div className="text-xs text-slate-300 mt-2 font-medium">
                  Assumes shear plane passes through effective threaded shank
                </div>
              </div>
            </div>

            {/* Secondary Failure Mode Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Concrete Breakout (Nb)</div>
                <div className="text-2xl font-black text-slate-900">{results.nBreakoutKn.toFixed(1)} <span className="text-xs text-slate-500 font-bold">kN</span></div>
                <div className="text-[11px] text-slate-400 mt-1">k_c = 10.0 (Uncracked concrete cone)</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Steel Tensile Rupture (Nsa)</div>
                <div className="text-2xl font-black text-slate-900">{results.nSteelKn.toFixed(1)} <span className="text-xs text-slate-500 font-bold">kN</span></div>
                <div className="text-[11px] text-slate-400 mt-1">A_se = {results.effectiveTensileAreaMm2.toFixed(1)} mm²</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nominal Shear (Vsa)</div>
                <div className="text-2xl font-black text-slate-900">{results.vSteelKn.toFixed(1)} <span className="text-xs text-slate-500 font-bold">kN</span></div>
                <div className="text-[11px] text-slate-400 mt-1">0.6 × A_se × f_u</div>
              </div>
            </div>

            {/* Methodology Note */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
              <Info className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-800">Concrete Capacity Design (CCD) Method:</strong> Basic concrete breakout is computed via <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">N_b = k_c × √(f&apos;c) × h_ef^1.5</code>. Steel rupture is derived from effective threaded tensile stress area <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">N_sa = A_se × f_u</code>.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
