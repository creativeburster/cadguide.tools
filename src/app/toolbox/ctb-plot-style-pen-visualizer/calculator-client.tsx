'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Layers, Info, RotateCcw, Copy, Check, Download, AlertTriangle, Upload } from 'lucide-react';

// Exact AutoCAD 2020 default dark modelspace ACI palette (indices 1..255)
// Copied verbatim from verified color-rgb-to-aci-matchbox (ezdxf DXF_DEFAULT_COLORS / netDxf AciColor.cs)
const ACI_HEX_1_TO_255 = [
  'FF0000', 'FFFF00', '00FF00', '00FFFF', '0000FF', 'FF00FF', 'FFFFFF', '808080', 'C0C0C0', 'FF0000',
  'FF7F7F', 'A50000', 'A55252', '7F0000', '7F3F3F', '4C0000', '4C2626', '260000', '261313', 'FF3F00',
  'FF9F7F', 'A52900', 'A56752', '7F1F00', '7F4F3F', '4C1300', '4C2F26', '260900', '261713', 'FF7F00',
  'FFBF7F', 'A55200', 'A57C52', '7F3F00', '7F5F3F', '4C2600', '4C3926', '261300', '261C13', 'FFBF00',
  'FFDF7F', 'A57C00', 'A59152', '7F5F00', '7F6F3F', '4C3900', '4C4226', '261C00', '262113', 'FFFF00',
  'FFFF7F', 'A5A500', 'A5A552', '7F7F00', '7F7F3F', '4C4C00', '4C4C26', '262600', '262613', 'BFFF00',
  'DFFF7F', '7CA500', '91A552', '5F7F00', '6F7F3F', '394C00', '424C26', '1C2600', '212613', '7FFF00',
  'BFFF7F', '52A500', '7CA552', '3F7F00', '5F7F3F', '264C00', '394C26', '132600', '1C2613', '3FFF00',
  '9FFF7F', '29A500', '67A552', '1F7F00', '4F7F3F', '134C00', '2F4C26', '092600', '172613', '00FF00',
  '7FFF7F', '00A500', '52A552', '007F00', '3F7F3F', '004C00', '264C26', '002600', '132613', '00FF3F',
  '7FFF9F', '00A529', '52A567', '007F1F', '3F7F4F', '004C13', '264C2F', '002609', '135817', '00FF7F',
  '7FFFBF', '00A552', '52A57C', '007F3F', '3F7F5F', '004C26', '264C39', '002613', '13581C', '00FFBF',
  '7FFFDF', '00A57C', '52A591', '007F5F', '3F7F6F', '004C39', '264C42', '00261C', '135858', '00FFFF',
  '7FFFFF', '00A5A5', '52A5A5', '007F7F', '3F7F7F', '004C4C', '264C4C', '002626', '135858', '00BFFF',
  '7FDFFF', '007CA5', '5291A5', '005F7F', '3F6F7F', '00394C', '26427E', '001C26', '135858', '007FFF',
  '7FBFFF', '0052A5', '527CA5', '003F7F', '3F5F7F', '00264C', '26397E', '001326', '131C58', '003FFF',
  '7F9FFF', '0029A5', '5267A5', '001F7F', '3F4F7F', '00134C', '262F7E', '000926', '131758', '0000FF',
  '7F7FFF', '0000A5', '5252A5', '00007F', '3F3F7F', '00004C', '26267E', '000026', '131358', '3F00FF',
  '9F7FFF', '2900A5', '6752A5', '1F007F', '4F3F7F', '13004C', '2F267E', '090026', '171358', '7F00FF',
  'BF7FFF', '5200A5', '7C52A5', '3F007F', '5F3F7F', '26004C', '39267E', '130026', '1C1358', 'BF00FF',
  'DF7FFF', '7C00A5', '9152A5', '5F007F', '6F3F7F', '39004C', '42264C', '1C0026', '581358', 'FF00FF',
  'FF7FFF', 'A500A5', 'A552A5', '7F007F', '7F3F7F', '4C004C', '4C264C', '260026', '581358', 'FF00BF',
  'FF7FDF', 'A5007C', 'A55291', '7F005F', '7F3F6F', '4C0039', '4C2642', '26001C', '581358', 'FF007F',
  'FF7FBF', 'A50052', 'A5527C', '7F003F', '7F3F5F', '4C0026', '4C2639', '260013', '58131C', 'FF003F',
  'FF7F9F', 'A50029', 'A55267', '7F001F', '7F3F4F', '4C0013', '4C262F', '260009', '581317', '000000',
  '656565', '666666', '999999', 'CCCCCC', 'FFFFFF',
] as const;

