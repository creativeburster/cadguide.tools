'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { ArrowRightLeft, Search, RotateCcw, Download, Info, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export type SupportedFormat =
  | 'DWG'
  | 'DXF'
  | 'STEP'
  | 'IGES'
  | 'SAT'
  | 'STL'
  | 'OBJ'
  | '3MF'
  | 'FBX'
  | 'PDF';

export type VerifiedSoftware = 'AutoCAD' | 'Rhino 8' | 'Blender' | 'OpenSCAD';

interface FormatMatrixRow {
  id: string;
  software: VerifiedSoftware;
  toolSlug: string;
  format: SupportedFormat;
  canImport: boolean;
  canExport: boolean;
  commandRef: string;
  docSource: string;
}

const FORMATS: SupportedFormat[] = [
  'DWG',
  'DXF',
  'STEP',
  'IGES',
  'SAT',
  'STL',
  'OBJ',
  '3MF',
  'FBX',
  'PDF',
];

const SOFTWARES: VerifiedSoftware[] = ['AutoCAD', 'Rhino 8', 'Blender', 'OpenSCAD'];

// Every entry below is verified verbatim against official product help / command documentation:
// - AutoCAD: Autodesk AutoCAD 2024 Help — IMPORT (Command) & EXPORT (Command)
// - Rhino 8: McNeel Rhinoceros 8 Help — Index of import/export file types
// - Blender: Blender Manual — Importing & Exporting Files / Import-Export Add-ons
// - OpenSCAD: OpenSCAD User Manual — STL Import and Export
const MATRIX_ROWS: FormatMatrixRow[] = [
  {
    id: 'autocad-dwg',
    software: 'AutoCAD',
    toolSlug: 'autocad',
    format: 'DWG',
    canImport: true,
    canExport: true,
    commandRef: 'Native DWG / WBLOCK: Block (*.dwg)',
    docSource: 'AutoCAD 2024 Help — EXPORT (Command)',
  },
  {
    id: 'autocad-step',
    software: 'AutoCAD',
    toolSlug: 'autocad',
    format: 'STEP',
    canImport: true,
    canExport: false,
    commandRef: 'IMPORT: STEP (*.ste; *.stp; *.step); not listed in EXPORT',
    docSource: 'AutoCAD 2024 Help — IMPORT / EXPORT (Command)',
  },
  {
    id: 'autocad-iges',
    software: 'AutoCAD',
    toolSlug: 'autocad',
    format: 'IGES',
    canImport: true,
    canExport: true,
    commandRef: 'IGESIMPORT / IGESEXPORT: IGES (*.iges; *.igs)',
    docSource: 'AutoCAD 2024 Help — IMPORT / EXPORT (Command)',
  },
  {
    id: 'autocad-sat',
    software: 'AutoCAD',
    toolSlug: 'autocad',
    format: 'SAT',
    canImport: true,
    canExport: true,
    commandRef: 'ACISIN / ACISOUT: ACIS (*.sat)',
    docSource: 'AutoCAD 2024 Help — IMPORT / EXPORT (Command)',
  },
  {
    id: 'autocad-stl',
    software: 'AutoCAD',
    toolSlug: 'autocad',
    format: 'STL',
    canImport: false,
    canExport: true,
    commandRef: 'STLOUT: Lithography (*.stl); not listed in IMPORT',
    docSource: 'AutoCAD 2024 Help — IMPORT / EXPORT (Command)',
  },
  {
    id: 'autocad-pdf',
    software: 'AutoCAD',
    toolSlug: 'autocad',
    format: 'PDF',
    canImport: true,
    canExport: true,
    commandRef: 'PDFIMPORT / PLOT: Portable Document Format (*.pdf)',
    docSource: 'AutoCAD 2024 Help — IMPORT / EXPORT (Command)',
  },
  {
    id: 'rhino-dwg',
    software: 'Rhino 8',
    toolSlug: 'rhino',
    format: 'DWG',
    canImport: true,
    canExport: true,
    commandRef: 'Import & Export: AutoCAD Drawing (*.dwg)',
    docSource: 'McNeel Rhino 8 Help — Import/Export File Types',
  },
  {
    id: 'rhino-dxf',
    software: 'Rhino 8',
    toolSlug: 'rhino',
    format: 'DXF',
    canImport: true,
    canExport: true,
    commandRef: 'Import & Export: AutoCAD Drawing Exchange (*.dxf)',
    docSource: 'McNeel Rhino 8 Help — Import/Export File Types',
  },
  {
    id: 'rhino-step',
    software: 'Rhino 8',
    toolSlug: 'rhino',
    format: 'STEP',
    canImport: true,
    canExport: true,
    commandRef: 'Import & Export: STEP (*.stp; .*step)',
    docSource: 'McNeel Rhino 8 Help — Import/Export File Types',
  },
  {
    id: 'rhino-iges',
    software: 'Rhino 8',
    toolSlug: 'rhino',
    format: 'IGES',
    canImport: true,
    canExport: false,
    commandRef: 'Import list: IGES (*.igs; *.iges); not listed in Export list',
    docSource: 'McNeel Rhino 8 Help — Import/Export File Types',
  },
  {
    id: 'rhino-sat',
    software: 'Rhino 8',
    toolSlug: 'rhino',
    format: 'SAT',
    canImport: false,
    canExport: true,
    commandRef: 'Export list: ACIS (*.sat); not listed in Import list',
    docSource: 'McNeel Rhino 8 Help — Import/Export File Types',
  },
  {
    id: 'rhino-stl',
    software: 'Rhino 8',
    toolSlug: 'rhino',
    format: 'STL',
    canImport: true,
    canExport: true,
    commandRef: 'Import & Export: STL (Stereolithography) (*.stl)',
    docSource: 'McNeel Rhino 8 Help — Import/Export File Types',
  },
  {
    id: 'rhino-obj',
    software: 'Rhino 8',
    toolSlug: 'rhino',
    format: 'OBJ',
    canImport: true,
    canExport: true,
    commandRef: 'Import & Export: OBJ (*.obj)',
    docSource: 'McNeel Rhino 8 Help — Import/Export File Types',
  },
  {
    id: 'rhino-3mf',
    software: 'Rhino 8',
    toolSlug: 'rhino',
    format: '3MF',
    canImport: true,
    canExport: true,
    commandRef: 'Import & Export: 3MF (*.3mf)',
    docSource: 'McNeel Rhino 8 Help — Import/Export File Types',
  },
  {
    id: 'rhino-fbx',
    software: 'Rhino 8',
    toolSlug: 'rhino',
    format: 'FBX',
    canImport: true,
    canExport: true,
    commandRef: 'Import & Export: MotionBuilder (*.fbx)',
    docSource: 'McNeel Rhino 8 Help — Import/Export File Types',
  },
  {
    id: 'rhino-pdf',
    software: 'Rhino 8',
    toolSlug: 'rhino',
    format: 'PDF',
    canImport: true,
    canExport: true,
    commandRef: 'Import & Export: Portable Document Format (*.pdf)',
    docSource: 'McNeel Rhino 8 Help — Import/Export File Types',
  },
  {
    id: 'blender-obj',
    software: 'Blender',
    toolSlug: 'blender',
    format: 'OBJ',
    canImport: true,
    canExport: true,
    commandRef: 'File ‣ Import/Export ‣ Wavefront (.obj)',
    docSource: 'Blender Manual — Wavefront OBJ',
  },
  {
    id: 'blender-stl',
    software: 'Blender',
    toolSlug: 'blender',
    format: 'STL',
    canImport: true,
    canExport: true,
    commandRef: 'File ‣ Import/Export ‣ Stl (.stl)',
    docSource: 'Blender Manual — STL',
  },
  {
    id: 'blender-fbx',
    software: 'Blender',
    toolSlug: 'blender',
    format: 'FBX',
    canImport: true,
    canExport: true,
    commandRef: 'Importing & Exporting Files: FBX',
    docSource: 'Blender Manual — Importing & Exporting Files',
  },
  {
    id: 'blender-dxf',
    software: 'Blender',
    toolSlug: 'blender',
    format: 'DXF',
    canImport: true,
    canExport: true,
    commandRef: 'Add-ons » Import-Export » AutoCAD DXF (Import & Export)',
    docSource: 'Blender Manual — AutoCAD DXF Add-on',
  },
  {
    id: 'openscad-stl',
    software: 'OpenSCAD',
    toolSlug: 'openscad',
    format: 'STL',
    canImport: true,
    canExport: true,
    commandRef: 'import() & File --> Export as STL (ASCII and Binary)',
    docSource: 'OpenSCAD User Manual — STL Import and Export',
  },
  {
    id: 'openscad-dxf',
    software: 'OpenSCAD',
    toolSlug: 'openscad',
    format: 'DXF',
    canImport: true,
    canExport: true,
    commandRef: 'import() & File --> Export as DXF (2D geometry)',
    docSource: 'OpenSCAD User Manual — STL Import and Export',
  },
  {
    id: 'openscad-3mf',
    software: 'OpenSCAD',
    toolSlug: 'openscad',
    format: '3MF',
    canImport: true,
    canExport: true,
    commandRef: '3D geometry import & File --> Export as 3MF',
    docSource: 'OpenSCAD User Manual — STL Import and Export',
  },
  {
    id: 'openscad-obj',
    software: 'OpenSCAD',
    toolSlug: 'openscad',
    format: 'OBJ',
    canImport: true,
    canExport: false,
    commandRef: '3D geometry import: OBJ; not listed in File --> Export',
    docSource: 'OpenSCAD User Manual — STL Import and Export',
  },
];

