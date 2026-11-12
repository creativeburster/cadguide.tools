'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw, AlertTriangle } from 'lucide-react';

interface CyclePreset {
  id: string;
  label: string;
  cutLength: string;
  cutFeed: string;
  rapidLength: string;
  rapidSpeed: string;
  toolChanges: string;
  toolChangeSec: string;
  auxSec: string;
}

const PRESETS: CyclePreset[] = [
  {
    id: 'prismatic-pocket-default',
    label: '3-Axis Prismatic Pocket (Default)',
    cutLength: '5000',
    cutFeed: '800',
    rapidLength: '500',
    rapidSpeed: '10000',
    toolChanges: '3',
    toolChangeSec: '5',
    auxSec: '0',
  },
  {
    id: 'hsm-aluminum-finishing',
    label: 'High-Speed Aluminum Finishing',
    cutLength: '18000',
    cutFeed: '3600',
    rapidLength: '1200',
    rapidSpeed: '24000',
    toolChanges: '2',
    toolChangeSec: '3',
    auxSec: '10',
  },
  {
    id: 'single-tool-contour',
    label: 'Single-Tool Contouring (No Rapid / No TC)',
    cutLength: '2400',
    cutFeed: '600',
    rapidLength: '0',
    rapidSpeed: '15000',
    toolChanges: '0',
    toolChangeSec: '5',
    auxSec: '0',
  },
];

