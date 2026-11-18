'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download, Info } from 'lucide-react';

const MATERIAL_PRESETS = [
  { name: 'Carbon Steel (CS)', alphaUm: '11.2', eGpa: '200', allowMpa: '150' },
  { name: 'Stainless Steel (304)', alphaUm: '16.6', eGpa: '193', allowMpa: '135' },
  { name: 'Stainless Steel (316)', alphaUm: '16.0', eGpa: '193', allowMpa: '135' },
  { name: 'Copper', alphaUm: '16.4', eGpa: '110', allowMpa: '45' },
  { name: 'Aluminum (6061)', alphaUm: '23.6', eGpa: '69', allowMpa: '95' },
];

interface ThermalExpansionResult {
  valid: boolean;
  error?: string;
  deltaLMm: number;
  deltaLMmPerM: number;
  innerDMm: number;
  wallAreaMm2: number;
  thermalStressMpa: number;
  anchorForceKn: number;
  stressRatioPct: number;
  guidedCantileverLegM: number;
  isSafe: boolean;
}

function solveThermalExpansion(
  alphaUmStr: string,
  eGpaStr: string,
  allowMpaStr: string,
  lengthMStr: string,
  deltaTCStr: string,
  odMmStr: string,
  wallMmStr: string
): ThermalExpansionResult {
  const fields = [alphaUmStr, eGpaStr, allowMpaStr, lengthMStr, deltaTCStr, odMmStr, wallMmStr];
  if (fields.some((s) => s.trim() === '')) {
    return { valid: false, error: 'All thermal expansion parameters are required.', deltaLMm: 0, deltaLMmPerM: 0, innerDMm: 0, wallAreaMm2: 0, thermalStressMpa: 0, anchorForceKn: 0, stressRatioPct: 0, guidedCantileverLegM: 0, isSafe: false };
  }
  const alphaUm = Number(alphaUmStr);
  const eGpa = Number(eGpaStr);
  const allowMpa = Number(allowMpaStr);
  const L = Number(lengthMStr);
  const dT = Number(deltaTCStr);
  const D = Number(odMmStr);
  const t = Number(wallMmStr);

  if (![alphaUm, eGpa, allowMpa, L, dT, D, t].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', deltaLMm: 0, deltaLMmPerM: 0, innerDMm: 0, wallAreaMm2: 0, thermalStressMpa: 0, anchorForceKn: 0, stressRatioPct: 0, guidedCantileverLegM: 0, isSafe: false };
  }
  if (alphaUm <= 0 || eGpa <= 0 || allowMpa <= 0 || L <= 0 || D <= 0 || t <= 0) {
    return { valid: false, error: 'Alpha, E, allowable stress, length, OD, and wall thickness must be strictly positive.', deltaLMm: 0, deltaLMmPerM: 0, innerDMm: 0, wallAreaMm2: 0, thermalStressMpa: 0, anchorForceKn: 0, stressRatioPct: 0, guidedCantileverLegM: 0, isSafe: false };
  }
  if (2 * t >= D) {
    return { valid: false, error: 'Wall thickness twice (2*t) must be smaller than pipe outside diameter OD.', deltaLMm: 0, deltaLMmPerM: 0, innerDMm: 0, wallAreaMm2: 0, thermalStressMpa: 0, anchorForceKn: 0, stressRatioPct: 0, guidedCantileverLegM: 0, isSafe: false };
  }

  const alpha = alphaUm * 1e-6;
  const E_MPa = eGpa * 1e3;
  const deltaLMm = alpha * L * dT * 1000;
  const deltaLMmPerM = alpha * dT * 1000;
  const innerDMm = D - 2 * t;
  const wallAreaMm2 = (Math.PI / 4) * (D * D - innerDMm * innerDMm);
  const thermalStressMpa = E_MPa * alpha * Math.abs(dT);
  const anchorForceKn = (thermalStressMpa * wallAreaMm2) / 1000;
  const stressRatioPct = (thermalStressMpa / allowMpa) * 100;
  // Guided cantilever expansion leg length: sigma = 3*E*D*|dL| / (2*L^2) => L_mm = sqrt(3*E*D*|dL| / (2*sigma_allow))
  const guidedCantileverLegM = Math.sqrt((3 * E_MPa * D * Math.abs(deltaLMm)) / (2 * allowMpa)) / 1000;

  return {
    valid: true,
    deltaLMm,
    deltaLMmPerM,
    innerDMm,
    wallAreaMm2,
    thermalStressMpa,
    anchorForceKn,
    stressRatioPct,
    guidedCantileverLegM,
    isSafe: thermalStressMpa <= allowMpa,
  };
}

