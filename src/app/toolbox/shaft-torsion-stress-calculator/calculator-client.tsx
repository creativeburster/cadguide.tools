'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Gauge, RotateCcw, Download } from 'lucide-react';

const MATERIAL_PRESETS = [
  { id: 'steel', label: 'Steel (G=77 GPa, Sy=250 MPa)', G: '77', sy: '250' },
  { id: 'ss304', label: 'Stainless 304 (G=73 GPa, Sy=215 MPa)', G: '73', sy: '215' },
  { id: 'al6061', label: 'Aluminum 6061 (G=26 GPa, Sy=276 MPa)', G: '26', sy: '276' },
  { id: 'titanium', label: 'Titanium (G=44 GPa, Sy=880 MPa)', G: '44', sy: '880' },
  { id: 'brass', label: 'Brass (G=37 GPa, Sy=310 MPa)', G: '37', sy: '310' },
];

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export default function ShaftTorsionClient() {
  const [shaftType, setShaftType] = useState<'solid' | 'hollow'>('solid');
  const [inputMode, setInputMode] = useState<'torque' | 'power'>('torque');
  const [outerDiaStr, setOuterDiaStr] = useState('40');
  const [innerDiaStr, setInnerDiaStr] = useState('20');
  const [lengthStr, setLengthStr] = useState('500');
  const [torqueStr, setTorqueStr] = useState('100');
  const [powerStr, setPowerStr] = useState('5');
  const [rpmStr, setRpmStr] = useState('1500');
  const [shearModGpaStr, setShearModGpaStr] = useState('77');
  const [yieldMpaStr, setYieldMpaStr] = useState('250');

  const result = useMemo(() => {
    const DoMm = parseFinite(outerDiaStr);
    const DiMm = shaftType === 'hollow' ? parseFinite(innerDiaStr) : 0;
    const LMm = parseFinite(lengthStr);
    const GGpa = parseFinite(shearModGpaStr);
    const syMpa = parseFinite(yieldMpaStr);
    const tVal = parseFinite(torqueStr);
    const pVal = parseFinite(powerStr);
    const rVal = parseFinite(rpmStr);

    if (DoMm === null || DiMm === null || LMm === null || GGpa === null || syMpa === null) {
      return { valid: false as const, error: 'Enter valid numeric values for shaft geometry and material properties.' };
    }
    if (DoMm <= 0 || LMm < 0 || GGpa <= 0 || syMpa <= 0) {
      return { valid: false as const, error: 'Outer diameter D, shear modulus G, and yield strength must be > 0; length L >= 0.' };
    }
    if (shaftType === 'hollow' && (DiMm < 0 || DiMm >= DoMm)) {
      return { valid: false as const, error: 'For a hollow shaft, inner diameter d must satisfy 0 <= d < D.' };
    }

    let T = 0;
    if (inputMode === 'torque') {
      if (tVal === null || tVal < 0) {
        return { valid: false as const, error: 'Torque T must be a valid number >= 0.' };
      }
      T = tVal;
    } else {
      if (pVal === null || rVal === null || pVal < 0 || rVal <= 0) {
        return { valid: false as const, error: 'Power must be >= 0 and rotational speed must be > 0 RPM.' };
      }
      T = (pVal * 60 * 1000) / (2 * Math.PI * rVal);
    }

    const D = DoMm / 1000;
    const d = DiMm / 1000;
    const L = LMm / 1000;
    const GPa = GGpa * 1e9;

    const J = shaftType === 'solid'
      ? (Math.PI * Math.pow(D, 4)) / 32
      : (Math.PI * (Math.pow(D, 4) - Math.pow(d, 4))) / 32;
    const Jmm4 = J * 1e12;
    const ZpMm3 = (J / (D / 2)) * 1e9;

    const shearStressMpa = ((T * (D / 2)) / J) / 1e6;
    const twistAngleDeg = ((T * L) / (GPa * J)) * (180 / Math.PI);
    const shearYieldMpa = syMpa / Math.sqrt(3);
    const safetyFactor = shearStressMpa > 0 ? shearYieldMpa / shearStressMpa : null;

    return {
      valid: true as const,
      DoMm,
      DiMm,
      LMm,
      GGpa,
      syMpa,
      T,
      Jmm4,
      ZpMm3,
      shearStressMpa,
      twistAngleDeg,
      shearYieldMpa,
      safetyFactor,
    };
  }, [shaftType, inputMode, outerDiaStr, innerDiaStr, lengthStr, torqueStr, powerStr, rpmStr, shearModGpaStr, yieldMpaStr]);

  const resetDefaults = () => {
    setShaftType('solid');
    setInputMode('torque');
    setOuterDiaStr('40');
    setInnerDiaStr('20');
    setLengthStr('500');
    setTorqueStr('100');
    setPowerStr('5');
    setRpmStr('1500');
    setShearModGpaStr('77');
    setYieldMpaStr('250');
  };

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Shaft Torsion Shear Stress & Twist Angle Report',
      '# Formulas: tau = T * r / J, theta = T * L / (G * J)',
      'Parameter,Value,Unit',
      `Shaft Section,${shaftType},-`,
      `Outer Diameter D,${result.DoMm},mm`,
      `Inner Diameter d,${result.DiMm},mm`,
      `Shaft Length L,${result.LMm},mm`,
      `Shear Modulus G,${result.GGpa},GPa`,
      `Tensile Yield Strength Sy,${result.syMpa},MPa`,
      `Applied Torque T,${result.T.toFixed(6)},N*m`,
      `Polar Moment of Inertia J,${result.Jmm4.toFixed(2)},mm^4`,
      `Torsional Section Modulus Zp,${result.ZpMm3.toFixed(2)},mm^3`,
      `Max Torsional Shear Stress tau,${result.shearStressMpa.toFixed(6)},MPa`,
      `Total Twist Angle theta,${result.twistAngleDeg.toFixed(6)},deg`,
      `Distortion-Energy Safety Factor,${result.safetyFactor !== null ? result.safetyFactor.toFixed(6) : 'Unloaded'},-`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shaft-torsion-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Shaft Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['solid', 'hollow'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  data-testid={`type-${t}`}
                  onClick={() => setShaftType(t)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-black border transition-all cursor-pointer ${
                    shaftType === t
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {t === 'solid' ? 'Solid Shaft' : 'Hollow Shaft'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Reference Material Presets</label>
            <div className="flex flex-wrap gap-1.5">
              {MATERIAL_PRESETS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  data-testid={`preset-mat-${m.id}`}
                  onClick={() => {
                    setShearModGpaStr(m.G);
                    setYieldMpaStr(m.sy);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    shearModGpaStr === m.G && yieldMpaStr === m.sy
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  {m.id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Shear Mod G (GPa)</label>
              <input
                type="text"
                data-testid="input-g"
                value={shearModGpaStr}
                onChange={e => setShearModGpaStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Yield Sy (MPa)</label>
              <input
                type="text"
                data-testid="input-sy"
                value={yieldMpaStr}
                onChange={e => setYieldMpaStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Outer Diameter D (mm)</label>
            <input
              type="text"
              data-testid="input-outer-dia"
              value={outerDiaStr}
              onChange={e => setOuterDiaStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
            />
          </div>

          {shaftType === 'hollow' && (
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Inner Diameter d (mm)</label>
              <input
                type="text"
                data-testid="input-inner-dia"
                value={innerDiaStr}
                onChange={e => setInnerDiaStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Shaft Length L (mm)</label>
            <input
              type="text"
              data-testid="input-length"
              value={lengthStr}
              onChange={e => setLengthStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Loading Input Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {(['torque', 'power'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  data-testid={`mode-${m}`}
                  onClick={() => setInputMode(m)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-black border transition-all cursor-pointer ${
                    inputMode === m
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {m === 'torque' ? 'Torque (Nm)' : 'Power (kW)'}
                </button>
              ))}
            </div>
          </div>

          {inputMode === 'torque' ? (
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Torque T (N&middot;m)</label>
              <input
                type="text"
                data-testid="input-torque"
                value={torqueStr}
                onChange={e => setTorqueStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Power (kW)</label>
                <input
                  type="text"
                  data-testid="input-power"
                  value={powerStr}
                  onChange={e => setPowerStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Speed (RPM)</label>
                <input
                  type="text"
                  data-testid="input-rpm"
                  value={rpmStr}
                  onChange={e => setRpmStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Gauge className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={downloadCsv}
                disabled={!result.valid}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!result.valid && (
              <div data-testid="validation-msg" className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {result.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <div className="text-xs font-black text-red-500 uppercase tracking-wider mb-2">Max Shear Stress</div>
                <div data-testid="output-shear" className="text-3xl font-black text-red-700">
                  {result.valid ? result.shearStressMpa.toFixed(3) : '—'}
                  {result.valid && <span className="text-lg text-red-400 ml-1">MPa</span>}
                </div>
                <div className="text-xs text-red-600 font-medium mt-1">tau = T &middot; r / J</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Angle of Twist</div>
                <div data-testid="output-twist" className="text-3xl font-black text-blue-700">
                  {result.valid ? result.twistAngleDeg.toFixed(4) : '—'}
                  {result.valid && <span className="text-lg text-blue-400 ml-1">deg</span>}
                </div>
                <div className="text-xs text-blue-600 font-medium mt-1">theta = T &middot; L / (G &middot; J)</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Applied Torque</div>
                <div data-testid="output-torque" className="text-lg font-black text-slate-800">
                  {result.valid ? `${result.T.toFixed(3)} Nm` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Polar Inertia J</div>
                <div data-testid="output-j" className="text-lg font-black text-slate-800">
                  {result.valid ? `${result.Jmm4.toFixed(1)} mm^4` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Safety Factor</div>
                <div
                  data-testid="output-sf"
                  className={`text-lg font-black ${
                    !result.valid || result.safetyFactor === null
                      ? 'text-slate-600'
                      : result.safetyFactor >= 2
                        ? 'text-green-600'
                        : result.safetyFactor >= 1
                          ? 'text-orange-600'
                          : 'text-red-600'
                  }`}
                >
                  {result.valid ? (result.safetyFactor === null ? 'Unloaded' : result.safetyFactor.toFixed(3)) : '—'}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Solid: J = pi &middot; D^4 / 32; Hollow: J = pi &middot; (D^4 &minus; d^4) / 32. Shear stress tau = T &middot; r / J (Engineering ToolBox: Torsion of Shafts), twist angle theta = T &middot; L / (G &middot; J) (Wikipedia: Torsion mechanics), and von Mises shear yield tau_y = Sy / sqrt(3).
                </span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
