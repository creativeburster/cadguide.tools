'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

function saturationVaporPressureKpa(tempC: number): number {
  if (tempC >= 0) {
    return 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  }
  return 0.61078 * Math.exp((21.875 * tempC) / (tempC + 265.5));
}

interface PsychrometricResult {
  valid: boolean;
  error?: string;
  pwsKpa: number;
  pwKpa: number;
  relativeHumidityPct: number;
  humidityRatioGKg: number;
  enthalpyKjKg: number;
  dewPointC: number;
}

function solvePsychrometric(tDbStr: string, tWbStr: string, pAtmStr: string): PsychrometricResult {
  if ([tDbStr, tWbStr, pAtmStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'Dry-bulb, wet-bulb, and atmospheric pressure are required.', pwsKpa: 0, pwKpa: 0, relativeHumidityPct: 0, humidityRatioGKg: 0, enthalpyKjKg: 0, dewPointC: 0 };
  }
  const T = Number(tDbStr);
  const Tw = Number(tWbStr);
  const pa = Number(pAtmStr);

  if (![T, Tw, pa].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', pwsKpa: 0, pwKpa: 0, relativeHumidityPct: 0, humidityRatioGKg: 0, enthalpyKjKg: 0, dewPointC: 0 };
  }
  if (T < -40 || T > 80 || Tw < -40 || Tw > 80) {
    return { valid: false, error: 'Temperatures must be within -40 to +80 degC.', pwsKpa: 0, pwKpa: 0, relativeHumidityPct: 0, humidityRatioGKg: 0, enthalpyKjKg: 0, dewPointC: 0 };
  }
  if (Tw > T) {
    return { valid: false, error: 'Wet-bulb temperature cannot exceed dry-bulb temperature.', pwsKpa: 0, pwKpa: 0, relativeHumidityPct: 0, humidityRatioGKg: 0, enthalpyKjKg: 0, dewPointC: 0 };
  }
  if (pa <= 10 || pa > 500) {
    return { valid: false, error: 'Atmospheric pressure must be within 10 to 500 kPa.', pwsKpa: 0, pwKpa: 0, relativeHumidityPct: 0, humidityRatioGKg: 0, enthalpyKjKg: 0, dewPointC: 0 };
  }

  const pwsKpa = saturationVaporPressureKpa(T);
  const pwsWbKpa = saturationVaporPressureKpa(Tw);
  const pwKpa = pwsWbKpa - 0.00066 * (1 + 0.00115 * Tw) * (T - Tw) * pa;
  if (pwKpa <= 0 || pwKpa >= pa) {
    return { valid: false, error: 'Computed water vapor pressure is outside physical bounds (0 < p_w < p_atm).', pwsKpa: 0, pwKpa: 0, relativeHumidityPct: 0, humidityRatioGKg: 0, enthalpyKjKg: 0, dewPointC: 0 };
  }

  const relativeHumidityPct = (pwKpa / pwsKpa) * 100;
  const W = (0.62198 * pwKpa) / (pa - pwKpa); // kg/kg dry air
  const humidityRatioGKg = W * 1000;
  const enthalpyKjKg = 1.006 * T + W * (2501 + 1.86 * T);
  const lnPw = Math.log(pwKpa / 0.61078);
  const dewPointC = pwKpa >= 0.61078 ? (237.3 * lnPw) / (17.27 - lnPw) : (265.5 * lnPw) / (21.875 - lnPw);

  return { valid: true, pwsKpa, pwKpa, relativeHumidityPct, humidityRatioGKg, enthalpyKjKg, dewPointC };
}

export default function PsychrometricCalculatorClient() {
  const [tDbStr, setTDbStr] = useState('25');
  const [tWbStr, setTWbStr] = useState('20');
  const [pAtmStr, setPAtmStr] = useState('101.325');

  const res = solvePsychrometric(tDbStr, tWbStr, pAtmStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Moist Air Psychrometric Report', ''],
      ['Dry-Bulb Temperature (degC)', tDbStr],
      ['Wet-Bulb Temperature (degC)', tWbStr],
      ['Atmospheric Pressure (kPa)', pAtmStr],
      ['Saturation Pressure p_ws (kPa)', res.pwsKpa.toFixed(4)],
      ['Water Vapor Pressure p_w (kPa)', res.pwKpa.toFixed(4)],
      ['Relative Humidity (%)', res.relativeHumidityPct.toFixed(4)],
      ['Humidity Ratio W (g/kg)', res.humidityRatioGKg.toFixed(4)],
      ['Specific Enthalpy h (kJ/kg)', res.enthalpyKjKg.toFixed(4)],
      ['Dew-Point Temperature (degC)', res.dewPointC.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'psychrometric-properties.csv';
    a.click();
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

          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Dry-Bulb Temp (degC)</label>
            <input type="text" inputMode="decimal" data-testid="input-tdb" value={tDbStr} onChange={(e) => setTDbStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Wet-Bulb Temp (degC)</label>
            <input type="text" inputMode="decimal" data-testid="input-twb" value={tWbStr} onChange={(e) => setTWbStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Barometric Pressure (kPa)</label>
            <input type="text" inputMode="decimal" data-testid="input-patm" value={pAtmStr} onChange={(e) => setPAtmStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>

          <button type="button" onClick={() => { setTDbStr('25'); setTWbStr('20'); setPAtmStr('101.325'); }} className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Psychrometric Results</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 disabled:opacity-50">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Humidity Ratio W</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-w">{res.humidityRatioGKg.toFixed(4)}<span className="text-lg text-blue-400"> g/kg</span></div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Specific Enthalpy h</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-h">{res.enthalpyKjKg.toFixed(4)}<span className="text-lg text-emerald-500"> kJ/kg</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Relative Humidity</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-rh">{res.relativeHumidityPct.toFixed(3)} %</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Dew Point</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-tdp">{res.dewPointC.toFixed(3)} degC</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Vapor Pressure p_w</div>
                    <div className="text-xl font-black text-slate-900">{res.pwKpa.toFixed(4)} kPa</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Uses Wikipedia Tetens saturation equation (Murray 1967 ice branch below 0 degC) with Ferrel psychrometric equation, W = 0.62198*pw/(p - pw), and h = 1.006*T + W*(2501 + 1.86*T).
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
