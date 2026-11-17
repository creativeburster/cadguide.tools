'use client';

import React, { useMemo, useRef, useState } from 'react';
import { FileText, Search, Download, Copy, Check, Layers, EyeOff, Lock, Unlock, Printer, Info, RotateCcw } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

interface DxfLayer {
  name: string;
  color: number; // Group code 62 (negative if turned off)
  linetype: string; // Group code 6
  flags: number; // Group code 70 bit-coded flags
  isFrozen: boolean; // bit 1
  isLocked: boolean; // bit 4
  isPlottable: boolean; // Group code 290 (0 = do not plot, default 1)
}

interface ParseResult {
  fileName: string;
  fileSize: string;
  acadVerCode: string;
  cadVersionLabel: string;
  layers: DxfLayer[];
  scanTimeMs: number;
}

// Version labels verified against AutoCAD DXF Reference ($ACADVER)
const ACADVER_MAP: Record<string, string> = {
  AC1006: 'AutoCAD R10',
  AC1009: 'AutoCAD R11 / R12',
  AC1012: 'AutoCAD R13',
  AC1014: 'AutoCAD R14',
  AC1015: 'AutoCAD 2000',
  AC1018: 'AutoCAD 2004',
  AC1021: 'AutoCAD 2007',
  AC1024: 'AutoCAD 2010',
  AC1027: 'AutoCAD 2013',
  AC1032: 'AutoCAD 2018 (2018-2026 Format)',
};

// Standard ACI 1-9 and 250-255 preview colors (verified in AutoCAD Index Color & ezdxf)
const ACI_HEX_MAP: Record<number, string> = {
  1: '#FF0000',
  2: '#FFFF00',
  3: '#00FF00',
  4: '#00FFFF',
  5: '#0000FF',
  6: '#FF00FF',
  7: '#64748B',
  8: '#808080',
  9: '#C0C0C0',
  250: '#333333',
  251: '#5B5B5B',
  252: '#848484',
  253: '#ADADAD',
  254: '#D6D6D6',
  255: '#FFFFFF',
};

function getAciPreviewColor(colorCode: number): string {
  const abs = Math.abs(colorCode);
  return ACI_HEX_MAP[abs] || '#94A3B8';
}

const SAMPLE_ASCII_DXF = [
  '  0', 'SECTION',
  '  2', 'HEADER',
  '  9', '$ACADVER',
  '  1', 'AC1032',
  '  0', 'ENDSEC',
  '  0', 'SECTION',
  '  2', 'TABLES',
  '  0', 'TABLE',
  '  2', 'LAYER',
  '  0', 'LAYER',
  '  2', '0',
  ' 70', '0',
  ' 62', '7',
  '  6', 'Continuous',
  '290', '1',
  '  0', 'LAYER',
  '  2', 'A-WALL',
  ' 70', '0',
  ' 62', '1',
  '  6', 'Continuous',
  '290', '1',
  '  0', 'LAYER',
  '  2', 'A-ANNO-DIMS',
  ' 70', '4',
  ' 62', '3',
  '  6', 'Continuous',
  '290', '1',
  '  0', 'LAYER',
  '  2', 'DEFPOINTS',
  ' 70', '1',
  ' 62', '-8',
  '  6', 'Continuous',
  '290', '0',
  '  0', 'ENDTAB',
  '  0', 'ENDSEC',
  '  0', 'EOF',
].join('\n');

