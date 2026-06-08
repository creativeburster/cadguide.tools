'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Info, Copy, Check, AlertTriangle, FileText, Activity, Settings, Layers, Sparkles } from 'lucide-react';

const SYMPTOMS = [
  {
    id: 'question_mark',
    name: 'All Chinese characters are displayed as question marks (?)',
    desc: 'Most commonly used when opening external drawings, Chinese fonts (Especially large fonts SHX) are missing on the local computer. ',
    badge: 'SHX missing'
  },
  {
    id: 'scrambled_gibberish',
    name: 'The text becomes a strange gibberish with no logic',
    desc: 'After printing the generated PDF, open it, The text becomes scrambled., And cannot be copied normally. ',
    badge: 'Encoding/PDFSHX variable conflict'
  },
  {
    id: 'outline_geometry',
    name: 'The text displays normally, but becomes hollow lines and the file is very large',
    desc: 'There is no problem with displaying Chinese fonts, but after zooming in, I found that the text turned into polylines., Unable to select, resulting in extremely stuck printing. ',
    badge: 'Fonts not embedded/converted to geometry'
  }
];

export default function PdfFontGibberishClient() {
  const [symptomId, setSymptomId] = useState<'question_mark' | 'scrambled_gibberish' | 'outline_geometry'>('question_mark');
  const [fontAltVal, setFontAltVal] = useState('gbcbig.shx');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Compile LISP Fix command based on choices
  const lispFixCommand = useMemo(() => {
    let commands = '';
    if (symptomId === 'question_mark') {
      commands = `(setvar "FONTALT" "${fontAltVal}")
(princ "\\n✓ The default replacement font is successfully set to ${fontAltVal}, and the Chinese characters can be eliminated by reopening the drawing. (?). \\n")`;
    } else if (symptomId === 'scrambled_gibberish') {
      commands = `(setvar "PDFSHX" 0)
(princ "\\n✓ Successfully set PDFSHX to 0. Now when printing PDF, SHX The text will not be output as text comments, eliminating garbled characters.. \\n")`;
    } else {
      commands = `(setvar "PDFSHX" 0)
(setvar "TEXTFILL" 1)
(princ "\\n✓ Successfully set TEXTFILL to 1 and PDFSHX is 0. Please change the [TrueType Font] option is modified to [Embed TrueType] to solve the problem of hollow words. \\n")`;
    }

    return `; CADGuide.tools PDF One-click loading of garbled code repair instructions
(defun c:FIXPDFFONT ()
  (setvar "CMDECHO" 0)
  ${commands}
  (setvar "CMDECHO" 1)
  (princ)
)
(princ "\\nType FIXPDFFONT and press Enter to perform the repair...\\n") (princ)`;
  }, [symptomId, fontAltVal]);

  // Diagram States based on selection
  const diagramStates = useMemo(() => {
    const states = {
      dwg: 'success',
      search: 'success',
      pc3: 'warning',
      pdf: 'danger'
    };

    if (symptomId === 'question_mark') {
      states.search = 'danger';
      states.pc3 = 'inactive';
      states.pdf = 'danger';
    } else if (symptomId === 'scrambled_gibberish') {
      states.search = 'success';
      states.pc3 = 'danger';
      states.pdf = 'danger';
    } else if (symptomId === 'outline_geometry') {
      states.search = 'success';
      states.pc3 = 'warning';
      states.pdf = 'warning';
    }

    return states;
  }, [symptomId]);

  return (
    <div className="flex flex-col gap-8">
      {/* Top SVG simulates printing process pipeline */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">PDF Picture rendering and font embedding link detection</h2>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              PDF Plotting & Font Integration Pipeline
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-black">
            interactive diagnostic status
          </div>
        </div>

        {/* SVG Flow diagram */}
        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-8 px-4">
          <svg viewBox="0 0 640 120" className="w-full max-w-[600px] h-auto" aria-label="PDF Plot Flow">
            {/* Connection lines */}
            <path
              d="M 60 60 L 200 60"
              fill="none"
              stroke={diagramStates.search === 'danger' ? '#ef4444' : '#10b981'}
              strokeWidth="2"
              strokeDasharray={diagramStates.search === 'danger' ? 'none' : '5 3'}
              className={diagramStates.search === 'danger' ? '' : 'animate-[dash_10s_linear_infinite]'}
            />
            <path
              d="M 200 60 L 380 60"
              fill="none"
              stroke={diagramStates.pc3 === 'danger' ? '#ef4444' : diagramStates.pc3 === 'inactive' ? '#475569' : diagramStates.pc3 === 'warning' ? '#f59e0b' : '#10b981'}
              strokeWidth="2"
              strokeDasharray={diagramStates.pc3 === 'inactive' ? 'none' : '5 3'}
              className={diagramStates.pc3 === 'inactive' ? '' : 'animate-[dash_10s_linear_infinite]'}
            />
            <path
              d="M 380 60 L 560 60"
              fill="none"
              stroke={diagramStates.pdf === 'danger' ? '#ef4444' : diagramStates.pdf === 'warning' ? '#f59e0b' : '#10b981'}
              strokeWidth="2"
              strokeDasharray={diagramStates.pdf === 'danger' ? 'none' : '5 3'}
              className={diagramStates.pdf === 'danger' ? '' : 'animate-[dash_10s_linear_infinite]'}
            />

            {/* Nodes */}
            {/* Node 1: DWG CAD */}
            <g transform="translate(60, 60)">
              <circle r="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <Layers className="w-5 h-5 text-blue-400" />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">DWG Drawing model</text>
            </g>

            {/* Node 2: Font Library */}
            <g transform="translate(200, 60)">
              <circle r="20" fill="#1e293b" stroke={diagramStates.search === 'danger' ? '#ef4444' : '#10b981'} strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <FileText className={`w-5 h-5 ${diagramStates.search === 'danger' ? 'text-red-400' : 'text-emerald-400'}`} />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                {diagramStates.search === 'danger' ? 'SHX Font missing!' : 'Font library mapping'}
              </text>
            </g>

            {/* Node 3: pc3 Plot Driver */}
            <g transform="translate(380, 60)">
              <circle r="20" fill="#1e293b" stroke={diagramStates.pc3 === 'danger' ? '#ef4444' : diagramStates.pc3 === 'warning' ? '#f59e0b' : diagramStates.pc3 === 'inactive' ? '#475569' : '#10b981'} strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <Settings className={`w-5 h-5 ${diagramStates.pc3 === 'danger' ? 'text-red-400' : diagramStates.pc3 === 'warning' ? 'text-amber-400' : 'text-slate-400'}`} />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                {diagramStates.pc3 === 'danger' ? 'PDFSHX Format conflict': diagramStates.pc3 === 'warning' ? 'Configuration is not embedded' : 'PDF Driver configuration'}
              </text>
            </g>

            {/* Node 4: PDF file output */}
            <g transform="translate(560, 60)">
              <circle r="20" fill="#1e293b" stroke={diagramStates.pdf === 'danger' ? '#ef4444' : diagramStates.pdf === 'warning' ? '#f59e0b' : '#10b981'} strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <Sparkles className={`w-5 h-5 ${diagramStates.pdf === 'danger' ? 'text-red-400' : diagramStates.pdf === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`} />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                {diagramStates.pdf === 'danger' ? 'Output garbled PDF': diagramStates.pdf === 'warning' ? 'Output hollow lines' : 'High fidelity vector PDF'}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Main panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Select your garbled characters */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-slate-800 font-black text-base tracking-tight mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Please select your garbled code phenomenon
            </h3>
            <div className="flex flex-col gap-2">
              {SYMPTOMS.map((sym) => {
                const isActive = sym.id === symptomId;
                return (
                  <button
                    key={sym.id}
                    onClick={() => setSymptomId(sym.id as typeof symptomId)}
                    className={`w-full flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 font-bold'
                        : 'bg-white hover:bg-slate-50/50 border-slate-100 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {sym.badge}
                      </span>
                    </div>
                    <span className="text-sm text-slate-800 font-black mt-2">{sym.name}</span>
                    <span className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{sym.desc}</span>
                  </button>
);
              })}
            </div>
          </div>

          {/* Optional additional parameter configuration */}
          {symptomId === 'question_mark' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">Default large font configuration</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fontAlt" className="text-xs font-black text-slate-500 uppercase">Replace large font name (SHX)</label>
                <input
                  id="fontAlt"
                  type="text"
                  value={fontAltVal}
                  onChange={(e) => setFontAltVal(e.target.value)}
                  placeholder="Default: gbcbig.shx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  AutoCAD When opening a drawing, if the corresponding large font cannot be found (Chinese font), will use `FONTALT` The font specified by the variable is automatically replaced. Commonly used recommendations `gbcbig.shx` (National standard large font) or `hztxt.shx`. 
                </p>
              </div>
            </div>
)}
        </div>

        {/* Double couplet on the right: Repair suggestions and code generation */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between min-h-[400px]">
            
            {/* Diagnosis text */}
            <div className="flex flex-col gap-5">
              <h3 className="text-slate-900 font-black text-lg tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Repair guide and principle diagnosis
              </h3>
              
              {/* Question Mark Fix */}
              {symptomId === 'question_mark' && (
                <div className="text-xs text-slate-600 leading-relaxed flex flex-col gap-3">
                  <p className="font-bold text-slate-800">Cause of failure (Why is it displayed as a question mark?) : </p>
                  <p>Chinese characters are represented by large fonts in CAD (Big Font) Form rendering. When loading external incoming drawings, If the special Chinese font used by the other party does not exist in your local `Fonts` folder (or the replacement is not registered globally), the CAD engine will render these missing characters as `?`. </p>
                  
                  <p className="font-bold text-slate-800 mt-2">Manual repair solution: </p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>Enter in the CAD command bar and press Enter to execute <span className="font-mono bg-slate-100 text-slate-800 px-1 rounded font-bold">FONTALT</span> System variables. </li>
                    <li>Modify its input to specify the replacement large font: <span className="font-mono bg-slate-100 text-slate-800 px-1 rounded font-bold">{fontAltVal}</span>. </li>
                    <li>Save current drawing, close CAD The software reopens. Missing fonts will be automatically mapped to {fontAltVal}, Solve garbled characters. </li>
                  </ol>
                </div>
)}

              {/* Scrambled Gibberish Fix */}
              {symptomId === 'scrambled_gibberish' && (
                <div className="text-xs text-slate-600 leading-relaxed flex flex-col gap-3">
                  <p className="font-bold text-slate-800">Cause of failure (why the characters become garbled characters)) : </p>
                  <p>In newer versions of AutoCAD, The system introduces the `PDFSHX` variable (The default value is 1). After turning on this variable, Print inside the exported PDF, Each SHX Chinese font will also be PDF Exported as comments so that they can be PDF Search in the software. However, due to encoding parsing conflicts, This will cause messy English characters and large garbled characters to appear in many PDF browsers.. </p>
                  
                  <p className="font-bold text-slate-800 mt-2">Manual repair solution: </p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>Enter directly into the CAD command bar: <span className="font-mono bg-slate-100 text-slate-800 px-1 rounded font-bold">PDFSHX</span> and press Enter. </li>
                    <li>Modify its properties to: <span className="font-mono bg-blue-100 text-blue-800 px-1 rounded font-bold">0</span> (turn off generation SHX Text annotation function). </li>
                    <li>Use `PLOT` again to print out the plot, All extra garbled comment characters will disappear. </li>
                  </ol>
                </div>
)}

              {/* Outline Geometry Fix */}
              {symptomId === 'outline_geometry' && (
                <div className="text-xs text-slate-600 leading-relaxed flex flex-col gap-3">
                  <p className="font-bold text-slate-800">Cause of failure (why it becomes hollow and extremely stuck) : </p>
                  <p>When the printer driver (such as `DWG to PDF.pc3`) Unable to recognize TrueType font in current drawing, Or configure it to convert &quot;text&quot; into geometry (Geometries) &quot;, CAD will explode all font text into multiple broken lines. This not only causes the file size to be several times larger than normal text and becomes hollow after enlargement, but also makes movement and reading extremely slow.. </p>
                  
                  <p className="font-bold text-slate-800 mt-2">Manual repair solution: </p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>Enter system variables in CAD: <span className="font-mono bg-slate-100 text-slate-800 px-1 rounded font-bold">TEXTFILL</span> and set it to <span className="font-mono bg-slate-100 text-slate-800 px-1 rounded font-bold">1</span> (enable text padding) . </li>
                    <li>Type `PLOT` to open the print panel, Select <span className="font-mono bg-slate-100 px-1 rounded font-bold">DWG to PDF.pc3</span> in the printer name, click on the right <b>[Properties]</b>. </li>
                    <li>Expand<b>[Device and Document Settings]</b> ➔ Select <b>[Custom Properties]</b> ➔ Click <b>[Custom Properties] below]</b> button. </li>
                    <li>In the Fonts tab, make sure that: <b>[Capture fonts used in drawing]</b>, and in TrueType Select <b>[TrueType Text] in the font options]</b> instead of [TrueType Geometry]. </li>
                  </ol>
                </div>
)}
            </div>

            {/* One-click AutoLISP script area */}
            <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4 mt-6">
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>AutoLISP One-click repair instructions (just paste from the command line)</span>
                <button
                  onClick={() => handleCopy(lispFixCommand, 'lispFix')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedText === 'lispFix' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'lispFix' ? 'Copied ' : 'Copy fix code'}
                </button>
              </div>
              <pre className="overflow-x-auto text-emerald-400 select-all p-1 bg-slate-950/40 rounded-lg max-h-[120px] text-[10px]">
                {lispFixCommand}
              </pre>
              <p className="text-[10px] text-slate-400 italic">Usage: Click to copy, From the CAD command line just press Ctrl+V Paste all the content and press Enter. The repair macro will be loaded silently, And directly call the command on the command line to perform one-click batch repair. </p>
            </div>

          </div>
        </div>

      </div>

      <RelatedTools />
    </div>
);
}
