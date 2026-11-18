'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
const INT_RE = /^\d+$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function parseTeethInt(raw: string): number | null {
  const t = raw.trim();
  if (!INT_RE.test(t)) return null;
  const v = Number(t);
  return Number.isInteger(v) && v >= 6 ? v : null;
}

export default function InvoluteGearCalculatorClient() {
  const [moduleStr, setModuleStr] = useState('2');
  const [z1Str, setZ1Str] = useState('20');
  const [z2Str, setZ2Str] = useState('40');
  const [angleStr, setAngleStr] = useState('20');
  const [copied, setCopied] = useState(false);

  const m = parsePos(moduleStr);
  const z1 = parseTeethInt(z1Str);
  const z2 = parseTeethInt(z2Str);
  const alphaDeg = parsePos(angleStr);

  const angleOk = alphaDeg !== null && alphaDeg > 0 && alphaDeg < 45;
  let isValid = m !== null && z1 !== null && z2 !== null && angleOk;

  let d1: number | null = null;
  let d2: number | null = null;
  let db1: number | null = null;
  let db2: number | null = null;
  let centerDist: number | null = null;
  let gearRatio: number | null = null;
  let contactRatio: number | null = null;

  if (isValid && m !== null && z1 !== null && z2 !== null && alphaDeg !== null) {
    const aRad = (alphaDeg * Math.PI) / 180;
    d1 = m * z1;
    d2 = m * z2;
    db1 = d1 * Math.cos(aRad);
    db2 = d2 * Math.cos(aRad);
    const da1 = d1 + 2 * m;
    const da2 = d2 + 2 * m;
    const ra1 = da1 / 2;
    const ra2 = da2 / 2;
    const rb1 = db1 / 2;
    const rb2 = db2 / 2;
    centerDist = 0.5 * m * (z1 + z2);
    gearRatio = z2 / z1;

    const rad1 = ra1 * ra1 - rb1 * rb1;
    const rad2 = ra2 * ra2 - rb2 * rb2;
    if (rad1 < 0 || rad2 < 0) {
      isValid = false;
    } else {
      contactRatio =
        (Math.sqrt(rad1) + Math.sqrt(rad2) - centerDist * Math.sin(aRad)) /
        (Math.PI * m * Math.cos(aRad));
      if (!Number.isFinite(contactRatio)) isValid = false;
    }
  }

  const fmt = (n: number | null, dec: number) => (isValid && n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (mv: string, z1v: string, z2v: string, av: string) => {
    setModuleStr(mv);
    setZ1Str(z1v);
    setZ2Str(z2v);
    setAngleStr(av);
  };

  const handleReset = () => applyPreset('2', '20', '40', '20');

  const handleCopy = async () => {
    if (!isValid || d1 === null || d2 === null || db1 === null || db2 === null || centerDist === null || contactRatio === null) return;
    const text = [
      'Involute Spur Gear Pair Geometry',
      `Module: ${m} mm, z1=${z1}, z2=${z2}, Pressure Angle=${alphaDeg} deg`,
      `Pitch Dia: d1=${d1.toFixed(3)} mm, d2=${d2.toFixed(3)} mm, Center Distance=${centerDist.toFixed(3)} mm`,
      `Base Dia: db1=${db1.toFixed(3)} mm, db2=${db2.toFixed(3)} mm`,
      `Transverse Contact Ratio: ${contactRatio.toFixed(4)}`,
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
    if (!isValid || d1 === null || d2 === null || db1 === null || db2 === null || centerDist === null || contactRatio === null || gearRatio === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['module_m', String(m), 'mm'],
      ['pinion_teeth_z1', String(z1), 'teeth'],
      ['gear_teeth_z2', String(z2), 'teeth'],
      ['pressure_angle_deg', String(alphaDeg), 'deg'],
      ['pitch_dia_d1', d1.toFixed(4), 'mm'],
      ['pitch_dia_d2', d2.toFixed(4), 'mm'],
      ['base_dia_db1', db1.toFixed(4), 'mm'],
      ['base_dia_db2', db2.toFixed(4), 'mm'],
      ['center_distance', centerDist.toFixed(4), 'mm'],
      ['gear_ratio', gearRatio.toFixed(4), 'ratio'],
      ['transverse_contact_ratio', contactRatio.toFixed(4), 'ratio'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'involute-gear-geometry.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Gear Pair Inputs</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-m2-20-40"
                onClick={() => applyPreset('2', '20', '40', '20')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200 transition-colors"
              >
                2:1 Standard Pair (m=2, z=20/40, 20 deg)
              </button>
              <button
                type="button"
                data-testid="preset-m3-18-54"
                onClick={() => applyPreset('3', '18', '54', '20')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200 transition-colors"
              >
                3:1 Heavy Drive (m=3, z=18/54, 20 deg)
              </button>
              <button
                type="button"
                data-testid="preset-m15-24-36-25deg"
                onClick={() => applyPreset('1.5', '24', '36', '25')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200 transition-colors"
              >
                High-Strength 25 deg (m=1.5, z=24/36)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Module m (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-module"
                value={moduleStr}
                onChange={e => setModuleStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Pinion Teeth z1</label>
                <input
                  type="text"
                  inputMode="numeric"
                  data-testid="input-z1"
                  value={z1Str}
                  onChange={e => setZ1Str(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Gear Teeth z2</label>
                <input
                  type="text"
                  inputMode="numeric"
                  data-testid="input-z2"
                  value={z2Str}
                  onChange={e => setZ2Str(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Pressure Angle (deg, 0–45)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-angle"
                value={angleStr}
                onChange={e => setAngleStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Module must be &gt; 0, z1 and z2 integers &ge; 6, and pressure angle strictly between 0 and 45 deg.</span>
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-1.5"
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Standard Full-Depth Spur Gear Geometry</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                db = m*z*cos(alpha), da = d + 2*m, contact ratio using tip &amp; base circle radii
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                <div className="text-xs font-black text-red-500 uppercase tracking-wider mb-1">Contact Ratio (eps)</div>
                <div className="text-3xl font-black text-red-900">
                  <span data-testid="result-cr">{fmt(contactRatio, 4)}</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Base Dia db1</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-db1">{fmt(db1, 3)}</span>{' '}
                  <span className="text-base text-blue-500">mm</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Base Dia db2</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-db2">{fmt(db2, 3)}</span>{' '}
                  <span className="text-base text-emerald-600">mm</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Pitch Dia d1</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-d1">{fmt(d1, 2)}</span>{' '}
                  <span className="text-base text-orange-500">mm</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-1">Pitch Dia d2</div>
                <div className="text-2xl font-black text-purple-900">
                  <span data-testid="result-d2">{fmt(d2, 2)}</span>{' '}
                  <span className="text-base text-purple-500">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Center Distance a</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-center">{fmt(centerDist, 2)}</span>{' '}
                  <span className="text-base text-slate-500">mm</span>
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
