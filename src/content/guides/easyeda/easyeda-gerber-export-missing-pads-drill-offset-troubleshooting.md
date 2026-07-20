---
title: "EasyEDA Gerber Export: Fixing Missing Pads, Drill Offsets, and Export Failures"
excerpt: "How to troubleshoot EasyEDA Gerber export problems — covering missing pads from solid region overlaps, drill file coordinate offsets, canvas origin errors, flying wire detection, and ensuring manufacturing-ready output."
category: "troubleshooting"
softwareSlug: "easyeda"
keyword: "easyeda gerber export missing pads drill offset export failed troubleshooting"
slug: "easyeda-gerber-export-missing-pads-drill-offset-troubleshooting"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-09"
sources:
  - "https://prodocs.easyeda.com/en/pcb/export-pcb-fabrication-file-gerber/"
  - "https://easyeda.com/forum/topic/Missing-pads-in-exported-gerber-file-79ac07b028334fcdb7fc8fa12fc16c15"
---

# EasyEDA Gerber Export: Fixing Missing Pads, Drill Offsets, and Export Failures

Gerber export is the last step before manufacturing — and the step where problems are most costly. A bad Gerber file means a bad board. I've ordered boards with missing pads because I didn't verify the Gerber output. That was an expensive lesson. Here's how to catch and fix Gerber export problems in EasyEDA before they become manufacturing disasters.

## Problem 1: Missing Pads in Exported Gerber

This is the most serious Gerber export issue in EasyEDA. Pads that appear correctly in the PCB editor are missing from the exported Gerber file.

### Cause

The issue occurs when **solid regions (copper pours) overlap with pads**. The Gerber exporter interprets the pad as being fully enclosed by the solid region and elides it as "redundant." The pad doesn't appear in the Gerber output.

### Symptoms

- Pads are visible in the EasyEDA PCB editor
- Pads are missing when viewing the Gerber file
- The issue affects specific components, not all components
- Components with copper pours underneath are affected

### Fix

1. **Identify affected components**: Compare the PCB editor view with the Gerber viewer. Note which pads are missing.
2. **Remove overlapping solid regions**: For each affected component:
   - Select the solid region (copper pour) under the component
   - Delete it or reshape it so it doesn't overlap the pad
   - Replace the copper pour with individual traces to maintain connectivity
3. **Alternative fix**: Split the solid region into two non-self-intersecting pieces that combine to make the desired shape but don't fully enclose the pad.
4. **Re-export the Gerber** and verify all pads are present.

### Prevention

- **Don't place solid regions directly under component pads** — route traces instead
- **If copper pour is needed under a component**, leave gaps around pads
- **Always verify Gerbers with a viewer** — don't trust the PCB editor view alone
- **Use Gerbv (free)** for local verification — more reliable than online viewers

### Verification with Gerbv

1. Download the Gerber ZIP file from EasyEDA.
2. Download and install **Gerbv** (open-source Gerber viewer).
3. Open all Gerber files in Gerbv.
4. Check each layer:
   - **Copper layers**: Verify all pads are present
   - **Drill file**: Verify drill holes align with pads
   - **Silkscreen**: Verify text is readable
   - **Solder mask**: Verify openings match pads
5. Zoom in on components with copper pours underneath — this is where missing pads occur.

## Problem 2: Drill File Coordinate Offset

Drill holes appear offset from pads when viewing the Gerber in CAM350 or other viewers.

### Cause

The drill file coordinate format doesn't match the Gerber coordinate format. EasyEDA defaults to 3:5 (mm) or 2:6 (inch) for drill files. Some viewers expect 3:3 (mm) or 2:4 (inch).

### Fix

1. In the Gerber viewer (CAM350, ViewMate, Gerbv):
   - Change the drill coordinate format to match the Gerber format
   - Try 3:3 (mm) or 2:4 (inch) if the default doesn't align
2. In EasyEDA Pro, use **Custom Configuration** when exporting:
   - Set the drill coordinate format explicitly
   - Default: 3:5 for mm, 2:6 for inch
   - Alternative: 3:3 for mm, 2:4 for inch
3. Re-export with the correct format.

### Prevention

- **Use EasyEDA's Gerber Viewer first** — it uses the correct format by default
- **If using an external viewer**, set the coordinate format to match EasyEDA's output
- **Verify drill alignment** before ordering — misaligned drills ruin the board

## Problem 3: "Export Failed — Integer 4, Decimal 5 Is Too Small"

### Cause

The canvas origin has shifted far from the PCB, or graphic elements exist far from the design area. The coordinate precision is insufficient to represent the distant coordinates.

### Fix 1: Reset Canvas Origin

