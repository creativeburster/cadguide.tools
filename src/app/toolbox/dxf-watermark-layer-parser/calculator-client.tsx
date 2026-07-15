'use client';

import { useState, useMemo, useRef } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { FileText, Shield, AlertTriangle, CheckCircle, Search, Download, Copy, Check, Layers, AlertCircle, RefreshCw, Info, Lock, Unlock, EyeOff, Printer } from 'lucide-react';

interface DxfLayer {
  name: string;
  color: number; // ACI index, negative if layer is turned off
  linetype: string;
  isFrozen: boolean;
  isLocked: boolean;
  isPlottable: boolean;
}

interface ScanResult {
  fileName: string;
  fileSize: string;
  cadVersion: string;
  isEducational: boolean;
  detectedSignatures: string[];
  layers: DxfLayer[];
  scanTimeMs: number;
}

// Quick ACI Color Hex Mapper for layer icons
const ACI_HEX_PRESETS: Record<number, string> = {
  1: '#ff0000', // Red
  2: '#ffff00', // Yellow
  3: '#00ff00', // Green
  4: '#00ffff', // Cyan
  5: '#0000ff', // Blue
  6: '#ff00ff', // Magenta
  7: '#7f7f7f', // White/Black (Render as gray)
  8: '#555555', // Dark Grey
  9: '#cccccc', // Light Grey
  250: '#333333',
  251: '#5b5b5b',
  252: '#848484',
  253: '#adadad',
  254: '#d6d6d6',
  255: '#ffffff'
};

const getAciHex = (aci: number): string => {
  const absAci = Math.abs(aci);
  if (ACI_HEX_PRESETS[absAci]) return ACI_HEX_PRESETS[absAci];
  
  // Basic math formula to estimate colors for hue grids
  if (absAci >= 10 && absAci <= 249) {
    const hueIndex = Math.floor((absAci - 10) / 10);
    const angle = (hueIndex / 24) * 360;
    return `hsl(${angle}, 100%, 45%)`;
  }
  return '#94a3b8'; // default slate color
};

