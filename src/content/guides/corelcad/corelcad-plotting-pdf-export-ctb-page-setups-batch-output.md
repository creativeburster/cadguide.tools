---
title: "CorelCAD Plotting and PDF Export: CTB Configuration, Page Setups, and Batch Output"
excerpt: "A guide to configuring plot standards in CorelCAD, covering CTB color-dependent plot tables, page setup management, viewport scaling, and batch PDF export for multi-sheet drawing sets."
category: "printing"
softwareSlug: "corelcad"
keyword: "corelcad plotting pdf export"
slug: "corelcad-plotting-pdf-export-ctb-page-setups-batch-output"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-06-30"
sources:
  - "https://www.coreldraw.com/en/pages/corelcad/help/plotting/"
  - "https://www.coreldraw.com/en/pages/corelcad/"
---

# CorelCAD Plotting and PDF Export: CTB Configuration, Page Setups, and Batch Output

Consistent plotting output requires a well-configured CTB plot style table, standardized page setups, and properly scaled viewports. This guide covers the complete plotting workflow in CorelCAD.

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

## Conclusion

Consistent plotting in CorelCAD follows the same principles as AutoCAD: configure a CTB with color-to-lineweight mapping, save page setups for each paper size, and use PUBLISH for batch output. By encoding these standards in a template file and distributing it to all users, you ensure every drawing has the same professional appearance.
