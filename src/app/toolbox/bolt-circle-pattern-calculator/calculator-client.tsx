'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download, RotateCcw, Zap, Info } from 'lucide-react';

interface Preset {
  label: string;
  pcd: string;
  boltCount: string;
  startAngle: string;
  holeDia: string;
}

const PRESETS: Preset[] = [
  { label: '8-Bolt Standard (PCD=100, 0°)', pcd: '100', boltCount: '8', startAngle: '0', holeDia: '10' },
  { label: '6-Bolt Hex Flange (PCD=120, 30°)', pcd: '120', boltCount: '6', startAngle: '30', holeDia: '12' },
  { label: '4-Bolt Straddle (PCD=80, 45°)', pcd: '80', boltCount: '4', startAngle: '45', holeDia: '8.5' },
];

const parseNum = (str: string): number => {
  const trimmed = str.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
};

const formatFixed = (n: number, digits = 3): string => {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(digits);
};

export default function BoltCircleClient() {
  const [pcdStr, setPcdStr] = useState('100');
  const [boltCountStr, setBoltCountStr] = useState('8');
  const [startAngleStr, setStartAngleStr] = useState('0');
  const [holeDiaStr, setHoleDiaStr] = useState('10');
  const [centerHole, setCenterHole] = useState(false);

  const summaryAndCoords = useMemo(() => {
    const pcd = parseNum(pcdStr);
    const n = parseNum(boltCountStr);
    const startAngle = parseNum(startAngleStr);
    const holeDia = parseNum(holeDiaStr);

    if (
      !Number.isFinite(pcd) ||
      !Number.isFinite(n) ||
      !Number.isFinite(startAngle) ||
      !Number.isFinite(holeDia) ||
      pcd <= 0 ||
      holeDia <= 0 ||
      n < 2 ||
      n > 360 ||
      !Number.isInteger(n)
    ) {
      return {
        valid: false,
        radius: NaN,
        chord: NaN,
        angleStepDeg: NaN,
        firstX: NaN,
        firstY: NaN,
        pcdVal: 100,
        holeDiaVal: 10,
        coords: [] as Array<{ n: number; xNum: number; yNum: number; x: string; y: string; angleDeg: string }>,
      };
    }

    const r = pcd / 2;
    const angleStep = (2 * Math.PI) / n;
    const angleStepDeg = 360 / n;
    const chord = 2 * r * Math.sin(Math.PI / n);
    const startRad = (startAngle * Math.PI) / 180;

    const coords = Array.from({ length: n }, (_, i) => {
      const angle = startRad + i * angleStep;
      const xNum = r * Math.cos(angle);
      const yNum = r * Math.sin(angle);
      const cleanX = Math.abs(xNum) < 1e-12 ? 0 : xNum;
      const cleanY = Math.abs(yNum) < 1e-12 ? 0 : yNum;
      const rawDeg = ((startAngle + i * angleStepDeg) % 360 + 360) % 360;
      return {
        n: i + 1,
        xNum: cleanX,
        yNum: cleanY,
        x: cleanX.toFixed(3),
        y: cleanY.toFixed(3),
        angleDeg: rawDeg.toFixed(3),
      };
    });

    return {
      valid: true,
      radius: r,
      chord,
      angleStepDeg,
      firstX: coords[0]?.xNum ?? NaN,
      firstY: coords[0]?.yNum ?? NaN,
      pcdVal: pcd,
      holeDiaVal: holeDia,
      coords,
    };
  }, [pcdStr, boltCountStr, startAngleStr, holeDiaStr]);

  const applyPreset = (p: Preset) => {
    setPcdStr(p.pcd);
    setBoltCountStr(p.boltCount);
    setStartAngleStr(p.startAngle);
    setHoleDiaStr(p.holeDia);
  };

  const handleReset = () => {
    setPcdStr('100');
    setBoltCountStr('8');
    setStartAngleStr('0');
    setHoleDiaStr('10');
    setCenterHole(false);
  };

  const downloadCsv = () => {
    const rows = [
      [
        'Hole_Index',
        'X_mm',
        'Y_mm',
        'Angle_deg',
        'PCD_mm',
        'Pitch_Radius_mm',
        'Chord_Length_mm',
        'Hole_Dia_mm',
      ],
    ];
    if (summaryAndCoords.valid) {
      summaryAndCoords.coords.forEach((c) =>
        rows.push([
          String(c.n),
          c.x,
          c.y,
          c.angleDeg,
          pcdStr.trim(),
          formatFixed(summaryAndCoords.radius, 3),
          formatFixed(summaryAndCoords.chord, 3),
          holeDiaStr.trim(),
        ])
      );
      if (centerHole) {
        rows.push([
          'C',
          '0.000',
          '0.000',
          '—',
          pcdStr.trim(),
          formatFixed(summaryAndCoords.radius, 3),
          formatFixed(summaryAndCoords.chord, 3),
          holeDiaStr.trim(),
        ]);
      }
    } else {
      rows.push(['—', '—', '—', '—', pcdStr.trim(), '—', '—', holeDiaStr.trim()]);
    }
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bolt-circle-coordinates.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const safePcd = summaryAndCoords.valid ? summaryAndCoords.pcdVal : 100;
  const safeHoleDia = summaryAndCoords.valid ? summaryAndCoords.holeDiaVal : 10;
  const svgR = Math.min(safePcd / 2 + 20, 180);
  const scale = svgR / (safePcd / 2 + 15);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              CNC Pattern Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  data-testid={`preset-btn-${i}`}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="pattern-pcd-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Pitch Circle Diameter PCD (mm)
            </label>
            <input
              id="pattern-pcd-input"
              data-testid="input-pcd"
              type="text"
              value={pcdStr}
              onChange={(e) => setPcdStr(e.target.value)}
              placeholder="100"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="pattern-count-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Number of Bolts
            </label>
            <input
              id="pattern-count-input"
              data-testid="input-bolt-count"
              type="text"
              value={boltCountStr}
              onChange={(e) => setBoltCountStr(e.target.value)}
              placeholder="8"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all mb-2"
            />
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 6, 8, 10, 12, 16, 24].map((n) => (
                <button
                  key={n}
                  type="button"
                  data-testid={`quick-bolts-${n}`}
                  onClick={() => setBoltCountStr(String(n))}
                  className={`h-9 rounded-xl text-sm font-black border transition-all ${
                    boltCountStr.trim() === String(n)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="pattern-angle-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Start Angle (°)
            </label>
            <input
              id="pattern-angle-input"
              data-testid="input-start-angle"
              type="text"
              value={startAngleStr}
              onChange={(e) => setStartAngleStr(e.target.value)}
              placeholder="0"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
            <div className="mt-2 flex gap-1.5">
              {[0, 45, 90, 180].map((a) => (
                <button
                  key={a}
                  type="button"
                  data-testid={`quick-angle-${a}`}
                  onClick={() => setStartAngleStr(String(a))}
                  className="px-2.5 py-1 rounded-lg text-sm font-bold bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-all"
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="pattern-holedia-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Hole Diameter (mm)
            </label>
            <input
              id="pattern-holedia-input"
              data-testid="input-hole-dia"
              type="text"
              value={holeDiaStr}
              onChange={(e) => setHoleDiaStr(e.target.value)}
              placeholder="10"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              data-testid="checkbox-center-hole"
              checked={centerHole}
              onChange={(e) => setCenterHole(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="text-base font-bold text-slate-600">Add center hole (0, 0)</span>
          </label>

          <button
            type="button"
            data-testid="reset-btn"
            onClick={handleReset}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div
            data-testid="calculator-results"
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Pattern Summary & Hole Coordinates
                </h2>
              </div>
              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-400 uppercase tracking-wider mb-1">
                  Pitch Radius (R)
                </div>
                <div data-testid="result-radius" className="text-2xl font-black text-blue-700">
                  {formatFixed(summaryAndCoords.radius, 3)}
                  <span className="text-sm text-blue-400"> mm</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                <div className="text-xs font-black text-green-400 uppercase tracking-wider mb-1">
                  Chord Length
                </div>
                <div data-testid="result-chord" className="text-2xl font-black text-green-700">
                  {formatFixed(summaryAndCoords.chord, 3)}
                  <span className="text-sm text-green-400"> mm</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-1">
                  Angular Step (Δθ)
                </div>
                <div data-testid="result-angle-step" className="text-2xl font-black text-orange-700">
                  {formatFixed(summaryAndCoords.angleStepDeg, 3)}
                  <span className="text-sm text-orange-400"> °</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">
                  Hole #1 (X₁, Y₁)
                </div>
                <div data-testid="result-hole-1" className="text-lg font-black text-purple-700">
                  {summaryAndCoords.valid
                    ? `(${formatFixed(summaryAndCoords.firstX, 3)}, ${formatFixed(summaryAndCoords.firstY, 3)})`
                    : '—'}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table data-testid="coordinates-table" className="w-full text-lg">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">
                      #
                    </th>
                    <th className="text-right py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">
                      X (mm)
                    </th>
                    <th className="text-right py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">
                      Y (mm)
                    </th>
                    <th className="text-right py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">
                      Angle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summaryAndCoords.valid ? (
                    <>
                      {summaryAndCoords.coords.map((c) => (
                        <tr
                          key={c.n}
                          data-testid={`coord-row-${c.n}`}
                          className="border-b border-slate-50"
                        >
                          <td className="py-2.5 px-2 font-black text-slate-400">{c.n}</td>
                          <td className="py-2.5 px-2 text-right font-bold text-slate-700">{c.x}</td>
                          <td className="py-2.5 px-2 text-right font-bold text-slate-700">{c.y}</td>
                          <td className="py-2.5 px-2 text-right font-bold text-slate-500">
                            {c.angleDeg}°
                          </td>
                        </tr>
                      ))}
                      {centerHole && (
                        <tr
                          data-testid="coord-row-center"
                          className="border-b border-slate-50 bg-blue-50"
                        >
                          <td className="py-2.5 px-2 font-black text-blue-600">C</td>
                          <td className="py-2.5 px-2 text-right font-bold text-blue-600">0.000</td>
                          <td className="py-2.5 px-2 text-right font-bold text-blue-600">0.000</td>
                          <td className="py-2.5 px-2 text-right font-bold text-blue-400">—</td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <tr data-testid="coord-row-invalid">
                      <td colSpan={4} className="py-6 text-center font-bold text-slate-400">
                        —
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  Cartesian CNC Coordinate Equations:{' '}
                  <code>X_i = (PCD / 2) × cos(θ₀ + 360° × (i - 1) / N)</code>,{' '}
                  <code>Y_i = (PCD / 2) × sin(θ₀ + 360° × (i - 1) / N)</code>,{' '}
                  <code>Chord = PCD × sin(180° / N)</code>.
                </div>
              </div>
            </div>
          </div>

          {/* SVG Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Bolt Circle Preview</h3>
            <div className="flex justify-center">
              <svg
                viewBox={`-${svgR + 5} -${svgR + 5} ${2 * svgR + 10} ${2 * svgR + 10}`}
                className="w-full max-w-[360px]"
              >
                <circle
                  cx="0"
                  cy="0"
                  r={(safePcd / 2) * scale}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
                {centerHole && summaryAndCoords.valid && (
                  <circle
                    cx="0"
                    cy="0"
                    r={(safeHoleDia / 2) * scale}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                )}
                {summaryAndCoords.valid &&
                  summaryAndCoords.coords.map((c) => (
                    <circle
                      key={c.n}
                      cx={c.xNum * scale}
                      cy={-c.yNum * scale}
                      r={(safeHoleDia / 2) * scale}
                      fill="#3b82f6"
                      opacity="0.3"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                    />
                  ))}
                <line
                  x1="0"
                  y1="0"
                  x2={(safePcd / 2) * scale}
                  y2="0"
                  stroke="#94a3b8"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                />
                <text x={(safePcd / 4) * scale} y="-3" className="fill-slate-400 text-[8px]">
                  PCD={summaryAndCoords.valid ? safePcd : '—'}
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
