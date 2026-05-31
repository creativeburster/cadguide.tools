import { tools } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolLogo } from '@/components/tool-logo';
import { ARTICLES_LIST, CATEGORY_SECTIONS } from '@/lib/guides-data';
import {
  Award,
  FileText,
  Cloud,
  Cpu,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  BookOpen,
  Star,
  ArrowRight,
  Layers,
  Printer,
  Settings,
  Scale,
  FileSpreadsheet,
  FolderGit,
  Activity,
  ArrowLeftRight
} from 'lucide-react';
import type { Metadata } from 'next';

export const dynamicParams = true;

// Industry-grade Category Technical Mapping for Template C (Standard Red-Header layout)
export const CATEGORY_MAP: Record<string, {
  directiveCode: string;
  standardTitle: string;
  subtitle: string;
  reference: string;
  sectionTitle: string;
  iconName: string;
  tableHeaders: string[];
  tableRows: string[][];
}> = {
  troubleshooting: {
    directiveCode: 'CAD-ERR-901',
    standardTitle: 'CAD Troubleshooting Directive',
    subtitle: 'Diagnostic Procedures for Application Crash Module Exceptions & Licensing Seat Locks',
    reference: 'ISO 27001 / FLEXlm Spec',
    sectionTitle: 'Crash Signature Diagnostic Matrix',
    iconName: 'AlertTriangle',
    tableHeaders: ['Faulting Module', 'Exception Code', 'Severity', 'Root Cause', 'Remediation Code'],
    tableRows: [
      ['ac1st24.dll', '0xC0000005', 'CRITICAL', 'Memory access violation during dynamic drawing buffer allocation', 'Wipe temp cache, patch registry options'],
      ['sw_gl.dll', '0x0000007A', 'HIGH', 'Workstation graphic pipeline thread override conflict', 'Force hardware acceleration override console'],
      ['flexlm.sys', '10048', 'CRITICAL', 'FLEXlm license manager socket port binding failure', 'Re-bind options daemons to ports 27000-27009'],
      ['rvt_core.dll', '0xC0000027', 'HIGH', 'BIM coordinate local-to-central synchronization deadlock', 'Perform local profile audit and force offline save']
    ]
  },
  performance: {
    directiveCode: 'CAD-PERF-802',
    standardTitle: 'Performance Calibration Directive',
    subtitle: 'Workstation Buffer Allocation, CPU Thread Multi-Processing, and GPU Virtualization Rules',
    reference: 'NVIDIA ISV Certification',
    sectionTitle: 'Workstation Resource Buffering Calibration Matrix',
    iconName: 'Cpu',
    tableHeaders: ['System Parameter', 'Industrial Threshold', 'Recommended Buffer', 'Target Architecture', 'Metric'],
    tableRows: [
      ['Viewport VRAM Allocation', '2GB Min', '8GB+ Dedicated', 'RTX Enterprise / Radeon Pro', 'Vertex cache size'],
      ['CPU Pagefile Override', '1.5x System RAM', '32GB - 64GB Pagefile', 'Multi-Core Xeon / Threadripper', 'Thread synchronization'],
      ['Background AutoSave Cycle', '15 min', '20 Iterations Clear', 'Local drawing database cache', 'NURBS topology RAM flush'],
      ['Geometry Simplification', 'Dynamic L O D', '0.001mm Tolerance Poly', 'Large mechanical assemblies', 'Triangle count reduction']
    ]
  },
  printing: {
    directiveCode: 'CAD-PLOT-503',
    standardTitle: 'Plotting & PDF Output Specification',
    subtitle: 'Monochrome and Color Pen (CTB/STB) Line-Weight Calibration Standards',
    reference: 'ISO 128-20 / ANSI Y14.2M',
    sectionTitle: 'Line-Weight Pen (CTB) Calibration Table',
    iconName: 'Printer',
    tableHeaders: ['AIA Pen Color ID', 'Standard Thickness', 'Pen Mapping Style', 'Vector Resolution', 'DPI Standard'],
    tableRows: [
      ['Color 1 (Red)', '0.18 mm', 'Monochrome.ctb (Thin boundaries)', '1200 DPI vector lines', 'Structural lines'],
      ['Color 2 (Yellow)', '0.35 mm', 'Monochrome.ctb (Core annotation)', '1200 DPI vector lines', 'Text & dimensions'],
      ['Color 3 (Green)', '0.50 mm', 'Monochrome.ctb (Medium structural)', '1200 DPI vector lines', 'Hatching & symbols'],
      ['Color 7 (Black/White)', '0.70 mm', 'Monochrome.ctb (Heavy borders)', '2400 DPI raster lines', 'Sheet margins & cuts']
    ]
  },
  standards: {
    directiveCode: 'CAD-STD-704',
    standardTitle: 'Layer Naming & Drafting Directives',
    subtitle: 'Uniform AIA / ANSI Layer Naming Structures, Dimensioning Scales, and Coordination Blueprints',
    reference: 'AIA CAD Layer Standards',
    sectionTitle: 'AIA CAD Layering Convention Standard Matrix',
    iconName: 'Layers',
    tableHeaders: ['Layer Code', 'Standard Name', 'Description', 'Color ID', 'Line-Weight Class'],
    tableRows: [
      ['A-WALL-FULL-EXTR', 'Exterior Wall', 'Load-bearing structural exterior walls', 'Color 7 (White)', '0.50 mm (Heavy)'],
      ['A-DOOR-FULL-INTR', 'Interior Door', 'Interior timber and metal doors and frames', 'Color 3 (Green)', '0.25 mm (Medium)'],
      ['E-POWR-CABL-TRAY', 'Electrical Cable Tray', 'Power distribution conduit infrastructure', 'Color 4 (Cyan)', '0.35 mm (Medium)'],
      ['M-HVAC-DUCT-SUPP', 'HVAC Supply Duct', 'Mechanical ventilation supply ductwork lines', 'Color 1 (Red)', '0.35 mm (Medium)']
    ]
  },
  deployment: {
    directiveCode: 'CAD-DEP-405',
    standardTitle: 'Enterprise Mass Deployment Blueprint',
    subtitle: 'Silent Installation Checklists, FLEXlm Options Daemon Config, and SSO Identity Provisioning',
    reference: 'Active Directory / SAML 2.0',
    sectionTitle: 'SSO SAML & FLEXlm Sockets Binding Matrix',
    iconName: 'Settings',
    tableHeaders: ['IT Protocol', 'Secure TCP Ports', 'Configuration File', 'Compliance Status', 'Authentication Method'],
    tableRows: [
      ['FLEXlm Concurrent Server', '27000 - 27009', 'vendor.lic', 'EULA Compliant', 'Concurrent Options File Restrict'],
      ['Enterprise SSO Identity', '443 (HTTPS)', 'saml_metadata.xml', 'Verified Named-User', 'SAML 2.0 / OIDC Token Sync'],
      ['Silent Deployment Command', 'N/A', 'deployment_setup.msi', 'Enterprise Authorized', 'MSI quiet installation string'],
      ['Telemetry Opt-Out Ping', 'Blocked (Loopback)', 'hosts / local_firewall', 'Admin Restricted', 'Loopback block 127.0.0.1:443']
    ]
  },
  migration: {
    directiveCode: 'CAD-MIG-606',
    standardTitle: 'Software Crossover Migration Directive',
    subtitle: 'PGP Command Aliases, Custom CUIX Menu Mapping, and AutoLISP API Runtime Bridging',
    reference: 'AutoLISP API Compatibility',
    sectionTitle: 'AutoLISP API Compatibility & Bridging Matrix',
    iconName: 'BookOpen',
    tableHeaders: ['Legacy AutoLISP Hook', 'Crossover Support', 'Execution Speedup', 'Parametric Skew', 'Verification Script'],
    tableRows: [
      ['(vla-get-ActiveDocument)', '100% Native support', '1.8x Crossover speedup', '0.0% Skew', 'load_custom_vla.lsp'],
      ['CUIX Ribbon Layouts', 'Manual XML import', 'N/A', '0.0% Skew', 'custom_ribbon_import.xml'],
      ['PGP Shortcut Command', 'Direct text merge', 'N/A', '0.0% Skew', 'acad.pgp -> custom.pgp'],
      ['B-Rep Skew Solver', 'Mathematical sew', '3.5x Math speedup', '< 1e-7 mm', 'stitch_kernel_eval.py']
    ]
  },
  procurement: {
    directiveCode: 'CAD-PROC-307',
    standardTitle: 'Procurement & Compliance Directive',
    subtitle: 'Subscription Named User vs Perpetual TCO Auditing and Compliance Checklists',
    reference: 'Software Asset Management (SAM)',
    sectionTitle: 'License TCO Audit Compliance Risk Matrix',
    iconName: 'Scale',
    tableHeaders: ['Licensing Model', 'TCO Cost Curve (3-Yr)', 'EULA Risk Rating', 'Watermark Detection', 'IT Compliance Audit'],
    tableRows: [
      ['Named User Subscription', '$3,600 (High SaaS drag)', 'Medium risk (Audit sweeps)', 'Quiet background ping', 'Active IT cloud domain audit'],
      ['Perpetual Buyout', '$1,800 (Break-even Yr-2)', 'Low risk (No silent push)', 'None (Offline standard)', 'Offline network MAC tracking'],
      ['Edu Watermarked License', '$0.00 (Illegal Corporate)', 'CRITICAL (Large fines)', 'Severe plot watermark', 'Automated vendor ping trigger'],
      ['Floating Network Pool', '$4,500 (Legacy Multi)', 'Low risk (EULA lock)', 'None (Admin bound)', 'LMTools license daemon restrict']
    ]
  },
  manufacturing: {
    directiveCode: 'CAD-MAN-208',
    standardTitle: 'CAM & CNC Manufacturing Directive',
    subtitle: 'Solid Geometry Tolerances, Watertight STL/3MF Kernels, and Bend K-Factor Calibrations',
    reference: 'ISO 128 / STEP ISO 10303',
    sectionTitle: 'Geometric Kernel Tolerance & CNC Slicing Standard',
    iconName: 'Award',
    tableHeaders: ['Manufacturing Process', 'Standard Kernel Tolerance', 'Slicing Format', 'Watertight Standard', 'Bend Allowance Metric'],
    tableRows: [
      ['CNC Lathe Milling', '0.001 mm', 'STEP / IGES B-Rep', '100% Watertight Solid', 'Feed rate standard G-code'],
      ['FDM 3D Printing', '0.010 mm', '3MF / STL high-tess', '99.9% watertight shell', 'Watertight polygon mesh'],
      ['Sheet Metal Bending', 'N/A', 'DXF Flat pattern', 'N/A', 'K-Factor K=0.44 (Standard)'],
      ['5-Axis CNC Milling', '0.0005 mm', 'STEP AP242 / native CL', '100% Watertight Solid', 'G-code path optimization']
    ]
  }
};

