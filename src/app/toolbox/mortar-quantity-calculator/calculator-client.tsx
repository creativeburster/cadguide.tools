'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Check, Copy, Download, Info, RotateCcw, Settings, Zap } from 'lucide-react';

interface MortarPreset {
  id: string;
  label: string;
  lengthM: string;
  heightM: string;
  thickMm: string;
  mortarFraction: string;
  cementParts: string;
  sandParts: string;
  dryFactor: string;
  wastagePct: string;
  cementDensity: string;
  bagWeight: string;
}

const PRESETS: MortarPreset[] = [
  {
    id: 'brick-1-4',
    label: '230mm Brick Wall (1:4)',
    lengthM: '10',
    heightM: '3',
    thickMm: '230',
    mortarFraction: '0.20',
    cementParts: '1',
    sandParts: '4',
    dryFactor: '1.33',
    wastagePct: '10',
    cementDensity: '1440',
    bagWeight: '50',
  },
  {
    id: 'block-1-6',
    label: '200mm Block Wall (1:6)',
    lengthM: '15',
    heightM: '3.2',
    thickMm: '200',
    mortarFraction: '0.12',
    cementParts: '1',
    sandParts: '6',
    dryFactor: '1.30',
    wastagePct: '5',
    cementDensity: '1440',
    bagWeight: '50',
  },
];

