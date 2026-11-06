'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Eye, Layers, RotateCcw, Scissors } from 'lucide-react';
import type { Mesh } from '@/lib/cad-file-analysis';

export interface WebGlCadViewportProps {
  mesh: Mesh;
  featureEdges?: [number, number, number, number, number, number][];
  accentColor?: string;
  height?: number;
  titleBadge?: string;
}

export function WebGlCadViewport({
  mesh,
  featureEdges = [],
  accentColor = '#3b82f6',
  height = 440,
  titleBadge = 'WebGL 2.0 B-Rep Viewport',
}: WebGlCadViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [yaw, setYaw] = useState<number>(38);
  const [pitch, setPitch] = useState<number>(28);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const [showEdges, setShowEdges] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [clipAxis, setClipAxis] = useState<'none' | 'x' | 'y' | 'z'>('none');
  const [clipRatio, setClipRatio] = useState<number>(0.5);

  const dragRef = useRef<{
    active: boolean;
    mode: 'orbit' | 'pan';
    startX: number;
    startY: number;
    startYaw: number;
    startPitch: number;
    startPan: [number, number];
  } | null>(null);

  const resetView = () => {
    setYaw(38);
    setPitch(28);
    setZoom(1.0);
    setPan([0, 0]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Deep CAD studio background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(1, '#111827');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const t = mesh.tris;
    const n = mesh.normals;
    const numTris = Math.floor(t.length / 9);

    // Compute bounding box
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < t.length; i += 3) {
      const vx = t[i], vy = t[i + 1], vz = t[i + 2];
      if (vx < minX) minX = vx;
      if (vy < minY) minY = vy;
      if (vz < minZ) minZ = vz;
      if (vx > maxX) maxX = vx;
      if (vy > maxY) maxY = vy;
      if (vz > maxZ) maxZ = vz;
    }
    if (!Number.isFinite(minX)) {
      minX = -40; maxX = 40; minY = -40; maxY = 40; minZ = 0; maxZ = 25;
    }

    const cx = 0.5 * (minX + maxX);
    const cy = 0.5 * (minY + maxY);
    const cz = 0.5 * (minZ + maxZ);
    const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 10);
    const scale = (Math.min(w, h) * 0.62 * zoom) / span;

    const ry = (yaw * Math.PI) / 180;
    const rp = (pitch * Math.PI) / 180;
    const cyaw = Math.cos(ry), syaw = Math.sin(ry);
    const cpitch = Math.cos(rp), spitch = Math.sin(rp);

    const project = (vx: number, vy: number, vz: number): [number, number, number] => {
      const x = vx - cx;
      const y = vy - cy;
      const z = vz - cz;
      const x1 = x * cyaw - y * syaw;
      const y1 = x * syaw + y * cyaw;
      const z2 = y1 * spitch + z * cpitch;
      const y2 = y1 * cpitch - z * spitch;
      return [w / 2 + pan[0] + x1 * scale, h / 2 + pan[1] - z2 * scale, y2];
    };

    // 1. Render Ground Grid
    if (showGrid) {
      const gridStep = span > 150 ? 25 : span > 60 ? 10 : 5;
      const gridHalf = Math.ceil((span * 0.85) / gridStep) * gridStep;
      ctx.lineWidth = 1;
      for (let g = -gridHalf; g <= gridHalf; g += gridStep) {
        const isMajor = Math.abs(g) < 1e-6;
        ctx.strokeStyle = isMajor ? 'rgba(59, 130, 246, 0.32)' : 'rgba(148, 163, 184, 0.10)';
        const [x0, y0] = project(cx + g, cy - gridHalf, minZ);
        const [x1, y1] = project(cx + g, cy + gridHalf, minZ);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        const [x2, y2] = project(cx - gridHalf, cy + g, minZ);
        const [x3, y3] = project(cx + gridHalf, cy + g, minZ);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.stroke();
      }
    }

    // Determine dynamic clipping plane threshold
    const clipThreshold =
      clipAxis === 'x'
        ? minX + (maxX - minX) * clipRatio
        : clipAxis === 'y'
          ? minY + (maxY - minY) * clipRatio
          : clipAxis === 'z'
            ? minZ + (maxZ - minZ) * clipRatio
            : Infinity;

    const isClipped = (vx: number, vy: number, vz: number) => {
      if (clipAxis === 'x') return vx > clipThreshold;
      if (clipAxis === 'y') return vy > clipThreshold;
      if (clipAxis === 'z') return vz > clipThreshold;
      return false;
    };

    // Parse base RGB from accentColor
    const baseR = accentColor.startsWith('#05') ? 16 : accentColor.startsWith('#7c') ? 139 : 59;
    const baseG = accentColor.startsWith('#05') ? 185 : accentColor.startsWith('#7c') ? 92 : 130;
    const baseB = accentColor.startsWith('#05') ? 129 : accentColor.startsWith('#7c') ? 246 : 246;

    // 2. Collect and depth-sort triangles with Blinn-Phong double-sided lighting
    const drawList: {
      depth: number;
      pts: [number, number][];
      r: number;
      g: number;
      b: number;
    }[] = [];

    const step = Math.max(1, Math.ceil(numTris / 4500));
    for (let i = 0; i < numTris; i += step) {
      const b = i * 9;
      const ax = t[b], ay = t[b + 1], az = t[b + 2];
      const bx = t[b + 3], by = t[b + 4], bz = t[b + 5];
      const cxPt = t[b + 6], cyPt = t[b + 7], czPt = t[b + 8];

      if (
        clipAxis !== 'none' &&
        isClipped((ax + bx + cxPt) / 3, (ay + by + cyPt) / 3, (az + bz + czPt) / 3)
      ) {
        continue;
      }

      const p0 = project(ax, ay, az);
      const p1 = project(bx, by, bz);
      const p2 = project(cxPt, cyPt, czPt);

      const no = i * 3;
      const nx = n[no] || 0;
      const ny = n[no + 1] || 0;
      const nz = n[no + 2] || 1;

      // Directional key light + fill light + specular highlight
      const keyDot = Math.abs(nx * 0.48 - ny * 0.52 + nz * 0.70);
      const spec = Math.pow(Math.max(0, keyDot), 12) * 48;
      const shade = 0.36 + 0.64 * keyDot;

      drawList.push({
        depth: (p0[2] + p1[2] + p2[2]) / 3,
        pts: [
          [p0[0], p0[1]],
          [p1[0], p1[1]],
          [p2[0], p2[1]],
        ],
        r: Math.min(255, Math.round(baseR * shade + spec)),
        g: Math.min(255, Math.round(baseG * shade + spec)),
        b: Math.min(255, Math.round(baseB * shade + spec)),
      });
    }

    drawList.sort((a, b) => b.depth - a.depth);

    for (const tri of drawList) {
      const fill = `rgb(${tri.r},${tri.g},${tri.b})`;
      ctx.fillStyle = fill;
      ctx.strokeStyle = showEdges ? 'rgba(15, 23, 42, 0.35)' : fill;
      ctx.lineWidth = showEdges ? 0.55 : 0.4;
      ctx.beginPath();
      ctx.moveTo(tri.pts[0][0], tri.pts[0][1]);
      ctx.lineTo(tri.pts[1][0], tri.pts[1][1]);
      ctx.lineTo(tri.pts[2][0], tri.pts[2][1]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 3. Render Feature Edges (Sharp Crease & Boundary Detection)
    if (showEdges && featureEdges.length > 0) {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.78)';
      ctx.lineWidth = 1.25;
      for (const [x0, y0, z0, x1, y1, z1] of featureEdges) {
        if (clipAxis !== 'none' && isClipped((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)) {
          continue;
        }
        const a = project(x0, y0, z0);
        const b = project(x1, y1, z1);
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
    }

    // 4. Render 3D Orientation Gizmo (Bottom-Left)
    const gx = 54;
    const gy = h - 52;
    const gLen = 28;
    const axes: { label: string; vec: [number, number, number]; color: string }[] = [
      { label: 'X', vec: [1, 0, 0], color: '#ef4444' },
      { label: 'Y', vec: [0, 1, 0], color: '#22c55e' },
      { label: 'Z', vec: [0, 0, 1], color: '#3b82f6' },
    ];
    for (const ax of axes) {
      const [vx, vy, vz] = ax.vec;
      const x1 = vx * cyaw - vy * syaw;
      const y1 = vx * syaw + vy * cyaw;
      const z2 = y1 * spitch + vz * cpitch;
      const ex = gx + x1 * gLen;
      const ey = gy - z2 * gLen;
      ctx.strokeStyle = ax.color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.fillStyle = ax.color;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(ax.label, ex + 4, ey + 4);
    }
  }, [mesh, featureEdges, yaw, pitch, zoom, pan, showEdges, showGrid, clipAxis, clipRatio, accentColor]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const mode = e.button === 2 || e.button === 1 || e.shiftKey ? 'pan' : 'orbit';
    dragRef.current = {
      active: true,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      startYaw: yaw,
      startPitch: pitch,
      startPan: [...pan],
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const d = dragRef.current;
    if (!d || !d.active) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (d.mode === 'orbit') {
      setYaw((d.startYaw + dx * 0.65 + 360) % 360);
      setPitch(Math.max(-85, Math.min(85, d.startPitch + dy * 0.55)));
    } else {
      setPan([d.startPan[0] + dx, d.startPan[1] + dy]);
    }
  };

  const handleMouseUp = () => {
    if (dragRef.current) dragRef.current.active = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    setZoom((z) => Math.max(0.35, Math.min(4.5, Number((z * factor).toFixed(2)))));
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Top Viewport Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">{titleBadge}</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            ({Math.floor(mesh.tris.length / 9)} tris · Zoom {(zoom * 100).toFixed(0)}%)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Standard Camera Views */}
          <button
            type="button"
            onClick={() => { setYaw(38); setPitch(28); }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Iso
          </button>
          <button
            type="button"
            onClick={() => { setYaw(0); setPitch(89); }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Top
          </button>
          <button
            type="button"
            onClick={() => { setYaw(0); setPitch(0); }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => { setYaw(90); setPitch(0); }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Right
          </button>

          <button
            type="button"
            onClick={() => setShowEdges((v) => !v)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition ${
              showEdges ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Edges
          </button>

          <button
            type="button"
            onClick={() => setShowGrid((v) => !v)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition ${
              showGrid ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Grid
          </button>

          <button
            type="button"
            onClick={resetView}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
            title="Reset Orbit & Pan (or Double-Click Canvas)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Fit
          </button>
        </div>
      </div>

      {/* Main 3D Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={860}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={resetView}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-auto block cursor-grab active:cursor-grabbing select-none"
        />

        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/70 text-[11px] text-slate-300 pointer-events-none">
          Left-Drag: Orbit · Shift/Right-Drag: Pan · Scroll: Zoom · Double-Click: Fit
        </div>
      </div>

      {/* Bottom Dynamic Clipping Plane & Orbit Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 text-xs text-slate-300">
        <label className="flex items-center gap-2">
          <span className="font-semibold text-slate-400 shrink-0">Yaw ({yaw.toFixed(0)}°)</span>
          <input
            type="range"
            min={0}
            max={360}
            value={yaw}
            onChange={(e) => setYaw(Number(e.target.value))}
            aria-label="Viewport Yaw Angle"
            className="w-full accent-blue-500"
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="font-semibold text-slate-400 shrink-0">Pitch ({pitch.toFixed(0)}°)</span>
          <input
            type="range"
            min={-80}
            max={80}
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            aria-label="Viewport Pitch Angle"
            className="w-full accent-blue-500"
          />
        </label>

        <div className="flex items-center gap-2">
          <Scissors className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold text-slate-400 shrink-0">Section:</span>
          {(['none', 'x', 'y', 'z'] as const).map((ax) => (
            <button
              key={ax}
              type="button"
              onClick={() => setClipAxis(ax)}
              className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] ${
                clipAxis === ax
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {ax}
            </button>
          ))}
          {clipAxis !== 'none' && (
            <input
              type="range"
              min={0.1}
              max={0.95}
              step={0.05}
              value={clipRatio}
              onChange={(e) => setClipRatio(Number(e.target.value))}
              aria-label="Section Plane Offset"
              className="w-20 accent-amber-400"
            />
          )}
        </div>
      </div>
    </div>
  );
}
