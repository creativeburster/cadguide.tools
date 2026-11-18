'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Layers, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

type ElementType = 'wall' | 'column' | 'slab' | 'beam';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
const INT_RE = /^\d+$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function parsePosInt(raw: string): number | null {
  const t = raw.trim();
  if (!INT_RE.test(t)) return null;
  const v = Number(t);
  return Number.isInteger(v) && v >= 1 ? v : null;
}

const MODE_LABELS: Record<ElementType, { d1: string; d2: string; d3: string; areaNote: string }> = {
  wall: {
    d1: 'Wall Length (m)',
    d2: 'Wall Height (m)',
    d3: 'Thickness (mm)',
    areaNote: 'Both vertical faces (2 x L x H x N)',
  },
  column: {
    d1: 'Column Width (mm)',
    d2: 'Column Depth (mm)',
    d3: 'Column Height (m)',
    areaNote: 'Four perimeter sides (2 x (b + h) x H x N)',
  },
  slab: {
    d1: 'Slab Length (m)',
    d2: 'Slab Width (m)',
    d3: 'Slab Thickness (mm)',
    areaNote: 'Soffit formwork area (L x W x N)',
  },
  beam: {
    d1: 'Beam Span (m)',
    d2: 'Beam Width (mm)',
    d3: 'Beam Depth (mm)',
    areaNote: 'Soffit + 2 side faces (L x (b + 2h) x N)',
  },
};

