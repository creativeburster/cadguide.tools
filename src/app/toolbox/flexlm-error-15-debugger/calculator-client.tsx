'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Copy, Check, AlertTriangle, Terminal, RotateCcw, Download, Server, Info } from 'lucide-react';

function isValidHostname(raw: string): boolean {
  const s = raw.trim();
  return s.length > 0 && s.length <= 253 && /^[A-Za-z0-9.-]+$/.test(s);
}

function parseStrictPort(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isInteger(n) && n >= 1 && n <= 65535 ? n : Number.NaN;
}

function isValidEnvVarName(raw: string): boolean {
  const s = raw.trim();
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(s);
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function FlexlmDebuggerClient() {
  const [serverHost, setServerHost] = useState('license-server.local');
  const [mainPortStr, setMainPortStr] = useState('27000');
  const [daemonPortStr, setDaemonPortStr] = useState('2080');
  const [envVarName, setEnvVarName] = useState('LICENSE_SERVER_SPEC');
  const [copied, setCopied] = useState(false);

  const resetDefaults = () => {
    setServerHost('license-server.local');
    setMainPortStr('27000');
    setDaemonPortStr('2080');
    setEnvVarName('LICENSE_SERVER_SPEC');
    setCopied(false);
  };

  const result = useMemo(() => {
    const hostOk = isValidHostname(serverHost);
    const mainPort = parseStrictPort(mainPortStr);
    const daemonPort = parseStrictPort(daemonPortStr);
    const envOk = isValidEnvVarName(envVarName);

    if (!hostOk || !Number.isFinite(mainPort) || !Number.isFinite(daemonPort) || !envOk) {
      return {
        valid: false as const,
        errorMsg: 'Enter a valid hostname/IP (A-Z, a-z, 0-9, ., -), integer TCP ports (1-65535), and an alphanumeric environment variable name.',
      };
    }

    const host = serverHost.trim();
    const envName = envVarName.trim();

    const script = [
      '# ============================================================',
      '# CADGuide.tools - License Server TCP & DNS Connectivity Audit',
      '# Pure ASCII Windows PowerShell Script (Read-Only Checks)',
      '# ============================================================',
      `$ServerHost = "${host}"`,
      `$MainPort = ${mainPort}`,
      `$DaemonPort = ${daemonPort}`,
      `$EnvVarName = "${envName}"`,
      '',
      'Write-Host "--- Starting License Server Connectivity Check ---" -ForegroundColor Cyan',
      '',
      'Write-Host "[1/3] Resolving hostname: $ServerHost"',
      'try {',
      '    $ips = [System.Net.Dns]::GetHostAddresses($ServerHost) | Select-Object -ExpandProperty IPAddressToString',
      '    Write-Host ("[OK] Resolved IP(s): " + ($ips -join ", ")) -ForegroundColor Green',
      '} catch {',
      '    Write-Warning "[FAIL] DNS lookup failed for $ServerHost. Check DNS or hosts file."',
      '}',
      '',
      'Write-Host "[2/3] Inspecting client environment variable: $EnvVarName"',
      '$machineVal = [System.Environment]::GetEnvironmentVariable($EnvVarName, "Machine")',
      '$userVal = [System.Environment]::GetEnvironmentVariable($EnvVarName, "User")',
      'if ($machineVal) { Write-Host "[OK] Machine $EnvVarName = $machineVal" -ForegroundColor Green }',
      'if ($userVal) { Write-Host "[OK] User $EnvVarName = $userVal" -ForegroundColor Green }',
      'if (-not $machineVal -and -not $userVal) { Write-Host "[INFO] $EnvVarName is not currently set." -ForegroundColor Gray }',
      '',
      'Write-Host "[3/3] Testing TCP ports..."',
      'foreach ($p in @($MainPort, $DaemonPort)) {',
      '    $res = Test-NetConnection -ComputerName $ServerHost -Port $p -WarningAction SilentlyContinue',
      '    if ($res.TcpTestSucceeded) {',
      '        Write-Host "[OK] TCP port $p on $ServerHost is reachable." -ForegroundColor Green',
      '    } else {',
      '        Write-Warning "[FAIL] TCP port $p on $ServerHost is unreachable or blocked by firewall."',
      '    }',
      '}',
      'Write-Host "--- End of Audit ---" -ForegroundColor Cyan',
      '',
    ].join('\n');

    const firewallCmd = [
      `netsh advfirewall firewall add rule name="License Manager Main Port" dir=in action=allow protocol=TCP localport=${mainPort}`,
      `netsh advfirewall firewall add rule name="License Vendor Daemon Port" dir=in action=allow protocol=TCP localport=${daemonPort}`,
    ].join('\n');

    return {
      valid: true as const,
      host,
      mainPort,
      daemonPort,
      envName,
      script,
      firewallCmd,
    };
  }, [serverHost, mainPortStr, daemonPortStr, envVarName]);

  const handleCopyScript = async () => {
    if (!result.valid) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(result.script);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadPs1 = () => {
    if (!result.valid) return;
    const ascii = toSafeAscii(result.script);
    const blob = new Blob([ascii], { type: 'text/plain;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'license-port-connectivity-check.ps1';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {!result.valid && (
        <div
          data-testid="error-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{result.errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Server Target</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label htmlFor="input-host" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              License Server Host / IP
            </label>
            <input
              id="input-host"
              data-testid="input-host"
              type="text"
              value={serverHost}
              onChange={(e) => setServerHost(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="input-main-port" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Primary License Port (1-65535)
            </label>
            <input
              id="input-main-port"
              data-testid="input-main-port"
              type="text"
              value={mainPortStr}
              onChange={(e) => setMainPortStr(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="input-daemon-port" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Vendor Daemon Port (1-65535)
            </label>
            <input
              id="input-daemon-port"
              data-testid="input-daemon-port"
              type="text"
              value={daemonPortStr}
              onChange={(e) => setDaemonPortStr(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="input-envvar" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Client Environment Variable Name
            </label>
            <input
              id="input-envvar"
              data-testid="input-envvar"
              type="text"
              value={envVarName}
              onChange={(e) => setEnvVarName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Generated PowerShell Connectivity Audit</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!result.valid}
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Script'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!result.valid}
                  onClick={handleDownloadPs1}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .ps1
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 font-bold">Target Host</div>
                <div data-testid="result-host" className="font-mono font-black text-slate-900 mt-0.5 truncate">
                  {result.valid ? result.host : '—'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 font-bold">Main TCP Port</div>
                <div data-testid="result-main-port" className="font-mono font-black text-slate-900 mt-0.5">
                  {result.valid ? String(result.mainPort) : '—'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 font-bold">Daemon TCP Port</div>
                <div data-testid="result-daemon-port" className="font-mono font-black text-slate-900 mt-0.5">
                  {result.valid ? String(result.daemonPort) : '—'}
                </div>
              </div>
            </div>

            <pre
              data-testid="result-script"
              className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed"
            >
              {result.valid ? result.script : '—'}
            </pre>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-slate-500" />
                Optional Windows Server Inbound Firewall Rule (Administrator CMD)
              </div>
              <pre data-testid="result-firewall" className="font-mono text-xs text-slate-800 whitespace-pre-wrap">
                {result.valid ? result.firewallCmd : '—'}
              </pre>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
