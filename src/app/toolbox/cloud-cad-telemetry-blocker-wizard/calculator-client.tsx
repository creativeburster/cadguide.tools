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
  CheckCircle2,
} from 'lucide-react';

interface PolicyPreset {
  id: string;
  label: string;
  reportErrorVal: '0' | '1';
  blockAdpService: boolean;
  openDesktopAnalyticsDialog: boolean;
  adpPath: string;
  workstationCount: string;
  cadReleaseYear: string;
}

const ADP_PATH_PLACEHOLDER =
  'e.g. %APPDATA%\\Autodesk\\ADPSDK\\bin\\ADPClientService.exe — verify on your workstation';

const PRESETS: PolicyPreset[] = [
  {
    id: 'in-app-minimal',
    label: 'Preset 1: Official In-App & Account Opt-Out Only (Recommended)',
    reportErrorVal: '0',
    blockAdpService: false,
    openDesktopAnalyticsDialog: true,
    adpPath: '',
    workstationCount: '25',
    cadReleaseYear: '2025',
  },
  {
    id: 'restricted-firewall',
    label: 'Preset 2: Unofficial Firewall Template (Requires Local Path Input)',
    reportErrorVal: '0',
    blockAdpService: true,
    openDesktopAnalyticsDialog: true,
    adpPath: '',
    workstationCount: '50',
    cadReleaseYear: '2025',
  },
  {
    id: 'restore-defaults',
    label: 'Preset 3: Restore Vendor Defaults (REPORTERROR = 1)',
    reportErrorVal: '1',
    blockAdpService: false,
    openDesktopAnalyticsDialog: false,
    adpPath: '',
    workstationCount: '10',
    cadReleaseYear: '2025',
  },
];

