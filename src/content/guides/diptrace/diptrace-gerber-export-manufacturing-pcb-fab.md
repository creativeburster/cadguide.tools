---
title: "DipTrace Gerber Export and Manufacturing: Preparing Files for PCB Fab Houses"
excerpt: "How to export manufacturing-ready Gerber files from DipTrace — covering layer mapping, drill file generation, pick-and-place export, and pre-order verification checklist."
category: "manufacturing"
softwareSlug: "diptrace"
keyword: "diptrace gerber export manufacturing pcb fab"
slug: "diptrace-gerber-export-manufacturing-pcb-fab"
author: "CADGuide Tools Editorial Team"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://pcbsync.com/technical-support/how-to-generate-gerber-files-from-diptrace/"
  - "https://www.pcbway.com/blog/PCB_Layout_Software/How_to_generate_Gerber_files_from_DipTrace.html"
---

# DipTrace Gerber Export and Manufacturing: Preparing Files for PCB Fab Houses

Getting clean Gerber files out of DipTrace is straightforward, but there are settings that trip up beginners. We've ordered 200+ boards from JLCPCB and PCBWay using DipTrace-generated Gerbers. Here's the exact process we use every time.

## Pre-Export Checklist

Before generating Gerber files, verify:

1. **DRC passes**: **Verification** → **Check Project for Errors** → zero errors.
2. **All nets routed**: No unrouted connections (ratsnest lines).
3. **Board outline is correct**: The board edge is on the correct layer and forms a closed shape.
4. **Silk screen is clean**: No text overlapping pads, all reference designators visible.
5. **Copper pours are up to date**: **Objects** → **Rebuild All Copper Pours**.
6. **Mounting holes are placed**: Non-plated holes in the correct positions.
7. **Component values are set**: For the BOM to be accurate.

## Gerber Export

### Step 1: Open the Export Dialog

1. **File** → **Export** → **Gerber**.
2. The Gerber export dialog appears.

### Step 2: Configure Layer Mapping

DipTrace maps design layers to Gerber file extensions. Verify the mapping:

| Gerber File | DipTrace Layer | Extension | Description |
|-------------|---------------|-----------|-------------|
| Top Copper | Signal Top | .GTL | Top traces and pads |
| Bottom Copper | Signal Bottom | .GBL | Bottom traces and pads |
| Inner 1 (if 4-layer) | Signal Inner 1 | .G1L | Inner copper 1 |
| Inner 2 (if 4-layer) | Signal Inner 2 | .G2L | Inner copper 2 |
| Top Solder Mask | Solder Mask Top | .GTS | Top mask |
| Bottom Solder Mask | Solder Mask Bottom | .GBS | Bottom mask |
| Top Silk | Silk Top | .GTO | Top silkscreen |
| Bottom Silk | Silk Bottom | .GBO | Bottom silkscreen |
| Top Paste | Paste Mask Top | .GTP | Top solder paste stencil |
| Bottom Paste | Paste Mask Bottom | .GBP | Bottom solder paste stencil |
| Board Outline | Board | .GKO | Board edge |

3. Check the layers you need. For a standard 2-layer board, you need:
   - Top Copper (.GTL)
   - Bottom Copper (.GBL)
   - Top Solder Mask (.GTS)
   - Bottom Solder Mask (.GBS)
   - Top Silk (.GTO)
   - Bottom Silk (.GBO)
   - Board Outline (.GKO)

4. Uncheck layers you don't need (e.g., paste mask if you're not using stencil printing).

### Step 3: Set Gerber Format

1. **Format**: RS-274X (extended Gerber) — standard for all manufacturers.
2. **Units**: Metric (mm) — most manufacturers prefer metric.
3. **Precision**: 4:3 (0.001mm resolution) — standard.
4. **Coordinate origin**: Absolute (from board origin).

### Step 4: Export

1. Click **Export All**.
2. Select a destination folder.
3. DipTrace generates all selected Gerber files in the folder.

## Drill File Export

