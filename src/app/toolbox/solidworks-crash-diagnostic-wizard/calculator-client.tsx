'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Copy, Check, ShieldAlert, ArrowRight, Wrench, Monitor, MemoryStick, Database, RefreshCw } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  icon: typeof Monitor;
  symptoms: string[];
  cause: string;
  fixes: { step: string; detail: string; command?: string }[];
}

const ISSUES: Issue[] = [
  {
    id: 'graphics',
    title: 'Graphics Driver Conflict / OpenGL Crash',
    icon: Monitor,
    symptoms: [
      'SolidWorks crashes when rotating, zooming, or panning a 3D model',
      'White screen or flickering graphics in the viewport',
      'Crash on startup after graphics driver update',
      'RealView graphics toggle causes immediate freeze',
    ],
    cause: 'SolidWorks relies heavily on OpenGL and certified graphics drivers. Non-certified consumer GPU drivers (especially NVIDIA Game Ready vs Studio) often cause instability. Laptops with hybrid GPU switching (Optimus) are particularly affected.',
    fixes: [
      {
        step: 'Switch to SolidWorks Rx Software OpenGL mode',
        detail: 'Launch SolidWorks Rx from Start Menu → Diagnostics → Safe Mode (Software OpenGL). This bypasses the GPU driver entirely to confirm the root cause.',
      },
      {
        step: 'Install certified graphics driver',
        detail: 'For NVIDIA: install the "Studio Driver" (not Game Ready). For AMD: install the "PRO Driver". Always use the version listed on the SolidWorks certified GPU list for your SW version.',
        command: 'https://www.solidworks.com/support/hardware-certification',
      },
      {
        step: 'Disable hybrid GPU switching (laptops)',
        detail: 'In Windows Settings → System → Display → Graphics, set sldworks.exe to "High Performance" (dedicated GPU). Disable NVIDIA Optimus / AMD Switchable Graphics for SolidWorks.',
      },
      {
        step: 'Clear graphics cache',
        detail: 'Delete the contents of %TEMP%\\SolidWorks\\GraphicsCache and restart. Corrupted shader caches can cause persistent OpenGL crashes.',
        command: 'del /q "%TEMP%\\SolidWorks\\GraphicsCache\\*"',
      },
    ],
  },
  {
    id: 'memory',
    title: 'Memory Exhaustion / GDI Object Leak',
    icon: MemoryStick,
    symptoms: [
      'SolidWorks becomes sluggish after 1-2 hours of use, then crashes',
      'Task Manager shows RAM usage climbing steadily toward 8-16 GB',
      '"Out of memory" or "GDI object limit reached" error dialog',
      'Large assemblies (500+ parts) crash on load or during rebuild',
    ],
    cause: 'SolidWorks is a 64-bit application but still has internal GDI object limits inherited from legacy code. Complex assemblies with many configurations, display states, or in-context references can exhaust GDI handles. Additionally, large toolbox libraries and duplicate components inflate memory usage.',
    fixes: [
      {
        step: 'Enable Large Address Awareness and GDI handle optimization',
        detail: 'In SolidWorks → Tools → Options → System Options → Performance: enable "Use Software OpenGL" temporarily, set "Level of detail" to minimum, and uncheck "Use performance settings from OS".',
      },
      {
        step: 'Use SpeedPak for large assemblies',
        detail: 'Create SpeedPak configurations of subassemblies. SpeedPak loads only the faces and edges referenced by mates, dramatically reducing memory footprint for large assemblies.',
      },
      {
        step: 'Split toolbox into separate files',
        detail: 'If your SolidWorks Toolbox has 10,000+ configurations in a single file, split it into smaller files. Each configuration consumes GDI handles even when not displayed.',
      },
      {
        step: 'Increase Windows GDI object limit',
        detail: 'Edit the registry to increase the per-process GDI handle limit. This is a system-wide change that requires admin rights.',
        command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Windows" /v GDIProcessHandleQuota /t REG_DWORD /d 30000 /f',
      },
    ],
  },
  {
    id: 'toolbox',
    title: 'Corrupt Toolbox / Hole Wizard Database',
    icon: Database,
    symptoms: [
      'Crash when inserting a Toolbox component (bolt, nut, washer)',
      'Hole Wizard crashes when selecting a standard (ANSI, ISO, DIN)',
      'SolidWorks hangs for 30+ seconds when accessing Toolbox',
      'Error: "Toolbox database is not configured correctly"',
    ],
    cause: 'The SolidWorks Toolbox database (SWBrowser.sldedb) can become corrupted after version upgrades, network drive disconnections, or improper Toolbox configuration changes. The Hole Wizard shares the same database and fails similarly.',
    fixes: [
      {
        step: 'Run SolidWorks Rx to reset Toolbox',
        detail: 'SolidWorks Rx → Maintenance → "Reset SolidWorks Settings" → check "Reset Toolbox". This recreates the Toolbox database from the installation media.',
      },
      {
        step: 'Manually rebuild Toolbox database',
        detail: 'Close SolidWorks. Navigate to the Toolbox folder (typically C:\\SOLIDWORKS Data\\browser). Rename SWBrowser.sldedb to SWBrowser.sldedb.bak. Launch SolidWorks → Tools → Options → Hole Wizard/Toolbox → reconfigure the path.',
      },
      {
        step: 'Verify network drive connectivity',
        detail: 'If Toolbox is on a network drive, verify the drive letter is persistent and accessible. Use UNC paths (\\\\server\\share) instead of mapped drive letters for reliability.',
        command: 'net use Z: \\\\server\\SolidWorksData /persistent:yes',
      },
    ],
  },
  {
    id: 'registry',
    title: 'Corrupt Registry / Settings Profile',
    icon: RefreshCw,
    symptoms: [
      'SolidWorks crashes immediately on startup (before UI loads)',
      'UI elements missing, toolbars rearranged, command manager empty',
      'Crash after a Windows update or user profile change',
      'Resetting settings via SolidWorks Rx does not fix the issue',
    ],
    cause: 'SolidWorks stores extensive user preferences, UI layouts, and add-in registrations in the Windows Registry under HKCU\\Software\\SolidWorks\\SOLIDWORKS [version]. Corruption here (from crashes, Windows updates, or profile migration) can cause startup failures.',
    fixes: [
      {
        step: 'Full registry reset via SolidWorks Rx',
        detail: 'SolidWorks Rx → Maintenance → "Reset SolidWorks Settings" → select all options. This deletes and recreates all SolidWorks registry keys for the current user.',
      },
      {
        step: 'Manual registry cleanup',
        detail: 'Close SolidWorks. Open Registry Editor (regedit). Navigate to HKEY_CURRENT_USER\\Software\\SolidWorks\\SOLIDWORKS [your version]. Export the key as backup, then delete it. Restart SolidWorks to regenerate default keys.',
        command: 'reg export "HKCU\\Software\\SolidWorks\\SOLIDWORKS 2024" "%USERPROFILE%\\Desktop\\SW_backup.reg" && reg delete "HKCU\\Software\\SolidWorks\\SOLIDWORKS 2024" /f',
      },
      {
        step: 'Create a new Windows user profile',
        detail: 'If the registry corruption persists across resets, create a new Windows user account and test SolidWorks there. If it works, the old user profile is corrupt and needs migration.',
      },
    ],
  },
  {
    id: 'service-pack',
    title: 'Service Pack / Version Compatibility Issue',
    icon: Wrench,
    symptoms: [
      'Crash after installing a new SolidWorks service pack',
      'Files created in a newer service pack crash in an older one',
      'Add-ins stop working after service pack upgrade',
      'SolidWorks Rx shows "version mismatch" warnings',
    ],
    cause: 'SolidWorks service packs are forward-compatible but not backward-compatible. Files saved in SP5 cannot be opened in SP3. Add-ins compiled for a specific service pack may fail after upgrade. Additionally, partial service pack installations (interrupted by antivirus) can corrupt core DLLs.',
    fixes: [
      {
        step: 'Verify service pack installation integrity',
        detail: 'In SolidWorks → Help → About SolidWorks, note the full version number. Compare with the latest service pack on the SolidWorks download portal. If the installation was interrupted, download and run the service pack installer again.',
      },
      {
        step: 'Run SolidWorks Installation Manager repair',
        detail: 'Windows Control Panel → Programs → SolidWorks → Modify → "Repair installation". This verifies and replaces any corrupted DLLs from the service pack.',
      },
      {
        step: 'Update all add-ins to match service pack',
        detail: 'Contact your add-in vendors (CAMWorks, Mastercam, SolidCAM, etc.) for service pack-compatible versions. Disable all add-ins first to confirm they are the cause: SolidWorks → Tools → Add-Ins → uncheck all.',
      },
      {
        step: 'Use SolidWorks Rx to check system',
        detail: 'SolidWorks Rx → Diagnostics → "System Diagnostics" runs a comprehensive check of your installation, including DLL versions, registry entries, and system compatibility.',
      },
    ],
  },
];

