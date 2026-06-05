'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Info, Download, HelpCircle, Layers, Copy, Check, FileText } from 'lucide-react';

interface ThreadDef {
  id: string;
  label: string;
  nominalDiameter: number; // mm for metric, inches for imperial
  pitchOrTpi: number;      // mm pitch for metric, TPI for imperial
  system: 'metric' | 'imperial';
}

const THREAD_DATA: Record<string, ThreadDef[]> = {
  'metric-coarse': [
    { id: 'M3x0.5', label: 'M3 × 0.5 (Coarse)', nominalDiameter: 3.0, pitchOrTpi: 0.5, system: 'metric' },
    { id: 'M4x0.7', label: 'M4 × 0.7 (Coarse)', nominalDiameter: 4.0, pitchOrTpi: 0.7, system: 'metric' },
    { id: 'M5x0.8', label: 'M5 × 0.8 (Coarse)', nominalDiameter: 5.0, pitchOrTpi: 0.8, system: 'metric' },
    { id: 'M6x1.0', label: 'M6 × 1.0 (Coarse)', nominalDiameter: 6.0, pitchOrTpi: 1.0, system: 'metric' },
    { id: 'M8x1.25', label: 'M8 × 1.25 (Coarse)', nominalDiameter: 8.0, pitchOrTpi: 1.25, system: 'metric' },
    { id: 'M10x1.5', label: 'M10 × 1.5 (Coarse)', nominalDiameter: 10.0, pitchOrTpi: 1.5, system: 'metric' },
    { id: 'M12x1.75', label: 'M12 × 1.75 (Coarse)', nominalDiameter: 12.0, pitchOrTpi: 1.75, system: 'metric' },
    { id: 'M14x2.0', label: 'M14 × 2.0 (Coarse)', nominalDiameter: 14.0, pitchOrTpi: 2.0, system: 'metric' },
    { id: 'M16x2.0', label: 'M16 × 2.0 (Coarse)', nominalDiameter: 16.0, pitchOrTpi: 2.0, system: 'metric' },
    { id: 'M20x2.5', label: 'M20 × 2.5 (Coarse)', nominalDiameter: 20.0, pitchOrTpi: 2.5, system: 'metric' },
  ],
  'metric-fine': [
    { id: 'M8x1.0', label: 'M8 × 1.0 (Fine)', nominalDiameter: 8.0, pitchOrTpi: 1.0, system: 'metric' },
    { id: 'M10x1.0', label: 'M10 × 1.0 (Fine)', nominalDiameter: 10.0, pitchOrTpi: 1.0, system: 'metric' },
    { id: 'M10x1.25', label: 'M10 × 1.25 (Fine)', nominalDiameter: 10.0, pitchOrTpi: 1.25, system: 'metric' },
    { id: 'M12x1.25', label: 'M12 × 1.25 (Fine)', nominalDiameter: 12.0, pitchOrTpi: 1.25, system: 'metric' },
    { id: 'M12x1.5', label: 'M12 × 1.5 (Fine)', nominalDiameter: 12.0, pitchOrTpi: 1.5, system: 'metric' },
    { id: 'M14x1.5', label: 'M14 × 1.5 (Fine)', nominalDiameter: 14.0, pitchOrTpi: 1.5, system: 'metric' },
    { id: 'M16x1.5', label: 'M16 × 1.5 (Fine)', nominalDiameter: 16.0, pitchOrTpi: 1.5, system: 'metric' },
    { id: 'M20x1.5', label: 'M20 × 1.5 (Fine)', nominalDiameter: 20.0, pitchOrTpi: 1.5, system: 'metric' },
  ],
  'unc': [
    { id: '4-40', label: '#4 - 40 UNC', nominalDiameter: 0.1120, pitchOrTpi: 40, system: 'imperial' },
    { id: '6-32', label: '#6 - 32 UNC', nominalDiameter: 0.1380, pitchOrTpi: 32, system: 'imperial' },
    { id: '8-32', label: '#8 - 32 UNC', nominalDiameter: 0.1640, pitchOrTpi: 32, system: 'imperial' },
    { id: '10-24', label: '#10 - 24 UNC', nominalDiameter: 0.1900, pitchOrTpi: 24, system: 'imperial' },
    { id: '12-24', label: '#12 - 24 UNC', nominalDiameter: 0.2160, pitchOrTpi: 24, system: 'imperial' },
    { id: '1/4-20', label: '1/4" - 20 UNC', nominalDiameter: 0.2500, pitchOrTpi: 20, system: 'imperial' },
    { id: '5/16-18', label: '5/16" - 18 UNC', nominalDiameter: 0.3125, pitchOrTpi: 18, system: 'imperial' },
    { id: '3/8-16', label: '3/8" - 16 UNC', nominalDiameter: 0.3750, pitchOrTpi: 16, system: 'imperial' },
    { id: '1/2-13', label: '1/2" - 13 UNC', nominalDiameter: 0.5000, pitchOrTpi: 13, system: 'imperial' },
    { id: '5/8-11', label: '5/8" - 11 UNC', nominalDiameter: 0.6250, pitchOrTpi: 11, system: 'imperial' },
    { id: '3/4-10', label: '3/4" - 10 UNC', nominalDiameter: 0.7500, pitchOrTpi: 10, system: 'imperial' },
  ],
  'unf': [
    { id: '10-32', label: '#10 - 32 UNF', nominalDiameter: 0.1900, pitchOrTpi: 32, system: 'imperial' },
    { id: '1/4-28', label: '1/4" - 28 UNF', nominalDiameter: 0.2500, pitchOrTpi: 28, system: 'imperial' },
    { id: '5/16-24', label: '5/16" - 24 UNF', nominalDiameter: 0.3125, pitchOrTpi: 24, system: 'imperial' },
    { id: '3/8-24', label: '3/8" - 24 UNF', nominalDiameter: 0.3750, pitchOrTpi: 24, system: 'imperial' },
    { id: '1/2-20', label: '1/2" - 20 UNF', nominalDiameter: 0.5000, pitchOrTpi: 20, system: 'imperial' },
    { id: '5/8-18', label: '5/8" - 18 UNF', nominalDiameter: 0.6250, pitchOrTpi: 18, system: 'imperial' },
    { id: '3/4-16', label: '3/4" - 16 UNF', nominalDiameter: 0.7500, pitchOrTpi: 16, system: 'imperial' },
  ],
};

