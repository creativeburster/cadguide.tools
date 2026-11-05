'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, ShieldAlert, CheckCircle2, AlertTriangle, Download, Copy, Check } from 'lucide-react';

interface EquipmentConfig {
  id: string;
  name: string;
  isOpenAir: boolean;
  defaultGapMm: number;
  distanceExponentX: number;
  typicalVoltageKv: string;
  standardWorkingDistMm: number;
  description: string;
}

// IEEE 1584-2002 Table 4 Classes of equipment and Table 3 Factors
const EQUIPMENT_CLASSES: EquipmentConfig[] = [
  {
    id: 'mcc_low',
    name: 'MCCs & Panelboards (≤ 1 kV)',
    isOpenAir: false,
    defaultGapMm: 25,
    distanceExponentX: 1.641,
    typicalVoltageKv: '0.48',
    standardWorkingDistMm: 455,
    description: 'Motor Control Centers and industrial distribution panelboards',
  },
  {
    id: 'swg_low',
    name: 'Low-Voltage Switchgear (≤ 1 kV)',
    isOpenAir: false,
    defaultGapMm: 32,
    distanceExponentX: 1.473,
    typicalVoltageKv: '0.48',
    standardWorkingDistMm: 610,
    description: 'Enclosed drawout metal-enclosed low-voltage switchgear',
  },
  {
    id: 'cable_low',
    name: 'Cable & Conduit (≤ 1 kV)',
    isOpenAir: false,
    defaultGapMm: 13,
    distanceExponentX: 2.000,
    typicalVoltageKv: '0.48',
    standardWorkingDistMm: 455,
    description: 'Cables in trays, gutters, or pull boxes',
  },
  {
    id: 'open_low',
    name: 'Open Air Bus (< 1 kV)',
    isOpenAir: true,
    defaultGapMm: 32,
    distanceExponentX: 2.000,
    typicalVoltageKv: '0.48',
    standardWorkingDistMm: 455,
    description: 'Unenclosed open conductors or busbars below 1 kV',
  },
  {
    id: 'swg_med',
    name: 'Medium-Voltage Switchgear (1 kV – 5 kV)',
    isOpenAir: false,
    defaultGapMm: 102,
    distanceExponentX: 0.973,
    typicalVoltageKv: '4.16',
    standardWorkingDistMm: 910,
    description: 'Metal-clad MV switchgear with drawout vacuum or SF6 breakers',
  },
  {
    id: 'swg_med_high',
    name: 'Medium-Voltage Switchgear (5 kV – 15 kV)',
    isOpenAir: false,
    defaultGapMm: 152,
    distanceExponentX: 0.973,
    typicalVoltageKv: '13.8',
    standardWorkingDistMm: 910,
    description: 'Primary distribution metal-clad switchgear 5 kV to 15 kV',
  },
  {
    id: 'open_med',
    name: 'Open Air Substation Bus (1 kV – 15 kV)',
    isOpenAir: true,
    defaultGapMm: 102,
    distanceExponentX: 2.000,
    typicalVoltageKv: '13.8',
    standardWorkingDistMm: 910,
    description: 'Outdoor substation air-insulated conductors',
  },
];

interface ScenarioPreset {
  label: string;
  voltage: string;
  equipId: string;
  grounding: 'grounded' | 'ungrounded';
  faultCurrent: string;
  clearingTime: string;
  distance: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    label: '480V MCC (Default Benchmark)',
    voltage: '0.48',
    equipId: 'mcc_low',
    grounding: 'grounded',
    faultCurrent: '25',
    clearingTime: '0.12',
    distance: '455',
  },
  {
    label: '480V Main Switchgear',
    voltage: '0.48',
    equipId: 'swg_low',
    grounding: 'grounded',
    faultCurrent: '40',
    clearingTime: '0.15',
    distance: '610',
  },
  {
    label: '4.16kV Substation Feeder',
    voltage: '4.16',
    equipId: 'swg_med',
    grounding: 'grounded',
    faultCurrent: '20',
    clearingTime: '0.10',
    distance: '910',
  },
  {
    label: '13.8kV Open Air Bus',
    voltage: '13.8',
    equipId: 'open_med',
    grounding: 'ungrounded',
    faultCurrent: '12',
    clearingTime: '0.08',
    distance: '910',
  },
];

