'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  ShieldAlert,
  Download,
  RotateCcw,
  Terminal,
  ExternalLink,
  Info,
} from 'lucide-react';

interface PolicyPreset {
  id: string;
  label: string;
  reportErrorVal: '0' | '1';
  blockAdpService: boolean;
  openDesktopAnalyticsDialog: boolean;
  workstationCount: string;
  cadReleaseYear: string;
}

const PRESETS: PolicyPreset[] = [
  {
    id: 'in-app-minimal',
    label: 'Preset 1: In-App Only (Safe for Named-User Licensing)',
    reportErrorVal: '0',
    blockAdpService: false,
    openDesktopAnalyticsDialog: true,
    workstationCount: '25',
    cadReleaseYear: '2025',
  },
  {
    id: 'restricted-firewall',
    label: 'Preset 2: In-App + Block ADPClientService.exe Outbound',
    reportErrorVal: '0',
    blockAdpService: true,
    openDesktopAnalyticsDialog: true,
    workstationCount: '50',
    cadReleaseYear: '2025',
  },
  {
    id: 'restore-defaults',
    label: 'Preset 3: Restore Vendor Defaults (REPORTERROR = 1)',
    reportErrorVal: '1',
    blockAdpService: false,
    openDesktopAnalyticsDialog: false,
    workstationCount: '10',
    cadReleaseYear: '2025',
  },
];

const DEFAULT_ADP_PATH =
  'C:\\Program Files\\Common Files\\Autodesk Shared\\AdpSDK\\bin\\ADPClientService.exe';