function parseDxfText(text: string, fileName: string, sizeLabel: string): ParseResult {
  const t0 = performance.now();
  const lines = text.split(/\r?\n/);

  let acadVerCode = 'Unknown';
  for (let i = 0; i < Math.min(lines.length - 2, 1000); i++) {
    if (lines[i].trim() === '$ACADVER' && lines[i + 1].trim() === '1') {
      acadVerCode = lines[i + 2].trim().toUpperCase();
      break;
    }
  }
  const cadVersionLabel = ACADVER_MAP[acadVerCode] || (acadVerCode === 'Unknown' ? 'Not Found ($ACADVER missing)' : `Release ${acadVerCode}`);

  const layers: DxfLayer[] = [];
  let state: 'idle' | 'in_layer_table' | 'in_layer' = 'idle';
  let name = '';
  let color = 7;
  let linetype = 'Continuous';
  let flags = 0;
  let isPlottable = true;

  const commitLayer = () => {
    if (!name) return;
    layers.push({
      name,
      color,
      linetype,
      flags,
      isFrozen: (flags & 1) !== 0,
      isLocked: (flags & 4) !== 0,
      isPlottable,
    });
  };

  for (let i = 0; i < Math.min(lines.length - 1, 200000); i++) {
    const code = lines[i].trim();
    const val = lines[i + 1]?.trim() ?? '';

    if (state === 'idle') {
      if (code === '0' && val === 'TABLE') {
        if (lines[i + 2]?.trim() === '2' && lines[i + 3]?.trim() === 'LAYER') {
          state = 'in_layer_table';
          i += 3;
          continue;
        }
      }
      i++;
    } else if (state === 'in_layer_table') {
      if (code === '0' && val === 'LAYER') {
        state = 'in_layer';
        name = '';
        color = 7;
        linetype = 'Continuous';
        flags = 0;
        isPlottable = true;
      } else if (code === '0' && val === 'ENDTAB') {
        break;
      }
      i++;
    } else if (state === 'in_layer') {
      if (code === '0') {
        commitLayer();
        if (val === 'LAYER') {
          name = '';
          color = 7;
          linetype = 'Continuous';
          flags = 0;
          isPlottable = true;
        } else if (val === 'ENDTAB') {
          break;
        } else {
          state = 'in_layer_table';
        }
      } else if (code === '2') {
        name = val;
      } else if (code === '62') {
        const parsed = parseInt(val, 10);
        if (!Number.isNaN(parsed)) color = parsed;
      } else if (code === '6') {
        linetype = val || 'Continuous';
      } else if (code === '70') {
        const parsed = parseInt(val, 10);
        if (!Number.isNaN(parsed)) flags = parsed;
      } else if (code === '290') {
        isPlottable = parseInt(val, 10) !== 0;
      }
      i++;
    }
  }

  return {
    fileName,
    fileSize: sizeLabel,
    acadVerCode,
    cadVersionLabel,
    layers,
    scanTimeMs: Math.max(1, Math.round(performance.now() - t0)),
  };
}