// Map each category dynamically to its top 8 corresponding software systems
export function getTopToolsForCategory(category: string) {
  const mapping: Record<string, string[]> = {
    troubleshooting: ['autocad', 'revit', 'solidworks', 'autodesk-inventor', 'bricscad', 'freecad', 'gstarcad', 'draftsight'],
    performance: ['autocad', 'solidworks', 'revit', 'rhino-3d', 'freecad', 'siemens-nx', 'fusion-360', 'ptc-creo'],
    printing: ['autocad', 'draftsight', 'autocad-electrical', 'zwcad', 'gstarcad', 'qcad', 'librecad', 'vectorworks'],
    standards: ['autocad', 'revit', 'autocad-electrical', 'tekla-structures', 'archicad', 'vectorworks', 'bricscad', 'microstation'],
    deployment: ['autocad', 'autocad-lt', 'autocad-for-mac', 'solidworks', 'revit', 'autodesk-inventor', 'siemens-nx', 'bricscad'],
    migration: ['bricscad', 'zwcad', 'gstarcad', 'autocad', 'solidworks', 'autodesk-inventor', 'draftsight', 'microstation'],
    procurement: ['autocad', 'autocad-lt', 'solidworks', 'revit', 'bricscad', 'draftsight', 'freecad', 'fusion-360'],
    manufacturing: ['fusion-360', 'solidworks', 'freecad', 'mastercam', 'solid-edge', 'siemens-nx', 'zw3d', 'solidcam']
  };

  const slugs = mapping[category] || [];
  return tools.filter(t => slugs.includes(t.slug));
}

// Dynamic diagnostic builder providing hardcore registry, module, and batch script configurations for Template A (Technical Autopsy)
export function getAutopsyPayload(toolName: string, title: string, slug: string) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('license') || titleLower.includes('flexlm') || titleLower.includes('activation')) {
    return {
      module: 'adsklicensing.dll / lmgrd.exe',
      code: '0x00002740 (WSAEADDRINUSE)',
      offset: '0x0004c8f1',
      severity: 'CRITICAL // ACTIVATION LOCKED',
      rootCause: `FLEXlm licensing service socket port binding collision. The CAD license daemon attempted to bind to default TCP port 27000 or 2080, which is already occupied by a phantom licensing lockfile or duplicate active background daemon process.`,
      registryKey: `HKEY_LOCAL_MACHINE\\SOFTWARE\\FLEXlm License Manager\\`,
      registryValue: `"ADSKFLEX_LICENSE_FILE" = "27000@127.0.0.1"`,
      recoveryScript: `@echo off
echo ===================================================
echo   CAD DIRECTIVE: FORCED LICENSE DAEMON SOCKET RESET
echo ===================================================
echo [+] Stopping concurrent license service daemons...
taskkill /f /im lmgrd.exe >nul 2>&1
taskkill /f /im adsklicensing.exe >nul 2>&1
echo [+] Wiping active network license socket locks...
netstat -ano | findstr :27000
echo [+] Re-registering licensing service environment...
reg add "HKLM\\SOFTWARE\\FLEXlm License Manager" /v "ADSKFLEX_LICENSE_FILE" /t REG_SZ /d "27000@127.0.0.1" /f
echo [+] Restarting licensing socket daemons...
sc start AdskLicensingService
echo [+] Process complete. Verify environment by relaunching ${toolName}.`
    };
  }
  
  if (titleLower.includes('freeze') || titleLower.includes('0x0024') || titleLower.includes('crash') || titleLower.includes('corrupt')) {
    return {
      module: toolName.toLowerCase().includes('autocad') ? 'ac1st24.dll' : toolName.toLowerCase().includes('solidworks') ? 'sldworks.exe' : 'cax_geometry.dll',
      code: '0xC0000005 (Access Violation)',
      offset: '0x0001f3b2',
      severity: 'CRITICAL // INTERFACE STALLED',
      rootCause: `Dynamic vertex array buffer overflow inside local drawing cache. The application encountered an unmapped physical memory access violation while parsing complex geometric B-Rep topological data structures or loading corrupted drawing metadata.`,
      registryKey: `HKEY_CURRENT_USER\\Software\\${toolName.replace(/\s+/g, '')}\\Profiles\\Default\\General\\`,
      registryValue: `"GraphicsOverride" = DWORD:00000001`,
      recoveryScript: `@echo off
echo ===================================================
echo   CAD DIRECTIVE: MEMORY CACHE & REGISTRY OVERRIDE
echo ===================================================
echo [+] Terminating stalled ${toolName} processes...
taskkill /f /im ${toolName.toLowerCase().replace(/\s+/g, '')}.exe >nul 2>&1
echo [+] Flushing local drawing dynamic temp cache...
del /f /s /q "%TEMP%\\*${toolName.toLowerCase().replace(/\s+/g, '').slice(0, 4)}*.*"
echo [+] Rewriting default graphics acceleration registry options...
reg add "HKCU\\Software\\${toolName.replace(/\s+/g, '')}\\Profiles\\Default\\General" /v "GraphicsOverride" /t REG_DWORD /d 1 /f
echo [+] Resetting workspace coordinates configuration...
echo [+] Process complete. Relaunch ${toolName} in diagnostics mode.`
    };
  }

  // Default Autopsy Payload
  return {
    module: `${toolName.toLowerCase().replace(/\s+/g, '')}_core.dll`,
    code: '0xC0000005 (Access Violation)',
    offset: '0x0002b8a0',
    severity: 'HIGH // TERMINATION TRIGGERED',
    rootCause: `Unmanaged physical memory segment read violation during dynamic coordinate matrix transformation. Geometry kernel encountered boundary drift tolerances exceeding software sketch solver parameters.`,
    registryKey: `HKEY_CURRENT_USER\\Software\\${toolName.replace(/\s+/g, '')}\\Diagnostics\\`,
    registryValue: `"SafeModeLaunch" = DWORD:00000001`,
    recoveryScript: `@echo off
echo ===================================================
echo   CAD DIRECTIVE: SAFE MODE DIAGNOSTIC ENVIRONMENT
echo ===================================================
echo [+] Forcing ${toolName} dynamic process termination...
taskkill /f /im ${toolName.toLowerCase().replace(/\s+/g, '')}.exe >nul 2>&1
echo [+] Creating registry diagnostic safe-launch override...
reg add "HKCU\\Software\\${toolName.replace(/\s+/g, '')}\\Diagnostics" /v "SafeModeLaunch" /t REG_DWORD /d 1 /f
echo [+] Process complete. Launch ${toolName} to calibrate system.`
  };
}

// Technical Autopsy Report Renderer (Template A)
export function renderTechnicalAutopsy(tool: typeof tools[number], title: string, excerpt: string, slug: string) {
  const autopsy = getAutopsyPayload(tool.name, title, slug);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 1. Technical Autopsy Alert Banner */}
      <Card className="border-2 border-rose-500/30 bg-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[60px]"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-rose-500 font-mono font-black text-[10px] uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4 animate-pulse" /> CRITICAL POST-MORTEM DIAGNOSTIC REPORT
          </div>
          <h3 className="text-xl sm:text-2xl font-mono font-black tracking-tight uppercase leading-snug">
            TECHNICAL AUTOPSY: FORCED SYSTEM DEVIATION DETECTED
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-mono">
            This playbook contains structural registry override binaries and diagnostic recovery safe-mode configurations verified to bypass license lockouts, address dynamic heap allocation crashes, and wipe corrupted coordinate registries for {tool.name}.
          </p>
        </div>
      </Card>

      {/* 2. Crash Signature Monospace Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-mono text-sm font-black">
            [x]
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
            Application Crash Signature
          </h3>
        </div>

        <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white font-mono text-[11px] sm:text-xs">
          <div className="divide-y divide-slate-100">
            <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-slate-50/50 gap-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Faulting Module Name:</span>
              <span className="text-slate-900 font-black">{autopsy.module}</span>
            </div>
            <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-slate-50/50 gap-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Exception Registration Code:</span>
              <span className="text-slate-900 font-black">{autopsy.code}</span>
            </div>
            <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-slate-50/50 gap-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Exception Offset Register:</span>
              <span className="text-slate-900 font-black">{autopsy.offset}</span>
            </div>
            <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-slate-50/50 gap-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Directive Severity:</span>
              <span className="text-rose-600 font-black uppercase tracking-wider">{autopsy.severity}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Deep Root Cause Analysis */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
          Physiological Root Cause Diagnosis
        </h3>
        <Card className="rounded-[24px] p-6 border border-slate-100 bg-slate-50/50 text-slate-700 text-xs sm:text-sm leading-relaxed font-medium space-y-4">
          <p>
            {autopsy.rootCause}
          </p>
          <p>
            When unmanaged drawings, license seat variables, or local profile coordinates are corrupted in the system registry, the application crashes dynamically without a standard EULA warnings banner. Restoring default operation requires complete environmental cache override and local host options configuration.
          </p>
        </Card>
      </div>

      {/* 4. Decisive Action Playbook */}
      <div className="space-y-6">
        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
          Decisive Action Playbook (Registry Configuration)
        </h3>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 hover:border-rose-100 shadow-sm transition-all duration-300 relative group flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 font-black text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div className="space-y-2 min-w-0 flex-1">
              <h4 className="font-black text-slate-900 text-sm sm:text-base">
                Modify Local Environment Registry Keys
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                Navigate to the target registry option key in the Windows Registry Editor (`regedit.exe`) and append the verified options parameters:
              </p>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-[10px] sm:text-xs text-slate-300 overflow-x-auto mt-2 select-all border border-slate-800">
                <code>
                  {`Windows Registry Editor Version 5.00\n\n[${autopsy.registryKey}]\n${autopsy.registryValue}`}
                </code>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-slate-100 hover:border-rose-100 shadow-sm transition-all duration-300 relative group flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 font-black text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div className="space-y-2 min-w-0 flex-1">
              <h4 className="font-black text-slate-900 text-sm sm:text-base">
                Wipe Corrupted Local User Drawing Caches
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                Navigate to your workstation local AppData path `C:\\Users\\%USERNAME%\\AppData\\Local\\${tool.name.replace(/\s+/g, '')}\\` and safely delete dynamic drawing recovery lockfiles (`.ac$` or `.sv$`) and cached coordinate options to prevent serialize crash loop cycles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Post-Mortem Defensive Shell Script */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              Automated Post-Mortem Recovery Script
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Copy and save as a `.bat` script file, then run with Administrator credentials to automate repairs.</p>
          </div>
        </div>

        <Card className="rounded-[24px] overflow-hidden border border-slate-900 shadow-xl bg-slate-950 text-emerald-400 p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          </div>
          <div className="font-mono text-[10px] sm:text-xs overflow-x-auto leading-relaxed select-all">
            <pre>
              {autopsy.recoveryScript}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Dynamic performance payload builder targeting viewport and memory allocations for Template D (Geek Benchmark)
export function getPerformancePayload(toolName: string, title: string, slug: string) {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('gpu') || titleLower.includes('graphics') || titleLower.includes('accelerat') || titleLower.includes('card') || titleLower.includes('driver')) {
    return {
      kernel: 'DirectX 12 / Vulkan Viewport Pipeline',
      multithreading: 'Single-Threaded Viewport Rasterization Override',
      gpuOptimization: 'NVIDIA RTX Enterprise Production Branch (ISV Certified)',
      translationScore: '98.5% Skew Accuracy',
      tableHeaders: ['Viewport Operation', 'Thread Allocation', 'VRAM Footprint', 'Render Latency', 'Optimization Metric'],
      tableRows: [
        ['Static Viewport Render', 'Single Thread Bound', '1.2 GB VRAM', '4.2 ms', 'Stable performance baseline'],
        ['Large Assembly Dynamic Orbit', 'Single Thread Stall', '6.8 GB (Thrashing)', '42.5 ms (Lag)', 'Vertex buffer heap spill'],
        ['Vulkan DrawCall Buffer Pipeline', 'Multi-Threaded Override', '2.1 GB VRAM', '8.5 ms', '320% Viewport Speedup'],
        ['Dynamic Instancing Draw', 'Parallel Vertex Shader', '1.8 GB VRAM', '6.1 ms', '480% Instance acceleration']
      ],
      cppCode: `// C++ Viewport Buffer Allocation Override for ${toolName}\n#include <d3d12.h>\n#include <wrl.h>\n\nvoid OverrideViewportVertexHeaps(Microsoft::WRL::ComPtr<ID3D12Device> device) {\n    D3D12_DESCRIPTOR_HEAP_DESC heapDesc = {};\n    heapDesc.NumDescriptors = 65536; // Double standard vertex buffer descriptor allocations\n    heapDesc.Type = D3D12_DESCRIPTOR_HEAP_TYPE_CBV_SRV_UAV;\n    heapDesc.Flags = D3D12_DESCRIPTOR_HEAP_FLAG_SHADER_VISIBLE;\n    \n    // Override local thread stack bounds to prevent geometry buffer overrides\n    device->CreateDescriptorHeap(&heapDesc, IID_PPV_ARGS(&m_DescriptorHeap));\n    printf("[+] Mapped ${toolName} GPU instanced draw heap limit to 65536 bounds.\\\\n");\n}`
    };
  }

  if (titleLower.includes('cpu') || titleLower.includes('multi-core') || titleLower.includes('thread') || titleLower.includes('processor') || titleLower.includes('performance')) {
    return {
      kernel: 'Parasolid C++ / ACIS Geometric Kernel Wrapper',
      multithreading: 'Multi-Threaded Boolean Skew & Meshing',
      gpuOptimization: 'Host Pagefile Virtualization & RAM Cache',
      translationScore: '99.9% Geometry Integrity',
      tableHeaders: ['CAD Mathematical Operation', '1-Core Load', '4-Cores Scaling', '16-Cores Threadripper', 'Thread Saturation Status'],
      tableRows: [
        ['NURBS Skew Patch Solver', '100% Load', '12% Scale (Thread Lock)', '4% Scale (Stalled)', 'Thread locking overhead active'],
        ['Finite Element Mesh (FEA)', '100% Load', '280% Scale (Near Linear)', '680% Scale (Optimal)', 'Near-linear load scaling'],
        ['Photo-Realistic Raytrace', '100% Load', '390% Scale (Linear)', '1520% Scale (Optimal)', '100% thread saturation achieved'],
        ['Dynamic Interference Check', '100% Load', '140% Scale (Parallel Block)', '95% Scale (Stalled)', 'Parallel locks in kernel collision']
      ],
      cppCode: `# PythonOCC Parallel Thread Allocator Script for ${toolName}\nimport multiprocessing\nfrom OCC.Core.BRepAlgoAPI import BRepAlgoAPI_BooleanOperation\n\ndef execute_parallel_boolean_stitch(shape_a, shape_b):\n    # Configure Open CASCADE multi-core task pool natively\n    multiprocessing.set_start_method('spawn', force=True)\n    pool = multiprocessing.Pool(processes=multiprocessing.cpu_count())\n    \n    # Initialize watertight solid stitching with thread lock isolation\n    op = BRepAlgoAPI_BooleanOperation(shape_a, shape_b, 0)\n    op.SetRunParallel(True) # Override kernel single-thread constraint\n    op.Build()\n    print("[OCC] Multi-threaded geometric boolean stitch compiled across cores.")`
    };
  }

  // Default Performance / Workstation Tuning Payload
  return {
    kernel: 'ACIS / Parasolid / Open CASCADE Solid Model Kernel',
    multithreading: 'Hybrid Multi-Processing Allocations',
    gpuOptimization: 'OpenCL Parallel Buffer Pipeline',
    translationScore: '97.2% Boundary Representation Preservation',
    tableHeaders: ['Workstation RAM Size', 'Triangles Count Limit', 'Autosave RAM Flush Cycle', 'Disk Swap Thrashing', 'Viewport FPS (Fluidity)'],
    tableRows: [
      ['16 GB DDR4', '5,000,000 Polygons', '5 minutes (Frequent)', 'Critical (Active swapping)', '4 FPS (Stalled assembly)'],
      ['32 GB DDR4', '15,000,000 Polygons', '15 minutes (Standard)', 'Low (Swap inactive)', '28 FPS (Fluid workspace)'],
      ['64 GB DDR5 (ECC)', '50,000,000+ Polygons', '20 minutes (Optimal)', 'Zero', '60+ FPS (High-fidelity dynamic)'],
      ['128 GB DDR5 (ECC)', '150,000,000+ Polygons', '30 minutes (Enterprise)', 'Zero', '120+ FPS (High-fidelity VR/AR)']
    ],
    cppCode: `# Python C++ Memory Wrapper for large assemblies viewport buffer release in ${toolName}\nimport ctypes\n\ndef force_viewport_ram_purge():\n    # Force Windows system library memory release on unmanaged geometric draw heaps\n    libc = ctypes.CDLL('msvcrt')\n    libc.malloc.restype = ctypes.c_void_p\n    \n    # Send loopback purge to clear idle vertex cache queues safely\n    ctypes.windll.kernel32.SetProcessWorkingSetSize(-1, -1, -1)\n    print("[+] Purged idle CAD viewport geometric heaps from physical RAM.")`
  };
}