const parsePos = (raw: string): number | null => {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const parseNonNeg = (raw: string): number | null => {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

const fmt = (n: number | null, dec = 4) => (n === null || !Number.isFinite(n) ? '—' : n.toFixed(dec));

export default function MortarQuantityCalculatorClient() {
  const [lengthM, setLengthM] = useState('10');
  const [heightM, setHeightM] = useState('3');
  const [thickMm, setThickMm] = useState('230');
  const [mortarFraction, setMortarFraction] = useState('0.20');
  const [cementParts, setCementParts] = useState('1');
  const [sandParts, setSandParts] = useState('4');
  const [dryFactor, setDryFactor] = useState('1.33');
  const [wastagePct, setWastagePct] = useState('10');
  const [cementDensity, setCementDensity] = useState('1440');
  const [bagWeight, setBagWeight] = useState('50');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: MortarPreset) => {
    setLengthM(p.lengthM);
    setHeightM(p.heightM);
    setThickMm(p.thickMm);
    setMortarFraction(p.mortarFraction);
    setCementParts(p.cementParts);
    setSandParts(p.sandParts);
    setDryFactor(p.dryFactor);
    setWastagePct(p.wastagePct);
    setCementDensity(p.cementDensity);
    setBagWeight(p.bagWeight);
  };

  const calc = useMemo(() => {
    const l = parsePos(lengthM);
    const h = parsePos(heightM);
    const t = parsePos(thickMm);
    const frac = parsePos(mortarFraction);
    const cp = parsePos(cementParts);
    const sp = parsePos(sandParts);
    const df = parsePos(dryFactor);
    const waste = parseNonNeg(wastagePct);
    const rho = parsePos(cementDensity);
    const bag = parsePos(bagWeight);

    if (
      l === null ||
      h === null ||
      t === null ||
      frac === null ||
      cp === null ||
      sp === null ||
      df === null ||
      waste === null ||
      rho === null ||
      bag === null ||
      frac > 1 ||
      df < 1 ||
      waste >= 100
    ) {
      return {
        valid: false as const,
        error:
          'All inputs must be positive; mortar volume fraction <= 1, dry bulk factor >= 1.0, and wastage in [0, 100)%.',
      };
    }

    const wallVol = l * h * (t / 1000);
    const wetVol = wallVol * frac;
    const dryVol = wetVol * df * (1 + waste / 100);
    const partsTotal = cp + sp;
    const cementVol = dryVol * (cp / partsTotal);
    const sandVol = dryVol * (sp / partsTotal);
    const cementKg = cementVol * rho;
    const bags = Math.ceil(cementKg / bag);

    return {
      valid: true as const,
      error: '',
      wallVol,
      wetVol,
      dryVol,
      cementVol,
      sandVol,
      cementKg,
      bags,
    };
  }, [lengthM, heightM, thickMm, mortarFraction, cementParts, sandParts, dryFactor, wastagePct, cementDensity, bagWeight]);

  const handleCopy = async () => {
    if (!calc.valid) return;
    const summary = `Wall=${calc.wallVol.toFixed(4)} m3 | WetMortar=${calc.wetVol.toFixed(4)} m3 | DryMortar=${calc.dryVol.toFixed(4)} m3 | Cement=${calc.cementKg.toFixed(2)} kg (${calc.bags} bags) | Sand=${calc.sandVol.toFixed(4)} m3`;
    try {
      await navigator.clipboard?.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!calc.valid) return;
    const rows = [
      ['item', 'value', 'unit'],
      ['wall_gross_volume', calc.wallVol.toFixed(4), 'm3'],
      ['net_wet_mortar_volume', calc.wetVol.toFixed(4), 'm3'],
      ['dry_material_volume_with_wastage', calc.dryVol.toFixed(4), 'm3'],
      ['cement_volume', calc.cementVol.toFixed(4), 'm3'],
      ['cement_mass', calc.cementKg.toFixed(2), 'kg'],
      ['cement_bags_ceil', String(calc.bags), 'bags'],
      ['sand_volume', calc.sandVol.toFixed(4), 'm3'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mortar-quantity-estimate.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fields = [
    { id: 'length', label: 'Wall Length (m)', val: lengthM, set: setLengthM },
    { id: 'height', label: 'Wall Height (m)', val: heightM, set: setHeightM },
    { id: 'thick', label: 'Wall Thickness (mm)', val: thickMm, set: setThickMm },
    { id: 'fraction', label: 'Assumed Mortar Volume Ratio (0-1)', val: mortarFraction, set: setMortarFraction },
    { id: 'cement-parts', label: 'Mix Ratio: Cement Parts', val: cementParts, set: setCementParts },
    { id: 'sand-parts', label: 'Mix Ratio: Sand Parts', val: sandParts, set: setSandParts },
    { id: 'dry-factor', label: 'Assumed Dry-to-Wet Bulk Factor', val: dryFactor, set: setDryFactor },
    { id: 'wastage', label: 'Assumed Site Wastage (%)', val: wastagePct, set: setWastagePct },
    { id: 'density', label: 'Assumed Cement Loose Density (kg/m³)', val: cementDensity, set: setCementDensity },
    { id: 'bag', label: 'Cement Bag Weight (kg)', val: bagWeight, set: setBagWeight },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Masonry &amp; Mix Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">All assumptions editable</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {fields.map((f) => (
              <div key={f.id}>
                <label htmlFor={`mortar-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  {f.label}
                </label>
                <input
                  id={`mortar-${f.id}`}
                  type="text"
                  inputMode="decimal"
                  data-testid={`input-${f.id}`}
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={() => applyPreset(PRESETS[0])}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Mortar &amp; Ingredient Quantities</h2>
              </div>
              <span
                data-testid="badge-status"
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  calc.valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {calc.valid ? 'ESTIMATE READY' : 'INVALID INPUT'}
              </span>
            </div>

            {!calc.valid && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-semibold text-amber-800">
                {calc.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Dry Mix Volume (w/ Wastage)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-dry-vol">{fmt(calc.valid ? calc.dryVol : null, 4)}</span>
                  <span className="text-base text-blue-500 ml-1.5">m³</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Cement Bags (Rounded Up)</div>
                <div className="text-3xl font-black text-emerald-800">
                  <span data-testid="result-bags">{calc.valid ? calc.bags : '—'}</span>
                  <span className="text-base text-emerald-500 ml-1.5">bags</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-bold text-orange-600 uppercase mb-1">Sand Volume</div>
                <div className="text-xl font-black text-orange-800">
                  <span data-testid="result-sand-vol">{fmt(calc.valid ? calc.sandVol : null, 4)}</span>
                  <span className="text-xs text-orange-600 ml-1">m³</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Cement Mass</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-cement-kg">{fmt(calc.valid ? calc.cementKg : null, 2)}</span>
                  <span className="text-xs text-slate-500 ml-1">kg</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Net Wet Mortar</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-wet-vol">{fmt(calc.valid ? calc.wetVol : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">m³</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Gross Wall Vol</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-wall-vol">{fmt(calc.valid ? calc.wallVol : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">m³</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!calc.valid}
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                data-testid="btn-download"
                disabled={!calc.valid}
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                V_wall = L·H·(T/1000); V_wet = V_wall·r; V_dry = V_wet·k_dry·(1 + w/100); split proportionally by volumetric parts (cement : sand). Verify mix proportions and bulk densities against project specifications.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
