'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Layers, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseFinite(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parseNonNegative(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function fmt(val: number, decimals = 2): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function CutFillVolumeCalculatorClient() {
  const [method, setMethod] = useState<'grid' | 'section'>('grid');

  // Grid mode inputs
  const [gridAreaStr, setGridAreaStr] = useState('100');
  const [existElevStr, setExistElevStr] = useState('10.5');
  const [propElevStr, setPropElevStr] = useState('11.2');
  const [gridCountStr, setGridCountStr] = useState('50');

  // Cross-section average end-area inputs
  const [stationLenStr, setStationLenStr] = useState('20');
  const [cutArea1Str, setCutArea1Str] = useState('12');
  const [cutArea2Str, setCutArea2Str] = useState('18');
  const [fillArea1Str, setFillArea1Str] = useState('4');
  const [fillArea2Str, setFillArea2Str] = useState('6');

  // Soil state factors
  const [shrinkagePctStr, setShrinkagePctStr] = useState('10');
  const [swellPctStr, setSwellPctStr] = useState('25');
  const [copied, setCopied] = useState(false);

  const applyPreset = (preset: 'default-fill' | 'cut-excavation' | 'section') => {
    setCopied(false);
    if (preset === 'default-fill') {
      setMethod('grid');
      setGridAreaStr('100');
      setExistElevStr('10.5');
      setPropElevStr('11.2');
      setGridCountStr('50');
      setShrinkagePctStr('10');
      setSwellPctStr('25');
    } else if (preset === 'cut-excavation') {
      setMethod('grid');
      setGridAreaStr('100');
      setExistElevStr('12.0');
      setPropElevStr('10.5');
      setGridCountStr('50');
      setShrinkagePctStr('10');
      setSwellPctStr('25');
    } else {
      setMethod('section');
      setStationLenStr('20');
      setCutArea1Str('12');
      setCutArea2Str('18');
      setFillArea1Str('4');
      setFillArea2Str('6');
      setShrinkagePctStr('10');
      setSwellPctStr('25');
    }
  };

  const handleReset = () => applyPreset('default-fill');

  const result = useMemo(() => {
    const shrinkPct = parseNonNegative(shrinkagePctStr);
    const swellPct = parseNonNegative(swellPctStr);
    if (!Number.isFinite(shrinkPct) || shrinkPct >= 100 || !Number.isFinite(swellPct)) {
      return { valid: false as const };
    }

    let cutBank = 0;
    let fillCompacted = 0;

    if (method === 'grid') {
      const area = parsePositive(gridAreaStr);
      const exist = parseFinite(existElevStr);
      const prop = parseFinite(propElevStr);
      const count = parsePositive(gridCountStr);
      if (!Number.isFinite(area) || !Number.isFinite(exist) || !Number.isFinite(prop) || !Number.isFinite(count)) {
        return { valid: false as const };
      }
      const totalArea = area * count;
      const diff = exist - prop; // positive => existing higher than proposed => CUT
      if (diff >= 0) {
        cutBank = totalArea * diff;
      } else {
        fillCompacted = totalArea * Math.abs(diff);
      }
    } else {
      const L = parsePositive(stationLenStr);
      const ac1 = parseNonNegative(cutArea1Str);
      const ac2 = parseNonNegative(cutArea2Str);
      const af1 = parseNonNegative(fillArea1Str);
      const af2 = parseNonNegative(fillArea2Str);
      if (
        !Number.isFinite(L) ||
        !Number.isFinite(ac1) ||
        !Number.isFinite(ac2) ||
        !Number.isFinite(af1) ||
        !Number.isFinite(af2)
      ) {
        return { valid: false as const };
      }
      cutBank = ((ac1 + ac2) / 2) * L;
      fillCompacted = ((af1 + af2) / 2) * L;
    }

    // Bank cubic meters needed to construct compacted fill embankment: BCM = CCM / (1 - shrinkage)
    const borrowBankRequired = fillCompacted / (1 - shrinkPct / 100);
    // Net bank balance: positive = excess cut to haul away, negative = net borrow needed
    const netBankBalance = cutBank - borrowBankRequired;
    // Loose haulage volume of excavated/borrowed bank soil: LCM = BCM * (1 + swell)
    const cutLoose = cutBank * (1 + swellPct / 100);
    const netHaulLoose = Math.abs(netBankBalance) * (1 + swellPct / 100);

    return {
      valid: true as const,
      cutBank,
      fillCompacted,
      borrowBankRequired,
      netBankBalance,
      cutLoose,
      netHaulLoose,
      shrinkPct,
      swellPct,
    };
  }, [
    method,
    gridAreaStr,
    existElevStr,
    propElevStr,
    gridCountStr,
    stationLenStr,
    cutArea1Str,
    cutArea2Str,
    fillArea1Str,
    fillArea2Str,
    shrinkagePctStr,
    swellPctStr,
  ]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `Earthwork (${method}): Cut=${result.cutBank.toFixed(2)} m3 (BCM, Loose=${result.cutLoose.toFixed(2)} LCM) | Fill=${result.fillCompacted.toFixed(2)} m3 (CCM, Bank Req=${result.borrowBankRequired.toFixed(2)} BCM) | Net Bank Balance=${result.netBankBalance.toFixed(2)} BCM`;
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
      ['parameter', 'value', 'unit'],
      ['method', method, '-'],
      ['cut_bank_volume', result.cutBank.toFixed(2), 'm3_BCM'],
      ['cut_loose_volume', result.cutLoose.toFixed(2), 'm3_LCM'],
      ['fill_compacted_volume', result.fillCompacted.toFixed(2), 'm3_CCM'],
      ['fill_bank_equivalent', result.borrowBankRequired.toFixed(2), 'm3_BCM'],
      ['net_bank_balance', result.netBankBalance.toFixed(2), 'm3_BCM'],
      ['shrinkage_pct', result.shrinkPct.toFixed(1), '%'],
      ['swell_pct', result.swellPct.toFixed(1), '%'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cut_fill_earthwork.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Earthwork Cut, Fill &amp; Haulage Volume</h2>
            <p className="text-sm font-medium text-slate-500">
              Grid cell &amp; average-end-area volumes with editable shrinkage and swell factors
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="preset-cut"
            onClick={() => applyPreset('cut-excavation')}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-black border border-teal-200 cursor-pointer"
          >
            Cut Excavation Example
          </button>
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
      </div>

      <div className="px-6 md:px-8 pt-6 flex gap-2">
        <button
          type="button"
          data-testid="tab-grid"
          onClick={() => setMethod('grid')}
          className={`px-4 py-2 rounded-xl text-sm font-black cursor-pointer ${
            method === 'grid' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Uniform Grid Cells
        </button>
        <button
          type="button"
          data-testid="tab-section"
          onClick={() => setMethod('section')}
          className={`px-4 py-2 rounded-xl text-sm font-black cursor-pointer ${
            method === 'section' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Average End-Area Stations
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          {method === 'grid' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cf-area" className="block text-xs font-black text-slate-700 mb-1">Grid Cell Area (m²)</label>
                  <input
                    id="cf-area"
                    data-testid="input-grid-area"
                    type="text"
                    inputMode="decimal"
                    value={gridAreaStr}
                    onChange={(e) => setGridAreaStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="cf-count" className="block text-xs font-black text-slate-700 mb-1">Grid Cell Count</label>
                  <input
                    id="cf-count"
                    data-testid="input-grid-count"
                    type="text"
                    inputMode="decimal"
                    value={gridCountStr}
                    onChange={(e) => setGridCountStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cf-exist" className="block text-xs font-black text-slate-700 mb-1">Existing Elev (m)</label>
                  <input
                    id="cf-exist"
                    data-testid="input-exist-elev"
                    type="text"
                    inputMode="decimal"
                    value={existElevStr}
                    onChange={(e) => setExistElevStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="cf-prop" className="block text-xs font-black text-slate-700 mb-1">Proposed Elev (m)</label>
                  <input
                    id="cf-prop"
                    data-testid="input-prop-elev"
                    type="text"
                    inputMode="decimal"
                    value={propElevStr}
                    onChange={(e) => setPropElevStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="cf-len" className="block text-xs font-black text-slate-700 mb-1">Station Spacing L (m)</label>
                <input
                  id="cf-len"
                  data-testid="input-station-len"
                  type="text"
                  inputMode="decimal"
                  value={stationLenStr}
                  onChange={(e) => setStationLenStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Cut Area Sta 1 (m²)</label>
                  <input
                    data-testid="input-cut-a1"
                    type="text"
                    inputMode="decimal"
                    value={cutArea1Str}
                    onChange={(e) => setCutArea1Str(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Cut Area Sta 2 (m²)</label>
                  <input
                    data-testid="input-cut-a2"
                    type="text"
                    inputMode="decimal"
                    value={cutArea2Str}
                    onChange={(e) => setCutArea2Str(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Fill Area Sta 1 (m²)</label>
                  <input
                    data-testid="input-fill-a1"
                    type="text"
                    inputMode="decimal"
                    value={fillArea1Str}
                    onChange={(e) => setFillArea1Str(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Fill Area Sta 2 (m²)</label>
                  <input
                    data-testid="input-fill-a2"
                    type="text"
                    inputMode="decimal"
                    value={fillArea2Str}
                    onChange={(e) => setFillArea2Str(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label htmlFor="cf-shrink" className="block text-xs font-black text-slate-700 mb-1">Compaction Shrinkage (%)</label>
              <input
                id="cf-shrink"
                data-testid="input-shrinkage"
                type="text"
                inputMode="decimal"
                value={shrinkagePctStr}
                onChange={(e) => setShrinkagePctStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label htmlFor="cf-swell" className="block text-xs font-black text-slate-700 mb-1">Excavation Swell (%)</label>
              <input
                id="cf-swell"
                data-testid="input-swell"
                type="text"
                inputMode="decimal"
                value={swellPctStr}
                onChange={(e) => setSwellPctStr(e.target.value)}
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
              {copied ? 'Copied' : 'Copy Result'}
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
                <span>Provide valid dimensions, finite elevations/areas, shrinkage (&lt; 100%), and non-negative swell.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="text-xs font-black text-amber-800 uppercase mb-1">Cut Volume (Bank BCM)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-cut" className="text-3xl font-black text-slate-900">
                    {result.valid ? fmt(result.cutBank, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-amber-800">m³</span>
                </div>
                <div data-testid="result-cut-loose" className="text-xs font-bold text-slate-600 mt-1">
                  {result.valid ? `Loose haulage: ${result.cutLoose.toFixed(2)} m³ (LCM)` : '—'}
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
                <div className="text-xs font-black text-teal-800 uppercase mb-1">Fill Volume (Compacted CCM)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-fill" className="text-3xl font-black text-slate-900">
                    {result.valid ? fmt(result.fillCompacted, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-teal-800">m³</span>
                </div>
                <div data-testid="result-fill-bank" className="text-xs font-bold text-slate-600 mt-1">
                  {result.valid ? `Required borrow bank: ${result.borrowBankRequired.toFixed(2)} m³ (BCM)` : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="text-xs font-black text-slate-400 uppercase mb-1">
                Net Earthwork Bank Balance (Cut − Required Borrow)
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-net" className="text-3xl font-black text-slate-900">
                  {result.valid ? fmt(result.netBankBalance, 2) : '—'}
                </span>
                <span className="text-sm font-bold text-slate-500">m³ (BCM)</span>
              </div>
              <div className="text-xs font-bold text-slate-600 mt-1">
                {result.valid
                  ? result.netBankBalance >= 0
                    ? `Net export spoil: ${result.netHaulLoose.toFixed(2)} m³ loose`
                    : `Net import borrow needed (${result.netHaulLoose.toFixed(2)} m³ loose truck volume)`
                  : '—'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Earthwork Three-State Conversion:</strong>{' '}
                Grid cell volume uses <code>V = A_cell × |E_exist − E_prop| × N</code>; section volume uses average end area <code>V = ((A₁ + A₂)/2) × L</code>. Bank excavation needed for compacted fill is <code>BCM = CCM / (1 − s)</code>, and truck haul volume is <code>LCM = BCM × (1 + swell)</code>.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