export default function SolidWorksCrashClient() {
  const [selectedId, setSelectedId] = useState<string>(ISSUES[0].id);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const selected = ISSUES.find(i => i.id === selectedId) || ISSUES[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Issue List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Select Your Issue</h2>
          </div>
          {ISSUES.map(issue => {
            const Icon = issue.icon;
            return (
              <button
                key={issue.id}
                onClick={() => setSelectedId(issue.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                  selectedId === issue.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedId === issue.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-black ${selectedId === issue.id ? 'text-blue-600' : 'text-slate-900'}`}>{issue.title}</h3>
                  <p className="text-sm text-slate-400 font-bold mt-1">{issue.symptoms.length} symptoms identified</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Symptoms */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Common Symptoms</h3>
            <ul className="space-y-3">
              {selected.symptoms.map((symptom, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-base font-black shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-lg text-slate-700 font-medium leading-relaxed">{symptom}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Root Cause */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
            <h3 className="text-base font-black text-amber-600 uppercase tracking-wider mb-2">Root Cause Analysis</h3>
            <p className="text-lg text-slate-700 font-medium leading-relaxed">{selected.cause}</p>
          </div>

          {/* Fixes */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Step-by-Step Fixes</h3>
            <div className="space-y-4">
              {selected.fixes.map((fix, i) => (
                <div key={i} className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-base font-black shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-slate-900">{fix.step}</h4>
                      <p className="text-base text-slate-600 font-medium mt-1 leading-relaxed">{fix.detail}</p>
                    </div>
                  </div>
                  {fix.command && (
                    <div className="mt-3 ml-10 flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 rounded-lg bg-slate-900 text-white text-base font-mono break-all">
                        {fix.command}
                      </code>
                      <button
                        onClick={() => handleCopy(fix.command!, `fix-${i}`)}
                        className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-base font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all shrink-0"
                      >
                        {copiedText === `fix-${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-3">
            <ArrowRight className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-base text-slate-600 font-medium">
              Still crashing after trying all fixes? Run <strong>SolidWorks Rx</strong> → Diagnostics → "System Diagnostics" and contact your SolidWorks reseller with the Rx report file.
            </p>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
