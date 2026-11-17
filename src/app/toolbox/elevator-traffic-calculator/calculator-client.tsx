'use client';

import React, { useMemo, useState } from 'react';
import { Download, Copy, Check, RotateCcw, Settings, Zap, Info, AlertTriangle } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

interface ElevatorPreset {
  id: string;
  label: string;
  pop: string;
  floors: string;
  floorHeight: string;
  cars: string;
  carCap: string;
  loadPct: string;
  speed: string;
  stopLossSec: string;
  transferSec: string;
}

const PRESETS: ElevatorPreset[] = [
  {
    id: 'default',
    label: 'Default Office (800 pers · 16 floors · 4 cars @ 2.5 m/s)',
    pop: '800',
    floors: '16',
    floorHeight: '3.8',
    cars: '4',
    carCap: '16',
    loadPct: '80',
    speed: '2.5',
    stopLossSec: '8.0',
    transferSec: '1.2',
  },
  {
    id: 'highrise',
    label: 'High-Rise (1200 pers · 20 floors · 6 cars @ 4.0 m/s)',
    pop: '1200',
    floors: '20',
    floorHeight: '3.6',
    cars: '6',
    carCap: '20',
    loadPct: '80',
    speed: '4.0',
    stopLossSec: '8.0',
    transferSec: '1.2',
  },
];

function parsePositive(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0 || n > max) return null;
  return n;
}

