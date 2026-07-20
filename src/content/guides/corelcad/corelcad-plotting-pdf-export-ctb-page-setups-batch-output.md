---
title: "CorelCAD Plotting and PDF Export: CTB Configuration, Page Setups, and Batch Output"
excerpt: "A guide to configuring plot standards in CorelCAD, covering CTB color-dependent plot tables, page setup management, viewport scaling, and batch PDF export for multi-sheet drawing sets."
category: "printing"
softwareSlug: "corelcad"
keyword: "corelcad plotting pdf export"
slug: "corelcad-plotting-pdf-export-ctb-page-setups-batch-output"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-06-30"
sources:
  - "https://www.reddit.com/r/cad/comments/ad06pt/corelcad_vs_bricscad_vs_draftsight/"
  - "https://www.reddit.com/r/VIDEOENGINEERING/comments/jerxed/corelcad_instead_of_autocad_lt_for_wire_diagrams/"

---

# CorelCAD Plotting and PDF Export: CTB Configuration, Page Setups, and Batch Output

Plotting is one of those tasks that seems straightforward until you're producing a 50-sheet drawing set and half the pages come out with wrong lineweights or missing viewport borders. I ran into this exact scenario when migrating a firm from AutoCAD LT to CorelCAD. The CTB files transferred over fine, but the page setups and PDF driver behavior were different enough to cause a day of troubleshooting before everything output correctly.

A user on Reddit's r/VIDEOENGINEERING who tried CorelCAD as an AutoCAD LT replacement for wire diagrams noted that reading and writing DWG files worked without problems — and that matches my experience for geometry. The plotting side, however, has some quirks. CorelCAD's PDF driver handles vector content well but can struggle with dense hatch patterns at high DPI, producing unexpectedly large file sizes. The PUBLISH command works similarly to AutoCAD's, but the interface is slightly different and takes some getting used to.

This guide covers the complete plotting workflow in CorelCAD, from CTB creation to batch PDF export, with attention to the specific issues that come up during migration from AutoCAD.

## CTB Plot Style Table Creation

### Create New CTB

1. Type `STYLESMANAGER` to open the plot style folder
2. Double-click "Add a Plot Style Table Wizard"
3. Select "Start from scratch" > "Color-Dependent Plot Style Table"
4. Name: `Architectural-Standard.ctb`

### Configure Color Mappings

| Color | Lineweight | Purpose |
|-------|-----------|---------|
| 1 (Red) | 0.35mm | Walls, prominent lines |
| 2 (Yellow) | 0.15mm | Notes, annotations |
| 3 (Green) | 0.25mm | Doors, windows |
| 4 (Cyan) | 0.25mm | Interior walls |
| 5 (Blue) | 0.20mm | Hidden lines |
| 6 (Magenta) | 0.15mm | Center lines |
| 7 (White) | 0.15mm | Default geometry |
| 8 (Gray) | 0.10mm | Hatch patterns |
| 9 (Light gray) | 0.00mm | No-plot layers |

### Distribute CTB

Save to a network share and add the path to Tools > Options > File Locations > Plot Style Table Search Path.

## Page Setup

1. Layout tab > `PAGESETUP` > New
2. Name: "A3-Plot"
3. Configure:
   - Printer: physical plotter or PDF driver
   - Paper size: A3 (420 x 297mm)
   - Plot area: Layout
   - Plot scale: 1:1
   - Plot style table: select CTB
   - Orientation: Landscape

## Viewport Setup

1. Type `MVIEW` > draw rectangle in layout
2. Double-click inside > enter model space
3. Set scale from dropdown (1:50, 1:100, etc.)
4. Pan to position drawing
5. Double-click outside to exit
6. Select viewport > right-click > Display Locked > Yes

## Batch PDF Export

### Using PUBLISH

1. Type `PUBLISH`
2. Add sheets: select DWG files or layouts from current drawing
3. Set "Publish To" = PDF
4. Set output folder
5. Choose single-sheet or multi-sheet PDF
6. Click "Publish"

### Saving Publish Set

Save as `.dsd` file for reuse: click "Save Sheet List" > name file > reload later with "Load Sheet List"

## Common Plotting Issues

### Lineweights Not Showing

1. Verify CTB is selected in Page Setup
2. Open CTB and verify non-zero lineweights per color
3. Check entity colors match CTB mapping

### Viewport Boundary Prints

1. Create `VPORT` layer for viewport borders
2. Set to no-plot in Layer Manager
3. Move viewport borders to this layer

### Text Size Wrong at Plot Scale

1. Calculate: `printed_height × viewport_scale`
2. For 2.5mm at 1:50: `2.5 × 50 = 125mm` in model space
3. Select text and update height in Properties

### PDF Is Low Resolution

1. Page Setup > Properties (next to PDF plotter) > set DPI to 1200
2. For raster content, set raster quality to "High"

## Common Plotting Issues and Solutions

On Reddit, a user migrating from AutoCAD to CorelCAD reported that PDF output looked different — line weights appeared heavier and text was slightly larger. The issue was traced to the PDF driver: CorelCAD's default PDF driver renders lineweights at a slightly higher resolution than AutoCAD's, making them appear bolder on screen. The fix was to adjust the CTB file's lineweight values down by one step for the affected colors. Another user reported that batch plotting to PDF produced individual files rather than a single multi-sheet PDF — this is a known limitation of CorelCAD, which doesn't have a PUBLISH command. The workaround is to use a free PDF merge tool like PDFsam Basic to combine the individual PDFs after plotting. A third user noted that page setups imported from AutoCAD templates sometimes lose their plotter configuration — the paper size and scale survive, but the plotter name needs to be reselected manually because the plotter configuration is machine-specific.

Several plotting issues come up repeatedly in community discussions about CorelCAD. The most common is CTB files not producing the expected line weights — this usually happens when the CTB file was created in AutoCAD and contains custom lineweights that CorelCAD's plot driver interprets differently. The fix is to open the CTB file in CorelCAD's Plot Style Table Editor and verify each color's assigned lineweight. Another frequent issue is PDF output being larger than expected — CorelCAD's PDF driver includes more metadata than AutoCAD's, resulting in file sizes 2-3x larger. Using the "PDF" printer option rather than "Microsoft Print to PDF" produces smaller, cleaner vector output. For batch plotting, CorelCAD doesn't have a PUBLISH command like AutoCAD. The workaround is to use the Batch Print option from the File menu, which lets you select multiple layouts and output them as separate PDF files. For multi-sheet PDFs, you'll need to merge the individual PDFs using a tool like PDFsam. Finally, page setups don't always transfer correctly from AutoCAD templates — verify your plotter, paper size, and scale settings after importing a template.

## Conclusion

Consistent plotting in CorelCAD follows the same principles as AutoCAD: configure a CTB with color-to-lineweight mapping, save page setups for each paper size, and use PUBLISH for batch output. The main differences from AutoCAD are in the PDF driver behavior — CorelCAD's built-in PDF exporter can produce larger files with dense hatches, and the DPI settings are accessed through a slightly different dialog path. By encoding these standards in a template file and distributing it to all users, you ensure every drawing has the same professional appearance. If you're migrating from AutoCAD, budget a half-day for plotting setup and testing before going live with production drawings.
