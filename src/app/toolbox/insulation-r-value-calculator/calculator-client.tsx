'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Layers, Plus, Trash2, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

interface LayerItem {
  id: string;
  name: string;
  thickStr: string;
  kStr: string;
}

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function parseNonNeg(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v >= 0 ? v : null;
}

const DEFAULT_LAYERS: LayerItem[] = [
  { id: '1', name: 'Gypsum Plasterboard', thickStr: '12.5', kStr: '0.21' },
  { id: '2', name: 'Mineral Wool Batts', thickStr: '120', kStr: '0.036' },
  { id: '3', name: 'Outer Brick Leaf', thickStr: '105', kStr: '0.77' },
];

export default function InsulationRValueCalculatorClient() {
  const [layers, setLayers] = useState<LayerItem[]>(DEFAULT_LAYERS);
  const [rSiStr, setRSiStr] = useState('0.13');
  const [rSeStr, setRSeStr] = useState('0.04');
  const [dtStr, setDtStr] = useState('20');
  const [copied, setCopied] = useState(false);

  const rSi = parseNonNeg(rSiStr);
  const rSe = parseNonNeg(rSeStr);
  const deltaT = parseNonNeg(dtStr);

  // Pure function evaluation (no manual useMemo around array loops for React Compiler compatibility)
  let layerValid = layers.length >= 1;
  let conductiveR = 0;
  const parsedLayers: { name: string; thickMm: number; kVal: number; rVal: number }[] = [];

  for (const item of layers) {
    const tMm = parsePos(item.thickStr);
    const kVal = parsePos(item.kStr);
    if (tMm === null || kVal === null) {
      layerValid = false;
      break;
    }
    const rVal = (tMm / 1000) / kVal;
    conductiveR += rVal;
    parsedLayers.push({ name: item.name.trim() || 'Layer', thickMm: tMm, kVal, rVal });
  }

  const isValid = layerValid && rSi !== null && rSe !== null && deltaT !== null;
  const totalR = isValid && rSi !== null && rSe !== null ? rSi + conductiveR + rSe : null;
  const uValue = totalR !== null && totalR > 0 ? 1 / totalR : null;
  const heatFlux = uValue !== null && deltaT !== null ? uValue * deltaT : null;
  const totalRImperial = totalR !== null ? totalR * 5.678263337 : null;

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const updateLayer = (idx: number, field: keyof LayerItem, value: string) => {
    setLayers(prev => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const addLayer = () => {
    setLayers(prev => [...prev, { id: String(Date.now()), name: `Layer ${prev.length + 1}`, thickStr: '50', kStr: '0.04' }]);
  };

  const removeLayer = (idx: number) => {
    if (layers.length <= 1) return;
    setLayers(prev => prev.filter((_, i) => i !== idx));
  };

  const applyPreset = (newLayers: LayerItem[], rsi: string, rse: string, dt: string) => {
    setLayers(newLayers);
    setRSiStr(rsi);
    setRSeStr(rse);
    setDtStr(dt);
  };

  const handleReset = () => applyPreset(DEFAULT_LAYERS, '0.13', '0.04', '20');

  const handleCopy = async () => {
    if (!isValid || totalR === null || uValue === null || heatFlux === null) return;
    const text = [
      'Multi-Layer Thermal Resistance Summary',
      `Total R-Value: ${totalR.toFixed(3)} m2K/W (R-${totalRImperial?.toFixed(2)} US)`,
      `U-Value: ${uValue.toFixed(3)} W/m2K, Heat Flux (dT=${deltaT} K): ${heatFlux.toFixed(2)} W/m2`,
      ...parsedLayers.map(l => `- ${l.name}: ${l.thickMm} mm @ k=${l.kVal} W/mK -> R=${l.rVal.toFixed(3)}`),
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
    if (!isValid || totalR === null || uValue === null || heatFlux === null) return;
    const rows = [
      ['layer', 'thickness_mm', 'k_W_mK', 'r_m2K_W'],
      ['interior_surface_film', '', '', (rSi ?? 0).toFixed(4)],
      ...parsedLayers.map(l => [l.name.replace(/,/g, ' '), String(l.thickMm), String(l.kVal), l.rVal.toFixed(4)]),
      ['exterior_surface_film', '', '', (rSe ?? 0).toFixed(4)],
      ['TOTAL_R_VALUE', '', '', totalR.toFixed(4)],
      ['U_VALUE_W_m2K', '', '', uValue.toFixed(4)],
      ['HEAT_FLUX_W_m2', '', '', heatFlux.toFixed(4)],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'insulation-r-value-assembly.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Assembly Layers</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-cavity-wall"
                onClick={() => applyPreset(DEFAULT_LAYERS, '0.13', '0.04', '20')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Insulated Brick Cavity Wall (3 Layers)
              </button>
              <button
                type="button"
                data-testid="preset-coldroom-panel"
                onClick={() =>
                  applyPreset(
                    [
                      { id: 'c1', name: 'Steel Inner Skin', thickStr: '0.6', kStr: '50' },
                      { id: 'c2', name: 'PU Core', thickStr: '150', kStr: '0.024' },
                      { id: 'c3', name: 'Steel Outer Skin', thickStr: '0.6', kStr: '50' },
                    ],
                    '0.13',
                    '0.04',
                    '42'
                  )
                }
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Cold-Room PU Sandwich (150 mm, dT=42 K)
              </button>
              <button
                type="button"
                data-testid="preset-warm-roof"
                onClick={() =>
                  applyPreset(
                    [
                      { id: 'r1', name: 'Plasterboard', thickStr: '12.5', kStr: '0.21' },
                      { id: 'r2', name: 'PIR Foil Board', thickStr: '160', kStr: '0.022' },
                      { id: 'r3', name: 'OSB Deck', thickStr: '18', kStr: '0.13' },
                    ],
                    '0.10',
                    '0.04',
                    '24'
                  )
                }
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Warm Roof Deck (160 mm PIR)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {layers.map((layer, idx) => (
              <div key={layer.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={layer.name}
                    onChange={e => updateLayer(idx, 'name', e.target.value)}
                    className="flex-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                  />
                  {layers.length > 1 && (
                    <button
                      type="button"
                      data-testid={`btn-remove-layer-${idx}`}
                      onClick={() => removeLayer(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                      aria-label="Remove layer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase block mb-0.5">Thick (mm)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      data-testid={`layer-thick-${idx}`}
                      value={layer.thickStr}
                      onChange={e => updateLayer(idx, 'thickStr', e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg bg-white border border-slate-200 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase block mb-0.5">k (W/mK)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      data-testid={`layer-k-${idx}`}
                      value={layer.kStr}
                      onChange={e => updateLayer(idx, 'kStr', e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg bg-white border border-slate-200 text-sm font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              data-testid="btn-add-layer"
              onClick={addLayer}
              className="w-full py-2 rounded-xl border border-dashed border-orange-300 text-orange-700 hover:bg-orange-50 text-xs font-bold flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Layer
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">R_si</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-rsi"
                value={rSiStr}
                onChange={e => setRSiStr(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">R_se</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-rse"
                value={rSeStr}
                onChange={e => setRSeStr(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">dT (K)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-dt"
                value={dtStr}
                onChange={e => setDtStr(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Layer thickness &amp; k must be &gt; 0; surface films R_si, R_se and dT must be &ge; 0.</span>
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Thermal Resistance &amp; U-Value</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Series Fourier slab conduction: R_total = R_si + sum(t_i / k_i) + R_se, U = 1 / R_total
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Total R-Value (SI)</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-r-total">{fmt(totalR, 3)}</span>{' '}
                  <span className="text-lg text-orange-600">m2K/W</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Thermal Transmittance (U)</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-u-value">{fmt(uValue, 4)}</span>{' '}
                  <span className="text-lg text-blue-600">W/m2K</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">US R-Value Equivalent</div>
                <div className="text-3xl font-black text-emerald-900">
                  R-<span data-testid="result-r-us">{fmt(totalRImperial, 2)}</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-sm font-black text-purple-600 uppercase tracking-wider mb-1">Steady Heat Flux</div>
                <div className="text-3xl font-black text-purple-900">
                  <span data-testid="result-heat-flux">{fmt(heatFlux, 2)}</span>{' '}
                  <span className="text-lg text-purple-600">W/m2</span>
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