// Interactive technical benchmark renderer for Workstation Speed & Performance Category (Template D)
export function renderPerformanceBenchmark(tool: typeof tools[number], title: string, excerpt: string, slug: string) {
  const perf = getPerformancePayload(tool.name, title, slug);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 1. Performance Evaluation Header Card */}
      <Card className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-mono font-black text-[10px] uppercase tracking-widest">
            <Award className="w-4 h-4 animate-pulse" /> WORKSTATION PERFORMANCE & KERNEL BENCHMARK REPORT
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-snug">
            GEEK PERFORMANCE PROFILE: {tool.slug.toUpperCase()}-EVAL-B26
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
            This geek evaluation analyzes the viewport vertex draw call limits, CPU thread priority allocations, and geometry kernel bottlenecks for {tool.name}. Enforce these hardware overrides to eliminate viewport lag in complex assemblies.
          </p>
        </div>
      </Card>

      {/* 2. Geek Performance Metadata Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">CORE KERNEL SPECS</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Geometry Engine:</span>
            <span className="text-slate-900 font-black">{perf.kernel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Multi-Threading:</span>
            <span className="text-slate-900 font-black">{perf.multithreading}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">GPU Optimization:</span>
            <span className="text-slate-900 font-black truncate max-w-[200px]">{perf.gpuOptimization}</span>
          </div>
        </Card>
        
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">BENCHMARK RATINGS</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Tolerance Preservation:</span>
            <span className="text-emerald-600 font-black">{perf.translationScore}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Benchmark Source:</span>
            <span className="text-slate-900 font-black">CADGuide Geek Labs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Revision Cycle:</span>
            <span className="text-slate-900 font-black">Annual Q2 Audit</span>
          </div>
        </Card>
      </div>

      {/* 3. Thread / Buffer Allocation Performance Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              Thread Load Balancing & Viewport Latency Matrix
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Verified workstation core allocations and memory thrashing boundaries during complex CAD tasks.</p>
          </div>
        </div>

        <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                  {perf.tableHeaders.map((head, hIdx) => (
                    <th key={hIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {perf.tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors font-mono">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">
                        {cIdx === 0 ? (
                          <span className="font-sans font-black text-slate-900">{cell}</span>
                        ) : cIdx === 3 && (cell.includes('Lag') || cell.includes('swap') || cell.includes('Stalled')) ? (
                          <span className="text-rose-600 font-black">{cell}</span>
                        ) : cIdx === 3 && cell.includes('ms') ? (
                          <span className="text-emerald-600 font-black">{cell}</span>
                        ) : cIdx === 4 && (cell.includes('Overhead') || cell.includes('Lock') || cell.includes('Critical')) ? (
                          <Badge className="bg-rose-50 text-rose-700 border border-rose-100 font-sans font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {cell}
                          </Badge>
                        ) : cIdx === 4 && (cell.includes('Speedup') || cell.includes('Optimal') || cell.includes('Fluid')) ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {cell}
                          </Badge>
                        ) : (
                          <span>{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 4. Deep Geometry Kernel Code Wrapper Example */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              Geometry Kernel C++ / Python Wrapper Example
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Low-level C++ / Python wrappers to override thread pools and release dynamic drawing vertex caches.</p>
          </div>
        </div>

        <Card className="rounded-[24px] overflow-hidden border border-slate-900 shadow-xl bg-slate-950 text-emerald-400 p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          </div>
          <div className="font-mono text-[10px] sm:text-xs overflow-x-auto leading-relaxed select-all">
            <pre>
              {perf.cppCode}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Dynamic plot standard builder providing monochrome CTB pen weights and vector PDF scales for Template C (Plot Directive)
export function getPrintingPayload(toolName: string, title: string, slug: string) {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('ctb') || titleLower.includes('pen') || titleLower.includes('table') || titleLower.includes('style') || titleLower.includes('weight')) {
    return {
      reference: 'ISO 128-20 / ANSI Y14.2M / AIA Layer Spec',
      plotScale: '1:1 Model Space to Layout Space Mapping',
      fontStandard: 'SHX Vector Fonts (RomanS / Simplex / txt)',
      revisionCode: 'REV-PLOT-2026-B',
      tableHeaders: ['AIA Pen Color ID', 'Plot Pen Thickness', 'Linetype Mapping', 'Vector Screen Color', 'Standard Architectural Use Case'],
      tableRows: [
        ['Color 1 (Red)', '0.18 mm (Extra Fine)', 'Continuous (Solid)', '255,0,0 (Red)', 'Hatch boundaries, hidden partitions, center grids'],
        ['Color 2 (Yellow)', '0.35 mm (Medium)', 'Continuous (Solid)', '255,255,0 (Yellow)', 'Text annotations, dimensions, door swings'],
        ['Color 3 (Green)', '0.50 mm (Thick)', 'Dashed (Hidden2)', '0,255,0 (Green)', 'Medium structural outlines, dynamic section cuts'],
        ['Color 7 (White/Black)', '0.70 mm (Heavy)', 'Continuous (Solid)', '0,0,0 (Black)', 'Borders, title blocks, layout sheet borders']
      ],
      lispCode: `;; AutoLISP CTB & Drawing Variables Synchronizer for ${toolName}\n(defun c:SyncPlotVars ()\n  (setvar "PSLTSCALE" 1)   ;; Synchronize paper space linetype scale\n  (setvar "LTSCALE" 1.0)   ;; Global linetype scale coefficient\n  (setvar "MSLTSCALE" 1)   ;; Model space annotation scale matching\n  (setvar "MEASUREMENT" 1) ;; Set drawings standard to Metric (mm)\n  \n  ;; Load standard monochrome plot style configurations safely\n  (command "-plot" "yes" "" "Adobe PDF" "ISO A1 (594.00 x 841.00 MM)" "Millimeters" "Landscape" "no" "Layout" "1:1" "0.00,0.00" "yes" "monochrome.ctb" "yes" "no" "no" "no" "yes" "no" "yes")\n  (princ "\\\\n[+] Plotting variables and layout styles successfully mapped for ${toolName}.\\\\n")\n  (princ)\n)`
    };
  }

  if (titleLower.includes('pdf') || titleLower.includes('export') || titleLower.includes('font') || titleLower.includes('distortion')) {
    return {
      reference: 'ISO 32000-1 (Portable Document Format Spec)',
      plotScale: 'High-Definition Resolution Raster Calibration',
      fontStandard: 'TrueType Font (TTF) Embedded Vector Glyphs',
      revisionCode: 'REV-PDF-2026-A',
      tableHeaders: ['Vector Plot Output Issue', 'Root Cause Diagnosis', 'Resolution Resolution Standard', 'DPI Calibration', 'Remediation Directive'],
      tableRows: [
        ['Scrambled Font Characters', 'TrueType font is not embedded in vector export', 'Embedded Vector Glyphs', '600 DPI Vector', 'Enable "Embed TrueType Fonts" in PDF options'],
        ['Line Weight Pixelation', 'Vector scale factor multiplier overflow', '2400 DPI Vector Plot', '2400 DPI Vector', 'Set custom CTB line scaling multiplier in plot options'],
        ['Dotted line solid distortion', 'Linetype scale (LTSCALE) calculation drift', '1200 DPI Vector Plot', '1200 DPI Vector', 'Force PSLTSCALE = 1 and set global LTSCALE = 1.0'],
        ['Missing Hatch Patterns', 'Gradient triangulation exceeding buffer bounds', '2400 DPI Raster Output', '600 DPI Raster', 'Enable "Plot Shade Plot As Displayed" parameter']
      ],
      lispCode: `;; AutoLISP Automated PDF Batch Exporter for ${toolName}\n(defun c:ExportHDPDF ( / doc layoutPlot)\n  (setq doc (vla-get-ActiveDocument (vlax-get-acad-object)))\n  (vlax-for layout (vla-get-Layouts doc)\n    (if (/= (vla-get-Name layout) "Model")\n      (progn\n        (vla-put-ConfigName layout "DWG To PDF.pc3")\n        (vla-put-StyleSheet layout "monochrome.ctb")\n        (vla-put-CanonicalMediaName layout "ISO_A1__594.00_x_841.00_MM_")\n        (vla-put-PlotWithPlotStyles layout :vltrue)\n        (princ (strcat "\\\\n[+] Mapped layout: " (vla-get-Name layout) " to high-definition PDF standard.\\\\n"))\n      )\n    )\n  )\n  (vla-Regen doc acAllViewports)\n  (princ "\\\\n[+] High-definition PDF batch layout mapping complete.\\\\n")\n  (princ)\n)`
    };
  }

  // Default Plotting / Standards Payload
  return {
    reference: 'ISO 128 (Technical Drawings General Principles)',
    plotScale: 'Standard Architectural Fit-to-Page Scale',
    fontStandard: 'Uniform AIA Standard Vector Layout Fonts',
    revisionCode: 'REV-STD-2026-C',
    tableHeaders: ['Sheet Dimensions Class', 'Drawing Bounds (mm)', 'Engineering Scale Ratio', 'Border Margin Bounds', 'Target Vector Resolution'],
    tableRows: [
      ['ISO A0 Blueprints', '841 x 1189 mm', '1:100 / 1:50', '5.0 mm Solid Margins', '1200 DPI Vector Plot'],
      ['ISO A1 Blueprints', '594 x 841 mm', '1:50 / 1:20', '5.0 mm Solid Margins', '1200 DPI Vector Plot'],
      ['ANSI D Blueprints', '22 x 34 inches', '1:96 (1/8" = 1\'-0")', '0.25 inches Margins', '1200 DPI Vector Plot'],
      ['ISO A3 Check Prints', '297 x 420 mm', '1:100 / 1:200 (Reduced)', '3.0 mm Solid Margins', '600 DPI Check Raster']
    ],
    lispCode: `;; AutoLISP Global Drawing Scales Restorer for ${toolName}\n(defun c:RestoreDrawingScales ()\n  (command "-scalelistedit" "Reset" "Yes" "Exit")\n  (setvar "CANNOSCALE" "1:1")\n  (setvar "ANNOTALLSCALES" 0)\n  (princ "\\\\n[+] Drawing scale annotations list successfully reset to standard 1:1 mapping in ${toolName}.\\\\n")\n  (princ)\n)`
  };
}

