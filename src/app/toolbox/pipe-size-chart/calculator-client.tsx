'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Download, Search, Copy, Check, Info, Ruler } from 'lucide-react';

interface PipeWallSpec {
  id: string;
  nps: string;
  dn: number;
  odIn: number;
  odMm: number;
  schedule: 'sch10' | 'sch40' | 'sch80' | 'sch160';
  scheduleLabel: string;
  wallMm: number;
}

interface ConversionRow {
  nps: string;
  dn: number;
  odIn: number;
  odMm: number;
  note: string;
}

// Verified exact outside diameters (in/mm) and wall thicknesses (mm) from Wikipedia: Nominal Pipe Size (ASME B36.10M / B36.19M & ISO 6708)
const PIPE_SPECS: PipeWallSpec[] = [
  // Schedule 10 / 10s
  { id: '1-8-s10', nps: 'NPS 1/8"', dn: 6, odIn: 0.405, odMm: 10.29, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 1.24 },
  { id: '1-4-s10', nps: 'NPS 1/4"', dn: 8, odIn: 0.540, odMm: 13.72, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 1.65 },
  { id: '3-8-s10', nps: 'NPS 3/8"', dn: 10, odIn: 0.675, odMm: 17.15, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 1.65 },
  { id: '1-2-s10', nps: 'NPS 1/2"', dn: 15, odIn: 0.840, odMm: 21.34, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 2.11 },
  { id: '3-4-s10', nps: 'NPS 3/4"', dn: 20, odIn: 1.050, odMm: 26.67, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 2.11 },
  { id: '1-s10', nps: 'NPS 1"', dn: 25, odIn: 1.315, odMm: 33.40, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 2.77 },
  { id: '1-14-s10', nps: 'NPS 1-1/4"', dn: 32, odIn: 1.660, odMm: 42.16, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 2.77 },
  { id: '1-12-s10', nps: 'NPS 1-1/2"', dn: 40, odIn: 1.900, odMm: 48.26, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 2.77 },
  { id: '2-s10', nps: 'NPS 2"', dn: 50, odIn: 2.375, odMm: 60.33, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 2.77 },
  { id: '2-12-s10', nps: 'NPS 2-1/2"', dn: 65, odIn: 2.875, odMm: 73.03, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 3.05 },
  { id: '3-s10', nps: 'NPS 3"', dn: 80, odIn: 3.500, odMm: 88.90, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 3.05 },
  { id: '4-s10', nps: 'NPS 4"', dn: 100, odIn: 4.500, odMm: 114.30, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 3.05 },
  { id: '6-s10', nps: 'NPS 6"', dn: 150, odIn: 6.625, odMm: 168.28, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 3.40 },
  { id: '8-s10', nps: 'NPS 8"', dn: 200, odIn: 8.625, odMm: 219.08, schedule: 'sch10', scheduleLabel: 'Sch 10/10s', wallMm: 3.76 },
  { id: '10-s10', nps: 'NPS 10"', dn: 250, odIn: 10.750, odMm: 273.05, schedule: 'sch10', scheduleLabel: 'Sch 10', wallMm: 4.19 },
  { id: '12-s10', nps: 'NPS 12"', dn: 300, odIn: 12.750, odMm: 323.85, schedule: 'sch10', scheduleLabel: 'Sch 10', wallMm: 4.57 },

  // Schedule 40 / STD
  { id: '1-8-s40', nps: 'NPS 1/8"', dn: 6, odIn: 0.405, odMm: 10.29, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 1.73 },
  { id: '1-4-s40', nps: 'NPS 1/4"', dn: 8, odIn: 0.540, odMm: 13.72, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 2.24 },
  { id: '3-8-s40', nps: 'NPS 3/8"', dn: 10, odIn: 0.675, odMm: 17.15, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 2.31 },
  { id: '1-2-s40', nps: 'NPS 1/2"', dn: 15, odIn: 0.840, odMm: 21.34, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 2.77 },
  { id: '3-4-s40', nps: 'NPS 3/4"', dn: 20, odIn: 1.050, odMm: 26.67, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 2.87 },
  { id: '1-s40', nps: 'NPS 1"', dn: 25, odIn: 1.315, odMm: 33.40, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 3.38 },
  { id: '1-14-s40', nps: 'NPS 1-1/4"', dn: 32, odIn: 1.660, odMm: 42.16, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 3.56 },
  { id: '1-12-s40', nps: 'NPS 1-1/2"', dn: 40, odIn: 1.900, odMm: 48.26, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 3.68 },
  { id: '2-s40', nps: 'NPS 2"', dn: 50, odIn: 2.375, odMm: 60.33, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 3.91 },
  { id: '2-12-s40', nps: 'NPS 2-1/2"', dn: 65, odIn: 2.875, odMm: 73.03, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 5.16 },
  { id: '3-s40', nps: 'NPS 3"', dn: 80, odIn: 3.500, odMm: 88.90, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 5.49 },
  { id: '4-s40', nps: 'NPS 4"', dn: 100, odIn: 4.500, odMm: 114.30, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 6.02 },
  { id: '6-s40', nps: 'NPS 6"', dn: 150, odIn: 6.625, odMm: 168.28, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 7.11 },
  { id: '8-s40', nps: 'NPS 8"', dn: 200, odIn: 8.625, odMm: 219.08, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 8.18 },
  { id: '10-s40', nps: 'NPS 10"', dn: 250, odIn: 10.750, odMm: 273.05, schedule: 'sch40', scheduleLabel: 'Sch 40 / STD', wallMm: 9.27 },
  { id: '12-s40', nps: 'NPS 12"', dn: 300, odIn: 12.750, odMm: 323.85, schedule: 'sch40', scheduleLabel: 'Sch 40', wallMm: 10.31 },

  // Schedule 80 / XS
  { id: '1-8-s80', nps: 'NPS 1/8"', dn: 6, odIn: 0.405, odMm: 10.29, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 2.41 },
  { id: '1-4-s80', nps: 'NPS 1/4"', dn: 8, odIn: 0.540, odMm: 13.72, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 3.02 },
  { id: '3-8-s80', nps: 'NPS 3/8"', dn: 10, odIn: 0.675, odMm: 17.15, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 3.20 },
  { id: '1-2-s80', nps: 'NPS 1/2"', dn: 15, odIn: 0.840, odMm: 21.34, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 3.73 },
  { id: '3-4-s80', nps: 'NPS 3/4"', dn: 20, odIn: 1.050, odMm: 26.67, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 3.91 },
  { id: '1-s80', nps: 'NPS 1"', dn: 25, odIn: 1.315, odMm: 33.40, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 4.55 },
  { id: '1-14-s80', nps: 'NPS 1-1/4"', dn: 32, odIn: 1.660, odMm: 42.16, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 4.85 },
  { id: '1-12-s80', nps: 'NPS 1-1/2"', dn: 40, odIn: 1.900, odMm: 48.26, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 5.08 },
  { id: '2-s80', nps: 'NPS 2"', dn: 50, odIn: 2.375, odMm: 60.33, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 5.54 },
  { id: '2-12-s80', nps: 'NPS 2-1/2"', dn: 65, odIn: 2.875, odMm: 73.03, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 7.01 },
  { id: '3-s80', nps: 'NPS 3"', dn: 80, odIn: 3.500, odMm: 88.90, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 7.62 },
  { id: '4-s80', nps: 'NPS 4"', dn: 100, odIn: 4.500, odMm: 114.30, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 8.56 },
  { id: '6-s80', nps: 'NPS 6"', dn: 150, odIn: 6.625, odMm: 168.28, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 10.97 },
  { id: '8-s80', nps: 'NPS 8"', dn: 200, odIn: 8.625, odMm: 219.08, schedule: 'sch80', scheduleLabel: 'Sch 80 / XS', wallMm: 12.70 },
  { id: '10-s80', nps: 'NPS 10"', dn: 250, odIn: 10.750, odMm: 273.05, schedule: 'sch80', scheduleLabel: 'Sch 80', wallMm: 15.09 },
  { id: '12-s80', nps: 'NPS 12"', dn: 300, odIn: 12.750, odMm: 323.85, schedule: 'sch80', scheduleLabel: 'Sch 80', wallMm: 17.45 },

  // Schedule 160
  { id: '1-2-s160', nps: 'NPS 1/2"', dn: 15, odIn: 0.840, odMm: 21.34, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 4.78 },
  { id: '3-4-s160', nps: 'NPS 3/4"', dn: 20, odIn: 1.050, odMm: 26.67, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 5.56 },
  { id: '1-s160', nps: 'NPS 1"', dn: 25, odIn: 1.315, odMm: 33.40, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 6.35 },
  { id: '1-14-s160', nps: 'NPS 1-1/4"', dn: 32, odIn: 1.660, odMm: 42.16, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 6.35 },
  { id: '1-12-s160', nps: 'NPS 1-1/2"', dn: 40, odIn: 1.900, odMm: 48.26, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 7.14 },
  { id: '2-s160', nps: 'NPS 2"', dn: 50, odIn: 2.375, odMm: 60.33, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 8.74 },
  { id: '2-12-s160', nps: 'NPS 2-1/2"', dn: 65, odIn: 2.875, odMm: 73.03, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 9.53 },
  { id: '3-s160', nps: 'NPS 3"', dn: 80, odIn: 3.500, odMm: 88.90, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 11.13 },
  { id: '4-s160', nps: 'NPS 4"', dn: 100, odIn: 4.500, odMm: 114.30, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 13.49 },
  { id: '6-s160', nps: 'NPS 6"', dn: 150, odIn: 6.625, odMm: 168.28, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 18.26 },
  { id: '8-s160', nps: 'NPS 8"', dn: 200, odIn: 8.625, odMm: 219.08, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 23.01 },
  { id: '10-s160', nps: 'NPS 10"', dn: 250, odIn: 10.750, odMm: 273.05, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 28.58 },
  { id: '12-s160', nps: 'NPS 12"', dn: 300, odIn: 12.750, odMm: 323.85, schedule: 'sch160', scheduleLabel: 'Sch 160', wallMm: 33.32 },
];

