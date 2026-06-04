'use client';

import { useState, useMemo } from 'react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';
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
  { id: 'scenario', name: '场景确认' },
  { id: 'dns', name: 'DNS与网络连通性' },
  { id: 'ports', name: '端口与防火墙' },
  { id: 'env', name: '客户端环境变量' },
  { id: 'server', name: '服务端锁端口配置' }
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

Write-Host "--- 开始诊断 FLEXlm 客户端许可证连接环境 ---" -ForegroundColor Cyan

# 1. 验证主机名解析
Write-Host "[1/4] 正在解析域名/主机 IP: $Server ..."
try {
    $IP = [System.Net.Dns]::GetHostAddresses($Server) | Select-Object -ExpandProperty IPAddressToString -First 1
    Write-Host "✓ 域名解析成功: $Server ➔ $IP" -ForegroundColor Green
} catch {
    Write-Warning "✗ 域名解析失败！无法将 $Server 解析为 IP 地址。请检查 DNS 配置或修改 C:\\Windows\\System32\\drivers\\etc\\hosts 文件。"
}

# 2. 检查环境变量
Write-Host "[2/4] 正在读取系统环境变量 ..."
$EnvVars = @("ADSKFLEX_LICENSE_FILE", "SOLIDW_LICENSE_FILE", "FLEXLM_TIMEOUT")
foreach ($var in $EnvVars) {
    $val = [System.Environment]::GetEnvironmentVariable($var, "Machine")
    if (-not $val) { $val = [System.Environment]::GetEnvironmentVariable($var, "User") }
    if ($val) {
        Write-Host "✓ 发现环境变量 $var = $val" -ForegroundColor Green
    } else {
        Write-Host "i 未配置环境变量 $var" -ForegroundColor Gray
    }
}

# 3. 检查注册表 FLEXlm 缓存
Write-Host "[3/4] 正在读取注册表用户配置缓存 ..."
$RegPath = "HKCU:\\Software\\FLEXlm License Manager"
if (Test-Path $RegPath) {
    Get-ItemProperty -Path $RegPath -ErrorAction SilentlyContinue | Get-Member -MemberType NoteProperty | ForEach-Object {
        $name = $_.Name
        $val = (Get-ItemProperty -Path $RegPath).$name
        Write-Host "✓ 注册表缓存: $name = $val" -ForegroundColor Green
    }
} else {
    Write-Host "i 未检测到注册表 FLEXlm License Manager 配置缓存" -ForegroundColor Gray
}

# 4. TCP 端口握手检测
Write-Host "[4/4] 正在建立 TCP 连接测试 ..."
function Test-Port {
    param($p, $name)
    $tcp = New-Object System.Net.Sockets.TcpClient
    $connect = $tcp.BeginConnect($Server, $p, $null, $null)
    $wait = $connect.AsyncWaitHandle.WaitOne(2000, $false)
    if (-not $wait) {
        $tcp.Close()
        Write-Warning "✗ 端口 $p ($name) 无法连接！超时或被防火墙拦截。"
    } else {
        try {
            $tcp.EndConnect($connect) | Out-Null
            Write-Host "✓ 端口 $p ($name) 连接成功！通路畅通。" -ForegroundColor Green
        } catch {
            Write-Warning "✗ 端口 $p ($name) 连接被拒绝！服务未启动。"
        } finally {
            $tcp.Close()
        }
    }
}

