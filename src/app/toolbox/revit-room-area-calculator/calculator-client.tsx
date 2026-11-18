'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface RoomAreaResult {
  valid: boolean;
  error?: string;
  netFloorAreaM2: number;
  centerlineAreaM2: number;
  grossWallAreaM2: number;
  netWallAreaM2: number;
  volumeM3: number;
  perimeterM: number;
}

function solveRoomArea(
  lenStr: string,
  widStr: string,
  heightStr: string,
  openAreaStr: string,
  wallHalfThickStr: string
): RoomAreaResult {
  if ([lenStr, widStr, heightStr, openAreaStr, wallHalfThickStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All room dimensions, opening deduction, and centerline offset inputs are required.', netFloorAreaM2: 0, centerlineAreaM2: 0, grossWallAreaM2: 0, netWallAreaM2: 0, volumeM3: 0, perimeterM: 0 };
  }
  const L = Number(lenStr);
  const W = Number(widStr);
  const H = Number(heightStr);
  const Aopen = Number(openAreaStr);
  const tHalf = Number(wallHalfThickStr);

  if (![L, W, H, Aopen, tHalf].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', netFloorAreaM2: 0, centerlineAreaM2: 0, grossWallAreaM2: 0, netWallAreaM2: 0, volumeM3: 0, perimeterM: 0 };
  }
  if (L <= 0 || W <= 0 || H <= 0 || Aopen < 0 || tHalf < 0) {
    return { valid: false, error: 'Require positive room L/W/H and non-negative opening deduction and wall half-thickness.', netFloorAreaM2: 0, centerlineAreaM2: 0, grossWallAreaM2: 0, netWallAreaM2: 0, volumeM3: 0, perimeterM: 0 };
  }

  const netFloorAreaM2 = L * W;
  const centerlineAreaM2 = (L + 2 * tHalf) * (W + 2 * tHalf);
  const perimeterM = 2 * (L + W);
  const grossWallAreaM2 = perimeterM * H;
  if (Aopen > grossWallAreaM2) {
    return { valid: false, error: 'Opening deduction area cannot exceed gross wall surface area.', netFloorAreaM2: 0, centerlineAreaM2: 0, grossWallAreaM2: 0, netWallAreaM2: 0, volumeM3: 0, perimeterM: 0 };
  }
  const netWallAreaM2 = grossWallAreaM2 - Aopen;
  const volumeM3 = netFloorAreaM2 * H;

  return { valid: true, netFloorAreaM2, centerlineAreaM2, grossWallAreaM2, netWallAreaM2, volumeM3, perimeterM };
}

export default function RevitRoomAreaCalculatorClient() {
  const [lenStr, setLenStr] = useState('5');
  const [widStr, setWidStr] = useState('4');
  const [heightStr, setHeightStr] = useState('3');
  const [openStr, setOpenStr] = useState('4');
  const [halfThickStr, setHalfThickStr] = useState('0.10');

  const res = solveRoomArea(lenStr, widStr, heightStr, openStr, halfThickStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Room Geometry, Centerline Area & Volume Takeoff', ''],
      ['Clear Room Length L (m)', lenStr],
      ['Clear Room Width W (m)', widStr],
      ['Clear Ceiling Height H (m)', heightStr],
      ['Door/Window Opening Deduction (m^2)', openStr],
      ['Wall Centerline Half-Thickness (m)', halfThickStr],
      ['Net Clear Floor Area (m^2)', res.netFloorAreaM2.toFixed(4)],
      ['Wall-Centerline Gross Area (m^2)', res.centerlineAreaM2.toFixed(4)],
      ['Net Wall Finish Area (m^2)', res.netWallAreaM2.toFixed(4)],
      ['Room Air Volume (m^3)', res.volumeM3.toFixed(4)],
      ['Clear Room Perimeter (m)', res.perimeterM.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revit-room-takeoff.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Room Dimensions</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Length L (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-len" value={lenStr} onChange={(e) => setLenStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Width W (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-wid" value={widStr} onChange={(e) => setWidStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Height H (m)</label>
            <input type="text" inputMode="decimal" data-testid="input-height" value={heightStr} onChange={(e) => setHeightStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Openings Deduct (m2)</label>
              <input type="text" inputMode="decimal" data-testid="input-open" value={openStr} onChange={(e) => setOpenStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Wall Half-Thick (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-half-thick" value={halfThickStr} onChange={(e) => setHalfThickStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setLenStr('5'); setWidStr('4'); setHeightStr('3'); setOpenStr('4'); setHalfThickStr('0.10'); }}
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Room Schedule Quantities</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase mb-1">Net Clear Floor Area</div>
                  <div className="text-3xl font-black text-blue-800" data-testid="res-net-area">{res.netFloorAreaM2.toFixed(3)} m2</div>
                  <div className="text-xs font-bold text-blue-700 mt-1" data-testid="res-center-area">Centerline Area: {res.centerlineAreaM2.toFixed(3)} m2</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase mb-1">Net Wall Finish Area</div>
                  <div className="text-3xl font-black text-emerald-800" data-testid="res-wall-area">{res.netWallAreaM2.toFixed(3)} m2</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">Gross: {res.grossWallAreaM2.toFixed(2)} m2</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase mb-1">Room Volume</div>
                  <div className="text-3xl font-black text-orange-800" data-testid="res-vol">{res.volumeM3.toFixed(3)} m3</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <div className="text-xs font-black text-purple-500 uppercase mb-1">Clear Room Perimeter</div>
                  <div className="text-3xl font-black text-purple-800" data-testid="res-perim">{res.perimeterM.toFixed(3)} m</div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Net Area = L * W; Centerline Area = (L + 2*t_half)*(W + 2*t_half); Net Wall Finish = 2*(L+W)*H - Opening Deduction.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
