'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download, Layers, ShieldCheck } from 'lucide-react';

interface SoilPreset {
  name: string;
  c: number;
  gamma: number;
  phi: number;
  Nc: number;
  Nq: number;
  Ng: number;
  desc: string;
}

const SOIL_PRESETS: Record<string, SoilPreset> = {
  default_sample: {
    name: 'Standard Engineering Soil Sample',
    c: 20,
    gamma: 18,
    phi: 25,
    Nc: 30,
    Nq: 18,
    Ng: 15,
    desc: 'Cohesive-frictional C-Phi soil with classical Terzaghi bearing factors.'
  },
  soft_clay: {
    name: 'Soft Saturated Clay (Undrained)',
    c: 25,
    gamma: 17,
    phi: 0,
    Nc: 5.14,
    Nq: 1.0,
    Ng: 0,
    desc: 'Pure cohesive soil (Phi=0 condition). Bearing capacity governed by undrained shear strength.'
  },
  stiff_clay: {
    name: 'Stiff Overconsolidated Clay',
    c: 60,
    gamma: 19.5,
    phi: 15,
    Nc: 12.9,
    Nq: 4.4,
    Ng: 2.5,
    desc: 'Firm to stiff cohesive clay stratum with moderate overburden resistance.'
  },
  loose_sand: {
    name: 'Loose to Medium Dense Sand',
    c: 0,
    gamma: 18,
    phi: 30,
    Nc: 30.1,
    Nq: 18.4,
    Ng: 22.4,
    desc: 'Cohesionless granular soil (c=0). Surcharge and footing width dominate bearing.'
  },
  dense_sand: {
    name: 'Dense Gravelly Sand',
    c: 0,
    gamma: 20,
    phi: 38,
    Nc: 61.4,
    Nq: 48.9,
    Ng: 78.0,
    desc: 'Dense compacted cohesionless aggregate with high internal friction angle.'
  }
};

type FootingShape = 'strip' | 'square' | 'circular';

