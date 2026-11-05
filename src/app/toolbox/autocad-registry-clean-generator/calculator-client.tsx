'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Copy, Check, FileCode, Download, ShieldCheck, Settings } from 'lucide-react';

const CAD_VERSIONS = [
  { label: 'AutoCAD 2026', regKey: 'R25.1', folderKey: 'AutoCAD 2026' },
  { label: 'AutoCAD 2025', regKey: 'R25.0', folderKey: 'AutoCAD 2025' },
  { label: 'AutoCAD 2024', regKey: 'R24.3', folderKey: 'AutoCAD 2024' },
  { label: 'AutoCAD 2023', regKey: 'R24.2', folderKey: 'AutoCAD 2023' },
  { label: 'AutoCAD 2022', regKey: 'R24.1', folderKey: 'AutoCAD 2022' },
  { label: 'AutoCAD 2021', regKey: 'R24.0', folderKey: 'AutoCAD 2021' },
  { label: 'AutoCAD 2020', regKey: 'R23.1', folderKey: 'AutoCAD 2020' },
];

export default function RegistryCleanClient() {
  const [versionIdx, setVersionIdx] = useState(2); // Default AutoCAD 2024
  const [cleanHkcu, setCleanHkcu] = useState(true);
  const [cleanHklm, setCleanHklm] = useState(false);
  const [cleanAppData, setCleanAppData] = useState(true);
  const [cleanFlexlm, setCleanFlexlm] = useState(false);
  const [cleanTemp, setCleanTemp] = useState(false);

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const activeVer = CAD_VERSIONS[versionIdx] || CAD_VERSIONS[2];

  // Batch command script compiler (100% pure standard ASCII output for CMD compatibility)
  const generatedBatchScript = useMemo(() => {
    let script = `@echo off
chcp 65001 > nul
echo ===================================================
echo   CADGuide.tools AutoCAD Clean Registry Reset Utility
echo   Target Version: ${activeVer.label} (${activeVer.regKey})
echo ===================================================
echo.
echo [WARNING] Please close all running AutoCAD processes before proceeding!
pause
echo.

:: Create backup directory on current user desktop
set "BACKUP_DIR=%USERPROFILE%\\Desktop\\CAD_Registry_Backup"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
echo [OK] Backup folder created on desktop: %BACKUP_DIR%
echo.

`;

    // HKCU registry reset
    if (cleanHkcu) {
      script += `:: 1. Back up and clean HKCU registry configuration
echo Backing up HKCU registry configuration...
reg export "HKCU\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" "%BACKUP_DIR%\\HKCU_AutoCAD_${activeVer.regKey}_Backup.reg" /y > nul
echo Removing HKCU user profile registry configuration...
reg delete "HKCU\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" /f > nul
echo [OK] HKCU Registry user profile cleanup completed.
echo.
`;
    }

    // HKLM registry reset
    if (cleanHklm) {
      script += `:: 2. Back up and clean HKLM system registry environment
echo Backing up HKLM system registry (Administrator rights required)...
reg export "HKLM\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" "%BACKUP_DIR%\\HKLM_AutoCAD_${activeVer.regKey}_Backup.reg" /y > nul
echo Removing HKLM system configuration...
reg delete "HKLM\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" /f > nul
echo [OK] HKLM Registry system cleanup completed.
echo.
`;
    }

    // Local files and AppData
    if (cleanAppData) {
      script += `:: 3. Clean user AppData roaming and local cache folders
echo Cleaning AppData cache directories...
if exist "%APPDATA%\\Autodesk\\${activeVer.folderKey}" (
    rmdir /s /q "%APPDATA%\\Autodesk\\${activeVer.folderKey}"
    echo [OK] Removed Roaming AppData folder: %APPDATA%\\Autodesk\\${activeVer.folderKey}
)
if exist "%LOCALAPPDATA%\\Autodesk\\${activeVer.folderKey}" (
    rmdir /s /q "%LOCALAPPDATA%\\Autodesk\\${activeVer.folderKey}"
    echo [OK] Removed Local AppData folder: %LOCALAPPDATA%\\Autodesk\\${activeVer.folderKey}
)
echo.
`;
    }

    // FLEXlm / Licensing activation local files
    if (cleanFlexlm) {
      const verYear = activeVer.label.replace(/[^0-9]/g, '');
      script += `:: 4. Reset licensing authorization local cache
echo Checking Autodesk licensing architecture...
echo [NOTE] For AutoCAD 2020-2026 (AdskLicensing architecture):
echo To reset single product licensing without affecting other Autodesk apps, run:
echo "%CommonProgramFiles(x86)%\\Autodesk Shared\\AdskLicensing\\Current\\helper\\AdskLicensingInstHelper.exe" change -pk PRODUCT_KEY -pv ${verYear}.0.0.F -lm ""
echo.
set "FLEX_DIR=%ProgramData%\\FLEXnet"
if exist "%FLEX_DIR%" (
    echo Backing up legacy FLEXnet activation tokens to %BACKUP_DIR%...
    copy "%FLEX_DIR%\\adskflex*" "%BACKUP_DIR%\\" > nul 2>&1
    del /f /q "%FLEX_DIR%\\adskflex*" > nul 2>&1
    echo [OK] Legacy FLEXnet tokens backed up and cleaned. Re-activation will be required.
)
echo.
`;
    }

    // Temp folder clean (CAD-specific only)
    if (cleanTemp) {
      script += `:: 5. Safely clean CAD-specific temporary crash files
echo Clearing AutoCAD temporary scratch files (*.ac$, *.bak, *.sv$, *.tmp)...
del /f /q "%TEMP%\\*.ac$" > nul 2>&1
del /f /q "%TEMP%\\*.bak" > nul 2>&1
del /f /q "%TEMP%\\*.sv$" > nul 2>&1
del /f /q "%TEMP%\\*AutoCAD*.tmp" > nul 2>&1
echo [OK] AutoCAD temporary scratch caches have been cleaned.
echo.
`;
    }

    script += `echo ===================================================
echo [OK] Reset completed for ${activeVer.label}.
echo Backed-up configuration files stored in: %BACKUP_DIR%
echo To restore your previous configuration, double-click the .reg backup files.
echo ===================================================
pause`;

    return script;
  }, [activeVer, cleanHkcu, cleanHklm, cleanAppData, cleanFlexlm, cleanTemp]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

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
      {/* Top visual simulation */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">Windows Deployment Console Simulation</h2>
            </div>
            <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-wider">
              CMD Batch Reset Execution Preview
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black">
            ASCII Batch Script Generator
          </div>
        </div>

        {/* SVG Terminal Simulation */}
        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-6 px-4">
          <svg viewBox="0 0 450 180" className="w-full max-w-[420px] h-auto shadow-2xl" aria-label="CMD Terminal Reset screen">
            <rect width="450" height="180" fill="#0c111d" rx="8" stroke="#1f2937" strokeWidth="1.5" />
            <rect width="450" height="24" fill="#1e293b" rx="8" />
            <rect y="16" width="450" height="8" fill="#1e293b" />
            <circle cx="15" cy="12" r="3.5" fill="#ef4444" />
            <circle cx="27" cy="12" r="3.5" fill="#f59e0b" />
            <circle cx="39" cy="12" r="3.5" fill="#10b981" />
            <text x="225" y="15" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Command Prompt - reset_autocad.bat
            </text>

            <g transform="translate(15, 45)" fill="#10b981" fontSize="7" fontWeight="bold" fontFamily="monospace">
              <text y="10" fill="#94a3b8">Microsoft Windows [Version 10.0.22631]</text>
              <text y="24" fill="#38bdf8">C:\Users\Admin&gt; reset_autocad.bat</text>
              <text y="42" fill="#e2e8f0">[INFO] Backing up and cleaning {activeVer.label} ({activeVer.regKey})...</text>
              <text y="54" fill="#fbbf24">reg export &quot;HKCU\Software\Autodesk\AutoCAD\{activeVer.regKey}&quot; backup.reg</text>
              {cleanAppData && (
                <text y="68" fill="#10b981">[OK] Removed AppData\Autodesk\{activeVer.folderKey} cache</text>
              )}
              {cleanFlexlm && (
                <text y="82" fill="#f43f5e">[WARN] Flushing %ProgramData%\FLEXnet tokens...</text>
              )}
              <text y="98" fill="#38bdf8">[OK] Reset completed. Press any key to exit...</text>
              <text y="112" fill="#a7f3d0">C:\Users\Admin&gt; _</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Main Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Scope & Version Configuration */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-slate-800 font-black text-xl tracking-tight flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-500" />
              Reset Configuration
            </h3>

            {/* Target CAD Version Selection */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cadVersion" className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Target AutoCAD Release
              </label>
              <select
                id="cadVersion"
                data-testid="select-cad-version"
                value={versionIdx}
                onChange={(e) => setVersionIdx(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-bold text-slate-800 bg-white cursor-pointer"
              >
                {CAD_VERSIONS.map((ver, idx) => (
                  <option key={ver.label} value={idx}>{ver.label} ({ver.regKey})</option>
                ))}
              </select>
            </div>

            <div className="border-t border-slate-100 my-1"></div>

            {/* Scope Checkboxes */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Cleanup Scope Selection</span>

              {/* HKCU */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="checkbox-hkcu"
                  checked={cleanHkcu}
                  onChange={(e) => setCleanHkcu(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">User Profile Registry (HKCU)</span>
                  <span className="text-slate-400">Resets workspace layout, palette positions, and custom toolbars.</span>
                </div>
              </label>

              {/* HKLM */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="checkbox-hklm"
                  checked={cleanHklm}
                  onChange={(e) => setCleanHklm(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">Machine System Registry (HKLM)</span>
                  <span className="text-slate-400">Requires Administrator elevation to clean system paths.</span>
                </div>
              </label>

              {/* AppData */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="checkbox-appdata"
                  checked={cleanAppData}
                  onChange={(e) => setCleanAppData(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">Local &amp; Roaming AppData Folders</span>
                  <span className="text-slate-400">Purges corrupted user cache folders in %APPDATA% and %LOCALAPPDATA%.</span>
                </div>
              </label>

              {/* FLEXlm */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="checkbox-flexlm"
                  checked={cleanFlexlm}
                  onChange={(e) => setCleanFlexlm(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-rose-600 block">FLEXnet / Local Licensing Cache</span>
                  <span className="text-slate-400">Flushes local authorization locks when reinstallation fails with licensing errors.</span>
                </div>
              </label>

              {/* Temp */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="checkbox-temp"
                  checked={cleanTemp}
                  onChange={(e) => setCleanTemp(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">CAD Scratch Files (*.ac$, *.bak, *.sv$)</span>
                  <span className="text-slate-400">Removes temporary autosave remnants without wiping unrelated system temp files.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Script Output */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-slate-900 font-black text-xl tracking-tight">Generated Batch Reset Script</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Review the assembled Windows batch commands below before execution. Includes automatic registry backup to your Desktop.
                </p>
              </div>

              {/* Batch Code Viewer */}
              <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-sm flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><FileCode className="w-4 h-4 text-emerald-400" /> reset_autocad.bat</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      data-testid="btn-copy-bat"
                      onClick={() => handleCopy(generatedBatchScript, 'batCode')}
                      className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === 'batCode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText === 'batCode' ? 'Copied' : 'Copy Script'}
                    </button>
                    <button
                      type="button"
                      data-testid="btn-download-bat"
                      onClick={handleDownload}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download .bat
                    </button>
                  </div>
                </div>
                <div className="max-h-[220px] overflow-y-auto bg-slate-950/60 p-3 rounded-xl text-slate-300 text-xs scrollbar-thin">
                  <pre data-testid="bat-script-preview" className="whitespace-pre">{generatedBatchScript}</pre>
                </div>
              </div>

              {/* Safety Manual */}
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 flex gap-3 text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed font-medium">
                  <p className="font-black text-slate-800 mb-1">Administrative Safety Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li><strong>Automatic Backup First:</strong> The script exports registry keys to <span className="font-mono bg-amber-100 px-1 rounded font-bold">CAD_Registry_Backup</span> on your Desktop prior to any deletion. Double-click the generated .reg file to restore.</li>
                    <li><strong>Administrator Privileges:</strong> If Machine System (HKLM) or FLEXnet options are selected, right-click the .bat file and select <strong>&quot;Run as administrator&quot;</strong>.</li>
                    <li><strong>Close AutoCAD:</strong> Ensure all AutoCAD instances (acad.exe) are fully terminated before executing the script to avoid locked registry handle errors.</li>
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
