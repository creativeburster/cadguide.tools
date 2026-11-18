'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Box, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

type ShapeType = 'plate' | 'round_bar' | 'hollow_tube' | 'rect_tube';

interface MatPreset {
  id: string;
  label: string;
  rhoKgM3: string;
}

const VERIFIED_DENSITIES: MatPreset[] = [
  { id: 'steel', label: 'Carbon Steel (7850 kg/m3)', rhoKgM3: '7850' },
  { id: 'al6061', label: 'Aluminum 6061 (2700 kg/m3)', rhoKgM3: '2700' },
  { id: 'al7075', label: 'Aluminum 7075-T6 (2810 kg/m3)', rhoKgM3: '2810' },
  { id: 'copper', label: 'Copper at 20 C (8935 kg/m3)', rhoKgM3: '8935' },
  { id: 'ti64', label: 'Titanium Ti-6Al-4V (4429 kg/m3)', rhoKgM3: '4429' },
  { id: 'ptfe', label: 'PTFE (2200 kg/m3)', rhoKgM3: '2200' },
  { id: 'peek', label: 'PEEK (1320 kg/m3)', rhoKgM3: '1320' },
];

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

export default function MaterialDensityCalculatorClient() {
  const [shape, setShape] = useState<ShapeType>('plate');
  const [rhoStr, setRhoStr] = useState('7850');
  const [d1Str, setD1Str] = useState('500');
  const [d2Str, setD2Str] = useState('250');
  const [d3Str, setD3Str] = useState('12');
  const [d4Str, setD4Str] = useState('1000');
  const [qtyStr, setQtyStr] = useState('1');
  const [copied, setCopied] = useState(false);

  const rho = parsePos(rhoStr);
  const d1 = parsePos(d1Str);
  const d2 = parsePos(d2Str);
  const d3 = parsePos(d3Str);
  const d4 = shape === 'rect_tube' ? parsePos(d4Str) : 1;
  const qty = parsePosInt(qtyStr);

  let geomOk = rho !== null && d1 !== null && d2 !== null && d3 !== null && d4 !== null && qty !== null;
  if (geomOk && d1 !== null && d2 !== null && d3 !== null) {
    if (shape === 'hollow_tube' && d1 <= d2) geomOk = false; // OD > ID
    if (shape === 'rect_tube' && (d1 <= 2 * d3 || d2 <= 2 * d3)) geomOk = false; // W > 2t, H > 2t
  }

  let unitVolCm3: number | null = null;
  let totalVolCm3: number | null = null;
  let unitMassKg: number | null = null;
  let totalMassKg: number | null = null;
  let totalMassLb: number | null = null;

  if (geomOk && rho !== null && d1 !== null && d2 !== null && d3 !== null && d4 !== null && qty !== null) {
    let volMm3 = 0;
    if (shape === 'plate') {
      volMm3 = d1 * d2 * d3;
    } else if (shape === 'round_bar') {
      volMm3 = Math.PI * Math.pow(d1 / 2, 2) * d2;
    } else if (shape === 'hollow_tube') {
      volMm3 = Math.PI * (Math.pow(d1 / 2, 2) - Math.pow(d2 / 2, 2)) * d3;
    } else {
      volMm3 = (d1 * d2 - (d1 - 2 * d3) * (d2 - 2 * d3)) * d4;
    }
    unitVolCm3 = volMm3 / 1000;
    totalVolCm3 = unitVolCm3 * qty;
    unitMassKg = (volMm3 * 1e-9) * rho;
    totalMassKg = unitMassKg * qty;
    totalMassLb = totalMassKg / 0.45359237;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (s: ShapeType, r: string, s1: string, s2: string, s3: string, s4: string, q: string) => {
    setShape(s);
    setRhoStr(r);
    setD1Str(s1);
    setD2Str(s2);
    setD3Str(s3);
    setD4Str(s4);
    setQtyStr(q);
  };

  const handleReset = () => applyPreset('plate', '7850', '500', '250', '12', '1000', '1');

  const handleCopy = async () => {
    if (!geomOk || totalMassKg === null || totalMassLb === null || totalVolCm3 === null) return;
    const text = [
      `Stock Weight Calculation (${shape}, Qty ${qty})`,
      `Density: ${rho} kg/m3`,
      `Total Mass: ${totalMassKg.toFixed(4)} kg (${totalMassLb.toFixed(4)} lb)`,
      `Total Volume: ${totalVolCm3.toFixed(3)} cm3`,
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
    if (!geomOk || unitVolCm3 === null || totalVolCm3 === null || unitMassKg === null || totalMassKg === null || totalMassLb === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['shape', shape, 'profile'],
      ['density_kg_m3', String(rho), 'kg/m3'],
      ['quantity', String(qty), 'pcs'],
      ['unit_volume_cm3', unitVolCm3.toFixed(4), 'cm3'],
      ['total_volume_cm3', totalVolCm3.toFixed(4), 'cm3'],
      ['unit_mass_kg', unitMassKg.toFixed(5), 'kg'],
      ['total_mass_kg', totalMassKg.toFixed(5), 'kg'],
      ['total_mass_lb', totalMassLb.toFixed(5), 'lb'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `material-weight-${shape}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Box className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Stock Geometry &amp; Density</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-steel-plate"
                onClick={() => applyPreset('plate', '7850', '500', '250', '12', '1000', '1')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
              >
                Steel Plate (500x250x12 mm, 7850 kg/m3)
              </button>
              <button
                type="button"
                data-testid="preset-al6061-bar"
                onClick={() => applyPreset('round_bar', '2700', '40', '1000', '10', '1000', '2')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
              >
                Al 6061 Round Bar (D=40 x 1000 mm, x2)
              </button>
              <button
                type="button"
                data-testid="preset-ti-tube"
                onClick={() => applyPreset('hollow_tube', '4429', '50', '40', '500', '500', '1')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
              >
                Ti-6Al-4V Tube (50 OD / 40 ID x 500 mm)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['plate', 'Plate'],
                ['round_bar', 'Round Bar'],
                ['hollow_tube', 'Hollow Tube'],
                ['rect_tube', 'Rect Tube'],
              ] as [ShapeType, string][]
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                data-testid={`shape-${k}`}
                onClick={() => setShape(k)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold border ${
                  shape === k ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Material Density Preset</label>
              <select
                data-testid="select-material"
                value={VERIFIED_DENSITIES.find(m => m.rhoKgM3 === rhoStr)?.id ?? ''}
                onChange={e => {
                  const found = VERIFIED_DENSITIES.find(m => m.id === e.target.value);
                  if (found) setRhoStr(found.rhoKgM3);
                }}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold mb-2"
              >
                <option value="">Custom Density</option>
                {VERIFIED_DENSITIES.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-rho"
                value={rhoStr}
                onChange={e => setRhoStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                  {shape === 'plate' ? 'Length L (mm)' : shape === 'round_bar' ? 'Diameter D (mm)' : shape === 'hollow_tube' ? 'Outer OD (mm)' : 'Width W (mm)'}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-d1"
                  value={d1Str}
                  onChange={e => setD1Str(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                  {shape === 'plate' ? 'Width W (mm)' : shape === 'round_bar' ? 'Length L (mm)' : shape === 'hollow_tube' ? 'Inner ID (mm)' : 'Height H (mm)'}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-d2"
                  value={d2Str}
                  onChange={e => setD2Str(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {shape !== 'round_bar' && (
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                    {shape === 'plate' ? 'Thick t (mm)' : shape === 'hollow_tube' ? 'Length L (mm)' : 'Wall t (mm)'}
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    data-testid="input-d3"
                    value={d3Str}
                    onChange={e => setD3Str(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                  />
                </div>
              )}
              {shape === 'rect_tube' && (
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-1">Length L (mm)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    data-testid="input-d4"
                    value={d4Str}
                    onChange={e => setD4Str(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Quantity (pcs)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  data-testid="input-qty"
                  value={qtyStr}
                  onChange={e => setQtyStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          {!geomOk && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Verify all dimensions &gt; 0, integer qty &ge; 1, OD &gt; ID (hollow tube), and W,H &gt; 2t (rect tube).</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 flex items-center justify-center gap-1.5"
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
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Stock Volume &amp; Weight</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Mass = Volume x Density (1 kg = 2.20462262 lb)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Total Mass (kg)</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-mass-kg">{fmt(totalMassKg, 4)}</span>{' '}
                  <span className="text-lg text-orange-600">kg</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Total Weight (lb)</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-mass-lb">{fmt(totalMassLb, 4)}</span>{' '}
                  <span className="text-lg text-blue-600">lb</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Total Volume</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-vol-cm3">{fmt(totalVolCm3, 3)}</span>{' '}
                  <span className="text-lg text-emerald-600">cm3</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Mass Per Piece</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-unit-kg">{fmt(unitMassKg, 4)}</span>{' '}
                  <span className="text-lg text-slate-500">kg</span>
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
