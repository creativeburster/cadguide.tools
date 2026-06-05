'use client';

import { useState, useMemo } from 'react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';
import {
  HelpCircle,
  Info,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  Search,
  Cpu,
  ShieldAlert,
  Terminal,
  Activity,
  ArrowRight,
  Settings2
} from 'lucide-react';

interface ErrorPreset {
  address: string;
  title: string;
  source: string;
  reason: string;
  solution: string;
  command?: string;
  commandDesc?: string;
}

const ERROR_DATABASE: ErrorPreset[] = [
  {
    address: 'e06d7363h',
    title: 'Unhandled Exception e06d7363h (Microsoft C++ Exception)',
    source: 'Visual C++ / .NET Framework',
    reason: '这是 AutoCAD 最常遇到的崩溃. 说明 CAD 主程序在加载外部组件或调用 Windows Runtime 时, 由于本地 Microsoft Visual C++ 依赖库丢失, 损坏, 或者 .NET Framework 版本冲突, 触发了底层 C++ 运行时异常. ',
    solution: '1. 修复或重新安装全套 Microsoft Visual C++ Redistributable (2005到2022版本). \n2. 检查 .NET Framework 4.8 或 3.5 的系统启用状态, 在"启用或关闭 Windows 功能"中勾选. \n3. 安装当前 AutoCAD 的官方安全及 Bug 更新补丁 (Hotfix/Update). ',
    command: 'DISM.exe /Online /Cleanup-Image /RestoreHealth',
    commandDesc: '在 Windows 管理员 CMD 中运行以扫描并修复受损的 Windows 系统依赖组件'
  },
  {
    address: 'c0000005',
    title: 'Access Violation Reading/Writing Location c0000005',
    source: '内存冲突 / 显卡硬件加速',
    reason: '表示 CAD 进程试图读取或写入未分配给它的系统内存地址. 通常由于 DirectX 硬件加速模块在渲染复杂 3D 实体现型时, 与您的核显/独立显卡驱动底层指令发生冲突; 亦或由于本地内存条硬件微小故障, 坏盘坏道引起. ',
    solution: '1. **禁用显卡硬件加速**: 在 CAD 桌面快捷方式右键"属性", 在"目标"输入框末尾加上空格并追加参数 `/nohardware` (见下方复制) . 这能强制让 CAD 绕过显卡直连, 完成紧急启动! \n2. 升级您的显卡驱动程序到最新认证的 Studio 稳定版本, 或切换为 DX11 兼容模式运行. ',
    command: '"C:\\Program Files\\Autodesk\\AutoCAD 2024\\acad.exe" /product ACAD /language "zh-CN" /nohardware',
    commandDesc: '带有 /nohardware 无硬件加速紧急启动标志的 acad 快捷方式参数示例'
  },
  {
    address: 'd3d11.dll',
    title: 'Crash module: d3d11.dll / d3d9.dll',
    source: 'Direct3D 渲染图形引擎',
    reason: 'CAD 在调用 Direct3D 11 或 9 图形 API 时发生崩溃. 常由于笔记本电脑的独显/核显双显卡切换冲突, 或者当前系统使用的 DirectX 组件损坏导致. ',
    solution: '1. 强制在 Windows 显卡面板中将 acad.exe 设置为"高性能" (独立显卡模式) , 避免核显集显智能切换出错. \n2. 下载并安装 DirectX 最终用户运行时安装程序 (DirectX End-User Runtime) 修复环境 DLL. ',
    command: 'setx GSDEVICE "Dx9"',
    commandDesc: '在 CMD 中粘贴此命令设置环境变量, 可强制 CAD 降级回使用 D3D9 经典稳定引擎渲染'
  },
  {
    address: '0x00000000',
    title: 'Unhandled Exception at 0x00000000',
    source: '注册表空指针或图纸损坏',
    reason: '空指针崩溃. 通常由于 AutoCAD 插件 (如天正, 三维插件) 调用了非标准 API, 或者当前的 DWG 图纸存在逻辑几何错误 (如节点坐标溢出, 无限图块关联) , 触发内存零值引用. ',
    solution: '1. **图纸修复**: 在启动 CAD 后, 输入 `RECOVER` 指令选择异常崩溃的 DWG 图纸进行数据库底层重构和自动修复. \n2. 暂时卸载最近安装的所有 CAD 第三方插件与 LSP 工具, 确认是否为插件引起. '
  }
];

