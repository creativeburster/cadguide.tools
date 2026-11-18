'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Gauge, RotateCcw, Copy, Check, Download } from 'lucide-react';

interface PresetCase {
  id: string;
  label: string;
  d: string;
  z: string;
  vc: string;
  fz: string;
  ae: string;
  ap: string;
  len: string;
  kc: string;
}

const PRESETS: PresetCase[] = [
  {
    id: 'al-roughing',
    label: 'Aluminum Roughing (D10·3F·Vc500)',
    d: '10',
    z: '3',
    vc: '500',
    fz: '0.10',
    ae: '8',
    ap: '2',
    len: '100',
    kc: '800',
  },
  {
    id: 'steel-pocket',
    label: 'Alloy Steel Pocket (D12·4F·Vc160)',
    d: '12',
    z: '4',
    vc: '160',
    fz: '0.06',
    ae: '6',
    ap: '1.5',
    len: '150',
    kc: '2100',
  },
  {
    id: 'ti-finishing',
    label: 'Titanium Light Pass (D8·4F·Vc60)',
    d: '8',
    z: '4',
    vc: '60',
    fz: '0.03',
    ae: '1.5',
    ap: '4',
    len: '80',
    kc: '1600',
  },
];

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parsePosInt(raw: string): number | null {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

function fmt(val: number | null, dec: number): string {
  if (val === null || !Number.isFinite(val)) return '—';
  return val.toFixed(dec);
}

export default function MillingMRRClient() {
  const [dStr, setDStr] = useState(PRESETS[0].d);
  const [zStr, setZStr] = useState(PRESETS[0].z);
  const [vcStr, setVcStr] = useState(PRESETS[0].vc);
  const [fzStr, setFzStr] = useState(PRESETS[0].fz);
  const [aeStr, setAeStr] = useState(PRESETS[0].ae);
  const [apStr, setApStr] = useState(PRESETS[0].ap);
  const [lenStr, setLenStr] = useState(PRESETS[0].len);
  const [kcStr, setKcStr] = useState(PRESETS[0].kc);
  const [copied, setCopied] = useState(false);

  const calc = useMemo(() => {
    const d = parsePos(dStr);
    const z = parsePosInt(zStr);
    const vc = parsePos(vcStr);
    const fz = parsePos(fzStr);
    const ae = parsePos(aeStr);
    const ap = parsePos(apStr);
    const len = parsePos(lenStr);
    const kc = parsePos(kcStr);

    if (
      d === null ||
      z === null ||
      vc === null ||
      fz === null ||
      ae === null ||
      ap === null ||
      len === null ||
      kc === null ||
      ae > d
    ) {
      return { valid: false as const, aeExceedsD: d !== null && ae !== null && ae > d };
    }

    // Standard CNC milling kinematics:
    // n = (1000 * Vc) / (pi * D)  [RPM]
    // vf = n * fz * Z             [mm/min]
    // MRR = (ae * ap * vf) / 1000 [cm^3/min]
    // tc = (60 * L) / vf          [s]
    // Pc = (ae * ap * vf * kc) / 60e6 [kW]
    const rpm = (1000 * vc) / (Math.PI * d);
    const feedRate = rpm * fz * z;
    const mrr = (ae * ap * feedRate) / 1000;
    const cutTime = (60 * len) / feedRate;
    const powerKw = (ae * ap * feedRate * kc) / 60e6;
    const radialEngagePct = (ae / d) * 100;

    return {
      valid: true as const,
      aeExceedsD: false,
      rpm,
      feedRate,
      mrr,
      cutTime,
      powerKw,
      radialEngagePct,
    };
  }, [dStr, zStr, vcStr, fzStr, aeStr, apStr, lenStr, kcStr]);

  const applyPreset = (p: PresetCase) => {
    setDStr(p.d);
    setZStr(p.z);
    setVcStr(p.vc);
    setFzStr(p.fz);
    setAeStr(p.ae);
    setApStr(p.ap);
    setLenStr(p.len);
    setKcStr(p.kc);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!calc.valid) return;
    const text = [
      'CNC Milling MRR & Net Cutting Power Summary',
      `Spindle Speed n = ${calc.rpm.toFixed(1)} RPM`,
      `Table Feed vf = ${calc.feedRate.toFixed(1)} mm/min`,
      `Material Removal Rate Q = ${calc.mrr.toFixed(2)} cm3/min`,
      `Cutting Time tc = ${calc.cutTime.toFixed(2)} s`,
      `Net Cutting Power Pc = ${calc.powerKw.toFixed(3)} kW (kc = ${kcStr.trim()} N/mm2)`,
    ].join('\n');
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!calc.valid) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['cutter_diameter_d', dStr.trim(), 'mm'],
      ['flutes_z', zStr.trim(), 'count'],
      ['cutting_speed_vc', vcStr.trim(), 'm/min'],
      ['feed_per_tooth_fz', fzStr.trim(), 'mm/tooth'],
      ['radial_width_ae', aeStr.trim(), 'mm'],
      ['axial_depth_ap', apStr.trim(), 'mm'],
      ['cut_length_l', lenStr.trim(), 'mm'],
      ['assumed_specific_cutting_force_kc', kcStr.trim(), 'N/mm2'],
      ['spindle_speed_rpm', calc.rpm.toFixed(4), 'RPM'],
      ['feed_rate_vf', calc.feedRate.toFixed(4), 'mm/min'],
      ['mrr_q', calc.mrr.toFixed(4), 'cm3/min'],
      ['cutting_time_tc', calc.cutTime.toFixed(4), 's'],
      ['net_cutting_power_pc', calc.powerKw.toFixed(5), 'kW'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'milling-mrr-parameters.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fields = [
    { id: 'd', label: 'Cutter Diameter D (mm)', val: dStr, set: setDStr, mode: 'decimal' as const },
    { id: 'z', label: 'Number of Flutes Z (int)', val: zStr, set: setZStr, mode: 'numeric' as const },
    { id: 'vc', label: 'Cutting Speed Vc (m/min)', val: vcStr, set: setVcStr, mode: 'decimal' as const },
    { id: 'fz', label: 'Chip Load fz (mm/tooth)', val: fzStr, set: setFzStr, mode: 'decimal' as const },
    { id: 'ae', label: 'Radial Width of Cut ae (mm)', val: aeStr, set: setAeStr, mode: 'decimal' as const },
    { id: 'ap', label: 'Axial Depth of Cut ap (mm)', val: apStr, set: setApStr, mode: 'decimal' as const },
    { id: 'len', label: 'Cut Path Length L (mm)', val: lenStr, set: setLenStr, mode: 'decimal' as const },
    { id: 'kc', label: 'Assumed Specific Cutting Force kc (N/mm²)', val: kcStr, set: setKcStr, mode: 'decimal' as const },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Milling Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">All parameters &gt; 0 (ae ≤ D)</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-pink-700 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="space-y-3.5">
            {fields.map((f) => (
              <div key={f.id}>
                <label htmlFor={`mill-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  {f.label}
                </label>
                <input
                  id={`mill-${f.id}`}
                  type="text"
                  inputMode={f.mode}
                  data-testid={`input-${f.id}`}
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={() => applyPreset(PRESETS[0])}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Gauge className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Machining Kinematics &amp; Power</h2>
              </div>
              <span
                data-testid="badge-status"
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  calc.valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {calc.valid ? `ENGAGEMENT ${calc.radialEngagePct.toFixed(1)}%` : calc.aeExceedsD ? 'INVALID: ae > D' : 'INVALID INPUT'}
              </span>
            </div>

            {!calc.valid && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-semibold text-amber-800">
                {calc.aeExceedsD
                  ? 'Radial width of cut ae cannot exceed cutter diameter D.'
                  : 'Enter valid positive numbers (> 0) for all parameters and a positive integer for flute count Z.'}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
                <div className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Material Removal Rate (Q)</div>
                <div className="text-3xl font-black text-pink-800">
                  <span data-testid="result-mrr">{fmt(calc.valid ? calc.mrr : null, 4)}</span>
                  <span className="text-base font-bold text-pink-500 ml-1.5">cm³/min</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Table Feed Rate (vf)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-feed">{fmt(calc.valid ? calc.feedRate : null, 4)}</span>
                  <span className="text-base font-bold text-blue-500 ml-1.5">mm/min</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Spindle Speed (n)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-rpm">{fmt(calc.valid ? calc.rpm : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">RPM</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Cutting Time (tc)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-time">{fmt(calc.valid ? calc.cutTime : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">s</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Net Cutting Power (Pc)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-power">{fmt(calc.valid ? calc.powerKw : null, 5)}</span>
                  <span className="text-xs text-slate-500 ml-1">kW</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!calc.valid}
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                data-testid="btn-download"
                disabled={!calc.valid}
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info className="w-4 h-4 text-slate-500" />
                <span>Governing Equations &amp; Cutting Force Assumption</span>
              </div>
              <p className="font-mono">
                n = 1000·Vc / (π·D) | vf = n·fz·Z | Q = ae·ap·vf / 1000 | tc = 60·L / vf | Pc = (ae·ap·vf·kc) / 60×10⁶
              </p>
              <p>
                Net power Pc excludes spindle drive mechanical efficiency and varies significantly with cutter wear,
                coolant, and workpiece alloy. Adjust the editable specific cutting force kc assumption to match your
                tooling manufacturer catalog.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