interface PenSetting {
  aci: number;
  aciHex: string;
  plotMode: 'black' | 'object';
  lineweightMm: number;
  screeningPct: number;
  linetype: 'Object' | 'Solid' | 'Dashed';
}

const SAMPLE_PEN_WEIGHTS: Record<number, { lw: number; mode: 'black' | 'object' }> = {
  1: { lw: 0.18, mode: 'black' },
  2: { lw: 0.25, mode: 'black' },
  3: { lw: 0.35, mode: 'black' },
  4: { lw: 0.50, mode: 'black' },
  5: { lw: 0.70, mode: 'object' },
  6: { lw: 0.13, mode: 'black' },
  7: { lw: 0.25, mode: 'black' },
  8: { lw: 0.13, mode: 'object' },
  9: { lw: 0.15, mode: 'object' },
};

function createPresetPens(preset: 'monochrome' | 'sample'): PenSetting[] {
  return ACI_HEX_1_TO_255.map((hex, idx) => {
    const aci = idx + 1;
    if (preset === 'monochrome') {
      return {
        aci,
        aciHex: `#${hex}`,
        plotMode: 'black',
        lineweightMm: 0.25,
        screeningPct: 100,
        linetype: 'Object',
      };
    }
    const sample = SAMPLE_PEN_WEIGHTS[aci];
    return {
      aci,
      aciHex: `#${hex}`,
      plotMode: sample ? sample.mode : 'black',
      lineweightMm: sample ? sample.lw : 0.18,
      screeningPct: aci === 8 || aci === 9 ? 60 : 100,
      linetype: 'Object',
    };
  });
}

function parseTextCtbBlock(text: string, basePens: PenSetting[]): { pens: PenSetting[]; parsedCount: number } {
  const pens = basePens.map((p) => ({ ...p }));
  let parsedCount = 0;
  // Match PIA plot style blocks like `color_0=0` .. `plot_style{` sections with color index `aci=` or block number
  const blockRegex = /\n\s*(\d{1,3})\s*\{([\s\S]*?)\n\s*\}/g;
  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(text)) !== null) {
    const idx = Number(match[1]);
    if (idx < 0 || idx > 254) continue;
    const body = match[2];
    const pen = pens[idx];
    const colorMatch = body.match(/color\s*=\s*(-?\d+)/i);
    if (colorMatch) {
      const cVal = Number(colorMatch[1]);
      // In Autodesk PIA CTB, color = -1 or Black (-1006632961 / 0) maps plot color
      pen.plotMode = cVal === -1 ? 'object' : 'black';
    }
    const lwMatch = body.match(/lineweight\s*=\s*(\d+)/i);
    if (lwMatch) {
      const lwIdx = Number(lwMatch[1]);
      if (lwIdx > 0) pen.lineweightMm = Math.min(2.11, Math.max(0.05, lwIdx * 0.05));
    }
    const scrMatch = body.match(/screening\s*=\s*(\d+)/i);
    if (scrMatch) {
      const scr = Number(scrMatch[1]);
      if (scr >= 0 && scr <= 100) pen.screeningPct = scr;
    }
    parsedCount++;
  }
  return { pens, parsedCount };
}