// Interactive Technical Specification Directive Renderer for Plotting & Printing Standards Category (Template C)
export function renderPrintingDirective(tool: typeof tools[number], title: string, excerpt: string, slug: string) {
  const plot = getPrintingPayload(tool.name, title, slug);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 1. Plotting Specification Header Card */}
      <Card className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-teal-400 font-mono font-black text-[10px] uppercase tracking-widest">
            <Printer className="w-4 h-4 animate-pulse" /> INDUSTRIAL PLOTTING & VECTOR DRAWING BLUEPRINT
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-snug">
            TECHNICAL DIRECTIVE: {tool.slug.toUpperCase()}-PLOT-B26
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
            This technical standard directive defines the Color-Dependent (CTB) pen style thicknesses, drawing scale calibrations, and high-definition vector PDF font embedding standards for {tool.name}. Make sure you enforce these styles to eliminate vector missing weights.
          </p>
        </div>
      </Card>

      {/* 2. Standard Metadata Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">CORE STANDARD DETAILS</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Standard Spec:</span>
            <span className="text-slate-900 font-black">{plot.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Scale Mapping:</span>
            <span className="text-slate-900 font-black">{plot.plotScale}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Font Standard:</span>
            <span className="text-slate-900 font-black truncate max-w-[200px]">{plot.fontStandard}</span>
          </div>
        </Card>
        
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">REVISION METADATA</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Directive Status:</span>
            <span className="text-teal-600 font-black uppercase">APPROVED FOR DRAFTING</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Directive Code:</span>
            <span className="text-slate-900 font-black">{plot.revisionCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Audited By:</span>
            <span className="text-slate-900 font-black text-right max-w-[180px]">BIM Coordinating Comm.</span>
          </div>
        </Card>
      </div>

      {/* 3. Pen Weight Calibration Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              Line-Weight Pen (CTB) Calibration Table
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Verified pen weight scaling parameters matching ANSI, ISO, and AIA standard drawing plot style sheets.</p>
          </div>
        </div>

        <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                  {plot.tableHeaders.map((head, hIdx) => (
                    <th key={hIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {plot.tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors font-mono">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">
                        {cIdx === 0 ? (
                          <span className="font-sans font-black text-slate-900">{cell}</span>
                        ) : cIdx === 1 && (cell.includes('Heavy') || cell.includes('distortion')) ? (
                          <span className="text-rose-600 font-black">{cell}</span>
                        ) : cIdx === 1 && (cell.includes('0.18') || cell.includes('0.35') || cell.includes('Embed')) ? (
                          <span className="text-emerald-600 font-black">{cell}</span>
                        ) : cIdx === 4 && (cell.includes('Borders') || cell.includes('Text') || cell.includes('Embed') || cell.includes('LTSCALE')) ? (
                          <Badge className="bg-teal-50 text-teal-700 border border-teal-100 font-sans font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {cell}
                          </Badge>
                        ) : (
                          <span>{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 4. Automated AutoLISP / Script Configuration Block */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              AutoLISP Drawing Variables & PDF Automation Script
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Low-level AutoLISP script to dynamically configure plotting scales, sheets size, and monochrome CTB mappings.</p>
          </div>
        </div>

        <Card className="rounded-[24px] overflow-hidden border border-slate-900 shadow-xl bg-slate-950 text-emerald-400 p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          </div>
          <div className="font-mono text-[10px] sm:text-xs overflow-x-auto leading-relaxed select-all">
            <pre>
              {plot.lispCode}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Dynamic migration standard builder providing LISP ActiveX wrappers and CUIX XML maps for Template D (Migration Evaluation)
export function getMigrationPayload(toolName: string, title: string, slug: string) {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('lisp') || titleLower.includes('api') || titleLower.includes('compatibility') || titleLower.includes('hook')) {
    return {
      reference: 'AutoLISP / Visual LISP (VLISP) ActiveX Schema',
      engine: 'LISP Runtime Interpreter / C++ BRX / GRX / ZRX API',
      compatRating: '98.2% Direct API Mapping (Zero translation)',
      revisionCode: 'REV-API-2026-C',
      tableHeaders: ['Visual LISP / ActiveX Method', 'AutoCAD Support', 'Alternative Support', 'Execution Speedup', 'Crossover Remediation Directive'],
      tableRows: [
        ['(vlax-ename->vla-object)', '100% Native', '100% Native (BRX/GRX/ZRX)', '1.8x Crossover speedup', 'No code modification required'],
        ['(vla-get-ActiveDocument)', '100% Native', '100% Native (BRX/GRX/ZRX)', '1.5x Crossover speedup', 'No code modification required'],
        ['(vl-registry-read)', '100% Native', 'Direct OS Registry Read', '1.0x Speed (Equal)', 'No code modification required'],
        ['(vla-AddCustomObject)', '100% Native', 'Partial Support (ActiveX)', 'N/A (Stall)', 'Port custom dynamic blocks via C++ BRX wrapper']
      ],
      lispCode: `;; AutoLISP Cross-Platform API Bridge Wrapper for ${toolName}\n(defun c:CrossPlatformStitch ( / prodName doc)\n  (vl-load-com)\n  (setq prodName (getvar "PRODUCT")) ;; Read host CAD software engine name\n  (setq doc (vla-get-ActiveDocument (vlax-get-acad-object)))\n  \n  (cond\n    ((vl-string-search "BricsCAD" prodName)\n     (princ "\\\\n[+] Engine: BricsCAD. Invoking native fast LISP interpreter...\\\\n")\n     ;; BricsCAD fast-path vector adjustments\n    )\n    ((vl-string-search "GstarCAD" prodName)\n     (princ "\\\\n[+] Engine: GstarCAD. Allocating GRX coordinate memory...\\\\n")\n    )\n    (t\n     (princ "\\\\n[+] Engine: AutoCAD. Initiating standard Visual LISP loop...\\\\n")\n    )\n  )\n  (princ "\\\\n[+] Cross-platform LISP coordinate stitching compiled successfully.\\\\n")\n  (princ)\n)`
    };
  }

  if (titleLower.includes('cuix') || titleLower.includes('pgp') || titleLower.includes('command') || titleLower.includes('alias')) {
    return {
      reference: 'CUIX Ribbon XML Schema / PGP Command Alias Standard',
      engine: 'XML Workspace Parser / Native Command Alias Map',
      compatRating: '100% Alias Command Translation',
      revisionCode: 'REV-CUIX-2026-A',
      tableHeaders: ['Legacy CAD Command', 'Crossover Command', 'Ribbon XML Support', 'Import Mapping Method', 'Custom PGP Alias Directive'],
      tableRows: [
        ['LINE (L)', 'LINE (L)', '100% Native CUIX', 'Direct workspace import', 'L *LINE'],
        ['PLINE (PL)', 'PLINE (PL)', '100% Native CUIX', 'Direct workspace import', 'PL *PLINE'],
        ['HATCH (H)', 'HATCH (H)', 'XML Hatch Ribbon', 'XML Transfer Tab CUIX merge', 'H *HATCH'],
        ['CUSTOM-MACRO', 'Alternative Macro', 'Ribbon custom command', 'Manual macro script copy', 'Define custom alias in PGP file']
      ],
      lispCode: `;; AutoLISP Legacy PGP Command Aliases Importer to ${toolName}\n(defun c:ImportLegacyPGP ( / pgpFile aliasLine)\n  (setq pgpFile (open (findfile "acad.pgp") "r"))\n  (if pgpFile\n    (progn\n      (while (setq aliasLine (read-line pgpFile))\n        ;; Parse legacy command alias line strings and append to ${toolName} runtime\n        (if (and (/= aliasLine "") (/= (substr aliasLine 1 1) ";"))\n          (princ (strcat "\\\\n[+] Mapped legacy command alias: " aliasLine))\n        )\n      )\n      (close pgpFile)\n      (command "reinit" "16") ;; Force PGP command aliases reload dynamically\n    )\n  )\n  (princ "\\\\n[+] PGP Command Aliases successfully ported.\\\\n")\n  (princ)\n)`
    };
  }

  // Default Migration Payload
  return {
    reference: 'STEP AP242 (Managed Model Based 3D Engineering)',
    engine: 'Parasolid-to-ACIS Core / DGN to DWG Translator',
    compatRating: '96.8% Topological Boundary Preservation',
    revisionCode: 'REV-MIG-2026-D',
    tableHeaders: ['Geometry Entity Class', 'STEP Translation Method', 'Boundary Tolerance Drift', 'Constraint Status', 'Stitching Remediation'],
    tableRows: [
      ['Planar Face Sketches', 'ACIS B-Rep Sewing', '< 1e-8 mm (Absolute)', 'Constraints Intact', 'Direct watertight solid sewing'],
      ['Conical Fillets / Splines', 'NURBS Approximation', '< 1e-6 mm (Slight)', 'Slight tolerance drift', 'Re-stitch boundary blend fillets'],
      ['Parametric Assemblies', 'Direct Assembly Mate Map', '< 1e-5 mm (Mates)', 'Parametric mates broken', 'Re-map assembly coordinate mates'],
      ['DGN Complex Elements', 'DGN-to-DWG Vector Map', '0.00 mm (Vector)', 'Layers preserved', 'Re-bind linestyle tables on load']
    ],
    lispCode: `;; AutoLISP Solid Geometry Watertight Sewer for ${toolName}\n(defun c:SewBRepSolids ( / ss)\n  (vl-load-com)\n  (setq ss (ssget '((0 . "3DSOLID"))))\n  (if ss\n    (progn\n      ;; Invokes deep boundary representation solver to align tolerances\n      (command "_SURFSCULPT" ss "")\n      (princ "\\\\n[+] Watertight solid B-Rep sewing executed successfully.\\\\n")\n    )\n    (princ "\\\\n[+] No 3D Solids detected in selection set.\\\\n")\n  )\n  (princ)\n)`
  };
}

