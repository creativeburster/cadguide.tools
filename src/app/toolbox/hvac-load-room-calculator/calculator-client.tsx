'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const AIR_RHO_CP = 1206; // W*s/(m3*K) standard air (~1.2 kg/m3 * 1005 J/kgK)
const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
const STRICT_INT_RE = /^[+-]?\d+$/;

function parseStrictFinite(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parseStrictPositive(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseStrictNonNegative(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function parseStrictNonNegInt(raw: string): number {
  const s = raw.trim();
  if (!STRICT_INT_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isInteger(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'office-30', label: '30m2 Office (U=0.5, Aw=20, dT=15C, 3 occ, 15 L/s)', area: '30', u: '0.5', aw: '20', dt: '15', occ: '3', wocc: '80', wm2: '10', vent: '15' },
  { id: 'conf-60', label: '60m2 Conference Room (12 occ, 40 L/s vent)', area: '60', u: '0.4', aw: '32', dt: '18', occ: '12', wocc: '75', wm2: '12', vent: '40' },
  { id: 'no-vent', label: 'Sealed Envelope Baseline (Vent=0 L/s)', area: '30', u: '0.5', aw: '20', dt: '15', occ: '3', wocc: '80', wm2: '10', vent: '0' },
];

export default function HvacLoadRoomCalculatorClient() {
  const [areaStr, setAreaStr] = useState('30');
  const [uStr, setUStr] = useState('0.5');
  const [awStr, setAwStr] = useState('20');
  const [dtStr, setDtStr] = useState('15');
  const [occStr, setOccStr] = useState('3');
  const [wOccStr, setWOccStr] = useState('80');
  const [wM2Str, setWM2Str] = useState('10');
  const [ventStr, setVentStr] = useState('15');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setAreaStr(p.area);
    setUStr(p.u);
    setAwStr(p.aw);
    setDtStr(p.dt);
    setOccStr(p.occ);
    setWOccStr(p.wocc);
    setWM2Str(p.wm2);
    setVentStr(p.vent);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const area = parseStrictPositive(areaStr);
    const uVal = parseStrictNonNegative(uStr);
    const aw = parseStrictNonNegative(awStr);
    const dt = parseStrictNonNegative(dtStr);
    const occ = parseStrictNonNegInt(occStr);
    const wOcc = parseStrictNonNegative(wOccStr);
    const wM2 = parseStrictNonNegative(wM2Str);
    const ventLs = parseStrictNonNegative(ventStr);

    if (
      !Number.isFinite(area) ||
      !Number.isFinite(uVal) ||
      !Number.isFinite(aw) ||
      !Number.isFinite(dt) ||
      !Number.isFinite(occ) ||
      !Number.isFinite(wOcc) ||
      !Number.isFinite(wM2) ||
      !Number.isFinite(ventLs)
    ) {
      return {
        valid: false as const,
        errorMsg: 'Enter positive floor area (> 0), integer occupants (>= 0), and non-negative envelope, internal gain, and ventilation values.',
      };
    }

    const qTrans = uVal * aw * dt;
    const qVent = (ventLs / 1000) * AIR_RHO_CP * dt;
    const qInternal = occ * wOcc + area * wM2;
    const qTotal = qTrans + qVent + qInternal;
    const qPerSqm = qTotal / area;

    return {
      valid: true as const,
      area,
      uVal,
      aw,
      dt,
      occ,
      wOcc,
      wM2,
      ventLs,
      qTrans,
      qVent,
      qInternal,
      qTotal,
      qPerSqm,
    };
  }, [areaStr, uStr, awStr, dtStr, occStr, wOccStr, wM2Str, ventStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Room Sensible Thermal Load Summary (${result.area} m2, dT=${result.dt} K)`,
      `Envelope Conduction = ${result.qTrans.toFixed(1)} W`,
      `Ventilation Sensible = ${result.qVent.toFixed(1)} W`,
      `Internal Gains (Occ+Equip) = ${result.qInternal.toFixed(1)} W`,
      `Total Sensible Load = ${result.qTotal.toFixed(1)} W (${result.qPerSqm.toFixed(2)} W/m2)`,
    ].join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
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
      ['Parameter', 'Value', 'Unit'],
      ['Room Floor Area', String(result.area), 'm2'],
      ['Envelope U-Value', String(result.uVal), 'W/(m2*K)'],
      ['Exposed Wall Area', String(result.aw), 'm2'],
      ['Indoor-Outdoor dT', String(result.dt), 'K'],
      ['Occupants', String(result.occ), 'people'],
      ['Sensible Gain per Occupant', String(result.wOcc), 'W/person'],
      ['Lighting/Equip Gain Density', String(result.wM2), 'W/m2'],
      ['Ventilation Airflow', String(result.ventLs), 'L/s'],
      ['Envelope Transmission Load', result.qTrans.toFixed(2), 'W'],
      ['Ventilation Sensible Load', result.qVent.toFixed(2), 'W'],
      ['Internal Gains', result.qInternal.toFixed(2), 'W'],
      ['Total Room Sensible Load', result.qTotal.toFixed(2), 'W'],
      ['Load Density', result.qPerSqm.toFixed(2), 'W/m2'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'room-sensible-load.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Quick Presets</div>
            <div className="flex flex-col gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`preset-${p.id}`}
                  onClick={() => applyPreset(p)}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-green-50 hover:text-green-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Floor Area (m2)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-area"
                value={areaStr}
                onChange={(e) => setAreaStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Wall U-Value (W/m2K)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-u"
                value={uStr}
                onChange={(e) => setUStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Exposed Wall (m2)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-wall-area"
                value={awStr}
                onChange={(e) => setAwStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Temp Diff dT (C)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-dt"
                value={dtStr}
                onChange={(e) => setDtStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Occupants</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-occ"
                value={occStr}
                onChange={(e) => setOccStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Ventilation (L/s)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-vent"
                value={ventStr}
                onChange={(e) => setVentStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">W / Person</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-wocc"
                value={wOccStr}
                onChange={(e) => setWOccStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Equip+Light (W/m2)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-wm2"
                value={wM2Str}
                onChange={(e) => setWM2Str(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Sensible Room Load Results</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {!result.valid && (
              <div
                data-testid="validation-error"
                className="mb-6 flex items-center gap-2.5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Total Sensible Load</div>
                <div className="text-3xl font-black text-orange-800">
                  <span data-testid="result-total">{result.valid ? result.qTotal.toFixed(1) : '—'}</span>
                  <span className="text-base font-bold text-orange-500 ml-1">W</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-1">Load Density</div>
                <div className="text-3xl font-black text-purple-800">
                  <span data-testid="result-density">{result.valid ? result.qPerSqm.toFixed(2) : '—'}</span>
                  <span className="text-base font-bold text-purple-500 ml-1">W/m2</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Transmission Loss</div>
                <div className="text-2xl font-black text-blue-800">
                  <span data-testid="result-trans">{result.valid ? result.qTrans.toFixed(1) : '—'}</span>
                  <span className="text-sm font-bold text-blue-500 ml-1">W</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Internal Gains</div>
                <div className="text-2xl font-black text-emerald-800">
                  <span data-testid="result-internal">{result.valid ? result.qInternal.toFixed(1) : '—'}</span>
                  <span className="text-sm font-bold text-emerald-600 ml-1">W</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Ventilation Sensible</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-vent">{result.valid ? result.qVent.toFixed(1) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1">W</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  Q_total = U * A_wall * dT + (V_L/s / 1000) * 1206 * dT + (occ * W_occ + A * W_m2) (steady-state sensible heat estimate)
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
