'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

const PRESETS = [
  { label: 'Office Reference', areaPerPerson: '12', femaleRatioF: '30', maleRatioM: '50', lavRatio: '40', dfRatio: '100' },
  { label: 'Assembly Reference', areaPerPerson: '1.5', femaleRatioF: '40', maleRatioM: '75', lavRatio: '100', dfRatio: '500' },
  { label: 'Retail Reference', areaPerPerson: '5', femaleRatioF: '250', maleRatioM: '500', lavRatio: '375', dfRatio: '1000' },
];

interface FixtureResult {
  valid: boolean;
  error?: string;
  occupants: number;
  femaleOcc: number;
  maleOcc: number;
  wcFemale: number;
  wcMale: number;
  totalWc: number;
  lavatories: number;
  drinkingStations: number;
}

function solvePlumbingFixtures(
  areaStr: string,
  densityStr: string,
  femalePctStr: string,
  wcRatioFStr: string,
  wcRatioMStr: string,
  lavRatioStr: string,
  dfRatioStr: string
): FixtureResult {
  if ([areaStr, densityStr, femalePctStr, wcRatioFStr, wcRatioMStr, lavRatioStr, dfRatioStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All floor area, occupant density, and fixture ratio parameters are required.', occupants: 0, femaleOcc: 0, maleOcc: 0, wcFemale: 0, wcMale: 0, totalWc: 0, lavatories: 0, drinkingStations: 0 };
  }
  const area = Number(areaStr);
  const density = Number(densityStr);
  const femPct = Number(femalePctStr);
  const rWcF = Number(wcRatioFStr);
  const rWcM = Number(wcRatioMStr);
  const rLav = Number(lavRatioStr);
  const rDf = Number(dfRatioStr);

  if (![area, density, femPct, rWcF, rWcM, rLav, rDf].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', occupants: 0, femaleOcc: 0, maleOcc: 0, wcFemale: 0, wcMale: 0, totalWc: 0, lavatories: 0, drinkingStations: 0 };
  }
  if (area <= 0 || density <= 0 || rWcF <= 0 || rWcM <= 0 || rLav <= 0 || rDf <= 0) {
    return { valid: false, error: 'Area, occupant area factor, and service ratios must be strictly positive.', occupants: 0, femaleOcc: 0, maleOcc: 0, wcFemale: 0, wcMale: 0, totalWc: 0, lavatories: 0, drinkingStations: 0 };
  }
  if (femPct < 0 || femPct > 100) {
    return { valid: false, error: 'Female occupant share must be between 0% and 100%.', occupants: 0, femaleOcc: 0, maleOcc: 0, wcFemale: 0, wcMale: 0, totalWc: 0, lavatories: 0, drinkingStations: 0 };
  }

  const occupants = Math.ceil(area / density);
  const femaleOcc = Math.ceil(occupants * (femPct / 100));
  const maleOcc = occupants - femaleOcc;
  const wcFemale = Math.ceil(femaleOcc / rWcF);
  const wcMale = Math.ceil(maleOcc / rWcM);
  const totalWc = wcFemale + wcMale;
  const lavatories = Math.ceil(femaleOcc / rLav) + Math.ceil(maleOcc / rLav);
  const drinkingStations = Math.max(1, Math.ceil(occupants / rDf));

  return { valid: true, occupants, femaleOcc, maleOcc, wcFemale, wcMale, totalWc, lavatories, drinkingStations };
}

export default function CalculatorClient() {
  const [areaStr, setAreaStr] = useState('3200');
  const [densityStr, setDensityStr] = useState('12');
  const [femalePctStr, setFemalePctStr] = useState('50');
  const [wcRatioFStr, setWcRatioFStr] = useState('30');
  const [wcRatioMStr, setWcRatioMStr] = useState('50');
  const [lavRatioStr, setLavRatioStr] = useState('40');
  const [dfRatioStr, setDfRatioStr] = useState('100');

  const res = solvePlumbingFixtures(areaStr, densityStr, femalePctStr, wcRatioFStr, wcRatioMStr, lavRatioStr, dfRatioStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Plumbing Fixture Allocation Schedule', ''],
      ['Occupiable Floor Area (m2)', areaStr],
      ['Occupant Area Factor (m2/person)', densityStr],
      ['Female Occupant Split (%)', femalePctStr],
      ['Female WC Ratio (persons/fixture)', wcRatioFStr],
      ['Male WC Ratio (persons/fixture)', wcRatioMStr],
      ['Lavatory Ratio (persons/fixture)', lavRatioStr],
      ['Drinking Station Ratio (persons/fixture)', dfRatioStr],
      ['Calculated Occupant Load', String(res.occupants)],
      ['Female Occupants', String(res.femaleOcc)],
      ['Male Occupants', String(res.maleOcc)],
      ['Female Water Closets', String(res.wcFemale)],
      ['Male Water Closets', String(res.wcMale)],
      ['Total Water Closets', String(res.totalWc)],
      ['Total Lavatories', String(res.lavatories)],
      ['Drinking Water Stations', String(res.drinkingStations)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plumbing-fixture-schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs & Ratios</h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setDensityStr(p.areaPerPerson);
                  setWcRatioFStr(p.femaleRatioF);
                  setWcRatioMStr(p.maleRatioM);
                  setLavRatioStr(p.lavRatio);
                  setDfRatioStr(p.dfRatio);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-700 border border-slate-200"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Floor Area (m^2)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-area"
              value={areaStr}
              onChange={(e) => setAreaStr(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">m^2 / Person</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-density"
                value={densityStr}
                onChange={(e) => setDensityStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Female Split (%)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-female-pct"
                value={femalePctStr}
                onChange={(e) => setFemalePctStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Female WC (1 per N)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-wcf-ratio"
                value={wcRatioFStr}
                onChange={(e) => setWcRatioFStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Male WC (1 per N)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-wcm-ratio"
                value={wcRatioMStr}
                onChange={(e) => setWcRatioMStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Lavatory (1 per N)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-lav-ratio"
                value={lavRatioStr}
                onChange={(e) => setLavRatioStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Fountain (1 per N)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-df-ratio"
                value={dfRatioStr}
                onChange={(e) => setDfRatioStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setAreaStr('3200');
              setDensityStr('12');
              setFemalePctStr('50');
              setWcRatioFStr('30');
              setWcRatioMStr('50');
              setLavRatioStr('40');
              setDfRatioStr('100');
            }}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Reset Defaults
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Fixture Schedule</h2>
              </div>
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-100 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div
                data-testid="validation-error"
                className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700"
              >
                {res.error}
              </div>
            ) : (
              <>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Total Required Water Closets</div>
                  <div className="text-4xl font-black text-blue-900" data-testid="res-total-wc">
                    {res.totalWc} <span className="text-lg font-bold text-blue-600">W.C.</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Occupant Load</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-occupants">{res.occupants}</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Female W.C.</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-wc-female">{res.wcFemale}</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Male W.C.</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-wc-male">{res.wcMale}</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Lavatories / Fountains</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-lav-df">
                      {res.lavatories} / {res.drinkingStations}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2.5 text-sm text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Fixture quantities round up via ceil(Occupants_gender / Ratio). Ratios are editable planning inputs; confirm local building or plumbing code tables before permit submission.
              </span>
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
