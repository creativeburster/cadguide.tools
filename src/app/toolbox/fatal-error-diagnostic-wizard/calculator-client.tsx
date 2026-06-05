'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  HelpCircle,
  Info,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  Search,
  Cpu,
  ShieldAlert,
  Terminal,
  Activity,
  ArrowRight,
  Settings2
} from 'lucide-react';

interface ErrorPreset {
  address: string;
  title: string;
  source: string;
  reason: string;
  solution: string;
  command?: string;
  commandDesc?: string;
}

const ERROR_DATABASE: ErrorPreset[] = [
  {
    address: 'e06d7363h',
    title: 'Unhandled Exception e06d7363h (Microsoft C++ Exception)',
    source: 'Visual C++ / .NET Framework',
    reason: 'This is the most common crash experienced by AutoCAD. Description: The CAD main program is loading external components or calling Windows Runtime time, due to local Microsoft Visual C++ Dependent libraries are missing or damaged, Or .NET Framework version conflict, The underlying C++ runtime exception was triggered. ',
    solution: '1. Repair or reinstall the full set of Microsoft Visual C++ Redistributable (2005 to2022version). \n2. Check .NET Framework 4.8 or system enabled status of 3.5, Under "Enable or disable Windows Check "Function". \n3. Install the current official AutoCAD security and Bug Update patch (Hotfix/Update). ',
    command: 'DISM.exe /Online /Cleanup-Image /RestoreHealth',
    commandDesc: 'In Windows Administrator CMD Run in to scan and repair damaged Windows system dependent components'
  },
  {
    address: 'c0000005',
    title: 'Access Violation Reading/Writing Location c0000005',
    source: 'Memory conflict/graphics hardware acceleration',
    reason: 'Indicates that the CAD process is trying to read or write a system memory address that is not allocated to it. Usually due to the complexity of the DirectX hardware acceleration module in rendering 3D When the entity takes shape, display it with your core/There is a conflict in the underlying instructions of the independent graphics card driver; or it may be due to a minor hardware failure of the local memory module., Caused by bad disk and bad sectors. ',
    solution: '1. **Disable graphics hardware acceleration**: in CAD Right-click the desktop shortcut and select Properties", In "Target"Add a space at the end of the input box and append the parameter `/nohardware` (see copy below) . This forces CAD to bypass the graphics card direct connection, Emergency boot completed!\n2. Upgrade your graphics card driver to the latest certified one Studio stable version, or switch to DX11 Run in compatibility mode. ',
    command: '"C:\\Program Files\\Autodesk\\AutoCAD 2024\\acad.exe" /product ACAD /language "zh-CN" /nohardware',
    commandDesc: 'With /nohardware no hardware acceleration emergency boot flag acad Shortcut parameter example'
  },
  {
    address: 'd3d11.dll',
    title: 'Crash module: d3d11.dll / d3d9.dll',
    source: 'Direct3D rendering graphics engine',
    reason: 'CAD When calling Direct3D 11 or 9 Crash with graphics API. Often due to the conflict between dual graphics card switching between independent graphics and core graphics in laptops, Or the DirectX component used by the current system is damaged.. ',
    solution: '1. Force the acad.exe Set to "High Performance" (Independent graphics card mode) to avoid errors in intelligent switching of core graphics and integrated graphics. \n2. Download and install the DirectX End User Runtime Installer (DirectX End-User Runtime) Repair environment DLL. ',
    command: 'setx GSDEVICE "Dx9"',
    commandDesc: 'Paste this command in CMD to set environment variables, Can force CAD to be downgraded back to use D3D9 Classic Stable Engine Rendering'
  },
  {
    address: '0x00000000',
    title: 'Unhandled Exception at 0x00000000',
    source: 'The registry null pointer or the drawing is damaged',
    reason: 'Null pointer crash. Usually due to AutoCAD Plug-ins (such as Tianzheng, 3D plug-in) calls a non-standard API, Or the current DWG drawing contains logical geometry errors (If node coordinates overflow, infinite tile association) , Trigger memory zero value reference. ',
    solution: '1. **Drawing Fix**: On startup CAD After that, enter `RECOVER` The command selects abnormally crashed DWG drawings for database underlying reconstruction and automatic repair.. \n2. Temporarily uninstall any recently installed CAD third-party plug-ins and LSP Tool to confirm whether it is caused by a plug-in. '
  }
];

