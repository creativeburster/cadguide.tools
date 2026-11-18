'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  ShieldCheck,
  Upload,
  Users,
} from 'lucide-react';

const ACAD_VERSIONS: Record<string, string> = {
  AC1032: 'AutoCAD 2018-2026 DWG/DXF Format',
  AC1027: 'AutoCAD 2013-2017 DWG/DXF Format',
  AC1024: 'AutoCAD 2010-2012 DWG/DXF Format',
  AC1021: 'AutoCAD 2007-2009 DWG/DXF Format',
  AC1018: 'AutoCAD 2004-2006 DWG/DXF Format',
  AC1015: 'AutoCAD 2000-2002 DWG/DXF Format',
};

interface LicensePreset {
  id: string;
  label: string;
  ownedSeats: string;
  engineers: string;
  activeHours: string;
  shiftHours: string;
  idleMinutes: string;
  timeoutMinutes: string;
  peakFactor: string;
}

const PRESETS: LicensePreset[] = [
  {
    id: 'baseline-team',
    label: 'Preset 1: 40 Engineers / 25 Floating Seats (60m idle -> 15m timeout)',
    ownedSeats: '25',
    engineers: '40',
    activeHours: '4',
    shiftHours: '8',
    idleMinutes: '60',
    timeoutMinutes: '15',
    peakFactor: '1.2',
  },
  {
    id: 'tight-pool',
    label: 'Preset 2: High-Density Pool (60 Engineers / 30 Seats)',
    ownedSeats: '30',
    engineers: '60',
    activeHours: '3.5',
    shiftHours: '8',
    idleMinutes: '90',
    timeoutMinutes: '20',
    peakFactor: '1.25',
  },
  {
    id: 'zero-reclaim-test',
    label: 'Preset 3: Strict Check (20 Engineers / 12 Seats, 0m idle)',
    ownedSeats: '12',
    engineers: '20',
    activeHours: '4',
    shiftHours: '8',
    idleMinutes: '0',
    timeoutMinutes: '15',
    peakFactor: '1.0',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function parseNonNegative(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

function parsePosInt(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return NaN;
  const n = Number(t);
  return Number.isSafeInteger(n) && n >= 1 ? n : NaN;
}

function fmt(n: number, decimals = 4): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : 'N/A';
}

export default function OnlineCadLicenseAuditShieldClient() {
  const [ownedSeatsStr, setOwnedSeatsStr] = useState('25');
  const [engineersStr, setEngineersStr] = useState('40');
  const [activeHoursStr, setActiveHoursStr] = useState('4');
  const [shiftHoursStr, setShiftHoursStr] = useState('8');
  const [idleMinutesStr, setIdleMinutesStr] = useState('60');
  const [timeoutMinutesStr, setTimeoutMinutesStr] = useState('15');
  const [peakFactorStr, setPeakFactorStr] = useState('1.2');
  const [fileCheckMsg, setFileCheckMsg] = useState('No local DWG/DXF inspected (optional client-side header read)');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: LicensePreset) => {
    setOwnedSeatsStr(p.ownedSeats);
    setEngineersStr(p.engineers);
    setActiveHoursStr(p.activeHours);
    setShiftHoursStr(p.shiftHours);
    setIdleMinutesStr(p.idleMinutes);
    setTimeoutMinutesStr(p.timeoutMinutes);
    setPeakFactorStr(p.peakFactor);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
    setFileCheckMsg('No local DWG/DXF inspected (optional client-side header read)');
  };

  const handleLocalCadCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const headBytes = new Uint8Array(await file.slice(0, 6).arrayBuffer());
    const dwgMagic = Array.from(headBytes)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : ''))
      .join('');
    if (ACAD_VERSIONS[dwgMagic]) {
      setFileCheckMsg(`${file.name}: DWG ${dwgMagic} (${ACAD_VERSIONS[dwgMagic]}, 0 bytes uploaded)`);
      return;
    }
    const textHead = await file.slice(0, 4096).text();
    const dxfMatch = textHead.match(/\$ACADVER\s+1\s+(AC\d{4})/i);
    if (dxfMatch) {
      const code = dxfMatch[1].toUpperCase();
      setFileCheckMsg(`${file.name}: ASCII DXF ${code} (${ACAD_VERSIONS[code] || 'AutoCAD Release'}, 0 bytes uploaded)`);
      return;
    }
    setFileCheckMsg(`${file.name}: ${file.size} bytes read locally (no AC10xx signature in first 4 KB)`);
  };

  const evalResult = useMemo(() => {
    const ownedSeats = parsePosInt(ownedSeatsStr);
    const engineers = parsePosInt(engineersStr);
    const activeHours = parsePositive(activeHoursStr);
    const shiftHours = parsePositive(shiftHoursStr);
    const idleMinutes = parseNonNegative(idleMinutesStr);
    const timeoutMinutes = parsePositive(timeoutMinutesStr);
    const peakFactor = parsePositive(peakFactorStr);

    if (
      !Number.isFinite(ownedSeats) ||
      !Number.isFinite(engineers) ||
      !Number.isFinite(activeHours) ||
      !Number.isFinite(shiftHours) ||
      !Number.isFinite(idleMinutes) ||
      !Number.isFinite(timeoutMinutes) ||
      !Number.isFinite(peakFactor)
    ) {
      return {
        valid: false as const,
        error: 'Seat/engineer counts must be positive integers; hours, timeout, and peak factor must be > 0; idle minutes >= 0.',
      };
    }
    if (peakFactor < 1) {
      return { valid: false as const, error: 'Peak concurrency factor must be >= 1.0.' };
    }
    if (activeHours > shiftHours) {
      return { valid: false as const, error: 'Active CAD hours per day cannot exceed shift duration hours.' };
    }

    const retainedIdleHrs = Math.min(idleMinutes, timeoutMinutes) / 60;
    const rawIdleHrs = idleMinutes / 60;
    const hoursNoReclaim = activeHours + rawIdleHrs;
    const hoursWithReclaim = activeHours + retainedIdleHrs;

    const avgConcurrentNoReclaim = (engineers * hoursNoReclaim) / shiftHours;
    const avgConcurrentWithReclaim = (engineers * hoursWithReclaim) / shiftHours;

    const peakSeatsNoReclaim = avgConcurrentNoReclaim * peakFactor;
    const peakSeatsWithReclaim = avgConcurrentWithReclaim * peakFactor;
    const reclaimedSeatEquivalent = peakSeatsNoReclaim - peakSeatsWithReclaim;
    const poolUtilizationPct = (peakSeatsWithReclaim / ownedSeats) * 100;

    return {
      valid: true as const,
      ownedSeats,
      engineers,
      avgConcurrentWithReclaim,
      peakSeatsNoReclaim,
      peakSeatsWithReclaim,
      reclaimedSeatEquivalent,
      poolUtilizationPct,
      headroomSeats: ownedSeats - peakSeatsWithReclaim,
    };
  }, [ownedSeatsStr, engineersStr, activeHoursStr, shiftHoursStr, idleMinutesStr, timeoutMinutesStr, peakFactorStr]);

  const handleCopy = () => {
    if (!evalResult.valid) return;
    const report = [
      'Floating CAD License Utilization & Idle Reclamation Summary',
      `Owned Floating Seats: ${evalResult.ownedSeats} | Active Engineers: ${evalResult.engineers}`,
      `Avg Concurrent Demand (with timeout): ${fmt(evalResult.avgConcurrentWithReclaim)} seats`,
      `Peak Demand without Reclamation: ${fmt(evalResult.peakSeatsNoReclaim)} seats`,
      `Peak Demand with Timeout Reclamation: ${fmt(evalResult.peakSeatsWithReclaim)} seats`,
      `Equivalent Seats Reclaimed: ${fmt(evalResult.reclaimedSeatEquivalent)} seats`,
      `Pool Peak Utilization: ${fmt(evalResult.poolUtilizationPct)}%`,
    ].join('\n');

    navigator.clipboard
      .writeText(report)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!evalResult.valid) return;
    const lines = [
      'Metric,Value,Unit',
      `Owned Floating Seats,${evalResult.ownedSeats},seats`,
      `Active Engineers,${evalResult.engineers},users`,
      `Avg Concurrent Demand With Timeout,${evalResult.avgConcurrentWithReclaim.toFixed(6)},seats`,
      `Peak Demand Without Reclamation,${evalResult.peakSeatsNoReclaim.toFixed(6)},seats`,
      `Peak Demand With Reclamation,${evalResult.peakSeatsWithReclaim.toFixed(6)},seats`,
      `Equivalent Seats Reclaimed,${evalResult.reclaimedSeatEquivalent.toFixed(6)},seats`,
      `Pool Peak Utilization,${evalResult.poolUtilizationPct.toFixed(6)},%`,
      `Remaining Peak Headroom,${evalResult.headroomSeats.toFixed(6)},seats`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cad_floating_license_utilization.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local SAM Calculation &amp; Header Check Only:</span> Computes floating concurrent seat utilization and optional client-side `.dwg`/`.dxf` header version reads (`AC1015`–`AC1032`) directly in your browser. It does not inspect network FlexNet daemons or transmit licensing records externally.
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Floating Pool Parameters</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Owned Seats</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-owned-seats"
                value={ownedSeatsStr}
                onChange={(e) => setOwnedSeatsStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Active Engineers</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-engineers"
                value={engineersStr}
                onChange={(e) => setEngineersStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Active Hours / Day</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-active-hours"
                value={activeHoursStr}
                onChange={(e) => setActiveHoursStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Shift Duration (h)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-shift-hours"
                value={shiftHoursStr}
                onChange={(e) => setShiftHoursStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Avg Idle Hold (min)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-idle-minutes"
                value={idleMinutesStr}
                onChange={(e) => setIdleMinutesStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Idle Timeout (min)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-timeout-minutes"
                value={timeoutMinutesStr}
                onChange={(e) => setTimeoutMinutesStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Peak Concurrency Factor (&gt;= 1.0)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-peak-factor"
              value={peakFactorStr}
              onChange={(e) => setPeakFactorStr(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Check Local DWG/DXF Header Version
              <input type="file" accept=".dwg,.dxf" onChange={handleLocalCadCheck} className="hidden" />
            </label>
            <div className="text-xs text-slate-500 font-mono break-all">{fileCheckMsg}</div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-black text-slate-900">Seat Demand &amp; Reclamation Analysis</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!evalResult.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  onClick={handleDownloadCsv}
                  disabled={!evalResult.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!evalResult.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{evalResult.error}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="text-xs font-black text-blue-600 uppercase">Peak Demand (With Timeout)</div>
                  <div className="text-2xl font-black text-blue-900 mt-1">
                    <span data-testid="out-peak-with">{fmt(evalResult.peakSeatsWithReclaim)}</span>
                    <span className="text-sm text-blue-500"> seats</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-black text-slate-600 uppercase">Peak Demand (No Timeout)</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    <span data-testid="out-peak-without">{fmt(evalResult.peakSeatsNoReclaim)}</span>
                    <span className="text-sm text-slate-500"> seats</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-600 uppercase">Equivalent Reclaimed Seats</div>
                  <div className="text-2xl font-black text-emerald-800 mt-1">
                    <span data-testid="out-reclaimed">{fmt(evalResult.reclaimedSeatEquivalent)}</span>
                    <span className="text-sm text-emerald-600"> seats</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="text-xs font-black text-amber-700 uppercase">Pool Peak Utilization</div>
                  <div className="text-2xl font-black text-amber-900 mt-1">
                    <span data-testid="out-utilization">{fmt(evalResult.poolUtilizationPct)}</span>%
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Effective seat hours per engineer per shift = ActiveHours + min(IdleHold, Timeout) / 60. Average concurrent demand = Engineers * EffectiveHours / ShiftHours; Peak demand multiplies average demand by the user-editable Peak Factor.
                </span>
              </div>
              <a
                href="https://en.wikipedia.org/wiki/DWG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                DWG Header Version Signatures (AC1015–AC1032) <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
