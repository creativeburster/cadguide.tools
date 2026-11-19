'use client';

import { useState, useMemo } from 'react';
import { Search, Download, RotateCcw, Info } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

type SeriesId = 'ALL' | 'DIN-I' | 'HE-A' | 'HE-B';

interface SteelSectionRow {
  profile: string;
  series: 'DIN-I' | 'HE-A' | 'HE-B';
  seriesLabel: string;
  h: number;
  b: number;
  tw: number;
  area: number;
  weight: number;
  ix: number;
  iy: number;
  sx: number;
  sy: number;
}

// 42 verified DIN 1025 structural steel profiles from Engineering ToolBox (d_1317.html, d_1313.html, d_1314.html)
const SECTIONS: SteelSectionRow[] = [
  // Normal Flange I-Beams (d_1317.html, 16 profiles)
  { profile: 'I 80', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 80, b: 42, tw: 3.9, area: 7.58, weight: 5.94, ix: 77.8, iy: 6.29, sx: 19.5, sy: 3.0 },
  { profile: 'I 100', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 100, b: 50, tw: 4.5, area: 10.6, weight: 8.34, ix: 171, iy: 12.2, sx: 34.2, sy: 4.88 },
  { profile: 'I 120', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 120, b: 58, tw: 5.1, area: 14.2, weight: 11.1, ix: 328, iy: 21.5, sx: 54.7, sy: 7.41 },
  { profile: 'I 140', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 140, b: 66, tw: 5.7, area: 18.3, weight: 14.3, ix: 573, iy: 35.2, sx: 81.9, sy: 10.7 },
  { profile: 'I 160', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 160, b: 74, tw: 6.3, area: 22.8, weight: 17.9, ix: 935, iy: 54.7, sx: 117, sy: 14.8 },
  { profile: 'I 180', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 180, b: 82, tw: 6.9, area: 27.9, weight: 21.9, ix: 1450, iy: 81.3, sx: 161, sy: 19.8 },
  { profile: 'I 200', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 200, b: 90, tw: 7.5, area: 33.5, weight: 26.2, ix: 2140, iy: 117, sx: 214, sy: 26.0 },
  { profile: 'I 220', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 220, b: 98, tw: 8.1, area: 39.6, weight: 31.1, ix: 3060, iy: 162, sx: 278, sy: 33.1 },
  { profile: 'I 240', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 240, b: 106, tw: 8.7, area: 46.1, weight: 36.2, ix: 4250, iy: 221, sx: 354, sy: 41.7 },
  { profile: 'I 260', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 260, b: 113, tw: 9.4, area: 53.4, weight: 41.9, ix: 5740, iy: 288, sx: 442, sy: 51.0 },
  { profile: 'I 300', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 300, b: 125, tw: 10.8, area: 69.1, weight: 54.2, ix: 9800, iy: 451, sx: 653, sy: 72.2 },
  { profile: 'I 340', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 340, b: 137, tw: 12.2, area: 86.8, weight: 68.0, ix: 15700, iy: 674, sx: 923, sy: 98.4 },
  { profile: 'I 360', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 360, b: 143, tw: 13.0, area: 97.1, weight: 76.1, ix: 19610, iy: 818, sx: 1090, sy: 114 },
  { profile: 'I 400', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 400, b: 155, tw: 14.4, area: 118, weight: 92.4, ix: 29210, iy: 1160, sx: 1460, sy: 149 },
  { profile: 'I 450', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 450, b: 170, tw: 16.2, area: 147, weight: 115, ix: 45850, iy: 1730, sx: 2040, sy: 203 },
  { profile: 'I 500', series: 'DIN-I', seriesLabel: 'DIN 1025 I-Beam', h: 500, b: 185, tw: 18.0, area: 180, weight: 141, ix: 68740, iy: 2480, sx: 2750, sy: 268 },

  // Wide Flange HE-A (d_1313.html, 13 profiles)
  { profile: '100A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 96, b: 100, tw: 5.0, area: 21.2, weight: 16.7, ix: 349, iy: 134, sx: 72.8, sy: 26.8 },
  { profile: '120A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 114, b: 120, tw: 5.0, area: 25.3, weight: 19.9, ix: 606, iy: 231, sx: 106, sy: 38.5 },
  { profile: '140A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 133, b: 140, tw: 5.5, area: 31.4, weight: 24.7, ix: 1030, iy: 389, sx: 155, sy: 55.6 },
  { profile: '160A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 152, b: 160, tw: 6.0, area: 38.8, weight: 30.4, ix: 1670, iy: 616, sx: 220, sy: 76.9 },
  { profile: '180A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 171, b: 180, tw: 6.0, area: 45.3, weight: 35.5, ix: 2410, iy: 925, sx: 294, sy: 103 },
  { profile: '200A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 190, b: 200, tw: 6.5, area: 53.8, weight: 42.3, ix: 3690, iy: 1340, sx: 389, sy: 134 },
  { profile: '220A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 210, b: 220, tw: 7.0, area: 64.3, weight: 50.5, ix: 5410, iy: 1950, sx: 515, sy: 178 },
  { profile: '240A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 230, b: 240, tw: 7.5, area: 76.8, weight: 60.3, ix: 7760, iy: 2770, sx: 675, sy: 231 },
  { profile: '260A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 250, b: 260, tw: 7.5, area: 86.8, weight: 68.2, ix: 10450, iy: 3670, sx: 836, sy: 282 },
  { profile: '280A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 270, b: 280, tw: 8.0, area: 97.3, weight: 76.4, ix: 13670, iy: 4760, sx: 1010, sy: 340 },
  { profile: '300A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 290, b: 300, tw: 8.5, area: 112, weight: 88.3, ix: 18260, iy: 6310, sx: 1260, sy: 421 },
  { profile: '320A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 310, b: 300, tw: 9.0, area: 124, weight: 97.6, ix: 22930, iy: 6990, sx: 1480, sy: 466 },
  { profile: '340A', series: 'HE-A', seriesLabel: 'DIN 1025 HE-A', h: 330, b: 300, tw: 9.5, area: 133, weight: 105, ix: 27690, iy: 7440, sx: 1680, sy: 499 },

  // Wide Flange HE-B (d_1314.html, 13 profiles)
  { profile: '100B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 100, b: 100, tw: 6.0, area: 26.0, weight: 20.4, ix: 450, iy: 167, sx: 89.9, sy: 33.5 },
  { profile: '120B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 120, b: 120, tw: 6.5, area: 34.0, weight: 26.7, ix: 864, iy: 318, sx: 144, sy: 52.9 },
  { profile: '140B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 140, b: 140, tw: 7.0, area: 43.0, weight: 33.7, ix: 1510, iy: 550, sx: 216, sy: 78.5 },
  { profile: '160B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 160, b: 160, tw: 8.0, area: 54.3, weight: 42.6, ix: 2490, iy: 889, sx: 311, sy: 111 },
  { profile: '180B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 180, b: 180, tw: 8.5, area: 65.3, weight: 51.2, ix: 3830, iy: 1360, sx: 426, sy: 151 },
  { profile: '200B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 200, b: 200, tw: 9.0, area: 78.1, weight: 61.3, ix: 5700, iy: 2000, sx: 570, sy: 200 },
  { profile: '220B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 220, b: 220, tw: 9.5, area: 91.0, weight: 71.5, ix: 8090, iy: 2840, sx: 736, sy: 258 },
  { profile: '240B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 240, b: 240, tw: 10.0, area: 106, weight: 83.2, ix: 11260, iy: 3920, sx: 938, sy: 327 },
  { profile: '260B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 260, b: 260, tw: 10.0, area: 118, weight: 93.0, ix: 14920, iy: 5130, sx: 1150, sy: 395 },
  { profile: '280B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 280, b: 280, tw: 10.5, area: 131, weight: 103, ix: 19270, iy: 6590, sx: 1380, sy: 471 },
  { profile: '300B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 300, b: 300, tw: 11.0, area: 149, weight: 117, ix: 25170, iy: 8560, sx: 1680, sy: 571 },
  { profile: '320B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 320, b: 300, tw: 11.5, area: 161, weight: 127, ix: 30820, iy: 9240, sx: 1930, sy: 616 },
  { profile: '340B', series: 'HE-B', seriesLabel: 'DIN 1025 HE-B', h: 340, b: 300, tw: 12.0, area: 171, weight: 134, ix: 36660, iy: 9690, sx: 2160, sy: 646 },
];

export default function SteelSectionClient() {
  const [seriesFilter, setSeriesFilter] = useState<SeriesId>('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SECTIONS.filter(r => {
      if (seriesFilter !== 'ALL' && r.series !== seriesFilter) return false;
      if (!q) return true;
      return r.profile.toLowerCase().includes(q) || r.seriesLabel.toLowerCase().includes(q);
    });
  }, [seriesFilter, search]);

  const resetFilters = () => {
    setSeriesFilter('ALL');
    setSearch('');
  };

  const downloadCsv = () => {
    const lines = [
      '# DIN 1025 Structural Steel Section Properties Reference (Engineering ToolBox verified)',
      `# Active Filter: Series=${seriesFilter}, Search="${search.trim()}" (${filtered.length} rows)`,
      'Profile,Series,Height h (mm),Width b (mm),Web Thickness tw (mm),Area (cm2),Weight (kg/m),Ix (cm4),Iy (cm4),Sx (cm3),Sy (cm3)',
      ...filtered.map(r =>
        `${r.profile},${r.seriesLabel},${r.h},${r.b},${r.tw},${r.area},${r.weight},${r.ix},${r.iy},${r.sx},${r.sy}`
      ),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'din1025-steel-sections.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'ALL', testid: 'series-all', label: `All DIN 1025 (${SECTIONS.length})` },
                { id: 'DIN-I', testid: 'series-din-i', label: 'I-Beams (16)' },
                { id: 'HE-A', testid: 'series-he-a', label: 'HE-A Wide Flange (13)' },
                { id: 'HE-B', testid: 'series-he-b', label: 'HE-B Wide Flange (13)' },
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                type="button"
                data-testid={tab.testid}
                onClick={() => setSeriesFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  seriesFilter === tab.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                data-testid="input-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter e.g. I 200 or 300B..."
                className="h-10 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              type="button"
              data-testid="export-csv-btn"
              onClick={downloadCsv}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Showing <span data-testid="output-count" className="text-slate-900 font-black">{filtered.length}</span> sections
        </div>

        <div className="overflow-x-auto">
          <table data-testid="section-table" className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3">Profile</th>
                <th className="py-3 px-3">Series</th>
                <th className="py-3 px-3 text-right">h (mm)</th>
                <th className="py-3 px-3 text-right">b (mm)</th>
                <th className="py-3 px-3 text-right">tw (mm)</th>
                <th className="py-3 px-3 text-right">Area (cm&sup2;)</th>
                <th className="py-3 px-3 text-right">Weight (kg/m)</th>
                <th className="py-3 px-3 text-right">Ix (cm&sup4;)</th>
                <th className="py-3 px-3 text-right">Iy (cm&sup4;)</th>
                <th className="py-3 px-3 text-right">Sx (cm&sup3;)</th>
                <th className="py-3 px-3 text-right">Sy (cm&sup3;)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.profile} data-testid={`row-${r.profile}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-black text-slate-900 whitespace-nowrap">{r.profile}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-slate-500 whitespace-nowrap">{r.seriesLabel}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{r.h}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{r.b}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{r.tw}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{r.area}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">{r.weight}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{r.ix}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{r.iy}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{r.sx}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{r.sy}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400 font-bold">
                    No matching DIN 1025 sections found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Section dimensions, areas, unit masses, moments of inertia (Ix, Iy), and section moduli (Sx, Sy) reproduced from Engineering ToolBox:{' '}
              <a href="https://www.engineeringtoolbox.com/din-1025-i-beams-d_1317.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                DIN 1025 Normal Flange I-Beams (d_1317)
              </a>
              ,{' '}
              <a href="https://www.engineeringtoolbox.com/european-wide-flange-beams-hea-d_1313.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                DIN 1025 HE-A (d_1313)
              </a>
              , and{' '}
              <a href="https://www.engineeringtoolbox.com/european-wide-flange-beams-heb-d_1314.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                DIN 1025 HE-B (d_1314)
              </a>
              .
            </span>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