const OFFICIAL_DOCS = [
  {
    name: 'Autodesk Help — Desktop Analytics & Data Collection and Use Dialog',
    url: 'https://help.autodesk.com/cloudhelp/ENU/Autodesk-Product-Insights-Content/files/adsk_api_faq_why_am_I_not_getting_insights.html',
    desc: 'Official in-product method: click Help > Desktop Analytics (or enter desktopanalytics) or Help > Privacy Settings, and clear "I Agree to Data Collection in Desktop Products for Autodesk Analytics Programs".',
  },
  {
    name: 'Autodesk Help — Manage Product Privacy Settings in Autodesk Account',
    url: 'https://help.autodesk.com/cloudhelp/ENU/Autodesk-Product-Insights-Content/files/adsk_api_faq_what_data_is_being_collected.html',
    desc: 'Official account-level method (2023+ releases): sign in to Autodesk Account (profile.autodesk.com) > My Profile and Settings > Settings > Product Privacy > Edit.',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — REPORTERROR (System Variable)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-509A2E92-C0B6-477C-B1B4-2D66CEB45E13.htm',
    desc: 'Controls whether an error report can be sent to Autodesk if the program closes unexpectedly (0 = disabled, 1 = enabled; saved in Registry).',
  },
  {
    name: 'Microsoft Learn — New-NetFirewallRule & Remove-NetFirewallRule (NetSecurity)',
    url: 'https://learn.microsoft.com/en-us/powershell/module/netsecurity/new-netfirewallrule?view=windowsserver2025-ps',
    desc: 'Official Windows PowerShell NetSecurity cmdlet syntax for creating and removing outbound program firewall rules.',
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
  const [adpExePath, setAdpExePath] = useState('');
  const [workstationCountStr, setWorkstationCountStr] = useState('25');
  const [cadReleaseYearStr, setCadReleaseYearStr] = useState('2025');

  const applyPreset = (p: PolicyPreset) => {
    setReportErrorVal(p.reportErrorVal);
    setBlockAdpService(p.blockAdpService);
    setOpenDesktopAnalyticsDialog(p.openDesktopAnalyticsDialog);
    setAdpExePath(p.adpPath);
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
    if (blockAdpService) {
      if (sanitizedPath === '') {
        return {
          valid: false as const,
          error:
            'Confirm and enter the actual ADPClientService.exe path on your workstation (Autodesk documentation does not specify a fixed path; example path—verify on your machine).',
        };
      }
      if (!sanitizedPath.toLowerCase().endsWith('adpclientservice.exe') || sanitizedPath.includes('"')) {
        return {
          valid: false as const,
          error: 'Executable path must end with ADPClientService.exe and must not contain double quotes.',
        };
      }
    }

    const ruleDisplayName = 'CADGuide-Block-Autodesk-ADPClientService';
    const activeRuleCount =
      (reportErrorVal === '0' ? 1 : 0) + (openDesktopAnalyticsDialog ? 1 : 0) + (blockAdpService ? 1 : 0);

    const scrLines = [
      `; AutoCAD Privacy Configuration Script (.scr) - Target Release ${year} (${seats} seats)`,
      `; Official Autodesk method: manage Product Privacy at https://profile.autodesk.com/ and via in-app Desktop Analytics.`,
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
      `# UNOFFICIAL PRACTICE WARNING: Outbound firewall blocking is NOT an official Autodesk procedure.`,
      `# Run in an elevated Administrator PowerShell session strictly at your own risk.`,
      `# Blocking background processes may interfere with Named-User subscription sign-in,`,
      `# license verification, and Autodesk My Insights.`,
      `# Preferred official opt-out: in-app Desktop Analytics / Privacy Settings, or`,
      `# Autodesk Account (https://profile.autodesk.com/) > Settings > Product Privacy.`,
      ``,
      `$RuleName = "${ruleDisplayName}"`,
    ];

    if (blockAdpService) {
      psLines.push(
        `$AdpPath = [Environment]::ExpandEnvironmentVariables("${sanitizedPath}")`,
        ``,
        `if (Test-Path -LiteralPath $AdpPath) {`,
        `    New-NetFirewallRule -DisplayName $RuleName -Direction Outbound -Program $AdpPath -Action Block`,
        `} else {`,
        `    Write-Warning "ADPClientService.exe not found at: $AdpPath (verify actual path on this workstation)"`,
        `}`,
        ``,
        `# Rollback command (run if license sign-in or My Insights requires restoration):`,
        `# Remove-NetFirewallRule -DisplayName "${ruleDisplayName}"`
      );
    } else {
      psLines.push(
        ``,
        `# Outbound firewall block is NOT enabled in this profile (official in-app & account controls only).`,
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
      riskLevel: blockAdpService
        ? 'UNOFFICIAL FIREWALL RULE (LICENSE CHECK RISK — USE AT OWN RISK)'
        : 'OFFICIAL IN-APP & ACCOUNT CONTROLS (RECOMMENDED)',
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
      {/* Primary Official Opt-Out Methods (First Choice) */}
      <div
        data-testid="official-optout-guide"
        className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex items-start gap-4"
      >
        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-2 text-sm text-emerald-950">
          <h2 className="font-black text-base">
            Preferred Method: Official Autodesk Privacy Controls (Safe for Subscription Licensing)
          </h2>
          <ol className="list-decimal pl-5 space-y-1 font-medium text-emerald-900 leading-relaxed">
            <li>
              <strong>In-Product Desktop Analytics / Privacy Settings:</strong> In AutoCAD, open{' '}
              <code>Help &gt; Desktop Analytics</code> (or enter <code>desktopanalytics</code> at the Command prompt; in
              Revit use <code>Help &gt; Privacy Settings</code>), and clear{' '}
              <em>&quot;I Agree to Data Collection in Desktop Products for Autodesk Analytics Programs&quot;</em> in the{' '}
              <em>Data Collection and Use</em> dialog box. Set <code>REPORTERROR</code> to <code>0</code> to disable
              crash error report prompts.
            </li>
            <li>
              <strong>Autodesk Account Product Privacy (2023+ Releases):</strong> Sign in at{' '}
              <a
                href="https://profile.autodesk.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold"
              >
                profile.autodesk.com
              </a>
              , open <strong>My Profile and Settings &gt; Settings &gt; Product Privacy</strong>, click{' '}
              <strong>Edit</strong>, and save your optional data collection preferences (note: in 2023 and later
              releases, required operational data for service delivery and fraud detection cannot be turned off).
            </li>
          </ol>
        </div>
      </div>

      {/* Prominent Unofficial Firewall Risk Warning */}
      <div
        data-testid="licensing-risk-warning"
        className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex items-start gap-4"
      >
        <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-sm text-rose-950">
          <h2 className="font-black text-base">
            Unofficial Firewall Rule Warning — Licensing Verification Risk (Use at Your Own Risk)
          </h2>
          <p className="leading-relaxed font-medium text-rose-900">
            Blocking <code>ADPClientService.exe</code> via Windows Defender Firewall is{' '}
            <strong>not an official Autodesk procedure</strong>. It requires local Administrator rights and{' '}
            <strong>
              may disrupt Named-User subscription sign-in, license verification, or Autodesk My Insights
            </strong>
            . Use the official in-product and <code>profile.autodesk.com</code> controls above first; if corporate
            network policy still requires an outbound firewall rule, test on a non-production machine at your own risk
            and keep <code>Remove-NetFirewallRule</code> ready for rollback.
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
              Include official <code>desktopanalytics</code> command in AutoCAD <code>.scr</code> to open the{' '}
              <em>Data Collection and Use</em> dialog
            </span>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 cursor-pointer">
            <input
              type="checkbox"
              data-testid="toggle-adp-firewall"
              checked={blockAdpService}
              onChange={(e) => setBlockAdpService(e.target.checked)}
              className="mt-1 w-4 h-4 accent-rose-600"
            />
            <span className="text-xs font-semibold text-rose-950 leading-relaxed">
              <strong>Unofficial option (use at own risk):</strong> Generate outbound{' '}
              <code>New-NetFirewallRule</code> block for <code>ADPClientService.exe</code> (may affect license
              verification)
            </span>
          </label>

          {blockAdpService && (
            <div>
              <label htmlFor="tel-adp-path" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Local ADPClientService.exe Path (Verify on Machine)
              </label>
              <p className="text-[11px] text-slate-500 mb-1.5" data-testid="adp-path-example-note">
                Example path only — please confirm the exact location on your workstation (Autodesk docs do not publish
                a single fixed path; inspect Task Manager &gt; Open file location).
              </p>
              <input
                id="tel-adp-path"
                data-testid="input-adp-path"
                type="text"
                placeholder={ADP_PATH_PLACEHOLDER}
                value={adpExePath}
                onChange={(e) => setAdpExePath(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400"
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
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Method Classification</div>
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
