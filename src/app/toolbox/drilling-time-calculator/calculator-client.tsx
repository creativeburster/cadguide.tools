'use client';

import React, { useMemo, useState } from 'react';
import { Download, Copy, Check, RotateCcw, Settings, Zap, Info, AlertTriangle } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

type HoleType = 'through' | 'blind';

interface DrillingPreset {
  id: string;
  label: string;
  holeDepth: string;
  drillDia: string;
  pointAngle: string;
  holeType: HoleType;
  approach: string;
  feedPerRev: string;
  rpm: string;
  kc: string;
}

const PRESETS: DrillingPreset[] = [
  {
    id: 'default',
    label: 'Default (Ø10 · L25 · Steel kc=2000)',
    holeDepth: '25',
    drillDia: '10',
    pointAngle: '118',
    holeType: 'through',
    approach: '2',
    feedPerRev: '0.20',
    rpm: '800',
    kc: '2000',
  },
  {
    id: 'stainless-135',
    label: 'Stainless Ø12 · 135 deg Blind',
    holeDepth: '40',
    drillDia: '12',
    pointAngle: '135',
    holeType: 'blind',
    approach: '2',
    feedPerRev: '0.15',
    rpm: '1000',
    kc: '2500',
  },
  {
    id: 'aluminum-6061',
    label: 'Aluminum Ø16 · 140 deg Through',
    holeDepth: '30',
    drillDia: '16',
    pointAngle: '140',
    holeType: 'through',
    approach: '3',
    feedPerRev: '0.30',
    rpm: '3000',
    kc: '800',
  },
];

function parsePositive(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0 || n > max) return null;
  return n;
}

function parseNonNeg(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0 || n > max) return null;
  return n;
}

