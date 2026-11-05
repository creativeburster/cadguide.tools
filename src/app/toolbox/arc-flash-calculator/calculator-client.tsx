'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, ShieldAlert, CheckCircle2, AlertTriangle, Download, Copy, Check } from 'lucide-react';

interface ScenarioPreset {
  label: string;
  voltage: string;
  enclosure: string;
  faultCurrent: string;
  clearingTime: string;
  distance: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    label: '480V MCC Bucket',
    voltage: '0.48',
    enclosure: 'box',
    faultCurrent: '25',
    clearingTime: '0.08',
    distance: '455',
  },
  {
    label: '480V Main Switchgear',
    voltage: '0.48',
    enclosure: 'box',
    faultCurrent: '40',
    clearingTime: '0.20',
    distance: '610',
  },
  {
    label: '4.16kV Substation Feeder',
    voltage: '4.16',
    enclosure: 'box',
    faultCurrent: '20',
    clearingTime: '0.15',
    distance: '910',
  },
  {
    label: 'Open-Air Bus (Outdoor)',
    voltage: '13.8',
    enclosure: 'open',
    faultCurrent: '15',
    clearingTime: '0.10',
    distance: '910',
  },
];

export default function CalculatorClient() {
  const [voltage, setVoltage] = useState<string>('0.48');
  const [enclosure, setEnclosure] = useState<string>('box');
  const [faultCurrent, setFaultCurrent] = useState<string>('25');
  const [clearingTime, setClearingTime] = useState<string>('0.12');
  const [distance, setDistance] = useState<string>('455');
  const [copied, setCopied] = useState<boolean>(false);

  const parsedIbf = parseFloat(faultCurrent);
  const parsedTime = parseFloat(clearingTime);
  const parsedDist = parseFloat(distance);

  const isValid =
    !isNaN(parsedIbf) && parsedIbf > 0 &&
    !isNaN(parsedTime) && parsedTime > 0 &&
    !isNaN(parsedDist) && parsedDist > 0;

  const results = useMemo(() => {
    if (!isValid) {
      return {
        energyCal: NaN,
        energyJoules: NaN,
        afbMm: NaN,
        afbIn: NaN,
        minArcRating: '—',
        riskCategory: 'Invalid Inputs',
        blastHazard: false,
        isDeenergizeRequired: false,
      };
    }

    // Cf: Enclosure factor (1.5 for enclosed box/switchgear, 1.0 for open air)
    const cf = enclosure === 'box' ? 1.5 : 1.0;
    const safeDist = Math.max(100, parsedDist);

    // Simplified IEEE 1584 baseline empirical equation
    // E = 4.184 * Cf * Ibf^0.95 * (t / 0.2) * (610 / D)^1.5  (in cal/cm²)
    const energyCal = 4.184 * cf * Math.pow(parsedIbf, 0.95) * (parsedTime / 0.2) * Math.pow(610 / safeDist, 1.5);
    const energyJoules = energyCal * 4.184;

    // Arc Flash Boundary (distance at which incident energy equals 1.2 cal/cm², the onset of 2nd degree burn)
    // 1.2 = E * (safeDist / AFB)^1.5  =>  AFB = safeDist * (E / 1.2)^(1 / 1.5)
    const afbMm = safeDist * Math.pow(Math.max(0.01, energyCal) / 1.2, 1 / 1.5);
    const afbIn = afbMm / 25.4;

    // NFPA 70E Incident Energy Analysis Guidance
    let minArcRating = 'Non-Arc-Rated FR (≥ 1.2 cal/cm²)';
    let riskCategory = 'Low Incident Energy';
    let isDeenergizeRequired = false;
    let blastHazard = false;

    if (energyCal <= 1.2) {
      minArcRating = 'Basic FR Shirt/Pants + Safety Glasses (E ≤ 1.2 cal/cm²)';
      riskCategory = 'Below 2nd-degree burn threshold';
    } else if (energyCal <= 4.0) {
      minArcRating = 'Arc-Rated Clothing rated ≥ 4 cal/cm²';
      riskCategory = 'Moderate Flash Risk';
    } else if (energyCal <= 8.0) {
      minArcRating = 'Arc-Rated Clothing rated ≥ 8 cal/cm²';
      riskCategory = 'Substantial Flash Risk';
    } else if (energyCal <= 25.0) {
      minArcRating = 'Arc-Rated Flash Suit rated ≥ 25 cal/cm²';
      riskCategory = 'Severe Flash Risk';
    } else if (energyCal <= 40.0) {
      minArcRating = 'Heavy Flash Suit & Hood rated ≥ 40 cal/cm²';
      riskCategory = 'Critical Flash Hazard';
    } else {
      minArcRating = 'EXCEEDS 40 cal/cm² — NO SAFE PPE EXISTS';
      riskCategory = 'EXTREME BLAST HAZARD (>40 cal/cm²)';
      isDeenergizeRequired = true;
      blastHazard = true;
    }

    return {
      energyCal,
      energyJoules,
      afbMm,
      afbIn,
      minArcRating,
      riskCategory,
      blastHazard,
      isDeenergizeRequired,
    };
  }, [enclosure, parsedIbf, parsedTime, parsedDist, isValid]);

  const handleCopy = () => {
    if (!isValid) return;
    const text = `Arc Flash Estimate: Energy = ${results.energyCal.toFixed(2)} cal/cm², AFB = ${results.afbMm.toFixed(0)} mm (${results.afbIn.toFixed(1)} in), Rating Requirement = ${results.minArcRating}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    if (!isValid) return;
    const rows = [
      ['CADGuide Toolbox - Arc Flash Incident Energy Conceptual Report'],
      ['NOTICE', 'FOR CONCEPTUAL SCREENING ONLY - NOT FOR LIVE WORK PERMITS'],
      [],
      ['Input Parameter', 'Value', 'Unit'],
      ['Nominal System Voltage', voltage, 'kV'],
      ['Equipment Enclosure Type', enclosure === 'box' ? 'Enclosed Box / Switchgear' : 'Open Air Bus', ''],
      ['Bolted Fault Current (Ibf)', faultCurrent, 'kA'],
      ['Arc Clearing Time (t)', clearingTime, 'seconds'],
      ['Working Distance (D)', distance, 'mm'],
      [],
      ['Calculation Output', 'Value', 'Unit'],
      ['Estimated Incident Energy', results.energyCal.toFixed(2), 'cal/cm²'],
      ['Incident Energy (SI)', results.energyJoules.toFixed(1), 'J/cm²'],
      ['Arc Flash Boundary (AFB)', results.afbMm.toFixed(0), 'mm'],
      ['Arc Flash Boundary (Imperial)', results.afbIn.toFixed(1), 'inches'],
      ['NFPA 70E Protective Guidance', results.minArcRating, ''],
      ['Risk Classification', results.riskCategory, ''],
      ['Mandatory De-energization', results.isDeenergizeRequired ? 'YES (>40 cal/cm² blast threshold)' : 'No (manageable if qualified and permitted)', ''],
      [],
      ['Engineering Disclaimer', 'Calculated via simplified IEEE 1584 empirical formula. Formal studies require ETAP/SKM by licensed PE.'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `arc-flash-estimate-${faultCurrent}kA-${clearingTime}s.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Safety Warning Banner */}
      <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-black text-amber-900 tracking-tight">
              Safety-Critical Warning & Educational Disclaimer
            </h3>
            <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed font-medium">
              This calculator provides <strong>preliminary screening estimates only</strong> using simplified empirical equations based on IEEE 1584 baseline models. It is <strong>strictly prohibited</strong> to use these figures for energized work permits, live electrical maintenance decisions, or safety label printing. Comprehensive arc flash analyses require licensed professional electrical engineers performing short-circuit and coordination studies via software (ETAP, SKM Power*Tools, EasyPower) accounting for specific electrode geometries and dynamic clearing times under IEEE 1584 and NFPA 70E.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">System Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">Input circuit fault characteristics</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              Typical Equipment Scenarios
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setVoltage(p.voltage);
                    setEnclosure(p.enclosure);
                    setFaultCurrent(p.faultCurrent);
                    setClearingTime(p.clearingTime);
                    setDistance(p.distance);
                  }}
                  className="p-2 text-left text-xs font-bold rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
                System Voltage (kV)
              </label>
              <select
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all cursor-pointer"
              >
                <option value="0.24">208V / 240V (Low Voltage Panelboard)</option>
                <option value="0.48">480V (Low Voltage Switchgear / MCC)</option>
                <option value="0.60">600V (Industrial Low Voltage)</option>
                <option value="4.16">4.16 kV (Medium Voltage Switchgear)</option>
                <option value="13.8">13.8 kV (Primary Distribution Class)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
                Equipment Enclosure Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEnclosure('box')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    enclosure === 'box'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  Enclosed Box (Switchgear/MCC)
                </button>
                <button
                  type="button"
                  onClick={() => setEnclosure('open')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    enclosure === 'open'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  Open Air (Outdoor Bus)
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Bolted Fault Current (kA)
                </label>
                <span className="text-xs font-bold text-slate-600">{faultCurrent} kA</span>
              </div>
              <input
                type="number"
                step="1"
                min="1"
                max="106"
                value={faultCurrent}
                onChange={(e) => setFaultCurrent(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Arc Clearing Time (seconds)
                </label>
                <span className="text-xs font-bold text-slate-600">{clearingTime} s ({Math.round(parsedTime * 60)} cycles)</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="2.0"
                value={clearingTime}
                onChange={(e) => setClearingTime(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Working Distance (mm)
                </label>
                <span className="text-xs font-bold text-slate-600">{distance} mm ({(parsedDist / 25.4).toFixed(0)} in)</span>
              </div>
              <input
                type="number"
                step="25"
                min="100"
                max="2000"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setVoltage('0.48');
              setEnclosure('box');
              setFaultCurrent('25');
              setClearingTime('0.12');
              setDistance('455');
            }}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults (480V, 25kA, 0.12s)
          </button>
        </div>

        {/* Right Column: Results & Engineering Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Estimated Arc Flash Hazard</h2>
                  <p className="text-xs text-slate-500 font-medium">Incident energy at working distance</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!isValid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors disabled:opacity-40"
                  title="Copy result"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={exportCSV}
                  disabled={!isValid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors disabled:opacity-40"
                  title="Export CSV report"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  CSV
                </button>
              </div>
            </div>

            {/* Status Pill */}
            <div className="flex items-center">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase border ${
                results.blastHazard
                  ? 'bg-rose-50 text-rose-700 border-rose-200 ring-2 ring-rose-500/20'
                  : results.energyCal <= 8
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {results.blastHazard ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <span>{results.riskCategory}</span>
              </div>
            </div>

            {/* Primary Result Banner */}
            <div className={`rounded-2xl p-6 border ${
              results.blastHazard
                ? 'bg-rose-50/70 border-rose-200'
                : 'bg-gradient-to-br from-orange-50 to-amber-50/40 border-orange-100'
            }`}>
              <div className="text-xs font-black uppercase tracking-wider mb-2 text-orange-600">
                Estimated Incident Energy ({distance} mm / {(parsedDist / 25.4).toFixed(0)} in working distance)
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={`text-4xl sm:text-5xl font-black tracking-tight ${
                  results.blastHazard ? 'text-rose-900' : 'text-orange-950'
                }`}>
                  {isNaN(results.energyCal) ? '—' : results.energyCal.toFixed(2)}
                </span>
                <span className="text-xl font-bold text-orange-700">
                  cal/cm²
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  ({isNaN(results.energyJoules) ? '—' : results.energyJoules.toFixed(1)} J/cm²)
                </span>
              </div>
              <div className="mt-2 text-xs font-medium text-slate-700">
                {results.minArcRating}
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Arc Flash Boundary (AFB)
                </div>
                <div className="text-xl font-black text-slate-900">
                  {isNaN(results.afbMm) ? '—' : results.afbMm.toFixed(0)} mm
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {isNaN(results.afbIn) ? '—' : results.afbIn.toFixed(1)} inches (onset of 1.2 cal)
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Clearing Speed
                </div>
                <div className="text-xl font-black text-slate-900">
                  {clearingTime} s
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  ~{Math.round(parsedTime * 60)} AC cycles (60Hz basis)
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Mandatory De-energize
                </div>
                <div className={`text-xl font-black ${results.isDeenergizeRequired ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {results.isDeenergizeRequired ? 'MANDATORY' : 'Not Exceeded'}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {results.isDeenergizeRequired ? 'Blast shockwave risk' : 'PPE mitigation feasible'}
                </div>
              </div>
            </div>

            {/* Protective Guidance Callout */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                NFPA 70E Incident Energy Analysis Guidance
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Under NFPA 70E Section 130.5(G), when incident energy is calculated directly, arc-rated (AR) clothing and PPE must be selected with an <strong>Arc Thermal Performance Value (ATPV)</strong> or <strong>Breakopen Threshold (E_BT)</strong> that equals or exceeds the calculated incident energy. <em>Do not cross-apply PPE Category numbers (1–4)</em> from the NFPA 70E Table Method to calculated incident energy values, as the two compliance methods are mutually exclusive.
              </p>
            </div>
          </div>

          {/* Methodology & Formula Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  IEEE 1584 Baseline Empirical Formula
                </h3>
                <p className="text-xs text-slate-500 font-medium">Screening calculation principles</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              <p className="text-xs sm:text-sm text-slate-800 font-mono font-medium leading-relaxed block break-words">
                E = 4.184 · C_f · I_bf^0.95 · (t / 0.2) · (610 / D)^1.5  [cal/cm²]
              </p>
              <p className="text-xs sm:text-sm text-slate-800 font-mono font-medium leading-relaxed block break-words">
                AFB = D · (E / 1.2)^(1 / 1.5)  [mm]
              </p>
              <p className="text-xs text-slate-500 font-medium mt-2">
                Where <code className="text-slate-700 font-mono">C_f = 1.5</code> for switchgear/MCC enclosures and <code className="text-slate-700 font-mono">1.0</code> for open air; <code className="text-slate-700 font-mono">I_bf</code> is bolted fault current in kA; <code className="text-slate-700 font-mono">t</code> is protective clearing time in seconds; <code className="text-slate-700 font-mono">D</code> is working distance in mm.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