interface StandardDrill {
  name: string;
  diameterMm: number;
}

// A collection of standard drill bits (metric sizes, fractional imperial, number, letter)
const STANDARD_DRILLS: StandardDrill[] = [
  // Metric standards
  { name: '1.0 mm', diameterMm: 1.0 },
  { name: '1.5 mm', diameterMm: 1.5 },
  { name: '2.0 mm', diameterMm: 2.0 },
  { name: '2.1 mm', diameterMm: 2.1 },
  { name: '2.2 mm', diameterMm: 2.2 },
  { name: '2.3 mm', diameterMm: 2.3 },
  { name: '#43 (2.26mm)', diameterMm: 2.26 },
  { name: '#42 (2.38mm)', diameterMm: 2.38 },
  { name: '2.5 mm', diameterMm: 2.5 },
  { name: '#37 (2.64mm)', diameterMm: 2.64 },
  { name: '#36 (2.71mm)', diameterMm: 2.71 },
  { name: '2.8 mm', diameterMm: 2.8 },
  { name: '#33 (2.87mm)', diameterMm: 2.87 },
  { name: '#31 (3.05mm)', diameterMm: 3.05 },
  { name: '3.1 mm', diameterMm: 3.1 },
  { name: '3.2 mm', diameterMm: 3.2 },
  { name: '3.3 mm', diameterMm: 3.3 },
  { name: '3.4 mm', diameterMm: 3.4 },
  { name: '3.5 mm', diameterMm: 3.5 },
  { name: '#29 (3.45mm)', diameterMm: 3.45 },
  { name: '#28 (3.57mm)', diameterMm: 3.57 },
  { name: '3.7 mm', diameterMm: 3.7 },
  { name: '3.8 mm', diameterMm: 3.8 },
  { name: '4.0 mm', diameterMm: 4.0 },
  { name: '4.1 mm', diameterMm: 4.1 },
  { name: '4.2 mm', diameterMm: 4.2 },
  { name: '#19 (4.22mm)', diameterMm: 4.22 },
  { name: '#16 (4.50mm)', diameterMm: 4.5 },
  { name: '4.7 mm', diameterMm: 4.7 },
  { name: '3/16" (4.76mm)', diameterMm: 4.76 },
  { name: '5.0 mm', diameterMm: 5.0 },
  { name: '#7 (5.11mm)', diameterMm: 5.11 },
  { name: '5.2 mm', diameterMm: 5.2 },
  { name: '#3 (5.41mm)', diameterMm: 5.41 },
  { name: '5.5 mm', diameterMm: 5.5 },
  { name: '7/32" (5.56mm)', diameterMm: 5.56 },
  { name: '5.8 mm', diameterMm: 5.8 },
  { name: '6.0 mm', diameterMm: 6.0 },
  { name: 'Letter B (6.05mm)', diameterMm: 6.05 },
  { name: '6.2 mm', diameterMm: 6.2 },
  { name: '1/4" (6.35mm)', diameterMm: 6.35 },
  { name: '6.5 mm', diameterMm: 6.5 },
  { name: 'Letter H (6.76mm)', diameterMm: 6.76 },
  { name: '6.8 mm', diameterMm: 6.8 },
  { name: '7.0 mm', diameterMm: 7.0 },
  { name: 'Letter J (7.04mm)', diameterMm: 7.04 },
  { name: '7.2 mm', diameterMm: 7.2 },
  { name: '7.5 mm', diameterMm: 7.5 },
  { name: '5/16" (7.94mm)', diameterMm: 7.94 },
  { name: '8.0 mm', diameterMm: 8.0 },
  { name: '8.2 mm', diameterMm: 8.2 },
  { name: '21/64" (8.33mm)', diameterMm: 8.33 },
  { name: '8.5 mm', diameterMm: 8.5 },
  { name: 'Letter Q (8.43mm)', diameterMm: 8.43 },
  { name: '8.8 mm', diameterMm: 8.8 },
  { name: '9.0 mm', diameterMm: 9.0 },
  { name: 'Letter T (9.09mm)', diameterMm: 9.09 },
  { name: '9.3 mm', diameterMm: 9.3 },
  { name: '3/8" (9.53mm)', diameterMm: 9.53 },
  { name: '9.8 mm', diameterMm: 9.8 },
  { name: '10.0 mm', diameterMm: 10.0 },
  { name: '10.2 mm', diameterMm: 10.2 },
  { name: 'Letter Y (10.26mm)', diameterMm: 10.26 },
  { name: '10.5 mm', diameterMm: 10.5 },
  { name: '27/64" (10.72mm)', diameterMm: 10.72 },
  { name: '11.0 mm', diameterMm: 11.0 },
  { name: '7/16" (11.11mm)', diameterMm: 11.11 },
  { name: '11.2 mm', diameterMm: 11.2 },
  { name: '11.5 mm', diameterMm: 11.5 },
  { name: '11.8 mm', diameterMm: 11.8 },
  { name: '12.0 mm', diameterMm: 12.0 },
  { name: '12.2 mm', diameterMm: 12.2 },
  { name: '12.5 mm', diameterMm: 12.5 },
  { name: '13.0 mm', diameterMm: 13.0 },
  { name: '13.5 mm', diameterMm: 13.5 },
  { name: '14.0 mm', diameterMm: 14.0 },
  { name: '14.5 mm', diameterMm: 14.5 },
  { name: '15.0 mm', diameterMm: 15.0 },
  { name: '15.5 mm', diameterMm: 15.5 },
  { name: '16.0 mm', diameterMm: 16.0 },
  { name: '16.5 mm', diameterMm: 16.5 },
  { name: '17.0 mm', diameterMm: 17.0 },
  { name: '17.5 mm', diameterMm: 17.5 },
  { name: '18.0 mm', diameterMm: 18.0 },
  { name: '18.5 mm', diameterMm: 18.5 },
  { name: '19.0 mm', diameterMm: 19.0 },
  { name: '19.5 mm', diameterMm: 19.5 },
  { name: '20.0 mm', diameterMm: 20.0 },
];

