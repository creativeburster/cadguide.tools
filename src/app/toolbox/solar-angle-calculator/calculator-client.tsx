'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 10000) return n.toFixed(0);
  if (Math.abs(n) >= 100) return n.toFixed(2);
  if (Math.abs(n) >= 1) return n.toFixed(3);
  return n.toFixed(6);
}

const DEFAULT_INPUTS = ['40', '180', '12', '3'];

export default function SolarAngleCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const latDeg = parseFinite(inputs[0]);
    const doy = parseFinite(inputs[1]);
    const hour = parseFinite(inputs[2]);
    const height = parseFinite(inputs[3]);

    if (latDeg === null || doy === null || hour === null || height === null) {
      return { valid: false as const, error: 'Enter numeric values for latitude, day of year, solar hour, and object height.' };
    }
    if (latDeg < -90 || latDeg > 90 || doy < 1 || doy > 366 || hour < 0 || hour > 24 || height <= 0) {
      return { valid: false as const, error: 'Ensure latitude in [-90, 90], day of year in [1, 366], hour in [0, 24], and height > 0.' };
    }

    const lat = (latDeg * Math.PI) / 180;
    const decDeg = 23.45 * Math.sin((((360 / 365) * (doy - 81)) * Math.PI) / 180);
    const dec = (decDeg * Math.PI) / 180;
    const hra = ((hour - 12) * 15 * Math.PI) / 180;

    const sinElev = Math.max(-1, Math.min(1, Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(hra)));
    const elevRad = Math.asin(sinElev);
    const elevDeg = (elevRad * 180) / Math.PI;
    const zenithDeg = 90 - elevDeg;

    // Clockwise azimuth from True North (0=N, 90=E, 180=S, 270=W)
    const azRad = Math.atan2(-Math.sin(hra), Math.tan(dec) * Math.cos(lat) - Math.sin(lat) * Math.cos(hra));
    const azDeg = ((azRad * 180) / Math.PI + 360) % 360;

    const shadow = elevDeg > 0 ? height / Math.tan(elevRad) : null;

    return { valid: true as const, latDeg, doy, hour, height, decDeg, elevDeg, zenithDeg, azDeg, shadow };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Solar Altitude, Zenith, Azimuth & Shadow Length Report',
      '# Formula: sin(alpha_s) = sin(Phi)*sin(delta) + cos(Phi)*cos(delta)*cos(h)',
      'Parameter,Value,Unit',
      `Site Latitude Phi,${result.latDeg},deg`,
      `Day of Year N,${result.doy},day`,
      `Local Solar Hour,${result.hour},hr`,
      `Vertical Object Height,${result.height},m`,
      `Solar Declination delta,${result.decDeg.toFixed(6)},deg`,
      `Solar Elevation alpha_s,${result.elevDeg.toFixed(6)},deg`,
      `Solar Zenith theta_s,${result.zenithDeg.toFixed(6)},deg`,
      `Compass Azimuth (Clockwise from North),${result.azDeg.toFixed(6)},deg`,
      `Horizontal Shadow Length,${result.shadow !== null ? result.shadow.toFixed(6) : 'Sun below horizon'},m`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solar-angle-shadow-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Latitude &Phi; (deg, +N / &minus;S)</label>
            <input type="text" data-testid="input-lat" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Day of Year (1 to 366)</label>
            <input type="text" data-testid="input-doy" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Local Solar Hour (0 to 24, 12 = Solar Noon)</label>
            <input type="text" data-testid="input-hour" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Vertical Object Height (m)</label>
            <input type="text" data-testid="input-height" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={downloadCsv}
                disabled={!result.valid}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!result.valid && (
              <div data-testid="validation-msg" className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {result.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Solar Elevation (&alpha;_s)</div>
                <div data-testid="output-elev" className="text-3xl font-black text-blue-800">
                  {result.valid ? formatNum(result.elevDeg) : '—'}
                  {result.valid && <span className="text-lg text-blue-500 ml-1">deg</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Shadow Length</div>
                <div data-testid="output-shadow" className="text-3xl font-black text-green-800">
                  {!result.valid ? '—' : result.shadow !== null ? formatNum(result.shadow) : 'Below horizon'}
                  {result.valid && result.shadow !== null && <span className="text-lg text-green-600 ml-1">m</span>}
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-2">Azimuth (Clockwise from N)</div>
                <div data-testid="output-az" className="text-3xl font-black text-orange-800">
                  {result.valid ? formatNum(result.azDeg) : '—'}
                  {result.valid && <span className="text-lg text-orange-600 ml-1">deg</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Zenith (&theta;_s) / Declination</div>
                <div data-testid="output-zenith" className="text-2xl font-black text-slate-800">
                  {result.valid ? `${formatNum(result.zenithDeg)} deg / ${formatNum(result.decDeg)} deg` : '—'}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Solar zenith equation (Wikipedia: Solar zenith angle): sin(&alpha;_s) = sin(&Phi;)&middot;sin(&delta;) + cos(&Phi;)&middot;cos(&delta;)&middot;cos(h), where &theta;_s = 90&deg; &minus; &alpha;_s and hour angle h = 15&deg;&middot;(t_solar &minus; 12).
                </span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