const OFFICIAL_DOCS = [
  {
    name: 'Autodesk AutoCAD 2025 Help — REPORTERROR (System Variable)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-509A2E92-C0B6-477C-B1B4-2D66CEB45E13.htm',
    desc: 'Controls whether an error report can be sent to Autodesk if the program closes unexpectedly (0 = disabled, 1 = enabled; saved in Registry).',
  },
  {
    name: 'Autodesk Help — Desktop Analytics & Data Collection and Use Dialog',
    url: 'https://help.autodesk.com/cloudhelp/ENU/Autodesk-Product-Insights-Content/files/adsk_api_faq_why_am_I_not_getting_insights.html',
    desc: 'Documents entering desktopanalytics at the AutoCAD Command prompt to open the Data Collection and Use dialog box.',
  },
  {
    name: 'Microsoft Learn — New-NetFirewallRule & Remove-NetFirewallRule (NetSecurity)',
    url: 'https://learn.microsoft.com/en-us/powershell/module/netsecurity/new-netfirewallrule?view=windowsserver2025-ps',
    desc: 'Official PowerShell NetSecurity syntax for creating and removing outbound program firewall rules on Windows.',
  },
];

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function CloudCadTelemetryBlockerWizardClient() {
  const [reportErrorVal, setReportErrorVal] = useState<'0' | '1'>('0');
  const [blockAdpService, setBlockAdpService] = useState(false);
  const [openDesktopAnalyticsDialog, setOpenDesktopAnalyticsDialog] = useState(true);
  const [adpExePath, setAdpExePath] = useState(DEFAULT_ADP_PATH);
  const [workstationCountStr, setWorkstationCountStr] = useState('25');
  const [cadReleaseYearStr, setCadReleaseYearStr] = useState('2025');

  const applyPreset = (p: PolicyPreset) => {
    setReportErrorVal(p.reportErrorVal);
    setBlockAdpService(p.blockAdpService);
    setOpenDesktopAnalyticsDialog(p.openDesktopAnalyticsDialog);
    setAdpExePath(DEFAULT_ADP_PATH);
    setWorkstationCountStr(p.workstationCount);
    setCadReleaseYearStr(p.cadReleaseYear);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const evaluation = useMemo(() => {
    const seats = parseStrictNumber(workstationCountStr);
    const year = parseStrictNumber(cadReleaseYearStr);

    if (!Number.isFinite(seats) || !Number.isFinite(year)) {
      return {
        valid: false as const,
        error: 'Enter valid finite integers for Target Workstation Count and AutoCAD Release Year.',
      };
    }
    if (!Number.isInteger(seats) || seats < 1 || seats > 100000) {
      return {
        valid: false as const,
        error: 'Target Workstation Count must be an integer between 1 and 100,000.',
      };
    }
    if (!Number.isInteger(year) || year < 2018 || year > 2030) {
      return {
        valid: false as const,
        error: 'AutoCAD Release Year must be an integer between 2018 and 2030.',
      };
    }

    const sanitizedPath = toSafeAscii(adpExePath.trim());
    if (blockAdpService && (!sanitizedPath.toLowerCase().endsWith('adpclientservice.exe') || sanitizedPath.includes('"'))) {
      return {
        valid: false as const,
        error: 'Executable path must end with ADPClientService.exe and must not contain double quotes.',
      };
    }

    const ruleDisplayName = 'CADGuide-Block-Autodesk-ADPClientService';
    const activeRuleCount = (reportErrorVal === '0' ? 1 : 0) + (openDesktopAnalyticsDialog ? 1 : 0) + (blockAdpService ? 1 : 0);

    const scrLines = [
      `; AutoCAD Privacy Configuration Script (.scr) - Target Release ${year} (${seats} seats)`,
      `; Generated locally by CADGuide.tools - Verify in non-production environment before deployment.`,
      `; System Variable REPORTERROR: 0 = Disables error report prompt/submission; 1 = Enables error report.`,
      `REPORTERROR ${reportErrorVal}`,
    ];
    if (openDesktopAnalyticsDialog) {
      scrLines.push(
        `; Opens Data Collection and Use dialog box to clear "I Agree to Data Collection in Desktop Products for Autodesk Analytics Programs"`,
        `desktopanalytics`
      );
    }

    const psLines = [
      `# Windows Defender Firewall Configuration Script (.ps1)`,
      `# Target Fleet: ${seats} workstation(s) | AutoCAD Release: ${year}`,
      `# WARNING: Run in an elevated Administrator PowerShell session at your own risk.`,
      `# Blocking background analytics executables or network endpoints can interfere with`,
      `# Autodesk Named-User subscription sign-in, license verification, and Autodesk My Insights.`,
      `# Note: In 2023 and newer releases, certain required operational telemetry cannot be disabled via UI.`,
      ``,
      `$RuleName = "${ruleDisplayName}"`,
      `$AdpPath = "${sanitizedPath}"`,
      ``,
    ];

    if (blockAdpService) {
      psLines.push(
        `if (Test-Path -LiteralPath $AdpPath) {`,
        `    New-NetFirewallRule -DisplayName $RuleName -Direction Outbound -Program $AdpPath -Action Block`,
        `} else {`,
        `    Write-Warning "ADPClientService.exe not found at: $AdpPath (verify actual install path on workstation)"`,
        `}`,
        ``,
        `# Rollback command (run if license sign-in or My Insights requires restoration):`,
        `# Remove-NetFirewallRule -DisplayName "${ruleDisplayName}"`
      );
    } else {
      psLines.push(
        `# Outbound firewall block is NOT enabled in this profile (in-app configuration only).`,
        `# If a previous rule exists and you want to remove it, run:`,
        `Remove-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue`
      );
    }

    const scrScript = toSafeAscii(scrLines.join('\r\n') + '\r\n');
    const psScript = toSafeAscii(psLines.join('\r\n') + '\r\n');

    return {
      valid: true as const,
      seats,
      year,
      activeRuleCount,
      riskLevel: blockAdpService ? 'MODERATE (TEST NAMED-USER LOGIN)' : 'LOW (IN-APP DOCUMENTED CONTROLS)',
      Mandatory2023Note: year >= 2023,
      scrScript,
      psScript,
    };
  }, [reportErrorVal, blockAdpService, openDesktopAnalyticsDialog, adpExePath, workstationCountStr, cadReleaseYearStr]);

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=us-ascii' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Prominent Risk & Licensing Warning */}
      <div
        data-testid="licensing-risk-warning"
        className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex items-start gap-4"
      >
        <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-sm text-rose-950">
          <h2 className="font-black text-base">
            Administrator Risk & Subscription Licensing Notice
          </h2>
          <p className="leading-relaxed font-medium text-rose-900">
            Blocking outbound CAD processes in Windows Defender Firewall requires local Administrator privileges and{' '}
            <strong>may disrupt Named-User subscription sign-in, license renewal checks, or Autodesk My Insights</strong>.
            In AutoCAD 2023 and newer releases, certain required operational data collection cannot be turned off
            entirely. Never block undocumented domains or licensing services; test any generated script on a single
            non-production workstation first and keep the <code>Remove-NetFirewallRule</code> rollback command handy.
          </p>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Configuration Profiles
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Terminal className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Policy Controls</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="tel-seats" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Workstations
              </label>
              <input
                id="tel-seats"
                data-testid="input-workstations"
                type="text"
                inputMode="numeric"
                value={workstationCountStr}
                onChange={(e) => setWorkstationCountStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label htmlFor="tel-year" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Release Year
              </label>
              <input
                id="tel-year"
                data-testid="input-release-year"
                type="text"
                inputMode="numeric"
                value={cadReleaseYearStr}
                onChange={(e) => setCadReleaseYearStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tel-reporterror" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              AutoCAD REPORTERROR System Variable
            </label>
            <select
              id="tel-reporterror"
              data-testid="select-reporterror"
              value={reportErrorVal}
              onChange={(e) => setReportErrorVal(e.target.value as '0' | '1')}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 cursor-pointer"
            >
              <option value="0">0 — Do not display or send crash error reports</option>
              <option value="1">1 — Default (allow crash error report dialog)</option>
            </select>
          </div>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              data-testid="toggle-desktopanalytics"
              checked={openDesktopAnalyticsDialog}
              onChange={(e) => setOpenDesktopAnalyticsDialog(e.target.checked)}
              className="mt-1 w-4 h-4 accent-blue-600"
            />
            <span className="text-xs font-semibold text-slate-700 leading-relaxed">
              Include <code>desktopanalytics</code> command in AutoCAD <code>.scr</code> to open the{' '}
              <em>Data Collection and Use</em> opt-out dialog
            </span>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              data-testid="toggle-adp-firewall"
              checked={blockAdpService}
              onChange={(e) => setBlockAdpService(e.target.checked)}
              className="mt-1 w-4 h-4 accent-blue-600"
            />
            <span className="text-xs font-semibold text-slate-700 leading-relaxed">
              Generate outbound <code>New-NetFirewallRule</code> block for <code>ADPClientService.exe</code>
            </span>
          </label>

          {blockAdpService && (
            <div>
              <label htmlFor="tel-adp-path" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Local ADPClientService.exe Path
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">
                Verify actual path on target workstation before running PowerShell rule.
              </p>
              <input
                id="tel-adp-path"
                data-testid="input-adp-path"
                type="text"
                value={adpExePath}
                onChange={(e) => setAdpExePath(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800"
              />
            </div>
          )}
        </div>

        <div data-testid="calculator-results" className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Generated Pure-ASCII Scripts & Impact Summary
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  data-testid="download-scr-button"
                  disabled={!evaluation.valid}
                  onClick={() => evaluation.valid && downloadFile(evaluation.scrScript, 'autocad-privacy-config.scr')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .SCR
                </button>
                <button
                  type="button"
                  data-testid="download-ps1-button"
                  disabled={!evaluation.valid}
                  onClick={() => evaluation.valid && downloadFile(evaluation.psScript, 'autocad-adp-firewall.ps1')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .PS1
                </button>
              </div>
            </div>

            {!evaluation.valid && (
              <div
                data-testid="validation-alert"
                className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>{evaluation.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Active Controls</div>
                <div className="text-2xl font-black text-slate-900" data-testid="result-active-controls">
                  {evaluation.valid ? String(evaluation.activeRuleCount) : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Target Fleet</div>
                <div className="text-2xl font-black text-slate-900" data-testid="result-fleet-summary">
                  {evaluation.valid ? `${evaluation.seats} seats (${evaluation.year})` : '—'}
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Licensing Risk</div>
                <div className="text-xs font-black text-blue-950 leading-snug" data-testid="result-risk-level">
                  {evaluation.valid ? evaluation.riskLevel : '—'}
                </div>
              </div>
            </div>

            {evaluation.valid && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    AutoCAD Command Script Preview (autocad-privacy-config.scr)
                  </div>
                  <pre
                    data-testid="preview-scr"
                    className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed"
                  >
                    {evaluation.scrScript}
                  </pre>
                </div>

                <div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Windows PowerShell NetSecurity Preview (autocad-adp-firewall.ps1)
                  </div>
                  <pre
                    data-testid="preview-ps1"
                    className="p-4 rounded-2xl bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto leading-relaxed"
                  >
                    {evaluation.psScript}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-base font-black text-slate-900">
              <Info className="w-5 h-5 text-blue-600" />
              Verified Official Documentation Sources
            </div>
            <div className="space-y-3">
              {OFFICIAL_DOCS.map((doc) => (
                <a
                  key={doc.url}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 font-black text-sm text-slate-900">
                    <span>{doc.name}</span>
                    <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{doc.desc}</p>
                </a>
              ))}
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
