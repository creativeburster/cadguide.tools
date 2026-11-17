'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { FileText, Upload, AlertTriangle, CheckCircle, Shield, Play, Download, Copy, Check, RotateCcw } from 'lucide-react';

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

interface FeatureStats {
  feature: string;
  outCount: number;
  inCount: number;
  denialCount: number;
  peakConcurrent: number;
}

const DEMO_LOG_DATA = `9:01:05 (adskflex) OUT: "FEATURE_2D" designer01@WORKSTATION01
9:02:15 (adskflex) OUT: "FEATURE_2D" designer02@WORKSTATION02
9:05:40 (adskflex) OUT: "FEATURE_BIM" architect01@BIM-DESK01
9:07:11 (adskflex) DENIED: "FEATURE_2D" engineer03@LAPTOP-B (Max seat limit reached)
9:15:33 (adskflex) IN: "FEATURE_2D" designer01@WORKSTATION01
9:20:00 (adskflex) OUT: "FEATURE_2D" designer04@PC-CAD05
9:22:12 (adskflex) DENIED: "FEATURE_2D" designer01@WORKSTATION01 (User not in INCLUDE list)
9:35:10 (adskflex) IN: "FEATURE_2D" designer02@WORKSTATION02
9:42:05 (adskflex) OUT: "FEATURE_BIM" architect02@BIM-DESK02
9:55:18 (adskflex) OUT: "FEATURE_2D" designer03@WORKSTATION03
10:10:44 (adskflex) IN: "FEATURE_BIM" architect01@BIM-DESK01
10:15:22 (adskflex) DENIED: "FEATURE_BIM" engineer04@LAPTOP-C (License expired)
10:30:11 (adskflex) OUT: "FEATURE_2D" designer05@PC-CAD06
11:00:00 (adskflex) IN: "FEATURE_2D" designer04@PC-CAD05`;

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function FlexlmLogAnalyzerClient() {
  const [logText, setLogText] = useState(DEMO_LOG_DATA);
  const [fileName, setFileName] = useState<string>('demo_license_debug.log');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogText(typeof event.target?.result === 'string' ? event.target.result : '');
    };
    reader.readAsText(file);
  };

  const loadDemoData = () => {
    setFileName('demo_license_debug.log');
    setLogText(DEMO_LOG_DATA);
    setCopied(false);
  };

  const clearLog = () => {
    setFileName('none');
    setLogText('');
    setCopied(false);
  };

  const analysis = useMemo(() => {
    const trimmed = logText.trim();
    if (!trimmed) return null;

    const lines = logText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    let outCount = 0;
    let inCount = 0;
    let currentConcurrent = 0;
    let maxConcurrent = 0;

    const denials: DenialRecord[] = [];
    const usageHistory: UsagePoint[] = [];
    const featureMap: Record<string, { outCount: number; inCount: number; denialCount: number; current: number; peak: number }> = {};

    const ensureFeat = (f: string) => {
      if (!featureMap[f]) {
        featureMap[f] = { outCount: 0, inCount: 0, denialCount: 0, current: 0, peak: 0 };
      }
      return featureMap[f];
    };

    const outRegex = /(\d{1,2}:\d{2}:\d{2})\s+\([^)]+\)\s+OUT:\s+"([^"]+)"\s+(\S+)/i;
    const inRegex = /(\d{1,2}:\d{2}:\d{2})\s+\([^)]+\)\s+IN:\s+"([^"]+)"\s+(\S+)/i;
    const deniedRegex = /(\d{1,2}:\d{2}:\d{2})\s+\([^)]+\)\s+DENIED:\s+"([^"]+)"\s+(\S+)\s+\((.+)\)/i;

    for (const line of lines) {
      const outMatch = line.match(outRegex);
      if (outMatch) {
        const [, time, feature] = outMatch;
        outCount++;
        currentConcurrent++;
        if (currentConcurrent > maxConcurrent) maxConcurrent = currentConcurrent;
        usageHistory.push({ time, count: currentConcurrent });
        const fm = ensureFeat(feature);
        fm.outCount++;
        fm.current++;
        if (fm.current > fm.peak) fm.peak = fm.current;
        continue;
      }

      const inMatch = line.match(inRegex);
      if (inMatch) {
        const [, time, feature] = inMatch;
        inCount++;
        currentConcurrent = Math.max(0, currentConcurrent - 1);
        usageHistory.push({ time, count: currentConcurrent });
        const fm = ensureFeat(feature);
        fm.inCount++;
        fm.current = Math.max(0, fm.current - 1);
        continue;
      }

      const deniedMatch = line.match(deniedRegex);
      if (deniedMatch) {
        const [, time, feature, user, reason] = deniedMatch;
        denials.push({ time, feature, user, reason });
        const fm = ensureFeat(feature);
        fm.denialCount++;
      }
    }

    const featureStats: FeatureStats[] = Object.entries(featureMap)
      .map(([feature, d]) => ({
        feature,
        outCount: d.outCount,
        inCount: d.inCount,
        denialCount: d.denialCount,
        peakConcurrent: d.peak,
      }))
      .sort((a, b) => b.outCount + b.denialCount - (a.outCount + a.denialCount));

    const totalRequests = outCount + denials.length;
    const denialRatePct = totalRequests > 0 ? (denials.length / totalRequests) * 100 : 0;

    return {
      totalLines: lines.length,
      outCount,
      inCount,
      denialCount: denials.length,
      maxConcurrent,
      denialRatePct,
      usageHistory,
      featureStats,
      denials,
    };
  }, [logText]);

  const usageChartPath = useMemo(() => {
    if (!analysis || analysis.usageHistory.length === 0) return '';
    const history = analysis.usageHistory;
    const paddingLeft = 30;
    const paddingRight = 10;
    const paddingTop = 10;
    const paddingBottom = 20;
    const width = 320;
    const height = 100;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxVal = Math.max(1, analysis.maxConcurrent + 1);

    const coords = history.map((pt, idx) => {
      // Guard denominator when history.length === 1 to prevent division-by-zero NaN
      const frac = history.length === 1 ? 0.5 : idx / (history.length - 1);
      const x = paddingLeft + frac * chartWidth;
      const y = height - paddingBottom - (pt.count / maxVal) * chartHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return history.length === 1
      ? `M ${paddingLeft} ${(height - paddingBottom).toFixed(1)} L ${coords[0]}`
      : `M ${coords.join(' L ')}`;
  }, [analysis]);

  const handleCopy = async () => {
    if (!analysis) return;
    const text = [
      `License Debug Log Audit Summary`,
      `Lines: ${analysis.totalLines}, OUT: ${analysis.outCount}, IN: ${analysis.inCount}, DENIED: ${analysis.denialCount}, Peak Concurrent: ${analysis.maxConcurrent}, Denial Rate: ${analysis.denialRatePct.toFixed(2)}%`,
    ].join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!analysis) return;
    const rows = [
      ['Feature', 'OUT', 'IN', 'DENIED', 'Peak Concurrent'],
      ...analysis.featureStats.map((f) => [
        f.feature,
        String(f.outCount),
        String(f.inCount),
        String(f.denialCount),
        String(f.peakConcurrent),
      ]),
      ['ALL_TOTAL', String(analysis.outCount), String(analysis.inCount), String(analysis.denialCount), String(analysis.maxConcurrent)],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'license-debug-log-summary.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          Client-side log parser: all debug log text is parsed locally in your browser without server uploads.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-black text-slate-900">Log Input ({fileName})</h2>
            <div className="flex gap-1.5">
              <button
                type="button"
                data-testid="btn-demo"
                onClick={loadDemoData}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                <Play className="w-3 h-3" />
                Demo
              </button>
              <button
                type="button"
                data-testid="btn-clear"
                onClick={clearLog}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            </div>
          </div>

          <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Upload .log / .txt file</span>
            <input type="file" accept=".log,.txt,.dat" onChange={handleFileUpload} className="hidden" />
          </label>

          <div>
            <label htmlFor="input-log" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Paste Log Lines
            </label>
            <textarea
              id="input-log"
              data-testid="input-log"
              rows={11}
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              placeholder='Paste lines matching HH:MM:SS (daemon) OUT:/IN:/DENIED: "FEATURE" user@host'
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Parsed Log Summary</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!analysis}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!analysis}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase">Peak Concurrent</div>
                <div className="text-2xl font-black text-blue-900 mt-1">
                  <span data-testid="result-peak">{analysis ? String(analysis.maxConcurrent) : '—'}</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase">OUT Checkouts</div>
                <div className="text-2xl font-black text-emerald-900 mt-1">
                  <span data-testid="result-out">{analysis ? String(analysis.outCount) : '—'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase">IN Checkins</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  <span data-testid="result-in">{analysis ? String(analysis.inCount) : '—'}</span>
                </div>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                <div className="text-xs font-black text-red-600 uppercase">DENIED Events</div>
                <div className="text-2xl font-black text-red-900 mt-1">
                  <span data-testid="result-denied">{analysis ? String(analysis.denialCount) : '—'}</span>
                </div>
              </div>
            </div>

            {analysis && (
              <>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="text-xs font-bold text-slate-600 mb-2">Concurrent Active Sessions Over Log Events</div>
                  {analysis.usageHistory.length > 0 ? (
                    <svg viewBox="0 0 320 100" className="w-full h-28" data-testid="usage-chart">
                      <line x1="30" y1="10" x2="30" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                      <line x1="30" y1="80" x2="310" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                      <path d={usageChartPath} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="25" y="15" fill="#64748b" fontSize="8" textAnchor="end">{Math.max(1, analysis.maxConcurrent + 1)}</text>
                      <text x="25" y="83" fill="#64748b" fontSize="8" textAnchor="end">0</text>
                    </svg>
                  ) : (
                    <p className="text-xs text-slate-500">No OUT/IN timestamp events detected.</p>
                  )}
                </div>

                {analysis.featureStats.length > 0 && (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs" data-testid="feature-table">
                      <thead className="bg-slate-100 text-slate-700 font-black uppercase">
                        <tr>
                          <th className="px-4 py-2">Feature</th>
                          <th className="px-4 py-2 text-right">OUT</th>
                          <th className="px-4 py-2 text-right">IN</th>
                          <th className="px-4 py-2 text-right">DENIED</th>
                          <th className="px-4 py-2 text-right">Feature Peak</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {analysis.featureStats.map((fs) => (
                          <tr key={fs.feature}>
                            <td className="px-4 py-2 font-bold text-slate-800">{fs.feature}</td>
                            <td className="px-4 py-2 text-right">{fs.outCount}</td>
                            <td className="px-4 py-2 text-right">{fs.inCount}</td>
                            <td className="px-4 py-2 text-right text-red-700">{fs.denialCount}</td>
                            <td className="px-4 py-2 text-right font-bold">{fs.peakConcurrent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {analysis.denials.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>No DENIED checkout events detected in the parsed lines.</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-red-50 text-red-900 font-black uppercase">
                        <tr>
                          <th className="px-4 py-2">Time</th>
                          <th className="px-4 py-2">Feature</th>
                          <th className="px-4 py-2">User@Host</th>
                          <th className="px-4 py-2">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {analysis.denials.slice(0, 20).map((rec, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-slate-500">{rec.time}</td>
                            <td className="px-4 py-2 text-slate-900">{rec.feature}</td>
                            <td className="px-4 py-2">{rec.user}</td>
                            <td className="px-4 py-2 text-red-700">{rec.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {!analysis && (
              <div data-testid="empty-notice" className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Paste log lines or click Demo to parse OUT, IN, and DENIED events.</span>
              </div>
            )}
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
