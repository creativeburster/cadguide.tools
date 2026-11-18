'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  UploadCloud,
} from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';
import { parseDxf, parseGcode } from '@/lib/cad-file-analysis';
import { getSampleBracketDxf, compileDxfToGcode } from '@/lib/open-source-cad-engines';

const DEFAULT_GCODE = (() => {
  const doc = parseDxf(getSampleBracketDxf());
  if (!doc) return 'G21\nG90\nG0 X0 Y0 Z5\nG1 X100 Y0 Z-2 F1200\nM30';
  return compileDxfToGcode(doc, {
    mode: 'mill',
    feedRate: 1500,
    plungeRate: 400,
    spindleOrLaserPower: 12000,
    safeZ: 5,
    cutDepth: -3.0,
    stepDown: 1.5,
  }).gcode;
})();

const SQUARE_TOOLPATH_GCODE = [
  'G21',
  'G90',
  'G0 X0 Y0 Z5',
  'G1 X100 Y0 F600',
  'G1 X100 Y50 F600',
  'G1 X0 Y50 F600',
  'G1 X0 Y0 F600',
  'M30',
].join('\n');

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function OnlineGcodeViewerSimulatorClient() {
  const [gcodeText, setGcodeText] = useState<string>(DEFAULT_GCODE);
  const [stepProgress, setStepProgress] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'iso3d' | 'xy2d'>('iso3d');
  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => {
    if (!gcodeText.trim()) {
      return { valid: false as const, error: 'G-Code / NC program text cannot be empty.' };
    }
    const parsed = parseGcode(gcodeText);
    if (parsed.moves.length === 0) {
      return {
        valid: false as const,
        error: 'No valid G0/G1/G2/G3 motion commands with X/Y/Z coordinates found in the program.',
      };
    }

    let rapidLen = 0;
    let cutLen = 0;
    for (const m of parsed.moves) {
      // 2D/3D segment lengths can be read directly from parsed moves in XY or full stats, so extract exact totals:
      void m;
    }
    const cutStat = parsed.stats.find((s) => s.label === 'Feed (cutting) length')?.value || '0 mm';
    const rapidStat = parsed.stats.find((s) => s.label === 'Rapid length')?.value || '0 mm';
    const maxFeedStat = parsed.stats.find((s) => s.label === 'Max feed F')?.value || '0';
    cutLen = parseFloat(cutStat) || 0;
    rapidLen = parseFloat(rapidStat) || 0;
    const maxFeed = parseFloat(maxFeedStat) || 0;
    const estCutMinutes = maxFeed > 0 ? cutLen / maxFeed : 0;

    return {
      valid: true as const,
      parsed,
      cutLen,
      rapidLen,
      maxFeed,
      estCutMinutes,
      cleanStats: parsed.stats.map((s) => ({
        label: s.label,
        value: s.value === '\u2014' ? 'None' : s.value,
      })),
    };
  }, [gcodeText]);

  const visibleMoves = useMemo(() => {
    if (!summary.valid) return [];
    const total = summary.parsed.moves.length;
    const count = Math.max(1, Math.round((total * stepProgress) / 100));
    return summary.parsed.moves.slice(0, count);
  }, [summary, stepProgress]);

  const currentHead = visibleMoves[visibleMoves.length - 1] || { x2: 0, y2: 0, z: 0 };

  const resetDefaults = () => {
    setGcodeText(DEFAULT_GCODE);
    setStepProgress(100);
    setViewMode('iso3d');
  };

  const handleCopy = () => {
    if (!summary.valid) return;
    const lines = [
      'G-Code Toolpath Simulation Summary',
      `Motion Segments: ${summary.parsed.moves.length}`,
      `Cutting Feed Length: ${summary.cutLen.toFixed(4)}`,
      `Rapid Traverse Length: ${summary.rapidLen.toFixed(4)}`,
      `Max Feed F: ${summary.maxFeed.toFixed(4)}`,
      `Est. Cutting Time (cutLen / F): ${summary.estCutMinutes.toFixed(4)} min`,
    ];
    navigator.clipboard
      .writeText(lines.join('\n'))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!summary.valid) return;
    const lines = [
      'Metric,Value',
      `Motion Segments,${summary.parsed.moves.length}`,
      `Cutting Length,${summary.cutLen.toFixed(4)}`,
      `Rapid Length,${summary.rapidLen.toFixed(4)}`,
      `Max Feed F,${summary.maxFeed.toFixed(4)}`,
      `Estimated Cutting Time (min),${summary.estCutMinutes.toFixed(5)}`,
      ...summary.cleanStats.map((st) => `${toSafeAscii(st.label)},"${toSafeAscii(st.value)}"`),
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gcode_simulation_summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="preset-bracket"
          onClick={() => {
            setGcodeText(DEFAULT_GCODE);
            setStepProgress(100);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 1: Bracket Profile + Holes (G0/G1/G2/G3)
        </button>
        <button
          type="button"
          data-testid="preset-square"
          onClick={() => {
            setGcodeText(SQUARE_TOOLPATH_GCODE);
            setStepProgress(100);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 2: Exact 100x50 mm Rectangle (Cut=300 mm, Rapid=5 mm, F=600)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-black text-slate-900">NC / G-Code Program</h2>
            <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Load .NC</span>
              <input
                type="file"
                accept=".nc,.gcode,.tap,.cnc,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0]?.text().then(setGcodeText)}
              />
            </label>
          </div>

          <textarea
            data-testid="input-gcode"
            value={gcodeText}
            onChange={(e) => setGcodeText(e.target.value)}
            rows={13}
            spellCheck={false}
            className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-950 text-emerald-400 font-mono text-xs"
          />

          <div className="flex gap-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="flex-1 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              type="button"
              data-testid="btn-copy"
              onClick={handleCopy}
              disabled={!summary.valid}
              className="flex-1 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              data-testid="btn-download-csv"
              onClick={handleDownloadCsv}
              disabled={!summary.valid}
              className="flex-1 py-2 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>

          {summary.valid && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {summary.cleanStats.map((st) => (
                <div key={st.label} className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold">{st.label}:</span>
                  <span className="font-black text-slate-900">{st.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!summary.valid ? (
            <div
              data-testid="validation-error"
              className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{summary.error}</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Motion Segments</div>
                  <div data-testid="out-segments" className="text-xl font-black text-slate-900 mt-1">
                    {summary.parsed.moves.length}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Cutting Length</div>
                  <div data-testid="out-cut-len" className="text-xl font-black text-emerald-600 mt-1">
                    {summary.cutLen.toFixed(1)}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Rapid Length</div>
                  <div data-testid="out-rapid-len" className="text-xl font-black text-amber-600 mt-1">
                    {summary.rapidLen.toFixed(1)}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Cut Time (min)</div>
                  <div data-testid="out-cut-time" className="text-xl font-black text-blue-600 mt-1">
                    {summary.estCutMinutes.toFixed(4)}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800 pb-3">
                  <div className="font-bold text-slate-200">
                    Toolhead Position: X={currentHead.x2.toFixed(2)} Y={currentHead.y2.toFixed(2)} Z={currentHead.z.toFixed(2)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('iso3d')}
                      className={`px-3 py-1 rounded-lg font-bold ${
                        viewMode === 'iso3d' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      3D Isometric View
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('xy2d')}
                      className={`px-3 py-1 rounded-lg font-bold ${
                        viewMode === 'xy2d' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      2D Top (XY)
                    </button>
                  </div>
                </div>

                <svg viewBox="-30 -25 185 135" className="w-full h-80 bg-slate-950 rounded-2xl">
                  <g transform="scale(1,-1) translate(0,-85)">
                    {visibleMoves.map((m, i) => {
                      const project = (x: number, y: number, z: number): [number, number] => {
                        if (viewMode === 'xy2d') return [x, y];
                        return [x - y * 0.28, y * 0.75 + z * 2.2];
                      };
                      const [x1, y1] = project(m.x1, m.y1, m.z);
                      const [x2, y2] = project(m.x2, m.y2, m.z);
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={m.rapid ? '#f59e0b' : '#10b981'}
                          strokeWidth={m.rapid ? 0.45 : 0.95}
                          strokeDasharray={m.rapid ? '2 1.5' : undefined}
                        />
                      );
                    })}
                    {(() => {
                      const tx =
                        viewMode === 'xy2d'
                          ? currentHead.x2
                          : currentHead.x2 - currentHead.y2 * 0.28;
                      const ty =
                        viewMode === 'xy2d'
                          ? currentHead.y2
                          : currentHead.y2 * 0.75 + currentHead.z * 2.2;
                      return <circle cx={tx} cy={ty} r={2.4} fill="#ef4444" stroke="#ffffff" strokeWidth={0.7} />;
                    })()}
                  </g>
                </svg>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Simulation Scrubber ({visibleMoves.length} / {summary.parsed.moves.length} motion blocks)</span>
                    <span>{stepProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={stepProgress}
                    onChange={(e) => setStepProgress(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}

          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span>
                Simulates linear (`G0`/`G1`) and circular interpolation (`G2`/`G3`) RS-274 / ISO 6983-1 motion blocks locally. Estimated cutting time equals total feed length divided by active feed rate (excluding controller acceleration/deceleration dwell).
              </span>
            </div>
            <a
              href="https://en.wikipedia.org/wiki/G-code"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
            >
              G-code / ISO 6983-1 Specification (Wikipedia) <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
