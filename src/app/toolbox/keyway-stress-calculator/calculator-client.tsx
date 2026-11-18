'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export default function KeywayStressCalculatorClient() {
  const [torqueStr, setTorqueStr] = useState('250');
  const [shaftDiaStr, setShaftDiaStr] = useState('40');
  const [keyWidthStr, setKeyWidthStr] = useState('12');
  const [keyHeightStr, setKeyHeightStr] = useState('8');
  const [keyLenStr, setKeyLenStr] = useState('50');
  const [yieldStr, setYieldStr] = useState('360');
  const [copied, setCopied] = useState(false);

  const torque = parsePos(torqueStr);
  const shaftDia = parsePos(shaftDiaStr);
  const keyWidth = parsePos(keyWidthStr);
  const keyHeight = parsePos(keyHeightStr);
  const keyLen = parsePos(keyLenStr);
  const yieldStrength = parsePos(yieldStr);

  const isValid =
    torque !== null &&
    shaftDia !== null &&
    keyWidth !== null &&
    keyHeight !== null &&
    keyLen !== null &&
    yieldStrength !== null;

  let forceN: number | null = null;
  let shearMpa: number | null = null;
  let bearingMpa: number | null = null;
  let sfShear: number | null = null;
  let sfBearing: number | null = null;

  if (isValid && torque !== null && shaftDia !== null && keyWidth !== null && keyHeight !== null && keyLen !== null && yieldStrength !== null) {
    forceN = (2000 * torque) / shaftDia;
    shearMpa = forceN / (keyWidth * keyLen);
    bearingMpa = (2 * forceN) / (keyHeight * keyLen);
    const tauAllow = 0.577 * yieldStrength;
    sfShear = tauAllow / shearMpa;
    sfBearing = yieldStrength / bearingMpa;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (t: string, d: string, w: string, h: string, l: string, y: string) => {
    setTorqueStr(t);
    setShaftDiaStr(d);
    setKeyWidthStr(w);
    setKeyHeightStr(h);
    setKeyLenStr(l);
    setYieldStr(y);
  };

  const handleReset = () => applyPreset('250', '40', '12', '8', '50', '360');

  const handleCopy = async () => {
    if (!isValid || forceN === null || shearMpa === null || bearingMpa === null || sfShear === null || sfBearing === null) return;
    const text = [
      'Parallel Key Shear & Crushing Stress Summary',
      `Torque: ${torque} Nm, Shaft: ${shaftDia} mm, Key (b x h x L): ${keyWidth} x ${keyHeight} x ${keyLen} mm`,
      `Tangential Force: ${forceN.toFixed(1)} N`,
      `Key Shear Stress: ${shearMpa.toFixed(3)} MPa (SF: ${sfShear.toFixed(2)})`,
      `Hub/Key Bearing Stress: ${bearingMpa.toFixed(3)} MPa (SF: ${sfBearing.toFixed(2)})`,
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
    if (!isValid || forceN === null || shearMpa === null || bearingMpa === null || sfShear === null || sfBearing === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['torque', String(torque), 'Nm'],
      ['shaft_diameter', String(shaftDia), 'mm'],
      ['key_width', String(keyWidth), 'mm'],
      ['key_height', String(keyHeight), 'mm'],
      ['effective_length', String(keyLen), 'mm'],
      ['yield_strength', String(yieldStrength), 'MPa'],
      ['tangential_force_n', forceN.toFixed(2), 'N'],
      ['shear_stress_mpa', shearMpa.toFixed(4), 'MPa'],
      ['bearing_stress_mpa', bearingMpa.toFixed(4), 'MPa'],
      ['sf_shear_von_mises', sfShear.toFixed(3), 'ratio'],
      ['sf_bearing', sfBearing.toFixed(3), 'ratio'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyway-stress-analysis.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Shaft &amp; Key Dimensions</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-40mm-250nm"
                onClick={() => applyPreset('250', '40', '12', '8', '50', '360')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
              >
                40 mm Shaft (250 Nm, 12x8x50 mm)
              </button>
              <button
                type="button"
                data-testid="preset-25mm-80nm"
                onClick={() => applyPreset('80', '25', '8', '7', '36', '300')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
              >
                25 mm Motor Shaft (80 Nm, 8x7x36 mm)
              </button>
              <button
                type="button"
                data-testid="preset-80mm-1800nm"
                onClick={() => applyPreset('1800', '80', '22', '14', '90', '420')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
              >
                80 mm Gearbox Output (1800 Nm, 22x14x90 mm)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Torque T (Nm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-torque"
                  value={torqueStr}
                  onChange={e => setTorqueStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Shaft Dia d (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-dia"
                  value={shaftDiaStr}
                  onChange={e => setShaftDiaStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Key Width b (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-width"
                  value={keyWidthStr}
                  onChange={e => setKeyWidthStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Key Height h (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-height"
                  value={keyHeightStr}
                  onChange={e => setKeyHeightStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Eff Length L (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-length"
                  value={keyLenStr}
                  onChange={e => setKeyLenStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Yield sy (MPa)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-yield"
                  value={yieldStr}
                  onChange={e => setYieldStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>All dimensions, torque, and material yield strength must be strictly positive numbers.</span>
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Keyway Shear &amp; Bearing Stress</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                F = 2000*T / d, tau = F / (b*L), sigma_c = 2*F / (h*L) assuming h/2 engagement depth
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Key Shear Stress (tau)</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-shear">{fmt(shearMpa, 3)}</span>{' '}
                  <span className="text-lg text-blue-600">MPa</span>
                </div>
                <div className="text-xs text-blue-700 mt-1 font-medium">
                  Shear SF (0.577*sy): <span data-testid="result-sf-shear">{fmt(sfShear, 2)}</span>x
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Bearing Stress (sigma_c)</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-bearing">{fmt(bearingMpa, 3)}</span>{' '}
                  <span className="text-lg text-emerald-600">MPa</span>
                </div>
                <div className="text-xs text-emerald-700 mt-1 font-medium">
                  Bearing SF (sy/sigma_c): <span data-testid="result-sf-bearing">{fmt(sfBearing, 2)}</span>x
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sm:col-span-2">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Tangential Key Force F</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-force">{fmt(forceN, 1)}</span>{' '}
                  <span className="text-lg text-slate-500">N</span>
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