function parseStrictNum(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

export default function CncCycleTimeCalculatorClient() {
  const [cutLengthStr, setCutLengthStr] = useState('5000');
  const [cutFeedStr, setCutFeedStr] = useState('800');
  const [rapidLengthStr, setRapidLengthStr] = useState('500');
  const [rapidSpeedStr, setRapidSpeedStr] = useState('10000');
  const [toolChangesStr, setToolChangesStr] = useState('3');
  const [toolChangeSecStr, setToolChangeSecStr] = useState('5');
  const [auxSecStr, setAuxSecStr] = useState('0');

  const applyPreset = (p: CyclePreset) => {
    setCutLengthStr(p.cutLength);
    setCutFeedStr(p.cutFeed);
    setRapidLengthStr(p.rapidLength);
    setRapidSpeedStr(p.rapidSpeed);
    setToolChangesStr(p.toolChanges);
    setToolChangeSecStr(p.toolChangeSec);
    setAuxSecStr(p.auxSec);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const calc = useMemo(() => {
    const lCut = parseStrictNum(cutLengthStr);
    const fCut = parseStrictNum(cutFeedStr);
    const lRapid = parseStrictNum(rapidLengthStr);
    const fRapid = parseStrictNum(rapidSpeedStr);
    const nTc = parseStrictNum(toolChangesStr);
    const tTc = parseStrictNum(toolChangeSecStr);
    const tAux = parseStrictNum(auxSecStr);

    if (
      !Number.isFinite(lCut) ||
      !Number.isFinite(fCut) ||
      !Number.isFinite(lRapid) ||
      !Number.isFinite(fRapid) ||
      !Number.isFinite(nTc) ||
      !Number.isFinite(tTc) ||
      !Number.isFinite(tAux)
    ) {
      return {
        valid: false as const,
        error: 'Enter valid finite numbers for all path lengths, feed/rapid speeds, and non-cutting times.',
      };
    }

    if (lCut < 0 || lRapid < 0) {
      return { valid: false as const, error: 'Cutting and rapid travel distances must be ≥ 0 mm.' };
    }
    if (fCut <= 0 || fRapid <= 0) {
      return { valid: false as const, error: 'Cutting feed rate F_cut and rapid speed F_rapid must be > 0 mm/min.' };
    }
    if (!Number.isInteger(nTc) || nTc < 0 || nTc > 1000) {
      return { valid: false as const, error: 'Tool change count N_tc must be an integer between 0 and 1,000.' };
    }
    if (tTc < 0 || tAux < 0) {
      return { valid: false as const, error: 'Per-tool change time and auxiliary/dwell time must be ≥ 0 s.' };
    }

    // Unit derivation:
    // t_cut [min] = L_cut [mm] / F_cut [mm/min] ; t_cut [s] = t_cut [min] * 60 [s/min]
    // t_rapid [min] = L_rapid [mm] / F_rapid [mm/min] ; t_rapid [s] = t_rapid [min] * 60 [s/min]
    // t_noncut [s] = N_tc * t_tc [s] + t_aux [s]
    // t_total [s] = t_cut [s] + t_rapid [s] + t_noncut [s] ; t_total [min] = t_total [s] / 60
    const cutMin = lCut / fCut;
    const cutSec = cutMin * 60;
    const rapidMin = lRapid / fRapid;
    const rapidSec = rapidMin * 60;
    const nonCutSec = nTc * tTc + tAux;
    const totalSec = cutSec + rapidSec + nonCutSec;
    const totalMin = totalSec / 60;

    if (totalSec <= 0) {
      return {
        valid: false as const,
        error: 'Total cycle time must be greater than 0 s (enter a positive path length or non-cutting time).',
      };
    }

    const partsPerHour = 3600 / totalSec;

    return {
      valid: true as const,
      lCut,
      fCut,
      lRapid,
      fRapid,
      nTc,
      tTc,
      tAux,
      cutMin,
      cutSec,
      rapidMin,
      rapidSec,
      nonCutSec,
      totalSec,
      totalMin,
      partsPerHour,
    };
  }, [cutLengthStr, cutFeedStr, rapidLengthStr, rapidSpeedStr, toolChangesStr, toolChangeSecStr, auxSecStr]);

  const handleExportCsv = () => {
    if (!calc.valid) return;
    const rows = [
      ['# CNC Machining Cycle Time Report', ''],
      ['# Formula', 't_min = L_cut/F_cut + L_rapid/F_rapid + (N_tc*t_tc + t_aux)/60'],
      ['Cutting Path Length L_cut (mm)', String(calc.lCut)],
      ['Cutting Feed Rate F_cut (mm/min)', String(calc.fCut)],
      ['Rapid Traverse Length L_rapid (mm)', String(calc.lRapid)],
      ['Rapid Traverse Speed F_rapid (mm/min)', String(calc.fRapid)],
      ['Tool Change Count N_tc', String(calc.nTc)],
      ['Time per Tool Change t_tc (s)', String(calc.tTc)],
      ['Auxiliary / Load-Unload / Dwell Time t_aux (s)', String(calc.tAux)],
      ['Cutting Time (s)', calc.cutSec.toFixed(2)],
      ['Rapid Traverse Time (s)', calc.rapidSec.toFixed(2)],
      ['Tool Change & Auxiliary Time (s)', calc.nonCutSec.toFixed(2)],
      ['Total Cycle Time (s)', calc.totalSec.toFixed(2)],
      ['Total Cycle Time (min)', calc.totalMin.toFixed(3)],
      ['Theoretical Output at 100% Uptime (parts/hr)', calc.partsPerHour.toFixed(2)],
    ];

    const csv = rows.map((r) => r.join(',')).join('\r\n') + '\r\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cnc-cycle-time-calculation.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Presets */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Machining Operation Presets
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Editable Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label htmlFor="cyc-lcut" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Cutting Path Length L_cut (mm)
            </label>
            <input
              id="cyc-lcut"
              data-testid="input-cut-length"
              type="text"
              inputMode="decimal"
              value={cutLengthStr}
              onChange={(e) => setCutLengthStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-600/10 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="cyc-fcut" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Cutting Feed Rate F_cut (mm/min)
            </label>
            <input
              id="cyc-fcut"
              data-testid="input-cut-feed"
              type="text"
              inputMode="decimal"
              value={cutFeedStr}
              onChange={(e) => setCutFeedStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-600/10 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cyc-lrapid" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Rapid Distance (mm)
              </label>
              <input
                id="cyc-lrapid"
                data-testid="input-rapid-length"
                type="text"
                inputMode="decimal"
                value={rapidLengthStr}
                onChange={(e) => setRapidLengthStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-600/10 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label htmlFor="cyc-frapid" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Rapid Speed (mm/min)
              </label>
              <input
                id="cyc-frapid"
                data-testid="input-rapid-speed"
                type="text"
                inputMode="decimal"
                value={rapidSpeedStr}
                onChange={(e) => setRapidSpeedStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-600/10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cyc-ntc" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Tool Changes N_tc
              </label>
              <input
                id="cyc-ntc"
                data-testid="input-tool-changes"
                type="text"
                inputMode="numeric"
                value={toolChangesStr}
                onChange={(e) => setToolChangesStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-600/10 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label htmlFor="cyc-ttc" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Change Time t_tc (s)
              </label>
              <input
                id="cyc-ttc"
                data-testid="input-tool-change-time"
                type="text"
                inputMode="decimal"
                value={toolChangeSecStr}
                onChange={(e) => setToolChangeSecStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-600/10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cyc-taux" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Auxiliary / Dwell / Load Time t_aux (s)
            </label>
            <input
              id="cyc-taux"
              data-testid="input-aux-time"
              type="text"
              inputMode="decimal"
              value={auxSecStr}
              onChange={(e) => setAuxSecStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-600/10 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div data-testid="calculator-results" className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Cycle Time Breakdown</h2>
              </div>
              <button
                type="button"
                data-testid="export-csv-button"
                disabled={!calc.valid}
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!calc.valid && (
              <div
                data-testid="validation-alert"
                className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>{calc.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <div className="text-xs font-black text-amber-700 uppercase tracking-wider mb-2">Total Cycle Time</div>
                <div className="text-3xl font-black text-amber-950">
                  <span data-testid="result-total-min">{calc.valid ? calc.totalMin.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-amber-600 ml-1.5">min</span>
                </div>
                <div className="text-xs font-bold text-amber-700 mt-1">
                  (<span data-testid="result-total-sec">{calc.valid ? calc.totalSec.toFixed(2) : '—'}</span> s total)
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-xs font-black text-purple-700 uppercase tracking-wider mb-2">
                  Theoretical Output (100% Uptime)
                </div>
                <div className="text-3xl font-black text-purple-950">
                  <span data-testid="result-parts-per-hour">{calc.valid ? calc.partsPerHour.toFixed(2) : '—'}</span>
                  <span className="text-base font-bold text-purple-500 ml-1.5">parts/hr</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Cutting Time</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-cutting-sec">{calc.valid ? calc.cutSec.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-blue-500 ml-1">s</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Rapid Time (G0)</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-rapid-sec">{calc.valid ? calc.rapidSec.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-emerald-500 ml-1">s</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Tool Change &amp; Aux
                </div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-noncut-sec">{calc.valid ? calc.nonCutSec.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-slate-400 ml-1">s</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                <Info className="w-4 h-4 text-purple-600 shrink-0" />
                Unit Derivation &amp; Practical Limitations
              </div>
              <p>
                <strong>Core Kinematic Formula:</strong> <code>t = L / F</code> where path distance{' '}
                <code>L [mm] ÷ feed rate F [mm/min] = time [min]</code> (multiply by <code>60 s/min</code> to obtain
                seconds). Total cycle time sums cutting feed time <code>L_cut / F_cut</code>, rapid traverse time{' '}
                <code>L_rapid / F_rapid</code>, tool-change time <code>N_tc × t_tc</code>, and editable auxiliary/dwell
                time <code>t_aux</code>.
              </p>
              <p className="text-slate-500">
                <strong>Limitation:</strong> Constant-velocity path division does not model CNC look-ahead corner
                deceleration, spindle ramp-up, or ATC arm retract overhead; verify critical production quotes using CAM
                simulation or machine dry-run timing.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