const NPS_DN_CONVERSIONS: ConversionRow[] = [
  { nps: 'NPS 1/8"', dn: 6, odIn: 0.405, odMm: 10.29, note: 'OD larger than nominal 1/8"' },
  { nps: 'NPS 1/4"', dn: 8, odIn: 0.540, odMm: 13.72, note: 'Instrument air & gauge lines' },
  { nps: 'NPS 3/8"', dn: 10, odIn: 0.675, odMm: 17.15, note: 'Small utility connections' },
  { nps: 'NPS 1/2"', dn: 15, odIn: 0.840, odMm: 21.34, note: 'Common small-bore header' },
  { nps: 'NPS 3/4"', dn: 20, odIn: 1.050, odMm: 26.67, note: 'Residential & branch supply' },
  { nps: 'NPS 1"', dn: 25, odIn: 1.315, odMm: 33.40, note: 'OD is 33.40 mm (not 25.4 mm)' },
  { nps: 'NPS 1-1/4"', dn: 32, odIn: 1.660, odMm: 42.16, note: 'Medium branch header' },
  { nps: 'NPS 1-1/2"', dn: 40, odIn: 1.900, odMm: 48.26, note: 'Process & HVAC branch' },
  { nps: 'NPS 2"', dn: 50, odIn: 2.375, odMm: 60.33, note: 'Common industrial line' },
  { nps: 'NPS 2-1/2"', dn: 65, odIn: 2.875, odMm: 73.03, note: 'Transitional piping size' },
  { nps: 'NPS 3"', dn: 80, odIn: 3.500, odMm: 88.90, note: 'Distribution & process header' },
  { nps: 'NPS 4"', dn: 100, odIn: 4.500, odMm: 114.30, note: 'Standard plant main' },
  { nps: 'NPS 6"', dn: 150, odIn: 6.625, odMm: 168.28, note: 'Large process & water main' },
  { nps: 'NPS 8"', dn: 200, odIn: 8.625, odMm: 219.08, note: 'Municipal & industrial trunk' },
  { nps: 'NPS 10"', dn: 250, odIn: 10.750, odMm: 273.05, note: 'High-flow plant header' },
  { nps: 'NPS 12"', dn: 300, odIn: 12.750, odMm: 323.85, note: 'Last NPS size where OD > NPS' },
  { nps: 'NPS 14"', dn: 350, odIn: 14.000, odMm: 355.60, note: 'OD matches NPS exactly (14.000")' },
  { nps: 'NPS 16"', dn: 400, odIn: 16.000, odMm: 406.40, note: 'OD equals 16.000"' },
  { nps: 'NPS 20"', dn: 500, odIn: 20.000, odMm: 508.00, note: 'OD equals 20.000"' },
  { nps: 'NPS 24"', dn: 600, odIn: 24.000, odMm: 609.60, note: 'OD equals 24.000"' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Schedules' },
  { id: 'sch40', label: 'Schedule 40 / STD' },
  { id: 'sch80', label: 'Schedule 80 / XS' },
  { id: 'sch10', label: 'Schedule 10 / 10s' },
  { id: 'sch160', label: 'Schedule 160' },
  { id: 'conversion', label: 'NPS <-> DN Conversion' },
] as const;

export interface ComputedPipeRow extends PipeWallSpec {
  idMm: number;
  wallAreaMm2: number;
  boreAreaMm2: number;
  massPerMeterKg: number;
}

function computePipeRows(densityKgM3: number): { valid: boolean; error?: string; rows: ComputedPipeRow[] } {
  if (!Number.isFinite(densityKgM3) || densityKgM3 <= 0) {
    return { valid: false, error: 'Material density must be a positive finite number (kg/m^3).', rows: [] };
  }
  const rows = PIPE_SPECS.map((spec) => {
    const idMm = spec.odMm - 2 * spec.wallMm;
    const wallAreaMm2 = (Math.PI / 4) * (spec.odMm * spec.odMm - idMm * idMm);
    const boreAreaMm2 = (Math.PI / 4) * idMm * idMm;
    const massPerMeterKg = wallAreaMm2 * densityKgM3 * 1e-6;
    return {
      ...spec,
      idMm,
      wallAreaMm2,
      boreAreaMm2,
      massPerMeterKg,
    };
  });
  return { valid: true, rows };
}

export default function PipeSizeClient() {
  const [category, setCategory] = useState<'all' | 'sch40' | 'sch80' | 'sch10' | 'sch160' | 'conversion'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [densityStr, setDensityStr] = useState('7850');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const density = Number(densityStr);
  const computed = computePipeRows(densityStr.trim() === '' ? NaN : density);

  const q = searchQuery.trim().toLowerCase();
  const filteredRows = computed.valid
    ? computed.rows.filter((r) => {
        if (category !== 'all' && category !== 'conversion' && r.schedule !== category) return false;
        if (!q) return true;
        return (
          r.nps.toLowerCase().includes(q) ||
          `dn${r.dn}`.includes(q) ||
          r.scheduleLabel.toLowerCase().includes(q) ||
          r.odMm.toFixed(2).includes(q)
        );
      })
    : [];

  const filteredConversions = NPS_DN_CONVERSIONS.filter((c) => {
    if (!q) return true;
    return (
      c.nps.toLowerCase().includes(q) ||
      `dn${c.dn}`.includes(q) ||
      c.odMm.toFixed(2).includes(q) ||
      c.note.toLowerCase().includes(q)
    );
  });

  const handleCopyRow = (row: ComputedPipeRow) => {
    const text = `${row.nps} | DN${row.dn} | ${row.scheduleLabel} | OD ${row.odMm.toFixed(2)} mm | Wall ${row.wallMm.toFixed(2)} mm | ID ${row.idMm.toFixed(2)} mm | ${row.massPerMeterKg.toFixed(2)} kg/m`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(row.id);
        setTimeout(() => setCopiedId(null), 1500);
      })
      .catch(() => {});
  };

  const handleDownloadCsv = () => {
    if (!computed.valid) return;
    const header = ['NPS', 'DN', 'Schedule', 'OD (in)', 'OD (mm)', 'Wall (mm)', 'ID (mm)', 'Wall Area (mm2)', 'Linear Mass (kg/m)'];
    const lines = [
      header.join(','),
      ...computed.rows.map((r) =>
        [
          `"${r.nps.replace(/"/g, '')}"`,
          `DN${r.dn}`,
          r.scheduleLabel,
          r.odIn.toFixed(3),
          r.odMm.toFixed(2),
          r.wallMm.toFixed(2),
          r.idMm.toFixed(2),
          r.wallAreaMm2.toFixed(1),
          r.massPerMeterKg.toFixed(2),
        ].join(',')
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipe-size-chart.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Interactive NPS / DN / Schedule Reference Chart
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                ID = OD - 2*t; Linear mass m = (pi/4)*(OD^2 - ID^2)*rho*1e-6
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={!computed.valid}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Search NPS, DN, Schedule, or OD (mm)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                data-testid="pipe-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='e.g. NPS 6", DN150, Sch 80, 168.28'
                className="w-full h-12 pl-10 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-4 focus:ring-emerald-600/10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Pipe Material Density (kg/m^3)
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="pipe-density"
              value={densityStr}
              onChange={(e) => setDensityStr(e.target.value)}
              placeholder="7850"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-4 focus:ring-emerald-600/10 focus:bg-white transition-all"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { label: 'Carbon Steel (7850)', val: '7850' },
                { label: '304 Stainless (7930)', val: '7930' },
                { label: 'Aluminum 6061 (2700)', val: '2700' },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setDensityStr(p.val)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!computed.valid && (
          <div
            data-testid="validation-error"
            className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-red-700"
          >
            {computed.error}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-black transition-all ${
                category === c.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {category === 'conversion' ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">NPS</th>
                  <th className="px-4 py-3">DN (ISO 6708)</th>
                  <th className="px-4 py-3">OD (in)</th>
                  <th className="px-4 py-3">OD (mm)</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredConversions.map((row) => (
                  <tr key={row.nps} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-black text-slate-900">{row.nps}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">DN{row.dn}</td>
                    <td className="px-4 py-3 font-mono">{row.odIn.toFixed(3)} in</td>
                    <td className="px-4 py-3 font-mono">{row.odMm.toFixed(2)} mm</td>
                    <td className="px-4 py-3 text-slate-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          computed.valid && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">NPS / DN</th>
                    <th className="px-4 py-3">Schedule</th>
                    <th className="px-4 py-3">OD (mm)</th>
                    <th className="px-4 py-3">Wall t (mm)</th>
                    <th className="px-4 py-3">ID (mm)</th>
                    <th className="px-4 py-3">Mass (kg/m)</th>
                    <th className="px-4 py-3">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map((row) => (
                    <tr key={row.id} data-testid={`pipe-row-${row.id}`} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-black text-slate-900">
                        {row.nps} <span className="text-emerald-700 font-bold">(DN{row.dn})</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700">{row.scheduleLabel}</td>
                      <td className="px-4 py-3 font-mono">{row.odMm.toFixed(2)}</td>
                      <td className="px-4 py-3 font-mono">{row.wallMm.toFixed(2)}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{row.idMm.toFixed(2)}</td>
                      <td className="px-4 py-3 font-mono font-black text-emerald-700">{row.massPerMeterKg.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleCopyRow(row)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700"
                          aria-label={`Copy ${row.nps} ${row.scheduleLabel}`}
                        >
                          {copiedId === row.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-2.5 text-sm text-slate-600">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            Standard OD and wall thickness entries reflect Wikipedia Nominal Pipe Size reference tables (ASME B36.10M / B36.19M) and ISO 6708 DN equivalents. For NPS &lt;= 12, OD exceeds nominal inches; from NPS 14 upward, OD equals nominal inches. Linear mass is computed directly from cross-sectional metal area times the entered material density.
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
