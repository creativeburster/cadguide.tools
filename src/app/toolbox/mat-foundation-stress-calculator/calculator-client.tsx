'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  Settings,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Download,
} from 'lucide-react';

interface PresetCase {
  id: string;
  label: string;
  p: string;
  l: string;
  w: string;
  t: string;
  gamma: string;
  qa: string;
}

const PRESETS: PresetCase[] = [
  {
    id: 'default',
    label: 'Commercial Mat (24000 kN · 22×16 m)',
    p: '24000',
    l: '22',
    w: '16',
    t: '1.2',
    gamma: '24.5',
    qa: '120',
  },
  {
    id: 'soft-clay',
    label: 'Soft Soil Overload (36000 kN · 20×15 m)',
    p: '36000',
    l: '20',
    w: '15',
    t: '1.5',
    gamma: '24.0',
    qa: '130',
  },
  {
    id: 'equip-pad',
    label: 'Equipment Raft (4500 kN · 8×6 m)',
    p: '4500',
    l: '8',
    w: '6',
    t: '0.8',
    gamma: '24.5',
    qa: '150',
  },
];

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const trimmed = raw.trim();
  if (!POS_RE.test(trimmed)) return null;
  const val = Number(trimmed);
  return Number.isFinite(val) && val > 0 ? val : null;
}

function fmt(val: number | null, dec: number): string {
  if (val === null || !Number.isFinite(val)) return '—';
  return val.toFixed(dec);
}

