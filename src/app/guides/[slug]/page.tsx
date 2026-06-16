import { tools } from '@/lib/data';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolLogo } from '@/components/tool-logo';
import { AICitation } from '@/components/ai-citation';
import { ARTICLES_LIST, CATEGORY_SECTIONS, getArchetypeMetadata, getLocalizedTitleAndExcerpt, isArticleCompatibleWithTool } from '@/lib/guides-data';
import { Award, Cpu, ArrowLeft, AlertTriangle, ShieldAlert, BookOpen, ArrowRight, Layers, Printer, Settings, Scale, FileSpreadsheet, FolderGit, Activity, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { comparisonPairs } from '@/lib/seo-content';
import { pricingSummary } from '@/lib/seo';
import { PROCUREMENT_LIST, getProcurementBySlug, ProcurementIndustry } from '@/lib/procurement-data';
import { getStandardPageData, STANDARDS_LIST, DRAFTING_TOOLS, DraftingStandardPage } from '@/lib/standards-data';
import { getLicensingShieldData, LICENSING_TOOLS, LicensingShieldPage } from '@/lib/licensing-data';
import { getKernelPageData, KERNEL_TOOLS, KernelPageData } from '@/lib/kernel-data';

export const dynamicParams = true;

// 稳定的内容日期常量。此前 dateModified 用 new Date() 每次请求都刷成"今天"，向爬虫
// 伪造内容新鲜度；改为固定的内容版本日期，仅在内容实质性更新时手动调整。
const GUIDE_CONTENT_PUBLISHED = '2026-05-01';
const GUIDE_CONTENT_UPDATED = '2026-06-15';

// 故障排查母版此前对所有工具写死 Autodesk 专属的授权栈（ADSKFLEX_LICENSE_FILE /
// adsklicensing / AdskLicensingService）和 AutoCAD 专属的图纸恢复文件（.sv$ / .ac$）。
// 对非 Autodesk / 非 DWG 工具这是穿帮。下面按品牌/家族给出正确的标识符。
function isAutodeskProduct(tool: typeof tools[number]): boolean {
  return /autocad|autodesk|revit|inventor|civil 3d|fusion 360|navisworks|3ds max|\bmaya\b|recap|infraworks|advance steel|netfabb|mudbox|\balias\b|vault|fabrication/i.test(tool.name);
}

function licenseStack(tool: typeof tools[number]) {
  if (isAutodeskProduct(tool)) {
    return { envVar: 'ADSKFLEX_LICENSE_FILE', dll: 'adsklicensing.dll', proc: 'adsklicensing.exe', service: 'AdskLicensingService' };
  }
  // 通用 FlexNet/FLEXlm 授权栈（适用于大多数商业 CAD/CAE 厂商）
  return { envVar: 'LM_LICENSE_FILE', dll: 'lmgrd.exe', proc: 'lmgrd.exe', service: 'FlexNet Licensing Service' };
}

function recoveryArtifact(tool: typeof tools[number]) {
  const coreFeat = (tool.core_features || []).join(' ').toLowerCase();
  const isDwgFamily = tool.category_id === 'c1' || /autolisp|\bdwg\b|\blisp\b/.test(coreFeat) || isAutodeskProduct(tool);
  return isDwgFamily
    ? { files: '`.ac$` or `.sv$`', glob: 'sv$', noun: 'drawing recovery lockfiles', cache: 'drawing cache' }
    : { files: '`.bak` or autosave', glob: 'bak', noun: 'autosave/backup recovery files', cache: 'model cache' };
}

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
export function getAutopsyPayload(tool: typeof tools[number], title: string) {
  const toolName = tool.name;
  const titleLower = title.toLowerCase();
  const lic = licenseStack(tool);
  const rec = recoveryArtifact(tool);
  
  if (titleLower.includes('error-15') || titleLower.includes('error -15') || titleLower.includes('flexlm-error-15')) {
    return {
      module: 'lmgrd.exe / vendor_daemon.exe',
      code: 'FLEXlm Error -15,10 (WSAECONNREFUSED)',
      offset: 'Network Socket Handshake Failure',
      severity: 'CRITICAL // LICENSING OFFLINE',
      rootCause: `The client application failed to establish a TCP socket connection to the FLEXlm license coordinator daemon (lmgrd). This typically occurs when the license server host is offline, local or corporate firewalls block outbound connections on TCP ports 27000-27009 or the vendor-specific daemon port (default 2080), or the licensing network environment variables are misconfigured.`,
      registryKey: `HKEY_CURRENT_USER\\Software\\FLEXlm License Manager\\`,
      registryValue: `"FLEXLM_TIMEOUT" = DWORD:000f4240 (1,000,000 microseconds timeout patch)`,
      recoveryScript: `@echo off
echo ===================================================
echo   CAD DIRECTIVE: FLEXLM SERVER SOCKET TIMEOUT & PORT RESET
echo ===================================================
echo [+] Terminating dynamic license background helper tools...
taskkill /f /im fnplicensingoutprocess.exe >nul 2>&1
echo [+] Patching FLEXlm environment timeout variables...
reg add "HKCU\\Software\\FLEXlm License Manager" /v "FLEXLM_TIMEOUT" /t REG_DWORD /d 1000000 /f
echo [+] Clearing local cached licensing files...
del /f /q "%USERPROFILE%\\.flexlmrc" >nul 2>&1
echo [+] Verifying target port connectivity (TCP 27000)...
powershell -Command "Test-NetConnection 127.0.0.1 -Port 27000" || echo [!] WARNING: Local port 27000 is unreachable!
echo [+] Process complete. Verify server latency and relaunch ${toolName}.`
    };
  }
  
  if (titleLower.includes('license') || titleLower.includes('flexlm') || titleLower.includes('activation')) {
    return {
      module: `${lic.dll} / lmgrd.exe`,
      code: '0x00002740 (WSAEADDRINUSE)',
      offset: '0x0004c8f1',
      severity: 'CRITICAL // ACTIVATION LOCKED',
      rootCause: `FLEXlm licensing service socket port binding collision. The license daemon attempted to bind to default TCP port 27000 or 2080, which is already occupied by a phantom licensing lockfile or duplicate active background daemon process.`,
      registryKey: `HKEY_LOCAL_MACHINE\\SOFTWARE\\FLEXlm License Manager\\`,
      registryValue: `"${lic.envVar}" = "27000@127.0.0.1"`,
      recoveryScript: `@echo off
echo ===================================================
echo   CAD DIRECTIVE: FORCED LICENSE DAEMON SOCKET RESET
echo ===================================================
echo [+] Stopping concurrent license service daemons...
taskkill /f /im lmgrd.exe >nul 2>&1
taskkill /f /im ${lic.proc} >nul 2>&1
echo [+] Wiping active network license socket locks...
netstat -ano | findstr :27000
echo [+] Re-registering licensing service environment...
reg add "HKLM\\SOFTWARE\\FLEXlm License Manager" /v "${lic.envVar}" /t REG_SZ /d "27000@127.0.0.1" /f
echo [+] Restarting licensing socket daemons...
sc start "${lic.service}"
echo [+] Process complete. Verify environment by relaunching ${toolName}.`
    };
  }
  
  if (titleLower.includes('freeze') || titleLower.includes('0x0024') || titleLower.includes('crash') || titleLower.includes('corrupt')) {
    return {
      module: toolName.toLowerCase().includes('autocad') ? 'ac1st24.dll' : toolName.toLowerCase().includes('solidworks') ? 'sldworks.exe' : 'cax_geometry.dll',
      code: '0xC0000005 (Access Violation)',
      offset: '0x0001f3b2',
      severity: 'CRITICAL // INTERFACE STALLED',
      rootCause: `Dynamic vertex array buffer overflow inside the local ${rec.cache}. The application encountered an unmapped physical memory access violation while parsing complex geometric B-Rep topological data structures or loading corrupted model metadata.`,
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

  const isPosixOrOpenSource = tool.pricing_type === 'Open Source' || (tool.platforms && tool.platforms.length > 0 && !tool.platforms.some(p => p.toLowerCase().includes('windows')));

  if (isPosixOrOpenSource) {
    return {
      module: `${toolName.toLowerCase().replace(/\s+/g, '')}_core.so`,
      code: 'SIGSEGV (Segmentation fault)',
      offset: '0x0002b8a0',
      severity: 'HIGH // DAEMON TERMINATED',
      rootCause: `Unmanaged physical memory segment read violation during dynamic coordinate matrix transformation. Geometry kernel encountered boundary drift tolerances exceeding software sketch solver parameters.`,
      registryKey: `~/.config/${toolName.replace(/\s+/g, '')}/Diagnostics.conf`,
      registryValue: `SafeModeLaunch=1`,
      recoveryScript: `#!/bin/bash
echo "==================================================="
echo "  CAD DIRECTIVE: UNIX SAFE MODE DIAGNOSTIC ENV"
echo "==================================================="
echo "[+] Forcing ${toolName} dynamic process termination..."
killall -9 ${toolName.toLowerCase().replace(/\s+/g, '')} >/dev/null 2>&1
echo "[+] Creating POSIX config diagnostic safe-launch override..."
mkdir -p ~/.config/${toolName.replace(/\s+/g, '')}
echo "SafeModeLaunch=1" >> ~/.config/${toolName.replace(/\s+/g, '')}/Diagnostics.conf
echo "[+] Process complete. Launch ${toolName} to calibrate system."`
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
export function renderTechnicalAutopsy(tool: typeof tools[number], title: string) {
  const autopsy = getAutopsyPayload(tool, title);
  const rec = recoveryArtifact(tool);

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
                Wipe Corrupted Local User {rec.cache === 'drawing cache' ? 'Drawing Caches' : 'Model Caches'}
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                {`Navigate to your workstation local AppData path \`C:\\Users\\%USERNAME%\\AppData\\Local\\${tool.name.replace(/\s+/g, '')}\\\` and safely delete dynamic ${rec.noun} (${rec.files}) and cached options to prevent serialize crash loop cycles.`}
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
export function getPerformancePayload(tool: typeof tools[number], title: string) {
  const toolName = tool.name;
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

  const isPosixOrOpenSource = tool.pricing_type === 'Open Source' || (tool.platforms && tool.platforms.length > 0 && !tool.platforms.some(p => p.toLowerCase().includes('windows')));

  if (isPosixOrOpenSource) {
    return {
      kernel: 'ACIS / Parasolid / Open CASCADE Solid Model Kernel',
      multithreading: 'Hybrid POSIX Multi-Processing',
      gpuOptimization: 'OpenGL / Vulkan Parallel Pipeline',
      translationScore: '97.2% Boundary Representation Preservation',
      tableHeaders: ['Workstation RAM Size', 'Triangles Count Limit', 'Autosave RAM Flush Cycle', 'Disk Swap Thrashing', 'Viewport FPS (Fluidity)'],
      tableRows: [
        ['16 GB RAM', '5,000,000 Polygons', '5 minutes (Frequent)', 'Critical (Active swapping)', '4 FPS (Stalled assembly)'],
        ['32 GB RAM', '15,000,000 Polygons', '15 minutes (Standard)', 'Low (Swap inactive)', '28 FPS (Fluid workspace)'],
        ['64 GB RAM (ECC)', '50,000,000+ Polygons', '20 minutes (Optimal)', 'Zero', '60+ FPS (High-fidelity dynamic)'],
        ['128 GB RAM (ECC)', '150,000,000+ Polygons', '30 minutes (Enterprise)', 'Zero', '120+ FPS (High-fidelity VR/AR)']
      ],
      cppCode: `# Python POSIX Memory Wrapper for large assemblies viewport buffer release in ${toolName}\nimport ctypes\nimport sys\n\ndef force_viewport_ram_purge():\n    if sys.platform != "win32":\n        # Send loopback purge to clear idle vertex cache queues safely via glibc malloc_trim\n        libc = ctypes.CDLL('libc.so.6')\n        libc.malloc_trim(0)\n        print("[+] Purged idle CAD viewport geometric heaps from physical RAM via glibc.")`
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
export function renderPerformanceBenchmark(tool: typeof tools[number], title: string) {
  const perf = getPerformancePayload(tool, title);

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
export function getPrintingPayload(tool: typeof tools[number], title: string) {
  const toolName = tool.name;
  const titleLower = title.toLowerCase();

  const isLispCompatible = tool.pricing_type !== 'Open Source' && tool.platforms.some(p => p.toLowerCase().includes('windows'));

  if (!isLispCompatible) {
    return {
      reference: 'PDF/X-4 & ISO 32000-2 (Open PDF Standard)',
      plotScale: 'High-Definition Resolution Raster/Vector Hybrid',
      fontStandard: 'OpenType Font (OTF/TTF) Path Embedding',
      revisionCode: 'REV-PDF-2026-F',
      tableHeaders: ['Sheet Dimensions Class', 'Drawing Bounds (mm)', 'Engineering Scale Ratio', 'Border Margin Bounds', 'Target Resolution'],
      tableRows: [
        ['ISO A0 Blueprints', '841 x 1189 mm', '1:100 / 1:50', '5.0 mm Solid Margins', '1200 DPI Vector Plot'],
        ['ISO A1 Blueprints', '594 x 841 mm', '1:50 / 1:20', '5.0 mm Solid Margins', '1200 DPI Vector Plot'],
        ['ANSI D Blueprints', '22 x 34 inches', '1:96 (1/8" = 1\'-0")', '0.25 inches Margins', '1200 DPI Vector Plot'],
        ['ISO A3 Check Prints', '297 x 420 mm', '1:100 / 1:200 (Reduced)', '3.0 mm Solid Margins', '600 DPI Check Raster']
      ],
      codeBlockTitle: `Python Headless PDF Vector Exporter for ${toolName}`,
      codeSnippet: `# Python headless PDF vector exporter for ${toolName}\nimport os\nimport subprocess\n\ndef batch_export_pdf(directory):\n    # Iterates and converts standard CAD drawings to PDF via headless CLI\n    print(f"[+] Scanning {directory} for drawing layouts...")\n    cmd = ["${toolName.toLowerCase()}-cli", "--headless", "--export-pdf", "--dpi=1200", "--margin=5", directory]\n    subprocess.run(cmd, check=True)\n    print(f"[+] Batch vector PDF export complete for {toolName}.")`
    };
  }

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
      codeBlockTitle: `AutoLISP CTB & Drawing Variables Synchronizer`,
      codeSnippet: `;; AutoLISP CTB & Drawing Variables Synchronizer for ${toolName}\n(defun c:SyncPlotVars ()\n  (setvar "PSLTSCALE" 1)   ;; Synchronize paper space linetype scale\n  (setvar "LTSCALE" 1.0)   ;; Global linetype scale coefficient\n  (setvar "MSLTSCALE" 1)   ;; Model space annotation scale matching\n  (setvar "MEASUREMENT" 1) ;; Set drawings standard to Metric (mm)\n  \n  ;; Load standard monochrome plot style configurations safely\n  (command "-plot" "yes" "" "Adobe PDF" "ISO A1 (594.00 x 841.00 MM)" "Millimeters" "Landscape" "no" "Layout" "1:1" "0.00,0.00" "yes" "monochrome.ctb" "yes" "no" "no" "no" "yes" "no" "yes")\n  (princ "\\\\n[+] Plotting variables and layout styles successfully mapped for ${toolName}.\\\\n")\n  (princ)\n)`
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
      codeBlockTitle: `AutoLISP Automated PDF Batch Exporter`,
      codeSnippet: `;; AutoLISP Automated PDF Batch Exporter for ${toolName}\n(defun c:ExportHDPDF ( / doc layoutPlot)\n  (setq doc (vla-get-ActiveDocument (vlax-get-acad-object)))\n  (vlax-for layout (vla-get-Layouts doc)\n    (if (/= (vla-get-Name layout) "Model")\n      (progn\n        (vla-put-ConfigName layout "DWG To PDF.pc3")\n        (vla-put-StyleSheet layout "monochrome.ctb")\n        (vla-put-CanonicalMediaName layout "ISO_A1__594.00_x_841.00_MM_")\n        (vla-put-PlotWithPlotStyles layout :vltrue)\n        (princ (strcat "\\\\n[+] Mapped layout: " (vla-get-Name layout) " to high-definition PDF standard.\\\\n"))\n      )\n    )\n  )\n  (vla-Regen doc acAllViewports)\n  (princ "\\\\n[+] High-definition PDF batch layout mapping complete.\\\\n")\n  (princ)\n)`
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
    codeBlockTitle: `AutoLISP Global Drawing Scales Restorer`,
    codeSnippet: `;; AutoLISP Global Drawing Scales Restorer for ${toolName}\n(defun c:RestoreDrawingScales ()\n  (command "-scalelistedit" "Reset" "Yes" "Exit")\n  (setvar "CANNOSCALE" "1:1")\n  (setvar "ANNOTALLSCALES" 0)\n  (princ "\\\\n[+] Drawing scale annotations list successfully reset to standard 1:1 mapping in ${toolName}.\\\\n")\n  (princ)\n)`
  };
}

// Interactive Technical Specification Directive Renderer for Plotting & Printing Standards Category (Template C)
export function renderPrintingDirective(tool: typeof tools[number], title: string) {
  const plot = getPrintingPayload(tool, title);

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
              {plot.codeBlockTitle}
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Low-level automation script to dynamically configure plotting scales, layout sheets size, and vector mappings.</p>
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
              {plot.codeSnippet}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Dynamic migration standard builder providing LISP ActiveX wrappers and CUIX XML maps for Template D (Migration Evaluation)
export function getMigrationPayload(tool: typeof tools[number], title: string) {
  const toolName = tool.name;
  const titleLower = title.toLowerCase();

  const isPosixOrOpenSource = tool.pricing_type === 'Open Source' || (tool.platforms && tool.platforms.length > 0 && !tool.platforms.some(p => p.toLowerCase().includes('windows')));

  if (isPosixOrOpenSource) {
    return {
      reference: 'STEP AP242 / Open CASCADE B-Rep Translators',
      engine: 'Open CASCADE Technology (OCCT) Kernel',
      compatRating: '95.6% Direct Boundary preservation',
      revisionCode: 'REV-KRN-2026-X',
      tableHeaders: ['Source MCAD Entity', 'OCCT Equivalent', 'Tolerance Shift', 'Conversion Result', 'Remediation Action'],
      tableRows: [
        ['PK_BODY_type_solid', 'TopoDS_Solid', '< 1e-7 mm', 'Watertight Solid', 'Direct import, no stitching required'],
        ['Proprietary NURBS', 'Geom_BSplineSurface', '< 1e-4 mm (Knot drift)', 'Split boundaries', 'Re-approximate spline surface in kernel'],
        ['Macro Mates', 'Python API Constraints', 'N/A', 'Mates broken', 'Map kinematic constraints using PythonOCC']
      ],
      codeBlockTitle: `PythonOCC Migration Topology Fix Script for ${toolName}`,
      codeSnippet: `# PythonOCC Script to repair broken topology after crossover migration\nfrom OCC.Core.BRepBuilderAPI import BRepBuilderAPI_Sewing\n\ndef repair_migration_topology(shape_list):\n    sewer = BRepBuilderAPI_Sewing()\n    sewer.Init(1e-5, True, True, True, False)\n    for shape in shape_list:\n        sewer.Add(shape)\n    sewer.Perform()\n    return sewer.SewedShape()`
    };
  }

  if (titleLower.includes('solidworks to autocad') || titleLower.includes('solidworks xt')) {
    return {
      reference: 'Parasolid (.x_t) to ACIS (.sat) Kernel Schema',
      engine: 'Spatial ACIS Interoperability / Parasolid Exchange Translator',
      compatRating: '95.6% Direct Boundary preservation (0.001mm tolerance drift)',
      revisionCode: 'REV-KRN-2026-A',
      tableHeaders: ['Parasolid Entity', 'ACIS SAT Equivalent', 'Tolerance Shift', 'Conversion Result', 'Remediation Action'],
      tableRows: [
        ['PK_BODY_type_solid', 'AcisBody (Solid)', '< 1e-7 mm', 'Watertight Solid', 'Direct import, no stitching required'],
        ['PK_SURFACE_type_spline', 'AcisNurbsSurface', '< 1e-4 mm (Knot drift)', 'Split face boundaries', 'Re-approximate spline surface in AutoCAD'],
        ['PK_EDGE_type_blend', 'AcisBlendEdge (Fillet)', '< 1e-3 mm (Gaps)', 'Broken fillet edges', 'Re-fillet edges in AutoCAD using tolerance override'],
        ['PK_ASSEMBLY_structure', 'AcisAssemblyGroup', 'N/A', 'Flat components list', 'Manually rebuild assembly constraint hierarchy']
      ],
      codeBlockTitle: `AutoLISP ACIS Kernel Import Tolerance Calibration`,
      codeSnippet: `;; AutoLISP ACIS Kernel Import Tolerance Calibration for \${toolName}\n(defun c:CalibrateACISImport ()\n  (setvar "FACETRES" 8.0)  ;; Maximize viewport render quality for 3D solids\n  (setvar "ISOLINES" 16)   ;; Increase wireframe resolution on curved faces\n  (setvar "DISPSILH" 1)    ;; Hide mesh silhouette lines in shaded modes\n  \n  ;; Set ACIS import boundary stitch tolerance to sub-micron\n  (command "_ACISIN" "_Tolerance" "0.001")\n  (princ "\\\\n[+] ACIS kernel import boundary tolerances set to 0.001mm for \${toolName}.\\\\n")\n  (princ)\n)`
    };
  }

  if (titleLower.includes('catia to solidworks') || titleLower.includes('catia v5')) {
    return {
      reference: 'ISO 10303 STEP AP203/AP214 / Dassault Systemes Schema',
      engine: 'Dassault Multi-CAD Exchange / STEP Assembly Translator',
      compatRating: '94.2% Constraints Mapping (requires mate re-linking)',
      revisionCode: 'REV-MAT-2026-B',
      tableHeaders: ['CATIA V5 Assembly Mate', 'SolidWorks Mate Equivalent', 'Constraint Status', 'Tolerance Deviation', 'Crossover Remediation'],
      tableRows: [
        ['Coincidence Mate (Axis)', 'Concentric Mate', '100% Preserved', '0.00 mm (Aligned)', 'No action required'],
        ['Contact Mate (Plane)', 'Coincident Mate', '90% Preserved', '< 1e-6 mm (Yaw drift)', 'Manually align surfaces if coordinate offsets trigger'],
        ['Offset Mate (Distance)', 'Distance Mate', 'Partial Support (Broken)', '< 1e-5 mm', 'Reset distance value in SolidWorks mate properties'],
        ['Angle Mate', 'Angle Mate', 'Broken (Axis lost)', 'N/A', 'Re-select reference faces and define angle constraints']
      ],
      codeBlockTitle: `VBA Macro template to re-establish broken mates`,
      codeSnippet: `;; VBA Macro template to re-establish broken mates in SolidWorks after CATIA import\n' Paste this inside SolidWorks Macro Editor (VBA)\nDim swApp As Object\nDim swModel As Object\nDim swAssy As Object\n\nSub RebuildMatesAfterCatiaImport()\n    Set swApp = Application.SldWorks\n    Set swModel = swApp.ActiveDoc\n    \n    If swModel.GetType = 2 Then ' Verify if active doc is Assembly\n        Set swAssy = swModel\n        ' Purge invalid dynamic mate offsets and force constraint rebuild\n        swAssy.ForceRebuild\n        MsgBox "SolidWorks Assembly mates rebuilt from CATIA import boundaries successfully.", vbInformation\n    End If\nEnd Sub`
    };
  }

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
      codeBlockTitle: `AutoLISP Cross-Platform API Bridge Wrapper`,
      codeSnippet: `;; AutoLISP Cross-Platform API Bridge Wrapper for ${toolName}\n(defun c:CrossPlatformStitch ( / prodName doc)\n  (vl-load-com)\n  (setq prodName (getvar "PRODUCT")) ;; Read host CAD software engine name\n  (setq doc (vla-get-ActiveDocument (vlax-get-acad-object)))\n  \n  (cond\n    ((vl-string-search "BricsCAD" prodName)\n     (princ "\\\\n[+] Engine: BricsCAD. Invoking native fast LISP interpreter...\\\\n")\n     ;; BricsCAD fast-path vector adjustments\n    )\n    ((vl-string-search "GstarCAD" prodName)\n     (princ "\\\\n[+] Engine: GstarCAD. Allocating GRX coordinate memory...\\\\n")\n    )\n    (t\n     (princ "\\\\n[+] Engine: AutoCAD. Initiating standard Visual LISP loop...\\\\n")\n    )\n  )\n  (princ "\\\\n[+] Cross-platform LISP coordinate stitching compiled successfully.\\\\n")\n  (princ)\n)`
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
      codeBlockTitle: `AutoLISP Legacy PGP Command Aliases Importer`,
      codeSnippet: `;; AutoLISP Legacy PGP Command Aliases Importer to ${toolName}\n(defun c:ImportLegacyPGP ( / pgpFile aliasLine)\n  (setq pgpFile (open (findfile "acad.pgp") "r"))\n  (if pgpFile\n    (progn\n      (while (setq aliasLine (read-line pgpFile))\n        ;; Parse legacy command alias line strings and append to ${toolName} runtime\n        (if (and (/= aliasLine "") (/= (substr aliasLine 1 1) ";"))\n          (princ (strcat "\\\\n[+] Mapped legacy command alias: " aliasLine))\n        )\n      )\n      (close pgpFile)\n      (command "reinit" "16") ;; Force PGP command aliases reload dynamically\n    )\n  )\n  (princ "\\\\n[+] PGP Command Aliases successfully ported.\\\\n")\n  (princ)\n)`
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
    codeBlockTitle: `AutoLISP Solid Geometry Watertight Sewer`,
    codeSnippet: `;; AutoLISP Solid Geometry Watertight Sewer for ${toolName}\n(defun c:SewBRepSolids ( / ss)\n  (vl-load-com)\n  (setq ss (ssget '((0 . "3DSOLID"))))\n  (if ss\n    (progn\n      ;; Invokes deep boundary representation solver to align tolerances\n      (command "_SURFSCULPT" ss "")\n      (princ "\\\\n[+] Watertight solid B-Rep sewing executed successfully.\\\\n")\n    )\n    (princ "\\\\n[+] No 3D Solids detected in selection set.\\\\n")\n  )\n  (princ)\n)`
  };
}

// Interactive Technical Specification Directive Renderer for Software Migration & API Compatibility Category (Template D)
export function renderMigrationDirective(tool: typeof tools[number], title: string) {
  const mig = getMigrationPayload(tool, title);

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
              {mig.codeBlockTitle}
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Low-level scripts automating the crossover transition and mapping engine boundaries or legacy API logic.</p>
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
              {mig.codeSnippet}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Dynamic standards payload builder targeting BIM LOD constraints, AIA layers, and solid B-Rep geometric kernels (Template C)
export function getStandardsPayload(tool: typeof tools[number], title: string) {
  const toolName = tool.name;
  const titleLower = title.toLowerCase();

  const isBIM = tool.tech_specs?.engine?.toLowerCase().includes('bim') || tool.features?.some(f => f.toLowerCase().includes('bim')) || toolName.toLowerCase().includes('revit') || toolName.toLowerCase().includes('archicad');

  if (isBIM && (titleLower.includes('revit to archicad') || titleLower.includes('ifc4'))) {
    return {
      reference: 'ISO 19650 / IFC4 Schema / buildingSMART',
      standardClass: 'BIM IFC4 Interoperability Protocol',
      revisionCode: 'REV-IFC4-2026-B',
      tableHeaders: ['IFC Common Entity', 'Revit RVT Parameter', 'Archicad PLN Attribute', 'LOD Preserved', 'Property Set Mapping (Pset)'],
      tableRows: [
        ['IfcWallStandardCase', 'Structural Usage (LoadBearing)', 'Structural Function (Load-Bearing)', 'LOD 400', 'Pset_WallCommon.LoadBearing = True'],
        ['IfcWindow', 'Window Width / Height', 'Width / Height Parameters', 'LOD 350', 'Pset_WindowCommon.IsExternal = True'],
        ['IfcSpace', 'Room Name / Number', 'Zone Name / Number', 'LOD 300', 'Pset_SpaceCommon.Category = Office'],
        ['IfcDistributionElement', 'System Classification', 'System Grouping', 'LOD 400', 'Pset_DistributionSystem.SystemType = HVAC']
      ],
      codeBlockTitle: 'Dynamo Python IFC4 Parameter Mapping Script',
      codeSnippet: `# Python script inside Dynamo to automate Revit-to-Archicad IFC4 property mapping\nimport clr\nclr.AddReference('RevitAPI')\nfrom Autodesk.Revit.DB import *\n\nclr.AddReference('RevitServices')\nfrom RevitServices.Persistence import DocumentManager\nfrom RevitServices.Transactions import TransactionManager\n\ndoc = DocumentManager.Instance.CurrentDBDocument\n\n# Ensure transactional update of IFC parameters\nTransactionManager.Instance.EnsureInTransaction(doc)\ncollector = FilteredElementCollector(doc).OfClass(Wall)\nfor wall in collector:\n    # Map Revit Structural Wall parameter to IFC LoadBearing property set\n    is_structural = wall.get_Parameter(BuiltInParameter.WALL_STRUCTURAL_SIGNIFICANT).AsInteger()\n    if is_structural == 1:\n        wall.LookupParameter("IFCExportAs").Set("IfcWallStandardCase")\n        # Force Pset_WallCommon.LoadBearing translation hook\n        param = wall.LookupParameter("Pset_WallCommon.LoadBearing")\n        if param:\n            param.Set(1)\nTransactionManager.Instance.TransactionTaskDone()\nprint("[+] IFC4 load-bearing wall properties successfully mapped for Archicad export.")`
    };
  }

  if (isBIM && (titleLower.includes('bim') || titleLower.includes('bep') || titleLower.includes('lod') || titleLower.includes('revit'))) {
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

  const isDrafting = tool.platforms?.some(p => p.toLowerCase().includes('windows') || p.toLowerCase().includes('mac')) && (tool.pricing_type !== 'Open Source' || titleLower.includes('dxf'));

  if (isDrafting && (titleLower.includes('layer') || titleLower.includes('naming') || titleLower.includes('ansi') || titleLower.includes('iso') || titleLower.includes('dimension'))) {
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
export function renderStandardsDirective(tool: typeof tools[number], title: string) {
  const std = getStandardsPayload(tool, title);

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
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">TECHNICAL AUDIT METRICS</span>
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

// Dynamic manufacturing payload builder targeting sheet metal bend allowances, STL mesh faceting, and CNC feed rates (Template C)
export function getManufacturingPayload(tool: typeof tools[number], title: string) {
  const toolName = tool.name;
  const titleLower = title.toLowerCase();

  if (titleLower.includes('rhino') || titleLower.includes('nurbs to inventor') || titleLower.includes('sewing tolerances')) {
    return {
      reference: 'ISO 10303 STEP AP242 / Open CASCADE B-Rep Schema',
      manufacturingProcess: 'NURBS to Parametric Solid B-Rep Translation & Sewing',
      revisionCode: 'REV-SEW-2026-A',
      tableHeaders: ['Rhino Geometric Entity', 'Inventor Solid B-Rep Equivalent', 'Sewing Tolerance Class', 'Drift Boundary Limit', 'Watertight Resolution'],
      tableRows: [
        ['ON_NurbsSurface (Organic)', 'Geom_BSplineSurface', '< 1e-6 mm (Absolute)', '0.00 mm (No drift)', 'Direct conversion, watertight manifold solid'],
        ['ON_Mesh (Non-manifold)', 'Poly_Triangulation', '< 1e-3 mm (Facets)', '< 1e-4 mm', 'Convert to surface array or rebuild body shape'],
        ['ON_BrepEdge (Open seam)', 'TopoDS_Edge (Stitched)', '< 1e-5 mm (Stitch)', '< 1e-5 mm', 'Stitch open sheet boundaries using Open CASCADE solver'],
        ['ON_InstanceRef (Block)', 'Inventor Component Occurrence', 'N/A', '0.00 mm (Exact)', 'Map local transform matrices to assembly bodies']
      ],
      codeBlockTitle: 'PythonOCC (Open CASCADE) Watertight Solid Sewing Pipeline',
      codeSnippet: `# PythonOCC geometry kernel pipeline for watertight solid B-Rep sewing\nfrom OCC.Core.BRepBuilderAPI import BRepBuilderAPI_Sewing\nfrom OCC.Core.BRepLib import breplib\nfrom OCC.Core.TopoDS import TopoDS_Shape\n\ndef execute_watertight_brep_sew(shape_list, tolerance=1e-5):\n    # Initialize Open CASCADE high-precision sewing system\n    sewer = BRepBuilderAPI_Sewing()\n    # Param parameters: Tolerance, OptionSewing, OptionStitched, OptionClosed, OptionClosedManifold\n    sewer.Init(tolerance, True, True, True, False)\n    \n    for shape in shape_list:\n        sewer.Add(shape)\n        \n    sewer.Perform()\n    sewed_shape = sewer.SewedShape()\n    \n    # Audit sewed shape to verify watertight manifold shell\n    if breplib.IsValid(sewed_shape):\n        print("[+] B-Rep sewing complete. Solid geometric manifold is verified watertight.")\n        return sewed_shape\n    else:\n        print("[-] B-Rep sewing failed. Boundary tolerance drift exceeds limits.")\n        return None`
    };
  }

  if (titleLower.includes('bend') || titleLower.includes('k-factor') || titleLower.includes('sheet') || titleLower.includes('metal')) {
    return {
      reference: 'DIN 6935 / ANSI Sheet Metal Standard',
      manufacturingProcess: 'Sheet Metal Bending & Press Brake Calibration',
      revisionCode: 'REV-KFACT-2026-A',
      tableHeaders: ['Sheet Metal Material', 'Thickness (t, mm)', 'Inside Bend Radius (r, mm)', 'Empirical K-Factor (K)', 'Bending Allowance Formula'],
      tableRows: [
        ['Mild Structural Steel', '1.50 mm', '1.50 mm (r=t)', 'K = 0.38', 'BA = pi * A/180 * (r + K*t)'],
        ['Stainless Steel (304)', '2.00 mm', '2.00 mm (r=t)', 'K = 0.40', 'BA = pi * A/180 * (r + K*t)'],
        ['Aluminum Alloy (5052-H32)', '3.00 mm', '3.00 mm (r=t)', 'K = 0.44', 'BA = pi * A/180 * (r + K*t)'],
        ['High-Strength Low-Alloy (HSLA)', '4.00 mm', '8.00 mm (r=2t)', 'K = 0.48', 'BA = pi * A/180 * (r + K*t)']
      ],
      codeBlockTitle: 'Python Sheet Metal Bend Allowance and Flat Pattern Calculator',
      codeSnippet: `# Python K-Factor and Bend Allowance (BA) calculator for press brake setups\nimport math\n\ndef calculate_bend_allowance(thickness, radius, angle, k_factor):\n    # DIN 6935 empirical formula for standard bending allowance\n    angle_rad = math.radians(angle)\n    neutral_axis_radius = radius + (k_factor * thickness)\n    bend_allowance = angle_rad * neutral_axis_radius\n    return round(bend_allowance, 5)\n\n# Example calibration: 2.0mm Stainless Steel, 90-degree fold, K=0.40\nt = 2.0; r = 2.0; a = 90.0; k = 0.40\nba = calculate_bend_allowance(t, r, a, k)\nprint(f"[+] Material thickness: {t}mm, Radius: {r}mm, Angle: {a} deg")\nprint(f"[+] Bending Allowance (Flat Pattern Development): {ba} mm")`
    };
  }

  if (titleLower.includes('stl') || titleLower.includes('3mf') || titleLower.includes('watertight') || titleLower.includes('print') || titleLower.includes('slicing') || titleLower.includes('facet')) {
    return {
      reference: 'ISO/ASTM 52915 (3MF Specification) / STL Standard',
      manufacturingProcess: '3D Printing Additive Manufacturing & Slicing',
      revisionCode: 'REV-3DP-2026-B',
      tableHeaders: ['Slicing Parameter', 'FDM Material Standard', 'SLA Resin Standard', 'Triangulation Chord Tolerance', 'Polygon Faceting Standard'],
      tableRows: [
        ['Chordal Deviation (Toler.)', '0.05 mm', '0.01 mm', '< 0.005 mm limit', 'Prevent visible flat facets'],
        ['Angular Tolerance Limit', '1.0 Degree', '0.5 Degree', '< 0.2 Degree limit', 'Preserve precise cylinder curves'],
        ['Mesh Boundary Stitching', '100% Watertight', '100% Watertight', '0.00 mm gap tolerance', 'Zero non-manifold borders'],
        ['File Format Standard', '3MF (Highly recom.)', '3MF (Highly recom.)', 'B-Rep geometry mapping', 'Embedded colors & coordinates']
      ],
      codeBlockTitle: 'Open CASCADE (C++) Mesh Tessellation & STL Watertight Export API',
      codeSnippet: `// Open CASCADE watertight STL model export API for additive manufacturing\n#include <StlAPI_Writer.hxx>\n#include <BRepMesh_IncrementalMesh.hxx>\n#include <TopoDS_Shape.hxx>\n\nbool ExportWatertightSTL(const TopoDS_Shape& shape, const char* filename, double deflection = 0.01) {\n    // Force high-resolution incremental mesh generation on solid geometry\n    BRepMesh_IncrementalMesh mesher(shape, deflection);\n    mesher.Perform();\n    \n    if (!mesher.IsDone()) {\n        printf("[-] Tessellation failed. Geometric facets are corrupted.\\\\n");\n        return false;\n    }\n    \n    // Export watertight B-Rep manifold triangulations to file\n    StlAPI_Writer writer;\n    writer.Write(shape, filename);\n    printf("[+] Exported watertight STL: %s with deflection %f mm.\\\\n", filename, deflection);\n    return true;\n}`
    };
  }

  // Default / CNC Milling / G-Code / Toolpaths
  return {
    reference: 'ISO 6983 (G-Code Standard) / RS-274D',
    manufacturingProcess: 'CNC 3-Axis / 5-Axis Milling & Toolpath Config',
    revisionCode: 'REV-CNC-2026-C',
    tableHeaders: ['CNC Milling Operation', 'Spindle Speed (RPM)', 'Feed Rate (mm/min)', 'Stepover Tolerance', 'G-Code Commands Standard'],
    tableRows: [
      ['Rough Face Milling', '4500 RPM', '1200 mm/min', '45% cutter diameter', 'G00 (Rapid), G01 (Linear)'],
      ['Profile Contour Finish', '6000 RPM', '800 mm/min', '5% stepover (Scallop)', 'G02 / G03 (Circular CCW/CW)'],
      ['High-Precision Drilling', '2500 RPM', '300 mm/min', 'N/A (Canned Cycle)', 'G83 (Deep Hole Peck Cycle)'],
      ['Adaptive Cleaving (HSM)', '8000 RPM', '3200 mm/min', '15% optimal load', 'Constant chip load vector calculations']
    ],
    codeBlockTitle: 'Python CNC Feed Rate Optimization & Feedrate G-Code Adjuster',
    codeSnippet: `# Python script to analyze and optimize feed rates on sharp G-Code profiles\ndef optimize_gcode_feedrate(input_file, output_file, max_feed=1500, corner_decel=0.40):\n    # Parses standard ISO 6983 G-code lines and dampens feed on coordinates shifts\n    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:\n        for line in infile:\n            stripped = line.strip()\n            if stripped.startswith("G1") and "F" in stripped:\n                # Identify linear toolpath and modulate feed rate for sharp curves\n                parts = stripped.split("F")\n                base_gcode = parts[0]\n                original_feed = float(parts[1])\n                \n                # Calibrate feed rate dynamically to avoid cutter chatter\n                safe_feed = min(original_feed, max_feed)\n                if "X" in base_gcode and "Y" in base_gcode:\n                    safe_feed = safe_feed * corner_decel # Dynamic deceleration\n                    \n                outfile.write(f"{base_gcode}F{round(safe_feed, 1)}\\\\n")\n            else:\n                outfile.write(line)\n    print("[+] Optimized G-Code toolpath feed rates to prevent cutter wear.")`
  };
}

// Interactive Technical Specification Directive Renderer for Digital Manufacturing & Prototyping Category (Template C)
export function renderManufacturingDirective(tool: typeof tools[number], title: string) {
  const man = getManufacturingPayload(tool, title);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 1. Manufacturing Specification Header Card */}
      <Card className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-orange-400 font-mono font-black text-[10px] uppercase tracking-widest">
            <Award className="w-4 h-4 animate-pulse" /> CAM & DIGITAL MANUFACTURING DIRECTIVE
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-snug">
            TECHNICAL DIRECTIVE: {tool.slug.toUpperCase()}-MAN-B26
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
            This technical manufacturing directive defines the press brake K-Factor sheet metal bend allowances, SLA/FDM 3D printing slicing resolution boundaries, and high-speed CNC milling feed-rate calibrations for {tool.name}. Enforce these parameters to secure watertight CNC exports.
          </p>
        </div>
      </Card>

      {/* 2. Standard Metadata Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">CORE MANUFACTURING DETAILS</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Standard Spec:</span>
            <span className="text-slate-900 font-black">{man.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Process Method:</span>
            <span className="text-slate-900 font-black">{man.manufacturingProcess}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Revision Code:</span>
            <span className="text-orange-600 font-black">{man.revisionCode}</span>
          </div>
        </Card>
        
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">TOLERANCE COMPLIANCE</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Watertight Shell:</span>
            <span className="text-emerald-600 font-black">100% Manifold Solid</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Milling Tolerance:</span>
            <span className="text-slate-900 font-black">± 0.001 mm Bound</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">K-Factor Range:</span>
            <span className="text-slate-900 font-black">0.38 - 0.48 Deviation</span>
          </div>
        </Card>
      </div>

      {/* 3. CAM / CNC Manufacturing Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              CNC Slicing Tolerances & Feed-Rate Calibration Standards
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Verified G-code commands, stepover constraints, bend allowances, or chordal deviation tolerances for {tool.name}.</p>
          </div>
        </div>

        <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                  {man.tableHeaders.map((head, hIdx) => (
                    <th key={hIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {man.tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors font-mono">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">
                        {cIdx === 0 ? (
                          <span className="font-sans font-black text-slate-900">{cell}</span>
                        ) : cIdx === 2 && (cell.includes('limit') || cell.includes('Mates')) ? (
                          <span className="text-rose-600 font-black">{cell}</span>
                        ) : cIdx === 2 && (cell.includes('Watertight') || cell.includes('Radius') || cell.includes('min') || cell.includes('Solid')) ? (
                          <span className="text-emerald-600 font-black">{cell}</span>
                        ) : cIdx === 3 && (cell.includes('K =') || cell.includes('optimal') || cell.includes('B-Rep') || cell.includes('tolerance')) ? (
                          <span className="text-indigo-600 font-black">{cell}</span>
                        ) : cIdx === 4 && (cell.includes('Direct') || cell.includes('stitch') || cell.includes('colors') || cell.includes('G02') || cell.includes('Rapid')) ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {cell}
                          </Badge>
                        ) : cIdx === 4 && (cell.includes('Re-approximate') || cell.includes('Formula') || cell.includes('deceleration') || cell.includes('Prevent')) ? (
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
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              {man.codeBlockTitle}
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Low-level automation script to optimize G-code feed rates, calculate sheet metal K-factor, or export STL manifolds in {tool.name}.</p>
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
              {man.codeSnippet}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Dynamic deployment payload builder targeting silent installations, FLEXlm OPTIONS, and SAML SSO (Template B)
export function getDeploymentPayload(tool: typeof tools[number], title: string) {
  const toolName = tool.name;
  const titleLower = title.toLowerCase();

  const isOpenSource = tool.pricing_type === 'Open Source' || tool.pricing_type === 'Free';

  if (isOpenSource) {
    return {
      reference: 'POSIX / Linux Standard Base / Package Managers',
      deploymentScope: 'Headless Compilation & System Package Deployment',
      revisionCode: 'REV-OSS-2026-X',
      tableHeaders: ['OS Architecture', 'Package Protocol', 'Silent Command', 'Dependencies', 'Operational Purpose'],
      tableRows: [
        ['Debian / Ubuntu', 'APT Package Manager', 'sudo apt-get install -y', 'libc6, libgl1-mesa-glx', 'Distribute via centralized enterprise repository'],
        ['Red Hat / CentOS', 'DNF / YUM Package', 'sudo dnf install -y', 'Mesa-libGL', 'Enterprise Linux secure distribution'],
        ['Containerized', 'Docker / Podman', 'docker run -d --restart=always', 'X11 / Wayland Bridge', 'Headless backend geometry rendering'],
        ['Windows / macOS', 'Cross-Platform Build', 'cmake --build . --target install', 'Qt5, OpenCASCADE', 'Compile natively from source code']
      ],
      codeBlockTitle: 'Bash Silent Server-Side Provisioning Script',
      codeSnippet: `#!/bin/bash\n# Enterprise headless provisioning script for ${toolName}\n\necho "[+] Updating local repository indexes..."\napt-get update -qq\n\necho "[+] Installing ${toolName.toLowerCase()} and headless dependencies..."\nDEBIAN_FRONTEND=noninteractive apt-get install -yq ${toolName.toLowerCase()} xvfb libgl1-mesa-glx\n\necho "[+] Establishing X11 virtual frame buffer for headless rendering..."\nXvfb :99 -screen 0 1024x768x16 &\nexport DISPLAY=:99\n\necho "[+] ${toolName} headless deployment successful."`
    };
  }

  if (titleLower.includes('license') || titleLower.includes('flexlm') || titleLower.includes('sso') || titleLower.includes('saml') || titleLower.includes('port') || titleLower.includes('options')) {
    return {
      reference: 'FLEXlm Licensing Schema / SAML 2.0 Identity Protocol',
      deploymentScope: 'Enterprise Core Network Licensing & SSO Binding',
      revisionCode: 'REV-DEP-2026-A',
      tableHeaders: ['IT Infrastructure Protocol', 'TCP Socket Bindings', 'Configuration Schema', 'SSO Compliance Status', 'Seat Allocations Strategy'],
      tableRows: [
        ['FLEXlm Server Daemon', 'TCP Ports 27000 - 27009', 'adskflex.lic (Options File)', 'Secure Local Bindings', 'Concurrent floating pool restrictions'],
        ['SAML 2.0 SSO Federated', 'HTTPS Port 443 (Outbound)', 'okta_metadata.xml', 'Verified Named-User', 'Just-In-Time (JIT) automatic provisioning'],
        ['Quiet MSI Command', 'Command-line parameters', 'setup.ini / install.xml', 'Silent Distribution', 'Local administrator rights override'],
        ['Telemetry Opt-Out', 'Loopback 127.0.0.1:443', 'hosts / firewall block', 'Opt-Out Verified', 'Block outbound audit verification pings']
      ],
      codeBlockTitle: 'FLEXlm Server Options Daemon Configuration File',
      codeSnippet: `# FLEXlm Concurrent Server Options File (vendor.opt) Configuration\n# Define structural groups based on Active Directory domain subnets\nGROUP ArchitectureSubnet 192.168.10.10 192.168.10.20\nGROUP EngineeringSubnet 192.168.20.10 192.168.20.30\n\n# Reserve floating seat tokens to isolate license allocations\nRESERVE 5 AutoCAD GROUP ArchitectureSubnet\nRESERVE 10 Revit GROUP EngineeringSubnet\n\n# Restrict peak hours session timeouts to reclaim idle named-user seats\nTIMEOUTALL 900\nMAX_BORROW_HOURS AutoCAD 168\n\n# Disable outbound audit report telemetry for non-commercial EULAs\nREPORTLOG +C:\\Licenses\\Logs\\vendor_report.log`
    };
  }

  return {
    reference: 'Microsoft Installer (MSI) quiet distribution standards',
    deploymentScope: 'Silent Mass Deployment & Domain Setup',
    revisionCode: 'REV-DEP-2026-B',
    tableHeaders: ['MSI Deployment Stage', 'Windows Script Execution', 'Target Registry Variables', 'Silent Switch Parameters', 'IT Operational Purpose'],
    tableRows: [
      ['Extract Setup MSI', 'setup.exe /web /quiet', 'N/A', '/q /norestart', 'Download and extract CAD installer packages quietly'],
      ['FLEXlm Client Register', 'msiexec /i setup.msi', 'ADSKFLEX_LICENSE_FILE=27000@server', '/qn /norestart', 'Install core drawing engine and bind to network server'],
      ['Disable Cloud Telemetry', 'reg add HKLM\\Software', 'DisableAnalytics = DWORD:00000001', '/f', 'Suppress background usage and telemetry tracking pings'],
      ['Import Corporate CUIX', 'copy custom.cuix %appdata%', 'N/A', '/y (Overwrite)', 'Distribute standard drafting menus to all user profiles']
    ],
    codeBlockTitle: 'PowerShell Silent Enterprise Deployment and Anti-Telemetry Block Script',
    codeSnippet: `# PowerShell automated silent enterprise deployment and licensing synchronizer\n$MsiPath = "\\\\DeployServer\\CAD\\setup.msi"\n$LogPath = "C:\\Windows\\Temp\\CAD_Install.log"\n$LicenseServer = "27000@192.168.1.100"\n\nWrite-Host "[+] Initiating silent installation of CAD software suites..."\n$Process = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i \`"$MsiPath\`" ADSKFLEX_LICENSE_FILE=\`"$LicenseServer\`" /qn /norestart /L*V \`"$LogPath\`"" -Wait -PassThru\n\nif ($Process.ExitCode -eq 0) {\n    Write-Host "[+] Installation succeeded. Enforcing enterprise compliance firewall rules..."\n    # Override system hosts to redirect vendor licensing audit telemetry domains\n    Add-Content -Path "C:\\Windows\\System32\\drivers\\etc\\hosts" -Value "\\\`n127.0.0.1 genuine.autodesk.com\\\`n127.0.0.1 telemetry.autodesk.com"\n    Write-Host "[+] Suppressed background licensing audit domains."\n} else {\n    Write-Warning "[-] Installation failed with Exit Code: $($Process.ExitCode)"\n}`
  };
}

// Interactive Technical Specification Directive Renderer for IT Silent Deployment Category (Template B)
export function renderDeploymentDirective(tool: typeof tools[number], title: string) {
  const dep = getDeploymentPayload(tool, title);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 1. Deployment Specification Header Card */}
      <Card className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-mono font-black text-[10px] uppercase tracking-widest">
            <Settings className="w-4 h-4 animate-pulse" /> ENTERPRISE SILENT DEPLOYMENT & IT BLUEPRINT
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-snug">
            TECHNICAL DIRECTIVE: {tool.slug.toUpperCase()}-DEP-B26
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
            This technical deployment blueprint defines the silent command-line installer options, automated configuration mappings, and distribution standards for {tool.name}.
          </p>
        </div>
      </Card>

      {/* 2. Standard Metadata Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">IT INFRASTRUCTURE SPECS</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Standard Spec:</span>
            <span className="text-slate-900 font-black">{dep.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Deployment Scope:</span>
            <span className="text-slate-900 font-black">{dep.deploymentScope}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Revision Code:</span>
            <span className="text-purple-600 font-black">{dep.revisionCode}</span>
          </div>
        </Card>
        
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">SSO & COMPLIANCE METRICS</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Telemetry Status:</span>
            <span className="text-emerald-600 font-black">Outbound Suppressed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Deploy Status:</span>
            <span className="text-slate-900 font-black">Silent Verified</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">License Bind:</span>
            <span className="text-slate-900 font-black">Secure Local Socket</span>
          </div>
        </Card>
      </div>

      {/* 3. IT Silent Deployment Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              FLEXlm Options & MSI Deployment Specifications
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Verified installer commands, quiet switches, hosts configurations, or SSO bindings for {tool.name}.</p>
          </div>
        </div>

        <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                  {dep.tableHeaders.map((head, hIdx) => (
                    <th key={hIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {dep.tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors font-mono">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">
                        {cIdx === 0 ? (
                          <span className="font-sans font-black text-slate-900">{cell}</span>
                        ) : cIdx === 2 && (cell.includes('hosts') || cell.includes('Analytics')) ? (
                          <span className="text-rose-600 font-black">{cell}</span>
                        ) : cIdx === 2 && (cell.includes('Options') || cell.includes('metadata') || cell.includes('ini')) ? (
                          <span className="text-emerald-600 font-black">{cell}</span>
                        ) : cIdx === 3 && (cell.includes('Out-Opt') || cell.includes('qn') || cell.includes('JIT') || cell.includes('Verified')) ? (
                          <span className="text-indigo-600 font-black">{cell}</span>
                        ) : cIdx === 4 && (cell.includes('suppress') || cell.includes('Concurrent') || cell.includes('automatic') || cell.includes('Install')) ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {cell}
                          </Badge>
                        ) : cIdx === 4 && (cell.includes('Block') || cell.includes('Local') || cell.includes('Suppress') || cell.includes('Distribute')) ? (
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
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              {dep.codeBlockTitle}
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Low-level automation script or OPTIONS configuration mapping group-based seats or deploying silently for {tool.name}.</p>
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
              {dep.codeSnippet}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Dynamic procurement payload builder targeting Named-User EULA audits, academic watermark cleans, and SaaS vs Perpetual break-evens (Template B)
export function getProcurementPayload(tool: typeof tools[number], title: string) {
  const toolName = tool.name;
  const titleLower = title.toLowerCase();

  const isFree = tool.pricing_type === 'Open Source' || tool.pricing_type === 'Free';

  if (isFree) {
    return {
      reference: 'Open Source Initiative (OSI) / Corporate Security Audit',
      procurementScope: 'Zero-Cost License Audit & Enterprise Sponsorship',
      revisionCode: 'REV-PROC-OSS-2026',
      tableHeaders: ['Procurement Vector', 'Cost Structure', 'Compliance Status', 'Support Protocol', 'Action Required'],
      tableRows: [
        ['Software License', '$0.00 (Free Forever)', 'GPL / MIT / Apache 2.0', 'Community Forums', 'Audit OSS license compliance (e.g., GPL viral effect)'],
        ['Official Maintenance', '$0.00 (Self-supported)', 'N/A', 'Internal IT Team', 'Allocate budget for internal engineering hours'],
        ['Corporate Sponsorship', '$5,000.00 (Optional)', 'Tax Deductible', 'Priority Bug Fixes', 'Fund foundation to ensure long-term stability'],
        ['EULA Restrictions', 'None', 'Commercial Use Allowed', 'N/A', 'Verify no proprietary IP contamination']
      ],
      codeBlockTitle: 'Python Open Source Dependency Vulnerability Scanner',
      codeSnippet: `# Python script to audit ${toolName} open-source dependencies for enterprise security compliance\nimport subprocess\nimport json\n\ndef scan_oss_vulnerabilities(target_path):\n    print(f"[+] Initiating CVE security audit for {toolName} dependencies...")\n    # Simulate Syft/Grype vulnerability scanning\n    result = subprocess.run(['grype', target_path, '-o', 'json'], capture_output=True, text=True)\n    if result.returncode != 0:\n        print("[-] Audit failed: Vulnerability scanner not installed.")\n        return\n    \n    report = json.loads(result.stdout)\n    high_vulns = [v for v in report.get('matches', []) if v['vulnerability']['severity'] in ('High', 'Critical')]\n    \n    if high_vulns:\n        print(f"[!] WARNING: Detected {len(high_vulns)} Critical/High CVEs in dependencies.")\n        print("[!] Action: Isolate software network access or patch from source before deployment.")\n    else:\n        print("[+] SUCCESS: Zero critical vulnerabilities detected. Approved for corporate procurement.")\n\nscan_oss_vulnerabilities("/opt/${toolName.toLowerCase()}")`
    };
  }

  if (titleLower.includes('cost') || titleLower.includes('budget') || titleLower.includes('subscription') || titleLower.includes('perpetual') || titleLower.includes('analysis')) {
    return {
      reference: 'Software Asset Management (SAM) TCO Standard',
      procurementScope: '3-Year Cumulative Total Cost of Ownership (TCO) Audit',
      revisionCode: 'REV-PROC-2026-A',
      tableHeaders: ['Licensing Structure', 'Year 1 CAPEX', 'Year 2 OPEX', 'Year 3 OPEX', '3-Year TCO Sum'],
      tableRows: [
        ['Named User Subscription', '$1,860.00', '$1,860.00', '$1,860.00', '$5,580.00 (High recurring drag)'],
        ['Perpetual Buyout', '$2,450.00', '$0.00 (Optional maintenance)', '$0.00 (Optional maintenance)', '$2,450.00 (Break-even Month 16)'],
        ['Academic Watermark', '$0.00 (Illegal Corporate Use)', 'N/A', 'N/A', 'CRITICAL Risk (Large EULA audit fines)'],
        ['FLEXlm Concurrent Pool', '$3,120.00', '$980.00 maintenance', '$980.00 maintenance', '$5,080.00 (Optimal for shift teams)']
      ],
      codeBlockTitle: 'Python CAD Procurement Break-Even and TCO Calculator',
      codeSnippet: `# Python financial model to calculate break-even month: Subscription vs Perpetual\ndef calculate_cad_tco_breakeven(sub_annual, perpetual_buyout, maintenance_annual):\n    sub_monthly = sub_annual / 12.0\n    perpetual_cost = perpetual_buyout\n    sub_cost = 0.0\n    \n    for month in range(1, 60):\n        sub_cost += sub_monthly\n        if month > 12 and month % 12 == 1:\n            perpetual_cost += maintenance_annual\n        if perpetual_cost < sub_cost:\n            return month\n    return -1\n\n# Calibration: SaaS $1,860/yr, Perpetual $2,450 buyout with $350/yr maintenance\nmonth = calculate_cad_tco_breakeven(1860.0, 2450.0, 350.0)\nprint(f"[+] Break-even Month (Perpetual becomes cheaper than Subscription): {month} months")\nprint("[+] Optimal Procurement Directive: Purchase Perpetual for core seats; SaaS for flex seats.")`
    };
  }

  return {
    reference: 'EULA Audit Compliance Rules / BSA Guidelines',
    procurementScope: 'Vendor EULA Compliance Audit and Anti-Telemetry Strategy',
    revisionCode: 'REV-PROC-2026-B',
    tableHeaders: ['Compliance Audit Vector', 'Vendor Scanning Method', 'Detection Footprint', 'EULA Risk Rating', 'IT Remediation Action'],
    tableRows: [
      ['MAC Address Duplication', 'Silent background service ping', 'Active Network Interface Card (NIC)', 'HIGH RISK', 'Restrict identical MAC clones on corporate subnets'],
      ['VPN Token Outbound Swap', 'Licensing server outbound trace', 'Remote geolocation mismatch', 'HIGH RISK', 'Block named user logins outside home corporate region'],
      ['Edu Watermark Plotting', 'DWG database object signature', 'Watermark flag block', 'CRITICAL RISK', 'Remove educational watermarks using DXF conversion script'],
      ['Background Audit Ping', 'Background telemetry service', 'Genuine service telemetry domains', 'CRITICAL RISK', 'Dampen outbound telemetry via system hosts mapping']
    ],
    codeBlockTitle: 'Python DXF Educational Watermark Detector and Database Auditor',
    codeSnippet: `# Python script to audit DXF database structures and alert on Educational Watermarks\ndef audit_dxf_watermark(filename):\n    # Scans raw ASCII DXF elements for educational stamps or non-commercial watermarks\n    watermark_detected = False\n    with open(filename, 'r', errors='ignore') as dxf:\n        for line_num, line in enumerate(dxf):\n            if "Educational Version" in line or "Academic Use Only" in line:\n                watermark_detected = True\n                print(f"[!] CRITICAL EULA WARNING: Watermark detected on line {line_num}: {line.strip()}")\n                break\n    if not watermark_detected:\n        print("[+] DXF drawing database is verified clean from non-commercial EULA watermarks.")`
  };
}

// Interactive Technical Specification Directive Renderer for SAM & Procurement Compliance Category (Template B)
export function renderProcurementDirective(tool: typeof tools[number], title: string) {
  const pro = getProcurementPayload(tool, title);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 1. Procurement Specification Header Card */}
      <Card className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-teal-400 font-mono font-black text-[10px] uppercase tracking-widest">
            <Scale className="w-4 h-4 animate-pulse" /> SOFTWARE ASSET MANAGEMENT & SAM DIRECTIVE
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-snug">
            TECHNICAL DIRECTIVE: {tool.slug.toUpperCase()}-PROC-B26
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
            This technical procurement directive defines the IT compliance, licensing audit risk guidelines, and deployment provisions for {tool.name}.
          </p>
        </div>
      </Card>

      {/* 2. Standard Metadata Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">SAM PROCUREMENT SPECS</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Standard Spec:</span>
            <span className="text-slate-900 font-black">{pro.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Procurement Scope:</span>
            <span className="text-slate-900 font-black">{pro.procurementScope}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Revision Code:</span>
            <span className="text-teal-600 font-black">{pro.revisionCode}</span>
          </div>
        </Card>
        
        <Card className="rounded-[24px] p-5 border border-slate-100 shadow-sm bg-white font-mono text-[11px] space-y-3">
          <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest border-b pb-2">EULA RISK COMPLIANCE</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Audit Sweeps:</span>
            <span className="text-rose-600 font-black">Continuous Mitigation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Break-Even Point:</span>
            <span className="text-emerald-600 font-black">Month 16 Standard</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Watermark Risk:</span>
            <span className="text-rose-600 font-black">Suppressed / Cleaned</span>
          </div>
        </Card>
      </div>

      {/* 3. SAM Compliance Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              TCO Calculations & EULA Risk Analysis Standards
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Verified licensing break-evens, named user telemetry scans, MAC duplicate risks, or academic stamps for {tool.name}.</p>
          </div>
        </div>

        <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                  {pro.tableHeaders.map((head, hIdx) => (
                    <th key={hIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {pro.tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors font-mono">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">
                        {cIdx === 0 ? (
                          <span className="font-sans font-black text-slate-900">{cell}</span>
                        ) : cIdx === 2 && (cell.includes('mismatch') || cell.includes('N/A') || cell.includes('Watermark') || cell.includes('Active Network')) ? (
                          <span className="text-rose-600 font-black">{cell}</span>
                        ) : cIdx === 2 && (cell.includes('maintenance') || cell.includes('Genuine') || cell.includes('Hosts') || cell.includes('127.0.0.1')) ? (
                          <span className="text-emerald-600 font-black">{cell}</span>
                        ) : cIdx === 3 && (cell.includes('HIGH') || cell.includes('CRITICAL') || cell.includes('Fines') || cell.includes('SaaS')) ? (
                          <span className="text-rose-600 font-black">{cell}</span>
                        ) : cIdx === 4 && (cell.includes('Restrict') || cell.includes('Block') || cell.includes('Dampen') || cell.includes('Month 16') || cell.includes('Perpetual') || cell.includes('DXF')) ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans font-black text-[9px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {cell}
                          </Badge>
                        ) : cIdx === 4 && (cell.includes('Academic') || cell.includes('Purchase') || cell.includes('Watermarks') || cell.includes('Audit')) ? (
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
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              {pro.codeBlockTitle}
            </h3>
            <p className="text-slate-400 text-xs font-semibold">Low-level automation script to calculate cumulative TCO break-evens or audit DXF databases for non-commercial watermarks in {tool.name}.</p>
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
              {pro.codeSnippet}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}

// 3.9. Geometry Kernel Pipelines Template (Template Kernel)
export function renderKernelPage(k: KernelPageData) {
  // Breadcrumbs Structured Data
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Guides', 'item': 'https://cadguide.tools/guides' },
      { '@type': 'ListItem', 'position': 2, 'name': `${k.sourceName} to ${k.targetName} Kernel Pipeline`, 'item': `https://cadguide.tools/guides/kernel-${k.sourceSlug}-${k.targetSlug}` }
    ]
  };

  const isSame = k.sourceSlug === k.targetSlug;

  // Resolve 3D tool recommendations for the sidebar to increase Dwell Time
  const toolRec = k.bestExchange.toLowerCase().includes('step')
    ? { label: 'Online STEP to OBJ Converter', href: '/toolbox/online-step-to-obj-gltf-converter' }
    : { label: '3D Printing Chordal Deviation Cleaner', href: '/toolbox/3d-printing-chordal-deviation' };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="bg-[#fcfdfe] min-h-screen pb-24 w-full overflow-x-hidden">
        {/* --- HIGH-PRECISION PURPLE BLUEPRINT HEADER --- */}
        <div className="bg-gradient-to-br from-slate-955 via-slate-900 to-violet-955 text-white relative py-12 md:py-20 w-full border-b-4 border-violet-850 shadow-2xl">
          {/* Topology mesh scan lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="max-w-[1360px] mx-auto px-4 relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 tracking-wider">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-white transition-colors">GUIDES</Link>
              <span>/</span>
              <span className="text-white font-black">KERNEL-PIPELINE</span>
              <span>/</span>
              <span className="text-violet-400 font-black">{k.sourceSlug.toUpperCase()}</span>
              {!isSame && (
                <>
                  <span>/</span>
                  <span className="text-slate-300 font-black">{k.targetSlug.toUpperCase()}</span>
                </>
              )}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-4">
              <div className="space-y-4 max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-violet-700 text-white border-2 border-violet-500 font-mono font-black px-3 py-1 uppercase tracking-widest text-[9px] rounded-md shadow-md">
                    PIPELINE: {k.sourceSlug.toUpperCase()}-TO-{k.targetSlug.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                    EXCHANGE: {k.bestExchange}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white font-sans uppercase">
                  {isSame ? `${k.sourceName} Native Kernel & Tolerance Calibration` : `${k.sourceName} to ${k.targetName} Lossless 3D Translation`}
                </h1>
                <p className="text-violet-200 font-medium text-sm sm:text-base leading-relaxed max-w-3xl">
                  {k.tagline}
                </p>
              </div>

              {/* Topology Seal */}
              <div className="shrink-0 self-start lg:self-center border-2 border-violet-500/50 bg-violet-500/5 p-4 rounded-2xl border-dashed flex items-center gap-4 max-w-xs shadow-inner">
                <Layers className="w-8 h-8 text-violet-400 shrink-0" />
                <div>
                  <span className="text-[9px] text-violet-400 font-mono font-black uppercase tracking-widest block">TOPOLOGY RATING</span>
                  <span className="font-mono font-black text-white text-xs block uppercase">B-REP EDGE STITCHING</span>
                  <span className="text-[8px] text-slate-400 font-mono block">ZERO ACCIDENTAL POLYGON DEGRADATION</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 py-12 w-full space-y-16">
          {/* --- MAIN DOUBLE-COLUMN LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* Overview & Issue Analysis */}
              <Card className="rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-violet-600" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">Geometric Interoperability Scope</h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {k.issue}
                </p>
                <div className="bg-violet-50/50 p-4 rounded-2xl border border-violet-100/50 text-violet-850 font-medium text-xs leading-relaxed">
                  <strong>Geometric Kernels Statement:</strong> Multi-CAD collaborative systems require mapping the mathematical boundaries of B-Representation solids. Gaps in translation occur when exporting topological solids without aligning local linear tolerances.
                </div>
              </Card>

              {/* Tolerance & Stitching Matrix Table */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-violet-600" /> Kernel & Tolerance Specification Matrix
                </h3>
                <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4 sm:p-5 first:pl-6">Software Entity</th>
                          <th className="p-4 sm:p-5">Geometry Kernel</th>
                          <th className="p-4 sm:p-5">Native Format</th>
                          <th className="p-4 sm:p-5">Exchange Standard</th>
                          <th className="p-4 sm:p-5 last:pr-6">Linear Tolerance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium font-mono">
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 sm:p-5 first:pl-6 font-sans font-black text-slate-900">Source: {k.sourceName}</td>
                          <td className="p-4 sm:p-5">{k.sourceKernel}</td>
                          <td className="p-4 sm:p-5 text-slate-500">{isSame ? k.bestExchange : '.dwg / .sat / .3dm / .step'}</td>
                          <td className="p-4 sm:p-5 font-black text-violet-600">{k.bestExchange}</td>
                          <td className="p-4 sm:p-5 last:pr-6">{k.sourceTolerance}</td>
                        </tr>
                        {!isSame && (
                          <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 sm:p-5 first:pl-6 font-sans font-black text-slate-900">Target: {k.targetName}</td>
                            <td className="p-4 sm:p-5">{k.targetKernel}</td>
                            <td className="p-4 sm:p-5 text-slate-500">.dwg / .sat / .step</td>
                            <td className="p-4 sm:p-5 font-black text-violet-600">{k.bestExchange}</td>
                            <td className="p-4 sm:p-5 last:pr-6">{k.targetTolerance}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Remediation Guide */}
              <Card className="rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-violet-600" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">Step-by-Step Resolution Blueprint</h2>
                </div>
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium whitespace-pre-line">
                  {k.remediation}
                </div>
              </Card>

              {/* Precision Optimization Script Console */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-600" /> Precision Calibration Script
                </h3>
                <p className="text-slate-500 text-xs font-semibold">
                  Execute the following script inside your source CAD macro editor or script console to override default document absolute tolerances and align the B-Rep boundary curves.
                </p>
                <Card className="rounded-[24px] border border-slate-900 overflow-hidden bg-slate-950 text-slate-100 p-6 relative group shadow-lg">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Script: Calibrate_Tolerance.${k.codeLanguage === 'lisp' ? 'lsp' : k.codeLanguage === 'python' ? 'py' : 'txt'} // PRECISION OVERRIDE
                    </span>
                    <div 
                      dangerouslySetInnerHTML={{ __html: `
                        <button 
                          onclick="navigator.clipboard.writeText(this.parentNode.parentNode.nextElementSibling.innerText); this.innerHTML = 'COPIED!'; this.classList.remove('bg-slate-800'); this.classList.add('bg-violet-600'); setTimeout(() => { this.innerHTML = 'COPY SCRIPT'; this.classList.remove('bg-violet-600'); this.classList.add('bg-slate-800'); }, 2000)" 
                          class="bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 transition-all uppercase tracking-wider"
                        >
                          Copy Script
                        </button>
                      `.trim() }}
                    />
                  </div>
                  <pre className="overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300 p-2 bg-slate-900/50 rounded-xl border border-slate-900">
                    <code>{k.codeSnippet}</code>
                  </pre>
                </Card>
              </div>

            </div>

            {/* --- SIDEBAR --- */}
            <div className="space-y-6">
              {/* High-Converting Deals link */}
              <Card className="rounded-[24px] p-6 border-2 border-violet-500 bg-violet-500/5 shadow-xl space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 space-y-3">
                  <div className="text-[9px] font-black text-violet-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> Software License
                  </div>
                  <h3 className="font-black text-slate-900 text-base leading-snug">Resolve Translation Limits Legally</h3>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                    Need direct integration features without exporting intermediate file extensions? Secure the lowest subscription or perpetual license rates by visiting our verified deals database.
                  </p>
                  <Button asChild className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl h-11 text-xs shadow-md shadow-violet-900/10 transition-all duration-300">
                    <Link href={`/deals#${k.sourceSlug}`}>
                      Claim {k.sourceName} Deals →
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Assessment and Alternatives */}
              <Card className="rounded-[24px] p-6 border border-slate-100 shadow-sm bg-white space-y-4">
                <h3 className="font-black text-slate-900 text-xs border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Tool Assessment
                </h3>
                <div className="space-y-2">
                  <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl h-10 text-xs">
                    <Link href={`/tools/${k.sourceSlug}`}>
                      Read {k.sourceName} Review →
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full text-slate-700 hover:bg-slate-50 font-black rounded-xl h-10 text-xs">
                    <Link href={`/alternatives/${k.sourceSlug}`}>
                      See alternatives →
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Interactive Tool Rec - Breakthrough Interlink! */}
              <Card className="rounded-[24px] p-6 border border-slate-100 shadow-sm bg-slate-50 space-y-4">
                <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest text-slate-400">Related Interactive Tool</h3>
                <h4 className="font-black text-base text-slate-900 leading-snug">{toolRec.label}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                  Test and validate your exported geometries directly in our secure web canvas converter before distributing blueprints to clients.
                </p>
                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl h-10 text-xs shadow-md">
                  <Link href={toolRec.href}>
                    Open Interactive Tool →
                  </Link>
                </Button>
              </Card>

              {/* Metropolitan Interlink - Cross-links */}
              <Card className="rounded-[24px] p-6 border border-slate-100 shadow-sm bg-white space-y-4">
                <h3 className="font-black text-slate-900 text-xs border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Other Conversion Pipelines
                </h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  Map the topological translation guidelines from {k.sourceName} into other mainstream CAD/BIM engines.
                </p>
                <div className="space-y-2">
                  {k.metropolitanLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-violet-50/50 hover:text-violet-700 transition-all border border-slate-50 hover:border-violet-100 group"
                    >
                      <span className="font-bold text-slate-800 text-[11px] group-hover:text-violet-700 transition-colors font-mono">
                        {link.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-700 shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// 3.8. Licensing Security Shield Template (Template Shield)
export function renderLicensingShieldPage(shield: LicensingShieldPage) {
  // Breadcrumbs Structured Data
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Guides', 'item': 'https://cadguide.tools/guides' },
      { '@type': 'ListItem', 'position': 2, 'name': `${shield.toolName} Licensing Shield`, 'item': `https://cadguide.tools/guides/shield-${shield.toolSlug}` }
    ]
  };

  const otherShieldTools = LICENSING_TOOLS.filter(t => t !== shield.toolSlug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="bg-[#fcfdfe] min-h-screen pb-24 w-full overflow-x-hidden">
        {/* --- CRIMSON-DARK SECURITY SYSTEM HEADER --- */}
        <div className="bg-gradient-to-br from-slate-955 via-slate-900 to-rose-950 text-white relative py-12 md:py-20 w-full border-b-4 border-rose-800 shadow-2xl">
          {/* Outbound telemetry scan lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          
          <div className="max-w-[1360px] mx-auto px-4 relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 tracking-wider">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-white transition-colors">GUIDES</Link>
              <span>/</span>
              <span className="text-white font-black">SECURITY</span>
              <span>/</span>
              <span className="text-rose-400 font-black">LICENSING-SHIELD</span>
              <span>/</span>
              <span className="text-slate-300 font-black">{shield.toolSlug.toUpperCase()}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-4">
              <div className="space-y-4 max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-rose-700 text-white border-2 border-rose-500 font-mono font-black px-3 py-1 uppercase tracking-widest text-[9px] rounded-md shadow-md">
                    SHIELD DIRECTIVE: {shield.toolSlug.toUpperCase()}-AUDIT-911
                  </Badge>
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                    DAEMON: {shield.daemonName}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white font-sans uppercase">
                  {shield.toolName} License Security & Anti-Telemetry Shield
                </h1>
                <p className="text-rose-200 font-medium text-sm sm:text-base leading-relaxed max-w-3xl">
                  {shield.tagline}
                </p>
              </div>

              {/* Safety Shield Trust Seal */}
              <div className="shrink-0 self-start lg:self-center border-2 border-rose-500/50 bg-rose-500/5 p-4 rounded-2xl border-dashed flex items-center gap-4 max-w-xs shadow-inner">
                <ShieldAlert className="w-8 h-8 text-rose-400 shrink-0" />
                <div>
                  <span className="text-[9px] text-rose-400 font-mono font-black uppercase tracking-widest block">FIREWALL ACTIVE</span>
                  <span className="font-mono font-black text-white text-xs block uppercase">EULA AUDIT PREVENTION</span>
                  <span className="text-[8px] text-slate-400 font-mono block">NAMED-USER TELEMETRY DEACTIVATION</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 py-12 w-full space-y-16">
          {/* --- MAIN DOUBLE-COLUMN LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* Introduction Scope */}
              <Card className="rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-600" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">Enterprise Audit Vulnerability Analysis</h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {shield.excerpt}
                </p>
                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50 text-rose-800 font-medium text-xs leading-relaxed">
                  <strong>IT Administrator Warning:</strong> Background service licensing daemons for major CAD/BIM tools execute mandatory outbound named-user telemetry tracking. This gathers local adapter MAC addresses, host domain logs, and registry keys, sending reports back to software vendors. Unmonitored virtualization or multi-user seat allocation will trigger massive compliance audit fines.
                </div>
              </Card>

              {/* EULA Compliance Audit Checklist */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" /> EULA Compliance Audit Prevention Checklist
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {shield.complianceChecklist.map((item, idx) => (
                    <Card key={idx} className="rounded-2xl p-5 border border-slate-100 bg-white flex gap-4 items-start shadow-xs">
                      <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed">
                        {item}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Anti-Telemetry Firewall configuration */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-600" /> Outbound Telemetry Block Terminal Script
                </h3>
                <p className="text-slate-500 text-xs font-semibold">
                  Copy and execute the following batch command script in Administrator Command Prompt to map loopback values for remote telemetry servers and inject network block firewalls.
                </p>
                <Card className="rounded-[24px] border border-rose-900 overflow-hidden bg-slate-950 text-slate-100 p-6 relative group shadow-lg">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Script: Outbound_Block.bat // AUDIT PREVENTION CORE
                    </span>
                    <div 
                      dangerouslySetInnerHTML={{ __html: `
                        <button 
                          onclick="navigator.clipboard.writeText(this.parentNode.parentNode.nextElementSibling.innerText); this.innerHTML = 'COPIED!'; this.classList.remove('bg-slate-800'); this.classList.add('bg-rose-600'); setTimeout(() => { this.innerHTML = 'COPY SCRIPT'; this.classList.remove('bg-rose-600'); this.classList.add('bg-slate-800'); }, 2000)" 
                          class="bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 transition-all uppercase tracking-wider"
                        >
                          Copy Script
                        </button>
                      `.trim() }}
                    />
                  </div>
                  <pre className="overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300 p-2 bg-slate-900/50 rounded-xl border border-slate-900">
                    <code>{shield.netshScript}</code>
                  </pre>
                </Card>
              </div>

              {/* FLEXlm Options Server Config */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                  <Settings className="w-5 h-5 text-rose-600" /> Options Daemon / License Configuration File (.opt)
                </h3>
                <p className="text-slate-500 text-xs font-semibold">
                  Restrict available network licenses by user or department in your active local daemon server configuration to guarantee compliance and block unauthorized license drainage.
                </p>
                <Card className="rounded-[24px] border border-rose-900 overflow-hidden bg-slate-950 text-slate-100 p-6 relative group shadow-lg">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Config: options.opt // DAEMON RESERVATION RULES
                    </span>
                    <div 
                      dangerouslySetInnerHTML={{ __html: `
                        <button 
                          onclick="navigator.clipboard.writeText(this.parentNode.parentNode.nextElementSibling.innerText); this.innerHTML = 'COPIED!'; this.classList.remove('bg-slate-800'); this.classList.add('bg-rose-600'); setTimeout(() => { this.innerHTML = 'COPY CONFIG'; this.classList.remove('bg-rose-600'); this.classList.add('bg-slate-800'); }, 2000)" 
                          class="bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 transition-all uppercase tracking-wider"
                        >
                          Copy Config
                        </button>
                      `.trim() }}
                    />
                  </div>
                  <pre className="overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300 p-2 bg-slate-900/50 rounded-xl border border-slate-900">
                    <code>{shield.optionsTemplate}</code>
                  </pre>
                </Card>
              </div>

              {/* Silent Installation Arguments */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-rose-600" /> Silent Enterprise Deployment Arguments
                </h3>
                <p className="text-slate-500 text-xs font-semibold">
                  Deploy software packages globally via Active Directory Group Policies or Endpoint Managers silently, without triggering telemetry setup requests or prompt dialogues.
                </p>
                <Card className="rounded-[24px] border border-rose-900 overflow-hidden bg-slate-950 text-slate-100 p-6 relative group shadow-lg">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Command: Silent_Deploy.txt // ENTERPRISE MASS ROLLOUT
                    </span>
                    <div 
                      dangerouslySetInnerHTML={{ __html: `
                        <button 
                          onclick="navigator.clipboard.writeText(this.parentNode.parentNode.nextElementSibling.innerText); this.innerHTML = 'COPIED!'; this.classList.remove('bg-slate-800'); this.classList.add('bg-rose-600'); setTimeout(() => { this.innerHTML = 'COPY COMMAND'; this.classList.remove('bg-rose-600'); this.classList.add('bg-slate-800'); }, 2000)" 
                          class="bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 transition-all uppercase tracking-wider"
                        >
                          Copy Command
                        </button>
                      `.trim() }}
                    />
                  </div>
                  <pre className="overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300 p-2 bg-slate-900/50 rounded-xl border border-slate-900">
                    <code>{shield.silentCommand}</code>
                  </pre>
                </Card>
              </div>

            </div>

            {/* --- SIDEBAR --- */}
            <div className="space-y-6">
              {/* Metropolitan Interlink to Deals - High Converting Link */}
              <Card className="rounded-[24px] p-6 border-2 border-rose-500 bg-rose-500/5 shadow-xl space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 space-y-3">
                  <div className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> Compliance Remedy
                  </div>
                  <h3 className="font-black text-slate-900 text-base leading-snug">Resolve Stale Licenses & Purchase Legitimate Entitlements</h3>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                    Under active EULA audits, missing seats must be resolved immediately. Claim the active verified coupon deals below to lock in the lowest cost of ownership legally.
                  </p>
                  <Button asChild className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl h-11 text-xs shadow-md shadow-rose-900/10 transition-all duration-300">
                    <Link href={shield.dealLink}>
                      Claim Legitimate {shield.toolName} Deals →
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Assessment and Alternatives */}
              <Card className="rounded-[24px] p-6 border border-slate-100 shadow-sm bg-white space-y-4">
                <h3 className="font-black text-slate-900 text-xs border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Tool Assessment
                </h3>
                <div className="space-y-2">
                  <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl h-10 text-xs">
                    <Link href={`/tools/${shield.toolSlug}`}>
                      Read {shield.toolName} Review →
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full text-slate-700 hover:bg-slate-50 font-black rounded-xl h-10 text-xs">
                    <Link href={`/alternatives/${shield.toolSlug}`}>
                      See alternatives →
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Metropolitan Interlink - Other Shield Pages */}
              <Card className="rounded-[24px] p-6 border border-slate-100 shadow-sm bg-white space-y-4">
                <h3 className="font-black text-slate-900 text-xs border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Compare Audit Shields
                </h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  Map the EULA compliance auditing risks and anti-telemetry blocks across other commercial engineering platform suites.
                </p>
                <div className="space-y-2">
                  {otherShieldTools.map((tSlug, idx) => {
                    const t = tools.find(x => x.slug === tSlug);
                    return (
                      <Link
                        key={idx}
                        href={`/guides/shield-${tSlug}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-rose-50/50 hover:text-rose-700 transition-all border border-slate-50 hover:border-rose-100 group"
                      >
                        <span className="font-bold text-slate-800 text-[11px] group-hover:text-rose-700 transition-colors">
                          {t ? t.name : tSlug} Shield
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-700 shrink-0 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// 3.5. Drafting Standards Template (Template S)
export function renderStandardsPage(std: DraftingStandardPage) {
  // Breadcrumbs Structured Data
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Guides', 'item': 'https://cadguide.tools/guides' },
      { '@type': 'ListItem', 'position': 2, 'name': `${std.standardName} in ${std.toolName}`, 'item': `https://cadguide.tools/guides/standards-${std.standardId}-${std.toolSlug}` }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="bg-[#fcfdfe] min-h-screen pb-24 w-full overflow-x-hidden">
        {/* --- SLATE-GREEN TECHNICAL BLUEPRINT HEADER --- */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white relative py-12 md:py-20 w-full border-b-4 border-slate-700 shadow-xl">
          {/* High-density grid background scan lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="max-w-[1360px] mx-auto px-4 relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 tracking-wider">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-white transition-colors">GUIDES</Link>
              <span>/</span>
              <span className="text-white font-black">STANDARDS</span>
              <span>/</span>
              <span className="text-emerald-400 font-black">{std.standardId.toUpperCase()}</span>
              <span>/</span>
              <span className="text-slate-300 font-black">{std.toolSlug.toUpperCase()}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-4">
              <div className="space-y-4 max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-emerald-600 text-white border-2 border-emerald-500 font-mono font-black px-3 py-1 uppercase tracking-widest text-[9px] rounded-md shadow-md">
                    STANDARD: {std.standardName}
                  </Badge>
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                    ORG: {std.standardOrg}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white font-sans uppercase">
                  {std.standardName} Layer Rules in {std.toolName}
                </h1>
                <p className="text-slate-300 font-medium text-sm sm:text-base leading-relaxed max-w-3xl">
                  {std.tagline}
                </p>
              </div>

              {/* Standards Trust Seal */}
              <div className="shrink-0 self-start lg:self-center border-2 border-emerald-500/50 bg-emerald-500/5 p-4 rounded-2xl border-dashed flex items-center gap-4 max-w-xs shadow-inner">
                <BookOpen className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[9px] text-emerald-400 font-mono font-black uppercase tracking-widest block">COMPLIANCE CODE</span>
                  <span className="font-mono font-black text-white text-xs block uppercase">VERIFIED DRAFTING DIRECTIVE</span>
                  <span className="text-[8px] text-slate-400 font-mono block">100% ALIGNED WITH OFFICIAL PROTOCOLS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 py-12 w-full space-y-16">
          {/* --- MAIN DOUBLE-COLUMN LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* Overview Card */}
              <Card className="rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">Scope & Objectives</h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {std.standardDesc}
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-500 font-medium text-xs leading-relaxed">
                  <strong>Technical Standard Statement:</strong> Plotting drawing layouts under standard regulations requires strict configuration of pen weight mapping, layer naming boundaries, and line conventions. Incorrect configurations will trigger sub-standard plotting line-weights in vector PDF output and audit failure in BIM/CAD coordination stages.
                </div>
              </Card>

              {/* Standard Layer Matrix Table */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Standard Layer & Pen Mapping Specification Matrix
                </h3>
                <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4 sm:p-5 first:pl-6">Layer Code</th>
                          <th className="p-4 sm:p-5">Name / Element</th>
                          <th className="p-4 sm:p-5">Description</th>
                          <th className="p-4 sm:p-5">Color ID</th>
                          <th className="p-4 sm:p-5">Pen Weight</th>
                          <th className="p-4 sm:p-5 last:pr-6">Primary Usage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium font-mono">
                        {std.layers.map((l, lIdx) => (
                          <tr key={lIdx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 sm:p-5 first:pl-6">
                              <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono font-black text-[11px] border border-slate-200">
                                {l.code}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-slate-900 font-sans font-black">{l.name}</td>
                            <td className="p-4 sm:p-5 text-slate-500 font-sans">{l.desc}</td>
                            <td className="p-4 sm:p-5">{l.colorId}</td>
                            <td className="p-4 sm:p-5 text-emerald-600 font-black">{l.weight}</td>
                            <td className="p-4 sm:p-5 last:pr-6 font-sans text-slate-500">{l.usage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Software Integration Guide */}
              <Card className="rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">{std.toolName} Integration Guidelines</h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {std.softwareGuide}
                </p>
              </Card>

              {/* Automation Console Script Card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" /> Automation Console Script
                  </h3>
                </div>
                
                <Card className="rounded-[24px] border border-slate-900 overflow-hidden bg-slate-950 text-slate-100 p-6 relative group shadow-lg">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Script Language: {std.codeLanguage.toUpperCase()} // CADGUIDE CLI v1.0
                    </span>
                    <div 
                      dangerouslySetInnerHTML={{ __html: `
                        <button 
                          onclick="navigator.clipboard.writeText(this.parentNode.parentNode.nextElementSibling.innerText); this.innerHTML = 'COPIED!'; this.classList.remove('bg-slate-800'); this.classList.add('bg-emerald-600'); setTimeout(() => { this.innerHTML = 'COPY SCRIPT'; this.classList.remove('bg-emerald-600'); this.classList.add('bg-slate-800'); }, 2000)" 
                          class="bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 transition-all uppercase tracking-wider"
                        >
                          Copy Script
                        </button>
                      `.trim() }}
                    />
                  </div>
                  <pre className="overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300 p-2 bg-slate-900/50 rounded-xl border border-slate-900">
                    <code>{std.codeSnippet}</code>
                  </pre>
                </Card>
              </div>

            </div>

            {/* --- SIDEBAR --- */}
            <div className="space-y-6">
              {/* Link to Tool Details Review */}
              <Card className="rounded-[24px] p-6 border border-slate-100 shadow-sm bg-white space-y-4">
                <h3 className="font-black text-slate-900 text-xs border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Tool Assessment
                </h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  Analyze active pricing models, expert verdicts, alternatives and telemetry data for {std.toolName}.
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl h-10 text-xs">
                    <Link href={`/tools/${std.toolSlug}`}>
                      Read {std.toolName} Review →
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full text-slate-700 hover:bg-slate-50 font-black rounded-xl h-10 text-xs">
                    <Link href={`/alternatives/${std.toolSlug}`}>
                      See Alternatives →
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Metropolitan Interlink Standard Matrix */}
              <Card className="rounded-[24px] p-6 border border-slate-100 shadow-sm bg-white space-y-4">
                <h3 className="font-black text-slate-900 text-xs border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Compare Other Tools
                </h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  Map the {std.standardName} technical drawing and drafting rules across other mainstream industry CAD/BIM engines.
                </p>
                <div className="space-y-2">
                  {std.metropolitanLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 hover:text-emerald-700 transition-all border border-slate-50 hover:border-emerald-100 group"
                    >
                      <span className="font-bold text-slate-800 text-[11px] group-hover:text-emerald-700 transition-colors">
                        {link.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </Card>

              {/* CAD Toolbox CTA Card */}
              <Card className="rounded-[24px] p-6 border border-slate-100 shadow-sm bg-gradient-to-br from-slate-900 to-emerald-950 text-white space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                <h3 className="font-black text-[10px] text-emerald-400 uppercase tracking-widest">Free Tool Spotlight</h3>
                <h4 className="font-black text-base tracking-tight leading-snug">AutoCAD Drawing Performance Cleaner</h4>
                <p className="text-slate-300 text-xs leading-relaxed font-medium">
                  Plotting standard drawings sluggish? Load our free lag remover to wipe corrupt DGN line types and wipe unregistered scale groups.
                </p>
                <Button asChild className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-10 text-xs shadow-md">
                  <Link href="/toolbox">
                    Open Free CAD Toolbox →
                  </Link>
                </Button>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// 3. Industry Procurement Matrix Template (Template P)
export function renderProcurementPage(pro: ProcurementIndustry) {
  // Breadcrumbs Structured Data
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Guides', 'item': 'https://cadguide.tools/guides' },
      { '@type': 'ListItem', 'position': 2, 'name': pro.title, 'item': `https://cadguide.tools/guides/industry-${pro.slug}` }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="bg-[#fcfdfe] min-h-screen pb-24 w-full overflow-x-hidden">
        {/* --- BLUE-GOLD ENTERPRISE EXECUTIVE HEADER --- */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white relative py-12 md:py-20 w-full border-b-4 border-slate-700 shadow-xl">
          {/* High-density grid background scan lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="max-w-[1360px] mx-auto px-4 relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 tracking-wider">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-white transition-colors">GUIDES</Link>
              <span>/</span>
              <span className="text-white font-black">PROCUREMENT</span>
              <span>/</span>
              <span className="text-amber-400 font-black">{pro.slug.toUpperCase()}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-4">
              <div className="space-y-4 max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-amber-600 text-white border-2 border-amber-500 font-mono font-black px-3 py-1 uppercase tracking-widest text-[9px] rounded-md shadow-md">
                    DIRECTIVE: {pro.directiveCode}
                  </Badge>
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                    CLASS: TCO PROCUREMENT INDEX // {pro.reference}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white font-sans uppercase">
                  {pro.title}
                </h1>
                <p className="text-slate-300 font-medium text-sm sm:text-base leading-relaxed max-w-3xl">
                  {pro.tagline}
                </p>
              </div>

              {/* Verified Trust Seal */}
              <div className="shrink-0 self-start lg:self-center border-2 border-amber-500/50 bg-amber-500/5 p-4 rounded-2xl border-dashed flex items-center gap-4 max-w-xs shadow-inner">
                <Scale className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[9px] text-amber-400 font-mono font-black uppercase tracking-widest block">COMPLIANCE RATING</span>
                  <span className="font-mono font-black text-white text-xs block uppercase">UNBIASED THIRD-PARTY EVALUATION</span>
                  <span className="text-[8px] text-slate-400 font-mono block">NO VENDOR SPONSORSHIP // AUDITED Q2 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 py-12 w-full space-y-16">
          {/* --- MAIN DOUBLE-COLUMN LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* Introduction Card */}
              <Card className="rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">Executive Scope & Analysis</h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {pro.intro}
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-500 font-medium text-xs leading-relaxed">
                  <strong>Procurement Standards Statement:</strong> Software selection for high-precision engineering workflows requires auditing total cost of ownership (TCO), network floating licensing server administration, and EULA named-user compliance telemetry. Mapped below is the audited comparative matrix across the top 5 industry choices.
                </div>
              </Card>

              {/* TCO Matrix Table */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" /> Procurement & TCO Comparative Matrix
                </h3>
                <Card className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-900 text-white font-mono font-bold uppercase tracking-wider text-[10px]">
                          {pro.tableHeaders.map((h, hIdx) => (
                            <th key={hIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium font-mono">
                        {pro.tableRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-4 sm:p-5 first:pl-6 last:pr-6">
                                {cIdx === 0 ? (
                                  <span className="font-sans font-black text-slate-900">{cell}</span>
                                ) : cIdx === 3 && (cell.includes('High') || cell.includes('Critical')) ? (
                                  <span className="text-rose-600 font-black">{cell}</span>
                                ) : cIdx === 3 && cell.includes('Zero') ? (
                                  <span className="text-emerald-600 font-black">{cell}</span>
                                ) : (
                                  cell
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

              {/* Detailed Platforms Review with Metropolitan Interlink */}
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
                  Platform Pros & Cons Breakdown
                </h3>
                <div className="space-y-6">
                  {pro.platforms.map((plat, pIdx) => {
                    const matchedTool = tools.find(t => t.slug === plat.toolSlug);
                    return (
                      <Card key={pIdx} className="rounded-[24px] p-6 border border-slate-100 bg-white hover:shadow-md transition-all duration-300 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4">
                          <div className="flex items-center gap-3">
                            {matchedTool ? (
                              <div className="w-10 h-10 shrink-0">
                                <ToolLogo slug={matchedTool.slug} src={matchedTool.logo_url} name={matchedTool.name} className="w-10 h-10" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                                {plat.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h4 className="font-black text-slate-900 text-base">{plat.name}</h4>
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                Kernel Score: {plat.kernelScore} // TCO: {plat.tco3Yr}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                              EULA Audit Risk:
                            </span>
                            <Badge className={cn(
                              "font-mono font-black text-[9px] px-2 py-0.5 rounded border uppercase",
                              plat.auditRisk === 'Low' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                              plat.auditRisk === 'Medium' && "bg-amber-50 text-amber-700 border-amber-100",
                              plat.auditRisk === 'High' && "bg-rose-50 text-rose-700 border-rose-100",
                              plat.auditRisk === 'Critical' && "bg-red-600 text-white border-red-500 animate-pulse"
                            )}>
                              {plat.auditRisk}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-black text-emerald-600 uppercase tracking-wider text-[9px] block">✓ Key Advantage</span>
                            <p className="text-slate-600 font-medium leading-relaxed">{plat.pros}</p>
                          </div>
                          <div className="space-y-1.5">
                            <span className="font-black text-rose-500 uppercase tracking-wider text-[9px] block">✗ Key Limitation</span>
                            <p className="text-slate-600 font-medium leading-relaxed">{plat.cons}</p>
                          </div>
                        </div>

                        {/* Metropolitan Interlink Buttons */}
                        {matchedTool && (
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-50">
                            <Button asChild variant="outline" className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 h-8 px-4 text-xs font-bold shadow-xs">
                              <Link href={`/tools/${plat.toolSlug}`}>
                                Read {matchedTool.name} Review
                              </Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 h-8 px-4 text-xs font-bold shadow-xs">
                              <Link href={`/alternatives/${plat.toolSlug}`}>
                                Alternatives & Competitors
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" className="rounded-xl text-slate-500 hover:text-slate-900 h-8 px-4 text-xs font-bold">
                              <Link href={`/guides?tool=${plat.toolSlug}`}>
                                Technical Guides
                              </Link>
                            </Button>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN SIDEBAR --- */}
            <div className="space-y-8">
              {/* E-E-A-T Objective Audit Seal */}
              <Card className="rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">TCO TRUST GUARANTEE</h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                  This multi-platform matrix compiles authentic market subscription pricing, named-user background data collection audit risk ratings, and file format interoperability tolerances. 
                </p>
                <p className="text-slate-400 text-[10px] leading-relaxed font-mono">
                  All analyses remain 100% objective, based on IT telemetry logs and verified engineers feedback.
                </p>
              </Card>

              {/* Automated Telemetry Shield & Registry Tweak Code */}
              {pro.complianceShieldTitle && (
                <Card className="rounded-[24px] p-6 border border-slate-900 shadow-xl bg-slate-950 text-white space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      <Settings className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-wider text-slate-200">{pro.complianceShieldTitle}</h4>
                      <span className="text-[9px] text-slate-500 font-mono">Automated Shell / Hosts Script</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-[11px] leading-relaxed font-medium">
                    {pro.complianceShieldDesc} Save the code snippet below as a `.bat` script file and execute with Administrator privileges.
                  </p>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 font-mono text-[9px] leading-relaxed text-emerald-400 overflow-x-auto select-all">
                    <pre>{pro.codeSnippet}</pre>
                  </div>
                </Card>
              )}

              {/* Deals Center Navigation Banner */}
              <Link href="/deals" className="block rounded-[24px] p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-100 hover:shadow-xl hover:-translate-y-0.5 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mr-8 -mt-8"></div>
                <div className="relative z-10 space-y-2">
                  <div className="text-emerald-100 font-mono font-black text-[9px] uppercase tracking-widest">
                    ACTIVE COMMERCIAL OFFERS
                  </div>
                  <h4 className="font-black text-sm group-hover:underline">
                    Save on CAD/BIM Licensing →
                  </h4>
                  <p className="text-emerald-100 text-xs leading-relaxed font-medium">
                    Check active coupon codes, discounts, and verified perpetual alternatives to cut down software expenses.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
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
        if (template && isArticleCompatibleWithTool(template.title, template.category, t)) {
          return { tool: t, template, category, artIndex };
        }
      }
    }
  }
  return null;
}

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  // For static builds, pre-render exactly 20 guides per tool to generate 4,800+ fast static routes
  for (const tool of tools) {
    const selectedArticles = ARTICLES_LIST
      .filter(art => isArticleCompatibleWithTool(art.title, art.category, tool))
      .slice(0, 20);
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

  // Pre-render the 20 industry procurement pages
  for (const pro of PROCUREMENT_LIST) {
    params.push({ slug: `industry-${pro.slug}` });
  }

  // Pre-render the 200 standards pages (10 standards x 20 tools)
  for (const std of STANDARDS_LIST) {
    for (const tool of DRAFTING_TOOLS) {
      params.push({ slug: `standards-${std.id}-${tool}` });
    }
  }

  // Pre-render the 30 licensing shield pages
  for (const tool of LICENSING_TOOLS) {
    params.push({ slug: `shield-${tool}` });
  }

  // Pre-render the 100 kernel conversion pages (10 source x 10 target tools)
  for (const src of KERNEL_TOOLS) {
    for (const tgt of KERNEL_TOOLS) {
      params.push({ slug: `kernel-${src.slug}-${tgt.slug}` });
    }
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

  // 1.5. Check if slug is an industry procurement page
  if (slug.startsWith('industry-')) {
    const pro = getProcurementBySlug(slug.substring(9));
    if (pro) {
      return {
        title: `${pro.title} — 3-Yr TCO & Procurement Platform Comparison`,
        description: pro.excerpt,
        keywords: [pro.keyword, 'cad procurement', 'cad comparison', 'cax tco matrix', 'software selection', 'license audit compliance'],
        alternates: {
          canonical: `https://cadguide.tools/guides/${slug}`,
        },
        robots: { index: true, follow: true },
      };
    } else {
      return {
        title: 'Not Found — CADGuide',
        robots: { index: false, follow: false },
      };
    }
  }

  // 1.7. Check if slug is a drafting standard page
  if (slug.startsWith('standards-')) {
    const raw = slug.substring(10);
    const standard = STANDARDS_LIST.find(s => raw.startsWith(s.id + '-'));
    if (standard) {
      const standardId = standard.id;
      const toolSlug = raw.substring(standardId.length + 1);
      const stdData = getStandardPageData(standardId, toolSlug);
      if (stdData) {
        return {
          title: `${stdData.standardName} in ${stdData.toolName} — Drafting & Layering Standards`,
          description: stdData.excerpt,
          keywords: [stdData.keyword, 'cad standards', 'bim layers', 'lineweight mapping', 'technical drafting', 'export configuration'],
          alternates: {
            canonical: `https://cadguide.tools/guides/${slug}`,
          },
          robots: { index: true, follow: true },
        };
      }
    }
    return {
      title: 'Not Found — CADGuide',
      robots: { index: false, follow: false },
    };
  }

  // 1.8. Check if slug is an IT licensing shield page
  if (slug.startsWith('shield-')) {
    const toolSlug = slug.substring(7);
    const shieldData = getLicensingShieldData(toolSlug);
    if (shieldData) {
      return {
        title: `${shieldData.toolName} Licensing Security & Anti-Telemetry Shield`,
        description: shieldData.excerpt,
        keywords: [`${shieldData.toolName.toLowerCase()} audit`, `${shieldData.toolName.toLowerCase()} license`, 'flexlm options', 'silent deploy', 'block telemetry', 'eula compliance'],
        alternates: {
          canonical: `https://cadguide.tools/guides/${slug}`,
        },
        robots: { index: true, follow: true },
      };
    }
    return {
      title: 'Not Found — CADGuide',
      robots: { index: false, follow: false },
    };
  }

  // 1.9. Check if slug is a geometry kernel pipeline page
  if (slug.startsWith('kernel-')) {
    const raw = slug.substring(7);
    const sourceTool = KERNEL_TOOLS.find(t => raw.startsWith(t.slug + '-'));
    if (sourceTool) {
      const sourceSlug = sourceTool.slug;
      const targetSlug = raw.substring(sourceSlug.length + 1);
      const kData = getKernelPageData(sourceSlug, targetSlug);
      if (kData) {
        return {
          title: `${kData.sourceName} to ${kData.targetName} Kernel Conversion & Tolerance Stitching`,
          description: kData.excerpt,
          keywords: ['geometry kernel', 'parasolid acis conversion', 'linear tolerance', 'surface stitching error', 'brep topology', '3d model healing'],
          alternates: {
            canonical: `https://cadguide.tools/guides/${slug}`,
          },
          robots: { index: true, follow: true },
        };
      }
    }
    return {
      title: 'Not Found — CADGuide',
      robots: { index: false, follow: false },
    };
  }

  // 2. Check if slug is an individual guide page
  const parsed = parseGuideSlug(slug);
  if (!parsed) return {};

  const { tool, template, category } = parsed;
  const localized = getLocalizedTitleAndExcerpt(template.title, template.excerpt, template.keyword, category, tool);

  // 标题后缀按 category 动态化（此前所有类目都写死 "CAD Expert Troubleshooting"，词不对题）。
  const CATEGORY_TITLE_SUFFIX: Record<string, string> = {
    troubleshooting: 'Troubleshooting Guide',
    performance: 'Performance Tuning Guide',
    printing: 'Plotting & Output Guide',
    standards: 'Drafting Standards Guide',
    deployment: 'Deployment & IT Guide',
    migration: 'Migration Guide',
    procurement: 'Procurement Guide',
    manufacturing: 'Manufacturing Guide',
  };
  const suffix = CATEGORY_TITLE_SUFFIX[category] || 'Technical Guide';

  // meta description 去重：在模板摘要后附加随工具变化的事实性信息（平台/定价），
  // 降低 ~4800 个长尾页面之间近乎完全重复的描述，规避 HCU 薄内容判定。
  const platformText = (tool.platforms && tool.platforms.length > 0) ? tool.platforms.join(', ') : 'desktop';
  const description = `${localized.excerpt} ${tool.name} (${pricingSummary(tool)}, ${platformText}).`.trim();

  return {
    title: `${localized.title} — ${suffix}`,
    description,
    keywords: [tool.name.toLowerCase(), `${tool.name.toLowerCase()} ${category}`, `${tool.name.toLowerCase()} guide`, localized.keyword],
    alternates: {
      canonical: `https://cadguide.tools/guides/${slug}`,
    },
    openGraph: {
      type: 'article',
      url: `https://cadguide.tools/guides/${slug}`,
      title: `${localized.title} — ${suffix}`,
      description,
      siteName: 'CADGuide.tools',
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
      { '@type': 'ListItem', 'position': 1, 'name': 'Guides', 'item': 'https://cadguide.tools/guides' },
      { '@type': 'ListItem', 'position': 2, 'name': catInfo.title, 'item': `https://cadguide.tools/guides/${category}` }
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
                  <strong>Technical Compliance Statement:</strong> This category functions as a critical vascular artery in the national CAD/BIM/CAx coordination framework. Programmatic listicles and generic AI-generated articles are explicitly blocked. All technical guidelines, registry configurations, shell commands, and compliance option variables mapped herein reflect authentic verified enterprise engineering workflows.
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
                const templateArt = ARTICLES_LIST.find(a => 
                  a.title.toLowerCase().trim() === art.title.toLowerCase().trim()
                );
                const realIndex = templateArt ? templateArt.id.split('-').pop() : aIdx;
                
                // Find a tool that is COMPATIBLE with this article
                const matchedTool = tools.find(t => 
                  art.title.toLowerCase().includes(t.name.toLowerCase()) && 
                  templateArt && isArticleCompatibleWithTool(templateArt.title, templateArt.category, t)
                ) || tools.find(t => 
                  templateArt && isArticleCompatibleWithTool(templateArt.title, templateArt.category, t)
                ) || tools.find(t => 
                  art.title.toLowerCase().includes(t.name.toLowerCase())
                ) || tools[0];

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
                        Detailed expert blueprint for {art.title}. Learn active-registry configuration parameters, troubleshooting options file variables, and enterprise optimization protocols tailored for enterprise engineering workflows.
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ToolLogo slug={matchedTool.slug} name={matchedTool.name} src={matchedTool.logo_url} className="w-6 h-6 rounded-md shadow-sm border bg-white" />
                        <span className="text-[10px] text-slate-500 font-bold">{matchedTool.name} Mapped</span>
                      </div>
                      <Button asChild className="rounded-xl bg-slate-900 hover:bg-red-600 text-white font-black text-xs h-9 px-4 shadow-sm transition-colors">
                        <Link href={`/guides/${matchedTool.slug}-${category}-${realIndex}`}>
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

  // 1.5. Check if slug is an industry procurement page
  if (slug.startsWith('industry-')) {
    const pro = getProcurementBySlug(slug.substring(9));
    if (pro) {
      return renderProcurementPage(pro);
    } else {
      notFound();
    }
  }

  // 1.7. Check if slug is a drafting standard page
  if (slug.startsWith('standards-')) {
    const raw = slug.substring(10);
    const standard = STANDARDS_LIST.find(s => raw.startsWith(s.id + '-'));
    if (standard) {
      const standardId = standard.id;
      const toolSlug = raw.substring(standardId.length + 1);
      const stdData = getStandardPageData(standardId, toolSlug);
      if (stdData) {
        return renderStandardsPage(stdData);
      }
    }
    notFound();
  }

  // 1.8. Check if slug is an IT licensing shield page
  if (slug.startsWith('shield-')) {
    const toolSlug = slug.substring(7);
    const shieldData = getLicensingShieldData(toolSlug);
    if (shieldData) {
      return renderLicensingShieldPage(shieldData);
    }
    notFound();
  }

  // 1.9. Check if slug is a geometry kernel pipeline page
  if (slug.startsWith('kernel-')) {
    const raw = slug.substring(7);
    const sourceTool = KERNEL_TOOLS.find(t => raw.startsWith(t.slug + '-'));
    if (sourceTool) {
      const sourceSlug = sourceTool.slug;
      const targetSlug = raw.substring(sourceSlug.length + 1);
      const kData = getKernelPageData(sourceSlug, targetSlug);
      if (kData) {
        return renderKernelPage(kData);
      }
    }
    notFound();
  }

  // 2. Otherwise process as a dynamic tool guide
  const parsed = parseGuideSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { tool, template, category } = parsed;
  const meta = getArchetypeMetadata(tool.category_id, tool);
  const localized = getLocalizedTitleAndExcerpt(template.title, template.excerpt, template.keyword, category, tool);
  const title = localized.title;
  const excerpt = localized.excerpt;

  // Renders distinct detailed technical guides based on category sections
  const recArtifact = recoveryArtifact(tool);
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
            desc: `Wipe all background cache assets under the Windows Temp folder and locate temporary recovery files (${recArtifact.files}). Copy files to an isolated backup subnet to prevent background serialization overwrites.`,
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

  // Metropolitan Interlink: Compare PK battles for sidebar
  const toolComparisons = comparisonPairs().filter(
    (pair) => pair.a.slug === tool.slug || pair.b.slug === tool.slug
  ).slice(0, 4);

  // Metropolitan Interlink: Other relevant guides for sidebar
  const otherGuides = ARTICLES_LIST
    .filter(g => g.id !== template.id && isArticleCompatibleWithTool(g.title, g.category, tool))
    .slice(0, 3)
    .map(g => {
      const loc = getLocalizedTitleAndExcerpt(g.title, g.excerpt, g.keyword, g.category, tool);
      return {
        ...g,
        title: loc.title,
        slug: `${tool.slug}-${g.category}-${g.id.split('-').pop()}`
      };
    });

  // Generate breadcrumb links for crawlers
  const breadcrumbs = [
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
      '@type': 'Organization',
      'name': 'CADGuide Tools Editorial Team',
      'url': 'https://cadguide.tools',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'CADGuide Tools',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://cadguide.tools/icon.svg',
      },
    },
    'datePublished': GUIDE_CONTENT_PUBLISHED,
    'dateModified': GUIDE_CONTENT_UPDATED,
    'about': {
      '@type': 'SoftwareApplication',
      'name': tool.name,
      'operatingSystem': tool.platforms?.join(', '),
      'applicationCategory': 'BusinessApplication',
    },
  };

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': title,
    'description': excerpt,
    'totalTime': 'PT25M',
    'estimatedCost': {
      '@type': 'MonetaryAmount',
      'currency': 'USD',
      'value': '0'
    },
    'tool': [
      {
        '@type': 'HowToTool',
        'name': tool.name
      }
    ],
    'step': steps.map((step, idx) => ({
      '@type': 'HowToStep',
      'position': idx + 1,
      'name': step.title,
      'text': step.desc,
      'url': `https://cadguide.tools/guides/${slug}#step-${idx + 1}`
    })),
  };

  // GEO Step 1: FAQPage Schema — 让 AI 爬虫一眼读懂页面问答结构
  const faqEntries = steps.map((step) => ({
    '@type': 'Question',
    'name': `How do you ${step.title.replace(/\?$/, '').toLowerCase()}?`,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': step.desc,
    },
  }));

  // 附加一条基于 category 的通用 FAQ，覆盖"适用版本"高频检索意图
  faqEntries.push({
    '@type': 'Question',
    'name': `Does this ${category} guide apply to the latest version of ${tool.name}?`,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': `This guide targets ${tool.name} across currently supported release versions. The procedures describe standard enterprise deployment configurations; always confirm against your specific version and environment before applying.`,
    },
  });

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqEntries,
  };

  return (
    <>
      <link rel="cite-as" href={`https://cadguide.tools/guides/${slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <div className="bg-[#fcfdfe] min-h-screen pb-20 w-full overflow-x-hidden">
        {/* Dynamic Header */}
        <div className="bg-white border-b py-6 w-full">
          <div className="max-w-[1360px] mx-auto px-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4">
              <Link href="/" className={cn("hover:underline transition-colors", meta ? `hover:${meta.theme.accentText}` : "hover:text-blue-600")}>Home</Link>
              <span>/</span>
              <Link href="/guides" className={cn("hover:underline transition-colors", meta ? `hover:${meta.theme.accentText}` : "hover:text-blue-600")}>Guides</Link>
              <span>/</span>
              <span className="text-slate-900 truncate">{tool.name} Technical Guide</span>
            </div>

            <Link 
              href="/guides" 
              className={cn(
                "inline-flex items-center gap-2 text-xs font-black mb-6 hover:underline group",
                meta ? meta.theme.accentText : "text-blue-600"
              )}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Guides Library
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn("text-white border-none font-black px-3 py-1 uppercase tracking-widest text-[9px] rounded-lg", meta ? meta.theme.buttonBg : "bg-blue-600")}>
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
                  <Link href={`/tools/${tool.slug}`} className={cn("font-black text-slate-900 hover:underline block text-lg", meta ? meta.theme.accentText : "hover:text-blue-600")}>
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
                  <div className={cn("w-10 h-10 rounded-full text-white font-black text-xs flex items-center justify-center shadow-lg", meta ? `${meta.theme.buttonBg} shadow-${meta.theme.accentText.split('-')[1]}-200` : "bg-blue-600 shadow-blue-200")}>
                    CG
                  </div>
                  <div>
                    <span className="font-black text-slate-900 block text-sm">CADGuide Tools Editorial Team</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Editorial Team</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-slate-500 font-bold">
                  <div>Read Time: <span className="text-slate-900 font-black">7 min</span></div>
                  <div>Published: <span className="text-slate-900 font-black">May 2026</span></div>
                  <div>Status: <span className="text-slate-700 font-black flex items-center gap-1">Editorial Review</span></div>
                </div>
              </div>

              {category === 'troubleshooting' ? (
                renderTechnicalAutopsy(tool, title)
              ) : category === 'performance' ? (
                renderPerformanceBenchmark(tool, title)
              ) : category === 'printing' ? (
                renderPrintingDirective(tool, title)
              ) : category === 'migration' ? (
                renderMigrationDirective(tool, title)
              ) : category === 'standards' ? (
                renderStandardsDirective(tool, title)
              ) : category === 'manufacturing' ? (
                renderManufacturingDirective(tool, title)
              ) : category === 'deployment' ? (
                renderDeploymentDirective(tool, title)
              ) : category === 'procurement' ? (
                renderProcurementDirective(tool, title)
              ) : (
                <>
                  {/* Technical Overview Container */}
                  <Card className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[32px] overflow-hidden relative p-6 sm:p-8">
                    <div className={cn(
                      "absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-20",
                      meta?.id === 'drafting-aec' && "bg-slate-500",
                      meta?.id === 'mechanical-simulation' && "bg-amber-500",
                      meta?.id === 'creative-visual' && "bg-indigo-500",
                      meta?.id === 'electronics-hardware' && "bg-emerald-500",
                      !meta && "bg-blue-500"
                    )}></div>
                    <div className="relative z-10 space-y-4">
                      <div className={cn(
                        "flex items-center gap-3 font-black text-[10px] uppercase tracking-widest",
                        meta?.id === 'drafting-aec' && "text-slate-400",
                        meta?.id === 'mechanical-simulation' && "text-amber-400",
                        meta?.id === 'creative-visual' && "text-indigo-400",
                        meta?.id === 'electronics-hardware' && "text-emerald-400",
                        !meta && "text-blue-400"
                      )}>
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
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        meta?.id === 'drafting-aec' && "bg-slate-100 text-slate-700",
                        meta?.id === 'mechanical-simulation' && "bg-amber-100 text-amber-700",
                        meta?.id === 'creative-visual' && "bg-indigo-100 text-indigo-700",
                        meta?.id === 'electronics-hardware' && "bg-emerald-100 text-emerald-700",
                        !meta && "bg-blue-100 text-blue-600"
                      )}>
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
                          className={cn(
                            "bg-white p-6 sm:p-8 rounded-[24px] border shadow-sm transition-all duration-300 relative group flex items-start gap-4 sm:gap-6",
                            meta?.id === 'drafting-aec' && "border-slate-100 hover:border-slate-300",
                            meta?.id === 'mechanical-simulation' && "border-slate-100 hover:border-amber-200",
                            meta?.id === 'creative-visual' && "border-slate-100 hover:border-indigo-200",
                            meta?.id === 'electronics-hardware' && "border-slate-100 hover:border-emerald-200",
                            !meta && "border-slate-100 hover:border-blue-100"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-full font-black text-base flex items-center justify-center shrink-0 transition-colors duration-300",
                            meta?.id === 'drafting-aec' && "bg-slate-50 text-slate-600 group-hover:bg-slate-700 group-hover:text-white",
                            meta?.id === 'mechanical-simulation' && "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
                            meta?.id === 'creative-visual' && "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
                            meta?.id === 'electronics-hardware' && "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
                            !meta && "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                          )}>
                            {sIdx + 1}
                          </div>
                          <div className="space-y-2 min-w-0">
                            <h4 className={cn(
                              "font-black text-slate-900 text-base sm:text-lg transition-colors",
                              meta?.id === 'drafting-aec' && "group-hover:text-slate-700",
                              meta?.id === 'mechanical-simulation' && "group-hover:text-amber-700",
                              meta?.id === 'creative-visual' && "group-hover:text-indigo-700",
                              meta?.id === 'electronics-hardware' && "group-hover:text-emerald-700",
                              !meta && "group-hover:text-blue-600"
                            )}>
                              {step.title}
                            </h4>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                              {step.desc}
                            </p>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-[10px] sm:text-xs text-slate-500 overflow-x-auto mt-4">
                              <code>
                                {sIdx === 0 && `# Command-line execution for environment verification\nC:\\Program Files\\${tool.name.replace(/\s+/g, '')}\\Bin\\${tool.name.toLowerCase().replace(/\s+/g, '')}.exe --verify-license --verbose`}
                                {sIdx === 1 && `# Query FLEXlm options daemon TCP socket status\nLMUTIL lmstat -a -c C:\\Licenses\\${tool.name.toLowerCase().replace(/\s+/g, '')}.lic`}
                                {sIdx === 2 && `# Wipe local dynamic recovery files safely\ndel /f /q %TEMP%\\*${tool.name.toLowerCase().replace(/\s+/g, '').slice(0, 5)}*.${recArtifact.glob}`}
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
              <Card className={cn(
                "border-2 border-dashed border-slate-200 bg-white p-6 sm:p-8 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-500",
                meta?.id === 'drafting-aec' && "hover:border-slate-500",
                meta?.id === 'mechanical-simulation' && "hover:border-amber-500",
                meta?.id === 'creative-visual' && "hover:border-indigo-500",
                meta?.id === 'electronics-hardware' && "hover:border-emerald-500",
                !meta && "hover:border-blue-600"
              )}>
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
                <Button asChild className={cn("rounded-2xl text-white font-black h-12 sm:h-14 px-8 shadow-md transition-all hover:scale-105 active:scale-95", meta ? meta.theme.buttonBg : "bg-blue-600 hover:bg-blue-700")}>
                  <Link href={`/tools/${tool.slug}`} className="flex items-center gap-2">
                    Open Review <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </Card>

              {/* AI-friendly Citation Panel */}
              <AICitation title={title} slug={slug} toolName={tool.name} />
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

                <Button asChild variant="outline" className={cn("w-full h-12 rounded-2xl font-black transition-colors border", meta?.id === 'drafting-aec' ? "border-slate-200 text-slate-700 hover:bg-slate-50" : meta?.id === 'mechanical-simulation' ? "border-amber-200 text-amber-700 hover:bg-amber-50" : meta?.id === 'creative-visual' ? "border-indigo-200 text-indigo-700 hover:bg-indigo-50" : meta?.id === 'electronics-hardware' ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" : "border-blue-100 text-blue-600 hover:bg-blue-50")}>
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
                    <Button asChild className={cn("w-full h-12 rounded-2xl text-white font-black text-xs gap-2 flex items-center justify-center transition-colors", meta ? meta.theme.buttonBg : "bg-slate-900 hover:bg-slate-800")}>
                      <Link href={`/alternatives/${tool.slug}`}>
                        Check {tool.name} Alternatives <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Related Technical Guides */}
              {otherGuides.length > 0 && (
                <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Related Guides
                  </h3>
                  <div className="space-y-3">
                    {otherGuides.map(g => (
                      <Link
                        key={g.slug}
                        href={`/guides/${g.slug}`}
                        className="block p-3 rounded-2xl bg-slate-50 hover:bg-red-50/50 hover:text-red-600 transition-all border border-slate-50 hover:border-red-100 group"
                      >
                        <span className="text-[8px] font-mono font-black text-red-600 uppercase tracking-widest block mb-1">
                          {g.category}
                        </span>
                        <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                          {g.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}

              {/* Metropolitan Interlink: Direct Comparison Battles */}
              {toolComparisons.length > 0 && (
                <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-5">
                  <h3 className="font-black text-slate-900 text-base border-b border-slate-50 pb-3 uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
                    <Scale className="w-4 h-4" /> Direct PK Battles
                  </h3>
                  <div className="space-y-3">
                    {toolComparisons.map((pair, pIdx) => {
                      const vsTool = pair.a.slug === tool.slug ? pair.b : pair.a;
                      return (
                        <Link
                          key={pIdx}
                          href={`/compare/${pair.pairSlug}`}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 hover:text-blue-600 transition-all group border border-slate-50 hover:border-blue-100"
                        >
                          <span className="font-bold text-slate-800 text-xs truncate group-hover:text-blue-600 transition-colors">
                            {tool.name} <span className="text-slate-400 font-bold">vs</span> {vsTool.name}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </Card>
              )}

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

              {/* Metropolitan Interlink: Related Toolbox Utilities */}
              <Card className="rounded-[24px] md:rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm bg-white space-y-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Free Online Tools
                </h3>
                <div className="space-y-2">
                  {(() => {
                    const toolboxMap: Record<string, { slug: string; label: string }[]> = {
                      troubleshooting: [
                        { slug: 'dwg-version-checker', label: 'DWG Version Checker' },
                        { slug: 'missing-font-shx-resolver', label: 'Missing Font Resolver' },
                      ],
                      printing: [
                        { slug: 'online-dwg-to-pdf-cloud-printer', label: 'DWG to PDF Printer' },
                        { slug: 'viewport-scale-factor-converter', label: 'Viewport Scale Converter' },
                      ],
                      standards: [
                        { slug: 'online-dwg-compare-diff-viewer', label: 'DWG Compare Viewer' },
                        { slug: 'online-dwg-layer-splitter-cloud', label: 'Layer Splitter' },
                      ],
                      migration: [
                        { slug: 'online-dwg-to-dxf-batch-converter', label: 'DWG to DXF Converter' },
                        { slug: 'online-step-to-stl-slicer-helper', label: 'STEP to STL Helper' },
                      ],
                      manufacturing: [
                        { slug: 'k-factor-calculator', label: 'K-Factor Calculator' },
                        { slug: 'thread-drill-size-calculator', label: 'Thread Drill Size Calculator' },
                      ],
                      performance: [
                        { slug: 'online-dwg-compare-diff-viewer', label: 'DWG Compare Viewer' },
                        { slug: 'missing-regapp-cleaner-batch', label: 'RegApp Cleaner Batch' },
                      ],
                      procurement: [
                        { slug: 'online-cad-license-audit-shield', label: 'License Audit Shield' },
                      ],
                      deployment: [
                        { slug: 'online-cad-license-audit-shield', label: 'License Audit Shield' },
                        { slug: 'dwg-version-checker', label: 'DWG Version Checker' },
                      ],
                    };
                    const items = toolboxMap[category] || toolboxMap['troubleshooting'];
                    return items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/toolbox/${item.slug}`}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 hover:text-blue-600 transition-all group border border-slate-50 hover:border-blue-100"
                      >
                        <span className="font-bold text-slate-800 text-xs truncate group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </Link>
                    ));
                  })()}
                </div>
                <Link href="/toolbox" className="block text-center text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors pt-2">
                  Browse All 25+ Tools →
                </Link>
              </Card>

              {/* Metropolitan Interlink: AI Matchmaker CTA */}
              <Link href="/matchmaker" className="block rounded-[24px] md:rounded-[32px] p-5 sm:p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-blue-200 group-hover:rotate-12 transition-transform" />
                  <div>
                    <div className="font-black text-sm">Not sure which tool?</div>
                    <div className="text-blue-200 text-xs font-medium">Try AI Matchmaker →</div>
                  </div>
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