export default function IfcElementQuantityCalculatorClient() {
  const [elementType, setElementType] = useState<ElementType>('wall');
  const [dim1Str, setDim1Str] = useState('6');
  const [dim2Str, setDim2Str] = useState('3');
  const [dim3Str, setDim3Str] = useState('200');
  const [qtyStr, setQtyStr] = useState('4');
  const [densityStr, setDensityStr] = useState('2400');
  const [rebarRatioStr, setRebarRatioStr] = useState('110');
  const [copied, setCopied] = useState(false);

  const d1 = parsePos(dim1Str);
  const d2 = parsePos(dim2Str);
  const d3 = parsePos(dim3Str);
  const qty = parsePosInt(qtyStr);
  const density = parsePos(densityStr);
  const rebarRatio = parsePos(rebarRatioStr);

  const isValid =
    d1 !== null &&
    d2 !== null &&
    d3 !== null &&
    qty !== null &&
    density !== null &&
    rebarRatio !== null;

  let unitVolume: number | null = null;
  let totalVolume: number | null = null;
  let formworkArea: number | null = null;
  let concreteMass: number | null = null;
  let rebarMass: number | null = null;

  if (isValid && d1 !== null && d2 !== null && d3 !== null && qty !== null && density !== null && rebarRatio !== null) {
    if (elementType === 'wall') {
      const tM = d3 / 1000;
      unitVolume = d1 * d2 * tM;
      totalVolume = unitVolume * qty;
      formworkArea = 2 * d1 * d2 * qty;
    } else if (elementType === 'column') {
      const bM = d1 / 1000;
      const hM = d2 / 1000;
      unitVolume = bM * hM * d3;
      totalVolume = unitVolume * qty;
      formworkArea = 2 * (bM + hM) * d3 * qty;
    } else if (elementType === 'slab') {
      const tM = d3 / 1000;
      unitVolume = d1 * d2 * tM;
      totalVolume = unitVolume * qty;
      formworkArea = d1 * d2 * qty;
    } else {
      const bM = d2 / 1000;
      const hM = d3 / 1000;
      unitVolume = d1 * bM * hM;
      totalVolume = unitVolume * qty;
      formworkArea = d1 * (bM + 2 * hM) * qty;
    }
    concreteMass = totalVolume * density;
    rebarMass = totalVolume * rebarRatio;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (
    type: ElementType,
    s1: string,
    s2: string,
    s3: string,
    sq: string,
    sd: string,
    sr: string
  ) => {
    setElementType(type);
    setDim1Str(s1);
    setDim2Str(s2);
    setDim3Str(s3);
    setQtyStr(sq);
    setDensityStr(sd);
    setRebarRatioStr(sr);
  };

  const handleReset = () => applyPreset('wall', '6', '3', '200', '4', '2400', '110');

  const handleCopy = async () => {
    if (!isValid || totalVolume === null || formworkArea === null || concreteMass === null || rebarMass === null) return;
    const text = [
      'IFC Element Quantity Takeoff (ISO 16739-1)',
      `Element Type: ${elementType.toUpperCase()}`,
      `Quantity: ${qty} pcs`,
      `Total Concrete Volume: ${totalVolume.toFixed(3)} m3`,
      `Formwork Area: ${formworkArea.toFixed(2)} m2`,
      `Concrete Mass: ${concreteMass.toFixed(1)} kg`,
      `Estimated Rebar Mass: ${rebarMass.toFixed(1)} kg`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!isValid || unitVolume === null || totalVolume === null || formworkArea === null || concreteMass === null || rebarMass === null) return;
    const rows = [
      ['metric', 'value', 'unit'],
      ['element_type', elementType, 'ifc_class'],
      ['quantity', String(qty), 'pcs'],
      ['unit_volume', unitVolume.toFixed(6), 'm3'],
      ['total_volume', totalVolume.toFixed(6), 'm3'],
      ['formwork_area', formworkArea.toFixed(4), 'm2'],
      ['concrete_mass_kg', concreteMass.toFixed(2), 'kg'],
      ['rebar_mass_kg', rebarMass.toFixed(2), 'kg'],
      ['total_mass_tonnes', ((concreteMass + rebarMass) / 1000).toFixed(4), 't'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ifc-${elementType}-takeoff.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const labels = MODE_LABELS[elementType];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Element Parameters</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-rc-wall"
                onClick={() => applyPreset('wall', '6', '3', '200', '4', '2400', '110')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200 transition-colors"
              >
                RC Shear Wall (6x3 m x 200 mm, x4)
              </button>
              <button
                type="button"
                data-testid="preset-rc-column"
                onClick={() => applyPreset('column', '400', '400', '4', '6', '2400', '150')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Grid Column (400x400 mm x 4 m, x6)
              </button>
              <button
                type="button"
                data-testid="preset-floor-slab"
                onClick={() => applyPreset('slab', '12', '8', '180', '2', '2400', '95')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Floor Slab (12x8 m x 180 mm, x2)
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">IFC Element Class</div>
            <div className="grid grid-cols-2 gap-2">
              {(['wall', 'column', 'slab', 'beam'] as ElementType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  data-testid={`type-${t}`}
                  onClick={() => {
                    if (t === elementType) return;
                    if (t === 'wall') applyPreset('wall', '6', '3', '200', qtyStr, densityStr, rebarRatioStr);
                    else if (t === 'column') applyPreset('column', '400', '400', '4', qtyStr, densityStr, rebarRatioStr);
                    else if (t === 'slab') applyPreset('slab', '12', '8', '180', qtyStr, densityStr, rebarRatioStr);
                    else applyPreset('beam', '8', '350', '600', qtyStr, densityStr, rebarRatioStr);
                  }}
                  className={`py-2 px-3 rounded-xl text-sm font-bold capitalize border transition-all ${
                    elementType === t
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Ifc{t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">{labels.d1}</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-dim1"
                value={dim1Str}
                onChange={e => setDim1Str(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">{labels.d2}</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-dim2"
                value={dim2Str}
                onChange={e => setDim2Str(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">{labels.d3}</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-dim3"
                value={dim3Str}
                onChange={e => setDim3Str(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Quantity (pcs)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  data-testid="input-qty"
                  value={qtyStr}
                  onChange={e => setQtyStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Density (kg/m3)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-density"
                  value={densityStr}
                  onChange={e => setDensityStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Rebar Ratio (kg/m3)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-rebar"
                value={rebarRatioStr}
                onChange={e => setRebarRatioStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Enter strictly positive dimensions/densities and a whole integer quantity (&ge; 1).</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="button"
              data-testid="btn-copy"
              onClick={handleCopy}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              data-testid="btn-download"
              onClick={handleDownload}
              className="w-full py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export QTO CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">ISO 16739-1 Base Quantities</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Qto_BaseQuantities geometric volume, formwork area, and reinforcement mass takeoff
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <div className="text-sm font-black text-teal-600 uppercase tracking-wider mb-1">Total Concrete Volume</div>
                <div className="text-3xl font-black text-teal-900">
                  <span data-testid="result-volume">{fmt(totalVolume, 3)}</span>{' '}
                  <span className="text-lg text-teal-600">m3</span>
                </div>
                <div className="text-xs text-teal-700 mt-1 font-medium">
                  Per element: <span data-testid="result-unit-volume">{fmt(unitVolume, 3)}</span> m3
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Formwork Contact Area</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-formwork">{fmt(formworkArea, 2)}</span>{' '}
                  <span className="text-lg text-blue-600">m2</span>
                </div>
                <div className="text-xs text-blue-700 mt-1 font-medium">{labels.areaNote}</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Concrete Mass</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-concrete-mass">{fmt(concreteMass, 1)}</span>{' '}
                  <span className="text-lg text-slate-500">kg</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Estimated Rebar Mass</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-rebar-mass">{fmt(rebarMass, 1)}</span>{' '}
                  <span className="text-lg text-orange-600">kg</span>
                </div>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