1. Find the **Canvas Origin** tool in the top menu bar.
2. Select **By Cursor**.
3. Click the lower-left corner of your PCB.
4. Save the file.
5. Re-export the Gerber.

### Fix 2: Find and Remove Off-Canvas Elements

1. Open the **Object** panel on the left side.
2. This panel lists all elements on the canvas.
3. Click each element one by one — the view jumps to that element.
4. If an element jumps to a position far from the PCB, it's the problem.
5. Delete the off-canvas element.
6. Save and re-export.

### Prevention

- **Don't drag elements far from the origin** — keep all elements near the canvas center
- **Check the Object panel periodically** — remove stray elements
- **Reset the canvas origin** if you notice the design is far from the origin

## Problem 4: Flying Wires (Unrouted Connections)

### Cause

Flying wires are connections that exist in the schematic but aren't routed on the PCB. EasyEDA detects these during Gerber export and warns the user.

### Fix

1. When the flying wire warning appears, click **Yes** to check.
2. EasyEDA locates the first flying wire and shows it in the flying wire tree.
3. Route the missing connection:
   - Click on the highlighted pad
   - Route a trace to the connected pad
4. Continue checking until all flying wires are resolved.
5. Re-export the Gerber.

### Disabling Flying Wire Detection

If you intentionally have unrouted connections (e.g., for manual wiring):

1. Go to **System Settings** → **PCB**.
2. Disable **Auto-detect flying leads on Gerber export**.
3. The Gerber will export without the warning.
4. **Not recommended** — flying wires cause board failure.

### Prevention

- **Run DRC before exporting** — DRC catches unrouted nets
- **Check the Design Manager** — shows DRC errors including unrouted nets
- **Don't disable flying wire detection** — it's a safety check

## Problem 5: Cannot Download Gerber File

The Gerber generates but can't be downloaded — the save dialog only shows "All Files (*.*)" instead of a ZIP.

### Cause

Browser download settings or third-party download extensions interfering with EasyEDA's download mechanism.

### Fix

1. **Use the browser's built-in download** — don't use third-party download managers (IDM, FDM, etc.)
2. **Disable download extensions** — they can intercept and break EasyEDA's download
3. **Try a different browser** — Chrome or Firefox work best with EasyEDA
4. **Check browser auto-download settings** — enable "Ask where to save each file" or disable it
5. **Generate the Gerber, then rename** — export the file, then rename it to .zip manually

### Prevention

- **Use Chrome or Firefox** — most compatible with EasyEDA
- **Disable download extensions** when using EasyEDA
- **Don't use third-party download managers** — they break EasyEDA's download flow

## Problem 6: Solder Paste Layer Issues

### Problem

The solder paste layer (for stencil manufacturing) includes unwanted areas.

### Fix

**Method 1: Per-pad setting**
1. Select the pad in the PCB editor.
2. Set **Solder Mask Expansion** to **Custom**.
3. Set the value to **-1000** (negative value shrinks the paste opening to zero).
4. This removes the solder paste for that specific pad.

**Method 2: Gerber export setting**
1. When exporting Gerber, select **Custom Configuration**.
2. **Uncheck the paste mask layer** — this excludes the entire paste layer from the export.
3. Note: This removes ALL paste mask data, not just specific pads.

### When to Use Each Method

- **Method 1**: When you want to remove paste from specific pads (e.g., test pads, vias)
- **Method 2**: When you don't need a stencil (e.g., hand-soldering only)

## Problem 7: NPTH Slots Not in Drill File

### Cause

EasyEDA handles slots differently based on diameter:
- **Circular slots ≤ 6.5mm**: Output to NPTH drill file
- **Circular slots > 6.5mm and other slot shapes**: Output to board outline (GKO) file

### Fix

1. If slots are missing from the drill file, check the GKO (board outline) file — they may be there.
2. For non-circular slots, use the board outline layer.
3. Verify with the Gerber viewer that slots appear in the correct layer.

## Best Practices

- **Always verify Gerbers with Gerbv before ordering** — don't trust the PCB editor view alone
- **Check for missing pads under copper pours** — the most common and most damaging issue
- **Run DRC before exporting** — catches unrouted nets and clearance violations
- **Don't disable flying wire detection** — it prevents manufacturing bad boards
- **Use Chrome or Firefox** — most compatible with EasyEDA's download mechanism
- **Reset canvas origin if export fails** — off-canvas elements cause precision errors
- **Verify drill alignment** — misaligned drills are the second most common manufacturing defect
- **Order a small batch first** — 5 boards to verify before ordering 100+
- **Keep solid regions away from pads** — prevents the missing pad Gerber bug