export default function ThreadDrillCalculatorClient() {
  const [threadType, setThreadType] = useState<string>('metric-coarse');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('M10x1.5');
  const [engagement, setEngagement] = useState<number>(75); // Target thread engagement percentage
  const [material, setMaterial] = useState<string>('Steel');

  // Trigger material guidelines
  const handleApplyMaterial = (mat: string) => {
    setMaterial(mat);
    if (mat === 'Steel') setEngagement(65);
    if (mat === 'Stainless Steel' || mat === 'Titanium') setEngagement(55);
    if (mat === 'Aluminum' || mat === 'Copper/Brass') setEngagement(75);
  };

  // Find active thread definition
  const activeThread = useMemo(() => {
    const list = THREAD_DATA[threadType] || [];
    return list.find((t) => t.id === selectedThreadId) || list[0] || THREAD_DATA['metric-coarse'][5];
  }, [threadType, selectedThreadId]);

  // Adjust thread list if type changes
  const handleTypeChange = (type: string) => {
    setThreadType(type);
    const list = THREAD_DATA[type] || [];
    if (list.length > 0) {
      setSelectedThreadId(list[0].id);
    }
  };

  // Thread Calculations
  const results = useMemo(() => {
    if (!activeThread) return null;

    const D = activeThread.nominalDiameter; // in mm or inches
    const P = activeThread.pitchOrTpi;      // pitch (mm) or TPI

    let nominalMm = D;
    let pitchMm = P;
    let pitchLabel = `${P} mm`;

    if (activeThread.system === 'imperial') {
      nominalMm = D * 25.4;
      pitchMm = 25.4 / P; // pitch in mm is 25.4 / TPI
      pitchLabel = `${P} TPI`;
    }

    // Standard Thread Tap Drill Size Formula:
    // Metric: Tap Drill Size = Nominal Size - (Engagement % / 76.98) * Pitch
    // Imperial: Tap Drill Size = Nominal Size - (Engagement % / (76.98 * TPI))
    const calculatedDrillMm = activeThread.system === 'metric'
      ? D - (engagement / 76.98) * P
      : (D - (engagement / (76.98 * P))) * 25.4; // output always in mm for lookups

    const calculatedDrillIn = calculatedDrillMm / 25.4;

    // Standard Clearance Hole classes:
    // Medium clearance = Nominal diameter + 5% to 10%
    // Close clearance = Nominal diameter + 2% to 4%
    const closeClearanceMm = nominalMm * 1.04;
    const mediumClearanceMm = nominalMm * 1.08;

    // Find the closest standard drill bit from our database
    let closestDrill = STANDARD_DRILLS[0];
    let minDiff = Math.abs(STANDARD_DRILLS[0].diameterMm - calculatedDrillMm);

    for (let i = 1; i < STANDARD_DRILLS.length; i++) {
      const diff = Math.abs(STANDARD_DRILLS[i].diameterMm - calculatedDrillMm);
      if (diff < minDiff) {
        minDiff = diff;
        closestDrill = STANDARD_DRILLS[i];
      }
    }

    // Actual thread height resulting from the closest standard drill bit
    // Actual % = (D - Drill) / Pitch * 76.98
    const closestDrillValue = activeThread.system === 'metric' ? closestDrill.diameterMm : closestDrill.diameterMm / 25.4;
    const actualEngagement = activeThread.system === 'metric'
      ? ((D - closestDrillValue) / P) * 76.98
      : ((D - closestDrillValue) * P) * 76.98;

    return {
      nominalMm,
      nominalIn: activeThread.system === 'imperial' ? D : D / 25.4,
      pitchMm,
      pitchLabel,
      calculatedDrillMm,
      calculatedDrillIn,
      closestDrill,
      actualEngagement,
      closeClearanceMm,
      mediumClearanceMm,
    };
  }, [activeThread, engagement]);

  // Export report
  const downloadReport = () => {
    if (!results || !activeThread) return;
    const csvContent = [
      ['Thread Tap & Drill Size Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Thread Name', activeThread.label],
      ['Nominal Diameter', `${activeThread.nominalDiameter} ${activeThread.system === 'metric' ? 'mm' : 'in'}`],
      ['Pitch / TPI', results.pitchLabel],
      ['Material context', material],
      ['Target Thread Engagement %', `${engagement}%`],
      ['Calculated Theoretical Drill Size (mm)', results.calculatedDrillMm.toFixed(4)],
      ['Calculated Theoretical Drill Size (in)', results.calculatedDrillIn.toFixed(4)],
      ['Recommended Physical Drill Bit', results.closestDrill.name],
      ['Recommended Drill Diameter (mm)', results.closestDrill.diameterMm],
      ['Actual Thread Engagement with matching drill %', `${results.actualEngagement.toFixed(1)}%`],
      ['Close Clearance Hole (mm)', results.closeClearanceMm.toFixed(2)],
      ['Medium Clearance Hole (mm)', results.mediumClearanceMm.toFixed(2)],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tap-drill-report-${activeThread.id.toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Bending coordinates calculation for dynamic SVG
  const svgCoords = useMemo(() => {
    if (!results || !activeThread) return null;
    const size = 300;
    const center = size / 2;

    // Nominal outer radius scaled for visual clarity (e.g. 100px)
    const nominalR = 100;

    // Pitch depth relative to radius (say standard 60 degree thread depth)
    // The double depth is 1.08 * pitch. So single depth is 0.54 * pitch.
    // Let's draw pitch depth as visual fraction.
    const threadDepth = 25; // fixed visual depth

    // Inner drill hole radius
    // Engagement controls where the drill radius cuts relative to the thread crest and root.
    // 100% engagement: drill hole radius is equal to the root radius (nominalR - threadDepth).
    // 0% engagement: drill hole radius is equal to the crest radius (nominalR).
    const drillR = nominalR - (engagement / 100) * threadDepth;

    // Draw circular thread cuts
    const teethCount = 36;
    const paths: string[] = [];

    for (let i = 0; i < teethCount; i++) {
      const angle = (i * 360) / teethCount * (Math.PI / 180);
      const nextAngle = ((i + 1) * 360) / teethCount * (Math.PI / 180);
      const midAngle = (angle + nextAngle) / 2;

      // Draw V-teeth profile pointing inward
      const p1 = {
        x: center + nominalR * Math.cos(angle),
        y: center + nominalR * Math.sin(angle),
      };
      const p2 = {
        x: center + (nominalR - threadDepth) * Math.cos(midAngle),
        y: center + (nominalR - threadDepth) * Math.sin(midAngle),
      };
      const p3 = {
        x: center + nominalR * Math.cos(nextAngle),
        y: center + nominalR * Math.sin(nextAngle),
      };

      paths.push(`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`);
    }

    return {
      center,
      nominalR,
      drillR,
      threadDepth,
      teethPath: paths.join(' '),
    };
  }, [results, activeThread, engagement]);

  return (
    <div className="space-y-12">
      {/* Material quick recommendations bar */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" /> Material Specific Thread Height Targets
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {[
            { mat: 'Steel', label: 'Mild Steel / Carbon Steel (65%)', desc: 'Optimum strength and tool life' },
            { mat: 'Stainless Steel', label: 'Stainless Steel / Titanium (55%)', desc: 'Lower torque prevents tap seize & breakage' },
            { mat: 'Aluminum', label: 'Aluminum / Brass / Soft Alloys (75%)', desc: 'Higher engagement prevents thread strip' },
          ].map((item) => (
            <button
              key={item.mat}
              onClick={() => handleApplyMaterial(item.mat)}
              className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all text-left max-w-sm ${
                material === item.mat
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold shadow-sm'
                  : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-extrabold">{item.label}</div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Parameters Inputs */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Thread Parameters</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Select standard thread size and fine-tune target engagement parameters.
            </p>
          </div>

          <div className="space-y-6">
            {/* Thread standard type selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Thread Standard</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTypeChange('metric-coarse')}
                  className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                    threadType === 'metric-coarse'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Metric Coarse
                </button>
                <button
                  onClick={() => handleTypeChange('metric-fine')}
                  className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                    threadType === 'metric-fine'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Metric Fine
                </button>
                <button
                  onClick={() => handleTypeChange('unc')}
                  className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                    threadType === 'unc'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Imperial UNC
                </button>
                <button
                  onClick={() => handleTypeChange('unf')}
                  className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                    threadType === 'unf'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Imperial UNF
                </button>
              </div>
            </div>

            {/* Specific Thread dropdown selector */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Thread Size</label>
              <select
                value={selectedThreadId}
                onChange={(e) => setSelectedThreadId(e.target.value)}
                className="w-full h-12 px-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/10 text-sm"
              >
                {(THREAD_DATA[threadType] || []).map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Engagement Slider */}
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="uppercase tracking-wider">Target Thread Engagement</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={engagement}
                    step={1}
                    min={40}
                    max={85}
                    onChange={(e) => setEngagement(Math.max(40, Math.min(85, parseInt(e.target.value) || 75)))}
                    className="w-16 h-8 text-center rounded bg-slate-50 border border-slate-100 focus:outline-none font-bold"
                  />
                  <span>%</span>
                </div>
              </div>
              <input
                type="range"
                min="40"
                max="85"
                step="1"
                value={engagement}
                onChange={(e) => setEngagement(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="text-rose-500">Min: 40% (Weak threads)</span>
                <span className="text-emerald-600">Standard: 60%-75%</span>
                <span className="text-rose-500">Max: 85% (Tap break risk)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive graphic & result cards */}
        {results && svgCoords && (
          <div className="lg:col-span-7 space-y-6">
            {/* Visualizer graphic card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-full flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" /> Tap Drill Cross-Section Visualizer
                </h3>
              </div>

              {/* Dynamic SVG thread cross-section */}
              <div className="w-full flex items-center justify-center bg-slate-900/2 rounded-2xl border border-slate-50 p-2 relative min-h-[300px]">
                <svg
                  viewBox="0 0 300 300"
                  className="w-full max-w-[280px] h-auto drop-shadow-sm font-sans animate-fadeIn"
                >
                  {/* Bounding box grid */}
                  <rect width="100%" height="100%" fill="#f8fafc" rx="16" />

                  {/* Shaded Material Ring (Solid grey) */}
                  <circle
                    cx={svgCoords.center}
                    cy={svgCoords.center}
                    r={svgCoords.nominalR + 20}
                    fill="#e2e8f0"
                  />

                  {/* Nominal outer diameter boundary */}
                  <circle
                    cx={svgCoords.center}
                    cy={svgCoords.center}
                    r={svgCoords.nominalR}
                    fill="#cbd5e1"
                    stroke="#64748b"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />

                  {/* Cut thread profiles (Teeth boundaries) */}
                  <path
                    d={svgCoords.teethPath}
                    fill="#94a3b8"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />

                  {/* Inner Drilled pilot hole size (white center represents drilled bore) */}
                  <circle
                    cx={svgCoords.center}
                    cy={svgCoords.center}
                    r={svgCoords.drillR}
                    fill="white"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />

                  {/* Dimension markers on diagram */}
                  {/* Nominal Diameter dimension arrow */}
                  <line
                    x1={svgCoords.center - svgCoords.nominalR}
                    y1={svgCoords.center}
                    x2={svgCoords.center + svgCoords.nominalR}
                    y2={svgCoords.center}
                    stroke="#64748b"
                    strokeWidth="1.2"
                    strokeDasharray="3,3"
                  />
                  {/* Drill Diameter dimension arrow */}
                  <line
                    x1={svgCoords.center - svgCoords.drillR}
                    y1={svgCoords.center + 30}
                    x2={svgCoords.center + svgCoords.drillR}
                    y2={svgCoords.center + 30}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                  <polygon points={`${svgCoords.center - svgCoords.drillR},210 ${svgCoords.center - svgCoords.drillR + 6},206 ${svgCoords.center - svgCoords.drillR + 6},214`} fill="#3b82f6" transform={`translate(0, -30)`} />
                  <polygon points={`${svgCoords.center + svgCoords.drillR},210 ${svgCoords.center + svgCoords.drillR - 6},206 ${svgCoords.center + svgCoords.drillR - 6},214`} fill="#3b82f6" transform={`translate(0, -30)`} />

                  {/* Inside Center Cross */}
                  <line x1={svgCoords.center - 5} y1={svgCoords.center} x2={svgCoords.center + 5} y2={svgCoords.center} stroke="#64748b" strokeWidth="1" />
                  <line x1={svgCoords.center} y1={svgCoords.center - 5} x2={svgCoords.center} y2={svgCoords.center + 5} stroke="#64748b" strokeWidth="1" />

                  {/* Labels on SVG */}
                  <text x={svgCoords.center} y={svgCoords.center - 10} fill="#64748b" textAnchor="middle" className="text-[8px] font-black tracking-wider uppercase">
                    Nominal D = {activeThread.nominalDiameter} {activeThread.system === 'metric' ? 'mm' : 'in'}
                  </text>
                  <text x={svgCoords.center} y={svgCoords.center + 25} fill="#2563eb" textAnchor="middle" className="text-[8px] font-black tracking-wider uppercase">
                    Drill Hole d = {results.calculatedDrillMm.toFixed(2)} mm
                  </text>
                </svg>
              </div>
            </div>

            {/* Calculations results detail cards */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Calculated Drill selection</h3>
                <button
                  onClick={downloadReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
                >
                  <FileText className="w-3.5 h-3.5" /> CSV Report
                </button>
              </div>

              {/* Large Output Card: Recommended standard drill bit */}
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Recommended Physical Drill Bit
                </div>
                <div className="text-4xl md:text-5xl font-black tracking-tight text-blue-400">
                  {results.closestDrill.name}
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Calculated pilot bore: {results.calculatedDrillMm.toFixed(3)} mm (Yields {results.actualEngagement.toFixed(1)}% thread height).
                </p>
              </div>

              {/* Technical Specifications list */}
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800/40 space-y-4 text-xs font-semibold leading-relaxed">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-800/50 pb-2">Technical specs</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Nominal Diameter</span>
                      <span>{results.nominalMm.toFixed(2)} mm ({results.nominalIn.toFixed(4)} in)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Thread Pitch / Density</span>
                      <span>{results.pitchLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Material Selection</span>
                      <span>{material}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Close Clearance Hole</span>
                      <span>{results.closeClearanceMm.toFixed(2)} mm</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Medium Clearance Hole</span>
                      <span>{results.mediumClearanceMm.toFixed(2)} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Engagement Target</span>
                      <span>{engagement}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Engineering Info Guide */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> Tap Drill Engineering Guide
        </h3>

        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">1. Bending & Machining Torque Balance</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                <strong>The 75% Thread Myth</strong>: While many standard charts print sizes targeting 75% engagement, this is a legacy standard from when hand-threading was common. In CNC milling and modern assembly, 60% to 65% is preferred for steel and hard alloys.
              </p>
              <p>
                <strong>Tool Breakage Risk</strong>: A 75% thread engagement requires double the tap cutting torque compared to a 60% thread. However, it only increases thread strength by less than 5%. In materials like Stainless Steel or Titanium, high torque causes rapid tool wear and binding.
              </p>
              <p>
                <strong>Material Specific Recommendations</strong>:
                <br />• <strong>Steel/Iron</strong>: 60% to 65% engagement.
                <br />• <strong>Alu/Brass/Copper</strong>: 70% to 75% engagement (to compensate for softer thread shear strengths).
                <br />• <strong>Hard Alloys/Titanium</strong>: 50% to 55% engagement.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">2. Machinists Formulas</h4>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3.5 text-xs font-semibold text-slate-600 leading-relaxed font-mono">
              <div>
                <span className="text-slate-400">// Metric Thread Formula</span>
                <div>Drill = D - (Engagement / 76.98) * P</div>
                <div className="text-slate-400 pt-1">// Imperial UNC/UNF Formula</div>
                <div>Drill = D - (Engagement / (76.98 * TPI))</div>
              </div>
              <div className="pt-2 border-t border-slate-200/50">
                <span className="text-slate-400">// Clearance Hole Standard</span>
                <div>Close clearance = Nominal * 1.04</div>
                <div>Medium clearance = Nominal * 1.08</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Newsletter banner */}
      <RelatedTools />
    </div>
  );
}
