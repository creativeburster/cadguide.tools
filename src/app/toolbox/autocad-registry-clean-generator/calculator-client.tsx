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
  FileCode,
  Download,
  Terminal,
  Activity,
  ArrowRight,
  ShieldCheck,
  Settings
} from 'lucide-react';

const CAD_VERSIONS = [
  { label: 'AutoCAD 2027', regKey: 'R25.2', folderKey: 'AutoCAD 2027' },
  { label: 'AutoCAD 2026', regKey: 'R25.1', folderKey: 'AutoCAD 2026' },
  { label: 'AutoCAD 2025', regKey: 'R25.0', folderKey: 'AutoCAD 2025' },
  { label: 'AutoCAD 2024', regKey: 'R24.3', folderKey: 'AutoCAD 2024' },
  { label: 'AutoCAD 2023', regKey: 'R24.2', folderKey: 'AutoCAD 2023' },
  { label: 'AutoCAD 2022', regKey: 'R24.1', folderKey: 'AutoCAD 2022' },
  { label: 'AutoCAD 2021', regKey: 'R24.0', folderKey: 'AutoCAD 2021' },
  { label: 'AutoCAD 2020', regKey: 'R23.1', folderKey: 'AutoCAD 2020' },
];

export default function RegistryCleanClient() {
  const [versionIdx, setVersionIdx] = useState(3); // Default 2024
  const [cleanHkcu, setCleanHkcu] = useState(true);
  const [cleanHklm, setCleanHklm] = useState(false);
  const [cleanAppData, setCleanAppData] = useState(true);
  const [cleanFlexlm, setCleanFlexlm] = useState(false);
  const [cleanTemp, setCleanTemp] = useState(true);
  
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const activeVer = CAD_VERSIONS[versionIdx];

  // Batch command script compiler
  const generatedBatchScript = useMemo(() => {
    let script = `@echo off
chcp 65001 > nul
echo ===================================================
echo   CADGuide.tools AutoCAD Clean Registry Reset Utility
echo   本脚本将备份并清理 ${activeVer.label} 的配置残留
echo ===================================================
echo.
echo [警告] 请在运行前关闭所有正在运行的 AutoCAD 进程！
pause
echo.

:: 创建备份文件夹
set "BACKUP_DIR=%USERPROFILE%\\Desktop\\CAD_Registry_Backup"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
echo ✓ 已在桌面创建备份文件夹: %BACKUP_DIR%
echo.

`;

    // HKCU registry reset
    if (cleanHkcu) {
      script += `:: 1. 备份并清理 HKCU 注册表配置
echo 正在备份 HKCU 注册表配置...
reg export "HKCU\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" "%BACKUP_DIR%\\HKCU_AutoCAD_${activeVer.regKey}_Backup.reg" /y > nul
echo 正在删除 HKCU 注册表配置...
reg delete "HKCU\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" /f > nul
echo ✓ HKCU 注册表清理完成。
echo.
`;
    }

    // HKLM registry reset
    if (cleanHklm) {
      script += `:: 2. 备份并清理 HKLM 注册表系统环境
echo 正在备份 HKLM 注册表配置（需要管理员权限）...
reg export "HKLM\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" "%BACKUP_DIR%\\HKLM_AutoCAD_${activeVer.regKey}_Backup.reg" /y > nul
echo 正在删除 HKLM 注册表配置...
reg delete "HKLM\\Software\\Autodesk\\AutoCAD\\${activeVer.regKey}" /f > nul
echo ✓ HKLM 注册表清理完成。
echo.
`;
    }

    // Local files and AppData
    if (cleanAppData) {
      script += `:: 3. 清理用户 AppData 漫游与本地缓存文件夹
echo 正在清理 AppData 缓存目录...
if exist "%APPDATA%\\Autodesk\\${activeVer.folderKey}" (
    rmdir /s /q "%APPDATA%\\Autodesk\\${activeVer.folderKey}"
    echo ✓ 已删除 Roaming AppData 中的 ${activeVer.folderKey} 文件夹
)
if exist "%LOCALAPPDATA%\\Autodesk\\${activeVer.folderKey}" (
    rmdir /s /q "%LOCALAPPDATA%\\Autodesk\\${activeVer.folderKey}"
    echo ✓ 已删除 Local AppData 中的 ${activeVer.folderKey} 文件夹
)
echo.
`;
    }

    // FLEXlm activation local files
    if (cleanFlexlm) {
      script += `:: 4. 清理 FLEXlm 授权服务本地缓存 (注意：此步将清除激活状态，需重新注册)
echo 正在备份并移除 FLEXlm 激活状态特征文件...
set "FLEX_DIR=%ProgramData%\\FLEXnet"
if exist "%FLEX_DIR%" (
    copy "%FLEX_DIR%\\adskflex*" "%BACKUP_DIR%\\" > nul
    del /f /q "%FLEX_DIR%\\adskflex*"
    echo ✓ 已安全移除 FLEXnet 目录下的 adsk 激活特征文件
)
echo.
`;
    }

    // Temp folder clean
    if (cleanTemp) {
      script += `:: 5. 清理 Windows 临时垃圾缓存
echo 正在清空系统临时 Temp 目录...
del /s /f /q "%TEMP%\\*.*" > nul
echo ✓ 临时系统垃圾清理完毕。
echo.
`;
    }

    script += `echo ===================================================
echo ✓ 恭喜！AutoCAD ${activeVer.label} 注册表配置及缓存已全部重置完毕。
echo 备份的旧配置已存放在桌面: %BACKUP_DIR% 文件夹下。
echo 若想还原，双击对应的 .reg 注册表备份文件导入即可。
echo ===================================================
pause`;

    return script;
  }, [activeVer, cleanHkcu, cleanHklm, cleanAppData, cleanFlexlm, cleanTemp]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Download .bat file directly on client
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
      {/* 顶部模拟 Windows CMD 命令运行终端的 SVG */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">Windows 部署控制台仿真</h2>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              CMD Batch Reset Execution Simulation
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black">
            BAT 脚本编译器
          </div>
        </div>

        {/* SVG Terminal */}
        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-6 px-4">
          <svg viewBox="0 0 450 180" className="w-full max-w-[420px] h-auto shadow-2xl" aria-label="CMD Terminal Reset screen">
            <rect width="450" height="180" fill="#0c111d" rx="8" stroke="#1f2937" strokeWidth="1.5" />
            
            {/* Titlebar tabs */}
            <rect width="450" height="24" fill="#1e293b" rx="8" />
            <rect y="16" width="450" height="8" fill="#1e293b" />
            <circle cx="15" cy="12" r="3.5" fill="#ef4444" />
            <circle cx="27" cy="12" r="3.5" fill="#f59e0b" />
            <circle cx="39" cy="12" r="3.5" fill="#10b981" />
            <text x="225" y="15" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Command Prompt - reset_autocad.bat
            </text>

            {/* Simulated CMD logs */}
            <g transform="translate(15, 45)" fill="#10b981" fontSize="7" fontWeight="bold" fontFamily="monospace">
              <text y="10" fill="#94a3b8">Microsoft Windows [Version 10.0.22631]</text>
              <text y="24" fill="#38bdf8">C:\Users\Administrator&gt; reset_autocad.bat</text>
              
              <text y="42" fill="#e2e8f0">正在备份并删除 {activeVer.label} 注册表配置...</text>
              <text y="54" fill="#fbbf24">reg export "HKCU\\Software\\Autodesk\\AutoCAD\\{activeVer.regKey}" backup.reg</text>
              
              {cleanAppData && (
                <text y="68" fill="#10b981">✓ 已删除: AppData\\Autodesk\\{activeVer.folderKey} 缓存文件夹</text>
              )}
              {cleanFlexlm && (
                <text y="82" fill="#f43f5e">⚠ 警告: 正在清空 C:\\ProgramData\\FLEXnet 授权缓存...</text>
              )}
              
              <text y="98" fill="#38bdf8">✓ 脚本重置执行完毕。按任意键继续退出...</text>
              <text y="112" fill="#a7f3d0">C:\Users\Administrator&gt; _</text>
            </g>
          </svg>
        </div>
      </div>

      {/* 主面板布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧：可视化配置参数面板 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-slate-800 font-black text-base tracking-tight flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-500" />
              自定义重置配置
            </h3>
            
            {/* Version Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cadVersion" className="text-xs font-black text-slate-500 uppercase">目标 CAD 软件版本</label>
              <select
                id="cadVersion"
                value={versionIdx}
                onChange={(e) => setVersionIdx(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800 bg-white"
              >
                {CAD_VERSIONS.map((ver, idx) => (
                  <option key={ver.label} value={idx}>{ver.label}</option>
                ))}
              </select>
            </div>

            <div className="border-t border-slate-100 my-1"></div>

            {/* Checkbox Options */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">选择重置清理范围</span>

              {/* Option 1: HKCU */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanHkcu}
                  onChange={(e) => setCleanHkcu(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">用户个性化配置注册表 (HKCU)</span>
                  <span className="text-slate-400">重置布局、窗口尺寸、自定义快捷键等用户设定。</span>
                </div>
              </label>

              {/* Option 2: HKLM */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanHklm}
                  onChange={(e) => setCleanHklm(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">系统全局环境注册表 (HKLM)</span>
                  <span className="text-slate-400">清理安装路径残留。注意：执行此脚本需管理员身份。</span>
                </div>
              </label>

              {/* Option 3: AppData */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanAppData}
                  onChange={(e) => setCleanAppData(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">本地配置缓存文件夹 (AppData)</span>
                  <span className="text-slate-400">清理 Roaming 和 Local 目录中损坏的 CAD 用户缓存文件夹。</span>
                </div>
              </label>

              {/* Option 4: FLEXlm activations */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanFlexlm}
                  onChange={(e) => setCleanFlexlm(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-red-500 block">FLEXnet 许可激活缓存 (重置许可)</span>
                  <span className="text-slate-400">当遇到“许可证验证失败”重装依旧提示激活错误时勾选，清除本地许可锁。</span>
                </div>
              </label>

              {/* Option 5: Temp */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanTemp}
                  onChange={(e) => setCleanTemp(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">Windows 系统 Temp 临时目录</span>
                  <span className="text-slate-400">清理 CAD 运行中遗留的未自动擦除的多余 `.tmp` 临时文件。</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 右侧二联：生成代码块与使用手册 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between min-h-[460px]">
            
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-slate-900 font-black text-xl tracking-tight">重置脚本代码查看与生成</h3>
                <p className="text-xs text-slate-400 mt-1">
                  自动拼装完成的安全批处理命令，可在 Windows 下双击或静默执行。
                </p>
              </div>

              {/* Batch Code viewer */}
              <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><FileCode className="w-3.5 h-3.5" /> reset_autocad.bat 源代码</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCopy(generatedBatchScript, 'batCode')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedText === 'batCode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText === 'batCode' ? '已复制' : '复制命令'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      下载 .bat 文件
                    </button>
                  </div>
                </div>
                <div className="max-h-[160px] overflow-y-auto bg-slate-950/40 p-2 rounded-lg text-slate-300 text-[10px]">
                  <pre className="whitespace-pre">{generatedBatchScript}</pre>
                </div>
              </div>

              {/* 使用安全警示手册 */}
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 flex gap-3 text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-black text-slate-800 mb-1">使用安全规范守则：</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-slate-600 font-medium">
                    <li><b>安全备份第一</b>：本脚本在开始清理前，会在您的桌面生成名为 <span className="font-mono bg-amber-100 px-1 rounded font-black">CAD_Registry_Backup</span> 的文件夹，将旧注册表项完整导出备份。如需恢复配置，只需双击该文件夹内的 `.reg` 文件重新写入即可。</li>
                    <li>若您勾选了<b>“系统全局 HKLM”</b>或<b>“FLEXnet”</b>选项，运行时必须<b>“右键 {'->'} 以管理员身份运行”</b>该 `.bat` 文件，否则 Windows 防火墙及注册表防御机制会拒绝删除请求导致失效。</li>
                    <li>运行前请务必确认已经将 AutoCAD 软件彻底关闭，否则可能导致正在占用的注册表项损坏。</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <NewsletterSubscribe />
    </div>
  );
}
