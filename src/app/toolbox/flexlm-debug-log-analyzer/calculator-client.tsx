'use client';

import { useState, useMemo } from 'react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';
import {
  FileText,
  Upload,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Users,
  Activity,
  ArrowRight,
  TrendingUp,
  Shield,
  HelpCircle,
  Play
} from 'lucide-react';

interface DenialRecord {
  time: string;
  feature: string;
  user: string;
  reason: string;
}

interface UsagePoint {
  time: string;
  count: number;
}

const DEMO_LOG_DATA = `9:01:05 (adskflex) OUT: "87224ACD_2024_0F" designer01@WORKSTATION01
9:02:15 (adskflex) OUT: "87224ACD_2024_0F" designer02@WORKSTATION02
9:05:40 (adskflex) OUT: "86815REVIT_2023_0F" architect01@BIM-DESK01
9:07:11 (adskflex) DENIED: "87224ACD_2024_0F" engineer03@LAPTOP-B (Max seat limit reached)
9:15:33 (adskflex) IN: "87224ACD_2024_0F" designer01@WORKSTATION01
9:20:00 (adskflex) OUT: "87224ACD_2024_0F" designer04@PC-CAD05
9:22:12 (adskflex) DENIED: "87224ACD_2024_0F" designer01@WORKSTATION01 (User not in INCLUDE list)
9:35:10 (adskflex) IN: "87224ACD_2024_0F" designer02@WORKSTATION02
9:42:05 (adskflex) OUT: "86815REVIT_2023_0F" architect02@BIM-DESK02
9:55:18 (adskflex) OUT: "87224ACD_2024_0F" designer03@WORKSTATION03
10:10:44 (adskflex) IN: "86815REVIT_2023_0F" architect01@BIM-DESK01
10:15:22 (adskflex) DENIED: "86815REVIT_2023_0F" engineer04@LAPTOP-C (License expired)
10:30:11 (adskflex) OUT: "87224ACD_2024_0F" designer05@PC-CAD06
11:00:00 (adskflex) IN: "87224ACD_2024_0F" designer04@PC-CAD05`;