export default function FatalErrorWizardClient() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customCode, setCustomCode] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const activeError = useMemo(() => {
    if (customCode.trim()) {
      // Attempt manual search in DB
      const found = ERROR_DATABASE.find(
        (err) =>
          err.address.toLowerCase().includes(customCode.toLowerCase()) ||
          err.title.toLowerCase().includes(customCode.toLowerCase())
);
      if (found) return found;
      
      // Dynamic response for custom search
      return {
        address: customCode,
        title: `Custom retrieval: ${customCode}`,
        source: 'Unknown module/third-party software conflict',
        reason: 'No exact match was found in the core database. This usually belongs to a specific non-standard tile, Inferior secondary development plug-ins, or Windows Insufficient user configuration rights (software module quarantined by security guards)) Caused by occasional illegal address reads. ',
        solution: '1. Run AutoCAD with administrator privileges (right-click and select Run as administrator)) . \n2. Clear the Windows `%temp%` directory, Free up the system cache. \n3. Use the reset tool to generate Windows bat Clean the registry (reference Phase 4 Registry Cleaner) . '
      };
    }
    return ERROR_DATABASE[selectedIdx];
  }, [selectedIdx, customCode]);

  return (
    <div className="flex flex-col gap-8">
      {/* The top simulates the CAD error pop-up window SVG */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">CAD Diagnostic analysis of fatal crash popup</h2>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              Fatal Error Box Memory Address Decompiler
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black">
            Faulty decompilation engine
          </div>
        </div>

        {/* SVG Window */}
        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-8 px-4">
          <svg viewBox="0 0 420 180" className="w-full max-w-[420px] h-auto shadow-2xl" aria-label="AutoCAD Fatal Error Window">
            {/* Modal background */}
            <rect width="420" height="180" fill="#f8fafc" rx="8" stroke="#94a3b8" strokeWidth="1" />
            {/* Titlebar */}
            <rect width="420" height="28" fill="#0f172a" rx="8" />
            <rect y="18" width="420" height="10" fill="#0f172a" />
            <text x="12" y="18" fill="#f1f5f9" fontSize="8" fontWeight="bold" fontFamily="sans-serif">AutoCAD Fatal error</text>
            <circle cx="408" cy="14" r="4" fill="#ef4444" />
            
            {/* Error Body */}
            <g transform="translate(18, 45)">
              {/* Red warning sign */}
              <circle cx="20" cy="30" r="16" fill="#ef4444" />
              <text x="20" y="35" fill="white" fontSize="16" fontWeight="black" textAnchor="middle">!</text>

              {/* Error messages */}
              <text x="45" y="16" fill="#0f172a" fontSize="10" fontWeight="black" fontFamily="sans-serif">
                FATAL ERROR
              </text>
              <text x="45" y="32" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">
                Unhandled Access Violation
              </text>
              <text x="45" y="46" fill="#0284c7" fontSize="8" fontWeight="bold" fontFamily="monospace">
                Reading {activeError.address}
              </text>
              <text x="45" y="60" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                The main program acad.exe is about to be forcibly terminated...
              </text>
            </g>

            {/* Bottom Buttons */}
            <line x1="0" y1="135" x2="420" y2="135" stroke="#e2e8f0" strokeWidth="1" />
            <rect x="290" y="145" width="55" height="22" rx="4" fill="#0284c7" />
            <text x="317" y="158" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">Diagnostic Analysis</text>
            <rect x="355" y="145" width="50" height="22" rx="4" fill="none" stroke="#94a3b8" strokeWidth="1" />
            <text x="380" y="158" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">OK</text>
          </svg>
        </div>
      </div>

      {/* Main panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Search or select an address */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-slate-800 font-black text-base tracking-tight flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" />
              Address reverse check and positioning
            </h3>
            
            {/* Custom Search bar */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="customSearch" className="text-xs font-black text-slate-500 uppercase">Search for a specific error code</label>
              <input
                id="customSearch"
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="For example, enter: c0000005"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800"
              />
            </div>

            <div className="border-t border-slate-100 my-2"></div>

            {/* Standard List Selection */}
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Core crash address default</span>
            <div className="flex flex-col gap-2">
              {ERROR_DATABASE.map((err, idx) => {
                const isActive = idx === selectedIdx && !customCode;
                return (
                  <button
                    key={err.address}
                    onClick={() => {
                      setCustomCode('');
                      setSelectedIdx(idx);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-red-500/10 border-red-500/20 text-red-700 font-bold'
                        : 'bg-white hover:bg-slate-50/50 border-slate-100 text-slate-500'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black font-mono">{err.address}</span>
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{err.title}</span>
                    </div>
                    {isActive && <ArrowRight className="w-4 h-4 text-red-600 animate-pulse" />}
                  </button>
);
              })}
            </div>
          </div>
        </div>

        {/* Double couplet on the right: Repair suggestions and code generation */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between min-h-[420px]">
            
            {/* Diagnostic report text */}
            <div className="flex flex-col gap-5">
              <div>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-600">
                  Conflicting module: {activeError.source}
                </span>
                <h3 className="text-slate-900 font-black text-xl tracking-tight mt-2">
                  {activeError.title}
                </h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/80 text-xs text-slate-600 leading-relaxed">
                <p className="font-black text-slate-800 mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Decryption of abnormal causes: 
                </p>
                <p>{activeError.reason}</p>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed flex flex-col gap-2">
                <p className="font-black text-slate-800 flex items-center gap-1">
                  <Settings2 className="w-4 h-4 text-blue-500" />
                  Tailored Solution: 
                </p>
                <div className="whitespace-pre-line pl-1 space-y-1">{activeError.solution}</div>
              </div>
            </div>

            {/* CMD/PowerShell Fix code box */}
            {activeError.command && (
              <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4 mt-6">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>{activeError.commandDesc}</span>
                  <button
                    onClick={() => handleCopy(activeError.command!, 'errCmd')}
                    className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedText === 'errCmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText === 'errCmd' ? 'Copied ' : 'Copy command'}
                  </button>
                </div>
                <pre className="overflow-x-auto text-emerald-400 select-all p-1 bg-slate-950/40 rounded-lg max-h-[100px] text-[10px]">
                  {activeError.command}
                </pre>
              </div>
)}

          </div>
        </div>

      </div>

      <RelatedTools />
    </div>
);
}