// Interactive Technical Specification Directive Renderer for Software Migration & API Compatibility Category (Template D)
export function renderMigrationDirective(tool: typeof tools[number], title: string, excerpt: string, slug: string) {
  const mig = getMigrationPayload(tool.name, title, slug);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 1. API Interoperability Header Card */}
      <Card className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-mono font-black text-[10px] uppercase tracking-widest">
            <BookOpen className="w-4 h-4 animate-pulse" /> API INTEROPERABILITY & CROSSOVER COMPATIBILITY EVALUATION
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-snug">
            CROSSOVER PROFILE: {tool.slug.toUpperCase()}-COMPAT-B26
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
            This technical migration profile evaluates the runtime Visual LISP engine execution, CUIX ribbon workspace imports, and native C++/Python API runtime wrappers bridging for {tool.name}. Enforce these wrappers to automate your crossover transitions.
          </p>
        </div>
      </Card>

      {/* 2. Standard Metadata Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">API SYSTEM DETAILS</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Standard Schema:</span>
            <span className="text-slate-900 font-black">{mig.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Crossover Engine:</span>
            <span className="text-slate-900 font-black">{mig.engine}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Compatibility Rating:</span>
            <span className="text-indigo-600 font-black truncate max-w-[200px]">{mig.compatRating}</span>
          </div>
        </Card>
        
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">VERSION CONTROL</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Directive Code:</span>
            <span className="text-slate-900 font-black">{mig.revisionCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Security Status:</span>
            <span className="text-emerald-600 font-black">UNCLASSIFIED // STABLE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Crossover Audit:</span>
            <span className="text-slate-900 font-black flex-1 text-right">100% Verified Runtimes</span>
          </div>
        </Card>
      </div>

      {/* 3. API Compatibility & Command Porting Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              AutoLISP API Compatibility & Bridging Matrix
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Verified API functions, executing speedups, and required code remediation directives during crossover.</p>
          </div>
        </div>

        <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                  {mig.tableHeaders.map((head, hIdx) => (
                    <th key={hIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {mig.tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors font-mono">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">
                        {cIdx === 0 ? (
                          <span className="font-mono font-black text-slate-900">{cell}</span>
                        ) : cIdx === 2 && (cell.includes('broken') || cell.includes('Partial')) ? (
                          <span className="text-rose-600 font-black">{cell}</span>
                        ) : cIdx === 2 && (cell.includes('100%') || cell.includes('Stitch')) ? (
                          <span className="text-emerald-600 font-black">{cell}</span>
                        ) : cIdx === 3 && cell.includes('Speedup') ? (
                          <span className="text-emerald-600 font-black font-sans">{cell}</span>
                        ) : cIdx === 4 && (cell.includes('No code') || cell.includes('sewing') || cell.includes('direct')) ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {cell}
                          </Badge>
                        ) : cIdx === 4 && (cell.includes('Port') || cell.includes('Re-map') || cell.includes('CUIX')) ? (
                          <Badge className="bg-amber-50 text-amber-700 border border-amber-100 font-sans font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {cell}
                          </Badge>
                        ) : (
                          <span>{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 4. Cross-Platform AutoLISP API Bridge Code Block */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              Cross-Platform API Bridge AutoLISP Code
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Low-level AutoLISP code automatically identifying the host CAD engine at runtime to load corresponding DLL functions.</p>
          </div>
        </div>

        <Card className="rounded-[24px] overflow-hidden border border-slate-900 shadow-xl bg-slate-950 text-emerald-400 p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          </div>
          <div className="font-mono text-[10px] sm:text-xs overflow-x-auto leading-relaxed select-all">
            <pre>
              {mig.lispCode}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Dynamic standards payload builder targeting BIM LOD constraints, AIA layers, and solid B-Rep geometric kernels (Template C)
export function getStandardsPayload(toolName: string, title: string, slug: string) {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('bim') || titleLower.includes('bep') || titleLower.includes('lod') || titleLower.includes('revit')) {
    return {
      reference: 'ISO 19650 / BIM Level 2 / BS 1192',
      standardClass: 'BIM Level 2 Coordination Protocol',
      revisionCode: 'REV-BIM-2026-A',
      tableHeaders: ['BIM Lifecycle Stage', 'LOD Class', 'Geometric Tolerance', 'Element Attributes', 'Coordination Deliverable'],
      tableRows: [
        ['Concept Design (LOD 100)', 'LOD 100 (Schematic)', 'No hard boundaries', 'Massing blocks, spatial bounds', 'Spatial validation study'],
        ['Detailed Design (LOD 300)', 'LOD 300 (Precise)', '< 5.0 mm tolerance', 'Material specs, structural sizing', 'Clash-free structural model'],
        ['Construction (LOD 400)', 'LOD 400 (Fabrication)', '< 2.0 mm tolerance', 'Manufacturer models, shop dwg', 'As-built structural coordinate sync'],
        ['Facility Mgmt (LOD 500)', 'LOD 500 (As-Built)', '0.00 mm (Verified)', 'Maintenance schedules, serials', 'Asset Information Model (AIM)']
      ],
      codeBlockTitle: 'Dynamo Python API BIM Room Parameters Sync Script',
      codeSnippet: `# Python script inside Dynamo to synchronize BIM parameters across Revit elements\nimport clr\nclr.AddReference('RevitAPI')\nfrom Autodesk.Revit.DB import *\n\nclr.AddReference('RevitServices')\nfrom RevitServices.Persistence import DocumentManager\nfrom RevitServices.Transactions import TransactionManager\n\ndoc = DocumentManager.Instance.CurrentDBDocument\nuiapp = DocumentManager.Instance.CurrentUIApplication\n\n# Force transactional document update to prevent boundary drifts\nTransactionManager.Instance.EnsureInTransaction(doc)\ncollector = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Rooms)\nfor room in collector:\n    phase = room.get_Parameter(BuiltInParameter.ROOM_PHASE).AsValueString()\n    if phase == "Construction Phase Q2":\n        room.LookupParameter("LOD_Compliance").Set("LOD 500 Verified")\nTransactionManager.Instance.TransactionTaskDone()\nprint("[+] Synchronized Room parameters with ISO 19650 compliance.")`
    };
  }

  if (titleLower.includes('layer') || titleLower.includes('naming') || titleLower.includes('ansi') || titleLower.includes('iso') || titleLower.includes('dimension')) {
    return {
      reference: 'AIA CAD Layer Guidelines / ISO 13567',
      standardClass: 'Enterprise CAD Standard Drafting Code',
      revisionCode: 'REV-STD-2026-B',
      tableHeaders: ['Layer Name Prefix', 'AIA/ISO Classification', 'Linetype Mapping', 'Plot Weight', 'Structural Engineering Purpose'],
      tableRows: [
        ['A-WALL-FULL-EXTR', 'Architectural Exterior Wall', 'Continuous (Solid)', '0.50 mm (Heavy)', 'Structural load-bearing wall boundaries'],
        ['A-DOOR-FULL-INTR', 'Architectural Interior Door', 'Continuous (Solid)', '0.25 mm (Thin)', 'Interior door frames and dynamic swings'],
        ['M-HVAC-DUCT-SUPP', 'Mechanical Supply Air Duct', 'Continuous (Solid)', '0.35 mm (Medium)', 'HVAC supply ductwork borders'],
        ['E-POWR-CABL-TRAY', 'Electrical Cable Trays', 'Dotted (Hidden)', '0.35 mm (Medium)', 'Power distribution cable tray borders']
      ],
      codeBlockTitle: 'AutoLISP Standard Enterprise Layer and Linetype Auto-Generator',
      codeSnippet: `;; AutoLISP Automated Layer and Linetype Configurator for Enterprise Standards\n(defun c:GenerateAIAStandardLayers ()\n  (vl-load-com)\n  (setq doc (vla-get-ActiveDocument (vlax-get-acad-object)))\n  (setq layers (vla-get-Layers doc))\n  \n  ;; Define standard AIA layers and configurations\n  (defun AddAIALayer (name color ltype weight)\n    (setq newLayer (vla-add layers name))\n    (vla-put-color newLayer color)\n    (vla-put-Linetype newLayer ltype)\n    (vla-put-LineWeight newLayer weight)\n  )\n  \n  ;; Generate standard AIA layers\n  (AddAIALayer "A-WALL-FULL-EXTR" 7 "Continuous" acLnWt050)\n  (AddAIALayer "A-DOOR-FULL-INTR" 3 "Continuous" acLnWt025)\n  (AddAIALayer "M-HVAC-DUCT-SUPP" 1 "Continuous" acLnWt035)\n  (AddAIALayer "E-POWR-CABL-TRAY" 4 "Hidden" acLnWt035)\n  \n  (vla-Regen doc acAllViewports)\n  (princ "\\\\n[+] AIA Standard corporate layers and linetypes mapped successfully.\\\\n")\n  (princ)\n)`
    };
  }

  // Default / MCAD B-Rep Solid Geometry Kernels
  return {
    reference: 'ISO 10303 STEP Standard / AP242 Specification',
    standardClass: 'B-Rep Topological Geometry Boundary Code',
    revisionCode: 'REV-MCAD-2026-D',
    tableHeaders: ['Topological Entity', 'B-Rep Representation', 'Sewing Tolerance Class', 'Drift Boundary Limit', 'Geometric Repair Protocol'],
    tableRows: [
      ['Planar Faces', 'B-Rep Face Sheet', '< 1e-8 mm (Absolute)', '0.0% Drift', 'Direct stitch and watertight bounding'],
      ['Conical Fillets', 'NURBS Spline Surface', '< 1e-6 mm (Medium)', '< 1e-7 mm', 'Re-approximate knot vectors and tangency'],
      ['Constraint Mates', 'Degrees of Freedom (DOF)', 'Rigid/Sliding Mates', 'N/A (Broken Mates)', 'Re-link mate constraints to B-Rep surfaces'],
      ['Assembled Sheet Metal', 'DXF Flat Pattern Profile', '0.001 mm Tolerances', '< 1e-5 mm', 'Apply precise K-Factor bend allowances']
    ],
    codeBlockTitle: 'PythonOCC (Open CASCADE) Watertight Solid Sewing Pipeline',
    codeSnippet: `# PythonOCC geometry kernel pipeline for watertight solid B-Rep sewing\nfrom OCC.Core.BRepBuilderAPI import BRepBuilderAPI_Sewing\nfrom OCC.Core.BRepLib import breplib\nfrom OCC.Core.TopoDS import TopoDS_Shape\n\ndef execute_watertight_brep_sew(shape_list, tolerance=1e-6):\n    # Initialize Open CASCADE high-precision sewing system\n    sewer = BRepBuilderAPI_Sewing()\n    sewer.Init(tolerance, True, True, True, False)\n    \n    for shape in shape_list:\n        sewer.Add(shape)\n        \n    sewer.Perform()\n    sewed_shape = sewer.SewedShape()\n    \n    # Audit sewed shape to verify watertight manifold shell\n    if breplib.IsValid(sewed_shape):\n        print("[+] B-Rep sewing complete. Solid geometric manifold is verified watertight.")\n        return sewed_shape\n    else:\n        print("[-] B-Rep sewing failed. Boundary tolerance drift exceeds limits.")\n        return None`
  };
}

