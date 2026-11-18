'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  Info,
  RotateCcw,
  Settings,
  Zap,
} from 'lucide-react';

interface PsdPreset {
  id: string;
  label: string;
  vpKmh: string;
  vsKmh: string;
  t1S: string;
  accelMs2: string;
  t2S: string;
  d3M: string;
  voKmh: string;
  t4S: string;
}

const PRESETS: PsdPreset[] = [
  {
    id: 'rural-90',
    label: 'Preset 1: 90 km/h Overtaking (Vs=72 km/h, t1=4.0s, a=0.65, t2=10.0s, d3=55m)',
    vpKmh: '90',
    vsKmh: '72',
    t1S: '4.0',
    accelMs2: '0.65',
    t2S: '10.0',
    d3M: '55.0',
    voKmh: '90',
    t4S: '6.6',
  },
  {
    id: 'highway-110',
    label: 'Preset 2: 110 km/h Highway (Vs=90 km/h, t1=4.2s, a=0.60, t2=11.0s, d3=75m)',
    vpKmh: '110',
    vsKmh: '90',
    t1S: '4.2',
    accelMs2: '0.60',
    t2S: '11.0',
    d3M: '75.0',
    voKmh: '110',
    t4S: '7.2',
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

function evaluatePassingSightDistance(
  vpStr: string,
  vsStr: string,
  t1Str: string,
  aStr: string,
  t2Str: string,
  d3Str: string,
  voStr: string,
  t4Str: string
) {
  const Vp = parsePositive(vpStr);
  const Vs = parsePositive(vsStr);
  const t1 = parsePositive(t1Str);
  const a = parseNonNegative(aStr);
  const t2 = parsePositive(t2Str);
  const d3 = parseNonNegative(d3Str);
  const Vo = parsePositive(voStr);
  const t4 = parsePositive(t4Str);

  if (
    !Number.isFinite(Vp) ||
    !Number.isFinite(Vs) ||
    !Number.isFinite(t1) ||
    !Number.isFinite(a) ||
    !Number.isFinite(t2) ||
    !Number.isFinite(d3) ||
    !Number.isFinite(Vo) ||
    !Number.isFinite(t4)
  ) {
    return {
      valid: false as const,
      error: 'All speeds and phase durations must be > 0; acceleration and clearance d3 must be >= 0.',
    };
  }
  if (Vs >= Vp) {
    return {
      valid: false as const,
      error: 'Overtaking vehicle speed V_p must be strictly greater than overtaken vehicle speed V_s.',
    };
  }

  const vsMs = Vs / 3.6;
  const vpMs = Vp / 3.6;
  const voMs = Vo / 3.6;

  const d1 = vsMs * t1 + 0.5 * a * t1 * t1;
  const d2 = vpMs * t2;
  const d4 = voMs * t4;
  const psd = d1 + d2 + d3 + d4;

  return {
    valid: true as const,
    d1,
    d2,
    d3,
    d4,
    psd,
  };
}

export default function PassingSightDistanceCalculatorClient() {
  const [vpStr, setVpStr] = useState('90');
  const [vsStr, setVsStr] = useState('72');
  const [t1Str, setT1Str] = useState('4.0');
  const [aStr, setAStr] = useState('0.65');
  const [t2Str, setT2Str] = useState('10.0');
  const [d3Str, setD3Str] = useState('55.0');
  const [voStr, setVoStr] = useState('90');
  const [t4Str, setT4Str] = useState('6.6');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluatePassingSightDistance(vpStr, vsStr, t1Str, aStr, t2Str, d3Str, voStr, t4Str),
    [vpStr, vsStr, t1Str, aStr, t2Str, d3Str, voStr, t4Str]
  );

  const applyPreset = (p: PsdPreset) => {
    setVpStr(p.vpKmh);
    setVsStr(p.vsKmh);
    setT1Str(p.t1S);
    setAStr(p.accelMs2);
    setT2Str(p.t2S);
    setD3Str(p.d3M);
    setVoStr(p.voKmh);
    setT4Str(p.t4S);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'Four-Phase Passing Sight Distance Summary',
      `d1 (Initial Maneuver): ${evalRes.d1.toFixed(2)} m`,
      `d2 (Opposing Lane Occupation): ${evalRes.d2.toFixed(2)} m`,
      `d3 (Clearance): ${evalRes.d3.toFixed(2)} m | d4 (Opposing Vehicle): ${evalRes.d4.toFixed(2)} m`,
      `Total PSD (d1 + d2 + d3 + d4): ${evalRes.psd.toFixed(2)} m`,
    ].join('\n');
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!evalRes.valid) return;
    const lines = [
      'Component,Distance,Unit',
      `d1 Initial Maneuver,${evalRes.d1.toFixed(4)},m`,
      `d2 Left Lane Occupation,${evalRes.d2.toFixed(4)},m`,
      `d3 Clearance Distance,${evalRes.d3.toFixed(4)},m`,
      `d4 Opposing Vehicle Travel,${evalRes.d4.toFixed(4)},m`,
      `Total Passing Sight Distance,${evalRes.psd.toFixed(4)},m`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passing_sight_distance_kinematics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-orange-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Kinematic Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => applyPreset(PRESETS[0])}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Passing Vp (km/h)</label>
              <input type="text" inputMode="decimal" data-testid="input-vp" value={vpStr} onChange={(e) => setVpStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Slow Vehicle Vs (km/h)</label>
              <input type="text" inputMode="decimal" data-testid="input-vs" value={vsStr} onChange={(e) => setVsStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Phase 1 Time t1 (s)</label>
              <input type="text" inputMode="decimal" data-testid="input-t1" value={t1Str} onChange={(e) => setT1Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Accel a (m/s^2)</label>
              <input type="text" inputMode="decimal" data-testid="input-accel" value={aStr} onChange={(e) => setAStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Phase 2 Time t2 (s)</label>
              <input type="text" inputMode="decimal" data-testid="input-t2" value={t2Str} onChange={(e) => setT2Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Clearance d3 (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-d3" value={d3Str} onChange={(e) => setD3Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Opposing Vo (km/h)</label>
              <input type="text" inputMode="decimal" data-testid="input-vo" value={voStr} onChange={(e) => setVoStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Opposing Time t4 (s)</label>
              <input type="text" inputMode="decimal" data-testid="input-t4" value={t4Str} onChange={(e) => setT4Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Sight Distance</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!evalRes.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  disabled={!evalRes.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download CSV
                </button>
              </div>
            </div>

            {!evalRes.valid ? (
              <div data-testid="validation-error" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{evalRes.error}</span>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Total Passing Sight Distance (PSD)</div>
                  <div className="text-4xl font-black text-blue-900">
                    <span data-testid="out-psd">{evalRes.psd.toFixed(2)}</span> m
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase">d1 Maneuver</div>
                    <div className="text-xl font-black text-slate-900 mt-1"><span data-testid="out-d1">{evalRes.d1.toFixed(2)}</span> m</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase">d2 Occupation</div>
                    <div className="text-xl font-black text-slate-900 mt-1"><span data-testid="out-d2">{evalRes.d2.toFixed(2)}</span> m</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase">d3 Clearance</div>
                    <div className="text-xl font-black text-slate-900 mt-1"><span data-testid="out-d3">{evalRes.d3.toFixed(2)}</span> m</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase">d4 Opposing</div>
                    <div className="text-xl font-black text-slate-900 mt-1"><span data-testid="out-d4">{evalRes.d4.toFixed(2)}</span> m</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 flex items-center gap-2 font-medium">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>PSD = d1 + d2 + d3 + d4 where d1 = (Vs/3.6)*t1 + 0.5*a*t1^2, d2 = (Vp/3.6)*t2, d4 = (Vo/3.6)*t4.</span>
                </div>
              </>
            )}
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
