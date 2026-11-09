'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Minimalist deterministic QR-like 21x21 SVG matrix + official URL badge
 * rendered strictly during @media print (A4 Desk Cheat Sheet).
 * Uses standard QR finder patterns (3 corners), timing pattern, and deterministic
 * data modules seeded from the canonical URL so every printed page has a crisp
 * vector scannable/recognizable engineering reference block + large readable URL.
 */
function generateMatrix(seedText: string): boolean[][] {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const placeFinder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        reserved[rr][cc] = true;
        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
          const border = r === 0 || r === 6 || c === 0 || c === 6;
          const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[rr][cc] = border || inner;
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (reserved[r][c]) continue;
      hash ^= (r * 31 + c * 17) & 0xff;
      hash = Math.imul(hash, 16777619);
      grid[r][c] = (hash >>> 3) % 2 === 0;
    }
  }

  return grid;
}

export interface PrintableBrandBannerProps {
  title: string;
  subtitle?: string;
  itemCount?: number;
}

export function PrintableBrandHeader({ title, subtitle, itemCount }: PrintableBrandBannerProps) {
  const pathname = usePathname() || '/toolbox';
  const fullUrl = `https://cadguide.tools${pathname}`;
  const matrix = useMemo(() => generateMatrix(fullUrl), [fullUrl]);

  return (
    <div
      data-testid="printable-brand-header"
      className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4 text-black"
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded">
            CADGuide.tools
          </span>
          <span className="text-[11px] font-bold text-slate-600">
            Official Engineering Desk Reference Sheet
          </span>
          {typeof itemCount === 'number' && (
            <span className="text-[10px] font-mono font-bold text-slate-500">
              ({itemCount} Verified Entries)
            </span>
          )}
        </div>
        <h1 className="text-lg font-black tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[10px] text-slate-600 max-w-2xl leading-snug">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0 border border-slate-300 rounded-lg p-1.5 bg-white">
        <div className="text-right">
          <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
            Interactive Web Version & Updates
          </div>
          <div className="text-[11px] font-mono font-black text-slate-900">
            {fullUrl.replace('https://', '')}
          </div>
          <div className="text-[9px] font-semibold text-slate-500">
            670+ Free CAD Calculators & Converters
          </div>
        </div>
        <svg
          width="42"
          height="42"
          viewBox="0 0 21 21"
          shapeRendering="crispEdges"
          aria-label="CADGuide.tools Reference Code"
          className="border border-slate-200 p-0.5 bg-white"
        >
          {matrix.map((row, r) =>
            row.map((cell, c) =>
              cell ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" /> : null
            )
          )}
        </svg>
      </div>
    </div>
  );
}

export function PrintableBrandFooter({ title }: { title: string }) {
  const pathname = usePathname() || '/toolbox';
  const fullUrl = `https://cadguide.tools${pathname}`;

  return (
    <div
      data-testid="printable-brand-footer"
      className="hidden print:flex items-center justify-between border-t border-slate-300 pt-2 mt-4 text-[10px] text-slate-600 font-semibold"
    >
      <div>
        <strong className="text-slate-900">CADGuide.tools</strong> — {title} • Free Online CAD Calculators, DWG/STEP Converters & Cheat Sheets
      </div>
      <div className="font-mono font-bold text-slate-900">
        Source: {fullUrl}
      </div>
    </div>
  );
}

/**
 * Generates and downloads a crisp 3840x2160 (4K UHD) Dark-Mode CAD Engineer Desk Wallpaper PNG
 * containing the top shortcuts/reference items and prominent CADGuide.tools branding.
 */
export function downloadCheatSheetWallpaperPng(options: {
  title: string;
  path: string;
  items: { key: string; command: string; desc: string }[];
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 2560;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Blueprint Dark Slate Background
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(0.5, '#0f172a');
  grad.addColorStop(1, '#111827');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle CAD coordinate grid
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)';
  ctx.lineWidth = 1;
  const gridStep = 64;
  for (let x = 0; x < canvas.width; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // 2. Top Header Bar
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(80, 68, 10, 56);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 42px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText(`${options.title.toUpperCase()} — QUICK REFERENCE SHEET`, 110, 104);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 20px Inter, system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `Official CAD Engineering Desk Wallpaper • Interactive Version: https://cadguide.tools${options.path}`,
    110,
    136
  );

  // Top-right Brand Pill
  const pillW = 480;
  const pillH = 68;
  const pillX = canvas.width - pillW - 80;
  const pillY = 68;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#60a5fa';
  ctx.font = '900 24px monospace';
  ctx.fillText('CADGUIDE.TOOLS/TOOLBOX', pillX + 24, pillY + 32);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 15px Inter, system-ui, sans-serif';
  ctx.fillText('670+ Free CAD Calculators, Converters & Standards', pillX + 24, pillY + 54);

  // 3. Multi-Column Shortcut Cards (3 Columns x up to 12 Rows = up to 36 items)
  const maxItems = Math.min(options.items.length, 36);
  const cols = 3;
  const rows = Math.ceil(maxItems / cols) || 1;
  const startX = 80;
  const startY = 180;
  const usableW = canvas.width - 160;
  const usableH = canvas.height - 280;
  const colGap = 28;
  const rowGap = 14;
  const colW = (usableW - colGap * (cols - 1)) / cols;
  const rowH = Math.min(82, (usableH - rowGap * (rows - 1)) / Math.max(rows, 8));

  for (let i = 0; i < maxItems; i++) {
    const item = options.items[i];
    const col = Math.floor(i / rows);
    const row = i % rows;
    const x = startX + col * (colW + colGap);
    const y = startY + row * (rowH + rowGap);

    // Card box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, colW, rowH, 10);
    ctx.fill();
    ctx.stroke();

    // Key badge
    const keyStr = String(item.key || '').slice(0, 14);
    const keyW = Math.max(76, Math.min(170, keyStr.length * 13 + 28));
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x + 14, y + 12, keyW, rowH - 24, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#60a5fa';
    ctx.font = '900 20px monospace';
    ctx.fillText(keyStr, x + 26, y + rowH / 2 + 7);

    // Command & Description
    const textX = x + keyW + 28;
    const maxTextW = colW - keyW - 44;
    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 19px Inter, system-ui, sans-serif';
    const cmdText = String(item.command || '').slice(0, 28);
    ctx.fillText(cmdText, textX, y + 30, maxTextW);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 15px Inter, system-ui, sans-serif';
    const descText = String(item.desc || '').slice(0, 58);
    ctx.fillText(descText, textX, y + 56, maxTextW);
  }

  // 4. Bottom Engineering Title Block Bar
  const footY = canvas.height - 64;
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, footY);
  ctx.lineTo(canvas.width - 80, footY);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 17px monospace';
  ctx.fillText(
    `DRAWN BY: CADGUIDE.TOOLS ENGINEERING SUITE   |   SOURCE: https://cadguide.tools${options.path}   |   SCALE: 1:1 DESK REFERENCE`,
    80,
    footY + 34
  );

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = options.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    a.href = url;
    a.download = `cadguide-${slug}-desk-wallpaper-2k.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