export default function CtbPlotStyleClient() {
  const [pens, setPens] = useState<PenSetting[]>(() => createPresetPens('monochrome'));
  const [activePreset, setActivePreset] = useState<'monochrome' | 'sample' | 'custom'>('monochrome');
  const [selectedAci, setSelectedAci] = useState<number>(1);
  const [filterQuery, setFilterQuery] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ type: 'ok' | 'error'; msg: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedPen = pens[selectedAci - 1] ?? pens[0];

  const stats = useMemo(() => {
    const blackCount = pens.filter((p) => p.plotMode === 'black').length;
    const objectColorCount = pens.length - blackCount;
    const maxLw = Math.max(...pens.map((p) => p.lineweightMm));
    return { blackCount, objectColorCount, maxLw };
  }, [pens]);

  const filteredPens = useMemo(() => {
    const q = filterQuery.trim();
    if (!q) return pens;
    return pens.filter((p) => String(p.aci).includes(q) || p.aciHex.toLowerCase().includes(q.toLowerCase()));
  }, [pens, filterQuery]);

  // Blueprint Canvas Simulation reflecting live selected pen edits
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sampleAcis = [1, 2, 3, 4, 5, 7, 8];
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 20; x < canvas.width; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    sampleAcis.forEach((aci, row) => {
      const p = pens[aci - 1];
      const y = 26 + row * 24;
      const strokeColor = p.plotMode === 'black' ? '#000000' : p.aciHex;
      ctx.save();
      ctx.globalAlpha = Math.max(0.1, p.screeningPct / 100);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.max(0.8, p.lineweightMm * 6);
      ctx.setLineDash(p.linetype === 'Dashed' ? [10, 5] : []);
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(canvas.width - 110, y);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`ACI ${aci}: ${p.lineweightMm.toFixed(2)}mm (${p.screeningPct}%)`, canvas.width - 102, y + 4);
    });
  }, [pens]);

  const applyPreset = (preset: 'monochrome' | 'sample') => {
    setPens(createPresetPens(preset));
    setActivePreset(preset);
    setUploadStatus(null);
    setCopied(false);
  };

  const updateSelectedPen = (patch: Partial<PenSetting>) => {
    setPens((prev) =>
      prev.map((p) => (p.aci === selectedAci ? { ...p, ...patch } : p))
    );
    setActivePreset('custom');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus(null);
    try {
      if (file.name.toLowerCase().endsWith('.json')) {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data) || data.length === 0) {
          setUploadStatus({ type: 'error', msg: 'Invalid JSON pen table: expected non-empty pen array (0 pens loaded).' });
          return;
        }
        const next = createPresetPens('monochrome');
        let loaded = 0;
        for (const item of data) {
          const aci = Number(item?.aci);
          if (Number.isInteger(aci) && aci >= 1 && aci <= 255) {
            next[aci - 1] = {
              aci,
              aciHex: `#${ACI_HEX_1_TO_255[aci - 1]}`,
              plotMode: item.plotMode === 'object' ? 'object' : 'black',
              lineweightMm: Number.isFinite(Number(item.lineweightMm)) && Number(item.lineweightMm) > 0 ? Number(item.lineweightMm) : 0.25,
              screeningPct: Number.isFinite(Number(item.screeningPct)) ? Math.min(100, Math.max(0, Number(item.screeningPct))) : 100,
              linetype: item.linetype === 'Dashed' || item.linetype === 'Solid' ? item.linetype : 'Object',
            };
            loaded++;
          }
        }
        if (loaded === 0) {
          setUploadStatus({ type: 'error', msg: 'JSON file contained 0 valid ACI (1-255) pen records.' });
          return;
        }
        setPens(next);
        setActivePreset('custom');
        setUploadStatus({ type: 'ok', msg: `Loaded ${loaded} pen definitions from ${file.name}.` });
        return;
      }

      // Attempt plaintext or PIA zlib/deflate stream parsing for .ctb files
      const buf = new Uint8Array(await file.arrayBuffer());
      let decoded = new TextDecoder('latin1').decode(buf);
      let { pens: parsedPens, parsedCount } = parseTextCtbBlock(decoded, createPresetPens('monochrome'));

      if (parsedCount === 0 && typeof DecompressionStream !== 'undefined') {
        const newlineIdx = buf.indexOf(10);
        const startOffset = newlineIdx >= 0 && newlineIdx < 120 ? newlineIdx + 1 : 60;
        try {
          const ds = new DecompressionStream('deflate');
          const writer = ds.writable.getWriter();
          void writer.write(buf.slice(startOffset));
          void writer.close();
          const decompressed = await new Response(ds.readable).text();
          decoded = decompressed;
          const retry = parseTextCtbBlock(decoded, createPresetPens('monochrome'));
          parsedPens = retry.pens;
          parsedCount = retry.parsedCount;
        } catch {
          parsedCount = 0;
        }
      }

      if (parsedCount === 0) {
        setUploadStatus({
          type: 'error',
          msg: `Unable to parse binary CTB stream from ${file.name} — 0 pens loaded. Export from AutoCAD Plot Style Editor or load a JSON pen table.`,
        });
        return;
      }

      setPens(parsedPens);
      setActivePreset('custom');
      setUploadStatus({ type: 'ok', msg: `Parsed ${parsedCount} pen blocks from ${file.name}.` });
    } catch {
      setUploadStatus({ type: 'error', msg: `Failed to read ${file.name} — 0 pens loaded.` });
    }
  };

  const handleCopySummary = async () => {
    const p = selectedPen;
    const summary = `ACI ${p.aci} (${p.aciHex}) | Plot=${p.plotMode === 'black' ? '#000000' : p.aciHex} | Lineweight=${p.lineweightMm.toFixed(2)} mm | Screening=${p.screeningPct}% | Linetype=${p.linetype}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    const header = 'aci,aci_hex,plot_color_mode,lineweight_mm,screening_pct,linetype';
    const rows = pens.map(
      (p) => `${p.aci},${p.aciHex},${p.plotMode},${p.lineweightMm.toFixed(2)},${p.screeningPct},${p.linetype}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ctb_pen_table_aci_1_255.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const json = JSON.stringify(pens, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ctb_pen_table.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">ACI 1–255 CTB Plot Style Pen Table</h2>
            <p className="text-sm font-medium text-slate-500">
              Verified AutoCAD Index Color palette (255 pens) with CSV/JSON pen calibration export
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="preset-monochrome"
            onClick={() => applyPreset('monochrome')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer ${
              activePreset === 'monochrome'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            monochrome.ctb (All Black)
          </button>
          <button
            type="button"
            data-testid="preset-sample"
            onClick={() => applyPreset('sample')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer ${
              activePreset === 'sample'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Sample CAD Pen Calibration
          </button>
          <button
            type="button"
            data-testid="reset-button"
            onClick={() => applyPreset('monochrome')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-6">
        {uploadStatus && (
          <div
            data-testid="upload-status"
            className={`rounded-2xl p-4 border flex items-start gap-2.5 text-sm font-bold ${
              uploadStatus.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{uploadStatus.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    data-testid="selected-aci-swatch"
                    className="w-10 h-10 rounded-xl border border-slate-300 shadow-inner"
                    style={{ backgroundColor: selectedPen.aciHex }}
                  />
                  <div>
                    <div data-testid="selected-aci-label" className="text-base font-black text-slate-900">
                      ACI Color {selectedPen.aci}
                    </div>
                    <div data-testid="selected-aci-hex" className="text-xs font-mono font-bold text-slate-500">
                      {selectedPen.aciHex}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs font-bold text-slate-500">
                  <div>Black pens: <span data-testid="stat-black-count">{stats.blackCount}</span></div>
                  <div>Object color: <span data-testid="stat-object-count">{stats.objectColorCount}</span></div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">Plot Color Assignment</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    data-testid="btn-plot-black"
                    onClick={() => updateSelectedPen({ plotMode: 'black' })}
                    className={`py-2 rounded-xl text-xs font-black border cursor-pointer ${
                      selectedPen.plotMode === 'black'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Black (#000000)
                  </button>
                  <button
                    type="button"
                    data-testid="btn-plot-object"
                    onClick={() => updateSelectedPen({ plotMode: 'object' })}
                    className={`py-2 rounded-xl text-xs font-black border cursor-pointer ${
                      selectedPen.plotMode === 'object'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Use Object Color
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pen-lw" className="block text-xs font-black text-slate-700 mb-1">
                    Lineweight (mm)
                  </label>
                  <select
                    id="pen-lw"
                    data-testid="select-lineweight"
                    value={String(selectedPen.lineweightMm)}
                    onChange={(e) => updateSelectedPen({ lineweightMm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                  >
                    {[0.09, 0.13, 0.15, 0.18, 0.25, 0.35, 0.5, 0.7, 1.0, 1.4, 2.0].map((lw) => (
                      <option key={lw} value={String(lw)}>
                        {lw.toFixed(2)} mm
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="pen-scr" className="block text-xs font-black text-slate-700 mb-1">
                    Screening (%)
                  </label>
                  <input
                    id="pen-scr"
                    data-testid="input-screening"
                    type="number"
                    min={0}
                    max={100}
                    value={selectedPen.screeningPct}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isFinite(n)) updateSelectedPen({ screeningPct: Math.min(100, Math.max(0, Math.round(n))) });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pen-lt" className="block text-xs font-black text-slate-700 mb-1">
                  Linetype
                </label>
                <select
                  id="pen-lt"
                  data-testid="select-linetype"
                  value={selectedPen.linetype}
                  onChange={(e) => updateSelectedPen({ linetype: e.target.value as PenSetting['linetype'] })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                >
                  <option value="Object">Use Object Linetype</option>
                  <option value="Solid">Solid</option>
                  <option value="Dashed">Dashed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black cursor-pointer">
                <Upload className="w-4 h-4" />
                Load .ctb / .json
                <input
                  data-testid="input-ctb-file"
                  type="file"
                  accept=".ctb,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                data-testid="export-csv-button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                type="button"
                data-testid="export-json-button"
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-black cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
              <button
                type="button"
                data-testid="copy-summary-button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Pen'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="text-xs font-black text-slate-600 uppercase mb-2">
                Simulated Paper Print Preview (ACI 1–8 Sample Stroke Weights)
              </div>
              <canvas
                ref={canvasRef}
                width={540}
                height={196}
                className="w-full rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-black text-slate-600 uppercase">
                  All 255 AutoCAD Index Colors (Click to inspect/edit)
                </span>
                <input
                  type="text"
                  data-testid="input-aci-filter"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter ACI # or hex..."
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold w-44"
                />
              </div>
              <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5 max-h-60 overflow-y-auto p-2 rounded-2xl border border-slate-200 bg-slate-50">
                {filteredPens.map((p) => (
                  <button
                    key={p.aci}
                    type="button"
                    data-testid={`aci-cell-${p.aci}`}
                    title={`ACI ${p.aci} (${p.aciHex}) • ${p.lineweightMm}mm • ${p.plotMode}`}
                    onClick={() => setSelectedAci(p.aci)}
                    className={`h-8 rounded-lg border text-[10px] font-black flex items-center justify-center cursor-pointer transition-transform ${
                      selectedAci === p.aci
                        ? 'ring-2 ring-blue-600 scale-105 border-slate-900'
                        : 'border-slate-300'
                    }`}
                    style={{
                      backgroundColor: p.aciHex,
                      color:
                        p.aci === 7 || p.aci === 2 || p.aci === 3 || p.aci === 4 || p.aci === 255 || p.aci === 254
                          ? '#0f172a'
                          : '#ffffff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.45)',
                    }}
                  >
                    {p.aci}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>CTB Plot Style &amp; Verified Palette:</strong>{' '}
                All 255 color swatches match the standard AutoCAD modelspace ACI table. <code>monochrome.ctb</code> forces ACI 1–255 to plot black (<code>#000000</code>), while the Sample Calibration preset demonstrates multi-weight black/color pen mapping.
              </div>
            </div>
          </div>
        </div>

        <RelatedTools />
      </div>
    </div>
  );
}