export default function CalculatorClient() {
  const [voltage, setVoltage] = useState<string>('0.48');
  const [equipId, setEquipId] = useState<string>('mcc_low');
  const [grounding, setGrounding] = useState<'grounded' | 'ungrounded'>('grounded');
  const [faultCurrent, setFaultCurrent] = useState<string>('25');
  const [clearingTime, setClearingTime] = useState<string>('0.12');
  const [distance, setDistance] = useState<string>('455');
  const [customGap, setCustomGap] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedEquip = useMemo(() => {
    return EQUIPMENT_CLASSES.find(e => e.id === equipId) || EQUIPMENT_CLASSES[0];
  }, [equipId]);

  const gapMm = customGap !== '' ? parseFloat(customGap) : selectedEquip.defaultGapMm;

  const parsedV = parseFloat(voltage);
  const parsedIbf = parseFloat(faultCurrent);
  const parsedTime = parseFloat(clearingTime);
  const parsedDist = parseFloat(distance);

  const isValid =
    !isNaN(parsedV) && parsedV >= 0.208 && parsedV <= 15 &&
    !isNaN(parsedIbf) && parsedIbf >= 0.7 && parsedIbf <= 106 &&
    !isNaN(parsedTime) && parsedTime > 0 && parsedTime <= 5 &&
    !isNaN(parsedDist) && parsedDist >= 100 && parsedDist <= 3000 &&
    !isNaN(gapMm) && gapMm > 0;

  const isOutOfIeeeRange =
    (parsedV < 0.208 || parsedV > 15) ||
    (parsedIbf < 0.7 || parsedIbf > 106) ||
    (gapMm < 10 || gapMm > 153);

  const results = useMemo(() => {
    if (!isValid) {
      return {
        iaKa: NaN,
        ia85Ka: NaN,
        enJoules: NaN,
        energyCal: NaN,
        energyJoules: NaN,
        afbMm: NaN,
        afbIn: NaN,
        minArcRatingText: '—',
        riskCategory: 'Invalid Inputs',
        blastWarning: false,
      };
    }

    const V = parsedV; // kV
    const Ibf = parsedIbf; // kA
    const t = parsedTime; // s
    const D = parsedDist; // mm
    const G = gapMm; // mm
    const x = selectedEquip.distanceExponentX;
    const isOpenAir = selectedEquip.isOpenAir;

    // --- Step 1: Calculate Arcing Current Ia per IEEE 1584-2002 ---
    let logIa = 0;
    if (V < 1.0) {
      // Equation 1: For applications with V < 1000V
      // K = -0.153 for open air, -0.097 for box/enclosed
      const K = isOpenAir ? -0.153 : -0.097;
      const logIbf = Math.log10(Ibf);
      logIa = K + 0.662 * logIbf + 0.0966 * V + 0.000526 * G + 0.5588 * V * logIbf - 0.00304 * G * logIbf;
    } else {
      // Equation 2: For applications with V >= 1000V
      logIa = 0.00402 + 0.983 * Math.log10(Ibf);
    }
    const iaKa = Math.pow(10, logIa);
    const ia85Ka = 0.85 * iaKa; // 85% arcing current check

    // --- Step 2: Calculate Normalized Incident Energy En (J/cm²) ---
    // Log10(En) = K1 + K2 + 1.081 * log10(Ia) + 0.0011 * G
    // K1 = -0.792 for open air, -0.555 for box
    // K2 = -0.113 for grounded systems, 0 for ungrounded/high-resistance grounded
    const K1 = isOpenAir ? -0.792 : -0.555;
    const K2 = grounding === 'grounded' ? -0.113 : 0.0;
    const logEn = K1 + K2 + 1.081 * Math.log10(iaKa) + 0.0011 * G;
    const enJoules = Math.pow(10, logEn); // J/cm² at 0.2s and 610mm

    // --- Step 3: Convert to Actual Time and Distance ---
    // Cf = 1.5 for V <= 1.0 kV; 1.0 for V > 1.0 kV
    const cf = V <= 1.0 ? 1.5 : 1.0;
    // E (J/cm²) = 4.184 * Cf * En * (t / 0.2) * (610^x / D^x)
    const distanceFactor = Math.pow(610 / D, x);
    const energyJoules = 4.184 * cf * enJoules * (t / 0.2) * distanceFactor;
    // E (cal/cm²) = E (J/cm²) / 4.184 = Cf * En * (t / 0.2) * (610^x / D^x)
    const energyCal = energyJoules / 4.184;

    // --- Step 4: Arc Flash Boundary AFB (mm) ---
    // Distance where incident energy drops to 1.2 cal/cm² (5.0 J/cm², threshold of 2nd-degree burn)
    // AFB = [4.184 * Cf * En * (t / 0.2) * (610^x / 5.0)]^(1 / x) = 610 * (E_cal / 1.2)^(1 / x)
    const afbMm = 610 * Math.pow(Math.max(0.01, energyCal) / 1.2, 1 / x);
    const afbIn = afbMm / 25.4;

    // --- Step 5: Protective Recommendation ---
    let minArcRatingText = '';
    let riskCategory = '';
    let blastWarning = false;

    if (energyCal <= 1.2) {
      minArcRatingText = 'Incident energy ≤ 1.2 cal/cm² (below 2nd-degree burn threshold). Non-melting standard workwear applies.';
      riskCategory = 'Low Risk (< 1.2 cal/cm²)';
    } else if (energyCal <= 40.0) {
      minArcRatingText = `Arc-Rated (AR) PPE required with minimum ATPV / E_BT rating ≥ ${energyCal.toFixed(1)} cal/cm²`;
      riskCategory = energyCal <= 8 ? 'Moderate Flash Risk' : 'High Flash Hazard';
    } else {
      minArcRatingText = `Incident energy (${energyCal.toFixed(1)} cal/cm²) exceeds 40 cal/cm². Energized work prohibited by facility safety policy.`;
      riskCategory = 'EXTREME HAZARD (>40 cal/cm²)';
      blastWarning = true;
    }

    return {
      iaKa,
      ia85Ka,
      enJoules,
      energyCal,
      energyJoules,
      afbMm,
      afbIn,
      minArcRatingText,
      riskCategory,
      blastWarning,
    };
  }, [parsedV, parsedIbf, parsedTime, parsedDist, gapMm, selectedEquip, grounding, isValid]);

  const handleCopy = () => {
    if (!isValid) return;
    const text = `Arc Flash Estimate: Incident Energy = ${results.energyCal.toFixed(2)} cal/cm² (${results.energyJoules.toFixed(1)} J/cm²), Arcing Current Ia = ${results.iaKa.toFixed(2)} kA, Arc Flash Boundary AFB = ${results.afbMm.toFixed(0)} mm (${results.afbIn.toFixed(1)} in). Governing Model: IEEE 1584-2002.`;
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  const exportCSV = () => {
    if (!isValid) return;
    const rows = [
      ['CADGuide Toolbox - Arc Flash Incident Energy Estimation Report'],
      ['Governing Method', 'IEEE 1584-2002 Empirical Model Equations'],
      ['Notice', 'CONCEPTUAL SCREENING ONLY - NOT FOR ENERGIZED WORK PERMITS'],
      [],
      ['Input Parameter', 'Value', 'Unit'],
      ['Nominal System Voltage (V)', voltage, 'kV'],
      ['Equipment Class', selectedEquip.name, ''],
      ['System Grounding Type', grounding === 'grounded' ? 'Solidly Grounded' : 'Ungrounded / High-Resistance', ''],
      ['Bolted Fault Current (Ibf)', faultCurrent, 'kA'],
      ['Arc Clearing Duration (t)', clearingTime, 'seconds'],
      ['Working Distance (D)', distance, 'mm'],
      ['Conductor Electrode Gap (G)', gapMm.toString(), 'mm'],
      ['Distance Exponent (x)', selectedEquip.distanceExponentX.toString(), ''],
      [],
      ['Calculation Output', 'Value', 'Unit'],
      ['Predicted Arcing Current (Ia)', results.iaKa.toFixed(2), 'kA'],
      ['Reduced Arcing Current (85% Ia)', results.ia85Ka.toFixed(2), 'kA'],
      ['Normalized Energy En', results.enJoules.toFixed(3), 'J/cm² (0.2s, 610mm)'],
      ['Incident Energy (E)', results.energyCal.toFixed(2), 'cal/cm²'],
      ['Incident Energy (SI)', results.energyJoules.toFixed(1), 'J/cm²'],
      ['Arc Flash Boundary (AFB)', results.afbMm.toFixed(0), 'mm'],
      ['Arc Flash Boundary (Imperial)', results.afbIn.toFixed(1), 'inches'],
      ['PPE Requirement Guidance', results.minArcRatingText, ''],
      ['Risk Classification', results.riskCategory, ''],
      [],
      ['Engineering Disclaimer', 'Calculated via IEEE 1584-2002 equations. Formal arc flash studies require software modeling (ETAP, SKM, EasyPower) and PE stamping.'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `arc-flash-ieee1584-${faultCurrent}kA-${voltage}kV.csv`);
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
              Safety-Critical Warning &amp; Educational Disclaimer
            </h3>
            <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed font-medium">
              This calculator provides <strong>preliminary screening estimates</strong> using the published empirical equations of <strong>IEEE 1584-2002</strong>. It is <strong>strictly prohibited</strong> to use these figures as the sole basis for energized work permits, live electrical maintenance decisions, or safety label printing. Comprehensive arc flash hazard analyses require licensed professional electrical engineers performing short-circuit and protective device coordination studies via certified software (ETAP, SKM Power*Tools, EasyPower) incorporating specific upstream breaker time-current characteristics (TCC).
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Circuit Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">IEEE 1584 empirical inputs</p>
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
                    setEquipId(p.equipId);
                    setGrounding(p.grounding);
                    setFaultCurrent(p.faultCurrent);
                    setClearingTime(p.clearingTime);
                    setDistance(p.distance);
                    setCustomGap('');
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
                Equipment Class (IEEE 1584 Table 4)
              </label>
              <select
                value={equipId}
                onChange={(e) => {
                  setEquipId(e.target.value);
                  const eq = EQUIPMENT_CLASSES.find(item => item.id === e.target.value);
                  if (eq) {
                    setVoltage(eq.typicalVoltageKv);
                    setDistance(eq.standardWorkingDistMm.toString());
                    setCustomGap('');
                  }
                }}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all cursor-pointer"
              >
                {EQUIPMENT_CLASSES.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">{selectedEquip.description}</p>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
                System Voltage V (kV, range: 0.208–15 kV)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.208"
                max="15.0"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
                System Grounding Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGrounding('grounded')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    grounding === 'grounded'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  Solidly Grounded (K₂=-0.113)
                </button>
                <button
                  type="button"
                  onClick={() => setGrounding('ungrounded')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    grounding === 'ungrounded'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  Ungrounded / HRG (K₂=0)
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Bolted Fault Current I_bf (kA)
                </label>
                <span className="text-xs font-bold text-slate-600">{faultCurrent} kA</span>
              </div>
              <input
                type="number"
                step="1"
                min="0.7"
                max="106"
                value={faultCurrent}
                onChange={(e) => setFaultCurrent(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
              <span className="text-[11px] text-slate-400">IEEE 1584 valid range: 0.7 kA to 106 kA</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Arc Duration / Clearing Time t (seconds)
                </label>
                <span className="text-xs font-bold text-slate-600">{clearingTime} s ({Math.round(parsedTime * 60)} cycles)</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="5.0"
                value={clearingTime}
                onChange={(e) => setClearingTime(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Working Distance D (mm)
                </label>
                <span className="text-xs font-bold text-slate-600">{distance} mm ({(parsedDist / 25.4).toFixed(0)} in)</span>
              </div>
              <input
                type="number"
                step="25"
                min="100"
                max="3000"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Conductor Gap G (mm, default: {selectedEquip.defaultGapMm} mm)
                </label>
              </div>
              <input
                type="number"
                step="1"
                placeholder={`Default: ${selectedEquip.defaultGapMm} mm`}
                value={customGap}
                onChange={(e) => setCustomGap(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setVoltage('0.48');
              setEquipId('mcc_low');
              setGrounding('grounded');
              setFaultCurrent('25');
              setClearingTime('0.12');
              setDistance('455');
              setCustomGap('');
            }}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults (480V MCC, 25kA, 0.12s)
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
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Arc Flash Hazard Metrics</h2>
                  <p className="text-xs text-slate-500 font-medium">IEEE 1584-2002 analytical output</p>
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
                results.blastWarning
                  ? 'bg-rose-50 text-rose-700 border-rose-200 ring-2 ring-rose-500/20'
                  : results.energyCal <= 8
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {results.blastWarning ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <span>{results.riskCategory}</span>
              </div>
            </div>

            {/* Primary Result Banner */}
            <div className={`rounded-2xl p-6 border ${
              results.blastWarning
                ? 'bg-rose-50/70 border-rose-200'
                : 'bg-gradient-to-br from-orange-50 to-amber-50/40 border-orange-100'
            }`}>
              <div className="text-xs font-black uppercase tracking-wider mb-2 text-orange-600">
                Estimated Incident Energy ({distance} mm / {(parsedDist / 25.4).toFixed(0)} in working distance)
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  data-testid="arc-incident-energy"
                  className={`text-4xl sm:text-5xl font-black tracking-tight ${
                    results.blastWarning ? 'text-rose-900' : 'text-orange-950'
                  }`}
                >
                  {isNaN(results.energyCal) ? '—' : results.energyCal.toFixed(2)}
                </span>
                <span className="text-xl font-bold text-orange-700">
                  cal/cm²
                </span>
                <span
                  data-testid="arc-energy-joules"
                  className="text-sm font-semibold text-slate-500"
                >
                  ({isNaN(results.energyJoules) ? '—' : results.energyJoules.toFixed(1)} J/cm²)
                </span>
              </div>
              <div className="mt-2 text-xs font-medium text-slate-700">
                {results.minArcRatingText}
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Arc Flash Boundary (AFB)
                </div>
                <div
                  data-testid="arc-flash-boundary"
                  className="text-xl font-black text-slate-900"
                >
                  {isNaN(results.afbMm) ? '—' : results.afbMm.toFixed(0)} mm
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {isNaN(results.afbIn) ? '—' : results.afbIn.toFixed(1)} in (onset of 1.2 cal/cm²)
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Arcing Current (Ia)
                </div>
                <div
                  data-testid="arc-arcing-current"
                  className="text-xl font-black text-slate-900"
                >
                  {isNaN(results.iaKa) ? '—' : results.iaKa.toFixed(2)} kA
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  85% Ia = {isNaN(results.ia85Ka) ? '—' : results.ia85Ka.toFixed(2)} kA (coordination check)
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Normalized Energy (En)
                </div>
                <div className="text-xl font-black text-slate-900">
                  {isNaN(results.enJoules) ? '—' : results.enJoules.toFixed(3)}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  J/cm² (at 0.2s, 610mm base)
                </div>
              </div>
            </div>

            {/* Protective Guidance Callout */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Engineering Assessment &amp; NFPA 70E Protective Alignment
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Under NFPA 70E Section 130.5(G) Incident Energy Analysis method, arc-rated (AR) clothing and PPE must be selected with an <strong>Arc Thermal Performance Value (ATPV)</strong> or <strong>Breakopen Threshold (E_BT)</strong> that equals or exceeds the calculated incident energy ({isNaN(results.energyCal) ? '—' : results.energyCal.toFixed(1)} cal/cm²).
              </p>
              {results.blastWarning && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                  <strong>High Incident Energy Warning:</strong> When incident energy exceeds 40 cal/cm², typical facility electrical safety standards prohibit energized work. De-energization, verification of zero energy, and lockout/tagout (LOTO) should be strictly enforced before performing any work.
                </div>
              )}
            </div>

            {/* Critical Note on 85% Arcing Current */}
            <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100 text-xs text-blue-900 space-y-1">
              <strong>IEEE 1584 Arcing Current Sensitivity Note:</strong>
              <p className="text-blue-800/90 leading-relaxed">
                Arcing currents vary in real facilities due to arc impedance. If a protective device operates near a trip boundary, a lower current can prolong the clearing time substantially. IEEE 1584 Section 9.2 mandates checking both 100% Ia ({isNaN(results.iaKa) ? '—' : results.iaKa.toFixed(2)} kA) and 85% Ia ({isNaN(results.ia85Ka) ? '—' : results.ia85Ka.toFixed(2)} kA) against the breaker TCC curve to determine the worst-case incident energy.
              </p>
            </div>

            {isOutOfIeeeRange && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
                <strong>Input Range Notice:</strong> One or more inputs fall outside the strict statistical fitting range of IEEE 1584-2002 (0.208–15 kV, 0.7–106 kA, 10–153 mm gap). Results should be treated with heightened caution.
              </div>
            )}
          </div>

          {/* Methodology & Formula Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Governing Model: IEEE 1584-2002 Empirical Equations
                </h3>
                <p className="text-xs text-slate-500 font-medium">Standardized empirical formulations</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs font-mono text-slate-800 font-medium leading-relaxed">
              <p>For V &lt; 1 kV: lg(Ia) = K + 0.662·lg(Ibf) + 0.0966·V + 0.000526·G + 0.5588·V·lg(Ibf) - 0.00304·G·lg(Ibf)</p>
              <p>For V ≥ 1 kV: lg(Ia) = 0.00402 + 0.983·lg(Ibf)</p>
              <p>Normalized: lg(En) = K1 + K2 + 1.081·lg(Ia) + 0.0011·G  [J/cm²]</p>
              <p>Actual Energy: E = 4.184 · Cf · En · (t / 0.2) · (610^x / D^x)  [J/cm²]</p>
              <p>Arc Flash Boundary: AFB = 610 · (E_cal / 1.2)^(1 / x)  [mm]</p>
              <div className="text-[11px] font-sans text-slate-500 mt-2">
                References: IEEE Std 1584-2002 Section 5; NFPA 70E Annex D. K1 = -0.792 (open) / -0.555 (box); K2 = -0.113 (grounded) / 0 (ungrounded); Cf = 1.5 (V ≤ 1kV) / 1.0 (V &gt; 1kV).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
