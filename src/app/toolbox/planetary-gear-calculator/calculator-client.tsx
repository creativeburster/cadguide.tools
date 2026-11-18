'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

type PlanetaryConfig = 'ring-fixed' | 'sun-fixed' | 'carrier-fixed';

interface PlanetaryGearResult {
  valid: boolean;
  error?: string;
  zs: number;
  zr: number;
  zp: number;
  np: number;
  moduleMm: number;
  inputRpm: number;
  ratio: number;
  outputRpm: number;
  planetSpinRatio: number;
  reqZp: number;
  isConcentric: boolean;
  isAssemblable: boolean;
  dsMm: number;
  dpMm: number;
  drMm: number;
  centerDistMm: number;
}

function solvePlanetaryGear(
  zsStr: string,
  zrStr: string,
  zpStr: string,
  npStr: string,
  modStr: string,
  rpmStr: string,
  cfg: PlanetaryConfig
): PlanetaryGearResult {
  const fields = [zsStr, zrStr, zpStr, npStr, modStr, rpmStr];
  if (fields.some((s) => s.trim() === '')) {
    return { valid: false, error: 'All gear geometry and speed inputs are required.', zs: 0, zr: 0, zp: 0, np: 0, moduleMm: 0, inputRpm: 0, ratio: 0, outputRpm: 0, planetSpinRatio: 0, reqZp: 0, isConcentric: false, isAssemblable: false, dsMm: 0, dpMm: 0, drMm: 0, centerDistMm: 0 };
  }

  const zs = Number(zsStr);
  const zr = Number(zrStr);
  const zp = Number(zpStr);
  const np = Number(npStr);
  const moduleMm = Number(modStr);
  const inputRpm = Number(rpmStr);

  if (![zs, zr, zp, np, moduleMm, inputRpm].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', zs: 0, zr: 0, zp: 0, np: 0, moduleMm: 0, inputRpm: 0, ratio: 0, outputRpm: 0, planetSpinRatio: 0, reqZp: 0, isConcentric: false, isAssemblable: false, dsMm: 0, dpMm: 0, drMm: 0, centerDistMm: 0 };
  }

  if (!Number.isInteger(zs) || !Number.isInteger(zr) || !Number.isInteger(zp) || !Number.isInteger(np)) {
    return { valid: false, error: 'Tooth counts (zs, zr, zp) and planet count (N_p) must be whole integers.', zs: 0, zr: 0, zp: 0, np: 0, moduleMm: 0, inputRpm: 0, ratio: 0, outputRpm: 0, planetSpinRatio: 0, reqZp: 0, isConcentric: false, isAssemblable: false, dsMm: 0, dpMm: 0, drMm: 0, centerDistMm: 0 };
  }

  if (zs < 6 || zp < 6 || zr <= zs + 2 || np < 1 || moduleMm <= 0 || inputRpm < 0) {
    return { valid: false, error: 'Require integer teeth zs >= 6, zp >= 6, zr > zs + 2, N_p >= 1, module > 0, and RPM >= 0.', zs: 0, zr: 0, zp: 0, np: 0, moduleMm: 0, inputRpm: 0, ratio: 0, outputRpm: 0, planetSpinRatio: 0, reqZp: 0, isConcentric: false, isAssemblable: false, dsMm: 0, dpMm: 0, drMm: 0, centerDistMm: 0 };
  }

  let ratio = 1;
  if (cfg === 'ring-fixed') {
    ratio = (zs + zr) / zs;
  } else if (cfg === 'sun-fixed') {
    ratio = (zs + zr) / zr;
  } else {
    ratio = -zr / zs;
  }

  const reqZp = (zr - zs) / 2;
  const isConcentric = Math.abs(zr - (zs + 2 * zp)) < 1e-6;
  const isAssemblable = (zs + zr) % np === 0;
  const planetSpinRatio = zs / zp;
  const outputRpm = inputRpm / ratio;
  const dsMm = moduleMm * zs;
  const dpMm = moduleMm * zp;
  const drMm = moduleMm * zr;
  const centerDistMm = (moduleMm * (zs + zp)) / 2;

  return {
    valid: true,
    zs,
    zr,
    zp,
    np,
    moduleMm,
    inputRpm,
    ratio,
    outputRpm,
    planetSpinRatio,
    reqZp,
    isConcentric,
    isAssemblable,
    dsMm,
    dpMm,
    drMm,
    centerDistMm,
  };
}