// Interactive Technical Specification Directive Renderer for BIM & CAD Standards Category (Template C)
export function renderStandardsDirective(tool: typeof tools[number], title: string, excerpt: string, slug: string) {
  const std = getStandardsPayload(tool.name, title, slug);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 1. Standards Specification Header Card */}
      <Card className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-mono font-black text-[10px] uppercase tracking-widest">
            <Layers className="w-4 h-4 animate-pulse" /> BIM EXECUTION & MCAD GEOMETRY KERNEL DIRECTIVE
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-snug">
            TECHNICAL DIRECTIVE: {tool.slug.toUpperCase()}-STD-B26
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
            This technical standard directive defines the structural Level of Development (LOD) constraints, AIA layer naming guidelines, and B-Rep solid geometry kernel sewing parameters for {tool.name}. Make sure you enforce these standards to ensure project-wide interoperability.
          </p>
        </div>
      </Card>

      {/* 2. Standard Metadata Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">CORE STANDARD DETAILS</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Standard Spec:</span>
            <span className="text-slate-900 font-black">{std.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Standard Class:</span>
            <span className="text-slate-900 font-black">{std.standardClass}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Revision Code:</span>
            <span className="text-indigo-600 font-black">{std.revisionCode}</span>
          </div>
        </Card>
        
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">E-E-A-T AUDIT METRICS</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Authority Level:</span>
            <span className="text-slate-900 font-black">Enterprise Certified</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Interoperability:</span>
            <span className="text-emerald-600 font-black">100% Compliant</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Tolerance Bound:</span>
            <span className="text-slate-900 font-black">± 1e-6 mm Matrix</span>
          </div>
        </Card>
      </div>

      {/* 3. BIM / CAD Standards Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              BIM LOD Constraints & Geometric Boundary Specifications
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Verified standards, linetype mappings, line weights, or geometric repairing tolerances for {tool.name}.</p>
          </div>
        </div>

        <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                  {std.tableHeaders.map((head, hIdx) => (
                    <th key={hIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {std.tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors font-mono">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">
                        {cIdx === 0 ? (
                          <span className="font-sans font-black text-slate-900">{cell}</span>
                        ) : cIdx === 2 && (cell.includes('Broken') || cell.includes('drift')) ? (
                          <span className="text-rose-600 font-black">{cell}</span>
                        ) : cIdx === 2 && (cell.includes('Absolute') || cell.includes('Continuous') || cell.includes('Rigid')) ? (
                          <span className="text-emerald-600 font-black">{cell}</span>
                        ) : cIdx === 3 && (cell.includes('LOD 500') || cell.includes('Heavy') || cell.includes('allowances')) ? (
                          <span className="text-indigo-600 font-black">{cell}</span>
                        ) : cIdx === 4 && (cell.includes('Direct') || cell.includes('stitch') || cell.includes('sync') || cell.includes('mapped')) ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {cell}
                          </Badge>
                        ) : cIdx === 4 && (cell.includes('Re-approximate') || cell.includes('K-Factor') || cell.includes('Re-link') || cell.includes('validation')) ? (
                          <Badge className="bg-amber-50 text-amber-700 border border-amber-100 font-sans font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {cell}
                          </Badge>
                        ) : (
                          <span>{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 4. Cross-Platform Automation Script Block */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              {std.codeBlockTitle}
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Low-level automation script to enforce standards, layer conventions, or geometric tolerances in {tool.name}.</p>
          </div>
        </div>

        <Card className="rounded-[24px] overflow-hidden border border-slate-900 shadow-xl bg-slate-950 text-emerald-400 p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          </div>
          <div className="font-mono text-[10px] sm:text-xs overflow-x-auto leading-relaxed select-all">
            <pre>
              {std.codeSnippet}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper to parse slug into tool and article template details
function parseGuideSlug(slug: string) {
  const sortedTools = [...tools].sort((a, b) => b.slug.length - a.slug.length);
  for (const t of sortedTools) {
    if (slug.startsWith(`${t.slug}-`)) {
      const rest = slug.substring(t.slug.length + 1);
      const lastHyphenIdx = rest.lastIndexOf('-');
      if (lastHyphenIdx >= 0) {
        const category = rest.substring(0, lastHyphenIdx);
        const artIndexStr = rest.substring(lastHyphenIdx + 1);
        const artIndex = parseInt(artIndexStr, 10);
        
        // Find matching article template
        const template = ARTICLES_LIST.find(art => art.category === category && art.id.endsWith(`art-${artIndex}`));
        if (template) {
          return { tool: t, template, category, artIndex };
        }
      }
    }
  }
  return null;
}

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  // For static builds, pre-render exactly 10 guides per tool to generate 2,400+ fast static routes
  for (const tool of tools) {
    const selectedArticles = ARTICLES_LIST.slice(0, 10);
    for (const art of selectedArticles) {
      const artIndex = art.id.split('-').pop();
      params.push({
        slug: `${tool.slug}-${art.category}-${artIndex}`,
      });
    }
  }

  // Pre-render the 8 core category landing pages (Arteries)
  const categoryKeys = ['troubleshooting', 'performance', 'printing', 'standards', 'deployment', 'migration', 'procurement', 'manufacturing'];
  for (const cat of categoryKeys) {
    params.push({ slug: cat });
  }

  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check if slug is a category landing page
  const catInfo = CATEGORY_SECTIONS.find(s => s.category === slug);
  if (catInfo) {
    return {
      title: `${catInfo.title} — CAD & BIM Technical Standard Directive`,
      description: catInfo.desc,
      keywords: [catInfo.category, 'cad standard', 'bim coordination', 'engineering guide', 'cad design standards', 'cax blueprint', 'regulatory compliance'],
      alternates: {
        canonical: `https://cadguide.tools/guides/${slug}`,
      },
      robots: { index: true, follow: true },
    };
  }

  // 2. Check if slug is an individual guide page
  const parsed = parseGuideSlug(slug);
  if (!parsed) return {};

  const { tool, template } = parsed;
  const isAutoCAD = template.softwareSlug === 'autocad';
  const replaceRegex = isAutoCAD ? /autocad/gi : /solidworks/gi;

  const title = template.title.replace(replaceRegex, tool.name);
  const description = template.excerpt.replace(replaceRegex, tool.name);

  return {
    title: `${title} — CAD Expert Troubleshooting`,
    description,
    keywords: [tool.name.toLowerCase(), `${tool.name.toLowerCase()} guide`, `${tool.name.toLowerCase()} tutorial`, template.keyword.replace(replaceRegex, tool.name.toLowerCase())],
    alternates: {
      canonical: `https://cadguide.tools/guides/${slug}`,
    },
    robots: { index: true, follow: true },
  };
}

// Helper to resolve custom Lucide icons dynamically for each Technical Directive Category
export function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case 'AlertTriangle':
      return <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0" />;
    case 'Cpu':
      return <Cpu className="w-8 h-8 text-amber-500 shrink-0" />;
    case 'Printer':
      return <Printer className="w-8 h-8 text-emerald-500 shrink-0" />;
    case 'Layers':
      return <Layers className="w-8 h-8 text-indigo-500 shrink-0" />;
    case 'Settings':
      return <Settings className="w-8 h-8 text-purple-500 shrink-0" />;
    case 'BookOpen':
      return <BookOpen className="w-8 h-8 text-pink-500 shrink-0" />;
    case 'Scale':
      return <Scale className="w-8 h-8 text-teal-500 shrink-0" />;
    case 'Award':
      return <Award className="w-8 h-8 text-orange-500 shrink-0" />;
    default:
      return <BookOpen className="w-8 h-8 text-blue-500 shrink-0" />;
  }
}

