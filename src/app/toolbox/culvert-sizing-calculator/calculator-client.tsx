'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Droplets, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

// Engineering ToolBox Manning's n values for common circular culvert materials
const CULVERT_MATERIALS = [
  { id: 'concrete_spun', label: 'Concrete — centrifugally spun (n = 0.013)', n: '0.013' },
  { id: 'concrete_steel', label: 'Concrete — steel forms (n = 0.011)', n: '0.011' },
  { id: 'concrete_finished', label: 'Concrete — finished (n = 0.012)', n: '0.012' },
  { id: 'concrete_wood', label: 'Concrete — wooden forms (n = 0.015)', n: '0.015' },
  { id: 'cmp', label: 'Corrugated metal (n = 0.022)', n: '0.022' },
];

// Standard nominal circular pipe inner diameters (mm)
const STANDARD_DIAMETERS_MM = [
  300, 375, 450, 525, 600, 750, 900, 1050, 1200, 1350, 1500, 1650, 1800, 2100, 2400, 2700, 3000,
];

// Full circular Manning geometry factor: pi / 4^(5/3)
const FULL_CIRCLE_MANNING_FACTOR = Math.PI / Math.pow(4, 5 / 3);

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function fmt(val: number, decimals = 2): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function CulvertSizingClient() {
  const [flowStr, setFlowStr] = useState('4.2');
  const [slopeStr, setSlopeStr] = useState('0.01');
  const [materialId, setMaterialId] = useState('concrete_spun');
  const [manningStr, setManningStr] = useState('0.013');
  const [barrelsStr, setBarrelsStr] = useState('1');
  const [copied, setCopied] = useState(false);

  const handleMaterialChange = (id: string) => {
    setMaterialId(id);
    const mat = CULVERT_MATERIALS.find((m) => m.id === id);
    if (mat) setManningStr(mat.n);
  };

  const handleReset = () => {
    setFlowStr('4.2');
    setSlopeStr('0.01');
    setMaterialId('concrete_spun');
    setManningStr('0.013');
    setBarrelsStr('1');
    setCopied(false);
  };

  const result = useMemo(() => {
    const Q_total = parsePositive(flowStr);
    const S = parsePositive(slopeStr);
    const n = parsePositive(manningStr);
    const bTrim = barrelsStr.trim();
    const barrels = /^\d+$/.test(bTrim) ? Number(bTrim) : Number.NaN;

    if (
      !Number.isFinite(Q_total) ||
      !Number.isFinite(S) ||
      !Number.isFinite(n) ||
      !Number.isInteger(barrels) ||
      barrels < 1 ||
      barrels > 10
    ) {
      return { valid: false as const };
    }

    const Q_per_barrel = Q_total / barrels;

    // Required continuous full-flow inner diameter:
    // Q = (1/n) * (pi * D^2 / 4) * (D / 4)^(2/3) * sqrt(S) = FULL_CIRCLE_MANNING_FACTOR / n * D^(8/3) * sqrt(S)
    const D_req_m = Math.pow((Q_per_barrel * n) / (FULL_CIRCLE_MANNING_FACTOR * Math.sqrt(S)), 3 / 8);
    const D_req_mm = D_req_m * 1000;

    const stdMatch = STANDARD_DIAMETERS_MM.find((d) => d >= D_req_mm);
    const D_sel_mm = stdMatch ?? Math.ceil(D_req_mm / 100) * 100;
    const D_sel_m = D_sel_mm / 1000;
    const exceedsMaxStd = stdMatch === undefined;

    const areaSingle = (Math.PI * D_sel_m * D_sel_m) / 4;
    const hydraulicRadius = D_sel_m / 4;
    const Q_full_single =
      (1 / n) * areaSingle * Math.pow(hydraulicRadius, 2 / 3) * Math.sqrt(S);
    const Q_full_total = Q_full_single * barrels;

    const V_full = Q_full_single / areaSingle;
    const V_design_avg = Q_per_barrel / areaSingle;
    const utilizationPct = (Q_total / Q_full_total) * 100;

    return {
      valid: true as const,
      Q_total,
      Q_per_barrel,
      S,
      n,
      barrels,
      D_req_mm,
      D_sel_mm,
      exceedsMaxStd,
      areaSingle,
      hydraulicRadius,
      Q_full_total,
      V_full,
      V_design_avg,
      utilizationPct,
    };
  }, [flowStr, slopeStr, manningStr, barrelsStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `Circular Culvert (Manning): Q_design=${result.Q_total} m3/s (${result.barrels} barrel), S=${result.S}, n=${result.n} -> Required D=${result.D_req_mm.toFixed(1)} mm -> Standard D=${result.D_sel_mm} mm | Q_full=${result.Q_full_total.toFixed(3)} m3/s (${result.utilizationPct.toFixed(1)}% utilization), V_full=${result.V_full.toFixed(2)} m/s`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
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
      ['parameter', 'value', 'unit'],
      ['design_discharge', result.Q_total.toFixed(3), 'm3/s'],
      ['slope', result.S.toFixed(4), 'm/m'],
      ['manning_n', result.n.toFixed(3), '-'],
      ['barrels', String(result.barrels), '-'],
      ['required_min_diameter', result.D_req_mm.toFixed(1), 'mm'],
      ['selected_standard_diameter', String(result.D_sel_mm), 'mm'],
      ['full_flow_capacity', result.Q_full_total.toFixed(4), 'm3/s'],
      ['full_flow_velocity', result.V_full.toFixed(3), 'm/s'],
      ['design_velocity_full_area', result.V_design_avg.toFixed(3), 'm/s'],
      ['capacity_utilization', result.utilizationPct.toFixed(2), '%'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'culvert_manning_sizing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Circular Culvert Full-Flow Sizing (Manning)</h2>
            <p className="text-sm font-medium text-slate-500">
              Full-barrel gravity flow Q = (1/n) · A · Rₕ^(2/3) · S^(1/2) mapped to standard pipe diameters
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="reset-button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label htmlFor="culv-q" className="block text-sm font-black text-slate-700 mb-1.5">
              Design Discharge Q (m³/s)
            </label>
            <input
              id="culv-q"
              data-testid="input-flow"
              type="text"
              inputMode="decimal"
              value={flowStr}
              onChange={(e) => setFlowStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="culv-s" className="block text-sm font-black text-slate-700 mb-1.5">
              Barrel Longitudinal Slope S (m/m)
            </label>
            <input
              id="culv-s"
              data-testid="input-slope"
              type="text"
              inputMode="decimal"
              value={slopeStr}
              onChange={(e) => setSlopeStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="culv-mat" className="block text-sm font-black text-slate-700 mb-1.5">
              Barrel Material Preset (Manning Roughness n)
            </label>
            <select
              id="culv-mat"
              data-testid="select-material"
              value={materialId}
              onChange={(e) => handleMaterialChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white mb-2"
            >
              {CULVERT_MATERIALS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <input
              data-testid="input-manning-n"
              type="text"
              inputMode="decimal"
              value={manningStr}
              onChange={(e) => setManningStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm"
            />
          </div>

          <div>
            <label htmlFor="culv-barrels" className="block text-sm font-black text-slate-700 mb-1.5">
              Number of Identical Barrels (1–10)
            </label>
            <input
              id="culv-barrels"
              data-testid="input-barrels"
              type="text"
              inputMode="numeric"
              value={barrelsStr}
              onChange={(e) => setBarrelsStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-black cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {!result.valid && (
              <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>Discharge, slope, and Manning n must be positive numbers, and barrels must be an integer (1–10).</span>
              </div>
            )}

            {result.valid && result.exceedsMaxStd && (
              <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>Required diameter exceeds 3000 mm standard circular pipe; increase number of barrels or consider a box culvert.</span>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="text-xs font-black text-orange-800 uppercase tracking-wider mb-1">
                Recommended Standard Pipe Inner Diameter
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-diameter" className="text-4xl font-black text-slate-900">
                  {result.valid ? String(result.D_sel_mm) : '—'}
                </span>
                <span className="text-lg font-bold text-orange-700">mm</span>
              </div>
              <div data-testid="result-req-diameter" className="text-sm font-bold text-slate-600 mt-1">
                {result.valid
                  ? `Theoretical minimum diameter: ${result.D_req_mm.toFixed(1)} mm (${result.utilizationPct.toFixed(1)}% capacity used)`
                  : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Full Barrel Capacity</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-q-full" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.Q_full_total, 3) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">m³/s</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Full-Flow Velocity</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-v-full" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.V_full, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">m/s</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Design Flow / Area</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-v-design" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.V_design_avg, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">m/s</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Full-Flow Manning Sizing Basis:</strong>{' '}
                Full circular barrel has area <code>A = πD²/4</code> and hydraulic radius <code>R_h = D/4</code>, yielding <code>Q_full = (1/n)·A·R_h^(2/3)·S^(1/2)</code>. This sizes for unpressurized full gravity barrel capacity; inlet/tailwater submerged headwater control requires site-specific hydraulic modeling.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
