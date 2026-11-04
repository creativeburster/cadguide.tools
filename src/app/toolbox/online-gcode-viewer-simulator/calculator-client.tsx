'use client';

import React, { useState, useMemo } from 'react';
import { Play, UploadCloud, RotateCcw } from 'lucide-react';
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

export default function OnlineGcodeViewerSimulatorClient() {
  const [gcodeText, setGcodeText] = useState<string>(DEFAULT_GCODE);
  const [stepProgress, setStepProgress] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'iso3d' | 'xy2d'>('iso3d');

  const parsed = useMemo(() => parseGcode(gcodeText), [gcodeText]);
  const visibleCount = Math.max(1, Math.round((parsed.moves.length * stepProgress) / 100));
  const visibleMoves = parsed.moves.slice(0, visibleCount);
  const currentHead = visibleMoves[visibleMoves.length - 1] || { x2: 0, y2: 0, z: 0 };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left G-Code Editor & Loader */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">NC / G-Code Program</h2>
            <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Load .NC / .GCODE</span>
              <input
                type="file"
                accept=".nc,.gcode,.tap,.cnc,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0]?.text().then(setGcodeText)}
              />
            </label>
          </div>

          <textarea
            value={gcodeText}
            onChange={(e) => setGcodeText(e.target.value)}
            rows={14}
            className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-950 text-emerald-400 font-mono text-xs"
          />

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {parsed.stats.map((st) => (
              <div key={st.label} className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold">{st.label}:</span>
                <span className="font-black text-slate-900">{st.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 3D / 2D Toolpath Simulator Viewport */}
        <div className="lg:col-span-2 space-y-6">
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
                {/* Toolhead Marker */}
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

            {/* Interactive Playback Scrubber */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Simulation Scrubber ({visibleCount} / {parsed.moves.length} motion blocks)</span>
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

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