export default function CalculatorClient() {
  const [pStr, setPStr] = useState('24000');
  const [lStr, setLStr] = useState('22');
  const [wStr, setWStr] = useState('16');
  const [tStr, setTStr] = useState('1.2');
  const [gammaStr, setGammaStr] = useState('24.5');
  const [qaStr, setQaStr] = useState('120');
  const [copied, setCopied] = useState(false);

  const p = parsePos(pStr);
  const l = parsePos(lStr);
  const w = parsePos(wStr);
  const t = parsePos(tStr);
  const gamma = parsePos(gammaStr);
  const qa = parsePos(qaStr);

  const valid =
    p !== null &&
    l !== null &&
    w !== null &&
    t !== null &&
    gamma !== null &&
    qa !== null;

  let area: number | null = null;
  let selfWeight: number | null = null;
  let totalLoad: number | null = null;
  let qNet: number | null = null;
  let qGross: number | null = null;
  let utilization: number | null = null;
  let pass = false;

  if (valid && p !== null && l !== null && w !== null && t !== null && gamma !== null && qa !== null) {
    area = l * w;
    selfWeight = area * t * gamma;
    totalLoad = p + selfWeight;
    qNet = p / area;
    qGross = totalLoad / area;
    utilization = (qGross / qa) * 100;
    pass = qGross <= qa;
  }

  const applyPreset = (preset: PresetCase) => {
    setPStr(preset.p);
    setLStr(preset.l);
    setWStr(preset.w);
    setTStr(preset.t);
    setGammaStr(preset.gamma);
    setQaStr(preset.qa);
    setCopied(false);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const handleCopy = async () => {
    if (!valid || qGross === null || qNet === null || area === null || selfWeight === null || totalLoad === null || utilization === null) {
      return;
    }
    const summary = [
      `Mat Foundation Contact Pressure Summary`,
      `Gross Contact Pressure: ${qGross.toFixed(2)} kPa (Allowable: ${qaStr} kPa -> ${pass ? 'PASS' : 'FAIL'})`,
      `Net Superstructure Pressure: ${qNet.toFixed(2)} kPa`,
      `Footprint Area: ${area.toFixed(2)} m2`,
      `Slab Self-Weight: ${selfWeight.toFixed(2)} kN (gamma_c = ${gammaStr} kN/m3)`,
      `Total Vertical Load: ${totalLoad.toFixed(2)} kN`,
      `Bearing Utilization: ${utilization.toFixed(2)} %`,
    ].join('\n');
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
        return;
      }
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!valid || area === null || selfWeight === null || totalLoad === null || qNet === null || qGross === null || utilization === null) {
      return;
    }
    const rows = [
      ['parameter', 'value', 'unit'],
      ['superstructure_load_p', pStr.trim(), 'kN'],
      ['mat_length_l', lStr.trim(), 'm'],
      ['mat_width_w', wStr.trim(), 'm'],
      ['slab_thickness_t', tStr.trim(), 'm'],
      ['concrete_unit_weight_gamma', gammaStr.trim(), 'kN/m3'],
      ['allowable_bearing_pressure_qa', qaStr.trim(), 'kPa'],
      ['footprint_area', area.toFixed(4), 'm2'],
      ['slab_self_weight', selfWeight.toFixed(4), 'kN'],
      ['total_vertical_load', totalLoad.toFixed(4), 'kN'],
      ['net_superstructure_pressure', qNet.toFixed(4), 'kPa'],
      ['gross_contact_pressure', qGross.toFixed(4), 'kPa'],
      ['bearing_utilization', utilization.toFixed(4), 'pct'],
      ['bearing_check_status', pass ? 'PASS' : 'FAIL', 'status'],
    ];
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mat-foundation-contact-pressure.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const inputFields = [
    {
      id: 'load',
      label: 'Total Superstructure Column Load P (kN)',
      value: pStr,
      setter: setPStr,
      hint: 'Positive factored or service vertical load above mat',
    },
    {
      id: 'length',
      label: 'Mat Foundation Length L (m)',
      value: lStr,
      setter: setLStr,
      hint: 'Plan length along longitudinal axis (> 0)',
    },
    {
      id: 'width',
      label: 'Mat Foundation Width W (m)',
      value: wStr,
      setter: setWStr,
      hint: 'Plan width along transverse axis (> 0)',
    },
    {
      id: 'thickness',
      label: 'Concrete Slab Thickness t (m)',
      value: tStr,
      setter: setTStr,
      hint: 'Uniform slab thickness for self-weight (> 0)',
    },
    {
      id: 'gamma',
      label: 'Assumed Concrete Unit Weight γc (kN/m³)',
      value: gammaStr,
      setter: setGammaStr,
      hint: 'Editable reinforced concrete unit weight assumption (default 24.5 kN/m³)',
    },
    {
      id: 'qa',
      label: 'Allowable Gross Soil Bearing Capacity qa (kPa)',
      value: qaStr,
      setter: setQaStr,
      hint: 'Geotechnical allowable gross bearing pressure (> 0)',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Foundation Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">All parameters required (&gt; 0)</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                data-testid={`preset-${preset.id}`}
                onClick={() => applyPreset(preset)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {inputFields.map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={`mat-${field.id}`}
                  className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5"
                >
                  {field.label}
                </label>
                <input
                  id={`mat-${field.id}`}
                  type="text"
                  inputMode="decimal"
                  data-testid={`input-${field.id}`}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">{field.hint}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Right Column: Results & Engineering Assumptions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Contact Pressure</h2>
              </div>
              <div
                data-testid="badge-status"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black tracking-wide uppercase border ${
                  !valid
                    ? 'bg-slate-50 text-slate-600 border-slate-200'
                    : pass
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {valid ? (
                  pass ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  )
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>
                  {!valid
                    ? 'AWAITING VALID POSITIVE INPUTS'
                    : pass
                    ? 'PASS: WITHIN ALLOWABLE BEARING'
                    : 'FAIL: EXCEEDS ALLOWABLE BEARING'}
                </span>
              </div>
            </div>

            {!valid && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-semibold text-amber-800">
                Enter valid positive numeric values (&gt; 0) for load, dimensions, unit weight, and allowable bearing capacity.
              </div>
            )}

            {/* Primary Result Banner */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                Uniform Gross Soil Contact Pressure (q_gross)
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  data-testid="result-contact-pressure"
                  className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight"
                >
                  {fmt(qGross, 2)}
                </span>
                <span className="text-lg font-bold text-blue-600">kPa</span>
              </div>
            </div>

            {/* Secondary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Net Load Pressure (q_net)
                </div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-net-pressure">{fmt(qNet, 2)}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1.5">kPa</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Mat Footprint Area (A)
                </div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-area">{fmt(area, 2)}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1.5">m²</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Slab Self-Weight (W_slab)
                </div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-self-weight">{fmt(selfWeight, 2)}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1.5">kN</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Total Gross Load (P + W_slab)
                </div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-total-load">{fmt(totalLoad, 2)}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1.5">kN</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Bearing Utilization
                </div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-utilization">{fmt(utilization, 2)}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1.5">%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                data-testid="btn-copy"
                onClick={handleCopy}
                disabled={!valid}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                data-testid="btn-download"
                onClick={handleDownloadCsv}
                disabled={!valid}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV Report</span>
              </button>
            </div>
          </div>

          {/* Engineering Methodology & Assumptions Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Equilibrium Equations &amp; Engineering Assumptions
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Uniform rigid concentric bearing contact model
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs sm:text-sm text-slate-700 font-mono leading-relaxed">
              <p>A = L × W</p>
              <p>W_slab = γc × L × W × t</p>
              <p>q_net = P / A</p>
              <p>q_gross = (P + W_slab) / A ≤ qa</p>
            </div>

            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5 leading-relaxed">
              <li>
                <strong>Rigid Concentric Mat Assumption:</strong> Assumes resultant vertical load acts through the
                mat centroid with uniform soil reaction (zero biaxial eccentricity moments Mx, My).
              </li>
              <li>
                <strong>Concrete Unit Weight Assumption (γc):</strong> Normal-weight plain concrete density typically
                ranges around{' '}
                <a
                  href="https://www.engineeringtoolbox.com/concrete-properties-d_1223.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  2240–2400 kg/m³ (Engineering ToolBox)
                </a>
                . The editable default of 24.5 kN/m³ is a common engineering assumption
                for reinforced concrete; adjust γc per project reinforcement ratio and local design specifications.
              </li>
              <li>
                <strong>Scope Limitation:</strong> Evaluates uniform vertical bearing equilibrium only. Slab flexural
                design, shear reinforcement, and subgrade deformation require dedicated structural and geotechnical
                analysis software.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
