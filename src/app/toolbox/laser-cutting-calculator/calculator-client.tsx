'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Scissors, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
const INT0_RE = /^\d+$/;

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

function parseNonNegInt(raw: string): number | null {
  const t = raw.trim();
  if (!INT0_RE.test(t)) return null;
  const v = Number(t);
  return Number.isInteger(v) && v >= 0 ? v : null;
}

export default function LaserCuttingCalculatorClient() {
  const [powerStr, setPowerStr] = useState('3000');
  const [absorbStr, setAbsorbStr] = useState('0.7');
  const [thickStr, setThickStr] = useState('4');
  const [kerfStr, setKerfStr] = useState('0.2');
  const [energyStr, setEnergyStr] = useState('45');
  const [cutLenStr, setCutLenStr] = useState('2400');
  const [pierceCountStr, setPierceCountStr] = useState('8');
  const [pierceTimeStr, setPierceTimeStr] = useState('0.6');
  const [copied, setCopied] = useState(false);

  const power = parsePos(powerStr);
  const eta = parsePos(absorbStr);
  const thick = parsePos(thickStr);
  const kerf = parsePos(kerfStr);
  const eVol = parsePos(energyStr);
  const cutLen = parsePos(cutLenStr);
  const pierceCount = parseNonNegInt(pierceCountStr);
  const pierceTime = parseNonNeg(pierceTimeStr);

  const etaOk = eta !== null && eta > 0 && eta <= 1;
  const isValid =
    power !== null &&
    etaOk &&
    thick !== null &&
    kerf !== null &&
    eVol !== null &&
    cutLen !== null &&
    pierceCount !== null &&
    pierceTime !== null;

  let speedMmS: number | null = null;
  let speedMMin: number | null = null;
  let cutTimeS: number | null = null;
  let totalTimeS: number | null = null;

  if (isValid && power !== null && eta !== null && thick !== null && kerf !== null && eVol !== null && cutLen !== null && pierceCount !== null && pierceTime !== null) {
    speedMmS = (power * eta) / (thick * kerf * eVol);
    speedMMin = speedMmS * 0.06;
    cutTimeS = cutLen / speedMmS;
    totalTimeS = cutTimeS + pierceCount * pierceTime;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (p: string, a: string, t: string, k: string, e: string, l: string, pc: string, pt: string) => {
    setPowerStr(p);
    setAbsorbStr(a);
    setThickStr(t);
    setKerfStr(k);
    setEnergyStr(e);
    setCutLenStr(l);
    setPierceCountStr(pc);
    setPierceTimeStr(pt);
  };

  const handleReset = () => applyPreset('3000', '0.7', '4', '0.2', '45', '2400', '8', '0.6');

  const handleCopy = async () => {
    if (!isValid || speedMmS === null || speedMMin === null || totalTimeS === null) return;
    const text = [
      'Laser Cutting Speed & Cycle Time Summary',
      `Power: ${power} W (eta=${eta}), Thickness: ${thick} mm, Kerf: ${kerf} mm`,
      `Cutting Speed: ${speedMmS.toFixed(2)} mm/s (${speedMMin.toFixed(3)} m/min)`,
      `Total Cycle Time: ${totalTimeS.toFixed(2)} s (Cut + ${pierceCount} pierces)`,
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
    if (!isValid || speedMmS === null || speedMMin === null || cutTimeS === null || totalTimeS === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['laser_power_w', String(power), 'W'],
      ['absorptivity_eta', String(eta), 'ratio'],
      ['plate_thickness_mm', String(thick), 'mm'],
      ['kerf_width_mm', String(kerf), 'mm'],
      ['specific_melting_energy_j_mm3', String(eVol), 'J/mm3'],
      ['cut_length_mm', String(cutLen), 'mm'],
      ['pierce_count', String(pierceCount), 'count'],
      ['pierce_time_s', String(pierceTime), 's'],
      ['cutting_speed_mm_s', speedMmS.toFixed(4), 'mm/s'],
      ['cutting_speed_m_min', speedMMin.toFixed(4), 'm/min'],
      ['linear_cut_time_s', cutTimeS.toFixed(4), 's'],
      ['total_cycle_time_s', totalTimeS.toFixed(4), 's'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laser-cutting-speed.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Scissors className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Beam &amp; Kerf Energy Balance</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-3kw-steel"
                onClick={() => applyPreset('3000', '0.7', '4', '0.2', '45', '2400', '8', '0.6')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-purple-50 text-slate-700 border border-slate-200"
              >
                3 kW Fiber / 4 mm Mild Steel
              </button>
              <button
                type="button"
                data-testid="preset-6kw-ss"
                onClick={() => applyPreset('6000', '0.75', '6', '0.25', '52', '3600', '12', '1.0')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-purple-50 text-slate-700 border border-slate-200"
              >
                6 kW Fiber / 6 mm Stainless
              </button>
              <button
                type="button"
                data-testid="preset-150w-acrylic"
                onClick={() => applyPreset('150', '0.9', '5', '0.15', '2.5', '1200', '6', '0.2')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-purple-50 text-slate-700 border border-slate-200"
              >
                150 W CO2 / 5 mm Cast Acrylic
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Power P (W)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-power"
                  value={powerStr}
                  onChange={e => setPowerStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Coupling (0–1]</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-absorb"
                  value={absorbStr}
                  onChange={e => setAbsorbStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Thickness t (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-thick"
                  value={thickStr}
                  onChange={e => setThickStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Kerf Width w (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-kerf"
                  value={kerfStr}
                  onChange={e => setKerfStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">E_v (J/mm3)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-energy"
                  value={energyStr}
                  onChange={e => setEnergyStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Cut Length (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-cutlen"
                  value={cutLenStr}
                  onChange={e => setCutLenStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Pierces N</label>
                <input
                  type="text"
                  inputMode="numeric"
                  data-testid="input-pierces"
                  value={pierceCountStr}
                  onChange={e => setPierceCountStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Pierce Time (s)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-pierce-time"
                  value={pierceTimeStr}
                  onChange={e => setPierceTimeStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Ensure physical quantities &gt; 0, coupling efficiency in (0, 1], pierces integer &ge; 0, pierce time &ge; 0.</span>
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center justify-center gap-1.5"
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Kerf Energy Feedrate &amp; Cycle Time</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                v = (P * eta) / (t * w_kerf * E_v), total time = L_cut / v + N_pierce * t_pierce
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-sm font-black text-purple-600 uppercase tracking-wider mb-1">Cutting Speed</div>
                <div className="text-3xl font-black text-purple-900">
                  <span data-testid="result-speed-mms">{fmt(speedMmS, 2)}</span>{' '}
                  <span className="text-lg text-purple-600">mm/s</span>
                </div>
                <div className="text-xs text-purple-700 mt-1 font-medium">
                  <span data-testid="result-speed-mmin">{fmt(speedMMin, 3)}</span> m/min
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Total Cycle Time</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-total-time">{fmt(totalTimeS, 2)}</span>{' '}
                  <span className="text-lg text-blue-600">s</span>
                </div>
                <div className="text-xs text-blue-700 mt-1 font-medium">
                  Linear cut only: <span data-testid="result-cut-time">{fmt(cutTimeS, 2)}</span> s
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
