'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Gauge, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export default function ManometerPressureCalculatorClient() {
  const [rhoStr, setRhoStr] = useState('998');
  const [colLenMmStr, setColLenMmStr] = useState('250');
  const [angleDegStr, setAngleDegStr] = useState('90');
  const [gravityStr, setGravityStr] = useState('9.80665');
  const [copied, setCopied] = useState(false);

  const rho = parsePos(rhoStr);
  const colLenMm = parsePos(colLenMmStr);
  const angleDeg = parsePos(angleDegStr);
  const g = parsePos(gravityStr);

  const angleOk = angleDeg !== null && angleDeg > 0 && angleDeg <= 90;
  const isValid = rho !== null && colLenMm !== null && angleOk && g !== null;

  let vertHm: number | null = null;
  let dpPa: number | null = null;
  let dpKpa: number | null = null;
  let dpMbar: number | null = null;
  let mmH2o: number | null = null;

  if (isValid && rho !== null && colLenMm !== null && angleDeg !== null && g !== null) {
    vertHm = (colLenMm / 1000) * Math.sin((angleDeg * Math.PI) / 180);
    dpPa = rho * g * vertHm;
    dpKpa = dpPa / 1000;
    dpMbar = dpPa / 100;
    mmH2o = dpPa / 9.80665;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (r: string, l: string, a: string, gv: string) => {
    setRhoStr(r);
    setColLenMmStr(l);
    setAngleDegStr(a);
    setGravityStr(gv);
  };

  const handleReset = () => applyPreset('998', '250', '90', '9.80665');

  const handleCopy = async () => {
    if (!isValid || dpPa === null || dpKpa === null || dpMbar === null || vertHm === null) return;
    const text = [
      'Manometer Hydrostatic Column Pressure Summary',
      `rho=${rho} kg/m3, L_col=${colLenMm} mm, Angle=${angleDeg} deg (Vert=${(vertHm * 1000).toFixed(2)} mm)`,
      `Differential Pressure: ${dpPa.toFixed(2)} Pa (${dpKpa.toFixed(4)} kPa / ${dpMbar.toFixed(3)} mbar)`,
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
    if (!isValid || dpPa === null || dpKpa === null || dpMbar === null || mmH2o === null || vertHm === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['fluid_density', String(rho), 'kg/m3'],
      ['column_reading_mm', String(colLenMm), 'mm'],
      ['tube_angle_deg', String(angleDeg), 'deg'],
      ['gravity', String(g), 'm/s2'],
      ['vertical_head_mm', (vertHm * 1000).toFixed(3), 'mm'],
      ['pressure_pa', dpPa.toFixed(3), 'Pa'],
      ['pressure_kpa', dpKpa.toFixed(5), 'kPa'],
      ['pressure_mbar', dpMbar.toFixed(4), 'mbar'],
      ['equiv_mmh2o', mmH2o.toFixed(3), 'mmH2O'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manometer-differential-pressure.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Manometer Column Inputs</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-u-water"
                onClick={() => applyPreset('998', '250', '90', '9.80665')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
              >
                Vertical Water U-Tube (250 mm, 998 kg/m3)
              </button>
              <button
                type="button"
                data-testid="preset-u-mercury"
                onClick={() => applyPreset('13546', '150', '90', '9.80665')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
              >
                Vertical Mercury U-Tube (150 mm, 13546 kg/m3)
              </button>
              <button
                type="button"
                data-testid="preset-inclined-30deg"
                onClick={() => applyPreset('820', '400', '30', '9.80665')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
              >
                Inclined Manometer 30 deg (400 mm, 820 kg/m3)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Manometer Fluid Density (kg/m3)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-rho"
                value={rhoStr}
                onChange={e => setRhoStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Scale Column Length L (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-col"
                value={colLenMmStr}
                onChange={e => setColLenMmStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Angle deg (0–90]</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-angle"
                  value={angleDegStr}
                  onChange={e => setAngleDegStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Gravity g (m/s2)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-gravity"
                  value={gravityStr}
                  onChange={e => setGravityStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Ensure density, column length, and gravity &gt; 0, and inclination angle in (0, 90] degrees.</span>
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Differential Pressure Readout</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                dP = rho * g * L * sin(theta)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <div className="text-sm font-black text-teal-600 uppercase tracking-wider mb-1">Pressure (Pa)</div>
                <div className="text-3xl font-black text-teal-900">
                  <span data-testid="result-pa">{fmt(dpPa, 2)}</span>{' '}
                  <span className="text-lg text-teal-600">Pa</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Pressure (kPa)</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-kpa">{fmt(dpKpa, 4)}</span>{' '}
                  <span className="text-lg text-blue-600">kPa</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Millibar (mbar / hPa)</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-mbar">{fmt(dpMbar, 3)}</span>{' '}
                  <span className="text-lg text-emerald-600">mbar</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Water Gauge Equivalent</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-mmh2o">{fmt(mmH2o, 2)}</span>{' '}
                  <span className="text-lg text-slate-500">mmH2O</span>
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
