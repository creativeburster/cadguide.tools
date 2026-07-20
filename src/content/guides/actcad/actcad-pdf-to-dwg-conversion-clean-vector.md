---
title: "ActCAD PDF to DWG Conversion: Getting Clean Vector Output"
excerpt: "How to configure ActCAD's built-in PDF-to-DWG converter for clean vector geometry — covering raster detection, layer mapping, text recognition, and common conversion artifacts."
category: "workflow"
softwareSlug: "actcad"
keyword: "actcad pdf to dwg conversion vector"
slug: "actcad-pdf-to-dwg-conversion-clean-vector"
author: "CADGuide Tools Editorial Team"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://dwg.autodwg.com/"
  - "https://www.autodwg.com/pdf-to-dwg-converter/"
---

# ActCAD PDF to DWG Conversion: Getting Clean Vector Output

ActCAD ships with a built-in PDF-to-DWG converter — no extra plugin needed. We've used it on hundreds of supplier drawings and as-built PDFs. When it works, it saves hours of manual tracing. When it doesn't, you get a mess of exploded lines and garbled text. The difference is all in the settings.

## When PDF-to-DWG Works Well

The converter can produce clean vector geometry when the source PDF was:

- **Generated from a CAD application** (vector PDF) — the PDF contains actual line/arc data, not raster images
- **Single-layer or well-structured** — the PDF preserves layer information or has clear color separation
- **High resolution** — 300 DPI or higher for any embedded raster content

It will **not** work well with:
- Scanned drawings (raster PDFs) — these are images, not vector data
- PDFs with heavy raster underlays or watermarks
- PDFs that were printed with "flatten to image" settings

## Step 1: Check If Your PDF Is Vector

Before running the converter, verify the PDF contains vector data:

1. Open the PDF in any reader (Adobe Acrobat, browser).
2. Zoom in to 400%+ on a line.
3. If the line stays sharp at any zoom level, it's vector.
4. If the line becomes pixelated, it's raster — the converter will produce poor results.

For raster PDFs, use ActCAD's raster-to-vector tool instead (covered below).

## Step 2: Configure Conversion Settings

In ActCAD, go to **Insert** → **PDF to DWG** (or type `PDFIMPORT`). The dialog offers these key settings:

**Vector Settings:**
- **Create object type**: Choose **Polylines** (not individual lines). Polylines preserve connected geometry and are easier to edit post-conversion.
- **Line weight mapping**: Set to **Use PDF line weight**. This preserves thick/thin line distinctions.
- **Join gap tolerance**: Set to 0.01 mm. This bridges tiny gaps in the PDF vector data that would otherwise create disconnected segments.

**Text Settings:**
- **Text recognition**: Enable. This attempts to convert PDF text to editable MTEXT rather than vector outlines.
- **Text height threshold**: Set to 2.5 mm. Text smaller than this is likely annotation and should be preserved as text, not geometry.

**Layer Settings:**
- **Use PDF layers**: Enable if the PDF has layer information (many CAD-generated PDFs do).
- **Layer prefix**: Set to `PDF_` to distinguish converted content from native geometry.

## Step 3: Post-Conversion Cleanup

Even with optimal settings, the converted DWG needs cleanup:

1. **Run AUDIT**: Type `AUDIT` → `Y` to fix any geometry errors introduced during conversion.
2. **Purge unused layers**: Type `-PURGE` → `ALL` → `*` → `N`.
3. **Check text**: Scroll through the drawing and verify text was recognized correctly. Common issues:
   - Dimension text may be split into individual characters
   - Text with special fonts may be substituted with defaults
   - Multi-line text may become single-line
4. **Reconnect broken polylines**: Type `PEDIT` → `Multiple` → select all → `Join` → tolerance `0.01`. This reconnects segments that the converter split.

## Step 4: Handle Raster Content

If the PDF contains a mix of vector and raster content (common with stamped drawings):

1. The converter will place raster images as IMAGE objects in the DWG.
2. To convert these to vector, use ActCAD's **Raster to Vector** tool: **Insert** → **Raster to Vector**.
3. Configure the raster converter:
   - **Detection mode**: Centerline (for line drawings) or Outline (for logos/symbols)
   - **Resolution**: 300 DPI minimum
   - **Smoothing**: Low (high smoothing distorts geometry)

## Common Conversion Artifacts and Fixes

**Doubled lines**: Some PDFs store lines as filled rectangles (zero-width strokes rendered as 2-pixel-wide fills). The converter creates two parallel lines. Fix with `OVERKILL` command — set tolerance to 0.1 mm.

**Exploded arcs**: Arcs in the PDF may convert as short line segments. Fix by selecting the segments and using `PEDIT` → `Spline` to smooth them back into curves.

**Missing text**: If text recognition fails entirely, the text becomes vector outlines. You can't edit it as text — you'll need to erase and retype. To prevent this, try converting with text recognition disabled first (to get geometry), then run a second pass with only text recognition enabled.