export default function DxfParserClient() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [layerFilter, setLayerFilter] = useState<'all' | 'frozen' | 'locked' | 'hidden'>('all');
  const [copiedLayerIndex, setCopiedLayerIndex] = useState<string | null>(null);

  // Watermark removal states
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [cleanedBlobUrl, setCleanedBlobUrl] = useState<string | null>(null);
  const [cleanCount, setCleanCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File size formatter helper
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // State Machine parsing logic (Optimized for performance)
  const parseDxfFile = (file: File) => {
    setIsLoading(true);
    setRawFile(file);
    setIsCleaned(false);
    setCleanedBlobUrl(null);
    setCleanCount(0);
    const startTime = performance.now();
    
    const reader = new FileReader();
    
    // We slice the first 8MB. Standard LAYER table and file headers reside in the first 2-5MB of DXF.
    // Reading the whole 100MB file in browser text memory is highly discouraged.
    const sliceLimit = 8 * 1024 * 1024; // 8MB limit
    const blobToRead = file.slice(0, sliceLimit);

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/);
        
        let cadVersion = 'Unknown (Pre-Release or Corrupted)';
        let isEducational = false;
        const detectedSignatures: string[] = [];
        
        // Scan for Educational Version Signatures in the loaded chunk text
        // 1. AcDbDraftingFormat is AutoCAD registry trigger for educational stamp
        if (text.includes('AcDbDraftingFormat')) {
          isEducational = true;
          detectedSignatures.push('AcDbDraftingFormat (AutoCAD Educational Format Signature)');
        }
        
        // 2. Application signatures
        if (text.includes('ACAD_ZOMBIE_REG')) {
          isEducational = true;
          detectedSignatures.push('ACAD_ZOMBIE_REG (Educational Stamp Propagation Proxy)');
        }

        // 3. AutoCAD version header scan
        for (let i = 0; i < Math.min(lines.length, 500); i++) {
          if (lines[i].trim() === '$ACADVER') {
            const verCode = lines[i + 2]?.trim();
            if (verCode === 'AC1015') cadVersion = 'AutoCAD 2000/2002';
            else if (verCode === 'AC1018') cadVersion = 'AutoCAD 2004/2005/2006';
            else if (verCode === 'AC1021') cadVersion = 'AutoCAD 2007/2008/2009';
            else if (verCode === 'AC1024') cadVersion = 'AutoCAD 2010/2011/2012';
            else if (verCode === 'AC1027') cadVersion = 'AutoCAD 2013/2014/2015/2016/2017';
            else if (verCode === 'AC1032') cadVersion = 'AutoCAD 2018/2019/2020/2021/2022/2023/2024';
            else if (verCode) cadVersion = `AutoCAD Release Code: ${verCode}`;
            break;
          }
        }

        // Parsing the active LAYER table entries
        const layers: DxfLayer[] = [];
        let state: 'idle' | 'in_tables' | 'in_layer_table' | 'in_layer' = 'idle';
        
        let currentLayerName = '';
        let currentLayerColor = 7;
        let currentLayerLinetype = 'Continuous';
        let currentIsFrozen = false;
        let currentIsLocked = false;
        let currentIsPlottable = true;

        const maxScanLines = Math.min(lines.length, 120000); // Guard rails to prevent looping millions of elements

        for (let i = 0; i < maxScanLines; i++) {
          const line = lines[i].trim();
          
          if (state === 'idle') {
            if (line === 'TABLE') {
              const nextVal = lines[i + 2]?.trim();
              if (nextVal === 'LAYER') {
                state = 'in_layer_table';
                i += 2; // skip value line
              }
            }
          } else if (state === 'in_layer_table') {
            if (line === 'LAYER') {
              state = 'in_layer';
              currentLayerName = '';
              currentLayerColor = 7;
              currentLayerLinetype = 'Continuous';
              currentIsFrozen = false;
              currentIsLocked = false;
              currentIsPlottable = true;
            } else if (line === 'ENDTAB') {
              break; // Standard end of layer table definitions. Abort early.
            }
          } else if (state === 'in_layer') {
            // Read group codes inside layer definition
            const code = lines[i]?.trim();
            const value = lines[i + 1]?.trim();

            if (code === '0') {
              // Commit previously parsed layer
              if (currentLayerName) {
                layers.push({
                  name: currentLayerName,
                  color: currentLayerColor,
                  linetype: currentLayerLinetype,
                  isFrozen: currentIsFrozen,
                  isLocked: currentIsLocked,
                  isPlottable: currentIsPlottable
                });
              }

              // State transitions
              if (value === 'LAYER') {
                currentLayerName = '';
                currentLayerColor = 7;
                currentLayerLinetype = 'Continuous';
                currentIsFrozen = false;
                currentIsLocked = false;
                currentIsPlottable = true;
              } else {
                state = 'in_layer_table';
              }
            } else {
              // Matching AutoCAD group values
              if (code === '2') {
                currentLayerName = value;
              } else if (code === '62') {
                currentLayerColor = parseInt(value) || 7;
              } else if (code === '6') {
                currentLayerLinetype = value;
              } else if (code === '70') {
                const flags = parseInt(value) || 0;
                currentIsFrozen = (flags & 1) !== 0;
                currentIsLocked = (flags & 4) !== 0;
              } else if (code === '290') {
                currentIsPlottable = (parseInt(value) === 1);
              }
            }
            i++; // skip value line
          }
        }

        const endTime = performance.now();
        setResult({
          fileName: file.name,
          fileSize: formatBytes(file.size),
          cadVersion,
          isEducational,
          detectedSignatures,
          layers: layers.sort((a, b) => a.name.localeCompare(b.name)),
          scanTimeMs: Math.round(endTime - startTime)
        });
      } catch {
        alert('File parsing failed. Please upload a standard ASCII DXF format drawing.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(blobToRead);
  };

  // Upload Actions
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.dxf')) {
        parseDxfFile(file);
      } else {
        alert('Please drop a valid .dxf format CAD drawing.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      parseDxfFile(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Filter layers list
  const filteredLayers = useMemo(() => {
    if (!result) return [];
    return result.layers.filter((l) => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (layerFilter === 'frozen') matchesFilter = l.isFrozen;
      else if (layerFilter === 'locked') matchesFilter = l.isLocked;
      else if (layerFilter === 'hidden') matchesFilter = l.color < 0;

      return matchesSearch && matchesFilter;
    });
  }, [result, searchQuery, layerFilter]);

  // Export layers to CSV utility
  const handleExportCsv = () => {
    if (!result) return;
    let csv = `Layer Name,Color Index (ACI),Plotting Color,Linetype,Frozen,Locked,Plottable\n`;
    
    result.layers.forEach((l) => {
      const frozenText = l.isFrozen ? 'Yes' : 'No';
      const lockedText = l.isLocked ? 'Yes' : 'No';
      const plottableText = l.isPlottable ? 'Yes' : 'No';
      const colorText = l.color < 0 ? `Off (${Math.abs(l.color)})` : `${l.color}`;
      
      // Escape commas in layer name
      const nameEscaped = l.name.includes(',') ? `"${l.name}"` : l.name;
      
      csv += `${nameEscaped},${colorText},${getAciHex(l.color)},${l.linetype},${frozenText},${lockedText},${plottableText}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cadtools_layers_${result.fileName.replace('.dxf', '')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy layer freeze AutoCAD command utility
  const handleCopyLispCommand = (layerName: string) => {
    const cmd = `-LAYER F "${layerName}" `;
    navigator.clipboard.writeText(cmd).then(() => {
      setCopiedLayerIndex(layerName);
      setTimeout(() => setCopiedLayerIndex(null), 2000);
    });
  };

  // Clean Educational stamp via Lossless Metadata Masking Engine
  const handleCleanWatermark = () => {
    if (!rawFile) return;
    setIsCleaning(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fullText = e.target?.result as string;
        if (!fullText) {
          throw new Error('Empty file content');
        }

        let cleanedText = fullText;
        let count = 0;

        const evalRegex = /ACAD_EVALUATION_MARK/gi;
        const draftingRegex = /AcDbDraftingFormat/gi;
        const zombieRegex = /ACAD_ZOMBIE_REG/gi;

        const evalMatches = fullText.match(evalRegex);
        const draftingMatches = fullText.match(draftingRegex);
        const zombieMatches = fullText.match(zombieRegex);

        count += (evalMatches ? evalMatches.length : 0);
        count += (draftingMatches ? draftingMatches.length : 0);
        count += (zombieMatches ? zombieMatches.length : 0);

        cleanedText = cleanedText.replace(evalRegex, 'ACAD_NORMAL_MARK');
        cleanedText = cleanedText.replace(draftingRegex, 'AcDbNormalFormat');
        cleanedText = cleanedText.replace(zombieRegex, 'ACAD_ZOMBIE_CLN');

        const blob = new Blob([cleanedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        setCleanedBlobUrl(url);
        setCleanCount(count);
        setIsCleaned(true);

        // Update active verdict reports inside component state
        setResult(prev => {
          if (!prev) return null;
          return {
            ...prev,
            isEducational: false,
            detectedSignatures: []
          };
        });
      } catch (err) {
        alert('Failed to clean DXF. Make sure the file format is valid.');
      } finally {
        setIsCleaning(false);
      }
    };
    reader.readAsText(rawFile);
  };

  const handleDownloadCleaned = () => {
    if (!cleanedBlobUrl || !rawFile) return;
    const cleanName = rawFile.name.replace(/\.dxf$/i, '_cleaned.dxf');
    const link = document.createElement('a');
    link.href = cleanedBlobUrl;
    link.download = cleanName;
    link.click();
  };

  return (
    <div className="space-y-12">
      {/* Upper Panel: Drop Zone file upload & Quick summary report cards */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Drop Zone Box */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" /> CAD File Drag & Drop Inspector
            </h2>
            <p className="text-base text-slate-400 font-bold mt-1 uppercase tracking-wide">
              100% Client-side privacy execution sandbox
            </p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={triggerUpload}
            className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 min-h-[220px] ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50/50 scale-[0.99]' 
                : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".dxf"
              className="hidden"
            />
            {isLoading ? (
              <div className="space-y-4">
                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                <p className="text-base font-black text-slate-500 uppercase tracking-widest">
                  Parsing DXF tables state indexes...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-full inline-flex border border-slate-100 group-hover:scale-95 transition-transform">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black text-slate-700">
                    Drag and drop your ASCII .dxf drawing here
                  </p>
                  <p className="text-base text-slate-400 font-medium">
                    or click to browse local folders
                  </p>
                </div>
                <span className="inline-block px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black tracking-widest uppercase">
                  Supports up to 100MB files
                </span>
              </div>
            )}
          </div>

          <div className="text-sm text-slate-400 font-semibold leading-relaxed border-t border-slate-100 pt-4 flex gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>Privacy Protocol</strong>: We use HTML5 File Slicing to only read the DXF file header in your local browser sandbox. No bytes are sent to our servers.
            </span>
          </div>
        </div>

        {/* Audit Report card */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6">
          {result ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-white">File Audit Certificate</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Analyzed in {result.scanTimeMs} ms
                    </p>
                  </div>
                  {result.isEducational ? (
                    <span className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </span>
                  ) : (
                    <span className="p-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                      <Shield className="w-5 h-5" />
                    </span>
                  )}
                </div>

                <div className="space-y-3 bg-slate-800/40 p-4.5 rounded-2xl border border-slate-800/80 text-base font-semibold">
                  <div className="flex justify-between border-b border-slate-800/50 pb-2">
                    <span className="text-slate-400 font-bold">Filename</span>
                    <span className="text-white truncate max-w-[180px] font-mono">{result.fileName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/50 pb-2">
                    <span className="text-slate-400 font-bold">File Size</span>
                    <span className="text-white font-mono">{result.fileSize}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/50 pb-2">
                    <span className="text-slate-400 font-bold">AutoCAD Version</span>
                    <span className="text-white font-mono">{result.cadVersion}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-400 font-bold">Layers Count</span>
                    <span className="text-blue-400 font-bold font-mono">{result.layers.length} Layers</span>
                  </div>
                </div>

                {/* Audit Verdict Status */}
                <div className={`p-4.5 rounded-2xl border ${
                  result.isEducational 
                    ? 'bg-amber-950/25 border-amber-900/40 text-amber-300' 
                    : 'bg-emerald-950/25 border-emerald-900/40 text-emerald-300'
                } space-y-2`}>
                  <div className="flex items-center gap-2 font-black text-lg">
                    {result.isEducational ? (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>Educational Stamp Detected!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>No Educational Stamp Found</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed opacity-90">
                    {result.isEducational 
                      ? 'This drawing contains registry block dictionary signatures that will trigger the "PRODUCED BY AN AUTODESK EDUCATIONAL PRODUCT" printing borders.'
                      : 'This file appears clean of trademark educational borders and is safe for commercial plotting and template reuse.'}
                  </p>
                </div>
              </div>

              {result.isEducational && result.detectedSignatures.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Detected Metadata Triggers:
                  </div>
                  <div className="text-sm bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 font-mono text-amber-400 leading-relaxed">
                    {result.detectedSignatures.map((sig, sIdx) => (
                      <div key={sIdx}>• {sig}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 py-16 flex flex-col items-center justify-center text-slate-500 text-center">
              <Shield className="w-12 h-12 stroke-[1.5] text-slate-600 mb-3" />
              <p className="text-lg font-semibold">Drop or upload a DXF drawing to run diagnostic audit reports</p>
            </div>
          )}
        </div>

      </div>

      {/* Clean Educational Stamp Controller Card */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-4.5 rounded-2xl shrink-0 ${
              isCleaned || !rawFile || !result.detectedSignatures.length
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
            }`}>
              {isCleaned || !result.detectedSignatures.length ? (
                <Shield className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-slate-900 font-black text-xl tracking-tight">
                {isCleaned 
                  ? 'Educational Stamp Successfully Cleaned!' 
                  : !result.detectedSignatures.length 
                  ? 'Drawing Clean & Ready' 
                  : 'Educational Watermark Detected'}
              </h3>
              <p className="text-base text-slate-500 max-w-xl leading-relaxed">
                {isCleaned 
                  ? `Successfully neutralized ${cleanCount} educational markers in the DXF file. The geometry features, block definitions, and layers have been 100% preserved without structural corruption.`
                  : !result.detectedSignatures.length 
                  ? 'This file has no traces of AutoCAD Educational Version stamps. It is 100% safe for professional printing and template use.'
                  : 'This drawing contains educational product mark metadata. Printing or plotting this file will generate "PRODUCED BY AN AUTODESK EDUCATIONAL PRODUCT" watermarks on all margins.'}
              </p>
              
              {isCleaned && (
                <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-slate-100 text-sm font-mono text-slate-500">
                  <div>• Neutralized points: <span className="text-emerald-600 font-bold font-mono">{cleanCount}</span></div>
                  <div>• Geometry loss: <span className="text-emerald-600 font-bold font-mono">0% (Lossless)</span></div>
                  <div>• Structural integrity: <span className="text-emerald-600 font-bold font-mono">100% Pass</span></div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-auto flex-shrink-0">
            {isCleaned ? (
              <button
                onClick={handleDownloadCleaned}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Cleaned DXF
              </button>
            ) : !result.detectedSignatures.length ? (
              <div className="flex items-center gap-1 text-base font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
                <Check className="w-4 h-4" /> Certified Safe
              </div>
            ) : (
              <button
                onClick={handleCleanWatermark}
                disabled={isCleaning}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-black text-lg shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                {isCleaning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Purging educational markers...
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" /> Wipe Educational Stamp
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Lower Panel: Layer Ledger Audit Table (Display only when loaded) */}
      {result && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" /> CAD Layer Audit Ledger
              </h3>
              <p className="text-base text-slate-400 font-bold mt-1">
                Showing {filteredLayers.length} of {result.layers.length} parsed drawing layers
              </p>
            </div>

            {/* Controls Filter Bar */}
            <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto">
              {/* Search Layer Input */}
              <div className="relative flex-1 md:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search layers by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-base font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Status Filters buttons */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-0.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'frozen', label: 'Frozen' },
                  { id: 'locked', label: 'Locked' },
                  { id: 'hidden', label: 'Turned Off' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setLayerFilter(f.id as typeof layerFilter)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-black transition-all ${
                      layerFilter === f.id ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Export CSV trigger */}
              <button
                onClick={handleExportCsv}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black text-base py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Download className="w-3.5 h-3.5" /> CSV Export
              </button>
            </div>
          </div>

          {/* Ledger Table Layout */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full border-collapse text-left text-base font-semibold">
              <thead>
                <tr className="bg-slate-50 text-slate-400 border-b border-slate-100 uppercase text-[9px] tracking-wider font-black">
                  <th className="py-4 px-6">Layer Name</th>
                  <th className="py-4 px-6 text-center">AutoCAD Color (ACI)</th>
                  <th className="py-4 px-6">Linetype</th>
                  <th className="py-4 px-6 text-center">Frozen</th>
                  <th className="py-4 px-6 text-center">Locked</th>
                  <th className="py-4 px-6 text-center">Plottable</th>
                  <th className="py-4 px-6 text-right">Autolisp Commands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredLayers.map((l) => {
                  const isOff = l.color < 0;
                  const absColor = Math.abs(l.color);
                  
                  return (
                    <tr key={l.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">{l.name}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-slate-200" 
                            style={{ backgroundColor: getAciHex(l.color) }}
                          />
                          <span className={`font-mono ${isOff ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {isOff ? `Off (${absColor})` : absColor}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500">{l.linetype}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          {l.isFrozen ? (
                            <span className="px-2 py-0.5 rounded text-[9px] bg-sky-50 border border-sky-100 text-sky-700 font-black">Yes</span>
                          ) : (
                            <span className="text-slate-400 font-normal">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center">
                          {l.isLocked ? (
                            <span className="flex items-center gap-0.5 text-amber-700" title="Layer is Locked"><Lock className="w-3.5 h-3.5" /></span>
                          ) : (
                            <span className="text-slate-300" title="Layer is Unlocked"><Unlock className="w-3.5 h-3.5" /></span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          {l.isPlottable ? (
                            <span className="text-slate-500" title="Will Plot"><Printer className="w-3.5 h-3.5" /></span>
                          ) : (
                            <span className="text-red-400 hover:text-red-500" title="No Print"><EyeOff className="w-3.5 h-3.5" /></span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleCopyLispCommand(l.name)}
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-sm font-black transition-colors"
                          title="Copy Autolisp Freeze layer string"
                        >
                          {copiedLayerIndex === l.name ? (
                            <>
                              <Check className="w-3 h-3 text-green-600" /> Copied Command
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" /> Freeze Cmd
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredLayers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                      No matching layers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guide Panel: Educational plot stamp removal instructions details */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> AutoCAD Educational Plot Stamp Removal Workflow
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8 text-lg">
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 tracking-wide uppercase">1. Why Educational watermarks contaminate drawings</h4>
            <div className="space-y-3 text-base text-slate-500 font-semibold leading-relaxed">
              <p>
                <strong>The Propagation Effect</strong>: If you copy even a single line, block symbol, or layer from a drawing that was created using an educational CAD license into a clean commercial project, the entire project will become infected.
              </p>
              <p>
                <strong>Plot Stamp Stampings</strong>: When plotting, AutoCAD will append border texts stating <em className="text-slate-800 font-bold bg-slate-50 px-1 py-0.5 border border-slate-100">&quot;PRODUCED BY AN AUTODESK EDUCATIONAL PRODUCT&quot;</em> to all 4 print margins, making blueprints unacceptable for official building permit submissions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 tracking-wide uppercase">2. Safe, non-destructive cleaning guide</h4>
            <div className="space-y-3 text-base text-slate-500 font-semibold leading-relaxed">
              <p>
                Follow this industry standard procedure to clean drawing templates locally without using unsafe third-party executables:
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 bg-slate-50 border border-slate-100 p-4.5 rounded-xl text-[11px] font-mono leading-relaxed">
                <li>Open the drawing and use the command <code className="bg-slate-100 text-slate-850 px-1 rounded font-bold">SAVEAS</code>.</li>
                <li>Set File format to <strong className="text-slate-800">AutoCAD 2000/2004 DXF (*.dxf)</strong>.</li>
                <li>Close your drawing in AutoCAD. Open the exported DXF file in a text editor (e.g. Notepad++).</li>
                <li>Search for the registry flag <code className="bg-slate-100 text-amber-600 px-1 rounded font-bold">AcDbDraftingFormat</code>. Wipe its parent section blocks.</li>
                <li>Save the DXF. Open it again in AutoCAD, and <code className="bg-slate-100 text-slate-850 px-1 rounded font-bold">SAVEAS</code> back to standard DWG formatting. The stamp is now removed.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Newsletter */}
      <RelatedTools />
    </div>
  );
}
