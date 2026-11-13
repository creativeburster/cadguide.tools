'use client';

import React, { useMemo, useState } from 'react';
import { Download, Info, RotateCcw } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

type CalcMode = 'from-dft' | 'from-volume';

interface CoatingPreset {
  id: string;
  label: string;
  mode: CalcMode;
  dft: string;
  volume: string;
  solids: string;
  area: string;
  coats: string;
  loss: string;
}

const PRESETS: CoatingPreset[] = [
  {
    id: 'default-epoxy',
    label: 'Default (150 µm · 60% VS · 2 Coats)',
    mode: 'from-dft',
    dft: '150',
    volume: '25',
    solids: '60',
    area: '100',
    coats: '2',
    loss: '15',
  },
  {
    id: 'dulux-125',
    label: 'Steel Primer (125 µm · 71% VS · 1 Coat)',
    mode: 'from-dft',
    dft: '125',
    volume: '10',
    solids: '71',
    area: '50',
    coats: '1',
    loss: '10',
  },
  {
    id: 'volume-check',
    label: 'From Volume Check (5 L · 60% VS · 50 m²)',
    mode: 'from-volume',
    dft: '60',
    volume: '5',
    solids: '60',
    area: '50',
    coats: '2',
    loss: '0',
  },
];

function parsePositive(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0 || n > max) return null;
  return n;
}

function parseNonNegative(raw: string, maxExclusive: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0 || n >= maxExclusive) return null;
  return n;
}

