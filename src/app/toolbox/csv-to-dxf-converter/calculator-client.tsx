'use client';

import { useState, useCallback, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Upload, Download, AlertTriangle, FileText, Settings } from 'lucide-react';

interface ParsedRow {
  x: number;
  y: number;
  z: number;
  label: string;
}

export default function CSVToDXFClient() {
  const [rawText, setRawText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [hasHeader, setHasHeader] = useState(true);
  const [colX, setColX] = useState(0);
  const [colY, setColY] = useState(1);
  const [colZ, setColZ] = useState(2);
  const [colLabel, setColLabel] = useState(-1);
  const [outputMode, setOutputMode] = useState<'points' | 'polyline' | 'both'>('both');
  const [layerName, setLayerName] = useState('SURVEY_POINTS');
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const parsedRows = useMemo((): ParsedRow[] => {
    if (!rawText.trim()) return [];
    const lines = rawText.trim().split(/\r?\n/);
    const startIdx = hasHeader ? 1 : 0;
    const rows: ParsedRow[] = [];

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(/[,;\t]/);
      const x = parseFloat(cols[colX] || '0');
      const y = parseFloat(cols[colY] || '0');
      const z = parseFloat(cols[colZ] || '0');
      const label = colLabel >= 0 ? (cols[colLabel] || `P${i - startIdx + 1}`) : `P${i - startIdx + 1}`;
      if (!isNaN(x) && !isNaN(y)) {
        rows.push({ x: x * scale, y: y * scale, z: z * scale, label });
      }
    }
    return rows;
  }, [rawText, hasHeader, colX, colY, colZ, colLabel, scale]);

  const detectedHeaders = useMemo(() => {
    if (!rawText.trim()) return [];
    const firstLine = rawText.trim().split(/\r?\n/)[0];
    return firstLine.split(/[,;\t]/).map(h => h.trim());
  }, [rawText]);

  const generateDXF = useCallback((): string => {
    const rows = parsedRows;
    if (rows.length === 0) return '';

    const dxf: string[] = [];

    // DXF Header
    dxf.push('0', 'SECTION', '2', 'HEADER');
    dxf.push('9', '$ACADVER', '1', 'AC1009');
    dxf.push('0', 'ENDSEC');

    // Tables Section
    dxf.push('0', 'SECTION', '2', 'TABLES');
    dxf.push('0', 'TABLE', '2', 'LAYER', '70', '1');
    dxf.push('0', 'LAYER', '2', layerName, '70', '0', '62', '7', '6', 'CONTINUOUS');
    dxf.push('0', 'ENDTAB');
    dxf.push('0', 'ENDSEC');

    // Entities Section
    dxf.push('0', 'SECTION', '2', 'ENTITIES');

    // Points
    if (outputMode === 'points' || outputMode === 'both') {
      for (const row of rows) {
        dxf.push(
          '0', 'POINT',
          '8', layerName,
          '10', row.x.toFixed(6),
          '20', row.y.toFixed(6),
          '30', row.z.toFixed(6),
        );
        // Add text label
        dxf.push(
          '0', 'TEXT',
          '8', layerName,
          '10', (row.x + 0.5).toFixed(6),
          '20', (row.y + 0.5).toFixed(6),
          '30', '0',
          '40', '1.0',
          '1', row.label,
        );
      }
    }

    // Polyline
    if (outputMode === 'polyline' || outputMode === 'both') {
      dxf.push(
        '0', 'POLYLINE',
        '8', layerName,
        '66', '1',
        '70', '0',
      );
      for (const row of rows) {
        dxf.push(
          '0', 'VERTEX',
          '8', layerName,
          '10', row.x.toFixed(6),
          '20', row.y.toFixed(6),
          '30', row.z.toFixed(6),
        );
      }
      dxf.push('0', 'SEQEND');
    }

    dxf.push('0', 'ENDSEC');
    dxf.push('0', 'EOF');

    return dxf.join('\n');
  }, [parsedRows, outputMode, layerName]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawText(reader.result as string);
        setFileName(file.name);
        setError(null);
      };
      reader.readAsText(file);
    } else {
      setError('Please drop a .csv file.');
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawText(reader.result as string);
        setFileName(file.name);
        setError(null);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleDownload = () => {
    const dxf = generateDXF();
    if (!dxf) {
      setError('No valid coordinate data found. Check your column mapping.');
      return;
    }
    const blob = new Blob([dxf], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.csv$/i, '') + '.dxf' || 'output.dxf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Side */}
        <div className="space-y-6">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
            onClick={() => document.getElementById('csv-file-input')?.click()}
          >
            <input id="csv-file-input" type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-lg font-black text-slate-900">Drop CSV file or click to browse</p>
              {fileName && <p className="text-base text-blue-600 font-bold">{fileName}</p>}
            </div>
          </div>

          {/* Manual Input */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Or paste CSV data here</label>
            <textarea
              value={rawText}
              onChange={e => { setRawText(e.target.value); setFileName(''); }}
              placeholder="Easting,Northing,Elevation,Label&#10;100.5,200.3,10.2,P1&#10;101.0,201.5,10.5,P2"
              rows={6}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-mono focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all resize-y"
            />
          </div>

          {/* Settings */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-black text-slate-900">Column Mapping</h3>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-base font-bold text-slate-600">First row is header</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'X (Easting) col', value: colX, set: setColX },
                { label: 'Y (Northing) col', value: colY, set: setColY },
                { label: 'Z (Elevation) col', value: colZ, set: setColZ },
                { label: 'Label col (-1=auto)', value: colLabel, set: setColLabel },
              ].map(item => (
                <div key={item.label}>
                  <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-1">{item.label}</label>
                  <input
                    type="number"
                    min={-1}
                    value={item.value}
                    onChange={e => item.set(parseInt(e.target.value) || 0)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                  />
                </div>
              ))}
            </div>

            {detectedHeaders.length > 0 && hasHeader && (
              <div className="flex flex-wrap gap-1.5">
                {detectedHeaders.map((h, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg text-sm font-bold bg-slate-50 text-slate-500 border border-slate-100">
                    Col {i}: {h}
                  </span>
                ))}
              </div>
            )}

            <div>
              <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-1">Output Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {(['points', 'polyline', 'both'] as const).map(m => (
                  <button key={m} onClick={() => setOutputMode(m)} className={`h-10 rounded-xl text-base font-black border transition-all ${outputMode === m ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                    {m === 'points' ? 'Points' : m === 'polyline' ? 'Polyline' : 'Both'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-1">Layer Name</label>
                <input type="text" value={layerName} onChange={e => setLayerName(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-1">Scale Factor</label>
                <input type="number" step="0.1" value={scale} onChange={e => setScale(parseFloat(e.target.value) || 1)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Output Side */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-lg font-bold text-red-700">{error}</p>
            </div>
          )}

          {/* Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">Data Preview</h3>
              </div>
              <span className="text-base font-bold text-slate-400">{parsedRows.length} points</span>
            </div>

            {parsedRows.length > 0 ? (
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-base">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">#</th>
                      <th className="text-right py-2 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">X</th>
                      <th className="text-right py-2 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">Y</th>
                      <th className="text-right py-2 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">Z</th>
                      <th className="text-left py-2 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">Label</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.slice(0, 100).map((row, i) => (
                      <tr key={i} className="border-b border-slate-50">
                        <td className="py-2 px-2 font-bold text-slate-400">{i + 1}</td>
                        <td className="py-2 px-2 text-right font-bold text-slate-700">{row.x.toFixed(3)}</td>
                        <td className="py-2 px-2 text-right font-bold text-slate-700">{row.y.toFixed(3)}</td>
                        <td className="py-2 px-2 text-right font-bold text-slate-700">{row.z.toFixed(3)}</td>
                        <td className="py-2 px-2 font-bold text-blue-600">{row.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedRows.length > 100 && <p className="text-center text-sm text-slate-400 py-2 font-bold">Showing first 100 of {parsedRows.length} rows</p>}
              </div>
            ) : (
              <p className="text-center text-slate-400 text-lg font-bold py-8">No data yet. Upload or paste CSV data.</p>
            )}
          </div>

          {/* Download */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <button
              onClick={handleDownload}
              disabled={parsedRows.length === 0}
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-lg font-black bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Download DXF File ({parsedRows.length} points)
            </button>
            <p className="text-sm text-slate-400 mt-3 font-medium text-center">
              Output: {outputMode === 'points' ? 'Points + Labels' : outputMode === 'polyline' ? 'Connected Polyline' : 'Points + Polyline'} on layer "{layerName}"
            </p>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
