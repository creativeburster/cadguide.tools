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
  const [fyMpa, setFyMpa] = useState('640'); // Yield strength fy (MPa)
  const [fuMpa, setFuMpa] = useState('800'); // Ultimate tensile strength fu (MPa)
  const [activePreset, setActivePreset] = useState<number | null>(1);

  const applyPreset = (idx: number) => {
    const p = BOLT_PRESETS[idx];
    setDiameterMm(p.dMm);
    setHefMm(p.hefMm);
    setFyMpa(p.fyMpa);
    setFuMpa(p.fuMpa);
    setActivePreset(idx);
  };

  const results = useMemo(() => {
    const fc = Math.max(10, Math.min(100, parseFloat(fcMpa) || 25)); // MPa
    const hef = Math.max(20, parseFloat(hefMm) || 100); // mm
    const d = Math.max(6, parseFloat(diameterMm) || 16); // mm
    const fy = Math.max(150, parseFloat(fyMpa) || 640); // MPa
    const fu = Math.max(200, parseFloat(fuMpa) || 800); // MPa

    // Concrete Breakout Capacity in Tension (Concrete Capacity Design CCD Method):
    // Basic single anchor breakout without edge influence (unconfined wide slab)
    // N_b = k_c * sqrt(fc) * hef^1.5 (N)
    // For cast-in headed anchor bolts in uncracked concrete, kc = 10.0 (in SI units: N, mm, MPa).
    // (Note: kc = 7.0 for post-installed expansion/mechanical anchors).
    const kc = 10.0;
    const nBreakoutN = kc * Math.sqrt(fc) * Math.pow(hef, 1.5);
    const nBreakoutKn = nBreakoutN / 1000;

    // Steel Tensile Capacity:
    // Effective threaded tensile stress area A_se ≈ 0.78 * (pi / 4 * d²) for standard ISO metric coarse thread
    const grossAreaMm2 = (Math.PI / 4) * d * d;
    const effectiveTensileAreaMm2 = grossAreaMm2 * 0.78;
    const nSteelN = effectiveTensileAreaMm2 * fu;
    const nSteelKn = nSteelN / 1000;

    // Steel Yield Tension:
    const nYieldKn = (effectiveTensileAreaMm2 * fy) / 1000;

    // Steel Shear Capacity (threads included in shear plane, using tensile stress area A_se):
    // V_sa ≈ 0.6 * A_se * fu
    const vSteelN = 0.6 * effectiveTensileAreaMm2 * fu;
    const vSteelKn = vSteelN / 1000;

    // Governing Nominal Tension (weakest link between concrete breakout and steel ultimate rupture)
    const governingTensionKn = Math.min(nBreakoutKn, nSteelKn);
    const governingMode = nBreakoutKn < nSteelKn ? 'Concrete Breakout' : 'Steel Rupture';

    return {
      fc,
      hef,
      d,
      fy,
      fu,
      grossAreaMm2,
      effectiveTensileAreaMm2,
      nBreakoutKn,
      nSteelKn,
      nYieldKn,
      vSteelKn,
      governingTensionKn,
      governingMode,
    };
  }, [fcMpa, hefMm, diameterMm, fyMpa, fuMpa]);

  const downloadCsv = () => {
    const rows = [
      ['Anchor Bolt Conceptual Sizing Report', ''],
      ['Notice', 'FOR PRELIMINARY CONCEPTUAL SIZING ONLY - NOT FOR PERMITTED DRAWINGS'],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Input Parameters', ''],
      ['Concrete Compressive Strength fc (MPa)', fcMpa],
      ['Effective Embedment Depth hef (mm)', hefMm],
      ['Bolt Nominal Diameter (mm)', diameterMm],
      ['Steel Yield Strength fy (MPa)', fyMpa],
      ['Steel Ultimate Strength fu (MPa)', fuMpa],
      ['', ''],
      ['Preliminary Capacity Outputs', ''],
      ['Nominal Tensile Breakout Nb (kN)', results.nBreakoutKn.toFixed(2)],
      ['Steel Ultimate Tensile Nsa (kN)', results.nSteelKn.toFixed(2)],
      ['Steel Tensile Yield Nya (kN)', results.nYieldKn.toFixed(2)],
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
          This calculator provides preliminary order-of-magnitude estimates for an isolated single cast-in anchor bolt far from concrete edges in uncracked concrete. It does <strong>not</strong> account for edge distance reduction factors, anchor group spacing interactions, cracked concrete regimes, prying forces, or seismic load cases. <strong>Do not use this calculation for permitted construction documents or safety-critical liftoff connections.</strong> Formal anchor calculations must be performed using manufacturer design software (such as Hilti PROFIS or Simpson Anchor Designer) and certified by a licensed professional engineer (PE/SE).
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Steel fy (MPa)
                </label>
                <input
                  type="number"
                  step="50"
                  value={fyMpa}
                  onChange={e => { setFyMpa(e.target.value); setActivePreset(null); }}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Steel fu (MPa)
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
            onClick={() => applyPreset(1)}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults (M16 Grade 8.8)
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
                  <p className="text-xs text-slate-500 font-medium">Single anchor tension &amp; shear limits</p>
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

            {/* Status Pill */}
            <div className="flex items-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase bg-slate-100 text-slate-700 border border-slate-200">
                <span>Governing Tension: {results.governingMode}</span>
              </div>
            </div>

            {/* Primary Result Banner */}
            <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-2xl p-6 text-white shadow-xs">
              <div className="text-xs font-black uppercase tracking-wider text-orange-100 mb-1">
                Governing Nominal Tension Capacity
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  data-testid="anchor-governing-tension"
                  className="text-4xl sm:text-5xl font-black tracking-tight"
                >
                  {results.governingTensionKn.toFixed(2)}
                </span>
                <span className="text-xl font-bold text-orange-200">kN</span>
                <span className="text-sm font-semibold text-orange-200/80 ml-2">
                  ({(results.governingTensionKn * 224.809).toFixed(0)} lbf)
                </span>
              </div>
              <div className="text-xs text-orange-100/90 mt-2 font-medium">
                Controlled by {results.governingMode} (nominal unfactored capacity)
              </div>
            </div>

            {/* Breakdown Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cone Breakout (Nb)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="anchor-breakout-capacity">{results.nBreakoutKn.toFixed(2)}</span> <span className="text-xs text-slate-500 font-bold">kN</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">kc=10.0 uncracked</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Steel Rupture (Nsa)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="anchor-steel-tension">{results.nSteelKn.toFixed(2)}</span> <span className="text-xs text-slate-500 font-bold">kN</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Ase·fu ({results.effectiveTensileAreaMm2.toFixed(0)} mm²)</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Steel Yield (Nya)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="anchor-steel-yield">{results.nYieldKn.toFixed(2)}</span> <span className="text-xs text-slate-500 font-bold">kN</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Ase·fy ({results.fy} MPa)</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Steel Shear (Vsa)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="anchor-steel-shear">{results.vSteelKn.toFixed(2)}</span> <span className="text-xs text-slate-500 font-bold">kN</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">0.6·Ase·fu (in threads)</div>
              </div>
            </div>

            {/* Note on Strength Reductions */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <strong className="text-slate-800">Design Code Margin Notice:</strong>
              <p className="leading-relaxed">
                Reported values represent nominal (unfactored) single-anchor capacities. In real structural design under standard building codes (e.g., ACI 318, Eurocode 2 Part 4, or AS 5216), capacity reduction factors (φ ≈ 0.65–0.75 for concrete breakout, φ ≈ 0.65–0.75 for steel) and modification factors for edge distances (c1, c2), spacing (s), cracked concrete, and seismic regimes must be applied.
              </p>
            </div>
          </div>

          {/* Governing Formulation Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Concrete Capacity Design (CCD) Method</h3>
                <p className="text-xs text-slate-500 font-medium">Basic breakout &amp; steel fracture formulation</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5 text-xs sm:text-sm text-slate-700 font-mono font-medium leading-relaxed">
              <p>N_b = k_c · √(f&apos;_c) · h_ef^1.5  (k_c = 10.0 for cast-in headed anchors in SI units)</p>
              <p>N_sa = A_se · f_uta • N_ya = A_se · f_ya  (A_se ≈ 0.78 · π/4 · d²)</p>
              <p>V_sa = 0.6 · A_se · f_uta  (threads in shear plane)</p>
              <p>Governing Tension = min(N_b, N_sa)</p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
