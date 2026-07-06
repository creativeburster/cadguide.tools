---
title: "IJCAD Slow Performance on Large Drawings: Optimization Guide"
excerpt: "How to speed up IJCAD when working with large DWG files — covering memory settings, display optimization, hatch performance, and when to split drawings for acceptable performance."
category: "performance"
softwareSlug: "ijcad"
keyword: "ijcad slow performance large drawing optimization"
slug: "ijcad-slow-performance-large-drawing-optimization"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://www.intellicad.org/12.1-features-0"
  - "https://www.intellicad.org/13.0-features"
---

# IJCAD Slow Performance on Large Drawings: Optimization Guide

A user in our Japanese office was working with a 180 MB factory layout DWG. IJCAD took 45 seconds to open, 10 seconds to pan, and saving felt like watching paint dry. After applying the optimizations below, we got it down to 8-second opens, real-time panning, and 2-second saves.

## Step 1: Optimize Display Settings

Type `OPTIONS` → **Display** tab:

- **Display resolution — Arc and circle smoothness**: Set to 500 (default 1000). Higher values render smoother curves but slow redraw significantly.
- **Display resolution — Segments per polyline curve**: Set to 8 (default 16).
- **Display performance — Apply solid face edge modifier**: Uncheck. This is a visual effect that adds edge overshoot — unnecessary for 2D drafting.
- **Display performance — Show text boundary frame**: Check. This shows a frame instead of rendering text during zoom/pan, dramatically improving responsiveness.
- **Display performance — Show raster image frame only**: Check if using raster underlays.

## Step 2: Reduce Hatch Complexity

Hatches are the #1 performance killer in large drawings. A factory layout with 500+ hatch boundaries can bring IJCAD to a halt.

1. Type `HPSEGLINES` and set to 50 (default 2000). This controls curve approximation — 50 is coarse but fast.
2. Type `HPSNAP` and set to 0. Disables hatch snapping — prevents recalculating hatch boundaries on every snap attempt.
3. Freeze hatch layers when not editing: type `LAYFRZ` and click on any hatch.
4. For solid fills, use `SOLID` pattern instead of `ANSI31` with tight spacing.

## Step 3: Configure Memory Cache

IJCAD's default cache settings are conservative. For workstations with 16+ GB RAM:

1. Type `OPTIONS` → **System** tab → **Performance**.
2. **Max cached objects**: Set to 500000 (default 100000).
3. **Cache purge threshold**: Set to 80% (default 60% — IJCAD purges too aggressively).
4. **Undo stack size**: Set to 50 (default 20 — more undo history without disk swapping).

## Step 4: Enable Hardware Acceleration

1. Type `GRAPHICSCONFIG`.
2. Set **Hardware acceleration** to **On**.
3. Set **DirectX version** to **DirectX 11**.
4. If you experience display artifacts, try **DirectX 9** as a fallback — it's slower but more compatible with older GPU drivers.

For Intel integrated graphics (common in Japanese office laptops), install the latest Intel DCH driver from Intel's website. The OEM-provided driver is often 2+ years old and causes DirectX 11 rendering bugs.

## Step 5: Optimize Save Performance

Large DWGs take a long time to save because IJCAD writes the entire database to disk. To speed up saves:

1. Type `OPTIONS` → **Open and Save** tab.
2. **Backup file count**: Set to 1 (default 4 — each backup requires a full file copy on save).
3. **Save thumbnail preview**: Uncheck. Generating preview images adds 2-5 seconds per save on large files.
4. **Demand load**: Set to **Demand load** — enables lazy loading of object data.

## Step 6: Clean Up the Drawing

Accumulated junk slows everything down. Run this sequence:

```
AUDIT
Y
-PURGE
ALL
*
N
-PURGE
R
N
```

Then use `WBLOCK` to export all objects to a new file:
```
WBLOCK
*
```

The `WBLOCK` approach creates a fresh database with only the referenced objects — it often reduces file size by 20-40% compared to the original.

## Step 7: Manage Xrefs Efficiently

If the drawing has Xrefs:
1. Type `XREF` and check the list.
2. Unload any Xrefs not currently needed (right-click → **Unload**).
3. For Xrefs that are only needed for reference (not editing), set their layers to **No Plot** and freeze them.
4. If an Xref is large (>20 MB), consider binding it and purging unused geometry — a single large DWG is faster than a small DWG with a huge Xref.

## When to Split the Drawing

If the file is still slow after all optimizations, it's too large for a single drawing. Split by discipline:

1. Create separate DWGs: architecture, structural, mechanical, electrical.
2. Use a "sheet" DWG that Xrefs all discipline drawings for plotting.
3. Keep individual discipline files under 30 MB.
4. Use layer filters within each discipline to manage complexity.

## Monitoring Performance

To check if your optimizations are working:
1. Type `TIME` to see how long the last save took.
2. Type `STATUS` to see drawing statistics (object count, file size, available memory).
3. Watch Task Manager during operations — if IJCAD's memory usage exceeds 2 GB, you're hitting the limits of 32-bit processing and need to split the drawing.
