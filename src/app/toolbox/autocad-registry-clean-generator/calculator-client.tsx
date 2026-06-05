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
  FileCode,
  Download,
  Terminal,
  Activity,
  ArrowRight,
  ShieldCheck,
  Settings
} from 'lucide-react';

const CAD_VERSIONS = [
  { label: 'AutoCAD 2027', regKey: 'R25.2', folderKey: 'AutoCAD 2027' },
  { label: 'AutoCAD 2026', regKey: 'R25.1', folderKey: 'AutoCAD 2026' },
  { label: 'AutoCAD 2025', regKey: 'R25.0', folderKey: 'AutoCAD 2025' },
  { label: 'AutoCAD 2024', regKey: 'R24.3', folderKey: 'AutoCAD 2024' },
  { label: 'AutoCAD 2023', regKey: 'R24.2', folderKey: 'AutoCAD 2023' },
  { label: 'AutoCAD 2022', regKey: 'R24.1', folderKey: 'AutoCAD 2022' },
  { label: 'AutoCAD 2021', regKey: 'R24.0', folderKey: 'AutoCAD 2021' },
  { label: 'AutoCAD 2020', regKey: 'R23.1', folderKey: 'AutoCAD 2020' },
];

export default function RegistryCleanClient() {
  const [versionIdx, setVersionIdx] = useState(3); // Default 2024
  const [cleanHkcu, setCleanHkcu] = useState(true);
  const [cleanHklm, setCleanHklm] = useState(false);
  const [cleanAppData, setCleanAppData] = useState(true);
  const [cleanFlexlm, setCleanFlexlm] = useState(false);
  const [cleanTemp, setCleanTemp] = useState(true);
  
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const activeVer = CAD_VERSIONS[versionIdx];

  // Batch command script compiler
  const generatedBatchScript = useMemo(() => {
    let script = `@echo off
chcp 65001 > nul
echo ===================================================
echo   CADGuide.tools AutoCAD Clean Registry Reset Utility
echo   This script will back up and clean up the configuration residue of ${activeVer.label}
echo ===================================================
echo.
echo [WARNING] Please close all running AutoCAD Process! 
pause
echo.

:: Create backup folder
set "BACKUP_DIR=%USERPROFILE%\\Desktop\\CAD_Registry_Backup"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
echo ✓ A backup folder has been created on the desktop: %BACKUP_DIR%
echo.

`;

    // HKCU registry reset
    if (cleanHkcu) {
      script += `:: 1. Back up and clean HKCU registry configuration
echo Backing up HKCU registry configuration...
reg export "HKCU\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" "%BACKUP_DIR%\\HKCU_AutoCAD_${activeVer.regKey}_Backup.reg" /y > nul
echo Removing HKCU registry configuration...
reg delete "HKCU\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" /f > nul
echo ✓ HKCU Registry cleanup completed. 
echo.
`;
    }

    // HKLM registry reset
    if (cleanHklm) {
      script += `:: 2. Back up and clean the HKLM registry system environment
echo Backing up HKLM registry configuration (Admin rights required)...
reg export "HKLM\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" "%BACKUP_DIR%\\HKLM_AutoCAD_${activeVer.regKey}_Backup.reg" /y > nul
echo Removing HKLM registry configuration...
reg delete "HKLM\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" /f > nul
echo ✓ HKLM Registry cleanup completed. 
echo.
`;
    }

    // Local files and AppData
    if (cleanAppData) {
      script += `:: 3. Clean user AppData roaming and local cache folders
echo Cleaning AppData cache directory...
if exist "%APPDATA%\\Autodesk\\${activeVer.folderKey}" (
    rmdir /s /q "%APPDATA%\\Autodesk\\${activeVer.folderKey}"
    echo ✓ Removed from Roaming AppData ${activeVer.folderKey} folder
)
if exist "%LOCALAPPDATA%\\Autodesk\\${activeVer.folderKey}" (
    rmdir /s /q "%LOCALAPPDATA%\\Autodesk\\${activeVer.folderKey}"
    echo ✓ Removed from Local AppData ${activeVer.folderKey} folder
)
echo.
`;
    }

    // FLEXlm activation local files
    if (cleanFlexlm) {
      script += `:: 4. Clean FLEXlm authorization service local cache (Note: This step will clear the activation status, Need to re-register)
echo Backing up and removing FLEXlm activation profile...
set "FLEX_DIR=%ProgramData%\\FLEXnet"
if exist "%FLEX_DIR%" (
    copy "%FLEX_DIR%\\adskflex*" "%BACKUP_DIR%\\" > nul
    del /f /q "%FLEX_DIR%\\adskflex*"
    echo ✓ Safely removed from FLEXnet directory adsk Activate profile
)
echo.
`;
    }

    // Temp folder clean
    if (cleanTemp) {
      script += `:: 5. Clean Windows temporary junk cache
echo Clearing the system temporary Temp directory...
del /s /f /q "%TEMP%\\*.*" > nul
echo ✓ Temporary system garbage cleanup is completed. 
echo.
`;
    }

    script += `echo ===================================================
echo ✓ Congratulations! AutoCAD ${activeVer.label} registry configuration and cache have been reset. 
echo The backed up old configuration has been stored on the desktop: %BACKUP_DIR% folder. 
echo If you want to restore, double-click the corresponding .reg Just import the registry backup file. 
echo ===================================================
pause`;

    return script;
  }, [activeVer, cleanHkcu, cleanHklm, cleanAppData, cleanFlexlm, cleanTemp]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Download .bat file directly on client
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedBatchScript], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `reset_autocad_${activeVer.folderKey.replace(' ', '_')}.bat`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top emulation of Windows CMD commands running in Terminal SVG */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">Windows Deploy console emulation</h2>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              CMD Batch Reset Execution Simulation
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black">
            BAT Script compiler
          </div>
        </div>

        {/* SVG Terminal */}
        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-6 px-4">
          <svg viewBox="0 0 450 180" className="w-full max-w-[420px] h-auto shadow-2xl" aria-label="CMD Terminal Reset screen">
            <rect width="450" height="180" fill="#0c111d" rx="8" stroke="#1f2937" strokeWidth="1.5" />
            
            {/* Titlebar tabs */}
            <rect width="450" height="24" fill="#1e293b" rx="8" />
            <rect y="16" width="450" height="8" fill="#1e293b" />
            <circle cx="15" cy="12" r="3.5" fill="#ef4444" />
            <circle cx="27" cy="12" r="3.5" fill="#f59e0b" />
            <circle cx="39" cy="12" r="3.5" fill="#10b981" />
            <text x="225" y="15" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Command Prompt - reset_autocad.bat
            </text>

            {/* Simulated CMD logs */}
            <g transform="translate(15, 45)" fill="#10b981" fontSize="7" fontWeight="bold" fontFamily="monospace">
              <text y="10" fill="#94a3b8">Microsoft Windows [Version 10.0.22631]</text>
              <text y="24" fill="#38bdf8">C:\Users\Administrator&gt; reset_autocad.bat</text>
              
              <text y="42" fill="#e2e8f0">Backing up and deleting {activeVer.label} registry configuration...</text>
              <text y="54" fill="#fbbf24">reg export "HKCU\\Software\\Autodesk\\AutoCAD\\{activeVer.regKey}" backup.reg</text>
              
              {cleanAppData && (
                <text y="68" fill="#10b981">✓ Deleted: AppData\\Autodesk\\{activeVer.folderKey} cache folder</text>
)}
              {cleanFlexlm && (
                <text y="82" fill="#f43f5e">⚠ Warning: Clearing C:\\ProgramData\\FLEXnet Authorization cache...</text>
)}
              
              <text y="98" fill="#38bdf8">✓ The script reset execution is completed. Press any key to continue exiting...</text>
              <text y="112" fill="#a7f3d0">C:\Users\Administrator&gt; _</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Main panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Visual configuration parameter panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-slate-800 font-black text-base tracking-tight flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-500" />
              Custom reset configuration
            </h3>
            
            {/* Version Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cadVersion" className="text-xs font-black text-slate-500 uppercase">Target CAD software version</label>
              <select
                id="cadVersion"
                value={versionIdx}
                onChange={(e) => setVersionIdx(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800 bg-white"
              >
                {CAD_VERSIONS.map((ver, idx) => (
                  <option key={ver.label} value={idx}>{ver.label}</option>
))}
              </select>
            </div>

            <div className="border-t border-slate-100 my-1"></div>

            {/* Checkbox Options */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Select Reset Cleanup Scope</span>

              {/* Option 1: HKCU */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanHkcu}
                  onChange={(e) => setCleanHkcu(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">User Personalization Configuration Registry (HKCU)</span>
                  <span className="text-slate-400">Reset layout, window size, Customized shortcut keys and other user settings. </span>
                </div>
              </label>

              {/* Option 2: HKLM */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanHklm}
                  onChange={(e) => setCleanHklm(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">System Global Environment Registry (HKLM)</span>
                  <span className="text-slate-400">Clean up the installation path remnants. Note: Administrator status is required to execute this script. </span>
                </div>
              </label>

              {/* Option 3: AppData */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanAppData}
                  onChange={(e) => setCleanAppData(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">Local configuration cache folder (AppData)</span>
                  <span className="text-slate-400">Clean Roaming and Local Corrupted CAD user cache folder in directory. </span>
                </div>
              </label>

              {/* Option 4: FLEXlm activations */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanFlexlm}
                  onChange={(e) => setCleanFlexlm(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-red-500 block">FLEXnet License activation cache (reset license)</span>
                  <span className="text-slate-400">When encountering "License verification failed"If reinstallation still prompts an activation error, check the box and clear the local license lock.. </span>
                </div>
              </label>

              {/* Option 5: Temp */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanTemp}
                  onChange={(e) => setCleanTemp(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">Windows System Temp temporary directory</span>
                  <span className="text-slate-400">Clean up excess left over from the CAD run that was not automatically erased `.tmp` Temporary files. </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Double couplet on the right: Generate code blocks and user manuals */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between min-h-[460px]">
            
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-slate-900 font-black text-xl tracking-tight">Reset script code viewing and generation</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Automatically assembled secure batch commands can be found at Windows Double-click or execute silently. 
                </p>
              </div>

              {/* Batch Code viewer */}
              <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><FileCode className="w-3.5 h-3.5" /> reset_autocad.bat Source code</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCopy(generatedBatchScript, 'batCode')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === 'batCode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText === 'batCode' ? 'Copied ' : 'Copy command'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download .bat file
                    </button>
                  </div>
                </div>
                <div className="max-h-[160px] overflow-y-auto bg-slate-950/40 p-2 rounded-lg text-slate-300 text-[10px]">
                  <pre className="whitespace-pre">{generatedBatchScript}</pre>
                </div>
              </div>

              {/* Use Safety Warning Manual */}
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 flex gap-3 text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-black text-slate-800 mb-1">Use safety guidelines: </p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-slate-600 font-medium">
                    <li><b>Safe backup first</b>: This script before starting the cleanup, A folder named <span className="font-mono bg-amber-100 px-1 rounded font-black">CAD_Registry_Backup</span> will be generated on your desktop, Export the old registry keys for backup. If you need to restore the configuration, Just double-click the `.reg` file in the folder and re-write it.. </li>
                    <li>If you checked<b>"System Global HKLM"</b>or the <b>"FLEXnet"</b> option, When running, you must<b>right click {'->'} Run as administrator"</b>the `.bat` file, otherwise Windows Firewall and registry defense mechanisms will reject deletion requests and cause failure. </li>
                    <li>Please make sure you have completely closed the AutoCAD software before running it., Otherwise, the registry key being occupied may be damaged. </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <RelatedTools />
    </div>
);
}
