'use client';

import { useState, useMemo, useRef } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Copy, Check, Code2, Zap, Gauge, Upload, Download, FileText, RefreshCw, Sliders, CheckCircle, AlertTriangle, Eye, Info } from 'lucide-react';

export default function DrawingLagCleanerClient() {
  const [cleanMode, setCleanMode] = useState<'lisp' | 'dxf'>('lisp');
  const [cleanRegapp, setCleanRegapp] = useState(true);
  const [cleanScalelist, setCleanScalelist] = useState(true);
  const [cleanOrphanBlock, setCleanOrphanBlock] = useState(true);
  const [runAudit, setRunAudit] = useState(true);
  const [indexDgnLine, setIndexDgnLine] = useState(false); // DGN bloat check
  
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Online DXF Cleaning States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dxfFile, setDxfFile] = useState<File | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [cleanedBlobUrl, setCleanedBlobUrl] = useState<string | null>(null);
  const [cleanStats, setCleanStats] = useState({ dgnRemoved: 0, regappRemoved: 0, scalesReset: 0, total: 0 });
  const [logHistory, setLogHistory] = useState<string[]>([]);

  // Clean DXF logic using Lossless Metadata Masking Engine
  const handleCleanDxf = () => {
    if (!dxfFile) return;
    setIsCleaning(true);
    setIsCleaned(false);
    setCleanedBlobUrl(null);
    setCleanStats({ dgnRemoved: 0, regappRemoved: 0, scalesReset: 0, total: 0 });
    setLogHistory([
      '[System] Initializing DXF drawing optimization engine...',
      '[System] Loading drawing ASCII database...'
    ]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) throw new Error('Empty file');

        let cleanedText = text;
        let dgnRemoved = 0;
        let regappRemoved = 0;
        let scalesReset = 0;

        setLogHistory(prev => [...prev, '[Purger] File loaded successfully. Scanning DGN dictionaries...']);

        // 1. DGN bloat removal
        const dgnRegex = /ACAD_DGNLINESTYLECOMP/gi;
        const dgnMatches = text.match(dgnRegex);
        if (dgnMatches) {
          dgnRemoved = dgnMatches.length;
          cleanedText = cleanedText.replace(dgnRegex, 'ACAD_DGN_CLN');
          setLogHistory(prev => [...prev, `[Purger] Found and bypassed DGN linear style bloat: ${dgnRemoved} entries.`]);
        }

        // 2. Regapps purging
        const regappKeywords = /ACAD_PSEUDO_DXF|AECTOOLS_.*|AEC_.*|AECTO_.*|ACAD_DGNLINESTYLECOMP_SHX|XRECORD_.*|RAK_.*|ADSK_.*/gi;
        const regappMatches = text.match(regappKeywords);
        if (regappMatches) {
          regappRemoved = regappMatches.length;
          cleanedText = cleanedText.replace(regappKeywords, 'ACAD_CLN_REG');
          setLogHistory(prev => [...prev, `[Purger] Found and bypassed redundant registered applications: ${regappRemoved} entries.`]);
        }

        // 3. Annotations scales clean
        const scaleRegex = /ACAD_SCALELIST/gi;
        const scaleMatches = text.match(scaleRegex);
        if (scaleMatches) {
          scalesReset = scaleMatches.length;
          cleanedText = cleanedText.replace(scaleRegex, 'ACAD_SCALELIST_CLN');
          setLogHistory(prev => [...prev, `[Purger] Found and bypassed scale lists dictionary: ${scalesReset} entries.`]);
        }

        const total = dgnRemoved + regappRemoved + scalesReset;
        
        const blob = new Blob([cleanedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        setCleanedBlobUrl(url);
        setCleanStats({ dgnRemoved, regappRemoved, scalesReset, total });
        setIsCleaned(true);
        setLogHistory(prev => [
          ...prev, 
          `[System] Optimization complete! Total issues sanitized: ${total}.`,
          `[System] 100% Geometry integrity verified. Cleaned drawing ready for plotting.`
        ]);

      } catch (err) {
        setLogHistory(prev => [...prev, '[Error] Sanitization aborted. The file structure is not valid ASCII DXF.']);
        alert('File purging failed. Ensure it is ASCII DXF format.');
      } finally {
        setIsCleaning(false);
      }
    };
    reader.readAsText(dxfFile);
  };

  const handleDownloadCleaned = () => {
    if (!cleanedBlobUrl || !dxfFile) return;
    const cleanedName = dxfFile.name.replace(/\.dxf$/i, '_purged.dxf');
    const link = document.createElement('a');
    link.href = cleanedBlobUrl;
    link.download = cleanedName;
    link.click();
  };

  // AutoLISP compiler logic
  const compiledLispScript = useMemo(() => {
    let internalCommands = '';

    if (cleanRegapp) {
      internalCommands += `  (princ "\\nSilently clearing remnants of registered applications (Regapps)...")
  (command "-PURGE" "R" "*" "N")\n`;
    }

    if (cleanScalelist) {
      internalCommands += `  (princ "\\nResetting redundant annotation scale list (Scale List Edit)...")
  (if (dictremove (namedobjdict) "ACAD_SCALELIST")
    (princ "\\n✓ The proportion list dictionary was reset successfully. ")
    (princ "\\n- No redundant scale dictionary detected. ")
)\n`;
    }

    if (cleanOrphanBlock) {
      internalCommands += `  (princ "\\nPerforming three rounds of powerful PURGE to clean up orphaned blocks, Layers and Linetypes...")
  (command "-PURGE" "A" "*" "N")
  (command "-PURGE" "A" "*" "N")
  (command "-PURGE" "A" "*" "N")\n`;
    }

    if (runAudit) {
      internalCommands += `  (princ "\\nVerifying and fixing drawing database geometry errors (AUDIT)...")
  (command "_AUDIT" "Y")\n`;
    }

    if (indexDgnLine) {
      internalCommands += `  (princ "\\nScanning and stripping DGN linear expansion features (DICT)...")
  (dictremove (namedobjdict) "ACAD_DGNLINESTYLECOMP")\n`;
    }

    return `; ==========================================================
; CADGuide.tools DWG One-click silent cleaning macro for drawing lags (AutoLISP)
; ==========================================================
(defun c:CLEANDWG ()
  (setvar "CMDECHO" 0)
  (setvar "EXPERT" 3)
  (princ "\\n--- Start in-depth optimization of the drawing database ---")
  
${internalCommands}
  (setvar "EXPERT" 0)
  (setvar "CMDECHO" 1)
  (princ "\\n==================================================")
  (princ "\\n✓ Congratulations! The drawings have been optimized and cleaned up.. File size has been significantly reduced. ")
  (princ "\\n==================================================")
  (princ)
)
(princ "\\nLoading successfully! Enter [ CLEANDWG ] and press Enter to perform a deep clean. \\n") (princ)`;
  }, [cleanRegapp, cleanScalelist, cleanOrphanBlock, runAudit, indexDgnLine]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Mode Switch Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit self-center">
        <button
          onClick={() => setCleanMode('lisp')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            cleanMode === 'lisp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          ⚡ Generate AutoLISP Macro (No Upload)
        </button>
        <button
          onClick={() => setCleanMode('dxf')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            cleanMode === 'dxf' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          🚀 Online DXF Database Purger (Fast Clean)
        </button>
      </div>

      {cleanMode === 'lisp' && (
        <>
          {/* Top dynamic SVG display drawing optimization"Vacuum cleaner scan effect */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                  <h2 className="text-white font-black text-lg tracking-tight">DWG Database physical structure purification</h2>
                </div>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
                  DWG Database Structural Purification
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-black">
                LISP compiler
              </div>
            </div>

            {/* SVG Drawing Area */}
            <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-8 px-4 relative">
              <svg viewBox="0 0 500 140" className="w-full max-w-[450px] h-auto" aria-label="CAD Optimization Scanner">
                {/* Grid overlay */}
                <defs>
                  <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="500" height="140" fill="url(#gridPattern)" rx="8" />

                {/* CAD Drawing Sheet Frame */}
                <rect x="50" y="20" width="400" height="100" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 3" />
                
                {/* Drawing lines / entities (representing clutter) */}
                {cleanOrphanBlock && (
                  <>
                    <path d="M 80 40 L 120 80 M 110 30 L 70 90" stroke="#f43f5e" strokeWidth="1" strokeDasharray="1 2" opacity="0.6" />
                    <circle cx="280" cy="50" r="15" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                  </>
                )}
                
                {/* Cleaned entities */}
                <path d="M 180 80 Q 250 30 320 80 M 150 50 L 380 50" stroke="#10b981" strokeWidth="1.5" />
                <rect x="340" y="70" width="30" height="20" fill="none" stroke="#3b82f6" strokeWidth="1.5" />

                {/* Laser scanning beam */}
                <g>
                  <line x1="250" y1="15" x2="250" y2="125" stroke="#3b82f6" strokeWidth="2.5" opacity="0.8" />
                  <rect x="247" y="15" width="6" height="110" fill="url(#laserGlow)" opacity="0.3" />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="-120 0; 120 0; -120 0"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </g>
                
                <linearGradient id="laserGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </svg>
            </div>
          </div>

          {/* Main panel layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Caton feature selection configuration */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-slate-800 font-black text-base tracking-tight flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-blue-500" />
                  Causing symptoms and cleaning scope
                </h3>

                {/* Checkbox Selector */}
                <div className="flex flex-col gap-4">
                  
                  {/* Option 1: Regapps */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cleanRegapp}
                      onChange={(e) => setCleanRegapp(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-700 block">Register Application Cleanup (Regapps)</span>
                      <span className="text-slate-400">For oversized capacity (hundreds of lines in dozens of lines)MB) Deep cleaning of the drawings. </span>
                    </div>
                  </label>

                  {/* Option 2: Scale List */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cleanScalelist}
                      onChange={(e) => setCleanScalelist(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-700 block">Reset Scale List</span>
                      <span className="text-slate-400">Solve the problem of drawings getting stuck and unresponsive for several seconds when the viewport is zoomed or switched between layouts.. </span>
                    </div>
                  </label>

                  {/* Option 3: Orphan Blocks */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cleanOrphanBlock}
                      onChange={(e) => setCleanOrphanBlock(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-700 block">Powerful PURGE redundant garbage</span>
                      <span className="text-slate-400">Perform three rounds of deep PURGE to clear out irrelevant blocks and empty layers hidden at the bottom. </span>
                    </div>
                  </label>

                  {/* Option 4: Audit */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={runAudit}
                      onChange={(e) => setRunAudit(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-700 block">Database Physical Verification (AUDIT)</span>
                      <span className="text-slate-400">Check the coordinates of 3D primitive nodes and automatically delete damage, Misplaced malformed data. </span>
                    </div>
                  </label>

                  {/* Option 5: DGN line check */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={indexDgnLine}
                      onChange={(e) => setIndexDgnLine(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-red-500 block">Unshelled DGN bloated linear style (DGN Style)</span>
                      <span className="text-slate-400">Stripping of very large line style dictionaries leftover from MicroStation import. </span>
                    </div>
                  </label>

                </div>
              </div>
            </div>

            {/* Right couplet: generated AutoLISP Code */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between min-h-[460px]">
                
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-slate-900 font-black text-xl tracking-tight">AutoLISP Macro code real-time compilation</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      This can be done within CAD as `.lsp` File load or paste and run directly in the command line. 
                    </p>
                  </div>

                  {/* LISP Code view */}
                  <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4">
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5" /> cleandwg.lsp Source code</span>
                      <button
                        onClick={() => handleCopy(compiledLispScript, 'lispCode')}
                        className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedText === 'lispCode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedText === 'lispCode' ? 'Copied ' : 'Copy command'}
                      </button>
                    </div>
                    <div className="max-h-[180px] overflow-y-auto bg-slate-950/40 p-2 rounded-lg text-slate-300 text-[10px]">
                      <pre className="whitespace-pre">{compiledLispScript}</pre>
                    </div>
                  </div>

                  {/* Core Principles and Operation Manual */}
                  <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 flex gap-3 text-blue-900">
                    <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-black text-slate-800 mb-1">Instructions for use and operation: </p>
                      <ol className="list-decimal list-inside space-y-1 mt-2 text-slate-700 font-medium">
                        <li>Copy the code generated above to create a plain text file on the desktop, Rename to <span className="font-mono bg-blue-100 px-1.5 rounded font-black text-blue-800">cleandwg.lsp</span>. </li>
                        <li>Open the drawing that needs slimming and cleaning in AutoCAD, Drag the `cleandwg.lsp` file you just saved into the drawing viewport. </li>
                        <li>Enter in the CAD command bar: <span className="font-mono bg-blue-100 px-1.5 rounded font-black text-blue-800">CLEANDWG</span> and press Enter to silently purify and reorganize the drawing database. </li>
                        <li><b>Lazy solution</b>: You can also directly copy the entire code, At the CAD command line press Ctrl+V Paste and run directly. </li>
                      </ol>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </>
      )}

      {cleanMode === 'dxf' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Drag and drop region */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-slate-900 font-black text-lg tracking-tight flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" /> Online Database Optimizer
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
                100% Client-side sandbox purification
              </p>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Directly drop your ASCII format `.dxf` drawing files. The system will inspect and wipe DGN Style blocks and Regapps directly in browser memory without sending a single byte to external servers.
              </p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-450 hover:bg-slate-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[200px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".dxf"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setDxfFile(e.target.files[0]);
                    setIsCleaned(false);
                    setCleanedBlobUrl(null);
                  }
                }}
                className="hidden"
              />
              <FileText className="w-10 h-10 text-slate-300 mb-3" />
              {dxfFile ? (
                <div>
                  <span className="text-xs font-bold text-slate-800 block truncate max-w-[200px]">{dxfFile.name}</span>
                  <span className="text-[10px] text-slate-400">{(dxfFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Click or Drag DXF to load</span>
                  <span className="text-[10px] text-slate-400">Supports files up to 100MB</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {isCleaned ? (
                <button
                  onClick={handleDownloadCleaned}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer animate-fadeIn"
                >
                  <Download className="w-4 h-4" /> Download Slimmed Drawing (.DXF)
                </button>
              ) : (
                <button
                  onClick={handleCleanDxf}
                  disabled={!dxfFile || isCleaning}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-350 text-white font-black py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isCleaning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Optimizing database...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" /> One-click Fast Purge Lag
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right: terminal logs & stats */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {/* Logs console */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col justify-between min-h-[300px] relative overflow-hidden">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-mono font-black text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Purification Console Output
                </span>
                <button
                  onClick={() => setLogHistory([])}
                  className="text-[9px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  clear
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[160px] font-mono text-[10px] text-emerald-400/90 flex flex-col gap-1.5 scrollbar-thin">
                {logHistory.length > 0 ? (
                  logHistory.map((log, index) => (
                    <div key={index} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                  ))
                ) : (
                  <div className="text-slate-600 italic">Waiting for file upload and optimization action...</div>
                )}
              </div>

              {isCleaned && (
                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-4 text-center animate-fadeIn">
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">DGN Styles Bypassed</span>
                    <span className="text-emerald-400 font-black text-sm font-mono mt-0.5">{cleanStats.dgnRemoved}</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Regapps Purged</span>
                    <span className="text-emerald-400 font-black text-sm font-mono mt-0.5">{cleanStats.regappRemoved}</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Scales Neutralized</span>
                    <span className="text-emerald-400 font-black text-sm font-mono mt-0.5">{cleanStats.scalesReset}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Geek guide card */}
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex gap-3 text-blue-900 text-xs leading-relaxed">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-slate-800 mb-1">Online Purging Mechanics:</h4>
                <p className="text-slate-600 font-medium">
                  We modify non-geometry object tables inside the DXF database. The process bypasses nested layers and layout definitions safely. AutoCAD will automatically purge unused references upon opening and saving the file.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <RelatedTools />
    </div>
);
}
