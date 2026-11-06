'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Crosshair, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import type { SketchEntity2D } from '@/lib/wasm-bridges/parametric-cad-bridge';
import type { NestedPolygonInstance, ToolpathMove } from '@/lib/wasm-bridges/nesting-cam-bridge';

export interface Canvas2DCadViewportProps {
  mode: 'sketch' | 'nesting';
  height?: number;
  titleBadge?: string;
  // Sketch mode props
  sketchEntities?: SketchEntity2D[];
  activeTool?: 'select' | 'line' | 'circle' | 'rect' | 'arc' | 'spline';
  onAddSketchEntity?: (ent: SketchEntity2D) => void;
  // Nesting & CAM mode props
  sheetWidthMm?: number;
  sheetHeightMm?: number;
  placedParts?: NestedPolygonInstance[];
  toolpathMoves?: ToolpathMove[];
  backplotProgressPct?: number;
  showToolpathOverlay?: boolean;
}

export function Canvas2DCadViewport({
  mode,
  height = 420,
  titleBadge = 'Canvas 2D Vector Viewport',
  sketchEntities = [],
  activeTool = 'select',
  onAddSketchEntity,
  sheetWidthMm = 1000,
  sheetHeightMm = 500,
  placedParts = [],
  toolpathMoves = [],
  backplotProgressPct = 100,
  showToolpathOverlay = true,
}: Canvas2DCadViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const [cursorWorld, setCursorWorld] = useState<[number, number]>([0, 0]);
  const [pendingPt, setPendingPt] = useState<[number, number] | null>(null);

  const panDragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startPan: [number, number];
  } | null>(null);

  const resetView = () => {
    setZoom(1.0);
    setPan([0, 0]);
    setPendingPt(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    if (mode === 'sketch') {
      const baseScale = (Math.min(w, h) * 0.36 * zoom) / 50;
      const ox = w / 2 + pan[0];
      const oy = h / 2 + pan[1];
      const toScreen = (wx: number, wy: number): [number, number] => [
        ox + wx * baseScale,
        oy - wy * baseScale,
      ];

      // Grid lines every 10 mm
      ctx.lineWidth = 1;
      for (let g = -120; g <= 120; g += 10) {
        const [sx] = toScreen(g, 0);
        const [, sy] = toScreen(0, g);
        ctx.strokeStyle = g === 0 ? 'rgba(59, 130, 246, 0.55)' : 'rgba(148, 163, 184, 0.11)';
        ctx.beginPath();
        ctx.moveTo(sx, 24);
        ctx.lineTo(sx, h);
        ctx.stroke();

        ctx.strokeStyle = g === 0 ? 'rgba(16, 185, 129, 0.55)' : 'rgba(148, 163, 184, 0.11)';
        ctx.beginPath();
        ctx.moveTo(28, sy);
        ctx.lineTo(w, sy);
        ctx.stroke();
      }

      // Draw Sketch Entities
      for (const ent of sketchEntities) {
        ctx.save();
        if (ent.construction) {
          ctx.setLineDash([6, 4]);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.4;
        } else {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.2;
        }

        if (ent.kind === 'circle') {
          const [cx, cy] = toScreen(ent.cx ?? 0, ent.cy ?? 0);
          const radPx = (ent.r ?? 20) * baseScale;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(2, radPx), 0, Math.PI * 2);
          ctx.stroke();

          // Center cross + Radius label
          ctx.fillStyle = '#93c5fd';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`R${(ent.r ?? 20).toFixed(1)}`, cx + radPx * 0.7 + 4, cy - 6);
        } else if (ent.kind === 'rect') {
          const [x1, y1] = toScreen(ent.x1, ent.y1);
          const [x2, y2] = toScreen(ent.x2, ent.y2);
          ctx.strokeRect(
            Math.min(x1, x2),
            Math.min(y1, y2),
            Math.abs(x2 - x1),
            Math.abs(y2 - y1)
          );
        } else if (ent.kind === 'arc') {
          const [cx, cy] = toScreen(ent.cx ?? 0, ent.cy ?? 0);
          const radPx = (ent.r ?? 25) * baseScale;
          const a1 = -((ent.startAngleDeg ?? 0) * Math.PI) / 180;
          const a2 = -((ent.endAngleDeg ?? 120) * Math.PI) / 180;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(2, radPx), a2, a1);
          ctx.stroke();
        } else {
          const [x1, y1] = toScreen(ent.x1, ent.y1);
          const [x2, y2] = toScreen(ent.x2, ent.y2);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Endpoints
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.arc(x1, y1, 3, 0, Math.PI * 2);
          ctx.arc(x2, y2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw pending rubberband point if interactive tool active
      if (pendingPt) {
        const [px, py] = toScreen(pendingPt[0], pendingPt[1]);
        const [cx, cy] = toScreen(cursorWorld[0], cursorWorld[1]);
        ctx.strokeStyle = '#22c55e';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    } else {
      // Nesting & CAM Backplotter Mode
      const pad = 42;
      const availW = w - pad * 2;
      const availH = h - pad * 2;
      const scale = Math.min(availW / Math.max(100, sheetWidthMm), availH / Math.max(100, sheetHeightMm)) * zoom;
      const ox = (w - sheetWidthMm * scale) / 2 + pan[0];
      const oy = (h + sheetHeightMm * scale) / 2 + pan[1];

      const toScreen = (wx: number, wy: number): [number, number] => [
        ox + wx * scale,
        oy - wy * scale,
      ];

      // Draw Raw Material Sheet Boundary
      const [sx0, sy0] = toScreen(0, sheetHeightMm);
      const swPx = sheetWidthMm * scale;
      const shPx = sheetHeightMm * scale;
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.fillRect(sx0, sy0, swPx, shPx);
      ctx.strokeRect(sx0, sy0, swPx, shPx);

      // Sheet grid every 100mm
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;
      for (let gx = 100; gx < sheetWidthMm; gx += 100) {
        const [x] = toScreen(gx, 0);
        ctx.beginPath();
        ctx.moveTo(x, sy0);
        ctx.lineTo(x, sy0 + shPx);
        ctx.stroke();
      }
      for (let gy = 100; gy < sheetHeightMm; gy += 100) {
        const [, y] = toScreen(0, gy);
        ctx.beginPath();
        ctx.moveTo(sx0, y);
        ctx.lineTo(sx0 + swPx, y);
        ctx.stroke();
      }

      // Draw Placed True-Shape Polygons (Sheet 1)
      const sheet1 = placedParts.filter((p) => p.sheetIndex === 1);
      for (const p of sheet1) {
        if (p.outerLoop.length < 3) continue;
        ctx.save();
        ctx.fillStyle = `${p.color}38`;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.nestedInsideHoleOf ? 2.0 : 1.6;
        ctx.beginPath();
        p.outerLoop.forEach(([wx, wy], idx) => {
          const [px, py] = toScreen(wx, wy);
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner holes
        for (const ih of p.innerHoles) {
          const [hcx, hcy] = toScreen(ih.cx, ih.cy);
          ctx.fillStyle = '#090d16';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(hcx, hcy, Math.max(1.5, ih.r * scale), 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // Part label
        const [lx, ly] = toScreen(p.x + p.width * 0.12, p.y + p.height * 0.5);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(p.partName.slice(0, 18), lx, ly);
        ctx.restore();
      }

      // Draw G-Code Backplotter Toolpath Overlay up to backplotProgressPct
      if (showToolpathOverlay && toolpathMoves.length > 0) {
        const maxMoves = Math.max(
          1,
          Math.floor((toolpathMoves.length * Math.min(100, Math.max(0, backplotProgressPct))) / 100)
        );
        let headX = 0;
        let headY = 0;
        let headLaser = false;

        for (let i = 0; i < maxMoves; i++) {
          const mv = toolpathMoves[i];
          const [x1, y1] = toScreen(mv.x1, mv.y1);
          const [x2, y2] = toScreen(mv.x2, mv.y2);

          ctx.save();
          if (mv.kind === 'rapid') {
            ctx.strokeStyle = 'rgba(249, 115, 22, 0.55)';
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1.1;
          } else if (mv.kind === 'lead-in' || mv.kind === 'lead-out') {
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2.0;
          } else if (mv.kind === 'cut-hole') {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8;
          } else {
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 1.9;
          }
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.restore();

          headX = mv.x2;
          headY = mv.y2;
          headLaser = mv.laserOn;
        }

        // Draw active laser nozzle head
        const [hx, hy] = toScreen(headX, headY);
        ctx.fillStyle = headLaser ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(hx, hy, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Top & Left Ruler Bars
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, 22);
    ctx.fillRect(0, 0, 26, h);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('mm', 4, 15);
  }, [
    mode,
    zoom,
    pan,
    sketchEntities,
    pendingPt,
    cursorWorld,
    sheetWidthMm,
    sheetHeightMm,
    placedParts,
    toolpathMoves,
    backplotProgressPct,
    showToolpathOverlay,
  ]);

  const screenToWorld = (clientX: number, clientY: number): [number, number] => {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0];
    const rect = canvas.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * canvas.width;
    const sy = ((clientY - rect.top) / rect.height) * canvas.height;

    if (mode === 'sketch') {
      const baseScale = (Math.min(canvas.width, canvas.height) * 0.36 * zoom) / 50;
      const wx = (sx - (canvas.width / 2 + pan[0])) / baseScale;
      const wy = (canvas.height / 2 + pan[1] - sy) / baseScale;
      return [Math.round(wx), Math.round(wy)];
    }

    const pad = 42;
    const availW = canvas.width - pad * 2;
    const availH = canvas.height - pad * 2;
    const scale =
      Math.min(availW / Math.max(100, sheetWidthMm), availH / Math.max(100, sheetHeightMm)) * zoom;
    const ox = (canvas.width - sheetWidthMm * scale) / 2 + pan[0];
    const oy = (canvas.height + sheetHeightMm * scale) / 2 + pan[1];
    return [Number(((sx - ox) / scale).toFixed(1)), Number(((oy - sy) / scale).toFixed(1))];
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'sketch' || activeTool === 'select' || !onAddSketchEntity) return;
    const [wx, wy] = screenToWorld(e.clientX, e.clientY);
    if (!pendingPt) {
      setPendingPt([wx, wy]);
      return;
    }
    const [x1, y1] = pendingPt;
    const id = `sk-${Date.now()}`;
    if (activeTool === 'circle') {
      const r = Math.max(4, Math.round(Math.hypot(wx - x1, wy - y1)));
      onAddSketchEntity({
        id,
        kind: 'circle',
        label: `Circle R${r}`,
        x1: x1 - r,
        y1,
        x2: x1 + r,
        y2: y1,
        cx: x1,
        cy: y1,
        r,
      });
    } else if (activeTool === 'rect') {
      onAddSketchEntity({
        id,
        kind: 'rect',
        label: `Rect ${Math.abs(wx - x1)}×${Math.abs(wy - y1)}`,
        x1,
        y1,
        x2: wx,
        y2: wy,
      });
    } else if (activeTool === 'arc') {
      const r = Math.max(5, Math.round(Math.hypot(wx - x1, wy - y1)));
      onAddSketchEntity({
        id,
        kind: 'arc',
        label: `Arc R${r}`,
        x1,
        y1,
        x2: wx,
        y2: wy,
        cx: x1,
        cy: y1,
        r,
        startAngleDeg: 0,
        endAngleDeg: 135,
      });
    } else {
      onAddSketchEntity({
        id,
        kind: activeTool === 'spline' ? 'spline' : 'line',
        label: `${activeTool === 'spline' ? 'Spline' : 'Line'} (${x1},${y1})→(${wx},${wy})`,
        x1,
        y1,
        x2: wx,
        y2: wy,
      });
    }
    setPendingPt(null);
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-white">{titleBadge}</span>
          <span className="font-mono text-[11px] text-cyan-300 bg-slate-800 px-2 py-0.5 rounded">
            X: {cursorWorld[0]} mm · Y: {cursorWorld[1]} mm
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(4.0, Number((z * 1.2).toFixed(2))))}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            Zoom +
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.4, Number((z * 0.84).toFixed(2))))}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            <ZoomOut className="w-3.5 h-3.5" />
            Zoom -
          </button>
          <button
            type="button"
            onClick={resetView}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={860}
        height={height}
        onClick={handleCanvasClick}
        onMouseDown={(e) => {
          if (e.button === 1 || e.button === 2 || e.shiftKey || activeTool === 'select') {
            panDragRef.current = {
              active: true,
              startX: e.clientX,
              startY: e.clientY,
              startPan: [...pan],
            };
          }
        }}
        onMouseMove={(e) => {
          setCursorWorld(screenToWorld(e.clientX, e.clientY));
          const d = panDragRef.current;
          if (d && d.active) {
            setPan([d.startPan[0] + (e.clientX - d.startX), d.startPan[1] + (e.clientY - d.startY)]);
          }
        }}
        onMouseUp={() => {
          if (panDragRef.current) panDragRef.current.active = false;
        }}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-auto block cursor-crosshair select-none"
      />
    </div>
  );
}