export default function DxfParserClient() {
  const [result, setResult] = useState<ParseResult>(() =>
    parseDxfText(SAMPLE_ASCII_DXF, 'sample_architecture.dxf', '0.5 KB (Built-in Sample)')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [layerFilter, setLayerFilter] = useState<'all' | 'frozen' | 'locked' | 'hidden' | 'nonplot'>('all');
  const [error, setError] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith('.dxf')) {
      setError('Please select a standard ASCII .dxf file.');
      return;
    }
    const sizeKb = file.size / 1024;
    const sizeLabel = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(2)} MB` : `${sizeKb.toFixed(1)} KB`;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = String(e.target?.result || '');
      if (!content.includes('SECTION')) {
        setError('This file does not appear to be an ASCII DXF drawing (binary DXF is not supported).');
        return;
      }
      setResult(parseDxfText(content, file.name, sizeLabel));
    };
    reader.onerror = () => setError('Failed to read local DXF file.');
    reader.readAsText(file.slice(0, 8 * 1024 * 1024));
  };

  const filteredLayers = useMemo(() => {
    return result.layers.filter((l) => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      if (!matchesSearch) return false;
      if (layerFilter === 'frozen') return l.isFrozen;
      if (layerFilter === 'locked') return l.isLocked;
      if (layerFilter === 'hidden') return l.color < 0;
      if (layerFilter === 'nonplot') return !l.isPlottable;
      return true;
    });
  }, [result.layers, searchQuery, layerFilter]);

  const stats = useMemo(() => {
    return {
      total: result.layers.length,
      frozen: result.layers.filter((l) => l.isFrozen).length,
      locked: result.layers.filter((l) => l.isLocked).length,
      off: result.layers.filter((l) => l.color < 0).length,
      nonPlot: result.layers.filter((l) => !l.isPlottable).length,
    };
  }, [result.layers]);

  const handleCopyCommand = async (layerName: string) => {
    const cmd = `-LAYER F "${layerName}" `;
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(layerName);
      setTimeout(() => setCopiedCmd(null), 1800);
    } catch {
      setCopiedCmd(null);
    }
  };

  const handleExportCsv = () => {
    const rows = [
      ['Layer Name', 'ACI Color Code (62)', 'On/Off State', 'Linetype (6)', 'Flags (70)', 'Frozen (Bit 1)', 'Locked (Bit 4)', 'Plottable (290)'],
      ...result.layers.map((l) => [
        l.name,
        String(Math.abs(l.color)),
        l.color < 0 ? 'Off' : 'On',
        l.linetype,
        String(l.flags),
        l.isFrozen ? 'Yes' : 'No',
        l.isLocked ? 'Yes' : 'No',
        l.isPlottable ? 'Yes' : 'No',
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      .replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dxf-layers-${result.acadVerCode}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadScript = () => {
    const thawLines = result.layers
      .filter((l) => l.name !== '0')
      .map((l) => `-LAYER ${l.color < 0 ? 'OFF' : 'ON'} "${l.name}"`)
      .join('\n');
    const scr = `; Read-only Audit Snapshot Script generated by CADGuide.tools\n; Source: ${result.fileName} (${result.acadVerCode})\n${thawLines}\n\n`;
    const asciiScr = scr.replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([asciiScr], { type: 'text/plain;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layer-state-snapshot.scr';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              ASCII DXF Header &amp; LAYER Table Inspector
            </h2>
            <button
              type="button"
              data-testid="btn-load-sample"
              onClick={() => {
                setError(null);
                setSearchQuery('');
                setLayerFilter('all');
                setResult(parseDxfText(SAMPLE_ASCII_DXF, 'sample_architecture.dxf', '0.5 KB (Built-in Sample)'));
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Load Sample DXF
            </button>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 text-center cursor-pointer transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              data-testid="input-dxf-file"
              accept=".dxf"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
              className="hidden"
            />
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-base font-black text-slate-800">Drop an ASCII .dxf file or click to inspect locally</p>
            <p className="text-xs text-slate-500 mt-1">Parses $ACADVER (Header) and LAYER group codes 2, 6, 62, 70, 290 read-only in browser memory.</p>
          </div>

          {error && (
            <div data-testid="validation-error" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black">DXF Table Audit Summary</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {result.fileName} ({result.fileSize})
                </p>
              </div>
              <span className="text-xs font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                $ACADVER: <span data-testid="result-acadver">{result.acadVerCode}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-slate-800/70 rounded-xl p-3">
                <div className="text-xs text-slate-400">Release Format</div>
                <div className="font-bold text-white" data-testid="result-release">{result.cadVersionLabel}</div>
              </div>
              <div className="bg-slate-800/70 rounded-xl p-3">
                <div className="text-xs text-slate-400">Total Layers</div>
                <div className="font-black text-blue-300 text-lg" data-testid="result-layer-count">{stats.total}</div>
              </div>
              <div className="bg-slate-800/70 rounded-xl p-3">
                <div className="text-xs text-slate-400">Off / Frozen / Locked</div>
                <div className="font-bold text-slate-200 font-mono" data-testid="result-flag-counts">
                  {stats.off} / {stats.frozen} / {stats.locked}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-3.5 text-xs text-slate-300 flex gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Read-only DXF parser per AutoCAD DXF LAYER Reference (62=Color, negative=Off; 70: bit 1=Frozen, bit 4=Locked; 290=0 Non-plottable). This tool does not strip educational plot stamps; follow official Autodesk workflow (DXFOUT/OPEN/SAVEAS in licensed AutoCAD) when authorized.
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              data-testid="input-layer-search"
              placeholder="Search layers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-semibold text-slate-800"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {([
              { id: 'all', label: 'All' },
              { id: 'frozen', label: 'Frozen' },
              { id: 'locked', label: 'Locked' },
              { id: 'hidden', label: 'Turned Off' },
              { id: 'nonplot', label: 'No-Plot' },
            ] as const).map((f) => (
              <button
                key={f.id}
                type="button"
                data-testid={`filter-${f.id}`}
                onClick={() => setLayerFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                  layerFilter === f.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              type="button"
              data-testid="export-scr-button"
              onClick={handleDownloadScript}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export .SCR
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-sm font-semibold">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="py-3 px-4">Layer Name (2)</th>
                <th className="py-3 px-4">ACI Color (62)</th>
                <th className="py-3 px-4">Linetype (6)</th>
                <th className="py-3 px-4 text-center">Frozen (70&amp;1)</th>
                <th className="py-3 px-4 text-center">Locked (70&amp;4)</th>
                <th className="py-3 px-4 text-center">Plottable (290)</th>
                <th className="py-3 px-4 text-right">-LAYER Cmd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" data-testid="layer-table-body">
              {filteredLayers.map((l) => (
                <tr key={l.name}>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{l.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 font-mono">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"
                        style={{ backgroundColor: getAciPreviewColor(l.color) }}
                      />
                      <span>{l.color < 0 ? `Off (${Math.abs(l.color)})` : l.color}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{l.linetype}</td>
                  <td className="py-3 px-4 text-center">{l.isFrozen ? 'Frozen' : '-'}</td>
                  <td className="py-3 px-4 text-center">
                    {l.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-600 inline" /> : <Unlock className="w-3.5 h-3.5 text-slate-300 inline" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {l.isPlottable ? <Printer className="w-3.5 h-3.5 text-slate-600 inline" /> : <EyeOff className="w-3.5 h-3.5 text-rose-500 inline" />}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      data-testid={`copy-layer-${l.name}`}
                      onClick={() => handleCopyCommand(l.name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-slate-700 cursor-pointer"
                    >
                      {copiedCmd === l.name ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedCmd === l.name ? 'Copied' : 'Freeze Cmd'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLayers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No layers match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