Test-Port $LmgrdPort "lmgrd 主授权服务"
Test-Port $VendorPort "adskflex 厂商授权服务"
Write-Host "--- 诊断结束 ---" -ForegroundColor Cyan
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
      {/* 顶部动态 SVG 网络连通性拓扑面板 */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">网络许可链路拓扑监测</h2>
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
            重置诊断
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
              <text y="35" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">客户端</text>
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
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">本地防火墙</text>
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
              <text y="35" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">企业网络</text>
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
              <text y="32" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">服务器防火墙</text>
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

      {/* 主面板布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左边：多步向导步骤条 (Navigation Step list) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-slate-800 font-black text-base tracking-tight mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              诊断流程进度
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

          {/* 全局变量输入参数卡片 (Global Variable Inputs) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-500" />
              <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">服务器参数设定</h3>
            </div>
            
            {/* Input 1: Server Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="serverAddress" className="text-xs font-black text-slate-500 uppercase">服务器 IP/主机名</label>
              <input
                id="serverAddress"
                type="text"
                value={serverAddress}
                onChange={(e) => setServerAddress(e.target.value)}
                placeholder="例如: license-server"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800"
              />
            </div>

            {/* Input 2: lmgrd Port */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lmgrdPort" className="text-xs font-black text-slate-500 uppercase">lmgrd 主端口</label>
              <input
                id="lmgrdPort"
                type="text"
                value={lmgrdPort}
                onChange={(e) => setLmgrdPort(e.target.value)}
                placeholder="默认: 27000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800"
              />
            </div>

            {/* Input 3: Vendor daemon select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vendorName" className="text-xs font-black text-slate-500 uppercase">厂商插件服务名</label>
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
                <option value="custom">其他/自定义</option>
              </select>
            </div>

            {/* Input 4: Vendor Lock Port */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vendorPort" className="text-xs font-black text-slate-500 uppercase">Vendor 锁定端口</label>
              <input
                id="vendorPort"
                type="text"
                value={vendorPort}
                onChange={(e) => setVendorPort(e.target.value)}
                placeholder="例如: 2080"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* 右边二联：诊断各步详细内容展示 (Detail Wizard Pane) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm min-h-[460px] flex flex-col">
            
            {/* Step 0: 场景确认 */}
            {currentStep === 0 && (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">第一步：选择您的故障场景</h3>
                  <p className="text-sm text-slate-500 mt-1">根据具体故障表现，推荐对应的排查切入点。</p>
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
                    <h4 className="text-slate-800 font-bold text-base">客户端连接报错 (终端电脑)</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      客户端 CAD 启动时卡在“正在检查许可”界面，最终弹出：<br />
                      <span className="font-mono text-red-500 font-black">Error -15: Cannot connect to license server</span><br />
                      或者检测到授权过期挂机。
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-black text-blue-600">
                      开始诊断
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
                    <h4 className="text-slate-800 font-bold text-base">服务端端口变动 (IT管理员)</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      服务端 lmgrd 服务可以正常启动并运行。但客户端总是偶尔报错，需要反复重启服务，且因为 Vendor 插件端口随机变化导致防火墙规则频繁失效。
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-black text-violet-600">
                      锁定服务器端口
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
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">第二步：检测 DNS 域名解析与连通性</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    确保客户端电脑能够识别并翻译您输入的许可证服务器地址（主机名或 IP）。
                  </p>
                </div>

                <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> Windows CMD / PowerShell 诊断指令</span>
                    <button
                      onClick={() => handleCopy(`${psPingCommand}\n${psNslookupCommand}`, 'dnsCmd')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === 'dnsCmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText === 'dnsCmd' ? '已复制' : '复制命令'}
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-slate-200 select-all p-1 bg-slate-950/40 rounded-lg">
                    {`# 1. 验证主机是否在线以及响应延迟
${psPingCommand}

# 2. 验证 DNS 域名解析是否正常，是否返回了正确的服务器 IP
${psNslookupCommand}`}
                  </pre>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-xs font-black text-slate-500 uppercase">选择本地测试结果：</span>
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
                      ✓ Ping 畅通且 IP 正确
                    </button>
                    <button
                      onClick={() => setPingStatus('unknown_host')}
                      className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        pingStatus === 'unknown_host'
                          ? 'border-red-500/40 bg-red-500/10 text-red-800'
                          : 'border-slate-100 bg-slate-50/20 text-slate-700 hover:bg-slate-100/50'
                      }`}
                    >
                      ✗ 提示 "Ping request could not find host..."
                    </button>
                    <button
                      onClick={() => setPingStatus('timeout')}
                      className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        pingStatus === 'timeout'
                          ? 'border-orange-500/40 bg-orange-500/10 text-orange-800'
                          : 'border-slate-100 bg-slate-50/20 text-slate-700 hover:bg-slate-100/50'
                      }`}
                    >
                      ! 请求超时 / 丢包严重
                    </button>
                  </div>
                </div>

                {/* 针对诊断结果的修复指引 */}
                {pingStatus === 'unknown_host' && (
                  <div className="bg-red-50 rounded-2xl border border-red-100 p-5 flex gap-3 text-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold mb-1">域名解析失败（DNS 故障）</p>
                      <p>客户端无法将主机名 <span className="font-mono bg-red-100/80 px-1 rounded font-black">{serverAddress}</span> 翻译为 IP 地址。这属于网络基础错误。</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>请检查服务器名字是否拼写正确。</li>
                        <li><b>临时修复</b>：若您知晓服务器 IP，可在客户端配置环境变量时直接写 IP，例如 <span className="font-mono bg-red-100/80 px-1 rounded font-black">27000@192.168.1.100</span>。</li>
                        <li><b>永久修复</b>：在客户端的 <span className="font-mono bg-red-100/80 px-1 rounded">C:\Windows\System32\drivers\etc\hosts</span> 文件中追加一行：<br />
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
                      <p className="font-bold mb-1">物理链路超时或禁 Ping</p>
                      <p>说明客户端与服务器之间的物理连通有问题，或对方启用了 ICMP 禁 Ping 策略。</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>如果是无线网络，请检查是否处于公司同一个内网/局域网段。</li>
                        <li>通过 VPN 接入时，请验证 VPN 连接是否掉线，以及路由策略是否包含服务器网段。</li>
                        <li>如果确定物理通路没断，且只是禁 Ping，您可以直接点击上面的<b>“Ping 畅通且 IP 正确”</b>强行跳入下一步测试 TCP 端口可达性。</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-4 flex justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-bold cursor-pointer"
                  >
                    上一步
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={pingStatus === 'untested'}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    下一步：诊断端口
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Ports & Firewall */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">第三步：验证 TCP 端口开放与防火墙状态</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    FLEXlm 授权服务包含 **lmgrd 主服务端口**（默认 27000-27009）与 **Vendor 厂商特定端口**（默认随机，在此假定为 {vendorPort}）。如果只开主服务端口而拦截了 Vendor 端口，就会产生 Error -15 连接故障。
                  </p>
                </div>

                {/* PowerShell Command Block */}
                <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> PowerShell 一键 TCP 连接性握手</span>
                    <button
                      onClick={() => handleCopy(`${psPortTest27000}\n${psPortTestVendor}`, 'portTestCmd')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === 'portTestCmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText === 'portTestCmd' ? '已复制' : '复制命令'}
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-slate-200 select-all p-1 bg-slate-950/40 rounded-lg">
                    {`# 1. 探测服务器上的 lmgrd 主服务端口连通状态
${psPortTest27000}

# 2. 探测服务器上的 ${vendorName} 供应商端口连通状态
${psPortTestVendor}`}
                  </pre>
                </div>

                {/* Port Selection Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black text-slate-500 uppercase">lmgrd 端口测试结果 (Port {lmgrdPort})</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPort27000Status('open')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                          port27000Status === 'open'
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800'
                            : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-slate-100/50'
                        }`}
                      >
                        TcpTestSucceeded: True (通)
                      </button>
                      <button
                        onClick={() => setPort27000Status('closed')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                          port27000Status === 'closed'
                            ? 'border-red-500/40 bg-red-500/10 text-red-800'
                            : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-slate-100/50'
                        }`}
                      >
                        False (不通)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black text-slate-500 uppercase">Vendor 端口测试结果 (Port {vendorPort})</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPortVendorStatus('open')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                          portVendorStatus === 'open'
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800'
                            : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-slate-100/50'
                        }`}
                      >
                        TcpTestSucceeded: True (通)
                      </button>
                      <button
                        onClick={() => setPortVendorStatus('closed')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                          portVendorStatus === 'closed'
                            ? 'border-red-500/40 bg-red-500/10 text-red-800'
                            : 'border-slate-100 bg-slate-50/20 text-slate-600 hover:bg-slate-100/50'
                        }`}
                      >
                        False (不通)
                      </button>
                    </div>
                  </div>
                </div>

                {/* 针对端口阻断的解决方案 */}
                {(port27000Status === 'closed' || portVendorStatus === 'closed') && (
                  <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 text-amber-900 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed flex-1">
                      <p className="font-bold mb-1">发现端口被屏蔽！请按以下顺序排查防火墙与服务状态：</p>
                      
                      <ul className="list-decimal list-inside space-y-2 mt-2">
                        <li>
                          <b>检查服务器端的 lmgrd 服务是否启动成功</b>：<br />
                          若服务尚未启动，所有端口状态均为 False。应登录服务器检查 LMTOOLS 里的日志，确认服务状态为 "Server Started"。
                        </li>
                        <li>
                          <b>在服务器防火墙上开放端口（IT 人员在服务器执行）</b>：<br />
                          如果服务已启但依旧不通，说明被 Windows Defender 防火墙入站规则拦截。请在服务器的 PowerShell 中以<b>管理员身份</b>执行以下命令快速放行：
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
                          <b>锁定 Vendor 端口</b>：<br />
                          如果 lmgrd 端口（27000）通了，而 Vendor 端口不通，通常是因为没有在 LIC 文件里锁死 Vendor 端口，导致每次服务重启端口随机漂移。请参考本工具<b>“步骤五”</b>锁定端口。
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
                    上一步
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={port27000Status === 'untested' && portVendorStatus === 'untested'}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    下一步：配置客户端变量
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Client Env Var Fix */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">第四步：检查并修复客户端环境变量与注册表</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    即使网络畅通，如果客户端配置了错误或冲突的旧服务器环境变量，也会报 Error -15。
                  </p>
                </div>

                {/* 客户端诊断脚本 */}
                <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> 客户端一键诊断环境脚本 (PowerShell)</span>
                    <button
                      onClick={() => handleCopy(psClientDiagnosticScript, 'diagScript')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === 'diagScript' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText === 'diagScript' ? '已复制' : '复制脚本'}
                    </button>
                  </div>
                  <div className="max-h-[140px] overflow-y-auto bg-slate-950/40 p-2 rounded-lg text-slate-300 text-[10px]">
                    <pre className="whitespace-pre">{psClientDiagnosticScript}</pre>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">用法：复制整段代码，在客户端电脑上搜索并以“管理员身份”打开 PowerShell，粘贴并回车执行。即可一眼看清所有配错的环境变量和缓存条目。</p>
                </div>

                {/* 写入建议的环境变量 */}
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 text-blue-900">
                  <h4 className="font-bold text-xs mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 修复配置：一键写入环境变量</h4>
                  <p className="text-xs leading-relaxed mb-3">若发现未配置或配错，请在客户端以<b>管理员身份</b>运行以下命令将当前服务器绑定至系统环境变量中（无需重启，即时生效）：</p>
                  
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
                    <li>对于 Autodesk/AutoCAD 系列：环境变量名为 <span className="font-mono bg-blue-100 px-1 rounded">ADSKFLEX_LICENSE_FILE</span></li>
                    <li>对于 SolidWorks：环境变量名通常为 <span className="font-mono bg-blue-100 px-1 rounded">SW_D_LICENSE_FILE</span> 或直接在设置中指定 <span className="font-mono bg-blue-100 px-1 rounded">25734@服务器</span></li>
                    <li>若使用的是非标准主端口，需要带上端口前缀，例如：<span className="font-mono bg-blue-100 px-1 font-bold">@{serverAddress}</span> 或者 <span className="font-mono bg-blue-100 px-1 font-bold">{lmgrdPort}@{serverAddress}</span>。</li>
                  </ul>
                </div>

                <div className="mt-auto pt-4 flex justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-bold cursor-pointer"
                  >
                    上一步
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold cursor-pointer"
                  >
                    下一步：配置许可服务器锁端口
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Server Lock Port Configuration */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-6 flex-1">
                <div>
                  <h3 className="text-slate-800 font-black text-xl tracking-tight">第五步：锁定 FLEXlm License 供应商端口 (Vendor Daemon Port)</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    这是根治 Error -15 的核心办法。如果不显式锁定端口，每次服务器重启后，Vendor 端口均是随机的（比如变到 62890），由于管理员没有在防火墙里开该随机端口，就会再次连接失败。
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 flex flex-col gap-4">
                  <h4 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    LIC 许可证首部生成器
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    打开您服务器上的许可证文件（通常是 `.lic` 或 `.dat` 格式），定位到文件最顶部的几行（通常以 SERVER 和 VENDOR 或 DAEMON 开头），将它们修改替换为下方生成的配置：
                  </p>

                  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>LIC 文件替换头部示例 (建议端口)</span>
                      <button
                        onClick={() => handleCopy(`SERVER ${serverAddress || 'license-server'} ANY ${lmgrdPort || '27000'}\nVENDOR ${vendorName} port=${vendorPort || '2080'}`, 'licHead')}
                        className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedText === 'licHead' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3" />}
                        {copiedText === 'licHead' ? '已复制' : '复制配置'}
                      </button>
                    </div>
                    <pre className="text-emerald-400 select-all p-1 bg-slate-950/40 rounded-lg">
{`SERVER ${serverAddress || 'license-server'} ANY ${lmgrdPort || '27000'}
VENDOR ${vendorName} port=${vendorPort || '2080'}`}
                    </pre>
                  </div>

                  <div className="text-xs leading-relaxed text-slate-600 border-l-2 border-blue-500 pl-3">
                    <p className="font-bold text-slate-800 mb-1">实施步骤：</p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600">
                      <li>停止服务器的 FLEXlm / LMTOOLS 授权服务。</li>
                      <li>编辑修改许可证文件，将前两行替换为上述代码（请注意保持其中的主机名和 MAC 地址与您的旧配置匹配，ANY 可替换为真实 MAC 地址）。</li>
                      <li>在许可证服务器防火墙入站规则中，同时放行 TCP <span className="font-bold text-blue-600 font-mono">{lmgrdPort}</span> 与 <span className="font-bold text-blue-600 font-mono">{vendorPort}</span> 两个端口。</li>
                      <li>在 LMTOOLS 重新加载配置文件 (Re-read License File) 并启动服务。</li>
                    </ol>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-bold cursor-pointer"
                  >
                    上一步
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    完成诊断
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* 底部详细技术文章排错面板，符合 E-E-A-T 工业指南 */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-slate-900 font-black text-xl tracking-tight flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-500" />
            FLEXlm 网络版 -15 报错深度原理与故障排查知识库
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">
            FLEXlm Error -15 In-depth Technical Principles & Solution Hub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-600">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1.5">为什么双端口都会触发 -15 报错？</h3>
              <p>
                很多网络管理员在部署 CAD 浮动服务器时，习惯性只在防火墙中开辟了 `lmgrd.exe` 的服务端口（通常是 27000）。当客户端发起连接时，主进程会回应客户端一个随机选择的 Vendor 供应商进程（例如 `adskflex.exe`）的端口。由于该端口被服务器防火墙阻断，客户端最终产生握手超时，返回 `Error -15: Cannot connect to license server`。因此，锁定 Vendor 端口是保障稳定的首要举措。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1.5">主机名/DNS解析为何是排错的第一关？</h3>
              <p>
                CAD 客户端在启动并查询环境变量（如 `ADSKFLEX_LICENSE_FILE=@my-server`）时，首先调用操作系统的 DNS 解析模块去获得 `my-server` 的内网 IP。如果网络中没有部署 WINS/DNS 服务，或者客户端在宿主 Hosts 中找不到对应的记录，连接就会直接在域名解析阶段中断。若出现此类故障，直接使用 IP 往往是最快的临时替代方案。
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1.5">客户端环境变量优先级原则</h3>
              <p>
                在 Windows 环境下，FLEXlm 读取许可配置遵循特定次序：系统环境变量 (System Environment Variables) ➔ 用户环境变量 (User Environment Variables) ➔ 注册表缓存配置。如果企业用户更换了授权服务器，但客户端残留有以前老旧服务器的注册表配置，CAD 会先尝试连接旧服务进而引发报错。使用 PowerShell 诊断脚本能够完美扫除这类配置死角。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1.5">网络延时与超时机制 (FLEXLM_TIMEOUT)</h3>
              <p>
                如果客户端处于异地办公（远程拨号 VPN）或者无线网络信号不稳定状态，FLEXlm 默认的握手响应超时时间（大约 0.1 秒）可能会过低。可以通过在客户端系统环境变量中新建一个名为 <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-black">FLEXLM_TIMEOUT</span> 的系统变量，值设定为 <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-black">1000000</span>（单位为微秒，即 1.0 秒），能够有效规避由于网络物理延迟引起的 -15 联机失败。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 订阅部分 */}
      <NewsletterSubscribe />
    </div>
  );
}
