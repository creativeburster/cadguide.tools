'use client';

import React, { useMemo, useState } from 'react';
import { Download, Copy, Check, RotateCcw, Settings, Zap, Info, AlertTriangle } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

interface EdmPreset {
  id: string;
  label: string;
  gapVoltage: string;
  peakCurrent: string;
  tonUs: string;
  toffUs: string;
  cavityVol: string;
  etaMrr: string;
  ewrPct: string;
}

const PRESETS: EdmPreset[] = [
  {
    id: 'default',
    label: 'Default Roughing (Ip=20 A · Ton=100 us)',
    gapVoltage: '25',
    peakCurrent: '20',
    tonUs: '100',
    toffUs: '50',
    cavityVol: '1500',
    etaMrr: '6.5',
    ewrPct: '1.5',
  },
  {
    id: 'finishing',
    label: 'Semi-Finish (Ip=10 A · Ton=50 us)',
    gapVoltage: '30',
    peakCurrent: '10',
    tonUs: '50',
    toffUs: '150',
    cavityVol: '600',
    etaMrr: '4.0',
    ewrPct: '2.0',
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

export default function EdmMaterialRemovalCalculatorClient() {
  const [gapVoltage, setGapVoltage] = useState('25');
  const [peakCurrent, setPeakCurrent] = useState('20');
  const [tonUs, setTonUs] = useState('100');
  const [toffUs, setToffUs] = useState('50');
  const [cavityVol, setCavityVol] = useState('1500');
  const [etaMrr, setEtaMrr] = useState('6.5');
  const [ewrPct, setEwrPct] = useState('1.5');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: EdmPreset) => {
    setGapVoltage(p.gapVoltage);
    setPeakCurrent(p.peakCurrent);
    setTonUs(p.tonUs);
    setToffUs(p.toffUs);
    setCavityVol(p.cavityVol);
    setEtaMrr(p.etaMrr);
    setEwrPct(p.ewrPct);
  };

  const resetAll = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const Vd = parsePositive(gapVoltage, 500);
    const Ip = parsePositive(peakCurrent, 1000);
    const ton = parsePositive(tonUs, 100000);
    const toff = parsePositive(toffUs, 100000);
    const Vcav = parsePositive(cavityVol, 1e9);
    const eta = parsePositive(etaMrr, 50);
    const ewr = parseNonNeg(ewrPct, 100);

    if (Vd === null || Ip === null || ton === null || toff === null || Vcav === null || eta === null || ewr === null) {
      return null;
    }

    const periodUs = ton + toff;
    const freqKhz = 1000 / periodUs;
    const dutyFactor = ton / periodUs;
    const dutyPct = dutyFactor * 100;
    const pulseEnergyJ = Vd * Ip * ton * 1e-6;
    const avgCurrentA = Ip * dutyFactor;
    const avgPowerW = Vd * avgCurrentA;
    const mrrMm3Min = eta * avgCurrentA;
    const machiningTimeMin = Vcav / mrrMm3Min;
    const wearVolMm3 = Vcav * (ewr / 100);

    return {
      periodUs,
      freqKhz,
      dutyPct,
      pulseEnergyJ,
      avgCurrentA,
      avgPowerW,
      mrrMm3Min,
      machiningTimeMin,
      wearVolMm3,
    };
  }, [gapVoltage, peakCurrent, tonUs, toffUs, cavityVol, etaMrr, ewrPct]);

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      'EDM Pulse Energy & Material Removal Report',
      `Vd=${gapVoltage} V | Ip=${peakCurrent} A | Ton=${tonUs} us | Toff=${toffUs} us`,
      `Pulse Frequency: ${result.freqKhz.toFixed(3)} kHz | Duty Cycle: ${result.dutyPct.toFixed(2)}%`,
      `Single Pulse Energy (Ep): ${result.pulseEnergyJ.toFixed(4)} J | Avg Power: ${result.avgPowerW.toFixed(2)} W`,
      `Estimated MRR (eta=${etaMrr} mm3/min/A): ${result.mrrMm3Min.toFixed(3)} mm3/min`,
      `Estimated Sparking Time (${cavityVol} mm3): ${result.machiningTimeMin.toFixed(3)} min | Electrode Wear: ${result.wearVolMm3.toFixed(2)} mm3`,
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
      ['Gap Discharge Voltage (Vd)', gapVoltage, 'V', 'Maintaining gap voltage'],
      ['Peak Current (Ip)', peakCurrent, 'A', 'Peak pulse current'],
      ['Pulse On-Time (Ton)', tonUs, 'us', 'Discharge duration'],
      ['Pulse Off-Time (Toff)', toffUs, 'us', 'Deionization interval'],
      ['Empirical Removal Rate Coeff (eta_mrr)', etaMrr, 'mm3/(min*A)', 'Editable reference estimate'],
      ['Volumetric Electrode Wear Ratio (EWR)', ewrPct, '%', 'Editable reference estimate'],
      ['Pulse Period (Tp)', result.periodUs.toFixed(1), 'us', 'Ton + Toff'],
      ['Pulse Frequency (fp)', result.freqKhz.toFixed(3), 'kHz', '1000 / Tp'],
      ['Duty Cycle (D)', result.dutyPct.toFixed(2), '%', '100 * Ton / (Ton + Toff)'],
      ['Single Pulse Energy (Ep)', result.pulseEnergyJ.toFixed(4), 'J', 'Vd * Ip * Ton * 1e-6'],
      ['Average Discharge Current (Iavg)', result.avgCurrentA.toFixed(3), 'A', 'Ip * D'],
      ['Average Discharge Power (Pavg)', result.avgPowerW.toFixed(2), 'W', 'Vd * Iavg'],
      ['Estimated MRR', result.mrrMm3Min.toFixed(3), 'mm3/min', 'eta_mrr * Iavg'],
      ['Estimated Sparking Time', result.machiningTimeMin.toFixed(3), 'min', 'V_cav / MRR'],
      ['Estimated Electrode Wear Volume', result.wearVolMm3.toFixed(2), 'mm3', 'V_cav * EWR / 100'],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      .replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edm-removal-estimate-${peakCurrent}A.csv`;
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Pulse Parameters</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Gap Voltage Vd (V)
              </label>
              <input
                type="text"
                data-testid="input-vd"
                value={gapVoltage}
                onChange={(e) => setGapVoltage(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Peak Current Ip (A)
              </label>
              <input
                type="text"
                data-testid="input-ip"
                value={peakCurrent}
                onChange={(e) => setPeakCurrent(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Pulse On Ton (us)
              </label>
              <input
                type="text"
                data-testid="input-ton"
                value={tonUs}
                onChange={(e) => setTonUs(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Pulse Off Toff (us)
              </label>
              <input
                type="text"
                data-testid="input-toff"
                value={toffUs}
                onChange={(e) => setToffUs(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Cavity Volume (mm³)
              </label>
              <input
                type="text"
                data-testid="input-volume"
                value={cavityVol}
                onChange={(e) => setCavityVol(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Coeff eta (mm³/min/A)
              </label>
              <input
                type="text"
                data-testid="input-eta"
                value={etaMrr}
                onChange={(e) => setEtaMrr(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Electrode Wear Ratio EWR (%)
            </label>
            <input
              type="text"
              data-testid="input-ewr"
              value={ewrPct}
              onChange={(e) => setEwrPct(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
            <p className="text-xs text-slate-500 mt-1">
              Removal coefficient eta_mrr and EWR depend strongly on electrode/workpiece pair, polarity, and dielectric flushing; consult machine technology tables.
            </p>
          </div>

          {!result && (
            <div data-testid="validation-error" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Enter valid positive voltage, current, on/off pulse durations, volume, and removal coefficient.
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Pulse &amp; Removal Output</h2>
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
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Estimated MRR</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-mrr">{result ? result.mrrMm3Min.toFixed(3) : '—'}</span>
                  <span className="text-xs font-bold text-blue-500 ml-1">mm³/min</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Duty Cycle</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-duty">{result ? result.dutyPct.toFixed(2) : '—'}</span>
                  <span className="text-xs font-bold text-emerald-600 ml-1">%</span>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                <div className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">Pulse Frequency</div>
                <div className="text-2xl font-black text-indigo-900">
                  <span data-testid="result-freq">{result ? result.freqKhz.toFixed(3) : '—'}</span>
                  <span className="text-xs font-bold text-indigo-600 ml-1">kHz</span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <div className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1">Pulse Energy (Ep)</div>
                <div className="text-2xl font-black text-amber-900">
                  <span data-testid="result-ep">{result ? result.pulseEnergyJ.toFixed(4) : '—'}</span>
                  <span className="text-xs font-bold text-amber-700 ml-1">J</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-700 uppercase tracking-wider mb-1">Avg Power</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-power">{result ? result.avgPowerW.toFixed(2) : '—'}</span>
                  <span className="text-xs font-bold text-orange-700 ml-1">W</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Sparking Time</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-time">{result ? result.machiningTimeMin.toFixed(3) : '—'}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">min</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info className="w-4 h-4 text-purple-600 shrink-0" />
                Pulse Train &amp; Average Discharge Power Relations
              </div>
              <p>
                Tp = Ton + Toff (us); fp = 1000 / Tp (kHz); D = Ton / Tp; Ep = Vd * Ip * Ton * 1e-6 (J); I_avg = Ip * D; P_avg = Vd * I_avg (W); MRR = eta_mrr * I_avg; t_edm = V_cav / MRR.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
