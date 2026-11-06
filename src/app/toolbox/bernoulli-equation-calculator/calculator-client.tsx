'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

function parseNum(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

const G_CONST = 9.80665; // Standard gravity m/s^2 (ISO 80000-3 / NIST SP 811)

export default function BernoulliEquationCalculatorClient() {
  const [p1Str, setP1Str] = useState('200');
  const [v1Str, setV1Str] = useState('2');
  const [z1Str, setZ1Str] = useState('0');
  const [v2Str, setV2Str] = useState('5');
  const [z2Str, setZ2Str] = useState('3');
  const [densityStr, setDensityStr] = useState('1000');

  const result = useMemo(() => {
    const P1_kPa = parseNum(p1Str);
    const v1 = parseNum(v1Str);
    const z1 = parseNum(z1Str);
    const v2 = parseNum(v2Str);
    const z2 = parseNum(z2Str);
    const rho = parseNum(densityStr);

    if (
      P1_kPa === null || v1 === null || z1 === null || v2 === null || z2 === null || rho === null ||
      rho <= 0 || v1 < 0 || v2 < 0
    ) {
      return { P2_kPa: null, totalHead: null, q1_kPa: null, q2_kPa: null, deltaP_kPa: null };
    }

    const P1 = P1_kPa * 1000; // Convert kPa to Pa
    // Bernoulli Equation: P1 + 0.5*rho*v1^2 + rho*g*z1 = P2 + 0.5*rho*v2^2 + rho*g*z2
    const deltaDyn = 0.5 * rho * (Math.pow(v1, 2) - Math.pow(v2, 2));
    const deltaPot = rho * G_CONST * (z1 - z2);
    const P2 = P1 + deltaDyn + deltaPot;

    const P2_kPa = P2 / 1000;
    const q1_kPa = (0.5 * rho * Math.pow(v1, 2)) / 1000;
    const q2_kPa = (0.5 * rho * Math.pow(v2, 2)) / 1000;
    const totalHead = P1 / (rho * G_CONST) + Math.pow(v1, 2) / (2 * G_CONST) + z1;
    const deltaP_kPa = P2_kPa - P1_kPa;

    return { P2_kPa, totalHead, q1_kPa, q2_kPa, deltaP_kPa };
  }, [p1Str, v1Str, z1Str, v2Str, z2Str, densityStr]);

  const handleReset = () => {
    setP1Str('200');
    setV1Str('2');
    setZ1Str('0');
    setV2Str('5');
    setZ2Str('3');
    setDensityStr('1000');
  };

  const applyPreset = (p1: string, v1: string, z1: string, v2: string, z2: string, rho: string) => {
    setP1Str(p1);
    setV1Str(v1);
    setZ1Str(z1);
    setV2Str(v2);
    setZ2Str(z2);
    setDensityStr(rho);
  };

  const handleExportCsv = () => {
    const csvContent = [
      '# Incompressible Bernoulli Fluid Dynamics Calculation (ISO 80000-4 / NASA Glenn Standard)',
      '# Verified by CADGuide.tools Toolbox',
      'Parameter,Value,Unit',
      `Station 1 Static Pressure (P1),${p1Str},kPa`,
      `Station 1 Flow Velocity (v1),${v1Str},m/s`,
      `Station 1 Elevation (z1),${z1Str},m`,
      `Station 2 Flow Velocity (v2),${v2Str},m/s`,
      `Station 2 Elevation (z2),${z2Str},m`,
      `Fluid Density (rho),${densityStr},kg/m3`,
      `Standard Gravity (g),${G_CONST.toFixed(5)},m/s2`,
      `Station 2 Static Pressure (P2),${result.P2_kPa !== null ? result.P2_kPa.toFixed(3) : '—'},kPa`,
      `Pressure Change (Delta P),${result.deltaP_kPa !== null ? result.deltaP_kPa.toFixed(3) : '—'},kPa`,
      `Total Hydraulic Head (H),${result.totalHead !== null ? result.totalHead.toFixed(3) : '—'},m`,
      `Station 1 Dynamic Pressure (q1),${result.q1_kPa !== null ? result.q1_kPa.toFixed(3) : '—'},kPa`,
      `Station 2 Dynamic Pressure (q2),${result.q2_kPa !== null ? result.q2_kPa.toFixed(3) : '—'},kPa`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bernoulli_equation_calculation.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Flow Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1">Fluid Presets:</span>
        <button
          type="button"
          data-testid="preset-water-pipe"
          onClick={() => applyPreset('200', '2', '0', '5', '3', '1000')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Water Pipe Incline (200 kPa, Δz=3m)
        </button>
        <button
          type="button"
          data-testid="preset-venturi-meter"
          onClick={() => applyPreset('300', '1.5', '0', '6', '0', '1000')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Venturi Constriction (Δz=0, 1.5→6 m/s)
        </button>
        <button
          type="button"
          data-testid="preset-air-duct"
          onClick={() => applyPreset('101.325', '10', '0', '25', '0', '1.225')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          HVAC Airflow (1.225 kg/m³, 10→25 m/s)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Controls */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Station Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              title="Reset defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Station 1 Pressure P1 (kPa)</label>
            <input
              type="text"
              data-testid="input-p1"
              value={p1Str}
              onChange={(e) => setP1Str(e.target.value)}
              placeholder="200"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Velocity v1 (m/s)</label>
              <input
                type="text"
                data-testid="input-v1"
                value={v1Str}
                onChange={(e) => setV1Str(e.target.value)}
                placeholder="2"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Elevation z1 (m)</label>
              <input
                type="text"
                data-testid="input-z1"
                value={z1Str}
                onChange={(e) => setZ1Str(e.target.value)}
                placeholder="0"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Velocity v2 (m/s)</label>
              <input
                type="text"
                data-testid="input-v2"
                value={v2Str}
                onChange={(e) => setV2Str(e.target.value)}
                placeholder="5"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Elevation z2 (m)</label>
              <input
                type="text"
                data-testid="input-z2"
                value={z2Str}
                onChange={(e) => setZ2Str(e.target.value)}
                placeholder="3"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Fluid Density ρ (kg/m³)</label>
            <input
              type="text"
              data-testid="input-density"
              value={densityStr}
              onChange={(e) => setDensityStr(e.target.value)}
              placeholder="1000"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              data-testid="btn-export-csv"
              onClick={handleExportCsv}
              className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Calculation (CSV)
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Bernoulli Pressure Results</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-teal-50/70 rounded-2xl p-6 border border-teal-100">
                <div className="text-xs font-black text-teal-600 uppercase tracking-wider mb-2">Station 2 Static Pressure P2</div>
                <div className="text-3xl font-black text-teal-800">
                  <span data-testid="result-p2">
                    {result.P2_kPa !== null ? result.P2_kPa.toFixed(3) : '—'}
                  </span>
                  <span className="text-lg text-teal-500 font-bold ml-1">kPa</span>
                </div>
                <div className="text-xs text-teal-600 font-semibold mt-1">
                  P2 = P1 + ½ρ(v1²−v2²) + ρg(z1−z2)
                </div>
              </div>

              <div className="bg-blue-50/70 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Total Hydraulic Head H</div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-head">
                    {result.totalHead !== null ? result.totalHead.toFixed(3) : '—'}
                  </span>
                  <span className="text-lg text-blue-400 font-bold ml-1">m</span>
                </div>
                <div className="text-xs text-blue-600 font-semibold mt-1">
                  H = P/(ρg) + v²/(2g) + z
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Dynamic Pressure q1 (Station 1)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-q1">
                    {result.q1_kPa !== null ? result.q1_kPa.toFixed(3) : '—'}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 ml-1">kPa</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">q1 = ½·ρ·v1²</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Dynamic Pressure q2 (Station 2)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-q2">
                    {result.q2_kPa !== null ? result.q2_kPa.toFixed(3) : '—'}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 ml-1">kPa</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">q2 = ½·ρ·v2²</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                <Info className="w-4 h-4 text-teal-500 shrink-0" />
                Incompressible Flow Principles (ISO 80000-4 / NASA Glenn Research Center)
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-6">
                Total energy along a streamline remains constant: P + ½ρv² + ρgz = const. When velocity increases (e.g. through a Venturi throat), static pressure decreases proportionally.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
