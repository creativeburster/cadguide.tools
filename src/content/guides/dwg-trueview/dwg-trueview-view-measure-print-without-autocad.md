---
title: "DWG TrueView: Viewing, Measuring, and Printing DWG Files Without AutoCAD"
excerpt: "How to use Autodesk DWG TrueView to open, measure, and plot DWG files for free — covering layer control, view manipulation, measurement tools, and batch plotting."
category: "workflow"
softwareSlug: "dwg-trueview"
keyword: "dwg trueview view measure print dwg without autocad"
slug: "dwg-trueview-view-measure-print-without-autocad"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.autodesk.com/products/dwg-trueview/overview"
  - "https://www.autodesk.com/viewers"
---

# DWG TrueView: Viewing, Measuring, and Printing DWG Files Without AutoCAD

DWG TrueView is Autodesk's free DWG viewer. It's essentially AutoCAD without editing capabilities. We use it daily to review drawings from clients and contractors without needing an AutoCAD license. Here's how to get the most out of it.

## Installation and Setup

1. Download from **autodesk.com/viewers/dwg-trueview** (free).
2. Run the installer — it's a large download (~700MB) because it includes the AutoCAD engine.
3. Launch DWG TrueView.
4. The interface looks like AutoCAD:
   - **Ribbon** (top): File, View, Output tabs
   - **Drawing area** (center): The DWG display
   - **Layer panel** (left): Layer list and controls
   - **Command line** (bottom): Accepts AutoCAD commands (viewing only)

## Opening DWG Files

1. **File** → **Open** → select a .dwg file.
2. DWG TrueView supports all DWG versions (R14 through 2026).
3. For files from newer AutoCAD versions, TrueView prompts to convert if needed.
4. The drawing opens in the last saved view.

### Batch Conversion

1. **File** → **DWG Convert**.
2. Add multiple DWG files to the conversion list.
3. Set output version (e.g., convert 2026 DWG to 2018 format).
4. Set output folder.
5. Click **Convert** — all files are converted in batch.

This is useful when you receive DWG files in a newer format and need to share them with someone using older software.

## Navigation

### View Controls

- **Zoom Extents**: Double-click the mouse wheel — shows the entire drawing.
- **Zoom Window**: Click the mouse wheel → drag to select an area.
- **Pan**: Press and hold the mouse wheel → drag.
- **Orbit** (for 3D DWGs): Shift + mouse wheel → drag.

### Named Views

1. **View** → **Named Views**.
2. The drawing may contain saved views (set by the original author).
3. Select a named view to jump to that location.
4. Create your own named views:
   - Zoom to the desired area.
   - **View** → **Named Views** → **New** → name it.
   - The view is saved with the drawing (if you have write access).

### ViewCube (3D Models)

For 3D DWG files:
- The ViewCube appears in the top-right corner.
- Click faces of the cube to switch to standard views (front, top, right, etc.).
- Click corners for isometric views.

## Layer Control

1. **View** → **Layer Properties** (or the layer panel on the left).
2. The layer list shows all layers in the drawing:
   - **On/Off**: Toggle layer visibility
   - **Freeze/Thaw**: Freeze layers (faster than off for large drawings)
   - **Lock/Unlock**: Prevent selection of objects on a layer
   - **Color**: Display layer color
   - **Linetype**: Display layer linetype
   - **Lineweight**: Display layer line weight

3. Common layer tasks:
   - Turn off dimensions to see the geometry clearly
   - Freeze hatch patterns to speed up display
   - Turn on only the layers you need to review

## Measurement Tools

DWG TrueView includes full measurement capabilities:

### Distance Measurement

1. **View** → **Measure** → **Distance**.
2. Click two points in the drawing.
3. The distance displays in the command line and a tooltip:
   - **Distance**: Direct distance between points
   - **Angle**: Angle from the first point to the second
   - **Delta X, Delta Y, Delta Z**: Component distances

### Area Measurement

1. **View** → **Measure** → **Area**.
2. Click points to define a polygon.
3. Press Enter to close the polygon.
4. The area and perimeter display.

### Radius Measurement

1. **View** → **Measure** → **Radius**.
2. Click on an arc or circle.
3. The radius and diameter display.

### Angle Measurement

1. **View** → **Measure** → **Angle**.
2. Click two lines or two points.
3. The angle between them displays.

### Quick Measure

1. **View** → **Measure** → **Quick**.
2. Hover over objects — TrueView displays dimensions dynamically:
   - Distance to nearby objects
   - Angle between lines
   - Radius of arcs

This is the fastest way to check dimensions without clicking.

## Printing and Plotting

### Single Drawing Plot

1. **Output** → **Plot**.
2. Set:
   - **Printer/Plotter**: Select a physical printer or PDF writer
   - **Paper size**: A1, A2, A3, Letter, Tabloid, etc.
   - **Plot area**: 
     - **Window**: Select a specific area to plot
     - **Extents**: Plot the entire drawing
     - **Layout**: Plot the paper space layout
   - **Plot scale**: 
     - 1:1 (full size)
     - 1:100 (common for architectural plans)
     - Fit to paper (auto-scale to fit the page)
   - **Orientation**: Portrait or Landscape
   - **Plot style**: Monochrome (black and white) or color

3. Click **Preview** to see the output before plotting.
4. Click **OK** to plot.

### Batch Plotting

1. **Output** → **Batch Plot**.
2. Add multiple DWG files to the list.
3. Set plot settings for each file (or apply the same settings to all).
4. Click **Plot** — all files are plotted in sequence.
5. Output to PDF or physical printer.

This is useful for printing an entire project's worth of drawings at once.

### PDF Export

1. **Output** → **Plot** → select **DWG to PDF.pc3** as the printer.
2. Set paper size and scale.
3. Click **OK** → choose PDF file location.
4. The PDF is generated with vector geometry (not raster) — it's searchable and zoomable.

## Markup and Review

### Redline Markup

DWG TrueView includes basic markup tools (available in the Design Review integration):

1. **Review** → **Markups** (if Design Review is installed).
2. Add:
   - **Text notes**: Comments on the drawing
   - **Cloud marks**: Revision clouds around areas of concern
   - **Stamps**: "Reviewed", "Approved", "Rejected"
   - **Measurements**: Dimension annotations

3. Markups are saved in a separate DWF file (not the DWG), preserving the original drawing.

### Compare Drawings

1. **File** → **DWG Compare**.
2. Select two DWG files to compare.
3. TrueView displays the differences:
   - **Green**: Objects in the new file but not the old
   - **Red**: Objects in the old file but not the new
   - **White/gray**: Unchanged objects

4. This is invaluable for reviewing drawing revisions — you can see exactly what changed.

## Tips for Large Drawings

1. **Freeze unnecessary layers**: Large drawings with many layers can be slow. Freeze layers you don't need to review.

2. **Use partial open**: **File** → **Partial Open** → select only the layers you need. This loads only the specified layers, reducing memory usage.

3. **Turn off smooth curves**: **Tools** → **Options** → **Display** → uncheck "Smooth curve display." This improves performance on large drawings.

4. **Use the command line**: Even though TrueView is a viewer, it accepts AutoCAD commands. Type `ZOOM`, `PAN`, `LAYER`, etc. in the command line for faster navigation.

5. **Close other applications**: DWG TrueView uses significant memory. Close other applications when working with large DWG files.