export default function PipeExpansionClient() {
  const [presetName, setPresetName] = useState('Carbon Steel (CS)');
  const [alphaUm, setAlphaUm] = useState('11.2');
  const [eGpa, setEGpa] = useState('200');
  const [allowMpa, setAllowMpa] = useState('150');
  const [lengthM, setLengthM] = useState('10');
  const [deltaTC, setDeltaTC] = useState('100');
  const [pipeOD, setPipeOD] = useState('114.3');
  const [wallThk, setWallThk] = useState('6.02');

  const res = solveThermalExpansion(alphaUm, eGpa, allowMpa, lengthM, deltaTC, pipeOD, wallThk);

  const applyPreset = (name: string) => {
    setPresetName(name);
    const found = MATERIAL_PRESETS.find((m) => m.name === name);
    if (found) {
      setAlphaUm(found.alphaUm);
      setEGpa(found.eGpa);
      setAllowMpa(found.allowMpa);
    }
  };

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Pipe Thermal Expansion Report', ''],
      ['Material Reference', presetName],
      ['Alpha (um/(m*K))', alphaUm],
      ['Elastic Modulus E (GPa)', eGpa],
      ['Assumed Allowable Bending/Expansion Stress (MPa)', allowMpa],
      ['Pipe Length (m)', lengthM],
      ['Temperature Change DeltaT (degC)', deltaTC],
      ['Pipe OD (mm)', pipeOD],
      ['Wall Thickness (mm)', wallThk],
      ['Thermal Expansion DeltaL (mm)', res.deltaLMm.toFixed(4)],
      ['Expansion per Meter (mm/m)', res.deltaLMmPerM.toFixed(4)],
      ['Pipe Wall Area (mm2)', res.wallAreaMm2.toFixed(2)],
      ['Restrained Axial Stress (MPa)', res.thermalStressMpa.toFixed(2)],
      ['Restrained Anchor Force (kN)', res.anchorForceKn.toFixed(4)],
      ['Guided Cantilever Leg Length (m)', res.guidedCantileverLegM.toFixed(4)],
      ['Restrained Check', res.isSafe ? 'WITHIN ASSUMED ALLOWABLE' : 'EXCEEDS ASSUMED ALLOWABLE'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipe-thermal-expansion.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">Material Preset</label>
            <select
              value={presetName}
              onChange={(e) => applyPreset(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            >
              {MATERIAL_PRESETS.map((m) => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Alpha (um/(m*K))</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-alpha"
                value={alphaUm}
                onChange={(e) => setAlphaUm(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Modulus E (GPa)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-e"
                value={eGpa}
                onChange={(e) => setEGpa(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">Assumed Allowable Stress (MPa)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-allow-stress"
              value={allowMpa}
              onChange={(e) => setAllowMpa(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">Pipe Length L (m)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-length"
              value={lengthM}
              onChange={(e) => setLengthM(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">Temperature Change DeltaT (degC)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-dt"
              value={deltaTC}
              onChange={(e) => setDeltaTC(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Pipe OD (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-od"
                value={pipeOD}
                onChange={(e) => setPipeOD(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Wall Thickness (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-wall"
                value={wallThk}
                onChange={(e) => setWallThk(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              applyPreset('Carbon Steel (CS)');
              setLengthM('10');
              setDeltaTC('100');
              setPipeOD('114.3');
              setWallThk('6.02');
            }}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Expansion Results</h2>
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 disabled:opacity-50 transition-all"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                    <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Thermal Expansion DeltaL</p>
                    <p className="text-3xl font-black" data-testid="res-delta-l">
                      {res.deltaLMm.toFixed(2)}<span className="text-lg font-bold ml-2 opacity-80">mm</span>
                    </p>
                    <p className="text-sm mt-2 opacity-80">Linear unit growth: {res.deltaLMmPerM.toFixed(3)} mm/m</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                    <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Guided Cantilever Leg Length</p>
                    <p className="text-3xl font-black" data-testid="res-leg-length">
                      {res.guidedCantileverLegM.toFixed(3)}<span className="text-lg font-bold ml-2 opacity-80">m</span>
                    </p>
                    <p className="text-sm mt-2 opacity-80">L_arm = sqrt(3*E*OD*|DeltaL| / (2*sigma_allow))</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Restrained Stress</p>
                    <p className="text-xl font-black text-slate-900" data-testid="res-thermal-stress">{res.thermalStressMpa.toFixed(1)} MPa</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Anchor Force</p>
                    <p className="text-xl font-black text-slate-900" data-testid="res-anchor-force">{res.anchorForceKn.toFixed(2)} kN</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Metal Wall Area</p>
                    <p className="text-xl font-black text-slate-900">{res.wallAreaMm2.toFixed(1)} mm^2</p>
                  </div>
                </div>

                <div className={`rounded-2xl p-5 border-2 ${res.isSafe ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <p className={`text-lg font-black ${res.isSafe ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {res.isSafe ? 'Restrained Axial Stress Within Assumed Allowable Limit' : 'Fully Restrained Stress Exceeds Assumed Allowable Limit'}
                  </p>
                  <p className="text-sm text-slate-600 font-medium mt-1">
                    Restrained axial stress ratio: {res.stressRatioPct.toFixed(1)}% ({res.thermalStressMpa.toFixed(1)} MPa vs {allowMpa} MPa). Flexible routing or expansion loops relieve axial anchor force.
                  </p>
                </div>
              </>
            )}

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-2.5 text-sm text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Thermal expansion follows linear continuum mechanics (DeltaL = alpha * L * DeltaT). Restrained anchor load F = E * alpha * DeltaT * A assumes rigid end anchors with zero column buckling or pipe flexibility.
              </span>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
