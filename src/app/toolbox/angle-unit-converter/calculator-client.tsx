'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, ArrowLeftRight, Download, Copy, Check } from 'lucide-react';

interface AngleUnit {
  id: string;
  name: string;
  symbol: string;
  toDegrees: number; // Factor to multiply by to get degrees
  description: string;
}

const UNITS: AngleUnit[] = [
  { id: 'deg', name: 'Degree', symbol: '°', toDegrees: 1, description: '1/360 of a full circle circle turn' },
  { id: 'rad', name: 'Radian', symbol: 'rad', toDegrees: 180 / Math.PI, description: 'SI unit where arc length equals circle radius' },
  { id: 'mrad', name: 'Milliradian', symbol: 'mrad', toDegrees: (180 / Math.PI) / 1000, description: '1/1000 of a radian (~0.0573°)' },
  { id: 'grad', name: 'Gradian / Gon', symbol: 'gon', toDegrees: 0.9, description: 'Metric surveying unit (400 gon = 360°)' },
  { id: 'arcmin', name: 'Arcminute (MOA)', symbol: '′', toDegrees: 1 / 60, description: '1/60 of a degree, precision optics/machining' },
  { id: 'arcsec', name: 'Arcsecond', symbol: '″', toDegrees: 1 / 3600, description: '1/3600 of a degree, astronomical & geodetic scale' },
  { id: 'turn', name: 'Full Turn / Revolution', symbol: 'rev', toDegrees: 360, description: 'One complete rotation (360°)' },
  { id: 'mil', name: 'NATO Mil', symbol: 'mil', toDegrees: 360 / 6400, description: 'Military compass standard (6400 mil per circle)' },
];

const PRESETS = [
  { label: '30°', value: '30', unit: 'deg' },
  { label: '45°', value: '45', unit: 'deg' },
  { label: '90°', value: '90', unit: 'deg' },
  { label: '180°', value: '180', unit: 'deg' },
  { label: 'π rad', value: Math.PI.toFixed(6), unit: 'rad' },
  { label: '2π rad', value: (2 * Math.PI).toFixed(6), unit: 'rad' },
  { label: '100 gon', value: '100', unit: 'grad' },
  { label: '1 MOA', value: '1', unit: 'arcmin' },
];