type DirectionFilter = 'all' | 'both' | 'import-only' | 'export-only';

export default function CadFormatCompatibilityClient() {
  const [sourceFmt, setSourceFmt] = useState<SupportedFormat>('STEP');
  const [targetFmt, setTargetFmt] = useState<SupportedFormat>('STL');
  const [searchQuery, setSearchQuery] = useState('');
  const [softwareFilter, setSoftwareFilter] = useState<string>('All');
  const [formatFilter, setFormatFilter] = useState<string>('All');
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all');

  const handleReset = () => {
    setSourceFmt('STEP');
    setTargetFmt('STL');
    setSearchQuery('');
    setSoftwareFilter('All');
    setFormatFilter('All');
    setDirectionFilter('all');
  };

  // Directional bridge finder: tool must natively Import sourceFmt AND Export targetFmt
  const bridgeTools = useMemo(() => {
    return SOFTWARES.map((sw) => {
      const srcEntry = MATRIX_ROWS.find((r) => r.software === sw && r.format === sourceFmt);
      const dstEntry = MATRIX_ROWS.find((r) => r.software === sw && r.format === targetFmt);
      const ok = Boolean(srcEntry?.canImport && dstEntry?.canExport);
      return {
        software: sw,
        toolSlug: srcEntry?.toolSlug ?? dstEntry?.toolSlug ?? '',
        canBridge: ok,
        importRef: srcEntry?.commandRef ?? 'Not documented',
        exportRef: dstEntry?.commandRef ?? 'Not documented',
      };
    }).filter((item) => item.canBridge);
  }, [sourceFmt, targetFmt]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MATRIX_ROWS.filter((row) => {
      if (softwareFilter !== 'All' && row.software !== softwareFilter) return false;
      if (formatFilter !== 'All' && row.format !== formatFilter) return false;
      if (directionFilter === 'both' && !(row.canImport && row.canExport)) return false;
      if (directionFilter === 'import-only' && !(row.canImport && !row.canExport)) return false;
      if (directionFilter === 'export-only' && !(!row.canImport && row.canExport)) return false;
      if (q !== '') {
        const hay = `${row.software} ${row.format} ${row.commandRef} ${row.docSource}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, softwareFilter, formatFilter, directionFilter]);

  const handleExportCsv = () => {
    const lines = [
      '# Verified CAD File Format Compatibility Matrix',
      '# Standards: ISO 10303-21 (STEP) | Official Vendor Command Documentation (AutoCAD 2024, Rhino 8, Blender, OpenSCAD)',
      'Software,Format,Import_Supported,Export_Supported,Command_Or_Menu_Reference,Official_Source',
      ...filteredRows.map(
        (r) =>
          `"${r.software}","${r.format}","${r.canImport ? 'Yes' : 'No'}","${r.canExport ? 'Yes' : 'No'}","${r.commandRef.replace(/"/g, '""')}","${r.docSource.replace(/"/g, '""')}"`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cad-format-compatibility-matrix.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectCls =
    'w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Pipeline &amp; Filters</h2>
              <p className="text-xs text-slate-500 font-medium">Directional Import → Export lookup</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Source (Import)
              </label>
              <select
                data-testid="select-source-format"
                value={sourceFmt}
                onChange={(e) => setSourceFmt(e.target.value as SupportedFormat)}
                className={selectCls}
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Target (Export)
              </label>
              <select
                data-testid="select-target-format"
                value={targetFmt}
                onChange={(e) => setTargetFmt(e.target.value as SupportedFormat)}
                className={selectCls}
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  data-testid="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search command, format, software..."
                  className="w-full h-11 pl-10 pr-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Software
                </label>
                <select
                  data-testid="filter-software"
                  value={softwareFilter}
                  onChange={(e) => setSoftwareFilter(e.target.value)}
                  className={selectCls}
                >
                  <option value="All">All Software</option>
                  {SOFTWARES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Format
                </label>
                <select
                  data-testid="filter-format"
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className={selectCls}
                >
                  <option value="All">All Formats</option>
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Direction Support
              </label>
              <select
                data-testid="filter-direction"
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value as DirectionFilter)}
                className={selectCls}
              >
                <option value="all">All Verified Entries</option>
                <option value="both">Bidirectional (Import &amp; Export)</option>
                <option value="import-only">Import Only</option>
                <option value="export-only">Export Only</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              data-testid="reset-btn"
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="button"
              data-testid="export-csv-btn"
              onClick={handleExportCsv}
              disabled={filteredRows.length === 0}
              className="flex-1 py-3 rounded-xl text-sm font-black bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                Every entry is verified against official vendor command documentation (AutoCAD 2024 IMPORT/EXPORT, McNeel Rhino 8 File I/O Index, Blender Manual, and OpenSCAD User Manual).
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div data-testid="calculator-results" className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                <span data-testid="bridge-count">{bridgeTools.length}</span> Verified Bridge{' '}
                {bridgeTools.length === 1 ? 'Tool' : 'Tools'}: {sourceFmt} (Import) → {targetFmt} (Export)
              </h2>
            </div>

            {bridgeTools.length === 0 ? (
              <p data-testid="bridge-empty" className="text-sm text-slate-500 font-medium">
                No single verified software in this matrix natively imports {sourceFmt} and exports {targetFmt} in one step. Consider an intermediate format such as DXF or STEP.
              </p>
            ) : (
              <div data-testid="bridge-list" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bridgeTools.map((b) => (
                  <Link
                    key={b.software}
                    href={`/tools/${b.toolSlug}`}
                    data-testid={`bridge-card-${b.toolSlug}`}
                    className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100 hover:border-teal-300 transition-all block"
                  >
                    <div className="text-base font-black text-slate-900">{b.software}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      <span className="font-bold text-teal-700">In ({sourceFmt}):</span> {b.importRef}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      <span className="font-bold text-teal-700">Out ({targetFmt}):</span> {b.exportRef}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Official Format Support Matrix
              </h3>
              <span data-testid="matrix-row-count" className="text-xs font-black text-slate-500 uppercase">
                {filteredRows.length} {filteredRows.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table data-testid="matrix-table" className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3 pr-4">Software</th>
                    <th className="py-3 px-3">Format</th>
                    <th className="py-3 px-3 text-center">Import</th>
                    <th className="py-3 px-3 text-center">Export</th>
                    <th className="py-3 pl-3">Command / Menu Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                        No matching format entries found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id} data-testid={`matrix-row-${row.id}`} className="hover:bg-slate-50/70">
                        <td className="py-3 pr-4 font-black text-slate-900 whitespace-nowrap">
                          {row.software}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {row.format}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {row.canImport ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                              <XCircle className="w-3.5 h-3.5" /> No
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {row.canExport ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                              <XCircle className="w-3.5 h-3.5" /> No
                            </span>
                          )}
                        </td>
                        <td className="py-3 pl-3 text-xs text-slate-600">
                          <div className="font-semibold text-slate-800">{row.commandRef}</div>
                          <div className="text-[11px] text-slate-400">{row.docSource}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