export default function BearingCapacityCalculatorClient() {
  // Inputs: c (kPa), gamma (kN/m3), Df (m), B (m), Nc, Nq, Ng, FS
  const [cohesion, setCohesion] = useState('20');
  const [soilDensity, setSoilDensity] = useState('18');
  const [depthDf, setDepthDf] = useState('1');
  const [widthB, setWidthB] = useState('2');
  const [factorNc, setFactorNc] = useState('30');
  const [factorNq, setFactorNq] = useState('18');
  const [factorNg, setFactorNg] = useState('15');
  const [safetyFactor, setSafetyFactor] = useState('3.0');
  const [footingShape, setFootingShape] = useState<FootingShape>('strip');
  const [presetKey, setPresetKey] = useState('default_sample');

  const handleApplyPreset = (key: string) => {
    setPresetKey(key);
    const p = SOIL_PRESETS[key];
    if (p) {
      setCohesion(p.c.toString());
      setSoilDensity(p.gamma.toString());
      setFactorNc(p.Nc.toString());
      setFactorNq(p.Nq.toString());
      setFactorNg(p.Ng.toString());
    }
  };

  const handleReset = () => {
    setCohesion('20');
    setSoilDensity('18');
    setDepthDf('1');
    setWidthB('2');
    setFactorNc('30');
    setFactorNq('18');
    setFactorNg('15');
    setSafetyFactor('3.0');
    setFootingShape('strip');
    setPresetKey('default_sample');
  };

  // Calculations
  const result = useMemo(() => {
    const c = parseFloat(cohesion);
    const g = parseFloat(soilDensity);
    const Df = parseFloat(depthDf);
    const B = parseFloat(widthB);
    const Nc = parseFloat(factorNc);
    const Nq = parseFloat(factorNq);
    const Ng = parseFloat(factorNg);
    const FS = parseFloat(safetyFactor);

    if (
      isNaN(c) || isNaN(g) || isNaN(Df) || isNaN(B) ||
      isNaN(Nc) || isNaN(Nq) || isNaN(Ng) || isNaN(FS) ||
      c < 0 || g <= 0 || Df < 0 || B <= 0 || Nc < 0 || Nq < 0 || Ng < 0 || FS <= 0
    ) {
      return {
        isValid: false,
        qu: 0,
        qa: 0,
        qNet: 0,
        cohesionTerm: 0,
        surchargeTerm: 0,
        widthTerm: 0,
        totalAllowableLoad: 0,
        area: 0
      };
    }

    // Terzaghi shape factors
    let sc = 1.0;
    let sq = 1.0;
    let sg = 1.0;

    if (footingShape === 'square') {
      sc = 1.3;
      sq = 1.0;
      sg = 0.8; // Terzaghi 0.4*gamma*B*Ng = 0.5 * 0.8 * gamma * B * Ng
    } else if (footingShape === 'circular') {
      sc = 1.3;
      sq = 1.0;
      sg = 0.6; // Terzaghi 0.3*gamma*B*Ng = 0.5 * 0.6 * gamma * B * Ng
    }

    const cohesionTerm = sc * c * Nc;
    const surchargeTerm = sq * g * Df * Nq;
    const widthTerm = 0.5 * sg * g * B * Ng;

    // Ultimate bearing capacity
    const qu = cohesionTerm + surchargeTerm + widthTerm;

    // Allowable bearing capacity
    const qa = qu / FS;

    // Net allowable bearing capacity (subtracting effective overburden pressure q0 = gamma * Df)
    const q0 = g * Df;
    const qNet = (qu - q0) / FS;

    // Total allowable vertical load
    let area = B * 1.0; // strip: per meter run
    if (footingShape === 'square') {
      area = B * B;
    } else if (footingShape === 'circular') {
      area = (Math.PI * Math.pow(B, 2)) / 4;
    }
    const totalAllowableLoad = qa * area;

    return {
      isValid: true,
      qu,
      qa,
      qNet,
      cohesionTerm,
      surchargeTerm,
      widthTerm,
      totalAllowableLoad,
      area
    };
  }, [cohesion, soilDensity, depthDf, widthB, factorNc, factorNq, factorNg, safetyFactor, footingShape]);

  const formatNum = (n: number | undefined, decimals: number = 2) => {
    if (!result.isValid || n === undefined || isNaN(n) || !isFinite(n)) return '—';
    return n.toFixed(decimals);
  };

  const handleExportCsv = () => {
    const headers = ['Parameter', 'Value', 'Unit'];
    const rows = [
      ['Footing Geometry', footingShape.toUpperCase(), '—'],
      ['Cohesion (c)', cohesion, 'kPa'],
      ['Soil Density (γ)', soilDensity, 'kN/m³'],
      ['Foundation Depth (Df)', depthDf, 'm'],
      ['Foundation Width (B)', widthB, 'm'],
      ['Bearing Factor Nc', factorNc, '—'],
      ['Bearing Factor Nq', factorNq, '—'],
      ['Bearing Factor Nγ', factorNg, '—'],
      ['Factor of Safety (FS)', safetyFactor, '—'],
      ['Cohesion Term (c·Nc)', formatNum(result.cohesionTerm, 2), 'kPa'],
      ['Surcharge Term (γ·Df·Nq)', formatNum(result.surchargeTerm, 2), 'kPa'],
      ['Footing Width Term (0.5·γ·B·Nγ)', formatNum(result.widthTerm, 2), 'kPa'],
      ['Ultimate Bearing Capacity (qu)', formatNum(result.qu, 2), 'kPa'],
      ['Allowable Bearing Capacity (qa)', formatNum(result.qa, 2), 'kPa'],
      ['Net Allowable Capacity (qnet)', formatNum(result.qNet, 2), 'kPa'],
      ['Total Allowable Vertical Force', formatNum(result.totalAllowableLoad, 2), footingShape === 'strip' ? 'kN/m' : 'kN']
    ];

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bearing-capacity-${footingShape}-B${widthB}m-Df${depthDf}m.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Inputs Panel */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Geotechnical Inputs</h2>
            </div>
            <button
              data-testid="btn-reset"
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
              title="Reset to default engineering sample"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Footing Shape Selector */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              Foundation Geometry
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200/50">
              <button
                type="button"
                data-testid="btn-shape-strip"
                onClick={() => setFootingShape('strip')}
                className={`py-2 text-xs font-black rounded-lg transition-all ${
                  footingShape === 'strip'
                    ? 'bg-white text-orange-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Strip
              </button>
              <button
                type="button"
                data-testid="btn-shape-square"
                onClick={() => setFootingShape('square')}
                className={`py-2 text-xs font-black rounded-lg transition-all ${
                  footingShape === 'square'
                    ? 'bg-white text-orange-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Square
              </button>
              <button
                type="button"
                data-testid="btn-shape-circular"
                onClick={() => setFootingShape('circular')}
                className={`py-2 text-xs font-black rounded-lg transition-all ${
                  footingShape === 'circular'
                    ? 'bg-white text-orange-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Circular
              </button>
            </div>
          </div>

          {/* Soil Presets */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              Stratum Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="btn-preset-soft-clay"
                onClick={() => handleApplyPreset('soft_clay')}
                className="py-1.5 px-2 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-left truncate"
              >
                Soft Clay (φ=0)
              </button>
              <button
                type="button"
                data-testid="btn-preset-stiff-clay"
                onClick={() => handleApplyPreset('stiff_clay')}
                className="py-1.5 px-2 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-left truncate"
              >
                Stiff Clay
              </button>
              <button
                type="button"
                data-testid="btn-preset-loose-sand"
                onClick={() => handleApplyPreset('loose_sand')}
                className="py-1.5 px-2 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-left truncate"
              >
                Loose Sand
              </button>
              <button
                type="button"
                data-testid="btn-preset-dense-sand"
                onClick={() => handleApplyPreset('dense_sand')}
                className="py-1.5 px-2 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-left truncate"
              >
                Dense Sand
              </button>
            </div>
          </div>

          {/* Soil Properties */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Cohesion c (kPa)
              </label>
              <input
                type="text"
                data-testid="input-cohesion-c"
                value={cohesion}
                onChange={(e) => setCohesion(e.target.value)}
                placeholder="20"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Density γ (kN/m³)
              </label>
              <input
                type="text"
                data-testid="input-soil-density-gamma"
                value={soilDensity}
                onChange={(e) => setSoilDensity(e.target.value)}
                placeholder="18"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Geometry Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Depth Df (m)
              </label>
              <input
                type="text"
                data-testid="input-depth-df"
                value={depthDf}
                onChange={(e) => setDepthDf(e.target.value)}
                placeholder="1"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Width B / Diam (m)
              </label>
              <input
                type="text"
                data-testid="input-width-b"
                value={widthB}
                onChange={(e) => setWidthB(e.target.value)}
                placeholder="2"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Bearing Factors Nc, Nq, Ng */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Terzaghi Bearing Capacity Factors
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Nc</label>
                <input
                  type="text"
                  data-testid="input-nc"
                  value={factorNc}
                  onChange={(e) => setFactorNc(e.target.value)}
                  placeholder="30"
                  className="w-full h-10 px-2 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-600/10"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Nq</label>
                <input
                  type="text"
                  data-testid="input-nq"
                  value={factorNq}
                  onChange={(e) => setFactorNq(e.target.value)}
                  placeholder="18"
                  className="w-full h-10 px-2 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-600/10"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Nγ</label>
                <input
                  type="text"
                  data-testid="input-ng"
                  value={factorNg}
                  onChange={(e) => setFactorNg(e.target.value)}
                  placeholder="15"
                  className="w-full h-10 px-2 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-600/10"
                />
              </div>
            </div>
          </div>

          {/* Safety Factor FS */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Factor of Safety (FS)
            </label>
            <input
              type="text"
              data-testid="input-safety-factor"
              value={safetyFactor}
              onChange={(e) => setSafetyFactor(e.target.value)}
              placeholder="3.0"
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Standard civil foundation codes (Eurocode 7, IBC) recommend FS = 3.0 for general shear.
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              data-testid="btn-reset-secondary"
              onClick={handleReset}
              className="w-1/3 py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              Reset
            </button>
            <button
              data-testid="btn-export-csv"
              onClick={handleExportCsv}
              className="w-2/3 py-3 rounded-xl text-sm font-black bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Right Results & Visuals Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Capacity Assessment</h2>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <Layers className="w-3.5 h-3.5" />
                Terzaghi 1943 / Eurocode 7
              </span>
            </div>

            {/* Core Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                    Ultimate Bearing Capacity (qu)
                  </div>
                  <div className="text-4xl font-black text-blue-900 font-mono" data-testid="res-qu">
                    {formatNum(result.qu, 2)}
                    <span className="text-lg text-blue-500 ml-1.5">kPa</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600/80 font-semibold mt-3 pt-3 border-t border-blue-200/50">
                  Gross shear failure threshold at foundation base level
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-2">
                    Allowable Bearing Capacity (qa, FS={safetyFactor})
                  </div>
                  <div className="text-4xl font-black text-emerald-900 font-mono" data-testid="res-qa">
                    {formatNum(result.qa, 2)}
                    <span className="text-lg text-emerald-500 ml-1.5">kPa</span>
                  </div>
                </div>
                <p className="text-xs text-emerald-700/80 font-semibold mt-3 pt-3 border-t border-emerald-200/50">
                  Design pressure permitted for structural foundation sizing
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                  Net Allowable Bearing Capacity (qnet)
                </div>
                <div className="text-2xl font-black text-slate-800 font-mono" data-testid="res-qnet">
                  {formatNum(result.qNet, 2)}
                  <span className="text-sm text-slate-500 ml-1">kPa</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                  (qu - γ·Df) / FS — excludes overburden soil weight
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                  Total Allowable Vertical Force (Qa)
                </div>
                <div className="text-2xl font-black text-slate-800 font-mono" data-testid="res-total-load">
                  {formatNum(result.totalAllowableLoad, 1)}
                  <span className="text-sm text-slate-500 ml-1">
                    {footingShape === 'strip' ? 'kN/m' : 'kN'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                  qa &times; Contact Area ({formatNum(result.area, 2)} m²)
                </p>
              </div>
            </div>

            {/* Individual Term Breakdown Table */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Terzaghi Trilinear Component Breakdown
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Cohesion Term</div>
                  <div className="text-lg font-black text-slate-800 font-mono mt-0.5" data-testid="res-cohesion-term">
                    {formatNum(result.cohesionTerm, 1)}
                  </div>
                  <div className="text-[10px] text-slate-400">sc &bull; c &bull; Nc</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Surcharge Term</div>
                  <div className="text-lg font-black text-slate-800 font-mono mt-0.5" data-testid="res-surcharge-term">
                    {formatNum(result.surchargeTerm, 1)}
                  </div>
                  <div className="text-[10px] text-slate-400">sq &bull; γ &bull; Df &bull; Nq</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Width Term</div>
                  <div className="text-lg font-black text-slate-800 font-mono mt-0.5" data-testid="res-width-term">
                    {formatNum(result.widthTerm, 1)}
                  </div>
                  <div className="text-[10px] text-slate-400">0.5 &bull; sγ &bull; γ &bull; B &bull; Nγ</div>
                </div>
              </div>
            </div>

            {/* Engineering Formula Banner */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
              <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 font-mono leading-relaxed">
                <span className="font-bold text-slate-800 block mb-0.5">Terzaghi Governing Formula:</span>
                qu = sc &bull; c &bull; Nc + sq &bull; &gamma; &bull; Df &bull; Nq + 0.5 &bull; s&gamma; &bull; &gamma; &bull; B &bull; N&gamma; &bull; qa = qu / FS
              </div>
            </div>
          </div>

          {/* Technical Geotechnical Reference */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Geotechnical Standards & Safety Factor Criteria (Eurocode 7 / ASTM D1586)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed font-medium">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <strong className="text-slate-800 font-bold block mb-1">General Shear vs. Local Shear:</strong>
                Terzaghi formulas assume general shear failure for dense sands and stiff clays. For soft clays and loose sands, reduce parameters to c&apos; = 2/3 c and tan(φ&apos;) = 2/3 tan(φ) to model punching / local shear.
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <strong className="text-slate-800 font-bold block mb-1">Water Table Correction:</strong>
                If the ground water table rises within depth (Df + B) of the foundation, buoyant soil unit weight (γ&apos; = γsat - 9.81 kN/m³) must be substituted into the surcharge or width term.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
