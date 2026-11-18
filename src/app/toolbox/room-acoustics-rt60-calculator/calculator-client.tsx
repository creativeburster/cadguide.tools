'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface Rt60Result {
  valid: boolean;
  error?: string;
  volumeM3: number;
  totalSurfaceM2: number;
  totalAbsorptionM2: number;
  meanAlpha: number;
  sabineS: number;
  eyringS: number;
  rating: string;
}

function solveRoomRt60(
  lStr: string,
  wStr: string,
  hStr: string,
  floorAlphaStr: string,
  ceilAlphaStr: string,
  wallAlphaStr: string,
  doorAlphaStr: string,
  doorAreaStr: string,
  winAlphaStr: string,
  winAreaStr: string
): Rt60Result {
  if ([lStr, wStr, hStr, floorAlphaStr, ceilAlphaStr, wallAlphaStr, doorAlphaStr, doorAreaStr, winAlphaStr, winAreaStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All room dimensions, absorption coefficients, and opening areas are required.', volumeM3: 0, totalSurfaceM2: 0, totalAbsorptionM2: 0, meanAlpha: 0, sabineS: 0, eyringS: 0, rating: '' };
  }
  const L = Number(lStr);
  const W = Number(wStr);
  const H = Number(hStr);
  const fa = Number(floorAlphaStr);
  const ca = Number(ceilAlphaStr);
  const wa = Number(wallAlphaStr);
  const da = Number(doorAlphaStr);
  const dA = Number(doorAreaStr);
  const wina = Number(winAlphaStr);
  const winA = Number(winAreaStr);

  if (![L, W, H, fa, ca, wa, da, dA, wina, winA].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', volumeM3: 0, totalSurfaceM2: 0, totalAbsorptionM2: 0, meanAlpha: 0, sabineS: 0, eyringS: 0, rating: '' };
  }
  if (L <= 0 || W <= 0 || H <= 0 || dA < 0 || winA < 0) {
    return { valid: false, error: 'Require positive room dimensions and non-negative opening areas.', volumeM3: 0, totalSurfaceM2: 0, totalAbsorptionM2: 0, meanAlpha: 0, sabineS: 0, eyringS: 0, rating: '' };
  }
  if ([fa, ca, wa, da, wina].some((a) => a <= 0 || a >= 1)) {
    return { valid: false, error: 'Require all surface absorption coefficients strictly between 0 and 1 (0 < alpha < 1).', volumeM3: 0, totalSurfaceM2: 0, totalAbsorptionM2: 0, meanAlpha: 0, sabineS: 0, eyringS: 0, rating: '' };
  }

  const grossWall = 2 * (L + W) * H;
  if (dA + winA > grossWall) {
    return { valid: false, error: 'Combined door + window area cannot exceed gross room wall area.', volumeM3: 0, totalSurfaceM2: 0, totalAbsorptionM2: 0, meanAlpha: 0, sabineS: 0, eyringS: 0, rating: '' };
  }

  const volumeM3 = L * W * H;
  const floorArea = L * W;
  const ceilArea = L * W;
  const netWall = grossWall - dA - winA;
  const totalSurfaceM2 = floorArea + ceilArea + grossWall;
  const totalAbsorptionM2 = floorArea * fa + ceilArea * ca + netWall * wa + dA * da + winA * wina;
  const meanAlpha = totalAbsorptionM2 / totalSurfaceM2;

  const sabineS = (0.1611 * volumeM3) / totalAbsorptionM2;
  const eyringS = (-0.1611 * volumeM3) / (totalSurfaceM2 * Math.log(1 - meanAlpha));

  let rating = 'Very Live (> 2.0 s)';
  if (sabineS < 0.3) rating = 'Very Dead / Studio (< 0.3 s)';
  else if (sabineS < 0.6) rating = 'Dead / Control Room (0.3 - 0.6 s)';
  else if (sabineS < 1.0) rating = 'Clear Speech / Classroom (0.6 - 1.0 s)';
  else if (sabineS < 1.5) rating = 'Medium / Lecture Hall (1.0 - 1.5 s)';
  else if (sabineS < 2.0) rating = 'Live / Performance (1.5 - 2.0 s)';

  return { valid: true, volumeM3, totalSurfaceM2, totalAbsorptionM2, meanAlpha, sabineS, eyringS, rating };
}

export default function RoomAcousticsRT60CalculatorClient() {
  const [lStr, setLStr] = useState('10');
  const [wStr, setWStr] = useState('8');
  const [hStr, setHStr] = useState('3');
  const [faStr, setFaStr] = useState('0.05');
  const [caStr, setCaStr] = useState('0.10');
  const [waStr, setWaStr] = useState('0.05');
  const [daStr, setDaStr] = useState('0.08');
  const [dAStr, setDAStr] = useState('2');
  const [winaStr, setWinaStr] = useState('0.35');
  const [winAStr, setWinAStr] = useState('6');

  const res = solveRoomRt60(lStr, wStr, hStr, faStr, caStr, waStr, daStr, dAStr, winaStr, winAStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Room Reverberation Time (Sabine & Eyring) Report', ''],
      ['Room L x W x H (m)', `${lStr} x ${wStr} x ${hStr}`],
      ['Room Volume V (m^3)', res.volumeM3.toFixed(2)],
      ['Total Surface Area S (m^2)', res.totalSurfaceM2.toFixed(2)],
      ['Equivalent Absorption Area A (m^2 Sabins)', res.totalAbsorptionM2.toFixed(4)],
      ['Mean Absorption Coefficient alpha_bar', res.meanAlpha.toFixed(6)],
      ['Sabine RT60 (s)', res.sabineS.toFixed(4)],
      ['Eyring RT60 (s)', res.eyringS.toFixed(4)],
      ['Acoustic Classification', res.rating],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'room-acoustics-rt60.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Room &amp; Absorption (m)</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">L (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-l" value={lStr} onChange={(e) => setLStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">W (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-w" value={wStr} onChange={(e) => setWStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">H (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-h" value={hStr} onChange={(e) => setHStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Floor alpha</label>
              <input type="text" inputMode="decimal" data-testid="input-fa" value={faStr} onChange={(e) => setFaStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Ceil alpha</label>
              <input type="text" inputMode="decimal" data-testid="input-ca" value={caStr} onChange={(e) => setCaStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Wall alpha</label>
              <input type="text" inputMode="decimal" data-testid="input-wa" value={waStr} onChange={(e) => setWaStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Door alpha</label>
              <input type="text" inputMode="decimal" data-testid="input-da" value={daStr} onChange={(e) => setDaStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Door Area (m2)</label>
              <input type="text" inputMode="decimal" data-testid="input-darea" value={dAStr} onChange={(e) => setDAStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Window alpha</label>
              <input type="text" inputMode="decimal" data-testid="input-wina" value={winaStr} onChange={(e) => setWinaStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Window Area (m2)</label>
              <input type="text" inputMode="decimal" data-testid="input-winarea" value={winAStr} onChange={(e) => setWinAStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setLStr('10'); setWStr('8'); setHStr('3'); setFaStr('0.05'); setCaStr('0.10');
              setWaStr('0.05'); setDaStr('0.08'); setDAStr('2'); setWinaStr('0.35'); setWinAStr('6');
            }}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Sabine &amp; Eyring RT60</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                    <div className="text-xs font-black text-orange-500 uppercase mb-1">Sabine RT60</div>
                    <div className="text-4xl font-black text-orange-800" data-testid="res-sabine">{res.sabineS.toFixed(4)} s</div>
                    <div className="text-xs font-bold text-orange-700 mt-1">{res.rating}</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                    <div className="text-xs font-black text-purple-500 uppercase mb-1">Eyring RT60</div>
                    <div className="text-4xl font-black text-purple-800" data-testid="res-eyring">{res.eyringS.toFixed(4)} s</div>
                    <div className="text-xs font-bold text-purple-700 mt-1">Mean alpha: {res.meanAlpha.toFixed(4)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <div className="text-xs font-bold text-blue-500 uppercase mb-1">Room Volume</div>
                    <div className="text-xl font-black text-blue-800" data-testid="res-vol">{res.volumeM3.toFixed(2)} m3</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-500 uppercase mb-1">Equivalent Absorption A</div>
                    <div className="text-xl font-black text-emerald-800" data-testid="res-abs">{res.totalAbsorptionM2.toFixed(3)} m2 Sabins</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Sabine T60 = 0.1611 * V / A and Eyring T60 = -0.1611 * V / [S * ln(1 - alpha_bar)] at ~20 C (<a href="https://en.wikipedia.org/wiki/Reverberation" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Wikipedia: Reverberation</a>).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
