'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Gauge, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

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

export default function ManifoldPressureCalculatorClient() {
  const [diaMmStr, setDiaMmStr] = useState('50');
  const [lenMStr, setLenMStr] = useState('12');
  const [outletsStr, setOutletsStr] = useState('6');
  const [flowLpmStr, setFlowLpmStr] = useState('180');
  const [rhoStr, setRhoStr] = useState('998');
  const [frictionStr, setFrictionStr] = useState('0.022');
  const [copied, setCopied] = useState(false);

  const diaMm = parsePos(diaMmStr);
  const lenM = parsePos(lenMStr);
  const outlets = parsePosInt(outletsStr);
  const flowLpm = parsePos(flowLpmStr);
  const rho = parsePos(rhoStr);
  const f = parsePos(frictionStr);

  const isValid =
    diaMm !== null && lenM !== null && outlets !== null && flowLpm !== null && rho !== null && f !== null;

  let totalDpPa: number | null = null;
  let totalDpKpa: number | null = null;
  let inletVel: number | null = null;
  let dynHeadKpa: number | null = null;

  if (isValid && diaMm !== null && lenM !== null && outlets !== null && flowLpm !== null && rho !== null && f !== null) {
    const diaM = diaMm / 1000;
    const areaM2 = Math.PI * Math.pow(diaM / 2, 2);
    const qTotalM3s = flowLpm / 60000;
    const segLenM = lenM / outlets;
    let sumPa = 0;

    // Pure loop across uniform branch takeoffs (no useMemo around local array loops)
    for (let i = 1; i <= outlets; i += 1) {
      const qi = qTotalM3s * ((outlets - i + 1) / outlets);
      const vi = qi / areaM2;
      sumPa += f * (segLenM / diaM) * 0.5 * rho * vi * vi;
    }

    totalDpPa = sumPa;
    totalDpKpa = sumPa / 1000;
    inletVel = qTotalM3s / areaM2;
    dynHeadKpa = (0.5 * rho * inletVel * inletVel) / 1000;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (d: string, l: string, n: string, q: string, r: string, fr: string) => {
    setDiaMmStr(d);
    setLenMStr(l);
    setOutletsStr(n);
    setFlowLpmStr(q);
    setRhoStr(r);
    setFrictionStr(fr);
  };

  const handleReset = () => applyPreset('50', '12', '6', '180', '998', '0.022');

  const handleCopy = async () => {
    if (!isValid || totalDpKpa === null || totalDpPa === null || inletVel === null || dynHeadKpa === null) return;
    const text = [
      'Distribution Manifold Darcy-Weisbach Pressure Drop',
      `ID=${diaMm} mm, Length=${lenM} m, Outlets=${outlets}, Flow=${flowLpm} L/min, f=${f}`,
      `Total Friction Loss: ${totalDpKpa.toFixed(4)} kPa (${totalDpPa.toFixed(2)} Pa)`,
      `Inlet Velocity: ${inletVel.toFixed(4)} m/s, Dynamic Pressure: ${dynHeadKpa.toFixed(4)} kPa`,
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
    if (!isValid || totalDpKpa === null || totalDpPa === null || inletVel === null || dynHeadKpa === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['header_id_mm', String(diaMm), 'mm'],
      ['header_length_m', String(lenM), 'm'],
      ['outlet_count', String(outlets), 'pcs'],
      ['total_flow_lpm', String(flowLpm), 'L/min'],
      ['fluid_density', String(rho), 'kg/m3'],
      ['darcy_friction_f', String(f), 'ratio'],
      ['total_pressure_drop_kpa', totalDpKpa.toFixed(5), 'kPa'],
      ['total_pressure_drop_pa', totalDpPa.toFixed(2), 'Pa'],
      ['inlet_velocity_m_s', inletVel.toFixed(4), 'm/s'],
      ['inlet_dynamic_pressure_kpa', dynHeadKpa.toFixed(5), 'kPa'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifold-pressure-drop.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Gauge className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Manifold Header Inputs</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-water-6out"
                onClick={() => applyPreset('50', '12', '6', '180', '998', '0.022')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
              >
                Water Loop (50 mm ID, 12 m, 6 outlets, 180 L/min)
              </button>
              <button
                type="button"
                data-testid="preset-cooling-12out"
                onClick={() => applyPreset('80', '24', '12', '480', '998', '0.02')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
              >
                Chiller Header (80 mm ID, 24 m, 12 outlets)
              </button>
              <button
                type="button"
                data-testid="preset-air-4out"
                onClick={() => applyPreset('32', '6', '4', '300', '1.225', '0.024')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
              >
                Air Header (32 mm ID, 6 m, 4 outlets, 300 L/min)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Header ID (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-dia"
                  value={diaMmStr}
                  onChange={e => setDiaMmStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Header Len (m)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-len"
                  value={lenMStr}
                  onChange={e => setLenMStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Outlets N</label>
                <input
                  type="text"
                  inputMode="numeric"
                  data-testid="input-outlets"
                  value={outletsStr}
                  onChange={e => setOutletsStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Total Flow (L/min)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-flow"
                  value={flowLpmStr}
                  onChange={e => setFlowLpmStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Density (kg/m3)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-rho"
                  value={rhoStr}
                  onChange={e => setRhoStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Friction f</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-friction"
                  value={frictionStr}
                  onChange={e => setFrictionStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>All fluid/pipe values must be &gt; 0 and outlet count N must be an integer &ge; 1.</span>
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
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Segmented Header Friction Loss</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Uniform branch splits: sum(i=1..N) of f * (L_seg / D) * 0.5 * rho * v_i^2
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <div className="text-sm font-black text-teal-600 uppercase tracking-wider mb-1">Total Friction Drop</div>
                <div className="text-3xl font-black text-teal-900">
                  <span data-testid="result-dp-kpa">{fmt(totalDpKpa, 4)}</span>{' '}
                  <span className="text-lg text-teal-600">kPa</span>
                </div>
                <div className="text-xs text-teal-700 mt-1 font-medium">
                  <span data-testid="result-dp-pa">{fmt(totalDpPa, 2)}</span> Pa
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Inlet Header Velocity</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-vel">{fmt(inletVel, 4)}</span>{' '}
                  <span className="text-lg text-blue-600">m/s</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sm:col-span-2">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Inlet Dynamic Pressure (0.5*rho*v^2)</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-dyn">{fmt(dynHeadKpa, 4)}</span>{' '}
                  <span className="text-lg text-slate-500">kPa</span>
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