function parseIntRange(raw: string, min: number, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

export default function CoatingThicknessCalculatorClient() {
  const [mode, setMode] = useState<CalcMode>('from-dft');
  const [dftStr, setDftStr] = useState('150');
  const [volumeStr, setVolumeStr] = useState('25');
  const [solidsStr, setSolidsStr] = useState('60');
  const [areaStr, setAreaStr] = useState('100');
  const [coatsStr, setCoatsStr] = useState('2');
  const [lossStr, setLossStr] = useState('15');

  const applyPreset = (p: CoatingPreset) => {
    setMode(p.mode);
    setDftStr(p.dft);
    setVolumeStr(p.volume);
    setSolidsStr(p.solids);
    setAreaStr(p.area);
    setCoatsStr(p.coats);
    setLossStr(p.loss);
  };

  const resetAll = () => applyPreset(PRESETS[0]);

  const calc = useMemo(() => {
    const solidsPct = parsePositive(solidsStr, 100);
    const area = parsePositive(areaStr, 1e7);
    const coats = parseIntRange(coatsStr, 1, 20);
    const lossPct = parseNonNegative(lossStr, 95);

    if (solidsPct === null || area === null || coats === null || lossPct === null) {
      return {
        valid: false as const,
        error: 'Check Volume Solids (0–100%], Area (> 0 m²), Coats (integer 1–20), and Loss Factor [0–95%).',
      };
    }

    const effRatio = 1 - lossPct / 100;

    if (mode === 'from-dft') {
      const totalDft = parsePositive(dftStr, 10000);
      if (totalDft === null) {
        return { valid: false as const, error: 'Check Target Total DFT (0–10,000 µm).' };
      }
      const dftPerCoat = totalDft / coats;
      const wftPerCoat = (dftPerCoat * 100) / solidsPct;
      const totalWft = (totalDft * 100) / solidsPct;
      const tsr = (solidsPct * 10) / totalDft;
      const psr = tsr * effRatio;
      const theoVolume = (area * totalDft) / (solidsPct * 10);
      const pracVolume = theoVolume / effRatio;

      return {
        valid: true as const,
        solidsPct,
        area,
        coats,
        lossPct,
        totalDft,
        dftPerCoat,
        wftPerCoat,
        totalWft,
        tsr,
        psr,
        theoVolume,
        pracVolume,
      };
    } else {
      const volume = parsePositive(volumeStr, 1e6);
      if (volume === null) {
        return { valid: false as const, error: 'Check Paint Volume (0–1,000,000 L).' };
      }
      const effVolume = volume * effRatio;
      // Mass conservation: total DFT depends on effective deposited solid volume / area, NOT multiplied by coats
      const totalDft = (effVolume * solidsPct * 10) / area;
      const dftPerCoat = totalDft / coats;
      const wftPerCoat = (dftPerCoat * 100) / solidsPct;
      const totalWft = (totalDft * 100) / solidsPct;
      const tsr = (solidsPct * 10) / totalDft;
      const psr = tsr * effRatio;

      return {
        valid: true as const,
        solidsPct,
        area,
        coats,
        lossPct,
        totalDft,
        dftPerCoat,
        wftPerCoat,
        totalWft,
        tsr,
        psr,
        theoVolume: volume * effRatio,
        pracVolume: volume,
      };
    }
  }, [mode, dftStr, volumeStr, solidsStr, areaStr, coatsStr, lossStr]);

  const exportCsv = () => {
    if (!calc.valid) return;
    const rows = [
      'parameter,value,unit,formula_or_notes',
      `mode,${mode},-,from-dft or from-volume`,
      `volume_solids,${calc.solidsPct},%,Editable from product Technical Data Sheet`,
      `surface_area,${calc.area},m2,Coated surface area`,
      `number_of_coats,${calc.coats},coats,Mass-conserving split (per coat = total / coats)`,
      `loss_factor,${calc.lossPct},%,Editable typical allowance (10-15% airless/roller; 40-50% conventional spray per Dulux Tech Note)`,
      `total_dft,${calc.totalDft.toFixed(1)},um,Total dry film thickness`,
      `dft_per_coat,${calc.dftPerCoat.toFixed(1)},um,total_dft / coats`,
      `wft_per_coat,${calc.wftPerCoat.toFixed(1)},um,(dft_per_coat * 100) / volume_solids`,
      `total_wft,${calc.totalWft.toFixed(1)},um,(total_dft * 100) / volume_solids`,
      `theoretical_spreading_rate,${calc.tsr.toFixed(2)},m2/L,(volume_solids * 10) / total_dft`,
      `practical_spreading_rate,${calc.psr.toFixed(2)},m2/L,TSR * (1 - loss_factor / 100)`,
      `theoretical_volume,${calc.theoVolume.toFixed(2)},L,(area * total_dft) / (volume_solids * 10)`,
      `practical_volume,${calc.pracVolume.toFixed(2)},L,theoretical_volume / (1 - loss_factor / 100)`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coating-thickness-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3.5 py-2 rounded-xl text-sm font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-red-50 hover:border-red-300 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            data-testid="reset-button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 max-w-xl">
          <button
            type="button"
            data-testid="mode-from-dft"
            onClick={() => setMode('from-dft')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition ${
              mode === 'from-dft' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Target DFT → WFT &amp; Paint Volume
          </button>
          <button
            type="button"
            data-testid="mode-from-volume"
            onClick={() => setMode('from-volume')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition ${
              mode === 'from-volume' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paint Volume → Resulting DFT &amp; WFT
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mode === 'from-dft' ? (
            <div>
              <label htmlFor="coat-dft" className="block text-sm font-bold text-slate-700 mb-1.5">
                Target Total DFT (µm)
              </label>
              <input
                id="coat-dft"
                data-testid="input-dft"
                type="text"
                inputMode="decimal"
                value={dftStr}
                onChange={(e) => setDftStr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="coat-volume" className="block text-sm font-bold text-slate-700 mb-1.5">
                Total Mixed Paint Volume (L)
              </label>
              <input
                id="coat-volume"
                data-testid="input-volume"
                type="text"
                inputMode="decimal"
                value={volumeStr}
                onChange={(e) => setVolumeStr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="coat-solids" className="block text-sm font-bold text-slate-700 mb-1.5">
              Volume Solids VS (%)
            </label>
            <input
              id="coat-solids"
              data-testid="input-solids"
              type="text"
              inputMode="decimal"
              value={solidsStr}
              onChange={(e) => setSolidsStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="coat-area" className="block text-sm font-bold text-slate-700 mb-1.5">
              Coated Area (m²)
            </label>
            <input
              id="coat-area"
              data-testid="input-area"
              type="text"
              inputMode="decimal"
              value={areaStr}
              onChange={(e) => setAreaStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="coat-coats" className="block text-sm font-bold text-slate-700 mb-1.5">
              Number of Coats (1–20)
            </label>
            <input
              id="coat-coats"
              data-testid="input-coats"
              type="text"
              inputMode="numeric"
              value={coatsStr}
              onChange={(e) => setCoatsStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="coat-loss" className="block text-sm font-bold text-slate-700 mb-1.5">
              Application Loss Factor (% — Editable Typical)
            </label>
            <input
              id="coat-loss"
              data-testid="input-loss"
              type="text"
              inputMode="decimal"
              value={lossStr}
              onChange={(e) => setLossStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {!calc.valid && (
          <div data-testid="validation-error" className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            {calc.error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-900 text-white rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-red-300">
              WFT per Coat
            </div>
            <div data-testid="result-wft-coat" className="text-2xl font-black font-mono mt-1">
              {calc.valid ? `${calc.wftPerCoat.toFixed(1)} µm` : '—'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              DFT/coat: {calc.valid ? `${calc.dftPerCoat.toFixed(1)} µm` : '—'}
            </div>
          </div>

          <div className="bg-red-600 text-white rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-red-100">
              Total Dry Film (DFT)
            </div>
            <div data-testid="result-total-dft" className="text-2xl font-black font-mono mt-1">
              {calc.valid ? `${calc.totalDft.toFixed(1)} µm` : '—'}
            </div>
            <div className="text-xs text-red-100 mt-1">
              Sum WFT: {calc.valid ? `${calc.totalWft.toFixed(1)} µm` : '—'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Theoretical / Practical Rate
            </div>
            <div data-testid="result-tsr" className="text-2xl font-black font-mono text-slate-900 mt-1">
              {calc.valid ? `${calc.tsr.toFixed(2)} m²/L` : '—'}
            </div>
            <div data-testid="result-psr" className="text-xs text-slate-500 mt-1">
              Practical PSR: {calc.valid ? `${calc.psr.toFixed(2)} m²/L` : '—'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Estimated Paint Required
            </div>
            <div data-testid="result-prac-volume" className="text-2xl font-black font-mono text-red-700 mt-1">
              {calc.valid ? `${calc.pracVolume.toFixed(2)} L` : '—'}
            </div>
            <div data-testid="result-theo-volume" className="text-xs text-slate-500 mt-1">
              Theoretical: {calc.valid ? `${calc.theoVolume.toFixed(2)} L` : '—'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            data-testid="export-csv"
            disabled={!calc.valid}
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-40 transition"
          >
            <Download className="w-4 h-4" />
            Export CSV Report
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-red-600" /> Unit Derivations &amp; Coatings Standards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
          <div className="space-y-3 bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="font-bold text-slate-900">1. Exact Metric Unit Analysis</div>
            <div className="font-mono text-xs bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-slate-800">
              <div>1 L = 1,000,000 mm³ = 1 m² × 1,000 µm</div>
              <div>DFT [µm] = WFT [µm] × (VS% / 100)</div>
              <div>WFT [µm] = (DFT [µm] × 100) / VS%</div>
              <div>TSR [m²/L] = (VS% × 10) / DFT [µm]</div>
              <div>V_theo [L] = (Area [m²] × DFT [µm]) / (VS% × 10)</div>
              <div>PSR [m²/L] = TSR × (1 - Loss% / 100)</div>
            </div>
            <p>
              Example: <code>1 L</code> of <code>100%</code> solids paint spreads over <code>1 m²</code> at <code>1000 µm</code> DFT. With <code>VS = 60%</code> and <code>DFT = 150 µm</code>, <code>TSR = (60 × 10) / 150 = 4.00 m²/L</code>, so <code>100 m²</code> requires <code>25.00 L</code> theoretically.
            </p>
          </div>

          <div className="space-y-2.5 bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="font-bold text-slate-900">2. Standards &amp; Typical Loss Guidance</div>
            <ul className="space-y-1.5 list-disc pl-5">
              <li><strong>ISO 2808</strong>: Paints and varnishes — Determination of film thickness (Elcometer International Standards reference).</li>
              <li><strong>ASTM D4414</strong>: Outlines standard procedures for measuring wet film thickness using notch gauges (DeFelsko technical guide).</li>
              <li><strong>Typical loss factors</strong> (Dulux Protective Coatings Tech Note): <code>10–15%</code> reduction in theoretical spreading rate for brush, roller, or airless spray; <code>40–50%</code> for conventional spray. Adjust editable input for steel blast profile (dead volume) and wind/overspray.</li>
            </ul>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