function parseIntRange(raw: string, min: number, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

export default function ElevatorTrafficCalculatorClient() {
  const [pop, setPop] = useState('800');
  const [floors, setFloors] = useState('16');
  const [floorHeight, setFloorHeight] = useState('3.8');
  const [cars, setCars] = useState('4');
  const [carCap, setCarCap] = useState('16');
  const [loadPct, setLoadPct] = useState('80');
  const [speed, setSpeed] = useState('2.5');
  const [stopLossSec, setStopLossSec] = useState('8.0');
  const [transferSec, setTransferSec] = useState('1.2');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: ElevatorPreset) => {
    setPop(p.pop);
    setFloors(p.floors);
    setFloorHeight(p.floorHeight);
    setCars(p.cars);
    setCarCap(p.carCap);
    setLoadPct(p.loadPct);
    setSpeed(p.speed);
    setStopLossSec(p.stopLossSec);
    setTransferSec(p.transferSec);
  };

  const resetAll = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const popVal = parsePositive(pop, 100000);
    const N = parseIntRange(floors, 2, 200);
    const df = parsePositive(floorHeight, 20);
    const L = parseIntRange(cars, 1, 40);
    const cap = parsePositive(carCap, 100);
    const load = parsePositive(loadPct, 100);
    const v = parsePositive(speed, 30);
    const ts = parsePositive(stopLossSec, 60);
    const tp = parsePositive(transferSec, 20);

    if (
      popVal === null ||
      N === null ||
      df === null ||
      L === null ||
      cap === null ||
      load === null ||
      v === null ||
      ts === null ||
      tp === null
    ) {
      return null;
    }

    // Standard Up-Peak probabilistic Barney formulation
    const P = cap * (load / 100);
    const S = N * (1 - Math.pow((N - 1) / N, P));
    let H = N;
    for (let j = 1; j < N; j++) {
      H -= Math.pow(j / N, P);
    }

    const transitSec = (2 * H * df) / v;
    const stopTotalSec = (S + 1) * ts;
    const passengerTotalSec = 2 * P * tp;
    const rttSec = transitSec + stopTotalSec + passengerTotalSec;
    const intervalSec = rttSec / L;
    const hc5Persons = (300 * P * L) / rttSec;
    const hc5Pct = (hc5Persons / popVal) * 100;

    return {
      P,
      S,
      H,
      rttSec,
      intervalSec,
      hc5Persons,
      hc5Pct,
    };
  }, [pop, floors, floorHeight, cars, carCap, loadPct, speed, stopLossSec, transferSec]);

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      'Up-Peak Elevator Traffic Analysis Report (Barney Probabilistic RTT)',
      `Population: ${pop} | Floors Above Lobby (N): ${floors} @ ${floorHeight} m | Cars: ${cars}`,
      `Car Cap: ${carCap} @ ${loadPct}% (P=${result.P.toFixed(2)} pax) | Speed: ${speed} m/s`,
      `Probable Stops (S): ${result.S.toFixed(3)} | Highest Reversal Floor (H): ${result.H.toFixed(3)}`,
      `Round Trip Time (RTT): ${result.rttSec.toFixed(2)} s | Waiting Interval: ${result.intervalSec.toFixed(2)} s`,
      `5-Min Handling Capacity (HC5): ${result.hc5Persons.toFixed(2)} pax/5min (${result.hc5Pct.toFixed(2)}% of pop)`,
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
      ['Parameter', 'Value', 'Unit', 'Formula / Notes'],
      ['Building Population', pop, 'persons', 'Total served upper-floor population'],
      ['Served Floors Above Lobby (N)', floors, 'floors', 'Integer >= 2'],
      ['Floor-to-Floor Height (df)', floorHeight, 'm', 'Average story height'],
      ['Number of Elevator Cars (L)', cars, 'cars', 'Cars in bank'],
      ['Rated Car Capacity', carCap, 'persons', 'Max capacity'],
      ['Average Car Load Factor', loadPct, '%', 'Typical up-peak 80%'],
      ['Rated Speed (v)', speed, 'm/s', 'Contract speed'],
      ['Time Consumed per Stop (ts)', stopLossSec, 's', 'Door + accel/decel loss'],
      ['Passenger Transfer Time (tp)', transferSec, 's/person', 'Single-way transfer'],
      ['Passengers per Trip (P)', result.P.toFixed(2), 'persons', 'Cap * loadPct / 100'],
      ['Probable Stops (S)', result.S.toFixed(3), 'stops', 'N * (1 - ((N-1)/N)^P)'],
      ['Highest Reversal Floor (H)', result.H.toFixed(3), 'floors', 'N - sum((j/N)^P, j=1..N-1)'],
      ['Round Trip Time (RTT)', result.rttSec.toFixed(2), 's', '2*H*df/v + (S+1)*ts + 2*P*tp'],
      ['Up-Peak Interval (I)', result.intervalSec.toFixed(2), 's', 'RTT / L'],
      ['5-Min Handling Capacity (HC5)', result.hc5Persons.toFixed(2), 'persons/5min', '300 * P * L / RTT'],
      ['Handling Capacity (%POP)', result.hc5Pct.toFixed(2), '%', '100 * HC5 / Population'],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      .replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elevator-traffic-${floors}fl-${cars}cars.csv`;
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
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Bank &amp; Building Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Population (persons)
              </label>
              <input
                type="text"
                data-testid="input-pop"
                value={pop}
                onChange={(e) => setPop(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Floors Above Lobby (N)
              </label>
              <input
                type="text"
                data-testid="input-floors"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Floor Height df (m)
              </label>
              <input
                type="text"
                data-testid="input-floor-height"
                value={floorHeight}
                onChange={(e) => setFloorHeight(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Number of Cars (L)
              </label>
              <input
                type="text"
                data-testid="input-cars"
                value={cars}
                onChange={(e) => setCars(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Car Capacity (pax)
              </label>
              <input
                type="text"
                data-testid="input-cap"
                value={carCap}
                onChange={(e) => setCarCap(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Load Factor (%)
              </label>
              <input
                type="text"
                data-testid="input-load-pct"
                value={loadPct}
                onChange={(e) => setLoadPct(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Rated Speed v (m/s)
              </label>
              <input
                type="text"
                data-testid="input-speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Stop Loss Time ts (s)
              </label>
              <input
                type="text"
                data-testid="input-stop-loss"
                value={stopLossSec}
                onChange={(e) => setStopLossSec(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Single-Way Passenger Transfer Time tp (s/pax)
            </label>
            <input
              type="text"
              data-testid="input-transfer"
              value={transferSec}
              onChange={(e) => setTransferSec(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
          </div>

          {!result && (
            <div data-testid="validation-error" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Enter valid positive inputs (integer floors &ge; 2, integer cars &ge; 1, load 1–100%).
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Up-Peak Traffic Results</h2>
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
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">5-Min Capacity (%POP)</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-hc5-pct">{result ? result.hc5Pct.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-blue-500 ml-1">%</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Up-Peak Interval</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-interval">{result ? result.intervalSec.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-emerald-600 ml-1">s</span>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                <div className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">Round Trip Time (RTT)</div>
                <div className="text-2xl font-black text-indigo-900">
                  <span data-testid="result-rtt">{result ? result.rttSec.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-indigo-600 ml-1">s</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Probable Stops (S)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-stops">{result ? result.S.toFixed(3) : '—'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Highest Floor (H)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-reversal">{result ? result.H.toFixed(3) : '—'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">5-Min Throughput</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-hc5-pax">{result ? result.hc5Persons.toFixed(2) : '—'}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">pax/5m</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info className="w-4 h-4 text-purple-600 shrink-0" />
                Barney Up-Peak Round-Trip Time Methodology
              </div>
              <p>
                P = C * load%; S = N * (1 - ((N - 1) / N)^P); H = N - sum((j / N)^P, j=1..N-1); RTT = (2 * H * df / v) + (S + 1) * ts + 2 * P * tp; Interval = RTT / L; HC5 = 300 * P * L / RTT.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
