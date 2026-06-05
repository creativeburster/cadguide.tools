'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  HelpCircle,
  Info,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Activity,
  ArrowRight,
  RefreshCw,
  Server,
  Cpu,
  ShieldAlert,
  Network,
  RotateCcw,
  Layers,
  Lock,
  Code
} from 'lucide-react';

// Steps Definitions
const DIAGNOSTIC_STEPS = [
  { id: 'scenario', name: 'Scene confirmation' },
  { id: 'dns', name: 'DNSwith network connectivity' },
  { id: 'ports', name: 'Ports and Firewalls' },
  { id: 'env', name: 'Client environment variables' },
  { id: 'server', name: 'Server lock port configuration' }
];

export default function FlexlmDebuggerClient() {
  // Wizard States
  const [currentStep, setCurrentStep] = useState(0);
  const [scenario, setScenario] = useState<'client' | 'server'>('client');
  
  // Inputs
  const [serverAddress, setServerAddress] = useState('license-server');
  const [lmgrdPort, setLmgrdPort] = useState('27000');
  const [vendorPort, setVendorPort] = useState('2080');
  const [vendorName, setVendorName] = useState('adskflex'); // adskflex for autoDesk, saltxd for SolidWorks, etc.

  // Diagnostic states
  const [pingStatus, setPingStatus] = useState<'untested' | 'success' | 'unknown_host' | 'timeout'>('untested');
  const [port27000Status, setPort27000Status] = useState<'untested' | 'open' | 'closed'>('untested');
  const [portVendorStatus, setPortVendorStatus] = useState<'untested' | 'open' | 'closed'>('untested');
  const [envStatus, setEnvStatus] = useState<'untested' | 'correct' | 'missing' | 'wrong_port'>('untested');

  // Copy helpers
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Reset diagnostic wizard
  const handleReset = () => {
    setCurrentStep(0);
    setPingStatus('untested');
    setPort27000Status('untested');
    setPortVendorStatus('untested');
    setEnvStatus('untested');
  };

  // Generated PowerShell for Connectivity check (Step 2)
  const psPingCommand = `ping -n 4 ${serverAddress || 'license-server'}`;
  const psNslookupCommand = `nslookup ${serverAddress || 'license-server'}`;

  // Generated PowerShell for Port check (Step 3)
  const psPortTest27000 = `Test-NetConnection -ComputerName "${serverAddress || 'license-server'}" -Port ${lmgrdPort || '27000'}`;
  const psPortTestVendor = `Test-NetConnection -ComputerName "${serverAddress || 'license-server'}" -Port ${vendorPort || '2080'}`;

  // Netsh Server Firewall script generator
  const serverFirewallCmd = `netsh advfirewall firewall add rule name="FLEXlm License Daemon" dir=in action=allow protocol=TCP localport=${lmgrdPort || '27000'}
netsh advfirewall firewall add rule name="FLEXlm Vendor Daemon" dir=in action=allow protocol=TCP localport=${vendorPort || '2080'}`;

  // One-click Client Audit script template (Hardcore utility script)
  const psClientDiagnosticScript = `# ==========================================
# CADGuide.tools FLEXlm License Client Debugger
# ==========================================
$Server = "${serverAddress || 'license-server'}"
$LmgrdPort = ${lmgrdPort || '27000'}
$VendorPort = ${vendorPort || '2080'}

Write-Host "--- Begin diagnosing the FLEXlm client license connection environment ---" -ForegroundColor Cyan

# 1. Verify hostname resolution
Write-Host "[1/4] Resolving domain name/host IP: $Server ..."
try {
    $IP = [System.Net.Dns]::GetHostAddresses($Server) | Select-Object -ExpandProperty IPAddressToString -First 1
    Write-Host "✓ Domain name resolution successful: $Server ➔ $IP" -ForegroundColor Green
} catch {
    Write-Warning "✗ Domain name resolution failed! Unable to resolve $Server Resolves to IP address. Please check DNS configuration or modify C:\\Windows\\System32\\drivers\\etc\\hosts File. "
}

# 2. Check environment variables
Write-Host "[2/4] Reading system environment variables..."
$EnvVars = @("ADSKFLEX_LICENSE_FILE", "SOLIDW_LICENSE_FILE", "FLEXLM_TIMEOUT")
foreach ($var in $EnvVars) {
    $val = [System.Environment]::GetEnvironmentVariable($var, "Machine")
    if (-not $val) { $val = [System.Environment]::GetEnvironmentVariable($var, "User") }
    if ($val) {
        Write-Host "✓ Found environment variable $var = $val" -ForegroundColor Green
    } else {
        Write-Host "i Environment variable $var" -ForegroundColor Gray is not configured
    }
}

# 3. Check the registry FLEXlm cache
Write-Host "[3/4] Reading registry user configuration cache..."
$RegPath = "HKCU:\\Software\\FLEXlm License Manager"
if (Test-Path $RegPath) {
    Get-ItemProperty -Path $RegPath -ErrorAction SilentlyContinue | Get-Member -MemberType NoteProperty | ForEach-Object {
        $name = $_.Name
        $val = (Get-ItemProperty -Path $RegPath).$name
        Write-Host "✓ Registry cache: $name = $val" -ForegroundColor Green
    }
} else {
    Write-Host "i Registry FLEXlm License Manager configuration cache not detected" -ForegroundColor Gray
}

# 4. TCP Port handshake detection
Write-Host "[4/4] Establishing TCP connection test ..."
function Test-Port {
    param($p, $name)
    $tcp = New-Object System.Net.Sockets.TcpClient
    $connect = $tcp.BeginConnect($Server, $p, $null, $null)
    $wait = $connect.AsyncWaitHandle.WaitOne(2000, $false)
    if (-not $wait) {
        $tcp.Close()
        Write-Warning "✗ Port $p ($name) cannot be connected! Timed out or blocked by firewall. "
    } else {
        try {
            $tcp.EndConnect($connect) | Out-Null
            Write-Host "✓ Port $p ($name) connected successfully! The path is clear. " -ForegroundColor Green
        } catch {
            Write-Warning "✗ Connection refused for port $p ($name)! The service is not started. "
        } finally {
            $tcp.Close()
        }
    }
}

Test-Port $LmgrdPort "lmgrd Master Authorization Service"
Test-Port $VendorPort "adskflex Manufacturer Authorization Service"
Write-Host "--- End of diagnosis ---" -ForegroundColor Cyan
`;

  // PowerShell repair command
  const clientRepairCmd = `[Environment]::SetEnvironmentVariable("ADSKFLEX_LICENSE_FILE", "@${serverAddress || 'license-server'}", "Machine")`;

  // Interactive Topology Graph States control
  const nodeStates = useMemo(() => {
    const states = {
      client: 'active', // always active
      dns: 'inactive',
      localFirewall: 'active',
      network: 'inactive',
      serverFirewall: 'inactive',
      lmgrd: 'inactive',
      vendor: 'inactive'
    };

    if (currentStep === 0) {
      return states;
    }

    // Step 1: DNS step
    if (currentStep === 1) {
      states.dns = pingStatus === 'success' ? 'success' : pingStatus === 'untested' ? 'warning' : 'danger';
      states.network = pingStatus === 'success' ? 'active' : 'inactive';
      return states;
    }

    // Step 2 & later
    if (currentStep >= 2) {
      states.dns = 'success';
      states.network = 'success';
      states.serverFirewall = (port27000Status === 'open' && portVendorStatus === 'open') ? 'success' : 
                               (port27000Status === 'closed' || portVendorStatus === 'closed') ? 'danger' : 'warning';
      
      states.lmgrd = port27000Status === 'open' ? 'success' : port27000Status === 'closed' ? 'danger' : 'warning';
      states.vendor = portVendorStatus === 'open' ? 'success' : portVendorStatus === 'closed' ? 'danger' : 'warning';
    }

    return states;
  }, [currentStep, pingStatus, port27000Status, portVendorStatus]);

  return (
    <div className="flex flex-col gap-8">
      {/* Top dynamic SVG network connectivity topology panel */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">Network permission link topology monitoring</h2>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              Network Licensing Link Path Topology
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-300 border border-slate-700/60 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            reset diagnostics
          </button>
        </div>

        {/* SVG Drawing Area */}
        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-8 px-4 relative">
          <svg viewBox="0 0 760 140" className="w-full max-w-[700px] h-auto" aria-label="FLEXlm Network Topology">
            <defs>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Links / Connecting Lines */}
            {/* Link 1: Client -> DNS */}
            <path
              d="M 60 70 L 150 70"
              fill="none"
              stroke={nodeStates.dns === 'danger' ? '#ef4444' : nodeStates.dns === 'success' ? '#10b981' : '#475569'}
              strokeWidth="2"
              strokeDasharray={nodeStates.dns === 'success' ? '6 4' : 'none'}
              className={nodeStates.dns === 'success' ? 'animate-[dash_15s_linear_infinite]' : ''}
              style={{ strokeDashoffset: 1 }}
            />
            {/* Link 2: DNS -> Local FW */}
            <path
              d="M 150 70 L 250 70"
              fill="none"
              stroke={nodeStates.dns === 'success' ? '#10b981' : '#475569'}
              strokeWidth="2"
              strokeDasharray={nodeStates.dns === 'success' ? '6 4' : 'none'}
              className={nodeStates.dns === 'success' ? 'animate-[dash_15s_linear_infinite]' : ''}
            />
            {/* Link 3: Local FW -> Internet/Router */}
            <path
              d="M 250 70 L 350 70"
              fill="none"
              stroke={nodeStates.network === 'success' ? '#10b981' : '#475569'}
              strokeWidth="2"
              strokeDasharray={nodeStates.network === 'success' ? '6 4' : 'none'}
              className={nodeStates.network === 'success' ? 'animate-[dash_15s_linear_infinite]' : ''}
            />
            {/* Link 4: Internet -> Server FW */}
            <path
              d="M 350 70 L 470 70"
              fill="none"
              stroke={nodeStates.serverFirewall === 'success' ? '#10b981' : nodeStates.serverFirewall === 'danger' ? '#ef4444' : '#475569'}
              strokeWidth="2"
              strokeDasharray={nodeStates.serverFirewall === 'success' ? '6 4' : 'none'}
              className={nodeStates.serverFirewall === 'success' ? 'animate-[dash_15s_linear_infinite]' : ''}
            />
            {/* Link 5: Server FW -> lmgrd Daemon */}
            <path
              d="M 470 70 Q 520 40 590 40"
              fill="none"
              stroke={nodeStates.lmgrd === 'success' ? '#10b981' : nodeStates.lmgrd === 'danger' ? '#ef4444' : '#475569'}
              strokeWidth="2"
              strokeDasharray={nodeStates.lmgrd === 'success' ? '6 4' : 'none'}
              className={nodeStates.lmgrd === 'success' ? 'animate-[dash_15s_linear_infinite]' : ''}
            />
            {/* Link 6: Server FW -> Vendor Daemon */}
            <path
              d="M 470 70 Q 520 100 590 100"
              fill="none"
              stroke={nodeStates.vendor === 'success' ? '#10b981' : nodeStates.vendor === 'danger' ? '#ef4444' : '#475569'}
              strokeWidth="2"
              strokeDasharray={nodeStates.vendor === 'success' ? '6 4' : 'none'}
              className={nodeStates.vendor === 'success' ? 'animate-[dash_15s_linear_infinite]' : ''}
            />

            {/* Nodes */}
            {/* Node 1: Client Machine */}
            <g transform="translate(60, 70)">
              <circle r="22" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" />
              <g transform="translate(-10, -10)">
                <Cpu className="w-5 h-5 text-blue-400" />
              </g>
              <text y="35" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">Client</text>
            </g>

            {/* Node 2: DNS Server */}
            <g transform="translate(150, 70)">
              <circle
                r="18"
                fill="#1e293b"
                stroke={nodeStates.dns === 'success' ? '#10b981' : nodeStates.dns === 'danger' ? '#ef4444' : '#64748b'}
                strokeWidth="2"
              />
              <g transform="translate(-8, -8)">
                <Network className={`w-4 h-4 ${nodeStates.dns === 'success' ? 'text-emerald-400' : nodeStates.dns === 'danger' ? 'text-red-400' : 'text-slate-400'}`} />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">DNS/Ping</text>
            </g>

            {/* Node 3: Local Firewall */}
            <g transform="translate(250, 70)">
              <circle r="18" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
              <g transform="translate(-8, -8)">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">Local firewall</text>
            </g>

            {/* Node 4: Network Cloud */}
            <g transform="translate(350, 70)">
              <circle
                r="22"
                fill="#1e293b"
                stroke={nodeStates.network === 'success' ? '#10b981' : '#64748b'}
                strokeWidth="2"
              />
              <g transform="translate(-10, -10)">
                <Activity className={`w-5 h-5 ${nodeStates.network === 'success' ? 'text-emerald-400' : 'text-slate-400'}`} />
              </g>
              <text y="35" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">Enterprise Network</text>
            </g>

            {/* Node 5: Server Firewall */}
            <g transform="translate(470, 70)">
              <circle
                r="18"
                fill="#1e293b"
                stroke={nodeStates.serverFirewall === 'success' ? '#10b981' : nodeStates.serverFirewall === 'danger' ? '#ef4444' : '#64748b'}
                strokeWidth="2"
              />
              <g transform="translate(-8, -8)">
                <ShieldAlert className={`w-4 h-4 ${nodeStates.serverFirewall === 'success' ? 'text-emerald-400' : nodeStates.serverFirewall === 'danger' ? 'text-red-400' : 'text-slate-400'}`} />
              </g>
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">Server firewall</text>
            </g>

            {/* Node 6: lmgrd Daemon (27000) */}
            <g transform="translate(590, 40)">
              <circle
                r="18"
                fill="#1e293b"
                stroke={nodeStates.lmgrd === 'success' ? '#10b981' : nodeStates.lmgrd === 'danger' ? '#ef4444' : '#64748b'}
                strokeWidth="2"
              />
              <g transform="translate(-8, -8)">
                <Server className={`w-4 h-4 ${nodeStates.lmgrd === 'success' ? 'text-emerald-400' : nodeStates.lmgrd === 'danger' ? 'text-red-400' : 'text-slate-400'}`} />
              </g>
              <text x="25" y="4" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="start">
                lmgrd ({lmgrdPort})
              </text>
            </g>

            {/* Node 7: adskflex Vendor Daemon */}
            <g transform="translate(590, 100)">
              <circle
                r="18"
                fill="#1e293b"
                stroke={nodeStates.vendor === 'success' ? '#10b981' : nodeStates.vendor === 'danger' ? '#ef4444' : '#64748b'}
                strokeWidth="2"
              />
              <g transform="translate(-8, -8)">
                <Layers className={`w-4 h-4 ${nodeStates.vendor === 'success' ? 'text-emerald-400' : nodeStates.vendor === 'danger' ? 'text-red-400' : 'text-slate-400'}`} />
              </g>
              <text x="25" y="4" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="start">
                {vendorName} ({vendorPort})
              </text>
            </g>
          </svg>

          {/* SVG Inline Animation Keyframe */}
          <style jsx global>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -100;
              }
            }
          `}</style>
        </div>
      </div>

      {/* Main panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Multi-step wizard step bar (Navigation Step list) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-slate-800 font-black text-base tracking-tight mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Diagnostic process progress
            </h3>
            <div className="flex flex-col gap-2">
              {DIAGNOSTIC_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 font-bold'
                        : isCompleted
                        ? 'bg-emerald-50/40 border-emerald-100 text-emerald-700'
                        : 'bg-white hover:bg-slate-50/50 border-slate-100 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-sm">{step.name}</span>
                    </div>
                    {isCompleted && <Check className="w-4 h-4 text-emerald-600" />}
                    {isActive && <ArrowRight className="w-4 h-4 text-blue-600 animate-pulse" />}
                  </button>
);
              })}
            </div>
          </div>

          {/* Global Variable Inputs */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-500" />
              <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">Server parameter settings</h3>
            </div>
            
            {/* Input 1: Server Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="serverAddress" className="text-xs font-black text-slate-500 uppercase">Server IP/Hostname</label>
              <input
                id="serverAddress"
                type="text"
                value={serverAddress}
                onChange={(e) => setServerAddress(e.target.value)}
                placeholder="For example: license-server"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800"
              />
            </div>

            {/* Input 2: lmgrd Port */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lmgrdPort" className="text-xs font-black text-slate-500 uppercase">lmgrd Main port</label>
              <input
                id="lmgrdPort"
                type="text"
                value={lmgrdPort}
                onChange={(e) => setLmgrdPort(e.target.value)}
                placeholder="Default: 27000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800"
              />
            </div>

            {/* Input 3: Vendor daemon select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vendorName" className="text-xs font-black text-slate-500 uppercase">Vendor plug-in service name</label>
              <select
                id="vendorName"
                value={vendorName}
                onChange={(e) => {
                  setVendorName(e.target.value);
                  if (e.target.value === 'adskflex') setVendorPort('2080');
                  else if (e.target.value === 'swutil') setVendorPort('25735');
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800 bg-white"
              >
                <option value="adskflex">adskflex (Autodesk/AutoCAD)</option>
                <option value="swutil">swutil / saltxd (SolidWorks)</option>
                <option value="ugslmd">ugslmd (Siemens NX)</option>
                <option value="custom">Other/custom</option>
              </select>
            </div>

            {/* Input 4: Vendor Lock Port */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vendorPort" className="text-xs font-black text-slate-500 uppercase">Vendor Lock port</label>
              <input
                id="vendorPort"
                type="text"
                value={vendorPort}
                onChange={(e) => setVendorPort(e.target.value)}
                placeholder="For example: 2080"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Two lines on the right: Detailed content display of each step of diagnosis (Detail Wizard Pane) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm min-h-[460px] flex flex-col">
            
            {/* Step 0: Scene confirmation */}
            {currentStep === 0 && (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">Step 1: Select your failure scenario</h3>
                  <p className="text-sm text-slate-500 mt-1">Recommend corresponding troubleshooting entry points based on specific fault symptoms.. </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
                  <button
                    onClick={() => {
                      setScenario('client');
                      setCurrentStep(1);
                    }}
                    className={`flex flex-col items-start p-6 rounded-2xl border text-left transition-all hover:shadow-md group ${
                      scenario === 'client'
                        ? 'border-blue-500/40 bg-blue-500/5'
                        : 'border-slate-100 bg-slate-50/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h4 className="text-slate-800 font-bold text-base">Client connection error (terminal computer)</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Client CAD stuck on startup"Checking license" interface, Final popup: <br />
                      <span className="font-mono text-red-500 font-black">Error -15: Cannot connect to license server</span><br />
                      Or it is detected that the authorization has expired and hung up. 
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-black text-blue-600">
                      Start diagnosis
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setScenario('server');
                      setCurrentStep(4);
                    }}
                    className={`flex flex-col items-start p-6 rounded-2xl border text-left transition-all hover:shadow-md group ${
                      scenario === 'server'
                        ? 'border-blue-500/40 bg-blue-500/5'
                        : 'border-slate-100 bg-slate-50/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 mb-4 group-hover:scale-110 transition-transform">
                      <Server className="w-5 h-5" />
                    </div>
                    <h4 className="text-slate-800 font-bold text-base">Server port changes (IT administrator)</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      The server-side lmgrd service can start and run normally.. But the client always reports errors occasionally and needs to restart the service repeatedly., And because the Vendor plug-in port changes randomly, the firewall rules frequently fail.. 
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-black text-violet-600">
                      Lock server port
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
)}

            {/* Step 1: DNS & Ping */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">Step 2: Detection DNS Domain Name Resolution and Connectivity</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Make sure that the client computer can recognize and translate the license server address (hostname or IP) . 
                  </p>
                </div>

                <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> Windows CMD / PowerShell Diagnostic commands</span>
                    <button
                      onClick={() => handleCopy(`${psPingCommand}\n${psNslookupCommand}`, 'dnsCmd')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === 'dnsCmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText === 'dnsCmd' ? 'Copied ' : 'Copy command'}
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-slate-200 select-all p-1 bg-slate-950/40 rounded-lg">
                    {`# 1. Verify host is online and response delays
${psPingCommand}

# 2. Verify whether DNS domain name resolution is normal, Is the correct server IP returned?
${psNslookupCommand}`}
                  </pre>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-xs font-black text-slate-500 uppercase">Select local test results: </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setPingStatus('success');
                        setCurrentStep(2); // Next step
                      }}
                      className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        pingStatus === 'success'
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800'
                          : 'border-slate-100 bg-slate-50/20 text-slate-700 hover:bg-slate-100/50'
                      }`}
                    >
                      ✓ Ping Smooth and correct IP
                    </button>
                    <button
                      onClick={() => setPingStatus('unknown_host')}
                      className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        pingStatus === 'unknown_host'
                          ? 'border-red-500/40 bg-red-500/10 text-red-800'
                          : 'border-slate-100 bg-slate-50/20 text-slate-700 hover:bg-slate-100/50'
                      }`}
                    >
                      ✗ Prompt "Ping request could not find host..."
                    </button>
                    <button
                      onClick={() => setPingStatus('timeout')}
                      className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        pingStatus === 'timeout'
                          ? 'border-orange-500/40 bg-orange-500/10 text-orange-800'
                          : 'border-slate-100 bg-slate-50/20 text-slate-700 hover:bg-slate-100/50'
                      }`}
                    >
                      ! Request timeout/serious packet loss
                    </button>
                  </div>
                </div>

                {/* Repair instructions for diagnostic results */}
                {pingStatus === 'unknown_host' && (
                  <div className="bg-red-50 rounded-2xl border border-red-100 p-5 flex gap-3 text-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold mb-1">Domain name resolution failed (DNS failure) </p>
                      <p>The client cannot translate hostname <span className="font-mono bg-red-100/80 px-1 rounded font-black">{serverAddress}</span> to IP Address. This is a network basic error. </p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Please check that the server name is spelled correctly. </li>
                        <li><b>Temporary fix</b>: If you know the server IP, You can directly write the IP when configuring environment variables on the client, for example <span className="font-mono bg-red-100/80 px-1 rounded font-black">27000@192.168.1.100</span>. </li>
                        <li><b>Permanent fix</b>: On the client side <span className="font-mono bg-red-100/80 px-1 rounded">C:\Windows\System32\drivers\etc\hosts</span> Append a line to the file: <br />
                          <span className="font-mono bg-slate-900 text-slate-200 px-2 py-0.5 rounded text-[10px] mt-1 inline-block select-all">192.168.1.100  {serverAddress}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
)}

                {pingStatus === 'timeout' && (
                  <div className="bg-orange-50 rounded-2xl border border-orange-100 p-5 flex gap-3 text-orange-800">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold mb-1">Physical link times out or Ping disabled</p>
                      <p>It means there is a problem with the physical connection between the client and the server, or the other party has enabled ICMP Ban Ping Policy. </p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>If it is a wireless network, please check whether it is on the same intranet of the company/LAN segment. </li>
                        <li>When accessing via VPN, Please verify that the VPN connection is not dropped, And whether the routing policy includes the server network segment. </li>
                        <li>If it is determined that the physical path is not broken and is only disabled Ping, You can directly click on<b>"Ping is smooth and IP Correct"</b>forcibly jump to the next test TCP Port reachability. </li>
                      </ul>
                    </div>
                  </div>
)}

                <div className="mt-auto pt-4 flex justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-bold cursor-pointer"
                  >
                    Previous step
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={pingStatus === 'untested'}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next step: Diagnostic port
                  </button>
                </div>
              </div>
)}

            {/* Step 2: Ports & Firewall */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">Step 3: Verify TCP Port opening and firewall status</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    FLEXlm Authorization service contains **lmgrd main service port** (Default 27000-27009) and **Vendor Vendor specific port** (default random, Here it is assumed to be {vendorPort}). If only the main service port is opened and intercepted Vendor port, will generate Error -15 Connection failure. 
                  </p>
                </div>

                {/* PowerShell Command Block */}
                <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> PowerShell One-click TCP connectivity handshake</span>
                    <button
                      onClick={() => handleCopy(`${psPortTest27000}\n${psPortTestVendor}`, 'portTestCmd')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === 'portTestCmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText === 'portTestCmd' ? 'Copied ' : 'Copy command'}
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-slate-200 select-all p-1 bg-slate-950/40 rounded-lg">
                    {`# 1. Detect the connection status of the lmgrd main service port on the server
${psPortTest27000}

# 2. Detect the ${vendorName} vendor port connectivity status on the server
${psPortTestVendor}`}
                  </pre>
                </div>

                {/* Port Selection Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black text-slate-500 uppercase">lmgrd Port test results (Port {lmgrdPort})</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPort27000Status('open')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                          port27000Status === 'open'
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800'
                            : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-slate-100/50'
                        }`}
                      >
                        TcpTestSucceeded: True (pass)
                      </button>
                      <button
                        onClick={() => setPort27000Status('closed')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                          port27000Status === 'closed'
                            ? 'border-red-500/40 bg-red-500/10 text-red-800'
                            : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-slate-100/50'
                        }`}
                      >
                        False (No way)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black text-slate-500 uppercase">Vendor Port test results (Port {vendorPort})</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPortVendorStatus('open')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                          portVendorStatus === 'open'
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800'
                            : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-slate-100/50'
                        }`}
                      >
                        TcpTestSucceeded: True (pass)
                      </button>
                      <button
                        onClick={() => setPortVendorStatus('closed')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                          portVendorStatus === 'closed'
                            ? 'border-red-500/40 bg-red-500/10 text-red-800'
                            : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-slate-100/50'
                        }`}
                      >
                        False (No way)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Solutions for port blocking */}
                {(port27000Status === 'closed' || portVendorStatus === 'closed') && (
                  <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 text-amber-900 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed flex-1">
                      <p className="font-bold mb-1">The port is found to be blocked! Please check the firewall and service status in the following order: </p>
                      
                      <ul className="list-decimal list-inside space-y-2 mt-2">
                        <li>
                          <b>Check whether the lmgrd service on the server side is started successfully</b>: <br />
                          If the service has not been started, the status of all ports is False. You should log in to the server and check the logs in LMTOOLS, Confirm that the service status is "Server Started". 
                        </li>
                        <li>
                          <b>Open ports on the server firewall (IT staff perform) </b>: <br />
                          If the service is started but still unavailable, it means that Windows Defender Firewall inbound rule interception. Please set the PowerShell China as<b>administrator</b>Execute the following command to quickly release: 
                          <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[10px] mt-2 relative select-all flex justify-between items-start gap-4">
                            <pre className="overflow-x-auto whitespace-pre-wrap flex-1">{serverFirewallCmd}</pre>
                            <button
                              onClick={() => handleCopy(serverFirewallCmd, 'srvFw')}
                              className="text-slate-400 hover:text-white cursor-pointer"
                            >
                              {copiedText === 'srvFw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </li>
                        <li>
                          <b>Lock Vendor Port</b>: <br />
                          If lmgrd port (27000) Passed, and Vendor The port is blocked, usually because there is no LIC The Vendor port is locked in the file, This causes the port to drift randomly every time the service is restarted. Please refer to this tool.<b>"Step Five"</b>Lock the Port. 
                        </li>
                      </ul>
                    </div>
                  </div>
)}

                <div className="mt-auto pt-4 flex justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-bold cursor-pointer"
                  >
                    Previous step
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={port27000Status === 'untested' && portVendorStatus === 'untested'}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next step: Configure client variables
                  </button>
                </div>
              </div>
)}

            {/* Step 3: Client Env Var Fix */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">Step 4: Check and repair client environment variables and registry</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Even if the network is open, if the client is configured with incorrect or conflicting old server environment variables, Error -15 will also be reported. 
                  </p>
                </div>

                {/* Client diagnostic script */}
                <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> Client-side one-click diagnostic environment script (PowerShell)</span>
                    <button
                      onClick={() => handleCopy(psClientDiagnosticScript, 'diagScript')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === 'diagScript' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText === 'diagScript' ? 'Copied ' : 'Copy script'}
                    </button>
                  </div>
                  <div className="max-h-[140px] overflow-y-auto bg-slate-950/40 p-2 rounded-lg text-slate-300 text-[10px]">
                    <pre className="whitespace-pre">{psClientDiagnosticScript}</pre>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Usage: Copy the entire code, Search on the client computer and enter as "administrator""Open PowerShell, paste and press Enter to execute. You can see all misconfigured environment variables and cache entries at a glance. </p>
                </div>

                {/* Write recommended environment variables */}
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 text-blue-900">
                  <h4 className="font-bold text-xs mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Repair configuration: write environment variables with one click</h4>
                  <p className="text-xs leading-relaxed mb-3">If it is found that it is not configured or misconfigured, please use<b>As an administrator</b>run the following command to bind the current server to the system environment variable (No need to restart, effective immediately) : </p>
                  
                  <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[10px] select-all flex justify-between items-start gap-4">
                    <pre className="overflow-x-auto whitespace-pre-wrap flex-1">{clientRepairCmd}</pre>
                    <button
                      onClick={() => handleCopy(clientRepairCmd, 'clRepair')}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedText === 'clRepair' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <ul className="list-disc list-inside text-[10px] text-blue-800/80 mt-3 space-y-1">
                    <li>For Autodesk/AutoCAD series: The environment variable is named <span className="font-mono bg-blue-100 px-1 rounded">ADSKFLEX_LICENSE_FILE</span></li>
                    <li>For SolidWorks: The environment variable name is usually <span className="font-mono bg-blue-100 px-1 rounded">SW_D_LICENSE_FILE</span> Or specify <span className="font-mono bg-blue-100 px-1 rounded">25734@server directly in the settings</span></li>
                    <li>If you are using a non-standard main port, you need to bring the port prefix, For example: <span className="font-mono bg-blue-100 px-1 font-bold">@{serverAddress}</span> or <span className="font-mono bg-blue-100 px-1 font-bold">{lmgrdPort}@{serverAddress}</span>. </li>
                  </ul>
                </div>

                <div className="mt-auto pt-4 flex justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-bold cursor-pointer"
                  >
                    Previous step
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold cursor-pointer"
                  >
                    Next step: Configure the license server lock port
                  </button>
                </div>
              </div>
)}

            {/* Step 4: Server Lock Port Configuration */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">Step 5: Lock FLEXlm License Vendor Daemon Port</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    This is the core method to cure Error -15. If you do not explicitly lock the port, every time the server restarts, Vendor The ports are all randomized (such as changing to 62890) , Because the administrator did not open the random port in the firewall, the connection will fail again.. 
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 flex flex-col gap-4">
                  <h4 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    LIC License header generator
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Open the license file on your server (usually `.lic` or `.dat` format) , Locate the top few lines of the file (usually starting with SERVER and VENDOR or DAEMON at the beginning), modify and replace them with the configuration generated below: 
                  </p>

                  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>LIC File replacement header example (recommended port)</span>
                      <button
                        onClick={() => handleCopy(`SERVER ${serverAddress || 'license-server'} ANY ${lmgrdPort || '27000'}\nVENDOR ${vendorName} port=${vendorPort || '2080'}`, 'licHead')}
                        className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedText === 'licHead' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3" />}
                        {copiedText === 'licHead' ? 'Copied' : 'Copy configuration'}
                      </button>
                    </div>
                    <pre className="text-emerald-400 select-all p-1 bg-slate-950/40 rounded-lg">
{`SERVER ${serverAddress || 'license-server'} ANY ${lmgrdPort || '27000'}
VENDOR ${vendorName} port=${vendorPort || '2080'}`}
                    </pre>
                  </div>

                  <div className="text-xs leading-relaxed text-slate-600 border-l-2 border-blue-500 pl-3">
                    <p className="font-bold text-slate-800 mb-1">Implementation steps: </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600">
                      <li>Stop the server's FLEXlm / LMTOOLS licensing service. </li>
                      <li>Edit and modify the license file and replace the first two lines with the above code (Be careful to keep the hostname and MAC address in it matching your old configuration, ANY Can be replaced with real MAC address) . </li>
                      <li>In the license server firewall inbound rules, also allow TCP <span className="font-bold text-blue-600 font-mono">{lmgrdPort}</span> With <span className="font-bold text-blue-600 font-mono">{vendorPort}</span> two ports. </li>
                      <li>Reload configuration file in LMTOOLS (Re-read License File) and start the service. </li>
                    </ol>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-bold cursor-pointer"
                  >
                    Previous step
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Complete diagnosis
                  </button>
                </div>
              </div>
)}

          </div>
        </div>

      </div>

      {/* Detailed technical article troubleshooting panel at the bottom, consistent with E-E-A-T Industry Guide */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-slate-900 font-black text-xl tracking-tight flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-500" />
            FLEXlm Online version -15 Depth error reporting principles and troubleshooting knowledge base
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">
            FLEXlm Error -15 In-depth Technical Principles & Solution Hub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-600">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1.5">Why do both ports trigger -15 errors?? </h3>
              <p>
                Many network administrators deploy CAD floating servers, I habitually only open the service port of `lmgrd.exe` in the firewall. (Usually 27000). When the client initiates a connection, The main process will respond to the client with a randomly selected Vendor supplier process. (For example, the port of `adskflex.exe`). Because the port is blocked by the server firewall, the client eventually generates a handshake timeout., Returns `Error -15: Cannot connect to license server`. Therefore, Locking the Vendor port is the first step to ensure stability. 
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1.5">Why hostname/DNS resolution is the first step in troubleshooting? </h3>
              <p>
                CAD The client starts up and queries environment variables such as `ADSKFLEX_LICENSE_FILE=@my-server`) When, first call the operating system's DNS Parse the module to obtain the intranet of `my-server` IP. If WINS/DNS services are not deployed on the network, Or the client cannot find the corresponding record in the host Hosts, The connection will be interrupted directly during the domain name resolution stage. If such a failure occurs, Using IP directly is often the fastest temporary alternative. 
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1.5">Client environment variable priority principle</h3>
              <p>
                In Windows environment, FLEXlm Reading the licensing configuration follows a specific order: System environment variables (System Environment Variables) ➔ User Environment Variables ➔ Registry Cache Configuration. If an enterprise user changes the authorization server, but the client still has the registry configuration of the old server, CAD It will first try to connect to the old service and cause an error. Use PowerShell Diagnostic scripts can perfectly eliminate such configuration dead ends. 
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1.5">Network delay and timeout mechanism (FLEXLM_TIMEOUT)</h3>
              <p>
                If the client is working remotely (remote dial-up VPN) Or the wireless network signal is unstable, FLEXlm’s default handshake response timeout (About 0.1 seconds) It may be too low. You can create a new file named <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-black">FLEXLM_TIMEOUT</span> system variable, the value is set to <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-black">1000000</span> (The unit is microseconds, that is 1.0 seconds), can effectively avoid network physical delays caused by -15 Connection failed. 
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription section */}
      <RelatedTools />
    </div>
);
}
