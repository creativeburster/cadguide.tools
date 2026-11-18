'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface PointCloudResult {
  valid: boolean;
  error?: string;
  surfaceDensityPtsM2: number;
  meanSpacingMm: number;
  volumetricDensityPtsM3: number;
  footprintCoveragePct: number;
  uncompressedMb: number;
}

function solvePointCloud(
  pointsStr: string,
  areaStr: string,
  heightStr: string,
  resMmStr: string,
  bytesPerPtStr: string
): PointCloudResult {
  if ([pointsStr, areaStr, heightStr, resMmStr, bytesPerPtStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All scan geometry and point count inputs are required.', surfaceDensityPtsM2: 0, meanSpacingMm: 0, volumetricDensityPtsM3: 0, footprintCoveragePct: 0, uncompressedMb: 0 };
  }
  const N = Number(pointsStr);
  const A = Number(areaStr);
  const H = Number(heightStr);
  const resMm = Number(resMmStr);
  const bpp = Number(bytesPerPtStr);

  if (![N, A, H, resMm, bpp].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', surfaceDensityPtsM2: 0, meanSpacingMm: 0, volumetricDensityPtsM3: 0, footprintCoveragePct: 0, uncompressedMb: 0 };
  }
  if (N <= 0 || A <= 0 || H <= 0 || resMm <= 0 || bpp <= 0) {
    return { valid: false, error: 'Points, area, bounding height, footprint radius, and bytes/point must be strictly positive.', surfaceDensityPtsM2: 0, meanSpacingMm: 0, volumetricDensityPtsM3: 0, footprintCoveragePct: 0, uncompressedMb: 0 };
  }

  const surfaceDensityPtsM2 = N / A;
  const meanSpacingMm = 1000 / Math.sqrt(surfaceDensityPtsM2);
  const volumetricDensityPtsM3 = N / (A * H);
  const spotAreaM2 = Math.PI * Math.pow(resMm / 1000, 2);
  const footprintCoveragePct = Math.min(100, (1 - Math.exp(-surfaceDensityPtsM2 * spotAreaM2)) * 100);
  const uncompressedMb = (N * bpp) / (1024 * 1024);

  return { valid: true, surfaceDensityPtsM2, meanSpacingMm, volumetricDensityPtsM3, footprintCoveragePct, uncompressedMb };
}

export default function PointCloudDensityCalculatorClient() {
  const [pointsStr, setPointsStr] = useState('5000000');
  const [areaStr, setAreaStr] = useState('1000');
  const [heightStr, setHeightStr] = useState('3');
  const [resMmStr, setResMmStr] = useState('5');
  const [bytesStr, setBytesStr] = useState('28');

  const res = solvePointCloud(pointsStr, areaStr, heightStr, resMmStr, bytesStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Point Cloud Density & Storage Report', ''],
      ['Total Point Count', pointsStr],
      ['Scanned Surface Area (m2)', areaStr],
      ['Bounding Envelope Height (m)', heightStr],
      ['Spot Radius (mm)', resMmStr],
      ['Bytes per Point (bytes)', bytesStr],
      ['Surface Point Density (pts/m2)', res.surfaceDensityPtsM2.toFixed(2)],
      ['Mean Grid Spacing (mm)', res.meanSpacingMm.toFixed(4)],
      ['Volumetric Density (pts/m3)', res.volumetricDensityPtsM3.toFixed(2)],
      ['Poisson Footprint Coverage (%)', res.footprintCoveragePct.toFixed(3)],
      ['Estimated Raw Storage (MiB)', res.uncompressedMb.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'point-cloud-density.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Total Points N</label>
            <input type="text" inputMode="decimal" data-testid="input-points" value={pointsStr} onChange={(e) => setPointsStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Area A (m^2)</label>
              <input type="text" inputMode="decimal" data-testid="input-area" value={areaStr} onChange={(e) => setAreaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Box Height H (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-height" value={heightStr} onChange={(e) => setHeightStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Spot Radius r (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-spot" value={resMmStr} onChange={(e) => setResMmStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Bytes / Point</label>
              <input type="text" inputMode="decimal" data-testid="input-bytes" value={bytesStr} onChange={(e) => setBytesStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setPointsStr('5000000'); setAreaStr('1000'); setHeightStr('3'); setResMmStr('5'); setBytesStr('28'); }}
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">
                {res.error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Surface Point Density</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-density">
                      {res.surfaceDensityPtsM2.toFixed(1)}<span className="text-lg text-blue-400"> pts/m^2</span>
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Mean Point Spacing</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-spacing">
                      {res.meanSpacingMm.toFixed(4)}<span className="text-lg text-emerald-500"> mm</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Volumetric Density</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-vol-density">{res.volumetricDensityPtsM3.toFixed(2)} pts/m^3</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Poisson Coverage</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-coverage">{res.footprintCoveragePct.toFixed(3)} %</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Uncompressed Size</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-size">{res.uncompressedMb.toFixed(2)} MiB</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Surface density rho_A = N / A; grid-equivalent spacing s = 1000 / sqrt(rho_A); random Poisson footprint model: 1 - exp(-rho_A * pi * r^2).
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