export default function FlexlmLogAnalyzerClient() {
  const [logText, setLogText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // File loading handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogText(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogText(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const loadDemoData = () => {
    setFileName('demo_lmgrd_debug.log');
    setLogText(DEMO_LOG_DATA);
  };

  // Parsing Engine
  const analysisResults = useMemo(() => {
    if (!logText) return null;

    const lines = logText.split('\n');
    let outCount = 0;
    let inCount = 0;
    let currentConcurrent = 0;
    let maxConcurrent = 0;

    const denials: DenialRecord[] = [];
    const usageHistory: UsagePoint[] = [];

    // Feature and User usage stats map
    const deniedFeatures: Record<string, number> = {};
    const deniedUsers: Record<string, number> = {};
    const deniedReasons: Record<string, number> = {};
    const activeUserLicenses: Record<string, number> = {};

    // Standard FLEXlm debug log regex patterns
    const outRegex = /(\d{1,2}:\d{2}:\d{2})\s+\(\w+\)\s+OUT:\s+"([^"]+)"\s+(\S+)/i;
    const inRegex = /(\d{1,2}:\d{2}:\d{2})\s+\(\w+\)\s+IN:\s+"([^"]+)"\s+(\S+)/i;
    const deniedRegex = /(\d{1,2}:\d{2}:\d{2})\s+\(\w+\)\s+DENIED:\s+"([^"]+)"\s+(\S+)\s+\((.+)\)/i;

    lines.forEach((line) => {
      // 1. Check OUT event
      const outMatch = line.match(outRegex);
      if (outMatch) {
        outCount++;
        currentConcurrent++;
        if (currentConcurrent > maxConcurrent) {
          maxConcurrent = currentConcurrent;
        }
        usageHistory.push({ time: outMatch[1], count: currentConcurrent });
        activeUserLicenses[outMatch[3]] = (activeUserLicenses[outMatch[3]] || 0) + 1;
        return;
      }

      // 2. Check IN event
      const inMatch = line.match(inRegex);
      if (inMatch) {
        inCount++;
        currentConcurrent = Math.max(0, currentConcurrent - 1);
        usageHistory.push({ time: inMatch[1], count: currentConcurrent });
        if (activeUserLicenses[inMatch[3]]) {
          activeUserLicenses[inMatch[3]] = Math.max(0, activeUserLicenses[inMatch[3]] - 1);
        }
        return;
      }

      // 3. Check DENIED event
      const deniedMatch = line.match(deniedRegex);
      if (deniedMatch) {
        const time = deniedMatch[1];
        const feature = deniedMatch[2];
        const user = deniedMatch[3];
        const reason = deniedMatch[4];

        denials.push({ time, feature, user, reason });
        deniedFeatures[feature] = (deniedFeatures[feature] || 0) + 1;
        deniedUsers[user] = (deniedUsers[user] || 0) + 1;
        deniedReasons[reason] = (deniedReasons[reason] || 0) + 1;
      }
    });

    // Sort stats
    const topDeniedFeatures = Object.entries(deniedFeatures)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topDeniedUsers = Object.entries(deniedUsers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topDeniedReasons = Object.entries(deniedReasons)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      totalLines: lines.length,
      outCount,
      inCount,
      denialCount: denials.length,
      maxConcurrent,
      usageHistory,
      topDeniedFeatures,
      topDeniedUsers,
      topDeniedReasons,
      denialsRecords: denials.slice(0, 10) // Limit to top 10 for table render
    };
  }, [logText]);

  // SVG Chart path calculation
  const usageChartPath = useMemo(() => {
    if (!analysisResults || analysisResults.usageHistory.length === 0) return '';
    
    const history = analysisResults.usageHistory;
    const width = 320;
    const height = 100;
    const paddingLeft = 30;
    const paddingRight = 10;
    const paddingTop = 10;
    const paddingBottom = 20;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxVal = Math.max(5, analysisResults.maxConcurrent + 2);

    let path = `M ${paddingLeft} ${height - paddingBottom}`;

    history.forEach((pt, idx) => {
      const x = paddingLeft + (idx / (history.length - 1)) * chartWidth;
      const y = height - paddingBottom - (pt.count / maxVal) * chartHeight;
      path += ` L ${x} ${y}`;
    });

    return path;
  }, [analysisResults]);

  return (
    <div className="flex flex-col gap-8">
      {/* 离线拖拽与加载面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧: 文件解析卡片 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-white rounded-3xl border-2 border-dashed p-8 shadow-sm flex flex-col items-center justify-center text-center transition-all min-h-[300px] cursor-pointer ${
              isDragging ? 'border-blue-500 bg-blue-50/20 scale-102' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              id="file-upload"
              type="file"
              accept=".log,.txt,.dat"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 animate-pulse">
              <Upload className="w-8 h-8" />
            </div>

            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-slate-800 font-black text-lg block hover:text-blue-600">点击上传或拖拽日志</span>
              <span className="text-xs text-slate-400 font-medium mt-2 block">支持 .log, .txt, .dat 等格式</span>
            </label>

            {fileName && (
              <div className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-bold text-slate-600">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="truncate max-w-[150px]">{fileName}</span>
              </div>
)}

            <button
              onClick={loadDemoData}
              className="mt-6 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-black text-white transition-all cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5 text-blue-400" />
              加载演示日志 (Demo)
            </button>
          </div>

          {/* 隐私安全小贴士 */}
          <div className="bg-emerald-50/50 rounded-3xl border border-emerald-100/60 p-6 flex gap-3 text-emerald-800">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold mb-1">100% 浏览器本地解析 (数据零外流) </p>
              <p>为了保障企业网络架构与员工隐私安全, 本分析器完全基于 HTML5 FileReader 技术. 所有文本的归纳和图标生成均在<b>您本地浏览器沙箱中</b>完成, 不会将您的任何日志内容上传到任何服务器. </p>
            </div>
          </div>
        </div>

        {/* 右侧: 统计分析面板 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {!analysisResults ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center flex-1 min-h-[300px]">
              <HelpCircle className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-slate-800 font-black text-lg">等待日志数据导入...</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-2 leading-relaxed">
                请在左侧上传您的 FLEXlm (`lmgrd`) 服务调试日志文件, 或直接点击'加载演示日志'一键体验离线统计面板. 
              </p>
            </div>
) : (
            <div className="flex flex-col gap-6">
              
              {/* 四个核心大指标面板 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">日志总行数</span>
                  <span className="text-2xl font-black text-slate-800 mt-1 block">{analysisResults.totalLines}</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">最大并发并发数</span>
                  <span className="text-2xl font-black text-blue-600 mt-1 block flex items-center gap-1">
                    {analysisResults.maxConcurrent}
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">借出 (OUT) 次数</span>
                  <span className="text-2xl font-black text-emerald-600 mt-1 block">{analysisResults.outCount}</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">拒绝 (DENIED) 次数</span>
                  <span className="text-2xl font-black text-red-500 mt-1 block flex items-center gap-1">
                    {analysisResults.denialCount}
                    {analysisResults.denialCount > 0 && <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />}
                  </span>
                </div>
              </div>

              {/* 趋势图与 Feature 被拒排行 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SVG 24小时并发趋势图 */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col">
                  <div className="mb-4">
                    <h4 className="text-slate-800 font-black text-sm">并发授权占用趋势图</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Concurrent Active Seats Over Timeline</p>
                  </div>
                  
                  <div className="flex-1 min-h-[140px] bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100">
                    {analysisResults.usageHistory.length > 0 ? (
                      <svg viewBox="0 0 320 100" className="w-full h-auto">
                        {/* Axes */}
                        <line x1="30" y1="10" x2="30" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="30" y1="80" x2="310" y2="80" stroke="#cbd5e1" strokeWidth="1" />

                        {/* Chart Path */}
                        <path d={usageChartPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Labels */}
                        <text x="25" y="15" fill="#94a3b8" fontSize="7" textAnchor="end">{Math.max(5, analysisResults.maxConcurrent + 2)}</text>
                        <text x="25" y="83" fill="#94a3b8" fontSize="7" textAnchor="end">0</text>
                        <text x="310" y="90" fill="#94a3b8" fontSize="7" textAnchor="end">时间轴➔</text>
                      </svg>
) : (
                      <span className="text-xs text-slate-400">无并发点位数据</span>
)}
                  </div>
                </div>

                {/* 被拒最多的 Feature 排行 */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col">
                  <div>
                    <h4 className="text-slate-800 font-black text-sm">被拒最频繁的授权模块 (Feature)</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Top Denied Features Catalog</p>
                  </div>

                  <div className="flex flex-col gap-3 mt-4 flex-1 justify-center">
                    {analysisResults.topDeniedFeatures.length > 0 ? (
                      analysisResults.topDeniedFeatures.map(([feat, num]) => (
                        <div key={feat} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span className="truncate max-w-[160px] font-mono">{feat}</span>
                            <span>{num} 次被拒</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-red-500 h-full rounded-full"
                              style={{ width: `${(num / analysisResults.denialCount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
))
) : (
                      <div className="flex flex-col items-center justify-center py-6 text-slate-400 text-xs gap-1.5">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                        安全! 未检测到任何拒绝借出事件
                      </div>
)}
                  </div>
                </div>

              </div>

              {/* 被拒原因与被拒用户排行榜 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 被拒原因排查 */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <h4 className="text-slate-800 font-black text-sm mb-4">主要被拒绝原因诊断</h4>
                  <div className="flex flex-col gap-3">
                    {analysisResults.topDeniedReasons.map(([reason, count]) => (
                      <div key={reason} className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-amber-900 leading-relaxed">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black font-mono">{reason}</p>
                          <p className="text-[10px] text-amber-700/80 mt-1">共出现 {count} 次 ➔ 推荐: 核对 License 配置文件及选项组设置. </p>
                        </div>
                      </div>
))}
                    {analysisResults.topDeniedReasons.length === 0 && (
                      <span className="text-xs text-slate-400 text-center block py-6">无原因记录</span>
)}
                  </div>
                </div>

                {/* 被拒最多的用户/工作站排行 */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <h4 className="text-slate-800 font-black text-sm mb-4">频繁受阻的用户/工作站 Top 5</h4>
                  <div className="flex flex-col gap-2">
                    {analysisResults.topDeniedUsers.map(([usr, num], idx) => (
                      <div key={usr} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-black text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-mono">{usr}</span>
                        </div>
                        <span className="font-black text-red-500">{num} 次被拒</span>
                      </div>
))}
                    {analysisResults.topDeniedUsers.length === 0 && (
                      <span className="text-xs text-slate-400 text-center block py-6">无用户记录</span>
)}
                  </div>
                </div>

              </div>

              {/* 底部详细日志详情表格 (前10条)  */}
              {analysisResults.denialsRecords.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden">
                  <h4 className="text-slate-800 font-black text-sm mb-4">拒绝日志分析流水 (Denials Log Stream)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                          <th className="py-2.5">时间</th>
                          <th className="py-2.5">特征 (Feature)</th>
                          <th className="py-2.5">用户 @ 工作站</th>
                          <th className="py-2.5">被拒原因</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResults.denialsRecords.map((rec, idx) => (
                          <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/40">
                            <td className="py-3 font-mono text-slate-400">{rec.time}</td>
                            <td className="py-3 font-mono text-slate-800">{rec.feature}</td>
                            <td className="py-3 font-mono">{rec.user}</td>
                            <td className="py-3 text-red-500 font-mono text-[10px]">{rec.reason}</td>
                          </tr>
))}
                      </tbody>
                    </table>
                  </div>
                </div>
)}

            </div>
)}
        </div>

      </div>

      <NewsletterSubscribe />
    </div>
);
}