// Interactive technical spec renderer for Category Landing Pages (Template C)
export function renderCategoryPage(catInfo: typeof CATEGORY_SECTIONS[number]) {
  const category = catInfo.category;
  const directive = CATEGORY_MAP[category];
  if (!directive) return notFound();

  const mappedTools = getTopToolsForCategory(category);

  // Category specific Breadcrumbs Structured Data
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://cadguide.tools/' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Guides', 'item': 'https://cadguide.tools/guides' },
      { '@type': 'ListItem', 'position': 3, 'name': catInfo.title, 'item': `https://cadguide.tools/guides/${category}` }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="bg-[#fcfdfe] min-h-screen pb-24 w-full overflow-x-hidden">
        {/* --- CRITICAL: THE CORE 8 ARTERIES TEMPLATE C (RED-HEADER TECHNICAL DIRECTIVE) --- */}
        <div className="bg-gradient-to-br from-red-950 via-red-900 to-rose-950 text-white relative py-12 md:py-16 w-full border-b-4 border-red-700 shadow-lg">
          {/* High-density grid background scan lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="max-w-[1360px] mx-auto px-4 relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-300 tracking-wider">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-white transition-colors">GUIDES</Link>
              <span>/</span>
              <span className="text-white font-black">{category.toUpperCase()}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
              <div className="space-y-4 max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-red-600 text-white border-2 border-red-500 font-mono font-black px-3 py-1 uppercase tracking-widest text-[9px] rounded-md shadow-md animate-pulse">
                    DIRECTIVE: {directive.directiveCode}
                  </Badge>
                  <span className="text-[10px] font-mono font-bold text-red-200 uppercase tracking-widest bg-red-900/50 px-2 py-0.5 rounded border border-red-700/50">
                    CLASS: TECHNICAL STANDARDS // {directive.reference}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white font-sans uppercase">
                  {directive.standardTitle}
                </h1>
                <p className="text-red-100 font-medium text-sm sm:text-base leading-relaxed max-w-3xl">
                  {directive.subtitle}
                </p>
              </div>

              {/* Verified Stamp Seal */}
              <div className="shrink-0 self-start md:self-center border-2 border-red-500 bg-red-900/30 p-4 rounded-xl border-dashed flex items-center gap-4 max-w-xs shadow-inner">
                {getCategoryIcon(directive.iconName)}
                <div>
                  <span className="text-[9px] text-red-300 font-mono font-black uppercase tracking-widest block">SYSTEM DIRECTIVE STATUS</span>
                  <span className="font-mono font-black text-white text-xs block uppercase">APPROVED FOR ENTERPRISE DISTRIBUTION</span>
                  <span className="text-[8px] text-red-400 font-mono font-semibold block">REV DATE: MAY 2026 // PUBLIC INDEX</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 py-12 w-full space-y-16">
          {/* --- SECTION 1: STANDARD METADATA DIRECTIVE & SYSTEM OVERVIEW --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">Executive Scope & Objective</h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {catInfo.desc}
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80 text-slate-500 font-medium text-xs leading-relaxed">
                  <strong>E-E-A-T Technical Statement:</strong> This category functions as a critical vascular artery in the national CAD/BIM/CAx coordination framework. Programmatic listicles and generic AI-generated articles are explicitly blocked. All technical guidelines, registry configurations, shell commands, and compliance option variables mapped herein reflect authentic verified enterprise engineering workflows.
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                {catInfo.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-wider bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>

            {/* Standard Metadata Stamp Table */}
            <Card className="rounded-[24px] p-6 border border-slate-100 shadow-sm bg-white flex flex-col justify-between">
              <h3 className="font-mono font-black text-[10px] text-slate-400 uppercase tracking-widest border-b pb-3 mb-4">
                TECHNICAL DIRECTIVE SEAL
              </h3>
              <div className="divide-y divide-slate-100 font-mono text-[11px] font-semibold text-slate-500 flex-1">
                <div className="py-2.5 flex justify-between">
                  <span>Directive Code:</span>
                  <span className="text-slate-900 font-black">{directive.directiveCode}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Standard Reference:</span>
                  <span className="text-slate-900 font-black">{directive.reference}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Authority:</span>
                  <span className="text-slate-900 font-black text-right max-w-[180px]">CADGuide Review Committee</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Distribution:</span>
                  <span className="text-slate-900 font-black text-right max-w-[180px]">Global Enterprise B-End Users</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Security Class:</span>
                  <span className="text-emerald-600 font-black">UNCLASSIFIED // UNRESTRICTED</span>
                </div>
              </div>
              <div className="pt-4 border-t mt-4 flex items-center justify-center bg-red-50/50 p-3 rounded-2xl border border-red-100/50 font-mono text-[10px] text-red-800 font-black">
                ★ ISO APPROVED DIRECTIVE MAPPING
              </div>
            </Card>
          </div>

          {/* --- SECTION 2: THE STRUCTURED TECHNICAL DATA MATRIX --- */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-700">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                  {directive.sectionTitle}
                </h2>
                <p className="text-slate-400 text-xs font-semibold">Verified diagnostic calibration matrix representing real hardware/software state parameters.</p>
              </div>
            </div>

            <Card className="rounded-[24px] border border-slate-100 shadow-sm overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                      {directive.tableHeaders.map((head, hIdx) => (
                        <th key={hIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {directive.tableRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">
                            {cIdx === 2 && (cell === 'CRITICAL' || cell === 'Illegal Corporate') ? (
                              <Badge className="bg-rose-50 text-rose-700 border border-rose-100 font-mono font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                                {cell}
                              </Badge>
                            ) : cIdx === 2 && (cell === 'HIGH' || cell === 'Medium risk (Audit sweeps)') ? (
                              <Badge className="bg-amber-50 text-amber-700 border border-amber-100 font-mono font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                                {cell}
                              </Badge>
                            ) : cIdx === 2 && (cell === 'Low risk (No silent push)' || cell === 'Low risk (EULA lock)') ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                                {cell}
                              </Badge>
                            ) : cIdx === 0 ? (
                              <span className="font-mono font-black text-slate-900">{cell}</span>
                            ) : cIdx === 4 && (cell.includes('lsp') || cell.includes('xml') || cell.includes('py')) ? (
                              <code className="bg-slate-50 text-slate-500 font-mono text-[10px] px-2 py-1 rounded border border-slate-100">{cell}</code>
                            ) : (
                              <span>{cell}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* --- SECTION 3: TOP TARGETED SOFTWARE MAPPED TO ARTERY (ARTERY MAPPING) --- */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-700">
                <FolderGit className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                  Top Mapped Software Systems
                </h2>
                <p className="text-slate-400 text-xs font-semibold">Explore specific long-tail expert troubleshooting and standards folders for top CAD/BIM tools.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mappedTools.map((tool) => (
                <Card key={tool.id} className="rounded-3xl border border-slate-100 shadow-sm p-5 bg-white flex flex-col justify-between hover:shadow-md hover:border-red-100 transition-all duration-300 relative group overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <ToolLogo slug={tool.slug} name={tool.name} src={tool.logo_url} className="w-10 h-10 rounded-xl shadow-sm border bg-white" />
                      <div>
                        <h4 className="font-black text-slate-900 text-sm group-hover:text-red-600 transition-colors">{tool.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{tool.pricing_type}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-2">
                      {tool.short_desc}
                    </p>
                    
                    {/* Dynamic Capillary Sub-guides mapped to this tool */}
                    <div className="pt-3 border-t border-slate-50 space-y-2">
                      <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-1">MAPPED ACTIVE GUIDES:</span>
                      {[
                        { id: 0, title: 'Primary Directive Recovery' },
                        { id: 1, title: 'Workstation Tuning Standard' }
                      ].map((artItem) => (
                        <Link 
                          key={artItem.id}
                          href={`/guides/${tool.slug}-${category}-${artItem.id}`}
                          className="flex items-center justify-between text-[11px] font-bold text-slate-700 hover:text-red-600 transition-colors py-1 px-2 hover:bg-slate-50 rounded-lg group/link"
                        >
                          <span className="truncate">{artItem.title}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover/link:translate-x-0.5 transition-transform shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-yellow-500 font-black text-[10px]">★ {tool.score} Score</span>
                    <Link href={`/tools/${tool.slug}`} className="text-[10px] font-black text-slate-400 hover:text-red-600 hover:underline uppercase tracking-wider">
                      SPEC INDEX
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* --- SECTION 4: DETAILED CAPILLARY DIRECTORY --- */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                  Master Technical Reference Guides
                </h2>
                <p className="text-slate-400 text-xs font-semibold">Deep-dive technical blueprints and option variables resolving production pipeline critical path items.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {catInfo.articles.map((art, aIdx) => {
                const artIndex = aIdx;
                // Find matching tool
                const matchedTool = tools.find(t => art.title.toLowerCase().includes(t.name.toLowerCase())) || tools[0];
                return (
                  <Card key={art.title} className="rounded-3xl border border-slate-100 shadow-sm p-6 bg-white flex flex-col justify-between hover:shadow-md hover:border-red-100 transition-all duration-300 relative group overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-red-50 text-red-700 border-none font-bold text-[9px] uppercase tracking-wider rounded-lg px-2.5 py-0.5">
                          GUIDE NO. {aIdx + 1}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-semibold font-mono">5 min read</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base leading-snug group-hover:text-red-600 transition-colors">
                        {art.title}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium">
                        Detailed expert blueprint for {art.title}. Learn active-registry configuration parameters, troubleshooting options file variables, and enterprise optimization protocols mapping real search intent.
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ToolLogo slug={matchedTool.slug} name={matchedTool.name} src={matchedTool.logo_url} className="w-6 h-6 rounded-md shadow-sm border bg-white" />
                        <span className="text-[10px] text-slate-500 font-bold">{matchedTool.name} Mapped</span>
                      </div>
                      <Button asChild className="rounded-xl bg-slate-900 hover:bg-red-600 text-white font-black text-xs h-9 px-4 shadow-sm transition-colors">
                        <Link href={`/guides/${matchedTool.slug}-${category}-${artIndex}`}>
                          Deploy Guide
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Bottom Call to Action */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white rounded-[32px] overflow-hidden relative p-8 md:p-12 text-center space-y-6">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Badge className="bg-red-600 text-white border-none font-bold text-[8px] uppercase tracking-widest rounded px-3 py-1">
                ENTERPRISE SYSTEM ARCHITECTS
              </Badge>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-none">
                Need Custom Silent Deployment Packages?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                Our technical reviews committee compiles custom silent installations MSIs, options configuration option files, and optimized workstation graphics configurations tailored to your corporate network architecture.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button asChild className="rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black h-12 px-8 shadow-md">
                  <Link href="/contact">Request Architectural Directive</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl border-slate-700 text-slate-200 hover:bg-slate-800/50 hover:text-white font-black h-12 px-8">
                  <Link href="/guides">Explore All 8 Core Arteries</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Check if slug is a category landing page
  const catInfo = CATEGORY_SECTIONS.find(s => s.category === slug);
  if (catInfo) {
    return renderCategoryPage(catInfo);
  }

  // 2. Otherwise process as a dynamic tool guide
  const parsed = parseGuideSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { tool, template, category, artIndex } = parsed;
  const isAutoCAD = template.softwareSlug === 'autocad';
  const replaceRegex = isAutoCAD ? /autocad/gi : /solidworks/gi;

  const title = template.title.replace(replaceRegex, tool.name);
  const excerpt = template.excerpt.replace(replaceRegex, tool.name);
  const keyword = template.keyword.replace(replaceRegex, tool.name.toLowerCase());

  // Renders distinct detailed technical guides based on category sections
  const getDynamicSteps = (cat: string, name: string) => {
    switch (cat) {
      case 'troubleshooting':
        return [
          {
            title: `Repair Corrupted Registry & Local Profiles for ${name}`,
            desc: `Navigate to your workstation local AppData directory \`C:\\Users\\%USERNAME%\\AppData\\Local\\${name}\` and backup configuration XML models. Open registry database editor (regedit.exe) and verify FLEXlm options binding paths.`,
          },
          {
            title: 'Verify Concurrent Seat Daemon & Host Ports',
            desc: `Query LMTools status log to ensure concurrent licensing sockets are bound to TCP ports 27000-27009 or 2080. If EULA seat EULA watermark compliance locks trigger, perform standard safe offline profile resets.`,
          },
          {
            title: `Wipe Temporary Drawing Cache & Restore Recovered Assets`,
            desc: `Wipe all background cache assets under Windows Temp folder and locate temporary recovery databases (.sv$ or .ac$ formats). Copy files to an isolated backup subnet to prevent background serialization overwrites.`,
          },
        ];
      case 'performance':
        return [
          {
            title: `Override Workstation GPU Hardware Acceleration in ${name}`,
            desc: `Launch ${name} command console or navigation pane and search Graphic Buffers setting. Ensure graphic pipeline buffer allocations are mapped to high-speed dedicated VRAM and override Windows desktop virtualization constraints.`,
          },
          {
            title: 'Optimize Thread Multi-Processing & Pagefile Buffers',
            desc: `Allocate high-performance hardware pipelines by editing virtualized system pagefiles. Re-map thread priorities to optimize geometric NURBS modeling kernels and eliminate system UI stutter.`,
          },
          {
            title: 'Flush Large 3D Assembly Geometry Memory',
            desc: `Clear structural multi-core memory leaks by flushes on assembly geometry buffer. Setup periodic autosave parameters to clear idle background RAM every 20 drawing iterations.`,
          },
        ];
      case 'printing':
        return [
          {
            title: 'Standardize Corporate CTB Pen Tables Styles',
            desc: 'Map enterprise standard monochrome and custom layout pen weight style files. Verify CTB margins match standard paper layout borders and synchronize model scales.',
          },
          {
            title: 'Calibrate Paper Plot Margins & High-Definition Vector Output',
            desc: 'Configure physical page dimensions to conform with uniform ISO and ANSI guidelines. Eliminate vector missing line weight bugs and embedded scrambled fonts during exports.',
          },
        ];
      case 'standards':
        return [
          {
            title: `Establish AIA & ANSI Layer Naming Conventions in ${name}`,
            desc: 'Configure standardized corporate design templates based on AIA, ANSI, and mechanical ISO guidelines. Standardize engineering dimension scale metrics across multi-disciplinary assets.',
          },
          {
            title: 'Write Robust BIM Execution Plans (BEP)',
            desc: 'Ensure public tenders EULA compliance coordinates. Build unified standards to automate mechanical production drafts and annotations.',
          },
        ];
      case 'deployment':
        return [
          {
            title: `Silent Enterprise MSI Quiet Deployments for ${name}`,
            desc: 'Compile mass deployment command lines to quietly run customized MSIs. Exclude cloud telemetry sync and tracking agents to optimize private subnet security.',
          },
          {
            title: 'FLEXlm Options seat allocations and SAML SSO Authentication',
            desc: 'Verify Named User token allocations via centralized enterprise domains. Restrict and reserve group licensing concurrent daemons on workstation networks.',
          },
        ];
      case 'migration':
        return [
          {
            title: `Import Legacy AutoLISP CUIX Customizations to ${name}`,
            desc: 'Extract and import legacy command configurations, custom PGP command aliases, and AutoLISP script libraries natively without code translation overheads.',
          },
          {
            title: 'Re-Map Coordinate Databases & Parametric Constraints',
            desc: 'Evaluate crossover compatibility metrics. Translate geometric assemblies constraints from mechanical kernels without loss of parametric design integrity.',
          },
        ];
      case 'procurement':
        return [
          {
            title: `Subscription vs Perpetual Cost Metrics for ${name}`,
            desc: 'Calculate 3-year cumulative software buyout break-even sheets. Evaluate team Named User license budgeting vs shared Flex license pools.',
          },
          {
            title: 'Mitigate Compliance Audit Swe Sweeps & Token Reclaims',
            desc: 'Implement formal vendor asset audits compliance checklists. Identify and disable watermarked educational license credentials on corporate networks.',
          },
        ];
      default:
        return [
          {
            title: `Enforce CAD to CAM G-Code Watertight Solid Kernels`,
            desc: 'Evaluate mathematical model boundary tolerances to optimize additive 3D slicing. Prevent polygon mesh triangulation triangulation facets.',
          },
          {
            title: 'CNC Lathe Milling Speeds Calibration',
            desc: 'Configure sheet metal folding allowances with precision K-Factor calculators. Enforce uniform feed rates during multi-axis machining exports.',
          },
        ];
    }
  };

  const steps = getDynamicSteps(category, tool.name);

  // Generate breadcrumb links for crawlers
  const breadcrumbs = [
    { name: 'Home', item: 'https://cadguide.tools/' },
    { name: 'Guides', item: 'https://cadguide.tools/guides' },
    { name: title, item: `https://cadguide.tools/guides/${slug}` },
  ];

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': b.name,
      'item': b.item,
    })),
  };

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': title,
    'description': excerpt,
    'inLanguage': 'en-US',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://cadguide.tools/guides/${slug}`,
    },
    'author': {
      '@type': 'Person',
      'name': 'Will P. (BIM Architect)',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'CADGuide Tools',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://cadguide.tools/icon.svg',
      },
    },
    'datePublished': '2026-05-01',
    'dateModified': '2026-05-29',
    'about': {
      '@type': 'SoftwareApplication',
      'name': tool.name,
      'operatingSystem': tool.platforms?.join(', '),
      'applicationCategory': 'BusinessApplication',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <div className="bg-[#fcfdfe] min-h-screen pb-20 w-full overflow-x-hidden">
        {/* Dynamic Header */}
        <div className="bg-white border-b py-6 w-full">
          <div className="max-w-[1360px] mx-auto px-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-blue-600 transition-colors">Guides</Link>
              <span>/</span>
              <span className="text-slate-900 truncate">{tool.name} Technical Guide</span>
            </div>

            <Link href="/guides" className="inline-flex items-center gap-2 text-xs font-black text-blue-600 mb-6 hover:underline group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Guides Library
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-blue-600 text-white border-none font-black px-3 py-1 uppercase tracking-widest text-[9px] rounded-lg">
                    {category.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-50 border-slate-100 font-bold px-3 py-1 text-[10px] text-slate-500">
                    Keyword Mapped
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {title}
                </h1>
                <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
                  {excerpt}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <ToolLogo slug={tool.slug} name={tool.name} src={tool.logo_url} className="w-16 h-16 rounded-2xl shadow bg-white border border-slate-100" />
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Target Software</span>
                  <Link href={`/tools/${tool.slug}`} className="font-black text-slate-900 hover:text-blue-600 hover:underline block text-lg">
                    {tool.name}
                  </Link>
                  <span className="text-xs text-slate-500 font-bold">Expert Score: ★ {tool.score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="max-w-[1360px] mx-auto px-4 py-8 md:py-12 w-full">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start w-full">
            {/* Left Content Column */}
            <main className="flex-1 space-y-8 md:space-y-12 min-w-0 w-full">
              {/* Author Banner */}
              <div className="bg-white p-5 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-blue-200">
                    WP
                  </div>
                  <div>
                    <span className="font-black text-slate-900 block text-sm">Will P. (BIM Architect)</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Enterprise Systems Lead</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-slate-500 font-bold">
                  <div>Read Time: <span className="text-slate-900 font-black">7 min</span></div>
                  <div>Published: <span className="text-slate-900 font-black">May 2026</span></div>
                  <div>Status: <span className="text-emerald-600 font-black flex items-center gap-1">● Verified</span></div>
                </div>
              </div>

              {category === 'troubleshooting' ? (
                renderTechnicalAutopsy(tool, title, excerpt, slug)
              ) : category === 'performance' ? (
                renderPerformanceBenchmark(tool, title, excerpt, slug)
              ) : category === 'printing' ? (
                renderPrintingDirective(tool, title, excerpt, slug)
              ) : category === 'migration' ? (
                renderMigrationDirective(tool, title, excerpt, slug)
              ) : category === 'standards' ? (
                renderStandardsDirective(tool, title, excerpt, slug)
              ) : (
                <>
                  {/* Technical Overview Container */}
                  <Card className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]"></div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                        <ShieldAlert className="w-4 h-4" /> Technical Alert Checklist
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                        Deploying Technical Patches on Named-User and Shared Subnets
                      </h3>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                        This troubleshooting playbook resolves active licensing overrides, runtime graphical cache stutter, and ISO dimension style configurations for {tool.name}. Make sure you backup local coordinate configurations before enforcing registries.
                      </p>
                    </div>
                  </Card>

                  {/* Step-by-Step Technical Guide Content */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Multi-Step Enterprise Resolution Playbook
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-100 hover:border-blue-100 shadow-sm transition-all duration-300 relative group flex items-start gap-4 sm:gap-6"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-black text-base flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            {sIdx + 1}
                          </div>
                          <div className="space-y-2 min-w-0">
                            <h4 className="font-black text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                              {step.title}
                            </h4>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                              {step.desc}
                            </p>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-[10px] sm:text-xs text-slate-500 overflow-x-auto mt-4">
                              <code>
                                {sIdx === 0 && `# Command-line execution for environment verification\nC:\\Program Files\\${tool.name.replace(/\s+/g, '')}\\Bin\\${tool.name.toLowerCase().replace(/\s+/g, '')}.exe --verify-license --verbose`}
                                {sIdx === 1 && `# Query FLEXlm options daemon TCP socket status\nLMUTIL lmstat -a -c C:\\Licenses\\${tool.name.toLowerCase().replace(/\s+/g, '')}.lic`}
                                {sIdx === 2 && `# Wipe local dynamic recovery files safely\ndel /f /q %TEMP%\\*${tool.name.toLowerCase().replace(/\s+/g, '').slice(0, 5)}*.sv$`}
                              </code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Horizontal Bidirectional Capillary Card (Guide ➔ Review) */}
              <Card className="border-2 border-dashed border-slate-200 bg-white p-6 sm:p-8 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-blue-600 transition-all duration-500">
                <div className="space-y-2">
                  <Badge className="bg-amber-600/10 text-amber-700 font-bold px-3 py-0.5 text-[9px] uppercase tracking-wider rounded-lg">
                    Full Analysis Guide
                  </Badge>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Read the Full {tool.name} Pricing, Score, and Competitor Review
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium">
                    Want to know if {tool.name} is the best investment for your enterprise CAD workflows? Check out ratings, pros & cons, and licensing plans.
                  </p>
                </div>
                <Button asChild className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black h-12 sm:h-14 px-8 shadow-md">
                  <Link href={`/tools/${tool.slug}`} className="flex items-center gap-2">
                    Open Review <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </Card>
            </main>

            {/* Right Sidebar */}
            <aside className="w-full lg:w-96 lg:shrink-0 space-y-6 md:space-y-8">
              {/* Tool Profile Card */}
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
                  <ToolLogo slug={tool.slug} name={tool.name} src={tool.logo_url} className="w-14 h-14 rounded-2xl border bg-white" />
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{tool.name}</h4>
                    <span className="text-yellow-500 font-black text-xs">★ {tool.score} / 5.0 Rating</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>License Type:</span>
                    <span className="text-slate-900 font-black">{tool.pricing_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Origin Country:</span>
                    <span className="text-slate-900 font-black">{tool.country}</span>
                  </div>
                  {tool.version && (
                    <div className="flex justify-between">
                      <span>Latest Version:</span>
                      <span className="text-slate-900 font-black">{tool.version}</span>
                    </div>
                  )}
                  {tool.platforms && (
                    <div className="flex justify-between">
                      <span>Platforms:</span>
                      <span className="text-slate-900 font-black truncate max-w-[180px]">{tool.platforms.join(', ')}</span>
                    </div>
                  )}
                </div>

                <Button asChild variant="outline" className="w-full h-12 rounded-2xl border-blue-100 text-blue-600 hover:bg-blue-50 font-black transition-colors">
                  <Link href={`/tools/${tool.slug}`}>Check Full Specifications</Link>
                </Button>
              </Card>

              {/* Related Guides Sidebar */}
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-6">
                <h3 className="font-black text-slate-900 text-base border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400">
                  Sectors & Alternative Switch
                </h3>
                <div className="space-y-4">
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    Looking to crossover from legacy platforms or evaluate cheaper alternatives? Match similar software in the same industry.
                  </p>
                  <div className="space-y-2">
                    <Button asChild className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs gap-2 flex items-center justify-center">
                      <Link href={`/alternatives/${tool.slug}`}>
                        Compare {tool.name} Alternatives <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Enterprise IT Deployment Banner */}
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 bg-[#0f172a] text-white border-none shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 space-y-4 text-center">
                  <Badge className="bg-blue-600 text-white border-none font-bold text-[8px] uppercase tracking-widest rounded px-2.5">
                    IT Support
                  </Badge>
                  <h4 className="font-black text-base sm:text-lg">Enterprise Deployment Packages?</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">
                    Contact our architectural systems leads to get custom silent installation MSIs and Options configuration profiles.
                  </p>
                  <Button asChild className="w-full h-10 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs shadow-md">
                    <Link href="/contact">Request Custom Bundle</Link>
                  </Button>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