export default function AngleUnitConverterClient() {
  const [valInput, setValInput] = useState<string>('90');
  const [fromUnit, setFromUnit] = useState<string>('deg');
  const [toUnit, setToUnit] = useState<string>('rad');
  const [copied, setCopied] = useState<boolean>(false);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const parsedVal = parseFloat(valInput);
  const isValid = !isNaN(parsedVal) && isFinite(parsedVal);

  const conversion = useMemo(() => {
    if (!isValid) {
      return {
        result: NaN,
        degValue: NaN,
        allEquivalents: [],
        trig: { sin: NaN, cos: NaN, tan: NaN, quadrant: '—', turns: NaN },
      };
    }

    const fromObj = UNITS.find(u => u.id === fromUnit) || UNITS[0];
    const toObj = UNITS.find(u => u.id === toUnit) || UNITS[1];

    // Convert input to base degrees
    const degValue = parsedVal * fromObj.toDegrees;
    // Convert base degrees to target unit
    const result = degValue / toObj.toDegrees;

    // Normalize angle to [0, 360) for quadrant calculation
    const normDeg = ((degValue % 360) + 360) % 360;
    let quadrant = 'Quadrant I (0°–90°)';
    if (normDeg === 0 || normDeg === 360) quadrant = 'Positive X-Axis (0°)';
    else if (normDeg === 90) quadrant = 'Positive Y-Axis (90°)';
    else if (normDeg === 180) quadrant = 'Negative X-Axis (180°)';
    else if (normDeg === 270) quadrant = 'Negative Y-Axis (270°)';
    else if (normDeg > 0 && normDeg < 90) quadrant = 'Quadrant I';
    else if (normDeg > 90 && normDeg < 180) quadrant = 'Quadrant II';
    else if (normDeg > 180 && normDeg < 270) quadrant = 'Quadrant III';
    else quadrant = 'Quadrant IV';

    // Trigonometric functions
    const radForTrig = (normDeg * Math.PI) / 180;
    const sinVal = Math.sin(radForTrig);
    const cosVal = Math.cos(radForTrig);
    const isTanUndef = Math.abs(cosVal) < 1e-12;
    const tanVal = isTanUndef ? NaN : Math.tan(radForTrig);

    // Full equivalents
    const allEquivalents = UNITS.map(u => ({
      id: u.id,
      name: u.name,
      symbol: u.symbol,
      value: degValue / u.toDegrees,
    }));

    return {
      result,
      degValue,
      allEquivalents,
      trig: {
        sin: Math.abs(sinVal) < 1e-12 ? 0 : sinVal,
        cos: Math.abs(cosVal) < 1e-12 ? 0 : cosVal,
        tan: isTanUndef ? NaN : (Math.abs(tanVal) < 1e-12 ? 0 : tanVal),
        quadrant,
        turns: degValue / 360,
      },
    };
  }, [fromUnit, toUnit, isValid, parsedVal]);

  const formatSmart = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (n === 0) return '0';
    const abs = Math.abs(n);
    if (abs >= 1e6 || (abs < 1e-4 && abs > 0)) {
      return n.toExponential(6);
    }
    if (abs >= 1000) return n.toFixed(2);
    if (abs >= 1) return n.toFixed(6).replace(/\.?0+$/, '');
    return n.toFixed(8).replace(/\.?0+$/, '');
  };

  const handleCopy = () => {
    if (!isValid) return;
    const fromObj = UNITS.find(u => u.id === fromUnit);
    const toObj = UNITS.find(u => u.id === toUnit);
    const text = `${valInput} ${fromObj?.symbol || fromUnit} = ${formatSmart(conversion.result)} ${toObj?.symbol || toUnit}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    if (!isValid) return;
    const fromObj = UNITS.find(u => u.id === fromUnit);
    const toObj = UNITS.find(u => u.id === toUnit);
    const rows = [
      ['CADGuide Toolbox - Angle Unit Conversion Report'],
      ['Parameter', 'Value', 'Unit'],
      ['Input Value', valInput, fromObj?.name || fromUnit],
      ['Converted Value', conversion.result.toString(), toObj?.name || toUnit],
      ['Base Degrees', conversion.degValue.toString(), 'deg (°)'],
      ['Sine', isNaN(conversion.trig.sin) ? '—' : conversion.trig.sin.toFixed(6), ''],
      ['Cosine', isNaN(conversion.trig.cos) ? '—' : conversion.trig.cos.toFixed(6), ''],
      ['Tangent', isNaN(conversion.trig.tan) ? 'Undefined (±∞)' : conversion.trig.tan.toFixed(6), ''],
      ['Quadrant', conversion.trig.quadrant, ''],
      [],
      ['All Unit Equivalents'],
      ['Unit Name', 'Symbol', 'Equivalent Value'],
      ...conversion.allEquivalents.map(eq => [eq.name, eq.symbol, eq.value.toString()]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `angle-conversion-${valInput}-${fromUnit}-to-${toUnit}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentFrom = UNITS.find(u => u.id === fromUnit) || UNITS[0];
  const currentTo = UNITS.find(u => u.id === toUnit) || UNITS[1];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Angle Input</h2>
              <p className="text-xs text-slate-500 font-medium">Select source & target units</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              Value to Convert
            </label>
            <input
              type="number"
              step="any"
              value={valInput}
              onChange={(e) => setValInput(e.target.value)}
              placeholder="e.g. 90"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              From Unit
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
            >
              {UNITS.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={swapUnits}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-black transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Swap Direction
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              To Unit
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
            >
              {UNITS.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              Quick Angle Presets
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setValInput(p.value);
                    setFromUnit(p.unit);
                  }}
                  className="py-2 px-2 text-xs font-bold rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setValInput('90');
              setFromUnit('deg');
              setToUnit('rad');
            }}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults (90° → rad)
          </button>
        </div>

        {/* Right Column: Results & Equivalents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Conversion Result</h2>
                  <p className="text-xs text-slate-500 font-medium">High-precision geometric conversion</p>
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
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={exportCSV}
                  disabled={!isValid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors disabled:opacity-40"
                  title="Export CSV report"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              </div>
            </div>

            {/* Primary Banner */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50/40 rounded-2xl p-6 border border-purple-100">
              <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-2">
                {valInput || '0'} {currentFrom.name} ({currentFrom.symbol}) =
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl sm:text-5xl font-black text-purple-900 tracking-tight">
                  {formatSmart(conversion.result)}
                </span>
                <span className="text-xl font-bold text-purple-700">
                  {currentTo.name} ({currentTo.symbol})
                </span>
              </div>
              <div className="mt-2 text-xs text-purple-700/80 font-medium">
                {currentTo.description}
              </div>
            </div>

            {/* Secondary Metrics / Geometric Properties */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Base Degrees</div>
                <div className="text-xl font-black text-slate-900">
                  {formatSmart(conversion.degValue)}°
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sin (θ)</div>
                <div className="text-xl font-black text-slate-900">
                  {isNaN(conversion.trig.sin) ? '—' : conversion.trig.sin.toFixed(4)}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cos (θ)</div>
                <div className="text-xl font-black text-slate-900">
                  {isNaN(conversion.trig.cos) ? '—' : conversion.trig.cos.toFixed(4)}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tan (θ)</div>
                <div className="text-xl font-black text-slate-900">
                  {isNaN(conversion.trig.tan) ? '±∞ (Undef)' : conversion.trig.tan.toFixed(4)}
                </div>
              </div>
            </div>

            {/* All Units Equivalence Grid */}
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">
                All Units Equivalence Table
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {conversion.allEquivalents.map((eq) => {
                  const isSelected = eq.id === toUnit;
                  return (
                    <div
                      key={eq.id}
                      onClick={() => setToUnit(eq.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50/60 border-purple-200 ring-2 ring-purple-600/10'
                          : 'bg-slate-50 border-slate-100 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-600">{eq.name}</span>
                        <span className="text-xs font-mono font-bold text-slate-400">{eq.symbol}</span>
                      </div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        {formatSmart(eq.value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Engineering Note */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
              <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">Precision Standard: </span>
                Radians utilize high-precision <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">180 / π ≈ 57.295779513°</code>. NATO military mil standard defines 6,400 mils per 360° (approx. 1 mrad per mil for artillery/optical targeting).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