1. **File** → **Export** → **N/C Drill**.
2. Configure:
   - **Format**: Excellon (standard)
   - **Units**: Metric (mm) — match Gerber units
   - **Coordinate origin**: Same as Gerber (board origin)
   - **Separate plated/non-plated**: Check (some manufacturers want separate files)
   - **Optimize drill path**: Check (reduces drilling time)

3. Click **Export**.
4. The drill file (.TXT or .DRL) is generated.

## Pick-and-Place Export

1. **File** → **Export** → **Pick and Place**.
2. Configure:
   - **Format**: CSV
   - **Include**: Reference, Value, X position, Y position, Rotation, Layer (Top/Bottom)
   - **Units**: Metric (mm)
   - **Origin**: Board origin (must match Gerber and drill origin)

3. Click **Export**.
4. The pick-and-place file is used by the PCB assembler.

## BOM Export

1. **File** → **Export** → **BOM**.
2. Configure:
   - **Format**: CSV or HTML
   - **Group by**: Value + Pattern (consolidates identical parts)
   - **Include**: Reference, Value, Quantity, Pattern/Package, Manufacturer, Part Number

3. Click **Export**.

## Verification Before Ordering

### Step 1: Visual Gerber Check

1. Open all Gerber files in a viewer:
   - **Gerbv** (free, open source)
   - **KiCad GerberViewer** (free)
   - **Online**: gerber-viewer.com or JLCPCB's online viewer

2. Load files in this order: Board outline → Top copper → Bottom copper → Solder mask → Silk → Drill.

3. Verify:
   - [ ] Board outline matches your design
   - [ ] All copper traces are present and in correct positions
   - [ ] Pads have correct sizes and shapes
   - [ ] Solder mask covers the board except on pads
   - [ ] Silk screen text is readable and doesn't overlap pads
   - [ ] Drill holes are in the correct positions and sizes
   - [ ] No copper extends beyond the board outline

### Step 2: Compare with DipTrace

Open your DipTrace board layout side by side with the Gerber viewer. Compare:
- Component positions
- Trace routing
- Via positions
- Board outline dimensions

Any discrepancy indicates a layer mapping error in the Gerber export.

### Step 3: Check Manufacturer Requirements

Each manufacturer has specific requirements:

**JLCPCB:**
- Upload a .zip file containing all Gerber + drill files
- Max file size: 50MB
- Supported format: RS-274X
- Drill format: Excellon

**PCBWay:**
- Upload individual files or .zip
- Same format requirements as JLCPCB

**OSH Park:**
- Upload .zip file
- Prefers extended Gerber (RS-274X)
- Drill: Excellon or Sieb & Meyer

### Step 4: Order

1. Upload the Gerber files to the manufacturer's website.
2. The manufacturer's automated system checks the files:
   - Board dimensions
   - Layer count
   - Minimum trace width and clearance
   - Drill sizes
3. If the check passes, select your options:
   - **Quantity**: 5-10 for prototypes
   - **Thickness**: 1.6mm (standard) or 0.8mm/2.0mm
   - **Copper weight**: 1oz (35µm) standard, 2oz for power boards
   - **Surface finish**: HASL (cheap), ENIG (gold, better for fine pitch), OSP (organic, cheapest)
   - **Solder mask color**: Green (standard), black, blue, red, white, purple
   - **Silk screen color**: White (standard on green/blue/black mask), black (on white mask)

4. Review the preview image the manufacturer generates from your Gerbers.
5. If the preview looks correct, place the order.

## Common Export Issues

**Copper pour missing in Gerber**: The pour wasn't rebuilt before export. In DipTrace: **Objects** → **Rebuild All Copper Pours** → re-export.

**Drill file has wrong coordinates**: The drill file origin doesn't match the Gerber origin. In the drill export dialog, set the origin to match the Gerber export origin (board origin).

**Silk screen missing**: The silk layer wasn't checked in the Gerber export dialog. Re-open the dialog and check the silk layers.

**Board outline missing**: The board outline is on the wrong layer. In DipTrace, the board outline must be on the **Board** layer, not on a copper or silk layer.

**Manufacturer reports "no drill file"**: The drill file extension isn't recognized. Some manufacturers expect .DRL, others .TXT. Check the manufacturer's requirements and rename the file if needed.
