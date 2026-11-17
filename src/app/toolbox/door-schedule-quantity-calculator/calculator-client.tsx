'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { DoorOpen, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const MM_PER_IN = 25.4;

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseIntPositive(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return Number.NaN;
  const n = Number(t);
  return Number.isInteger(n) && n > 0 ? n : Number.NaN;
}

function parsePercent(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : Number.NaN;
}

export default function DoorScheduleQuantityClient() {
  const [roomsStr, setRoomsStr] = useState('40');
  const [ratioStr, setRatioStr] = useState('1.25');
  const [storeysStr, setStoreysStr] = useState('4');
  const [heightStr, setHeightStr] = useState('84');
  const [heightUnit, setHeightUnit] = useState<'in' | 'mm'>('in');
  const [firePctStr, setFirePctStr] = useState('25');
  const [doublePctStr, setDoublePctStr] = useState('0');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setRoomsStr('40');
    setRatioStr('1.25');
    setStoreysStr('4');
    setHeightStr('84');
    setHeightUnit('in');
    setFirePctStr('25');
    setDoublePctStr('0');
    setCopied(false);
  };

  const result = useMemo(() => {
    const rooms = parseIntPositive(roomsStr);
    const ratio = parsePositive(ratioStr);
    const storeys = parseIntPositive(storeysStr);
    const rawH = parsePositive(heightStr);
    const firePct = parsePercent(firePctStr);
    const doublePct = parsePercent(doublePctStr);

    if (
      !Number.isInteger(rooms) ||
      !Number.isFinite(ratio) ||
      !Number.isInteger(storeys) ||
      !Number.isFinite(rawH) ||
      !Number.isFinite(firePct) ||
      !Number.isFinite(doublePct)
    ) {
      return { valid: false as const };
    }

    const heightIn = heightUnit === 'in' ? rawH : rawH / MM_PER_IN;
    const heightMm = heightIn * MM_PER_IN;

    // NFPA 80 Section 6.4.3.1.1:
    // Up to 60 in. height -> 2 hinges; +1 additional hinge per additional 30 in. or fraction thereof
    const hingesPerLeaf = heightIn <= 60 ? 2 : 2 + Math.ceil((heightIn - 60) / 30);

    const openingsPerStorey = Math.ceil(rooms * ratio);
    const totalOpenings = openingsPerStorey * storeys;
    const doubleOpenings = Math.round((totalOpenings * doublePct) / 100);
    const singleOpenings = totalOpenings - doubleOpenings;
    const totalLeaves = singleOpenings + doubleOpenings * 2;

    const fireOpenings = Math.ceil((totalOpenings * firePct) / 100);
    const fireLeaves = Math.ceil((totalLeaves * firePct) / 100);

    const totalHinges = totalLeaves * hingesPerLeaf;
    const locksets = totalOpenings;
    const doorClosers = fireLeaves; // Closer required per self-closing fire-rated door leaf
    const doorStops = totalLeaves;

    return {
      valid: true as const,
      rooms,
      ratio,
      storeys,
      heightIn,
      heightMm,
      hingesPerLeaf,
      totalOpenings,
      totalLeaves,
      doubleOpenings,
      fireOpenings,
      fireLeaves,
      totalHinges,
      locksets,
      doorClosers,
      doorStops,
    };
  }, [roomsStr, ratioStr, storeysStr, heightStr, heightUnit, firePctStr, doublePctStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `Door Schedule: ${result.totalOpenings} openings (${result.totalLeaves} leaves), Leaf Height=${result.heightIn.toFixed(1)} in -> ${result.hingesPerLeaf} hinges/leaf (NFPA 80 Sec 6.4.3.1.1) -> ${result.totalHinges} Hinges, ${result.locksets} Locksets, ${result.doorClosers} Fire Closers (${result.fireLeaves} fire leaves), ${result.doorStops} Stops`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result.valid) return;
    const rows = [
      ['item', 'quantity', 'unit'],
      ['total_door_openings', String(result.totalOpenings), 'openings'],
      ['total_door_leaves', String(result.totalLeaves), 'leaves'],
      ['fire_rated_leaves', String(result.fireLeaves), 'leaves'],
      ['leaf_height', result.heightIn.toFixed(2), 'in'],
      ['hinges_per_leaf_nfpa80', String(result.hingesPerLeaf), 'hinges/leaf'],
      ['total_hinges', String(result.totalHinges), 'pcs'],
      ['locksets', String(result.locksets), 'sets'],
      ['fire_door_closers', String(result.doorClosers), 'pcs'],
      ['door_stops', String(result.doorStops), 'pcs'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'door_hardware_schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <DoorOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Architectural Door &amp; Hardware Takeoff</h2>
            <p className="text-sm font-medium text-slate-500">
              Height-based hinge rule per NFPA 80 Section 6.4.3.1.1 with opening/leaf hardware schedule
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="reset-button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="door-rooms" className="block text-xs font-black text-slate-700 mb-1">Rooms / Floor</label>
              <input
                id="door-rooms"
                data-testid="input-rooms"
                type="text"
                inputMode="numeric"
                value={roomsStr}
                onChange={(e) => setRoomsStr(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="door-ratio" className="block text-xs font-black text-slate-700 mb-1">Doors / Room</label>
              <input
                id="door-ratio"
                data-testid="input-ratio"
                type="text"
                inputMode="decimal"
                value={ratioStr}
                onChange={(e) => setRatioStr(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="door-storeys" className="block text-xs font-black text-slate-700 mb-1">Storeys</label>
              <input
                id="door-storeys"
                data-testid="input-storeys"
                type="text"
                inputMode="numeric"
                value={storeysStr}
                onChange={(e) => setStoreysStr(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="door-height" className="text-xs font-black text-slate-700">
                Door Leaf Height
              </label>
              <div className="flex gap-1">
                {(['in', 'mm'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    data-testid={`height-unit-${u}`}
                    onClick={() => setHeightUnit(u)}
                    className={`px-2 py-0.5 rounded text-xs font-black cursor-pointer ${
                      heightUnit === u ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="door-height"
              data-testid="input-height"
              type="text"
              inputMode="decimal"
              value={heightStr}
              onChange={(e) => setHeightStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
            <div className="flex gap-1.5 mt-1.5">
              {[
                { label: '60 in (5 ft)', val: '60' },
                { label: '84 in (7 ft)', val: '84' },
                { label: '96 in (8 ft)', val: '96' },
                { label: '126 in (10.5 ft)', val: '126' },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => {
                    setHeightUnit('in');
                    setHeightStr(p.val);
                  }}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="door-fire" className="block text-xs font-black text-slate-700 mb-1">Fire-Rated (%)</label>
              <input
                id="door-fire"
                data-testid="input-fire-pct"
                type="text"
                inputMode="decimal"
                value={firePctStr}
                onChange={(e) => setFirePctStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label htmlFor="door-double" className="block text-xs font-black text-slate-700 mb-1">Double-Leaf (%)</label>
              <input
                id="door-double"
                data-testid="input-double-pct"
                type="text"
                inputMode="decimal"
                value={doublePctStr}
                onChange={(e) => setDoublePctStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Schedule'}
            </button>
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-black cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {!result.valid && (
              <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>Rooms and storeys must be positive integers; ratios and height positive; percentages 0–100%.</span>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="text-xs font-black text-orange-800 uppercase tracking-wider mb-1">
                Total Architectural Hinges ({result.valid ? `${result.hingesPerLeaf} hinges / leaf` : '—'})
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-hinges" className="text-4xl font-black text-slate-900">
                  {result.valid ? String(result.totalHinges) : '—'}
                </span>
                <span className="text-lg font-bold text-orange-700">hinges</span>
              </div>
              <div data-testid="result-openings" className="text-sm font-bold text-slate-600 mt-1">
                {result.valid
                  ? `${result.totalOpenings} openings • ${result.totalLeaves} door leaves (${result.heightIn.toFixed(1)} in / ${result.heightMm.toFixed(0)} mm tall)`
                  : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Fire-Rated Leaves</div>
                <div data-testid="result-fire-leaves" className="text-2xl font-black text-slate-900">
                  {result.valid ? String(result.fireLeaves) : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Door Closers (Fire)</div>
                <div data-testid="result-closers" className="text-2xl font-black text-slate-900">
                  {result.valid ? String(result.doorClosers) : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Locksets / Stops</div>
                <div data-testid="result-locksets" className="text-2xl font-black text-slate-900">
                  {result.valid ? `${result.locksets} / ${result.doorStops}` : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>NFPA 80 Section 6.4.3.1.1 Hinge Basis:</strong>{' '}
                Doors up to 60 in. (1.52 m) in height require 2 hinges, plus 1 additional hinge for each additional 30 in. (0.76 m) of height or fraction thereof (independent of fire rating).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