export default function FatalErrorWizardClient() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customCode, setCustomCode] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const activeError = useMemo(() => {
    if (customCode.trim()) {
      // Attempt manual search in DB
      const found = ERROR_DATABASE.find(
        (err) =>
          err.address.toLowerCase().includes(customCode.toLowerCase()) ||
          err.title.toLowerCase().includes(customCode.toLowerCase())
);
      if (found) return found;
      
      // Dynamic response for custom search
      return {
        address: customCode,
        title: `自定义检索: ${customCode}`,
        source: '未知模块 / 第三方软件冲突',
        reason: '未在核心数据库中匹配到完全一致的代码. 这通常属于特定非标准图块, 劣质二次开发插件, 或者 Windows 用户配置权限不足 (被安全卫士隔离软件模块) 引起的偶发性非法地址读取. ',
        solution: '1. 以管理员权限运行 AutoCAD (右键选择以管理员身份运行) . \n2. 清空 Windows `%temp%` 目录, 腾出系统缓存. \n3. 使用重置工具生成 Windows bat 清理注册表 (参考 Phase 4 注册表清理器) . '
      };
    }
    return ERROR_DATABASE[selectedIdx];
  }, [selectedIdx, customCode]);

  return (
    <div className="flex flex-col gap-8">
      {/* 顶部模拟 CAD 报错弹窗的 SVG */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">CAD 致命崩溃弹框诊断分析</h2>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              Fatal Error Box Memory Address Decompiler
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black">
            故障反编译引擎
          </div>
        </div>

        {/* SVG Window */}
        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-8 px-4">
          <svg viewBox="0 0 420 180" className="w-full max-w-[420px] h-auto shadow-2xl" aria-label="AutoCAD Fatal Error Window">
            {/* Modal background */}
            <rect width="420" height="180" fill="#f8fafc" rx="8" stroke="#94a3b8" strokeWidth="1" />
            {/* Titlebar */}
            <rect width="420" height="28" fill="#0f172a" rx="8" />
            <rect y="18" width="420" height="10" fill="#0f172a" />
            <text x="12" y="18" fill="#f1f5f9" fontSize="8" fontWeight="bold" fontFamily="sans-serif">AutoCAD 致命错误</text>
            <circle cx="408" cy="14" r="4" fill="#ef4444" />
            
            {/* Error Body */}
            <g transform="translate(18, 45)">
              {/* Red warning sign */}
              <circle cx="20" cy="30" r="16" fill="#ef4444" />
              <text x="20" y="35" fill="white" fontSize="16" fontWeight="black" textAnchor="middle">!</text>

              {/* Error messages */}
              <text x="45" y="16" fill="#0f172a" fontSize="10" fontWeight="black" fontFamily="sans-serif">
                致命错误 (FATAL ERROR)
              </text>
              <text x="45" y="32" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">
                Unhandled Access Violation
              </text>
              <text x="45" y="46" fill="#0284c7" fontSize="8" fontWeight="bold" fontFamily="monospace">
                Reading {activeError.address}
              </text>
              <text x="45" y="60" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                主程序 acad.exe 即将强行终止...
              </text>
            </g>

            {/* Bottom Buttons */}
            <line x1="0" y1="135" x2="420" y2="135" stroke="#e2e8f0" strokeWidth="1" />
            <rect x="290" y="145" width="55" height="22" rx="4" fill="#0284c7" />
            <text x="317" y="158" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">诊断分析</text>
            <rect x="355" y="145" width="50" height="22" rx="4" fill="none" stroke="#94a3b8" strokeWidth="1" />
            <text x="380" y="158" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">确定</text>
          </svg>
        </div>
      </div>

      {/* 主面板布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧: 搜索或选择地址 */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-slate-800 font-black text-base tracking-tight flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" />
              地址反查与定位
            </h3>
            
            {/* Custom Search bar */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="customSearch" className="text-xs font-black text-slate-500 uppercase">搜索特定报错代码</label>
              <input
                id="customSearch"
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="例如输入: c0000005"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800"
              />
            </div>

            <div className="border-t border-slate-100 my-2"></div>

            {/* Standard List Selection */}
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">核心崩溃地址预设</span>
            <div className="flex flex-col gap-2">
              {ERROR_DATABASE.map((err, idx) => {
                const isActive = idx === selectedIdx && !customCode;
                return (
                  <button
                    key={err.address}
                    onClick={() => {
                      setCustomCode('');
                      setSelectedIdx(idx);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-red-500/10 border-red-500/20 text-red-700 font-bold'
                        : 'bg-white hover:bg-slate-50/50 border-slate-100 text-slate-500'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black font-mono">{err.address}</span>
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{err.title}</span>
                    </div>
                    {isActive && <ArrowRight className="w-4 h-4 text-red-600 animate-pulse" />}
                  </button>
);
              })}
            </div>
          </div>
        </div>

        {/* 右侧二联: 修复建议与代码生成 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between min-h-[420px]">
            
            {/* 诊断报告正文 */}
            <div className="flex flex-col gap-5">
              <div>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-600">
                  冲突模块: {activeError.source}
                </span>
                <h3 className="text-slate-900 font-black text-xl tracking-tight mt-2">
                  {activeError.title}
                </h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/80 text-xs text-slate-600 leading-relaxed">
                <p className="font-black text-slate-800 mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  异常成因解密: 
                </p>
                <p>{activeError.reason}</p>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed flex flex-col gap-2">
                <p className="font-black text-slate-800 flex items-center gap-1">
                  <Settings2 className="w-4 h-4 text-blue-500" />
                  Tailored 解决方案: 
                </p>
                <div className="whitespace-pre-line pl-1 space-y-1">{activeError.solution}</div>
              </div>
            </div>

            {/* CMD/PowerShell 修复代码框 */}
            {activeError.command && (
              <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4 mt-6">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>{activeError.commandDesc}</span>
                  <button
                    onClick={() => handleCopy(activeError.command!, 'errCmd')}
                    className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedText === 'errCmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText === 'errCmd' ? '已复制' : '复制命令'}
                  </button>
                </div>
                <pre className="overflow-x-auto text-emerald-400 select-all p-1 bg-slate-950/40 rounded-lg max-h-[100px] text-[10px]">
                  {activeError.command}
                </pre>
              </div>
)}

          </div>
        </div>

      </div>

      <NewsletterSubscribe />
    </div>
);
}