export default function DrillingTimeCalculatorClient() {
  const [holeDepth, setHoleDepth] = useState('25');
  const [drillDia, setDrillDia] = useState('10');
  const [pointAngle, setPointAngle] = useState('118');
  const [holeType, setHoleType] = useState<HoleType>('through');
  const [approach, setApproach] = useState('2');
  const [feedPerRev, setFeedPerRev] = useState('0.20');
  const [rpm, setRpm] = useState('800');
  const [kc, setKc] = useState('2000');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: DrillingPreset) => {
    setHoleDepth(p.holeDepth);
    setDrillDia(p.drillDia);
    setPointAngle(p.pointAngle);
    setHoleType(p.holeType);
    setApproach(p.approach);
    setFeedPerRev(p.feedPerRev);
    setRpm(p.rpm);
    setKc(p.kc);
  };

  const resetAll = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const L = parsePositive(holeDepth, 2000);
    const d = parsePositive(drillDia, 300);
    const theta = parsePositive(pointAngle, 179.9);
    const app = parseNonNeg(approach, 500);
    const fn = parsePositive(feedPerRev, 10);
    const n = parsePositive(rpm, 60000);
    const kcVal = parsePositive(kc, 10000);

    if (
      L === null ||
      d === null ||
      theta === null ||
      theta < 60 ||
      app === null ||
      fn === null ||
      n === null ||
      kcVal === null
    ) {
      return null;
    }

    const halfRad = ((theta / 2) * Math.PI) / 180;
    const tipHeight = d / (2 * Math.tan(halfRad));
    const totalTravel = holeType === 'through' ? L + app + tipHeight : L + app;
    const vc = (Math.PI * d * n) / 1000;
    const vf = fn * n;
    const drillingTimeSec = (60 * totalTravel) / vf;
    const mrr = (Math.PI * d * d * vf) / 4000;
    // Net cutting power Pc (kW) = (Vc * d * fn * kc) / 240000 = (pi * d^2 * vf * kc) / 2.4e8
    const netPowerKw = (Math.PI * d * d * vf * kcVal) / 2.4e8;
    // Drilling torque Mc (N*m) = (Pc * 30000) / (pi * n) = (d^2 * fn * kc) / 8000
    const torqueNm = (d * d * fn * kcVal) / 8000;

    return {
      tipHeight: holeType === 'through' ? tipHeight : 0,
      geometricTip: tipHeight,
      totalTravel,
      vc,
      vf,
      drillingTimeSec,
      mrr,
      netPowerKw,
      torqueNm,
    };
  }, [holeDepth, drillDia, pointAngle, holeType, approach, feedPerRev, rpm, kc]);

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      'Twist Drilling Time, Power & Torque Report',
      `Hole Type: ${holeType} | Depth: ${holeDepth} mm | Drill Dia: ${drillDia} mm | Point Angle: ${pointAngle} deg`,
      `Approach Allowance: ${approach} mm | Total Feed Travel: ${result.totalTravel.toFixed(4)} mm`,
      `Feed per Rev (fn): ${feedPerRev} mm/rev | Spindle Speed (n): ${rpm} RPM`,
      `Feed Rate (vf): ${result.vf.toFixed(2)} mm/min | Cutting Speed (Vc): ${result.vc.toFixed(3)} m/min`,
      `Machining Time (tm): ${result.drillingTimeSec.toFixed(3)} s`,
      `MRR: ${result.mrr.toFixed(3)} cm3/min`,
      `Specific Cutting Force (kc): ${kc} N/mm2 (Reference Estimate)`,
      `Net Cutting Power (Pc): ${result.netPowerKw.toFixed(4)} kW | Torque (Mc): ${result.torqueNm.toFixed(3)} N*m`,
    ].join('\n');
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result) return;
    const rows = [
      ['Parameter', 'Value', 'Unit', 'Notes'],
      ['Hole Depth (L)', holeDepth, 'mm', 'Programmed hole depth'],
      ['Drill Diameter (d)', drillDia, 'mm', 'Twist drill nominal diameter'],
      ['Point Angle', pointAngle, 'deg', 'Standard twist drill point angle'],
      ['Hole Mode', holeType, '-', 'Through adds point tip cone height; Blind uses L + approach'],
      ['Approach Allowance', approach, 'mm', 'Safety rapid-to-feed clearance'],
      ['Drill Point Height', result.geometricTip.toFixed(4), 'mm', 'd / (2 * tan(theta/2))'],
      ['Total Feed Travel', result.totalTravel.toFixed(4), 'mm', 'Total Z-axis feed stroke'],
      ['Feed per Revolution (fn)', feedPerRev, 'mm/rev', 'Input feed per rev'],
      ['Spindle Speed (n)', rpm, 'RPM', 'Input spindle speed'],
      ['Specific Cutting Force (kc)', kc, 'N/mm2', 'Editable empirical reference value'],
      ['Feed Rate (vf)', result.vf.toFixed(2), 'mm/min', 'vf = fn * n'],
      ['Cutting Speed (Vc)', result.vc.toFixed(3), 'm/min', 'Vc = pi * d * n / 1000'],
      ['Machining Time (tm)', result.drillingTimeSec.toFixed(3), 's', 'tm = 60 * L_tot / vf'],
      ['Material Removal Rate (MRR)', result.mrr.toFixed(3), 'cm3/min', 'pi * d^2 * vf / 4000'],
      ['Net Cutting Power (Pc)', result.netPowerKw.toFixed(4), 'kW', 'pi * d^2 * vf * kc / 2.4e8'],
      ['Drilling Torque (Mc)', result.torqueNm.toFixed(3), 'N*m', 'd^2 * fn * kc / 8000'],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      .replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drilling-time-report-${drillDia}mm.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyPreset(p)}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 transition-all cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          data-testid="reset-button"
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Drilling Parameters</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              data-testid="btn-hole-through"
              onClick={() => setHoleType('through')}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                holeType === 'through'
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Through Hole (+Point Tip)
            </button>
            <button
              type="button"
              data-testid="btn-hole-blind"
              onClick={() => setHoleType('blind')}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                holeType === 'blind'
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Blind Hole (Tip to Depth L)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Hole Depth L (mm)
              </label>
              <input
                type="text"
                data-testid="input-hole-depth"
                value={holeDepth}
                onChange={(e) => setHoleDepth(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Drill Dia d (mm)
              </label>
              <input
                type="text"
                data-testid="input-drill-dia"
                value={drillDia}
                onChange={(e) => setDrillDia(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Point Angle (60-179.9 deg)
              </label>
              <input
                type="text"
                data-testid="input-point-angle"
                value={pointAngle}
                onChange={(e) => setPointAngle(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Approach l_app (mm)
              </label>
              <input
                type="text"
                data-testid="input-approach"
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Feed fn (mm/rev)
              </label>
              <input
                type="text"
                data-testid="input-feed"
                value={feedPerRev}
                onChange={(e) => setFeedPerRev(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Spindle Speed n (RPM)
              </label>
              <input
                type="text"
                data-testid="input-rpm"
                value={rpm}
                onChange={(e) => setRpm(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Specific Cutting Force kc (N/mm², Reference Estimate)
            </label>
            <input
              type="text"
              data-testid="input-kc"
              value={kc}
              onChange={(e) => setKc(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-purple-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Typical reference kc: ~800 N/mm² (Aluminum), ~2000 N/mm² (Carbon Steel), ~2500 N/mm² (Stainless). Verify against tool manufacturer catalog for exact grade/chip-thickness.
            </p>
          </div>

          {!result && (
            <div
              data-testid="validation-error"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Enter valid positive numbers (point angle 60–179.9 deg, approach &ge; 0).
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Output</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Machining Time</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-time">{result ? result.drillingTimeSec.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-blue-500 ml-1">s</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Feed Rate (vf)</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-vf">{result ? result.vf.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-emerald-600 ml-1">mm/min</span>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                <div className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">Cutting Speed (Vc)</div>
                <div className="text-2xl font-black text-indigo-900">
                  <span data-testid="result-vc">{result ? result.vc.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-indigo-600 ml-1">m/min</span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <div className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1">Net Power (Pc)</div>
                <div className="text-2xl font-black text-amber-900">
                  <span data-testid="result-power">{result ? result.netPowerKw.toFixed(4) : '—'}</span>
                  <span className="text-sm font-bold text-amber-700 ml-1">kW</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-700 uppercase tracking-wider mb-1">Torque (Mc)</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-torque">{result ? result.torqueNm.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-orange-700 ml-1">N·m</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Total Feed Stroke</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-travel">{result ? result.totalTravel.toFixed(4) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1">mm</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info className="w-4 h-4 text-purple-600 shrink-0" />
                Governing Kinematics &amp; Specific Cutting Force Equations
              </div>
              <p>
                Point Cone Height l_tip = d / (2 * tan(theta / 2)); Total Stroke L_tot = L + l_app + l_tip (through) or L + l_app (blind).
              </p>
              <p>
                vf = fn * n (mm/min); tm = 60 * L_tot / vf (s); Pc = pi * d^2 * vf * kc / (2.4e8) (kW); Mc = d^2 * fn * kc / 8000 (N*m); MRR = pi * d^2 * vf / 4000 (cm^3/min).
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
