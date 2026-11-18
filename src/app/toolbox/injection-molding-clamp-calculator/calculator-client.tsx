'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Box, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

type PartShape = 'rect' | 'disc';

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

export default function InjectionMoldingClampCalculatorClient() {
  const [shape, setShape] = useState<PartShape>('rect');
  const [dim1Str, setDim1Str] = useState('180');
  const [dim2Str, setDim2Str] = useState('120');
  const [wallStr, setWallStr] = useState('2.2');
  const [flowLenStr, setFlowLenStr] = useState('160');
  const [cavitiesStr, setCavitiesStr] = useState('2');
  const [pressureStr, setPressureStr] = useState('42');
  const [safetyStr, setSafetyStr] = useState('1.15');
  const [copied, setCopied] = useState(false);

  const d1 = parsePos(dim1Str);
  const d2 = shape === 'rect' ? parsePos(dim2Str) : 1;
  const wall = parsePos(wallStr);
  const flowLen = parsePos(flowLenStr);
  const cavities = parsePosInt(cavitiesStr);
  const pressure = parsePos(pressureStr);
  const sf = parsePos(safetyStr);

  const isValid =
    d1 !== null &&
    d2 !== null &&
    wall !== null &&
    flowLen !== null &&
    cavities !== null &&
    pressure !== null &&
    sf !== null &&
    sf >= 1;

  let singleAreaCm2: number | null = null;
  let totalAreaCm2: number | null = null;
  let clampKn: number | null = null;
  let clampTonnes: number | null = null;
  let flowRatio: number | null = null;

  if (isValid && d1 !== null && d2 !== null && wall !== null && flowLen !== null && cavities !== null && pressure !== null && sf !== null) {
    const areaMm2 = shape === 'rect' ? d1 * d2 : Math.PI * Math.pow(d1 / 2, 2);
    singleAreaCm2 = areaMm2 / 100;
    totalAreaCm2 = singleAreaCm2 * cavities;
    clampKn = totalAreaCm2 * pressure * 0.1 * sf;
    clampTonnes = clampKn / 9.80665;
    flowRatio = flowLen / wall;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (
    s: PartShape,
    a: string,
    b: string,
    w: string,
    fl: string,
    c: string,
    p: string,
    sfVal: string
  ) => {
    setShape(s);
    setDim1Str(a);
    setDim2Str(b);
    setWallStr(w);
    setFlowLenStr(fl);
    setCavitiesStr(c);
    setPressureStr(p);
    setSafetyStr(sfVal);
  };

  const handleReset = () => applyPreset('rect', '180', '120', '2.2', '160', '2', '42', '1.15');

  const handleCopy = async () => {
    if (!isValid || totalAreaCm2 === null || clampKn === null || clampTonnes === null || flowRatio === null) return;
    const text = [
      'Injection Molding Machine Clamp Sizing',
      `Shape: ${shape}, Cavities: ${cavities}, Total Projected Area: ${totalAreaCm2.toFixed(2)} cm2`,
      `Required Clamp: ${clampTonnes.toFixed(2)} tonnes (${clampKn.toFixed(2)} kN)`,
      `Flow-Length-to-Wall Ratio (L/t): ${flowRatio.toFixed(1)}:1`,
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
    if (!isValid || singleAreaCm2 === null || totalAreaCm2 === null || clampKn === null || clampTonnes === null || flowRatio === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['shape', shape, 'mode'],
      ['single_part_area_cm2', singleAreaCm2.toFixed(4), 'cm2'],
      ['cavities', String(cavities), 'pcs'],
      ['total_area_cm2', totalAreaCm2.toFixed(4), 'cm2'],
      ['cavity_pressure_mpa', String(pressure), 'MPa'],
      ['safety_factor', String(sf), 'ratio'],
      ['clamp_force_kn', clampKn.toFixed(4), 'kN'],
      ['clamp_force_tonnes', clampTonnes.toFixed(4), 'tonnes'],
      ['flow_length_to_wall_ratio', flowRatio.toFixed(2), 'ratio'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'injection-molding-clamp-sizing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Box className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Part &amp; Cavity Geometry</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-enclosure-2cav"
                onClick={() => applyPreset('rect', '180', '120', '2.2', '160', '2', '42', '1.15')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200 transition-colors"
              >
                2-Cavity Rect Enclosure (180x120 mm, t=2.2 mm)
              </button>
              <button
                type="button"
                data-testid="preset-thinwall-tray"
                onClick={() => applyPreset('rect', '220', '150', '0.9', '175', '4', '65', '1.2')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200 transition-colors"
              >
                4-Cavity Thin-Wall Tray (220x150 mm, t=0.9 mm)
              </button>
              <button
                type="button"
                data-testid="preset-disc-gear"
                onClick={() => applyPreset('disc', '110', '110', '4.0', '55', '6', '38', '1.15')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200 transition-colors"
              >
                6-Cavity Circular Gear Blank (D=110 mm)
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              data-testid="shape-rect"
              onClick={() => setShape('rect')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border ${
                shape === 'rect' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Rectangular
            </button>
            <button
              type="button"
              data-testid="shape-disc"
              onClick={() => setShape('disc')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border ${
                shape === 'disc' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Circular Disc
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  {shape === 'rect' ? 'Length L (mm)' : 'Diameter D (mm)'}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-dim1"
                  value={dim1Str}
                  onChange={e => setDim1Str(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
              {shape === 'rect' && (
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Width W (mm)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    data-testid="input-dim2"
                    value={dim2Str}
                    onChange={e => setDim2Str(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Wall t (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-wall"
                  value={wallStr}
                  onChange={e => setWallStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Flow Len (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-flow"
                  value={flowLenStr}
                  onChange={e => setFlowLenStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Cavities</label>
                <input
                  type="text"
                  inputMode="numeric"
                  data-testid="input-cavities"
                  value={cavitiesStr}
                  onChange={e => setCavitiesStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">MPa</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-pressure"
                  value={pressureStr}
                  onChange={e => setPressureStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">SF (&ge;1)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-safety"
                  value={safetyStr}
                  onChange={e => setSafetyStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Dimensions, pressure must be &gt; 0, cavities integer &ge; 1, and safety factor &ge; 1.0.</span>
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center justify-center gap-1.5"
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Tonnage &amp; L/t Ratio Sizing</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Projected area computed from nominal geometry; L/t assesses mold filling difficulty
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <div className="text-sm font-black text-indigo-600 uppercase tracking-wider mb-1">Required Clamp Tonnage</div>
                <div className="text-3xl font-black text-indigo-900">
                  <span data-testid="result-tonnes">{fmt(clampTonnes, 2)}</span>{' '}
                  <span className="text-lg text-indigo-600">tonnes</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Clamping Force (kN)</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-kn">{fmt(clampKn, 2)}</span>{' '}
                  <span className="text-lg text-blue-600">kN</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Total Projected Area</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-total-area">{fmt(totalAreaCm2, 2)}</span>{' '}
                  <span className="text-lg text-emerald-600">cm2</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Flow-to-Wall Ratio (L/t)</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-flow-ratio">{fmt(flowRatio, 2)}</span>{' '}
                  <span className="text-lg text-orange-600">: 1</span>
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