export default function PlanetaryGearCalculatorClient() {
  const [zsStr, setZsStr] = useState('20');
  const [zrStr, setZrStr] = useState('60');
  const [zpStr, setZpStr] = useState('20');
  const [npStr, setNpStr] = useState('4');
  const [modStr, setModStr] = useState('2');
  const [rpmStr, setRpmStr] = useState('1500');
  const [cfg, setCfg] = useState<PlanetaryConfig>('ring-fixed');

  const res = solvePlanetaryGear(zsStr, zrStr, zpStr, npStr, modStr, rpmStr, cfg);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Planetary Gear Set Kinematics Report', ''],
      ['Configuration', cfg],
      ['Sun Teeth zs', String(res.zs)],
      ['Ring Teeth zr', String(res.zr)],
      ['Planet Teeth zp', String(res.zp)],
      ['Planet Count Np', String(res.np)],
      ['Module m (mm)', res.moduleMm.toFixed(3)],
      ['Input Speed (rpm)', res.inputRpm.toFixed(2)],
      ['Transmission Ratio', res.ratio.toFixed(4)],
      ['Output Speed (rpm)', res.outputRpm.toFixed(4)],
      ['Planet Relative Spin Ratio (zs/zp)', res.planetSpinRatio.toFixed(4)],
      ['Concentricity Check (zr = zs + 2*zp)', res.isConcentric ? 'PASS' : `FAIL (Required zp=${res.reqZp})`],
      ['Equal-Spacing Assembly ((zs+zr)%Np=0)', res.isAssemblable ? 'PASS' : 'FAIL'],
      ['Sun Pitch Diameter (mm)', res.dsMm.toFixed(3)],
      ['Planet Pitch Diameter (mm)', res.dpMm.toFixed(3)],
      ['Ring Pitch Diameter (mm)', res.drMm.toFixed(3)],
      ['Sun-Planet Center Distance (mm)', res.centerDistMm.toFixed(3)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planetary-gear-kinematics.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Sun Teeth (z_s)</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-zs"
                value={zsStr}
                onChange={(e) => setZsStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Ring Teeth (z_r)</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-zr"
                value={zrStr}
                onChange={(e) => setZrStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Planet Teeth (z_p)</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-zp"
                value={zpStr}
                onChange={(e) => setZpStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Planets (N_p)</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-np"
                value={npStr}
                onChange={(e) => setNpStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Module m (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-module"
                value={modStr}
                onChange={(e) => setModStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Input Speed (rpm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-rpm"
                value={rpmStr}
                onChange={(e) => setRpmStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">Kinematic Mode</label>
            <select
              data-testid="select-config"
              value={cfg}
              onChange={(e) => setCfg(e.target.value as PlanetaryConfig)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold"
            >
              <option value="ring-fixed">Ring Fixed (Sun In / Carrier Out)</option>
              <option value="sun-fixed">Sun Fixed (Ring In / Carrier Out)</option>
              <option value="carrier-fixed">Carrier Fixed (Sun In / Ring Out)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setZsStr('20');
              setZrStr('60');
              setZpStr('20');
              setNpStr('4');
              setModStr('2');
              setRpmStr('1500');
              setCfg('ring-fixed');
            }}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div
                data-testid="validation-error"
                className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700"
              >
                {res.error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-sm font-black text-blue-500 uppercase tracking-wider mb-1">Overall Gear Ratio</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-ratio">
                      {Math.abs(res.ratio).toFixed(4)} <span className="text-lg text-blue-500">:1</span>
                    </div>
                    <div className="text-xs text-blue-600 font-bold mt-1">
                      {res.ratio < 0 ? 'Reverse output rotation' : 'Forward output rotation'}
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-sm font-black text-emerald-500 uppercase tracking-wider mb-1">Output Speed</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-output-rpm">
                      {res.outputRpm.toFixed(2)} <span className="text-lg text-emerald-500">rpm</span>
                    </div>
                    <div className="text-xs text-emerald-600 font-bold mt-1">
                      Planet spin ratio (z_s / z_p): {res.planetSpinRatio.toFixed(3)} :1
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase">Sun Pitch d_s</p>
                    <p className="text-lg font-black text-slate-900">{res.dsMm.toFixed(1)} mm</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase">Planet Pitch d_p</p>
                    <p className="text-lg font-black text-slate-900">{res.dpMm.toFixed(1)} mm</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase">Ring Pitch d_r</p>
                    <p className="text-lg font-black text-slate-900">{res.drMm.toFixed(1)} mm</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase">Center Dist a</p>
                    <p className="text-lg font-black text-slate-900">{res.centerDistMm.toFixed(1)} mm</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`rounded-2xl p-4 border ${res.isConcentric ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <div className="text-xs font-black uppercase tracking-wider mb-1">Coaxial Condition (z_r = z_s + 2*z_p)</div>
                    <div className="text-sm font-bold">
                      {res.isConcentric
                        ? `PASS: ${res.zr} = ${res.zs} + 2 * ${res.zp}`
                        : `FAIL: Required z_p = ${res.reqZp} (entered z_p = ${res.zp})`}
                    </div>
                  </div>
                  <div className={`rounded-2xl p-4 border ${res.isAssemblable ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <div className="text-xs font-black uppercase tracking-wider mb-1">Equal-Spacing Assembly ((z_s + z_r) % N_p = 0)</div>
                    <div className="text-sm font-bold">
                      {res.isAssemblable
                        ? `PASS: (${res.zs} + ${res.zr}) / ${res.np} = ${(res.zs + res.zr) / res.np}`
                        : `FAIL: (${res.zs} + ${res.zr}) is not divisible by ${res.np}`}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Willis Equation: (omega_s - omega_c) / (omega_r - omega_c) = -z_r / z_s. Pitch diameters assume standard zero-profile-shift involute gearing.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
